'use client'

interface SkeletonProps {
  className?: string
  count?: number
}

export default function Skeleton({ className = '', count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-gradient-to-r from-light-blue/40 to-soft-orange/20 dark:from-orange-900/30 dark:to-orange-800/10 rounded-lg ${className}`}
        />
      ))}
    </>
  )
}
