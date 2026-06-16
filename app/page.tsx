import Link from 'next/link';
import { prisma } from "@/app/lib/db";
import ReleaseCard from "@/app/components/ReleaseCard";
import BeatCard from "@/app/components/BeatCard";

async function getFeaturedData() {
  const [beats, releases] = await Promise.all([
    prisma.beat.findMany({
      take: 3,
      include: { rosterMember: true },
      orderBy: { id: 'desc' },
    }),
    prisma.release.findMany({
      take: 4,
      include: { author: true },
      orderBy: { createdAt: 'desc' },
    })
  ]);
  return { beats, releases };
}
export default async function HomePage() {
  const { beats, releases } = await getFeaturedData();

  return (
    <div className="flex flex-col">
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden border-b border-zinc-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-black to-black z-0" />

        <div className="relative z-10 text-center px-4">
          <h1 className="text-[12vw] font-black leading-none tracking-tighter uppercase mb-4 mix-blend-difference">
            Lost Youth
          </h1>
          <p className="text-zinc-500 text-sm md:text-lg uppercase tracking-[0.4em] max-w-2xl mx-auto mb-8">
            Независимый лейбл. Мрачный звук окраин, дрилл и минимализм.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/beats" className="bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition">
              Маркет битов
            </Link>
            <Link href="/roster" className="border border-zinc-800 px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition">
              Наши артисты
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 bg-zinc-950/40">
        <div className="flex justify-between items-end mb-12">
          <div className="border-l-4 border-white pl-6">
            <h2 className="text-4xl font-black uppercase tracking-tighter">Новые релизы</h2>
            <p className="text-zinc-500 text-xs uppercase tracking-widest mt-2 font-bold">Официальные дропы лейбла</p>
          </div>
          <Link href="/releases" className="text-zinc-500 hover:text-white text-[10px] uppercase tracking-widest border-b border-zinc-900 pb-1 transition-all">
            Слушать все
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {releases.map((release: any) => (
            <ReleaseCard key={release.id} release={release} />
          ))}
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 border-t border-zinc-900">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter">Свежее мясо</h2>
            <p className="text-zinc-500 text-xs uppercase tracking-widest mt-2 font-bold">Биты от наших продюсеров</p>
          </div>
          <Link href="/beats" className="text-zinc-500 hover:text-white text-[10px] uppercase tracking-widest border-b border-zinc-900 pb-1 transition-all">
            В маркет
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {beats.map((beat: any) => (
            <BeatCard key={beat.id} beat={beat} />
          ))}
        </div>
      </section>

      <section className="py-32 px-6 border-t border-zinc-900 bg-zinc-950/30">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold text-zinc-600 uppercase tracking-[0.5em] block mb-6 italic">Манифест</span>
          <h3 className="text-2xl md:text-4xl font-medium leading-relaxed tracking-tight">
            Мы не ищем тренды. Мы создаем холодную атмосферу бетонных джунглей через минимализм и жесткий бас. Продажа эксклюзивных прав и полная дистрибуция.
          </h3>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] text-zinc-600 uppercase tracking-widest">
        <div>© {new Date().getFullYear()} Lost Youth Label. Все права защищены.</div>
        <div className="flex gap-8">
          <a href="https://t.me/+gwRalYmx77EyNDIy" className="hover:text-white transition">Telegram</a>
          <a href="#" className="hover:text-white transition">VK</a>
          <a href="#" className="hover:text-white transition">YouTube</a>
        </div>
      </footer>
    </div>
  );
}