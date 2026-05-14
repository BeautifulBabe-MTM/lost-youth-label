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
  const [status, setStatus] = useState(""); // Для вывода статуса

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) return alert("Выбери аудиофайл!");

    try {
      setStatus("Загрузка файла в облако...");

      // 1. Грузим файл в Vercel Blob
      const uploadRes = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });
      
      if (!uploadRes.ok) throw new Error("Ошибка загрузки в облако");
      const blob = await uploadRes.json();
      
      setStatus("Файл загружен. Сохраняю в базу данных...");

      // 2. Отправляем всё в нашу Монго
      const dbRes = await fetch("/api/beats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...formData, 
          audioUrl: blob.url, // Ссылка, которую дал Vercel
          authorId: "6a063d90fd791cb45c271cb9"
        }),
      });

      if (dbRes.ok) {
        setStatus("Бит успешно добавлен!");
        alert("Готово!");
      } else {
        const err = await dbRes.json();
        throw new Error(err.error || "Ошибка БД");
      }

    } catch (error: any) {
      console.error(error);
      setStatus("Ошибка: " + error.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-10 bg-zinc-950 border border-zinc-900 mt-10 font-sans text-white">
      <h2 className="text-2xl font-black uppercase mb-6 tracking-tighter">New Release / Lost Youth</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Audio File</label>
          <input type="file" ref={fileInputRef} accept="audio/*" className="bg-black border border-zinc-800 p-3 text-xs cursor-pointer" />
        </div>

        <input required placeholder="Название бита" className="bg-black border border-zinc-800 p-4 outline-none focus:border-white transition"
          onChange={(e) => setFormData({...formData, title: e.target.value})} />

        <div className="grid grid-cols-2 gap-4">
          <input required placeholder="BPM" type="number" className="bg-black border border-zinc-800 p-4 outline-none focus:border-white transition"
            onChange={(e) => setFormData({...formData, bpm: e.target.value})} />
          <input required placeholder="Price ($)" type="number" className="bg-black border border-zinc-800 p-4 outline-none focus:border-white transition"
            onChange={(e) => setFormData({...formData, price: e.target.value})} />
        </div>

        <select className="bg-black border border-zinc-800 p-4 outline-none appearance-none"
          onChange={(e) => setFormData({...formData, genre: e.target.value})}>
          <option value="Drill">Drill</option>
          <option value="Trap">Trap</option>
          <option value="Minimalist">Minimalist</option>
        </select>

        <button type="submit" className="bg-white text-black font-black p-5 uppercase tracking-widest hover:bg-zinc-200 transition">
          Опубликовать
        </button>

        {status && <p className="text-[10px] uppercase text-center text-zinc-500 mt-4 tracking-widest animate-pulse">{status}</p>}
      </form>
    </div>
  );
}