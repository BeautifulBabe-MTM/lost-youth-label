import { prisma } from "@/app/lib/db";
import BeatCard from "@/app/components/BeatCard";

// Эта функция тянет все биты из базы, включая инфу об авторе
async function getAllBeats() {
  return await prisma.beat.findMany({
    include: {
      author: true,
    },
    orderBy: {
      id: 'desc', // Сначала новые
    },
  });
}

export default async function BeatsMarketPage() {
  const beats = await getAllBeats();

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <header className="mb-12">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">
          Beats Market
        </h1>
        <p className="text-zinc-500 uppercase text-xs tracking-[0.3em]">
          Exclusive & Lease / Lost Youth Collective
        </p>
      </header>

      {/* Сетка битов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {beats.map((beat) => (
          <BeatCard key={beat.id} beat={beat} />
        ))}
        
        {beats.length === 0 && (
          <div className="col-span-full py-20 text-center border border-dashed border-zinc-800">
            <p className="text-zinc-600 uppercase text-sm">Маркет пока пуст. Загрузи первый дрилл-бит через Prisma Studio.</p>
          </div>
        )}
      </div>
    </main>
  );
}