'use client'

import { useAutoUpdateProfile } from '@/hooks/useAutoUpdateProfile'

export function ProfileAutoUpdater() {
  useAutoUpdateProfile()
  return null
}
