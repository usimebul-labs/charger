"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import {
    asPercent,
    DOW_LABELS,
    formatHour,
    freeChargers,
    HEAT_LEVELS,
    heatLevel,
    type ChargerStatistics,
    type HeatCell,
} from "../_utils/stats";

/** 혼잡도 램프 — globals.css의 --heat-* 토큰과 1:1로 대응한다 */
const HEAT_BG = ["bg-heat-1", "bg-heat-2", "bg-heat-3", "bg-heat-4", "bg-heat-5"];
const HEAT_INK = [
    "text-heat-1-ink",
    "text-heat-2-ink",
    "text-heat-3-ink",
    "text-heat-4-ink",
    "text-heat-5-ink",
];

const cellKey = (cell: Pick<HeatCell, "dow" | "hour">) => `${cell.dow}-${cell.hour}`;

const describe = (cell: HeatCell) => {
    if (cell.busyRatio === null) return "관측된 데이터가 없어요";
    const level = HEAT_LEVELS[heatLevel(cell.busyRatio)]!;
    return `${DOW_LABELS[cell.dow]}요일 ${formatHour(cell.hour)} · ${level.label}`;
};

export const CongestionHeatmap = ({ stats }: { stats: ChargerStatistics }) => {
    const [selectedKey, setSelectedKey] = useState<string | null>(
        stats.peak ? cellKey(stats.peak) : null
    );
    const [showTable, setShowTable] = useState(false);

    const cellAt = (dow: number, hour: number) =>
        stats.heatmap.find((c) => c.dow === dow && c.hour === hour) ?? null;

    const selected = stats.heatmap.find((c) => cellKey(c) === selectedKey) ?? stats.peak;

    return (
        <section className="mb-2.5 rounded-2xl border border-border bg-surface px-3.5 pb-3.5 pt-3">
            <h2 className="text-[13.5px] font-bold tracking-[-0.3px] text-foreground">시간대별 혼잡도</h2>
            <p className="mt-0.5 text-[11px] leading-[1.45] text-muted-foreground">
                최근 {stats.observedDays}일 동안 완속 {stats.chargerCount}대가{" "}
                <strong className="font-semibold text-subtle-foreground">충전에 쓰이고 있던</strong> 비율이에요. 진할수록
                빈자리가 적어요.
            </p>

            {/* 선택한 칸의 판독값 — 색만으로 값을 읽게 두지 않는다 */}
            <div className="mt-2.5 min-h-[54px] rounded-xl bg-elevated px-3 py-2">
                {selected && selected.busyRatio !== null ? (
                    <>
                        <div className="flex items-center gap-2">
                            <span
                                className={cn(
                                    "h-2.5 w-2.5 flex-none rounded-[3px]",
                                    HEAT_BG[heatLevel(selected.busyRatio)]
                                )}
                            />
                            <span className="text-[11.5px] font-semibold tracking-[-0.2px] text-foreground">
                                {describe(selected)}
                            </span>
                            <span className="tabular ml-auto text-[15px] font-extrabold leading-none tracking-[-0.5px] text-foreground">
                                {asPercent(selected.busyRatio)}
                            </span>
                        </div>
                        <p className="mt-1 pl-[18px] text-[10.5px] leading-[1.3] text-muted-foreground">
                            {stats.chargerCount}대 중 보통{" "}
                            <strong className="tabular font-bold text-subtle-foreground">
                                {freeChargers(selected.busyRatio, stats.chargerCount).toFixed(1)}대
                            </strong>{" "}
                            비어 있어요
                        </p>
                    </>
                ) : (
                    <span className="text-[11.5px] text-muted-foreground">칸을 눌러 자세히 볼 수 있어요</span>
                )}
            </div>

            {/* 히트맵 — 열은 요일, 행은 시간 */}
            <div
                className="mt-2.5 grid gap-[2px]"
                style={{ gridTemplateColumns: `28px repeat(${stats.dows.length}, minmax(0, 1fr))` }}
                role="grid"
                aria-label="요일과 시간대별 충전기 혼잡도"
            >
                <div className="contents" role="row">
                    <span aria-hidden="true" />
                    {stats.dows.map((dow) => (
                        <span
                            key={dow}
                            role="columnheader"
                            className="pb-0.5 text-center text-[10px] font-bold tracking-[-0.2px] text-subtle-foreground"
                        >
                            {DOW_LABELS[dow]}
                        </span>
                    ))}
                </div>

                {stats.hours.map((hour) => (
                    <div key={hour} className="contents" role="row">
                        <span
                            role="rowheader"
                            className="tabular flex items-center justify-end pr-1 text-[9.5px] font-semibold text-faint-foreground"
                        >
                            {hour}
                        </span>

                        {stats.dows.map((dow) => {
                            const cell = cellAt(dow, hour);
                            const key = `${dow}-${hour}`;
                            const isSelected = selected ? cellKey(selected) === key : false;
                            const isPeak = stats.peak ? cellKey(stats.peak) === key : false;

                            if (!cell || cell.busyRatio === null) {
                                return (
                                    <span
                                        key={key}
                                        role="gridcell"
                                        aria-label={`${DOW_LABELS[dow]}요일 ${hour}시 데이터 없음`}
                                        className="h-[26px] rounded-[5px] bg-heat-empty"
                                    />
                                );
                            }

                            const level = heatLevel(cell.busyRatio);

                            return (
                                <button
                                    key={key}
                                    type="button"
                                    role="gridcell"
                                    onClick={() => setSelectedKey(key)}
                                    aria-label={`${DOW_LABELS[dow]}요일 ${hour}시 혼잡도 ${asPercent(cell.busyRatio)}`}
                                    aria-pressed={isSelected}
                                    className={cn(
                                        "flex h-[26px] cursor-pointer items-center justify-center rounded-[5px] transition-transform",
                                        "outline-2 -outline-offset-2 outline-transparent",
                                        "hover:outline-foreground/25 active:scale-[0.94]",
                                        HEAT_BG[level],
                                        isSelected && "outline-foreground/70"
                                    )}
                                >
                                    {/* 극값 하나만 직접 라벨한다 — 나머지는 농도와 판독값으로 읽는다 */}
                                    {isPeak && (
                                        <span
                                            className={cn(
                                                "tabular text-[9.5px] font-extrabold leading-none tracking-[-0.3px]",
                                                HEAT_INK[level]
                                            )}
                                        >
                                            {asPercent(cell.busyRatio)}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* 범례 */}
            <div className="mt-3 flex items-center gap-1.5">
                <span className="text-[10px] font-medium text-faint-foreground">여유</span>
                <div className="flex flex-1 gap-[2px]">
                    {HEAT_BG.map((tone, i) => (
                        <span
                            key={tone}
                            className={cn("h-1.5 flex-1 rounded-[2px]", tone)}
                            title={HEAT_LEVELS[i]!.label}
                        />
                    ))}
                </div>
                <span className="text-[10px] font-medium text-faint-foreground">혼잡</span>
            </div>

            <button
                type="button"
                onClick={() => setShowTable((v) => !v)}
                className="mt-2.5 text-[10.5px] font-semibold text-subtle-foreground underline-offset-2 hover:underline"
            >
                {showTable ? "표 닫기" : "표로 보기"}
            </button>

            {showTable && (
                <div className="mt-2 overflow-x-auto">
                    <table className="tabular w-full text-[10.5px]">
                        <caption className="sr-only">요일과 시간대별 혼잡도 표</caption>
                        <thead>
                            <tr className="text-faint-foreground">
                                <th scope="col" className="py-1 text-left font-semibold">
                                    시각
                                </th>
                                {stats.dows.map((dow) => (
                                    <th key={dow} scope="col" className="py-1 text-right font-semibold">
                                        {DOW_LABELS[dow]}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {stats.hours.map((hour) => (
                                <tr key={hour} className="border-t border-border">
                                    <th scope="row" className="py-1 text-left font-semibold text-subtle-foreground">
                                        {hour}시
                                    </th>
                                    {stats.dows.map((dow) => {
                                        const cell = cellAt(dow, hour);
                                        return (
                                            <td key={dow} className="py-1 text-right text-foreground">
                                                {cell && cell.busyRatio !== null ? asPercent(cell.busyRatio) : "–"}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};
