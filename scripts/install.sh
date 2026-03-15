#!/bin/bash

# OpenClaw 中文版一键安装脚本
# 支持 Mac / Linux 系统

set -e

echo "🦞 正在安装 OpenClaw 中文版..."

# 检测系统
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 检测到 Mac 系统，正在安装..."
    curl -sL https://raw.githubusercontent.com/jqjl/openclaw-cn/main/scripts/OpenClaw一键安装脚本_Mac.sh | bash
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🐧 检测到 Linux 系统，正在安装..."
    curl -sL https://raw.githubusercontent.com/jqjl/openclaw-cn/main/scripts/OpenClaw一键安装脚本_Linux.sh | bash
else
    echo "❌ 暂不支持当前系统，请手动下载对应脚本安装：https://github.com/jqjl/openclaw-cn/tree/main/scripts"
    exit 1
fi

echo "✅ OpenClaw 中文版安装完成！"
echo "👉 访问 http://localhost:8080 开始使用"
