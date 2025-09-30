import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { serializeCancellationReasons } from '@/lib/database'

// GET - Retrieve form submission by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const submissionId = searchParams.get('id')

    if (!submissionId) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      )
    }

    const submission = await prisma.cancellationSubmission.findUnique({
      where: { id: submissionId },
      include: {
        feedback: true,
        retention: true,
        educationEvents: true
      }
    })

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

    let submission

    if (submissionId) {
      // Update existing submission
      submission = await prisma.cancellationSubmission.update({
        where: { id: submissionId },
        data: {
          email,
          currentStep,
          updatedAt: new Date()
        }
      })

      // Update or create feedback
      if (cancellationReasons || specificIssues || additionalFeedback || futurePlans || competitorInfo) {
        await prisma.cancellationFeedback.upsert({
          where: { submissionId },
          update: {
            cancellationReasons: cancellationReasons ? serializeCancellationReasons(cancellationReasons) : undefined,
            specificIssues: specificIssues || undefined,
            additionalFeedback: additionalFeedback || undefined,
            futurePlans: futurePlans || undefined,
            competitorInfo: competitorInfo || undefined
          },
          create: {
            submissionId,
            cancellationReasons: cancellationReasons ? serializeCancellationReasons(cancellationReasons) : '[]',
            specificIssues: specificIssues || null,
            additionalFeedback: additionalFeedback || null,
            futurePlans: futurePlans || null,
            competitorInfo: competitorInfo || null
          }
        })
      }

      // Update or create retention data
      if (retentionAccepted !== undefined) {
        await prisma.cancellationRetention.upsert({
          where: { submissionId },
          update: {
            offerAccepted: retentionAccepted,
            acceptedAt: retentionAccepted ? new Date() : null
          },
          create: {
            submissionId,
            offerPresented: true,
            offerAccepted: retentionAccepted,
            presentedAt: new Date(),
            acceptedAt: retentionAccepted ? new Date() : null
          }
        })
      }
    } else {
      // Create new submission
      submission = await prisma.cancellationSubmission.create({
        data: {
          email,
          currentStep,
          status: 'active'
        }
      })

      // Create feedback record if data provided
      if (cancellationReasons || specificIssues || additionalFeedback || futurePlans || competitorInfo) {
        await prisma.cancellationFeedback.create({
          data: {
            submissionId: submission.id,
            cancellationReasons: cancellationReasons ? serializeCancellationReasons(cancellationReasons) : '[]',
            specificIssues: specificIssues || null,
            additionalFeedback: additionalFeedback || null,
            futurePlans: futurePlans || null,
            competitorInfo: competitorInfo || null
          }
        })
      }

      // Create retention record if data provided
      if (retentionAccepted !== undefined) {
        await prisma.cancellationRetention.create({
          data: {
            submissionId: submission.id,
            offerPresented: true,
            offerAccepted: retentionAccepted,
            presentedAt: new Date(),
            acceptedAt: retentionAccepted ? new Date() : null
          }
        })
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

