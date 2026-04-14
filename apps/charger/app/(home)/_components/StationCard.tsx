import { ChargerInfo } from "../../../types/charger";
import { StatusBadge } from "./StatusBadge";
import { isAvailable } from "../_utils/charger";
import { useStationStore } from "@/store/useStationStore";

interface StationCardProps {
  station: ChargerInfo;
  index: number;
}

export const StationCard = ({ station, index }: StationCardProps) => {
  const { setSelectedStation } = useStationStore();
  const isRapid = station.type.code === "06";
  const isAvailableStatus = isAvailable(station.status.code);

  const typeConfig: Record<string, { accent: string; bg: string; border: string; glow: string }> = {
    "06": {
      accent: "text-warning-text",
      bg: "from-warning-500/10 to-transparent",
      border: "border-warning-500/20",
      glow: "shadow-warning-500/5",
    },
    "02": {
      accent: "text-info-text",
      bg: "from-secondary-blue-500/10 to-transparent",
      border: "border-secondary-blue-500/20",
      glow: "shadow-secondary-blue-500/5",
    }
  };

  let currentType = typeConfig[station.type.code];

  const isWarningStatus = ["8", "9"].includes(station.status.code);

  return (
    <div
      onClick={() => setSelectedStation(station, index)}
      dir="ltr"
      className={`relative bg-card/40 rounded-2xl p-3 sm:p-4 border backdrop-blur-3xl transition-all duration-500 overflow-hidden group flex flex-col items-center text-center cursor-pointer
      ${isAvailableStatus
          ? (isWarningStatus
            ? `border-warning-500/40 bg-gradient-to-br ${currentType!.bg} shadow-[0_0_30px_-10px_rgba(249,162,7,0.2)] animate-in fade-in duration-1000`
            : `border-success-500/40 bg-gradient-to-br ${currentType!.bg} shadow-[0_0_30px_-10px_rgba(0,242,38,0.2)] animate-in fade-in duration-1000`)
          : `border-border hover:border-border/60`
        }
      hover:translate-y-[-6px] hover:shadow-2xl shadow-black/10 dark:shadow-black/40 active:scale-95
    `}>
      {/* Tap Indicator Hint */}
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-1.5 h-1.5 bg-white/20 rounded-full animate-ping"></div>
      </div>

      {/* Themed Background Decoration */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 opacity-20 pointer-events-none transition-all duration-700 group-hover:scale-125 group-hover:opacity-30 ${currentType!.accent}`}>
        {isRapid ? (
          <svg fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        ) : (
          <svg fill="currentColor" viewBox="0 0 24 24"><path d="M18 10V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h1v4h-2c-1.1 0-2 .9-2 2v2h14v-2c0-1.1-.9-2-2-2h-2v-4h1c1.1 0 2-.9 2-2z" /></svg>
        )}
      </div>

      <div className="flex flex-col items-center mb-2 relative z-10 w-full gap-1">
        <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground tracking-widest uppercase">
          ID {station.searchKey}
        </span>
      </div>

      <div className="flex flex-col items-center gap-3 relative z-10">
        <div className={`relative p-3 sm:p-4 rounded-2xl bg-muted/40 border-2 ${currentType!.border} ${currentType!.accent} shadow-2xl backdrop-blur-sm group-hover:scale-110 transition-all duration-500
          ${isRapid ? 'shadow-warning-500/10' : 'shadow-secondary-blue-500/10'}
        `}>
          {/* Subtle glow behind the icon */}
          <div className={`absolute inset-0 blur-xl opacity-30 ${isRapid ? 'bg-warning-500' : 'bg-secondary-blue-500'}`}></div>

          <div className="relative z-10">
            {isRapid ? (
              <svg className="w-6 h-6 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 10V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h1v4h-2c-1.1 0-2 .9-2 2v2h14v-2c0-1.1-.9-2-2-2h-2v-4h1c1.1 0 2-.9 2-2z" />
              </svg>
            )}
          </div>
        </div>

        <StatusBadge status={station.status} lastStatusChangedAt={station.lastStatusChangedAt} />
      </div>
    </div>
  );
};
