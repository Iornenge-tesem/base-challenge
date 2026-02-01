import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const username = searchParams.get('username')

  if (!username) {
    return NextResponse.json(
      { error: 'username is required' },
      { status: 400 }
    )
  }

  try {
    // Use username directly as referral code
    const referralCode = username

    // Count participants who joined through this referral code
    const { data, error } = await supabase
      .from('challenge_participants')
      .select('id')
      .eq('referral_code', referralCode)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch referral count' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      inviteCount: data?.length || 0,
      referralCode,
    })
  } catch (error) {
    console.error('Error in referrals API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
