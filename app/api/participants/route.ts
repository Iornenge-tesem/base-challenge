import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const challenge_id = searchParams.get('challenge_id') || 'show-up'

    // Get wallet addresses for the challenge and count unique participants
    const { data, error } = await supabase
      .from('checkins')
      .select('wallet_address')
      .eq('challenge_id', challenge_id)

    if (error) throw error

    const uniqueWallets = new Set((data || []).map(row => row.wallet_address))

    return NextResponse.json({
      challenge_id,
      participants: uniqueWallets.size,
    })
  } catch (error: any) {
    console.error('Error getting participant count:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get participant count' },
      { status: 500 }
    )
  }
}
