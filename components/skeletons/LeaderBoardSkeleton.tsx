'use client'

import Skeleton from '../Skeleton'

export default function LeaderBoardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border-2 border-light-blue dark:border-orange-900">
      <div className="mb-6 flex items-center gap-2">
        <span className="text-2xl">🏆</span>
        <Skeleton className="w-40 h-6" />
      </div>
      
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-light-blue/40 to-soft-orange/20 dark:from-orange-900/20 dark:to-orange-800/10 rounded-lg min-h-[60px] border border-light-blue dark:border-orange-900/50"
          >
            <Skeleton className="w-8 h-6" />
            <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
            
            <div className="flex-1 space-y-2">
              <Skeleton className="w-32 h-4" />
              <Skeleton className="w-24 h-3" />
            </div>
            
            <div className="text-right space-y-2">
              <Skeleton className="w-16 h-4 ml-auto" />
              <Skeleton className="w-12 h-3 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
