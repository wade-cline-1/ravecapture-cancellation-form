import { NextRequest, NextResponse } from 'next/server'
import { 
  sendCancellationConfirmation, 
  sendCancellationNotification, 
  sendRetentionConfirmation,
  sendRetentionAcceptance,
  sendReviewOptimizationFollowUp,
  sendPoorExperienceFollowUp,
  sendRetailSyndicationFollowUp,
  sendTechnicalIssuesFollowUp,
  CancellationEmailData,
  RetentionEmailData,
  EducationEmailData
} from '@/lib/email'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { emailType, data, submissionId } = body

    if (!emailType || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: emailType and data' },
        { status: 400 }
      )
    }

    // Check if email was already sent (idempotency check)
    if (submissionId) {
      const { data: existingLog, error: checkError } = await supabaseAdmin
        .from('email_logs')
        .select('id, status')
        .eq('submissionId', submissionId)
        .eq('emailType', emailType)
        .single()

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Error checking email log:', checkError)
        return NextResponse.json(
          { error: 'Failed to check email status' },
          { status: 500 }
        )
      }

      if (existingLog) {
        console.log(`Email ${emailType} already sent for submission ${submissionId}`)
        return NextResponse.json({
          success: true,
          status: 'already_sent',
          message: 'Email was already sent'
        })
      }
    }

    let emailSent = false
    let emailLogId: string | null = null

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
        case 'retention_acceptance':
          emailSent = await sendRetentionAcceptance(data as CancellationEmailData)
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

      // Log email attempt in database (with unique constraint for idempotency)
      if (submissionId) {
        try {
          const { data: logData, error: logError } = await supabaseAdmin
            .from('email_logs')
            .insert({
              submissionId,
              emailType,
              recipientEmail: data.email || data.userEmail,
              status: emailSent ? 'sent' : 'failed',
              errorMessage: emailSent ? null : 'Email sending failed'
            })
            .select('id')
            .single()

          if (logError) {
            // Check if it's a unique constraint violation (duplicate email)
            if (logError.code === '23505') {
              console.log(`Email ${emailType} already logged for submission ${submissionId}`)
              return NextResponse.json({
                success: true,
                status: 'already_sent',
                message: 'Email was already sent'
              })
            }
            console.error('Error logging email:', logError)
          } else {
            emailLogId = logData.id
          }
        } catch (logError) {
          console.error('Error in email logging:', logError)
          // Don't fail the request if logging fails
        }
      }

      return NextResponse.json({
        success: emailSent,
        status: emailSent ? 'sent' : 'failed',
        emailLogId
      })

    } catch (emailError) {
      console.error('Email sending error:', emailError)

      // Log failed email attempt
      if (submissionId) {
        try {
          await supabaseAdmin
            .from('email_logs')
            .insert({
              submissionId,
              emailType,
              recipientEmail: data.email || data.userEmail,
              status: 'failed',
              errorMessage: emailError instanceof Error ? emailError.message : 'Unknown error'
            })
        } catch (logError) {
          console.error('Error logging failed email:', logError)
        }
      }

      return NextResponse.json({
        success: false,
        error: 'Failed to send email'
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
