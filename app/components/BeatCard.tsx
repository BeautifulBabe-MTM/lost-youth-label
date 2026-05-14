'use client';
import { Play, Pause } from 'lucide-react';
import { usePlayer } from '@/store/usePlayer';

export default function BeatCard({ beat }: { beat: any }) {
  const { setBeat, activeBeat, isPlaying, toggle } = usePlayer();
  const isCurrent = activeBeat?.id === beat.id;

  return (
    <div className="bg-zinc-900 p-4 rounded-lg flex items-center justify-between border border-zinc-800 hover:border-zinc-500 transition">
      <div>
        <h3 className="font-bold text-lg text-white">{beat.title}</h3>
        <p className="text-zinc-400 text-sm">{beat.bpm} BPM</p>
      </div>
      <button 
        onClick={() => isCurrent ? toggle() : setBeat(beat)}
        className="p-3 bg-white rounded-full text-black"
      >
        {isCurrent && isPlaying ? <Pause /> : <Play />}
      </button>
    </div>
  );
}