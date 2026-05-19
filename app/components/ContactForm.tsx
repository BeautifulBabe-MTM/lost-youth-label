'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'DEMO', // DEMO, EXCLUSIVE, CUSTOM_BEAT, OTHER
    message: '',
    link: '' // Ссылка на трек/профиль
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('ОТПРАВКА ЗАПРОСА...');

    try {
      // Здесь будет твой роут API (например, /api/contact), который шлет инфу в телегу или базу
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStatus('ЗАПРОС УСПЕШНО ОТПРАВЛЕН. СВЯЖЕМСЯ В БЛИЖАЙШЕЕ ВРЕМЯ.');
        setFormData({ name: '', email: '', type: 'DEMO', message: '', link: '' });
      } else {
        setStatus('ОШИБКА СЕРВЕРА. ПОПРОБУЙТЕ ПОЗЖЕ.');
      }
    } catch (err) {
      setStatus('СБОЙ СЕТИ. ПРОВЕРЬТЕ ПОДКЛЮЧЕНИЕ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-zinc-950 border border-zinc-900 p-8 shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Имя / Ник */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-[0.2em]">Имя / Название проекта</label>
          <input
            required
            type="text"
            placeholder="KILLAWEED"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-black border border-zinc-800 p-4 outline-none focus:border-white transition uppercase font-bold tracking-wider text-xs text-white"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-[0.2em]">Email для связи</label>
          <input
            required
            type="email"
            placeholder="PROD@LOSTYOUTH.RU"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="bg-black border border-zinc-800 p-4 outline-none focus:border-white transition font-mono text-xs text-white"
          />
        </div>
      </div>

      {/* Цель обращения */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-[0.2em]">Цель сотрудничества</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="bg-black border border-zinc-800 p-4 outline-none focus:border-white transition uppercase text-xs font-bold text-white"
        >
          <option value="DEMO">Отправить демо (В ростер / На оценку)</option>
          <option value="EXCLUSIVE">Покупка эксклюзивных прав</option>
          <option value="CUSTOM_BEAT">Заказ кастомного бита под ключ</option>
          <option value="OTHER">Дистрибуция / Другой вопрос</option>
        </select>
      </div>

      {/* Ссылка на материал */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-[0.2em]">Ссылка на SoundCloud / Сниппет / Диск</label>
        <input
          type="url"
          placeholder="HTTPS://SOUNDCLOUD.COM/..."
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          className="bg-black border border-zinc-800 p-4 outline-none focus:border-white transition font-mono text-xs text-white"
        />
      </div>

      {/* Сообщение */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-[0.2em]">Детали предложения</label>
        <textarea
          rows={4}
          placeholder="ОПИШИТЕ ВАШУ ИДЕЮ ИЛИ ТРЕБОВАНИЯ К БИТУ..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="bg-black border border-zinc-800 p-4 outline-none focus:border-white transition uppercase font-bold text-xs text-white resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-white text-black font-black p-5 uppercase tracking-[0.3em] text-xs hover:bg-zinc-200 transition active:scale-[0.98] mt-2 disabled:bg-zinc-800 disabled:text-zinc-500"
      >
        {loading ? 'ОТПРАВКА...' : 'ОТПРАВИТЬ ЗАЯВКУ'}
      </button>

      {status && (
        <p className="text-[9px] uppercase text-center text-zinc-400 mt-2 tracking-[0.2em] italic bg-zinc-900/50 py-3 border border-zinc-900 font-mono">
          {status}
        </p>
      )}
    </form>
  );
}