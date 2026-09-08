import { formatDuration } from "@/app/(home)/_utils/charger";
import { AlarmClock } from "lucide-react";
import { asPercent, type AbandonSummary } from "../_utils/stats";

/**
 * 하나의 비율을 채운 막대 하나로 보여준다. 남은 트랙은 같은 색 계열의
 * 옅은 단계라, 다 찼든 조금 찼든 상태가 막대 전체에서 읽힌다.
 */
const Meter = ({ label, ratio }: { label: string; ratio: number }) => (
    <div className="flex items-center gap-2">
        <span className="w-[62px] flex-none text-[11px] font-medium text-subtle-foreground">{label}</span>
        <span className="h-[10px] min-w-0 flex-1 overflow-hidden rounded-full bg-done/15">
            <span
                className="block h-full rounded-full bg-done"
                style={{ width: `${Math.max(ratio * 100, 2)}%` }}
            />
        </span>
        <span className="tabular w-[34px] flex-none text-right text-[11.5px] font-extrabold tracking-[-0.3px] text-foreground">
            {asPercent(ratio)}
        </span>
    </div>
);

export const MannerCard = ({ abandon }: { abandon: AbandonSummary }) => (
    <section className="mb-2.5 rounded-2xl border border-border bg-surface px-3.5 pb-3.5 pt-3">
        <div className="flex items-center gap-1.5">
            <AlarmClock className="h-3.5 w-3.5 flex-none text-done" />
            <h2 className="text-[13.5px] font-bold tracking-[-0.3px] text-foreground">충전 끝나고 얼마나 있을까</h2>
        </div>
        <p className="mt-0.5 text-[11px] leading-[1.45] text-muted-foreground">
            완속 충전이 끝난 뒤 <strong className="font-semibold text-subtle-foreground">자리를 비우기까지</strong> 걸린
            시간이에요. 하루 안에 끝난 {abandon.count}번을 셌어요.
        </p>

        <div className="mt-2.5 flex gap-2">
            <div className="flex-1 rounded-xl bg-elevated px-3 py-2.5">
                <p className="text-[10px] font-medium text-muted-foreground">보통</p>
                <p className="mt-0.5 text-[17px] font-extrabold leading-none tracking-[-0.6px] text-foreground">
                    {formatDuration(abandon.median)}
                </p>
            </div>
            <div className="flex-1 rounded-xl bg-elevated px-3 py-2.5">
                <p className="text-[10px] font-medium text-muted-foreground">가장 오래</p>
                <p className="mt-0.5 text-[17px] font-extrabold leading-none tracking-[-0.6px] text-foreground">
                    {formatDuration(abandon.max)}
                </p>
            </div>
        </div>

        <div className="mt-3 flex flex-col gap-2">
            <Meter label="30분 넘김" ratio={abandon.over30Ratio} />
            <Meter label="1시간 넘김" ratio={abandon.over60Ratio} />
        </div>

        <p className="mt-3 text-[11px] leading-[1.5] text-subtle-foreground">
            충전이 끝난 자리 <strong className="font-bold text-foreground">{asPercent(abandon.over60Ratio)}</strong>는 한
            시간이 지나도 그대로였어요. 다음 사람을 위해 조금만 서둘러 주세요.
        </p>
    </section>
);
