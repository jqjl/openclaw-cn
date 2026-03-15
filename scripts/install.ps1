# OpenClaw 中文版 Windows 一键安装脚本
Write-Host "🦞 正在安装 OpenClaw 中文版..." -ForegroundColor Cyan

# 下载并运行 Windows 安装脚本
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/jqjl/openclaw-cn/main/scripts/OpenClaw一键安装脚本_Windows.ps1" -UseBasicParsing -OutFile "OpenClaw一键安装脚本_Windows.ps1"
powershell -ExecutionPolicy Bypass -File ".\OpenClaw一键安装脚本_Windows.ps1"

Remove-Item "OpenClaw一键安装脚本_Windows.ps1" -Force

Write-Host "✅ OpenClaw 中文版安装完成！" -ForegroundColor Green
Write-Host "👉 访问 http://localhost:8080 开始使用" -ForegroundColor Yellow
