'use client';
import { Play, Pause } from 'lucide-react';
import { usePlayer } from '@/store/usePlayer';

export default function BeatCardCompact({ beat }: { beat: any }) {
  const { setBeat, activeBeat, isPlaying, toggle } = usePlayer();
  const isCurrent = activeBeat?.id === beat.id;

  return (
    <div 
      className={`relative h-24 w-full overflow-hidden border transition-all duration-500 group
        ${isCurrent ? 'border-white' : 'border-zinc-900 hover:border-zinc-700'}`}
    >
      {/* Текстурный фон (легкий шум или градиент) */}
      <div className="absolute inset-0 bg-zinc-950" />
      <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-50" />

      <div className="relative h-full flex items-center justify-between px-6">
        
        {/* Инфо-блок */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-zinc-600 tracking-tighter">
              {beat.bpm} BPM
            </span>
            <span className="h-[1px] w-4 bg-zinc-800" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              {beat.genre}
            </span>
          </div>
          
          <h3 className="text-xl font-black uppercase italic tracking-tighter text-white leading-tight mt-1 group-hover:tracking-normal transition-all duration-300">
            {beat.title}
          </h3>
        </div>

        {/* Правая часть: Цена и Play */}
        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">Цена</p>
            <p className="text-lg font-mono text-white">${beat.price}</p>
          </div>

          <button 
            onClick={() => isCurrent ? toggle() : setBeat(beat)}
            className={`w-12 h-12 flex items-center justify-center border transition-all duration-300
              ${isCurrent 
                ? 'bg-white text-black border-white' 
                : 'bg-transparent text-white border-zinc-800 group-hover:border-white'}`}
          >
            {isCurrent && isPlaying ? (
              <Pause size={20} fill="currentColor" />
            ) : (
              <Play size={20} fill="currentColor" className="ml-0.5" />
            )}
          </button>
        </div>
      </div>

      <div className={`absolute bottom-0 left-0 h-[1px] transition-all duration-700 
        ${isCurrent ? 'w-full bg-white' : 'w-0 bg-zinc-500 group-hover:w-12'}`} 
      />
    </div>
  );
}