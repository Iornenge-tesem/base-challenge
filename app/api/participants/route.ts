import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const challenge_id = searchParams.get('challenge_id') || 'show-up'

    // Get count of participants who have joined the challenge
    const { count, error } = await supabase
      .from('challenge_participants')
      .select('*', { count: 'exact', head: true })
      .eq('challenge_id', challenge_id)

    if (error) throw error

    return NextResponse.json({
      challenge_id,
      participants: count || 0,
    })
  } catch (error: any) {
    console.error('Error getting participant count:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get participant count' },
      { status: 500 }
    )
  }
}
