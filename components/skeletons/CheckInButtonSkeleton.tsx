'use client'

import Skeleton from '../Skeleton'

export default function CheckInButtonSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 text-center border-2 border-light-blue dark:border-orange-900">
      <div className="space-y-4">
        <Skeleton className="w-64 h-8 mx-auto" />
        <Skeleton className="w-80 h-4 mx-auto" />
        <Skeleton className="w-full h-14 rounded-xl" />
      </div>
    </div>
  )
}
