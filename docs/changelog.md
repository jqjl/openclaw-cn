# OpenClaw 中文版 - 更新日志

本文档记录 OpenClaw 官方版本的最新更新，实时同步。

---

## 🚀 v2026.4.5 (2026年4月7日)

> 最新稳定版，2718 个新提交同步（相比 v2026.4.2）。

### ⚠️ 重大变更

#### 1. Config：移除旧版配置别名
- 移除 `talk.voiceId` / `talk.apiKey`、`agents.*.sandbox.perSession`、`browser.ssrfPolicy.allowPrivateNetwork`、`hooks.internal.handlers`、channel/group/room `allow` 等旧版配置别名
- 迁移至规范化的公开配置路径
- 支持 `openclaw doctor --fix` 自动迁移

### ✨ 新增功能

#### 1. 视频生成工具
- 新增内置 `video_generate` 工具
- 支持 xAI (grok-imagine-video)、Alibaba Model Studio Wan、Runway 视频提供商
- Agent 可直接生成视频并嵌入回复

#### 2. 音乐生成工具
- 新增内置 `music_generate` 工具
- 支持 Google Lyria、MiniMax、ComfyUI 工作流
- 支持异步任务追踪和完成通知

#### 3. ComfyUI 媒体插件
- 新增捆绑 ComfyUI 工作流媒体插件
- 支持本地 ComfyUI 和 Comfy Cloud
- 集成 image_generate、video_generate、music_generate

#### 4. 新增提供商
- **Qwen**、**Fireworks AI**、**StepFun** 捆绑支持
- **Amazon Bedrock Mantle** 支持
- **MiniMax TTS**、**Ollama Web Search**、**MiniMax Search** 集成
- **Arcee AI** 提供商插件

#### 5. Memory/Dreaming 实验性功能
- 新增加权短期记忆提升机制
- 新增 `/dreaming` 命令和 Dreams UI
- 多语言概念标签
- 三个协作阶段：light、deep、REM
- 新增 `dreams.md` 记录文件

#### 6. Control UI 多语言支持
- 新增简体中文、繁体中文、葡萄牙语、德语、西班牙语、日语、韩语、法语、土耳其语、印尼语、波兰语、乌克兰语界面

#### 7. Control UI Skills 面板增强
- 新增 ClawHub 搜索、详情和安装流程
- 可直接在 Skills 面板中管理插件

#### 8. ACPX 运行时内置
- ACP 运行时直接嵌入 acpx 插件
- 移除外部 ACP CLI 中转
- 新增通用 `reply_dispatch` hook

#### 9. Claude CLI MCP 桥接
- 通过 loopback MCP 桥接将 OpenClaw 工具暴露给 Claude CLI 后台运行
- 切换到 stdin + stream-json partial-message 流式传输

#### 10. 提示词缓存优化
- 改进 MCP 工具顺序确定性
- 改进 compaction、embedded image history、normalized system-prompt fingerprints
- 改进 `openclaw status --verbose` 缓存诊断

#### 11. Sessions 持久化检查点
- 新增持久化 compaction 检查点
- Sessions UI 支持分支/恢复操作
- 可检查和恢复压缩前的会话状态

#### 12. Matrix 执行审批
- 新增 Matrix 原生执行审批提示
- 支持账户作用域审批人
- 支持频道或 DM 投递

#### 13. iOS/Watch 执行审批
- 新增通用 APNs 审批通知
- 支持 Apple Watch 审批和恢复

### 🔐 安全修复

| 修复项 | 说明 |
|--------|------|
| 插件工具白名单保护 | 保留限制性插件专用工具白名单 |
| `/allowlist` 权限控制 | 添加/移除需要所有者访问权限 |
| `before_tool_call` hook 安全 | hook 崩溃时 fail closed |
| 浏览器 SSRF 重定向绕过 | 提前阻止 |
| 非交互式 auth-choice 范围 | 限制为捆绑和可信插件 |

### 🐛 问题修复

| 问题 | 修复内容 |
|------|---------|
| OpenAI Codex OAuth | 修复 refresh_token_reused 导致卡住的问题 |
| Agents/history 和 replies | 缓冲无阶段 OpenAI WS 文本直到真实 assistant 阶段到达 |
| 插件加载稳定性 | 修复 Windows `file://` 和原生 Jiti 插件加载路径 |
| 自动回复媒体 | 恢复 generated-media `MEDIA:` 路径投递 |
| 运行时事件信任 | 标记背景 notifyOnExit、ACP parent-stream relay 为不受信任 |
| Anthropic thinking blocks | 为 Claude Opus 4.5+、Sonnet 4.5+ 保留 thinking blocks |
| Control UI 音频 | 在 webchat 中显示 `/tts` 音频回复 |
| TUI 稳定性 | 修复 Kitty 键盘状态在退出时恢复 |
| Sessions 模型选择 | 解析会话选择的模型与运行时回退解析分开 |
| Apple Watch 审批 | 保持 iPhone 锁定或后台时仍可审批恢复 |
| Agents/context overflow | 组合超大和聚合工具结果恢复 |
| Browser 远程 CDP | 远程浏览器重启后重试 DevTools websocket |
| Gateway 容器 | 在 Docker/Podman 环境中自动绑定 `0.0.0.0` |
| Discord 引用消息 | 恢复引用的消息文本和附件 |
| Slack 线程 | 修复遗留线程粘性 |
| Memory 向量召回 | 当 sqlite-vec 不可用时显示警告 |
| MS Teams 文件上传 | 验证文件 consent upload URL 防止 SSRF |
| Tools/web_fetch | 修复 undici 8.0 启用 HTTP/2 导致的 TypeError |

### 🙏 致谢

感谢所有贡献者！完整列表见 [GitHub v2026.4.5](https://github.com/openclaw/openclaw/compare/v2026.4.2...v2026.4.5)。

---

## 🚀 v2026.4.2 (2026年4月2日)

> 最新稳定版，178 个新提交同步（相比 v2026.4.1）。

### ✨ 新增功能

#### 1. TaskFlow：托管子任务执行
- 新增托管子任务 spawn 机制，支持 sticky cancel intent
- 外部编排器可立即停止调度，让父 TaskFlow 平滑过渡到 `cancelled` 状态
- 配合 TaskFlow 检查/恢复原语，持久化后台编排

#### 2. TaskFlow：恢复托管基板
- 恢复核心 TaskFlow 基板，支持 managed-vs-mirrored 同步模式
- 持久化 flow 状态和修订版本追踪
- `openclaw flows` 检查/恢复命令

#### 3. Exec approvals：策略报告与操作统一
- 统一有效策略报告与操作，提升 `openclaw doctor exec-approvals` 诊断能力
- 修复策略源归属问题

#### 4. TinyFish 浏览器自动化插件
- 新增 TinyFish 作为捆绑浏览器自动化插件
- 提供更强大的浏览器操控能力

#### 5. Slack：Scoped prompts 和 mrkdwn hints
- 新增 Slack 专用 scoped prompts
- mrkdwn 格式提示，减少通用 Markdown 回退

#### 6. Diffs：可配置 viewer base URL
- 新增插件级 `viewerBaseUrl` 配置
- viewer 链接可使用稳定的代理/公共源
- 无需每次工具调用传递 `baseUrl`

#### 7. 插件 Hook：`before_agent_reply`
- 新增 `before_agent_reply` hook，支持合成回复短路 LLM
- 可在内联动作后注入人工回复

#### 8. Feishu：Drive 评论事件流
- 新增专用 Drive comment-event flow
- 评论线程上下文解析，线程内回复
- `feishu_drive` 评论操作

### 🔐 安全修复

| 修复项 | 说明 |
|--------|------|
| 内联图片内存耗尽 | 防止 inline image decoding 内存耗尽攻击 |
| ACP 会话初始化异常 | 修复本地捕获的 ACP 会话初始化异常导致的问题 |
| Discord ID 类型 | 强制数字 Discord ID 转为字符串，避免拒绝有效配置 |

### 🐛 问题修复

| 问题 | 修复内容 |
|------|---------|
| Anthropic thinking 标签泄露 | 剥离 `antml:thinking` 块，防止内部独白泄露到用户可见回复 |
| ACP reconnect prompts | 保持 ACP prompts 在 websocket 瞬断后存活 |
| WhatsApp MIME | 添加 HTML/XML/CSS 到 MIME map，未知类型优雅降级 |
| Matrix mentions | 发出符合规范的 `m.mentions` 元数据，修复 Element 等客户端通知 |
| Kimi Coding 工具调用 | 规范化 Anthropic 工具载荷为 OpenAI 兼容格式 |
| Feishu 评论线程 |硬化文档评论线程投递，延迟回复查找重试更可靠 |
| MS Teams 流式超限 | 剥离已流式传输的文本，防止 4000+ 字符回复重复内容 |
| Slack mrkdwn 格式 | 添加内置 Slack mrkdwn 指导，停止回退到通用 Markdown |
| Gateway exec loopback | 恢复空配对设备 token map 的 legacy-role 回退 |
| Podman launch 噪声 | 移除 `run-openclaw-podman.sh` 中的冗余容器输出 |
| 图片工具路径 | 相对路径解析到 agent `workspaceDir` 而非 `process.cwd()` |

### 🔧 性能优化

- Matrix 客户端运行时依赖懒加载
- Telegram 消息上下文运行时懒加载
- Provider 请求配置重构，添加内部请求配置 seam
- Provider 流请求头集中化管理

### 🙏 致谢

感谢所有贡献者！完整列表见 [GitHub v2026.4.2](https://github.com/openclaw/openclaw/compare/v2026.4.1...v2026.4.2)。

---

## 🚀 v2026.4.1 最新更新 (2026年4月1日)

> 重要 bugfix 版本。

> 最新稳定版，872 个提交同步。

### ⚠️ 重大变更

#### 1. Qwen 提供商：移除旧版 OAuth 集成
- 移除 portal.qwen.ai 的 qwen-portal-auth OAuth 集成
- 迁移至 Model Studio，使用 `openclaw onboard --auth-choice modelstudio-api-key`

#### 2. Config/Doctor：移除两个月以上的自动迁移
- 旧版配置键不再自动迁移，将触发验证错误
- 需使用 `openclaw doctor` 手动处理

---

### ✨ 新增功能

#### 1. xAI / Grok 全面升级
- xAI 提供商迁移至 Responses API
- 新增 first-class `x_search` 支持
- 自动启用 xAI 插件，Grok 搜索配置开箱即用
- onboard 和 `openclaw configure --section web` 支持 x_search 配置向导

#### 2. MiniMax 图像生成
- 新增 MiniMax image-01 模型图像生成
- 支持文生图和图生图编辑
- 支持比例控制

#### 3. 插件 Hooks：异步审批
- `before_tool_call` hooks 支持异步 `requireApproval`
- 插件可暂停工具执行，等待用户审批
- 支持 Telegram 按钮、Discord interactions、/approve 命令

#### 4. ACP/channels：当前对话绑定
- Discord、BlueBubbles、iMessage 支持当前对话 ACP 绑定
- `/acp spawn codex --bind here` 可直接绑定当前聊天

#### 5. OpenAI apply_patch 默认启用
- OpenAI 和 OpenAI Codex 模型默认启用 apply_patch
- Sandbox 策略访问与写权限对齐

#### 6. 插件 CLI backends 统一
- Claude CLI、Codex CLI、Gemini CLI 统一到插件层
- 新增 Gemini CLI 后端支持
- `--claude-cli-logs` 替换为通用 `--cli-backend-logs`

#### 7. Podman 简化
- 简化 rootless 用户容器配置
- launch helper 安装至 `~/.local/bin`
- 文档更新为 host-CLI `openclaw --container ...` 工作流

#### 8. Slack 上传文件
- 新增 Slack `upload-file` action
- 支持 filename/title/comment 覆盖

#### 9. 统一文件发送
- Teams、Google Chat 文件发送统一到 `upload-file`
- BlueBubbles 文件发送通过 upload-file 暴露

#### 10. Matrix TTS 升级
- 自动 TTS 回复发送为原生 Matrix 语音气泡

#### 11. Config schema CLI
- `openclaw config schema` 打印 openclaw.json 的 JSON schema

---

### 🔐 安全修复

- 扩展 web search key 审计，支持 Gemini、Grok/xAI、Kimi、Moonshot、OpenRouter
- 修复 Control UI 敏感配置默认隐藏

---

### 🐛 问题修复

| 问题 | 修复内容 |
|------|---------|
| WhatsApp 自聊循环 | 修复无限 echo loop |
| Telegram HTML 分割 | 修复单词边界分割，避免 mid-word 截断 |
| Telegram 空文本崩溃 | 跳过空白文本回复防止 GrammyError 400 |
| Mistral API | 修复 422 错误 |
| Control UI | 敏感配置默认隐藏，修复 [#55322](https://github.com/openclaw/openclaw/issues/55322) |
| zsh 补全 | 延迟 compdef 注册直到 compinit 可用 |
| BlueBubbles | 修复 debounce null text 问题 |
| Discord 重连 | 修复 resume state 中毒导致的循环 |
| iMessage | 停止 [[reply_to:...]] 标签泄露 |
| CLI/plugins | 修复 bundled channels 自动加载 |
| CLI/message send | 修复 delivery 写入 session transcript |

---

### 🔧 性能优化

- provider policy 移至 plugins
- provider transport hooks 泛化
- 延长 CI 长测试超时

---

## 🚀 v2026.3.28-beta.1 (2026年3月28日)

> 预发布版，核心功能同 v2026.3.29。

### 主要新功能
- xAI Responses API + x_search
- MiniMax image-01 图像生成
- 插件 hooks async requireApproval
- ACP 当前对话绑定

---

## 🚀 v2026.3.14-1 最新更新 (2026年3月18日)

> ⚠️ 此版本为恢复版本，用于修复损坏的 v2026.3.13 标签/发布路径。npm 版本仍为 2026.3.13。

### ✨ 新增功能

#### 1. Android 聊天设置全新 UI
- 重新设计聊天设置页面
- 分组设备媒体设置
- 刷新 Connect 和 Voice tab
- 移动端布局优化

#### 2. iOS 欢迎页
- 新增首次运行欢迎页
- 停止自动打开 QR 扫描器
- 显示 /pair qr 连接说明

#### 3. Docker 时区支持
- 新增 `OPENCLAW_TZ` 环境变量支持
- 自动同步宿主机时区到容器

#### 4. macOS PortGuard 优化
- 防止在远程模式下误杀 Docker Desktop

#### 5. 插件系统增强
- 插件/Bundle 支持 (Codex, Claude, Cursor)
- 新增 Claude marketplace 注册解析
- 支持 `plugin@marketplace` 安装

---

### 🔐 安全更新

#### 1. Docker 安全
- 防止 gateway token 泄露到 Docker build context

#### 2. Discord 元数据处理
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
| Telegram | 重试 IPv4 回退下载入站媒体 |
| 飞书 | 保留非 ASCII 文件名上传 |
| macOS | 对齐最小 Node.js 版本 (22.16.0) |
| 浏览器 | 强化现有 session driver 验证 |

---

### 🔧 性能优化

#### 1. 构建优化
- 去重 plugin-sdk chunks，修复 ~2x 内存回归

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

---

## 🚀 v2026.4.15-beta.1 (2026年4月15日)

> 预发布版本，包含多个重要新功能和大量安全修复。

### ✨ 新增功能

#### 1. Model Auth 状态卡片
- Control UI Overview 新增 Model Auth 状态卡片（#66211）
- 显示 OAuth token 健康状态和提供商限速压力
- 关注即将过期或已过期的 OAuth token

#### 2. LanceDB 云存储支持
- memory-lancedb 新增云存储支持（#63502）
- 持久化内存索引可运行在远程对象存储上

#### 3. GitHub Copilot 记忆搜索
- 新增 GitHub Copilot embedding provider 用于记忆搜索（#61718）
- 支持插件复用 transport 和 token 刷新

#### 4. 本地模型轻量模式
- 新增实验性 `agents.defaults.experimental.localModelLean: true`（#66495）
- 移除 browser、cron、message 等重量级默认工具

### 🔐 安全修复

- **exec 审批提示**：Secrets 在 exec 审批提示中脱敏（#61077, #64790）
- **QMD memory_get**：拒绝任意 workspace markdown 路径读取（#66026）
- **Gateway/MCP loopback**：切换到 constant-time `safeEqualSecret` 比较（#66665）
- **浏览器 SSRF**：在 snapshot、screenshot、tab 路由强制执行 SSRF 策略（#66040）
- **Matrix 安全**：规范化沙箱 profile avatar 参数（#64701）
- **Webchat 安全**：拒绝媒体嵌入路径中的远程主机 `file://` URL（#67293）
- **Gateway 安全**：在 webchat 音频嵌入路径强制 `localRoots` 约束（#67298）

### 🐛 问题修复

- **CLI/configure**：写入后重新读取持久化 config hash，解决 stale-hash 竞争（#66528）
- **CLI/update**：npm 升级后清理过时 dist chunks（#66959）
- **Agent/compaction**：为小上下文本地模型（如 Ollama 16K）设置 compaction reserve-token 地板（#65671）
- **Ollama/onboarding**：支持直接 `OLLAMA_API_KEY` 云端设置，无需本地守护进程（#67005）
- **Telegram/documents**：清理二进制回复上下文，防止 .epub 和 .mobi 上传泄漏原始二进制到 prompt（#66877）
- **Docker/build**：在 `node_modules` 下用 `find` 验证 `@matrix-org/matrix-sdk-crypto-nodejs` 原生绑定（#67143）
- **音频/STT**：恢复自托管 STT 的 `allowPrivateNetwork` 设置（#66692）

---

## 🚀 v2026.4.14 (2026年4月14日)

> 上游最新稳定版，大量安全修复和问题修复。

### ✨ 新增功能

#### 1. OpenAI Codex/gpt-5.4-pro 支持
- 新增 `gpt-5.4-pro` 前向兼容支持（#66453）
- 包含 Codex 定价和限流配置

#### 2. Telegram 论坛话题名称
- 在 agent context、prompt metadata、plugin hook metadata 中显示人类可读话题名称（#65973）
- 从 Telegram 论坛服务消息中学习名称

### 🔐 安全修复

- **Agents/gateway-tool**：拒绝模型端 gateway tool 的 `config.patch/apply` 调用（#62006）
- **Slack/interactions**：对 block-action 和 modal interactive 事件应用全局 `allowFrom` 白名单（#66028）
- **媒体附件**：本地附件路径无法解析时 fail closed（#66022）
- **Heartbeat/security**：强制对不可信 `hook:wake` 系统事件进行 owner downgrade（#66031）
- **Config/redact**：在 `redactConfigSnapshot` 中清除 `sourceConfig` 和 `runtimeConfig`（#66030）
- **Teams/security**：对 SSO signin 调用执行发件人白名单检查（#66033）

### 🐛 问题修复

- **Ollama**：正确转发配置的 embedded-run 超时到全局 undici stream 超时
- **Models/Codex**：在代码提供商标目输出中包含 `apiKey`（#66180）
- **UI/chat**：用 markdown-it 替换 marked.js，防止 ReDoS 攻击（#46707）
- **WhatsApp/Baileys**：npm/postinstall 时等待加密媒体文件flush完毕再读回（#65896）
- **Telegram/forum**：持久化话题名称到 session sidecar store，重启后可继续使用（#66107）
- **Gateway/sessions**：阻止 heartbeat/cron/exec 事件覆盖共享会话路由元数据（#66073）
- **Cron/scheduler**：修复无有效未来 slot 时的重试逻辑（#66019）
- **Auto-reply/send policy**：`sendPolicy: "deny"` 不再阻塞入站消息处理（#65461）
- **Feishu/allowlist**：规范化 allowlist 条目，防止 user/chat 命名空间交叉（#66021）
- **Media/store**：遵守配置的 agent 媒体限制（#66229）
- **Hook/session-memory**：传递解析后的 agent workspace 到 `/new` 和 `/reset` hook（#64735）

---

## 🚀 v2026.4.12 (2026年4月12日)

> 上游版本，Active Memory 正式发布，QA 能力大幅增强。

### ✨ 新增功能

#### 1. Active Memory 插件正式版
- 新增可选 Active Memory 插件（#63286）
- 在主回复前运行专用记忆子 Agent
- 支持 message/recent/full context 模式
- 支持 `/verbose` 实时查看
- 文档：https://docs.openclaw.ai/concepts/active-memory

#### 2. macOS Talk Mode MLX 语音
- 新增实验性本地 MLX 语音合成器（#63539）
- 支持本地 utterance 播放和系统语音 fallback

#### 3. CLI exec-policy 命令
- 新增 `openclaw exec-policy` 命令（#64050）
- 支持 `show`、`preset`、`set` 子命令

#### 4. Gateway commands.list RPC
- 新增 `commands.list` RPC（#62656）
- 远程 gateway 客户端可发现运行时命令

#### 5. LM Studio Provider
- 新增捆绑 LM Studio provider（#53248）
- 支持本地/自托管 OpenAI 兼容模型

### 🔐 安全修复

- 移除 busybox/toybox 解释器类似安全 bin（#65713）
- 防止空审批人列表授予显式审批授权（#65714）
- 扩大 shell-wrapper 检测并阻止 env-argv 赋值注入（#65717）
- `.env.example` 中的示例凭证清空，启动时拒绝占位符 token（#64586）

### 🐛 问题修复

- **Gateway/startup**：延迟调度服务直到 sidecar 完成（#65365）
- **Control UI/chat**：加载 live gateway slash-command 目录到 composer（#65620）
- **CLI/update**：修复自更新后重新加载跟踪插件的入口点（#65471）
- **Memory/active-memory**：改进 lexical fallback 排名（#65049）
- **WhatsApp/outbound**：修复 `mediaUrl` 为空时回退到 `mediaUrls` 第一个条目（#64394）
- **Discord/doctor**：防止 `doctor --fix` 重写 legacy streaming config（#65035）
- **Agent/queueing**：在修复前将孤立 active-turn 用户文本带入下一 prompt（#65388）
- **Gateway/keepalive**：停止将 WebSocket tick 广播标记为可丢弃（#65256）
- **Telegram**：路由审批按钮回调查询到单独顺序通道（#64979）
- **Memory/wiki**：保留 Unicode 字母、数字和组合标记在 wiki slugs 中（#64742）
- **Dreaming**：正确使用时区，在 diary timestamps 中包含时区缩写（#65034）
- **WhatsApp**：集中化每账户连接所有权（#65290）
- **iMessage**：重试瞬态 `watch.subscribe` 启动失败（#65393）

---

## 🚀 v2026.4.11 (2026年4月11日)

> 上游版本，Dreaming UI 增强，视频生成和 Feishu 改进。

### ✨ 新增功能

#### 1. Dreaming/Memory Wiki 导入
- 新增 ChatGPT 导入 ingestion（#64505）
- 新增 Imported Insights 和 Memory Palace diary 子标签页

#### 2. Control UI/WebChat 富媒体
- 渲染 assistant media/reply/voice 指令为结构化聊天气泡（#64104）
- 新增 `[embed ...]` 富输出标签

#### 3. 视频生成增强
- 新增 URL-only 生成资源传递（#61987）
- 支持自适应宽高比和更高图像输入上限

#### 4. Feishu 文档评论
- 改进文档评论会话的上下文解析（#63785）
- 支持评论反应和打字反馈

#### 5. Microsoft Teams 反应
- 新增反应支持、Graph 分页（#51646）

### 🐛 问题修复

- **OpenAI/Codex OAuth**：停止重写 authorize URL scopes（#64713）
- **音频转录**：仅为 OpenAI 兼容 multipart 请求禁用 pinned DNS（#64766）
- **macOS/Talk Mode**：授予麦克风权限后继续启动（#62459）
- **Google/Veo**：停止发送不支持的 `numberOfVideos` 请求字段（#64723）
- **WhatsApp**：路由 `message react` 通过 gateway-owned action path（#53918）
- **Telegram/sessions**：修复话题 scoped session 初始化（#64869）
- **Agent/failover**：将回退分类范围限定为当前 attempt（#62907）

---

## 🚀 v2026.4.10 (2026年4月10日)

> 上游最新版本，162 个新提交同步（相比 v2026.4.9）。

### ✨ 新增功能

#### 1. Active Memory recall 插件
- 新增 Active Memory recall 插件（#63286），在主回复前运行专用记忆子 Agent
- 支持 message/recent/full context 模式配置
- 新增 `/verbose` 实时查看功能
- 支持 transcript 持久化用于调试

#### 2. macOS Talk Mode MLX 语音
- 新增实验性本地 MLX 语音合成器
- 支持显式 provider 选择和本地 utterance 播放
- 支持中断处理和系统语音 fallback

#### 3. 文档国际化增强
- raw doc 翻译分块处理，拒绝截断输出
- 避免歧义的 body-only wrapper 展开
- 从 terminated Pi 翻译会话中恢复

#### 4. QA 多跳测试
- `openclaw qa suite` 新增 `--runner multipass` 模式
- 支持在 disposable Linux VM 中运行 repo-backed QA 场景

#### 5. Gateway 启动优化
- 拆分启动和运行时边界，改进 lifecycle 排序和 reload 行为

### 🔐 安全修复

#### 1. 浏览器 SSRF 防护加固
- 修复交互驱动的主帧导航后 SSRF 检查被绕过的问题（#63226）

#### 2. dotenv 安全
- 阻止不可信 workspace .env 文件中的运行时控制环境变量
- 拒绝不安全的 URL 风格浏览器控制 override（#62660, #62663）

#### 3. Node 远程执行事件
- 将 node exec 事件标记为不可信系统事件，防止注入可信 `System:` 内容

#### 4. 依赖安全审计
- 强制 `basic-ftp` 升级至 5.2.1（CRLF 命令注入修复）
- 升级 Hono 和 @hono/node-server

#### 5. 插件认证隔离
- 防止不可信 workspace 插件与捆绑 provider auth-choice id 冲突

### 🐛 问题修复

- **WhatsApp**：修复断连重连后消息丢失问题
- **Matrix**：修复启动时 sync 就绪等待和 background handler 故障处理
- **Slack**：修复 url_private_download 图片附件认证问题
- **Android/Pairing**：修复 QR 扫描恢复可靠性
- **iOS 版本锁定**：通过 CalVer 和 pnpm ios:version:pin 工作流稳定版本号
- **Dreaming/cron**：修复时区配置和启动配置解析
- **QQBot**：新增可配置流式输出模式（streaming.mode）
- **Windows/exec**：修复 supervisor wait 导致的挂起和 SIGKILL 问题

---

## 🚀 v2026.4.9 (2026年4月9日)

> 上游版本，重要安全修复和 Memory/Dreaming 功能增强。

### ✨ 新增功能

#### 1. Memory/Dreaming 重大升级
- 新增 grounded REM backfill lane
- 支持历史 `rem-harness --path` 和 diary commit/reset 流程
- 新增 cleaner durable-fact extraction
- 短期记忆提升集成

#### 2. Control UI/Dreaming
- 新增结构化 diary 视图，支持时间线导航
- 新增 backfill/reset 控制和 grounded Scene lane
- 安全 clear-grounded 操作

#### 3. QA/lab 角色评估
- 新增 character-vibes 评估报告
- 支持模型选择和并行运行

#### 4. Provider Auth Aliases
- provider manifest 可声明 `providerAuthAliases`
- provider 变体可共享环境变量和认证配置

### 🔐 安全修复

- 浏览器 SSRF 防护（#63226）
- dotenv 安全（#62660, #62663）
- Node 远程执行事件注入防护（#62659）
- basic-ftp 5.2.1 升级

### 🐛 问题修复

- Android/Pairing 恢复可靠性
- Matrix 启动和 background handler
- Slack 图片附件认证
- Discord/Telegram approval 路径对齐
