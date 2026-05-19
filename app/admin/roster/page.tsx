"use client";
import { useState, useRef } from "react";

export default function AdminRosterPage() {
  const [formData, setFormData] = useState({
    name: "",
    role: "Producer",
    bio: "",
    instagram: "",
    spotify: "",
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) return alert("Загрузи фото артиста!");

    try {
      setStatus("Загрузка изображения...");

      const uploadRes = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });
      
      if (!uploadRes.ok) throw new Error("Ошибка загрузки в облако");
      const blob = await uploadRes.json();
      
      setStatus("Сохранение в базу данных...");

      const dbRes = await fetch("/api/roster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: formData.name,
          role: formData.role,
          bio: formData.bio,
          imageUrl: blob.url,
          instagram: formData.instagram,
          spotify: formData.spotify,
        }),
      });

      if (dbRes.ok) {
        setStatus("Участник успешно добавлен в ростер!");
        alert("Готово!");
        window.location.reload();
      } else {
        const errorData = await dbRes.json();
        throw new Error(errorData.error || "Ошибка базы данных");
      }

    } catch (error: any) {
      console.error(error);
      setStatus("Ошибка: " + error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-10 bg-black border border-zinc-900 mt-10 text-white font-sans">
      <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-8 border-l-4 border-white pl-4">
        Добавить в Лейбл <span className="text-zinc-700">/ LOST YOUTH</span>
      </h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest italic">
            Фото артиста (рекомендуется 3:4)
          </label>
          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*" 
            className="bg-zinc-950 border border-zinc-900 p-4 text-xs file:bg-zinc-800 file:text-white file:border-none file:px-4 file:py-1 file:mr-4 file:cursor-pointer hover:file:bg-zinc-700" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest italic">Псевдоним</label>
            <input 
              required 
              placeholder="ИМЯ АРТИСТА" 
              className="bg-zinc-950 border border-zinc-900 p-4 outline-none focus:border-zinc-500 uppercase tracking-widest"
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest italic">Роль</label>
            <select 
              className="bg-zinc-950 border border-zinc-900 p-4 outline-none appearance-none cursor-pointer uppercase text-xs tracking-widest h-full"
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="Producer">Producer</option>
              <option value="Sound Engineer">Sound Engineer</option>
              <option value="Executive">Executive</option>
              <option value="Artist">Artist</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest italic">Биография</label>
          <textarea 
            placeholder="КРАТКОЕ ИНФО (ОПЦИОНАЛЬНО)" 
            rows={3} 
            className="bg-zinc-950 border border-zinc-900 p-4 outline-none focus:border-zinc-500 uppercase text-xs tracking-widest"
            onChange={(e) => setFormData({...formData, bio: e.target.value})} 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest italic">Instagram (ссылка)</label>
            <input 
              placeholder="URL" 
              className="bg-zinc-950 border border-zinc-900 p-4 outline-none text-xs"
              onChange={(e) => setFormData({...formData, instagram: e.target.value})} 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest italic">Spotify (ссылка)</label>
            <input 
              placeholder="URL" 
              className="bg-zinc-950 border border-zinc-900 p-4 outline-none text-xs"
              onChange={(e) => setFormData({...formData, spotify: e.target.value})} 
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="bg-white text-black font-black p-5 uppercase tracking-[0.3em] hover:bg-zinc-300 transition-all duration-300 mt-4 active:scale-95"
        >
          Подтвердить участника
        </button>

        {status && (
          <p className="text-[10px] uppercase text-center text-zinc-600 mt-4 tracking-widest animate-pulse">
            {status}
          </p>
        )}
      </form>
    </div>
  );
}