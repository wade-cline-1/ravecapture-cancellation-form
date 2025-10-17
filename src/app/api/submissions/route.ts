import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/database'
import { serializeCancellationReasons } from '@/lib/database'

// GET - Retrieve form submission by ID
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const submissionId = searchParams.get('id')

    if (!submissionId) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      )
    }

    // Get submission with related data
    const { data: submission, error: submissionError } = await supabaseAdmin
      .from('cancellation_submissions')
      .select(`
        *,
        cancellation_feedback(*),
        cancellation_retention(*),
        cancellation_education_events(*)
      `)
      .eq('id', submissionId)
      .single()

    if (submissionError) {
      console.error('Error retrieving submission:', submissionError)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(submission)
  } catch (error) {
    console.error('Error retrieving submission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create or update form submission
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { 
      email, 
      currentStep, 
      cancellationReasons, 
      specificIssues, 
      additionalFeedback, 
      futurePlans, 
      competitorInfo,
      retentionAccepted,
      submissionId 
    } = body

    if (!email || !currentStep) {
      return NextResponse.json(
        { error: 'Email and currentStep are required' },
        { status: 400 }
      )
    }

    // Validate cancellationReasons if provided
    if (cancellationReasons !== undefined && Array.isArray(cancellationReasons) && cancellationReasons.length === 0) {
      return NextResponse.json(
        { error: 'At least one cancellation reason is required' },
        { status: 400 }
      )
    }

    let submission

    if (submissionId) {
      // Update existing submission
      const { data: updatedSubmission, error: updateError } = await supabaseAdmin
        .from('cancellation_submissions')
        .update({
          email,
          currentStep,
          updatedAt: new Date().toISOString()
        })
        .eq('id', submissionId)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating submission:', updateError)
        return NextResponse.json(
          { error: 'Failed to update submission' },
          { status: 500 }
        )
      }

      submission = updatedSubmission

      // Update or create feedback
      if (cancellationReasons || specificIssues || additionalFeedback || futurePlans || competitorInfo) {
        const { error: feedbackError } = await supabaseAdmin
          .from('cancellation_feedback')
          .upsert({
            submissionId,
            cancellationReasons: cancellationReasons ? serializeCancellationReasons(cancellationReasons) : '[]',
            specificIssues: specificIssues || null,
            additionalFeedback: additionalFeedback || null,
            futurePlans: futurePlans || null,
            competitorInfo: competitorInfo || null
          }, {
            onConflict: 'submissionId'
          })

        if (feedbackError) {
          console.error('Error updating feedback:', feedbackError)
        }
      }

      // Update or create retention data
      if (retentionAccepted !== undefined) {
        const { error: retentionError } = await supabaseAdmin
          .from('cancellation_retention')
          .upsert({
            submissionId,
            offerPresented: true,
            offerAccepted: retentionAccepted,
            presentedAt: new Date().toISOString(),
            acceptedAt: retentionAccepted ? new Date().toISOString() : null
          }, {
            onConflict: 'submissionId'
          })

        if (retentionError) {
          console.error('Error updating retention:', retentionError)
        }
      }
    } else {
      // Create new submission
      const { data: newSubmission, error: createError } = await supabaseAdmin
        .from('cancellation_submissions')
        .insert({
          email,
          currentStep,
          status: 'active'
        })
        .select()
        .single()

      if (createError) {
        console.error('Error creating submission:', createError)
        return NextResponse.json(
          { error: 'Failed to create submission' },
          { status: 500 }
        )
      }

      submission = newSubmission

      // Create feedback record if data provided
      if (cancellationReasons || specificIssues || additionalFeedback || futurePlans || competitorInfo) {
        const { error: feedbackError } = await supabaseAdmin
          .from('cancellation_feedback')
          .insert({
            submissionId: submission.id,
            cancellationReasons: cancellationReasons ? serializeCancellationReasons(cancellationReasons) : '[]',
            specificIssues: specificIssues || null,
            additionalFeedback: additionalFeedback || null,
            futurePlans: futurePlans || null,
            competitorInfo: competitorInfo || null
          })

        if (feedbackError) {
          console.error('Error creating feedback:', feedbackError)
        }
      }

      // Create retention record if data provided
      if (retentionAccepted !== undefined) {
        const { error: retentionError } = await supabaseAdmin
          .from('cancellation_retention')
          .insert({
            submissionId: submission.id,
            offerPresented: true,
            offerAccepted: retentionAccepted,
            presentedAt: new Date().toISOString(),
            acceptedAt: retentionAccepted ? new Date().toISOString() : null
          })

        if (retentionError) {
          console.error('Error creating retention:', retentionError)
        }
      }
    }

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      submission
    })
  } catch (error) {
    console.error('Error saving submission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

