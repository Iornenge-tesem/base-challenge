'use client'

import { useFarcasterUser } from '@/hooks/useFarcasterUser'
import Image from 'next/image'

export default function FarcasterUserHeader() {
  const { user, isLoading } = useFarcasterUser()

  if (isLoading || !user) {
    return null
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white/10 dark:bg-primary-light-blue/30 backdrop-blur-sm">
      {user.pfpUrl && (
        <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={user.pfpUrl}
            alt={user.username}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-primary-white truncate">
          {user.displayName || user.username}
        </p>
        <p className="text-xs text-primary-white/70 truncate">
          @{user.username}
        </p>
      </div>
    </div>
  )
}
