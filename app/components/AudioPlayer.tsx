'use client';
import { useEffect, useRef } from 'react';
import { usePlayer } from '@/store/usePlayer';

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { activeBeat, isPlaying, setPlaying } = usePlayer();

  // Следим за изменением трека
  useEffect(() => {
    if (activeBeat && audioRef.current) {
      audioRef.current.src = activeBeat.audioUrl;
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error("Ошибка воспроизведения:", err));
      }
    }
  }, [activeBeat]);

  // Следим за паузой/плеем
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
      className="hidden" 
    />
  );
}