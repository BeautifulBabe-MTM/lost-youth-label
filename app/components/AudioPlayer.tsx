'use client';
import { useEffect, useRef } from 'react';
import { usePlayer } from '@/store/usePlayer';

export default function AudioPlayer() {
    const audioRef = useRef<HTMLAudioElement>(null);

    const {
        activeBeat,
        isPlaying,
        currentTime,
        setDuration,
        setProgress,
        setPlaying
    } = usePlayer();

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

    useEffect(() => {
        if (!activeBeat && audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = ""; // Убираем источник звука
            audioRef.current.load();   // Сбрасываем состояние тега
            setPlaying(false);         // Ставим на паузу в сторе
            setProgress(0);            // Сбрасываем время в сторе
        }
    }, [activeBeat]);

    // 2. Смена трека
    useEffect(() => {
        if (activeBeat && audioRef.current) {
            if (audioRef.current.src !== activeBeat.audioUrl) {
                audioRef.current.src = activeBeat.audioUrl;
                audioRef.current.load();
            }

            if (isPlaying) {
                audioRef.current.play().catch(err => console.log("Ждем взаимодействия пользователя..."));
            }
        }
    }, [activeBeat]);

    useEffect(() => {
        if (audioRef.current) {
            const diff = Math.abs(audioRef.current.currentTime - currentTime);
            if (diff > 1.5) { // Порог 1.5 сек, чтобы отличить перемотку от хода времени
                audioRef.current.currentTime = currentTime;
            }
        }
    }, [currentTime]);

    useEffect(() => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.play().catch(() => { });
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