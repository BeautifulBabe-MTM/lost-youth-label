import { create } from 'zustand';

interface Beat {
  id: string;
  title: string;
  url: string;
}

interface PlayerStore {
  activeBeat: any | null;
  isPlaying: boolean;
  setBeat: (beat: any) => void;
  toggle: () => void;
  setPlaying: (val: boolean) => void; // Добавь эту строку
}

export const usePlayer = create<PlayerStore>((set) => ({
  activeBeat: null,
  isPlaying: false,
  setBeat: (beat) => set({ activeBeat: beat, isPlaying: true }),
  toggle: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setPlaying: (val) => set({ isPlaying: val }), // И саму функцию здесь
}));