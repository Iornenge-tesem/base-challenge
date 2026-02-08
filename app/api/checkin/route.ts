import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { rateLimit } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(request: NextRequest) {
  try {
    const { wallet_address, challenge_id = 'show-up', displayName, pfpUrl } = await request.json()

    if (!wallet_address) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 })
    }

    const normalizedAddress = wallet_address.toLowerCase()

    // Verify user has joined the challenge by checking challenge_participants
    const { data: participant, error: participantError } = await supabase
      .from('challenge_participants')
      .select('*')
      .ilike('wallet_address', normalizedAddress)
      .eq('challenge_id', challenge_id)
      .eq('status', 'active')
      .single()

    if (participantError || !participant) {
      console.error('Participant check failed:', participantError, { wallet_address, challenge_id });
      return NextResponse.json(
        { error: 'You must join the challenge before checking in. Please complete the payment first.' },
        { status: 403 }
      )
    }

    // Update participant profile if Farcaster data is available
    if (displayName || pfpUrl) {
      const updateData: any = {}
      if (displayName) updateData.displayname = displayName
      if (pfpUrl) updateData.farcaster_pfp_url = pfpUrl
      
      await supabase
        .from('challenge_participants')
        .update(updateData)
        .ilike('wallet_address', normalizedAddress)
        .eq('challenge_id', challenge_id)
    }

    // Rate limiting: 10 requests per hour per wallet
    const rateLimitKey = `checkin:${normalizedAddress}`
    const isAllowed = rateLimit(rateLimitKey, {
      maxRequests: 10,
      windowMs: 60 * 60 * 1000, // 1 hour
    })

    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Too many check-in attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const today = new Date().toISOString().split('T')[0]

    // Check if already checked in today
    const { data: existingCheckIn } = await supabase
      .from('checkins')
      .select('*')
      .ilike('wallet_address', normalizedAddress)
      .eq('check_in_date', today)
      .eq('challenge_id', challenge_id)
      .maybeSingle()

    if (existingCheckIn) {
      return NextResponse.json(
        { error: 'Already checked in today', hasCheckedIn: true },
        { status: 400 }
      )
    }

    // Get current stats - check for any case variant
    const { data: statsRows } = await supabase
      .from('user_stats')
      .select('*')
      .ilike('wallet_address', normalizedAddress)
      .order('total_bcp', { ascending: false })
      .limit(1)

    let stats = statsRows?.[0] || null

    // If stats exist with different case, normalize the wallet address
    if (stats && stats.wallet_address !== normalizedAddress) {
      await supabase
        .from('user_stats')
        .update({ wallet_address: normalizedAddress })
        .eq('wallet_address', stats.wallet_address)
    }

    // Calculate new streak
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    let newStreak = 1
    if (stats?.last_checkin_date === yesterdayStr) {
      newStreak = (stats.current_streak || 0) + 1
    }

    const bcpEarned = 1 // Early user reward

    // Create check-in
    const { data: checkIn, error: checkInError } = await supabase
      .from('checkins')
      .insert({
        wallet_address: normalizedAddress,
        challenge_id,
        bcp_earned: bcpEarned,
        streak: newStreak,
        check_in_date: today,
      })
      .select()
      .single()

    if (checkInError) throw checkInError

    // Update or create user stats
    const newTotalBcp = (stats?.total_bcp || 0) + bcpEarned
    const newTotalCheckins = (stats?.total_checkins || 0) + 1
    const newLongestStreak = Math.max(stats?.longest_streak || 0, newStreak)

    let updatedStats
    let statsError

    if (stats) {
      // UPDATE existing row by id
      const result = await supabase
        .from('user_stats')
        .update({
          total_bcp: newTotalBcp,
          current_streak: newStreak,
          longest_streak: newLongestStreak,
          total_checkins: newTotalCheckins,
          last_checkin_date: today,
          updated_at: new Date().toISOString(),
        })
        .eq('id', stats.id)
        .select()
        .single()
      
      updatedStats = result.data
      statsError = result.error
    } else {
      // INSERT new row
      const result = await supabase
        .from('user_stats')
        .insert({
          wallet_address: normalizedAddress,
          total_bcp: newTotalBcp,
          current_streak: newStreak,
          longest_streak: newLongestStreak,
          total_checkins: newTotalCheckins,
          last_checkin_date: today,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()
      
      updatedStats = result.data
      statsError = result.error
    }

    if (statsError) throw statsError

    return NextResponse.json({
      success: true,
      checkIn,
      stats: updatedStats,
      message: `+${bcpEarned} BCP earned!`,
    })
  } catch (error: any) {
    console.error('Check-in error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to check in' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const wallet_address = searchParams.get('wallet_address')

    if (!wallet_address) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 })
    }

    const normalizedAddress = wallet_address.toLowerCase()

    const today = new Date().toISOString().split('T')[0]

    // Check if checked in today
    const { data: todayCheckins } = await supabase
      .from('checkins')
      .select('*')
      .ilike('wallet_address', normalizedAddress)
      .eq('check_in_date', today)
      .eq('challenge_id', 'show-up')
      .limit(1)

    const todayCheckIn = todayCheckins?.[0] || null

    // Calculate BCP from actual checkins (sum of bcp_earned)
    const { data: checkinStats } = await supabase
      .from('checkins')
      .select('bcp_earned, streak, check_in_date')
      .ilike('wallet_address', normalizedAddress)
      .eq('challenge_id', 'show-up')
      .order('check_in_date', { ascending: false })

    let totalBcp = 0
    let currentStreak = 0
    let longestStreak = 0
    let totalCheckins = 0

    if (checkinStats && checkinStats.length > 0) {
      totalBcp = checkinStats.reduce((sum, c: any) => sum + (c.bcp_earned || 0), 0)
      currentStreak = checkinStats[0].streak || 0
      totalCheckins = checkinStats.length

      // Calculate longest streak from all checkins
      let maxStreak = 0
      for (const c of checkinStats) {
        if ((c.streak || 0) > maxStreak) {
          maxStreak = c.streak || 0
        }
      }
      longestStreak = maxStreak
    }

    return NextResponse.json({
      hasCheckedInToday: !!todayCheckIn,
      stats: {
        wallet_address: normalizedAddress,
        total_bcp: totalBcp,
        current_streak: currentStreak,
        longest_streak: longestStreak,
        total_checkins: totalCheckins,
      },
    })
  } catch (error: any) {
    console.error('Get check-in status error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get status' },
      { status: 500 }
    )
  }
}
