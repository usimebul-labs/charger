import { create } from 'zustand';
import { ChargerInfo } from '../types/charger';

interface StationState {
  showOnlyAvailable: boolean;
  selectedStation: ChargerInfo | null;
  setShowOnlyAvailable: (show: boolean) => void;
  toggleShowOnlyAvailable: () => void;
  setSelectedStation: (station: ChargerInfo | null) => void;
}

export const useStationStore = create<StationState>((set) => ({
  showOnlyAvailable: false,
  selectedStation: null,
  setShowOnlyAvailable: (show) => set({ showOnlyAvailable: show }),
  toggleShowOnlyAvailable: () => set((state) => ({ showOnlyAvailable: !state.showOnlyAvailable })),
  setSelectedStation: (station) => set({ selectedStation: station }),
}));
