"use client";
import { useState } from 'react';
import ReleaseCard from '@/app/components/ReleaseCard';

export default function ReleasesClient({ initialReleases, artists }: any) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredReleases = activeFilter === "all" 
    ? initialReleases 
    : initialReleases.filter((r: any) => r.rosterMemberId === activeFilter);

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-12 border-b border-zinc-900 pb-8">
        <button 
          onClick={() => setActiveFilter("all")}
          className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest transition border ${
            activeFilter === 'all' 
            ? 'bg-white text-black border-white' 
            : 'text-zinc-500 border-zinc-800 hover:border-zinc-500'
          }`}
        >
          Все релизы
        </button>

        {artists.map((artist: any) => (
          <button 
            key={artist.id}
            onClick={() => setActiveFilter(artist.id)}
            className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest transition border ${
              activeFilter === artist.id 
              ? 'bg-white text-black border-white' 
              : 'text-zinc-500 border-zinc-800 hover:border-zinc-500'
            }`}
          >
            {artist.name}
          </button>
        ))}
      </div>

      {filteredReleases.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredReleases.map((release: any) => (
            <div key={release.id} className="flex flex-col gap-3">
              <ReleaseCard release={release} />
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-600 font-mono">
                  {new Date().getFullYear()} © LY
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border border-dashed border-zinc-900">
          <p className="text-zinc-600 uppercase text-xs tracking-widest font-bold">
            У этого артиста пока нет опубликованных треков
          </p>
        </div>
      )}
    </div>
  );
}