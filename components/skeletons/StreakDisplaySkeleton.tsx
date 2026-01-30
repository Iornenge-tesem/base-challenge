'use client'

import Skeleton from '../Skeleton'

export default function StreakDisplaySkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border-2 border-light-blue dark:border-orange-900">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="text-center p-6 bg-gradient-to-br from-light-blue to-sky-blue/20 dark:from-orange-900/30 dark:to-orange-800/10 rounded-xl border border-sky-blue/30">
          <Skeleton className="w-16 h-16 mx-auto mb-4 rounded-full" />
          <Skeleton className="w-20 h-8 mx-auto mb-2" />
          <Skeleton className="w-24 h-4 mx-auto" />
        </div>
        
        <div className="text-center p-6 bg-gradient-to-br from-soft-orange/30 to-bright-orange/10 dark:from-orange-900/40 dark:to-orange-800/20 rounded-xl border border-bright-orange/30">
          <Skeleton className="w-16 h-16 mx-auto mb-4 rounded-full" />
          <Skeleton className="w-20 h-8 mx-auto mb-2" />
          <Skeleton className="w-24 h-4 mx-auto" />
        </div>
      </div>

      <Skeleton className="mt-6 w-full h-12 rounded-lg" />
    </div>
  )
}
