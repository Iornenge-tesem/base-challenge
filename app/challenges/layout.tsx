import type { Metadata } from 'next'

export const metadata: Metadata = {
  other: {
    'base:app_id': '6960e7348a6eeb04b568d95e',
  },
}

export default function ChallengesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
