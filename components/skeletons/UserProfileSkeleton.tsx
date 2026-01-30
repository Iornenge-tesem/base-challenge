'use client'

import Skeleton from '../Skeleton'

export default function UserProfileSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-light-blue dark:border-orange-900">
      <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
      
      <div className="flex-1 space-y-2">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-16 h-3" />
      </div>
    </div>
  )
}
