import { formatDuration } from "@/app/(home)/_utils/charger";
import { Zap } from "lucide-react";
import { formatDate, type DailyRhythm, type DurationSummary } from "../_utils/stats";

const Tile = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
    <div className="rounded-xl bg-elevated px-3 py-2.5">
        <p className="text-[10px] font-medium leading-[1.3] text-muted-foreground">{label}</p>
        <p className="mt-1 text-[16px] font-extrabold leading-none tracking-[-0.6px] text-foreground">{value}</p>
        {sub && <p className="mt-1 text-[10px] leading-[1.3] text-faint-foreground">{sub}</p>}
    </div>
);

interface ChargingFactsCardProps {
    charging: DurationSummary;
    daily: DailyRhythm;
}

export const ChargingFactsCard = ({ charging, daily }: ChargingFactsCardProps) => (
    <section className="mb-2.5 rounded-2xl border border-border bg-surface px-3.5 pb-3.5 pt-3">
        <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 flex-none text-busy" />
            <h2 className="text-[13.5px] font-bold tracking-[-0.3px] text-foreground">숫자로 보는 완속 충전</h2>
        </div>
        <p className="mt-0.5 text-[11px] leading-[1.45] text-muted-foreground">
            하루 안에 시작해서 끝난 충전 {charging.count}번을 셌어요.
        </p>

        <div className="mt-2.5 grid grid-cols-2 gap-2">
            <Tile label="한 번 충전에 보통" value={formatDuration(charging.median)} />
            <Tile label="가장 길게 충전" value={formatDuration(charging.max)} />
            <Tile
                label="하루 평균 충전"
                value={`${daily.averageStarts.toFixed(1)}번`}
                sub={`완속 전체 기준`}
            />
            {daily.busiestDay && (
                <Tile
                    label="가장 바빴던 날"
                    value={formatDate(daily.busiestDay.date)}
                    sub={`${daily.busiestDay.starts}번 충전`}
                />
            )}
        </div>

        <p className="mt-3 text-[11px] leading-[1.5] text-subtle-foreground">
            10번 중 1번은 <strong className="font-bold text-foreground">{formatDuration(charging.p90)}</strong> 넘게
            이어져요. 오래 세워둘 계획이면 붐비는 시간은 피하는 게 좋아요.
        </p>
    </section>
);
