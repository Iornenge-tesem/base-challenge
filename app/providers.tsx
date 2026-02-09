'use client'

import { ReactNode, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { OnchainKitProvider } from '@coinbase/onchainkit'
import { config } from '@/lib/wagmi'
import { base } from 'wagmi/chains'
import { sdk } from '@farcaster/miniapp-sdk'

const queryClient = new QueryClient()

export function Providers({ children }: { children: ReactNode }) {
  // Call SDK ready() exactly as shown in Base docs
  useEffect(() => {
    sdk.actions.ready()
  }, [])

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
