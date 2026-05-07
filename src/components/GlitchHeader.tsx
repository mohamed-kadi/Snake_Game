import React from 'react';

interface GlitchHeaderProps {
  score: number;
  bestScore: number;
  speedLevel: number;
}

export const GlitchHeader: React.FC<GlitchHeaderProps> = ({ score, bestScore, speedLevel }) => {
  return (
    <header className="w-full z-10 border-b-2 border-double border-[var(--primary)] pb-6 mb-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center w-full px-2">
        <div className="flex flex-col">
          <h1 className="text-4xl font-black tracking-tighter italic uppercase neon-text-cyan glitch-text">
            NEURAL_SNAKE_V2
          </h1>
          <p className="text-[10px] font-mono tracking-[0.3em] text-[var(--secondary)] uppercase">INTERFACE//OPERATING_SYSTEM</p>
        </div>

        <div className="glass-panel px-10 py-4 flex items-center gap-12 hidden md:flex">
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase text-[var(--secondary)] font-bold mb-1 tracking-widest">INTEGRITY_INDEX</span>
            <span className="text-3xl font-mono text-[var(--primary)] tabular-nums">{score.toString().padStart(6, '0')}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase opacity-50 font-bold mb-1 tracking-widest">PEAK_STRENGTH</span>
            <span className="text-3xl font-mono text-[var(--secondary)] tabular-nums">{bestScore.toString().padStart(6, '0')}</span>
          </div>
          <div className="flex flex-col items-center border-l border-[var(--primary)]/20 pl-12 ml-4">
            <span className="text-[10px] uppercase opacity-50 font-bold mb-1 tracking-widest">NODE_LAYER</span>
            <span className="text-3xl font-mono text-[var(--accent)]">{speedLevel.toString().padStart(2, '0')}</span>
          </div>
        </div>

        <div className="md:hidden flex flex-col items-end">
          <div className="text-5xl font-black tabular-nums tracking-tighter text-[var(--accent)]">
            {score.toString().padStart(4, '0')}
          </div>
          <div className="text-[10px] tracking-[0.15em] text-[var(--secondary)]">
            BEST {bestScore.toString().padStart(4, '0')}
          </div>
          <div className="text-[10px] tracking-[0.15em] text-[var(--accent)]">
            LVL {speedLevel.toString().padStart(2, '0')}
          </div>
        </div>
      </div>
    </header>
  );
};
