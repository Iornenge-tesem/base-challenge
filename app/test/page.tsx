'use client'

import { useEffect, useState } from 'react'

export default function TestPage() {
  const [status, setStatus] = useState('Loading...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      try {
        setStatus('Importing SDK...')
        const { sdk } = await import('@farcaster/miniapp-sdk')
        
        setStatus('Calling ready()...')
        await sdk.actions.ready()
        
        setStatus('Ready called successfully!')
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
        setStatus('Error occurred')
      }
    }
    init()
  }, [])

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
      <h1 style={{ marginBottom: '20px' }}>Mini App Test Page</h1>
      <p style={{ fontSize: '18px', marginBottom: '10px' }}>Status: {status}</p>
      {error && (
        <div style={{
          backgroundColor: '#ff4444',
          padding: '15px',
          borderRadius: '8px',
          maxWidth: '90%',
          wordBreak: 'break-word'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  )
}
