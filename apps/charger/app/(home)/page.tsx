"use client"

import { useEffect, useState } from "react";
import { ActionBar } from "./_components/ActionBar";
import { DashboardHeader } from "./_components/DashboardHeader";
import { Legend } from "./_components/Legend";
import { SplashScreen } from "./_components/SplashScreen";
import { StationGrid } from "./_components/StationGrid";
import { SummaryCard } from "./_components/SummaryCard";

/**
 * 스플래시는 세션당 한 번. sessionStorage 는 서버 렌더와 값이 어긋나므로
 * 첫 렌더 판단은 모듈 플래그로 하고, 새로고침 대비 확인만 effect 에서 한다.
 * 덕분에 탭을 오갈 때 스플래시가 한 프레임 번쩍이지 않는다.
 */
let splashSeen = false;

export default function Home() {
  const [showSplash, setShowSplash] = useState(!splashSeen);

  useEffect(() => {
    if (sessionStorage.getItem('splash_shown')) {
      splashSeen = true;
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem('splash_shown', 'true');
    splashSeen = true;
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      <div className="flex min-h-0 flex-1 flex-col">
        <DashboardHeader />

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-3.5 pb-1.5 pt-2.5">
          <SummaryCard />
          <StationGrid />
          <Legend />
        </div>

        <ActionBar />
      </div>
    </>
  );
}
