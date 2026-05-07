import { AnimatePresence, motion } from 'motion/react';
import { FastForward, Pause, Play, Rewind, Volume2 } from 'lucide-react';
import React from 'react';
import { Track } from '../utils/types';

interface MusicPlayerProps {
  currentTrack: Track;
  isPlaying: boolean;
  progress: number;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  currentTrack, 
  isPlaying, 
  progress, 
  onTogglePlay, 
  onNext, 
  onPrev,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex gap-3 items-center">
        <div className="relative h-14 w-14 border-2 border-[var(--primary)] border-double bg-black shrink-0 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-40 animate-pulse"
            style={{ 
              background: `linear-gradient(45deg, var(--primary), var(--secondary))`,
            }} 
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Volume2 className="text-[var(--primary)] w-10 h-10 animate-bounce" />
          </div>
        </div>
        
        <div className="flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.h3
              key={currentTrack.title}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 10, opacity: 0 }}
              className="text-xl font-black text-[var(--primary)] truncate tracking-tighter uppercase glitch-text"
            >
              FILE: {currentTrack.title}
            </motion.h3>
          </AnimatePresence>
          <motion.p 
            key={currentTrack.artist}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            className="text-[var(--secondary)] font-mono text-[10px] uppercase tracking-widest"
          >
            SOURCE: {currentTrack.artist}_NODE
          </motion.p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-4 w-full bg-black border border-[var(--primary)]/30 relative overflow-hidden text-center">
          <motion.div 
            className="absolute inset-y-0 left-0 bg-[var(--primary)] shadow-[0_0_5px_var(--primary)]"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[8px] font-mono text-white mix-blend-difference">
            LOAD_LEVEL: {Math.floor(progress)}%
          </div>
        </div>
        <div className="flex justify-between text-[10px] font-mono text-[var(--primary)]/60 tracking-wider">
          <span>{formatTime((progress / 100) * currentTrack.duration)}</span>
          <span>{formatTime(currentTrack.duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6">
        <button 
          onClick={onPrev}
          className="p-2 text-[var(--primary)] hover:text-[var(--secondary)] transition-colors glitch-text"
          id="prev-track"
        >
          <Rewind fill="currentColor" size={24} />
        </button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onTogglePlay}
          className="h-14 w-14 border-4 border-double border-[var(--primary)] flex items-center justify-center bg-black text-[var(--primary)] shadow-[4px_4px_0px_var(--secondary)] hover:shadow-[2px_2px_0px_var(--secondary)]"
          id="play-pause"
        >
          {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
        </motion.button>

        <button 
          onClick={onNext}
          className="p-2 text-[var(--primary)] hover:text-[var(--secondary)] transition-colors glitch-text"
          id="next-track"
        >
          <FastForward fill="currentColor" size={24} />
        </button>
      </div>

      <div className="flex items-end justify-between h-5 gap-0.5 border-t border-[var(--primary)]/20 pt-2">
        {Array.from({ length: 32 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              height: isPlaying ? [2, Math.random() * 16 + 4, 2] : 2
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 0.1 + Math.random() * 0.2,
              ease: "linear" 
            }}
            className="flex-1 bg-[var(--secondary)]"
            style={{ opacity: 0.4 + (i / 32) * 0.6 }}
          />
        ))}
      </div>
    </div>
  );
};
