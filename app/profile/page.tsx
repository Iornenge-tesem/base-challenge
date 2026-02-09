'use client'

import dynamic from 'next/dynamic'

// Dynamically import with ssr: false to avoid wagmi hooks running during prerender
const ProfileContent = dynamic(
  () => import('@/components/ProfileContent'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-primary-light-mode-blue dark:bg-primary-dark-blue flex items-center justify-center">
        <p className="text-primary-dark-blue dark:text-primary-white">Loading...</p>
      </div>
    )
  }
)

export default function ProfilePage() {
  return <ProfileContent />
}

