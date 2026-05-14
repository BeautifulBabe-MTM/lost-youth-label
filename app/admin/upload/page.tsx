"use client";
import { useState, useRef } from "react";

export default function UploadBeatPage() {
  const [formData, setFormData] = useState({
    title: "",
    genre: "Drill",
    bpm: "",
    price: "",
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileInputRef.current?.files?.[0]) return alert("Выбери файл!");

    setUploading(true);
    try {
      const file = fileInputRef.current.files[0];

      // 1. Грузим файл в Vercel Blob
      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });
      const newBlob = await response.json();

      // 2. Отправляем данные в нашу БД с полученным URL
      const res = await fetch("/api/beats", {
        method: "POST",
        body: JSON.stringify({ 
          ...formData, 
          audioUrl: newBlob.url, // Ссылка из облака
          authorId: "твой-id-из-бд" 
        }),
      });

      if (res.ok) alert("Бит успешно опубликован в LOST YOUTH!");
    } catch (error) {
      console.error(error);
      alert("Ошибка загрузки");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-10 bg-zinc-950 border border-zinc-900 mt-10">
      <h2 className="text-2xl font-black uppercase mb-6">Добавить новый бит</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-white">
        
        {/* Поле для выбора файла */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase text-zinc-500 font-bold">Аудиофайл (MP3/WAV)</label>
          <input 
            type="file" 
            ref={fileInputRef}
            accept="audio/*"
            className="bg-black border border-zinc-800 p-3 text-xs"
          />
        </div>

        <input 
          className="bg-black border border-zinc-800 p-3" 
          placeholder="Название" 
          onChange={(e) => setFormData({...formData, title: e.target.value})}
        />

        <div className="grid grid-cols-2 gap-4">
          <input 
            className="bg-black border border-zinc-800 p-3" 
            placeholder="BPM" 
            onChange={(e) => setFormData({...formData, bpm: e.target.value})}
          />
          <input 
            className="bg-black border border-zinc-800 p-3" 
            placeholder="Цена ($)" 
            onChange={(e) => setFormData({...formData, price: e.target.value})}
          />
        </div>

        <select 
          className="bg-black border border-zinc-800 p-3"
          onChange={(e) => setFormData({...formData, genre: e.target.value})}
        >
          <option value="Drill">Drill</option>
          <option value="Trap">Trap</option>
          <option value="Minimalist">Minimalist</option>
        </select>

        <button 
          disabled={uploading}
          className="bg-white text-black font-bold p-4 uppercase tracking-widest disabled:bg-zinc-700"
        >
          {uploading ? "Загрузка..." : "Опубликовать"}
        </button>
      </form>
    </div>
  );
}