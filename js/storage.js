/**
 * 地下城传奇 - 俄罗斯方块
 * 本地存储模块
 */

const Storage = {
  KEYS: {
    HIGH_SCORES: 'dungeon_tetris_high_scores',
    BEST_SCORE: 'dungeon_tetris_best_score',
  },

  MAX_SCORES: 10,

  getHighScores() {
    try {
      const data = localStorage.getItem(this.KEYS.HIGH_SCORES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveScore(score, level, lines) {
    const scores = this.getHighScores();
    const entry = {
      score,
      level,
      lines,
      date: new Date().toLocaleDateString('zh-CN'),
    };
    scores.push(entry);
    scores.sort((a, b) => b.score - a.score);
    const trimmed = scores.slice(0, this.MAX_SCORES);
    try {
      localStorage.setItem(this.KEYS.HIGH_SCORES, JSON.stringify(trimmed));
    } catch {
      // 存储空间不足时忽略
    }
    return trimmed;
  },

  getBestScore() {
    try {
      return parseInt(localStorage.getItem(this.KEYS.BEST_SCORE)) || 0;
    } catch {
      return 0;
    }
  },

  updateBestScore(score) {
    const best = this.getBestScore();
    if (score > best) {
      try {
        localStorage.setItem(this.KEYS.BEST_SCORE, score.toString());
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  },

  clearAll() {
    try {
      localStorage.removeItem(this.KEYS.HIGH_SCORES);
      localStorage.removeItem(this.KEYS.BEST_SCORE);
    } catch {
      // ignore
    }
  },
};
