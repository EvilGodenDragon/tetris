/**
 * 地下城传奇 - 俄罗斯方块
 * 入口初始化
 */

(function () {
  'use strict';

  let game = null;

  const $ = (sel) => document.querySelector(sel);

  function init() {
    const canvas = $('#game-canvas');
    const nextCanvas = $('#next-canvas');
    const scoreEl = $('#score-value');
    const levelEl = $('#level-value');
    const linesEl = $('#lines-value');
    const bestEl = $('#best-value');
    const startBtn = $('#btn-start');
    const pauseBtn = $('#btn-pause');
    const scoresListEl = $('#scores-list');
    const themeSwitch = $('#theme-switch');

    // 初始化主题
    initTheme(themeSwitch);

    game = new Game(canvas, nextCanvas);

    game.onScoreUpdate = (data) => {
      scoreEl.textContent = data.score.toLocaleString();
      levelEl.textContent = data.level;
      linesEl.textContent = data.lines;
      bestEl.textContent = data.bestScore.toLocaleString();
    };

    game.onGameOver = () => {
      pauseBtn.textContent = '暂停';
      pauseBtn.disabled = true;
      startBtn.textContent = '重新开始';
      startBtn.disabled = false;
      renderHighScores();
    };

    // 初始显示
    bestEl.textContent = Storage.getBestScore().toLocaleString();
    game.renderWelcome();
    renderHighScores();

    // 开始按钮
    startBtn.addEventListener('click', () => {
      startGame();
    });

    // 暂停按钮
    pauseBtn.addEventListener('click', () => {
      if (!game.started || game.gameOver) return;
      const paused = game.togglePause();
      pauseBtn.textContent = paused ? '继续' : '暂停';
    });

    // 键盘控制
    document.addEventListener('keydown', handleKeyDown);

    function handleKeyDown(e) {
      if (e.key === 'Enter' && (!game.started || game.gameOver)) {
        e.preventDefault();
        startGame();
        return;
      }

      if (!game.started) return;

      switch (e.key) {
        case KEYS.LEFT:
          e.preventDefault();
          game.moveLeft();
          break;
        case KEYS.RIGHT:
          e.preventDefault();
          game.moveRight();
          break;
        case KEYS.DOWN:
          e.preventDefault();
          game.moveDown();
          break;
        case KEYS.UP:
          e.preventDefault();
          game.rotatePiece();
          break;
        case KEYS.SPACE:
          e.preventDefault();
          game.hardDrop();
          break;
        case KEYS.P:
        case 'P':
          e.preventDefault();
          const paused = game.togglePause();
          if (paused !== undefined) {
            pauseBtn.textContent = paused ? '继续' : '暂停';
          }
          break;
        case KEYS.R:
        case 'R':
          if (game.gameOver) {
            e.preventDefault();
            startGame();
          }
          break;
      }
    }

    function startGame() {
      game.start();
      startBtn.textContent = '重新开始';
      pauseBtn.textContent = '暂停';
      pauseBtn.disabled = false;
    }

    function renderHighScores() {
      const scores = Storage.getHighScores();
      if (scores.length === 0) {
        scoresListEl.innerHTML = '<div class="no-scores">暂无记录</div>';
        return;
      }
      scoresListEl.innerHTML = scores
        .slice(0, 5)
        .map(
          (s, i) =>
            `<div class="score-entry">
              <span class="score-rank">#${i + 1}</span>
              <span class="score-points">${s.score.toLocaleString()}</span>
              <span class="score-meta">Lv.${s.level} | ${s.lines}行</span>
            </div>`
        )
        .join('');
    }
  }

  // 主题切换逻辑
  function initTheme(switchEl) {
    const savedTheme = localStorage.getItem('tetris_theme');
    const isLightMode = savedTheme === 'light';

    if (isLightMode) {
      document.body.classList.add('light-mode');
      switchEl.checked = true;
    }

    switchEl.addEventListener('change', (e) => {
      if (e.target.checked) {
        document.body.classList.add('light-mode');
        localStorage.setItem('tetris_theme', 'light');
      } else {
        document.body.classList.remove('light-mode');
        localStorage.setItem('tetris_theme', 'dark');
      }
      
      // 新增: 主题切换后，如果游戏处于非运行状态（欢迎、暂停、结束），重新渲染以应用新配色
      if (game) {
        if (!game.started || game.gameOver) {
           // 如果还没开始或已结束，渲染欢迎界面或保持结束界面（这里简单处理为重新渲染当前状态）
           if (!game.started) {
             game.renderWelcome();
           } else if (game.gameOver) {
             game.renderGameOver();
           }
        } else if (game.paused) {
           game.renderPauseScreen();
        } else {
           // 游戏中也重新绘制背景，虽然方块颜色由 constants 定义，但背景网格会变
           game.render();
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();