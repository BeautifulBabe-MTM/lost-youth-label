import Image from 'next/image';
import { prisma } from '@/app/lib/db';

async function getRoster() {
  return await prisma.rosterMember.findMany();
}

export default async function RosterPage() {
  const members = await getRoster();

  return (
    <main className="min-h-screen bg-black p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="border-l-4 border-white pl-6 mb-16">
          <h1 className="text-6xl font-black uppercase italic tracking-tighter text-white">
            Roster <span className="text-zinc-800">/ 2026</span>
          </h1>
          <p className="text-zinc-500 mt-2 uppercase tracking-[0.4em] text-xs font-bold">
            The core of lost youth production
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-900 border border-zinc-900">
          {members.map((member) => (
            <div key={member.id} className="bg-black group relative overflow-hidden aspect-[3/4] transition-all">
              {/* Фото артиста */}
              {member.imageUrl && (
                <Image 
                  src={member.imageUrl} 
                  alt={member.name}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-60 group-hover:opacity-100"
                />
              )}

              {/* Оверлей с инфой */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black via-transparent to-transparent">
                <span className="text-[10px] font-mono text-white bg-zinc-900 self-start px-2 py-1 mb-2">
                  {member.role}
                </span>
                <h2 className="text-4xl font-black uppercase italic text-white leading-none tracking-tighter">
                  {member.name}
                </h2>
                
                <div className="mt-4 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {member.instagram && (
                    <a href={member.instagram} className="text-[10px] uppercase font-bold text-zinc-400 hover:text-white">Instagram</a>
                  )}
                  {member.spotify && (
                    <a href={member.spotify} className="text-[10px] uppercase font-bold text-zinc-400 hover:text-white">Spotify</a>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Пустая карточка для стиля (Заглушка "Join Us") */}
          <div className="bg-black flex items-center justify-center border border-dashed border-zinc-800 aspect-[3/4] hover:bg-zinc-950 transition-colors cursor-pointer">
            <p className="text-zinc-700 uppercase font-black text-xl tracking-widest -rotate-90">Join Roster</p>
          </div>
        </div>
      </div>
    </main>
  );
}