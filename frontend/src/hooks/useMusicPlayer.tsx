import { createContext, useContext, useState, useRef, useCallback, useEffect, ReactNode } from 'react';
import gentleRain from '@/assets/audio/gentle-rain.mp3';
import oceanWaves from '@/assets/audio/ocean-waves.mp3';
import forestBirds from '@/assets/audio/forest-birds.mp3';
import peacefulPiano from '@/assets/audio/peaceful-piano.mp3';
import nightCrickets from '@/assets/audio/night-crickets.mp3';

export interface Track {
  title: string;
  description: string;
  url: string;
  emoji: string;
}

export const tracks: Track[] = [
  { title: 'Gentle Rain', description: 'Soft rainfall for deep relaxation', url: gentleRain, emoji: '🌧️' },
  { title: 'Ocean Waves', description: 'Peaceful ocean sounds to calm your mind', url: oceanWaves, emoji: '🌊' },
  { title: 'Forest Birds', description: 'Birdsong in a tranquil forest', url: forestBirds, emoji: '🐦' },
  { title: 'Peaceful Piano', description: 'Gentle piano melodies for focus and calm', url: peacefulPiano, emoji: '🎹' },
  { title: 'Night Crickets', description: 'Evening ambience with crickets chirping', url: nightCrickets, emoji: '🦗' },
];

interface MusicPlayerContextType {
  currentTrack: number | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  playTrack: (index: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | null>(null);

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const playTrack = useCallback((index: number) => {
    if (currentTrack === index && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(tracks[index].url);
    audio.volume = isMuted ? 0 : volume / 100;
    audio.loop = true;
    audio.preload = 'auto';

    audio.addEventListener('playing', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.addEventListener('error', () => setIsPlaying(false));

    audioRef.current = audio;
    setCurrentTrack(index);
    audio.play().catch(() => setIsPlaying(false));
  }, [currentTrack, isPlaying, isMuted, volume]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    audioRef.current?.play().catch(() => {});
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setCurrentTrack(null);
    setIsPlaying(false);
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    setIsMuted(v === 0);
    if (audioRef.current) {
      audioRef.current.volume = v / 100;
    }
  }, []);

  const toggleMute = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (audioRef.current) {
      audioRef.current.volume = newMuted ? 0 : volume / 100;
    }
  }, [isMuted, volume]);

  return (
    <MusicPlayerContext.Provider value={{
      currentTrack, isPlaying, volume, isMuted,
      playTrack, pause, resume, stop, setVolume, toggleMute,
    }}>
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const ctx = useContext(MusicPlayerContext);
  if (!ctx) throw new Error('useMusicPlayer must be used within MusicPlayerProvider');
  return ctx;
}
