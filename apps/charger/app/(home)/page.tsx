"use client";

import { useState } from "react";

// --- Types & Data ---

type StationStatus = "충전 가능" | "충전 중" | "점검 중";
type StationType = "완속" | "급속";

interface Station {
  id: string; // e.g. 110112301
  label: string; // e.g. A-01
  floor: number;
  type: StationType;
  status: StationStatus;
}

const STATIONS: Station[] = [
  // 3층
  { id: "11012303", label: "11012303", floor: 3, type: "완속", status: "점검 중" },
  { id: "11012304", label: "11012304", floor: 3, type: "완속", status: "충전 가능" },
  { id: "11012301", label: "11012301", floor: 3, type: "급속", status: "충전 중" },
  // 4층
  { id: "11012305", label: "11012305", floor: 4, type: "완속", status: "충전 가능" },
  { id: "11012306", label: "11012306", floor: 4, type: "완속", status: "충전 중" },
  { id: "11012302", label: "11012302", floor: 4, type: "급속", status: "충전 가능" },
  // 5층
  { id: "11012307", label: "11012307", floor: 5, type: "완속", status: "충전 중" },
  { id: "11012308", label: "11012308", floor: 5, type: "완속", status: "충전 가능" },
  { id: "11012309", label: "11012309", floor: 5, type: "완속", status: "점검 중" },
];

// --- Sub-components ---

const StatusBadge = ({ status }: { status: StationStatus }) => {
  const isAvailable = status === "충전 가능";
  const isCharging = status === "충전 중";

  const colors = {
    "충전 가능": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_-3px_rgba(52,211,153,0.3)]",
    "충전 중": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "점검 중": "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-[11px] font-black border tracking-wider uppercase transition-all ${colors[status]}`}>
        {(isAvailable || isCharging) && (
          <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"}`}></span>
        )}
        {status}
      </span>
    </div>
  );
};

const StationCard = ({ station }: { station: Station }) => {
  const isRapid = station.type === "급속";
  const isAvailable = station.status === "충전 가능";

  const typeConfig = {
    "급속": {
      accent: "text-amber-400",
      bg: "from-amber-500/10 to-transparent",
      border: "border-amber-500/20",
      glow: "shadow-amber-500/5",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    "완속": {
      accent: "text-sky-400",
      bg: "from-sky-500/10 to-transparent",
      border: "border-sky-500/20",
      glow: "shadow-sky-500/5",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 10V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h1v4h-2c-1.1 0-2 .9-2 2v2h14v-2c0-1.1-.9-2-2-2h-2v-4h1c1.1 0 2-.9 2-2z" />
        </svg>
      )
    }
  };

  const currentType = typeConfig[station.type];

  return (
    <div className={`relative bg-slate-800/40 rounded-2xl p-6 sm:p-4 border backdrop-blur-3xl transition-all duration-500 overflow-hidden group flex flex-col items-center text-center
      ${isAvailable
        ? `border-emerald-500/40 bg-gradient-to-br ${currentType.bg} shadow-[0_0_30px_-10px_rgba(52,211,153,0.2)] animate-in fade-in duration-1000`
        : `border-slate-800 hover:border-slate-700`
      }
      hover:translate-y-[-6px] hover:shadow-2xl shadow-black/40
    `}>
      {/* Themed Background Decoration */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 opacity-20 pointer-events-none transition-all duration-700 group-hover:scale-125 group-hover:opacity-30 ${currentType.accent}`}>
        {isRapid ? (
          <svg fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        ) : (
          <svg fill="currentColor" viewBox="0 0 24 24"><path d="M18 10V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h1v4h-2c-1.1 0-2 .9-2 2v2h14v-2c0-1.1-.9-2-2-2h-2v-4h1c1.1 0 2-.9 2-2z" /></svg>
        )}
      </div>

      <div className="flex flex-col items-center mb-2 relative z-10 w-full gap-1">
        <span className="text-[10px] sm:text-[11px] font-bold text-slate-100 tracking-widest uppercase opacity-70">
          ID {station.id}
        </span>
      </div>

      <div className="flex flex-col items-center gap-3 relative z-10">
        <div className={`relative p-5 sm:p-6 rounded-2xl bg-slate-900/40 border-2 ${currentType.border} ${currentType.accent} shadow-2xl backdrop-blur-sm group-hover:scale-110 transition-all duration-500
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

// --- Main Component ---

export default function Home() {
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  const filteredStations = STATIONS.filter((s) => {
    if (showOnlyAvailable) return s.status === "충전 가능";
    return true;
  });

  const availableSlow = STATIONS.filter((s) => s.type === "완속" && s.status === "충전 가능").length;
  const availableFast = STATIONS.filter((s) => s.type === "급속" && s.status === "충전 가능").length;

  const floors = [3, 4, 5];

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center selection:bg-blue-500/30 font-[family-name:var(--font-daki)]">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-[480px] min-h-screen bg-slate-900 border-x border-slate-800 relative flex flex-col pb-20">

        {/* Header */}
        <header className="bg-slate-900/80 border-b border-slate-800/50 sticky top-0 z-50 backdrop-blur-xl px-6 pt-6 pb-4 sm:px-10 overflow-hidden">
          {/* Subtle background glow decorator */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="font-bold text-white tracking-tight flex flex-col leading-tight">
                <span className="text-2xl sm:text-2xl text-[#0056FF]">DAOU DIGITAL SQUARE</span>
                <span className="text-base sm:text-base text-slate-400 mt-1">전기차 충전 현황</span>
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-400 font-black mt-2 uppercase tracking-widest text-right">
                완속 <span className="text-emerald-400">{availableSlow}</span> · 급속 <span className="text-emerald-400">{availableFast}</span> 이용 가능
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 pt-4">
          {/* Filters */}
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

          <div className="space-y-4">
            {floors.map((floor) => {
              const floorStations = filteredStations.filter((s) => s.floor === floor);
              if (floorStations.length === 0) return null;

              return (
                <section key={floor} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-[11px] font-black text-slate-600 tracking-wider">지하 {floor}층 14번 기둥</h2>
                    <div className="h-px flex-1 bg-slate-800/30"></div>
                  </div>

                  {/* 3 Columns Layout (grid-cols-3) */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-6">
                    {floorStations.map((station) => (
                      <StationCard key={station.id} station={station} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredStations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-blue-600/10 rounded-full blur-2xl animate-pulse"></div>
                <div className="relative bg-slate-800 rounded-full w-24 h-24 flex items-center justify-center border border-slate-800">
                  <svg className="w-12 h-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">검색 결과가 없습니다</h3>
              <p className="text-slate-500 text-sm mt-2 font-medium">필터를 변경하여 다른 스테이션을 확인해 보세요.</p>
              <button
                onClick={() => setShowOnlyAvailable(false)}
                className="mt-8 px-6 py-2.5 rounded-full border border-slate-700 text-xs font-black tracking-widest uppercase hover:bg-slate-800 transition-colors"
              >
                전체 보기
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
