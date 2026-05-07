import React from 'react';

export const GlitchFooter: React.FC = () => {
  return (
    <footer className="w-full z-10 border-t-2 border-double border-[var(--primary)] mt-auto">
      <div className="min-h-12 max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3 px-2 py-2 sm:py-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[var(--primary)]">
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 bg-[var(--secondary)] animate-pulse" />
            STATUS: CONNECTED
          </span>
          <span>PING: 4ms</span>
          <span>CACHE: 100%</span>
        </div>
        <div className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.14em] sm:tracking-[0.2em] text-[var(--secondary)] opacity-80 sm:opacity-100">
          MACHINE_DESIGN // GLITCH_CORP © 2026
        </div>
      </div>
    </footer>
  );
};
