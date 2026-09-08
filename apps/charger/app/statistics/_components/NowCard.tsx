"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
    asPercent,
    DOW_LABELS,
    formatHour,
    freeChargers,
    HEAT_LEVELS,
    heatLevel,
    nowInKst,
    type ChargerStatistics,
} from "../_utils/stats";

const HEAT_BG = ["bg-heat-1", "bg-heat-2", "bg-heat-3", "bg-heat-4", "bg-heat-5"];

/** 지금 이후 오늘 남은 시간대 중 자리가 가장 잘 나는 곳 */
const nextGoldenHour = (stats: ChargerStatistics, hour: number) => {
    const remaining = stats.golden.filter((s) => s.hour > hour && s.perDay > 0);
    if (remaining.length === 0) return null;
    return remaining.reduce((best, s) => (s.perDay > best.perDay ? s : best));
};

export const NowCard = ({ stats }: { stats: ChargerStatistics }) => {
    // 서버가 그린 시각과 클라이언트 시각이 어긋나면 hydration이 깨지므로 마운트 후에 계산한다
    const [now, setNow] = useState<ReturnType<typeof nowInKst> | null>(null);

    useEffect(() => {
        setNow(nowInKst());
        const timer = setInterval(() => setNow(nowInKst()), 60_000);
        return () => clearInterval(timer);
    }, []);

    if (!now) {
        return <div className="mb-2.5 h-[132px] animate-pulse rounded-2xl border border-border bg-surface" />;
    }

    const cell = stats.heatmap.find((c) => c.dow === now.dow && c.hour === now.hour);
    const golden = nextGoldenHour(stats, now.hour);
    const busiest = [...stats.golden].sort((a, b) => b.perDay - a.perDay)[0];

    return (
        <section className="mb-2.5 rounded-2xl border border-border bg-surface px-4 pb-3.5 pt-3.5">
            <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 flex-none animate-breathe rounded-full bg-brand-500" />
                <span className="text-[11px] font-semibold tracking-[-0.2px] text-subtle-foreground">
                    지금 {DOW_LABELS[now.dow]}요일 {formatHour(now.hour)}
                </span>
            </div>

            {cell && cell.busyRatio !== null ? (
                <>
                    <div className="mt-1.5 flex items-end gap-2">
                        {/* 이 화면의 유일한 히어로 숫자 */}
                        <span className="text-[52px] font-extrabold leading-[0.9] tracking-[-2.5px] text-foreground">
                            {asPercent(cell.busyRatio)}
                        </span>
                        <span className="mb-1.5 flex items-center gap-1.5">
                            <span
                                className={cn("h-2.5 w-2.5 rounded-[3px]", HEAT_BG[heatLevel(cell.busyRatio)])}
                            />
                            <span className="text-[12.5px] font-bold tracking-[-0.3px] text-foreground">
                                {HEAT_LEVELS[heatLevel(cell.busyRatio)]!.label}
                            </span>
                        </span>
                    </div>
                    <p className="mt-1.5 text-[11.5px] leading-[1.45] text-muted-foreground">
                        이 시간대엔 완속 {stats.chargerCount}대 중 보통{" "}
                        <strong className="tabular font-bold text-subtle-foreground">
                            {freeChargers(cell.busyRatio, stats.chargerCount).toFixed(1)}대
                        </strong>
                        가 비어 있어요.
                    </p>
                </>
            ) : (
                <>
                    <p className="mt-2 text-[13px] font-bold leading-[1.4] tracking-[-0.3px] text-foreground">
                        이 시간대는 아직 집계된 데이터가 없어요
                    </p>
                    <p className="mt-1 text-[11.5px] leading-[1.45] text-muted-foreground">
                        현황 수집이 평일 {stats.hours[0]}시~{stats.hours[stats.hours.length - 1]}시에만 이뤄지고 있어요.
                    </p>
                </>
            )}

            <div className="mt-3 flex items-center gap-2 rounded-xl bg-elevated px-3 py-2.5">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="flex-none text-free">
                    <path
                        d="M8 4v4l2.5 1.5M14 8A6 6 0 1 1 2 8a6 6 0 0 1 12 0Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                {golden ? (
                    <p className="text-[11.5px] leading-[1.4] text-subtle-foreground">
                        오늘 남은 골든타임은{" "}
                        <strong className="font-bold text-foreground">{formatHour(golden.hour)}</strong> — 하루 평균{" "}
                        {golden.perDay.toFixed(1)}번 자리가 나요.
                    </p>
                ) : (
                    <p className="text-[11.5px] leading-[1.4] text-subtle-foreground">
                        오늘 골든타임은 지났어요. 다음 골든타임은{" "}
                        <strong className="font-bold text-foreground">{busiest ? formatHour(busiest.hour) : "–"}</strong>
                        예요.
                    </p>
                )}
            </div>
        </section>
    );
};
