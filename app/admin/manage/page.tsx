import { prisma } from "@/app/lib/db";
import ManageClient from "./ManageClient";

export default async function ManagePage() {
  const [beats, releases] = await Promise.all([
    prisma.beat.findMany({ orderBy: { id: 'desc' } }),
    prisma.release.findMany({ include: { author: true }, orderBy: { id: 'desc' } })
  ]);

  return (
    <main className="min-h-screen bg-black pt-24 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
            Музыка / <span className="text-zinc-600">Content Management</span>
          </h1>
        </header>
        
        <ManageClient initialBeats={beats} initialReleases={releases} />
      </div>
    </main>
  );
}