"use client";

import { useStationStore } from "@/store/useStationStore";
import { ParkingMapIsometric } from "./ParkingMapIsometric";
import { cn } from "../../../lib/utils";
import { useEffect, useState } from "react";
import Image from "next/image";
import { StatusBadge } from "./StatusBadge";

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
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className={cn(
        "relative w-full max-w-lg bg-card dark:bg-card/80 dark:backdrop-brightness-110 border border-border/50 rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-2xl transition-all duration-300 transform",
        isClosing ? "scale-95 translate-y-4" : "scale-100 translate-y-0 animate-in zoom-in-95 fade-in duration-300"
      )}>
        {/* Header */}
        <div className="p-6 pb-2 flex items-start justify-between">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-1.5 rounded-lg border",
                isRapid ? "text-warning-600 dark:text-warning-400 border-warning-500/40 bg-warning-500/10" : "text-secondary-blue-600 dark:text-secondary-blue-400 border-secondary-blue-500/40 bg-secondary-blue-500/10"
              )}>
                {isRapid ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 10V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h1v4h-2c-1.1 0-2 .9-2 2v2h14v-2c0-1.1-.9-2-2-2h-2v-4h1c1.1 0 2-.9 2-2z" /></svg>
                )}
              </div>
              <h3 className="text-xl font-black text-foreground tracking-tight font-[family-name:var(--font-daki)]">
                {isRapid ? "급속" : "완속"} 충전 스테이션
              </h3>
            </div>
            <p className="text-sm text-muted-foreground font-medium ml-0.5">
              지하 <span className="text-secondary-blue-600 dark:text-secondary-blue-400 font-black text-base">{selectedStation?.floor}</span>층 14번 기둥 옆
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleClose}
              className="p-2.5 hover:bg-muted/50 rounded-full transition-all text-muted-foreground hover:text-foreground group"
            >
              <svg className="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Map Visualization Area */}
        <div className="px-6 py-4">
          <div className="relative rounded-2xl bg-muted/60 dark:bg-muted/40 border border-border/60 overflow-hidden shadow-inner h-[150px]">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none"></div>
            <ParkingMapIsometric floor={selectedStation?.floor || ""} highlightIndex={selectedStationIndex} />
          </div>

          <div className="mt-4 bg-muted/40 dark:bg-muted/30 border border-border/50 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <StatusBadge status={selectedStation!.status} lastStatusChangedAt={selectedStation!.lastStatusChangedAt} />
              <div className="h-4 w-px bg-border/20 dark:bg-white/10"></div>
              <span className="text-xs text-muted-foreground font-medium leading-relaxed">
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
            className="bg-muted/40 dark:bg-muted/20 border border-border/50 rounded-xl px-4 py-2.5 flex flex-col gap-0.5 text-left hover:bg-muted/60 dark:hover:bg-muted/40 active:scale-[0.97] transition-all group"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">ID</span>
              {copied ? (
                <span className="text-[8px] font-bold text-success-600 dark:text-success-400 animate-in fade-in transition-all">COPIED</span>
              ) : (
                <svg className="w-3 h-3 text-muted-foreground group-hover:text-secondary-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
              )}
            </div>
            <span className="text-[11px] text-foreground font-mono font-bold">{selectedStation?.searchKey}</span>
          </button>

          {/* Type */}
          <div className="bg-muted/40 dark:bg-muted/20 border border-border/50 rounded-xl px-4 py-2.5 flex flex-col gap-0.5">
            <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">충전 방식</span>
            <span className="text-[11px] text-foreground font-bold truncate">
              {isRapid ? "급속" : "완속"}
            </span>
          </div>

          {/* Adapter */}
          <div className="bg-muted/40 dark:bg-muted/20 border border-border/50 rounded-xl px-4 py-2.5 flex flex-col gap-0.5">
            <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">호환 어댑터</span>
            <span className="text-[11px] text-foreground font-bold truncate">
              {selectedStation?.type.adapter || "정보 없음"}
            </span>
          </div>

          {/* Capacity */}
          <div className="bg-muted/40 dark:bg-muted/20 border border-border/50 rounded-xl px-4 py-2.5 flex flex-col gap-0.5">
            <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">충전 용량</span>
            <span className="text-[11px] text-foreground font-bold">{selectedStation?.capacity}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-6 bg-muted/50 dark:bg-muted/20 border-t border-border/50 flex flex-col gap-3">
          <button
            onClick={handleClose}
            className="w-full py-4 bg-foreground text-background font-black rounded-2xl hover:opacity-90 transition-all active:scale-[0.98] text-sm tracking-wide"
          >확인
          </button>
        </div>
      </div>
    </div>
  );
};
