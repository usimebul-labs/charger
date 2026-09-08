import { formatDuration } from "@/app/(home)/_utils/charger";
import { Trophy } from "lucide-react";
import type { ChargerRank } from "../_utils/stats";

/** 회전이 가장 빠른 충전기 — 한 번 꽂으면 가장 짧게 쓰고 나가는 자리 */
const fastestTurnaround = (ranking: ChargerRank[]) =>
    ranking
        .filter((r): r is ChargerRank & { medianMinutes: number } => r.medianMinutes !== null)
        .reduce<(ChargerRank & { medianMinutes: number }) | null>(
            (best, r) => (!best || r.medianMinutes < best.medianMinutes ? r : best),
            null
        );

export const ChargerRankingCard = ({ ranking }: { ranking: ChargerRank[] }) => {
    const max = Math.max(...ranking.map((r) => r.occupiedHours), 0);
    if (max <= 0) return null;

    const busiest = ranking[0]!;
    const fastest = fastestTurnaround(ranking);

    return (
        <section className="mb-2.5 rounded-2xl border border-border bg-surface px-3.5 pb-3.5 pt-3">
            <div className="flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5 flex-none text-busy" />
                <h2 className="text-[13.5px] font-bold tracking-[-0.3px] text-foreground">가장 바쁜 충전기</h2>
            </div>
            <p className="mt-0.5 text-[11px] leading-[1.45] text-muted-foreground">
                완속 {ranking.length}대가 각각 <strong className="font-semibold text-subtle-foreground">충전 중이었던 시간</strong>
                이에요.
            </p>

            <ul className="mt-2.5 flex flex-col gap-[5px]">
                {ranking.map((charger, index) => (
                    <li key={charger.id} className="flex items-center gap-2">
                        <span className="tabular w-[10px] flex-none text-right text-[10px] font-bold text-faint-foreground">
                            {index + 1}
                        </span>

                        <span className="flex w-[74px] flex-none items-center gap-1">
                            <span className="tabular text-[11px] font-bold tracking-[-0.3px] text-foreground">
                                {charger.searchKey}
                            </span>
                            {charger.floor && (
                                <span className="rounded bg-foreground/8 px-1 py-[1px] text-[8.5px] font-bold leading-none text-subtle-foreground">
                                    {charger.floor}
                                </span>
                            )}
                        </span>

                        <span className="flex h-[13px] min-w-0 flex-1 items-center">
                            <span
                                className="h-full rounded-r-[4px] bg-busy"
                                style={{ width: `${Math.max((charger.occupiedHours / max) * 100, 2)}%` }}
                            />
                        </span>

                        <span className="tabular w-[42px] flex-none text-right text-[10.5px] font-semibold tracking-[-0.2px] text-subtle-foreground">
                            {charger.occupiedHours}시간
                        </span>
                    </li>
                ))}
            </ul>

            <div className="mt-3 flex flex-col gap-1 text-[11px] leading-[1.5] text-subtle-foreground">
                <p>
                    가장 붐비는 자리는 <strong className="font-bold text-foreground">{busiest.searchKey}</strong>
                    {busiest.floor ? ` (${busiest.floor})` : ""} — {busiest.sessions}번 충전에 쓰였어요.
                </p>
                {fastest && fastest.id !== busiest.id && (
                    <p>
                        회전이 가장 빠른 자리는 <strong className="font-bold text-foreground">{fastest.searchKey}</strong>
                        {fastest.floor ? ` (${fastest.floor})` : ""} — 한 번에 보통 {formatDuration(fastest.medianMinutes)}{" "}
                        쓰고 나가요.
                    </p>
                )}
            </div>
        </section>
    );
};
