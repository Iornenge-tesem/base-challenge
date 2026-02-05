import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const challenge_id = searchParams.get('challenge_id') || 'show-up'
    const limit = parseInt(searchParams.get('limit') || '50')

    // Get top users by BCP
    const { data, error } = await supabase
      .from('user_stats')
      .select(`
        wallet_address,
        total_bcp,
        current_streak,
        longest_streak,
        total_checkins
      `)
      .order('total_bcp', { ascending: false })
      .limit(limit)

    if (error) throw error

    // Format for leaderboard
    const leaderboard = data.map((entry: any, index: number) => ({
      rank: index + 1,
      address: entry.wallet_address,
      displayName: entry.wallet_address.slice(0, 6) + '...' + entry.wallet_address.slice(-4),
      avatar: '👤',
      score: entry.total_bcp,
      streak: entry.current_streak,
    }))

    return NextResponse.json({ leaderboard })
  } catch (error: any) {
    console.error('Leaderboard error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get leaderboard' },
      { status: 500 }
    )
  }
}
