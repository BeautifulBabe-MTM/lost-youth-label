import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-black">
      <aside className="w-64 border-r border-zinc-900 p-6 flex flex-col gap-8">
        <div className="text-sm font-black tracking-tighter text-white uppercase">
          Lost Youth / Admin
        </div>
        
        <nav className="flex flex-col gap-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
          <Link href="/admin/upload-beat" className="hover:text-white transition">
            Добавить бит
          </Link>
          <Link href="/admin/upload-release" className="hover:text-white transition">
            Добавить трек
          </Link>
          <Link href="/admin/manage" className="hover:text-white transition">
            Управление музыкой
          </Link>
          <Link href="/admin/roster" className="hover:text-white transition">
            Управление лейблом
          </Link>
          <Link href="/admin/stats" className="hover:text-white transition">
            Статистика
          </Link>
        </nav>

        <div className="mt-auto">
          <Link href="/" className="text-[10px] text-zinc-700 hover:text-zinc-400 uppercase tracking-widest">
            ← На сайт
          </Link>
        </div>
      </aside>

      {/* Основной контент страницы (например, форма загрузки) */}
      <main className="flex-1 p-12 bg-zinc-950/20">
        {children}
      </main>
    </div>
  );
}