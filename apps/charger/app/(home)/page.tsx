"use client"

import { DashboardButtons } from "./_components/DashboardButtons";
import { DashboardHeader } from "./_components/DashboardHeader";
import { StationGrid } from "./_components/StationGrid";
import { PWAInstallButton } from "./_components/PWAInstallButton";
import { useState, useEffect } from "react";
import { SplashScreen } from "./_components/SplashScreen";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem('splash_shown')) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem('splash_shown', 'true');
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <div className="flex flex-col min-h-full">
        <DashboardHeader />
        <main className="flex-1 px-6 pt-2 pb-8">
          <DashboardButtons />
          <StationGrid />
        </main>
        <PWAInstallButton />
      </div>
    </>
  );
}
