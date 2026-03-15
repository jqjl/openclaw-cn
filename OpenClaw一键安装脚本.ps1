<#
.SYNOPSIS
OpenClaw 一键安装脚本 - 适配中国国情版
.DESCRIPTION
全自动化安装OpenClaw，自动处理依赖、换国内源、错误友好提示，支持Win10/Win11
#>

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# 输出样式
function Write-Info { param($msg) Write-Host "ℹ️  $msg" -ForegroundColor Cyan }
function Write-Success { param($msg) Write-Host "✅ $msg" -ForegroundColor Green }
function Write-Warn { param($msg) Write-Host "⚠️  $msg" -ForegroundColor Yellow }
function Write-Error { param($msg) Write-Host "❌ $msg" -ForegroundColor Red; exit 1 }

# 检测管理员权限
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Warn "检测到未使用管理员权限运行，正在请求管理员权限..."
    Start-Process powershell.exe "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    exit
}

Clear-Host
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  🚀 OpenClaw 一键安装工具 (中国版)" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# 步骤1: 检测系统环境
Write-Info "正在检测系统环境..."
$osVersion = [Environment]::OSVersion.Version
if ($osVersion.Major -lt 10) { Write-Error "不支持Windows 10以下系统，请升级到Win10/Win11" }
Write-Success "系统版本兼容: Windows $($osVersion.Major).$($osVersion.Minor)"

# 步骤2: 检测网络并配置国内源
Write-Info "正在检测网络连接..."
try { Invoke-WebRequest -Uri "https://registry.npmmirror.com" -UseBasicParsing -TimeoutSec 5 | Out-Null }
catch { Write-Error "网络连接失败，请检查你的网络是否正常" }
Write-Success "网络连接正常，将使用国内淘宝NPM源加速安装"

# 步骤3: 检测并安装Node.js
Write-Info "正在检测Node.js环境..."
try {
    $nodeVersion = node --version
    $nodeMajor = [int]$nodeVersion.TrimStart('v').Split('.')[0]
    if ($nodeMajor -lt 20) { throw "Node.js版本过低" }
    Write-Success "已安装Node.js $nodeVersion，版本符合要求"
}
catch {
    Write-Warn "未安装Node.js或版本过低，正在自动安装最新LTS版本..."
    try {
        $nodeUrl = "https://npmmirror.com/mirrors/node/v22.14.0/node-v22.14.0-x64.msi"
        $nodeMsi = "$env:TEMP\node-install.msi"
        Write-Info "正在下载Node.js安装包（国内镜像加速）..."
        Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeMsi -UseBasicParsing
        Write-Info "正在安装Node.js，全程无需操作，请稍候..."
        Start-Process msiexec.exe -ArgumentList "/i `"$nodeMsi`" /qn /norestart" -Wait -NoNewWindow
        # 刷新环境变量
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        $nodeVersion = node --version
        Write-Success "Node.js安装成功: $nodeVersion"
        Remove-Item $nodeMsi -Force -ErrorAction SilentlyContinue
    }
    catch { Write-Error "Node.js安装失败，请手动下载安装：https://nodejs.cn/download/" }
}

# 步骤4: 配置NPM国内源
Write-Info "正在配置NPM国内加速源..."
npm config set registry https://registry.npmmirror.com
npm config set ELECTRON_MIRROR https://npmmirror.com/mirrors/electron/
npm config set PUPPETEER_DOWNLOAD_HOST https://npmmirror.com/mirrors/
Write-Success "NPM源配置完成"

# 步骤5: 安装OpenClaw
Write-Info "正在安装OpenClaw最新版本..."
try {
    npm install -g openclaw --force | Out-Null
    $clawVersion = openclaw --version
    Write-Success "OpenClaw安装成功: v$clawVersion"
}
catch { Write-Error "OpenClaw安装失败，错误信息：$_`n请重试或手动执行：npm install -g openclaw --force" }

# 步骤6: 配置环境变量
Write-Info "正在配置环境变量..."
$npmPath = npm prefix -g
if (-not $env:Path.Contains($npmPath)) {
    [Environment]::SetEnvironmentVariable("Path", $env:Path + ";$npmPath", "Machine")
    $env:Path += ";$npmPath"
}
Write-Success "环境变量配置完成"

# 步骤7: 验证安装结果
Write-Info "正在验证安装是否正常..."
try {
    openclaw status | Out-Null
    Write-Success "OpenClaw运行正常！"
}
catch { Write-Warn "安装完成但验证失败，请重启终端后执行 openclaw status 检查" }

Write-Host ""
Write-Host "🎉 安装全部完成！" -ForegroundColor Green
Write-Host "👉 现在你可以在任何地方打开终端使用 openclaw 命令了" -ForegroundColor Cyan
Write-Host "👉 首次使用建议执行：openclaw login 登录你的账号" -ForegroundColor Cyan
Write-Host ""
Write-Host "按任意键退出..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
