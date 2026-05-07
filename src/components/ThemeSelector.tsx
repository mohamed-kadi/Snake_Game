import React from 'react';
import { GameTheme } from '../utils/types';

interface ThemeSelectorProps {
  currentTheme: GameTheme;
  onThemeChange: (theme: GameTheme) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onThemeChange }) => {
  const themes = [
    { id: GameTheme.GLITCH, label: 'GLITCH_ART' },
    { id: GameTheme.CYBER, label: 'CYBER_PUNK' },
    { id: GameTheme.RETRO, label: 'RETRO_CRT' },
    { id: GameTheme.MINIMAL, label: 'MINIMAL_VOID' },
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onThemeChange(theme.id)}
            className={`px-3 py-2 text-[10px] font-mono text-center transition-all border-2 
              ${currentTheme === theme.id 
                ? 'bg-[var(--primary)] text-black border-[var(--primary)]' 
                : 'bg-black text-[var(--primary)] border-[var(--primary)]/30 hover:border-[var(--primary)]'
              }`}
          >
            {theme.label}
          </button>
        ))}
      </div>
    </div>
  );
};
