# 俄罗斯方块 (Tetris)

一个基于 HTML5 Canvas 和原生 JavaScript 实现的经典俄罗斯方块游戏，支持昼夜主题切换、本地排行榜等功能。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 🎮 在线演示

[在线试玩](https://evilgodendragon.github.io/tetris/) *(请替换为实际的 GitHub Pages 链接)*

## ✨ 特性

- 🎯 **经典玩法**：完整的俄罗斯方块核心机制
- 🌓 **主题切换**：支持明亮模式和夜间模式，自动保存偏好设置
- 👻 **幽灵方块**：实时预览方块落点位置
- 🏆 **排行榜系统**：本地存储历史最高分和游戏记录
- 📱 **全平台适配**：完美支持桌面端、平板和手机，带触摸控制
- ⚡ **等级系统**：随消除行数提升难度，下落速度递增
- 🎨 **精美UI**：现代化界面设计，流畅的动画效果
- 🔄 **响应式Canvas**：根据屏幕尺寸自动调整游戏区域大小

## 📸 截图

### 夜间模式
![夜间模式截图](screenshots/dark-mode.png)

### 明亮模式
![明亮模式截图](screenshots/light-mode.png)

*(请添加实际截图到 `screenshots` 文件夹)*

## 🚀 快速开始

### 方式一：直接运行

1. 克隆或下载本项目
2. 直接用浏览器打开 `index.html` 文件
3. 开始游戏！

### 方式二：使用本地服务器（推荐）

```bash
# 使用 Python 3
python -m http.server 8080

# 或使用 Node.js 的 http-server
npx http-server -p 8080
```

然后在浏览器中访问 `http://localhost:8080`

## 🎮 操作说明

### 桌面端（键盘）

| 按键 | 功能 |
|------|------|
| ← → | 左右移动方块 |
| ↑ | 旋转方块 |
| ↓ | 加速下落 |
| Space | 硬降（直接落底） |
| P | 暂停/继续游戏 |
| R | 游戏结束后重新开始 |
| Enter | 快速开始游戏 |

### 移动端（触摸）

在移动设备上会自动显示虚拟控制按钮：

- **←**：左移
- **→**：右移
- **↻**：旋转
- **↓**：加速下落（长按可连续下落）
- **⤓**：硬降（直接落底）

> 💡 提示：在游戏区域内滑动手势也会被识别，防止页面滚动干扰游戏体验。

## 📁 项目结构

```
俄罗斯方块/
├── index.html          # 主页面
├── css/
│   └── style.css      # 样式文件（包含主题变量定义）
├── js/
│   ├── constants.js   # 游戏常量（方块形状、颜色、速度等）
│   ├── piece.js       # 方块类定义
│   ├── board.js       # 游戏面板逻辑
│   ├── game.js        # 游戏主控制器
│   ├── storage.js     # 本地存储管理
│   └── main.js        # 入口文件和事件处理
└── README.md          # 项目说明文档
```

## 🛠️ 技术实现

### 核心技术栈

- **HTML5 Canvas**：游戏画面渲染
- **CSS3 Variables**：主题切换实现
- **Vanilla JavaScript**：游戏逻辑（ES6+）
- **LocalStorage**：数据持久化
- **Touch Events**：移动端触摸控制

### 关键特性实现

#### 响应式设计

采用多断点媒体查询，针对不同设备优化布局：

```css
/* 平板端 (768px以下) */
@media (max-width: 768px) {
  .game-container {
    flex-direction: column;
  }
  
  /* 隐藏操作说明，节省空间 */
  .left-panel {
    display: none;
  }
}

/* 手机端 (480px以下) */
@media (max-width: 480px) {
  /* 进一步缩小间距和字体 */
}
```

#### 动态Canvas缩放

根据屏幕宽度自动计算合适的方块大小：

```javascript
resizeCanvas() {
  const viewportWidth = window.innerWidth;
  let blockSize = BLOCK_SIZE;
  
  // 手机端
  if (viewportWidth <= 480) {
    blockSize = Math.min(Math.floor(viewportWidth / COLS), 20);
  }
  // 平板端
  else if (viewportWidth <= 768) {
    blockSize = Math.min(Math.floor(viewportWidth / COLS), 25);
  }
  
  this.canvas.width = COLS * blockSize;
  this.canvas.height = ROWS * blockSize;
}
```

#### 触摸控制

为移动设备添加虚拟按钮和手势支持：

```javascript
// 检测移动设备
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad/i.test(navigator.userAgent) 
    || window.innerWidth <= 768 
    || ('ontouchstart' in window);
}

// 触摸事件处理
touchBtn.addEventListener('touchstart', (e) => {
  e.preventDefault(); // 防止页面滚动
  game.moveLeft();
});
```

#### 主题切换
通过 CSS 自定义属性（Variables）实现昼夜模式切换：

```css
:root {
  --bg-color: #06060f;
  --accent-color: #f0c060;
  /* ... 更多变量 */
}

body.light-mode {
  --bg-color: #f0f2f5;
  --accent-color: #d48806;
  /* ... 覆盖变量 */
}
```

#### 方块旋转与碰撞检测
使用矩阵旋转算法和边界检测：

```javascript
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
```

#### 幽灵方块
计算方块在不改变横向位置的情况下能下落到的最低位置：

```javascript
getGhostY(piece) {
  let ghostY = piece.y;
  while (this.isValidPosition(piece.shape, piece.x, ghostY + 1)) {
    ghostY++;
  }
  return ghostY;
}
```

## 🎨 自定义配置

### 修改方块颜色

编辑 `js/constants.js` 中的 `COLORS` 数组：

```javascript
const COLORS = [
  null,
  '#00f0f0', // I - 冰蓝
  '#f0f000', // O - 金黄
  // ... 自定义颜色
];
```

### 调整游戏速度

修改 `LEVEL_SPEEDS` 数组（单位：毫秒）：

```javascript
const LEVEL_SPEEDS = [
  800, 720, 630, 550, 470, // 等级 1-5
  380, 300, 220, 150, 100, // 等级 6-10
  // ... 更高等级
];
```

### 修改计分规则

编辑 `SCORE_TABLE` 对象：

```javascript
const SCORE_TABLE = {
  1: 100,  // 消除1行
  2: 300,  // 消除2行
  3: 500,  // 消除3行
  4: 800,  // 消除4行（Tetris）
};
```

## 📊 计分系统

- **单行消除**：100 × 当前等级
- **双行消除**：300 × 当前等级
- **三行消除**：500 × 当前等级
- **四行消除**：800 × 当前等级
- **硬降奖励**：2 × 下落格数

每消除 10 行提升一个等级，下落速度相应增加。

## 🔧 开发计划

- [ ] 添加音效和背景音乐
- [ ] 实现 Hold 功能（暂存方块）
- [ ] 添加更多特效和动画
- [ ] 支持多人对战模式
- [ ] 添加成就系统
- [ ] 优化移动端触摸操作

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 👨‍💻 作者

**Your Name**

- GitHub: [@your-github-username](https://github.com/your-github-username)

## 🙏 致谢

- 灵感来源：经典俄罗斯方块游戏
- 参考资源：The Tetris Guideline

---

⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！
