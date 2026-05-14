import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-black text-white antialiased">
        <nav className="flex items-center justify-between p-6 border-b border-zinc-900 sticky top-0 bg-black/80 backdrop-blur-md z-50">
          <Link href="/" className="text-xl font-black tracking-tighter">LOST YOUTH</Link>
          <div className="flex gap-8 text-xs font-bold uppercase tracking-widest">
            <Link href="/roster" className="hover:text-zinc-400 transition">Roster</Link>
            <Link href="/beats" className="hover:text-zinc-400 transition">Beats Market</Link>
            <Link href="/contact" className="hover:text-zinc-400 transition">Сотрудничество</Link>
          </div>
        </nav>
        {children}
        {/* Сюда позже воткнем глобальный плеер из Zustand */}
      </body>
    </html>
  );
}