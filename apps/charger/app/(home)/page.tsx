"use client"
import { DashboardFilters } from "./_components/DashboardFilters";
import { DashboardHeader } from "./_components/DashboardHeader";
import { StationGrid } from "./_components/StationGrid";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 flex justify-center selection:bg-blue-500/30 font-[family-name:var(--font-daki)]">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-[480px] min-h-screen bg-slate-900 border-x border-slate-800 relative flex flex-col pb-20">
        <DashboardHeader />

        <main className="flex-1 px-6 pt-4">
          <DashboardFilters />
          <StationGrid />
        </main>
      </div>
    </div>
  );
}
