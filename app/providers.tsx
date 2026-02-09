'use client'

import { ReactNode, useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { OnchainKitProvider } from '@coinbase/onchainkit'
import { config } from '@/lib/wagmi'
import { base } from 'wagmi/chains'

const queryClient = new QueryClient()

// Track if ready() has been called
let sdkReadyCalled = false

// Call SDK ready IMMEDIATELY when this module loads
if (typeof window !== 'undefined') {
  const callReady = async () => {
    if (sdkReadyCalled) return
    sdkReadyCalled = true
    try {
      const { sdk } = await import('@farcaster/miniapp-sdk')
      await sdk.actions.ready()
      console.log('✅ SDK ready() called successfully')
    } catch (error) {
      console.error('SDK ready() error:', error)
    }
  }
  // Call immediately
  callReady()
  // Also call after a small delay as backup
  setTimeout(callReady, 100)
  setTimeout(callReady, 500)
  // And on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callReady)
  }
}

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  // Ensure we only render children after mount to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Add Eruda for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('eruda').then((eruda) => {
        eruda.default.init()
        console.log('🔧 Eruda debug console initialized')
      }).catch(() => {})
    }
  }, [])

  // Theme handling
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = (isDark: boolean) => {
      document.documentElement.classList.toggle('dark', isDark)
    }

    const getStoredTheme = () => {
      const stored = localStorage.getItem('theme')
      return stored === 'dark' || stored === 'light' ? stored : null
    }

    const applyInitialTheme = () => {
      const stored = getStoredTheme()
      if (stored) {
        applyTheme(stored === 'dark')
        return
      }
      applyTheme(media.matches)
    }

    const handleMediaChange = (event: MediaQueryListEvent) => {
      const stored = getStoredTheme()
      if (stored) return
      applyTheme(event.matches)
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== 'theme') return
      const stored = getStoredTheme()
      if (stored) {
        applyTheme(stored === 'dark')
      } else {
        applyTheme(media.matches)
      }
    }

    applyInitialTheme()

    if (media.addEventListener) {
      media.addEventListener('change', handleMediaChange)
    } else {
      media.addListener(handleMediaChange)
    }

    window.addEventListener('storage', handleStorage)

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', handleMediaChange)
      } else {
        media.removeListener(handleMediaChange)
      }
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  // Show a simple loading state until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#0a2540',
        color: 'white',
        fontSize: '18px'
      }}>
        Loading Base Challenge...
      </div>
    )
  }

  return (
    <WagmiProvider config={config}>
      <OnchainKitProvider
        chain={base}
        apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
        miniKit={{ enabled: true, autoConnect: false }}
      >
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </OnchainKitProvider>
    </WagmiProvider>
  )
}
