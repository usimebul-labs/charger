"use client";

import { useStationStore } from "@/store/useStationStore";
import { ChargerInfo } from "../../../types/charger";
import {
  CHARGER_TYPES,
  formatShortDuration,
  getChargerState,
  minutesSince,
  STATE_META,
} from "../_utils/charger";

interface StationCardProps {
  station: ChargerInfo;
  index: number;
}

/** Outline styles per state — free stalls are dashed, like an empty parking bay */
const OUTLINE: Record<string, string> = {
  free: "border-dashed border-free/45 bg-free/7",
  busy: "border-solid border-border bg-foreground/3",
  done: "border-solid border-border bg-foreground/3",
  off: "border-solid border-border bg-foreground/3",
};

/** The 2px bumper across the top of the bay, coloured by state */
const TOP_EDGE: Record<string, string> = {
  free: "border-t-free",
  busy: "border-t-busy",
  done: "border-t-done",
  off: "border-t-off",
};

export const StationCard = ({ station, index }: StationCardProps) => {
  const { setSelectedStation } = useStationStore();
  const state = getChargerState(station.status.code);
  const meta = STATE_META[state];
  const isRapid = station.type.code === CHARGER_TYPES.RAPID;

  // 충전중·완료 상태에서만 경과 시간을 붙인다 (대기는 붙일 시간이 없다)
  const elapsed = state === "free" ? null : minutesSince(station.lastStatusChangedAt);
  const statusLabel = elapsed === null ? meta.label : `${meta.label} ${formatShortDuration(elapsed)}`;

  return (
    <button
      type="button"
      onClick={() => setSelectedStation(station, index)}
      dir="ltr"
      title={station.status.desc}
      className={`relative flex cursor-pointer flex-col items-center justify-center gap-1 rounded-t-[3px] rounded-b-[11px]
        border border-t-2 [border-top-style:solid] px-[3px] pb-2.5 pt-2 text-foreground transition-colors
        hover:bg-elevated-hover/60 active:scale-[0.97] ${OUTLINE[state]} ${TOP_EDGE[state]}`}
    >
      {/* Charger post seated on the bumper */}
      <span
        className={`absolute -top-[2px] left-1/2 h-1 w-[22px] -translate-x-1/2 rounded-b-[3px] ${meta.bg}`}
      />

      {/* 완속이 주력이라 배지를 더 강조하고, 급속은 보조 표기로 물러난다 */}
      <span
        className={`mt-[3px] rounded px-[5px] py-[2.5px] leading-none ${
          isRapid
            ? "text-[9px] font-semibold tracking-[-0.1px] text-faint-foreground"
            : "border border-foreground/25 bg-foreground/8 text-[9.5px] font-extrabold tracking-[-0.1px] text-foreground"
        }`}
      >
        {isRapid ? "급속" : "완속"}
      </span>

      {/* 8자리 전체 번호 — 3자리만 쓰던 때보다 길어져 글자 크기·자간을 줄여 한 줄에 맞춘다 */}
      <span className="tabular whitespace-nowrap text-[15px] font-extrabold leading-[1.05] tracking-[-0.5px]">
        {station.searchKey}
      </span>

      <span className="flex items-center gap-[3px]">
        <span className={`h-[5px] w-[5px] flex-none rounded-full ${meta.bg}`} />
        <span
          className={`tabular whitespace-nowrap text-[10px] font-semibold tracking-[-0.2px] ${meta.text}`}
        >
          {statusLabel}
        </span>
      </span>
    </button>
  );
};
