export interface HighScore {
  id: string;
  name: string;
  score: number;
  date: number;
}

const STORAGE_KEY = 'neural_snake_high_scores';
const BEST_SCORE_STORAGE_KEY = 'neural_snake_best_score';

export const highScoreService = {
  getBestScore: (): number => {
    const stored = localStorage.getItem(BEST_SCORE_STORAGE_KEY);
    if (!stored) return 0;

    const parsed = Number(stored);
    return Number.isFinite(parsed) ? parsed : 0;
  },

  setBestScore: (score: number): void => {
    localStorage.setItem(BEST_SCORE_STORAGE_KEY, String(score));
  },

  getScores: (): HighScore[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored).sort((a: HighScore, b: HighScore) => b.score - a.score);
    } catch (e) {
      console.error('Failed to parse high scores', e);
      return [];
    }
  },

  saveScore: (name: string, score: number): HighScore[] => {
    const scores = highScoreService.getScores();
    const newScore: HighScore = {
      id: Math.random().toString(36).substr(2, 9),
      name: name || 'ANONYMOUS_VOID',
      score,
      date: Date.now(),
    };
    
    const updatedScores = [...scores, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Keep top 10
      
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedScores));
    return updatedScores;
  }
};
