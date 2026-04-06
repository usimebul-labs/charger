import React, { useMemo } from "react";
import { useStations } from "../_hooks/useStations";
import { upsertStations } from "@/app/actions/charger";

export const DashboardHeader = () => {
  const { data: stations, refetch } = useStations();

  const availableSlow = useMemo(() =>
    stations?.filter((s) => s.type.code === "02" && s.status.code === "2" || s.status.code === "9").length
    , []);

  const availableFast = useMemo(() =>
    stations?.filter((s) => s.type.code === "06" && s.status.code === "2" || s.status.code === "9").length
    , []);

  const refresh = async () => {
    await upsertStations();
    refetch();
  }

  return (
    <header className="bg-slate-900/80 border-b border-slate-800/50 sticky top-0 z-50 backdrop-blur-xl px-6 pt-6 pb-6 sm:px-10">
      {/* Subtle background glow decorator */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>

      <div className="relative flex flex-col gap-4">
        <h1 className="font-bold text-white tracking-tight flex flex-col leading-tight">
          <span className="text-2xl sm:text-2xl text-[#0056FF]">DAOU DIGITAL SQUARE</span>
          <span className="text-base sm:text-base text-slate-400 mt-1">전기차 충전 현황</span>
        </h1>

        <div className="flex items-center justify-between border-t border-slate-800/50 pt-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Live Status</span>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-[10px] sm:text-xs text-slate-400 font-black uppercase tracking-widest">
              완속 <span className="text-emerald-400">{availableSlow}</span> · 급속 <span className="text-emerald-400">{availableFast}</span> 이용 가능
            </p>
            <button
              onClick={refresh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all duration-300 active:scale-95 group"
            >
              <svg className="w-3.5 h-3.5 group-active:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-[10px] font-black uppercase tracking-wider">새로고침</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
