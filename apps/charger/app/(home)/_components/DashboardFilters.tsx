import React from "react";

interface DashboardFiltersProps {
  showOnlyAvailable: boolean;
  setShowOnlyAvailable: (value: boolean) => void;
}

export const DashboardFilters = ({ showOnlyAvailable, setShowOnlyAvailable }: DashboardFiltersProps) => {
  return (
    <div className="flex items-center justify-end gap-4 mb-4 ">
      <button
        onClick={() => setShowOnlyAvailable(!showOnlyAvailable)}
        className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl text-[11px] font-black tracking-widest uppercase transition-all duration-300 border ${showOnlyAvailable
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_20px_-5px_rgba(16,185,129,0.2)]"
          : "bg-slate-800/50 text-slate-400 border-slate-800 hover:border-slate-700"
          }`}
      >
        <div className={`relative flex items-center justify-center w-4 h-4`}>
          <div className={`absolute inset-0 rounded-full border-2 transition-all duration-500 ${showOnlyAvailable ? "border-emerald-400" : "border-slate-400"}`}></div>
          <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${showOnlyAvailable ? "bg-emerald-400 scale-100 animate-pulse" : "bg-transparent scale-0"}`}></div>
        </div>
        충전 가능
      </button>
    </div>
  );
};
