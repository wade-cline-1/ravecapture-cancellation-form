import { NextRequest, NextResponse } from 'next/server'
import { 
  sendCancellationConfirmation, 
  sendCancellationNotification, 
  sendRetentionConfirmation,
  sendReviewOptimizationFollowUp,
  sendPoorExperienceFollowUp,
  sendRetailSyndicationFollowUp,
  sendTechnicalIssuesFollowUp,
  CancellationEmailData,
  RetentionEmailData,
  EducationEmailData
} from '@/lib/email'
import { prisma } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { emailType, data, submissionId } = body

    if (!emailType || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: emailType and data' },
        { status: 400 }
      )
    }

    let emailSent = false
    let emailLog = null

    try {
      // Send email based on type
      switch (emailType) {
        case 'cancellation_confirmation':
          emailSent = await sendCancellationConfirmation(data as CancellationEmailData)
          break
        case 'cancellation_notification':
          emailSent = await sendCancellationNotification(data as CancellationEmailData)
          break
        case 'retention_confirmation':
          emailSent = await sendRetentionConfirmation(data as RetentionEmailData)
          break
        case 'review_optimization_followup':
          emailSent = await sendReviewOptimizationFollowUp(data as EducationEmailData)
          break
        case 'poor_experience_followup':
          emailSent = await sendPoorExperienceFollowUp(data as EducationEmailData)
          break
        case 'retail_syndication_followup':
          emailSent = await sendRetailSyndicationFollowUp(data as EducationEmailData)
          break
        case 'technical_issues_followup':
          emailSent = await sendTechnicalIssuesFollowUp(data as EducationEmailData)
          break
        default:
          return NextResponse.json(
            { error: 'Invalid email type' },
            { status: 400 }
          )
      }

      // Log email attempt
      emailLog = await prisma.emailLog.create({
        data: {
          submissionId: submissionId || null,
          emailType,
          recipientEmail: data.userEmail || data.to,
          status: emailSent ? 'sent' : 'failed',
          errorMessage: emailSent ? null : 'Email sending failed'
        }
      })

      return NextResponse.json({
        success: emailSent,
        messageId: emailLog.id,
        status: emailSent ? 'sent' : 'failed'
      })

    } catch (emailError) {
      console.error('Email sending error:', emailError)
      
      // Log failed email attempt
      if (!emailLog) {
        emailLog = await prisma.emailLog.create({
          data: {
            submissionId: submissionId || null,
            emailType,
            recipientEmail: data.userEmail || data.to,
            status: 'failed',
            errorMessage: emailError instanceof Error ? emailError.message : 'Unknown error'
          }
        })
      }

      return NextResponse.json({
        success: false,
        error: 'Failed to send email',
        messageId: emailLog.id
      }, { status: 500 })
    }

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
