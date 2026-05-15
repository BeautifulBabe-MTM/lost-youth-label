'use client';
import { Play, Pause } from 'lucide-react';
import { usePlayer } from '@/store/usePlayer';

export default function BeatCard({ beat }: { beat: any }) {
  const { setBeat, activeBeat, isPlaying, toggle } = usePlayer();
  const isCurrent = activeBeat?.id === beat.id;

  // Проверяем роль артиста через подтянутую связь
  const isLabel = beat.rosterMember?.role === "LABEL";
  
  // Берем имя из rosterMember (Killaweed или boy toyyy)
  const artistName = beat.rosterMember?.name || "Independent";

  return (
    <div 
      className={`relative h-24 w-full overflow-hidden border transition-all duration-500 group
        ${isCurrent ? 'border-white' : 'border-zinc-900 hover:border-zinc-700'}`}
    >
      <div className="absolute inset-0 bg-zinc-950" />
      <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-50" />

      {/* УГЛОВАЯ ПОДПИСЬ */}
      {isLabel && (
        <div className="absolute top-0 left-0 z-20">
          <div className="bg-white text-black text-[7px] font-black px-2 py-0.5 uppercase tracking-tighter shadow-2xl">
            LOST YOUTH LABEL
          </div>
        </div>
      )}

      <div className="relative h-full flex items-center justify-between px-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            {isLabel && (
              <span className="text-[9px] font-black text-white bg-zinc-800 px-1.5 py-0.5 uppercase tracking-widest mr-1">
                LABEL
              </span>
            )}
            
            <span className="text-[10px] font-mono text-zinc-600 tracking-tighter">
              {beat.bpm} BPM
            </span>
            <span className="h-[1px] w-4 bg-zinc-800" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
              {beat.genre}
            </span>
          </div>
          
          <h3 className="text-xl font-black uppercase italic tracking-tighter text-white leading-tight mt-1 group-hover:tracking-normal transition-all duration-300">
            {beat.title}
          </h3>
          
          {/* ТЕПЕРЬ ТУТ БУДЕТ ВЫВОДИТЬСЯ ИМЯ (Killaweed / boy toyyy) */}
          <p className="text-[9px] text-white uppercase font-black tracking-[0.2em] mt-0.5">
            PROD. BY <span className={isLabel ? "text-white" : "text-zinc-500"}>
              {artistName}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest leading-none mb-1">Цена</p>
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