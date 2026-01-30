import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface User {
  id: string
  wallet_address: string
  username?: string
  avatar?: string
  created_at: string
}

export interface CheckIn {
  id: string
  user_id: string
  wallet_address: string
  challenge_id: string
  bcp_earned: number
  streak: number
  check_in_date: string
  created_at: string
}

export interface UserStats {
  id: string
  wallet_address: string
  total_bcp: number
  current_streak: number
  longest_streak: number
  total_checkins: number
  last_checkin_date: string
  updated_at: string
}
