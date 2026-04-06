import { useStationStore } from "@/store/useStationStore";
import { useStations } from "../_hooks/useStations";
import { StationCard } from "./StationCard";
import { EmptyState } from "./EmptyState";


const floors = ["B3", "B4", "B5"];
export const StationGrid = () => {
  const { showOnlyAvailable } = useStationStore();
  const { data: stations, isLoading } = useStations();

  if (isLoading) return <div>Loading...</div>;
  if (!stations) return <div>Error...</div>;

  const filteredStations = stations.filter((s) => {
    if (showOnlyAvailable) return s.status.code === "2" || s.status.code === "9";
    return true;
  });

  if (filteredStations.length === 0) return <EmptyState />

  return (
    <div className="space-y-4">
      {floors.map((floor) => {
        const floorStations = filteredStations.filter((s) => s.floor === floor);
        if (floorStations.length === 0) return null;

        return (
          <section key={floor} className="space-y-4 mb-2">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-[11px] font-black text-slate-600 tracking-wider">지하 {floor}층 14번 기둥</h2>
              <div className="h-px flex-1 bg-slate-800/30"></div>
            </div>

            {/* 3 Columns Layout (grid-cols-3) */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6">
              {floorStations.map((station) => (
                <StationCard key={station.id} station={station} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
