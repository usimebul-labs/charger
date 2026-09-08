import { BarChart2 } from "lucide-react";
import { ChargerRankingCard } from "./_components/ChargerRankingCard";
import { ChargingFactsCard } from "./_components/ChargingFactsCard";
import { CongestionHeatmap } from "./_components/CongestionHeatmap";
import { DataNotice } from "./_components/DataNotice";
import { GoldenTimeChart } from "./_components/GoldenTimeChart";
import { MannerCard } from "./_components/MannerCard";
import { NowCard } from "./_components/NowCard";
import { StatisticsHeader } from "./_components/StatisticsHeader";
import { getChargerStatistics } from "./_utils/getStatistics";

/** 상태 로그는 5분마다 쌓이지만 요일·시간 패턴은 그보다 훨씬 천천히 움직인다 */
export const revalidate = 3600;

export default async function StatisticsPage() {
  const stats = await getChargerStatistics();

  if (!stats) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <StatisticsHeader />
        <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto p-6 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/10">
            <BarChart2 className="h-8 w-8 text-brand-500" />
          </div>
          <h2 className="mb-2 text-xl font-bold tracking-tight text-foreground">아직 통계를 낼 수 없어요</h2>
          <p className="whitespace-pre-line text-sm text-muted-foreground">
            {"충전 현황 기록이 더 쌓이면\n혼잡도와 골든타임을 보여드릴게요."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <StatisticsHeader
        period={{ from: stats.from, to: stats.to, days: stats.observedDays }}
        chargerCount={stats.chargerCount}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3.5 pb-1.5 pt-2.5">
        <NowCard stats={stats} />
        <CongestionHeatmap stats={stats} />
        <GoldenTimeChart stats={stats} />
        {stats.abandon && <MannerCard abandon={stats.abandon} />}
        {stats.charging && <ChargingFactsCard charging={stats.charging} daily={stats.daily} />}
        <ChargerRankingCard ranking={stats.ranking} />
        <DataNotice stats={stats} />
      </div>
    </div>
  );
}
