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

    // First, check if user is already a participant
    const { data: existing } = await supabase
      .from('challenge_participants')
      .select('id')
      .eq('wallet_address', normalizedAddress)
      .eq('challenge_id', 'show-up')
      .single()

    if (existing) {
      // User already joined - update their profile
      const { error } = await supabase
        .from('challenge_participants')
        .update({
          displayname: displayName || null,
          farcaster_pfp_url: pfpUrl || null,
        })
        .eq('wallet_address', normalizedAddress)
        .eq('challenge_id', 'show-up')

      if (error) throw error
    } else {
      // User hasn't joined yet - insert a new record with their profile
      // This allows profile to be added before payment
      const { error } = await supabase
        .from('challenge_participants')
        .insert({
          wallet_address: normalizedAddress,
          challenge_id: 'show-up',
          displayname: displayName || null,
          farcaster_pfp_url: pfpUrl || null,
          status: 'pending', // Mark as pending until they pay
        })

      if (error && error.code !== '23505') {
        // 23505 is unique constraint - they already exist
        throw error
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated',
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 500 }
    )
  }
}
