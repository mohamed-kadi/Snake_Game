import { TRACKS } from '@/src/utils/constants';
import { Track } from '@/src/utils/types';

export const musicService = {
  getTracks: (): Track[] => {
    return TRACKS;
  },
  getTrackById: (id: string): Track | undefined => {
    return TRACKS.find(t => t.id === id);
  }
};
