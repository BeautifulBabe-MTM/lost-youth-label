'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function ArtistCard({ profiles }: { profiles: any[] }) {
  const [index, setIndex] = useState(0);
  const current = profiles[index];
  const isMulti = profiles.length > 1;

  const handleCardClick = () => {
    if (isMulti) {
      setIndex((prev) => (prev + 1) % profiles.length);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`relative bg-black group overflow-hidden aspect-[3/4] border-r border-b border-zinc-900 transition-all duration-500
        ${isMulti ? 'cursor-pointer active:scale-[0.98]' : ''}`}
    >
      {current.imageUrl && (
        <Image 
          key={current.imageUrl}
          src={current.imageUrl} 
          alt={current.name}
          fill
          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-40 group-hover:opacity-100 animate-in fade-in zoom-in-95 duration-500"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />

      <div className="absolute inset-0 flex flex-col justify-end p-8 z-20">
        
        <div className="flex flex-wrap gap-1 mb-3">
          {profiles.map((p, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setIndex(idx);
              }}
              className={`text-[8px] font-black px-2 py-0.5 uppercase tracking-tighter border transition-all
                ${idx === index 
                  ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]' 
                  : 'bg-black/50 text-zinc-500 border-zinc-800 hover:border-zinc-500 hover:text-white'}`}
            >
              {p.role}
            </button>
          ))}
        </div>

        <h2 className="text-4xl font-black uppercase italic text-white leading-none tracking-tighter transition-all group-hover:translate-x-1">
          {current.name}
        </h2>
        
        {isMulti && (
          <div className="mt-2 flex items-center gap-2 overflow-hidden">
            <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest whitespace-nowrap">
              aka {profiles.filter((_, i) => i !== index).map(p => p.name).join(' / ')}
            </span>
          </div>
        )}

        <div className="mt-4 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
          {current.instagram && (
            <a href={current.instagram} target="_blank" className="text-[10px] uppercase font-bold text-zinc-400 hover:text-white">Instagram</a>
          )}
          {current.spotify && (
            <a href={current.spotify} target="_blank" className="text-[10px] uppercase font-bold text-zinc-400 hover:text-white">Spotify</a>
          )}
        </div>
      </div>

      {isMulti && (
        <div className="absolute top-4 right-4">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
        </div>
      )}
    </div>
  );
}