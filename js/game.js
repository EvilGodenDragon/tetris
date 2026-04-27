/**
 * 地下城传奇 - 俄罗斯方块
 * 游戏主控制器
 */

class Game {
  constructor(canvas, nextCanvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.nextCanvas = nextCanvas;
    this.nextCtx = nextCanvas.getContext('2d');

    this.canvas.width = COLS * BLOCK_SIZE;
    this.canvas.height = ROWS * BLOCK_SIZE;
    this.nextCanvas.width = 4 * BLOCK_SIZE;
    this.nextCanvas.height = 4 * BLOCK_SIZE;

    this.board = new Board();
    this.currentPiece = null;
    this.nextPiece = null;
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.bestScore = Storage.getBestScore();
    this.gameOver = false;
    this.paused = false;
    this.started = false;
    this.dropTimer = null;
    this.animationId = null;

    this.onScoreUpdate = null;
    this.onGameOver = null;
  }

  start() {
    this.board.reset();
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.gameOver = false;
    this.paused = false;
    this.started = true;

    this.currentPiece = Piece.random();
    this.nextPiece = Piece.random();

    this.notifyScoreUpdate();
    this.startDropTimer();
    this.render();
  }

  startDropTimer() {
    this.stopDropTimer();
    const speed = LEVEL_SPEEDS[Math.min(this.level - 1, LEVEL_SPEEDS.length - 1)];
    this.dropTimer = setInterval(() => {
      if (!this.paused && !this.gameOver) {
        this.moveDown();
      }
    }, speed);
  }

  stopDropTimer() {
    if (this.dropTimer) {
      clearInterval(this.dropTimer);
      this.dropTimer = null;
    }
  }

  togglePause() {
    if (this.gameOver || !this.started) return;
    this.paused = !this.paused;
    if (this.paused) {
      this.renderPauseScreen();
    } else {
      this.render();
    }
    return this.paused;
  }

  moveLeft() {
    if (this.paused || this.gameOver || !this.started) return;
    if (this.board.isValidPosition(this.currentPiece.shape, this.currentPiece.x - 1, this.currentPiece.y)) {
      this.currentPiece.x--;
      this.render();
    }
  }

  moveRight() {
    if (this.paused || this.gameOver || !this.started) return;
    if (this.board.isValidPosition(this.currentPiece.shape, this.currentPiece.x + 1, this.currentPiece.y)) {
      this.currentPiece.x++;
      this.render();
    }
  }

  moveDown() {
    if (this.paused || this.gameOver || !this.started) return;
    if (this.board.isValidPosition(this.currentPiece.shape, this.currentPiece.x, this.currentPiece.y + 1)) {
      this.currentPiece.y++;
      this.render();
      return true;
    }
    this.lockAndAdvance();
    return false;
  }

  hardDrop() {
    if (this.paused || this.gameOver || !this.started) return;
    const ghostY = this.board.getGhostY(this.currentPiece);
    const dropDistance = ghostY - this.currentPiece.y;
    this.currentPiece.y = ghostY;
    this.score += dropDistance * 2;
    this.lockAndAdvance();
  }

  rotatePiece() {
    if (this.paused || this.gameOver || !this.started) return;
    const rotated = this.currentPiece.rotate();
    // 尝试原位旋转
    if (this.board.isValidPosition(rotated, this.currentPiece.x, this.currentPiece.y)) {
      this.currentPiece.shape = rotated;
      this.render();
      return;
    }
    // 墙踢 - 尝试左右偏移
    const kicks = [-1, 1, -2, 2];
    for (const kick of kicks) {
      if (this.board.isValidPosition(rotated, this.currentPiece.x + kick, this.currentPiece.y)) {
        this.currentPiece.shape = rotated;
        this.currentPiece.x += kick;
        this.render();
        return;
      }
    }
  }

  lockAndAdvance() {
    this.board.lockPiece(this.currentPiece);
    const cleared = this.board.clearLines();

    if (cleared > 0) {
      this.lines += cleared;
      this.score += (SCORE_TABLE[cleared] || 0) * this.level;
      const newLevel = Math.floor(this.lines / LINES_PER_LEVEL) + 1;
      if (newLevel !== this.level) {
        this.level = newLevel;
        this.startDropTimer();
      }
    }

    this.currentPiece = this.nextPiece;
    this.nextPiece = Piece.random();

    if (!this.board.isValidPosition(this.currentPiece.shape, this.currentPiece.x, this.currentPiece.y)) {
      this.gameOver = true;
      this.stopDropTimer();
      Storage.updateBestScore(this.score);
      Storage.saveScore(this.score, this.level, this.lines);
      this.bestScore = Storage.getBestScore();
      this.renderGameOver();
      if (this.onGameOver) this.onGameOver(this.score, this.level, this.lines);
      this.notifyScoreUpdate();
      return;
    }

    this.notifyScoreUpdate();
    this.render();
  }

  notifyScoreUpdate() {
    if (this.onScoreUpdate) {
      this.onScoreUpdate({
        score: this.score,
        level: this.level,
        lines: this.lines,
        bestScore: this.bestScore,
      });
    }
  }

  // ===== 渲染 =====

  render() {
    this.drawBoard();
    this.drawGhost();
    this.drawPiece(this.ctx, this.currentPiece, this.currentPiece.x, this.currentPiece.y);
    this.drawNextPiece();
  }

  drawBoard() {
    const ctx = this.ctx;
    // 从 CSS 变量获取背景色以支持主题切换
    const boardBg = getComputedStyle(document.body).getPropertyValue('--board-bg').trim() || '#0a0a1a';
    const gridColor = getComputedStyle(document.body).getPropertyValue('--panel-border').trim() || 'rgba(255, 255, 255, 0.03)';
    
    ctx.fillStyle = boardBg;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 网格线
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 0.5;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        ctx.strokeRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }

    // 已固定的方块
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (this.board.grid[r][c] !== 0) {
          this.drawBlock(ctx, c, r, this.board.grid[r][c]);
        }
      }
    }
  }

  drawBlock(ctx, x, y, colorIndex) {
    const px = x * BLOCK_SIZE;
    const py = y * BLOCK_SIZE;
    const size = BLOCK_SIZE;
    const inset = 1;

    // 发光效果
    ctx.shadowColor = COLORS[colorIndex];
    ctx.shadowBlur = 6;

    // 主色块
    ctx.fillStyle = COLORS[colorIndex];
    ctx.fillRect(px + inset, py + inset, size - inset * 2, size - inset * 2);

    // 高光
    ctx.shadowBlur = 0;
    const gradient = ctx.createLinearGradient(px, py, px, py + size);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
    ctx.fillStyle = gradient;
    ctx.fillRect(px + inset, py + inset, size - inset * 2, size - inset * 2);

    // 边框
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(px + inset, py + inset, size - inset * 2, size - inset * 2);
  }

  drawGhost() {
    if (!this.currentPiece) return;
    const ghostY = this.board.getGhostY(this.currentPiece);
    if (ghostY === this.currentPiece.y) return;

    const ctx = this.ctx;
    const piece = this.currentPiece;
    for (let r = 0; r < piece.size; r++) {
      for (let c = 0; c < piece.size; c++) {
        if (piece.shape[r][c] !== 0) {
          const px = (piece.x + c) * BLOCK_SIZE;
          const py = (ghostY + r) * BLOCK_SIZE;
          ctx.fillStyle = GLOW_COLORS[piece.shape[r][c]] || 'rgba(255,255,255,0.1)';
          ctx.fillRect(px + 2, py + 2, BLOCK_SIZE - 4, BLOCK_SIZE - 4);
          ctx.strokeStyle = COLORS[piece.shape[r][c]] || '#fff';
          ctx.globalAlpha = 0.3;
          ctx.lineWidth = 1;
          ctx.strokeRect(px + 2, py + 2, BLOCK_SIZE - 4, BLOCK_SIZE - 4);
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  drawPiece(ctx, piece, offsetX, offsetY) {
    for (let r = 0; r < piece.size; r++) {
      for (let c = 0; c < piece.size; c++) {
        if (piece.shape[r][c] !== 0) {
          this.drawBlock(ctx, offsetX + c, offsetY + r, piece.shape[r][c]);
        }
      }
    }
  }

  drawNextPiece() {
    const ctx = this.nextCtx;
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);

    if (!this.nextPiece) return;

    const piece = this.nextPiece;
    const offsetX = (4 - piece.size) / 2;
    const offsetY = (4 - piece.size) / 2;

    for (let r = 0; r < piece.size; r++) {
      for (let c = 0; c < piece.size; c++) {
        if (piece.shape[r][c] !== 0) {
          this.drawBlock(ctx, offsetX + c, offsetY + r, piece.shape[r][c]);
        }
      }
    }
  }

  renderPauseScreen() {
    this.drawBoard();
    const ctx = this.ctx;
    // 使用半透明面板背景色
    const panelBg = getComputedStyle(document.body).getPropertyValue('--panel-bg').trim() || 'rgba(255, 255, 255, 0.03)';
    // 简单的透明度处理，或者直接覆盖
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; 
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const accentColor = getComputedStyle(document.body).getPropertyValue('--accent-color').trim() || '#f0c060';
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 28px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('暂停', this.canvas.width / 2, this.canvas.height / 2 - 10);

    const textSecondary = getComputedStyle(document.body).getPropertyValue('--text-secondary').trim() || '#aaa';
    ctx.fillStyle = textSecondary;
    ctx.font = '16px "Segoe UI", sans-serif';
    ctx.fillText('按 P 继续', this.canvas.width / 2, this.canvas.height / 2 + 25);
    ctx.textAlign = 'left';
  }

  renderGameOver() {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle = '#ff4444'; // 错误色通常保持红色，或者也可以定义为变量
    ctx.font = 'bold 32px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('游戏结束', this.canvas.width / 2, this.canvas.height / 2 - 40);

    const accentColor = getComputedStyle(document.body).getPropertyValue('--accent-color').trim() || '#f0c060';
    ctx.fillStyle = accentColor;
    ctx.font = '22px "Segoe UI", sans-serif';
    ctx.fillText(`得分: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 5);

    const textSecondary = getComputedStyle(document.body).getPropertyValue('--text-secondary').trim() || '#aaa';
    ctx.fillStyle = textSecondary;
    ctx.font = '16px "Segoe UI", sans-serif';
    ctx.fillText('按 R 重新开始', this.canvas.width / 2, this.canvas.height / 2 + 45);
    ctx.textAlign = 'left';
  }

  renderWelcome() {
    const ctx = this.ctx;
    const boardBg = getComputedStyle(document.body).getPropertyValue('--board-bg').trim() || '#0a0a1a';
    ctx.fillStyle = boardBg;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 标题
    const accentColor = getComputedStyle(document.body).getPropertyValue('--accent-color').trim() || '#f0c060';
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 30px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('俄罗斯方块', this.canvas.width / 2, this.canvas.height / 2 - 40);

    const textSecondary = getComputedStyle(document.body).getPropertyValue('--text-secondary').trim() || '#aaa';
    ctx.fillStyle = textSecondary;
    ctx.font = '16px "Segoe UI", sans-serif';
    ctx.fillText('按 Enter 开始游戏', this.canvas.width / 2, this.canvas.height / 2 + 30);

    // 操作说明
    const textMuted = getComputedStyle(document.body).getPropertyValue('--text-muted').trim() || '#666';
    ctx.fillStyle = textMuted;
    ctx.font = '13px "Segoe UI", sans-serif';
    const instructions = [
      '← → 移动  ↑ 旋转  ↓ 加速',
      '空格 硬降  P 暂停  R 重开',
    ];
    instructions.forEach((text, i) => {
      ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2 + 70 + i * 22);
    });

    ctx.textAlign = 'left';

    // 清空预览区
    this.nextCtx.fillStyle = boardBg;
    this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
  }

  destroy() {
    this.stopDropTimer();
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}
