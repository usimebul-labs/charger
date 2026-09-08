"use client";

import { ChargerInfo } from "@/types/charger";
import { CHARGER_TYPES, getChargerState, isAvailable } from "../_utils/charger";
import { useStations } from "../_hooks/useStations";

/**
 * One-line summary card from the mockup: 완속 / 급속 side by side, each with an
 * "available / total" count and a segment bar — one segment per charger, tinted
 * with that charger's state colour.
 */
const segmentTone = (station: ChargerInfo) => {
  switch (getChargerState(station.status.code)) {
    case "free":
      return "bg-free";
    case "done":
      return "bg-done";
    case "busy":
      return "bg-busy/35";
    default:
      return "bg-foreground/12";
  }
};

const SummaryHalf = ({
  label,
  stations,
  emphasised,
}: {
  label: string;
  stations: ChargerInfo[];
  emphasised?: boolean;
}) => {
  const available = stations.filter((s) => isAvailable(s.status.code)).length;

  return (
    <div className="flex-1 px-[11px]">
      <div className="flex items-baseline gap-[3px]">
        <span className="tabular text-[23px] font-extrabold leading-none tracking-[-1px] text-free">
          {available}
        </span>
        <span className="tabular text-[13px] font-semibold tracking-[-0.4px] text-faint-foreground">
          / {stations.length}
        </span>
        <span
          className={
            emphasised
              ? "ml-auto text-[10.5px] font-bold text-foreground"
              : "ml-auto text-[10.5px] font-semibold text-muted-foreground"
          }
        >
          {label}
        </span>
      </div>

      <div className="mt-[7px] flex h-1 gap-[3px]">
        {stations.length === 0 ? (
          <div className="flex-1 rounded-[3px] bg-foreground/12" />
        ) : (
          stations.map((station) => (
            <div key={station.id} className={`flex-1 rounded-[3px] ${segmentTone(station)}`} />
          ))
        )}
      </div>
    </div>
  );
};

export const SummaryCard = () => {
  const { data: stations } = useStations();

  const slow = stations?.filter((s) => s.type.code === CHARGER_TYPES.SLOW) ?? [];
  const fast = stations?.filter((s) => s.type.code === CHARGER_TYPES.RAPID) ?? [];

  return (
    <div className="mb-2.5 flex rounded-2xl border border-border bg-surface px-1 py-2.5">
      <SummaryHalf label="완속" stations={slow} emphasised />
      <div className="w-px bg-border" />
      <SummaryHalf label="급속" stations={fast} />
    </div>
  );
};
