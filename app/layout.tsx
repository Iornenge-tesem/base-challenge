import type { Metadata } from 'next'
import './globals.css'

const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://base-challenge-iota.vercel.app'

export const metadata: Metadata = {
  title: 'Base Challenge',
  description: 'Join the daily show up challenge on Base',
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${baseUrl}/icon.png`,
    'fc:frame:button:1': 'Open App',
    'fc:frame:button:1:action': 'launch_frame',
    'fc:frame:button:1:target': baseUrl,
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0a2540', color: 'white', fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
