import { GameTheme } from '@/src/utils/types';

export interface UserSettings {
  theme: GameTheme;
  fontFamily: string;
  isMuted: boolean;
}

const SETTINGS_STORAGE_KEY = 'neural_snake_settings';

const defaultSettings: UserSettings = {
  theme: GameTheme.GLITCH,
  fontFamily: 'Theme default',
  isMuted: false,
};

export const settingsService = {
  getSettings: (): UserSettings => {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!stored) return defaultSettings;

    try {
      const parsed = JSON.parse(stored) as Partial<UserSettings>;
      return {
        ...defaultSettings,
        ...parsed,
      };
    } catch (error) {
      console.error('Failed to parse settings', error);
      return defaultSettings;
    }
  },

  saveSettings: (settings: UserSettings): void => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  },
};
