"use client";

import { useStationStore } from "@/store/useStationStore";
import { ParkingMapIsometric } from "./ParkingMapIsometric";
import { cn } from "../../../lib/utils";
import { useEffect, useState } from "react";

export const StationMapModal = () => {
  const { selectedStation, setSelectedStation } = useStationStore();
  const [isClosing, setIsClosing] = useState(false);

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedStation(null);
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  const isRapid = selectedStation?.type.code === "06";

  if (!selectedStation && !isClosing) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300",
      isClosing ? "opacity-0" : "opacity-100"
    )}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className={cn(
        "relative w-full max-w-lg bg-gray-900/90 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-2xl transition-all duration-300 transform",
        isClosing ? "scale-95 translate-y-4" : "scale-100 translate-y-0 animate-in zoom-in-95 fade-in duration-300"
      )}>
        {/* Header */}
        <div className="p-6 pb-2 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-1.5 rounded-lg border",
                isRapid ? "text-warning-400 border-warning-500/30 bg-warning-500/10" : "text-secondary-blue-400 border-secondary-blue-500/30 bg-secondary-blue-500/10"
              )}>
                {isRapid ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 10V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h1v4h-2c-1.1 0-2 .9-2 2v2h14v-2c0-1.1-.9-2-2-2h-2v-4h1c1.1 0 2-.9 2-2z" /></svg>
                )}
              </div>
              <h3 className="text-xl font-black text-white tracking-tight font-[family-name:var(--font-daki)]">
                {isRapid ? "급속" : "완속"} 충전기 {selectedStation?.searchKey}
              </h3>
            </div>
            <p className="text-sm text-gray-300 font-medium ml-0.5">지하 {selectedStation?.floor}층 하행 램프 및 14번 기둥 옆</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2.5 hover:bg-white/5 rounded-full transition-all text-gray-300 hover:text-white group"
          >
            <svg className="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Map Visualization Area */}
        <div className="px-6 py-4">
          <div className="relative rounded-2xl bg-black/40 border border-white/5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none"></div>
            <ParkingMapIsometric floor={selectedStation?.floor || ""} />
          </div>

          <div className="mt-8 text-center space-y-3 pb-4">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-success-500/10 border border-success-500/20 rounded-2xl">
              <div className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse"></div>
              <span className="text-success-400 text-[11px] font-black uppercase tracking-[0.2em]">South-East (SE) Corner</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-[280px] mx-auto font-medium">
              현재 층의 <span className="text-gray-100">남동쪽 건물 코너</span>에 스테이션이 위치해 있습니다. 모든 층(B3-B5)의 위치는 동일합니다.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-6 bg-white/5 border-t border-white/5 flex flex-col gap-3">
          <button
            onClick={handleClose}
            className="w-full py-4 bg-white text-gray-950 font-black rounded-2xl hover:bg-gray-200 transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98] text-sm tracking-wide"
          >
            확인 완료
          </button>
        </div>
      </div>
    </div>
  );
};
