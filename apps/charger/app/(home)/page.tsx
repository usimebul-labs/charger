"use client"

import { useEffect, useState } from "react";
import { ActionBar } from "./_components/ActionBar";
import { DashboardHeader } from "./_components/DashboardHeader";
import { Legend } from "./_components/Legend";
import { SplashScreen } from "./_components/SplashScreen";
import { StationGrid } from "./_components/StationGrid";
import { SummaryCard } from "./_components/SummaryCard";

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

      <div className="flex min-h-0 flex-1 flex-col">
        <DashboardHeader />

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3.5 pb-1.5 pt-2.5">
          <SummaryCard />
          <StationGrid />
          <Legend />
        </div>

        <ActionBar />
      </div>
    </>
  );
}
