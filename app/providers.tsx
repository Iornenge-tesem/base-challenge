'use client'

import { ReactNode, Component, ErrorInfo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { OnchainKitProvider } from '@coinbase/onchainkit'
import { config } from '@/lib/wagmi'
import { base } from 'wagmi/chains'

const queryClient = new QueryClient()

// Call SDK ready immediately when module loads
if (typeof window !== 'undefined') {
  setTimeout(async () => {
    try {
      const { sdk } = await import('@farcaster/miniapp-sdk')
      await sdk.actions.ready()
      console.log('SDK ready() success')
    } catch (e) {
      console.log('SDK ready() skipped:', e)
    }
  }, 0)
}

// Error boundary to catch any crashes
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
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
          <h1>Something went wrong</h1>
          <p style={{ color: '#ff6b6b', maxWidth: '400px', textAlign: 'center' }}>
            {this.state.error?.message || 'Unknown error'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#00D395',
              color: '#0a2540',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  )
}
