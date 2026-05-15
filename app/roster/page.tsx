import Image from 'next/image';
import { prisma } from '@/app/lib/db';
import ArtistCard from '@/app/components/ArtistCard';

async function getRoster() {
  const members = await prisma.rosterMember.findMany();

  const grouped = members.reduce((acc: any, member) => {
    // Временная логика: если это ты или кент, пихаем в одну группу
    const groupKey = (member.name === "Killaweed" || member.name === "boy toyyy")
      ? "OWNER_GROUP"
      : member.id;

    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(member);
    return acc;
  }, {});

  return Object.values(grouped);
}

export default async function RosterPage() {
  const groupedMembers = await getRoster();

  return (
    <main className="min-h-screen bg-black p-8 pt-24 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="border-l-4 border-white pl-6 mb-16">
          <h1 className="text-6xl font-black uppercase italic tracking-tighter">
            ЛЕЙБЛ <span className="text-zinc-800">/ 2026</span>
          </h1>
          <p className="text-zinc-500 mt-2 uppercase tracking-[0.4em] text-[10px] font-bold">
            КОЛЛЕКТИВ LOST YOUTH
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-zinc-900">
          {groupedMembers.map((profiles: any, idx: number) => (
            <ArtistCard key={idx} profiles={profiles} />
          ))}

          {/* Слот "Присоединяйся" */}
          <div className="bg-black flex items-center justify-center border-r border-b border-zinc-900 aspect-[3/4] hover:bg-zinc-950 transition-colors cursor-pointer group">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border border-dashed border-zinc-700 flex items-center justify-center group-hover:border-white transition-colors">
                <span className="text-2xl text-zinc-700 group-hover:text-white">+</span>
              </div>
              <p className="text-zinc-700 uppercase font-black text-sm tracking-widest group-hover:text-white transition-colors">Join the family</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}