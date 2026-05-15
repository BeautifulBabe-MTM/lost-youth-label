import { prisma } from "@/app/lib/db";
import ReleasesClient from "./ReleasesClient";

export default async function ReleasesPage() {
  // Тянем все релизы с авторами и всех артистов ростера для фильтра
  const [releases, artists] = await Promise.all([
    prisma.release.findMany({
      include: { author: true },
      orderBy: { id: 'desc' },
    }),
    prisma.rosterMember.findMany({
      select: { id: true, name: true },
    }),
  ]);

  return (
    <main className="min-h-screen bg-black pt-32 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <h1 className="text-7xl font-black uppercase italic tracking-tighter text-white">
            Релизы
          </h1>
          <p className="text-zinc-500 uppercase tracking-[0.5em] text-[10px] mt-4 italic">
            Официальная Дискография / Lost Youth Label
          </p>
        </header>

        {/* Передаем данные в клиентский компонент */}
        <ReleasesClient initialReleases={releases} artists={artists} />
      </div>
    </main>
  );
}