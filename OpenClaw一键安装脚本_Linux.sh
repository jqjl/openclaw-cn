#!/bin/bash
# OpenClaw 商业级一键安装脚本 - Linux版
# 支持CentOS 7+/Ubuntu 18+/Debian 10+ 全发行版
set -e

# 变量定义
LOG_PATH="/tmp/openclaw_install_$(date +%Y%m%d_%H%M%S).log"
INSTALL_MODE="interactive"
INSTALL_PATH="/opt/openclaw"
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
    echo -e "${CYAN}  🏢 OpenClaw 商业级一键安装工具 (Linux中国版)${NC}"
    echo -e "${CYAN}=============================================${NC}"
    echo
fi

log_info "开始安装OpenClaw，日志文件：$LOG_PATH"
log_info "安装模式：$INSTALL_MODE，安装路径：$INSTALL_PATH"

# 步骤1：系统检测
log_info "正在检测系统环境..."
if grep -q -E "CentOS|Red Hat|Fedora" /etc/os-release; then
    OS_TYPE="rhel"
    PM="yum"
elif grep -q -E "Ubuntu|Debian" /etc/os-release; then
    OS_TYPE="debian"
    PM="apt"
else
    log_error "不支持当前Linux发行版，请使用CentOS/Ubuntu/Debian"
fi
log_success "系统识别成功：$OS_TYPE 系列"

# 步骤2：网络与源配置
log_info "正在检测网络环境..."
if ! curl -s https://registry.npmmirror.com > /dev/null; then
    log_error "网络连接失败，请检查网络/代理设置"
fi
log_success "网络连接正常，使用国内镜像源加速"

# 步骤3：安装系统依赖
log_info "正在安装系统依赖..."
if [[ $OS_TYPE == "rhel" ]]; then
    yum install -y curl wget xz git >> "$LOG_PATH" 2>&1
else
    apt update >> "$LOG_PATH" 2>&1
    apt install -y curl wget xz-utils git >> "$LOG_PATH" 2>&1
fi
log_success "系统依赖安装完成"

# 步骤4：安装Node.js
log_info "正在检测Node.js环境..."
if command -v node > /dev/null; then
    NODE_VER=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
    if [[ $NODE_VER -ge 20 ]]; then
        log_success "已安装Node.js $(node -v)，符合要求"
    else
        log_warn "Node.js版本过低，正在升级..."
        rm -rf /usr/local/nodejs
    fi
else
    log_warn "未安装Node.js，正在自动安装..."
fi

if ! command -v node > /dev/null || [[ $NODE_VER -lt 20 ]]; then
    NODE_URL="https://npmmirror.com/mirrors/node/v22.14.0/node-v22.14.0-linux-x64.tar.xz"
    wget -q -O /tmp/node.tar.xz "$NODE_URL"
    mkdir -p /usr/local/nodejs
    tar -xf /tmp/node.tar.xz -C /usr/local/nodejs --strip-components 1
    ln -sf /usr/local/nodejs/bin/node /usr/local/bin/node
    ln -sf /usr/local/nodejs/bin/npm /usr/local/bin/npm
    ln -sf /usr/local/nodejs/bin/npx /usr/local/bin/npx
    export PATH="/usr/local/bin:$PATH"
    log_success "Node.js安装成功：$(node -v)"
    rm -f /tmp/node.tar.xz
fi

# 步骤5：配置NPM国内源
log_info "正在配置NPM国内加速源..."
npm config set registry https://registry.npmmirror.com
npm config set ELECTRON_MIRROR https://npmmirror.com/mirrors/electron/
npm config set PUPPETEER_DOWNLOAD_HOST https://npmmirror.com/mirrors/
npm config set prefix "$INSTALL_PATH/npm"
export PATH="$INSTALL_PATH/npm/bin:$PATH"
echo "export PATH=\$PATH:$INSTALL_PATH/npm/bin" >> /etc/profile
source /etc/profile
log_success "NPM配置完成"

# 步骤6：安装OpenClaw
log_info "正在安装OpenClaw最新稳定版..."
npm install -g openclaw --force >> "$LOG_PATH" 2>&1
CLAW_VER=$(openclaw --version)
log_success "OpenClaw安装成功：v$CLAW_VER"

# 步骤7：配置系统服务
log_info "正在配置OpenClaw系统服务..."
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
log_success "系统服务配置完成，开机自动启动"

# 步骤8：安装验证
log_info "正在验证安装结果..."
if openclaw status > /dev/null; then
    log_success "OpenClaw服务运行正常"
else
    log_warn "安装完成但服务验证失败，执行 source /etc/profile 后重试"
fi

# 安装完成
echo
log_success "============================================="
log_success "🎉 OpenClaw 商业版安装全部完成！"
log_info "👉 全局命令：openclaw"
log_info "👉 管理服务：systemctl start/stop/restart openclaw"
log_info "👉 首次使用请执行：openclaw login --enterprise 登录企业账号"
log_info "👉 日志文件已保存到：$LOG_PATH"
log_success "============================================="

if [[ $INSTALL_MODE == "interactive" ]]; then
    echo
    read -n 1 -s -r -p "按任意键退出..."
    echo
fi

exit 0
