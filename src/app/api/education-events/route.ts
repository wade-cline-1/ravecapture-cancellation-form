import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// POST - Track education step completion
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { submissionId, stepName, stepType, timeSpent } = body

    if (!submissionId || !stepName || !stepType) {
      return NextResponse.json(
        { error: 'submissionId, stepName, and stepType are required' },
        { status: 400 }
      )
    }

    // Verify submission exists
    const { data: submission, error: submissionError } = await supabaseAdmin
      .from('cancellation_submissions')
      .select('id')
      .eq('id', submissionId)
      .single()

    if (submissionError || !submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    // Create education event
    const { data: educationEvent, error: createError } = await supabaseAdmin
      .from('cancellation_education_events')
      .insert({
        submission_id: submissionId,
        step_name: stepName,
        step_type: stepType,
        time_spent: timeSpent || null,
        completed_at: new Date().toISOString()
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating education event:', createError)
      return NextResponse.json(
        { error: 'Failed to create education event' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      educationEvent
    })
  } catch (error) {
    console.error('Error tracking education event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Retrieve education events for a submission
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const submissionId = searchParams.get('submissionId')

    if (!submissionId) {
      return NextResponse.json(
        { error: 'submissionId is required' },
        { status: 400 }
      )
    }

    const { data: educationEvents, error: fetchError } = await supabaseAdmin
      .from('cancellation_education_events')
      .select('*')
      .eq('submission_id', submissionId)
      .order('completed_at', { ascending: true })

    if (fetchError) {
      console.error('Error fetching education events:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch education events' },
        { status: 500 }
      )
    }

    return NextResponse.json(educationEvents)
  } catch (error) {
    console.error('Error retrieving education events:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

