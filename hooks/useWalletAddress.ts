'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useEffect, useRef, useState } from 'react'

export function useWalletAddress() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const [isMounted, setIsMounted] = useState(false)
  const didAutoConnect = useRef(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const connectWallet = async () => {
    if (!isMounted) return
    const injectedConnector = connectors.find(c => c.id === 'injected')
    if (injectedConnector) {
      connect({ connector: injectedConnector })
      return
    }
    if (connectors[0]) {
      connect({ connector: connectors[0] })
    }
  }

  useEffect(() => {
    if (!isMounted || isConnected || didAutoConnect.current) return
    if (!connectors.length) return
    didAutoConnect.current = true
    connectWallet()
  }, [isMounted, isConnected, connectors, connectWallet])

  const disconnectWallet = () => {
    disconnect()
  }

  return {
    address: isMounted ? address : null,
    isConnected: isMounted ? isConnected : false,
    connectWallet,
    disconnectWallet,
  }
}
