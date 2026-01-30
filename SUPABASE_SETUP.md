# Supabase Setup Guide

## 1. Create Supabase Account
1. Go to https://supabase.com
2. Sign up (free tier)
3. Create a new project: "base-challenge"

## 2. Get Your Keys
After project creation, go to Project Settings → API
- Copy `SUPABASE_URL`
- Copy `SUPABASE_ANON_KEY`

## 3. Add to .env.local
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 4. Database Schema (Run in SQL Editor)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  username TEXT,
  avatar TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Check-ins table
CREATE TABLE checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  wallet_address TEXT NOT NULL,
  challenge_id TEXT DEFAULT 'show-up',
  bcp_earned INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 1,
  check_in_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(wallet_address, check_in_date, challenge_id)
);

-- User stats table
CREATE TABLE user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  total_bcp INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_checkins INTEGER DEFAULT 0,
  last_checkin_date DATE,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Policies (users can read all, modify own data)
CREATE POLICY "Public read access" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (wallet_address = current_setting('request.jwt.claim.wallet_address', true));

CREATE POLICY "Public read access" ON checkins FOR SELECT USING (true);
CREATE POLICY "Users can insert own checkins" ON checkins FOR INSERT WITH CHECK (wallet_address = current_setting('request.jwt.claim.wallet_address', true));

CREATE POLICY "Public read access" ON user_stats FOR SELECT USING (true);
CREATE POLICY "Users can update own stats" ON user_stats FOR UPDATE USING (wallet_address = current_setting('request.jwt.claim.wallet_address', true));
```

## 5. Install Packages (run in terminal)
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```
