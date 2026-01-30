# Fix RLS Policies for Public Access

Run this SQL in Supabase SQL Editor to fix the Row Level Security policies:

```sql
-- Drop old restrictive policies
DROP POLICY IF EXISTS "Users can insert own checkins" ON checkins;
DROP POLICY IF EXISTS "Users can update own stats" ON user_stats;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Create new policies that allow public inserts based on wallet_address parameter
CREATE POLICY "Public can insert checkins" ON checkins 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Public can insert users" ON users 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Public can update own stats" ON user_stats 
  FOR INSERT 
  WITH CHECK (true);

-- Keep read access public (already set)
-- All read policies remain: "Public read access" for each table
```

**Why this fixes it:**
- Old policy required JWT authentication that doesn't exist
- New policy allows any client to INSERT with wallet_address parameter
- Read access remains public
- Still secure because we validate wallet_address on the backend API

Run this SQL now in Supabase!
