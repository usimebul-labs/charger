"use client";

import { useStations } from "../_hooks/useStations";
import { isAvailable } from "../_utils/charger";
import { EmptyState } from "./EmptyState";
import { StationCard } from "./StationCard";
import { StationMapModal } from "./StationMapModal";

const floors = ["B3", "B4", "B5"];

const FloorSkeleton = () => (
  <div className="rounded-[15px] border border-border bg-surface p-2.5">
    <div className="mb-2 h-3.5 w-24 rounded bg-foreground/8" />
    <div className="grid grid-cols-3 gap-1.5">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-[92px] rounded-t-[3px] rounded-b-[11px] bg-foreground/5" />
      ))}
    </div>
  </div>
);

export const StationGrid = () => {
  const { data: stations, isPending } = useStations();

  // 스켈레톤은 보여줄 직전 데이터가 아예 없을 때만 — 갱신 중에는 기존 현황을 유지한다
  if (isPending) {
    return (
      <div className="flex animate-pulse flex-col gap-2">
        {floors.map((floor) => (
          <FloorSkeleton key={floor} />
        ))}
      </div>
    );
  }

  if (!stations) {
    return (
      <div className="rounded-[15px] border border-border bg-surface px-4 py-10 text-center">
        <p className="text-sm font-bold text-foreground">충전 현황을 불러오지 못했습니다</p>
        <p className="mt-1.5 text-xs text-muted-foreground">
          잠시 후 상단의 새로고침을 눌러 다시 시도해 주세요.
        </p>
      </div>
    );
  }

  if (stations.length === 0) return <EmptyState />;

  return (
    <>
      <div className="flex flex-col gap-2">
        {floors.map((floor) => {
          const floorStations = stations.filter((s) => s.floor === floor);
          if (floorStations.length === 0) return null;

          const available = floorStations.filter((s) => isAvailable(s.status.code)).length;

          return (
            <section
              key={floor}
              className="flex flex-col rounded-[15px] border border-border bg-surface px-2.5 pb-2.5 pt-2.5"
            >
              <div className="flex items-center gap-1.5 px-0.5 pb-2">
                <span className="rounded bg-foreground/72 px-1 py-px text-[10px] font-extrabold tracking-[0.2px] text-background">
                  {floor}
                </span>
                <span className="text-[12.5px] font-semibold tracking-[-0.3px] text-foreground">
                  지하 {floor.slice(1)}층 14번 기둥
                </span>
                <span className="flex-1" />
                <span className="tabular text-[11px] text-subtle-foreground">
                  가능 {available} · 사용 {floorStations.length - available}
                </span>
              </div>

              {/* Stalls mirror the physical bay order, hence dir="rtl" */}
              <div className="grid grid-cols-3 gap-1.5" dir="rtl">
                {floorStations.map((station, index) => (
                  <StationCard key={station.id} station={station} index={index} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Global Station Detail Sheet */}
      <StationMapModal />
    </>
  );
};
