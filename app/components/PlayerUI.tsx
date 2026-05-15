'use client';
import { usePlayer } from '@/store/usePlayer';
import Image from 'next/image';
import { Play, Pause, SkipForward, SkipBack, Volume2, X } from 'lucide-react'; // Добавили X

export default function PlayerUI() {
    // Достаем setBeat (или создай в сторе функцию stop/reset)
    const { activeBeat, isPlaying, toggle, currentTime, duration, setProgress, setBeat } = usePlayer();

    if (!activeBeat) return null;

    const isRelease = !!activeBeat.coverUrl;
    const artistName = isRelease ? activeBeat.author?.name : activeBeat.rosterMember?.name || "Unknown Producer";

    const formatTime = (time: number) => {
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Функция для закрытия плеера
    const handleClose = () => {
        setBeat(null); // Просто обнуляем активный трек, и плеер исчезнет сам
    };

    return (
        <div className="fixed bottom-0 left-0 w-full bg-black/95 backdrop-blur-xl border-t border-zinc-900 z-[100] px-4 py-3 group">
            {/* Кнопка закрытия */}
            <button
                onClick={handleClose}
                className="absolute -top-10 right-4 bg-black border border-zinc-900 p-2 text-zinc-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                title="Закрыть плеер"
            >
                <X size={16} />
            </button>

            <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">

                {/* ЛЕВАЯ ЧАСТЬ: ИНФО */}
                <div className="flex items-center gap-4 w-[30%]">
                    {isRelease && activeBeat.coverUrl && (
                        <div className="relative w-12 h-12 flex-shrink-0 border border-zinc-800">
                            <Image src={activeBeat.coverUrl} alt={activeBeat.title} fill className="object-cover" />
                        </div>
                    )}
                    <div className="flex flex-col min-w-0">
                        {/* Первая строка: Название + (FT. Артист) + Лейбл */}
                        <div className="flex items-center gap-2">
                            <h4 className="text-white text-xs font-black uppercase truncate tracking-tighter">
                                {activeBeat.title}
                                {/* Выводим фит сразу после названия тем же стилем, но другим цветом */}
                                {activeBeat.feat && (
                                    <span className="text-zinc-500 ml-1">
                                        (FT. {activeBeat.feat})
                                    </span>
                                )}
                            </h4>

                            {/* Плашка LABEL только для релизов */}
                            {isRelease && (
                                <span className="bg-white text-black text-[7px] px-1 font-black py-0.5 uppercase leading-none flex-shrink-0">
                                    Label
                                </span>
                            )}
                        </div>

                        {/* Вторая строка: Имя основного артиста или битмейкера */}
                        <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest truncate">
                            {artistName}
                        </p>
                    </div>
                </div>

                {/* ЦЕНТРАЛЬНАЯ ЧАСТЬ: КОНТРОЛЛЕРЫ */}
                <div className="flex flex-col items-center gap-2 flex-1 max-w-xl">
                    <div className="flex items-center gap-6">
                        <SkipBack size={18} className="text-zinc-600 hover:text-white cursor-pointer transition" />
                        <button
                            onClick={toggle}
                            className="w-10 h-10 bg-white rounded-none flex items-center justify-center hover:scale-105 transition"
                        >
                            {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" className="ml-1" />}
                        </button>
                        <SkipForward size={18} className="text-zinc-600 hover:text-white cursor-pointer transition" />
                    </div>

                    <div className="w-full flex items-center gap-3">
                        <span className="text-[9px] text-zinc-600 font-mono w-8 text-right">{formatTime(currentTime)}</span>
                        <input
                            type="range"
                            min={0}
                            max={duration || 0}
                            value={currentTime}
                            onChange={(e) => setProgress(Number(e.target.value))}
                            className="flex-1 accent-white h-1 bg-zinc-800 rounded-none cursor-pointer"
                        />
                        <span className="text-[9px] text-zinc-600 font-mono w-8">{formatTime(duration)}</span>
                    </div>
                </div>

                {/* ПРАВАЯ ЧАСТЬ */}
                <div className="flex justify-end items-center gap-8 w-[30%]">
                    {!isRelease ? (
                        <>
                            <div className="hidden md:block text-right">
                                <p className="text-[8px] text-zinc-600 uppercase font-bold tracking-tighter">Tempo</p>
                                <p className="text-xs text-white font-black">{activeBeat.bpm} BPM</p>
                            </div>
                            <div className="bg-zinc-900 border border-zinc-800 px-4 py-2">
                                <p className="text-[10px] text-white font-black uppercase tracking-widest">
                                    ${activeBeat.price}
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-[0.2em] italic">Lost Youth / Records</span>
                            {activeBeat.spotifyUrl && (
                                <a href={activeBeat.spotifyUrl} target="_blank" className="text-zinc-400 hover:text-white">
                                    <Volume2 size={16} />
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}