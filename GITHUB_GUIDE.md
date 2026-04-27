# GitHub 发布指南

## 📤 推送代码到 GitHub

### 步骤 1：在 GitHub 创建仓库

1. 访问 [GitHub](https://github.com)
2. 点击右上角的 **"+"** → **"New repository"**
3. 填写仓库信息：
   - **Repository name**: `tetris` 或 `俄罗斯方块`
   - **Description**: 一个基于 HTML5 Canvas 的俄罗斯方块游戏
   - 选择 **Public**（公开）或 **Private**（私有）
   - **不要**勾选 "Initialize this repository with a README"
4. 点击 **"Create repository"**

### 步骤 2：关联远程仓库并推送

在终端中执行以下命令（替换 `your-username` 为你的 GitHub 用户名）：

```bash
# 添加远程仓库
git remote add origin https://github.com/your-username/tetris.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 步骤 3：启用 GitHub Pages（可选）

如果你想在线展示这个游戏：

1. 进入仓库的 **Settings** → **Pages**
2. 在 **Source** 下选择：
   - Branch: `main`
   - Folder: `/ (root)`
3. 点击 **Save**
4. 等待几分钟，你的游戏将可以在 `https://your-username.github.io/tetris/` 访问

## 📝 更新 README

在推送之前，记得修改 README.md 中的以下内容：

1. **在线演示链接**：
   ```markdown
   [在线试玩](https://your-username.github.io/tetris/)
   ```

2. **作者信息**：
   ```markdown
   **Your Name**
   - GitHub: [@your-username](https://github.com/your-username)
   ```

3. **添加截图**（可选）：
   - 创建 `screenshots` 文件夹
   - 添加游戏截图
   - 更新 README 中的图片链接

## 🏷️ 创建版本标签

```bash
# 创建标签
git tag -a v1.0.0 -m "第一个正式版本：基础功能完成"

# 推送标签
git push origin v1.0.0
```

## 📊 查看项目统计

推送完成后，你可以在 GitHub 上看到：
- 代码提交历史
- 贡献者统计
- 语言分布
- Star 和 Fork 数量

## 🔗 分享你的项目

- 在社交媒体分享仓库链接
- 添加到你的个人作品集
- 在技术社区分享开发经验

---

祝你在 GitHub 上取得成功！🚀
