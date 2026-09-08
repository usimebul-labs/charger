import { create } from 'zustand';

/** 토스트가 붙는 위치 — 바텀 시트가 떠 있으면 시트에 가리지 않도록 위쪽에 붙인다 */
type ToastAnchor = 'top' | 'bottom';

interface ToastState {
  message: string;
  anchor: ToastAnchor;
  /** 열려 있는 바텀 시트 수 */
  openSheetCount: number;
  show: (message: string) => void;
  hide: () => void;
  openSheet: () => void;
  closeSheet: () => void;
}

let timer: ReturnType<typeof setTimeout> | null = null;

export const useToastStore = create<ToastState>((set, get) => ({
  message: '',
  anchor: 'bottom',
  openSheetCount: 0,
  show: (message) => {
    if (timer) clearTimeout(timer);
    // 위치는 띄우는 순간에 확정한다 — 표시 중에 시트가 닫혀도 토스트가 튀지 않도록
    set({ message, anchor: get().openSheetCount > 0 ? 'top' : 'bottom' });
    timer = setTimeout(() => set({ message: '' }), 2400);
  },
  hide: () => {
    if (timer) clearTimeout(timer);
    set({ message: '' });
  },
  openSheet: () => set((s) => ({ openSheetCount: s.openSheetCount + 1 })),
  closeSheet: () => set((s) => ({ openSheetCount: Math.max(0, s.openSheetCount - 1) })),
}));
