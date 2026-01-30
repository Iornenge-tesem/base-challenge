'use client'

import { useEffect, useState } from 'react'

export function useWalletAddress() {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Check if wallet is available (MetaMask, etc.)
    const checkWallet = async () => {
      try {
        // For now, we'll use localStorage to persist a test address
        // In production, replace with actual wallet.connect() logic
        const savedAddress = localStorage.getItem('walletAddress')
        if (savedAddress) {
          setAddress(savedAddress)
          setIsConnected(true)
        } else {
          // Generate a test address for development
          const testAddress = `0x${Math.random().toString(16).slice(2).padStart(40, '0')}`
          localStorage.setItem('walletAddress', testAddress)
          setAddress(testAddress)
          setIsConnected(true)
        }
      } catch (error) {
        console.error('Error checking wallet:', error)
      }
    }

    checkWallet()
  }, [])

  const connectWallet = async () => {
    // TODO: Implement actual wallet connection
    // Example: window.ethereum?.request({ method: 'eth_requestAccounts' })
    console.log('Wallet connection not yet implemented')
  }

  const disconnectWallet = () => {
    localStorage.removeItem('walletAddress')
    setAddress(null)
    setIsConnected(false)
  }

  return {
    address,
    isConnected,
    connectWallet,
    disconnectWallet,
  }
}
