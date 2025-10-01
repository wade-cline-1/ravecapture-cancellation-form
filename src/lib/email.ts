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
      subject: 'Your RaveCapture cancellation has been processed',
      htmlBody: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Cancellation Confirmed</h2>
          <p>Hi ${data.userName || 'there'},</p>
          <p>We've received your cancellation request and it has been processed.</p>
          <p>We're sorry to see you go and would love to understand what we could have done better.</p>
          <p>Your feedback helps us improve our service for other customers.</p>
          <p>Thank you for being a valued customer.</p>
          <p>Best regards,<br>The RaveCapture Team</p>
        </div>
      `,
      textBody: `Cancellation Confirmed\n\nHi ${data.userName || 'there'},\n\nWe've received your cancellation request and it has been processed.\n\nWe're sorry to see you go and would love to understand what we could have done better.\n\nYour feedback helps us improve our service for other customers.\n\nThank you for being a valued customer.\n\nBest regards,\nThe RaveCapture Team`
    }
  },

  // Internal notification
  cancellationNotification: (data: CancellationEmailData) => {
    const reasons = getReasonsArray(data.cancellationReasons)
    return {
      to: 'support@ravecapture.com',
      subject: `New Cancellation: ${data.userEmail}`,
      htmlBody: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">New Cancellation</h2>
          <p><strong>User:</strong> ${data.userEmail}</p>
          <p><strong>Reasons:</strong> ${reasons.join(', ')}</p>
          ${data.specificIssues ? `<p><strong>Specific Issues:</strong> ${data.specificIssues}</p>` : ''}
          ${data.additionalFeedback ? `<p><strong>Additional Feedback:</strong> ${data.additionalFeedback}</p>` : ''}
          <p>Please follow up with the user to understand their concerns better.</p>
        </div>
      `,
      textBody: `New Cancellation\n\nUser: ${data.userEmail}\nReasons: ${reasons.join(', ')}\n${data.specificIssues ? `Specific Issues: ${data.specificIssues}\n` : ''}${data.additionalFeedback ? `Additional Feedback: ${data.additionalFeedback}\n` : ''}\nPlease follow up with the user to understand their concerns better.`
    }
  },

  // Retention offer confirmation
  retentionConfirmation: (data: RetentionEmailData) => ({
    to: data.userEmail,
    subject: 'Thank you for staying with RaveCapture!',
    htmlBody: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Welcome Back!</h2>
        <p>Hi ${data.userName || 'there'},</p>
        <p>We're thrilled that you've decided to stay with RaveCapture!</p>
        <p>Your ${data.discountAmount}% discount for ${data.discountDuration} months has been applied to your account.</p>
        <p>We're committed to making your experience better and will be in touch soon to ensure you're getting the most out of our platform.</p>
        <p>Thank you for your continued trust in RaveCapture.</p>
        <p>Best regards,<br>The RaveCapture Team</p>
      </div>
    `,
    textBody: `Welcome Back!\n\nHi ${data.userName || 'there'},\n\nWe're thrilled that you've decided to stay with RaveCapture!\n\nYour ${data.discountAmount}% discount for ${data.discountDuration} months has been applied to your account.\n\nWe're committed to making your experience better and will be in touch soon to ensure you're getting the most out of our platform.\n\nThank you for your continued trust in RaveCapture.\n\nBest regards,\nThe RaveCapture Team`
  }),

  // Retention acceptance notification (internal)
  retentionAcceptance: (data: CancellationEmailData) => {
    const reasons = getReasonsArray(data.cancellationReasons)
    return {
      to: 'support@ravecapture.com',
      subject: `Retention Offer Accepted: ${data.userEmail}`,
      htmlBody: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Retention Offer Accepted!</h2>
          <p><strong>User:</strong> ${data.userEmail}</p>
          <p><strong>Original Reasons:</strong> ${reasons.join(', ')}</p>
          ${data.specificIssues ? `<p><strong>Specific Issues:</strong> ${data.specificIssues}</p>` : ''}
          ${data.additionalFeedback ? `<p><strong>Additional Feedback:</strong> ${data.additionalFeedback}</p>` : ''}
          <p><strong>Action Required:</strong> Apply 50% discount to their account for 12 months</p>
          <p>Please ensure the discount is properly applied and follow up with the user.</p>
        </div>
      `,
      textBody: `Retention Offer Accepted!\n\nUser: ${data.userEmail}\nOriginal Reasons: ${reasons.join(', ')}\n${data.specificIssues ? `Specific Issues: ${data.specificIssues}\n` : ''}${data.additionalFeedback ? `Additional Feedback: ${data.additionalFeedback}\n` : ''}\nAction Required: Apply 50% discount to their account for 12 months\n\nPlease ensure the discount is properly applied and follow up with the user.`
    }
  },

  // Education follow-up emails
  reviewOptimizationFollowUp: (data: EducationEmailData) => ({
    to: data.userEmail,
    subject: 'Let\'s optimize your review collection strategy',
    htmlBody: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Review Optimization Consultation</h2>
        <p>Hi ${data.userName || 'there'},</p>
        <p>We noticed you mentioned not getting enough reviews. This is a common challenge, and we have proven strategies to help.</p>
        <p>I'd love to schedule a quick call to discuss how we can optimize your review collection process.</p>
        ${data.calendlyUrl ? `<p><a href="${data.calendlyUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Schedule a Call</a></p>` : ''}
        <p>Best regards,<br>The RaveCapture Team</p>
      </div>
    `,
    textBody: `Review Optimization Consultation\n\nHi ${data.userName || 'there'},\n\nWe noticed you mentioned not getting enough reviews. This is a common challenge, and we have proven strategies to help.\n\nI'd love to schedule a quick call to discuss how we can optimize your review collection process.\n\n${data.calendlyUrl ? `Schedule a call: ${data.calendlyUrl}\n` : ''}\nBest regards,\nThe RaveCapture Team`
  }),

  // Poor experience follow-up
  poorExperienceFollowUp: (data: EducationEmailData) => ({
    to: data.userEmail,
    subject: 'We want to make this right - Experience Review',
    htmlBody: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Experience Review Consultation</h2>
        <p>Hi ${data.userName || 'there'},</p>
        <p>We're truly sorry for your poor experience with RaveCapture. We take every customer concern seriously and want to make this right.</p>
        <p>I'd like to schedule a call to understand what went wrong and work together to resolve your concerns.</p>
        ${data.calendlyUrl ? `<p><a href="${data.calendlyUrl}" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Schedule Experience Review</a></p>` : ''}
        <p>We're committed to ensuring your success with our platform.</p>
        <p>Best regards,<br>The RaveCapture Team</p>
      </div>
    `,
    textBody: `Experience Review Consultation\n\nHi ${data.userName || 'there'},\n\nWe're truly sorry for your poor experience with RaveCapture. We take every customer concern seriously and want to make this right.\n\nI'd like to schedule a call to understand what went wrong and work together to resolve your concerns.\n\n${data.calendlyUrl ? `Schedule Experience Review: ${data.calendlyUrl}\n` : ''}\nWe're committed to ensuring your success with our platform.\n\nBest regards,\nThe RaveCapture Team`
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
