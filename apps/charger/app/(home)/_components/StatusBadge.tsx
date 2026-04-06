import { CodeValue } from "../../../types/charger";

interface StatusBadgeProps {
  status: CodeValue;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const isAvailable = status.code === "9" || status.code === "2";
  const isCharging = status.code === "1";

  const colors: Record<string, string> = {
    "9": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_-3px_rgba(52,211,153,0.3)]",
    "2": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_-3px_rgba(52,211,153,0.3)]",
    "6": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "other": "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-[11px] font-black border tracking-wider uppercase transition-all ${colors[status.code] || colors["점검 중"]}`}>
        {(isAvailable || isCharging) && (
          <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"}`}></span>
        )}
        {status.value}
      </span>
    </div>
  );
};
