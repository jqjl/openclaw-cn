# OpenClaw 中文版 - 更新日志

本文档记录 OpenClaw 官方版本的最新更新，实时同步。

---

## 🚀 v2026.3.14 最新更新 (2026年3月17日)

### ✨ 新增功能

#### 1. 命令增强 - /btw 边问边答
- 新增 `/btw` 快速提问功能
- 可以在当前会话中快速提问而不改变未来会话上下文
- TUI 中提供可关闭的答案显示
- 外部渠道支持显式 BTW 回复

#### 2. Sandbox 可插拔后端
- 新增可插拔沙箱后端架构
- 推出 OpenShell 后端，支持 `mirror` 和 `remote` 工作区模式
- Sandbox list/recreate/prune 现在支持多后端

#### 3. SSH Sandbox
- 新增核心 SSH 沙箱后端
- 支持 secret-backed 密钥、证书和 known_hosts
- 共享远程 exec/文件系统工具

#### 4. Firecrawl 网络工具
- 新增 Firecrawl 作为 onboard/配置的搜索提供商
- 提供 `firecrawl_search` 和 `firecrawl_scrape` 工具
- 与 web_fetch 回退行为对齐

#### 5. 插件/Bundle 支持
- 新增 Codex、Claude 和 Cursor bundle 发现/安装支持
- Bundle skills 映射到 OpenClaw skills
- 应用 Claude bundle settings.json 默认值

#### 6. 插件市场
- 新增 Claude marketplace 注册解析
- 支持 `plugin@marketplace` 安装
- marketplace 列表和更新支持

#### 7. 飞书集成增强
- ACP 当前会话和子 Agent 会话绑定
- 结构化交互式审批卡
- 快速操作启动器
- 流式推理支持 (`onReasoningStream`)

#### 8. Telegram 增强
- 新增 `topic-edit` 支持论坛话题重命名和图标更新
- 新增可选的静默错误回复设置

---

### 🔐 安全更新

#### 1. 设备配对强化
-  bootstrap 设置码改为一次性使用
- 防止未授权的设备配对请求重放和扩大

#### 2. Webhook 安全
- 提前 auth 校验
- 收紧 pre-auth body limits 和超时

#### 3. 入站策略强化
- 强化 Mattermost 和 Google Chat 的回调/webhook 校验
- Nextcloud Talk 房间匹配优化
- Twitch 空允许列表视为拒绝全部

---

### 🐛 问题修复

| 问题 | 修复内容 |
|------|---------|
| Google Auth / Node 25 | 修复 gaxios 兼容性问题 |
| Gateway 启动性能 | 从 dist/extensions 加载插件，修复冷启动慢 |
| 插件上下文引擎 | 强化 owner-aware 注册 |
| 远程 CDP | 严格遵守 SSRP 策略 |
| Webhook 路由 | 固定到启动时注册表 |
| 子 Agent 追踪 | 保持外部投递路由 |
| 配置启动 | 修复 openclaw configure 启动stall |
| 容器化测试 | 修复 Linux 下 pnpm test:docker:all |
| Slack 交互 | 保留 blocks 到 live DM |
| 飞书媒体 | 对齐所有消息类型的媒体处理 |
| WhatsApp 重连 | 修复 protobuf Long timestamps |
| Telegram 消息 | 保留强制文档发送 |
| Z.AI Onboarding | 检测有效的默认模型 |

---

## 🚀 v2026.3.13 (2026年3月18日)

### ✨ 新增功能

#### 1. Docker 时区支持
- 新增 `OPENCLAW_TZ` 环境变量支持
- 自动同步宿主机时区到容器内

#### 2. Android 全新设计
- 重新设计聊天设置 UI
- 使用 Google Code Scanner 替代 ZXing 扫描

#### 3. iOS 欢迎页
- 新增 onboarding welcome pager
- 提升首次用户体验

#### 4. Slack 交互式回复
- 支持 opt-in interactive reply directives
- 新增 Slack interactive replies 文档

#### 5. 移动端优化
- 移动端导航抽屉优化
- 主题变体优化

---

### 🔐 安全更新

#### 1. Docker 安全
- 防止 gateway token 泄露到 Docker build context

#### 2. Discord 元数据
- 处理 gateway 元数据获取失败

#### 3. Telegram SSRF
- 将 thread media transport policy 集成到 SSRF 检查

---

### 🐛 问题修复

| 问题 | 修复内容 |
|------|---------|
| Web UI 聊天历史 | 防止 reload storm |
| Chat context notice | 修复图标尺寸 |
| Ollama | 隐藏原生 reasoning-only 输出 |
| Session reset | 保留 lastAccountId 和 lastThreadId |
| Windows | 抑制重启期间的控制台窗口 |
| Cron | 防止 isolated cron 嵌套 lane 死锁 |
| 内存压缩 | 使用完整 session token count 进行压缩后检查 |
| Signal | 添加 groups 配置到 Signal channel schema |
| 跨Agent子Agent | 解决目标 agent workspace 问题 |

---

### 🔧 性能优化

#### 1. 构建优化
- 去重 plugin-sdk chunks，修复 ~2x 内存回归

---

## v2026.3.12 (2026年3月13日)

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
