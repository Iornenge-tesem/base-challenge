'use client'

import { ReactNode, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { OnchainKitProvider, useMiniKit } from '@coinbase/onchainkit'
import { config } from '@/lib/wagmi'
import { base } from 'wagmi/chains'

const queryClient = new QueryClient()

// Inner component that uses useMiniKit hook - must be inside OnchainKitProvider
function MiniKitReady({ children }: { children: ReactNode }) {
  const { setFrameReady } = useMiniKit()
  
  useEffect(() => {
    // Signal to the Base app that the frame is ready to be displayed
    setFrameReady()
    console.log('✅ MiniKit setFrameReady() called')
  }, [setFrameReady])

  // Add Eruda for debugging in production (remove after fixing)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('eruda').then((eruda) => {
        eruda.default.init()
        console.log('🔧 Eruda debug console initialized')
      }).catch(() => {
        // Eruda not available
      })
    }
  }, [])

  return <>{children}</>
}

export function Providers({ children }: { children: ReactNode }) {
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

  return (
    <WagmiProvider config={config}>
      <OnchainKitProvider
        chain={base}
        apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
        miniKit={{ enabled: true, autoConnect: false }}
      >
        <QueryClientProvider client={queryClient}>
          <MiniKitReady>
            {children}
          </MiniKitReady>
        </QueryClientProvider>
      </OnchainKitProvider>
    </WagmiProvider>
  )
}
