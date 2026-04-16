import { Lightbulb } from "lucide-react";

export default function TipsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center mb-6">
        <Lightbulb className="w-8 h-8 text-brand-500" />
      </div>
      <h1 className="text-xl font-bold text-foreground mb-2 tracking-tight">전기차 및 충전 팁</h1>
      <p className="text-sm text-muted-foreground whitespace-pre-line relative z-10">
        {"배터리 관리 노하우와 효율적인 충전 방법 등\n유용한 팁이 제공될 예정입니다."}
      </p>
    </div>
  );
}
