"use client";

import { useStationStore } from "@/store/useStationStore";
import { ParkingMapIsometric } from "./ParkingMapIsometric";
import { cn } from "../../../lib/utils";
import { useEffect, useState } from "react";
import Image from "next/image";

export const StationMapModal = () => {
  const { selectedStation, selectedStationIndex, setSelectedStation } = useStationStore();
  const [isClosing, setIsClosing] = useState(false);
  const [copied, setCopied] = useState(false);

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
      setSelectedStation(null, null);
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
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
        <div className="p-6 pb-2 flex items-start justify-between">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-1.5 rounded-lg border",
                isRapid ? "text-warning-400 border-warning-500/30 bg-warning-500/10" : "text-secondary-blue-400 border-secondary-blue-500/30 bg-secondary-blue-500/10"
              )}>
                {isRapid ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 10V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h1v4h-2c-1.1 0-2 .9-2 2v2h14v-2c0-1.1-.9-2-2-2h-2v-4h1c1.1 0 2-.9 2-2z" /></svg>
                )}
              </div>
              <h3 className="text-xl font-black text-white tracking-tight font-[family-name:var(--font-daki)]">
                {isRapid ? "급속" : "완속"} 충전 스테이션
              </h3>
            </div>
            <p className="text-sm text-gray-300 font-medium ml-0.5">
              지하 <span className="text-secondary-blue-400 font-black text-base">{selectedStation?.floor}</span>층 14번 기둥 옆
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleClose}
              className="p-2.5 hover:bg-white/5 rounded-full transition-all text-gray-400 hover:text-white group"
            >
              <svg className="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Map Visualization Area */}
        <div className="px-6 py-4">
          <div className="relative rounded-2xl bg-black/60 border border-white/10 overflow-hidden shadow-inner h-[150px]">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none"></div>
            <ParkingMapIsometric floor={selectedStation?.floor || ""} highlightIndex={selectedStationIndex} />
          </div>

          <div className="mt-4 bg-gray-950/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              {(() => {
                const code = selectedStation?.status.code;
                const isWarning = code === "8" || code === "9";
                const isSuccess = code === "2";
                const isBlue = code === "6" || code === "1";
                
                let colorClasses = "bg-error-500/10 border-error-500/20 text-error-400";
                if (isWarning) colorClasses = "bg-warning-500/10 border-warning-500/20 text-warning-400";
                else if (isSuccess) colorClasses = "bg-success-500/10 border-success-500/20 text-success-400";
                else if (isBlue) colorClasses = "bg-secondary-blue-500/10 border-secondary-blue-500/20 text-secondary-blue-400";

                return (
                  <div className={cn("px-3 py-1 border rounded-lg min-w-[66px]", colorClasses.split(' ').slice(0, 2).join(' '))}>
                    <span className={cn("text-[10px] font-black uppercase tracking-widest text-center", colorClasses.split(' ')[2])}>
                      {selectedStation?.status.value}
                    </span>
                  </div>
                );
              })()}
              <div className="h-4 w-px bg-white/10"></div>
              <span className="text-xs text-gray-300 font-medium leading-relaxed">
                {selectedStation?.status.desc}
              </span>
            </div>
          </div>
        </div>

        {/* Info Bars */}
        <div className="px-6 grid grid-cols-2 gap-2 mb-4">
          {/* ID */}
          <button
            onClick={() => copyToClipboard(String(selectedStation?.searchKey))}
            className="bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 flex flex-col gap-0.5 text-left hover:bg-white/10 active:scale-[0.97] transition-all group"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[9px] text-gray-300 font-black uppercase tracking-widest">ID</span>
              {copied ? (
                <span className="text-[8px] font-bold text-success-400 animate-in fade-in transition-all">COPIED</span>
              ) : (
                <svg className="w-3 h-3 text-gray-300 group-hover:text-secondary-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
              )}
            </div>
            <span className="text-[11px] text-white font-mono font-bold">{selectedStation?.searchKey}</span>
          </button>

          {/* Type */}
          <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 flex flex-col gap-0.5">
            <span className="text-[9px] text-gray-300 font-black uppercase tracking-widest">충전 방식</span>
            <span className="text-[11px] text-gray-100 font-bold truncate">
              {isRapid ? "급속" : "완속"}
            </span>
          </div>

          {/* Adapter */}
          <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 flex flex-col gap-0.5">
            <span className="text-[9px] text-gray-300 font-black uppercase tracking-widest">호환 어댑터</span>
            <span className="text-[11px] text-gray-100 font-bold truncate">
              {selectedStation?.type.adapter || "정보 없음"}
            </span>
          </div>

          {/* Capacity */}
          <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 flex flex-col gap-0.5">
            <span className="text-[9px] text-gray-300 font-black uppercase tracking-widest">충전 용량</span>
            <span className="text-[11px] text-gray-100 font-bold">{selectedStation?.capacity}</span>
          </div>
        </div>



        {/* Footer */}
        <div className="px-6 py-6 bg-white/5 border-t border-white/5 flex flex-col gap-3">
          <button
            onClick={handleClose}
            className="w-full py-4 bg-white text-gray-950 font-black rounded-2xl hover:bg-gray-200 transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98] text-sm tracking-wide"
          >확인
          </button>
        </div>
      </div>
    </div>
  );
};
