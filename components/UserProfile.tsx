'use client'

import { useEffect, useState } from 'react'

interface UserProfileProps {
  address?: string | null
  username?: string
  avatar?: string
  showThemeToggle?: boolean
}

export default function UserProfile({ address, username, avatar, showThemeToggle = false }: UserProfileProps) {
  if (!address) return null

  const [isDark, setIsDark] = useState(false)
  const [hasManualPreference, setHasManualPreference] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    const getStoredTheme = () => {
      const stored = localStorage.getItem('theme')
      return stored === 'dark' || stored === 'light' ? stored : null
    }

    const applyThemeState = (dark: boolean, manual: boolean) => {
      setIsDark(dark)
      setHasManualPreference(manual)
    }

    const storedTheme = getStoredTheme()
    if (storedTheme) {
      applyThemeState(storedTheme === 'dark', true)
    } else {
      applyThemeState(media.matches, false)
    }

    const handleMediaChange = (event: MediaQueryListEvent) => {
      const stored = getStoredTheme()
      if (stored) return
      applyThemeState(event.matches, false)
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== 'theme') return
      const stored = getStoredTheme()
      if (stored) {
        applyThemeState(stored === 'dark', true)
      } else {
        applyThemeState(media.matches, false)
      }
    }

    if (media.addEventListener) {
      media.addEventListener('change', handleMediaChange)
    } else {
      media.addListener(handleMediaChange)
    }
    window.addEventListener('storage', handleStorage)

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', handleMediaChange)
      } else {
        media.removeListener(handleMediaChange)
      }
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const toggleTheme = () => {
    const nextIsDark = !isDark
    setIsDark(nextIsDark)
    setHasManualPreference(true)
    localStorage.setItem('theme', nextIsDark ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', nextIsDark)
  }

  return (
    <div className="flex items-center gap-3 p-4 bg-white dark:bg-primary-light-blue rounded-xl shadow-md border border-primary-light-mode-blue dark:border-accent-green">
      <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-accent-green to-accent-green-dark flex items-center justify-center">
        {avatar ? (
          <img src={avatar} alt={username || 'User'} className="w-full h-full object-cover" />
        ) : (
          <span className="text-primary-dark-blue font-bold text-lg">
            {username?.[0]?.toUpperCase() || '?'}
          </span>
        )}
      </div>
      
      <div className="flex-1">
        <div className="font-semibold text-primary-dark-blue dark:text-primary-white">
          {username || 'Anonymous User'}
        </div>
        <div className="text-sm text-primary-dark-blue dark:text-accent-light-gray">
          Connected
        </div>
      </div>

      {showThemeToggle && (
        <button
          onClick={toggleTheme}
          className="min-h-[44px] px-3 py-2 text-sm font-medium rounded-lg border border-primary-light-mode-blue dark:border-accent-green bg-white/80 dark:bg-primary-light-blue text-primary-dark-blue dark:text-primary-dark-blue hover:bg-accent-green/40 dark:hover:bg-accent-green/30 transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? '🌙 Dark' : '☀️ Light'}
        </button>
      )}
    </div>
  )
}
