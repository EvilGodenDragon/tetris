# 快速开始指南

## 🎮 立即开始游戏

1. **双击打开** `index.html` 文件
2. 点击 **"开始游戏"** 按钮
3. 使用键盘控制方块

## ⌨️ 键盘操作

- **← →** : 左右移动
- **↑** : 旋转方块
- **↓** : 加速下落
- **空格** : 直接落底
- **P** : 暂停/继续
- **R** : 重新开始（游戏结束后）

## 🌓 切换主题

在左侧面板的"设置"区域，点击开关即可切换明亮/夜间模式。

## 📱 在手机上玩

1. 将项目部署到服务器（如 GitHub Pages）
2. 用手机浏览器访问
3. 建议使用横屏模式

## 🔧 本地运行（推荐）

使用本地服务器可以避免浏览器的安全限制：

```bash
# Python 3
python -m http.server 8080

# Node.js
npx http-server -p 8080
```

然后访问: `http://localhost:8080`

## 📤 发布到 GitHub

### 方法一：使用自动化脚本（推荐）

1. 编辑 `deploy-to-github.ps1` 文件
2. 修改 `$YOUR_USERNAME = "your-github-username"` 为你的用户名
3. 右键点击文件，选择"使用 PowerShell 运行"

### 方法二：手动操作

详见 [GITHUB_GUIDE.md](GITHUB_GUIDE.md)

## ❓ 常见问题

**Q: 游戏无法运行？**
A: 确保使用现代浏览器（Chrome、Firefox、Edge、Safari）

**Q: 如何修改游戏速度？**
A: 编辑 `js/constants.js` 中的 `LEVEL_SPEEDS` 数组

**Q: 如何更改方块颜色？**
A: 编辑 `js/constants.js` 中的 `COLORS` 数组

**Q: 排行榜数据保存在哪里？**
A: 数据保存在浏览器的 LocalStorage 中

## 📚 更多文档

- [README.md](README.md) - 完整的项目说明
- [GITHUB_GUIDE.md](GITHUB_GUIDE.md) - GitHub 发布详细教程
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - 项目开发总结

---

祝你玩得开心！🎉
