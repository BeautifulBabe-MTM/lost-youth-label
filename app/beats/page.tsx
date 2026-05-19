import { prisma } from "@/app/lib/db";
import FilteredBeats from "@/app/components/FilteredBeats";

export const metadata = {
  title: 'MARKET // LOST YOUTH',
};

export default async function BeatsMarketPage() {
  const beats = await prisma.beat.findMany({
    include: {
      rosterMember: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const activeArtists = Array.from(
    new Map(
      beats
        .filter(b => b.rosterMember)
        .map(b => [b.rosterMember!.id, b.rosterMember])
    ).values()
  );

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <header className="mb-12">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">
          Beats Market
        </h1>
        <p className="text-zinc-500 uppercase text-xs tracking-[0.3em]">
          Эксклюзив и лизинг / Lost Youth Collective
        </p>
      </header>

      <FilteredBeats beats={beats} artists={activeArtists} />
    </main>
  );
}