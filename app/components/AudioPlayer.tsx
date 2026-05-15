'use client';
import { useEffect, useRef } from 'react';
import { usePlayer } from '@/store/usePlayer';

export default function AudioPlayer() {
    const audioRef = useRef<HTMLAudioElement>(null);
    
    // Достаем всё нужное из стора
    const { 
        activeBeat, 
        isPlaying, 
        currentTime, 
        setDuration, 
        setProgress, 
        setPlaying 
    } = usePlayer();

    // 1. Обновляем прогресс в сторе при проигрывании
    const onTimeUpdate = () => {
        if (audioRef.current) {
            // Чтобы не спамить ререндерами слишком часто, можно округлять
            setProgress(audioRef.current.currentTime);
        }
    };

    const onLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    // 2. Смена трека
    useEffect(() => {
        if (activeBeat && audioRef.current) {
            // Если включили новый трек, а адрес тот же — не перезагружаем
            if (audioRef.current.src !== activeBeat.audioUrl) {
                audioRef.current.src = activeBeat.audioUrl;
                audioRef.current.load();
            }
            
            if (isPlaying) {
                audioRef.current.play().catch(err => console.log("Ждем взаимодействия пользователя..."));
            }
        }
    }, [activeBeat]);

    // 3. Синхронизация перемотки (Scrubbing)
    // Когда ты двигаешь ползунок в UI, currentTime в сторе меняется.
    // Мы перематываем аудио, только если разница больше секунды (чтобы не дергалось при обычном проигрывании)
    useEffect(() => {
        if (audioRef.current) {
            const diff = Math.abs(audioRef.current.currentTime - currentTime);
            if (diff > 1.5) { // Порог 1.5 сек, чтобы отличить перемотку от хода времени
                audioRef.current.currentTime = currentTime;
            }
        }
    }, [currentTime]);

    // 4. Пауза / Плей
    useEffect(() => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.play().catch(() => {});
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    return (
        <audio
            ref={audioRef}
            onEnded={() => setPlaying(false)}
            onTimeUpdate={onTimeUpdate}
            onLoadedMetadata={onLoadedMetadata}
            preload="auto"
            className="hidden"
        />
    );
}