import { create } from 'zustand';

interface StationState {
  showOnlyAvailable: boolean;
  setShowOnlyAvailable: (show: boolean) => void;
  toggleShowOnlyAvailable: () => void;
}

export const useStationStore = create<StationState>((set) => ({
  showOnlyAvailable: false,
  setShowOnlyAvailable: (show) => set({ showOnlyAvailable: show }),
  toggleShowOnlyAvailable: () => set((state) => ({ showOnlyAvailable: !state.showOnlyAvailable })),
}));
