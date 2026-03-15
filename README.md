# OpenClaw 中文版 🦞

> 你的个人助理：数字员工、企业级解决方案。

[![GitHub Stars](https://img.shields.io/github/stars/jqjl/openclaw-cn)](https://github.com/jqjl/openclaw-cn/stargazers)
[![License](https://img.shields.io/github/license/jqjl/openclaw-cn)](LICENSE)

## ⚡ 一键安装（全平台支持）

### 🍎 Mac
打开终端直接运行（**不要加sudo**）：
```bash
curl -sL https://cdn.jsdelivr.net/gh/jqjl/openclaw-cn@main/scripts/install.sh | bash
```

### 🐧 Linux
打开终端直接运行（需要sudo）：
```bash
curl -sL https://cdn.jsdelivr.net/gh/jqjl/openclaw-cn@main/scripts/install.sh | sudo bash
```

### 🪟 Windows
**以管理员身份打开PowerShell**直接运行：
```powershell
iwr -useb https://cdn.jsdelivr.net/gh/jqjl/openclaw-cn@main/scripts/install.ps1 | iex
```

> 💡 CDN加速，国内用户下载速度更快，平均1秒内完成下载

> 💡 安装完成后自动启动服务，访问 **http://localhost:8080** 即可使用
> 
> 手动下载脚本：[全平台脚本目录](https://github.com/jqjl/openclaw-cn/tree/main/scripts)

---

### 🔧 手动安装（开发者选项）
```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```
官方原版安装方式，适合有Node.js环境的用户。

## 📰 官方最新更新（每日同步）

### v2026.3.13 (2026年3月13日)

**✨ 新增功能：**
- Control UI / Dashboard V2 全新升级（模块化仪表盘、命令面板、移动端优化）
- OpenAI GPT-5.4 快速模式（会话级别快速切换）
- Anthropic Claude 快速模式
- Ollama / vLLM / SGLang 插件化
- Agents/子Agent优化（sessions_yield）
- Slack Agent Block Kit 消息支持
- Kubernetes 部署支持

**🔐 安全更新：**
- Gateway/WebSocket 漏洞修复
- 设备配对安全（短期 bootstrap tokens）
- 20+ 项安全修复

**🐛 问题修复：**
- Kimi Coding 工具调用修复
- TUI 聊天日志重复问题
- Mattermost 块流修复
- 30+ 项问题修复

> 📝 完整更新日志查看：[更新日志](./docs/changelog.md)

---

## 🌍 中文特色功能

本版本基于 [OpenClaw](https://github.com/openclaw/openclaw) 官方版，为中国用户定制开发：

- ✅ **飞书集成** - 飞书消息、机器人、卡片消息
- ✅ **钉钉集成** - 钉钉消息推送、机器人
- ✅ **企业微信集成** - 企业微信消息通讯
- ✅ **中文优化** - 全中文界面、中文文档
- ✅ **国内模型支持** - 阿里云、百炼、MiniMax、智谱AI

## 🚀 快速开始

### 安装

```bash
# 克隆仓库
git clone https://github.com/jqjl/openclaw-cn.git
cd openclaw-cn

# 安装依赖
npm install

# 启动
npm run dev
```

### 配置飞书

详见 [飞书集成文档](./docs/feishu.md)

### 配置钉钉

详见 [钉钉集成文档](./docs/dingtalk.md)

## 📖 文档

| 文档 | 说明 |
|------|------|
| [安装指南](./docs/install.md) | 快速安装教程 |
| [模型配置](./docs/models.md) | 国内模型 API 配置 |
| [更新日志](./docs/changelog.md) | 官方最新更新（每日更新） |

## 🤖 支持的模型

- **阿里云百炼** - qwen-turbo, qwen-plus, qwen-max
- **MiniMax** - abab6.5s-chat, abab6.5g-chat
- **智谱AI** - glm-4, glm-4-flash, glm-4-plus
- **OpenAI** - GPT-4, GPT-3.5
- **Anthropic** - Claude 3.5
- **Ollama** - 本地模型

## 📱 支持的通讯平台

| 平台 | 状态 | 说明 |
|------|------|------|
| 飞书 | ✅ 已支持 | 消息、机器人、卡片 |
| 钉钉 | ✅ 已支持 | 消息推送 |
| 企业微信 | ✅ 已支持 | 应用消息 |
| Telegram | ✅ 官方支持 | |
| Discord | ✅ 官方支持 | |
| Signal | ✅ 官方支持 | |

## 📄 License

MIT License - [查看](./LICENSE)

---

**让 AI 成为每个人的同事 🦞**

**我们的宗旨：用好 AI，人机共创美好未来**
