import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { BottomNav } from "./_components/BottomNav";
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
      <body className={`${geistSans.variable} ${geistMono.variable} ${daki.variable} h-svh overflow-hidden`}>
        <SpeedInsights />
        <Analytics />
        <Providers>
          <div className="h-svh bg-background flex justify-center selection:bg-brand-500/30 font-[family-name:var(--font-daki)]">
            {/* Mobile Frame Container */}
            <div className="w-full max-w-[480px] h-svh bg-background border-x border-border/20 relative flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto pb-[68px]">
                {children}
              </div>
              <BottomNav />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
