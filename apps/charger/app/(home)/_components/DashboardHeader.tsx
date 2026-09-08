"use client"
import { upsertStations } from "@/app/actions/charger";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { useStations } from "../_hooks/useStations";
import { NotificationButton } from "./NotificationButton";

/** `2026-09-08T14:41` → `9월 8일 오후 2:41` */
const formatUpdatedAt = (timestamp: number) => {
  const d = new Date(timestamp);
  const hours = d.getHours();
  const meridiem = hours < 12 ? "오전" : "오후";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${meridiem} ${hour12}:${String(d.getMinutes()).padStart(2, "0")}`;
};

export const DashboardHeader = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { refetch, dataUpdatedAt } = useStations();

  const lastUpdated = useMemo(
    () => (dataUpdatedAt ? formatUpdatedAt(dataUpdatedAt) : "--"),
    [dataUpdatedAt]
  );

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
    <header className="header-surface z-40 flex-none border-b border-border px-4 pb-3 pt-[calc(env(safe-area-inset-top)+1.25rem)]">
      <div className="flex items-center gap-2.5">
        <div className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-[9px] bg-brand-500">
          <svg width="13" height="17" viewBox="0 0 13 17" fill="none" aria-hidden="true">
            <path d="M7.4 0.5L0.8 9.2h4.1L4.4 16.5 11.9 7.2H7.6L8.5 0.5z" className="fill-on-brand" />
          </svg>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-px">
          <h1 className="text-[16.5px] font-bold leading-[1.15] tracking-[-0.4px] text-foreground">
            충전현황
          </h1>
          <p className="truncate text-[11px] leading-[1.2] text-muted-foreground">
            다우디지털스퀘어 · 지하주차장
          </p>
        </div>

        <NotificationButton />

        <button
          onClick={refresh}
          disabled={isRefreshing}
          aria-label="충전 현황 새로고침"
          className={cn(
            "flex h-9 w-9 flex-none items-center justify-center rounded-xl border border-line-strong bg-elevated text-foreground transition-colors",
            isRefreshing ? "cursor-not-allowed opacity-50" : "hover:bg-elevated-hover active:scale-95"
          )}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className={cn(isRefreshing && "animate-spin-once")}
          >
            <path
              d="M14 8a6 6 0 1 1-1.8-4.3M14 1.5V4h-2.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="mt-2.5 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 flex-none animate-breathe rounded-full bg-brand-500" />
        <span className="text-[11.5px] tracking-[-0.1px] text-subtle-foreground">
          {lastUpdated} 기준
        </span>
      </div>
    </header>
  );
};
