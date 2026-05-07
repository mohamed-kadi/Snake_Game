import React from 'react';

export const GlitchFooter: React.FC = () => {
  return (
    <footer className="w-full z-10 border-t-2 border-double border-[var(--primary)] mt-auto">
      <div className="h-12 max-w-7xl mx-auto flex items-center justify-between px-2">
        <div className="flex items-center gap-6 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 bg-[var(--secondary)] animate-pulse" />
            STATUS: CONNECTED
          </span>
          <span>PING: 4ms</span>
          <span>CACHE: 100%</span>
        </div>
        <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--secondary)]">
          MACHINE_DESIGN // GLITCH_CORP © 2026
        </div>
      </div>
    </footer>
  );
};
