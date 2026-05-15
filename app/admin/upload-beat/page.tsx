"use client";
import { useState, useRef, useEffect } from "react";

// Расширенный список жанров
const GENRES = [
    "Drill", "Trap", "Jersey Club", "Detroit", "Opium", 
    "Pluggnb", "Rage", "Glo", "Boom Bap", "Lo-Fi", "Melodic"
];

export default function UploadBeatPage() {
    const [artists, setArtists] = useState<{ id: string, name: string, role?: string }[]>([]);
    const [selectedArtist, setSelectedArtist] = useState("");
    const [isCustomGenre, setIsCustomGenre] = useState(false);
    
    const [formData, setFormData] = useState({
        title: "",
        genre: "Drill",
        bpm: "",
        price: "",
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [status, setStatus] = useState("");

    // Проверка, является ли выбранный артист частью лейбла (для плашки)
    const currentArtist = artists.find(a => a.id === selectedArtist);
    const isLabelArtist = currentArtist?.role === "LABEL" || true; // Для теста пока true

    useEffect(() => {
        fetch("/api/roster")
            .then(res => res.json())
            .then(data => { if (Array.isArray(data)) setArtists(data); });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const file = fileInputRef.current?.files?.[0];
        if (!file || !selectedArtist) return alert("Заполни все поля!");

        try {
            setStatus("ЗАГРУЗКА В ОБЛАКО...");
            const uploadRes = await fetch(`/api/upload?filename=${file.name}`, {
                method: 'POST', body: file,
            });
            const blob = await uploadRes.json();

            setStatus("СОХРАНЕНИЕ В БАЗУ...");
            const dbRes = await fetch("/api/beats", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    audioUrl: blob.url,
                    rosterMemberId: selectedArtist
                }),
            });

            if (dbRes.ok) {
                setStatus("БИТ ОПУБЛИКОВАН!");
                alert("Успешно!");
                window.location.reload();
            }
        } catch (error: any) {
            setStatus("ОШИБКА: " + error.message);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-10 bg-black border border-zinc-900 mt-10 font-sans text-white shadow-2xl">
            <div className="flex justify-between items-center mb-8 border-b border-zinc-900 pb-6">
                <h2 className="text-2xl font-black uppercase tracking-tighter italic">
                    UPLOAD / <span className="text-zinc-600">LOST YOUTH</span>
                </h2>
                {selectedArtist && isLabelArtist && (
                    <span className="bg-white text-black text-[9px] px-2 py-1 font-black uppercase tracking-tighter animate-pulse">
                        LABEL AUTH
                    </span>
                )}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Выбор артиста */}
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-[0.2em]">Producer / Artist</label>
                    <select
                        required
                        className="bg-zinc-950 border border-zinc-800 p-4 outline-none focus:border-white transition uppercase text-xs font-bold"
                        onChange={(e) => setSelectedArtist(e.target.value)}
                        value={selectedArtist}
                    >
                        <option value="">Выберите автора</option>
                        {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                </div>

                {/* Файл */}
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-[0.2em]">Audio (High Quality)</label>
                    <input type="file" ref={fileInputRef} accept="audio/*" className="bg-zinc-950 border border-zinc-800 p-4 text-[10px] cursor-pointer file:bg-transparent file:border-0 file:text-white file:font-bold" />
                </div>

                {/* Название */}
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-[0.2em]">Beat Title</label>
                    <input required placeholder="ИМЯ БИТА" className="bg-zinc-950 border border-zinc-800 p-4 outline-none focus:border-white transition uppercase font-bold tracking-widest text-sm"
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                </div>

                {/* Жанры */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                        <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-[0.2em]">Genre / Style</label>
                        <button 
                            type="button" 
                            onClick={() => setIsCustomGenre(!isCustomGenre)}
                            className="text-[9px] uppercase underline text-zinc-600 hover:text-white"
                        >
                            {isCustomGenre ? "Выбрать из списка" : "Свой вариант"}
                        </button>
                    </div>
                    
                    {isCustomGenre ? (
                        <input 
                            placeholder="ВВЕДИТЕ ЖАНР" 
                            className="bg-zinc-950 border border-zinc-800 p-4 outline-none focus:border-white transition uppercase text-xs font-bold"
                            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                        />
                    ) : (
                        <select 
                            className="bg-zinc-950 border border-zinc-800 p-4 outline-none appearance-none focus:border-white transition uppercase text-xs font-bold"
                            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                        >
                            {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    )}
                </div>

                {/* BPM и Цена */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-[0.2em]">BPM</label>
                        <input required placeholder="140" type="number" className="bg-zinc-950 border border-zinc-800 p-4 outline-none focus:border-white transition font-mono"
                            onChange={(e) => setFormData({ ...formData, bpm: e.target.value })} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-[0.2em]">Price ($)</label>
                        <input required placeholder="29.99" type="number" className="bg-zinc-950 border border-zinc-800 p-4 outline-none focus:border-white transition font-mono"
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                    </div>
                </div>

                <button type="submit" className="bg-white text-black font-black p-6 uppercase tracking-[0.3em] text-xs hover:bg-zinc-200 transition active:scale-[0.98] mt-4 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    Опубликовать бит
                </button>

                {status && <p className="text-[9px] uppercase text-center text-zinc-600 mt-2 tracking-[0.3em] italic">{status}</p>}
            </form>
        </div>
    );
}