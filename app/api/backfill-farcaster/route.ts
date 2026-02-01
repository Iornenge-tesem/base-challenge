import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Helper function to fetch Farcaster user by wallet address
async function getFarcasterUserByWallet(walletAddress: string) {
  try {
    // Try Neynar API (requires API key, but we can use a basic lookup)
    // For now, we'll try the Farcaster Hub approach
    const response = await fetch(`https://hub.neynar.com/v1/farcaster/user-by-verification?address=${walletAddress}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    if (data.users && data.users.length > 0) {
      const user = data.users[0]
      return {
        username: user.username,
        displayName: user.display_name,
        pfpUrl: user.pfp?.url,
      }
    }
    return null
  } catch (error) {
    console.error('Error fetching Farcaster user:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get all users from user_stats
    const { data: allUsers, error: allUsersError } = await supabase
      .from('user_stats')
      .select('wallet_address, farcaster_username, farcaster_display_name, farcaster_pfp_url')
      .order('total_bcp', { ascending: false })

    if (allUsersError) throw allUsersError

    if (!allUsers || allUsers.length === 0) {
      return NextResponse.json({ message: 'No users found', count: 0 })
    }

    // Filter users that don't have Farcaster data
    const usersToBackfill = allUsers.filter(
      user => !user.farcaster_username || !user.farcaster_display_name || !user.farcaster_pfp_url
    )

    if (usersToBackfill.length === 0) {
      return NextResponse.json({ message: 'All users already have Farcaster data', count: 0 })
    }

    let successCount = 0
    let failureCount = 0

    // Backfill each user
    for (const user of usersToBackfill) {
      try {
        const farcasterData = await getFarcasterUserByWallet(user.wallet_address)

        if (farcasterData) {
          const { error: updateError } = await supabase
            .from('user_stats')
            .update({
              farcaster_username: farcasterData.username,
              farcaster_display_name: farcasterData.displayName,
              farcaster_pfp_url: farcasterData.pfpUrl,
            })
            .eq('wallet_address', user.wallet_address)

          if (!updateError) {
            successCount++
            console.log(`✅ Updated ${user.wallet_address}`)
          } else {
            failureCount++
            console.log(`❌ Failed to update ${user.wallet_address}: ${updateError}`)
          }
        } else {
          failureCount++
          console.log(`⚠️ No Farcaster data found for ${user.wallet_address}`)
        }

        // Rate limit: small delay between requests
        await new Promise(resolve => setTimeout(resolve, 200))
      } catch (error) {
        console.error(`Error backfilling user ${user.wallet_address}:`, error)
        failureCount++
      }
    }

    return NextResponse.json({
      message: 'Backfill completed',
      successCount,
      failureCount,
      totalToBackfill: usersToBackfill.length,
      totalUsers: allUsers.length,
    })
  } catch (error: any) {
    console.error('Backfill error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to backfill Farcaster data' },
      { status: 500 }
    )
  }
}
