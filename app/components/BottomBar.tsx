'use client';
import { usePlayer } from '@/store/usePlayer';
import { Play, Pause, SkipForward, Volume2 } from 'lucide-react';

export default function BottomBar() {
  const { activeBeat, isPlaying, toggle, currentTime, duration, setProgress } = usePlayer();

  if (!activeBeat) return null;

  const progress = (currentTime / duration) * 100 || 0;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setProgress(newTime);
    const audio = document.querySelector('audio');
    if (audio) audio.currentTime = newTime;
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black/90 backdrop-blur-xl border-t border-zinc-900 z-[100] px-6 py-4">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-zinc-800 group cursor-pointer">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="absolute top-[-4px] left-0 w-full h-2 opacity-0 cursor-pointer z-10"
        />
        <div 
          className="h-full bg-white transition-all duration-100 ease-out relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-[-2px] w-2 h-2 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4 w-1/3">
          <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <div className={`w-2 h-2 bg-white rounded-full ${isPlaying ? 'animate-ping' : ''}`} />
          </div>
          <div>
            <h4 className="text-sm font-black uppercase italic text-white leading-none">{activeBeat.title}</h4>
            <p className="text-[10px] text-zinc-500 font-mono mt-1 uppercase">{activeBeat.genre} / {activeBeat.bpm} BPM</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 w-1/3">
          <div className="flex items-center gap-6">
            <button className="text-zinc-500 hover:text-white transition"><SkipForward size={18} className="rotate-180" /></button>
            <button 
              onClick={toggle}
              className="w-10 h-10 bg-white text-black flex items-center justify-center hover:scale-105 transition"
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
            </button>
            <button className="text-zinc-500 hover:text-white transition"><SkipForward size={18} /></button>
          </div>
          <div className="flex gap-2 text-[9px] font-mono text-zinc-600 uppercase">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex justify-end items-center gap-4 w-1/3">
          <Volume2 size={16} className="text-zinc-500" />
          <div className="w-24 h-[1px] bg-zinc-800 relative">
             <div className="absolute inset-0 bg-white w-1/2" /> {/* Заглушка под громкость */}
          </div>
          <span className="text-[10px] font-black text-white ml-2">${activeBeat.price}</span>
        </div>
      </div>
    </div>
  );
}