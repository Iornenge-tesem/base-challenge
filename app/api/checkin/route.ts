import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(request: NextRequest) {
  try {
    const { wallet_address, challenge_id = 'show-up' } = await request.json()

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
      .eq('wallet_address', normalizedAddress)
      .eq('check_in_date', today)
      .eq('challenge_id', challenge_id)
      .single()

    if (existingCheckIn) {
      return NextResponse.json(
        { error: 'Already checked in today', hasCheckedIn: true },
        { status: 400 }
      )
    }

    // Get current stats
    let { data: stats } = await supabase
      .from('user_stats')
      .select('*')
      .ilike('wallet_address', normalizedAddress)
      .single()

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

    const { data: updatedStats, error: statsError } = await supabase
      .from('user_stats')
      .upsert({
        wallet_address: normalizedAddress,
        total_bcp: newTotalBcp,
        current_streak: newStreak,
        longest_streak: newLongestStreak,
        total_checkins: newTotalCheckins,
        last_checkin_date: today,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'wallet_address' })
      .select()
      .single()

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
    const { data: todayCheckIn } = await supabase
      .from('checkins')
      .select('*')
      .ilike('wallet_address', normalizedAddress)
      .eq('check_in_date', today)
      .eq('challenge_id', 'show-up')
      .single()

    // Get stats
    const { data: stats } = await supabase
      .from('user_stats')
      .select('*')
      .ilike('wallet_address', normalizedAddress)
      .single()

    return NextResponse.json({
      hasCheckedInToday: !!todayCheckIn,
      stats: stats || {
        total_bcp: 0,
        current_streak: 0,
        longest_streak: 0,
        total_checkins: 0,
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
