#!/bin/bash

# OpenClaw 中文版一键安装脚本
# 支持 Mac / Linux 系统，全中文提示，国内网络优化

set -e

# 变量定义
LOG_PATH="/tmp/openclaw_install_$(date +%Y%m%d_%H%M%S).log"
INSTALL_MODE="interactive"
INSTALL_PATH=""
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

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
        --uninstall) 
            # 一键卸载功能
            log_info "正在卸载OpenClaw..."
            # 停止服务
            if [[ "$OSTYPE" == "darwin"* ]]; then
                launchctl stop com.openclaw.agent 2>/dev/null || true
                launchctl unload /Library/LaunchDaemons/com.openclaw.agent.plist 2>/dev/null || true
                rm -f /Library/LaunchDaemons/com.openclaw.agent.plist
            else
                systemctl stop openclaw 2>/dev/null || true
                systemctl disable openclaw 2>/dev/null || true
                rm -f /etc/systemd/system/openclaw.service
                systemctl daemon-reload
            fi
            # 卸载全局包
            npm uninstall -g openclaw 2>/dev/null || true
            # 删除安装目录
            rm -rf "$INSTALL_PATH" /usr/local/nodejs /opt/openclaw /Applications/OpenClaw 2>/dev/null || true
            # 移除环境变量
            sed -i '/openclaw\|NODE_PATH\|npm/path' ~/.bashrc ~/.zshrc /etc/profile 2>/dev/null || true
            # 删除NPM配置
            npm config delete registry
            npm config delete proxy
            npm config delete https-proxy
            
            log_success "✅ OpenClaw已完全卸载干净，无残留文件"
            exit 0
            ;;
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
    echo -e "${CYAN}  🚀 OpenClaw 公益开源版一键安装工具 (中国版)${NC}"
    echo -e "${CYAN}  💡 开源免费 · 适配国内网络 · 人人都能用上AI${NC}"
    echo -e "${CYAN}=============================================${NC}"
    echo
fi

# 检测系统
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS_TYPE="macos"
    [[ -z "$INSTALL_PATH" ]] && INSTALL_PATH="/Applications/OpenClaw"
    log_info "🍎 检测到 macOS 系统"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS_TYPE="linux"
    [[ -z "$INSTALL_PATH" ]] && INSTALL_PATH="/opt/openclaw"
    
    # 检测发行版
    if grep -q -E "CentOS|Red Hat|Fedora" /etc/os-release; then
        PM="yum"
    elif grep -q -E "Ubuntu|Debian" /etc/os-release; then
        PM="apt"
    else
        log_error "❌ 暂不支持当前Linux发行版，请使用CentOS/Ubuntu/Debian"
    fi
    log_info "🐧 检测到 Linux 系统"
else
    log_error "❌ 暂不支持当前系统，请手动下载对应脚本安装：https://github.com/jqjl/openclaw-cn/tree/main/scripts"
fi

log_info "开始安装OpenClaw，日志文件：$LOG_PATH"
log_info "安装模式：$INSTALL_MODE，安装路径：$INSTALL_PATH"

# ------------------------------
# 通用步骤：系统检测
# ------------------------------
log_info "正在检测系统环境..."
if [[ $OS_TYPE == "macos" ]]; then
    os_version=$(sw_vers -productVersion)
    os_major=$(echo $os_version | cut -d '.' -f 1)
    os_minor=$(echo $os_version | cut -d '.' -f 2)
    if [[ $os_major -lt 10 || ($os_major -eq 10 && $os_minor -lt 15) ]]; then
        log_error "不支持macOS 10.15以下系统，请升级到macOS 10.15+"
    fi
else
    if grep -q -E "CentOS.*7|Red.*7" /etc/os-release; then
        log_success "系统版本兼容：CentOS 7+"
    elif grep -q -E "Ubuntu.*18|Ubuntu.*20|Ubuntu.*22|Ubuntu.*24" /etc/os-release; then
        log_success "系统版本兼容：Ubuntu 18+"
    elif grep -q -E "Debian.*10|Debian.*11|Debian.*12" /etc/os-release; then
        log_success "系统版本兼容：Debian 10+"
    else
        log_warn "系统版本检测通过，建议使用CentOS 7+/Ubuntu 18+/Debian 10+"
    fi
fi
log_success "系统环境检测完成"

# ------------------------------
# 通用步骤：网络检测
# ------------------------------
log_info "正在检测网络环境..."
if ! curl -s https://registry.npmmirror.com > /dev/null; then
    log_error "网络连接失败，请检查网络/代理设置"
fi
log_success "网络连接正常，使用国内镜像源加速"

# ------------------------------
# 系统依赖安装
# ------------------------------
log_info "正在安装系统依赖..."
if [[ $OS_TYPE == "macos" ]]; then
    # Homebrew 安装
    if ! command -v brew > /dev/null; then
        log_warn "未安装Homebrew，正在使用国内镜像自动安装..."
        /bin/bash -c "$(curl -fsSL https://gitee.com/ineo6/homebrew-install/raw/master/install.sh)"
        echo 'export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.ustc.edu.cn/homebrew-bottles' >> ~/.zshrc
        echo 'export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.ustc.edu.cn/homebrew-bottles' >> ~/.bash_profile
        source ~/.zshrc 2>/dev/null || true
        source ~/.bash_profile 2>/dev/null || true
    fi
    log_success "Homebrew环境就绪"
else
    # Linux 系统依赖
    if [[ $PM == "yum" ]]; then
        yum install -y curl wget xz git >> "$LOG_PATH" 2>&1
    else
        apt update >> "$LOG_PATH" 2>&1
        apt install -y curl wget xz-utils git >> "$LOG_PATH" 2>&1
    fi
    log_success "系统依赖安装完成"
fi

# ------------------------------
# Node.js 安装
# ------------------------------
log_info "正在检测Node.js环境..."
if command -v node > /dev/null; then
    NODE_VER=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
    if [[ $NODE_VER -ge 20 ]]; then
        log_success "已安装Node.js $(node -v)，符合要求"
    else
        log_warn "Node.js版本过低，正在升级..."
        if [[ $OS_TYPE == "macos" ]]; then
            brew uninstall node -f 2>/dev/null || true
        else
            rm -rf /usr/local/nodejs
        fi
    fi
else
    log_warn "未安装Node.js，正在自动安装..."
fi

if ! command -v node > /dev/null || [[ $NODE_VER -lt 20 ]]; then
    if [[ $OS_TYPE == "macos" ]]; then
        brew install node@22
        echo 'export PATH="/usr/local/opt/node@22/bin:$PATH"' >> ~/.zshrc
        echo 'export PATH="/usr/local/opt/node@22/bin:$PATH"' >> ~/.bash_profile
        source ~/.zshrc 2>/dev/null || true
        source ~/.bash_profile 2>/dev/null || true
        export PATH="/usr/local/opt/node@22/bin:$PATH"
    else
        NODE_URL="https://npmmirror.com/mirrors/node/v22.14.0/node-v22.14.0-linux-x64.tar.xz"
        wget -q -O /tmp/node.tar.xz "$NODE_URL"
        mkdir -p /usr/local/nodejs
        tar -xf /tmp/node.tar.xz -C /usr/local/nodejs --strip-components 1
        ln -sf /usr/local/nodejs/bin/node /usr/local/bin/node
        ln -sf /usr/local/nodejs/bin/npm /usr/local/bin/npm
        ln -sf /usr/local/nodejs/bin/npx /usr/local/bin/npx
        export PATH="/usr/local/bin:$PATH"
        rm -f /tmp/node.tar.xz
    fi
    log_success "Node.js安装成功：$(node -v)"
fi

# ------------------------------
# NPM 配置
# ------------------------------
log_info "正在配置NPM国内加速源..."
npm config set registry https://registry.npmmirror.com
npm config set ELECTRON_MIRROR https://npmmirror.com/mirrors/electron/
npm config set PUPPETEER_DOWNLOAD_HOST https://npmmirror.com/mirrors/

if [[ $OS_TYPE == "macos" ]]; then
    npm config set prefix "/usr/local"
else
    npm config set prefix "$INSTALL_PATH/npm"
    export PATH="$INSTALL_PATH/npm/bin:$PATH"
    echo "export PATH=\$PATH:$INSTALL_PATH/npm/bin" >> /etc/profile
    source /etc/profile
fi
log_success "NPM配置完成"

# ------------------------------
# OpenClaw 安装
# ------------------------------
log_info "正在安装OpenClaw最新稳定版..."
npm install -g openclaw --force >> "$LOG_PATH" 2>&1
CLAW_VER=$(openclaw --version)
log_success "OpenClaw安装成功：v$CLAW_VER"

# ------------------------------
# 系统服务配置
# ------------------------------
log_info "正在配置开机自启服务..."
if [[ $OS_TYPE == "macos" ]]; then
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
else
    cat > /etc/systemd/system/openclaw.service << EOF
[Unit]
Description=OpenClaw Agent Service
After=network.target

[Service]
Type=simple
User=root
ExecStart=$INSTALL_PATH/npm/bin/openclaw gateway start
Restart=always
RestartSec=10
Environment=PATH=$INSTALL_PATH/npm/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin

[Install]
WantedBy=multi-user.target
EOF
    systemctl daemon-reload
    systemctl enable openclaw >> "$LOG_PATH" 2>&1
fi
log_success "开机自启服务配置完成"

# ------------------------------
# 安装验证
# ------------------------------
log_info "正在验证安装结果..."
if openclaw status > /dev/null; then
    log_success "OpenClaw服务运行正常"
else
    log_warn "安装完成但服务验证失败，请重启终端后执行 openclaw status 检查"
fi

# ------------------------------
# 安装完成
# ------------------------------
echo
log_success "============================================="
log_success "🎉 OpenClaw 中文版安装全部完成！"
log_info "👉 全局命令：openclaw"
if [[ $OS_TYPE == "macos" ]]; then
    log_info "👉 管理服务：sudo launchctl start/stop com.openclaw.agent"
else
    log_info "👉 管理服务：systemctl start/stop/restart openclaw"
fi
log_info "👉 首次使用直接执行 openclaw 即可启动，个人用户无需登录"
log_info "👉 如需完全卸载，执行：curl -sL https://cdn.jsdelivr.net/gh/jqjl/openclaw-cn@main/scripts/install.sh | sudo bash -s -- --uninstall"
log_info "👉 日志文件已保存到：$LOG_PATH"
log_success "============================================="

if [[ $INSTALL_MODE == "interactive" ]]; then
    echo
    read -n 1 -s -r -p "按任意键退出..."
    echo
fi

exit 0
