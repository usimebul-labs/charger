"use client";

import { useStationStore } from "@/store/useStationStore";
import { useToastStore } from "@/store/useToastStore";
import { useCallback, useEffect, useState } from "react";
import { cn } from "../../../lib/utils";
import {
  CHARGER_TYPES,
  formatDuration,
  getChargerState,
  minutesSince,
  STATE_META,
} from "../_utils/charger";
import { ParkingMapIsometric } from "./ParkingMapIsometric";
import { StatusBadge } from "./StatusBadge";

const Tile = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl bg-elevated px-[11px] py-2.5">
    <div className="mb-[3px] text-[10px] text-muted-foreground">{label}</div>
    <div className="truncate text-[15px] font-bold tracking-[-0.4px] text-foreground">{value}</div>
  </div>
);

/**
 * Charger detail — a bottom sheet, per the mockup. Keeps the isometric parking
 * map so the reader can still find the bay physically.
 */
export const StationMapModal = () => {
  const { selectedStation, selectedStationIndex, setSelectedStation } = useStationStore();
  const showToast = useToastStore((s) => s.show);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedStation(null, null);
      setIsClosing(false);
    }, 220);
  }, [setSelectedStation]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleClose]);

  if (!selectedStation) return null;

  const isRapid = selectedStation.type.code === CHARGER_TYPES.RAPID;
  const state = getChargerState(selectedStation.status.code);
  const elapsed = state === "free" ? null : minutesSince(selectedStation.lastStatusChangedAt);

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(String(selectedStation.searchKey));
      showToast("충전기 번호를 복사했습니다");
    } catch {
      showToast("번호를 복사하지 못했습니다");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center">
      <div className="relative flex w-full max-w-[480px] flex-col justify-end">
        <div
          onClick={handleClose}
          className={cn(
            "scrim absolute inset-0 transition-opacity duration-200",
            isClosing ? "opacity-0" : "animate-fade-in opacity-100"
          )}
        />

        <div
          className={cn(
            "relative rounded-t-[20px] border-t border-line-strong bg-surface px-[18px] pb-5 pt-2 shadow-[0_-12px_40px_rgba(0,0,0,0.45)]",
            isClosing ? "translate-y-full transition-transform duration-200" : "animate-sheet-up"
          )}
        >
          <div className="mx-auto mb-3.5 h-1 w-9 rounded-sm bg-foreground/16" />

          <div className="flex items-start gap-2.5">
            <div className="min-w-0 flex-1">
              <button
                onClick={copyId}
                className="tabular flex items-center gap-1.5 text-xl font-extrabold tracking-[-0.7px] text-foreground active:scale-[0.98]"
              >
                {selectedStation.searchKey}
                <svg className="h-3.5 w-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
              </button>
              <div className="mt-[3px] text-[11.5px] text-muted-foreground">
                지하 {selectedStation.floor.slice(1)}층 14번 기둥 · {isRapid ? "급속" : "완속"} 충전기
              </div>
            </div>

            <StatusBadge
              status={selectedStation.status}
              lastStatusChangedAt={selectedStation.lastStatusChangedAt}
              hideElapsed
            />
          </div>

          <div className="relative mt-3 h-[150px] overflow-hidden rounded-xl border border-border bg-elevated">
            <ParkingMapIsometric
              floor={selectedStation.floor}
              highlightIndex={selectedStationIndex}
            />
          </div>

          <div className="my-3 grid grid-cols-2 gap-[7px]">
            <Tile label="충전 경과 시간" value={elapsed === null ? "-" : formatDuration(elapsed)} />
            <Tile label="충전기 종류" value={`${isRapid ? "급속" : "완속"} ${selectedStation.capacity}`} />
            <Tile label="호환 어댑터" value={selectedStation.type.adapter || "정보 없음"} />
            <Tile label="충전 상태" value={selectedStation.status.value} />
          </div>

          <p className="mb-3 text-[11.5px] leading-[1.5] text-muted-foreground">
            {selectedStation.status.desc || STATE_META[state].hint}
          </p>

          <button
            onClick={handleClose}
            className="h-[46px] w-full rounded-[13px] bg-brand-500 text-[13.5px] font-bold tracking-[-0.3px] text-on-brand transition-colors hover:bg-brand-400 active:scale-[0.99]"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
