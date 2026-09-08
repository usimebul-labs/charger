import { ChargerStatus } from "../../../types/charger";
import { formatShortDuration, getChargerState, minutesSince, STATE_META } from "../_utils/charger";

interface StatusBadgeProps {
  status: ChargerStatus;
  lastStatusChangedAt?: string;
  /** Suppress the elapsed-time suffix where the sheet already shows it */
  hideElapsed?: boolean;
}

const RING: Record<string, string> = {
  free: "border-free/35",
  busy: "border-busy/35",
  done: "border-done/35",
  off: "border-off/35",
};

export const StatusBadge = ({ status, lastStatusChangedAt, hideElapsed }: StatusBadgeProps) => {
  const state = getChargerState(status.code);
  const meta = STATE_META[state];
  const elapsed = state === "free" || hideElapsed ? null : minutesSince(lastStatusChangedAt);

  return (
    <span
      title={status.desc}
      className={`inline-flex flex-none items-center gap-1.5 rounded-full border bg-foreground/6 px-2.5 py-[5px]
        text-[11.5px] font-bold tracking-[-0.2px] ${RING[state]} ${meta.text}`}
    >
      <span className={`h-1.5 w-1.5 flex-none rounded-full ${meta.bg}`} />
      <span className="tabular whitespace-nowrap">
        {meta.label}
        {elapsed !== null && ` ${formatShortDuration(elapsed)}`}
      </span>
    </span>
  );
};
