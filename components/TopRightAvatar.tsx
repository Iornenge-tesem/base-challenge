'use client'

import { usePathname } from 'next/navigation'
import { useFarcasterUser } from '@/hooks/useFarcasterUser'
import { useWalletAddress } from '@/hooks/useWalletAddress'
import { usePublicClient } from 'wagmi'
import { useEffect, useState } from 'react'
import { Address, formatUnits } from 'viem'
import { USDC_ADDRESS } from '@/lib/usdc'

const USDC_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
    stateMutability: 'view',
  },
]

export default function TopRightAvatar() {
  const pathname = usePathname()
  const { user, isLoading } = useFarcasterUser()
  const { address } = useWalletAddress()
  const publicClient = usePublicClient()
  const [usdcBalance, setUsdcBalance] = useState<string>('--')

  useEffect(() => {
    const fetchBalance = async () => {
      if (!address || !publicClient) {
        setUsdcBalance('--')
        return
      }

      try {
        const balance = (await publicClient.readContract({
          address: USDC_ADDRESS as Address,
          abi: USDC_ABI,
          functionName: 'balanceOf',
          args: [address as Address],
        })) as bigint

        setUsdcBalance(formatUnits(balance, 6))
      } catch (error) {
        console.error('Error fetching USDC balance:', error)
        setUsdcBalance('--')
      }
    }

    fetchBalance()
    const interval = setInterval(fetchBalance, 15000)
    return () => clearInterval(interval)
  }, [address, publicClient])

  if (isLoading || !user?.pfpUrl) return null
  if (pathname === '/profile') return null

  return (
    <div className="fixed top-3 right-4 z-40 text-right">
      <div className="w-8 h-8 rounded-full overflow-hidden border border-white/30 shadow-md mx-auto">
        <img
          src={user.pfpUrl}
          alt={user.displayName || 'User'}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="text-[10px] text-primary-dark-blue dark:text-primary-white mt-1 font-medium">
        {user.displayName || 'User'}
      </div>
      <div className="text-[10px] text-primary-dark-blue dark:text-primary-white font-medium">
        usdc: {usdcBalance}
      </div>
    </div>
  )
}
