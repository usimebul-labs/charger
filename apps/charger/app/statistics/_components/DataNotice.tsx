import { Info } from "lucide-react";
import { DOW_LABELS, type ChargerStatistics } from "../_utils/stats";

/** `[1,2,3,4,5]` → `월~금`, 끊겨 있으면 `월·수·금` */
const summariseDows = (dows: number[]) => {
    if (dows.length === 0) return "–";
    const isRun = dows.every((d, i) => i === 0 || d === dows[i - 1]! + 1);
    if (isRun && dows.length > 2) return `${DOW_LABELS[dows[0]!]}~${DOW_LABELS[dows[dows.length - 1]!]}`;
    return dows.map((d) => DOW_LABELS[d]).join("·");
};

export const DataNotice = ({ stats }: { stats: ChargerStatistics }) => {
    const first = stats.hours[0];
    const last = stats.hours[stats.hours.length - 1];
    const isFullDay = stats.hours.length >= 24;

    return (
        <section className="mb-1.5 rounded-2xl border border-border bg-elevated/60 px-3.5 py-3">
            <div className="flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 flex-none text-muted-foreground" />
                <h2 className="text-[11.5px] font-bold tracking-[-0.2px] text-subtle-foreground">
                    이 통계를 읽을 때
                </h2>
            </div>

            <ul className="mt-1.5 flex flex-col gap-1 text-[10.5px] leading-[1.5] text-muted-foreground">
                <li>
                    · 이 화면의 모든 수치는 <strong className="font-semibold text-subtle-foreground">완속 충전기 {stats.chargerCount}대</strong>
                    만 센 값이에요. 급속 2대는 이용이 드물어 패턴이라 부를 만한 표본이 없어 제외했어요.
                </li>
                <li>
                    · 충전 현황은 5분마다 수집돼요. 5분보다 짧은 상태 변화는 기록에 남지 않아요.
                </li>
                <li>
                    · 충전 시간·방치 시간은 <strong className="font-semibold text-subtle-foreground">하루 안에 시작해서 끝난 경우</strong>
                    만 셌어요. 밤을 넘긴 충전은 그사이 수집이 없어 실제 길이를 알 수 없거든요.
                </li>
                {!isFullDay && (
                    <li>
                        · 지금은 <strong className="font-semibold text-subtle-foreground">{summariseDows(stats.dows)}요일 {first}시~{last}시</strong>
                        에만 수집이 이뤄지고 있어, 그 밖의 시간은 비워 두었어요. 수집 범위가 넓어지면 자동으로 채워져요.
                    </li>
                )}
                <li>
                    · &lsquo;충전 완료&rsquo;와 &lsquo;완료·케이블&rsquo; 상태는 홈 화면과 똑같이{" "}
                    <strong className="font-semibold text-subtle-foreground">충전 가능</strong>으로 셈해요.
                </li>
            </ul>
        </section>
    );
};
