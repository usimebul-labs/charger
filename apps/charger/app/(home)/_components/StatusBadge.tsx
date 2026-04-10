import { ChargerStatus } from "../../../types/charger";

interface StatusBadgeProps {
  status: ChargerStatus;
  lastStatusChangedAt?: string;
}

export const StatusBadge = ({ status, lastStatusChangedAt }: StatusBadgeProps) => {
  const isAvailable = ["2", "8", "9"].includes(status.code);
  const isCharging = status.code === "1"; // Keep current logic
  const isChargingStatus = status.code === "6";

  const colors: Record<string, string> = {
    "9": "bg-warning-500/10 text-warning-text border-warning-500/20 shadow-[0_0_15px_-3px_rgba(249,162,7,0.3)]",
    "8": "bg-warning-500/10 text-warning-text border-warning-500/20 shadow-[0_0_15px_-3px_rgba(249,162,7,0.3)]",
    "2": "bg-success-500/10 text-success-text border-success-500/20 shadow-[0_0_15px_-3px_rgba(0,242,38,0.3)]",
    "6": "bg-secondary-blue-500/10 text-info-text border-secondary-blue-500/20",
    "other": "bg-error-500/10 text-error-text border-error-500/20",
  };

  return (
    <div className="flex items-center gap-2">
      <span
        title={status.desc}
        className={`flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-[11px] font-black border tracking-wider truncate uppercase transition-all ${colors[status.code] || colors["점검 중"]}`}
      >
        {(isAvailable || isCharging) && (
          <span className={`w-1.5 h-1.5 rounded-full ${isAvailable
            ? (status.code === "2"
              ? "bg-success-400 animate-pulse shadow-[0_0_8px_rgba(33,255,76,0.8)]"
              : "bg-warning-400 animate-pulse shadow-[0_0_8px_rgba(249,162,7,0.8)]")
            : "bg-secondary-blue-400 shadow-[0_0_8px_rgba(71,84,255,0.8)]"
            }`}></span>
        )}
        <span className="flex items-center gap-1">
          {status.value}
          {isChargingStatus && lastStatusChangedAt && (
            <span className="flex items-center gap-1 pl-1 ml-1 border-l border-secondary-blue-500/30 text-[10px] sm:text-[10px] min-w-[15px] justify-center">
              {(() => {
                const start = new Date(lastStatusChangedAt);
                const now = new Date();
                const diffMins = Math.floor(Math.max(0, now.getTime() - start.getTime()) / 60000);
                return `${diffMins}분`;
              })()}
            </span>
          )}
        </span>
      </span>
    </div>
  );
};
