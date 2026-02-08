'use client'

import { useAccount, useConnect } from 'wagmi'
import { useEffect, useState } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

export function useWalletAddress() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const [isMounted, setIsMounted] = useState(false)
  const [userContext, setUserContext] = useState<any>(null)
  const [isSDKReady, setIsSDKReady] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Initialize SDK first, then fetch user data
  useEffect(() => {
    if (!isMounted) return

    const initSDK = async () => {
      try {
        // Wait for SDK to be ready
        await sdk.actions.ready()
        setIsSDKReady(true)
        
        // Now fetch context
        const context = await sdk.context
        if (context?.user) {
          setUserContext(context)
        }
      } catch (error) {
        // Not in Farcaster environment or SDK not available
        setIsSDKReady(false)
        setUserContext(null)
      }
    }

    // Delay slightly to ensure DOM is ready
    const timer = setTimeout(initSDK, 100)
    return () => clearTimeout(timer)
  }, [isMounted])

  const connectWallet = async () => {
    if (!isMounted) return
    const farcasterConnector = connectors.find(c => c.id === 'farcasterMiniApp')
    if (farcasterConnector) {
      connect({ connector: farcasterConnector })
      return
    }
    if (connectors[0]) {
      connect({ connector: connectors[0] })
    }
  }

  return {
    address: isMounted ? address : null,
    isConnected: isMounted ? isConnected : false,
    connectWallet,
    userContext,
    isSDKReady,
  }
}
