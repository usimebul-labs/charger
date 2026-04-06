import React from "react";
import { ChargerInfo } from "../../../types/charger";
import { StatusBadge } from "./StatusBadge";

interface StationCardProps {
  station: ChargerInfo;
}

export const StationCard = ({ station }: StationCardProps) => {

  console.log(station.type.code, station.status.code, station.status.value)
  const isRapid = station.type.code === "06";
  const isAvailable = station.status.code === "9" || station.status.code === "2";

  const typeConfig: Record<string, { accent: string; bg: string; border: string; glow: string }> = {
    "06": {
      accent: "text-amber-400",
      bg: "from-amber-500/10 to-transparent",
      border: "border-amber-500/20",
      glow: "shadow-amber-500/5",
    },
    "02": {
      accent: "text-sky-400",
      bg: "from-sky-500/10 to-transparent",
      border: "border-sky-500/20",
      glow: "shadow-sky-500/5",
    }
  };

  let currentType = typeConfig[station.type.code];

  return (
    <div className={`relative bg-slate-800/40 rounded-2xl p-6 sm:p-4 border backdrop-blur-3xl transition-all duration-500 overflow-hidden group flex flex-col items-center text-center
      ${isAvailable
        ? `border-emerald-500/40 bg-gradient-to-br ${currentType!.bg} shadow-[0_0_30px_-10px_rgba(52,211,153,0.2)] animate-in fade-in duration-1000`
        : `border-slate-800 hover:border-slate-700`
      }
      hover:translate-y-[-6px] hover:shadow-2xl shadow-black/40
    `}>
      {/* Themed Background Decoration */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 opacity-20 pointer-events-none transition-all duration-700 group-hover:scale-125 group-hover:opacity-30 ${currentType!.accent}`}>
        {isRapid ? (
          <svg fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        ) : (
          <svg fill="currentColor" viewBox="0 0 24 24"><path d="M18 10V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h1v4h-2c-1.1 0-2 .9-2 2v2h14v-2c0-1.1-.9-2-2-2h-2v-4h1c1.1 0 2-.9 2-2z" /></svg>
        )}
      </div>

      <div className="flex flex-col items-center mb-2 relative z-10 w-full gap-1">
        <span className="text-[10px] sm:text-[11px] font-bold text-slate-100 tracking-widest uppercase opacity-70">
          ID {station.searchKey}
        </span>
      </div>

      <div className="flex flex-col items-center gap-3 relative z-10">
        <div className={`relative p-5 sm:p-6 rounded-2xl bg-slate-900/40 border-2 ${currentType!.border} ${currentType!.accent} shadow-2xl backdrop-blur-sm group-hover:scale-110 transition-all duration-500
          ${isRapid ? 'shadow-amber-500/10' : 'shadow-sky-500/10'}
        `}>
          {/* Subtle glow behind the icon */}
          <div className={`absolute inset-0 blur-xl opacity-30 ${isRapid ? 'bg-amber-500' : 'bg-sky-500'}`}></div>

          <div className="relative z-10">
            {isRapid ? (
              <svg className="w-10 h-10 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            ) : (
              <svg className="w-10 h-10 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 10V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h1v4h-2c-1.1 0-2 .9-2 2v2h14v-2c0-1.1-.9-2-2-2h-2v-4h1c1.1 0 2-.9 2-2z" />
              </svg>
            )}
          </div>
        </div>

        <StatusBadge status={station.status} />
      </div>
    </div>
  );
};
