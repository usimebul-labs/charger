import React from "react";
import { Station } from "./types";
import { StationCard } from "./StationCard";

interface StationGridProps {
  floors: number[];
  stations: Station[];
}

export const StationGrid = ({ floors, stations }: StationGridProps) => {
  return (
    <div className="space-y-4">
      {floors.map((floor) => {
        const floorStations = stations.filter((s) => s.floor === floor);
        if (floorStations.length === 0) return null;

        return (
          <section key={floor} className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-[11px] font-black text-slate-600 tracking-wider">지하 {floor}층 14번 기둥</h2>
              <div className="h-px flex-1 bg-slate-800/30"></div>
            </div>

            {/* 3 Columns Layout (grid-cols-3) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-6">
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
