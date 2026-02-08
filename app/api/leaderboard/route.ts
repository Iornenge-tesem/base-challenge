import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const challenge_id = searchParams.get('challenge_id') || 'show-up'
    const limit = parseInt(searchParams.get('limit') || '50')

    // Get all checkins and calculate BCP totals directly from checkins table
    const { data: checkins, error } = await supabase
      .from('checkins')
      .select('wallet_address, bcp_earned, streak')
      .eq('challenge_id', challenge_id)

    if (error) throw error

    // Aggregate BCP by wallet address
    const walletStats = new Map<string, { total_bcp: number; current_streak: number }>()
    
    for (const checkin of checkins || []) {
      const addr = checkin.wallet_address.toLowerCase()
      const existing = walletStats.get(addr) || { total_bcp: 0, current_streak: 0 }
      walletStats.set(addr, {
        total_bcp: existing.total_bcp + (checkin.bcp_earned || 0),
        current_streak: Math.max(existing.current_streak, checkin.streak || 0),
      })
    }

    // Convert to array and sort by total_bcp
    const sortedStats = Array.from(walletStats.entries())
      .map(([wallet_address, stats]) => ({ wallet_address, ...stats }))
      .sort((a, b) => b.total_bcp - a.total_bcp)
      .slice(0, limit)

    // Get display names and avatars for these users
    const walletAddresses = sortedStats.map(s => s.wallet_address)
    let participantMap = new Map<string, { displayName?: string; pfpUrl?: string }>()

    if (walletAddresses.length > 0) {
      const { data: participants } = await supabase
        .from('challenge_participants')
        .select('wallet_address, displayname, pfpurl')
        .eq('challenge_id', challenge_id)

      if (participants) {
        for (const p of participants) {
          if (walletAddresses.includes(p.wallet_address.toLowerCase())) {
            participantMap.set(p.wallet_address.toLowerCase(), {
              displayName: p.displayname,
              pfpUrl: p.pfpurl,
            })
          }
        }
      }
    }

    // Format for leaderboard
    const leaderboard = sortedStats.map((entry, index) => {
      const info = participantMap.get(entry.wallet_address.toLowerCase())
      return {
        rank: index + 1,
        address: entry.wallet_address,
        displayName: info?.displayName || entry.wallet_address.slice(0, 6) + '...' + entry.wallet_address.slice(-4),
        avatar: info?.pfpUrl || '👤',
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
