'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ReferralTrackerContent() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) {
      // Store referral code in localStorage for later use
      localStorage.setItem('referralCode', ref)
      console.log('Referral code stored:', ref)
    }
  }, [searchParams])

  return null
}

export default function ReferralTracker() {
  return (
    <Suspense fallback={null}>
      <ReferralTrackerContent />
    </Suspense>
  )
}
