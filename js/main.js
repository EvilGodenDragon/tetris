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
    const touchControls = $('#touch-controls');

    // 初始化主题
    initTheme(themeSwitch);

    // 检测是否为移动设备，显示触摸控制
    if (isMobileDevice()) {
      touchControls.classList.add('visible');
    }

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

    // 触摸控制
    initTouchControls();

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

    /**
     * 检测是否为移动设备
     */
    function isMobileDevice() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
        || window.innerWidth <= 768 
        || ('ontouchstart' in window) 
        || (navigator.maxTouchPoints > 0);
    }

    /**
     * 初始化触摸控制
     */
    function initTouchControls() {
      const touchLeft = $('#touch-left');
      const touchRight = $('#touch-right');
      const touchRotate = $('#touch-rotate');
      const touchDown = $('#touch-down');
      const touchDrop = $('#touch-drop');

      // 防止触摸时页面滚动
      const preventScroll = (e) => {
        e.preventDefault();
      };

      // 左移
      touchLeft.addEventListener('touchstart', (e) => {
        preventScroll(e);
        if (game && game.started && !game.paused && !game.gameOver) {
          game.moveLeft();
        }
      });

      // 右移
      touchRight.addEventListener('touchstart', (e) => {
        preventScroll(e);
        if (game && game.started && !game.paused && !game.gameOver) {
          game.moveRight();
        }
      });

      // 旋转
      touchRotate.addEventListener('touchstart', (e) => {
        preventScroll(e);
        if (game && game.started && !game.paused && !game.gameOver) {
          game.rotatePiece();
        }
      });

      // 加速下落（连续触发）
      let downInterval = null;
      touchDown.addEventListener('touchstart', (e) => {
        preventScroll(e);
        if (game && game.started && !game.paused && !game.gameOver) {
          game.moveDown();
          // 长按连续下落
          downInterval = setInterval(() => {
            if (game && game.started && !game.paused && !game.gameOver) {
              game.moveDown();
            }
          }, 100);
        }
      });

      touchDown.addEventListener('touchend', (e) => {
        preventScroll(e);
        if (downInterval) {
          clearInterval(downInterval);
          downInterval = null;
        }
      });

      touchDown.addEventListener('touchcancel', (e) => {
        if (downInterval) {
          clearInterval(downInterval);
          downInterval = null;
        }
      });

      // 硬降
      touchDrop.addEventListener('touchstart', (e) => {
        preventScroll(e);
        if (game && game.started && !game.paused && !game.gameOver) {
          game.hardDrop();
        }
      });

      // 防止Canvas上的默认触摸行为
      canvas.addEventListener('touchstart', preventScroll, { passive: false });
      canvas.addEventListener('touchmove', preventScroll, { passive: false });
      canvas.addEventListener('touchend', preventScroll, { passive: false });
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