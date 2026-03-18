# 🦞 OpenClaw 中文版

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

> 💡 jsDelivr全球CDN加速，国内用户下载速度快，全球访问稳定
> 
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

## 📰 官方最新更新

### v2026.3.14 (2026年3月17日)

**✨ 新增功能：**
- `/btw` 边问边答功能 - 快速提问不改变会话上下文
- 可插拔 Sandbox 后端架构
- SSH Sandbox 支持
- Firecrawl 网络搜索集成
- Claude/Codex/Cursor Bundle 支持
- Claude Marketplace 插件市场
- 飞书 ACP 会话绑定和流式推理
- Telegram topic-edit 支持

**🔐 安全更新：**
- 设备配对一次性 token
- Webhook 安全强化
- 入站策略强化

**🐛 问题修复：**
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

# 一键安装
curl -sL https://cdn.jsdelivr.net/gh/jqjl/openclaw-cn@main/scripts/install.sh | bash
```

### 配置

```bash
# 启动配置向导
openclaw onboard
```

### 使用

```bash
# 查看状态
openclaw status

# 发送消息
openclaw message --help
```

---

## 📚 文档

- [中文文档](https://github.com/jqjl/openclaw-cn/tree/main/docs/zh-CN)
- [官方文档](https://docs.openclaw.ai)
- [更新日志](docs/changelog.md)

---

## 🤝 贡献

欢迎提交 Issue 和 PR！

---

## 📄 许可证

MIT License - see [LICENSE](LICENSE) for details.

---

## 🔗 官方链接

- [OpenClaw 官网](https://openclaw.ai)
- [官方文档](https://docs.openclaw.ai)
- [GitHub 仓库](https://github.com/openclaw/openclaw)
