'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    {
      label: 'Home',
      icon: '🏠',
      href: '/',
    },
    {
      label: 'Leaderboard',
      icon: '🏆',
      href: '/leaderboard',
    },
    {
      label: 'Profile',
      icon: '👤',
      href: '/profile',
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-primary-modal-light dark:bg-primary-light-blue border-t-2 border-primary-modal-light dark:border-primary-light-blue safe-area-bottom z-40 shadow-lg">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 min-w-[60px] min-h-[48px] px-3 rounded-lg transition-all ${
                  isActive
                    ? 'text-accent-green font-bold'
                    : 'text-accent-gray hover:text-primary-white dark:hover:text-primary-white'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
