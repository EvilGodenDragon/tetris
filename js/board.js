/**
 * 地下城传奇 - 俄罗斯方块
 * 游戏面板类
 */

class Board {
  constructor() {
    this.grid = this.createEmptyGrid();
  }

  createEmptyGrid() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  reset() {
    this.grid = this.createEmptyGrid();
  }

  isValidPosition(shape, offsetX, offsetY) {
    const size = shape.length;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (shape[r][c] === 0) continue;
        const newX = offsetX + c;
        const newY = offsetY + r;
        if (newX < 0 || newX >= COLS || newY >= ROWS) return false;
        if (newY < 0) continue;
        if (this.grid[newY][newX] !== 0) return false;
      }
    }
    return true;
  }

  lockPiece(piece) {
    const size = piece.size;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (piece.shape[r][c] === 0) continue;
        const x = piece.x + c;
        const y = piece.y + r;
        if (y >= 0 && y < ROWS && x >= 0 && x < COLS) {
          this.grid[y][x] = piece.shape[r][c];
        }
      }
    }
  }

  clearLines() {
    let linesCleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (this.grid[r].every(cell => cell !== 0)) {
        this.grid.splice(r, 1);
        this.grid.unshift(Array(COLS).fill(0));
        linesCleared++;
        r++; // 重新检查当前行
      }
    }
    return linesCleared;
  }

  getGhostY(piece) {
    let ghostY = piece.y;
    while (this.isValidPosition(piece.shape, piece.x, ghostY + 1)) {
      ghostY++;
    }
    return ghostY;
  }
}
