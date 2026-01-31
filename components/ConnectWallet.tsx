'use client'

import { useWalletAddress } from '@/hooks/useWalletAddress'
import { useEffect, useState } from 'react'

export default function ConnectWallet() {
  const { address, isConnected, connectWallet, disconnectWallet } = useWalletAddress()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  if (!isConnected) {
    return (
      <button
        onClick={connectWallet}
        className="px-4 py-2 bg-accent-green hover:bg-accent-green-dark text-primary-dark-blue font-semibold rounded-lg transition-all duration-300"
      >
        Connect Wallet
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-primary-dark-blue dark:text-primary-white">
        {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'}
      </span>
      <button
        onClick={disconnectWallet}
        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-all duration-300"
      >
        Disconnect
      </button>
    </div>
  )
}
