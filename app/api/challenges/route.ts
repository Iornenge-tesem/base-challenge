import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .select(`
        id,
        title,
        description,
        type,
        thumbnail,
        participants,
        bcp_reward,
        duration,
        start_date,
        end_date,
        is_active,
        entry_fee
      `)
      .order('created_at', { ascending: true })

    if (error) throw error

    const challenges = (data || []).map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      type: row.type,
      thumbnail: row.thumbnail,
      participants: row.participants || 0,
      bcpReward: row.bcp_reward,
      duration: row.duration,
      startDate: row.start_date || undefined,
      endDate: row.end_date || undefined,
      isActive: row.is_active,
      entryFee: row.entry_fee || undefined,
    }))

    return NextResponse.json({ challenges })
  } catch (error: any) {
    console.error('Challenges error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get challenges' },
      { status: 500 }
    )
  }
}
