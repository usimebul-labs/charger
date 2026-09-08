import { create } from 'zustand';

interface ToastState {
  message: string;
  show: (message: string) => void;
  hide: () => void;
}

let timer: ReturnType<typeof setTimeout> | null = null;

export const useToastStore = create<ToastState>((set) => ({
  message: '',
  show: (message) => {
    if (timer) clearTimeout(timer);
    set({ message });
    timer = setTimeout(() => set({ message: '' }), 2400);
  },
  hide: () => {
    if (timer) clearTimeout(timer);
    set({ message: '' });
  },
}));
