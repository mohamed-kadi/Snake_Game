import { motion } from 'motion/react';
import React from 'react';
import { musicService } from '@/src/services/musicService';
import { GameTheme, Track } from '@/src/utils/types';
import { MusicPlayer } from '@/src/components/MusicPlayer';
import { ThemeSelector } from '@/src/components/ThemeSelector';

interface SonicLogProps {
  currentTrack: Track;
  isPlaying: boolean;
  progress: number;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentTheme: GameTheme;
  onThemeChange: (theme: GameTheme) => void;
}

export const SonicLog: React.FC<SonicLogProps> = ({ 
  currentTrack,
  isPlaying,
  progress,
  onTogglePlay,
  onNext,
  onPrev,
  currentTheme,
  onThemeChange
}) => {
  const tracks = musicService.getTracks();

  const controls = [
    { k: 'W', l: 'UP' },
    { k: 'A', l: 'LEFT' },
    { k: 'S', l: 'DOWN' },
    { k: 'D', l: 'RIGHT' },
  ];

  return (
    <section className="flex flex-col gap-4 w-full h-full overflow-hidden">
      <div className="glass-panel flex-1 p-4 flex flex-col min-h-0">
        <h3 className="text-[10px] font-bold uppercase tracking-widest mb-3 text-[var(--secondary)]">SONIC_LOG</h3>
        
        <div className="space-y-1 overflow-y-auto scrollbar-hide mb-4 max-h-[160px]">
          {tracks.map((track, idx) => (
            <div 
              key={track.id} 
              className={`p-1.5 flex items-center gap-2 border border-transparent transition-all ${currentTrack.id === track.id ? 'bg-[var(--primary)]/10 border-[var(--primary)]/30' : 'opacity-40 grayscale hover:opacity-100 hover:grayscale-0'}`}
            >
              <div className={`w-5 h-5 flex items-center justify-center font-bold text-[9px] ${currentTrack.id === track.id ? 'bg-[var(--primary)]/20 text-[var(--primary)]' : 'bg-white/5'}`}>
                {idx + 1}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-[10px] font-bold truncate leading-none">{track.title}</div>
                <div className="text-[7px] text-[var(--secondary)] whitespace-nowrap opacity-50">NODE_{idx}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-b border-[var(--primary)]/20 py-4 mb-4">
          <MusicPlayer 
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            progress={progress}
            onTogglePlay={onTogglePlay}
            onNext={onNext}
            onPrev={onPrev}
          />
        </div>

        <div className="mt-auto space-y-4">
          <div>
            <div className="text-[8px] uppercase font-bold text-[var(--secondary)] mb-2 tracking-widest opacity-60">THEME_OVERRIDE</div>
            <ThemeSelector currentTheme={currentTheme} onThemeChange={onThemeChange} />
          </div>

          <div className="p-3 bg-black/40 border-2 border-double border-[var(--primary)]/40">
            <div className="text-[8px] uppercase font-bold text-[var(--secondary)] mb-2 tracking-widest opacity-60">SYNAPSE_ACTIVITY</div>
            <div className="flex gap-1 items-end h-8">
              {[40, 80, 50, 20, 60, 45, 90, 30].map((h, i) => (
                <motion.div 
                  key={i}
                  animate={{ height: [`${h}%`, `${Math.random() * 100}%`, `${h}%`] }}
                  transition={{ repeat: Infinity, duration: 0.15, delay: i * 0.05 }}
                  className="flex-1 bg-[var(--primary)] opacity-50"
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 opacity-80">
            {controls.map(i => (
              <div key={i.k} className="flex items-center gap-2">
                <div className="w-6 h-6 border border-[var(--primary)]/40 flex items-center justify-center text-[9px] font-mono bg-black shadow-[1px_1px_0px_var(--secondary)]">{i.k}</div>
                <span className="text-[8px] text-[var(--primary)] font-bold uppercase tracking-tighter">{i.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
