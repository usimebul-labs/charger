import type { Metadata } from "next";
import localFont from "next/font/local";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${daki.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
