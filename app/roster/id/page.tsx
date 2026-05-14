import { prisma } from "@/app/lib/db";
import { notFound } from "next/navigation";

export default async function ArtistPage({ params }: { params: { id: string } }) {
  // Ждем параметры (в Next 15 это важно)
  const { id } = await params;

  const artist = await prisma.user.findUnique({
    where: { id },
    include: { beats: true }
  });

  if (!artist) return notFound();

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-6xl font-black uppercase mb-4">{artist.name}</h1>
      <p className="text-zinc-400 mb-8">{artist.bio || "Resident of LOST YOUTH"}</p>
      
      <h2 className="text-2xl font-bold mb-6 uppercase tracking-widest">Selected Works</h2>
      <div className="grid gap-4">
        {artist.beats.map((beat) => (
          <div key={beat.id} className="p-4 border border-zinc-800 flex justify-between items-center">
            <span>{beat.title}</span>
            <span className="text-zinc-500 text-sm">{beat.genre}</span>
          </div>
        ))}
      </div>
    </main>
  );
}