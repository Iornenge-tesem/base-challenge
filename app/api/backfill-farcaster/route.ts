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
    // Get all users from user_stats that don't have Farcaster data
    const { data: users, error: usersError } = await supabase
      .from('user_stats')
      .select('wallet_address')
      .or('farcaster_username.is.null,farcaster_display_name.is.null')

    if (usersError) throw usersError

    if (!users || users.length === 0) {
      return NextResponse.json({ message: 'No users to backfill', count: 0 })
    }

    let successCount = 0
    let failureCount = 0

    // Backfill each user
    for (const user of users) {
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
          } else {
            failureCount++
          }
        } else {
          failureCount++
        }

        // Rate limit: small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        console.error(`Error backfilling user ${user.wallet_address}:`, error)
        failureCount++
      }
    }

    return NextResponse.json({
      message: 'Backfill completed',
      successCount,
      failureCount,
      totalProcessed: users.length,
    })
  } catch (error: any) {
    console.error('Backfill error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to backfill Farcaster data' },
      { status: 500 }
    )
  }
}
