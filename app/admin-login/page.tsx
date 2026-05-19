'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('ПРОВЕРКА КЛЮЧА ДОСТУПА...');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setStatus('ДОСТУП РАЗРЕШЕН. ВХОД...');
        router.push('/admin/stats'); // Уводим в дашборд статистики
        router.refresh();
      } else {
        setStatus('НЕВЕРНЫЙ КЛЮЧ ДОСТУПА. ОТКАЗАНО.');
      }
    } catch (err) {
      setStatus('СБОЙ СЕТИ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6 font-sans">
      <div className="max-w-sm w-full bg-zinc-950 border border-zinc-900 p-8 shadow-2xl">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-black uppercase tracking-tighter italic">
            LOST YOUTH / <span className="text-zinc-600">CORE</span>
          </h1>
          <p className="text-[9px] text-zinc-500 uppercase tracking-[0.2em] mt-1">
            Вход в закрытый терминал управления
          </p>
        </header>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[9px] uppercase text-zinc-500 font-bold tracking-widest">Введите секретный пароль</label>
            <input
              required
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black border border-zinc-800 p-4 outline-none focus:border-white transition font-mono text-center text-sm tracking-widest text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-white text-black font-black p-4 uppercase tracking-[0.3em] text-xs hover:bg-zinc-200 transition active:scale-[0.98] disabled:bg-zinc-800 disabled:text-zinc-500"
          >
            {loading ? 'ПРОВЕРКА...' : 'АВТОРИЗАЦИЯ'}
          </button>

          {status && (
            <p className="text-[9px] uppercase text-center text-zinc-400 mt-2 tracking-wider font-mono italic">
              {status}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}