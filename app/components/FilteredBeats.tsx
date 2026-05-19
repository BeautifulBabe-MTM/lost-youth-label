'use client';

import { useState } from 'react';
import BeatCard from './BeatCard';

export default function FilteredBeats({ beats, artists }: { beats: any[], artists: any[] }) {
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);

  const filteredBeats = selectedArtistId
    ? beats.filter(beat => beat.rosterMemberId === selectedArtistId)
    : beats;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 border-b border-zinc-900 pb-6">
        <button
          onClick={() => setSelectedArtistId(null)}
          className={`text-xs font-black uppercase tracking-widest px-4 py-2 border transition-all duration-300
            ${selectedArtistId === null 
              ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
              : 'bg-transparent text-zinc-500 border-zinc-900 hover:border-zinc-700 hover:text-white'}`}
        >
          ВСЕ БИТЫ [{beats.length}]
        </button>

        {artists.map((artist: any) => {
          const count = beats.filter(b => b.rosterMemberId === artist.id).length;

          return (
            <button
              key={artist.id}
              onClick={() => setSelectedArtistId(artist.id)}
              className={`text-xs font-black uppercase tracking-widest px-4 py-2 border transition-all duration-300
                ${selectedArtistId === artist.id 
                  ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                  : 'bg-transparent text-zinc-500 border-zinc-900 hover:border-zinc-700 hover:text-white'}`}
            >
              {artist.name} [{count}]
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBeats.map((beat) => (
          <BeatCard key={beat.id} beat={beat} />
        ))}

        {filteredBeats.length === 0 && (
          <div className="col-span-full py-20 text-center border border-dashed border-zinc-800">
            <p className="text-zinc-600 uppercase text-sm">
              У этого артиста пока нет загруженных треков.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}