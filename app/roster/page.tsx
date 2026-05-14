import { prisma } from "@/app/lib/db";
import Link from 'next/link';

export default async function RosterPage() {
  const residents = await prisma.user.findMany({
    where: { role: 'RESIDENT' } // Выбираем только своих
  });

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <h1 className="text-6xl font-black mb-12 uppercase tracking-tighter">Артисты</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {residents.map((artist) => (
          <Link href={`/roster/${artist.id}`} key={artist.id} className="group">
            <div className="aspect-[4/5] bg-zinc-900 mb-4 overflow-hidden border border-zinc-800">
              {/* Тут будет фото артиста */}
              <div className="w-full h-full group-hover:scale-105 transition duration-500 bg-gradient-to-t from-zinc-900 to-transparent" />
            </div>
            <h2 className="text-3xl font-bold uppercase tracking-tight">{artist.name}</h2>
            <p className="text-zinc-500 uppercase text-sm tracking-widest">Producer / Beatmaker</p>
          </Link>
        ))}
      </div>
    </main>
  );
}