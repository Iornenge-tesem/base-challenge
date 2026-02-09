'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Call SDK ready to dismiss splash screen
    import('@farcaster/miniapp-sdk').then(({ sdk }) => {
      sdk.actions.ready().then(() => {
        setReady(true)
      }).catch(() => {
        setReady(true) // Continue even if SDK fails
      })
    }).catch(() => {
      setReady(true) // Continue if import fails (not in miniapp)
    })
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div>
        <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>Base Challenge</h1>
        <p style={{ fontSize: '18px' }}>{ready ? 'App is ready!' : 'Loading...'}</p>
      </div>
    </div>
  )
}



