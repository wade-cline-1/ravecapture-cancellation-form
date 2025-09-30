import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

// POST - Track education step completion
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { submissionId, stepName, stepType, timeSpent } = body

    if (!submissionId || !stepName || !stepType) {
      return NextResponse.json(
        { error: 'submissionId, stepName, and stepType are required' },
        { status: 400 }
      )
    }

    // Verify submission exists
    const submission = await prisma.cancellationSubmission.findUnique({
      where: { id: submissionId }
    })

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    // Create education event
    const educationEvent = await prisma.cancellationEducationEvent.create({
      data: {
        submissionId,
        stepName,
        stepType,
        timeSpent: timeSpent || null,
        completedAt: new Date()
      }
    })

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
    const { searchParams } = new URL(request.url)
    const submissionId = searchParams.get('submissionId')

    if (!submissionId) {
      return NextResponse.json(
        { error: 'submissionId is required' },
        { status: 400 }
      )
    }

    const educationEvents = await prisma.cancellationEducationEvent.findMany({
      where: { submissionId },
      orderBy: { completedAt: 'asc' }
    })

    return NextResponse.json(educationEvents)
  } catch (error) {
    console.error('Error retrieving education events:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

