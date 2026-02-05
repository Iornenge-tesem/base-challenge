import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, displayName, pfpUrl } = await request.json()

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 400 }
      )
    }

    const normalizedAddress = walletAddress.toLowerCase()

    // Update participant profile with Farcaster data
    const { error } = await supabase
      .from('challenge_participants')
      .update({
        displayName: displayName || null,
        pfpUrl: pfpUrl || null,
      })
      .eq('wallet_address', normalizedAddress)
      .eq('challenge_id', 'show-up')

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Profile updated',
    })
  } catch (error: any) {
    console.error('Update participant profile error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 500 }
    )
  }
}
