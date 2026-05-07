import { Track } from '@/src/utils/types';

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyber Pulse',
    artist: 'AI Overlord',
    duration: 184,
    genre: 'Synthwave',
    color: '#00f2ff', // Cyan
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: '2',
    title: 'Neon Shadows',
    artist: 'Night Crawler',
    duration: 215,
    genre: 'Dark Electro',
    color: '#ff00ff', // Magenta
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: '3',
    title: 'Grid Runner',
    artist: 'Protocol X',
    duration: 156,
    genre: 'Fast Synth',
    color: '#39ff14', // Neon Green
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
  },
];

export const GRID_SIZE = 20;
export const CELL_SIZE = 20; // Will be responsive though
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const GAME_SPEED = 120; // ms
