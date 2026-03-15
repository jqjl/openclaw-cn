#!/bin/bash
# OpenClaw 商业级一键安装脚本 - macOS版
# 支持macOS 10.15+ 全版本，适配国内网络，全中文提示
set -e

# 变量定义
LOG_PATH="/tmp/openclaw_install_$(date +%Y%m%d_%H%M%S).log"
INSTALL_MODE="interactive"
INSTALL_PATH="/Applications/OpenClaw"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# 日志函数
log_info() { echo -e "${CYAN}ℹ️  $*${NC}"; echo "[$(date +'%Y-%m-%d %H:%M:%S')] [INFO] $*" >> "$LOG_PATH"; }
log_success() { echo -e "${GREEN}✅ $*${NC}"; echo "[$(date +'%Y-%m-%d %H:%M:%S')] [SUCCESS] $*" >> "$LOG_PATH"; }
log_warn() { echo -e "${YELLOW}⚠️  $*${NC}"; echo "[$(date +'%Y-%m-%d %H:%M:%S')] [WARN] $*" >> "$LOG_PATH"; }
log_error() { echo -e "${RED}❌ $*${NC}"; echo "[$(date +'%Y-%m-%d %H:%M:%S')] [ERROR] $*" >> "$LOG_PATH"; exit 1; }

# 错误捕获
trap 'log_error "安装出现异常：$?，日志文件：$LOG_PATH\n请将日志发送给技术支持排查问题"' ERR

# 解析参数
while [[ $# -gt 0 ]]; do
    case $1 in
        --silent) INSTALL_MODE="silent"; shift ;;
        --path) INSTALL_PATH="$2"; shift 2 ;;
        *) log_error "未知参数：$1"; shift ;;
    esac
done

# 检测root权限
if [[ $EUID -ne 0 ]]; then
    if [[ $INSTALL_MODE == "interactive" ]]; then
        log_warn "检测到未使用root权限，正在请求sudo提权..."
        exec sudo "$0" "$@"
    else
        log_error "静默安装需要root权限，请使用sudo运行"
    fi
fi

# 欢迎信息
if [[ $INSTALL_MODE == "interactive" ]]; then
    clear
    echo -e "${CYAN}=============================================${NC}"
    echo -e "${CYAN}  🏢 OpenClaw 商业级一键安装工具 (macOS中国版)${NC}"
    echo -e "${CYAN}=============================================${NC}"
    echo
fi

log_info "开始安装OpenClaw，日志文件：$LOG_PATH"
log_info "安装模式：$INSTALL_MODE，安装路径：$INSTALL_PATH"

# 步骤1：系统检测
log_info "正在检测系统环境..."
os_version=$(sw_vers -productVersion)
os_major=$(echo $os_version | cut -d '.' -f 1)
os_minor=$(echo $os_version | cut -d '.' -f 2)
if [[ $os_major -lt 10 || ($os_major -eq 10 && $os_minor -lt 15) ]]; then
    log_error "不支持macOS 10.15以下系统，请升级到macOS 10.15+"
fi
log_success "系统版本兼容：macOS $os_version"

# 步骤2：网络与源配置
log_info "正在检测网络环境..."
if ! curl -s https://registry.npmmirror.com > /dev/null; then
    log_error "网络连接失败，请检查网络/代理设置"
fi
log_success "网络连接正常，使用国内镜像源加速"

# 步骤3：安装Homebrew（如果没有）
log_info "正在检测Homebrew环境..."
if ! command -v brew > /dev/null; then
    log_warn "未安装Homebrew，正在使用国内镜像自动安装..."
    /bin/bash -c "$(curl -fsSL https://gitee.com/ineo6/homebrew-install/raw/master/install.sh)"
    echo 'export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.ustc.edu.cn/homebrew-bottles' >> ~/.zshrc
    echo 'export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.ustc.edu.cn/homebrew-bottles' >> ~/.bash_profile
    source ~/.zshrc 2>/dev/null || true
    source ~/.bash_profile 2>/dev/null || true
fi
log_success "Homebrew环境就绪"

# 步骤4：安装Node.js
log_info "正在检测Node.js环境..."
if command -v node > /dev/null; then
    NODE_VER=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
    if [[ $NODE_VER -ge 20 ]]; then
        log_success "已安装Node.js $(node -v)，符合要求"
    else
        log_warn "Node.js版本过低，正在升级..."
        brew uninstall node -f 2>/dev/null || true
    fi
else
    log_warn "未安装Node.js，正在自动安装..."
fi

if ! command -v node > /dev/null || [[ $NODE_VER -lt 20 ]]; then
    brew install node@22
    echo 'export PATH="/usr/local/opt/node@22/bin:$PATH"' >> ~/.zshrc
    echo 'export PATH="/usr/local/opt/node@22/bin:$PATH"' >> ~/.bash_profile
    source ~/.zshrc 2>/dev/null || true
    source ~/.bash_profile 2>/dev/null || true
    export PATH="/usr/local/opt/node@22/bin:$PATH"
    log_success "Node.js安装成功：$(node -v)"
fi

# 步骤5：配置NPM国内源
log_info "正在配置NPM国内加速源..."
npm config set registry https://registry.npmmirror.com
npm config set ELECTRON_MIRROR https://npmmirror.com/mirrors/electron/
npm config set PUPPETEER_DOWNLOAD_HOST https://npmmirror.com/mirrors/
npm config set prefix "/usr/local"
log_success "NPM配置完成"

# 步骤6：安装OpenClaw
log_info "正在安装OpenClaw最新稳定版..."
npm install -g openclaw --force >> "$LOG_PATH" 2>&1
CLAW_VER=$(openclaw --version)
log_success "OpenClaw安装成功：v$CLAW_VER"

# 步骤7：配置开机自启
log_info "正在配置开机自启服务..."
cat > /Library/LaunchDaemons/com.openclaw.agent.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.openclaw.agent</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/openclaw</string>
        <string>gateway</string>
        <string>start</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/var/log/openclaw.log</string>
    <key>StandardErrorPath</key>
    <string>/var/log/openclaw.log</string>
    <key>UserName</key>
    <string>root</string>
</dict>
</plist>
EOF
launchctl load /Library/LaunchDaemons/com.openclaw.agent.plist
log_success "开机自启服务配置完成"

# 步骤8：安装验证
log_info "正在验证安装结果..."
if openclaw status > /dev/null; then
    log_success "OpenClaw服务运行正常"
else
    log_warn "安装完成但服务验证失败，执行 source ~/.zshrc 后重试"
fi

# 安装完成
echo
log_success "============================================="
log_success "🎉 OpenClaw 商业版安装全部完成！"
log_info "👉 全局命令：openclaw"
log_info "👉 管理服务：sudo launchctl start/stop com.openclaw.agent"
log_info "👉 首次使用请执行：openclaw login --enterprise 登录企业账号"
log_info "👉 日志文件已保存到：$LOG_PATH"
log_success "============================================="

if [[ $INSTALL_MODE == "interactive" ]]; then
    echo
    read -n 1 -s -r -p "按任意键退出..."
    echo
fi

exit 0
