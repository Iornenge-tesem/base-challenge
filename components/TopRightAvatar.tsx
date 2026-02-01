'use client'

import { usePathname } from 'next/navigation'
import { useFarcasterUser } from '@/hooks/useFarcasterUser'

export default function TopRightAvatar() {
  const pathname = usePathname()
  const { user, isLoading } = useFarcasterUser()

  if (isLoading || !user?.pfpUrl) return null
  if (pathname === '/profile') return null

  return (
    <div className="fixed top-3 right-4 z-40">
      <div className="w-8 h-8 rounded-full overflow-hidden border border-white/30 shadow-md">
        <img
          src={user.pfpUrl}
          alt={user.displayName || 'User'}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}
