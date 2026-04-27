# GitHub 快速发布脚本
# 使用前请修改 YOUR_USERNAME 为你的 GitHub 用户名

$REPO_NAME = "tetris"
$YOUR_USERNAME = "your-github-username"  # ← 修改这里

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  GitHub 仓库发布助手" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查是否已配置 Git
$gitUser = git config user.name
if (-not $gitUser) {
    Write-Host "⚠️  检测到未配置 Git 用户信息" -ForegroundColor Yellow
    Write-Host "请输入你的姓名:" -ForegroundColor Yellow
    $name = Read-Host
    git config user.name $name
    
    Write-Host "请输入你的邮箱:" -ForegroundColor Yellow
    $email = Read-Host
    git config user.email $email
    
    Write-Host "✅ Git 配置完成" -ForegroundColor Green
    Write-Host ""
}

# 显示当前状态
Write-Host "📊 当前提交历史:" -ForegroundColor Cyan
git log --oneline
Write-Host ""

# 询问是否继续
Write-Host "准备推送到 GitHub 仓库: https://github.com/$YOUR_USERNAME/$REPO_NAME" -ForegroundColor Yellow
$confirm = Read-Host "是否继续? (y/n)"

if ($confirm -ne "y") {
    Write-Host "❌ 操作已取消" -ForegroundColor Red
    exit
}

# 添加远程仓库
Write-Host ""
Write-Host "🔗 添加远程仓库..." -ForegroundColor Cyan
git remote add origin "https://github.com/$YOUR_USERNAME/$REPO_NAME.git"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 远程仓库添加成功" -ForegroundColor Green
} else {
    Write-Host "⚠️  远程仓库可能已存在，尝试更新..." -ForegroundColor Yellow
    git remote set-url origin "https://github.com/$YOUR_USERNAME/$REPO_NAME.git"
}

# 重命名分支为 main
Write-Host ""
Write-Host "🌿 重命名分支为 main..." -ForegroundColor Cyan
git branch -M main

# 推送代码
Write-Host ""
Write-Host "🚀 推送代码到 GitHub..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  🎉 推送成功！" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 仓库地址: https://github.com/$YOUR_USERNAME/$REPO_NAME" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "下一步：" -ForegroundColor Yellow
    Write-Host "1. 访问上面的链接查看你的仓库" -ForegroundColor White
    Write-Host "2. 在 Settings → Pages 中启用 GitHub Pages" -ForegroundColor White
    Write-Host "3. 更新 README.md 中的在线演示链接" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ 推送失败，请检查：" -ForegroundColor Red
    Write-Host "1. 是否已在 GitHub 创建仓库" -ForegroundColor Yellow
    Write-Host "2. 用户名和仓库名是否正确" -ForegroundColor Yellow
    Write-Host "3. 网络连接是否正常" -ForegroundColor Yellow
    Write-Host ""
}
