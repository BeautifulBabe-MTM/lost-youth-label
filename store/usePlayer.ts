import { create } from 'zustand';

interface Beat {
  id: string;
  title: string;
  url: string;
}

interface PlayerStore {
  activeBeat: Beat | null;
  isPlaying: boolean;
  setBeat: (beat: Beat) => void;
  toggle: () => void;
}

export const usePlayer = create<PlayerStore>((set) => ({
  activeBeat: null,
  isPlaying: false,
  setBeat: (beat) => set({ activeBeat: beat, isPlaying: true }),
  toggle: () => set((state) => ({ isPlaying: !state.isPlaying })),
}));