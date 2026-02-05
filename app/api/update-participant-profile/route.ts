import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, displayName, pfpUrl } = await request.json()

    console.log('[update-participant-profile] Received:', { walletAddress, displayName, pfpUrl })

    if (!walletAddress) {
      console.log('[update-participant-profile] No wallet address')
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 400 }
      )
    }

    const normalizedAddress = walletAddress.toLowerCase()
    console.log('[update-participant-profile] Normalized address:', normalizedAddress)

    // First, check if user is already a participant
    const { data: existing } = await supabase
      .from('challenge_participants')
      .select('id')
      .eq('wallet_address', normalizedAddress)
      .eq('challenge_id', 'show-up')
      .single()

    console.log('[update-participant-profile] Existing record:', existing)

    if (existing) {
      // User already joined - update their profile
      console.log('[update-participant-profile] Updating existing record')
      const { error } = await supabase
        .from('challenge_participants')
        .update({
          displayname: displayName || null,
          farcaster_pfp_url: pfpUrl || null,
        })
        .eq('wallet_address', normalizedAddress)
        .eq('challenge_id', 'show-up')

      if (error) {
        console.log('[update-participant-profile] Update error:', error)
        throw error
      }
      console.log('[update-participant-profile] Update successful')
    } else {
      // User hasn't joined yet - insert a new record with their profile
      // This allows profile to be added before payment
      console.log('[update-participant-profile] Inserting new record')
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
        console.log('[update-participant-profile] Insert error:', error)
        throw error
      }
      console.log('[update-participant-profile] Insert successful')
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated',
    })
  } catch (error: any) {
    console.error('[update-participant-profile] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 500 }
    )
  }
}
