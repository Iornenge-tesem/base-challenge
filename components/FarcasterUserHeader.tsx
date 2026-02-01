'use client'

import { useFarcasterUser } from '@/hooks/useFarcasterUser'

export default function FarcasterUserHeader() {
  const { user, isLoading } = useFarcasterUser()

  if (isLoading || !user) {
    return null
  }

  return (
    <div className="flex items-center">
      {user.pfpUrl && (
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={user.pfpUrl}
            alt={user.displayName || 'User'}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  )
}
