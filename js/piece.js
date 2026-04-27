/**
 * 地下城传奇 - 俄罗斯方块
 * 方块类
 */

class Piece {
  constructor(shapeIndex) {
    if (shapeIndex === undefined) {
      shapeIndex = Math.floor(Math.random() * SHAPE_NAMES.length);
    }
    this.name = SHAPE_NAMES[shapeIndex];
    this.shape = SHAPES[this.name].map(row => [...row]);
    this.size = this.shape.length;
    this.x = Math.floor((COLS - this.size) / 2);
    this.y = 0;
    this.colorIndex = this.shape.flat().find(v => v !== 0);
  }

  static random() {
    return new Piece();
  }

  rotate() {
    const n = this.size;
    const rotated = Array.from({ length: n }, () => Array(n).fill(0));
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        rotated[c][n - 1 - r] = this.shape[r][c];
      }
    }
    return rotated;
  }

  clone() {
    const p = new Piece(SHAPE_NAMES.indexOf(this.name));
    p.shape = this.shape.map(row => [...row]);
    p.x = this.x;
    p.y = this.y;
    return p;
  }
}
