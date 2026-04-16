import { BarChart2 } from "lucide-react";

export default function StatisticsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center mb-6">
        <BarChart2 className="w-8 h-8 text-brand-500" />
      </div>
      <h1 className="text-xl font-bold text-foreground mb-2 tracking-tight">충전 통계 및 추이</h1>
      <p className="text-sm text-muted-foreground whitespace-pre-line relative z-10">
        {"데이터 기반의 충전 효율 및\n사용 패턴 분석 기능이 추가될 예정입니다."}
      </p>
    </div>
  );
}
