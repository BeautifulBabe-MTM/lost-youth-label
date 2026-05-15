import './globals.css';
import Link from 'next/link';
import AudioPlayer from '@/app/components/AudioPlayer';
import BottomBar from './components/BottomBar';
import type { Metadata } from 'next';
import PlayerUI from './components/PlayerUI';

export const metadata: Metadata = {
  title: 'LOST YOUTH — BEATMAKING & PRODUCTION',
  description: 'Custom beats for drill, trap and minimalist artists.',
  // Можно добавить иконку (фавикон)
  icons: {
    icon: '/favicon.ico', // положи картинку в папку public
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-black text-white antialiased">
        <nav className="flex items-center justify-between p-6 border-b border-zinc-900 sticky top-0 bg-black/80 backdrop-blur-md z-50">
          <Link href="/" className="text-xl font-black tracking-tighter">LOST YOUTH</Link>
          <div className="flex gap-8 text-xs font-bold uppercase tracking-widest">
            <Link href="/roster" className="hover:text-zinc-400 transition">Лейбл</Link>
            <Link href="/releases" className="hover:text-zinc-400 transition">Релизы</Link>
            <Link href="/beats" className="hover:text-zinc-400 transition">Beats Market</Link>
            <Link href="/contact" className="hover:text-zinc-400 transition">Сотрудничество</Link>
          </div>
        </nav>
        {children}
        <AudioPlayer />
        <BottomBar />
        <PlayerUI />
      </body>
    </html>
  );
}