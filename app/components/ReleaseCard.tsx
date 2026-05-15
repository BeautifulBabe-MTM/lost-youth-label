"use client";
import Image from 'next/image';
import { Play, Pause } from 'lucide-react';
import { usePlayer } from '@/store/usePlayer';

export default function ReleaseCard({ release }: { release: any }) {
  const { setBeat, activeBeat, isPlaying, toggle } = usePlayer();
  const isCurrent = activeBeat?.id === release.id;

  return (
    <div className="group relative bg-zinc-900 border border-zinc-900 overflow-hidden aspect-square">
      {release.coverUrl && (
        <Image 
          src={release.coverUrl} 
          alt={release.title} 
          fill 
          className={`object-cover transition-all duration-700 ${isCurrent ? 'grayscale-0 scale-105' : 'grayscale group-hover:grayscale-0 group-hover:scale-105'}`}
        />
      )}
      
      {/* Overlay */}
      <div className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4 transition-opacity duration-300 ${isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <h3 className="text-white font-black uppercase text-center text-sm tracking-tighter mb-1">
          {release.title}
        </h3>
        <p className="text-zinc-400 text-[9px] uppercase font-bold tracking-widest mb-4">
          {release.author?.name} 
        </p>

        <button 
          onClick={() => isCurrent ? toggle() : setBeat(release)}
          className="w-10 h-10 bg-white text-black flex items-center justify-center hover:scale-110 transition"
        >
          {isCurrent && isPlaying ? <Pause size={18} fill="black" /> : <Play size={18} fill="black" className="ml-0.5" />}
        </button>
      </div>

      {/* Маленький значок "Play" в углу, когда не наведен */}
      {!isCurrent && (
        <div className="absolute bottom-3 right-3 p-1 bg-black/50 backdrop-blur-md opacity-100 group-hover:opacity-0 transition-opacity">
           <Play size={10} className="text-white" />
        </div>
      )}
    </div>
  );
}