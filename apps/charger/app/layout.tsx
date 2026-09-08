import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { BottomNav } from "./_components/BottomNav";
import { Toast } from "./_components/Toast";
import "./globals.css";
import Providers from "./providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});
const daki = localFont({
  src: "./fonts/DakiB.woff2",
  variable: "--font-daki",
});

export const metadata: Metadata = {
  title: "다우디지털스퀘어 충전 현황 서비스",
  description: "다우디지털스퀘어 충전 현황 및 충전 대기 알림 서비스",
  manifest: "/manifest.json"
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  // Removed fixed themeColor to allow browser to handle theme switching better
}

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="ko">
      <head>
        {/* Pretendard — the mockup's typeface */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${daki.variable} h-svh overflow-hidden`}>
        <SpeedInsights />
        <Analytics />
        <Providers>
          <div className="flex h-svh justify-center bg-background font-sans selection:bg-brand-500/30">
            {/* Mobile Frame Container */}
            <div className="relative flex h-svh w-full max-w-[480px] flex-col overflow-hidden border-x border-border bg-background">
              <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
                {children}
              </main>
              <BottomNav />
              <Toast />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
