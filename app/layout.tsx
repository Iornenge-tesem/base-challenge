import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Script from "next/script";
import BottomNav from "@/components/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Base Challenge - Show Up Daily",
    description: "Join the daily show up challenge on Base",
    icons: {
      icon: "/icon.svg",
      apple: "/icon.svg",
    },
    other: {
      "fc:miniapp": JSON.stringify({
        version: "next",
        imageUrl: "https://base-challenge-iota.vercel.app/icon.svg",
        "base:app_id": "697d6a6fc6a03f3fe39cb530",
        button: {
          title: `Launch Base Challenge`,
          action: {
            type: "launch_miniapp",
            name: "Base Challenge",
            url: "https://base-challenge-iota.vercel.app",
            splashImageUrl: "https://base-challenge-iota.vercel.app/icon.svg",
            splashBackgroundColor: "#0a2540 ",
          },
        },
      }),
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Script id="theme-init" strategy="beforeInteractive">
        {`(function(){try{var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var e=t?t==='dark':d;document.documentElement.classList.toggle('dark',e);}catch(e){}})();`}
      </Script>
      <Script id="farcaster-sdk-init" strategy="afterInteractive">
        {`
          (function() {
            try {
              if (window.farcaster && window.farcaster.actions && window.farcaster.actions.ready) {
                window.farcaster.actions.ready();
                console.log('✅ SDK ready via window.farcaster');
              } else {
                console.log('⚠️ window.farcaster not available');
              }
            } catch (e) {
              console.error('SDK init error:', e);
            }
          })();
        `}
      </Script>
      <body
        className={`${inter.className} bg-primary-light-mode-blue dark:bg-primary-dark-blue text-primary-dark-blue dark:text-primary-white`}
      >
        <Providers>
          {children}
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
