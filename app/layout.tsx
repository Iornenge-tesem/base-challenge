import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import Script from 'next/script'
import BottomNav from '@/components/BottomNav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Base Challenge - Show Up Daily',
  description: 'Join the daily show up challenge on Base',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  other: {
    'base:app_id': '6960e7348a6eeb04b568d95e',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Script
        id="theme-init"
        strategy="beforeInteractive"
      >
        {`(function(){try{var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var e=t?t==='dark':d;document.documentElement.classList.toggle('dark',e);}catch(e){}})();`}
      </Script>
      <body className={`${inter.className} bg-primary-light-mode-blue dark:bg-primary-dark-blue text-primary-dark-blue dark:text-primary-white`}>
        <Providers>
          {children}
          <BottomNav />
        </Providers>
      </body>
    </html>
  )
}
