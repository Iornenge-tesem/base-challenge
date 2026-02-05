import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const challenge_id = searchParams.get('challenge_id') || 'show-up'
    const limit = parseInt(searchParams.get('limit') || '50')

    // Get top users by BCP with their Farcaster data
    const { data, error } = await supabase
      .from('user_stats')
      .select(`
        wallet_address,
        total_bcp,
        current_streak,
        longest_streak,
        total_checkins,
        challenge_participants(displayName, pfpUrl)
      `)
      .order('total_bcp', { ascending: false })
      .limit(limit)

    if (error) throw error

    // Format for leaderboard with user info
    const leaderboard = data.map((entry: any, index: number) => {
      const farcasterData = Array.isArray(entry.challenge_participants) 
        ? entry.challenge_participants[0] 
        : entry.challenge_participants
      
      return {
        rank: index + 1,
        address: entry.wallet_address,
        displayName: farcasterData?.displayName || entry.wallet_address.slice(0, 6) + '...',
        avatar: farcasterData?.pfpUrl || '👤',
        score: entry.total_bcp,
        streak: entry.current_streak,
      }
    })

    return NextResponse.json({ leaderboard })
  } catch (error: any) {
    console.error('Leaderboard error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get leaderboard' },
      { status: 500 }
    )
  }
}
