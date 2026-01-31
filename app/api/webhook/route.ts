import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Log webhook events for debugging
    console.log('Webhook event received:', {
      type: data.type,
      timestamp: new Date().toISOString(),
      data,
    })

    // Handle different event types
    switch (data.type) {
      case 'notification.clicked':
        // User clicked on a notification
        console.log('User clicked notification:', data.payload)
        break

      case 'app.uninstalled':
        // User uninstalled the mini app
        console.log('App uninstalled:', data.payload)
        break

      case 'app.installed':
        // User installed the mini app
        console.log('App installed:', data.payload)
        break

      default:
        console.log('Unknown event type:', data.type)
    }

    // Return success response to Base
    return NextResponse.json({
      success: true,
      message: 'Webhook received successfully',
    })
  } catch (error) {
    console.error('Webhook error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process webhook',
      },
      { status: 400 }
    )
  }
}
