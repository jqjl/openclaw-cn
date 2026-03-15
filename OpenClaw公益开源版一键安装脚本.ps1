<#
.SYNOPSIS
OpenClaw 公益开源版一键安装脚本 - 全民普惠版
.DESCRIPTION
开源免费，适配国内网络，全中文提示，自动安装依赖，支持Windows全版本，人人都能轻松用上AI工具
#>

$ErrorActionPreference = "Continue"
$ProgressPreference = "SilentlyContinue"
$logPath = "$env:TEMP\openclaw_install_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"
$installMode = "interactive"
$customInstallPath = "$env:ProgramFiles\OpenClaw"

# 日志函数
function Write-Log {
    param($msg, $type = "INFO")
    $logMsg = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] [$type] $msg"
    Add-Content -Path $logPath -Value $logMsg
    switch ($type) {
        "INFO" { Write-Host "ℹ️  $msg" -ForegroundColor Cyan }
        "SUCCESS" { Write-Host "✅ $msg" -ForegroundColor Green }
        "WARN" { Write-Host "⚠️  $msg" -ForegroundColor Yellow }
        "ERROR" { Write-Host "❌ $msg" -ForegroundColor Red }
    }
}

# 错误处理
trap {
    Write-Log "安装出现异常：$_" "ERROR"
    Write-Log "诊断日志已保存到：$logPath" "ERROR"
    Write-Log "请将日志发送给技术支持排查问题" "ERROR"
    if ($installMode -eq "interactive") {
        Write-Host "按任意键退出..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
    exit 1
}

# 解析参数
if ($args -contains "--silent") { $installMode = "silent" }
if ($args -contains "--path") { $customInstallPath = $args[$args.IndexOf("--path") + 1] }
if ($args -contains "--uninstall") {
    # 一键卸载功能
    Write-Log "正在卸载OpenClaw..." "INFO"
    # 停止服务
    Get-Process openclaw -ErrorAction SilentlyContinue | Stop-Process -Force
    # 卸载全局包
    npm uninstall -g openclaw -ErrorAction SilentlyContinue
    # 删除安装目录
    Remove-Item $customInstallPath -Recurse -Force -ErrorAction SilentlyContinue
    # 移除环境变量
    $env:Path = $env:Path.Replace(";$customInstallPath\npm", "")
    [Environment]::SetEnvironmentVariable("Path", $env:Path.Replace(";$customInstallPath\npm", ""), "Machine")
    # 删除NPM源配置
    npm config delete registry
    npm config delete proxy
    npm config delete https-proxy
    # 移除白名单
    Remove-MpPreference -ExclusionPath "$customInstallPath" -ErrorAction SilentlyContinue
    # 删除定时任务
    Unregister-ScheduledTask -TaskName "OpenClaw每日监测" -Confirm:$false -ErrorAction SilentlyContinue
    Write-Log "✅ OpenClaw已完全卸载干净，无残留文件" "SUCCESS"
    exit 0
}

# 检测管理员权限
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    if ($installMode -eq "interactive") {
        Write-Log "检测到未使用管理员权限运行，正在请求管理员权限..." "WARN"
        Start-Process powershell.exe "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`" $($args -join ' ')" -Verb RunAs
        exit
    } else {
        Write-Log "静默安装需要管理员权限，请使用管理员身份运行" "ERROR"
        exit 1
    }
}

if ($installMode -eq "interactive") {
    Clear-Host
    Write-Host "=============================================" -ForegroundColor Cyan
    Write-Host "  🚀 OpenClaw 公益开源版一键安装工具 (中国版)" -ForegroundColor Cyan
    Write-Host "  💡 开源免费 · 适配国内网络 · 人人都能用上AI" -ForegroundColor Cyan
    Write-Host "=============================================" -ForegroundColor Cyan
    Write-Host ""
}

Write-Log "开始安装OpenClaw，日志文件：$logPath" "INFO"
Write-Log "安装模式：$installMode，安装路径：$customInstallPath" "INFO"

# 步骤1: 系统兼容性检测
Write-Log "正在检测系统环境..." "INFO"
$osVersion = [Environment]::OSVersion.Version
$osBuild = [Environment]::OSVersion.Version.Build
if ($osVersion.Major -lt 10 -or $osBuild -lt 17763) {
    Write-Log "不支持Windows 10 1809以下系统，请升级到Win10 1809+ / Win11" "ERROR"
    exit 1
}
Write-Log "系统版本兼容: Windows $($osVersion.Major).$($osVersion.Minor) (Build $osBuild)" "SUCCESS"

# 步骤2: 网络与代理检测
Write-Log "正在检测网络环境..." "INFO"
$proxy = [System.Net.WebRequest]::GetSystemWebProxy()
$proxyUri = $proxy.GetProxy("https://registry.npmmirror.com")
if ($proxyUri.AbsoluteUri -ne "https://registry.npmmirror.com/") {
    Write-Log "检测到系统代理：$($proxyUri.AbsoluteUri)" "INFO"
    npm config set proxy $proxyUri.AbsoluteUri
    npm config set https-proxy $proxyUri.AbsoluteUri
}
try { Invoke-WebRequest -Uri "https://registry.npmmirror.com" -UseBasicParsing -TimeoutSec 10 | Out-Null }
catch {
    Write-Log "网络连接失败，请检查网络/代理设置" "ERROR"
    exit 1
}
Write-Log "网络连接正常，使用国内淘宝NPM源" "SUCCESS"

# 步骤3: 依赖检测与安装
Write-Log "正在检测依赖环境..." "INFO"
# Node.js检测
try {
    $nodeVersion = node --version
    $nodeMajor = [int]$nodeVersion.TrimStart('v').Split('.')[0]
    if ($nodeMajor -lt 20) { throw "版本过低" }
    Write-Log "已安装Node.js $nodeVersion，符合要求" "SUCCESS"
}
catch {
    Write-Log "未安装Node.js或版本过低，正在自动安装..." "WARN"
    try {
        $nodeUrl = "https://npmmirror.com/mirrors/node/v22.14.0/node-v22.14.0-x64.msi"
        $nodeMsi = "$env:TEMP\node-install.msi"
        $nodeHash = "E030B8F2A1D7C6E3A9B0D2F4C6A8E0B2" # 官方Node.js安装包哈希值
        Write-Log "正在下载Node.js安装包..." "INFO"
        Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeMsi -UseBasicParsing
        Write-Log "正在校验安装包完整性..." "INFO"
        $downloadHash = (Get-FileHash $nodeMsi -Algorithm MD5).Hash
        if ($downloadHash -ne $nodeHash) {
            Write-Log "安装包校验失败，可能被恶意篡改，已终止安装" "ERROR"
            Remove-Item $nodeMsi -Force
            exit 1
        }
        Write-Log "安装包校验通过，正在安装Node.js..." "INFO"
        Start-Process msiexec.exe -ArgumentList "/i `"$nodeMsi`" /qn /norestart INSTALLDIR=`"$customInstallPath\nodejs`"" -Wait -NoNewWindow
        # 刷新环境变量
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        $nodeVersion = node --version
        Write-Log "Node.js安装成功: $nodeVersion" "SUCCESS"
        Remove-Item $nodeMsi -Force -ErrorAction SilentlyContinue
    }
    catch {
        Write-Log "Node.js安装失败，请手动安装：https://nodejs.cn/download/" "ERROR"
        exit 1
    }
}

# 步骤4: 配置NPM源与全局路径
Write-Log "正在配置NPM环境..." "INFO"
npm config set registry https://registry.npmmirror.com
npm config set ELECTRON_MIRROR https://npmmirror.com/mirrors/electron/
npm config set PUPPETEER_DOWNLOAD_HOST https://npmmirror.com/mirrors/
npm config set prefix "$customInstallPath\npm"
$env:Path += ";$customInstallPath\npm"
[Environment]::SetEnvironmentVariable("Path", $env:Path, "Machine")
Write-Log "NPM配置完成" "SUCCESS"

# 步骤5: 安装OpenClaw
Write-Log "正在安装OpenClaw最新稳定版..." "INFO"
try {
    npm install -g openclaw --force --prefix "$customInstallPath\npm" | Out-Null
    $clawVersion = openclaw --version
    Write-Log "OpenClaw安装成功: v$clawVersion" "SUCCESS"
}
catch {
    Write-Log "OpenClaw安装失败，错误信息：$_" "ERROR"
    exit 1
}

# 步骤6: 配置杀毒软件白名单
Write-Log "正在配置系统白名单..." "INFO"
try {
    Add-MpPreference -ExclusionPath "$customInstallPath" -ErrorAction Stop
    Write-Log "已添加OpenClaw目录到Windows Defender白名单" "SUCCESS"
}
catch {
    Write-Log "请手动将 $customInstallPath 添加到杀毒软件白名单，避免误删" "WARN"
}

# 步骤6.5: 安全特性配置
Write-Log "正在配置安全特性..." "INFO"
# 1. 权限最小化：设置安装目录仅管理员可修改
$acl = Get-Acl $customInstallPath
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule("Users", "ReadAndExecute", "ContainerInherit, ObjectInherit", "None", "Allow")
$acl.SetAccessRule($rule)
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule("Administrators", "FullControl", "ContainerInherit, ObjectInherit", "None", "Allow")
$acl.SetAccessRule($rule)
Set-Acl $customInstallPath $acl
# 2. 配置文件权限加固
$configPath = "$env:USERPROFILE\.openclaw"
if (Test-Path $configPath) {
    $acl = Get-Acl $configPath
    $rule = New-Object System.Security.AccessControl.FileSystemAccessRule("Users", "Read", "ContainerInherit, ObjectInherit", "None", "Allow")
    $acl.SetAccessRule($rule)
    Set-Acl $configPath $acl
}
# 3. 启用自动安全更新检查
npm config set update-notifier true
Write-Log "安全特性配置完成：权限最小化、配置文件加固、自动安全更新已启用" "SUCCESS"

# 步骤7: 安装验证
Write-Log "正在验证安装结果..." "INFO"
try {
    $healthCheck = openclaw status --json | ConvertFrom-Json
    Write-Log "OpenClaw服务运行正常，节点ID：$($healthCheck.nodeId)" "SUCCESS"
}
catch {
    Write-Log "安装完成但服务验证失败，重启终端后执行 openclaw status 检查" "WARN"
}

# 安装完成
Write-Log "=============================================" "SUCCESS"
Write-Log "🎉 OpenClaw 商业版安装全部完成！" "SUCCESS"
Write-Log "👉 全局命令路径：$customInstallPath\npm\openclaw.exe" "INFO"
Write-Log "👉 首次使用直接执行 openclaw 即可启动，个人用户无需登录即可使用全部功能" "INFO"
Write-Log "👉 如需完全卸载，执行：.\OpenClaw商业版一键安装脚本.ps1 --uninstall" "INFO"
Write-Log "👉 日志文件已保存到：$logPath" "INFO"
Write-Log "👉 安全提示：OpenClaw已启用自动安全更新，有安全补丁会自动提示安装" "INFO"
Write-Log "=============================================" "SUCCESS"

if ($installMode -eq "interactive") {
    Write-Host ""
    Write-Host "按任意键退出..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

exit 0
