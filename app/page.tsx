  import BeatCard from '@/app/components/BeatCard';

  async function getBeats() {
    const res = await fetch('http://localhost:3000/api/beats', { cache: 'no-store' });
    return res.json();
  }

  export default async function Home() {
    const beats = await getBeats();

    return (
      <main className="min-h-screen bg-black text-white p-8">
        {/* Секция лейбла */}
        <section className="mb-20 mt-10">
          <h1 className="text-8xl font-black uppercase tracking-tighter leading-none mb-4">
            LOST <br /> YOUTH
          </h1>
          <p className="max-w-md text-zinc-400 text-lg border-l-2 border-white pl-4 italic">
            Независимый лейбл. Мрачный звук окраин, дрилл и минимализм. 
            Продажа эксклюзивных прав и дистрибуция.
          </p>
        </section>

        {/* Фильтр (позже пригодится) */}
        <div className="flex gap-4 mb-10 text-sm font-bold uppercase">
          <button className="border-b-2 border-white pb-1">Our Featured Beats</button>
          <button className="text-zinc-600 hover:text-zinc-300 transition">Community Market</button>
        </div>

        <div className="grid gap-4 max-w-3xl">
          {beats.map((beat: any) => (
            <BeatCard key={beat.id} beat={beat} />
          ))}
        </div>
      </main>
    );
  }