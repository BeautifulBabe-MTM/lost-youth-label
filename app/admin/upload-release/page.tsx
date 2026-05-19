"use client";
import { useState, useRef, useEffect } from "react";

export default function UploadReleasePage() {
    const [artists, setArtists] = useState<{ id: string, name: string }[]>([]);
    const [selectedArtist, setSelectedArtist] = useState("");
    const [title, setTitle] = useState("");
    const [feat, setFeat] = useState("");
    const [links, setLinks] = useState({ spotify: "", apple: "" });
    const [status, setStatus] = useState("");
    const [recentCovers, setRecentCovers] = useState<string[]>([]);
    const [selectedCover, setSelectedCover] = useState("");

    const audioInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetch("/api/roster")
            .then(res => res.json())
            .then(data => { if (Array.isArray(data)) setArtists(data); });

        fetch("/api/covers")
            .then(res => res.json())
            .then(setRecentCovers);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const audioFile = audioInputRef.current?.files?.[0];
        const newCoverFile = coverInputRef.current?.files?.[0];

        if (!audioFile || (!newCoverFile && !selectedCover) || !selectedArtist) {
            return alert("Заполни всё: аудио, артиста и обложку!");
        }

        try {
            let finalCoverUrl = selectedCover;

            setStatus("Загрузка трека...");
            const audioRes = await fetch(`/api/upload?filename=track_${audioFile.name}`, {
                method: 'POST', body: audioFile,
            });
            const audioBlob = await audioRes.json();

            if (!finalCoverUrl && newCoverFile) {
                setStatus("Загрузка новой обложки...");
                const coverRes = await fetch(`/api/upload?filename=cover_${newCoverFile.name}`, {
                    method: 'POST', body: newCoverFile,
                });
                const coverBlob = await coverRes.json();
                finalCoverUrl = coverBlob.url;
            }

            setStatus("Сохранение...");
            const dbRes = await fetch("/api/releases", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    feat,
                    audioUrl: audioBlob.url,
                    coverUrl: finalCoverUrl,
                    rosterMemberId: selectedArtist,
                    spotifyUrl: links.spotify,
                    appleMusicUrl: links.apple
                }),
            });

            if (dbRes.ok) {
                setStatus("Опубликовано!");
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
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest italic">Исполнитель</label>
                    <select required className="bg-zinc-950 border border-zinc-800 p-4 outline-none appearance-none focus:border-white transition uppercase text-xs"
                        onChange={(e) => setSelectedArtist(e.target.value)}>
                        <option value="">Выберите из лейбла</option>
                        {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest italic">Название</label>
                        <input required placeholder="TITLE" className="bg-zinc-950 border border-zinc-800 p-4 outline-none focus:border-white transition uppercase tracking-widest"
                            onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest italic">Фит</label>
                        <input placeholder="FEAT." className="bg-zinc-950 border border-zinc-800 p-4 outline-none focus:border-white transition uppercase tracking-widest text-zinc-400"
                            onChange={(e) => setFeat(e.target.value)} />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest italic">Аудио (MP3/WAV)</label>
                    <input type="file" ref={audioInputRef} accept="audio/*" className="bg-zinc-950 border border-zinc-800 p-3 text-[10px] cursor-pointer" />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest italic">Обложка</label>

                    {recentCovers.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {recentCovers.map(url => (
                                <img key={url} src={url} alt="old cover"
                                    onClick={() => setSelectedCover(url)}
                                    className={`w-14 h-14 object-cover cursor-pointer border-2 transition ${selectedCover === url ? 'border-white opacity-100 scale-105' : 'border-transparent opacity-40 hover:opacity-70'}`}
                                />
                            ))}
                            <button type="button" onClick={() => setSelectedCover("")}
                                className={`w-14 h-14 border-2 border-dashed flex items-center justify-center text-[8px] uppercase leading-none transition ${!selectedCover ? 'border-white text-white' : 'border-zinc-800 text-zinc-600'}`}>
                                Новая
                            </button>
                        </div>
                    )}

                    {!selectedCover ? (
                        <input type="file" ref={coverInputRef} accept="image/*" className="bg-zinc-950 border border-zinc-800 p-3 text-[10px] animate-in fade-in duration-300" />
                    ) : (
                        <div className="bg-zinc-900/50 border border-zinc-800 p-3 text-[9px] text-green-500 uppercase font-black tracking-[0.2em]">
                            Используется выбранная обложка
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <input placeholder="SPOTIFY" className="bg-zinc-950 border border-zinc-800 p-4 outline-none text-[10px] uppercase"
                        onChange={(e) => setLinks({ ...links, spotify: e.target.value })} />
                    <input placeholder="APPLE MUSIC" className="bg-zinc-950 border border-zinc-800 p-4 outline-none text-[10px] uppercase"
                        onChange={(e) => setLinks({ ...links, apple: e.target.value })} />
                </div>

                <button type="submit" className="bg-white text-black font-black p-5 uppercase tracking-[0.3em] hover:bg-zinc-200 transition active:scale-95 mt-4">
                    Опубликовать
                </button>

                {status && <p className="text-[10px] uppercase text-center text-zinc-500 mt-4 tracking-widest animate-pulse">{status}</p>}
            </form>
        </div>
    );
}