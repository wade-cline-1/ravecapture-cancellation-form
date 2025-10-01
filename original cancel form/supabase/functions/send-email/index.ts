const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

// Postmark API configuration
const POSTMARK_SERVER_TOKEN = Deno.env.get('POSTMARK_SERVER_TOKEN');
const POSTMARK_API_URL = 'https://api.postmarkapp.com/email';

if (!POSTMARK_SERVER_TOKEN) {
  throw new Error('POSTMARK_SERVER_TOKEN environment variable is required');
}

const sendPostmarkEmail = async (emailData: any) => {
  const response = await fetch(POSTMARK_API_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Postmark-Server-Token': POSTMARK_SERVER_TOKEN
    },
    body: JSON.stringify(emailData)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Postmark API error: ${response.status} - ${error}`);
  }

  return await response.json();
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
      headers: corsHeaders
    });
  }

  try {
    const { emailType, data } = await req.json();

    if (!emailType || !data) {
      return new Response(JSON.stringify({
        error: 'Missing emailType or data'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    let response;

    switch (emailType) {
      case 'cancellation_confirmation':
        response = await sendCancellationConfirmationEmail(data);
        break;
      case 'cancellation_notification':
        response = await sendCancellationNotificationEmail(data);
        break;
      case 'poor_experience_followup':
        response = await sendPoorExperienceFollowUpEmail(data);
        break;
      case 'retention_confirmation':
        response = await sendRetentionConfirmationEmail(data.owner_email);
        break;
      case 'retention_acceptance':
        response = await sendRetentionAcceptanceEmail(data);
        break;
      case 'optimization_request':
        response = await sendOptimizationRequestEmail(data);
        break;
      case 'technical_issue':
        response = await sendTechnicalIssueEmails(data);
        break;
      case 'retail_syndication':
        response = await sendRetailSyndicationEmail(data);
        break;
      default:
        return new Response(JSON.stringify({
          error: 'Invalid email type'
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
    }

    return new Response(JSON.stringify({
      success: true,
      response
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });

  } catch (error) {
    console.error('Email service error:', error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
});

async function sendCancellationConfirmationEmail(data: any) {
  return await sendPostmarkEmail({
    From: 'admin@ravecapture.com',
    To: data.owner_email,
    Subject: 'Your RaveCapture Account Cancellation',
    ReplyTo: 'support@ravecapture.com',
    HtmlBody: `
      <h2>Your RaveCapture Account Has Been Cancelled</h2>
      <p>We're sorry to see you go. As requested, we've processed your cancellation.</p>
      
      <h3>What Happens Next:</h3>
      <ul>
        <li>Your subscription will remain active until the end of your current billing period</li>
        <li>You'll continue to have access to all features until then</li>
        <li>No further charges will be made to your account</li>
      </ul>
      
      <h3>Before You Go:</h3>
      <ul>
        <li>
          <strong>Export Your Data:</strong> Don't forget to export your reviews and important data
          <br>
          <a href="https://app.ravecapture.com/account_settings/export" style="color: #2563eb;">Go to Export Page</a>
        </li>
        <li>
          <strong>Remove Integration Code:</strong> Remember to remove any RaveCapture code from your site to prevent conflicts
        </li>
        <li>
          <strong>Free Plan:</strong> Your account will automatically move to our free plan, maintaining access to basic features
        </li>
      </ul>
      
      <h3>Need Help?</h3>
      <p>If you have any questions or need assistance during this transition, our support team is here to help.</p>
      
      <p>
        <a href="mailto:support@ravecapture.com" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin-top: 10px;">
          Contact Support
        </a>
      </p>
      
      <p style="margin-top: 20px;">
        Thank you for being a RaveCapture customer. We wish you the best in your future endeavors.
        <br><br>
        Best regards,<br>
        The RaveCapture Team
      </p>
    `
  });
}

async function sendCancellationNotificationEmail(data: any) {
  return await sendPostmarkEmail({
    From: 'admin@ravecapture.com',
    To: 'support@ravecapture.com',
    Subject: 'Account Cancellation Notification',
    ReplyTo: 'support@ravecapture.com',
    HtmlBody: `
      <h2>Account Cancellation Notification</h2>
      <p>A user has cancelled their RaveCapture account.</p>
      
      <h3>User Details:</h3>
      <p><strong>Email:</strong> ${data.owner_email}</p>
      
      <h3>Cancellation Reasons:</h3>
      <ul>
        ${data.reasons.map((reason: string) => `<li>${reason}</li>`).join('')}
      </ul>
      
      <h3>Additional Feedback:</h3>
      <p>${data.feedback || 'No additional feedback provided'}</p>
      
      ${data.technical_issue ? `
        <h3>Technical Issue:</h3>
        <p>${data.technical_issue}</p>
      ` : ''}
      
      <h3>Future Plans:</h3>
      <p><strong>Plan:</strong> ${data.future_plan || 'Not specified'}</p>
      ${data.competitor ? `<p><strong>Moving to:</strong> ${data.competitor}</p>` : ''}
      
      <p>Please review this information and take any necessary follow-up actions.</p>
    `
  });
}

async function sendPoorExperienceFollowUpEmail(data: any) {
  return await sendPostmarkEmail({
    From: 'admin@ravecapture.com',
    To: 'wade@ravecapture.com',
    Subject: 'Poor Experience Follow-up Request',
    ReplyTo: 'support@ravecapture.com',
    HtmlBody: `
      <h2>Poor Experience Follow-up Request</h2>
      <p>A user has requested a follow-up regarding their poor experience with RaveCapture.</p>
      
      <h3>User Details:</h3>
      <p><strong>Email:</strong> ${data.owner_email}</p>
      
      <h3>Cancellation Context:</h3>
      <p><strong>Reasons:</strong></p>
      <ul>
        ${data.reasons.map((reason: string) => `<li>${reason}</li>`).join('')}
      </ul>
      
      <p><strong>Additional Feedback:</strong></p>
      <p>${data.feedback || 'No additional feedback provided'}</p>
      
      ${data.technical_issue ? `
        <p><strong>Technical Issue:</strong></p>
        <p>${data.technical_issue}</p>
      ` : ''}
      
      <h3>Action Required:</h3>
      <p>Please follow up with the user within 24 hours to discuss their experience and address their concerns.</p>
      
      <p style="color: #DC2626; margin-top: 20px;">
        <strong>Priority:</strong> High - User reported poor experience
      </p>
    `
  });
}

async function sendRetentionConfirmationEmail(userEmail: string) {
  return await sendPostmarkEmail({
    From: 'admin@ravecapture.com',
    To: userEmail,
    Subject: 'Your RaveCapture Discount Has Been Confirmed',
    ReplyTo: 'support@ravecapture.com',
    HtmlBody: `
      <h2>Thank You for Staying with RaveCapture!</h2>
      <p>We're thrilled that you've decided to continue your journey with us. This email confirms that your 50% discount has been applied to your account.</p>
      
      <h3>What Happens Next:</h3>
      <ul>
        <li>Your 50% discount will be automatically applied to your next billing cycle</li>
        <li>This discount will remain active for the next 12 months</li>
        <li>You'll continue to have access to all your current features and benefits</li>
      </ul>
      
      <h3>Need Help?</h3>
      <p>If you have any questions about your discount or need assistance with anything else, our support team is here to help!</p>
      
      <p>
        <a href="mailto:support@ravecapture.com" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin-top: 10px;">
          Contact Support
        </a>
      </p>
      
      <p style="margin-top: 20px;">
        Best regards,<br>
        The RaveCapture Team
      </p>
    `
  });
}

async function sendRetentionAcceptanceEmail(data: any) {
  return await sendPostmarkEmail({
    From: 'admin@ravecapture.com',
    To: 'wade@ravecapture.com',
    Subject: 'Retention Offer Accepted',
    ReplyTo: 'support@ravecapture.com',
    HtmlBody: `
      <h2>Retention Offer Accepted</h2>
      <p>A user has accepted the 50% retention offer.</p>
      
      <h3>User Details:</h3>
      <p><strong>Email:</strong> ${data.owner_email}</p>
      
      <h3>Original Cancellation Context:</h3>
      <p><strong>Reasons:</strong></p>
      <ul>
        ${data.reasons.map((reason: string) => `<li>${reason}</li>`).join('')}
      </ul>
      
      <p><strong>Additional Feedback:</strong></p>
      <p>${data.feedback || 'No additional feedback provided'}</p>
      
      <h3>Offer Details:</h3>
      <ul>
        <li>Offer: 50% discount for 12 months</li>
        <li>Accepted at: ${new Date().toISOString()}</li>
      </ul>
      
      <p>Please ensure the discount is applied to their account.</p>
    `
  });
}

async function sendOptimizationRequestEmail(data: any) {
  return await sendPostmarkEmail({
    From: 'admin@ravecapture.com',
    To: 'wade@ravecapture.com',
    Subject: 'Review Optimization Consultation Request',
    ReplyTo: 'support@ravecapture.com',
    HtmlBody: `
      <h2>Review Optimization Consultation Request</h2>
      <p>A user has requested assistance with optimizing their review collection strategy.</p>
      
      <h3>User Details:</h3>
      <p><strong>Email:</strong> ${data.owner_email}</p>
      
      <h3>Cancellation Context:</h3>
      <p><strong>Reasons:</strong></p>
      <ul>
        ${data.reasons.map((reason: string) => `<li>${reason}</li>`).join('')}
      </ul>
      
      <p><strong>Additional Feedback:</strong></p>
      <p>${data.feedback || 'No additional feedback provided'}</p>
      
      <h3>Future Plans:</h3>
      <p><strong>Plan:</strong> ${data.future_plan || 'Not specified'}</p>
      ${data.competitor ? `<p><strong>Moving to:</strong> ${data.competitor}</p>` : ''}
      
      ${data.technical_issue ? `
        <p><strong>Technical Issue:</strong></p>
        <p>${data.technical_issue}</p>
      ` : ''}
      
      <p>Please follow up with the user within one business day to schedule their consultation.</p>
    `
  });
}

async function sendTechnicalIssueEmails(data: any) {
  // Email to support team
  const supportResponse = await sendPostmarkEmail({
    From: 'admin@ravecapture.com',
    To: 'support@ravecapture.com',
    Subject: 'Technical Issue Report',
    ReplyTo: 'support@ravecapture.com',
    HtmlBody: `
      <h2>Technical Issue Report</h2>
      <p>A user has reported a technical issue that requires immediate attention.</p>
      
      <h3>User Details:</h3>
      <p><strong>Email:</strong> ${data.owner_email}</p>
      
      <h3>Technical Issue Description:</h3>
      <p>${data.technical_issue}</p>
      
      <h3>Cancellation Context:</h3>
      <p><strong>Reasons:</strong></p>
      <ul>
        ${data.reasons.map((reason: string) => `<li>${reason}</li>`).join('')}
      </ul>
      
      <p><strong>Additional Feedback:</strong></p>
      <p>${data.feedback || 'No additional feedback provided'}</p>
      
      <h3>Future Plans:</h3>
      <p><strong>Plan:</strong> ${data.future_plan || 'Not specified'}</p>
      ${data.competitor ? `<p><strong>Moving to:</strong> ${data.competitor}</p>` : ''}
      
      <p>Please investigate this issue and follow up with the user as soon as possible.</p>
    `
  });

  // Email to user
  const userResponse = await sendPostmarkEmail({
    From: 'admin@ravecapture.com',
    To: data.owner_email,
    Subject: 'Technical Issue Report Received',
    ReplyTo: 'support@ravecapture.com',
    HtmlBody: `
      <h2>We've Received Your Technical Issue Report</h2>
      <p>Thank you for bringing this issue to our attention. Our technical team has been notified and will investigate your report promptly.</p>
      
      <h3>Issue Details:</h3>
      <p>${data.technical_issue}</p>
      
      <h3>What Happens Next:</h3>
      <ul>
        <li>Our support team will review your report within 1 business day</li>
        <li>You'll receive an email with follow-up questions or a solution</li>
        <li>We'll keep you updated on the progress</li>
      </ul>
      
      <p>If you need to provide additional information or have questions in the meantime, please reply to this email.</p>
      
      <p>Thank you for your patience while we work to resolve this issue.</p>
      
      <p>Best regards,<br>RaveCapture Support Team</p>
    `
  });

  return {
    supportResponse,
    userResponse
  };
}

async function sendRetailSyndicationEmail(data: any) {
  return await sendPostmarkEmail({
    From: 'admin@ravecapture.com',
    To: 'support@ravecapture.com',
    Subject: 'Retail Syndication Support Request',
    ReplyTo: 'support@ravecapture.com',
    HtmlBody: `
      <h2>Retail Syndication Support Request</h2>
      <p>A user has requested information about exporting reviews for retail partners.</p>
      
      <h3>User Details:</h3>
      <p><strong>Email:</strong> ${data.owner_email}</p>
      
      <h3>Cancellation Context:</h3>
      <p><strong>Reasons:</strong></p>
      <ul>
        ${data.reasons.map((reason: string) => `<li>${reason}</li>`).join('')}
      </ul>
      
      <p><strong>Additional Feedback:</strong></p>
      <p>${data.feedback || 'No additional feedback provided'}</p>
      
      <h3>Future Plans:</h3>
      <p><strong>Plan:</strong> ${data.future_plan || 'Not specified'}</p>
      ${data.competitor ? `<p><strong>Moving to:</strong> ${data.competitor}</p>` : ''}
      
      <p>Please contact the user to discuss review export options and retail partner integration possibilities.</p>
    `
  });
}