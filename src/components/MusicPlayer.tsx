import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Music, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Song } from '../types';

const DUMMY_SONGS: Song[] = [
  {
    id: '1',
    title: 'Neon Nebula',
    artist: 'AI Synthwave',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/nebula/300/300',
    duration: 312,
  },
  {
    id: '2',
    title: 'Cyber Circuit',
    artist: 'Neural Beats',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/cyber/300/300',
    duration: 256,
  },
  {
    id: '3',
    title: 'Digital Horizon',
    artist: 'Gemini Grooves',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/horizon/300/300',
    duration: 284,
  },
];

export const MusicPlayer: React.FC = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentSong = DUMMY_SONGS[currentSongIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSongIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % DUMMY_SONGS.length);
    setProgress(0);
  };

  const prevSong = () => {
    setCurrentSongIndex((prev) => (prev - 1 + DUMMY_SONGS.length) % DUMMY_SONGS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl flex items-center px-8 gap-8 h-20 w-full backdrop-blur-md">
      <audio
        ref={audioRef}
        src={currentSong.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextSong}
      />
      
      <div className="flex items-center gap-4 w-64 shrink-0">
        <motion.div 
          key={currentSong.id}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-12 h-12 bg-neon-magenta rounded flex items-center justify-center overflow-hidden shrink-0 shadow-[0_0_15px_rgba(236,72,153,0.3)]"
        >
          <img 
            src={currentSong.cover} 
            alt={currentSong.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        <div className="overflow-hidden">
          <p className="text-sm font-bold truncate text-white uppercase tracking-tight">{currentSong.title}</p>
          <p className="text-[10px] text-white/40 uppercase font-mono truncate">Artist: {currentSong.artist}</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-2">
        <div className="flex justify-center items-center gap-6">
          <button 
            onClick={prevSong}
            className="text-white/40 hover:text-white transition-colors"
          >
            <SkipBack fill="currentColor" size={24} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-[0_0_10px_white]"
          >
            {isPlaying ? <Pause fill="black" size={20} /> : <Play fill="black" className="ml-1" size={20} />}
          </button>

          <button 
            onClick={nextSong}
            className="text-white/40 hover:text-white transition-colors"
          >
            <SkipForward fill="currentColor" size={24} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-white/40">{formatTime(audioRef.current?.currentTime || 0)}</span>
          <div className="flex-1 h-1 bg-white/10 rounded-full relative overflow-hidden">
            <motion.div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-pink-500 to-cyan-400 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-white/40">{formatTime(audioRef.current?.duration || 0)}</span>
        </div>
      </div>

      <div className="w-64 flex justify-end items-center gap-4 shrink-0">
        <Volume2 size={18} className="text-white/40" />
        <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-white/60 w-3/4" />
        </div>
      </div>
    </div>
  );
};
