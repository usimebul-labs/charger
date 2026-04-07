import Image from "next/image";
import React, { useMemo } from "react";
import { useStations } from "../_hooks/useStations";
import { upsertStations } from "@/app/actions/charger";
import { isAvailable } from "../_utils/charger";

export const DashboardHeader = () => {
  const { data: stations, refetch } = useStations();

  const availableSlow = useMemo(() =>
    stations?.filter((s) => s.type.code === "02" && isAvailable(s.status.code)).length
    , [stations]);

  const availableFast = useMemo(() =>
    stations?.filter((s) => s.type.code === "06" && isAvailable(s.status.code)).length
    , [stations]);

  const refresh = async () => {
    await upsertStations();
    refetch();
  }

  return (
    <header className="bg-secondary-blue-dark-950/80 border-b border-gray-800/20 sticky top-0 z-50 backdrop-blur-xl px-6 pt-6 pb-2 sm:px-10 overflow-hidden mb-2">
      {/* Subtle background glow decorator */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>

      <div className="relative flex flex-col">
        <h1 className="font-bold text-white tracking-tight flex flex-row justify-between items-end leading-tight">
          <div className="relative h-6 sm:h-8 w-40 sm:w-56">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
          <span className="text-xs sm:text-sm text-gray-400">전기차 충전 현황</span>
        </h1>

        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-success-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(0,242,38,0.8)]"></div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Live Status</span>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-[10px] sm:text-xs text-gray-400 font-black uppercase tracking-widest">
              완속 <span className="text-success-400">{availableSlow}</span> · 급속 <span className="text-success-400">{availableFast}</span> 이용 가능
            </p>
            <button
              onClick={refresh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-success-500/10 hover:bg-success-500/20 text-success-400 border border-success-500/30 transition-all duration-300 active:scale-95 group"
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
