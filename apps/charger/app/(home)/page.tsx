"use client"
import { useState } from "react";
import { DashboardButtons } from "./_components/DashboardButtons";
import { DashboardHeader } from "./_components/DashboardHeader";
import { StationGrid } from "./_components/StationGrid";
import { SplashScreen } from "./_components/SplashScreen";
import { PWAInstallButton } from "./_components/PWAInstallButton";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <div className="h-svh bg-background flex justify-center selection:bg-brand-500/30 font-[family-name:var(--font-daki)]">
        {/* Mobile Frame Container */}
        <div className="w-full max-w-[480px] h-svh bg-background border-x border-border/20 relative flex flex-col pb-8 overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 px-6 pt-2">
            <DashboardButtons />
            <StationGrid />
          </main>
          <PWAInstallButton />
        </div>
      </div>
    </>
  );
}
