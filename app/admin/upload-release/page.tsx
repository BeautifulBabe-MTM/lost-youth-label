"use client";
import { useState, useRef, useEffect } from "react";

export default function UploadReleasePage() {
    const [artists, setArtists] = useState<{id: string, name: string}[]>([]);
    const [selectedArtist, setSelectedArtist] = useState("");
    const [title, setTitle] = useState("");
    const [links, setLinks] = useState({ spotify: "", apple: "" });
    
    const audioInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const [status, setStatus] = useState("");

    useEffect(() => {
        fetch("/api/roster")
            .then(res => res.json())
            .then(data => { if (Array.isArray(data)) setArtists(data); });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const audioFile = audioInputRef.current?.files?.[0];
        const coverFile = coverInputRef.current?.files?.[0];
        
        if (!audioFile || !coverFile || !selectedArtist) {
            return alert("Заполни все поля и выбери файлы (аудио + обложка)!");
        }

        try {
            // 1. Грузим аудио
            setStatus("Загрузка трека...");
            const audioRes = await fetch(`/api/upload?filename=track_${audioFile.name}`, {
                method: 'POST', body: audioFile,
            });
            const audioBlob = await audioRes.json();

            // 2. Грузим обложку
            setStatus("Загрузка обложки...");
            const coverRes = await fetch(`/api/upload?filename=cover_${coverFile.name}`, {
                method: 'POST', body: coverFile,
            });
            const coverBlob = await coverRes.json();

            setStatus("Сохранение релиза...");

            // 3. Сохраняем в таблицу Release
            const dbRes = await fetch("/api/releases", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    audioUrl: audioBlob.url,
                    coverUrl: coverBlob.url,
                    rosterMemberId: selectedArtist,
                    spotifyUrl: links.spotify,
                    appleMusicUrl: links.apple
                }),
            });

            if (dbRes.ok) {
                setStatus("Релиз опубликован!");
                alert("Трек успешно добавлен в релизы!");
                window.location.reload();
            } else {
                throw new Error("Ошибка БД");
            }

        } catch (error: any) {
            setStatus("Ошибка: " + error.message);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-10 bg-black border border-zinc-900 mt-10 font-sans text-white">
            <h2 className="text-2xl font-black uppercase mb-8 tracking-tighter italic border-l-4 border-white pl-4">
                Новый трек / <span className="text-zinc-600">Lost Youth</span>
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Выбор артиста */}
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest italic">Исполнитель</label>
                    <select 
                        required
                        className="bg-zinc-950 border border-zinc-800 p-4 outline-none appearance-none focus:border-white transition uppercase text-xs"
                        onChange={(e) => setSelectedArtist(e.target.value)}
                    >
                        <option value="">Выберите из лейбла</option>
                        {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest italic">Название трека</label>
                    <input required placeholder="TITLE" className="bg-zinc-950 border border-zinc-800 p-4 outline-none focus:border-white transition uppercase tracking-widest"
                        onChange={(e) => setTitle(e.target.value)} />
                </div>

                {/* Файлы */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest italic">Аудио (MP3/WAV)</label>
                        <input type="file" ref={audioInputRef} accept="audio/*" className="bg-zinc-950 border border-zinc-800 p-3 text-[10px] cursor-pointer" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest italic">Обложка (JPG)</label>
                        <input type="file" ref={coverInputRef} accept="image/*" className="bg-zinc-950 border border-zinc-800 p-3 text-[10px] cursor-pointer" />
                    </div>
                </div>

                {/* Ссылки на стриминги */}
                <div className="grid grid-cols-1 gap-4">
                    <input placeholder="SPOTIFY URL (ОПЦИОНАЛЬНО)" className="bg-zinc-950 border border-zinc-800 p-4 outline-none text-xs"
                        onChange={(e) => setLinks({ ...links, spotify: e.target.value })} />
                    <input placeholder="APPLE MUSIC URL (ОПЦИОНАЛЬНО)" className="bg-zinc-950 border border-zinc-800 p-4 outline-none text-xs"
                        onChange={(e) => setLinks({ ...links, apple: e.target.value })} />
                </div>

                <button type="submit" className="bg-white text-black font-black p-5 uppercase tracking-[0.3em] hover:bg-zinc-200 transition active:scale-95 mt-4">
                    Опубликовать релиз
                </button>

                {status && <p className="text-[10px] uppercase text-center text-zinc-500 mt-4 tracking-widest animate-pulse">{status}</p>}
            </form>
        </div>
    );
}