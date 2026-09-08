import { create } from 'zustand';
import { ChargerInfo } from '../types/charger';

interface StationState {
  selectedStation: ChargerInfo | null;
  selectedStationIndex: number | null;
  setSelectedStation: (station: ChargerInfo | null, index?: number | null) => void;
}

export const useStationStore = create<StationState>((set) => ({
  selectedStation: null,
  selectedStationIndex: null,
  setSelectedStation: (station, index = null) => set({ selectedStation: station, selectedStationIndex: index }),
}));
