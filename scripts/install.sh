#!/bin/bash
# OpenClaw 中文版 - 一键安装脚本

set -e

echo "🦞 正在安装 OpenClaw 中文版..."

# 1. 克隆仓库
if [ -d "openclaw-cn" ]; then
    echo "📁 目录已存在，更新中..."
    cd openclaw-cn
    git pull origin main
else
    echo "📥 克隆源码..."
    git clone https://github.com/jqjl/openclaw-cn.git
    cd openclaw-cn
fi

# 2. 安装依赖
echo "📦 安装依赖..."
npm install

# 3. 复制配置
if [ ! -f "config.json" ]; then
    echo "⚙️ 创建配置文件..."
    cp config.example.json config.json
fi

# 4. 启动
echo "🚀 启动服务..."
echo ""
echo "✅ 安装完成！"
echo "📍 访问 http://localhost:8080"
echo ""
echo "如需后台运行，请使用："
echo "  pm2 start npm --name openclaw -- run start"
echo ""
