# OpenClaw 中文版 - 更新日志

本文档记录 OpenClaw 官方版本的最新更新，实时同步。

---

## 🚀 v2026.3.12 最新更新 (2026年3月13日)

### ✨ 新增功能

#### 1. Control UI / Dashboard V2 全新升级
- 模块化仪表盘视图：概览、聊天、配置、Agent、会话
- 命令面板（Command Palette）
- 移动端底部导航栏
- 丰富的聊天工具：斜杠命令、搜索、导出、置顶消息

#### 2. OpenAI GPT-5.4 快速模式
- 支持会话级别的快速切换（/fast 命令）
- 支持 TUI、Control UI、ACP 多端切换
- 每个模型可配置默认快速模式
- OpenAI/Codex 请求优化

#### 3. Anthropic Claude 快速模式
- 共享 /fast 开关
- 直接映射到 Anthropic API 的 service_tier
- 实时验证 Anthropic 和 OpenAI 快速模式

#### 4. Ollama / vLLM / SGLang 插件化
- 迁移到 provider-plugin 架构
- 提供商自有 onboarding 和发现流程
- 模块化模型选择和配置

#### 5. Agents/子Agent优化
- 新增 sessions_yield：让编排器可以立即结束当前轮次
- 跳过排队的工具工作
- 携带隐藏的 follow-up payload 进入下一轮

#### 6. Slack Agent 回复支持
- 支持 channelData.slack.blocks
- Agent 可以发送 Block Kit 消息

#### 7. Kubernetes 部署支持
- 新增 K8s 安装路径
- 提供原始 manifest 文件
- Kind 环境设置和部署文档

---

### 🔐 安全更新

#### 1. 设备配对安全
- /pair 和 openclaw qr 改为短期 bootstrap tokens
- 不再在聊天或 QR 配对中嵌入共享网关凭证

#### 2. 插件安全
- 禁用隐式工作区插件自动加载
- 克隆的仓库无法自动执行插件代码

#### 3. 命令执行安全
- 审批提示中的不可见 Unicode 格式字符转义
- 零宽命令文本显示为可见的 \u{...} 转义

#### 4. 权限安全
- /config 和 /debug 需要发送者所有权
- 共享令牌 WebSocket 连接清除未绑定客户端声明的作用域

---

### 🐛 问题修复

| 问题 | 修复内容 |
|------|---------|
| Kimi Coding 工具调用 | 修复 Anthropic 格式工具调用 |
| TUI 聊天日志 | 修复重复的助手回复 |
| Telegram 模型选择器 | 修复内联模型按钮选择持久化 |
| Cron 主动投递 | 防止重启后重复消息 |
| Ollama Kimi Cloud | 修复 Kimi 模型的 thinking 支持 |
| Moonshot CN API | 尊重显式 baseUrl |
| Mattermost 块流 | 修复重复消息投递 |
| macOS Reminders | 添加缺失的使用说明 |
| 插件缓存 | 修复插件发现/加载缓存 |
| OpenRouter 原生 ID | 规范化配置写入和运行时查找 |
| Windows 原生更新 | 修复 npm 更新路径 |

---

## 📝 历史更新

### v2026.3.12 (2026年3月12日)

#### 安全更新
- Gateway/WebSocket：强制浏览器来源验证，修复跨站 WebSocket 劫持漏洞

#### 功能更新
- OpenRouter 模型目录：新增 Hunter Alpha 和 Healer Alpha
- iOS Home canvas：全新欢迎屏幕

---

## 🔄 即将到来

- 更多中文本土化功能
- 飞书深度集成
- 钉钉/企业微信优化

---

## 📋 版本号说明

OpenClaw 使用日期版本号：
- `v2026.3.13` = 2026年3月13日更新
- `v2026.3.12` = 2026年3月12日更新

---

*本页面由 OpenClaw 中文版团队维护，持续同步官方更新。*
