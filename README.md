# OpenClaw 中文版 🦞

> 你的个人助理：数字员工、企业级解决方案。

[![GitHub Stars](https://img.shields.io/github/stars/jqjl/openclaw-cn)](https://github.com/jqjl/openclaw-cn/stargazers)
[![License](https://img.shields.io/github/license/jqjl/openclaw-cn)](LICENSE)

## ⚡ 一键安装（全平台支持）

### 🍎 Mac / 🐧 Linux
打开终端直接运行：
```bash
curl -sL https://cdn.jsdelivr.net/gh/jqjl/openclaw-cn@main/scripts/install.sh | bash
```

### 🪟 Windows
打开PowerShell直接运行：
```powershell
iwr -useb https://cdn.jsdelivr.net/gh/jqjl/openclaw-cn@main/scripts/install.ps1 | iex
```

> 💡 安装完成后自动启动服务，访问 **http://localhost:8080** 即可使用
> 
> 手动下载脚本：[全平台脚本目录](https://github.com/jqjl/openclaw-cn/tree/main/scripts)

---

## 📰 官方最新更新

### v2026.3.24 (2026年3月24日)

**✨ 新增功能：**
- Gateway/OpenAI 兼容性：添加 /v1/models 和 /v1/embeddings，端到端支持更广泛的客户端和 RAG 兼容性
- Agents/tools：/tools 显示当前代理实际可用的工具，新增"可用工具"实时展示
- Microsoft Teams：迁移到官方 Teams SDK，新增 AI 代理最佳实践（流式回复、欢迎卡片、反馈、状态更新、输入指示器）
- Skills/安装元数据：为内置技能添加一键安装配方
- Control UI/Skills：新增状态过滤标签页（All/Ready/Needs Setup/Disabled）
- CLI/containers：添加 --container 和 OPENCLAW_CONTAINER 在 Docker/Podman 容器内运行 openclaw 命令
- Discord/auto threads：可选 autoThreadName: "generated" 自动生成线程名

**🔐 安全更新：**
- Telegram：节流重复的 webhook 身份验证猜测
- Synology Chat：节流 webhook token 猜测
- 安全/沙盒媒体调度：修复 mediaUrl/fileUrl 别名绕过

**🐛 问题修复：**
- Gateway/重启：重启后通过 heartbeat 唤醒中断的代理会话
- Docker/设置：通过 openclaw-gateway 写入配置，避免网络循环问题
- Gateway/channels：隔离通道启动失败，避免一个通道阻止后续通道启动
- 30+ 项问题修复

> 📝 完整更新日志查看：[更新日志](./CHANGELOG.md)

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
| [更新日志](./CHANGELOG.md) | 官方最新更新 |

## 🤖 支持的模型

- **阿里云百炼** - qwen-turbo, qwen-plus, qwen-max, qwen-coder-plus
- **MiniMax** - abab6.5s-chat, abab6.5g-chat, abab6.5s-chat-long
- **智谱AI** - glm-4, glm-4-flash, glm-4-plus, glm-5
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
| WhatsApp | ✅ 官方支持 | |
| Slack | ✅ 官方支持 | |

## 📄 License

MIT License - [查看](./LICENSE)

---

**让 AI 成为每个人的同事 🦞**

**我们的宗旨：用好 AI，人机共创美好未来**