"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { formatHour, type ChargerStatistics, type GoldenSlot } from "../_utils/stats";

/** 직접 라벨을 붙일 상위 구간 수 — 나머지는 막대 길이와 판독값으로 읽는다 */
const LABELLED_RANK_COUNT = 3;

const formatPerDay = (perDay: number) => `${perDay.toFixed(1)}번`;

export const GoldenTimeChart = ({ stats }: { stats: ChargerStatistics }) => {
    const [activeHour, setActiveHour] = useState<number | null>(null);

    const slots = stats.golden;
    const max = Math.max(...slots.map((s) => s.perDay), 0);
    if (max <= 0) return null;

    const ranked = [...slots].sort((a, b) => b.perDay - a.perDay);
    const labelled = new Set(ranked.slice(0, LABELLED_RANK_COUNT).map((s) => s.hour));
    const best = ranked[0]!;

    const active: GoldenSlot = slots.find((s) => s.hour === activeHour) ?? best;

    return (
        <section className="mb-2.5 rounded-2xl border border-border bg-surface px-3.5 pb-3.5 pt-3">
            <h2 className="text-[13.5px] font-bold tracking-[-0.3px] text-foreground">골든타임</h2>
            <p className="mt-0.5 text-[11px] leading-[1.45] text-muted-foreground">
                완속 충전기가 <strong className="font-semibold text-subtle-foreground">새로 비는 순간</strong>이 하루 평균
                몇 번 생기는지예요. 이 시간에 맞춰 내려가면 자리를 잡을 확률이 높아요.
            </p>

            <div className="mt-2.5 flex min-h-[38px] items-center gap-2 rounded-xl bg-elevated px-3 py-2">
                <span className="h-2.5 w-2.5 flex-none rounded-[3px] bg-free" />
                <span className="text-[11.5px] font-semibold tracking-[-0.2px] text-foreground">
                    {formatHour(active.hour)}
                </span>
                <span className="text-[10.5px] text-muted-foreground">전체 {active.total}번</span>
                <span className="tabular ml-auto text-[15px] font-extrabold leading-none tracking-[-0.5px] text-foreground">
                    {formatPerDay(active.perDay)}
                </span>
            </div>

            <ul className="mt-2.5 flex flex-col gap-[3px]">
                {slots.map((slot) => {
                    const isActive = active.hour === slot.hour;
                    const isBest = best.hour === slot.hour;

                    return (
                        <li key={slot.hour}>
                            <button
                                type="button"
                                onClick={() => setActiveHour(slot.hour)}
                                onMouseEnter={() => setActiveHour(slot.hour)}
                                aria-label={`${slot.hour}시 하루 평균 ${formatPerDay(slot.perDay)}`}
                                aria-pressed={isActive}
                                className={cn(
                                    "flex w-full cursor-pointer items-center gap-2 rounded-md py-[3px] pl-1 pr-1.5 text-left transition-colors",
                                    isActive ? "bg-foreground/6" : "hover:bg-foreground/4"
                                )}
                            >
                                <span className="tabular w-[22px] flex-none text-right text-[9.5px] font-semibold text-faint-foreground">
                                    {slot.hour}
                                </span>

                                {/* 막대 — 왼쪽 기준선에서 자라고, 데이터 끝만 둥글다 */}
                                <span className="flex h-[14px] min-w-0 flex-1 items-center">
                                    <span
                                        className="h-full rounded-r-[4px] bg-free"
                                        style={{ width: `${Math.max((slot.perDay / max) * 100, 1.5)}%` }}
                                    />
                                    {labelled.has(slot.hour) && (
                                        <span
                                            className={cn(
                                                "tabular ml-1.5 whitespace-nowrap text-[10px] leading-none tracking-[-0.2px]",
                                                isBest
                                                    ? "font-extrabold text-foreground"
                                                    : "font-semibold text-subtle-foreground"
                                            )}
                                        >
                                            {formatPerDay(slot.perDay)}
                                        </span>
                                    )}
                                </span>

                                {isBest && (
                                    <span className="flex-none rounded bg-free/12 px-1.5 py-[2px] text-[9px] font-extrabold leading-none tracking-[-0.1px] text-success-text">
                                        TOP
                                    </span>
                                )}
                            </button>
                        </li>
                    );
                })}
            </ul>

            <p className="mt-2.5 text-[11px] leading-[1.5] text-subtle-foreground">
                가장 자리가 많이 나는 시간은 <strong className="font-bold text-foreground">{formatHour(best.hour)}</strong>
                {" — "}하루 평균 {formatPerDay(best.perDay)} 비어요.
            </p>
        </section>
    );
};
