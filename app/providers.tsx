'use client'

import { ReactNode, useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { OnchainKitProvider } from '@coinbase/onchainkit'
import { config } from '@/lib/wagmi'
import { base } from 'wagmi/chains'

const queryClient = new QueryClient()

export function Providers({ children }: { children: ReactNode }) {
  const [sdkReady, setSdkReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Call SDK ready() FIRST before rendering any wallet providers
  useEffect(() => {
    const initSdk = async () => {
      try {
        // Dynamic import
        const { sdk } = await import('@farcaster/miniapp-sdk')
        await sdk.actions.ready()
        console.log('SDK ready() called successfully')
        setSdkReady(true)
      } catch (err) {
        console.error('SDK error:', err)
        setError(err instanceof Error ? err.message : String(err))
        // Still allow the app to render even if SDK fails
        setSdkReady(true)
      }
    }
    initSdk()
  }, [])

  // Show loading while SDK initializes
  if (!sdkReady) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a2540',
        color: 'white',
        padding: '20px',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <p>Initializing...</p>
      </div>
    )
  }

  // Show error state if something went wrong
  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a2540',
        color: 'white',
        padding: '20px'
      }}>
        <h1>SDK Error</h1>
        <p style={{ color: '#ff6b6b' }}>{error}</p>
      </div>
    )
  }

  return (
    <WagmiProvider config={config}>
      <OnchainKitProvider
        chain={base}
        apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      >
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </OnchainKitProvider>
    </WagmiProvider>
  )
}
