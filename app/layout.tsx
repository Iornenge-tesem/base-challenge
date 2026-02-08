import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Script from "next/script";
import BottomNav from "@/components/BottomNav";
import TopRightAvatar from "@/components/TopRightAvatar";
import ReferralTracker from "@/components/ReferralTracker";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Base Challenge - Show Up Daily",
  description: "Join the daily show up challenge on Base",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "https://base-challenge-iota.vercel.app/icon.png",
    "fc:frame:button:1": "Launch Base Challenge",
    "fc:frame:button:1:action": "launch_frame",
    "fc:frame:button:1:target": "https://base-challenge-iota.vercel.app",
  },
};

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
      <body
        className={`${inter.className} bg-primary-light-mode-blue dark:bg-primary-dark-blue text-primary-dark-blue dark:text-primary-white`}
      >
        <Providers>
          <ReferralTracker />
          <TopRightAvatar />
          {children}
          <BottomNav />
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
