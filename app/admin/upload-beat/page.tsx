"use client";
import { useState, useRef, useEffect } from "react";

const GENRES_MAP = {
  "Modern Hip-Hop & Trap": [
    "Trap", "Dark Trap", "Guitar Trap", "Melodic Trap",
    "Rage", "Opium", "Supertrap", "Glo", "Cyber trap",
    "Pluggnb", "Plugg", "Boombap", "Lo-Fi Hip Hop",
    "West Coast", "Bay Area", "G-Funk"
  ],
  "Drill & Regional Sound": [
    "UK Drill", "NY Drill", "Sample Drill", "Dark Drill",
    "Detroit", "Flint", "Milwaukee",
    "Jersey Club", "Philly Club", "Baltimore Club"
  ],
  "Alternative & Underground": [
    "Hyperpop", "Glitchcore", "Digicore",
    "Cloud Rap", "Emo Rap", "Goth Doomer",
    "Memphis Rap", "Phonk", "Drift Phonk", "Wave Phonk",
    "Industrial", "Experimental"
  ],
  "Electronic & UK Underground": [
    "UK Garage", "2-Step", "Speed Garage", "Bassline",
    "Grime", "Dubstep", "Tearout", "Deep Dub",
    "Jungle", "Drum & Bass", "Breakbeat",
    "Witch House", "Synthwave", "Cyberpunk"
  ]
};

export default function UploadBeatPage() {
    const [artists, setArtists] = useState<{ id: string, name: string, role?: string }[]>([]);
    const [selectedArtist, setSelectedArtist] = useState("");
    const [isCustomGenre, setIsCustomGenre] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        genre: "Trap",
        bpm: "",
        price: "",           // Базовый прайс (MP3)
        priceWav: "",        // Опциональный прайс за WAV
        priceExclusive: "",  // Опциональный прайс за эксклюзив
    });

    const previewInputRef = useRef<HTMLInputElement>(null);
    const mp3InputRef = useRef<HTMLInputElement>(null);
    const wavInputRef = useRef<HTMLInputElement>(null);
    const stemsInputRef = useRef<HTMLInputElement>(null);

    const [status, setStatus] = useState("");

    const currentArtist = artists.find(a => a.id === selectedArtist);
    const isLabelArtist = currentArtist?.role === "LABEL";

    useEffect(() => {
        fetch("/api/roster")
            .then(res => res.json())
            .then(data => { if (Array.isArray(data)) setArtists(data); });
    }, []);

    const uploadFile = async (file: File | undefined, label: string) => {
        if (!file) return null;
        setStatus(`ЗАГРУЗКА ${label}...`);
        const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
            method: 'POST',
            body: file,
        });
        if (!res.ok) throw new Error(`Не удалось загрузить ${label}`);
        const blob = await res.json();
        return blob.url as string;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const previewFile = previewInputRef.current?.files?.[0];
        const mp3File = mp3InputRef.current?.files?.[0];
        const wavFile = wavInputRef.current?.files?.[0];
        const stemsFile = stemsInputRef.current?.files?.[0];

        // 1. ЖЕСТКАЯ ВАЛИДАЦИЯ АВТОРА И ПРЕВЬЮ
        if (!previewFile || !selectedArtist) {
            return alert("Заполни имя автора и загрузи превью бита!");
        }

        // 2. АВТО-РАСЧЕТ ЦЕН КАК В CHECKOUT API (ЕСЛИ ОСТАВИЛИ ПУСТЫМИ)
        const basePrice = parseFloat(formData.price);
        const finalPriceWav = formData.priceWav ? parseFloat(formData.priceWav) : basePrice * 2;
        const finalPriceExclusive = formData.priceExclusive ? parseFloat(formData.priceExclusive) : basePrice * 6;

        // 3. УМНАЯ ВАЛИДАЦИЯ НАЛИЧИЯ ФАЙЛОВ ПОД ТАРИФЫ
        // Если загружен чистый MP3, он должен быть. Но даже без него при MP3 Lease можно отдавать превью.
        // А вот для WAV и STEMS файлы обязаны быть, раз тарифы активны!
        if (finalPriceWav > 0 && !wavFile) {
            return alert(`Ошибка: У тебя активен тариф WAV ($${finalPriceWav}). Загрузи оригинал .WAV файла!`);
        }
        if (finalPriceExclusive > 0 && !stemsFile) {
            return alert(`Ошибка: У тебя активен тариф EXCLUSIVE ($${finalPriceExclusive}). Загрузи ZIP-архив со стемсами!`);
        }

        try {
            // Запускаем последовательную загрузку файлов в Vercel Blob
            const audioUrl = await uploadFile(previewFile, "ПРЕВЬЮ ДЛЯ ПЛЕЕРА");
            const mp3FileUrl = await uploadFile(mp3File, "ЧИСТОГО MP3");
            const wavFileUrl = await uploadFile(wavFile, "ЧИСТОГО WAV");
            const stemsFileUrl = await uploadFile(stemsFile, "ZIP-АРХИВА СО СТЕМСАМИ");

            setStatus("СОХРАНЕНИЕ В БАЗУ ДАННЫХ...");
            
            const dbRes = await fetch("/api/beats", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: formData.title,
                    genre: formData.genre,
                    bpm: parseInt(formData.bpm, 10),
                    price: basePrice,
                    priceWav: finalPriceWav,
                    priceExclusive: finalPriceExclusive,
                    audioUrl,
                    mp3FileUrl,
                    wavFileUrl,
                    stemsFileUrl,
                    rosterMemberId: selectedArtist,
                    isSold: false // По умолчанию бит, конечно же, не продан
                }),
            });

            if (dbRes.ok) {
                setStatus("БИТ И СТРУКТУРА ЦЕН ОПУБЛИКОВАНЫ!");
                alert("Бит успешно выкачен в продакшн!");
                window.location.reload();
            } else {
                const errData = await dbRes.json();
                throw new Error(errData.message || "Ошибка сохранения");
            }
        } catch (error: any) {
            setStatus("ОШИБКА: " + error.message);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-10 bg-black border border-zinc-900 mt-10 font-sans text-white shadow-2xl">
            <div className="flex justify-between items-center mb-8 border-b border-zinc-900 pb-6">
                <div className="flex flex-col">
                  <p className="text-[10px] font-mono tracking-widest text-zinc-500">// ADMIN CONSOLE</p>
                  <h2 className="text-2xl font-black uppercase tracking-tighter italic text-white">
                      НОВЫЙ ТРЕК <span className="text-zinc-600">/ КОНФИГУРАТОР</span>
                  </h2>
                </div>
                {selectedArtist && isLabelArtist && (
                    <span className="bg-white text-black text-[9px] px-2 py-1 font-black uppercase tracking-tighter animate-pulse">
                        LABEL AUTH
                    </span>
                )}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                {/* АВТОР */}
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-[0.2em]">// ИСПОЛНИТЕЛЬ</label>
                    <select
                        required
                        className="bg-zinc-950 border border-zinc-800 p-4 outline-none focus:border-white transition uppercase text-xs font-bold text-white cursor-pointer"
                        onChange={(e) => setSelectedArtist(e.target.value)}
                        value={selectedArtist}
                    >
                        <option value="" className="text-zinc-600">Выберите автора</option>
                        {artists.map(a => <option key={a.id} value={a.id} className="text-white">{a.name}</option>)}
                    </select>
                </div>

                {/* ЖАНР */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                        <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-[0.2em]">// ЖАНР / СТИЛЬ</label>
                        <button
                            type="button"
                            onClick={() => {
                                setIsCustomGenre(!isCustomGenre);
                                setFormData({ ...formData, genre: "" });
                            }}
                            className="text-[9px] uppercase underline text-zinc-600 hover:text-white"
                        >
                            {isCustomGenre ? "Выбрать из списка" : "Свой вариант"}
                        </button>
                    </div>

                    {isCustomGenre ? (
                        <input
                            placeholder="ВВЕДИТЕ ЖАНР"
                            className="bg-zinc-950 border border-zinc-800 p-4 outline-none focus:border-white transition uppercase text-xs font-bold text-white"
                            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                        />
                    ) : (
                        <select
                            className="w-full bg-zinc-950 border border-zinc-800 p-4 outline-none focus:border-white transition uppercase text-xs font-bold text-white cursor-pointer"
                            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                            value={formData.genre}
                        >
                            {Object.entries(GENRES_MAP).map(([category, list]) => (
                                <optgroup key={category} label={category.toUpperCase()} className="bg-zinc-950 text-zinc-500 text-[10px] font-black tracking-widest pt-2">
                                    {list.map(g => (
                                        <option key={g} value={g} className="text-white text-xs font-bold bg-zinc-950">
                                            {g}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    )}
                </div>

                {/* ИМЯ, BPM */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2 col-span-2">
                        <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-[0.2em]">// НАЗВАНИЕ БИТА</label>
                        <input required placeholder="TITLE" className="bg-zinc-950 border border-zinc-800 p-4 outline-none focus:border-white transition uppercase font-bold tracking-widest text-xs text-white"
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-[0.2em]">// BPM</label>
                        <input required placeholder="140" type="number" className="bg-zinc-950 border border-zinc-800 p-4 outline-none focus:border-white transition font-mono text-xs text-white"
                            onChange={(e) => setFormData({ ...formData, bpm: e.target.value })} />
                    </div>
                </div>

                {/* БЛОК ЦЕН */}
                <div className="border border-zinc-900 p-5 bg-zinc-950/40 space-y-4">
                  <label className="text-[10px] uppercase text-zinc-400 font-mono tracking-[0.2em] block">// ТАРИФНАЯ СЕТКА (ПУСТЫЕ ПОЛЯ РАССЧИТАЮТСЯ АВТОМАТИЧЕСКИ)</label>
                  
                  <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col gap-2">
                          <label className="text-[9px] uppercase text-zinc-500 font-bold">MP3 / БАЗА ($) *</label>
                          <input required placeholder="29" type="number" step="0.01" className="bg-black border border-zinc-800 p-3 outline-none focus:border-white transition font-mono text-xs text-white"
                              onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                      </div>
                      <div className="flex flex-col gap-2">
                          <label className="text-[9px] uppercase text-zinc-500 font-bold">WAV PRICE ($)</label>
                          <input placeholder="x2 от базы" type="number" step="0.01" className="bg-black border border-zinc-800 p-3 outline-none focus:border-white transition font-mono text-xs text-white"
                              onChange={(e) => setFormData({ ...formData, priceWav: e.target.value })} />
                      </div>
                      <div className="flex flex-col gap-2">
                          <label className="text-[9px] uppercase text-zinc-500 font-bold">EXCLUSIVE ($)</label>
                          <input placeholder="x6 от базы" type="number" step="0.01" className="bg-black border border-zinc-800 p-3 outline-none focus:border-white transition font-mono text-xs text-white"
                              onChange={(e) => setFormData({ ...formData, priceExclusive: e.target.value })} />
                      </div>
                  </div>
                </div>

                {/* СЕКЦИЯ ЗАГРУЗКИ ФАЙЛОВ */}
                <div className="border border-zinc-900 p-5 bg-zinc-950/40 space-y-4">
                    <label className="text-[10px] uppercase text-zinc-400 font-mono tracking-[0.2em] block">// СКЛАД ЦИФРОВЫХ ТОВАРОВ</label>
                    
                    <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase text-zinc-500 font-black">1. Аудио-превью (Защищенный файл для сайта) *</label>
                        <input type="file" required ref={previewInputRef} accept="audio/*" className="bg-black border border-zinc-900 p-3 text-[10px] text-zinc-400 file:bg-transparent file:border-0 file:text-white file:font-mono file:text-[10px]" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase text-zinc-500 font-bold">2. Оригинал .MP3 (высылается при MP3 Lease)</label>
                        <input type="file" ref={mp3InputRef} accept="audio/mp3, audio/mpeg" className="bg-black border border-zinc-900 p-3 text-[10px] text-zinc-400 file:bg-transparent file:border-0 file:text-white file:font-mono file:text-[10px]" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase text-zinc-500 font-bold">3. Оригинал .WAV (ОБЯЗАТЕЛЕН, если активен тариф WAV)</label>
                        <input type="file" ref={wavInputRef} accept="audio/wav, audio/x-wav" className="bg-black border border-zinc-900 p-3 text-[10px] text-zinc-400 file:bg-transparent file:border-0 file:text-white file:font-mono file:text-[10px]" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase text-zinc-500 font-bold">4. Дорожки / STEMS (ZIP-архив; ОБЯЗАТЕЛЕН для Exclusive)</label>
                        <input type="file" ref={stemsInputRef} accept=".zip,.rar,.7z" className="bg-black border border-zinc-900 p-3 text-[10px] text-zinc-400 file:bg-transparent file:border-0 file:text-white file:font-mono file:text-[10px]" />
                    </div>
                </div>

                <button type="submit" className="bg-white text-black font-black p-6 uppercase tracking-[0.3em] text-xs hover:bg-zinc-200 transition active:scale-[0.98] mt-2 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                    Выкатить релиз в каталог
                </button>

                {status && <p className="text-[9px] uppercase text-center text-emerald-400 mt-2 tracking-[0.2em] font-mono bg-zinc-900/60 py-2 border border-zinc-900 animate-pulse">{status}</p>}
            </form>
        </div>
    );
}