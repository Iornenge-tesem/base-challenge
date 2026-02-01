import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const challenge_id = searchParams.get('challenge_id') || 'show-up'

    // Count active participants for the challenge
    const { count, error } = await supabase
      .from('challenge_participants')
      .select('*', { count: 'exact', head: true })
      .eq('challenge_id', challenge_id)
      .eq('status', 'active')

    if (error) throw error

    return NextResponse.json({
      participants: count || 0,
      challenge_id,
    })
  } catch (error: any) {
    console.error('Participants error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get participant count' },
      { status: 500 }
    )
  }
}
