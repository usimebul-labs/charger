import { BarChart2 } from "lucide-react";

/** `2026-04-03T08:25:07Z` → `4월 3일` (KST 기준) */
const formatDay = (iso: string) => {
    const d = new Date(new Date(iso).getTime() + 9 * 60 * 60 * 1000);
    return `${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일`;
};

interface StatisticsHeaderProps {
    period?: { from: string; to: string; days: number };
    /** 통계에 포함된 완속 충전기 수 */
    chargerCount?: number;
}

export const StatisticsHeader = ({ period, chargerCount }: StatisticsHeaderProps) => (
    <header className="header-surface z-40 flex-none border-b border-border px-4 pb-3 pt-[calc(env(safe-area-inset-top)+1.25rem)]">
        <div className="flex items-center gap-2.5">
            <div className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-[9px] bg-brand-500">
                <BarChart2 className="h-4 w-4 text-on-brand" strokeWidth={2.6} />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-px">
                <h1 className="text-[16.5px] font-bold leading-[1.15] tracking-[-0.4px] text-foreground">
                    혼잡도 · 골든타임
                </h1>
                <p className="truncate text-[11px] leading-[1.2] text-muted-foreground">
                    {chargerCount ? `완속 충전기 ${chargerCount}대 기준` : "다우디지털스퀘어 · 지하주차장"}
                </p>
            </div>
        </div>

        {period && (
            <div className="mt-2.5 flex items-center gap-1.5">
                <span className="text-[11.5px] tracking-[-0.1px] text-subtle-foreground">
                    {formatDay(period.from)} ~ {formatDay(period.to)} · {period.days}일치 기록
                </span>
            </div>
        )}
    </header>
);
