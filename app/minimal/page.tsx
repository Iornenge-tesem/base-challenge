'use client'

import { useEffect, useState } from 'react'

export default function MinimalPage() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    setStep(1)
    
    // Step 2: Try to call SDK ready
    const init = async () => {
      try {
        setStep(2)
        const { sdk } = await import('@farcaster/miniapp-sdk')
        setStep(3)
        await sdk.actions.ready()
        setStep(4)
      } catch (e) {
        console.error('SDK Error:', e)
        setStep(-1)
      }
    }
    
    init()
  }, [])

  return (
    <div style={{
      background: '#0a2540',
      color: 'white', 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px'
    }}>
      {step === 0 && 'Step 0: Loading...'}
      {step === 1 && 'Step 1: Mounted'}
      {step === 2 && 'Step 2: Importing SDK'}
      {step === 3 && 'Step 3: Calling ready()'}
      {step === 4 && 'Step 4: SUCCESS!'}
      {step === -1 && 'ERROR - Check console'}
    </div>
  )
}
