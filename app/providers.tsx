'use client'

import { ReactNode, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { OnchainKitProvider } from '@coinbase/onchainkit'
import { config } from '@/lib/wagmi'
import SDKInitializer from '@/components/SDKInitializer'
import { base } from 'wagmi/chains'

const queryClient = new QueryClient()

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
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
    <SDKInitializer>
      <WagmiProvider config={config}>
        <OnchainKitProvider chain={base} config={{ apiKey: process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY }}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </OnchainKitProvider>
      </WagmiProvider>
    </SDKInitializer>
  )
}
