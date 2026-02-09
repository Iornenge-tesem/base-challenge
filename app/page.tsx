'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [status, setStatus] = useState('Loading...')

  useEffect(() => {
    const init = async () => {
      try {
        setStatus('Importing SDK...')
        const { sdk } = await import('@farcaster/miniapp-sdk')
        setStatus('Calling ready()...')
        await sdk.actions.ready()
        setStatus('SUCCESS - App is ready!')
      } catch (e) {
        setStatus(`Error: ${e instanceof Error ? e.message : String(e)}`)
      }
    }
    init()
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0a2540',
      color: 'white',
      fontSize: '20px',
      fontFamily: 'system-ui, sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div>
        <h1 style={{ marginBottom: '20px' }}>Base Challenge</h1>
        <p>{status}</p>
      </div>
    </div>
  )
}


