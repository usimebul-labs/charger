import Image from "next/image";
import React, { useMemo, useState } from "react";
import { useStations } from "../_hooks/useStations";
import { upsertStations } from "@/app/actions/charger";
import { isAvailable } from "../_utils/charger";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

export const DashboardHeader = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data: stations, refetch, dataUpdatedAt } = useStations();

  const lastUpdated = useMemo(() => {
    if (!dataUpdatedAt) return "--:--:--";
    return new Date(dataUpdatedAt).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }, [dataUpdatedAt]);

  const slowCount = useMemo(() => ({
    available: stations?.filter((s) => s.type.code === "02" && isAvailable(s.status.code)).length || 0,
    total: stations?.filter((s) => s.type.code === "02").length || 0
  }), [stations]);

  const fastCount = useMemo(() => ({
    available: stations?.filter((s) => s.type.code === "06" && isAvailable(s.status.code)).length || 0,
    total: stations?.filter((s) => s.type.code === "06").length || 0
  }), [stations]);

  const refresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);

    try {
      // Ensure the animation lasts at least 700ms for visual consistency
      const minDuration = new Promise((resolve) => setTimeout(resolve, 700));
      const refreshTask = (async () => {
        await upsertStations();
        await refetch();
      })();

      await Promise.all([refreshTask, minDuration]);
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <header className="bg-background/80 border-b border-border/20 sticky top-0 z-50 backdrop-blur-xl px-6 pt-6 pb-2 sm:px-10 overflow-hidden mb-2">
      {/* Subtle background glow decorator */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>

      <div className="relative flex flex-col">
        <h1 className="font-bold text-foreground tracking-tight flex flex-row justify-between items-end leading-tight">
          <div className="relative h-6 sm:h-8 w-40 sm:w-56">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              className="object-contain object-left dark:brightness-100 brightness-0 invert-0 dark:invert-0"
              priority
            />
          </div>
          <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest font-mono mb-0.5">
            Updated: {lastUpdated}
          </span>
        </h1>

        <div className="flex items-center justify-end pt-4">
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="flex items-center gap-3 text-[10px] sm:text-xs text-muted-foreground font-black uppercase tracking-widest">
              <div className="flex items-center gap-1.5">
                <svg className="w-3 h-3 text-info-text" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 10V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h1v4h-2c-1.1 0-2 .9-2 2v2h14v-2c0-1.1-.9-2-2-2h-2v-4h1c1.1 0 2-.9 2-2z" />
                </svg>
                <span>완속 <span className="text-success-400">{slowCount.available}</span><span className="text-muted-foreground/50 mx-0.5">/</span><span className="text-muted-foreground">{slowCount.total}</span></span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-3 h-3 text-warning-text" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>급속 <span className="text-success-400">{fastCount.available}</span><span className="text-muted-foreground/50 mx-0.5">/</span><span className="text-muted-foreground">{fastCount.total}</span></span>
              </div>
            </div>
            <button
              onClick={refresh}
              disabled={isRefreshing}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all duration-300 active:scale-95 group",
                isRefreshing
                  ? "bg-success-500/5 text-success-500/50 border-success-500/10 cursor-not-allowed"
                  : "bg-success-500/10 hover:bg-success-500/20 text-success-400 border-success-500/30"
              )}
            >
              <svg
                className={cn(
                  "w-3.5 h-3.5 transition-transform duration-500",
                  isRefreshing && "animate-spin-once"
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-[10px] font-black uppercase tracking-wider">
                {isRefreshing ? "갱신 중..." : "새로고침"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
