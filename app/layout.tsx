import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Base Challenge',
  description: 'Join the daily show up challenge on Base',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.onerror = function(msg, url, line, col, error) {
              document.body.innerHTML = '<div style="padding:20px;color:white;background:#0a2540;min-height:100vh;font-family:sans-serif"><h1>JS Error</h1><p>' + msg + '</p><p>Line: ' + line + '</p></div>';
              return true;
            };
          `
        }} />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0a2540' }}>
        {children}
      </body>
    </html>
  )
}
