import React from 'react';

export interface FontOption {
  label: string;
  value: string;
}

export interface ThemeOption {
  label: string;
  value: string;
}

interface SettingsMenuProps {
  isOpen: boolean;
  onToggleOpen: () => void;
  selectedFont: string;
  fontOptions: FontOption[];
  onFontChange: (fontValue: string) => void;
  selectedTheme: string;
  themeOptions: ThemeOption[];
  onThemeChange: (themeValue: string) => void;
  isMuted: boolean;
  onToggleMuted: () => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
  isOpen,
  onToggleOpen,
  selectedFont,
  fontOptions,
  onFontChange,
  selectedTheme,
  themeOptions,
  onThemeChange,
  isMuted,
  onToggleMuted,
}) => {
  return (
    <div className="fixed bottom-4 right-3 sm:top-4 sm:right-4 sm:bottom-auto z-40">
      <button
        type="button"
        onClick={onToggleOpen}
        className="px-3 py-2 border-2 border-[var(--primary)] bg-black/80 text-[var(--primary)] text-xs font-bold tracking-[0.12em] hover:bg-[var(--primary)] hover:text-black transition-colors"
      >
        SETTINGS
      </button>

      {isOpen && (
        <div className="mb-2 sm:mb-0 sm:mt-2 w-[min(88vw,260px)] glass-panel p-3 border-2 border-[var(--primary)]">
          <div className="text-[10px] font-bold tracking-[0.18em] text-[var(--secondary)] mb-2">
            PREFERENCES
          </div>

          <label className="block text-[10px] tracking-[0.12em] mb-1 text-[var(--text)]/70">FONT</label>
          <select
            value={selectedFont}
            onChange={(e) => onFontChange(e.target.value)}
            className="w-full mb-3 px-2 py-1.5 bg-black border border-[var(--primary)]/40 text-[var(--text)] text-xs outline-none"
          >
            {fontOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <label className="block text-[10px] tracking-[0.12em] mb-1 text-[var(--text)]/70">THEME</label>
          <select
            value={selectedTheme}
            onChange={(e) => onThemeChange(e.target.value)}
            className="w-full mb-3 px-2 py-1.5 bg-black border border-[var(--primary)]/40 text-[var(--text)] text-xs outline-none"
          >
            {themeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onToggleMuted}
            className="w-full px-2 py-2 border border-[var(--secondary)] text-[var(--secondary)] text-xs font-bold tracking-[0.1em] hover:bg-[var(--secondary)] hover:text-black transition-colors"
          >
            {isMuted ? 'MUSIC: SILENT' : 'MUSIC: ON'}
          </button>
        </div>
      )}
    </div>
  );
};
