import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Base Challenge",
  description: "Join the daily show up challenge on Base",
};

// MINIMAL LAYOUT FOR DEBUGGING WHITE SCREEN
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
