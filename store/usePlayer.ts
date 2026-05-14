import { create } from 'zustand';

interface Beat {
  id: string;
  title: string;
  url: string;
}

interface PlayerStore {
  activeBeat: any | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  setBeat: (beat: any) => void;
  toggle: () => void;
  setPlaying: (val: boolean) => void;
  setProgress: (time: number) => void;
  setDuration: (time: number) => void;
}

export const usePlayer = create<PlayerStore>((set) => ({
  activeBeat: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  setBeat: (beat) => set({ activeBeat: beat, isPlaying: true, currentTime: 0 }),
  toggle: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setPlaying: (val) => set({ isPlaying: val }),
  setProgress: (time) => set({ currentTime: time }),
  setDuration: (time) => set({ duration: time }),
}));