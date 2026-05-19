import { prisma } from "@/app/lib/db";

export const metadata = {
    title: "STATS // LOST YOUTH ADMIN",
};

export const dynamic = "force-dynamic";

export default async function AdminStatsPage() {
    const totalBeatsCount = await prisma.beat.count();
    const totalArtistsCount = await prisma.user.count();

    const beatsData = await prisma.beat.findMany({
        select: { price: true, genre: true }
    });

    const totalMarketValue = beatsData.reduce((acc, beat) => acc + (Number(beat.price) || 0), 0);

    const genreStats: { [key: string]: number } = {};
    beatsData.forEach(beat => {
        if (beat.genre) {
            genreStats[beat.genre] = (genreStats[beat.genre] || 0) + 1;
        }
    });

    const topGenres = Object.entries(genreStats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const producersWithCount = await prisma.rosterMember.findMany({
        where: {
            role: "Producer"
        },
        include: {
            _count: {
                select: { beats: true }
            }
        },
        orderBy: {
            beats: {
                _count: 'desc'
            }
        },
        take: 5
    });

    return (
        <main className="min-h-screen bg-black text-white p-8 font-sans">
            <header className="mb-12 border-b border-zinc-900 pb-6">
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
                    Контрольный центр / <span className="text-zinc-600">Статистика</span>
                </h1>
                <p className="text-zinc-500 uppercase text-xs tracking-[0.3em]">
                    Внутренняя Аналитика Lost Youth Label
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-zinc-950 border border-zinc-900 p-6 flex flex-col justify-between h-36">
                    <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Всего битов</span>
                    <span className="text-5xl font-black tracking-tighter font-mono">{totalBeatsCount}</span>
                </div>

                <div className="bg-zinc-950 border border-zinc-900 p-6 flex flex-col justify-between h-36">
                    <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Артистов</span>
                    <span className="text-5xl font-black tracking-tighter font-mono">{totalArtistsCount}</span>
                </div>

                <div className="bg-zinc-950 border border-zinc-900 p-6 flex flex-col justify-between h-36">
                    <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Ценность каталога</span>
                    <span className="text-5xl font-black tracking-tighter font-mono text-emerald-500">${totalMarketValue.toFixed(2)}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-zinc-950 border border-zinc-900 p-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-6 border-b border-zinc-900 pb-2">// ТОП ЖАНРЫ</h3>
                    <div className="space-y-4">
                        {topGenres.map(([genre, count], index) => {
                            const percentage = totalBeatsCount > 0 ? (count / totalBeatsCount) * 100 : 0;
                            return (
                                <div key={genre} className="space-y-1">
                                    <div className="flex justify-between text-xs font-bold uppercase">
                                        <span className="text-white font-mono">{index + 1}. {genre}</span>
                                        <span className="text-zinc-400">{count} шт.</span>
                                    </div>
                                    <div className="w-full bg-zinc-900 h-1">
                                        <div className="bg-white h-1" style={{ width: `${percentage}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-900 p-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-6 border-b border-zinc-900 pb-2">// ПРОДЮСЕРЫ</h3>
                    <div className="divide-y divide-zinc-900">
                        {producersWithCount.map((producer, index) => (
                            <div key={producer.id} className="py-3 flex justify-between items-center">
                                <span className="text-xs font-black uppercase">{index + 1}. {producer.name}</span>
                                <span className="font-mono text-xs text-zinc-400 bg-zinc-900 px-3 py-1">{producer._count.beats} БИТОВ</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}