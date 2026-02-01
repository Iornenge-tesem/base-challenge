'use client'

import Skeleton from '../Skeleton'

export default function CheckInButtonSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-3 text-center border-2 border-light-blue dark:border-orange-900">
      <div className="space-y-2">
        <Skeleton className="w-40 h-5 mx-auto" />
        <Skeleton className="w-56 h-3 mx-auto" />
        <Skeleton className="w-full h-10 rounded-lg" />
      </div>
    </div>
  )
}
