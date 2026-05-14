import { create } from 'zustand';

interface PlayerState {
  currentBeat: any | null;
  isPlaying: boolean;
  setBeat: (beat: any) => void;
  togglePlay: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentBeat: null,
  isPlaying: false,
  setBeat: (beat) => set({ currentBeat: beat, isPlaying: true }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
}));