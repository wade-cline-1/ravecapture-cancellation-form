import { ServerClient } from 'postmark'

// Initialize Postmark client lazily
let client: ServerClient | null = null

function getPostmarkClient(): ServerClient {
  if (!client) {
    if (!process.env.POSTMARK_SERVER_TOKEN) {
      throw new Error('POSTMARK_SERVER_TOKEN environment variable is not set')
    }
    client = new ServerClient(process.env.POSTMARK_SERVER_TOKEN)
  }
  return client
}

export interface EmailTemplate {
  to: string
  subject: string
  htmlBody: string
  textBody?: string
}

export interface CancellationEmailData {
  userEmail: string
  userName?: string
  cancellationReasons: string[] | string // Support both array and JSON string
  specificIssues?: string
  additionalFeedback?: string
}

export interface RetentionEmailData {
  userEmail: string
  userName?: string
  discountAmount: number
  discountDuration: number
}

export interface EducationEmailData {
  userEmail: string
  userName?: string
  educationType: string
  calendlyUrl?: string
}

// Helper function to get reasons as array
const getReasonsArray = (reasons: string[] | string): string[] => {
  if (Array.isArray(reasons)) return reasons
  try {
    return JSON.parse(reasons)
  } catch {
    return [reasons]
  }
}

// Email templates
export const emailTemplates = {
  // User cancellation confirmation
  cancellationConfirmation: (data: CancellationEmailData) => {
    const reasons = getReasonsArray(data.cancellationReasons)
    return {
      to: data.userEmail,
      subject: 'Your RaveCapture account has been cancelled',
      htmlBody: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1f2937; font-size: 28px; margin: 0; font-weight: 600;">Account Cancelled</h1>
            <div style="width: 60px; height: 3px; background: linear-gradient(90deg, #3b82f6, #1d4ed8); margin: 15px auto;"></div>
          </div>
          
          <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">Hi ${data.userName || 'there'},</p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">We've processed your cancellation request. Your RaveCapture account has been successfully cancelled and will not renew.</p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">We're sorry to see you go and truly appreciate the time you spent with us.</p>
          </div>

          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 25px; border-radius: 0 6px 6px 0;">
            <p style="color: #92400e; font-size: 14px; margin: 0; font-weight: 500;">💡 <strong>Important:</strong> You can still access your account data until your current billing period ends.</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">If you have any questions or need assistance, please don't hesitate to reach out.</p>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
            <p style="color: #374151; font-size: 14px; margin: 0 0 10px 0;">Thank you for being a valued RaveCapture customer.</p>
            <p style="color: #6b7280; font-size: 14px; margin: 0;">Best regards,<br><strong>The RaveCapture Team</strong></p>
            <p style="color: #9ca3af; font-size: 12px; margin: 15px 0 0 0;">Reply to this email for support assistance</p>
          </div>
        </div>
      `,
      textBody: `Account Cancelled\n\nHi ${data.userName || 'there'},\n\nWe've processed your cancellation request. Your RaveCapture account has been successfully cancelled and will not renew.\n\nWe're sorry to see you go and truly appreciate the time you spent with us.\n\n💡 Important: You can still access your account data until your current billing period ends.\n\nIf you have any questions or need assistance, please don't hesitate to reach out.\n\nThank you for being a valued RaveCapture customer.\n\nBest regards,\nThe RaveCapture Team\n\nReply to this email for support assistance`
    }
  },

  // Internal notification
  cancellationNotification: (data: CancellationEmailData) => {
    const reasons = getReasonsArray(data.cancellationReasons)
    return {
      to: 'support@ravecapture.com',
      subject: `🚨 New Cancellation: ${data.userEmail}`,
      htmlBody: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #dc2626; font-size: 28px; margin: 0; font-weight: 600;">🚨 New Cancellation</h1>
            <div style="width: 60px; height: 3px; background: linear-gradient(90deg, #ef4444, #dc2626); margin: 15px auto;"></div>
          </div>
          
          <div style="background: #fef2f2; border-radius: 8px; padding: 20px; margin-bottom: 25px; border: 1px solid #fecaca;">
            <h3 style="color: #dc2626; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">Customer Information</h3>
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0;"><strong>Email:</strong> ${data.userEmail}</p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;"><strong>Cancellation Reasons:</strong> ${reasons.join(', ')}</p>
          </div>

          ${data.specificIssues ? `
          <div style="background: #fef3c7; border-radius: 8px; padding: 20px; margin-bottom: 25px; border: 1px solid #fde68a;">
            <h3 style="color: #92400e; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">Specific Issues</h3>
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">${data.specificIssues}</p>
          </div>
          ` : ''}

          ${data.additionalFeedback ? `
          <div style="background: #f0f9ff; border-radius: 8px; padding: 20px; margin-bottom: 25px; border: 1px solid #bae6fd;">
            <h3 style="color: #0c4a6e; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">Additional Feedback</h3>
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">${data.additionalFeedback}</p>
          </div>
          ` : ''}

          <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin-bottom: 25px; border-radius: 0 6px 6px 0;">
            <p style="color: #1e40af; font-size: 14px; margin: 0; font-weight: 500;">📞 <strong>Action Required:</strong> Please follow up with the user to understand their concerns better and explore retention opportunities.</p>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">This notification was automatically generated by the RaveCapture cancellation system.</p>
          </div>
        </div>
      `,
      textBody: `🚨 New Cancellation\n\nCustomer Information:\nEmail: ${data.userEmail}\nCancellation Reasons: ${reasons.join(', ')}\n\n${data.specificIssues ? `Specific Issues:\n${data.specificIssues}\n\n` : ''}${data.additionalFeedback ? `Additional Feedback:\n${data.additionalFeedback}\n\n` : ''}📞 Action Required: Please follow up with the user to understand their concerns better and explore retention opportunities.\n\nThis notification was automatically generated by the RaveCapture cancellation system.`
    }
  },

  // Retention offer confirmation
  retentionConfirmation: (data: RetentionEmailData) => ({
    to: data.userEmail,
    subject: '🎉 Welcome back! Your discount is now active',
    htmlBody: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #059669; font-size: 28px; margin: 0; font-weight: 600;">🎉 Welcome Back!</h1>
          <div style="width: 60px; height: 3px; background: linear-gradient(90deg, #10b981, #059669); margin: 15px auto;"></div>
        </div>
        
        <div style="background: linear-gradient(135deg, #ecfdf5, #d1fae5); border-radius: 12px; padding: 25px; margin-bottom: 25px; border: 1px solid #a7f3d0;">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="background: #059669; color: white; border-radius: 50%; width: 60px; height: 60px; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin-bottom: 15px;">${data.discountAmount}%</div>
            <h2 style="color: #047857; font-size: 20px; margin: 0; font-weight: 600;">Discount Applied!</h2>
          </div>
          <p style="color: #047857; font-size: 16px; line-height: 1.6; margin: 0; text-align: center; font-weight: 500;">Your ${data.discountAmount}% discount is now active for the next ${data.discountDuration} months</p>
        </div>

        <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">Hi ${data.userName || 'there'},</p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">We're absolutely thrilled that you've decided to stay with RaveCapture! Your trust means everything to us.</p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">We're committed to making your experience exceptional and will be in touch soon to ensure you're getting maximum value from our platform.</p>
        </div>

        <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin-bottom: 25px; border-radius: 0 6px 6px 0;">
          <p style="color: #1e40af; font-size: 14px; margin: 0; font-weight: 500;">🚀 <strong>What's Next:</strong> Our success team will reach out within 24 hours to help optimize your review collection strategy.</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">Thank you for your continued trust in RaveCapture. We're excited to help you succeed!</p>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <p style="color: #374151; font-size: 14px; margin: 0 0 10px 0;">Best regards,<br><strong>The RaveCapture Team</strong></p>
          <p style="color: #9ca3af; font-size: 12px; margin: 15px 0 0 0;">Reply to this email for support assistance</p>
        </div>
      </div>
    `,
    textBody: `🎉 Welcome Back!\n\nHi ${data.userName || 'there'},\n\nWe're absolutely thrilled that you've decided to stay with RaveCapture! Your trust means everything to us.\n\n✅ Your ${data.discountAmount}% discount is now active for the next ${data.discountDuration} months\n\nWe're committed to making your experience exceptional and will be in touch soon to ensure you're getting maximum value from our platform.\n\n🚀 What's Next: Our success team will reach out within 24 hours to help optimize your review collection strategy.\n\nThank you for your continued trust in RaveCapture. We're excited to help you succeed!\n\nBest regards,\nThe RaveCapture Team\n\nReply to this email for support assistance`
  }),

  // Retention acceptance notification (internal)
  retentionAcceptance: (data: CancellationEmailData) => {
    const reasons = getReasonsArray(data.cancellationReasons)
    return {
      to: 'support@ravecapture.com',
      subject: `🎉 Retention Success: ${data.userEmail}`,
      htmlBody: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #059669; font-size: 28px; margin: 0; font-weight: 600;">🎉 Retention Success!</h1>
            <div style="width: 60px; height: 3px; background: linear-gradient(90deg, #10b981, #059669); margin: 15px auto;"></div>
          </div>
          
          <div style="background: linear-gradient(135deg, #ecfdf5, #d1fae5); border-radius: 12px; padding: 25px; margin-bottom: 25px; border: 1px solid #a7f3d0;">
            <div style="text-align: center; margin-bottom: 20px;">
              <div style="background: #059669; color: white; border-radius: 50%; width: 60px; height: 60px; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin-bottom: 15px;">50%</div>
              <h2 style="color: #047857; font-size: 20px; margin: 0; font-weight: 600;">Customer Retained!</h2>
            </div>
            <p style="color: #047857; font-size: 16px; line-height: 1.6; margin: 0; text-align: center; font-weight: 500;">Customer accepted 50% discount offer for 12 months</p>
          </div>

          <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h3 style="color: #374151; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">Customer Information</h3>
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0;"><strong>Email:</strong> ${data.userEmail}</p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;"><strong>Original Cancellation Reasons:</strong> ${reasons.join(', ')}</p>
          </div>

          ${data.specificIssues ? `
          <div style="background: #fef3c7; border-radius: 8px; padding: 20px; margin-bottom: 25px; border: 1px solid #fde68a;">
            <h3 style="color: #92400e; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">Specific Issues Resolved</h3>
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">${data.specificIssues}</p>
          </div>
          ` : ''}

          ${data.additionalFeedback ? `
          <div style="background: #f0f9ff; border-radius: 8px; padding: 20px; margin-bottom: 25px; border: 1px solid #bae6fd;">
            <h3 style="color: #0c4a6e; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">Customer Feedback</h3>
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">${data.additionalFeedback}</p>
          </div>
          ` : ''}

          <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin-bottom: 25px; border-radius: 0 6px 6px 0;">
            <p style="color: #1e40af; font-size: 14px; margin: 0; font-weight: 500;">✅ <strong>Action Required:</strong> Apply 50% discount to their account for 12 months and follow up to ensure they're getting maximum value.</p>
          </div>

          <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; margin-bottom: 25px; border-radius: 0 6px 6px 0;">
            <p style="color: #166534; font-size: 14px; margin: 0; font-weight: 500;">🎯 <strong>Success Metrics:</strong> This retention saves the customer relationship and provides opportunity for upselling in the future.</p>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">This notification was automatically generated by the RaveCapture retention system.</p>
          </div>
        </div>
      `,
      textBody: `🎉 Retention Success!\n\nCustomer Information:\nEmail: ${data.userEmail}\nOriginal Cancellation Reasons: ${reasons.join(', ')}\n\n${data.specificIssues ? `Specific Issues Resolved:\n${data.specificIssues}\n\n` : ''}${data.additionalFeedback ? `Customer Feedback:\n${data.additionalFeedback}\n\n` : ''}✅ Action Required: Apply 50% discount to their account for 12 months and follow up to ensure they're getting maximum value.\n\n🎯 Success Metrics: This retention saves the customer relationship and provides opportunity for upselling in the future.\n\nThis notification was automatically generated by the RaveCapture retention system.`
    }
  },

  // Education follow-up emails
  reviewOptimizationFollowUp: (data: EducationEmailData) => ({
    to: data.userEmail,
    subject: '🚀 Let\'s boost your review collection - Free consultation',
    htmlBody: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1e40af; font-size: 28px; margin: 0; font-weight: 600;">🚀 Review Optimization</h1>
          <div style="width: 60px; height: 3px; background: linear-gradient(90deg, #3b82f6, #1e40af); margin: 15px auto;"></div>
        </div>
        
        <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">Hi ${data.userName || 'there'},</p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">We noticed you mentioned not getting enough reviews. This is one of the most common challenges businesses face, and we have proven strategies that can help you increase your review volume by 200-400%.</p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">I'd love to schedule a quick 15-minute call to discuss your specific situation and show you exactly how we can optimize your review collection process.</p>
        </div>

        <div style="background: linear-gradient(135deg, #eff6ff, #dbeafe); border-radius: 12px; padding: 25px; margin-bottom: 25px; border: 1px solid #93c5fd;">
          <h3 style="color: #1e40af; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">What we'll cover:</h3>
          <ul style="color: #1e40af; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">Review request timing optimization</li>
            <li style="margin-bottom: 8px;">Multi-channel review collection strategies</li>
            <li style="margin-bottom: 8px;">Automated follow-up sequences</li>
            <li style="margin-bottom: 8px;">Industry-specific best practices</li>
          </ul>
        </div>

        ${data.calendlyUrl ? `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.calendlyUrl}" style="background: linear-gradient(135deg, #3b82f6, #1e40af); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">📅 Schedule Your Free Consultation</a>
        </div>
        ` : ''}

        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 25px; border-radius: 0 6px 6px 0;">
          <p style="color: #92400e; font-size: 14px; margin: 0; font-weight: 500;">💡 <strong>No obligation:</strong> This is a completely free consultation with no strings attached. We just want to help you succeed.</p>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <p style="color: #374151; font-size: 14px; margin: 0 0 10px 0;">Looking forward to helping you boost your review collection!</p>
          <p style="color: #6b7280; font-size: 14px; margin: 0;">Best regards,<br><strong>The RaveCapture Team</strong></p>
          <p style="color: #9ca3af; font-size: 12px; margin: 15px 0 0 0;">Reply to this email for support assistance</p>
        </div>
      </div>
    `,
    textBody: `🚀 Review Optimization - Free Consultation\n\nHi ${data.userName || 'there'},\n\nWe noticed you mentioned not getting enough reviews. This is one of the most common challenges businesses face, and we have proven strategies that can help you increase your review volume by 200-400%.\n\nI'd love to schedule a quick 15-minute call to discuss your specific situation and show you exactly how we can optimize your review collection process.\n\nWhat we'll cover:\n• Review request timing optimization\n• Multi-channel review collection strategies\n• Automated follow-up sequences\n• Industry-specific best practices\n\n${data.calendlyUrl ? `Schedule Your Free Consultation: ${data.calendlyUrl}\n` : ''}\n💡 No obligation: This is a completely free consultation with no strings attached. We just want to help you succeed.\n\nLooking forward to helping you boost your review collection!\n\nBest regards,\nThe RaveCapture Team\n\nReply to this email for support assistance`
  }),

  // Poor experience follow-up
  poorExperienceFollowUp: (data: EducationEmailData) => ({
    to: data.userEmail,
    subject: 'We want to make this right - Let\'s talk',
    htmlBody: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; font-size: 28px; margin: 0; font-weight: 600;">We Want to Make This Right</h1>
          <div style="width: 60px; height: 3px; background: linear-gradient(90deg, #ef4444, #dc2626); margin: 15px auto;"></div>
        </div>
        
        <div style="background: #fef2f2; border-radius: 8px; padding: 20px; margin-bottom: 25px; border: 1px solid #fecaca;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">Hi ${data.userName || 'there'},</p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">We're truly sorry for your poor experience with RaveCapture. Every customer concern is important to us, and we want to understand what went wrong so we can make it right.</p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">I'd like to schedule a personal call with you to discuss your experience and work together to resolve any issues you've encountered.</p>
        </div>

        <div style="background: linear-gradient(135deg, #fef2f2, #fee2e2); border-radius: 12px; padding: 25px; margin-bottom: 25px; border: 1px solid #fecaca;">
          <h3 style="color: #dc2626; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">What we'll do:</h3>
          <ul style="color: #dc2626; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">Listen to your concerns and feedback</li>
            <li style="margin-bottom: 8px;">Identify specific issues and their root causes</li>
            <li style="margin-bottom: 8px;">Develop a plan to resolve any problems</li>
            <li style="margin-bottom: 8px;">Ensure you get the value you expected</li>
          </ul>
        </div>

        ${data.calendlyUrl ? `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.calendlyUrl}" style="background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);">📞 Schedule Experience Review</a>
        </div>
        ` : ''}

        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 25px; border-radius: 0 6px 6px 0;">
          <p style="color: #92400e; font-size: 14px; margin: 0; font-weight: 500;">🤝 <strong>Our commitment:</strong> We're dedicated to ensuring your success with RaveCapture and will work with you until you're completely satisfied.</p>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <p style="color: #374151; font-size: 14px; margin: 0 0 10px 0;">Thank you for giving us the opportunity to make this right.</p>
          <p style="color: #6b7280; font-size: 14px; margin: 0;">Best regards,<br><strong>The RaveCapture Team</strong></p>
          <p style="color: #9ca3af; font-size: 12px; margin: 15px 0 0 0;">Reply to this email for support assistance</p>
        </div>
      </div>
    `,
    textBody: `We Want to Make This Right\n\nHi ${data.userName || 'there'},\n\nWe're truly sorry for your poor experience with RaveCapture. Every customer concern is important to us, and we want to understand what went wrong so we can make it right.\n\nI'd like to schedule a personal call with you to discuss your experience and work together to resolve any issues you've encountered.\n\nWhat we'll do:\n• Listen to your concerns and feedback\n• Identify specific issues and their root causes\n• Develop a plan to resolve any problems\n• Ensure you get the value you expected\n\n${data.calendlyUrl ? `Schedule Experience Review: ${data.calendlyUrl}\n` : ''}\n🤝 Our commitment: We're dedicated to ensuring your success with RaveCapture and will work with you until you're completely satisfied.\n\nThank you for giving us the opportunity to make this right.\n\nBest regards,\nThe RaveCapture Team\n\nReply to this email for support assistance`
  }),

  // Retail syndication follow-up
  retailSyndicationFollowUp: (data: EducationEmailData) => ({
    to: data.userEmail,
    subject: 'Retail Syndication Features - Implementation Guide',
    htmlBody: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7c3aed;">Retail Syndication Implementation</h2>
        <p>Hi ${data.userName || 'there'},</p>
        <p>We understand you're looking for retail syndication features. We have comprehensive solutions to help you collect reviews across multiple retail channels.</p>
        <h3>What's Included:</h3>
        <ul>
          <li>Multi-channel review collection setup</li>
          <li>Retail partnership integration guides</li>
          <li>Best practices for retail review management</li>
          <li>Success stories from similar businesses</li>
        </ul>
        <p>Our integration team is ready to help you implement these features.</p>
        <p>Best regards,<br>The RaveCapture Team</p>
      </div>
    `,
    textBody: `Retail Syndication Implementation\n\nHi ${data.userName || 'there'},\n\nWe understand you're looking for retail syndication features. We have comprehensive solutions to help you collect reviews across multiple retail channels.\n\nWhat's Included:\n- Multi-channel review collection setup\n- Retail partnership integration guides\n- Best practices for retail review management\n- Success stories from similar businesses\n\nOur integration team is ready to help you implement these features.\n\nBest regards,\nThe RaveCapture Team`
  }),

  // Technical issues follow-up
  technicalIssuesFollowUp: (data: EducationEmailData) => ({
    to: data.userEmail,
    subject: 'Technical Support - Issue Resolution Guide',
    htmlBody: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ea580c;">Technical Support Information</h2>
        <p>Hi ${data.userName || 'there'},</p>
        <p>We understand you're experiencing technical issues with RaveCapture. Our technical support team is here to help resolve these problems quickly.</p>
        <h3>Immediate Support:</h3>
        <ul>
          <li>Troubleshooting guides for common issues</li>
          <li>Direct contact with our technical team</li>
          <li>System compatibility information</li>
          <li>Escalation process for complex problems</li>
        </ul>
        <p>Our technical team will work with you until all issues are resolved.</p>
        <p>Best regards,<br>The RaveCapture Team</p>
      </div>
    `,
    textBody: `Technical Support Information\n\nHi ${data.userName || 'there'},\n\nWe understand you're experiencing technical issues with RaveCapture. Our technical support team is here to help resolve these problems quickly.\n\nImmediate Support:\n- Troubleshooting guides for common issues\n- Direct contact with our technical team\n- System compatibility information\n- Escalation process for complex problems\n\nOur technical team will work with you until all issues are resolved.\n\nBest regards,\nThe RaveCapture Team`
  })
}

// Email sending functions
export async function sendEmail(template: EmailTemplate): Promise<boolean> {
  try {
    const postmarkClient = getPostmarkClient()
    const response = await postmarkClient.sendEmail({
      From: 'noreply@ravecapture.com',
      ReplyTo: 'support@ravecapture.com',
      To: template.to,
      Subject: template.subject,
      HtmlBody: template.htmlBody,
      TextBody: template.textBody || template.htmlBody.replace(/<[^>]*>/g, ''),
      MessageStream: 'outbound'
    })

    console.log('Email sent successfully:', response.MessageID)
    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}

export async function sendCancellationConfirmation(data: CancellationEmailData): Promise<boolean> {
  const template = emailTemplates.cancellationConfirmation(data)
  return await sendEmail(template)
}

export async function sendCancellationNotification(data: CancellationEmailData): Promise<boolean> {
  const template = emailTemplates.cancellationNotification(data)
  return await sendEmail(template)
}

export async function sendRetentionConfirmation(data: RetentionEmailData): Promise<boolean> {
  const template = emailTemplates.retentionConfirmation(data)
  return await sendEmail(template)
}

export async function sendRetentionAcceptance(data: CancellationEmailData): Promise<boolean> {
  const template = emailTemplates.retentionAcceptance(data)
  return await sendEmail(template)
}

export async function sendReviewOptimizationFollowUp(data: EducationEmailData): Promise<boolean> {
  const template = emailTemplates.reviewOptimizationFollowUp(data)
  return await sendEmail(template)
}

export async function sendPoorExperienceFollowUp(data: EducationEmailData): Promise<boolean> {
  const template = emailTemplates.poorExperienceFollowUp(data)
  return await sendEmail(template)
}

export async function sendRetailSyndicationFollowUp(data: EducationEmailData): Promise<boolean> {
  const template = emailTemplates.retailSyndicationFollowUp(data)
  return await sendEmail(template)
}

export async function sendTechnicalIssuesFollowUp(data: EducationEmailData): Promise<boolean> {
  const template = emailTemplates.technicalIssuesFollowUp(data)
  return await sendEmail(template)
}
