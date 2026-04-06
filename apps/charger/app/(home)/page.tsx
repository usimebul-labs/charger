"use client"

import { DashboardHeader } from "./_components/DashboardHeader";
import { DashboardFilters } from "./_components/DashboardFilters";
import { StationGrid } from "./_components/StationGrid";
import { EmptyState } from "./_components/EmptyState";
import { useChargerDashboard } from "./_hooks/useChargerDashboard";

export default function Home() {
  const {
    showOnlyAvailable,
    setShowOnlyAvailable,
    filteredStations,
    availableSlow,
    availableFast,
    handleRefresh,
  } = useChargerDashboard();

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center selection:bg-blue-500/30 font-[family-name:var(--font-daki)]">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-[480px] min-h-screen bg-slate-900 border-x border-slate-800 relative flex flex-col pb-20">
        <DashboardHeader
          availableSlow={availableSlow}
          availableFast={availableFast}
          onRefresh={handleRefresh}
        />

        <main className="flex-1 px-6 pt-4">
          <DashboardFilters
            showOnlyAvailable={showOnlyAvailable}
            setShowOnlyAvailable={setShowOnlyAvailable}
          />

          {filteredStations.length > 0 ?
            <StationGrid /> :
            <EmptyState onReset={() => setShowOnlyAvailable(false)} />
          }
        </main>
      </div>
    </div>
  );
}
