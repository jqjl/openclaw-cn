# OpenClaw 中文版 - 更新日志

本文档记录 OpenClaw 官方版本的最新更新，实时同步。

## 🚀 Unreleased（官方 2026-05-17 更新）

> ⚠️ 此为开发中版本，以下内容基于上游 CHANGELOG.md Unreleased 整理。

### ✨ 新增功能（Highlights）
- Skills：新增 meme-maker skill，支持精选模板搜索、本地 SVG/PNG 渲染、Imgflip 托管渲染和 Know Your Meme 来源链接。
- Agent/工具：精简媒体、消息、会话、定时、Gateway、网页、图片/PDF、TTS、节点和计划工具的内置工具描述和 Schema 提示，保留路由护栏。
- Skills：新增节点检查器调试、融合图表生成和一次性 spike 工作流 skills。
- 代理：支持 HTTPS 托管转发代理端点和范围化的 `proxy.tls.caFile` CA 信任，用于代理端点 TLS。（#79171）感谢 @jesse-merhi。
- QA-Lab：新增首小时 20-turn 和可选 100-turn 运行时一致性场景，带分级元数据用于标准 QA 和 soak QA 门控。（#80323）感谢 @100yenadmin。
- QA-Lab：新增仅实时的 Codex Pi 形 Read 词汇 canary，使运行时一致性检测捕获原生 workspace-read 提示兼容性漂移。（#80323）感谢 @100yenadmin。
- QA-Lab：新增仅实时的 harness 自检场景，覆盖插件 hook 崩溃、manifest 契约错误和 WebChat 直接回复自身消息路由。（#80323）感谢 @100yenadmin。
- QA-Lab：新增 Codex 原生 workspace 工具、OpenClaw 动态工具和可选插件工具的运行时工具 fixture 场景和覆盖报告。（#80323）感谢 @100yenadmin。
- QA-Lab：通过 `openclaw qa coverage --runtime-tools` 暴露运行时工具 fixture 覆盖，支持可选的 suite-summary 评估用于一致性门控产物。（#80323）感谢 @100yenadmin。

### 🐛 问题修复（Fixes）
- 飞书：将 SecretRef 顶级凭证检测为已配置的默认账户，而非将对象支持的 app secrets 视为缺失。
- Providers/Google：在原生重放期间保留和恢复 Gemini 3 工具调用 thought 签名，使函数调用 turns 不再因缺失 `thought_signature` 400 错误失败。修复 #72879。（#80358）感谢 @abnershang。
- Gateway/密钥：将轻量级密钥运行时状态和 auth-store 缓存从完整密钥运行时中分离，在 gateway 启动配置无 SecretRef 值时走快速启动路径，在保留清理和刷新语义的同时加速密钥启动。
- Gateway/重启：在套接字和 channels 关闭前排出待处理回复和活跃聊天运行，通过正常清理路径中止超时聊天运行。（#69121）感谢 @alexlomt。
- QA-Lab：在总线重启后唤醒带过期未来游标到达的 qa-bus 长轮询，为 harness 客户端保留重连就绪状态。（#67142）感谢 @hxy91819。
- QA-Lab：将 Multipass 传输脚本暂存在 OpenClaw 首选临时根目录而非原始 OS 临时路径，使 VM runner 保持在临时路径护栏内。（#64098）感谢 @ImLukeF。
- Agent/回复：保留存活的回复媒体并在其他媒体引用失败时附加警告，使部分媒体规范化不再静默丢弃失败。感谢 @Jerry-Xin。
- 配置/模型：在模型兼容配置中接受 `thinkingFormat: "together"`，使 Together 路由可选择加入 Together 特定的 thinking 响应格式。
- 插件/tokenjuice：将捆绑的 tokenjuice 运行时升级至 0.7.1，为 OpenClaw 插件带来 Codex hook 审批兼容性、工具前命令包装修复和 Rolldown/Vitest 输出压缩改进。
- Agent/OpenAI：停止用硬编码的简洁上限对 GPT-5 最终回复进行后处理，保留完整渠道响应而非附加合成省略号，并在严格 agentic GPT-5 执行激活时记录。修复 #82910。
- Mac 应用：优化设置中的常规和连接面板，采用更干净的状态面板、卡片行和单一原生标题栏侧边栏切换。
- Agent/媒体：当请求者会话完成交接失败时，直接传递失败的异步图片、音乐和视频生成完成，使 channel 用户看到 provider 错误而非静默回退停滞。
- Agent/音乐：将歌曲、广告曲、节拍、颂歌和器乐请求引导至 `music_generate` 音频创作而非仅歌词回复，并将 `lyrics` 保留用于精确的歌词内容。
- Codex app-server：将原生 Codex 工具调用和结果记录到轨迹产物中，使 debug/trajectory 导出捕获完整的 Codex 原生工具历史，而不仅是 OpenClaw 桥接的 turns。感谢 @vyctorbrzezowski。
- Codex/app-server：将绑定的对话会话保持在所属 agent 运行时上，使原生 Codex 控制和后续 turns 不会回退到默认 agent 客户端。修复 #82954。（#82993）
- CLI/infer：在新鲜的显式会话中运行 gateway 模型探测，使一次性 provider 检查不继承默认 agent transcript 状态。（#82861）感谢 @Kaspre。
- Providers/Together：向 Together 的 v2 视频 API 发送视频生成请求，即使共享的文本模型配置仍指向 v1 基础 URL。（#82992）
- 浏览器 CLI：在嵌套命令上保留浏览器级选项，在惰性命令注册期间跳过选项值，并保持长时间运行的 wait/download/dialog hooks 打开以覆盖其声明的等待窗口。
- CLI/sessions：接受 `openclaw sessions list` 作为 `openclaw sessions` 的别名，与其他列表风格命令保持一致。修复 #81139。（#81163）感谢 @YB0y。
- Channels/流预览：加宽紧凑的进度草稿行并在单词边界处截断散文，同时保留命令/路径后缀，通过 `streaming.progress.maxLineChars` 进行 channel 特定的调优。
- CLI/插件：让 `openclaw plugins doctor` 在配置的运行时需要缺失的 owner 插件时发出警告，与 `openclaw doctor --fix` 共享相同的安装映射。修复 #81326。（#81674）感谢 @Zavianx。
- Agent/Codex：将解析为 `openai-codex` 的 OpenAI 运行通过 Codex provider 路由，并在 harness 拥有传输时将 OpenClaw 存储的 OAuth profile 引导到 Codex harness，使 `openai/*` 模型引用不再因存在 Codex OAuth profile 而报 `No API key found for openai-codex`。（#82864）感谢 @ragesaq。
- Agent/ACP：区分提示提交和运行时活跃的子 stall 与真正的交互等待，包括为 Codex ACP 无输出运行提供编辑过的 proxy-env 诊断。修复 #44810。
- Agent/内存：在 `tools.allow` 警告中说明，当配置的 core 工具不可用时，内存触发的压缩仅暴露 `read` 和仅追加的 `write`。修复 #82941。感谢 @galiniliev。
- Agent/OpenAI：为 prompt-cache 重用在 OpenAI Responses 和 chat completions 调用之间保留确定性工具 payload 排序。（#82940）感谢 @galiniliev。
- ACP/Codex：尊重最终 ACP turn 结果，使失败的 Codex/acpx 运行不会在仅有进度文本后被记录为成功。修复 #79522。感谢 @dudaefj。
- Agent/技能：在 owner-only 过滤前将完整的有效工具策略管道应用于内联 `command-dispatch: tool` skill 调度，保留配置的 allow、deny、sandbox、sender、group 和 subagent 限制。（#78525）
- Codex：避免为没有已注册 hook 处理器的 post-tool/finalize 事件生成原生 hook relay 子进程，同时保留 pre-tool 安全和审批 relay。修复 #76552。（#78004）感谢 @evgyur。
- Channel 账户：在命名账户与默认凭证材料一起添加时，保持顶级默认 channel 账户可见，使混合 legacy/新账户配置继续解析为 `default` 而非静默丢弃。
- Codex/Telegram：从最终 turn 快照合成原生 Codex 工具进度，使 Telegram `/verbose` 在命令事件仅在完成时到达时保持可见。
- Mac 应用：通过推迟 config-schema 工作、避免启动 channel 探测、缓存解码后的 channel 状态行并仅显示紧凑的快速设置而非完整的生成 channel schema，使 Channels 设置打开更快。
- Control UI：在协议不匹配错误中包含 Control UI 和 Gateway 协议版本，使过时的 app/dashboard 配对识别哪一方需要重建或重启。
- Gateway/协议：恢复 Gateway WS 协议 v4，并在现有 `inboundTurnKind` 线路字段上保留 `message.action` room-event 元数据，同时保持内部入站事件分类。
- Agent/工具：当消息工具有过时的 webchat 上下文时，优先使用非 webchat 的 session-key 路由，使仅消息工具回复继续传递到原始 channel。修复 #82911。（#83004）感谢 @joshavant。
- Mac 应用：将设置侧边栏切换移到原生标题栏中并收紧常规面板宽度。
- Mac 应用：保持已访问的设置面板挂载，使切换标签不再空白并重新加载其内容。
- Mac 应用：从浅层 schema 查找打开配置设置，按需加载所选路径，而非预先获取和渲染完整的生成 config schema。
- Codex：在 Codex app-server 和 OpenAI Responses 重放前清理内联图像 payload，并在无效图像错误后清除中毒的 Codex 线程绑定。修复 #82878。
- Providers/GitHub Copilot：在 token 交换、目录、模型调用、使用量和 embeddings 方面请求身份编码的 Copilot API 响应，使压缩的 Business-account 错误 payload 不再以 gzip 字节到达 JSON 解析器。修复 #82871。感谢 @tonyfe01。
- Telegram：在群组回复链中保留被回复的 bot 消息、标题和媒体元数据，使后续回复理解用户正在响应什么。（#82863）
- Providers/Together：将 PI 运行时包升级至 0.74.1，并为支持 reasoning 的 OpenAI-completions 模型发出 Together 风格的 `reasoning.enabled`/`max_tokens` 控制。
- Agent/诊断：将缓慢嵌入式运行的 `attempt-dispatch` 启动摘要拆分为 workspace、prompt、runtime-plan 和最终 dispatch 子跨度，使追踪识别延迟的设置阶段。修复 #82782。（#82783）感谢 @galiniliev。
- Agent/Codex：将嵌套的工具结果中间件块扁平化为有限文本，使成功的消息发送不再被替换为 `Tool output unavailable due to post-processing error`。修复 #82912。感谢 @joeykrug。
- CLI/媒体：在 `openclaw infer image describe --file` 中接受 HTTP(S) URL，通过受保护的媒体路径获取远程图像，而非将 URL 视为本地文件。修复 #82837。（#82854）感谢 @neeravmakwana。
- Agent/子代理：当子 wait 调用在子会话实际稳定前超时时，保持基于会话的父运行活跃，使延迟的子代理完成被协调而非丢失。修复 #82787。感谢 @ramitrkar-hash。
- Control UI：在浏览器连接帧中公布共享的 Gateway 协议常量，修复协议常量漂移后的协议不匹配握手。修复 #82882。感谢 @galiniliev。
- Gateway：添加回滚协议不匹配诊断，包括 Gateway 日志中的客户端协议范围和针对过时客户端进程的深层 status/doctor 提示。修复 #82841。（#82908）
- Agent/子代理：在最终投递重试耗尽后保持成功的 keep-mode 完成 payload 待处理，使请求者恢复不再丢失最终子代理结果。修复 #82583。（#82999）感谢 @joshavant。
- Gateway/认证：在重新审视 #78684 fail-closed 策略后，允许同主机受信任代理调用者使用文档化的本地直接 `gateway.auth.password` 回退，同时保持 token 回退被拒绝且转发-header 请求走受信任代理路径。修复 #82607。（#82953）感谢 @joshavant。
- Agent/子代理：等待排队的完成交接到达父 transcript 后再将其标记为已宣布，防止忙碌的父运行在观察子结果前清理。修复 #82913。（#83039）感谢 @joshavant。
- Agent/子代理：在需要时通过仅消息工具交接路由群组/channel 子代理完成，并保持活跃请求者 wake 失败不会导致完成投递丢失。修复 #82803。感谢 @galiniliev、@yozakura-ava 和 @moeedahmed。
- 内存核心：在启动时扫描持久化的内存源会话，将磁盘上的 transcripts 与索引比较，仅将缺失/更新/调整大小的文件标记为脏以进行增量同步。修复 #82341。（#82341）感谢 @giodl73-repo。
- Telegram：在命名账户或绑定与顶级凭证一起添加时，保持顶级默认账户在账户列表中，保留默认轮询，同时允许仅命名配置解析为单个账户。修复 #82794。（#82794）感谢 @giodl73-repo。
- CLI/模型：在模型列表、provider 目录、auth 和合成 auth 检查中重用命令范围的插件元数据，为插件密集型安装恢复快速的 `openclaw models` 运行。修复 #82881。（#83033）感谢 @joshavant。
- CLI/channels：当配置官方外部 channel（如 Discord）的插件包缺失时，在 `openclaw channels list` 中显示它们，包括安装和 doctor 修复命令，而非报告没有已配置的 channels。修复 #82813。
- Signal：通过路由和会话持久化保留混合大小写的群组 ID，使群组自动回复在更新后继续投递。修复 #82827。
- Agent/工具：当 `message` 工具通过 `tools.alsoAllow` 或运行时工具 allowlist 明确允许时，在嵌入式运行中保持其可用，使具有自定义回复投递的 channel 插件仍可使用配置的消息发送。修复 #82833。感谢 @cn1313113。
- WhatsApp：尊重出站图片、GIF 和视频媒体的强制文档投递，使 `forceDocument`/`asDocument` 发送保留原始媒体字节而非使用压缩媒体 payload。（#79272）感谢 @itsuzef。
- WhatsApp：当未提供文件名时，根据 MIME 类型命名出站文档附件，使 PDF 和 CSV 发送以 `file.pdf` 和 `file.csv` 到达，而非无扩展名的 `file`。感谢 @mcaxtr。
- 进程/诊断：在 lane 等待警告中报告活跃 lane 阻塞者，使 `queueAhead=0` 不再隐藏等待在活跃工作后面的命令。修复 #82791。（#82792）感谢 @galiniliev。
- 进程/诊断：在活跃度警告中停止将活跃处理 turn 计为排队的积压，使瞬态 max-only 事件循环峰值不再作为 gateway 警告浮出水面。
- Agent/回复：分类 provider 会话状态拒绝并返回清晰的 message-channel 错误，而非自动重置或回退到通用 runner 失败。（#82616）感谢 @dutifulbob。
- 浏览器插件：当启动 HTTP 探测与冷启动就绪竞争时信任托管的 Chrome CDP 诊断，避免虚假的启动失败。修复 #82904。（#82986）感谢 @kmanan 和 @hclsys。

## 🚀 Unreleased（官方 2026-05-06 · 待发布）

> ⚠️ 此为待发布版本，各项更新尚在开发中，以下内容基于上游 CHANGELOG.md 整理，正式发布时可能有调整。

### ✨ 新增功能（Highlights）

- **Google Meet / Voice Call**：Twilio 电话加入现在通过 realtime Gemini 语音桥接，支持流式音频、防压缓冲、打断队列清除，不再使用 TwiML 回退，Meet 参与者将获得更灵敏的 OpenClaw 语音助手。（#77064）感谢 @scoootscooob。

### 🔧 功能调整（Changes）

- **Discord/Voice**：ElevenLabs TTS 直接流式传输到 Discord 播放，并发送延迟优化参数，使语音回复更快开始
- **Discord/Voice**：TTS 播放中用户开始说话时保持继续，播放期间忽略新捕获避免回声，接收流中止降级为详细诊断
- **Discord/Voice**：`channels capabilities --probe` 现审计语音频道权限（连接/发言/读取消息历史），缺失权限在 `/vc join` 前就会显示
- **Telegram**：`message` 工具在入站 Telegram 消息处理期间同聊发送成功时，不再发送静默回退（#78685）感谢 @neeravmakwana
- **Channels CLI**：`channels list` 改为仅显示渠道，添加 `--all` 展开未配置/未安装状态，增加 `installed`/`configured`/`enabled` 标签和 JSON `origin` 字段（#78456）感谢 @sliverp
- **CLI/Cron**：`cron list --json` 和 `cron show <id> --json` 新增 `status` 字段（disabled/running/ok/error/skipped/idle）（#78701）感谢 @aweiker
- **iMessage**：BlueBubbles 标记为弃用（新增部署不再推荐），引导新部署使用原生 `imsg` 路径，BlueBubbles 保留为兼容legacy选项
- **Discord/Streaming**：Discord 回复默认使用进度草稿预览，除非显式关闭
- **OpenAI**：`openai/chat-latest` 现支持作为显式直连 API-Key 模型覆盖，无需更改默认模型
- **Plugins/Install**：新增 `npm-pack:<path.tgz>` 安装方式，本地 npm pack 产物走统一托管安装路径
- **Codex App-Server**：暴露 `appServer.turnCompletionIdleTimeoutMs`，后工具阶段停滞不再误报为 idle（#77984）感谢 @roseware-dev 和 @rubencu
- **Plugin Skills/Windows**：在 Windows 上通过 junction 发布插件技能目录，无需开发者模式即可注册（#77971）感谢 @hclsys 和 @jarro
- **MS Teams**：日志记录 JWKS 获取网络失败，Bot Connector 发送提示传输层回复失败（#78081）感谢 @Beandon13
- **Gateway/Sessions**：构建 session 列表行时快速路径已限定模型引用，大型存储不再重复重量级模型解析（#77902）感谢 @ragesaq
- **Codex/Approvals**：Codex 审批模式下停止安装 pre-guardian 原生 PermissionRequest hook，记住 session 窗口内相同 payload 的 allow-always 决策
- **Sessions CLI**：`openclaw sessions` 表格现在显示选中的 agent runtime
- **ACPX/Codex**：启动时收割旧 OpenClaw ACP/Codex 进程树，防止孤儿 harness 拖慢 Gateway 感谢 @91wan

### 🐛 问题修复（Fixes）

- **Control UI**：工具结果卡片支持 Markdown 渲染
- **Control UI**：修复 Discord 频道规则窄布局下操作按钮重叠
- **Android**：点击前台服务通知现在打开应用前台（#179）感谢 @Syhids
- **Cron 工具**：使用 `id` 作为 update/remove/run/runs 参数（与 gateway 参数对齐）（#180）感谢 @adamgall
- **Control UI**：聊天视图改用页面滚动，固定 header/sidebar 和 composer（无内部滚动框）
- **macOS**：定位权限设为 always-only 以避免 iOS-only 枚举（#165）感谢 @Nachx639
- **macOS**：生成符合 Swift 6 严格并发的 `Sendable` Gateway 协议模型（#195）感谢 @andranik-sahakyan
- **macOS**：捆绑 QR 码渲染模块，DMG Gateway 启动不再因缺少 qrcode-terminal 而崩溃
- **macOS**：安全解析 JSON5 配置（注释存在时不再清空用户设置）
- **WhatsApp**：心跳后台任务期间抑制打字指示器（#190）感谢 @mcinteerj
- **WhatsApp**：将离线历史同步消息标记为已读但不触发自动回复（#193）感谢 @mcinteerj
- **Discord**：避免 OpenAI/GPT 发送延迟 `text_end` 事件时产生重复回复
- **Discord**：避免 OpenAI 重复 `message_end` 事件导致重复回复
- **CLI**：bind 为 tailnet/auto 时使用 tailnet IP 进行本地 gateway 调用（修复 #176）
- **Env**：全局 `$OPENCLAW_STATE_DIR/.env`（`~/.openclaw/.env`）在 CWD `.env` 之后加载为备选
- **Env**：可选 login-shell env 备选（opt-in；仅导入期望的 key 且不覆盖现有 env）
- **Agent Tools**：OpenAI 兼容工具 JSON Schema（修复 `browser`，规范化 union schema）
- **Onboarding**：源码运行且 UI 资源缺失时自动构建（`bun run ui:build`）
- **Discord/Slack**：反应和系统通知路由到正确 session（无 main-session 污染）
- **Agent Tools**：即使 sandbox 关闭也尊重 `agent.tools` allow/deny 策略
- **Commands**：统一各 provider 的 /status（inline）和命令 auth；授权控制命令 bypass；移除 Discord /clawd 斜杠处理器
- **CLI**：`openclaw agent` 默认通过 Gateway 运行；使用 `--local` 强制嵌入式模式 感谢 @vignesh07

## 🚀 v2026.5.17（官方 2026-05-17）

### 🔧 功能调整（Changes）

- **xAI Provider**：为 SuperGrok 订阅者新增 xAI Grok OAuth 登录，`xai/*` 模型和 xAI 媒体/工具 providers 无需 `XAI_API_KEY` 即可认证。
- **CLI/Cron**：新增 `openclaw cron run --wait` 命令，支持超时和轮询间隔控制，以及精确的 `cron.runs --run-id` 过滤，使自动化可以阻塞等待单个排队的 manual run。（#81929）感谢 @ificator。
- **维护工具**：将 Crabbox skill 默认路由到仓库代理的 AWS 配置，Blacksmith Testbox 保留为显式 opt-in 而非默认 broad-proof。
- **CLI/Onboarding**：将安装向导和捆绑 channel 设置流程本地化，支持英语、简体中文和繁体中文。（#80645）感谢 @GaosCode。
- **Agent/Skills**：在热 Gateway turns 期间缓存 hydrated `resolvedSkills`，通过去标识的有效配置键入复用，减少冗余 skill 快照重建而不跨越配置门控的 skill 边界。（#81451）感谢 @solodmd。
- **Telegram/群组**：新增可选的 `messages.groupChat.ambientTurns: "room_event"` 处理，使常驻环境聊天可作为安静的房间上下文运行，仅通过 message 工具可见发言。（#81317）感谢 @obviyus。
- **Codex/Context Engines**：将线程引导投影 epochs 绑定到 Codex app-server 线程，将去标识的工具结果上下文带入新线程，并在投影状态改变时轮换后端线程。（#82351）感谢 @jalehman。

### 🐛 问题修复（Fixes）

- **CLI/Context Engines**：为 CLI turns 引导和终结非遗留 context engines，同时保留 transcript 快照和延迟维护所有权。（#81869）感谢 @sahilsatralkar。
- **Telegram**：在重启重放期间持久化轮询更新，使排队的同主题消息按顺序恢复，而非在 Gateway 重启后丢失上下文。（#82256）感谢 @VACInc。
- **Gateway/Gmail**：在关闭前中止进行中的 Gmail watcher 启动和热重载重启，使重载无法在 Gateway 关闭后生成 `gog serve`。感谢 @frankekn。
- **MCP/Plugin Tools**：将 host MCP `tools/call` `AbortSignal` 通过 `createPluginToolsMcpHandlers().callTool` 转发到插件 `tool.execute`，使 host 取消真正中止进行中的插件工具调用，而非让其运行至完成。修复 #82424。（#82443）感谢 @joshavant。
- **Plugins**：接受 `api.on("deactivate")` 作为 `gateway_stop` 的兼容性别名，使外部插件清理处理器在 Gateway 关闭时运行，而非被忽略为未知钩子。
- **Media**：当字节嗅探为通用容器时忽略图像 MIME 和文件名提示，使误标为图像的 zip/octet-stream 负载不会变成本地图片媒体或在暂存时保留图片文件扩展名。
- **Update/Doctor**：避免为拒绝它的 channel schema 实现 `groupAllowFrom`，使包交换 doctor 修复不会在外部化 Slack 配置上失败。
- **Gateway/Media**：防止图像文件名覆盖通用非图像字节嗅探，使误标为图像的 zip/octet-stream 负载在成为内联图片附件前被卸载或拒绝。
- **Plugins/Web Search**：将过时的可选 provider 安装降级为警告，使 Gateway 和 doctor 修复路径在启动 provider 选择后继续运行。 Refs #82313。感谢 @crackmac。
- **Telegram/Gateway**：将定向 Telegram `/stop@bot` 消息路由到控制通道而非缓存 bot 元数据，并跨 raw/规范 session 别名匹配 gateway stop 请求。（#82298）感谢 @VACInc。
- **MS Teams/Media**：在暂存前嗅探内联 `data:image/*` 附件字节，跳过实际不是图像的负载。
- **WebChat/Media**：在保留本地音频回复路径用于显示前要求受信任的本地媒体来源，使不受信任的音频路径通过正常暂存和读取策略检查。
- **Agent/Tool Media**：在将生成的工具附件合并到最终回复负载时保留受信任的本地媒体来源，使受信任的音频/媒体在出站显示规范化中存活。
- **Update**：允许包交换 `doctor --fix` 在插件 schema 仍在收敛时持久化核心配置修复，防止外部 channel 配置上的更新失败。
- **Update**：将插件验证绕过带入配置变更预写入读取，使包更新 doctor 修复在外化插件 schema 收敛时完成。
- **Update/Doctor**：在顶层 `$include` 配置写入路径上保留插件验证绕过，使包修复可以更新包含的插件配置文件而不将其扁平化为根配置。
- **Agent/Subagents**：当生命周期清理失败时发出警告并继续完成 announce 清理，防止已结束的 subagent 运行成为沉默幽灵。修复 #82306。感谢 @SebTardif。
- **Telegram**：允许授权的文本 `/stop` 命令在排队的 agent 工作前使用快速中止路径，使活跃 turns 立即停止而非在 turn 完成后处理中止；foreign-bot `/stop@otherbot` 提及现在留在常规主题通道而非被路由到我们的控制通道。修复 #82162。感谢 @civiltox。
- **Sessions**：丢弃带有无效 session id 的持久化条目，并在水合 session 运行时状态前剥离格式错误的 transcript 文件元数据。
- **Auth/Device**：在返回或保留 token 条目前规范化格式错误的持久化设备-auth token 元数据。
- **Pairing**：在批准有效 channel 配对码前跳过格式错误的持久化待处理配对请求。
- **Commitments**：在匹配待处理跟进前从持久化承诺中剥离格式错误的可选提醒范围元数据。
- **Config/Persistence**：规范化格式错误的 auth profile 凭证字段/状态，跳过 JSON 有效的垃圾 transcript 检查点行，并允许 `openclaw doctor --fix` 移除无法修复的 cron job 行。
- **Cron**：在内存中跳过格式错误的持久化 job 行（包含格式错误的 schedule 或 payload shape），将其留给 `openclaw doctor --fix` 而非水合到运行时状态。
- **Cron**：保持遗留字符串 schedules 和空白 system-event jobs 可用于运行时修复/跳过处理，而非将其作为格式错误的持久化行丢弃。
- **Task/Persistence**：从 task 和 task-flow SQLite sidecar 中丢弃格式错误的数组/标量 requester-origin JSON，而非将其恢复为投递元数据。
- **Agent/Timeouts**：澄清模型 idle-timeout 错误和文档，使 provider `timeoutSeconds` 显示为受整个 agent/run 超时上限限制。
- **Release/Tooling**：对齐发布的 launcher Node 最低版本、`npm start`、package 脚本检查、分片 lint 锁定、Vitest 根项目覆盖率和 plugin-SDK 声明构建缓存元数据，使发布/package 验证不会静默跳过或交付过时 surface。
- **Cron/Agents**：为隔离的定时运行遵守配置的 subagent 模型回退，并将该回退策略转发到嵌入式 agent 超时故障转移。修复 #74985。感谢 @chrisgwynne。
- **Codex App-Server/MCP**：通过可选的 `mcp.servers.<name>.codex.agents` 列表将用户 MCP 服务器限定到特定 OpenClaw agent id，并接受原生 Codex 审批默认的 `codex.defaultToolsApprovalMode`（`auto`/`prompt`/`approve`）；OpenClaw 在将 `mcp_servers` 配置交给 Codex 前剥离 `codex` 块。（#82180）感谢 @sercada。
- **Agent/OpenAI Responses**：将 `input_tokens - cached_tokens` 钳制到零，并从 input + output + cached 组件重建 `totalTokens`，使 Responses-API 流在 provider 相对于 `cached_tokens` 低报 `input_tokens` 时报告一致的用量。
- **Agents**：在嵌入式 Pi 会话中将适配器捕获的工具执行失败标记为错误工具结果，使模型可以重试可恢复的编辑失败而非看到成功的工具结果。修复 #81546。（#81564）感谢 @najef1979-code 和 @MonkeyLeeT。
- **Plugins**：在安装、发现和更新后 payload 检查期间拒绝格式错误的 `package.json` `openclaw.extensions` 元数据，而非静默丢弃无效条目。
- **Plugins**：拒绝其 `package.json` 解析到插件根目录外的包元数据记录，而非信任持久化或重建的注册快照。
- **Plugins**：忽略格式错误的持久化包 channel/安装元数据，而非导致目录重建崩溃或泄露无效安装提示。
- **Plugin Releases**：拒绝会从 npm plugin tarball 中省略广告包本地运行时条目的包 `files` 否定。
- **Media/Files**：在信任声明的 MIME 头前嗅探 `input_file` 字节，在欺骗性图像或 zip 负载成为 agent 可见文本前拒绝它们。
- **Plugins/Dependencies**：清除过时的托管根 `openclaw` 所有权元数据而不删除链接的活动 host 包，防止 plugin 安装降级 npm-global hosts。修复 #79462。感谢 @lisandromachado。
- **Gateway/Update**：将关闭 hook-runner 导入保持在稳定的 dist 条目上，并发布一个 legacy chunk 别名，使包交换不会使运行中的 Gateway 搁浅在缺失的 shutdown chunk 上。修复 #81819。感谢 @najef1979-code。
- **Config/Persistence**：忽略格式错误的数组/标量 auth profile、cron job 状态和 session store 条目，而非将它们水合为数字 profile id、崩溃的 cron 行或无效 session 记录。
- **Config/Persistence**：在加载时剥离格式错误的待定最终投递 session 字段，使重放/恢复路径跳过中毒的回复元数据而非在原始对象上崩溃。
- **Config/Persistence**：在加载时剥离格式错误的插件扩展状态和提升的 session-slot 所有权，使损坏的 session 行不会将中毒的插件元数据泄露到重放/投影路径。
- **Gateway/Sessions**：在 session 投影期间忽略格式错误的压缩检查点行，使损坏的存储不会导致 session list/describe 响应崩溃或显示虚假的检查点计数。
- **Gateway/Sessions**：当导入的树形 transcript 引用缺失或遗留父行时保持可达的 transcript 历史，防止部分导入后会话历史读取变为空。
- **Trajectory Export**：报告不完整的 transcript 父链并停止循环分支遍历，使格式错误的导入无法挂起 `/export-trajectory`。
- **Session Replay**：在静默 session 重置期间跳过格式错误的 user/assistant 形状 transcript 行，而非将无效条目复制到新的 transcript。
- **Providers**：用 provider 自有的错误拒绝格式错误的成功 Runway、BytePlus 和 Ollama embedding 响应，而非原始解析器/类型失败、静默错误向量或长期虚假轮询。
- **Providers/Images**：用 provider 自有的错误拒绝格式错误的成功 OpenAI 兼容、OpenAI、Google、fal 和 OpenRouter 图像响应，而非原始形状失败、静默无效 base64 跳过或空图像结果。
- **Providers/Videos**：用 provider 自有的错误拒绝格式错误的成功 xAI、OpenRouter 和 fal 视频创建、轮询和结果响应，而非原始解析器失败或长期虚假轮询。
- **Providers/Audio**：用 provider 自有的错误拒绝格式错误的成功 OpenAI 兼容、ElevenLabs 和 Deepgram 语音响应，而非原始解析器失败、错误形状的 transcript 或被视为音频的 JSON/text 正文。
- **Providers/Embeddings**：拒绝格式错误的成功 OpenAI 兼容、Google Gemini 和 Amazon Bedrock embedding 响应，而非静默返回空或强制向量。
- **Providers/Catalogs**：用 provider 自有的错误拒绝格式错误的成功 LM Studio、GitHub Copilot、DeepInfra、Vercel AI Gateway 和 Kilocode 模型列表响应，而非原始解析器/类型失败或静默回退目录。
- **Providers/Polling**：用 provider 自有的格式错误 JSON 错误拒绝数组、null 或标量成功操作状态响应，而非等待到超时。
- **ACPX/Codex**：在包装器崩溃后启动时收割插件本地 Codex ACP 适配器孤立进程，同时保持直接适配器命令远离 launch-lease 注入。修复 #82364。（#82459）感谢 @joshavant。
- **Telegram**：通过渲染备用文本和内联按钮发送仅呈现负载，而非将其视为空。修复 #82404。（#82449）感谢 @joshavant。
- **Providers/Search Tools**：用 provider 自有的错误拒绝格式错误的成功 xAI、Gemini 和 Kimi 网页/代码搜索响应，而非静默 `No response` 负载或无根据的回退状态。
- **Trajectory Export**：在 `manifest.json` 中跳过并报告格式错误的 session/runtime JSONL 行，而非让错误形状的 session 行导致支持包导出崩溃。
- **Voice Calls**：持久化被拒绝的入站呼叫重放键，使在 Gateway 重启后重复的 carrier webhook 重试保持被忽略。
- **Config/Doctor**：在 `openclaw doctor --fix` 期间将启用回退的 channel `allowFrom` 条目复制到显式 `groupAllowFrom` 允许列表，保留当前群组访问而不添加运行时回退转换标志。
- **Config/Doctor**：在 `openclaw doctor --fix` 期间从受信任的目录元数据替换仅有源的官方 Brave 和 Slack plugin 安装，解封升级后的外部化股票 plugin 恢复。（#82425）感谢 @joshavant。
- **Agent/Bootstrap**：在工作区设置清理失败后忽略过时的已完成根 `BOOTSTRAP.md` 上下文，防止 channel agent turns 将其视为目录。（#82463）感谢 @joshavant。
- **Update/Doctor**：当配置的 OpenAI agent 模型需要 Codex 运行时，在 `openclaw doctor --fix` 期间重新启用 Codex plugin，防止升级后的配置因未注册的 Codex harness 而失败。修复 #82368。（#82502）感谢 @josavant。
- **Configure**：显示一个带有 ChatGPT/Codex 登录和 API 密钥选项的 OpenAI provider 条目，并将浏览的 Codex 模型保存在保存的 `/model` 选择器允许列表中。
- **Agent/Model Fallback**：当 session fallback 来源存活但 `modelOverrideSource` 缺失时，跨延迟配置重载保留自动回退链。修复 #81982。感谢 @joshavant。
- **Hooks**：将有限的 Gateway 生命周期 hook 等待预算提高到关闭 5 秒和预重启 10 秒，给予短重启通知处理器时间在关闭继续前完成。（#82273）感谢 @bryanbaer。
- **Plugin Releases**：在 npm plugin 发布计划中要求外部包兼容性元数据，在包发布前匹配 ClawHub 包契约。
- **Agent/OpenAI-Compatible**：在嵌入式 OpenAI-completions 运行中遵守每个模型的 `max_completion_tokens`/`max_tokens` 参数，使高 token Kimi 风格路由保持其配置的完成上限。修复 #82230。感谢 @albert-zen。
- **Agent/Local**：在受信任的 `openclaw agent --local` 运行周围安装本地 gateway 请求作用域，使 subagent 完成 announce 可以使用进程内 gateway 调度而不崩溃。修复 #82140。感谢 @Kushmaro。
- **Cron**：保持失败的隔离 agent 运行不会在仅交付了失败通知时标记为成功的结果投递。修复 #72985。感谢 @Allenbluff。
- **Discord**：在规范化 channel 历史前验证消息读取结果，并以 Discord 边界错误而非 `map is not a function` 报告意外负载。修复 #82252。感谢 @jessewunderlich。
- **Agent/Runtime**：将 `agents.defaults.models["provider/*"].agentRuntime` 应用于 provider 范围的模型运行时策略，同时保持精确的模型运行时优先级。修复 #82243。感谢 @rendrag-git。
- **Model Picker**：为官方 OpenAI 路由首先显示有效的 Codex 运行时，同时保持 Pi 作为备用可用，并保留 Pi 优先的自定义 OpenAI 兼容 providers。修复 #82269。感谢 @rendrag-git。
- **Agent/Auto-Reply**：将 `NO_REPLY` 提示指导限制为自动群组/channel 回复，移除遗留静默回复重写，并在交付备用文本而非意外直接聊天静默 token 时抑制。修复 #82254。感谢 @absol89。
- **Telegram**：当最终回调仅携带省略号截断的快照时保留较长的部分流预览，防止可见答案和 transcript 镜像被短预览替换。修复 #82239。感谢 @crash2kx。
- **Telegram/Active Memory**：对直接消息 turns 通过 Telegram provider 运行阻塞内存召回，即使 hook 上下文携带原始 chat id，防止嵌入式召回针对无效数字 channel 启动。修复 #82177。感谢 @cslash-zz。
- **Control UI/WebChat**：阻止乐观图像消息嵌入大型内联 `data:` 预览，并在聊天历史中保留仅图像用户 turns，在发送图像附件时避免浏览器堆栈溢出。修复 #82182。感谢 @ExploreSheep。
- **Agent/Media**：为生成的音乐和视频完成交接保留 message-tool-only 投递，使群组/channel 完成不会在不发布生成的附件的情况下结束。
- **Telegram**：在轮询重连确认新的 `getUpdates` 活动后排出排队的出站投递，使过时 socket 和网络恢复不会使失败的回复滞留。修复 #50040。 Refs #82175。感谢 @dmitriiforpost-commits 和 @shellyrocklobster。
- **Gateway/Model Auth**：当保存的 auth 通过 Gateway 控制平面移除时中止活动的 provider 运行，刷新实时运行时 auth 快照，并向客户端呈现 `stopReason: "auth-revoked"`。修复 #81987。（#82346）感谢 @joshavant。
- **Codex App-Server**：在 `custom_tool_call_output` 通知后保持裸工具输出 idle 看门狗武装，使工具后流沉默快速失败而非等待终端空闲超时。修复 #82274。（#82378）感谢 @joshavant。
- **Codex App-Server**：对 Codex 原生 app-server shell 和审批路径执行 OpenClaw `before_tool_call` 策略，防止原生工具执行绕过插件策略。修复 #82372。（#82496）感谢 @joshavant。
- **Telegram**：当排队的入站积压停滞而 Bot API 轮询仍成功时，将隔离轮询入口标记为不健康，使 Gateway/channel 健康状态不再在 Telegram DM 处理卡住后保持绿色。修复 #82175。感谢 @shellyrocklobster。
- **Telegram**：在审批 id 过期后从隔离轮询中丢弃过期的审批回调，使陈旧的内联按钮更新不会在重启间永远重试。修复 #82347。（#82455）感谢 @joshavant。
- **Agents**：从交付的回复中剥离带有属性或自闭合语法的 Gemini/Gemma `<final>` 标签，包括严格的 final-tag 流式强制执行。修复 #65867。感谢 @grizdum。
- **macOS/Update**：当 `openclaw update` 从一个启动时禁用遗留 `ai.openclaw.update.*` LaunchAgents，防止 KeepAlive 重启循环重复重启 Gateway 并重放更新继续。修复 #82167。感谢 @DougButdorf。
- **Agent/Replay**：从 provider 重放和待定最终投递恢复中剥离内部运行时上下文元数据和 `NO_REPLY` 哨兵，使重启和心跳恢复不会将控制文本反馈给模型。修复 #76629。感谢 @fuyizheng3120、@bryan-chx 和 @cael-dandelion-cult。
- **Agent/Replay**：在去重嵌入式 assistant 间隙填充时跳过格式错误的 transcript 尾部行，防止截断的 JSONL 在重放恢复期间复制最终 assistant 回复。
- **LINE**：在 agent 处理前确认签名 webhook 事件，使慢速模型回复不会导致 LINE `request_timeout` 投递失败。修复 #65375。感谢 @myericho。
- **LINE**：停止 cron 恢复从规范 session 键推断小写 LINE 收件人，使长时间运行的任务回复不会静默重试无法投递的推送目标。修复 #81628。（#81704）感谢 @edenfunf。
- **TTS**：即使 provider 输出不是原生语音兼容的，也为 `/tts audio` 回复保留 channel 衍生的语音笔记投递。（#82174）感谢 @xuruiray。
- **Codex App-Server**：在镜像用户提示上保留入站发送者元数据和 source-channel 来源，包括失败快照，使 channel 历史保持原始发送者身份。（#82184）感谢 @zknicker。
- **Codex App-Server**：在嵌入式运行通知之间将投影仪工作让给事件循环，同时保留 pre-turn 速率限制捕获，减少来自账户和 MCP 状态通知的 gateway 停滞。修复 #81936。（#82333）感谢 @joshavant。
- **Plugins/Web Search**：在 gateway 启动期间启动配置的 web_search provider plugin，包括在允许列表后自动启用的外部 providers。修复 #82313。（#82376）感谢 @joshavant。
- **Codex/Account Status**：将仅元数据速率限制桶视为已返回但为空，使 `/codex status` 和 `/codex account` 报告 `none returned` 而非计算幻影限制。
- **Codex/Lossless**：将 Codex 显式压缩保持在原生 app-server 线程上，同时允许通过 context-engine 槽的 Lossless；`openclaw doctor --fix` 现在将遗留 `compaction.provider: "lossless-claw"` 配置迁移到 `plugins.slots.contextEngine`。
- **Cron/Doctor**：报告带有显式 `payload.model` 覆盖的调度作业，包括 provider 命名空间计数和默认模型不匹配，使陈旧的 cron 模型引脚在 auth 或计费调查中可见。修复 #82151。感谢 @mgonto。
- **Codex App-Server**：在最后一个非 assistant 的当前 turn 项完成后保持短期 turn-completion idle 看门狗武装，使安静的 Codex app-server 在外部尝试超时前释放 OpenClaw session 通道。修复 #82171。（#82172）感谢 @funmerlin。
- **Providers/OpenRouter**：停止向 assistant 工具调用重放消息添加空的 DeepSeek V4 `reasoning_content` 占位符，并在后续 Chat Completions 请求前剥离空重放产物，使 `openrouter/deepseek/deepseek-v4-pro` 不再在工具使用后失败。修复 #82150。（#82158）感谢 @luyao618 和 @Suquir0。
- **OpenAI-Compatible Providers**：在决定是否发送 `stream_options.include_usage` 时遵守流式使用兼容性元数据，同时保持捆绑的 Volcengine 路由选择加入 Ark 流式使用。 Refs #44845。（#82181）感谢 @xuruiray。
- **Gateway/Approvals**：在 `canBridgeNoDeviceChatApprovalFromBackend` 中将 `turnSourceTo` 视为可选，与 `turnSourceAccountId` 和 `turnSourceThreadId` 的现有可选处理保持一致。没有收件人概念 channel（webchat、control-ui）在审批快照和重放参数上将 `turnSourceTo` 留为 null，使先前 required-string 检查拒绝每个带有 `APPROVAL_CLIENT_MISMATCH` 的后端重放。跨 channel 重放仍受必需的 `turnSourceChannel` 和 `sessionKey` 检查限制。修复 #82132。（#82136）感谢 @ottodeng。
- **OC Path**：新增 `openclaw path set --dry-run --diff`，使寻址编辑可以在写入前作为统一 diff 审查。

- **Cron**：在隔离 cron 模型和投递解析前加载运行时 plugins，使外部 channels 可以为定时运行选择。（#82111）感谢 @medns。
- **Cron**：将成功的直接定时投递镜像到解析的目标 session transcript，同时保留隔离投递意识策略。（#80786）感谢 @cavit99。
- **Cron**：在会话绑制定时运行压缩后保留轮换的 transcript 标识，使 `sessionTarget: "current"` 将下一条用户消息保持在同一对话中。修复 #82164。感谢 @weissfl。
- **Twitch**：保持 gateway accounts 运行直到关闭，而非将成功的监控启动视为干净的 channel 退出，防止立即自动重启循环。修复 #60071。（#81853）感谢 @edenfunf。
- **Agent/Auto-Reply**：在通用 agent-run 失败回退决定是否发送可见备用文本时遵守 `agents.defaults.silentReply` 和每个 surface 的群组静默回复策略。修复 #82060。（#82086）感谢 @taozengabc。
- **Discord**：将 channel topic 上下文呈现为回复提示中的结构化不受信任元数据，并停止复制入站消息体或暴露原始 `EXTERNAL_UNTRUSTED_CONTENT` 信封。修复 #82168。感谢 @ronan-dandelion-cult。
- **Codex App-Server**：在 Codex 接受一个 turn 后立即武装短期 idle 看门狗，使已接受但无当前 turn 进度的 turns 在外部模型超时前释放 OpenClaw session 通道。修复 #82129。感谢 @Francois3d。
- **Agent/Replies**：当 `<function_response>` 工作流输出在相邻剥离的工具调用 XML 块后可见时也剥离，关闭 #47444 的剩余 sanitizer 泄漏。感谢 @5toCode。
- **Control UI/WebChat**：当用户点击可见输入 chrome 时聚焦 composer，并在保持紧凑移动 tap 的同时恢复更大的、带标签的桌面 composer 控件。修复 #45656。感谢 @BunsDev。
- **Discord**：默认抑制出站消息上生成的链接嵌入，使 agent 发送的 URL 保持为纯链接，除非 `channels.discord.suppressEmbeds` 被禁用。
- **System Events**：在结构化元数据中保留 owner downgrade，同时将排队的提示文本呈现为纯 `System:` 行，保留最小权限唤醒而不显示提示可见的信任标签。（#82067）
- **Gateway/Agents**：当诊断检测到过时的原生工具调用时中止活动的嵌入式运行，防止嵌套 agent session 通过重启恢复保持死锁。修复 #81976。（#82369）感谢 @joshavant。
- **Slack**：默认关闭出站 bot 链接展开，使 agent 发送的 URL 不再扩展为内联预览，除非启用 `channels.slack.unfurlLinks`。（#82123）感谢 @kibi-bsp。
- **Slack**：当稍后的同 turn 工具警告正常交付时保持最终化的草稿预览回复可见，而非清除编辑的答案。修复 #81903。（#81979）感谢 @neeravmakwana。
- **Providers/Xiaomi**：在多 turn 工具调用重放中保留 MiMo `reasoning_content`，包括自定义小米兼容代理路由，使后续 turns 不再因 `400 Param Incorrect` 失败。修复 #81419。（#81589）感谢 @lovelefeng-glitch 和 @jimdawdy-hub。
- Slack/plugins: route plugin-owned modal `view_submission` and `view_closed` events through Slack interactive handlers before compacting the agent-visible system event, so plugins can persist full submitted form state while the transcript stays compact. Fixes #82102. Thanks @shannon0430.
- **Providers/Xiaomi**：将遗留 MiMo V2 仅推理最终答案提升为可见文本，包括小米兼容代理路由，使 `mimo-v2-pro` 和 `mimo-v2-omni` 回复在答案到达 `reasoning_content` 时不再显示为空白。修复 #60261。（#60304）感谢 @HiddenPuppy。
- **Providers**：为 Kimi K2.6/K2 思考和 MiMo V2.6 OpenAI 兼容工具调用后续 turns 保留必需的 `reasoning_content` 重放，同时保持库存 OpenAI/Qwen 剥离路径完整。修复 #82139。感谢 @yimao。
- **Memory Search**：停止对 memory 和 QMD watchers 使用 chokidar 写稳定性轮询，使大型 Markdown extraPath 树不再积累常规文件描述符；更改的文件现在通过现有的防抖同步队列稳定。（#81802）修复 #77327 和 #78224。感谢 @frankekn、@loyur 和 @JanPlessow。
- **Message Tool**：将从模型暴露的 Discord channel-create schema 字段从 `type` 重命名为 `channelType`，避免 NVIDIA NIM JSON Schema 解析器失败，同时仍接受遗留 `type` 工具调用。（#78920）感谢 @YashSaliya。
- **飞书**：发送 CardKit 流式卡片作为已投递的增量并重试失败的更新，防止重复或丢失流式文本。修复 #82417。（#82419）感谢 @hclsys。
- **Gateway/Gmail**：在热重载前停止排队的 post-ready Gmail sidecar 并中止过时的 Tailscale 设置，使取消的 watcher 重启无法重写旧的公共 hook 目标或将中止杀死的命令报告为成功。（#82395）感谢 @samzong。


## 🚀 v2026.5.14（官方 2026-05-15）

### 🔧 功能调整（Changes）

- **Channels/SDK**：新增标准化命令 turn 事实到 channel turn 构建，并向插件入站上下文暴露命令 turn 辅助函数。
- **Agent/Config**：支持每 agent 的 bootstrap profile 覆盖 `contextInjection`、`bootstrapMaxChars` 和 `bootstrapTotalMaxChars`，省略时继承 `agents.defaults`。修复 #69966。感谢 @BunsDev。
- **Dependencies**：将根 ambient Node 代理路由通过 `@openclaw/proxyline`，并移除根 `proxy-agent`、`https-proxy-agent` 和 `minimatch` 依赖。
- **Canvas**：延迟加载 HTTP host、托管媒体解析器、CLI 实现和工具运行时模块，使 Gateway 启动仅在首次使用时支付 Canvas 实现成本。（#82001）感谢 @samzong。
- **Control UI/i18n**：新增 `pnpm ui:i18n:report` 基线报告，用于硬编码复制重点区域和 locale 回退元数据。（#81320）感谢 @samzong。
- **维护工具**：新增仓库本地 `codex-review` skill 用于 Codex 收尾审查，包括本地粗活和 PR 分支审查辅助函数，重复运行直到没有可接受/可操作发现并避免使用 `--base` 的不支持内联提示。
- **维护工具**：在 pull requests 添加 package patch 文件或 pnpm 补丁依赖时失败 CI，保持上游和 bump 依赖工作流。
- **Codex App-Server**：将评论序言流式传输到可编辑 channel 进度草稿而不将其提升为最终答案。
- **Codex Migration**：移除捆绑的 `codex-cli` 后端并将遗留 `codex-cli/*` 模型引用修复到 `openai/*` 上的 Codex app-server 路由。
- **Gateway/Plugins**：新增描述符支持的 gateway 方法注册表，使插件自有的 RPC 方法携带范围元数据，保留隐藏的核心冲突检查，并使广告方法列表与内部核心处理程序保持分离。（#82063）
- **Gateway/Startup**：新增 owner 级启动追踪归因用于 auth、插件加载、查找计数和插件 sidecar 服务。（#81738）感谢 @samzong。
- **Plugins/Hooks**：在 `llm_output` 和清理后的 `model_call_*` hook 事件/上下文中暴露解析的有效 `contextTokenBudget` 以及源/引用元数据，使插件成本和上下文健康警报可以使用 agent 级上下文上限。修复 #64327。感谢 @BunsDev。
- **Channels/Status Reactions**：将 `StatusReactionController` 接入 WhatsApp 消息 turns（queued → thinking → tool → done/error 生命周期，与 Telegram 和 Discord 并列），新增 `deploy`/`build`/`concierge` emoji 类别并通过工具 token 路由，并用自解释 emoji 替换状态反应默认（🧠 thinking, 🛠️ tool, 💻 coding, 🌐 web, ⏳ stallSoft, ⚠️ stallHard, ✅ done, ❌ error, 🗜️ compacting），使停滞和生命周期反应作为状态指示器而非情绪评论阅读。修复 #59077。（#80612）感谢 @gado-ships-it。
- **Control UI**：在外观和快速设置中新增浏览器本地文字大小设置，缩放聊天和密集 UI 文本，同时将输入保持在移动 Safari 焦点缩放阈值以上。修复 #8547。感谢 @BunsDev。
- **Gateway/Plugins**：为选定的控制平面方法新增默认关闭的 `admin-http-rpc` 插件，包含安全文档且无核心端点配置。（#81806）感谢 @liorb-mountapps。
- **Docs**：新增专用 ds4 provider 页面，包含本地 DeepSeek V4 Flash 配置、按需启动、上下文大小调整和实时验证步骤。
- **Release Validation**：新增包已安装 Docker 用户旅程通道，验证 onboarding、mocked 模型设置、外部插件 install/uninstall、ClickClack 出站/入站消息传递、Gateway 重启存活和 doctor。
- **Release Validation**：新增包已安装 Docker 通道用于真实 TTY onboarding、媒体和内存持久化、已发布包升级旅程和本地 marketplace 插件 install/update/uninstall 覆盖。
- **维护者**：新增 Clawdtributor skill 用于 Discrawl 支持的贡献者 PR 分诊、实时状态检查和紧凑审查格式化。
- **Telegram**：在通用消息呈现负载中支持 Mini App `web_app` 按钮，允许 `openclaw message send --presentation` 为私人聊天渲染 Telegram Web App 内联按钮。（#81356）感谢 @jzakirov。
- **Scripts**：新增 `OPENCLAW_HEAVY_CHECK_LOCK_SCOPE=worktree`，使高容量本地 worktrees 可以使用独立的重检锁而共享锁保持默认。修复 #80729。（#80734）感谢 @samzong。
- **Agent/Subagents**：在子 session 的第一条可见 `[Subagent Task]` 消息中传递原生 `sessions_spawn` 任务，而非将任务隐藏在 sub-agent 系统提示中，保持委托可审计而不重复 token。修复 #78592。感谢 @bradestes 和 @stainlu。
- **Messages/Queue**：通过 `/queue steer` 使中 turn 提示默认转向活动运行，为想要消息默认排队的用户保留 `/queue followup` 和 `/queue collect`，并在转向不可用时使 `/steer` 继续作为正常提示。（#77023）感谢 @fuller-stack-dev。
- **Voice Call/Telnyx**：为对话式语音通话新增实时媒体流通话支持。（#81024）感谢 @dynamite-bud。
- **Dependencies**：新增发布依赖证据报告、npm advisory gating 和 PR 依赖变更感知，使维护者可以在发布期间和发布前审查依赖风险。感谢 @joshavant。
- **Gateway**：在 agent 事件负载上暴露可选的 `isHeartbeat` 元数据，使客户端可以区分调度的 heartbeat 运行和普通聊天运行。（#80610）感谢 @medns。
- **Agents**：新增 `agents.defaults.runRetries` 和 `agents.list[].runRetries` 配置用于嵌入式 Pi runner 重试循环限制。（#80661）感谢 @medns。
- **Codex**：新增节点支持的 Codex CLI session 列表和绑定，使 OpenClaw 对话可以继续在配对节点上运行的现有 Codex CLI session。

### 🐛 问题修复（Fixes）

- **Models/Providers**：信任配置的自定义/本地 provider `baseUrl` origin 用于受保护的模型 HTTP 请求，使 loopback、LAN、tailnet 和私有 DNS 端点无需广泛私有网络访问即可工作，同时不同的端口和元数据/link-local pivots 仍被阻止。修复 #80732。（#80751）感谢 @Kaspre 和 @msitarzewski。
- **Bind**：在组合选项后绑定 shell script 操作数 [AI]。（#81882）感谢 @pgondhi987。
- **fix(Canvas)**：验证快照响应格式 [AI]。（#81881）感谢 @pgondhi987。
- **约束 Provider Catalog 条目路径** [AI]。（#81884）感谢 @pgondhi987。
- **要求规范节点平台 ID** [AI]。（#81880）感谢 @pgondhi987。
- **Agent/Azure OpenAI Responses**：默认将未设置的 Azure OpenAI API 版本设为 `preview`，使 `/openai/v1/responses` 调用使用 Azure 的当前 Responses API 路由。（#82026）感谢 @leoge007。
- **Control UI/WebChat**：将桌面聊天 header 控件压缩为单一对齐行，使 session、模型、思考和操作控件不再浪费垂直空间。感谢 @BunsDev。
- **Agent/Model Catalog**：在加载持久化只读 catalog 行时重用 manifest 模型 ID 规范化元数据，避免重复元数据扫描。
- **Agents**：为通用 `anthropic-messages` providers 重试空最终 turns，而非将非可见恢复限制为 Kimi，使自定义/代理 Anthropic 兼容路由可以用可见答案恢复。解决 #46080。感谢 @wmgx、@w1tv 和 @iFwu。
- **Agent/Replies**：从用户可见的 sanitizer 路径中剥离工作流 `<function_response>` 脚手架，使原始工具输出不会泄露到聊天历史、transcript 镜像或 channel 回复。修复 #47444。感谢 @5toCode。
- **Agent/Media**：通过结构化附件投递生成的图像、音乐和视频结果，将 message-tool-only Codex 完成保留在 message 工具上，并在预期媒体未实际发送时使完成交接失败。
- **Diagnostics/Codex**：在较短的默认停滞运行窗口后恢复停滞的嵌入式 Codex app-server 运行，使排队的 turns 更快恢复。
- **Codex App-Server**：在本地 OpenAI Codex 刷新 token 被拒绝时在运行时回退到同账户 Codex CLI OAuth token，而不覆盖规范 OpenClaw auth profile。修复 #82069。感谢 @aaajiao。
- **Control UI**：每次构建轮换浏览器 service-worker 缓存，使更新的 Gateway 不太可能继续服务触发协议不匹配错误的过时 dashboard 捆绑包。
- **Gateway/Protocol**：在首次使用时延迟编译协议验证器，而非在冷导入时编译每个 AJV schema，减少启动 CPU 和 RSS。（#82064）感谢 @samzong。
- **File Transfer**：延迟加载 node.invoke 策略执行，使 gateway 启动仅在文件传输命令运行前注册静态命令元数据。（#82211）感谢 @samzong。
- **Discord**：在启动期间报告未解析的配置 bot-token SecretRefs，而非将账户视为未配置。（#82009）感谢 @giodl73-repo。
- **Discord**：在通过暂存临时文件转码语音消息音频时向 ffmpeg 传递显式 Ogg muxer，恢复 TTS 语音消息投递。修复 #82074。感谢 @hwlbb。
- **Discord/飞书**：允许 Discord 语音上传通过 RFC2544 假 IP 代理 DNS，并通过显式 Ogg muxer 传递飞书语音 ffmpeg 转码。（#82088）感谢 @hwlbb 和 @6peng888。
- **Audio/STT**：为 whisper-cli 和 WhatsApp 暂存 temp 输出向 ffmpeg 传递显式 WAV/Ogg muxers，使 `.part` 文件名不会破坏转录或语音消息投递。修复 #82094。（#82110）感谢 @civiltox。
- **CLI/Config**：在 `config patch` 递归合并期间保留看起来像数字的对象键（如 Discord guild ID）。（#81999）感谢 @giodl73-repo。
- **Gateway/OpenAI-Compatible HTTP**：将 `/v1/chat/completions` 请求的 `response_format` 通过 agent 流参数转发到上游 Chat Completions 和 Responses 传输，恢复结构化输出支持。修复 #82003。（#82004）感谢 @Lellansin。
- **Control UI/WebChat**：让侧边栏 markdown 代码块复制按钮使用与聊天消息相同的委托剪贴板处理程序。（#58709）感谢 @tikitoki。
- **Discord/Streaming**：仅在最终编辑或回退投递成功后将部分草稿预览标记为已投递，使失败的定稿清理移除过时的截断草稿而非将其留为可见回复。修复 #82035。感谢 @compoodment。
- **macOS/Gateway**：在 `openclaw gateway status --deep` 和 doctor 中展示剩余的 `ai.openclaw.update.*` launchd 更新器作业，使更新后的 launchd 循环指向陈旧作业清理。修复 #81859。感谢 @BKF-Gitty。
- **macOS/Screen Snapshots**：在捕获前拒绝格式错误的 `screen.snapshot` 参数，根据预期的 `node.invoke.result` 帧绑定 base64 结果，并为 oversized 负载和捕获失败保留稳定的面向调用方错误。修复 #68181。感谢 @shaun0927 和 @BunsDev。
- **Config/Doctor**：按 artifact 时间戳轮换上限的 `.clobbered.*` 修复快照，使重复修复保留最新的取证副本而非仅保留第一个上限集。（#82012）感谢 @Kaspre。
- **Telegram**：在隔离轮询排出 spooled 更新前初始化 bot，使默认隔离轮询不再用 `Bot not initialized` 重试每个更新并停滞回复。修复 #81973。（#81975）感谢 @neeravmakwana。
- **Codex App-Server**：将 Codex 运行时压缩保持在原生 Codex 线程上，在过时的 OpenClaw 压缩汇总器覆盖被忽略时发出警告，并让 doctor 移除那些不支持的覆盖，避免使用 Codex OAuth token 的公开 OpenAI Responses 汇总。修复 #82008。（#82027）感谢 @pashpashpash。
- **Telegram**：将方法感知的 Bot API 请求超时应用于直接消息/动作客户端，使 `openclaw message delete --channel telegram` 不再在 API 请求卡住时等待 grammY 的 500 秒默认。修复 #81908。感谢 @DashLabsDev。
- **Cron**：将尝试调度和组装上下文视为执行开始里程碑，使已达到后端调度的隔离 agent 作业由其配置的作业超时而非 60 秒预执行看门狗管理。修复 #81368。（#81871）感谢 @alexph-dev。
- **Doctor/Auth**：警告过时的每 agent OAuth auth profile 影子，并让 `openclaw doctor --fix` 移除本地影子使 agents 继承更新的 main-agent 凭证。
- **Status/Channels**：将插件设置加载失败的已配置 channels 显示为 `plugin load failed: dependency tree corrupted; run openclaw doctor --fix`，而非静默从 `openclaw status` 中删除它们。
- **Status/Update**：在 `openclaw status` 中显示待处理或失败的更新重启交接，并让 `openclaw update` 打印明确的 gateway 重启已验证、跳过或失败指导。
- **QA/Update**：新增 E2E 损坏插件依赖通道，验证 `status --all` 指导、`doctor --fix` 清理和 channel 状态恢复。
- **Discord/Channels**：使 `openclaw channels list --all` 优先使用可达的 Gateway 运行时账户状态并标记已配置但不可用的凭证，避免在 Discord 从仅服务环境运行时产生误报 `not configured` 输出。修复 #79343。感谢 @EricY019。
- **WhatsApp**：将文本斜杠命令标记为命令 turns，使授权的群组命令回复在 message-tool-only 群组回复模式下保持可见。（#81972）感谢 @barbarhan。
- **Providers/OpenCode Go**：停止向 Kimi K2.5/K2.6 发送不支持的推理参数，避免 OpenCode Go payload-validation 失败同时保留 DeepSeek V4 推理支持。
- **Providers/OpenRouter**：在保留有效 OpenRouter 推理回传的同时规范化无效的 Chat Completions 推理重放字段，避免后续 turn 500 而不影响库存 OpenAI 调用。（#82101）感谢 @sliverp。
- **Installer**：处理来自移动 refs 的非交互式 git 安装而无需 tag-fetch 冲突，同时在冻结 lockfile 安装上保持不可变 refs。（#81875）感谢 @keshavbotagent。
- **Codex App-Server**：每运行和压缩尝试注入原生客户端工厂，而非使用模块范围的测试状态，避免循环启动期间的时间死区读取。（#81148）感谢 @bdjben。
- **Plugin Skills**：在发布当前 skill 链接前替换生成的 Windows plugin-skill 目录，避免过时非符号链接条目的重复 `EINVAL` 警告。修复 #81432。（#81446）感谢 @hclsys 和 @vincentkoc。
- **Channels/Config**：将仅有 `enabled: true` 的 channel 条目视为已配置状态，使插件支持的 channels 可以从显式开关自动启用。修复 #81323。（#81331）感谢 @EvanYao826 和 @vincentkoc。
- **CLI/Update**：为外部交换的核心运行时新增更新定稿路径，在报告完成前从 post-doctor 配置和安装记录状态运行更新时 doctor 修复和插件收敛。感谢 @shakkernerd。
- **CLI/Update**：在更新后插件同步前刷新包更新 doctor 修复后的配置，避免包升级旅程期间的过时哈希冲突。
- **macOS/Gateway**：将托管 LaunchAgent 包自我更新交给 post-exit CLI 路径，并通过更新重启哨兵报告交接失败，而非让 agent 调用的更新保持待处理。修复 #81894。（#81945）感谢 @BKF-Gitty。
- **Agent/WebChat**：阻止其过时 `errorMessage` 匹配计费、auth 或速率限制模式的成功 assistant turn 轮换 profile、回退或呈现硬 `FailoverError`，除非当前尝试有真正的故障转移失败。（#70900）感谢 @truffle-dev。
- **Control UI/Usage**：移除重复的内部 Usage 页面标题，使共享 dashboard header 成为唯一页面标题。感谢 @BunsDev。
- **Control UI/WebChat**：在独立 safe-area insets 少报时保持移动 PWA composer 控件在 iOS home 指示器上方。修复 #77408。感谢 @BunsDev。
- **Control UI/Logs**：使 Gateway Logs 流高度响应视口并有最小高度下限，使较大的屏幕可以显示 substantially 更多的日志行而不会在较短的视口上折叠。（#53916）感谢 @extrasmall0。
- **ACP/Codex**：为通用 ACP 内部失败呈现编辑后的 Codex 包装器 stderr，并在隔离的 `CODEX_HOME` 中保留安全的 Codex 模型/provider 路由，使 `sessions_spawn(runtime="acp", agentId="codex")` 失败可操作。修复 #80079。（#80718）感谢 @leoge007。
- **Agent/Trace**：在合并的回退尝试证明主模型在获胜尝试前失败时将执行追踪标记为回退使用，保持 `/trace raw` 和 agent JSON 遥测一致。解决 #81213 中的回退遥测。感谢 @BKF-Gitty。
- **ACP**：将拒绝的超时配置选项视为尽力而为的提示，使 ACP turns 与不支持 `session/set_config_option` 超时键的适配器继续。修复 #81250。（#81603）感谢 @qkal。
- **Cron/Codex**：将精确命令调度的 agent turns 默认为轻量级 bootstrap 上下文，使自动化在加载工作区身份或内存上下文前运行命令。
- **Codex Cron**：为轻量级 app-server cron turns 禁用原生 Codex project-doc 加载，使调度的作业在 OpenClaw 抑制 bootstrap 上下文后避免 project-doc 注入。（#81822）感谢 @jalehman。
- **Codex Plugin/Gateway**：从 Codex app-server JSON-RPC 负载中剥离不成对的 UTF-16 代理，并让过时的回复工作恢复中止停滞的回复运行，防止格式错误的媒体 turns 卡住 gateway 通道。
- **Codex App Server**：强制 OAuth 刷新请求执行真正的 token 刷新，而非在刷新失败后重用不变继承的 auth-profile token。（#80738）感谢 @simplyclever914。
- **Control UI/WebChat**：通过 assistant-media ticket 路径将 `/tts audio` 回复渲染为可播放音频附件，与较旧的实时负载结构化音频兼容。（#81722）感谢 @Conan-Scott。
- **绑定 Gateway 审批访问到请求方元数据** [AI]。（#81380）感谢 @pgondhi987。
- **Telegram**：让隔离轮询同时排出独立 topics、DM 和 status/control 命令，同时保持同通道顺序。（#81849）感谢 @VACInc。
- **Telegram**：从 HTML 回退发送中派生可读的纯文本重试，使解析失败显示 `label (url)` 链接而非原始锚点。（#81764）感谢 @alexph-dev。
- **Ollama/Doctor**：在 `openclaw doctor --fix` 期间将显式原生 Ollama `contextWindow` 或 `maxTokens` provider/model 预算复制到 `params.num_ctx`，在原生 Ollama 停止推断每请求 `num_ctx` 后保留大上下文配置。修复 #81878。（#81928）感谢 @joshavant 和 @ArthurusDent。
- **Discord**：通过在成功投递后重命名线程来遵守对现有线程的 `message send` 上的 `threadName`，并在无法应用重命名时发出警告。修复 #81836。（#81933）感谢 @joshavant。
- **Build**：将外部化的 Slack、OpenShell sandbox 和 Anthropic Vertex 运行时依赖声明保持在根 dist artifact 构建之外。
- **ClawHub**：在发布的注册表元数据中包含 Amazon Bedrock 和 Bedrock Mantle provider 包，使外部 providers 可以从 ClawHub 和 npm 发现。
- **Codex/Account Status**：隐藏空的速率限制桶并显示服务器报告的使用限制块而不将其称为可用。
- **Auto-Reply/Claude CLI**：通过 `onReasoningStream` 将 CLI 运行时 assistant text-delta agent 事件桥接到聊天推理预览，镜像现有的 assistant-text（#76914）和 tool-event（#80046）桥接并添加门控使非 CLI 运行时不受影响。感谢 @anagnorisis2peripeteia 和 @pashpashpash。
- **Mantis**：将 QA 证据保留在 Actions artifacts 中，停止向 Git 支持的 artifact 分支发布证据文件。
- **CLI/Migrate**：处理延迟的 Codex plugin marketplace 响应，使警告、下一步和冲突状态用 ⚠️ 字形渲染，安装后迁移重试 marketplace 获取而非静默跳过 plugin 条目。（#81625）感谢 @sjf。
- **Channels/微信**：将捆绑的 `@tencent-weixin/openclaw-weixin` 外部条目升级到 `2.4.3`（从 `2.4.1`），使 onboarding 和 `openclaw channels add` 安装当前的腾讯微信（个人微信）plugin 发布。（#81730）感谢 @scotthuang。
- **CLI**：延迟加载模型、插件和设备运行时辅助函数，并将 channel 选项帮助保持在生成的启动元数据或通用回退文本上，使 parent/help 输出在导入这些运行时路径前渲染。
- **CLI**：通过解析的命令快速路径路由 `plugins list --json` 并将其包含在响应预算中，使 plugin JSON 清单避免完整的 CLI 注册工作。
- **Control UI/Overview**：通过共享 session 显示解析器渲染最近 session 行，使 label/displayName 优先级、key 等效 label 和 channel 回退与聊天选择器保持一致。（#50696）感谢 @Maple778 和 @BunsDev。
- **Gateway/Network**：将 OpenClaw 安装的 undici 调度器保持在 HTTP/1.1，并将销毁的 HTTP/2 session 错误视为可恢复的网络拆卸，防止 `ERR_HTTP2_INVALID_SESSION` 导致活动的 gateway turns 崩溃。修复 #81627。（#81838）感谢 @joshavant。
- **Memory/Daily-Files**：加宽由 Dreaming、rem-backfill、rem-harness、doctor 扫描和短期提升使用的每日内存文件匹配器，使由捆绑 session-memory hook 编写的 `memory/YYYY-MM-DD-<slug>.md` 文件（及任何未来 slugged 变体）与仅日期 `memory/YYYY-MM-DD.md` 形状一起被发现。日期提取仍使用前导 `YYYY-MM-DD` 捕获组，因此对现有仅日期文件的每日摄入/提升语义不变；slugged 文件现在通过相同路径流动而非被静默跳过。修复 #69536。感谢 @jack-stormentswe。
- **macOS/Gateway**：在清理后配置 gateway 端口仍然繁忙时使托管 LaunchAgent 停止和重启失败，而非在监听器存活时报告成功。修复 #73132。感谢 @BunsDev。
- **Telegram**：为定期 getMe 健康检查重用粘性 IPv4 Bot API 传输，使具有损坏 IPv6 出站的 IPv4 工作主机停止记录重复的探测超时。修复 #76852。（#76856）感谢 @SymbolStar。
- **Telegram**：在捆绑 worker 加载器使用的根 dist 路径上发送隔离轮询 worker，避免寻找 `dist/telegram-ingress-worker.runtime.js` 的启动失败。
- **Control UI/Gateway**：在无可用受信任设备 token 重试时停止过时的 token 不匹配重连循环，并通过原始工具输出大小限制渲染的聊天历史，使 dashboard auth/history 工作不能持续降级 channel 套接字。修复 #72139。感谢 @BunsDev。
- **Memory/Daily-Files**：在上限实时摄入和历史播种期间，在同日期 slugged session 捕获前优先规范 `memory/YYYY-MM-DD.md` 每日笔记，在 slugged 文件存在时保留现有每日笔记行为。
- **Gateway/OpenAI-Compatible HTTP**：在不信任格式错误的 Host 头的情况下解析共享 JSON 端点路径，避免在 `/v1/chat/completions`、`/v1/responses` 和 `/v1/embeddings` 请求处理前出现 500。
- **Telegram**：用活动运行时配置解析插件原生命令，使 `/codex ...` 等命令保持在原生命令路径上。
- **Voice-Call Webhooks**：在不信任格式错误的 Host 头的情况下解析 webhook 和实时升级路径，避免在 provider 签名检查或路径拒绝前出现 500。
- **Media Store**：将格式错误的重定向 `Location` 头拒绝为媒体下载失败，而非让 URL 解析逃逸出异步响应回调。
- **ClickClack**：跳过格式错误的实时 websocket 帧，而非在单个坏 JSON 事件上停止 channel 监视器。
- **Browser Tool**：将格式错误的节点代理 `payloadJSON` 响应视为浏览器代理失败，而非泄露原始 JSON 解析器错误。
- **Gateway HTTP**：在不信任格式错误的 Host 头的情况下匹配模型、session kill 和 session 历史路由路径，避免在这些端点上出现预 auth 500。
- **Google Meet/Codex**：用插件自有错误报告格式错误的节点代理 `payloadJSON` 响应，而非泄露原始 JSON 解析器失败。
- **Debug Proxy**：用受控 400 响应拒绝格式错误的相对形式代理目标，而非让 URL 解析逃逸出请求处理程序。
- **File Transfer**：在计算哈希或调用配对节点前拒绝格式错误的内联 `file_write` base64，避免 Node 的宽松 base64 解码器。
- **QA Channel**：跳过格式错误的内联入站附件 base64，而非为 agent turns 暂存静默损坏的媒体。
- **Microsoft Teams**：拒绝格式错误的内联 HTML 图像 base64 填充，而非解码损坏的 `data:` 图像附件。
- **Voice-Call Realtime**：在将音频转发到桥接和转录路径前忽略格式错误的 provider 媒体帧 base64。
- **QQBot**：在 JSON 解码结构化提醒数据前拒绝格式错误的存储 cron payload base64。
- **Telnyx Voice-Call**：在 webhook 状态是格式错误的 base64 时使用原始 `client_state` 回退，而非使用静默损坏的解码文本。
- **Google Meet**：用插件自有错误报告格式错误的主机参数 JSON，而非泄露原始 JSON 解析器失败。
- **CLI/Export-Trajectory**：用稳定的 CLI 错误报告格式错误的编码请求 JSON，而非泄露原始解析器输出。
- **ComfyUI**：用自有错误报告格式错误的工作流 API JSON 响应，而非泄露原始解析器失败。
- DeepInfra video: report malformed successful API JSON responses with provider-owned errors instead of leaking raw parser failures.
- **Brave Search**：用 provider 自有错误报告格式错误的网页和 LLM 上下文 API JSON，而非泄露原始解析器失败。
- **xAI Tools**：用 provider 自有错误报告格式错误的网页搜索、X 搜索和代码执行 JSON，而非泄露原始解析器失败。
- **Nextcloud Talk**：用 channel 自有错误报告格式错误的 room-info 和 bot-admin JSON，而非泄露原始解析器失败。
- **Microsoft Teams**：用 channel 自有错误报告格式错误的 Graph 和 delegated OAuth JSON，而非泄露原始解析器失败。
- **Google Chat**：用 channel 自有错误报告格式错误的 Chat API 和证书 JSON，而非泄露原始解析器失败。
- **Firecrawl**：用 provider 自有错误报告格式错误的搜索和抓取 API JSON，而非泄露原始解析器失败。
- **Tavily**：用 provider 自有错误报告格式错误的搜索和提取 API JSON，而非泄露原始解析器失败。
- **Perplexity**：用 provider 自有错误报告格式错误的搜索 API 和聊天完成 JSON，而非泄露原始解析器失败。
- **Exa**：用 provider 自有错误报告格式错误的搜索 API JSON，而非泄露原始解析器失败。
- **Memory Host SDK**：用调用方范围的错误报告格式错误的远程 JSON 用于 POST 和批量文件上传响应，而非泄露原始解析器失败。
- **Media Providers**：用 provider 自有错误报告格式错误的操作轮询和音频转录 JSON，而非泄露原始解析器失败。
- **MiniMax、Gemini、Kimi 和 Ollama 网页搜索**：用 provider 自有错误报告格式错误的 API JSON，而非泄露原始解析器失败。
- **图像和视频生成**：拒绝来自 OpenAI 兼容图像响应、DeepInfra 视频数据 URL 和 MiniMax 图像响应的格式错误 base64 负载，而非接受 Node 的宽松解码器输出。
- **Media MIME 嗅探**：在嗅探聊天/工具图像 MIME 类型前拒绝格式错误的 base64 负载，而非接受 Node 的宽松解码器输出。
- **Web Search**：在广告的工具 schema 中将托管的 `web_search` `query` 参数标记为必需，使遵循 schema 的本地模型停止发出在执行时失败的 `queries` 负载。修复 #82097。感谢 @SpidFightFR。
- **Twilio Voice-Call**：用 provider 自有错误报告格式错误的成功 API JSON 响应，而非泄露原始解析器失败。
- **Voice-Call Provider APIs**：用 provider 前缀错误报告格式错误的成功 guarded JSON 响应，而非泄露原始解析器失败。
- **实时转录**：用自有解析器错误报告格式错误的 provider websocket JSON 帧，而非泄露原始 `SyntaxError` 对象。
- **Microsoft Foundry**：用自有 auth 错误报告格式错误的 Azure CLI token JSON，而非泄露原始解析器失败。
- **Gateway/Model Pricing**：用源自有错误报告格式错误的外部定价目录 JSON，而非泄露原始解析器失败。
- **QA Lab**：用自有错误报告格式错误的模型目录子进程 JSON 并忽略无效的目录行。
- Google Meet: report malformed browser-control status JSON with plugin-owned errors instead of leaking raw parser failures.
- Google provider: report malformed SSE stream JSON with provider-owned errors instead of leaking raw parser failures.
- Node host: report malformed built-in invoke `paramsJSON` with stable invalid-request errors instead of leaking raw parser failures.
- **Amazon Bedrock Embeddings**：用 provider 自有错误报告格式错误的 provider 响应 JSON，而非泄露原始解析器失败。
- **QQBot**：用 provider 自有错误报告格式错误的 access-token JSON，而非泄露原始解析器失败。
- **OpenAI Embeddings**：用 provider 自有错误报告格式错误的批量输出 JSONL，而非泄露原始解析器失败。
- **Synology Chat**：用稳定的 channel 自有解析器错误报告格式错误的 JSON webhook 负载。
- **Mattermost**：用稳定的 channel 自有解析器错误报告格式错误的交互回调 JSON。
- **Twilio Voice-Call**：用自有解析器错误报告格式错误的媒体流 WebSocket JSON，而非记录原始解析器失败。
- **Tlon/Urbit**：用自有解析器错误报告格式错误的 SSE 事件 JSON，而非记录原始解析器失败。
- **Signal**：在 GitHub 发布元数据是格式错误的 JSON 时返回稳定的安装程序错误。
- **ClawHub**：用自有错误报告格式错误的成功 marketplace JSON 响应，而非泄露原始解析器失败。
- **Provider Usage**：用稳定的 provider 错误报告格式错误的成功使用 JSON 响应，而非泄露原始解析器失败。
- **Tlon/Urbit**：用自有错误报告格式错误的 scry 响应 JSON，而非泄露原始解析器失败。
- **LM Studio**：用自有错误报告格式错误的模型列表和模型加载 JSON，而非泄露原始解析器失败。
- **Matrix**：忽略可选位置 URI 参数中格式错误的百分比编码，而非让坏的 `geo:` 事件中止入站消息处理。
- **Web Search**：通过其遗留 `tools.web.search.apiKey` 兼容性回退自动检测 Brave，同时保持 doctor 迁移到 `plugins.entries.brave.config.webSearch.apiKey` 作为规范修复，使允许列表隔离 cron runs 不在迁移前报告 `web_search` 不可用。修复 #81538。感谢 @atomicmonk。
- **Plugins**：记忆化重复的进程内插件元数据快照，并使消失的托管安装残留不强制完整派生发现，减少大型插件集下 gateway/status 启动扫描。修复 #81143 和 #79806。（#81570）感谢 @Kaspre、@holgergruenhagen、@JanPlessow 和 @mjamiv。
- **CLI/Plugins**：仅在 JSON 输出命令注册期间将延迟插件命令注册聊天路由到 stderr，保持插件支持的 `--json` stdout 可解析而不改变仅解析或直通 `--json` 行为。修复 #81535。（#81536）感谢 @ScientificProgrammer 和 @vincentkoc。
- **Plugins**：将 git plugin 安装 refs 视为 refs 而非 checkout 标志，使类似选项的选择器 checkout 失败而非静默安装默认分支。修复 #79898。（#79901）感谢 @afurm 和 @vincentkoc。
- **Doctor/Memory**：在启用的备用 memory plugin 显式拥有 memory 槽时停止警告没有活动的 memory plugin，同时为缺失或禁用的槽条目保留警告。修复 #78540。（#78557）感谢 @carladams1299-lab 和 @vincentkoc。
- **Plugins**：将进程本地插件元数据快照记忆新鲜度与缓存的注册快照绑定，使策略过时的派生插件元数据编辑使记忆失效，而非返回过时的所有者或命令别名。（#81064）感谢 @Kaspre。
- **Plugins**：在 provider 发现期间从 `setup.providers[].envVars` 凭证发现 provider plugins，同时保持已弃用的 `providerAuthEnvVars` 回退。（#81542）感谢 @JARVIS-Glasses。
- **Docs/Codex Harness**：澄清每 agent `CODEX_HOME` 隔离 `~/.codex`，而继承的 `HOME` 有意保持 `.agents` 发现和子进程用户主目录状态可用。
- **CLI/Plugins**：将裸插件和父命令帮助保持在轻量级路径上，避免在渲染帮助前进行插件注册发现。
- **Auth**：在重试锁定写入前回收死所有者过时的文件锁，使崩溃的 OAuth 刷新不再楔入 `auth-profiles.json` 直到手动清理。
- **CLI Tables**：在多行单元格后的包装 continuation 行上保留静音/颜色样式，保持 `openclaw plugins list` 描述可读。
- **进程执行**：在 Windows 上折叠不区分大小写的重复子环境键，使调用者提供的覆盖（如 `PATH`）不会被 host `Path` 遮蔽。
- **Browser CLI**：为浏览器控制命令显式请求现有的 `operator.admin` gateway 范围，避免不必要的范围升级批准循环。修复 #81555。（#81716）感谢 @joshavant。
- **Web**：在 provider 所有权解析期间遵守显式配置的全局 `web_search` providers，同时将沙盒 `web_fetch` 限制为捆绑 providers。
- **Plugins/Doctor**：通过将 npm 包重新安装到托管 plugin 根目录来修复配置的遗留 npm 声明存根，而非加载 workspace `node_modules`，并在发现看到这些存根时发出警告。修复 #79632。感谢 @Dylanzhang1128 和 @vincentkoc。
- **Channels**：当第三方 channel plugins 的 manifest 声明 `channels` 但尚未添加 `channelConfigs` 元数据时，在 `openclaw channels list` 中保持可见。修复 #81334。（#81340）感谢 @AllynSheep 和 @vincentkoc。
- **Agents**：在没有待处理工作区 bootstrap 时，在完成的 `continuation-skip` turns 上跳过 bootstrap 文件和 hook 预加载工作，减少隔离 agent 准备延迟而不改变首次 turn bootstrap 行为。修复 #81548。感谢 @delizaran-unpa。
- **Config**：针对插件自有的 channel schema 验证 JSON 干运行，使外部 channel 字段不被过时的捆绑 schema 拒绝。修复 #77887。（#81504）感谢 @giodl73-repo。
- **iOS**：恢复首次使用的联系人、日历和提醒权限提示，并在设置中添加隐私和访问状态/操作。感谢 @BunsDev。
- **Canvas**：对格式错误的百分比编码 Canvas/A2UI/document 资产路径返回未找到，并在路径规范化前保持解码的父遍历被阻止。
- **Telegram**：允许文件名以点开头的受信任本地 Bot API 媒体文件，而非回退到远程下载。
- **Agent/Codex App-Server**：当运行切换到有效沙盒工作区时，重映射在点-点前缀工作区目录下的注入上下文文件。
- **Control UI/i18n**：使用安装的工作区 pi 运行时进行 locale 刷新，更新回退包 pin，并在凭证无效时跳过计划的刷新而非使主程序失败。
- **CI/Performance**：在 checkout 和 publish 期间都对 clawgrit 报告仓库远程进行认证，使性能报告推送在基准测试完成后不会失败。
- **Hooks**：从点-点前缀目录加载工作区相对遗留 hook 模块，而不将文件名前缀视为父遍历。
- **Plugins**：保留 dot-dot 前缀目录下插件包路径的已安装包元数据和持久化注册新鲜度检查。
- **Agents**：允许通过沙盒 FS 桥、远程沙盒读取和 apply_patch 摘要传递点-点前缀文件名（如 `..note.txt`），而不将名称误认为父遍历。
- CLI/migrate: hide per-item source/plugin hints on non-conflicting Codex skill and plugin selection prompts, keeping the hint text reserved for rows that actually need attention. Thanks @sjf.
- **Codex Harness**：将高置信度 app-server OAuth 刷新 invalidation 视为终端 auth-profile 失败，停止重复的原始 token-refresh 错误而不将授权或使用限制负载转换为重新 auth 提示。
- **CLI/Migrate**：在迁移 UI 中将 Codex 冲突状态消息人性化，使选择提示和计划/结果行显示 "Codex skill already installed in workspace" 而非呈现内部 `MIGRATION_REASON_*` 代码。感谢 @sjf。
- **CLI/Migrate**：用不同字形渲染迁移结果行用于手动审查（🔍）和归档（📖）条目，而非误导性的 "skipped" 和 "migrated" 勾选，使用户可以看到哪些条目仍需关注与哪些已被归档。感谢 @sjf。
- **CLI/Migrate**：将 Codex 迁移输出拆分为独立的预览和结果阶段，使 Before 计划和 After 结果通过 clack 渲染，具有独立可调的内容。感谢 @sjf。
- **Codex App-Server**：将捆绑和用户 MCP 服务器投影到 Codex 线程，在 MCP 服务器禁用时轮换线程，将捆绑 MCP 注入限定为捆绑服务器，并在恢复时重新发送用户 MCP 配置，使 MCP 更改在会话中途生效而无需重启 agent。（#81551）感谢 @jalehman。
- **Codex Migration**：调用托管 Codex binary 而非过时的系统 `codex` 用于源码配置迁移计划，使运行捆绑 Codex 运行时的用户获得的计划输出与 gateway 实际使用的 binary 匹配。（#81582）感谢 @fuller-stack-dev。
- **Subagents/维护**：在 session-store 清理、修剪和磁盘预算执行期间保留待处理的 subagent 注册 session，使进行中的 subagent runs 不会在完成前被后台维护删除。（#81498）感谢 @ai-hpc。
- **Control UI/Chat**：将终端和重连运行清理与缓存 session 活动、陈旧压缩/回退指示器和紧凑 composer 运行状态 chip 协调，使完成或中断的 turns 不再使 Stop 保持活动。修复 #76874 和 #64220；refs #71630。感谢 @BunsDev。
- **维护工具**：澄清哪些 pnpm test/check 命令在本地是安全的与在 Codex worktrees 内相比，通过节点包装器和 Crabbox/Testbox 路由链接-worktree 门控。
- **Auto-Reply**：在防抖入站工作回退到立即刷新时保留同键排序，使后续 turns 无法超越活动的缓冲刷新。
- **Telegram/WhatsApp**：保持 Telegram 同聊回复在活动无延迟 turns 后有序，而不阻止 WhatsApp 后续消息调度。
- **Codex Migration**：在 app-server plugin 清单可用时避免重复缓存的 plugin 捆绑警告。
- **Agents**：在面向用户投递前抑制中止的嵌入式 assistant 部分、推理文本、回复指令和陈旧先前的回复，同时保留干净的超时/错误负载。修复 #48241。感谢 @BunsDev、@andyliu 和 @yassinebkr。
- **Agents**：在工作区和沙盒路径策略内允许点-点前缀文件名（如 `..file.txt`），同时仍拒绝真正的父遍历。
- **原生图像输入**：在纯提示中检测 Windows 驱动器图像路径，使 `C:\...\screenshot.png` 引用不会被错过。
- **Media**：在暂存附件、远程媒体、音频转码和保存媒体显示名称前规范化 Windows 风格文件名提示，使 POSIX hosts 不在生成的的文件名中保留驱动器或目录文本。
- **媒体引用**：解析 ID 以点开头的第一级入站媒体文件，而非将 `..photo.png` 等名称视为父遍历。
- **iOS/Chat**：在暂存和发送前将 PhotosPicker 图像附件调整大小为上限 JPEG，剥离源元数据并将过大的相机照片保持在聊天上传预算下。修复 #68524。感谢 @BunsDev。
- **Control UI**：在触摸主设备上保持共享表单、配置和使用文本输入控件为 16px，同时保持聊天 composer 输入大小，使 iOS Safari 不再自动缩放聚焦字段。修复 #64651；继承 #64673。感谢 @NianJiuZst 和 @BunsDev。
- **Agent/Trajectory**：使 trajectory 刷新清理超时可配置，带有 `OPENCLAW_TRAJECTORY_FLUSH_TIMEOUT_MS`，保留 10s 默认同时让较慢的存储排出。 Refs #75839。感谢 @BunsDev。
- **Skills**：从托管 `~/.openclaw/skills` 和个人 `~/.agents/skills` 根目录加载 ClawHub 和本地管理器 skill 目录符号链接，同时保持 workspace、extra、bundled 和每 skill `SKILL.md` 包含 fail-closed。修复 #44051。 Refs #59219。感谢 @Devattom、@ArthurNie 和 @luoxiao6645。
- **Config**：在写时塑造后从 `config.set`、`config.apply` 和 `config.patch` 响应返回规范持久化配置。修复 #77455。
- **Codex Auth**：在运行时 auth 选择期间接受由 `oauthRef` 支持的 OAuth profiles，使官方 Codex OAuth 登录用于 app-server agent 运行。（#81633）感谢 @obviyus。
- **Telegram**：在 gateway 停止宽限期后释放停止的轮询租约，使进程内重启可以重用相同的 bot token 而不削弱活动重复轮询保护。修复 #81507。（#81890）感谢 @joshavant。
- **ACP**：在运行时失败文本中保留编辑的数字 JSON-RPC `RequestError` 细节，使后端诊断可见而非仅 `Internal error`。修复 #81126。（#81188）感谢 @vyctorbrzezowski。
- **Agents**：缓存不变的 PI 模型发现存储和模型查找，减少大型模型配置下重复的模型解析启动延迟。修复 #78851。
- **Onboarding**：将返回的 Codex plugin 迁移配置贯穿 OpenAI 模型向导，使接受的 plugin 迁移与最终配置写入一起保存。
- **安全/Windows ACL 审计**：将 Anonymous Logon、Guests、Interactive、Local 和 Network SID 分类为世界等价主体，使广泛可写路径保持关键而非被降级为组可写。修复 #74350。（#74383）感谢 @dwc1997。
- **媒体理解**：在音频或视觉处理前重试瞬态远程附件获取失败，使 Discord 语音笔记不会在一次网络/CDN 故障后丢失。修复 #74316。感谢 @vyctorbrzezowski 和 @gabrielexito-stack。
- **Control UI**：将带时间戳的实时流和工具项排序在无时间戳历史回退之前，保持聊天历史按可见时间顺序。修复 #80759。（#81016）感谢 @akrimm702。
- **ClawHub**：取消 skill、package 和 ClawPack 下载的停滞存档正文读取，而非在标题到达后让安装挂起。修复 #52073。 Refs #80006。感谢 @xinhuagu 和 @stainlu。
- **macOS/Chat**：在刷新的聊天历史中从 `errorMessage` 渲染持久化的 assistant provider 失败，同时保持过时的非错误 provider 细节隐藏。（#65689）感谢 @javierdici。
- **Control UI/Config**：从表单模式配置保存中丢弃过时的编辑占位符，同时保留可恢复的保存 secrets，使无关设置更改不再提交 `__OPENCLAW_REDACTED__` 作为真实数据。修复 #60917。感谢 @giodl73-repo 和 @BunsDev。
- **OpenAI Plugin**：澄清远程 Codex OAuth 登录副本，使隧道用户知道登录可能在他们粘贴重定向 URL 前自动完成。（#81301）感谢 @rubencu。
- **SGLang**：为 OpenAI 兼容聊天补全保留重放的推理历史，使有思考能力的本地模型不会丢失先前的推理 turns。（#81091）感谢 @akrimm702。
- **Plugins/Install**：从 npm 的 lockfile planner 派生托管对等依赖 pin，而非递归扫描 `node_modules`，同时将 OpenClaw host 对等体保持在托管根所有权之外并保留活动的根托管运行时。感谢 @fuller-stack-dev。
- **Control UI/WebChat**：通过在分组聊天渲染器中应用现有保留的动作间距，使短 assistant 回复与气泡内复制/打开动作按钮保持清晰。修复 #79509。（#81244）感谢 @JARVIS-Glasses。
- **Codex Harness**：使实时测试包装器可移植到 Windows 并延迟锁定 temp 清理，使原生 Windows 和 WSL2 实时运行完成。
- **链接理解**：在运行配置的 CLI 摘要器前通过 SSRF guard 获取页面内容，防止 curl/wget 风格链接获取器到达私有重定向或 DNS 反弹目标。
- **fix**：加固 safe-bin 参数验证 [AI]。（#80999）感谢 @pgondhi987。
- **Codex/Status**：通过显示剩余配额和紧凑重置持续时间而非已用配额和原始 ISO 时间戳，将 `/codex status` 速率限制措辞与 `/status` 对齐。感谢 @MatthewSchleder。
- **Mattermost**：当实质性（非推理）最终回复负载到达 `deliverMattermostReplyPayload` 但底层 `deliverTextOrMediaReply` 返回 `"empty"` 时记录结构化 `mattermost no-visible-reply` 诊断——之前运行完成时带有误导性的 `delivered reply to <channel>` 日志，即使没有发生 Mattermost API 发送，掩盖了 channel/thread 上下文中的静默完成。无行为变化；诊断呈现失败使运营商可以检测到它，而非看到 agent 看起来保持沉默。修复 #80501。感谢 @robbyproc87。
- **Telegram**：限制跨多账户 bot 的并发启动 `getMe` 探测，使大型 Telegram 配置在 gateway 启动期间不会同时扇出所有账户探测。 Refs #80695。（#80986）感谢 @stainlu。
- fix(config): reject auto-managed meta.lastTouched\* paths in config set/unset (#80856). Thanks @ai-hpc
- **Test State**：为生成的 homes 植入隔离 auth-profile secret keys，防止 helper 支持的证明运行回退到 host Keychain secrets。（#81393）感谢 @altaywtf。
- **Plugins/Update**：在更新失败后禁用插件时清除过时的 allow/deny 条目和选定的插件槽，保持失败的外部插件更新不留下半禁用配置。（#81512）感谢 @JARVIS-Glasses。
- **Memory/LanceDB**：使自动捕获识别短 CJK 记忆短语和可配置的字面触发器，使中文、日语和韩语用户可以捕获记忆而无须 regex 或 LLM 意图检测。修复 #75680。感谢 @vyctorbrzezowski 和 @guokewuming。
- **Plugins Doctor**：报告过时插件配置警告，并在配置警告存在时避免声称完整的插件健康。（#81515）感谢 @BKF-Gitty。
- **Sessions**：在 `openclaw sessions` 输出中为 ACP 控制平面 session 显示 `model: "<agentId>-acp"` / `modelProvider: "acpx"` (ACP-runtime sentinel)，而非 agent 配置的模型（具有误导性）。目录发现 20。（#79543）
- **Slack**：在调用 Slack 历史或线程回复 API 前规范化消息读取 `before` 和 `after` 时间戳边界。修复 #80835。（#81338）感谢 @honor2030。
- **Gateway**：在流式突发期间限制 assistant/thinking agent 事件扇出而不丢弃缓冲增量。（#80335）感谢 @samzong。
- **Models**：在 `/models` 选择器中恢复已认证的 CLI 运行时 providers，同时将遗留运行时别名从设置/默认模型选择中隐藏。关闭 #81212。（#81239）感谢 @anagnorisis2peripeteia。
- **Changelog 门控**：拒绝 bot/app 句柄作为 `Thanks` 归属，并要求 bot/app 创作的 changelog 条目有明确的 human credit。（#81357）感谢 @hxy91819。
- **Agent/Heartbeat**：修复了破坏多 agent 心跳节奏的七个分层问题——（1）通过 `Promise.all` 并行地向 agents 扇出调度器广播唤醒，而非顺序地等待每个 `runOnce`，使一个做实际工作的 agent 不再在迭代顺序中饿死每个后续 agent；（2）将 `skipWhenBusy` 限定到通过 session 键解析（`session:agent:<id>:…` / `nested:agent:<id>:…` 通道名称）归因于触发 agent 的通道，而非咨询全局 `subagent` 通道，使在一个 agent 上的单个卡住 subagent 不再静默禁用每个其他 agent 的心跳；（3）始终将工作区 `HEARTBEAT.md` 指令（可选 `tasks:` 块之外的所有内容）追加到调度提示，使 prose-runbook `HEARTBEAT.md` 文件直接到达模型而非被静默丢弃除非声明了周期性任务；（4）在 `streamWithIdleTimeout` 内将初始流建立承诺与之前仅守卫 token 间间隙的同一看门狗定时器竞速，使卡在 TCP/TLS 握手或第一个响应字节之前的 SDK 请求不再无限挂起（停滞 session 诊断的 `recovery=none` 情况）；（5）在 `heartbeat.session` 引用的 session 键在 agent 的 session store 中没有条目时发出 `openclaw doctor` 警告，使静默丢弃的心跳投递在配置验证时浮出水面；（6）也将仅承诺任务调度路径（配置了任务，但没有到期）通过 `appendHeartbeatFileDirectives` 路由，使 `tasks:` 块外的 prose 指令也在这条路径上到达模型；（7）在 `streamWithIdleTimeout` 中将同步 `baseFn(...)` 调用包装在 try/catch 中，在重新抛出前清除连接看门狗定时器，使在设置期间抛出的 provider 流函数不再留下可以在稍后带有过时错误触发 `onIdleTimeout` 的活动定时器，并在真实失败后让进程保持打开。感谢 @zeroaltitude。
- **Matrix**：停止从父派生插件路径在运行时运行 `npm install`/`pnpm install`；缺失的 Matrix 运行时依赖现在失败并带有修复指导，而非更改错误的 `node_modules` 树。修复 #80758。（#80876）感谢 @kinjitakabe。
- **Agent/Memory-Flush**：将非中止内存刷新失败（provider 超时、传输错误、通用 agent 失败）呈现为可见回复负载，使外层回复循环短路，隔离 cron runs 将错误传播到 `meta.error`，而非以 `status: "ok"` 和空负载静默完成。之前仅呈现特定 "Memory flush writes are restricted to ..." 消息。修复 #80755。感谢 @nailujac。
- **Channels/Loop-Guard**：在核心 channel-turn 内核中强制执行共享的每对 bot 循环保护，Discord、Slack、Matrix 和 Google Chat 在可以可靠识别已接受 bot 创作消息的地方提供 bot 对事实。通用 guard 键在 `(scope, conversation, participant pair)` 上，一旦一对跨越配置预算则抑制每个方向的额外 bot-to-bot 事件，并在 `cooldownSeconds` 后解除抑制。默认值在 channel 让 bot 创作消息到达调度的任何时候为 `maxEventsPerWindow: 20`、`windowSeconds: 60` 和 `cooldownSeconds: 60`；可以通过 `channels.defaults.botLoopProtection` 全局设置，并通过每 channel/account 或支持的每会话配置覆盖。修复 #58789。感谢 @pandadev66。
- **Agent/Memory-Flush**：将非中止内存刷新失败（provider 超时、传输错误、通用 agent 失败）呈现为可见回复负载，使外层回复循环短路，隔离 cron runs 将错误传播到 `meta.error`，而非以 `status: "ok"` 和空负载静默完成。之前仅呈现特定 "Memory flush writes are restricted to ..." 消息。 Refs #80755。感谢 @kinjitakabe 和 @nailujac。
- **Codex Harness**：将活动 Codex 运行时上下文窗口用于 OpenAI 选择的预算、手动 `/compact` 和 `/status`，使过时的 OpenAI session 元数据不再夸大上下文限制。（#81906）感谢 @jalehman。


## 🚀 v2026.5.12（官方 2026-05-14）

### 🔧 功能调整（Changes）

- Amazon Bedrock: externalize the Bedrock and Bedrock Mantle provider packages so core installs no longer pull AWS SDK dependencies unless those providers are installed.
- Plugins: externalize Slack, OpenShell sandbox, and Anthropic Vertex so their runtime dependency cones install only when those plugins are installed.
- Control UI/WebChat: add a persisted auto-scroll mode selector so users can keep the current near-bottom behavior, always follow streaming output, or turn automatic streaming scroll off and use the New messages button manually. Fixes #7648 and #81287. Thanks @BunsDev.
- ACP: add `acp.fallbacks` so ACP turns can try configured backup runtime backends when the primary backend is unavailable before any output is emitted. (#69542) Thanks @kaseonedge.
- Gateway/OpenAI HTTP: honor `max_completion_tokens` and `max_tokens` on inbound `/v1/chat/completions` requests so client-provided token caps reach the upstream provider via `streamParams.maxTokens`, with `max_completion_tokens` taking precedence when both are sent. Thanks @Lellansin.
- Models/OpenAI CLI auth: make `openclaw models auth login --provider openai` start the ChatGPT/Codex account login by default, while `--method api-key` remains the explicit OpenAI API-key setup path.
- Google/Gemini: normalize retired Gemini 3 Pro Preview ids inside explicit SDK OAuth auth-result config patches, so provider helpers emit `google/gemini-3.1-pro-preview` for Gemini 3.1 testing.
- Google/Gemini: normalize retired Gemini 3 Pro Preview ids inside SDK OAuth auth-result default config patches, so helper-built provider auth flows emit `google/gemini-3.1-pro-preview` for Gemini 3.1 testing.
- Google/Gemini: normalize retired Gemini 3 Pro Preview ids returned by direct `openclaw models auth login --set-default` provider auth flows before writing config, so Gemini testing targets `google/gemini-3.1-pro-preview`.
- Google/Gemini: normalize retired Gemini 3 Pro Preview ids in per-agent config defaults and auth patches, so agent-specific emitted config keeps targeting `google/gemini-3.1-pro-preview`.
- Google/Gemini: normalize retired Gemini 3 Pro Preview ids in provider catalog rows when API-key onboarding only reapplies the agent default, so emitted config keeps testing `google/gemini-3.1-pro-preview`.
- Google/Gemini: normalize retired Gemini 3 Pro Preview ids in `config set` mutation output for agent overrides and provider catalog rows, so current config emits `google/gemini-3.1-pro-preview`.
- Google/Gemini: canonicalize provider-qualified retired Gemini 3 Pro Preview refs during Google forward-compatible model resolution, so emitted config uses `google/gemini-3.1-pro-preview` for Gemini 3.1 testing.
- Google/Gemini: normalize proxy-prefixed retired Gemini 3 Pro Preview catalog rows, so emitted configs use `google/gemini-3.1-pro-preview` for Gemini 3.1 testing.
- Google/Gemini: normalize retired Gemini 3 Pro Preview ids inside per-agent model overrides before writing config, so agent-specific config emits `google/gemini-3.1-pro-preview` for Gemini 3.1 testing.
- Google/Gemini: normalize retired Gemini 3 Pro Preview ids in subagent, heartbeat, compaction, and subagent-tool model config during writes, so current config keeps emitting `google/gemini-3.1-pro-preview`.
- Docs/subagents: document `agents.defaults.subagents.announceTimeoutMs` in the sub-agent and configuration references. (#75509) Thanks @akrimm702.
- Cron: add direct `cron.get`, `openclaw cron get <id>`, and agent-tool `get` support for inspecting one stored cron job by id. (#75117) Thanks @samzong.
- Agents/tools: add per-sender tool policies with canonical channel-scoped sender keys, so operators can restrict dangerous tools by requester identity across global, agent, group, core, bundled, and plugin tool surfaces. (#66933) Thanks @JerranC.
- ACP: expose Gateway session lineage metadata through ACP session listings and session info snapshots so clients can render subagent graphs without private Gateway side channels. (#73458) Thanks @samzong.
- Channels/iMessage: add `openclaw channels status --channel <name>` filtering and document the BlueBubbles-to-imsg cutover path so operators can probe iMessage without starting both channel monitors. (#80706) Thanks @omarshahine.
- CI: add a non-blocking `plugin-inspector-advisory` artifact to Plugin Prerelease so release runs capture bundled plugin compatibility triage without changing the blocking gate.
- Runtime/Fly: detect Fly Machines as container environments from their runtime env vars, so gateway bind and Bonjour defaults match remote container launches. (#80209) Thanks @liorb-mountapps.
- Providers/fal: route GPT Image 2 and Nano Banana 2 reference-image edit requests to `/edit` with `image_urls` array, enforce NB2 edit geometry using `aspect_ratio` and `resolution` params, lift Fal edit mode input-image caps to 10 for GPT Image 2 and 14 for Nano Banana 2, and allow aspect-ratio hints in edit mode. (#77295) Thanks @leoge007.
- Control UI: show a plain HTML recovery panel when the app module never registers, giving blank dashboard pages a retry path and browser-extension troubleshooting link. Fixes #44107. Thanks @BunsDev.
- Docs: rename the broad tools nav to Capabilities, keep automation and agent coordination as sections, and keep the tools overview focused on tools, skills, and plugins. https://docs.openclaw.ai/tools
- Build: enable additional low-churn oxlint rules for promise, TypeScript, and runtime footgun checks.
- Build: enable stricter Vitest lint rules for focused, disabled, conditional, hook, matcher, and expectation hazards.
- Build: pin explicit oxfmt defaults in the shared formatter config to keep formatting behavior stable across upgrades.
- TypeScript: enable stricter compiler checks for implicit returns, side-effect imports, overrides, and unused production code.
- Logging: add targeted model transport, payload, SSE, and code-mode diagnostics with redacted URL handling.
- Agents/code mode: add opt-in generic QuickJS-WASI code mode that exposes `exec`/`wait` while hiding enabled tools behind a catalog bridge.
- Agents: allow `session.agentToAgent.maxPingPongTurns` up to 20 while keeping the default at 5 for longer agent-to-agent reply chains. Fixes #52382. (#52400) Thanks @thirumaleshp.
- Agents: add per-agent `tools.message.crossContext` overrides so sandboxed/public agents can restrict message sends to the current conversation without changing the global bot policy.
- Agents: add per-agent `tools.message.actions.allow` overrides so sandboxed/public agents can expose and enforce send-only message tools.
- Agents: omit the sandbox workspace marker from compact command progress previews while keeping internal sandbox diagnostics unchanged.
- Agents: widen progress draft command preview lines by 50% so Discord inline tool updates preserve more useful command context.
- Codex app-server: retire timed-out app-server clients after bounded turn interrupts so Discord agents do not reuse a CPU-spinning Codex process after an attempt timeout.
- Codex app-server: default migrated native plugin destructive-action policy to enabled while preserving explicit global and per-plugin false overrides.
- Build: upgrade workspace package management to pnpm 11 and keep Docker, install, update, and release workflows on the pnpm 11 config surface. (#79414) Thanks @altaywtf.
- Build: align Telegram QA workflows and git source installs with the pnpm 11 workspace build allowlist surface. (#80588) Thanks @altaywtf.
- Models: add provider-level `localService` startup for on-demand local model servers before OpenAI-compatible requests, including one-shot model probes.
- Agents: trim default system prompt guidance and send-only message tool schemas to reduce prompt tokens while preserving GPT-5 personality guidance.
- Context: add `/context map` to send a treemap image of the current session context contributors. (#79867)
- Slack: add `unfurlLinks` and `unfurlMedia` config for bot `chat.postMessage` replies, including per-account overrides, so Slack link and media previews can be suppressed without workspace-wide settings. Fixes #48435. (#80145) Thanks @esegev1 and @HemantSudarshan.
- Slack: add explicit `replyBroadcast` support for text and Block Kit thread replies so agents can opt into Slack's parent-channel `reply_broadcast` behavior. (#64365) Thanks @tony88331.
- Slack: preserve mention target/source metadata in inbound prompt context so agents can distinguish direct bot mentions from implicit thread wakes that mention someone else. Fixes #79025. (#75356) Thanks @tmimmanuel.
- Slack: canonicalize outbound delivery-mirror routes for native DM channel IDs to the peer user session so `message.send` calls to `D...` targets do not split the same Slack DM thread into a channel session. Fixes #80091. (#80111) Thanks @bek91.
- Plugin SDK: deprecate public subpaths that existed for at least one month and have no bundled extension production imports, keep legacy barrel/test/zod subpath package exports for backwards compatibility, and track both sets in the SDK surface report.
- Plugin SDK: deprecate public subpaths currently used by only one or two bundled plugin owners, keeping them importable while steering new plugin code to focused shared SDK seams or plugin-owned APIs.
- Plugin SDK: remove the owner-specific `provider-auth-login` public subpath after moving Chutes, GitHub Copilot, and OpenAI Codex auth flows back to provider-owned modules.
- Plugin SDK: remove provider-specific model, stream, and xAI compatibility helpers from public exports after moving bundled callers to provider-owned modules.
- Plugin SDK: expose runtime-supplied active model metadata to native plugin tool factories for diagnostics and plugin-owned policy decisions. Fixes #77857. Thanks @jamiezigelbaum.
- QA/Mantis: add Telegram live PR evidence automation with Convex-leased credentials, Crabbox transcript capture, motion GIF previews, and inline PR comments.
- QA/Mantis: add a Telegram desktop scenario builder that leases Crabbox, installs native Telegram Desktop, configures an OpenClaw Telegram gateway with leased bot credentials, and records VNC screenshot/video artifacts.
- Discord/voice: add realtime voice diagnostics for speaker turns, playback resets, barge-in detection, and audio cutoff analysis.
- Talk: add `talk.realtime.instructions` so operators can append realtime voice style instructions while preserving OpenClaw's built-in agent-consult guidance. (#79081) Thanks @VACInc.
- Discord/voice: default test and source installs to the pure-JS `opusscript` decoder by ignoring optional native `@discordjs/opus` builds, avoiding slow native addon compiles outside dedicated voice-performance lanes.
- Discord/voice: add an opt-in native `@discordjs/opus` install script and decoder preference for live voice-performance lanes without charging unrelated Docker/tests for native addon builds.
- Discord/voice: add `voice.allowedChannels` to restrict voice joins and bot voice-state moves to configured channels while preserving open voice behavior when unset.
- Gateway/skills: add an opt-in private skill archive upload install path gated by `skills.install.allowUploadedArchives`, so trusted Gateway clients can stage and install zip-backed skills only when operators explicitly enable the code-install surface. (#74430) Thanks @samzong.
- Codex app-server: enable Codex native code-mode-only for harness threads so deferred OpenClaw dynamic tools run through Codex's own searchable code execution surface instead of a PI-style wrapper.
- Dependencies: refresh workspace pins and patch targets, including ACPX `@agentclientprotocol/claude-agent-acp` `0.33.1`, Codex ACP `0.14.0`, Baileys `7.0.0-rc10`, Google GenAI `2.0.1`, OpenAI `6.37.0`, AWS SDK `3.1045.0`, Kysely `0.29.0`, Tlon skill `0.3.6`, Aimock `1.19.5`, and tsdown `0.22.0`.
- Dependencies: refresh workspace pins for Anthropic SDK, Smithy shared ini loading, Playwright, YAML, Aimock, TypeScript native preview, Vitest, Oxlint/Oxfmt, Vite, and pnpm 11.1.0.
- Dependencies: hard-pin non-peer direct dependency specs across bundled packages and add a changed-check guard so runtime installs resolve the exact versions tested by maintainers.
- Dependencies: move embedded Pi packages to the `@earendil-works` namespace, refresh Twitch Twurple packages, and move `@openclaw/fs-safe` from the GitHub release pin to the published npm package.
- Build: route Testbox changed-check delegation through Crabbox and remove the OpenClaw-specific Blacksmith Testbox helper scripts.
- Agents/compaction: preserve scoped background exec/process session references across embedded compaction and after-turn runtime contexts without exposing sessions from unrelated scopes. Fixes #79284. (#79307) Thanks @TurboTheTurtle.
- Agents/process: tell agents to inspect background sessions with `process log` before sending interactive input and to use `waitingForInput`/`stdinWritable` hints from `log`/`poll`.
- CLI/onboarding: improve setup, onboarding, configure, and channel command wayfinding so terminal flows explain the next useful command instead of relying on terse setup labels.
- Agents/Codex: remove the configurable Codex dynamic-tools profile so Codex app-server always owns workspace, edit, patch, exec, process, and plan tools while OpenClaw integration tools remain available.
- macOS app: update the Peekaboo bridge dependency to Peekaboo 3.0.0.
- Dependencies: refresh workspace pins and move the WhatsApp plugin from `@whiskeysockets/baileys` to `baileys` while keeping the `7.0.0-rc10` runtime.
- Plugin SDK: add bundled-plugin session actions, `sendSessionAttachment`, and Cron-backed `scheduleSessionTurn`/tag cleanup under the grouped session namespace. Replaces #75578/#75581/#75588 and part of #73384/#74483. Thanks @100yenadmin.
- Plugin SDK/media-understanding: add `extractStructuredWithModel(...)` plus the optional provider-side `extractStructured(...)` seam so trusted plugins can run bounded image-first structured extraction with optional supplemental text context through provider-owned runtimes such as Codex.
- Exec approvals: add `tools.exec.commandHighlighting` so parser-derived command highlighting in approval prompts can be enabled globally or per agent. (#79348) Thanks @jesse-merhi.
- Codex app-server: mirror native Codex subagent spawn lifecycle events into Task Registry so app-server child agents appear in task/status surfaces without relying on transcript text. (#79512) Thanks @mbelinky.
- Skills: add `skills.load.allowSymlinkTargets` so intentional symlinked skill folders can resolve into trusted sibling repos without disabling root containment.
- Agents/tools: add core Tool Search so agents can search and call large OpenClaw, MCP, and client tool catalogs through one compact PI bridge.
- Doctor: warn when a per-agent model config omits the `fallbacks` key and `agents.defaults.model.fallbacks` is non-empty. Covers both string-form (`"model": "..."`) and partial-object form (`"model": { "primary": "..." }`) — both silently clobber the defaults chain at runtime. Use `"fallbacks": []` to explicitly opt out of fallbacks, or add `"fallbacks": [...]` to inherit or override. Fixes #79369.
- Chat commands: add `/think default` and `/fast default` to clear session overrides and inherit configured/provider defaults. (#79385) Thanks @VACInc.
- Dependencies: refresh workspace dependency pins and lockfile, including `@openai/codex` `0.130.0`, `acpx` `0.7.0`, AWS SDK `3.1044.0`, OpenTelemetry `0.217.0`, `typebox` `1.1.38`, `vite` `8.0.11`, `oxfmt` `0.48.0`, and `oxlint` `1.63.0`, and update the Codex harness model snapshot for the new bundled app-server catalog.
- Plugins/install: add guarded plugin install overrides so onboarding and repair tests can route specific plugins to registry specs or local `npm pack` artifacts via environment variables.
- Tests/Docker: add Codex on-demand install and live plugin-tool dependency E2E lanes for packaged onboarding and npm-pack plugin proof.
- Plugins/ACPX: accept an optional `args` array in `agents.<name>` config so paths and flag values containing spaces stay intact when spawning ACP agent processes. Thanks @TheArchitectit and @BunsDev.
- Agents: inject the current provider/model identity into system prompts, including configured prompt overrides and CLI hook prompt replacements, so agents can answer model-identity questions from the actual runtime selection.
- Agents/subagents: add prompt-only `agents.defaults.subagents.delegationMode` and per-agent overrides with `suggest`/`prefer` modes, and centralize config-backed system prompt resolution across embedded, CLI, compaction, and command-export prompt surfaces.
- Agents/subagents: add stronger delegation orchestration guidance, `sessions_yield` wait guidance, stable `taskName` aliases, and active-child runtime prompt context for spawned sub-agent work.
- Plugins/CLI: add the optional bundled `oc-path` plugin, providing `openclaw path` for surgical `oc://` access to markdown, JSONC, and JSONL workspace files.
- Plugins/SDK: add unified model catalog registration for text, image, video, and music providers, including `providerCatalogEntry` manifests, shared media list help, live catalog caching, and per-model video capability overlays.
- Plugin SDK: add presentation helpers for controls-only interactive rendering and opt-in empty fallback text so rich channel renderers can share `MessagePresentation` semantics without duplicating native cards or components.
- CLI: make parser, startup, config, guardrail, channel, agent, task, session, and MCP failures explain what happened and point to the next recovery command.
- GitHub Copilot: refresh the model catalog from `${baseUrl}/models` so per-account entitlement and accurate context windows surface at runtime; static manifest catalog (now including `gpt-5.5`) remains the fallback when discovery is disabled or the API is unreachable.
- Active Memory: support concrete `plugins.entries.active-memory.config.toolsAllow` recall tool names for custom memory plugins while keeping the built-in memory-core default on `memory_search`/`memory_get` and preserving `memory_recall` automatically for `plugins.slots.memory: "memory-lancedb"`.
- Active Memory: report normal `NONE` recall decisions as `status=no_relevant_memory`, keep unavailable and failed recall paths distinct, and avoid caching no-summary recall results so ordinary no-context turns no longer look like broken `status=empty` memory. Fixes #79812. (#80015) Thanks @TurboTheTurtle.
- Telegram: share the grammY API throttler across polling and ad hoc send clients for the same bot token, so visible draft previews and CLI sends use one quota gate. Thanks @anagnorisis2peripeteia.
- Feishu: resolve group policy/tool context from the trusted chat target for group turns while keeping the speaker in `From`, so @mention replies do not drop the configured group id. Fixes #79457. Thanks @greyxiong.
- Telegram/Feishu: honor configured per-agent and global `reasoningDefault` values when deciding whether channel reasoning previews should stream or stay hidden, addressing the preview-default part of #73182. Thanks @anagnorisis2peripeteia.
- QQBot: mark recognized framework slash commands as text-command turns before reply dispatch so `/models`, `/status`, and `/new` responses stay visible in QQ Bot C2C conversations. Fixes #79310. Thanks @rollingshmily.
- Docker: run the runtime image under `tini` so long-lived containers reap orphaned child processes and forward signals correctly. (#77885) Thanks @VintageAyu.
- Logging/redaction: redact quoted HTTP client secret fields and auth/cookie headers in shared log and formatted error output. Related #71211 and #65623. (#75033) Thanks @liaoandi.
- Gateway/SDK: document and stabilize the task ledger RPC surface for `tasks.list`, `tasks.get`, and `tasks.cancel`, including generated Swift model typing for optional task summaries. Thanks @BunsDev.
- Google/Gemini: normalize retired `google/gemini-3-pro-preview` and `google-gemini-cli/gemini-3-pro-preview` selections to `google/gemini-3.1-pro-preview` before they are written to model config.
- Google/Gemini: emit canonical `google/gemini-3.1-pro-preview` ids from configured provider catalog rows so model list and selection paths can test Gemini 3.1 instead of retired Gemini 3 Pro.
- Google/Gemini: normalize nested proxy-provider catalog ids like `google/gemini-3-pro-preview` to `google/gemini-3.1-pro-preview`, so Kilo-style configured catalogs test Gemini 3.1 instead of the retired Gemini 3 Pro id.
- Google/Gemini: canonicalize provider-onboarding model alias maps so setup flows preserve settings under `google/gemini-3.1-pro-preview` instead of re-emitting retired Gemini 3 Pro config keys.
- Google/Gemini: canonicalize retired Gemini 3 Pro Preview ids inside Google dynamic model resolution so runtime clones also use `google/gemini-3.1-pro-preview`.
- Google/Gemini: canonicalize provider-auth default model results before setup hooks and picker returns so auth flows do not re-emit retired `google/gemini-3-pro-preview` selections.
- Amazon Bedrock: support `serviceTier` parameter for Bedrock models, configurable via `agents.defaults.params.serviceTier` or per-model in `agents.defaults.models`. Valid values: `default`, `flex`, `priority`, `reserved`. (#64512) Thanks @mobilinkd.
- Control UI: read the Quick Settings exec policy badge from `tools.exec.security` instead of the non-schema `agents.defaults.exec.security` path, so configured `full`/`deny` values render accurately. Fixes #78311. Thanks @FriedBack.
- Control UI/usage: add transcript-backed historical lineage rollups for rotated logical sessions, with current-instance vs historical-lineage scope controls and long-range presets so usage history stays visible after restarts and updates. Fixes #50701. Thanks @dev-gideon-llc and @BunsDev.
- Agents/failover: harden state-aware lane suspension by persisting quota resume transitions, restoring configured lane concurrency, preserving non-quota failure reasons, and exporting model failover events through diagnostics OTLP. Thanks @BunsDev.
- Control UI/Windows: add the SPA-side WebView2 bridge for native hosts so draft text can update the chat composer and the ready handshake is wired through the app lifecycle. (#69633) Thanks @AlexAlves87.
- Channels/streaming: make progress draft labels scroll away with other progress lines, render structured tool rows as compact emoji/title/details, show web-search queries from provider-native argument shapes, and skip empty Discord apply-patch starts until a patch summary exists. (#79146)
- Runtime/performance: avoid full-array sorting while auto-selecting providers, resolving supported thinking levels, picking node last-seen timestamps, and extracting Codex usage-limit messages. Thanks @shakkernerd.
- Plugins/doctor: avoid full-array sorting while selecting ClawHub search/archive results and bounded dreaming doctor entries. Thanks @shakkernerd.
- Agents/compaction: keep contributor diagnostics to a bounded top-three selection without sorting the full history. Thanks @shakkernerd.
- Sessions/UI: avoid full-array sorting while selecting ACPX leases, Google Meet calendar events, and latest chat sessions. Thanks @shakkernerd.
- Plugin SDK: mark direct `deliverOutboundPayloads` and legacy reply-dispatch bridges as deprecated compatibility substrate, enrich `sendDurableMessageBatch` with explicit durable send outcomes, migrate bundled send/turn paths off deprecated APIs, and enforce the split with `check:deprecated-api-usage`.
- OpenAI/Talk: let browser realtime Talk, Gateway relay/Voice Call realtime bridges, and OpenAI realtime transcription use `openai-codex` OAuth when no direct API key is configured, make Google Meet `test_speech` honor `mode: "bidi"`, expose Control UI launch options for provider/model/voice/transport/VAD/reasoning, and update the default OpenAI realtime voice model to `gpt-realtime-2`. Thanks @Solvely-Colin.
- Telegram: preserve the channel-specific 10-option poll cap in the unified outbound adapter so over-limit polls are rejected before send. (#78762) Thanks @obviyus.
- Telegram/streaming: continue over-limit draft previews in a new message instead of stopping when rendered preview text crosses Telegram's message limit. (#74508) Thanks @anagnorisis2peripeteia.
- Slack: route handled top-level channel turns in implicit-conversation channels to thread-scoped sessions when Slack reply threading is enabled, keeping the root turn and later thread replies on one OpenClaw session. (#78522) Thanks @zeroth-blip.
- Telegram: re-probe the primary fetch transport after repeated sticky fallback success so transient IPv4 or pinned-IP fallback promotion can recover without a gateway restart. Fixes #77088. (#77157) Thanks @MkDev11.
- Agents/harness: skip tool-result middleware validation when no handler is registered, and sanitize incoming tool result `details` (functions, symbols, bigints, cycles, oversized payloads) before middleware sees them. Tool emitters legitimately produce raw dependency payloads on `details`, and the harness owes any registered middleware a JSON-safe view of that payload; otherwise a no-op middleware (e.g. bundled `tokenjuice` on the `pi` runtime) causes the validator to reject every tool result and silently substitute a failure sentinel, dropping outbound Discord messages, exec output, cron results, and any other tool whose payload carries non-serializable values. Thanks @solomonneas.
- Runtime/install: raise the supported Node 22 floor to `22.16+` so native SQLite query handling can rely on the `node:sqlite` statement metadata API while continuing to recommend Node 24. (#78921)
- Discord/voice: make duplicate same-guild auto-join entries resolve to the last configured channel so moving an agent between voice channels does not keep joining the stale channel.
- Discord/voice: add realtime `/vc` modes so Discord voice channels can run as STT/TTS, a realtime talk buffer with the OpenClaw agent brain, or a bidi realtime session with `openclaw_agent_consult`.
- Discord/voice: add bounded realtime gateway logs for voice channel joins, realtime model/voice selection, transcripts, consult routing/answers, and playback start, allow OpenAI realtime Discord sessions to disable input-triggered response interruption for echo-heavy rooms while keeping explicit Discord barge-in available for new and already-active speakers, and allow voice turns to target an existing Discord channel agent session.
- Discord/voice: add `voice.realtime.minBargeInAudioEndMs` and let the realtime provider own playback clearing, so speaker echo no longer cuts OpenAI realtime model audio at `audioEndMs=0` while low-echo rooms can opt back into immediate barge-in with `0`.
- Discord/voice: make `agent-proxy` the default voice mode so realtime voice acts as the microphone/speaker extension of the routed OpenClaw agent session, with `stt-tts` remaining available as an explicit fallback.
- Discord/voice: route default `agent-proxy` realtime turns through the OpenClaw consult handoff with owner-level tool access and a forced-consult transcript fallback, matching the Codex-style voice front end while keeping the routed agent authoritative.
- Discord/voice: keep OpenAI realtime bidi consults quiet while the supervisor agent is still working, accept Codex-style `conversation.item.done` function-call events, and preserve continuing tool results through the gateway relay so the OpenAI realtime bridge reliably routes consults before speaking the final answer.
- Discord/voice: include a bounded one-line STT transcript preview in verbose voice logs so live voice debugging shows what speakers said before the agent reply.
- Codex app-server: pin the managed Codex harness and Codex CLI smoke package to `@openai/codex@0.129.0`, defer OpenClaw integration dynamic tools behind Codex tool search by default, and accept current Codex service-tier values so legacy `fast` settings survive the stable harness upgrade as `priority`.
- Codex app-server: annotate message-tool-only direct chat turns in the dynamic `message` tool spec so visible replies are sent through `message(action="send")` instead of staying private. (#79704)
- Agents/PI: route explicit OpenAI Codex Responses runs through PI's native WebSocket-capable transport and remove OpenClaw's custom OpenAI Responses WebSocket stack while preserving auth injection, run abort signals, and prompt cache boundary stripping.
- Models/config: allow `compat.thinkingFormat` values `qwen` and `qwen-chat-template` for configured OpenAI-compatible Qwen models, preserving them through catalog normalization and mapping `/think` levels to `enable_thinking` or `chat_template_kwargs.enable_thinking`. Fixes #79677. (#79777) Thanks @indulgeback.
- Codex app-server: default implicit local stdio app-server permissions to guardian when Codex system requirements disallow the YOLO approval, reviewer, or sandbox value, including hostname-scoped remote sandbox entries, avoiding turn-start failures on managed hosts that permit only reviewed approval or narrower sandboxes.
- Plugins/install: run managed npm-root install, uninstall, prune, and repair commands from the managed root without a redundant `--prefix .`, avoiding npm 10.9.3 Arborist crashes on native Windows WhatsApp plugin installs. Fixes #78514. (#78902) Thanks @melihselamett-stack.
- Config/schema/Windows: detect direct execution of the base config schema generator with `pathToFileURL` so Windows paths with backslashes still run the `--check` and `--write` command body. (#52989) Thanks @easyteacher.
- Discord/voice: stream ElevenLabs TTS directly into Discord playback and send ElevenLabs latency optimization as the documented query parameter so spoken replies can start sooner.
- Discord/voice: keep TTS playback running when another user starts speaking, ignore new capture during playback to avoid feedback loops, and downgrade expected receive-stream aborts to verbose diagnostics.
- iMessage: expose native private-API message actions through `imsg rpc` for reactions, edits, unsends, replies, rich sends, attachments, and group management when `imsg status --json` reports the required bridge capabilities.
- Gateway/tasks: reconcile stale CLI run-context tasks whose live run context disappeared even when a child session row remains, and apply the default bounded reload deferral timeout to channel hot reloads so stale task records cannot block Discord/Slack/Telegram reloads forever.
- Gateway/heartbeat: keep stripped `HEARTBEAT_OK` acknowledgements out of pending final-delivery replay and let recent ack-only pending state proceed to the next heartbeat run instead of creating a self-refreshing requests-in-flight loop. Fixes #79258. Thanks @haumanto.
- Gateway/sessions: keep session-store index writes atomic while skipping durable fsync inside the writer lock, reducing cron and channel-turn starvation on slow filesystems and addressing the session-store strand of #73655. Thanks @mmartoccia.
- Discord/voice: make `openclaw channels capabilities --channel discord --target channel:<id>` and `channels status --probe` audit voice-channel permissions, including auto-join targets, so missing Connect/Speak/Read Message History permissions show up before `/vc join`.
- Gateway/restart: expose `skipDeferral` on the `gateway.restart.request` RPC and add `openclaw gateway restart --safe --skip-deferral` so operators can bypass the safe-restart deferral gate when a pinned task run prevents the OpenClaw-aware restart from draining. Surfaces the existing internal `scheduleGatewaySigusr1Restart({ skipDeferral })` semantics added in #71637 to a public surface, complementing `gateway.reload.deferralTimeoutMs`. Refs #76162. Thanks @solomonneas.
- Discord/streaming: default Discord replies to progress draft previews so tool/work activity appears in one edited Discord message unless `channels.discord.streaming.mode` is set to `off`.
- OpenAI/realtime: default realtime voice to `gpt-realtime-2`, use the GA Realtime WebSocket session shape for backend OpenAI bridges, and cover backend, WebRTC, Google Live, and Gateway relay paths in the live Talk smoke. (#79130)
- Update/Windows: spawn the post-core-update child process with `stdio:"pipe"` on Windows so PowerShell/CMD console handles are not inherited, preventing the terminal from hanging after `openclaw update` completes. Fixes #78445. (#78483) Thanks @Beandon13.
- Plugins/install: add `npm-pack:<path.tgz>` installs so local npm pack artifacts run through the same managed npm-root install, lockfile verification, dependency scan, and install-record path as registry npm plugins.
- Channels/plugins: show configured official external channels as missing-plugin status rows and send errors with exact install/doctor repair commands after raw package-manager upgrades leave Feishu or WhatsApp uninstalled. Fixes #78702 and #78593. Thanks @MarkMa84 and @mkupiainen.
- Matrix: move the Matrix channel back to an official external ClawHub/npm plugin so core installs no longer need Matrix SDK runtime dependencies.
- Matrix: attach `com.openclaw.presentation` metadata to semantic presentation replies so OpenClaw-aware Matrix clients can render rich buttons, selects, context rows, and dividers while stock clients keep the plain text fallback. (#73312) Thanks @kakahu2015.
- Codex app-server: disarm the short post-tool completion watchdog after current-turn activity, expose `appServer.turnCompletionIdleTimeoutMs`, and include raw assistant item context in idle-timeout diagnostics so status-only post-tool stalls stop failing as idle. Fixes #77984. Thanks @roseware-dev and @rubencu.
- Codex app-server: release the session lane after a completed assistant message item goes quiet without `turn/completed`, and stop global rate-limit notifications from keeping stuck turns alive.
- Plugin skills/Windows: publish plugin-provided skill directories as junctions on Windows so standard users without Developer Mode can register plugin skills without symlink EPERM failures. Fixes #77958. (#77971) Thanks @hclsys and @jarro.
- Process tool: show input-wait hints from `log` and `poll` for idle interactive background sessions so operators can inspect stuck CLIs and resume them with existing input actions. Fixes #33957. Thanks @bitloi and @vincentkoc.
- Shell env/Windows: hide the login-shell environment probe child window so gateway startup and shell-env refreshes do not flash a console on Windows. Fixes #78159. (#78266) Thanks @BradGroux.
- MS Teams: surface blocked Bot Framework egress by logging JWKS fetch network failures and adding a Bot Connector send hint for transport-level reply failures. Fixes #77674. (#78081) Thanks @Beandon13.
- Windows/restart: skip duplicate scheduled-task `/Run` calls when the gateway task is already running, using a locale-stable PowerShell task-state probe before retrying. Fixes #52044. (#52487) Thanks @andyk-ms.
- Media/host-read: allow buffer-verified ZIP archives in the host-local media validator so agents can send ZIP attachments via the message tool. Fixes #78057. (#78292) Thanks @Linux2010.
- Gateway/sessions: fast-path already-qualified model refs while building session-list rows so `openclaw sessions` and Control UI session lists avoid heavyweight model resolution on large stores. (#77902) Thanks @ragesaq.
- Contributor PRs: remind external contributors to redact private information like IP addresses, API keys, phone numbers, and non-public endpoints from real behavior proof. Thanks @pashpashpash.
- ACP bridge: relay Gateway exec approval prompts from active ACP turns to the ACP client's `session/request_permission` handler before resolving the Gateway approval. Thanks @amknight.
- Codex/plugins: enable migrated source-installed `openai-curated` Codex plugins in the same Codex harness thread with explicit `codexPlugins` config, cached app readiness, and fail-closed destructive-action policy. Thanks @kevinslin.
- Codex/plugins: enforce native plugin destructive-action policy with Codex app-level `destructive_enabled` config instead of OpenClaw-maintained per-tool deny lists, leave plugin app `open_world_enabled` on by default, and invalidate existing plugin app thread bindings so old generated app config is rebuilt. Thanks @kevinslin.
- QQBot/Skills: translate QQBot skill descriptions surfaced in the Skills UI so English-language users no longer see Chinese metadata. Fixes #77810. Thanks @eabase.
- Image generation: include enabled generation providers such as fal in provider discovery even when another image provider is already active. Fixes #78141. Thanks @leoge007.
- Slack: keep Socket Mode's native reconnect enabled so transient ping/pong misses can recover without forcing a full provider rebuild. Fixes #77933. Thanks @bmoran1022 and @brokemac79.
- Cron: preserve cron timeout results when an isolated agent turn's `cron-nested` lane watchdog fires, preventing internal command-lane or model-fallback timeout text from being persisted. Fixes #77703. (#78168) Thanks @brokemac79 and @transxtech.
- PR triage: mark external pull requests with `proof: supplied` when Barnacle finds structured real behavior proof, keep stale negative proof labels in sync across CRLF-edited PR bodies, and let ClawSweeper own the stronger `proof: sufficient` judgement.
- ACPX/Codex: preserve trusted Codex project declarations when launching isolated Codex ACP sessions, avoiding interactive trust prompts in headless runs. Thanks @Stedyclaw.
- ACPX/Codex: reap stale OpenClaw-owned ACPX/Codex ACP process trees on startup and after ACP session close, preventing orphaned harness processes from slowing the Gateway. Thanks @91wan.
- ACP bridge: implement stable session list, resume, and close handlers so ACP clients can page Gateway sessions, rebind existing sessions without replay, and close bridge sessions cleanly. Thanks @amknight.
- ACP bridge: replay complete ledger-backed ACP sessions on load, including user prompts, tool updates, session metadata, and usage snapshots, while keeping older sessions on the existing transcript fallback. Thanks @amknight.
- ACP sessions: allow parent agents to inspect and message their own spawned cross-agent ACP sessions without enabling broad agent-to-agent visibility. Thanks @barronlroth.
- Talk/voice: unify realtime relay, transcription relay, managed-room handoff, Voice Call, Google Meet, VoiceClaw, and native clients around a shared Talk session controller and add the Gateway-managed `talk.session.*` RPC surface.
- Diagnostics/Talk: export bounded Talk lifecycle/audio metrics and session recovery metrics through OpenTelemetry and Prometheus without exposing transcripts, audio payloads, room ids, turn ids, or session ids.
- Logging/Talk: route shared Talk lifecycle events into bounded file and OTLP log records while keeping transcript text, audio payloads, turn ids, call ids, and provider item ids out of logs.
- Voice Call/realtime: add opt-in OpenClaw agent voice context capsules and consult-cadence guidance so Gemini/OpenAI realtime calls can sound like the configured agent without consulting the full agent on every ordinary turn. Thanks @scoootscooob.
- Telegram/streaming: keep draft preview rotation from reusing a pre-tool assistant preview after visible tool or media output lands between compaction replay and the next assistant message. Thanks @vincentkoc.
- Telegram/performance: skip non-forum topic-cache setup, defer status reaction variant work until reactions are needed, and reuse ack reaction gating during message context assembly. Thanks @vincentkoc.
- Telegram/performance: reduce command-menu CPU and allocation work when many native, plugin, and custom commands are registered. (#79717) Thanks @drsolveit.
- CLI/migrate: add bulk on/off and skip controls to interactive Codex skill migration, leaving conflicting skill copies unchecked by default. (#77597) Thanks @kevinslin.
- CLI/migrate: show native Codex plugin names before truncated plan items and prompt for plugin activation explicitly during interactive Codex migration instead of silently keeping every planned plugin. Thanks @kevinslin.
- CLI/migrate: leave already configured target Codex plugins unchecked in the interactive plugin selector and show a `plugin exists` conflict hint while keeping new plugin activations selected by default. Thanks @kevinslin.
- CLI/migrate: return cleanly without apply confirmation when interactive Codex migration leaves both skill copies and native plugin activations unselected. Thanks @kevinslin.
- Gateway/sessions: extend the per-call sessions-list `rowContext` cache with memoization for `resolveSessionDisplayModelIdentityRef`, thinking metadata, and `resolveModelCostConfig` so deterministic per-row resolvers run once per unique `(provider, model[, agentId])` tuple instead of once per session. Cuts CPU on `sessions.list` for stores with many sessions sharing a small set of model tuples; behavior is unchanged for callers that pass no `rowContext`. Thanks @rolandrscheel.
- Cron CLI: add `openclaw cron list --agent <id>`, normalize the requested agent id, and include jobs without a stored agent id under the configured default agent while keeping `cron list` unfiltered when no agent is supplied. Fixes #77118. Thanks @zhanggttry.
- Slack/performance: reduce message preparation, stream recipient lookup, and thread-context allocation overhead on Slack reply hot paths. Thanks @vincentkoc.
- Control UI/chat: strip untrusted sender metadata from live streams and transcript display, preserve canvas preview anchors, and stop operator UI clients from injecting their internal client id as sender identity. Fixes #78739. Thanks @tmimmanuel, @guguangxin-eng, @hclsys, and @BunsDev.
- Control UI/chat: collapse consecutive duplicate text messages into one bubble with a count so repeated text-only messages stay compact without hiding nearby context.
- Control UI/chat and Sessions: label inherited thinking defaults separately from explicit overrides while preserving provider-supplied option labels. Fixes #77581. Thanks @BunsDev and @Beandon13.
- Agents/runtime: add prepared runtime foundation contracts for carrying provider, model, tool, TTS, and outbound runtime facts through later reply-path migrations. Thanks @mcaxtr.
- Control UI/WhatsApp: keep Show QR available for unlinked WhatsApp accounts while switching linked accounts to the explicit Relink action and showing Wait for scan only when a QR is active. Thanks @BunsDev.
- Gateway/performance: reuse the compatible plugin metadata snapshot across dashboard and channel agent turns so auto-enabled runtime config does not repeatedly rescan plugin metadata before provider calls. Thanks @shakkernerd.
- Gateway/performance: reuse current plugin metadata for provider activation, auth/env candidate lookup, and bundle settings during dashboard and channel agent turns while keeping the configless secret-target cache unscoped and refusing stale unscoped reuse when plugin discovery roots differ. Thanks @shakkernerd.
- Gateway/performance: avoid resolving plugin auto-enable metadata twice in one runtime config pass, reducing repeated dashboard turn metadata scans. Thanks @shakkernerd.
- Control UI/performance: pre-scope config tab schemas before rendering, load Channels with cached/runtime status before manual probes, preserve channel rows through failed status summaries, and keep stale slow probes from replacing newer snapshots. Thanks @BunsDev.
- Auth/providers: pass `config` and `workspaceDir` lookup context through to provider-id resolution so workspace-scoped auth aliases resolve correctly when no explicit alias map is supplied. Thanks @shakkernerd.
- Gateway/diagnostics: add startup phase spans, active work labels, stale terminal bridge markers, and opt-in sync-I/O tracing in `pnpm gateway:watch` so slow Gateway turns are easier to attribute from logs and stability diagnostics.
- QA/Mantis: add an opt-in Discord thread attachment before/after scenario that creates a real thread, calls `message.thread-reply` with `filePath`, and captures baseline/candidate screenshot evidence.
- Discord: preserve `filePath` and `path` attachments when replying to a thread with the message tool.
- QA/Mantis: add visual desktop tasks with Crabbox MP4 recording, screenshot capture, and optional image-understanding assertions, and preserve video artifacts in Mantis before/after reports.
- QA/WhatsApp: add `pnpm openclaw qa whatsapp` for live DM canary and pairing-gate coverage using two pre-linked WhatsApp Web sessions from the QA credential pool.
- CI/Crabbox: default owned AWS fallback to `standard` multi-region capacity with broker hints enabled, reserving `beast` for explicit CPU-bound maintainer lanes.
- Plugins/install: run managed npm-root install, rollback, repair, and uninstall mutations with legacy peer resolution so removing one plugin cannot rehydrate a stale registry `openclaw` package into the shared root. Thanks @vincentkoc.
- Plugin SDK: add `openclaw/plugin-sdk/channel-message` lifecycle helpers for `defineChannelMessageAdapter`, `deliverInboundReplyWithMessageSendContext`, send/receive/live/state contracts, durable final-delivery capability derivation, capability proof helpers, and normalized message receipts.
- Plugin SDK: add `createChannelMessageAdapterFromOutbound` so channel plugins can derive durable message adapters from proven outbound adapters without duplicating send/receipt bridge code.
- Plugin SDK: add `actions.prepareSendPayload(...)` so channel plugins can shape message-tool sends into durable payloads while core owns queueing, hooks, retry, recovery, and acknowledgements.
- Plugin SDK: make the legacy `channel-reply-pipeline` subpath a compatibility wrapper over the shared reply core while steering root compat deprecations toward `plugin-sdk/channel-message`.
- Plugin SDK: move Discord, Slack, Mattermost, and Matrix live-preview finalization onto `plugin-sdk/channel-message` and attach message receipts to Telegram finalized previews plus Teams native stream finals, so preview edits and stream finals are represented in the message lifecycle instead of draft-only helpers.
- Telegram: persist the polling restart watermark after successful update dispatch instead of at handler entry, leaving failed updates retryable while still coalescing completed offsets safely.
- Plugin SDK/fs-safe: expose reusable atomic replacement, sibling-temp writes, and cross-device move fallback helpers through `plugin-sdk/security-runtime`, and move OpenClaw's duplicated safe filesystem write paths onto the shared `@openclaw/fs-safe` package.
- Plugin SDK/fs-safe: route browser, media, channel, and QA external output producers through staged fs-safe writes before final publication. (#78768)
- Plugin SDK/fs-safe: rename the public temp workspace helpers to `tempWorkspace`, `withTempWorkspace`, `tempWorkspaceSync`, and `withTempWorkspaceSync`, matching the cleaner `@openclaw/fs-safe` API before the package is published.
- Core/performance: trim reply payload routing, heartbeat filtering, tool display, core tool assembly, channel directory, task status, and Slack approval formatting helper chains with direct bounded scans. Thanks @vincentkoc.
- Control UI/performance: keep chat, config, and channel refreshes responsive by decoupling slow history/schema/status work, reducing the client history window, and logging over-budget chat/config renders. Refs #77060, #45698, #47979, #44107. Thanks @BunsDev.
- QA/Mantis: reuse Crabbox desktop/browser capture tooling and pnpm store caches during Slack desktop smoke runs, reducing per-scenario setup work before screenshots and videos are captured.
- QA/Mantis: add Slack desktop hydrate modes and per-phase timing reports so warm prehydrated VNC leases can skip source install/build while cold runs still prove the full source checkout.
- QA/Mantis: pass the runtime env through desktop-browser Crabbox and artifact-copy child commands, so embedded Mantis callers can provide Crabbox credentials without mutating the parent process. Thanks @vincentkoc.
- QA/Mantis: return the copied Slack desktop screenshot path even when remote Slack QA fails, so the CLI still prints the failure screenshot artifact. Thanks @vincentkoc.
- QA/Mantis: accept Blacksmith Testbox `tbx_...` lease ids from desktop smoke warmup, so provider overrides do not fail before inspect/run. Thanks @vincentkoc.
- Plugins/SDK: add bounded `before_agent_finalize` retry instructions so workflow plugins can request one more model pass. Thanks @100yenadmin.
- Plugin SDK: add plugin-owned `SessionEntry` slot projection and scoped trusted-policy session extension reads. (#75609; replaces part of #73384/#74483) Thanks @100yenadmin.
- Plugin SDK/Gateway: add scoped `plugins.sessionAction` dispatch and plugin-attributed `emitAgentEvent` support so plugins can expose typed session actions and workflow events to trusted clients. (#75578; replaces part of #73384/#74483) Thanks @100yenadmin.
- Plugins/SDK: expose host-derived tool target paths to `before_tool_call` and trusted policy hooks so workflow plugins can reason about known file targets without reparsing tool envelopes. (#75605) Thanks @100yenadmin.
- Control UI/WebChat: show a persistent compact context usage indicator from fresh session token data before the high-pressure warning state, while keeping the existing compaction prompt threshold. Fixes #46398; refs #45048, #50071, and #73744. Thanks @walterwkchoy, @AxelrodAI, @Brissux, @vincentkoc, and @BunsDev.
- Contributor PRs: require external pull requests to include after-fix real behavior proof from a real OpenClaw setup, with terminal screenshots, console output, redacted runtime logs, linked artifacts, and copied live output treated as valid evidence while unit tests, mocks, lint, typechecks, snapshots, and CI remain supplemental only.
- Plugins/catalog: add an `@tencent-weixin/openclaw-weixin` external entry pinned to `2.4.1` so onboarding and `openclaw channels add` can install the Tencent Weixin (personal WeChat) channel by default. (#77269) Thanks @pumpkinxing1.
- Developer tooling: add checked-in VS Code Gateway debugging configs and an opt-in `OUTPUT_SOURCE_MAPS=1` source-map build path for breakpoints in TypeScript source. (#45710) Thanks @SwissArmyBud.
- Managed proxy: add `proxy.loopbackMode` for Gateway loopback control-plane traffic, allowing operators to keep the default Gateway loopback bypass, force loopback Gateway traffic through the proxy, or block it. (#77018) Thanks @jesse-merhi.
- Telegram/native commands: show the current thinking level above the `/think` level picker so users can see the active setting before changing it. (#78278) Thanks @obviyus.
- Plugins/hooks: add a `before_agent_run` pass/block gate that can stop a user prompt before model submission while preserving a redacted transcript entry for the user, and clarify that raw conversation hooks require `hooks.allowConversationAccess=true`. (#75035) Thanks @jesse-merhi.
- Config/Nix: keep startup-derived plugin enablement, gateway auth tokens, control UI origins, and owner-display secrets runtime-only instead of rewriting `openclaw.json`; in Nix mode, config writers, mutating `openclaw update`, plugin lifecycle mutators, and doctor repair/token-generation now refuse with agent-first nix-openclaw guidance. (#78047) Thanks @joshp123.
- Plugin SDK: add a generic `api.runtime.llm.complete` host completion helper with runtime-derived caller attribution, config-gated model/agent overrides, session-bound context-engine access, request-scoped config, audit metadata, and normalized usage attribution. (#64294) Thanks @DaevMithran.
- Control UI/exec approvals: highlight parsed shell command fragments that may deserve extra review in approval prompts. (#77153) Thanks @jesse-merhi.
- Channels/iMessage: honor `channels.imessage.groups.<chat_id>.systemPrompt` (and the `groups["*"]` wildcard) by forwarding it as `GroupSystemPrompt` on inbound group turns, mirroring the byte-identical resolver semantic from WhatsApp where defining the key as an empty string on a specific group suppresses the wildcard fallback. Brings iMessage to parity with the per-group `systemPrompt` pattern already supported by Discord, Telegram, IRC, Slack, GoogleChat, and the retired BlueBubbles channel. Fixes #78285. (#79383) Thanks @omarshahine.
- iMessage: add opt-in inbound catchup that replays messages received while the gateway was offline (crash, restart, mac sleep) on next startup. Enable with `channels.imessage.catchup.enabled: true`; tunables for `maxAgeMinutes`, `perRunLimit`, `firstRunLookbackMinutes`, and `maxFailureRetries`. Persists a per-account cursor under the OpenClaw state dir (`<openclawStateDir>/imessage/catchup/`), replays each row through the live dispatch path so allowlists/group policy/dedupe behave identically on replayed and live messages, and force-advances past wedged guids after `maxFailureRetries` to prevent stuck cursors. Extends the persisted echo-cache retention window so the agent's own outbound rows from before a gap are not re-fed as inbound on replay. Includes a regenerated `src/config/bundled-channel-config-metadata.generated.ts` so the runtime AJV schema accepts the new `channels.imessage.catchup` block. Fixes #78649. (#79387) Thanks @omarshahine.
- Channels/Yuanbao: bump the bundled `openclaw-plugin-yuanbao` npm spec from `2.11.0` to `2.13.0` in the official external channel catalog and refresh the pinned integrity hash, so fresh installs and catalog-driven reinstalls pick up the newer Yuanbao channel plugin release. (#79620) Thanks @loongfay.
- Gateway/OpenAI-compatible Chat Completions: support function `tools`, `tool_choice`, `tool_calls`, and `role: "tool"` follow-up turns while keeping tool-call stream finalization aligned with the command result and reporting client-tool name conflicts as invalid requests. (#66278) Thanks @Lellansin.
- Providers/Mistral: add `mistral-medium-3-5` to the bundled catalog with reasoning support. Thanks @sliekens.
- Docs/Mistral: document Medium 3.5 setup, local infer smoke usage, adjustable reasoning, and the Mistral HTTP 400 caveat for `reasoning_effort="high"` with `temperature: 0`.

### Breaking

- Channels/iMessage: remove the bundled BlueBubbles channel surface and deprecate BlueBubbles-backed iMessage setup in OpenClaw. Existing `channels.bluebubbles` configs must migrate to `channels.imessage` using `imsg` on a signed-in Mac or an SSH wrapper, and non-macOS default `imsg` configs now report remote-Mac wrapper guidance.
- Proxy: replace OpenClaw managed HTTP/WebSocket/fetch interception internals with Proxyline while preserving Gateway loopback routing policy. (#79857) Thanks @jesse-merhi.

### 🐛 问题修复（Fixes）

- Agents: honor `OPENCLAW_WORKSPACE_DIR` when resolving the default agent workspace, preserving explicit config precedence while keeping env-backed deployments out of the system prompt fallback path. Fixes #66786.
- Doctor/Codex: stop warning that the message tool is unavailable for source-reply paths where OpenClaw grants `message` at runtime, keeping update and doctor output aligned with the OpenAI happy path. Thanks @pashpashpash.
- Channels/Weixin: bump the external Weixin catalog entry to `@tencent-weixin/openclaw-weixin@2.4.3` with the matching package integrity. (#81730) Thanks @scotthuang.
- Agents/subagents: apply `agents.defaults.subagents.model` before target agent primary models during `sessions_spawn`, so model-scoped runtimes such as `claude-cli` stay attached to default child runs. Fixes #81395. (#81783) Thanks @joshavant.
- Telegram: keep Bot API polling alive during main event-loop stalls by moving ingress to an isolated worker with a durable local spool. Fixes #81132. (#81746) Thanks @joshavant.
- Telegram: preserve rendered HTML formatting through lazy cron announce delivery so Markdown links stay clickable instead of falling back to literal anchor tags. Fixes #81742. (#81758)
- Telegram: skip unmentioned group media before download when `requireMention` is active, avoiding failed media-download replies for messages that should be ignored. Fixes #81181. (#81785) Thanks @joshavant.
- **CLI/Plugins**：将裸插件和父命令帮助保持在轻量级路径上，避免在渲染帮助前进行插件注册发现。
- Gateway/session history: carry monotonic transcript message sequence through live updates and refresh SSE history when stale sequence input would otherwise append bad incremental state. (#81474) Thanks @samzong.
- Security/sandbox: include Windows `USERPROFILE` in the sandbox blocked home roots so credential-bearing binds (such as `.codex`, `.openclaw`, or `.ssh` under the Windows user profile) are denied even when `HOME` points at a different shell home. (#63074) Thanks @luoyanglang.
- Models config/auth: stop inferring provider env-var markers from broad `^[A-Z_][A-Z0-9_]*$` strings, and resolve config-backed provider `apiKey` values only through structured env SecretRefs (`secrets.providers[id]` / `secrets.defaults`), so unrelated env vars cannot accidentally become provider credentials. Thanks @sallyom.
- Media fetch: skip allocating and buffering the response body for bodyless media responses (HEAD probes and 204-style empty bodies), avoiding wasted heap on streams that carry no payload. Thanks @shakkernerd.
- CLI/onboarding: forward provider-specific auth flags (e.g. `--openai-api-key`) through the onboarding wizard so they reach provider auth methods via `ctx.opts`, letting `--openai-api-key "$OPENAI_API_KEY"` skip the redundant "use existing env var?" prompt in non-interactive harnesses. (#81669) Thanks @sjf.
- CLI/migrate: drop trailing periods from Codex migrate item messages and `REASON_CODE_MESSAGES` strings so plan/result rows read as labels instead of sentence fragments. (#81705) Thanks @sjf.
- Slack: treat malformed private-file redirect `Location` headers as unfollowable redirects instead of failing Slack media downloads.
- **Plugins**：在 provider 发现期间从 `setup.providers[].envVars` 凭证发现 provider plugins，同时保持已弃用的 `providerAuthEnvVars` 回退。（#81542）感谢 @JARVIS-Glasses。
- **Docs/Codex Harness**：澄清每 agent `CODEX_HOME` 隔离 `~/.codex`，而继承的 `HOME` 有意保持 `.agents` 发现和子进程用户主目录状态可用。
- **Auth**：在重试锁定写入前回收死所有者过时的文件锁，使崩溃的 OAuth 刷新不再楔入 `auth-profiles.json` 直到手动清理。
- **CLI Tables**：在多行单元格后的包装 continuation 行上保留静音/颜色样式，保持 `openclaw plugins list` 描述可读。
- **进程执行**：在 Windows 上折叠不区分大小写的重复子环境键，使调用者提供的覆盖（如 `PATH`）不会被 host `Path` 遮蔽。
- Gateway/diagnostics: suppress cold-start liveness warnings during the startup grace window while still sampling liveness metrics. Fixes #79915. (#81699) Thanks @joshavant.
- Codex harness: keep `oauthRef`-backed Codex OAuth profiles usable and stop high-confidence app-server OAuth refresh invalidation from retry-spamming raw token-refresh errors without turning entitlement or usage-limit payloads into re-auth prompts.
- **Browser CLI**：为浏览器控制命令显式请求现有的 `operator.admin` gateway 范围，避免不必要的范围升级批准循环。修复 #81555。（#81716）感谢 @joshavant。
- Plugin SDK: restore the deprecated `openclaw/plugin-sdk/memory-core` package subpath as an alias of `memory-host-core`, so published memory companion plugins that still import it resolve on current hosts.
- Control UI/i18n: use the installed workspace pi runtime for locale refreshes, update the fallback package pin, prefer the Anthropic CI provider when available, and skip invalid provider credentials instead of failing main.
- Codex harness: classify native app-server token-refresh logout and relogin failures as authentication refresh errors, so users get re-authentication guidance instead of a raw runtime failure.
- Codex startup: treat selectable configured OpenAI agent models as Codex runtime requirements during plugin auto-enable, startup planning, and doctor install repair, so Anthropic-primary configs can still switch to OpenAI/Codex cleanly.
- Agents: preserve source-reply delivery metadata when merging tool-returned media into the final reply, keeping message-tool-only replies deliverable and mirrored. Thanks @pashpashpash and @vincentkoc.
- Replies: treat rich presentation, interactive controls, and channel-native payload data as outbound content across follow-up, heartbeat, cron, ACP, and block-streaming delivery paths, preventing card/button-only replies from being dropped as empty.
- WebChat/TUI: route Codex `tools.message` source replies to the active internal UI turn and mirror them to session history, so message-tool-only harness replies, including rich presentation and button-only replies, no longer disappear while WebChat and TUI remain non-targetable outbound channels. (#81586) Thanks @pashpashpash.
- Replies: deliver rich-only block replies even when block-streaming coalescing is enabled, keeping card and button payloads from being dropped by the text coalescer. Thanks @pashpashpash.
- macOS/companion: require system TLS trust before pinning a first-use direct `wss://` gateway certificate and honor `gateway.remote.tlsFingerprint` as the explicit pin for remote node-mode sessions, so fresh endpoints fail closed when macOS cannot trust the certificate unless configured out of band. Fixes #50642. Thanks @BunsDev.
- Update: snapshot config before update-time repair and restart writes, preserve plugin install records through doctor cleanup, and keep update-time config size drops from blocking the update while pointing users to the pre-update backup. Fixes #80077. (#80257) Thanks @Jerry-Xin and @vincentkoc.
- Sessions/status: classify ACP spawn-child sessions as `kind: "spawn-child"` instead of `"direct"` in `openclaw sessions` and status output; extract the duplicated session-kind classifier into a shared helper (`src/sessions/classify-session-kind.ts`) so both surfaces stay in sync. Fixes catalog #19. (#79544)
- Sessions/Gateway: report `agentRuntime.id: "acpx"` (or stored backend id) with `source: "session-key"` for ACP control-plane session rows in `openclaw sessions --json`, `openclaw status`, and Gateway session RPC responses instead of the incorrect `"auto"` / `"pi"` implicit fallback. Fixes catalog #18. (#79550)
- Telegram: delete tool-progress-only draft bubbles before rotating to the real answer, preventing orphaned progress messages in streamed replies.
- Codex app-server: keep per-agent `CODEX_HOME` isolation without rewriting `HOME` by default, so Codex-run subprocesses can still find normal user-home config, tokens, and CLI state unless the launch explicitly overrides `HOME`. Thanks @pashpashpash.
- iMessage: stop sending visible `<media:image>` placeholder text for media-only native image sends while preserving the internal echo key that prevents self-echo duplicate replies. (#81209) Thanks @homer-byte.
- Agents/sessions: create configured agent main sessions before first `sessions_send` or gateway send, so agent-to-agent messages no longer fail when the target agent has not started yet.
- Google models: honor configured `reasoning: false` when resolving thinking policy, preventing non-thinking Google/Gemma models from advertising `thinking=medium`. Fixes #81424.
- gateway: pass Talk session scope to resolver [AI]. (#81379) Thanks @pgondhi987.
- Gateway protocol: require v4 clients and stream explicit chat `deltaText`/`replace` frames so SDK clients can consume assistant updates without local diffing. (#80725) Thanks @samzong.
- GitHub Copilot: exchange OAuth tokens for Copilot API tokens on image understanding requests and route Gemini image payloads through Chat Completions, fixing Copilot Gemini image descriptions. (#80393, #80442) Thanks @afunnyhy.
- Gateway: hide pending Node pairing commands, capabilities, and permissions until approval, and refresh the live approved surface when pairings change. (#80741) Thanks @samzong.
- Plugins/Feishu/WhatsApp/Line: enforce inbound media size caps while reading download streams, avoiding full buffering of oversized attachments. (#81044, #81050) Thanks @samzong.
- Plugins/install: limit install-time code safety scans to plugin-owned runtime entrypoints while keeping dependency manifest denylist checks, so trusted packages with large dependency trees no longer get blocked or warned on third-party runtime internals.
- Config: serialize and retry semantic config mutations centrally, so concurrent commands can rebase safe changes instead of clobbering or hand-rolling command-local retry loops. (#76601)
- Installer: honor `--no-git-update` for existing git checkouts before resolving release refs, preventing pinned source installs from moving during reinstall.
- Plugins/install: refresh OpenClaw-managed peer dependency pins when installed plugin peer ranges change, while preserving user-owned dependency pins.
- Require approval for setup-code device pairing [AI]. (#81292) Thanks @pgondhi987.
- Plugins/install: preserve third-party peer dependencies in the managed npm root when later plugin installs or updates recalculate the shared dependency tree. Thanks @shakkernerd.
- Plugins/memory: prefer the npm-installed memory-lancedb plugin over the bundled fallback during duplicate resolution, keeping Active Memory's `memory_recall` tool visible after managed installs. Fixes #81193. Thanks @julio-arcila.
- Plugins/uninstall: prune managed third-party peer dependencies after their owning npm plugin is removed, without blocking plugin cleanup on peer-prune failures.
- Docker: pin setup-time container paths so stale host `.env` OpenClaw paths cannot leak into Linux containers. Fixes #80381. (#81105) Thanks @brokemac79.
- Channels/WeCom: refresh the official onboarding install to `@wecom/wecom-openclaw-plugin@2026.5.7` and update existing managed npm installs instead of failing on the package directory. Fixes #79884. (#80390) Thanks @brokemac79.
- Anthropic: reseed Claude CLI fresh-session retries from bounded OpenClaw transcript history after session rotation, preventing conversation amnesia. Fixes #80905. (#80934) Thanks @bitloi.
- Require explicit browser device pairing [AI]. (#81289) Thanks @pgondhi987.
- Require Control UI pairing before proxy-scoped access [AI]. (#81288) Thanks @pgondhi987.
- Installer: honor `--version` for git installs and install from the checked-in lockfile, preventing recent dependency pins from tripping pnpm's minimum-release-age gate during tag installs.
- Agents: deliver same-process subagent completion handoffs through the in-process agent dispatcher instead of opening a Gateway RPC loopback.
- Harden trusted-proxy source validation [AI]. (#81290) Thanks @pgondhi987.
- Agents: add permissive item schemas to array tool parameters before provider submission, preventing OpenAI-compatible schema validation from rejecting plugin tools that omit `items`. Fixes #81175. (#81217) Thanks @JARVIS-Glasses.
- Agents: escalate LLM idle watchdog timeouts through profile rotation and configured model fallback instead of leaving agent turns stuck after a silent model stream. Fixes #76877. (#80449) Thanks @jimdawdy-hub.
- Discord voice: treat OpenAI Realtime startup auth failures as fatal, suppress duplicate realtime error logs, and stop autoJoin from retrying the same broken voice channel until credentials are fixed.
- ACPX: stop forwarding unsupported timeout config options to Claude ACP while preserving OpenClaw's own turn timeout. (#80812) Thanks @sxxtony.
- Session transcripts: redact sensitive message content in the centralized JSONL append path so CLI turns, gateway transcript injection, transcript mirrors, and guarded tool results use the same configured redaction behavior. Fixes #73565. Refs #73563. (#79645) Thanks @Ziy1-Tan.
- Channels/iMessage: ignore Apple link-preview plugin payload attachments when users paste URLs, keeping the URL text while avoiding phantom media context. (#79374) Thanks @homer-byte.
- Telegram: detect polling stalls from `getUpdates` liveness only, so outbound API calls no longer mask dead inbound polling; log polling-cycle starts after transport rebuilds. Fixes #78473.
- fix: scan plugin runtime entries during install [AI]. (#80998) Thanks @pgondhi987.
- fix(plugins): scan installed dependency runtime code [AI]. (#81066) Thanks @pgondhi987.
- Inherit tool restrictions for delegated sessions [AI]. (#80979) Thanks @pgondhi987.
- Telegram: discard legacy long-poll update offsets that cannot be tied to the current bot token, so token rotation no longer leaves bots silently skipping new messages. (#80671) Thanks @sxxtony.
- browser: enforce navigation checks for act interactions [AI]. (#81070) Thanks @pgondhi987.
- Validate node exec event provenance [AI]. (#81071) Thanks @pgondhi987.
- Gateway: keep active reply runs visible to stuck-session diagnostics and clear no-active-work recovery state, preventing stale queued lanes after compaction or tool failures. Fixes #80677. (#81302)
- Codex app-server: rotate incompatible context-engine-managed native threads so Lossless-managed sessions do not resume stale hidden Codex history. (#81223) Thanks @jalehman.
- Codex cron: execute scheduled command-style automation payloads before workspace bootstrap or memory review, preserving existing isolated cron jobs after Codex harness migration. (#81510) Thanks @jalehman.
- Plugin LLM completions: honor Codex agent-runtime policy for canonical OpenAI model refs, so context-engine summarizers can use Codex OAuth instead of requiring direct `OPENAI_API_KEY` auth. (#81511) Thanks @jalehman.
- Gateway/OpenAI HTTP: return OpenAI-compatible 400 errors for invalid sampling params and provider validation failures instead of collapsing them to 500s. (#81275) Thanks @Lellansin.
- Telegram: publish plugin and skill command description localizations to native command menus while filtering unsupported locale codes and preserving Telegram command limits. (#81351) Thanks @jzakirov.
- Limit hook CLI tool authority [AI]. (#81065) Thanks @pgondhi987.
- Require admin scope for node device token management [AI]. (#81067) Thanks @pgondhi987.
- Restrict chat sender allowlist matching [AI]. (#80898) Thanks @pgondhi987.
- Update: suppress the false newer-config warning during restart health probing after an update handoff, while keeping future-version mutation guards intact. (#78652)
- Sessions: redact persisted tool result detail metadata before writing transcripts so diagnostic secrets do not survive tool output redaction. (#80444) Thanks @nimbleenigma.
- Codex runtime: allow the official installed `@openclaw/codex` package to use its private task-runtime and MCP projection SDK helpers, fixing `MODULE_NOT_FOUND` during migrated OpenAI/Codex beta runs.
- Codex migration: make Enter activate the highlighted checkbox row before continuing, so `Skip for now` and bulk-selection rows work even when planned items start preselected.
- Codex harness: keep auth-profile-backed media tools such as `image_generate` available when OpenAI auth lives in the agent's auth-profile store instead of environment variables.
- WhatsApp/install: allow Baileys' pinned libsignal git subdependency under pnpm 11 so source installs and local checks can complete.
- Require auth for sandbox browser CDP relay [AI]. (#81002) Thanks @pgondhi987.
- fix: detect carried exec command forms [AI]. (#81000) Thanks @pgondhi987.
- Reject truncated exec approval commands [AI]. (#81001) Thanks @pgondhi987.
- Enforce inline shell wrapper payload matching [AI]. (#80978) Thanks @pgondhi987.
- fix(node-pairing): replace changed pending requests [AI]. (#80894) Thanks @pgondhi987.
- Rate limit Google Chat webhook requests [AI]. (#80974) Thanks @pgondhi987.
- Docker: mount the auth-profile secret key directory so OAuth-backed auth profiles survive container rebuilds. (#80991)
- Onboarding: accept Codex auth profiles for canonical OpenAI model checks, avoiding false missing-auth warnings. (#80913) Thanks @rubencu.
- fix(feishu): normalize webhook rate-limit client keys [AI]. (#80975) Thanks @pgondhi987.
- fix(auth): prevent bootstrap pairing scope changes [AI]. (#80976) Thanks @pgondhi987.
- Validate Control UI loopback retry endpoints [AI]. (#80900) Thanks @pgondhi987.
- Harden exported markdown link rendering [AI]. (#80902) Thanks @pgondhi987.
- fix(gateway): honor minimal discovery mode for wide-area DNS-SD [AI]. (#80903) Thanks @pgondhi987.
- slack: enforce reaction notification policy [AI]. (#80907) Thanks @pgondhi987.
- Enforce gateway command scopes by caller context [AI]. (#80891) Thanks @pgondhi987.
- Telegram/groups: in single-account setups, treat an explicit empty `accounts.<id>.groups: {}` map the same as undefined so the root `channels.telegram.groups` allowlist still applies, instead of silently dropping every group update under the default `groupPolicy: "allowlist"`. Multi-account semantics are unchanged so per-account explicit-empty groups still scope-disable a single account without affecting siblings; the explicit way to block all groups for any account remains `groupPolicy: "disabled"`. Fixes #79427. (#81030) Thanks @kinjitakabe.
- Codex (app-server): project user-configured `mcp.servers` into new Codex thread configs, matching the codex-cli runtime's existing `-c mcp_servers=...` behavior so app-server-runtime agents see the same user MCP servers the CLI runtime already exposes. Plugin-curated apps remain attached via the separate `apps` config patch. Fixes #80814. Thanks @kinjitakabe.
- Enforce Slack plugin approval button authorization [AI]. (#80899) Thanks @pgondhi987.
- Recognize PowerShell -ec inline commands [AI]. (#80893) Thanks @pgondhi987.
- fix(qqbot): authorize approval button callbacks [AI]. (#80892) Thanks @pgondhi987.
- Telegram: render supported HTML tags in streamed and durable replies instead of showing literal markup. (#80977)
- Scrub streamable MCP redirect headers [AI]. (#80906) Thanks @pgondhi987.
- fix(memory-wiki): require admin scope for ingest [AI]. (#80897) Thanks @pgondhi987.
- memory-wiki: require write scope for Obsidian search [AI]. (#80904) Thanks @pgondhi987.
- WhatsApp: externalize the channel as a ClawHub/npm plugin outside the core npm runtime bundle, and bump Baileys to `7.0.0-rc11` so libsignal resolves from the registry instead of a GitHub tarball.
- WhatsApp: keep optional audio decoding dependencies local to the external plugin so the core npm install no longer pulls WhatsApp-only media helpers.
- Build: skip copied metadata for bundled plugins that are excluded from build entries, preventing update/status rebuilds from advertising missing QQ Bot runtime files. (#80925)
- Control UI/sessions: nest subagent sessions under their parent session in the session picker dropdown using a visual `└─ ` prefix, making the parent-child relationship clear. Fixes #77628. (#78623) Thanks @chinar-amrutkar.
- Auto-reply: surface a visible error when the configured model backend fails and fallback produces no visible reply, while preserving intentional silent turns and side-effect-only deliveries. (#80917) Thanks @dutifulbob.
- Agents/exec: skip redundant heartbeat wake-ups for subagent session exec completions, preventing spurious LLM invocations on parent sessions. Fixes #66748. (#66749) Thanks @ggzeng.
- Provider streams: keep OpenAI-compatible SSE and JSON fallback streams draining across split chunks and fail Azure Responses streams with a bounded first-event diagnostic instead of stalling. Refs #80926. (#80927) Thanks @galiniliev and @CaptainTimon.
- Agents: rewrite generic provider internal errors with support request IDs into user-friendly transient error copy. (#49401) Thanks @y471823206.
- WhatsApp: finish handling pending debounced inbound messages before closing the socket. (#81246) Thanks @mcaxtr.
- CLI/commitments: write `--json` output to stdout instead of diagnostic logs so automation can parse commitment list and dismiss results. (#81215) Thanks @giodl73-repo.
- Update: allow pnpm GitHub-source OpenClaw updates to approve the OpenClaw package build, so source installs complete their prepare/prepack lifecycle. (#81294) Thanks @fuller-stack-dev.
- Telegram: preserve supported HTML tags in visible replies and durable mirrors so formatted messages render correctly instead of degrading to escaped text. (#80977) Thanks @obviyus.
- Plugins/runtime: attribute deprecated runtime config load/write warnings to the plugin id and source that triggered them so logs and plugin doctor runs are actionable. Refs #81394. (#81425) Thanks @BKF-Gitty.
- Agents/cron: honor a cron payload's explicit `timeoutSeconds` for the LLM idle watchdog even when it numerically equals `agents.defaults.timeoutSeconds`, preserving explicit per-run timeout intent and preventing stalled streaming replies from being cut to the implicit 120s cap. (#79426) Thanks @legolaz8451.
- Codex app-server: keep the short post-tool completion watchdog armed across dynamic tool completion bookkeeping so embedded Codex runs fail fast and release their session lane when Codex goes quiet after a tool result. (#81697) Thanks @mbelinky.
- Control UI/WebChat: wrap long inline code tokens inside chat bubbles instead of clipping them at the bubble edge. Fixes #81932. (#81931) Thanks @galiniliev.
- CLI/media: render terminal QR codes with full-block characters by default so the bundled `qrcode` terminal renderer does not emit a pathologically dense ANSI final row in compact half-block mode that breaks scanning in some terminals. Fixes #77820. Thanks @KrasimirKralev.
- Agents/compaction: read post-compaction AGENTS.md refresh context from the queued run workspace instead of the runner process cwd, so CLI-backed follow-up turns re-inject the correct workspace startup rules after compaction. Fixes #70541. (#75532) Thanks @vyctorbrzezowski.
- Agents/read tool: treat positive offsets beyond EOF as empty ranges instead of surfacing the upstream read error, so stale pagination cursors no longer crash tool calls while unrelated read failures still fail loud. Fixes #62466. (#75536) Thanks @vyctorbrzezowski.
- Google/Gemini: normalize retired Gemini 3 Pro Preview refs left in Google API-key onboarding model allowlists and fallbacks, so setup-emitted config keeps testing `google/gemini-3.1-pro-preview` instead of `google/gemini-3-pro-preview`.
- Telegram/context: bound selected topic context to the active session so messages from before `/new` or `/reset` are not replayed into later turns. (#80848) Thanks @VACInc.
- Google/Gemini: normalize retired nested Gemini 3 Pro Preview ids when resolving exact configured proxy-provider refs, so `kilocode/google/gemini-3-pro-preview` resolves to `kilocode/google/gemini-3.1-pro-preview` for Gemini 3.1 testing.
- CLI: strip generic OSC terminal escape payloads from sanitized output fields, preventing clipboard/title escape bodies from leaking into commitment tables and other terminal-safe text. Thanks @shakkernerd.
- Codex app-server: match connector-backed plugin approval elicitations by stable connector id so enabled destructive actions no longer fall through to display-name-only rejection.
- Build: replace selected build utility `tsx` preloads with Node native type stripping so Node 26 build paths no longer emit `DEP0205` module loader deprecation warnings. (#78584) Thanks @keshavbotagent.
- Media generation: honor configured music and video generation timeouts when tool calls omit `timeoutMs`, matching image generation behavior. (#80687)
- CLI/update/status: label beta-channel plugin fallback and model-pricing refresh failures as warnings, keeping mixed beta/latest plugin cohorts visible without making core update or Gateway reachability look failed. Fixes #80689. Thanks @BKF-Gitty.
- Doctor/plugins: relink managed npm plugin `openclaw` peer dependencies during `doctor --fix`, while refusing to follow package-local `node_modules` symlinks outside the plugin package. (#77412) Thanks @TheCrazyLex.
- iMessage: route inbound tapbacks as reaction system events instead of normal messages, defaulting to bot-authored-message notifications while allowing `reactionNotifications: "off" | "own" | "all"` overrides. Fixes #60274; refs #39031 and #39322. Thanks @hyperclaw.
- Control UI/performance: scope Nodes polling to the active Nodes tab, debounce stale session-list reconciliation, and bound chat-side session refreshes so long-running dashboards avoid background reload churn. Thanks @BunsDev.
- Plugins/channels: explain bundled channel entry files that reach the legacy plugin loader as setup-runtime loader mismatches instead of generic missing-register failures. Thanks @chinar-amrutkar.
- Plugins/session-end: fire a typed `session_end` plugin hook with reason `shutdown` (or `restart` when a restart is expected) for every session that was still active when the gateway process stops. Previously SIGTERM/SIGINT/restart paths closed the gateway without enumerating active sessions, leaving downstream `session_end` plugins (e.g. claude-mem) with ghost rows accumulating across restarts. The new shutdown finalizer drains an in-memory tracker that is populated by `session_start` and forgotten by replace / reset / delete / compaction emitters, so previously-finalized sessions are never double-fired. The drain is bounded to a 2 s total budget so a slow plugin cannot block process exit. Adds `"shutdown"` and `"restart"` to `PluginHookSessionEndReason`. Fixes #57790. Thanks @pandadev66.
- Codex app-server: clamp Codex code-mode sandboxing to workspace-write when an OpenClaw sandbox is active, preventing Docker gateway socket access from becoming a danger-full-access Codex turn.
- TUI: exit immediately on Ctrl+C/SIGINT after gateway disconnect and bound shutdown drain so terminal teardown cannot strand sessions. Fixes #75379. (#75381) Thanks @udaymanish6.
- Matrix: default outbound markdown tables to bullet lists instead of fenced code blocks. Fixes #78990. (#80890) Thanks @kinjitakabe.
- Bonjour/Gateway: treat active ciao probing and fresh name-conflict renames as in-progress so the mDNS watchdog waits for probe settlement before retrying, preventing rapid re-advertise loops on Windows, WSL, and other multicast-hostile hosts. (#74778) Refs #74242. Thanks @fuller-stack-dev.
- Providers/MiniMax: send a minimal Anthropic-compatible user fallback when message conversion filters a turn to an empty payload, so MiniMax M2.7 no longer returns `chat content is empty` after tool-heavy sessions. Fixes #74589. Thanks @neeravmakwana and @DerekEXS.
- Tools/media: preserve implicit allow-all semantics from `tools.alsoAllow`-only policies when preconstructing built-in media generation and PDF tools, so configured media tools become live without forcing `tools.allow: ["*", ...]`. Fixes #77841. Thanks @trialanderrorstudios.
- Codex/Telegram: separate code-mode tool progress from final replies, render bridged tool calls with native tool labels, and repair persisted missing tool results for safer follow-up turns. (#80663) Thanks @jalehman.
- Memory/search: load the platform-specific `sqlite-vec-<platform>-<arch>` variant directly when the meta `sqlite-vec` package is missing from a global install, so vector recall keeps working on `npm install -g openclaw@latest` upgrades where optionalDependencies left only the platform variant on disk. Fixes #77838. Thanks @corevibe555 and @Simon2256928.
- Cron: keep long manual cron runs active in the task registry until completion, preventing transient `lost` markers before durable recovery reconciles. Fixes #78233. (#78243) Thanks @Feelw00.
- Doctor/GitHub CLI: surface a `GH_CONFIG_DIR` hint when the GitHub skill is usable but `gh` auth lives under a different operator HOME than the agent process, without warning for disabled or filtered skills. Fixes #78063. (#78095) Thanks @tmimmanuel.
- Gateway: dedupe concurrent `send`, `poll`, and `message.action` requests while delivery is still in flight, preventing duplicate outbound work for the same idempotency key. (#68341) Thanks @thesomewhatyou.
- Cron: keep main-session `systemEvent` heartbeat wakes on their bound session route for both direct and queued wake paths by dropping inherited explicit heartbeat destinations when forcing `target: "last"`. Fixes #73900. Thanks @richardmqq.
- Telegram: honor forced document delivery for video media so `--force-document` sends MP4s as documents instead of typed videos. Fixes #80389. (#80405) Thanks @jbetala7.
- Gateway: clear speculative node wake state when APNs registration is missing, preventing unregistered or mistyped node IDs from retaining wake throttle entries. Fixes #68847. (#68848) Thanks @Feelw00.
- Auto-reply: keep late follow-up queue drain finalizers from deleting a replacement queue registered after `/stop`, preventing immediate follow-up messages from being orphaned. Fixes #68838. (#68839) Thanks @Feelw00.
- Feishu: make manual App ID/App Secret setup the default channel-binding path while keeping QR scan-to-create as an optional best-effort flow, and document the manual fallback for domestic Feishu mobile clients that do not react to the QR code. Fixes #80591. Thanks @wei-wei-zhao.
- Memory: cap dreaming promotion writes to `MEMORY.md` by compacting oldest auto-promoted sections while preserving user-authored notes, keeping active memory below the bootstrap budget. Fixes #73691. (#74088) Thanks @YB0y.
- Telegram: show resolved thinking defaults in native `/status` and `/think` menus while preserving explicit session overrides. (#80341) Thanks @VACInc.
- Channels: cache selected channel registry lookups against the active fallback snapshot so pinned-empty registries refresh native command and alias routing after active registry swaps. (#80333) Thanks @samzong.
- Codex app-server: reuse native Codex CLI OAuth for isolated app-server harness login, refresh, and app inventory cache keys so ChatGPT-authenticated Codex runs no longer fall back to unauthenticated OpenAI API calls. (#79877) Thanks @jeffjhunter.
- Gateway: scope `sessions.resolve` sessionId and label store loads to the requested agent so large unrelated agent stores are not parsed for scoped lookups. Fixes #51264. (#79474) Thanks @samzong.
- Gateway: share serialized streaming event envelopes across eligible WebSocket and node subscribers while preserving per-client sequence numbers. (#80299) Thanks @samzong.
- Gateway: consolidate duplicate `openclaw doctor` service config panels while preserving the declined-repair `--force` hint. Fixes #80287. (#78688) Thanks @YB0y.
- Browser: report Chrome MCP existing-session page readiness in browser status without letting status probes exceed the client timeout. Fixes #80268. (#80280) Thanks @ai-hpc.
- WhatsApp: route opening-phase Baileys 428 connectionClosed through the WhatsApp reconnect policy and keep post-open 428 closes retryable, so transient setup socket closes retry with WhatsApp diagnostics instead of escaping as a bare `channel exited` error. Fixes #75736; mitigates #77443. Thanks @dataCenter430.
- Agents: disable Pi's default filesystem resource discovery for embedded runs while keeping OpenClaw inline extension factories active, avoiding Windows event-loop stalls during first WhatsApp-triggered agent startup. Fixes #77443. Thanks @dataCenter430.
- Providers/self-hosted: read model-scoped llama.cpp runtime context from `/props.default_generation_settings.n_ctx` while keeping top-level `n_ctx` as a fallback, so session budgeting reflects the loaded context window. Fixes #73664. (#74057) Thanks @brokemac79.
- Memory: reject symlinked directory components in configured extra memory paths before reading Markdown files. (#80331) Thanks @samzong.
- Sessions/transcripts: replace whole-file `readFile` scans with shared streaming helpers (`streamSessionTranscriptLines` and `streamSessionTranscriptLinesReverse`) for idempotency lookup, latest/tail assistant text reads, delivery-mirror dedupe, and compaction fork loading, so long-running sessions no longer materialize the full transcript in memory. Forward scans use `readline` over a bounded `createReadStream`; reverse scans read bounded chunks from the file end and decode complete JSONL lines newest-first without a fixed tail cap. Synthetic 200 MiB transcript: peak RSS delta drops from +252 MiB to +27 MiB while preserving malformed-line tolerance and idempotency-key return semantics. Fixes #54296. Thanks @jack-stormentswe.
- Browser/CDP: filter browser-internal targets from raw CDP and persistent Playwright tab selection so navigation opens real page tabs. Fixes #55734. Thanks @Demine4.
- WhatsApp: apply hot-reloaded `dmPolicy` and `allowFrom` settings to the active Web listener before processing new inbound DMs. Fixes #80538. Thanks @Ampaskopi129.
- Plugins: let `openclaw doctor --fix` repair managed plugin installs whose package entrypoints fail package-directory boundary validation after local state moves. Fixes #80592. Thanks @wei-wei-zhao.
- Voice-call: resume voice-originated exec approval follow-ups as internal non-delivery turns instead of rejecting them as `unknown channel: voice`. Fixes #80540. Thanks @patrickmch.
- Control UI: preserve the composer draft when Stop is tapped during an active chat run, preventing accidental prompt loss on mobile. Fixes #80586. Thanks @KCALLC.
- Infra/retry: keep jittered retry delays at or above server-supplied Retry-After lower bounds when the hint can be honored. Fixes #68541. (#68543) Thanks @Feelw00.
- Docs: clarify that `/model provider/model` is an exact session route, while duplicate bare model ids only use configured fallback order on non-session override paths. Refs #80562. Thanks @gaodaabao.
- Redact persisted secret-shaped payloads [AI]. (#79006) Thanks @pgondhi987.
- Agents: label `.openclaw/sandboxes` exec workdirs as sandbox runs in compact tool summaries instead of showing the full path.
- OpenAI Codex: surface browser OAuth and device-code login failures instead of treating failed logins as empty successful auth results. Refs #80363.
- CLI agents: carry runtime-only current-turn sender/reply context into CLI model prompts while keeping prompt-build hook input and transcript text clean.
- Control UI: keep workspace file presence checks from treating `fs-safe` stat helper failures as missing files, restoring Agents file status for existing Windows workspace files. Fixes #79953. Thanks @lovelefeng-glitch.
- Microsoft Foundry: report an explicit error when the Azure subscription prompt returns an id that is not present in the enabled subscription list, instead of continuing from an unsafe subscription assertion. (#62742) Thanks @oliviareid-svg.
- fix(matrix): gate name-based allowlist resolution [AI]. (#79007) Thanks @pgondhi987.
- Slack: include the bot's own root/parent message in new thread sessions so in-thread replies reach the agent with the parent text the user is responding to, instead of only `reply_to_id` metadata. Fixes #79338. Thanks @sxxtony.
- Docker: keep image builds on the source pnpm workspace policy so pnpm 11 can prune production dependencies without a Docker-only workspace rewrite.
- Agents/compaction: restore info-level gateway logs for embedded compaction start, completion, and incomplete outcomes. (#71961) Thanks @rubencu.
- Telegram: build reply-aware inbound turns through the shared channel context path so agents see the current reply target inline with the current message.
- Telegram: recover legacy message cache files that mixed JSON-array and line-delimited entries so restarted gateways preserve reply-window context. (#80567)
- Telegram: update the reply-context cache when messages are edited, so streamed bot replies appear in later agent context with their final text instead of the first draft.
- Skills/Windows: normalize compacted skill prompt locations to forward slashes after home-prefix compaction so Windows skill paths remain readable by model file tools. (#52200) Thanks @chienchandler.
- Control UI/Windows: update `@openclaw/fs-safe` so agent workspace file presence checks fall back correctly on Windows, preventing existing AGENTS.md, SOUL.md, TOOLS.md, IDENTITY.md, USER.md, HEARTBEAT.md, and MEMORY.md files from showing as missing. Fixes #79953. Thanks @lovelefeng-glitch.
- Memory: skip managed dreaming cron reconciliation warnings for ordinary cron and heartbeat hook contexts that cannot manage Gateway cron. (#77027) Thanks @rubencu.
- Cron: treat Codex app-server turn acceptance, CLI process spawn, and tool starts as execution milestones, preventing isolated runs from tripping the early startup watchdog after work has begun.
- Codex app-server: treat current-turn `<turn_aborted>` raw markers as terminal so interrupted native-tool turns release Discord agent sessions instead of waiting for the outer timeout.
- Yuanbao: bump `openclaw-plugin-yuanbao` to 2.13.1 to support `sourceReplyDeliveryMode: "automatic"` for group chat. (#79814) Thanks @loongfay.
- Memory: keep `memory_search` result `corpus` labels aligned with the hit source, so session transcript hits surface as `sessions` and memory-file hits stay `memory`. Fixes #72885. (#71898, #72886) Thanks @rubencu.
- Codex app-server: default native plugin app tool approvals to automatic so non-destructive read tools run when destructive actions are disabled.
- Plugins: allow untracked local source plugins in the global extensions directory to load TypeScript package entries while keeping managed installs strict about compiled runtime output. Fixes #80503. Thanks @Kaspre.
- Google/Gemini: normalize retired nested Gemini 3 Pro Preview ids while converting manifest catalog rows into emitted provider config, so `google/gemini-3.1-pro-preview` is used for testing instead of `google/gemini-3-pro-preview`.
- Google/Gemini: normalize retired nested Gemini 3 Pro Preview ids inside saved model allowlists and fallback chains, so proxy routes like `openrouter/google/gemini-3-pro-preview` are persisted as Gemini 3.1 Pro Preview.
- Google/Gemini: normalize retired nested Gemini 3 Pro Preview ids in configured proxy/provider-auth model catalogs, so regenerated config keeps testing `google/gemini-3.1-pro-preview` instead of `google/gemini-3-pro-preview`.
- Google/Gemini: normalize retired nested Gemini 3 Pro Preview ids while onboarding provider catalog presets, so setup-emitted proxy configs test `google/gemini-3.1-pro-preview` instead of `google/gemini-3-pro-preview`.
- Google/Gemini: normalize retired Gemini 3 Pro Preview ids in provider catalog rows during generic config writes, so unrelated config changes keep testing `google/gemini-3.1-pro-preview`.
- Models: keep configured fallback chains ahead of configured primary models for override selections with duplicate model ids, preventing fallback jumps to the wrong provider. Fixes #80562.
- Native apps: advertise the Gateway protocol compatibility range so chat and node sessions can connect to v3 gateways after additive v4 client updates.
- Gateway/agents: keep stale `sessions_send` ACP manager and `web_fetch` runtime chunks importable after package updates, preventing live gateways from breaking before restart. Fixes #78804. Thanks @Gomesy72.
- Gateway/install: preserve service environment value-source metadata in `openclaw gateway install`, so systemd reinstall paths keep env-file-backed secrets out of inline unit metadata. Refs #77406, #77427. Thanks @stainlu and @brokemac79.
- Auto-reply/reset: include inbound sender context in bare `/new` and `/reset` model prompts while keeping startup instructions out of transcript prompts, so agents see sender identity on the first reset turn. Fixes #77360. Thanks @srb11e.
- Gateway: avoid synchronous restart-sentinel state probes during post-attach startup, preventing slow Windows or redirected state directories from blocking channel turns. Fixes #79264. Thanks @liyi58.
- Agents/auth: update successful model auth profile status with one locked store write, reducing post-model reply latency from duplicate `auth-profiles.json` saves. Thanks @mcaxtr.
- Agents/image: honor explicit `image` tool model overrides even when `agents.defaults.imageModel` is unset, restoring one-off vision calls for configured multimodal providers. Fixes #79341. Thanks @haumanto.
- Doctor/update: leave live systemd gateway units unchanged during noninteractive update-mode service repair, so update-time doctor does not silently overwrite operator-owned unit directives. Refs #80462.
- Update: accept optional leading `v` prefixes when verifying exact npm package install targets, so `openclaw update --tag v2026...` does not roll back after installing the matching bare package version. Refs #74069; #80480. Thanks @Kaspre.
- Doctor: treat missing plugin ids in `plugins.deny` as stale config warnings instead of fatal validation errors, and remove them during stale plugin cleanup so update repair does not restore last-known-good config for deny-only stale plugin refs. Refs #77802. Thanks @Kaspre.
- Codex app-server: preserve prompt-local current-turn context through context-engine prompt projection, so replied-to Telegram messages stay visible to the Codex model input.
- Telegram: pass agent-scoped media roots through gateway message actions so workspace-local media from the active agent is not rejected as cross-agent access. Thanks @frankekn.
- CLI/gateway: keep `gateway status --deep` plugin-aware so configured plugin manifest warnings, including missing channel config metadata, stay visible during install and update smoke checks.
- Doctor/status: clarify gateway token source conflict warnings and suppress them inside the managed Gateway service credential context.
- Feishu: accept Schema 2 card callbacks whose operator identity is nested under `operator.user_id`, so card buttons dispatch instead of being dropped as malformed. Fixes #71670. (#71787) Thanks @rubencu.
- Feishu: fall back to a top-level group send when normal group quoted replies target a withdrawn or missing message, preventing replies from disappearing silently while preserving native topic safety. Fixes #79349. Thanks @arlen8411.
- Doctor: stop flagging the live compatibility agent directory as orphaned when the configured default agent is not `main`. Fixes #74313. (#74438) Thanks @carlos4s.
- Auth/Claude CLI: persist fresher managed external CLI OAuth credentials back to `auth-profiles.json`, preventing stale `anthropic:claude-cli` profiles from repeatedly bootstrapping and flooding debug logs. Fixes #80129. Thanks @Caulderein.
- Context: render `/context map` only from actual run context and persist Codex app-server run reports without counting deferred tool-search schemas as prompt-loaded tool schemas.
- Codex app-server: report Codex-native tool execution to diagnostics so long-running native `bash`, web, file, and MCP tools no longer look like stale embedded runs to the watchdog. (#80217)
- Codex app-server: refresh Codex account rate limits after subscription usage-limit failures so Discord and other channel replies can show the next reset time instead of saying Codex returned none. Thanks @pashpashpash.
- Agents/auth: let Codex-backed OpenAI agent turns use `auth.order.openai` entries for Codex-compatible OAuth and API-key profiles while keeping existing `openai-codex` profile ordering valid.
- Codex app-server: emit async `after_tool_call` observations for native tool completions not covered by the native hook relay so observability plugins can record Codex-native tools. (#80372) Thanks @VACInc.
- Tasks: route group and channel task completions through the requester session so the parent agent can send the visible summary instead of stopping at a generic task-status line. Fixes #77251. (#77365) Thanks @funmerlin.
- Telegram: preserve blank lines between manually indented bullet blocks and following numbered sections in rendered replies. Fixes #76998. Thanks @evgyur.
- Agents/sandbox: allow read-only sandbox sessions to read the `/agent` workspace mount while keeping write/edit/apply_patch workspace-only guarded, restoring `read /agent/...` for `workspaceAccess: "ro"`. Fixes #39497. Thanks @stainlu and @teosborne.
- Slack: pass configured agent identity through draft preview sends so partial streaming replies keep custom username/avatar on the initial Slack message. Fixes #38235. (#38237) Thanks @lacymorrow.
- Slack: support `allowBots: "mentions"` for bot-authored messages that mention the receiving bot, matching the documented Discord-style mode without accepting every bot message. Fixes #43587. (#43588) Thanks @raw34.
- Slack: refresh private file URLs with `files.info` when inbound DM file events omit or stale attachment URLs, preventing file attachments from being dropped before media hydration. Fixes #50129. (#50200) Thanks @smartchainark.
- Slack: add scoped message-tool formatting hints so agents use Markdown for plain sends and direct mrkdwn for Block Kit fields. Fixes #34609. (#50979) Thanks @carrotRakko.
- Slack: describe `download-file` file ids separately from message timestamps and return a targeted recovery error when agents pass `messageId` instead of `fileId`. (#74155) Thanks @jarvis-ai-gregmoser.
- Slack: retain processed room messages for `requireMention=false` channels so always-on Slack rooms keep recent conversation context between turns. (#38658) Thanks @syedamaann.
- Slack: compile interactive reply directives for direct outbound sends without bypassing the `interactiveReplies` capability gate, preserving Block Kit for Slack CLI and cron deliveries. (#78220) Thanks @kazamak.
- Slack: keep DM last-route updates scoped to the active non-main DM session, including threaded DM turns, so isolated Slack DM sessions do not overwrite the shared main route. (#73085) Thanks @clawSean.
- Slack/ACP: route Slack channel and DM messages through configured ACP bindings when no runtime binding exists, keeping bound thread replies pinned to the persistent ACP session and dropping unavailable configured targets instead of falling back to `main`. (#73101) Thanks @Raasl.
- Slack: mark unresolved thread replies as ambiguous and skip them instead of treating them as root channel messages, keeping thread continuation on the SDK-backed participation store. (#75630) Thanks @soichiyo.
- Slack: let same-channel message tool sends opt out of inherited thread context with `topLevel: true` or `threadId: null`, allowing agents to post a new parent-channel message from inside a Slack thread. Fixes #79807. Thanks @vexclawx31.
- Slack: prefer full rich-text block content over truncated socket-mode message previews so long inbound Slack messages reach agents intact. Fixes #79027. Thanks @BobAccentWebDev.
- Slack: include structured Slack API error details in setup, probe, streaming, and reply logs while preserving token redaction. (#53966) Thanks @deucemask.
- Gateway/agents: keep structured reasons when active-run queueing fails and deprecate the legacy boolean queue helper, so steering and subagent wake diagnostics distinguish completed, non-streaming, and compacting runs. Fixes #80156. Thanks @markus-lassfolk.
- System events: dedupe keyed events across the queue while preserving unkeyed, delivery-route, and trust-boundary event identity. (#73040) Thanks @statxc.
- Agents/UI: compact exec and tool progress rows by hiding redundant shell tool names, replacing known workspace paths with short context markers, and preserving Discord trace scrubbing for compact command lines.
- ACPX: run and await the embedded ACP backend startup probe by default so the gateway `ready` signal no longer fires before the acpx runtime has either become usable or reported a probe failure; set `OPENCLAW_ACPX_RUNTIME_STARTUP_PROBE=0` to restore lazy startup. Fixes #79596. Thanks @bzelones.
- Gateway/status: surface model-pricing bootstrap and refresh failures as degraded health/status warnings while keeping Gateway liveness healthy. Fixes #79599. Thanks @bzelones.
- OpenAI-compatible models: strip prior assistant reasoning fields from replayed Chat Completions history by default, preventing oMLX/vLLM Qwen follow-up turns from rejecting or stalling on stale `reasoning` payloads. Fixes #46637. Thanks @zipzagster and @lexhoefsloot.
- CLI/onboarding: give non-Azure custom providers a safe generated context window and heal legacy 4k wizard entries without overwriting explicit valid small model limits, preventing first-turn compaction loops. Fixes #79428. (#79911) Thanks @Jefsky.
- OpenAI-compatible models: add `compat.strictMessageKeys` to strip Chat Completions replay messages to `role` and `content` for strict providers that reject OpenAI-style tool and metadata keys. Fixes #50374. Thanks @choutos.
- Bedrock Mantle: add `plugins.entries.amazon-bedrock-mantle.config.discovery.enabled=false` to suppress automatic Mantle discovery and IAM bearer-token generation while keeping the plugin enabled. Fixes #67288. Thanks @kanekoh.
- Ollama: stop native `/api/chat` requests from copying catalog `contextWindow` or `maxTokens` into `options.num_ctx` unless `params.num_ctx` is explicitly configured, avoiding pathological prompt-ingestion latency on local large-context models. Fixes #62267. Thanks @BenSHPD.
- Ollama: keep the model idle watchdog enabled for `*:cloud` models routed through a local Ollama host, so cloud-backed tool-loop stalls fail over visibly instead of inheriting local-model no-idle behavior. Fixes #79350. Thanks @geek111.
- Voice/Ollama: honor routed voice agent `tools.allow` for classic embedded voice responses, including empty allowlists, so no-tool Ollama agents do not receive tool schemas. Fixes #79506. Thanks @donkeykong91.
- Agents/doctor: warn when channel-routed agents cannot call the `message` tool, so operators can fix tool policy mismatches before explicit channel actions such as attachments or thread replies fail. Refs #80128. Thanks @jeffjhunterai.
- Gateway: reread config from disk after the first in-process restart loop startup, preventing SIGUSR1 restarts from reusing a stale startup snapshot and dropping config written after boot. Fixes #79947. Thanks @TheLevti.
- Codex app-server: deliver native image-generation outputs from Codex `savedPath` events as reply media, so blank-text image generation turns still attach the generated file. Thanks @keshavbotagent.
- Network/SSRF: keep pinned automatic DNS lookups on IPv4 when dual-stack hosts also publish AAAA records, and treat `EADDRNOTAVAIL` as a transient gateway network failure instead of a fatal crash. Fixes #80078. Thanks @takamasa-aiso.
- Control UI: show compact one-line live/idle/terminal run status badges in the Sessions table and rename the active-minute filter to its updated-within meaning. Fixes #78307. Thanks @BunsDev.
- Control UI: scope chat session-list refreshes by agent and skip disk-only agent store discovery for configured-only lists, preventing post-first-message session switching stalls on large Windows stores. Fixes #79675. Thanks @lovelefeng-glitch, @BunsDev.
- Control UI: allow Appearance tweakcn theme imports through the served CSP so browser-local custom theme links no longer fail with a `connect-src` violation. Fixes #78504. Thanks @BunsDev.
- Control UI/config: remove plugin allowlist entries that the form auto-added when a plugin enable toggle is reverted before saving, so reverting the visible toggle clears dirty state without persisting unintended allowlist changes. (#78329) Thanks @samzong.
- Gateway/mobile: reuse bootstrap-issued device-token scopes on handoff reconnects and surface device-token scope mismatches separately from token mismatches while preserving full shared-token dashboard/native sessions. Fixes #79292. Thanks @BunsDev.
- Media/host-read: allow buffer-verified gzip, tar, and 7z archives in the shared host-local media validator alongside ZIP and document attachments.
- Plugins/install: retry managed npm plugin installs without npm alias overrides after npm's `Invalid comparator: npm:` failure, so older npm versions can install official plugins instead of aborting. (#80539) Thanks @rubencu.
- Plugins/doctor: invalidate persisted plugin registry snapshots when plugin diagnostics point at deleted source paths, so `openclaw doctor` stops repeating stale warnings after a local extension is replaced by a managed npm plugin. Fixes #80087. (#80134) Thanks @hclsys.
- Doctor/OpenAI Codex: preserve Codex auth intent when auto-repairing legacy `openai-codex/*` model refs to canonical `openai/*` by adding provider/model-scoped Codex runtime policy, preventing repaired configs from falling through to direct OpenAI API-key auth. Fixes #78533 and #78570. Thanks @superck110 and @Azmodump.
- CLI/agents: surface durable message delivery status from `sendDurableMessageBatch` in `deliverAgentCommandResult` and `openclaw agent --json --deliver`, preserving suppressed hook outcomes as terminal no-retry results while exposing partial and failed sends for automation. Supersedes #53961 and #57755. Thanks @Kaspre.
- Agents: apply the LLM idle watchdog while provider stream setup is still pending, preventing silent pre-stream model hangs from waiting for the full agent timeout.
- Cron: let isolated self-cleanup runs inspect their own job run history while keeping other cron jobs and mutation actions blocked. Fixes #80019. Thanks @hclsys.
- Cron: report isolated agent-turn setup and pre-model stalls with phase-specific timeout errors instead of waiting for the full job budget when no model call starts. Fixes #74803. Thanks @jeffsteinbok-openclaw and @dgkim311.
- CLI/plugins: treat arbitrary unknown subcommands outside plugin CLI metadata as normal unknown commands instead of suggesting `plugins.allow`, while preserving allowlist guidance for real plugin command roots. Fixes #80109. (#80123) Thanks @kagura-agent.
- CLI/config: persist explicit `config set` and `config patch` values that equal runtime defaults instead of reporting success while dropping them. Fixes #79856. (#80106) Thanks @abodanty and @hclsys.
- OpenAI/realtime voice: accept Codex-compatible legacy audio and transcript event aliases so provider protocol drift does not drop assistant audio or captions.
- Discord/voice: keep default agent-proxy realtime sessions from auto-speaking filler before the forced OpenClaw consult answer, finish Discord playback on realtime response completion, and queue later exact-speech answers until playback idles to avoid mid-sentence replacement.
- Gateway: return deterministic `400 invalid_request_error` responses for malformed encoded session-kill HTTP paths instead of letting route-shaped requests fall through to later Gateway handlers. (#72439) Thanks @rubencu.
- Control UI: serve root PWA and favicon assets from `/__openclaw__/` SPA routes so tab icons, install metadata, and the service worker do not 404 after internal navigation. Fixes #80072. Thanks @CodeNovice2017.
- Exec/safe bins: compare trusted safe-bin dirs with path-specific case folding on case-insensitive filesystems so Windows and default macOS paths match without weakening case-sensitive mounts. (#42131) Thanks @hkochar.
- OpenAI/realtime voice: honor disabled input-audio interruption locally so server VAD speech-start events do not clear Discord playback after operators set `interruptResponseOnInputAudio: false`.
- Telegram: keep no-response DM turns quiet instead of rewriting them into visible silent-reply chatter. Fixes #78188. (#78228) Thanks @Beandon13.
- Telegram: handle managed select button callbacks before the raw callback fallback while preserving delimiter-containing option values such as `env|prod`. (#79816) Thanks @moeedahmed.
- OpenAI-compatible models: handle JSON chat-completion bodies returned to streaming requests, preserving reasoning fields and visible text instead of completing an empty agent turn. Fixes #77870.
- Discord/models: defer model picker component interactions before loading route, model, and preference data, preventing "This interaction failed" timeouts under gateway load. Fixes #77283. Thanks @colin-chang.
- xAI: expose `/think low|medium|high` for reasoning-capable Grok models and keep `reasoning.effort` on native Responses payloads while preserving off-only behavior for non-reasoning routes. Fixes #79210. Thanks @colinmcintosh.
- CLI/media: let explicit image description model refs use bundled static provider catalogs and generic model-backed image hooks, so `openclaw infer image describe --model zai/glm-4.6v` works like direct model runs and Anthropic auth probes avoid stale Claude 3 Haiku catalog entries.
- Models/Anthropic: add `anthropic/claude-haiku-4-5` to Anthropic API-key agent allowlist defaults when an Anthropic default model is configured, so cron model overrides can select the current Haiku alias. Fixes #78000.
- Agents/compaction: initialize built-in context engines before CLI transcript compaction resolves the default engine, preventing clean-process `legacy` engine registration failures during CLI session persistence. Fixes #79446. Thanks @TurboTheTurtle.
- Agents/Anthropic-compatible: strip replayed thinking blocks for custom Anthropic-compatible models that explicitly declare `supportsReasoningEffort: false`, preventing Kimi-compatible providers from resending unsupported `thinking` content. Fixes #47452.
- Kimi: keep Anthropic-compatible thinking streams valid by supplying required thinking budgets and enough output room for hidden reasoning plus final text. (#80481) Thanks @InTheCloudDan.
- Browser: wait longer for existing-session Chrome MCP status and non-deep doctor probes so slow first attaches do not falsely report offline while keeping raw CDP status probes short. (#77473) Thanks @rubencu.
- Gateway/logging: install console capture before foreground Gateway fast-path parsing and suppress known libsignal session dumps even in verbose mode, preventing raw terminal logs from printing WhatsApp session key material. (#76306) Thanks @rubencu.
- Exec approvals: keep `exec.approval.list` on the lightweight policy-summary path so listing pending approvals no longer loads the rich tree-sitter command explainer. (#76943) Thanks @rubencu.
- Agents: surface concise default-visible warnings when `exec`/`bash` tool calls fail after the assistant claims success, while keeping raw stderr hidden unless verbose details are enabled. Fixes #60497. (#80003) Thanks @jbetala7.
- Channels/iMessage: keep redacted failed probe details in non-sensitive health snapshots so Full Disk Access failures no longer appear as configured/OK in status output. Fixes #79795.
- Agents: stop blank model-emitted tool calls before dispatch while preserving id-based tool-name recovery, preventing Kimi/NVIDIA blank-name retry loops without creating a callable `_blank` sentinel. Fixes #34129. (#56391) Thanks @smartchainark.
- Agents/Telegram: deliver the canonical final assistant answer instead of replaying accumulated pre-tool text blocks, preventing duplicate Telegram replies and raw-looking tool-output fragments from leaking into chat delivery. Fixes #79621 and #79986. Thanks @nonzeroclaw and @dudaefj.
- Auto-reply/TUI: keep fallback timeout recovery deliverable after a primary model lifecycle error by emitting fallback progress and deferring terminal TUI errors until recovery has a chance to finish. Fixes #80000. (#80009) Thanks @TurboTheTurtle.
- Heartbeat: clear stale auto fallback model overrides when the configured default model changes, so heartbeat runs follow updated `agents.defaults.model.primary` without requiring a manual reset. Fixes #74284. Thanks @brtkwr and @bitloi.
- CLI/agent: let `openclaw agent --model` use the backend/admin Gateway scope without cached device-token scopes silently downscoping the request. (#78837) Thanks @VACInc.
- CLI/help: keep help and version invocations configless while improving shared port, channel, plugin, task, session, message, pairing, and auth recovery text.
- CLI/config: explain strict JSON parse failures with a valid example and the plain-string escape hatch.
- CLI/secrets: turn offline Gateway reload failures into actionable recovery text.
- CLI/channels: explain missing or ambiguous channel selections with next commands.
- CLI/channels: defer guided channel status collection until a channel is selected, keeping `openclaw channels add` first screen quieter.
- CLI/channels: exit guided channel setup cleanly on cancellation instead of printing the internal wizard error.
- Plugins/CLI: route disabled Matrix and LanceDB memory command roots to plugin-enable guidance instead of generic unknown-command errors.
- Browser/Docker: detect Playwright-managed Chromium from `PLAYWRIGHT_BROWSERS_PATH` and the default Playwright cache on Linux, so Docker installs that persist `/home/node/.cache/ms-playwright` no longer need `browser.executablePath`.
- Ollama: keep DeepSeek V4 cloud models thinking-capable even when Ollama Cloud `/api/show` omits the `thinking` capability, so `/think high` no longer rejects `ollama/deepseek-v4-*:cloud`.
- ACPX/Claude ACP: keep foreground prompts waiting for their own result when autonomous task-notification results arrive during the same session, and retarget the patch for Claude Agent ACP `0.33.1`.
- WhatsApp: keep Baileys media uploads from passing non-Dispatcher agents to undici in `7.0.0-rc10`, and patch the bundled Baileys declaration so the latest tsdown build stays warning-clean.
- Build: keep tsdown `0.22.0` warning-clean by externalizing known third-party declaration edges and replacing relative channel config module augmentations with explicit built-in channel fields.
- ACP sessions: map canonical runtime options to backend-advertised ACP config keys like Claude's `effort` while keeping persisted OpenClaw state canonical. (#79926) Thanks @InTheCloudDan.
- Models/Discord: support `provider/*` entries in `agents.defaults.models` so `/model`, `/models`, and model pickers can show dynamically discovered models for selected providers without exact model allowlists. Fixes #79485. Thanks @rendrag-git.
- Gateway/watch: rebuild or restage missing bundled-plugin dist and runtime-postbuild outputs before launching the Gateway from a source checkout, preventing incomplete watch-mode runtime trees. (#70805) Thanks @rubencu.
- CLI/update: allow restart health probes from the previous gateway protocol during self-update, and make plugin dry-runs report exact npm target versions instead of `unknown` while preserving unchanged status.
- OpenAI/Codex: forward persisted `openai-codex` OAuth profile metadata into Codex plugin harness attempts after canonical `openai/*` migration, so OAuth-only installs keep using native Codex auth instead of falling through to direct OpenAI API-key auth. Fixes #79978.
- OpenAI/Codex: point gateway missing-key recovery and wizard docs at the canonical `openai/gpt-5.5` plus Codex OAuth route, and fix trajectory export errors so they suggest the valid `openclaw sessions` command.
- Google/Gemini: normalize retired `google/gemini-3-pro-preview` primary, fallback, and model-map refs during config load and unrelated config writes so saved config keeps targeting Gemini 3.1 Pro Preview.
- Google/Gemini: normalize retired Gemini 3 Pro Preview ids inside emitted Google provider model config, so regenerated models.json rows test `google/gemini-3.1-pro-preview`.
- Google/Gemini: normalize retired Gemini 3 Pro Preview ids for explicit OpenAI-compatible Google and Gemini CLI provider configs, so emitted config targets `google/gemini-3.1-pro-preview`.
- Google/Gemini: normalize retired Gemini 3 Pro Preview ids preserved from existing merged models.json providers so config emission keeps targeting `google/gemini-3.1-pro-preview`.
- Google/Gemini: normalize retired Gemini 3 Pro Preview ids inside provider auth config patches so setup-emitted provider catalogs test `google/gemini-3.1-pro-preview`.
- GitHub Copilot: mint short-lived Copilot API tokens with the same `vscode-chat` integration identity used by runtime requests, and refresh legacy cached tokens missing that identity so image-capable Copilot models no longer inherit the `copilot-language-server` scope. Fixes #79946, #80074. Thanks @TurboTheTurtle.
- Plugins/doctor: drop stale managed npm install records when `openclaw doctor --fix` removes npm packages that shadow bundled plugins, so the rebuilt registry no longer resurrects the removed package metadata.
- Doctor: warn when a per-agent model config omits the `fallbacks` key and `agents.defaults.model.fallbacks` is non-empty. Covers both string-form (`"model": "..."`) and partial-object form (`"model": { "primary": "..." }`) — both silently clobber the defaults chain at runtime. Use `"fallbacks": []` to explicitly opt out of fallbacks, or add `"fallbacks": [...]` to inherit or override. Fixes #79369. Thanks @Kaspre.
- Discord/voice: reuse or suppress late realtime consult tool calls without stealing newer speaker context or speaking forced fallback answers twice.
- Discord/voice: skip likely incomplete realtime forced-consult transcript fragments and non-actionable closings so stale partial speech does not queue delayed answers over the next turn.
- Discord/voice: keep realtime forced consults from clearing active exact-speech playback, so back-to-back voice answers queue instead of cutting each other off.
- Discord/voice: synthesize realtime playback timestamps from emitted Discord PCM so OpenAI realtime barge-in truncation no longer sees `audioEndMs=0` and skips legitimate interruptions.
- Plugin SDK: keep activated linked plugin runtime facades loadable when bundled plugin fallback is disabled. Thanks @shakkernerd.
- Feishu: auto-thread `message(action="send")` replies inside the topic when the active session is group_topic or group_topic_sender, and propagate `replyInThread` through text, card, and media outbound adapters so topic-scoped sessions no longer post at the group root. Fixes #74903. (#77151) Thanks @ai-hpc.
- WhatsApp: pass routing context into voice-note transcript echo preflight so echoed transcripts can deliver to the originating chat. Fixes #79778. (#79788) Thanks @hclsys.
- Cron/failover: classify structured OpenAI-compatible `server_error` payloads as `server_error`, expose that reason in cron state, and let one-shot cron retry policy honor `retryOn: ["server_error"]` without requiring raw `5xx` text. (#45594) Thanks @clovericbot.
- Slack: wake the resolved thread session after interactive reply button/select clicks and carry Slack delivery context through the queued interaction event, so clicks continue the visible conversation. Fixes #79676 and #61502. (#79836) Thanks @velvet-shark, @tianxiaochannel-oss88, and @Saicheg.
- WhatsApp/streaming: send only the new suffix when text-end block replies repeat prior preambles across tool-call cycles, preventing cumulative WhatsApp preamble messages. Fixes #78946. (#79120) Thanks @brokemac79 and @papawattu.
- Tests/security audit: sandbox `audit-exec-surface.test.ts` under a per-case OpenClaw home tempdir, redirecting `OPENCLAW_HOME` (which wins over `HOME`/`USERPROFILE` in `resolveRawHomeDir`) alongside `HOME` and `USERPROFILE`, so its `saveExecApprovals(...)` calls never touch the live `~/.openclaw/exec-approvals.json` on the host running the suite. Sibling exec-approvals tests already used the tempdir pattern; this file did not, so running `pnpm test` against a contributor's local checkout was silently truncating their real approvals to `{ "version": 1, "agents": {} }`. (#79885) Thanks @omarshahine.
- ACP/gateway: preserve `AcpRuntimeError` cause chain (code/method/JSON-RPC detail) through the lifecycle boundary so gateway logs, telegram replies, and tool-result text show the actual upstream failure instead of opaque `Internal error`/`[object Object]`, with redaction applied before the chain reaches log or reply surfaces.
- Channels/iMessage: wire `action: "reply"` attachments through `imsg send-rich --file` when the installed imsg build advertises that capability (probed once via `imsg send-rich --help` and cached on the private-API status). Reply now hydrates `media`/`mediaUrl`/`fileUrl`/`mediaUrls[0]`/`filePath`/`path`/base64 `buffer`+`filename` through the shared outbound resolver, stages buffers via the existing `withTempFile` helper, rejects `http(s)://` URL attachments with a targeted error pointing callers at `send`'s full attachment-resolver pipeline, and falls back to the explicit `imsg#114 not landed yet` error on older imsg builds. Depends on the upstream `openclaw/imsg#114` capability landing in an installable release; until then the new path stays gated and users see the same explicit fallback `#79822` introduced. (#79864) Thanks @omarshahine.
- Telegram: preserve the first-preview debounce while appending true partial-stream deltas, so edited draft previews no longer duplicate earlier text when providers emit incremental output. (#80045) Thanks @TurboTheTurtle.
- Agents/Anthropic: report 1M session context for Claude Opus/Sonnet 4 models even when local model config still advertises 200k, matching model discovery and preventing premature status/UI overflow. Fixes #66766.
- Models/OpenRouter: hide missing-auth direct provider rows in `/model status` when they are only duplicated by a nested OpenRouter model id such as `openrouter/google/...`, while preserving explicitly configured direct providers. Fixes #62317.
- Models: preserve an explicitly selected provider/model such as `opencode-go/deepseek-v4-pro` when another provider owns the same bare model alias. Fixes #79325.
- Models/config: explain missing `models.providers.<provider>.models[]` registration when a model exists only in `agents.defaults.models`, instead of returning a bare unknown-model error. Fixes #80089.
- MCP/tools: prefix bundle MCP server/tool fragments that would start with digits, keeping generated tool names valid for Moonshot/Kimi and other strict providers. Fixes #79179.
- Models/OpenRouter: treat `403 API key budget limit exceeded` as billing so model fallback advances instead of retrying the exhausted primary. Fixes #60191. Thanks @omgitsgela.
- Models/OpenRouter: repair stale session overrides that lost the outer `openrouter/` provider wrapper, so sessions return to the configured OpenRouter model instead of failing as an unknown direct-provider model. Fixes #78161. Thanks @hjamal7-bit.
- Google/Gemini: default API-key onboarding back to `google/gemini-3.1-pro-preview` so fresh Gemini test configs exercise Gemini 3.1 Pro Preview.
- Telegram: show full provider/model labels for nested OpenRouter model ids in the model picker, so `openrouter/openai/gpt-5.4-mini` no longer displays as `openai/gpt-5.4-mini`. Fixes #67792. (#72752) Thanks @iot2edge.
- Models/OpenRouter: preserve live `supported_parameters` tool support metadata so non-tool Perplexity Sonar models no longer receive agent tool payloads and fall back unnecessarily. Fixes #64175. Thanks @Catfish-75.
- Models/OpenRouter: add MoonshotAI Kimi K2.5 to the bundled OpenRouter catalog so onboarding/model pickers can offer it without waiting for live discovery. Fixes #14601.
- Models/OpenRouter: keep keyRef/tokenRef-backed auth profiles visible to read-only PI model discovery, so OpenRouter models stay available in model pickers without storing plaintext keys. Fixes #58106. Thanks @ThalynLabs.
- Models/list: include explicit configured provider rows and read-only auth-backed catalog rows in the default configured view without loading PI's full registry, keeping Control UI pickers aligned with usable model auth. Refs #79381. Thanks @ismael-81.
- Security/audit: honor `tools.byProvider["provider/model"].deny` when reporting small-model web/browser exposure, so per-model OpenRouter mitigations clear the `models.small_params` exposure signal. Fixes #80118.
- Models/Moonshot: accept direct `moonshotai/...` and `moonshot-ai/...` refs as aliases for canonical `moonshot/...`, so copied OpenRouter Kimi ids no longer fail as unknown direct models. Fixes #73876. (#74946) Thanks @jeffrey701.
- Kimi Code: use Kimi's stable `kimi-for-coding` API model id in bundled catalog, onboarding, and docs while normalizing legacy `kimi-code` and `k2p5` refs. Fixes #79965.
- Telegram: render cached reply targets and nearby group chatter as one selected conversation context window, so stale replies no longer split JSON reply chains from local chat context.
- Volcengine/Kimi: strip provider-unsupported tool schema length and item constraint keywords for direct and coding-plan models so hosted Kimi runs do not reject message tools with `minLength`. Fixes #38817.
- DeepSeek: backfill V4 `reasoning_content` replay fields for unowned OpenAI-compatible proxy providers, preventing follow-up request failures outside the bundled DeepSeek and OpenRouter routes. Fixes #79608.
- iMessage: emit a WARN log when an action is blocked because the imsg private API bridge is not attached, so operators see the silent-drop in `~/.openclaw/logs/openclaw.log` instead of having to read per-session trajectory JSONL `tool.result` payloads. Common after a gateway restart un-injects the dylib from Messages.app. (#80035) Thanks @omarshahine.
- Codex: cross-fill missing `thread.id` and `thread.sessionId` before schema validation so live Codex app-server responses that omit `sessionId` no longer fail `thread/start` or `thread/resume`. Fixes #80124. (#80137) Thanks @kagura-agent.
- Agents/Pi: wait for embedded abort cleanup to settle before releasing the session write lock, preventing follow-up turns from racing previous prompt teardown. (#80239) Thanks @samzong.
- WhatsApp: downgrade OpenClaw watchdog-triggered Web reconnects from runtime errors to recovery warnings and clear the recovered reconnect status after the next healthy connection. (#77026) Thanks @rubencu.
- ACPX/Windows: hide the MCP proxy target child process window on Windows so ACP-backed agents do not flash or fail because of terminal window handling. Fixes #60672. (#60678) Thanks @KChow-ctrl.
- Agents: abort generic repeated no-progress tool loops at the critical threshold when identical calls keep returning identical outcomes. (#80668) Thanks @frankekn.
- Exec approvals: omit generated command highlights for non-POSIX Windows and shell-wrapper approval commands until those command languages have native highlighting support. (#80566) Thanks @jesse-merhi.
- Telegram: keep verbose tool progress and result drafts separate from the final assistant answer so tool output no longer blends into the final Telegram message. (#80294) Thanks @jalehman.
- Plugin SDK/Windows: enable the native require fast path for root `openclaw/plugin-sdk` dist aliases instead of forcing Jiti transforms. (#80878) Thanks @medns.
- Agents/compaction: keep the recent tail after manual `/compact` when Pi returns an empty or no-op compaction summary, preventing blank checkpoints from replacing the live context.
- Native commands: handle slash commands before workspace and agent-reply bootstrap so Telegram `/status` and other command-only native replies do not wait behind full agent turn setup.
- Telegram/groups: include the recent local chat window and nearby reply-target window as generic inbound context so stale reply ancestry does not overshadow the live group conversation.
- Plugins/Nix: allow externally configured plugin roots under `/nix/store` to load in `OPENCLAW_NIX_MODE=1` while keeping normal external plugin hardlink rejection unchanged. Thanks @joshp123.
- Nextcloud Talk: include the required bot `response` feature in setup, explain missing `--feature response` on rejected sends, and surface missing response capability in doctor/status checks. Fixes #78935. (#79657) Thanks @joshavant.
- fix(discord): gate user allowlist name resolution [AI]. (#79002) Thanks @pgondhi987.
- fix(msteams): gate startup user allowlist resolution [AI]. (#79003) Thanks @pgondhi987.
- Infra/fetch-timeout: pass `operation` and `url` context to `buildTimeoutAbortSignal` from the music-generate reference fetch and the Matrix guarded redirect transport, so the `fetch timeout reached; aborting operation` warning carries actionable structured fields instead of a bare line. Fixes #79195. Thanks @pandadev66.
- Harden macOS shell wrapper allowlist parsing [AI]. (#78518) Thanks @pgondhi987.
- macOS/config: reject stale or destructive app fallback config writes before direct replacement and keep rejected payloads as private audit artifacts, so `gateway.mode`, metadata, and auth are not silently clobbered. Fixes #64973 and #74890. Thanks @BunsDev.
- Gateway/macOS: include Apple Silicon Homebrew bin and sbin directories in generated LaunchAgent service PATHs and service-audit expectations so `openclaw gateway restart` keeps Homebrew Node installs reachable. Fixes #79232. Thanks @BunsDev and @TurboTheTurtle.
- Doctor/OpenAI: stop pinning migrated `openai-codex/*` routes to the Codex runtime so mixed-provider agents keep automatic PI routing for MiniMax, Anthropic, and other non-OpenAI model switches.
- Doctor/OpenAI: remove stale whole-agent Codex runtime pins while repairing legacy OpenAI-Codex routes, so upgraded agents do not force an unregistered Codex harness before provider/model routing can choose the right runtime.
- Gateway/macOS: `openclaw gateway stop` now uses `launchctl bootout` by default instead of unconditionally calling `launchctl disable`, so KeepAlive auto-recovery still works after unexpected crashes; use the new `--disable` flag to opt into the persistent-disable behavior when a manual stop should survive reboots. Fixes #77934. Thanks @bmoran1022.
- Gateway/macOS: `repairLaunchAgentBootstrap` no longer kickstarts an already-running LaunchAgent, preventing unnecessary service restarts and session disconnects when repair runs against a healthy gateway. Fixes #77428. Thanks @ramitrkar-hash.
- Gateway/macOS: `openclaw gateway stop --disable` now persists the LaunchAgent disable bit even after a previous bootout left the service not loaded, keeping the explicit stay-down path reliable. (#78412) Thanks @wdeveloper16.
- CLI/status: keep lean `openclaw status --json` off manifest-backed channel discovery so configured-channel checks do not repeatedly rescan plugin metadata. Fixes #79129.
- Gateway/Tailscale: add opt-in `gateway.tailscale.preserveFunnel` so when `tailscale.mode = "serve"` and an externally configured Tailscale Funnel route already covers the gateway port, OpenClaw skips re-applying `tailscale serve` on startup and skips the `resetOnExit` teardown for that run, keeping operator-managed Funnel exposure alive across gateway restarts. Fixes #57241. Thanks @RenzoMXD.
- Control UI/chat: hide retired and non-public Google Gemini model IDs from chat model catalogs and route the bare `gemini-3-pro` alias to Gemini 3.1 Pro Preview instead of the shut-down Gemini 3 Pro Preview. Thanks @BunsDev.
- CLI/infer: canonicalize case-only catalog model refs in `infer model run --model` so mixed-case provider/model strings resolve to the canonical catalog entry instead of failing with `Unknown model`. (#78940) Thanks @ai-hpc.
- CLI/infer: allow explicit local `infer model run --model <provider/model>` probes to use exact bundled static catalog rows before the provider is written to config, surfacing missing credentials as auth errors instead of `Unknown model`.
- CLI/install: revert the beta-only global root-refusal guard so existing root-managed VPS installs keep working; the DigitalOcean split-brain protection will move to a narrower image/install-specific path. Refs #67478 and #67509. Thanks @vincentkoc.
- Auto-reply/media: resolve `scp` from `PATH` when staging sandbox media so nonstandard OpenSSH installs can copy remote attachments.
- Agents/PI: route PI-native OpenAI-compatible default streams through OpenClaw boundary-aware transports so local-compatible model runs keep API-key injection and transport policy.
- Gateway/media: require authenticated owner or admin context for managed outgoing image bytes instead of trusting requester-session headers.
- Doctor/gateway: avoid duplicate Node runtime warnings when the daemon install plan already selected a supported Node runtime.
- Gateway/nodes: ignore malformed non-string capability entries from live nodes instead of throwing while listing the node catalog.
- Gateway/pairing: preserve deliberately narrowed role-token scopes when approving device scope upgrades instead of regranting the whole approved baseline.
- Telegram/ACP: keep chat-bound ACP replies durable by delivering final-only ACP output as final text instead of transient Telegram preview blocks. Thanks @shakkernerd.
- Telegram: hydrate replied-to messages as a persisted nearest-first reply chain so agents can see observed parent text, media refs, captions, senders, timestamps, and nested replies instead of guessing from a shallow reply id.
- Telegram: skip the rewritten silent-reply fallback when the dispatcher reports a final reply was queued in the same turn so a "No extra answer from me." filler cannot race ahead of the actual reply when lane delivery state never observes the send. Fixes #78929.
- Gateway/watch: leave `OPENCLAW_TRACE_SYNC_IO` disabled by default in `pnpm gateway:watch:raw` so watch mode avoids noisy Node sync-I/O stack traces unless explicitly requested.
- Codex app-server: close stdio stdin before force-killing the managed app-server, matching Codex single-client shutdown behavior and avoiding unsettled CLI exits after successful runs.
- CLI/Codex: dispose registered agent harnesses during short-lived CLI shutdown so successful Codex-backed `agent --local` runs do not leave app-server child processes alive.
- Agents/Codex: auto-enable the Codex harness plugin for one-shot OpenAI model overrides so `openclaw agent --local --model openai/...` does not fail with an unregistered `codex` harness.
- Gateway/live tests: avoid full model-registry enumeration for explicit provider-qualified live model filters, preventing `.profile` OpenAI gateway profile runs from hanging before provider dispatch.
- Gateway/status: surface CLI and gateway runtime versions, warn about stale PATH/global wrappers when they differ, and add stale-wrapper checks to the newer-config warning. Refs #79091. Thanks @RamaAditya49 and @sallyom.
- Google/Gemini: retry stalled Gemini 3 preview direct API-key streams with a lean first-response payload and share Gemini tool-schema cleanup across direct Google and Gemini CLI providers, so main sessions with coding tools can recover before the LLM idle watchdog fires. (#79668) Thanks @joshavant.
- Update/plugins: run a mandatory post-core convergence pass after `openclaw update` swaps the core package and before the gateway restarts, repairing missing configured plugin payloads, validating active install records including `openclaw.extensions`, and exiting with structured repair guidance instead of restarting the gateway with broken plugins. (#79143) Thanks @BKF-Gitty.
- Providers: preserve non-OK `text/event-stream` response bodies so provider HTTP errors keep their JSON detail instead of collapsing to generic streaming failures. Fixes #78180.
- Gateway/auth: make explicit `trusted-proxy` mode fail closed instead of accepting local password fallback credentials after trusted-proxy identity checks fail. Fixes #78684.
- Active memory: treat Google Chat `spaces/...` conversation ids as scoped targets instead of runnable channel names so recall runs no longer fail bundled-plugin dirName validation. Fixes #78918.
- Active memory: make `/active-memory status` honor the configured agent allowlist instead of reporting on for agents where recall is disabled. Fixes #78986.
- Mistral: normalize structured OpenAI-compatible completions content blocks so thinking objects are not persisted as `[object Object]` visible reply text. Fixes #78846.
- Tools/session status: render the active heartbeat/run model for `session_status({"sessionKey":"current"})` instead of falling back to the persisted session default. Fixes #77493.
- Doctor/secrets: allow safe inherited exec SecretRef `passEnv` names such as `HOME` while still blocking dangerous runtime env hooks. Fixes #78216.
- Chat commands: make `/model default` reset the session model override instead of treating it as a literal model name. Fixes #78182.
- Cron: make rejected `payload.model` errors show the configured `agents.defaults.models` allowlist instead of echoing the rejected model twice. Fixes #79058.
- Agents/subagents: retry parent wake announces when the announce-summary model run fails with fallback cooldown exhaustion instead of dropping the wake on the first transient provider overload. Refs #78581.
- Providers/network: honor IPv4 CIDR and octet-wildcard `NO_PROXY` entries such as `100.64.0.0/10` and `100.64.*` before enabling trusted env-proxy mode for model-provider requests. Fixes #79030.
- Skills: cap skills watcher directory traversal at the same depth used by skill discovery so large non-skill trees under configured skill roots do not exhaust file descriptors on startup. Fixes #75501. Thanks @wzq-xzwj.
- Docs/Docker: document a local Compose override for Docker Desktop DNS failures in the shared-network `openclaw-cli` sidecar, keeping the default compose setup hardened while unblocking `openclaw plugins install` when users opt in. Fixes #79018. Thanks @Jason-Vaughan.
- Installer: when npm installs `openclaw` outside the parent shell PATH, print follow-up commands with the resolved binary path instead of telling users to run `openclaw` from a shell that will report `command not found`. Fixes #72382. Thanks @jbob762.
- Plugins/runtime: share MIME and JSON Schema helpers across bundled plugins while preserving canonical media MIME inference, browser URL wildcard semantics, migration home-path resolution, QA request-limit responses, and extensionless text file previews.
- Agents/memory flush: persist the pre-increment compaction counter after flush-triggered compaction so consecutive eligible compaction cycles run memoryFlush instead of alternating. Fixes #12590. Refs #12760, #26145, and #46513. Thanks @Kaspre, @lailoo, @drvoss, @Br1an67, and @dial481.
- Status: treat CLI runtime aliases such as `claude-cli/<model>` as the canonical selected provider route in `/status`, avoiding spurious fallback/unknown-auth display and preserving fresh context usage from CLI usage snapshots. Fixes #79015. Thanks @ItsThierry.
- Agents/subagents: stop the `sessions_spawn` accepted note from recommending `sessions_yield` as the default wait path in push-based chat and CLI flows. Fixes #78913. Thanks @oiGaDio.
- Compute plugin callback authorization dynamically [AI]. (#78866) Thanks @pgondhi987.
- Telegram: deduplicate media attachments in non-streaming mode so block-delivered images are not resent in the final reply, and clear legacy `mediaUrl` fallback when all media URLs are filtered. Fixes #78372.
- Gateway/auth: allow `gateway.auth.mode: "none"` loopback backend RPC clients to skip device identity only for local non-browser backend connections, restoring subagent spawns and gateway tools without opening remote or browser-origin bypasses. Fixes #75780. Thanks @yozakura-ava.
- Canvas plugin: keep legacy root `canvasHost` configs valid until `openclaw doctor --fix` migrates them into `plugins.entries.canvas.config.host`, move Canvas/A2UI clients to gateway protocol v4 plugin surfaces, and refresh the generated A2UI bundle hash so normal builds stay clean.
- feishu: honor config write policy for dynamic agents [AI]. (#78520) Thanks @pgondhi987.
- fix(skill-workshop): honor pending approval for tool suggestions [AI]. (#78516) Thanks @pgondhi987.
- BytePlus: mark Kimi K2.5 and Kimi K2 Thinking catalog entries as reasoning-capable, raise their output cap to 32k tokens, and fill Kimi cache-read pricing. Fixes #54149.
- Control UI/chat: wait for an in-flight model dropdown patch before sending the next chat message, so immediate sends use the selected session model instead of racing the previous override. Fixes #54240.
- Native chat: decode gateway-provided thinking metadata for the iOS/macOS picker so provider-specific levels such as `adaptive`, `xhigh`, and `max` appear without leaking unsupported default-model options. Thanks @BunsDev.
- Agents/compaction: cap summarization output reserve tokens to the selected model's `maxTokens` so 1M-context Anthropic compactions do not request more output than the API permits. Fixes #54383.
- Control UI/login: replace raw connection failures with structured, actionable login guidance for auth, pairing, insecure HTTP, origin, protocol, and transport failures. Thanks @BunsDev.
- Agents/tools: fail `exec host=node` before `system.run` when the selected node is known to be disconnected, with an actionable reconnect message instead of a raw node invoke failure. Thanks @BunsDev.
- Agents/models: accept legacy `anthropic-cli/*` model refs as Claude CLI runtime refs instead of failing model resolution with `Unknown model`. Thanks @BunsDev.
- Agents/tools: keep restrictive-profile tool-section warnings scoped to the configured sections whose tools are still missing from `alsoAllow`, so already re-allowed filesystem tools do not make exec-only fixes look broader than they are. Thanks @BunsDev.
- Agents/tools: avoid warning messaging-only agents about inherited global `tools.exec` or `tools.fs` sections when the agent profile did not configure those tool sections itself. Thanks @BunsDev.
- Codex dynamic tools: normalize runtime `toolsAllow` entries the same way as Pi tool policy, so aliases like `bash` and `apply-patch` still expose the intended OpenClaw tools. Thanks @BunsDev.
- Memory/dreaming: read OpenAI-style `output_text` assistant parts from narrative subagent transcripts, so light-phase Dream Diary entries are not dropped as empty. Thanks @BunsDev.
- OpenAI-compatible providers: honor `compat.supportsTools=false` by stripping tool payload fields before dispatch to chat-only endpoints. Fixes #74664.
- OpenAI-compatible providers: apply model-declared unsupported tool-schema keyword stripping to native OpenAI transport payloads and mark Fireworks Kimi K2.5 as rejecting `not` schemas. Fixes #75467.
- OpenAI-compatible gateway: sanitize images supplied through request content even when the prompt text contains no image file references, preventing oversized attachment payloads from bypassing the resize/drop pipeline. Fixes #59913.
- Auth profiles: normalize inline API keys and tokens loaded from `auth-profiles.json` so masked or rich-text credential artifacts fail as auth errors instead of crashing HTTP header construction. Fixes #77624.
- llm-task: resolve configured model aliases before embedded dispatch so `model="gemini-flash"` and other aliases route to the intended provider instead of the agent default. Fixes #54166.
- Media generation: resolve slash-containing model-only overrides like `fal-ai/flux/dev` through registered provider model metadata so FAL image/video models do not get misparsed as provider `fal-ai`. Fixes #77444.
- CLI backends: keep versioned OAuth identity matches reusable when auth profile ids rotate, so Claude CLI sessions do not reset and lose continuity during same-account OAuth refresh/profile alias changes. Fixes #78541.
- Amazon Bedrock: refresh shared AWS profile/config file credentials before Bedrock model, discovery, and embedding requests so long-running Gateway processes pick up renewed profile credentials without restart. Fixes #77551.
- Amazon Bedrock: treat named `aws-sdk` auth profiles as config routing metadata instead of stored credentials, and let `doctor --fix` move legacy markers out of `auth-profiles.json`. Fixes #69708.
- Anthropic: reject uppercase provider-prefixed forward-compat model ids locally instead of sending malformed dynamic ids upstream. Fixes #73715.
- OpenAI/embeddings: pass configured output dimensionality through single and batched embedding requests so memory embedding indexes can request smaller vectors. Fixes #55126.
- CLI/infer: normalize HEIC/HEIF image files to JPEG before model-run requests, avoiding providers that reject Apple image container formats. Fixes #50081.
- CLI/infer: fall back to macOS `sips` when optional image tooling cannot decode HEIC/HEIF input files before model-run requests. Refs #50081.
- OpenRouter: keep the default `openrouter/auto` model ref canonical while preventing TUI and Control UI catalog pickers from displaying or submitting `openrouter/openrouter/auto`. Fixes #62655.
- Status/Claude CLI: show `oauth (claude-cli)` for working Claude CLI OAuth runtime sessions instead of `unknown` when no local auth profile exists. Fixes #78632. Thanks @gorkem2020.
- Memory search: preserve keyword-only hybrid FTS matches when vector scoring is unavailable or below the configured minimum score, so exact lexical hits are not dropped by weighted min-score filtering.
- Heartbeat/async exec: remap cron-run session keys to agent-main (or `"global"` under `session.scope=global`) at the bash exec, ACP, gateway node-event, and CLI watchdog enqueue sites, and treat cron-run descendants as ephemeral for retention pruning, so async exec completion events land in the same queue the heartbeat drains instead of being stranded under the ephemeral cron-run key. Refs #52305. Thanks @Kaspre.
- Wake protocol/system event CLI: type an optional `sessionKey` on `WakeParamsSchema`, add `--session-key` to `openclaw system event`, and keep cron enqueue/wake adapters resolving session-key-only targets symmetrically so callers can target a specific session for async-task completion relays instead of always hitting the agent's main session. Refs #52305. Thanks @Kaspre.
- Exec approvals/node: let trusted backend node invokes complete no-device Control UI approvals after the original request connection changes, while keeping node, command, cwd, env, and allow-once replay bindings enforced. Fixes #78569. Thanks @naturedogdog.
- Agents/subagents: keep background completion delivery on the requester-agent handoff/queue-retry path instead of raw-sending child results directly, and strip child-result wrapper or OpenClaw runtime-context scaffolding from queued outbound retries. Fixes #78531. Thanks @EthanSK.
- Sandbox: recreate cached browser bridges when JavaScript-evaluation permission changes, keep failed prune removals tracked for retry, and make cross-device directory moves copy-then-commit without partially emptying the source on failure.
- CLI/completion: guard the shell-profile source line written by `openclaw completion --install` with a file existence check (`[ -f ... ] && source ...` for bash/zsh, `test -f ...; and source ...` for fish) so uninstalling OpenClaw no longer makes new login shells error on a missing completion cache. (#78659) Thanks @sjf.
- Telegram: fail private-topic sends instead of retrying them as plain DMs when Telegram rejects the topic id, keeping private-topic `message_thread_id` routing intact. Fixes #79455. (#78575) Thanks @tmimmanuel.
- Discord/groups: instruct group-chat agents to stay silent when a message is addressed to someone else, replying only when invited or correcting key facts. (#78615)
- Discord/groups: tell Discord-channel agents to wrap bare URLs as `<https://example.com>` so link previews do not expand into uninvited embeds. (#78614)
- Agents/fallback: fail fast on session write-lock timeouts instead of trying fallback models for local file contention. Fixes #66646. Thanks @sallyom.
- Browser/SSRF: stop closing user-owned Chrome tabs when a read-only operation (snapshot/screenshot/interactions) is rejected by the SSRF guard — only OpenClaw-initiated navigations now close on policy denial. Thanks @scotthuang.
- iMessage: stage native inbound attachments into OpenClaw-managed media and convert HEIC/HEIF images to JPEG before dispatch, so image tools can read photos sent over native iMessage without requiring BlueBubbles.
- Agents/Gateway: throttle and cap live exec command-output events so noisy tool runs cannot flood Gateway WebSocket clients or starve RPC handling. (#78645) Thanks @joshavant.
- Memory Wiki: skip empty and whitespace-only source pages when refreshing generated Related blocks, preventing blank pages from being rewritten into Related-only stubs. Fixes #78121. Thanks @amknight.
- Telegram: keep duplicate message-tool-only Codex turns from posting generic silent-reply fallback text, so private finals stay private after inbound dedupe. Thanks @rubencu.
- Telegram/sessions: gap-fill delivered embedded final replies into the session JSONL even when the runner trace is missing, so Telegram answers after tool calls do not vanish from the durable transcript. Fixes #77814. (#78426) Thanks @obviyus, @ChushulSuri, and @DougButdorf.
- Cron/heartbeat: let restricted cron-triggered runs read their own status and current-job list metadata again, preventing heartbeat STATUS freshness checks from going stale while preserving self-remove-only mutation limits. Fixes #78208. Thanks @amknight.
- Channels/cron: ignore stale runtime conversation bindings that point at completed isolated cron run sessions, so follow-up DMs fall back to their normal route instead of reusing a closed cron task prompt. Fixes #78074. Thanks @amknight.
- ACP: preserve streamed chunk boundaries in background-task progress summaries so CJK text, paths, URLs, and identifiers are no longer split with synthetic spaces. Fixes #78312. Thanks @amknight.
- Agents/DeepSeek: suppress provider-private DSML transport syntax (tool-use-error, tool-call, function-call shadow blocks) so it never leaks into assistant-visible text; native `delta.tool_calls` remains the only authoritative tool-call source. (#78331) Thanks @samzong.
- Agents/subagents: preserve the delegated task prompt when a spawned target agent uses `systemPromptOverride`, so `sessions_spawn(mode: "run")` child runs still see their assigned task. Fixes #77950. Thanks @amknight.
- Node/Windows: fall back to the Startup-folder launcher when Spanish-localized `schtasks` reports `Acceso denegado`, matching the existing access-denied fallback path. Fixes #77993. Thanks @jackonedev.
- Plugins/diagnostics: make source-only TypeScript package warnings actionable by explaining that missing compiled runtime output is a publisher packaging issue and pointing users to update/reinstall or disable/uninstall the plugin. Fixes #77835. Thanks @googlerest.
- Control UI/chat: keep persisted assistant progress text visible when the same transcript turn also contains tool-use metadata, so chat.history reloads no longer make those replies vanish after the next user message. Fixes #77374. Thanks @BunsDev.
- Cron: repair persisted future `nextRunAtMs` values that no longer line up with the cron schedule, so daily timezone-aware jobs do not stay jumped to stale future dates. Fixes #77867. Thanks @hongfangsong.
- Agents/memory: keep error payloads visible during silent maintenance turns, so restricted memory-flush tool writes surface as chat errors instead of disappearing behind a silent run. Fixes #77821. Thanks @praxstack.
- TUI: skip the generic CLI respawn wrapper for interactive launches, exit cleanly on terminal loss, and refuse to restore heartbeat sessions as the remembered chat session, preventing stale heartbeat history and orphaned `openclaw-tui` processes on first boot. Thanks @vincentkoc.
- Doctor/sessions: move heartbeat-poisoned default main session store entries to recovery keys and clear stale TUI restore pointers, so `doctor --fix` can repair instances already stuck on `agent:main:main` heartbeat history. Thanks @vincentkoc.
- Agents/context engines: keep hidden OpenClaw runtime-context custom messages out of context-engine assemble, afterTurn, and ingest hooks so transcript reconstruction plugins only see conversation messages. Thanks @vincentkoc.
- Agents/compaction: treat visible custom-message, bash, and branch-summary entries as real conversation anchors so safeguard mode does not write empty fallback summaries for cron and split-turn sessions with substantive tool work. Fixes #78300. Thanks @amknight.
- Network/runtime: avoid importing Undici's package dispatcher during no-proxy timeout bootstrap so external channel plugin fetch requests with explicit Content-Length keep working. Fixes #78007. Thanks @shakkernerd.
- Status/doctor: treat a single healthy OpenClaw Gateway listener on loopback, LAN, or wildcard bind as the expected configured gateway instead of warning that the port is already in use. Fixes #77939. Thanks @GitHoubi and @brokemac79.
- Agents/TTS: send media-bearing block replies directly when block streaming is off, so agent `tts` tool audio attached to a final text reply is delivered instead of being consumed before final Telegram/media delivery. Thanks @Conan-Scott.
- Doctor: avoid crashing on partial Linux environments when the legacy crontab probe or terminal note wrapper receives missing or non-string output. Fixes #77773. Thanks @brokemac79 and @blackflame7983.
- Gateway/performance: reuse the current compatible plugin metadata snapshot across hot read-only status, channel, auth, skills, and embedded agent settings paths, avoiding repeated synchronous plugin metadata scans during Gateway activity. Fixes #77983. Thanks @shakkernerd.
- Tasks/maintenance: prune stale cron run session registry entries while preserving running cron jobs and non-cron sessions. Fixes #73867. Thanks @brokemac79.
- Plugins: dispatch cached descriptor-backed tools by the resolved runtime tool name for unnamed factories, fixing multi-tool plugins whose shared manifest contracts exposed sibling tools but failed at execution. Fixes #78671. Thanks @zanni098.
- Plugins/update: repair plugin-local `openclaw` peer links for all recorded npm plugins after any npm update mutates the shared managed npm tree, so targeted or batch updates cannot leave Codex, Discord, or Brave with pruned SDK imports. (#77787) Thanks @ProspectOre.
- Codex harness: honor `models.providers.openai-codex.models[].contextTokens` for native `openai/*` Codex runtime runs and `/status` context reporting, so subscription-backed Codex agents use the configured OAuth context cap without inflating past the runtime model window. Fixes #77858. Thanks @lilesjtu.
- Sessions cleanup: add `openclaw sessions cleanup --fix-dm-scope` so operators who return `session.dmScope` to `main` can dry-run and retire stale direct-DM session rows while preserving transcripts as deleted archives. Fixes #47561 and #45554. Thanks @BunsDev.
- Doctor/Codex: repair legacy `openai-codex/*` routes and cron payload model refs to canonical `openai/*`, keep OpenAI agent turns on Codex by default, ignore stale whole-agent/session runtime pins, preserve explicit provider/model runtime policy, and migrate legacy runtime model refs to model-scoped runtime entries. Thanks @vincentkoc.
- Video generation: wait up to 20 minutes for slow fal/MiniMax queue-backed jobs, stop forwarding unsupported Google Veo generated-audio options, and normalize MiniMax `720P` requests to its supported `768P` resolution with the usual override warning/details instead of failing fallback.
- Channels/durable delivery: preserve channel-specific final reply semantics when using durable sends, including Telegram selected quotes and silent error replies plus WhatsApp message-sending cancellations.
- Channels/message lifecycle: build legacy channel delivery results from message receipts and add receipts to BlueBubbles, Feishu, Google Chat, iMessage, IRC, LINE, Nextcloud Talk, QQ Bot, Signal, Synology Chat, Tlon, Twitch, WhatsApp, Zalo, and Zalo Personal send results and owner-path reply delivery plus Discord, Matrix, Mattermost, Slack, and Teams send results while preserving existing message id compatibility.
- iMessage: run durable final replies through the iMessage outbound sanitizer before sending, matching direct auto-reply delivery and preventing assistant-internal scaffolding from leaking through queued delivery.
- CLI/plugins: handle closed stdin during `plugins uninstall` confirmation prompt and exit 1 with actionable `--force` guidance instead of crashing with Node exit 13 unsettled top-level await. Fixes #73562. (#73566) Thanks @ai-hpc.
- Control UI/Sessions: hide disk-discovered unregistered-agent sessions by default and fall back from restored unconfigured agent session keys before chat refresh, preventing deleted-agent stores from reopening the wrong workspace. Fixes #41685. Thanks @BunsDev.
- Slack: keep health-monitor recovery stops from poisoning manual-stop state after channel stop timeouts, allowing Socket Mode accounts to reconnect after event-loop stalls instead of staying dead until Gateway restart. Fixes #77651. Thanks @Gusty3055.
- Codex app-server: ignore account and rate-limit notifications when measuring active-turn liveness and suppress duplicate generic timeout replies after a visible messaging-tool delivery, so lost completion signals no longer keep Telegram/Discord turns active behind a delivered reply. (#79667) Thanks @joshavant.
- Control UI/Gateway: preserve verified trusted-proxy operator scopes for browser WebSocket sessions so nginx/Authelia deployments can load chat history, models, sessions, nodes, and logs instead of failing with missing operator.read. Fixes #78508. (#79643) Thanks @joshavant.
- Cloudflare AI Gateway: preserve boundary-aware Anthropic Messages transport when runtime auth creates a custom session stream, keeping the upstream x-api-key header intact for Gateway runs. (#79673) Thanks @joshavant.
- Webhooks/Gmail/Windows: resolve `gcloud`, `gog`, and `tailscale` PATH/PATHEXT shims before setup and watcher spawns, using the Windows-safe `.cmd` wrapper for long-lived `gog serve` processes. (#74881, fixes #54470) Thanks @Angfr95.
- Control UI/chat: suppress `HEARTBEAT_OK` acknowledgement history, streams, deltas, and final events before they enter the transcript view, so repeated heartbeat no-op turns do not stack noisy bubbles. Thanks @BunsDev.
- Agents/skills: require exact `<location>` skill paths for both single-skill and multi-skill prompt selection, so agents do not guess or hard-code skill file paths. (#74161) Thanks @lanzhi-lee.
- Agents/skills: rebuild sandboxed non-rw run skill prompts from the sandbox workspace copy, so `<available_skills>` no longer points at host-only `~/.openclaw/skills` paths. Fixes #50590. Thanks @kidroca and @sallyom.
- Agents/media: tell async music and video completion agents when normal final replies are private, and send completion fallbacks directly to message-tool-only group/channel routes when the completion agent still only writes a private final reply, so generated media does not disappear behind the delivery contract.
- CLI/update: report corrupt or unloadable managed plugins as post-update warnings instead of disabling them or turning a successful OpenClaw package update into a failed update result. Thanks @vincentkoc and @Patrick-Erichsen.
- Update/restart: probe managed Gateway restarts with the service environment and add a Docker product lane that exercises candidate-owned `openclaw update --yes --json` restarts, so SecretRef-backed local gateway auth cannot regress behind mocked restart checks. Thanks @vincentkoc.
- Gateway/sessions: cache selected model override resolution while building session-list rows so `openclaw sessions` and Control UI session lists stay responsive on model-heavy stores. (#77650) Thanks @ragesaq.
- Gateway/diagnostics: make stuck-session recovery outcome-driven and generation-guarded, add `diagnostics.stuckSessionAbortMs`, and emit structured recovery requested/completed events so stale or skipped recovery no longer looks like a successful abort.
- Messaging: queue assembled channel-turn final replies before sending to reduce response loss when the gateway restarts between assistant completion and channel delivery. Refs #77000.
- Agents/replay-history: drop trailing assistant turns whose content is empty or carries only the stream-error sentinel before sending the transcript to the provider, so prefill-strict providers (such as github-copilot/claude-opus-4.6) no longer reject the request with `400 The conversation must end with a user message` after a session whose last turn errored before producing content. Refs #77228. (#77287) Thanks @openperf.
- Agents/session-file-repair: drop `type: "message"` entries with a missing, `null`, or blank role during the on-disk repair pass so sessions that accumulated null-role JSONL corruption (such as the 935+ corrupt entries in #77228) get fully cleaned up rather than carried forward into the repaired file. Refs #77228. (#77288) Thanks @openperf.
- Doctor/device pairing: stop suggesting `openclaw devices rotate --role <role>` for stale local cached device auth when that role is no longer approved by the gateway pairing record, so doctor no longer points users at a command that must be denied. (#77688) Thanks @Conan-Scott.
- Ollama/thinking: expose the lightweight Ollama provider thinking profile through the public provider-policy artifact too, so reasoning-capable Ollama models such as `ollama/deepseek-v4-pro:cloud` keep `/think max` available even before the full plugin runtime activates. (#77617, fixes #77612) Thanks @rriggs and @yfge.
- Codex/app-server: stabilize transcript mirror dedupe across re-mirrored turns so reordered snapshots no longer drop reasoning entries or duplicate the assistant reply. Refs #77012. (#77046) Thanks @openperf.
- Agents/auth-profiles: do not record request-shape (`format`) rejections as auth-profile health failures, so a single per-session transcript-shape error (such as a prefill-strict 400 "conversation must end with a user message") no longer triggers a profile-wide cooldown that blocks every other healthy session sharing the same auth profile. Refs #77228. (#77280) Thanks @openperf.
- CLI/update: stop dev-channel source updates immediately when `git fetch` fails, so tag conflicts cannot keep preflight, rebase, or build steps running against stale refs while the Gateway is still on the old runtime. (#77845) Thanks @obviyus.
- Config/recovery: chmod restored `openclaw.json` back to owner-only (`0600`) after suspicious-read backup recovery on POSIX hosts, so a previously world-readable config mode cannot persist into a freshly restored credential-bearing config. (#77488) Thanks @drobison00.
- Memory/dreaming: persist last dreaming-ingestion calendar day per daily note in `daily-ingestion.json` so unchanged notes are still re-ingested once per dreaming day for promotion signals toward deep thresholds. Fixes #76225. (#76359) Thanks @neeravmakwana.
- Agents/embed: keep message_end safety delivery armed when a silent text_end chunk produces no block reply, fixing dropped Telegram/forum replies. Fixes #77833. (#77840) Thanks @neeravmakwana.
- Install/postinstall: skip noisy compile-cache prune warnings when `EACCES`/`EPERM` prevent removing shared `/tmp/node-compile-cache` entries owned by another user. Fixes #76353. (#76362) Thanks @RayWoo and @neeravmakwana.
- Agents/messaging: surface CLI subprocess watchdog/turn timeout messages to chat users when verbose failures are off, instead of collapsing them into generic external-run failure copy. Fixes #77007. (#77015) Thanks @neeravmakwana.
- Agents/sessions: after embedded Pi runs, append assistant-visible reply text to session JSONL only when Pi did not already persist an equivalent tail assistant entry, without re-mirroring the user prompt Pi owns. Fixes #77823. (#77839) Thanks @neeravmakwana.
- Plugins/CLI: load the install-records ledger when listing channel-catalog entries, so npm-installed third-party channel plugins resolve through `openclaw channels login`/`channels add` instead of failing with `Unsupported channel`. (#77269) Thanks @pumpkinxing1.
- Memory wiki/Security: enforce session visibility on shared-memory `wiki_search` and `wiki_get` so sandboxed subagents cannot read transcript content from sibling or parent sessions. Fixes GHSA-72fw-cqh5-f324. Thanks @zsxsoft.
- Exec approvals: enforce allowlist `argPattern` argument restrictions on Linux and macOS as well as Windows, so an entry like `{ pattern: "python3", argPattern: "^safe\.py$" }` no longer silently relaxes to a path-only match on non-Windows hosts. (#75143) Thanks @eleqtrizit.
- Agents/compaction: disable Pi auto-compaction whenever OpenClaw effectively owns safeguard compaction, including provider-backed safeguard mode, so Pi and OpenClaw no longer fight over long-session compaction. Fixes #73003. (#73839) Thanks @bradhallett.
- Telegram/streaming: finalize text replies by stopping the edited stream message instead of sending a second answer bubble, so Telegram turns cannot duplicate the streamed final response. (#77947) Thanks @obviyus.
- web_search/Brave: fix provider selection when Brave is installed as an external plugin and `tools.web.search.provider: "brave"` is explicitly configured — a redundant provider re-resolution at startup could race and return an empty list, causing a spurious `WEB_SEARCH_PROVIDER_INVALID_AUTODETECT` warning and treating the explicitly configured provider as absent. Fixes #77676. Thanks @openperf.
- Doctor/plugins: discover doctor contracts from load-path channel plugins during `openclaw doctor --fix`, so plugin-owned legacy config repair runs before validation. (#77477) Thanks @jalehman.
- Dependencies: bump transitive `basic-ftp` to 5.3.1 so the runtime lockfile no longer includes the vulnerable 5.3.0 build flagged by the production dependency audit. (#78637) Thanks @sallyom.
- Hooks/cron: log returned `/hooks/agent` isolated-run errors and failed cron jobs with cron diagnostic summaries, so rejected `payload.model` values are visible instead of looking like accepted-but-missing runs. Fixes #78597. (#78655) Thanks @kevinslin.
- Managed proxy/security: classify raw socket callsites and proxy runtime mutations in boundary checks so new direct egress or unmanaged proxy-state changes cannot land without explicit review. (#77126) Thanks @jesse-merhi.
- Channels/iMessage: surface the silent group-allowlist drop at default log level by emitting a one-time `warn` per account at monitor startup when `channels.imessage.groupPolicy: "allowlist"` is set without a `channels.imessage.groups` block, plus a one-time `warn` per `chat_id` when the runtime gate drops a specific group, naming the exact `channels.imessage.groups[...]` key to add to allow it. Fixes #78749. (#79190) Thanks @omarshahine.
- WhatsApp: stop Gateway-originated outbound echoes from advancing inbound activity in `openclaw channels status`, so outbound self-sends no longer look like handled inbound messages. Fixes #79056. (#79057) Thanks @ai-hpc and @bittoby.
- Gateway/nodes: preserve the live node registry session and invoke ownership when an older same-node WebSocket closes after reconnecting. (#78351) Thanks @samzong.
- Browser/downloads: route explicit and managed browser download output directories through `fs-safe` validation before staging final files, so symlinked output roots are rejected before writes. (#78780) Thanks @jesse-merhi.
- Agents/PI: skip the idle wait during aborted embedded-run cleanup, so stopped or timed-out runs clear pending tool state and release the session lock promptly. (#74919) Thanks @medns.
- Agents/current-time: split UTC into a separate `Reference UTC:` prompt line so local `Current time:` stays anchored to the user's timezone. (#42654) Thanks @chencheng-li.
- Agents/reasoning: keep embedded reasoning deltas raw for correct same-line streaming while preserving formatted Telegram, Feishu, Discord, and heartbeat delivery at the channel edge. (#78397) Thanks @medns.
- Agents/failover: rotate auth profiles before deferred cooldown marking on rate-limit failures, so file-lock contention cannot stall profile failover. Fixes #57281. (#57283) Thanks @jeremyknows.
- Gateway/sessions: when `session.dmScope: "main"` is configured, route a bare webchat `/new` against the agent's main session (`sessions.create` with `emitCommandHooks=true`) to an in-place reset instead of creating a parallel `dashboard:` child, matching `/new` behavior on Telegram/Discord. Fixes #77434. (#71170) Thanks @statxc.
- Scripts/UI/Windows: launch `.cmd` and `.bat` UI runners through the shared cmd.exe escaping path with shell mode disabled, avoiding Node.js v24 DEP0190 warnings while preserving argument boundaries. (#62910) Thanks @nandanadileep.
- Agents/CLI runner: disable supervisor stdout/stderr capture for prepared CLI runs while keeping bounded diagnostics and incremental JSONL output parsing, preventing long CLI output from being retained in memory. (#79617) Thanks @samzong.
- Telegram: treat a DM binding that carries the chat id in both `conversationId` and `parentConversationId` as a direct conversation instead of a topic, so reverse delivery for Telegram DMs is not misrouted through a topic-shaped target. (#79700) Thanks @TSHOGX.



## 🚀 v2026.5.7（官方 2026-05-07）

### 🐛 问题修复（Fixes）

- **发布/插件发布**：重试瞬态 ClawHub CLI 依赖安装失败，在某个预览格失败时保持预览通过的插件可发布，并在发布后验证每个预期的 ClawHub 包版本，使维护版本更快恢复，减少隐藏部分插件发布情况的可能。
- **OpenAI**：支持 `openai/chat-latest` 作为显式直连 API-Key 模型覆盖，用于尝试移动的 ChatGPT Instant API 别名，同时不改变稳定的默认模型。
- **Cron CLI**：在 `cron list --json` 和 `cron show --json` 输出中加入计算后的 `status`，使外部工具可以直接读取 disabled/running/ok/error/skipped/idle 状态，无需重新实现 cron 状态推导。（#78701）感谢 @aweiker。
- **Channels CLI**：`openclaw channels list` 改为仅显示渠道，添加 `--all` 展开捆绑渠道和目录渠道，显示 installed/configured/enabled 状态，并将模型 auth/使用详情移至 `openclaw models auth list`、`openclaw status` 和 `openclaw models list`。（#78456）感谢 @sliverp。
- **原生命令**：原生命令处理器尊重 owner 强制执行。（#78864）感谢 @pgondhi987。
- **Active Memory**：全局 memory 开关需要 admin scope。（#78863）感谢 @pgondhi987。
- **Gateway/sessions**：在 `/new` 和 `sessions.reset` 期间清除缓存的 skills 快照，使长生命周期 channel session 在 skills 变更后可重建可见的 skill 列表。（#78873）感谢 @Evizero。
- **自动回复**：通过 before-tool-call 授权钩子控制内联 skill 工具调度。（#78517）感谢 @pgondhi987。
- **Tavily**：从活动 runtime 配置快照解析 `tavily_search` 和 `tavily_extract` 的独立工具凭证，使 `exec` SecretRef 支持的 API Key 不会在未解析状态下到达工具。（#78610）感谢 @VACInc。
- **Plugins/install**：在托管插件 install、rollback、repair 和 uninstall npm 操作中使用与暂存包更新相同的绝对 POSIX npm 生命周期 shell，防止受限 PATH shell 破坏清理操作。感谢 @vincentkoc。
- **Agents/context engine**：当源历史缩减或组装失败时使缓存的组装上下文视图失效，防止重用重置前的过期历史。修复 #77968。（#78163）感谢 @brokemac79 和 @ChrisBot2026。
- **Discord/message**：将 `discord:channel:<id>` 等provider前缀目标解析为 channel 发送而非遗留 Discord DM 目标，跨 channel agent `message(action="send")` 调用不再将 channel ID 误路由到误导性的 `Unknown Channel` 失败。修复 #78572。
- **Agents/compaction**：将压缩摘要保留 token 限制在每个模型的输出限制内，防止高上下文压缩请求无效的 `max_tokens` 值。（#54392）感谢 @adzendo。
- **Commands/BTW**：用括号显示 `/btw` 缺失问题用法占位符，使出站 channel 清理后仍可见。修复 #62877。感谢 @RajvardhanPatil07。
- **Cron/doctor**：在 `openclaw doctor --fix` 期间移除错误的覆盖来修复 `payload.model` 存储为 `"default"`、`"null"`、空或 JSON `null` 的持久化 cron 作业，同时保持 cron runtime 模型验证严格。修复 #78549。感谢 @bizzle12368239。
- **Telegram**：在应用 Telegram 数字发送者 ID 检查之前，尊重 DMs、群组、原生命令和回调授权的 `accessGroup:*` 发送者白名单。修复 #78660。感谢 @manugc。
- **Agent delivery**：当出站投递返回无适配器结果时报告 `deliverySucceeded=false`，使声明/空投递路径不再伪装成成功发送。修复 #78532。感谢 @joeyfrasier。
- **Cron/isolated runs**：当 `delivery.channel=last` 没有先前路由时，在模型执行前使隐式 announce 投递失败，防止定期作业在遇到永久投递目标错误前消耗 token。修复 #78608。感谢 @sallyom。
- **Gateway/sessions**：在每日 gateway-agent session 轮换改变 session id 时持久化新生成的 transcript 文件，同时保留自定义 transcript 路径。修复 #78607。感谢 @nailujac、@zerone0x 和 @sallyom。
- **Doctor/Codex OAuth**：在 `doctor --fix` 期间保留工作的 `openai-codex/*` PI 路由，在只有 Codex OAuth auth 可用时恢复 2026.5.5 重写的 `openai/*` GPT-5 路由，使更新修复不会破坏订阅-auth 配置。修复 #78407。感谢 @shakkernerd。
- **Telegram**：将 polling watchdog 绑定到 `getUpdates` 存活状态，使无关的出站 Bot API 调用无法掩盖卡住的入站 poller。修复 #78422。感谢 @ai-hpc。
- **Agents/subagents**：完成的 session-mode subagent 注册表行遵循 `agents.defaults.subagents.archiveAfterMinutes` 而非硬编码的 5 分钟 TTL，使注册表支持的 surface 在不同 spawn 模式下保持单一 retention 旋钮。（#78263）感谢 @arniesaha。
- **Plugins/channel setup**：从非捆绑外部插件设置条目转发 `setChannelRuntime`，使延迟的外部 channel runtime 初始化器在启动轮询前安装。修复 #77779。（#77799）感谢 @openperf。
- **Telegram**：在入站 Telegram 消息处理期间同聊 `message` 工具出站发送成功时，将其视为已投递，从而决定是否发出重写的静默回退。（#78685）感谢 @neeravmakwana。
- **Gateway/tasks**：协调其 live run 上下文已消失的陈旧 CLI run-context 任务和绑定的 channel 热重载延迟，防止陈旧任务记录永远阻止 Discord/Slack/Telegram 重载。
- **Discord/voice**：在 `channels capabilities` 和 `channels status --probe` 中审计 Discord 语音频道权限，包括自动加入目标，使缺失的 Connect/Speak/读取消息历史权限在 `/vc join` 前显示。
- **Discord/voice**：通过将默认发言后沉默宽限期延长至 2.5 秒使语音捕获更流畅，为嘈杂 Discord session 添加 `voice.captureSilenceGraceMs`，并在使用实时 STT 片段时收紧语音输出提示。感谢 @vincentkoc。
- **WhatsApp**：通过 Baileys LID 转发映射路由主动电话号码发送，使 LID 地址联系人接收 agent 消息，而非创建仅发送者幽灵聊天。修复 #67378。（#74925）感谢 @edenfunf。
- **WhatsApp**：发送带字幕的 `MEDIA:` 指令自动回复一次，而非在字幕媒体回复前发出空媒体消息。（#78770）感谢 @ai-hpc。
- **Codex/approvals**：在 Codex 审批模式下默认停止安装 pre-guardian 原生 `PermissionRequest` hook，使 Codex 审核员在 OpenClaw 显示审批前批准安全命令，在活动 session 窗口内记住相同 Codex 原生 `PermissionRequest` payload 的 `allow-always` 决策，并使插件审批请求验证/渲染其实际允许的决策，防止 Telegram 等原生审批 UI 提供陈旧操作。感谢 @shakkernerd。
- **模型 providers**：规范化 APNG 嗅探 PNG 上传，保留 Gemini 3 工具调用 thought-signature 重放与回退签名，接受传统 `__env__:VAR` 自定义 provider key，修复 snake_case 工具调用 transcript 清理。修复 #51881、#48915、#77566 和 #42858。
- **Telegram/models**：解析 `/models` 回调查按钮中包含点的 provider id，使 `hf.co` 模型列表渲染为内联键盘按钮。修复 #38745。

## 🚀 v2026.5.6（官方 2026-05-06）

> ⚠️ 英文 CHANGELOG.md 中 v2026.5.6 标注为 Unreleased，此处按 tag 日期标注为 2026-05-06，待官方正式发布后更新状态。

### ✨ 新增功能（Highlights）

- **Google Meet / Voice Call**：Twilio 电话加入现在通过 realtime Gemini 语音桥接，支持流式音频、防压缓冲、打断队列清除，不再使用 TwiML 回退，Meet 参与者将获得更灵敏的 OpenClaw 语音助手。（#77064）感谢 @scoootscooob。

### 🔧 功能调整（Changes）

- **Discord/Voice**：ElevenLabs TTS 直接流式传输到 Discord 播放，并发送延迟优化参数，使语音回复更快开始
- **Discord/Voice**：TTS 播放中用户开始说话时保持继续，播放期间忽略新捕获避免回声，接收流中止降级为详细诊断
- **Telegram**：`message` 工具在入站 Telegram 消息处理期间同聊发送成功时，不再发送静默回退（#78685）感谢 @neeravmakwana
- **Channels CLI**：`channels list` 改为仅显示渠道，添加 `--all` 展开未配置/未安装状态，增加 `installed`/`configured`/`enabled` 标签和 JSON `origin` 字段（#78456）感谢 @sliverp
- **CLI/Cron**：`cron list --json` 和 `cron show <id> --json` 新增 `status` 字段（disabled/running/ok/error/skipped/idle）（#78701）感谢 @aweiker
- **Discord/Streaming**：Discord 回复默认使用进度草稿预览，除非显式关闭
- **Codex App-Server**：暴露 `appServer.turnCompletionIdleTimeoutMs`，后工具阶段停滞不再误报为 idle（#77984）感谢 @roseware-dev 和 @rubencu
- **Plugin Skills/Windows**：在 Windows 上通过 junction 发布插件技能目录，无需开发者模式即可注册（#77971）感谢 @hclsys 和 @jarro
- **MS Teams**：日志记录 JWKS 获取网络失败，Bot Connector 发送提示传输层回复失败（#78081）感谢 @Beandon13
- **Gateway/Sessions**：构建 session 列表行时快速路径已限定模型引用，大型存储不再重复重量级模型解析（#77902）感谢 @ragesaq
- **Codex/Approvals**：Codex 审批模式下停止安装 pre-guardian 原生 PermissionRequest hook，记住 session 窗口内相同 payload 的 allow-always 决策
- **Sessions CLI**：`openclaw sessions` 表格现在显示选中的 agent runtime
- **ACPX/Codex**：启动时收割旧 OpenClaw ACP/Codex 进程树，防止孤儿 harness 拖慢 Gateway 感谢 @91wan

### 🐛 问题修复（Fixes）

- **Control UI**：工具结果卡片支持 Markdown 渲染
- **Control UI**：修复 Discord 频道规则窄布局下操作按钮重叠
- **Android**：点击前台服务通知现在打开应用前台（#179）感谢 @Syhids
- **Cron 工具**：使用 `id` 作为 update/remove/run/runs 参数（与 gateway 参数对齐）（#180）感谢 @adamgall
- **Control UI**：聊天视图改用页面滚动，固定 header/sidebar 和 composer（无内部滚动框）
- **macOS**：定位权限设为 always-only 以避免 iOS-only 枚举（#165）感谢 @Nachx639
- **macOS**：生成符合 Swift 6 严格并发的 `Sendable` Gateway 协议模型（#195）感谢 @andranik-sahakyan
- **macOS**：捆绑 QR 码渲染模块，DMG Gateway 启动不再因缺少 qrcode-terminal 而崩溃
- **macOS**：安全解析 JSON5 配置（注释存在时不再清空用户设置）
- **WhatsApp**：心跳后台任务期间抑制打字指示器（#190）感谢 @mcinteerj
- **WhatsApp**：将离线历史同步消息标记为已读但不触发自动回复（#193）感谢 @mcinteerj
- **Discord**：避免 OpenAI/GPT 发送延迟 `text_end` 事件时产生重复回复
- **Discord**：避免 OpenAI 重复 `message_end` 事件导致重复回复
- **CLI**：bind 为 tailnet/auto 时使用 tailnet IP 进行本地 gateway 调用（修复 #176）
- **Env**：全局 `$OPENCLAW_STATE_DIR/.env`（`~/.openclaw/.env`）在 CWD `.env` 之后加载为备选
- **Env**：可选 login-shell env 备选（opt-in；仅导入期望的 key 且不覆盖现有 env）
- **Agent Tools**：OpenAI 兼容工具 JSON Schema（修复 `browser`，规范化 union schema）
- **Onboarding**：源码运行且 UI 资源缺失时自动构建（`bun run ui:build`）
- **Discord/Slack**：反应和系统通知路由到正确 session（无 main-session 污染）
- **Agent Tools**：即使 sandbox 关闭也尊重 `agent.tools` allow/deny 策略
- **Commands**：统一各 provider 的 /status（inline）和命令 auth；授权控制命令 bypass；移除 Discord /clawd 斜杠处理器
- **CLI**：`openclaw agent` 默认通过 Gateway 运行；使用 `--local` 强制嵌入式模式 感谢 @vignesh07

## 🚀 v2026.5.3（2026年5月4日）

### ✨ 新增功能（Highlights）

- **Plugins/file-transfer**：新增内置 file-transfer 插件，提供 `file_fetch`、`dir_list`、`dir_fetch`、`file_write` 工具用于配对节点二进制文件操作；默认拒绝路径策略（需 operator 审批），默认拒绝符号链接遍历（可选开启），单次往返 16 MB 上限。（#74742）感谢 @omarshahine。
- **Plugins/install**：强化官方插件安装、卸载、更新、入职引导、ClawHub 后备、npm 依赖状态报告和 beta 通道更新路径，使外部化插件获得与内置插件同等对待。
- **Gateway/performance**：启动热路径懒加载插件/运行时发现、cron、schema、shutdown、sessions 和模型元数据，减少不必要的预热开销。
- **Channels/replies**：改善 Discord 状态反应和降级传输报告，新增 WhatsApp Channel/Newsletter 目标收件人，强化 Telegram、飞书、Matrix、Microsoft Teams 和 Slack 的投递恢复行为。
- **Install/update**：修复 macOS LaunchAgent 升级失败、运行时拒绝纯源码插件包、更新/doctor 期间修复陈旧 Gateway/插件状态。
- **Agent/runtime reliability**：在常见边缘情况下保持流式响应、A2A 延迟会话回复、prompt/工具投递、记忆召回、网络搜索提供商发现和提供商思考/模型元数据。

### 🔧 功能调整（Changes）

- **Channels/Streaming**：统一 `streaming.mode: "progress"` 草稿，自动单字状态标签，Discord、Telegram、Matrix、Slack 和 Microsoft Teams 共用进度配置。
- **Agents/commands**：新增 `/steer <message>`，session 空闲时直接引导当前运行状态，无需发起新一轮对话。（#76934）
- **Tools/BTW**：新增 `/side` 作为 `/btw` 边角问题的文本和原生斜杠命令别名。
- **Doctor/config**：`doctor --fix` 现在在存在无关验证问题（如缺失插件）时也提交安全的 legacy 迁移，使 `agents.defaults.llm` 等已知遗留 key 总是被清理。（#76800）感谢 @hclsys。
- **Agents/tools**：当有效工具禁止列表已屏蔽可选 media 和 PDF 工具工厂时跳过初始化，减少不必要的热路径设置。（#76773）感谢 @dorukardahan。
- **Discord/status**：显式 reaction 工具调用可选择通过 `trackToolCalls: true` 跟踪后续工具进度，使用共享工具显示 emoji 表做状态反应。（#76327）感谢 @joshavant。
- **Gateway/config**：停止 Gateway 启动和热重载自动恢复无效配置；无效配置直接关闭，由 `openclaw doctor --fix` 负责修复。
- **Plugins/onboarding**：Manual 设置允许安装可选官方插件，包括带 npm 后备的 ClawHub 诊断，并将外部 Codex 插件作为可选 provider 设置项。（#76773）感谢 @dorukardahan 和 @vincentkoc。
- **Plugins/CLI/update**：包含包依赖安装状态；信任官方外部化 npm 迁移；清理外部化安装的陈旧内置加载路径；beta 通道优先尝试插件 `@beta` 更新。（#76079）感谢 @shakkernerd。
- **Plugins/ClawHub**：429 错误标注重置窗口和未认证更高限额提示，帮助运维判断何时恢复下载、何时登录有帮助。感谢 @romneyda。
- **Agents/sandbox**：将沙箱容器和浏览器注册条目存储为 per-runtime 分片文件，减少无关 session 锁竞争。（#74831）感谢 @luckylhb90。

### 🐛 问题修复（Fixes）

- **Update**：在持久化 `openclaw update --channel ...` 前修复 legacy 配置，防止旧 Slack/Telegram streaming key 阻止切换到 beta。感谢 @vincentkoc。
- **Web fetch**：从活跃运行时快照延迟绑定 `web_fetch` 配置和提供商回退元数据，与 `web_search` 保持一致，防止长生命周期工具使用过时设置。感谢 @vincentkoc。
- **Plugins/discovery**：已安装的 `origin: "global"` 源码插件的 TypeScript 运行时检查从配置阻塞错误降级为警告，允许运行时通过 jiti 回退到 TypeScript 源码。感谢 @romneyda。
- **Providers/OpenAI Codex**：停止 OAuth 进度旋转器显示后再展示手动重定向提示，避免回调超时跨终端刷屏 `Browser callback did not finish`。
- **Gateway/systemd**：re-stage 时保留运维人员添加的 secrets，清除 OpenClaw 自己管理的 key（如 `OPENCLAW_GATEWAY_TOKEN`），防止陈旧 env 文件副本遮盖新的 staging 值。（#76860）感谢 @hclsys。
- **Google Meet**：Chrome 媒体权限授予实际 Meet tab，OpenClaw 麦克风静音时阻止实时语音，BlackHole 捕获不再让参与者保持静音或沉默。
- **Memory/LanceDB**：在内置 memory 插件包中声明 `apache-arrow`，使 LanceDB 安装包含其运行时 peer。（#76910）感谢 @afiqfiles-max。
- **CLI/devices**：配对范围拒绝后用 `operator.admin` 重试显式设备配对审批，使已有管理权限的设备 token 可在升级后恢复 Control UI/浏览器配对。（#76956）感谢 @neo19482。
- **Control UI/WebChat**：将重复的飞行中文本发送折叠到活跃 Gateway 运行，防止快速重复提交启动新的 `agent:main:main` 分发。（#75737）感谢 @dsdsddd1 和 @BunsDev。
- **Mattermost**：接受记录的 `channels.mattermost.streaming` 配置并遵守 `streaming: "off"` 禁用草稿预览发布。感谢 @vincentkoc。
- **Microsoft Teams**：在原生 Teams 进度流中尊重进度草稿工具行，当 `channels.msteams.streaming.progress.toolProgress=false` 时抑制独立工具消息。感谢 @vincentkoc。
- **Discord**：在流式回复期间保持进度草稿边界回调绑定，progress 预览在 assistant 和 reasoning 块之间过渡时扩展 lint 保持绿色。感谢 @vincentkoc。
- **Plugins/Anthropic**：从内置 provider-policy artifact 暴露 Claude thinking 配置，使非运行时调用者保留 Opus 4.7 的 `adaptive`、`xhigh` 和 `max` 而非降级到 `high`。（#76779）感谢 @tomascupr 和 @iAbhi001。
- **Plugins/hooks**：`plugins.entries.<id>.hooks.timeoutMs` 和 `plugins.entries.<id>.hooks.timeouts` 支持从运维配置绑定插件 typed hooks，慢 hook 无需补丁已装插件代码。（#76778）感谢 @vincentkoc。
- **Telegram**：在顶级和每个账户添加 `channels.telegram.mediaGroupFlushMs`，允许运维人员调整专辑缓冲而非硬编码 500ms。（#76149）感谢 @vincentkoc。
- **Config/messages**：将布尔值 `messages.visibleReplies` 和 `messages.groupChat.visibleReplies` 强制转换为文档化的枚举模式，使直观 toggle 不再导致配置失效和渠道启动失败。（#75390）感谢 @scottgl9。
- **Feishu**：接受并遵守顶级和每个账户的 `channels.feishu.blockStreaming`，保留 legacy 默认关闭以避免飞书卡片拒绝文档化配置或静默丢弃 block 回复。（#75555）感谢 @vincentkoc。
- **Gateway/update**：避免 macOS 更新引导后立即 `launchctl kickstart -k`，在打包 postinstall 和 `doctor --fix` 期间取消链接悬空全局插件运行时符号链接，升级不再 SIGTERM 新启动的 Gateway。（#76929）
- **Google Chat**：在 google-auth/gaxios 拦截器运行前规范化自定义 Google 认证传输头，恢复 webhook token 验证。（#76742）感谢 @donbowman。
- **Doctor/plugins**：`doctor --fix` 期间重置陈旧 `plugins.slots.memory` 和 `plugins.slots.contextEngine` 引用，缺失插件配置清理不再留下无法恢复的 slot owner。（#76550 和 #76551）感谢 @vincentkoc。
- **Docs/WhatsApp**：合并 gateway channel 配置示例中重复的顶级 `web` 对象，使复制粘贴的 WhatsApp 配置保留 `web.whatsapp` 和重连设置。（#76619）感谢 @WadydX。
- **Plugins/tools**：`tools.alsoAllow` 作为可选插件工具发现提示而非权限加载每个 manifest 标记的可选插件工具。（#76616）

## 🚀 v2026.5.3-1（2026年5月4日）

### 🐛 问题修复（Fixes）

- **Plugins/security**：停止安装扫描器对官方捆绑插件包误报，当 `process.env` 访问和普通 API 发送仅出现在同一编译包的不同远处部分时不再拦截。（感谢 @vincentkoc）

## 🚀 v2026.5.2（2026年5月3日）

### ✨ 新增功能（Highlights）

- **外部插件安装**：覆盖诊断、入职引导、doctor 修复、渠道设置、安装/更新记录和产物元数据，同时保持裸包安装走 npm 作为首次过渡。感谢 @vincentkoc。
- **Gateway 性能**：针对大型或插件密集型安装优化启动、session 列表、任务维护、prompt 准备、插件加载和文件系统热路径的缓存和扇出。
- **Control UI 和 WebChat 可靠性**：改善 Sessions、Cron、长期 Gateway WebSocket、分组消息宽度、斜杠命令反馈、iOS PWA 边界、选择对比度和 Talk 诊断。
- **渠道和提供商修复**：覆盖 Telegram 话题命令和网络、Discord 投递和启动边缘情况、OpenAI 兼容 TTS/Realtime、OpenRouter/DeepSeek 重放、Anthropic 兼容流式处理、Brave/SearXNG/Firecrawl 网络搜索和语音路由。

### 🔧 功能调整（Changes）

- **Gateway/startup**：跳过启动时 secrets 预检的插件备份 auth-profile 叠加，减少 gateway 就绪延迟。（#68327）感谢 @JIRBOY。
- **Plugins/runtime**：将宽泛运行时预加载限制为从配置、启动规划、已配置渠道、slots 和自动启用规则派生的有效插件 id，不再导入每个可发现插件。
- **Agents/runtime**：在请求时复用启动加载的插件注册表用于 providers、tools、渠道操作等，稳定嵌入式运行输入不再重复插件注册解析。（感谢 @DmitryPogodaev）
- **Plugins/tools**：缓存 `api.registerTool(...)` 捕获的插件工具描述符，重复 prompt 规划可跳过插件运行时加载，执行时仍加载实时插件工具。（#76079）感谢 @shakkernerd。
- **Docs/Codex**：明确 ChatGPT/Codex 订阅设置应使用 `openai/gpt-*` 加 `agentRuntime.id: "codex"` 实现原生 Codex 运行时，而 `openai-codex/*` 保留为 PI OAuth 路由。感谢 @pashpashpash。
- **Plugins/beta**：将 ACPX 外部化为 `@openclaw/acpx` 包，将诊断 OpenTelemetry 外部化为 `@openclaw/diagnostics-otel` 包。感谢 @vincentkoc。
- **Plugins/beta**：为 Google Chat、Matrix、Mattermost、BlueBubbles、Google Meet、Nostr、Zalo、Nextcloud Talk 等准备 `2026.5.1-beta.2` npm 和 ClawHub 发布。感谢 @vincentkoc。
- **Plugins/beta**：为 Discord、Diffs、Lobster、Memory LanceDB、Microsoft Teams、QQ Bot、Voice Call、WhatsApp 等准备 `2026.5.1-beta.1` 发布。感谢 @vincentkoc。
- **Plugins/beta**：为 Brave、Codex、飞书、Synology Chat、Tlon、Twitch 等准备 `2026.5.1-beta.1` 发布。感谢 @vincentkoc。
- **Providers/xAI**：新增 Grok 4.3 到内置目录并设为默认 xAI 聊天模型。
- **Google Meet**：API 创建的房间可设置 `accessType` 和 `entryPointAccess`，新增 `googlemeet end-active-conference` 关闭管理空间。（#74824）感谢 @BsnizND。
- **Google Meet**：新增 `googlemeet test-listen` 动作，transcribe 模式加入等待真实字幕或转录移动后才报告 listen-first health。（#72478）感谢 @DougButdorf。
- **Plugins/ClawHub**：ClawHub 发布摘要元数据时优先使用版本化 ClawPack 产物，安装前验证 ClawPack 响应头和下载字节。感谢 @vincentkoc。
- **Plugins/ClawHub**：在 ClawHub 插件安装和更新记录上持久化 ClawPack 摘要元数据， registry 刷新和下载验证可复用存储的事实。感谢 @vincentkoc。
- **Plugins/Crestodian**：新增 ClawHub 插件搜索和 Crestodian 插件 list/search/install/uninstall 操作，覆盖安装和卸载的审批和审计。感谢 @vincentkoc。
- **Channels/thread bindings**：以 `threadBindings.spawnSessions` 替换 split subagent/ACP thread-spawn 切换，默认开启，`openclaw doctor --fix` 迁移 legacy key。（#75943）
- **Providers/OpenAI**：为 OpenAI 兼容 TTS 端点添加 `extraBody`/`extra_body` 直通，自定义语音服务器可接收 `/audio/speech` 请求中的 `lang` 等字段。（#39900）感谢 @R3NK0R。
- **Dependencies**：刷新工作区依赖，包括 TypeBox 1.1.37、AWS SDK 3.1041.0、Microsoft Teams 2.0.9 和 Marked 18.0.3。感谢 @mariozechner、@aws 和 @microsoft。
- **Discord/channels**：新增可复用消息渠道访问组和 Discord 渠道受众 DM 授权，allowlist 可跨渠道 auth 路径引用 `accessGroup:<name>`。（#75813）
- **Crabbox/scripts**：执行 `pnpm crabbox:*` 前打印选中的二进制、版本和支持的 providers，拒绝缺少 `blacksmith-testbox` provider 支持的陈旧二进制。
- **Agents/Codex**：为 Codex/message-tool Telegram 直连、Discord 群组和心跳轮次添加已提交快乐路径提示快照，便于审查提示漂移。感谢 @pashpashpash。

### 🐛 问题修复（Fixes）

- **CLI/message**：跳过 eager 模型上下文预热并保留渠道声明的 gateway 执行用于 Discord 和 Telegram 消息动作，避免简单 send/read 命令触发 Codex 发现。感谢 @fuller-stack-dev。
- **Codex/app-server**：从内置 `dist` chunks 和 `@openai/codex` 包 bin 解析托管二进制，避免安装不提供附近 `.bin/codex` 软链接时误报缺失二进制启动失败。
- **Control UI**：允许部署通过验证的 `gateway.controlUi.chatMessageMaxWidth` 设置配置分组聊天消息最大宽度，而非升级后补丁 CSS。（#67935）感谢 @xiew4589-lang。
- **Control UI/Cron**：忽略无有效 payload 的畸形持久化 cron 行并守护陈旧 cron 渲染路径，防止不良 cron 快照后出现空白 Control UI 区域。（#55047 和 #54439）
- **Control UI/sessions**：将默认 Sessions 标签页查询绑定到近期活动和更少行，避免昂贵全历史加载同时保持过滤器可编辑。（#76050）感谢 @Neomail2。
- **Control UI/sessions**：应用可靠的 `sessions.changed` 快照原地更新，仅对部分事件重新获取，避免活跃 session 更新期间冗余 `sessions.list` 重新生成。
- **Gateway/channels**：启动扇出上限四渠道/账户handoff，从 Bonjour ciao 自探针竞态恢复，减少多 Telegram 账户 Windows 启动停滞。（#75687）
- **Gateway/sessions**：通过复用 list-safe session 缓存/索引并返回轻量压缩检查点预览而非重量级摘要，保持大型 session 存储上 `sessions.list` 轮询响应。感谢 @rolandrscheel。
- **Control UI/Gateway**：通过协议 ping 保活长期运行的 dashboard WebSocket session，并在重连或重载后恢复 Stop 可用性。（#70991）感谢 @alexandre-leng。
- **Agents/failover**：工具执行期间触发的运行级超时豁免模型回退、超时触发压缩和通用超时负载合成，避免主模型已响应后仍报误导性 "LLM request timed out"。（#75873）感谢 @simonusa。
- **Docker**：从摘要固定镜像复制 Bun 1.3.13 并保持 CI 使用同一版本。（#74356）感谢 @fede-kamel 和 @sallyom。
- **Sessions/transcripts**：对 session transcript 锁获取使用统一的 `session.writeLock.acquireTimeoutMs` 策略，默认等待提升至 60 秒，避免合法慢速准备/清理/压缩/镜像工作中的用户可见锁超时。（#75894）感谢 @shandutta。
- **TUI/chat**：上下文窗口预热期间跳过全提供商模型标准化，同时保留提供商所有上下文元数据，避免大型模型注册表冷启动停滞。感谢 @547895019。
- **MCP/OpenAI**：发送工具到 OpenAI 前规范化顶级 `properties` 缺失/为空/无效的无参工具 schema，使无参数 MCP 工具保持可用。（#75362）感谢 @tolkonepiu 和 @SymbolStar。
- **Control UI/WebChat**：通过现有音频转录管道添加服务端聊天草稿麦克风听写，避免浏览器 Web Speech 同时将提供商凭证保留在 Gateway。（#47311）感谢 @jmomford。
- **TTS**：遵守显式短 `[[tts:text]]...[[/tts:text]]` 块同时保持无标签短自动 TTS 抑制，使标记语音回复合成而非作为空语音负载被丢弃。（#73758）感谢 @yfge。
- **Hooks/doctor**：`hooks.transformsDir` 指向规范 hooks 转换目录外时发出警告，使无效 workspace skill 路径在 Gateway 崩溃循环前获得直接恢复提示。（#75853）感谢 @midobk。
- **Proxy/audio**：代理支持的 undici 获取前转换标准 `FormData` body，使 `HTTP_PROXY` 或 `HTTPS_PROXY` 配置时音频转录和 multipart 上传不再发送 `[object FormData]`。（#48554）感谢 @dco5。
- **Discord**：在工具专属 guild 渠道允许显式配置的 ack reaction，同时保持自动生命周期/状态 reaction 抑制。（#74922）感谢 @samvilian 和 @BlueBirdBack。
- **Discord**：启用 session 支持的 A2A announce 目标查找，使 `sessions_send` 使用目标 session 的 `deliveryContext.accountId` 或 `lastAccountId` 而非在多账户设置中回退到默认 bot。（#42652）感谢 @irchelper、@dpalfox 和 @Lanfei。
- **Discord/setup**：将解析的 guild/渠道 allowlist 选择写入所选 guild 和渠道而非在设置期间回退到通配符 guild。感谢 @Eldersonar。
- **Discord**：在陈旧 socket 重启期间将中止时 Carbon reconnect-exhausted 事件视为预期关闭，使健康监视器重启不再拒绝监视器生命周期。感谢 @Perttulands。
- **Discord/native commands**：斜杠命令分派或直接插件执行产生无可见回复时返回显式警告而非成功风格完成确认。（#58986）感谢 @jb510。

### ✨ 新增与改进

- Messaging and automation get active-run steering by default, visible-reply enforcement, spawned subagent routing metadata, and opt-in follow-up commitments for heartbeat-delivered reminders. Thanks @vincentkoc, @scoootscooob, @samzong, and @vignesh07.
- Memory grows into a people-aware wiki with provenance views, per-conversation Active Memory filters, partial recall on timeout, and bounded REM preview diagnostics. Thanks @vincentkoc, @quengh, @joeykrug, and @samzong.
- Provider/model coverage expands with NVIDIA onboarding/catalogs plus faster manifest-backed model/auth paths, Bedrock Opus 4.7 thinking parity, and safer Codex/OpenAI-compatible replay and streaming behavior. Thanks @eleqtrizit, @shakkernerd, @prasad-yashdeep, @woodhouse-bot, and @LyHug.
- Gateway and packaged-plugin reliability focuses on slow-host startup, reusable model catalogs, event-loop readiness diagnostics, runtime-dependency repair, stale-session recovery, and version-scoped update caches. Thanks @lpendeavors, @DerFlash, @vincentkoc, @pashpashpash, and @jhsmith409.
- Channel fixes cluster around Slack Block Kit limits, Telegram proxy/webhook/polling/send resilience, Discord startup/rate-limit handling, WhatsApp delivery/liveness, and Microsoft Teams/Matrix/Feishu edge cases. Thanks @slackapi, @SymbolStar, @djgeorg3, @TinyTb, @dseravalli, @nklock, and @alex-xuweilong.
- Security and operations add OpenGrep scanning, sharper GHSA triage policy, safer exec/pairing/owner-scope handling, Docker/onboarding automation, and web-fetch IPv6 ULA opt-in for trusted proxy stacks. Thanks @jesse-merhi, @pgondhi987, @mmaps, @jinjimz, and @jeffrey701.

### 🔧 功能调整

- Agents/commitments: add opt-in inferred follow-up commitments with hidden batched extraction, per-agent/per-channel scoping, heartbeat delivery, CLI management, a simple `commitments.enabled`/`commitments.maxPerDay` config, and heartbeat-interval due-time clamping so magical check-ins do not echo immediately. (#74189) Thanks @vignesh07.
- Messages/queue: make `steer` drain all pending Pi steering messages at the next model boundary, keep legacy one-at-a-time steering as `queue`, and add a dedicated steering queue docs page. Thanks @vincentkoc.
- Messages/queue: default active-run queueing to `steer` with a 500ms followup fallback debounce, and document the queue modes, precedence, and drop policies on the command queue page. Thanks @vincentkoc.
- Messages: add global `messages.visibleReplies` so operators can require visible output to go through `message(action=send)` for any source chat, while `messages.groupChat.visibleReplies` stays available as the group/channel override. Thanks @scoootscooob.
- Gateway/events: surface `spawnedBy` on subagent chat and agent broadcast payloads so clients can route child session events without an extra session lookup. (#63244) Thanks @samzong.
- Memory/wiki: add agent-facing people wiki metadata, canonical aliases, person cards, relationship graphs, privacy/provenance reports, evidence-kind drilldown, and search modes for person lookup, question routing, source evidence, and raw claims. Thanks @vincentkoc.
- Active Memory: add optional per-conversation `allowedChatIds` and `deniedChatIds` filters so operators can enable recall only for selected direct, group, or channel conversations while keeping broad sessions skipped. (#67977) Thanks @quengh.
- Active Memory: return bounded partial recall summaries when the hidden memory sub-agent times out, including the default temporary-transcript path, so useful recovered context is not discarded. (#73219) Thanks @joeykrug.
- Gateway/memory: add a read-only `doctor.memory.remHarness` RPC so operator clients can preview bounded REM dreaming output without running mutation paths. (#66673) Thanks @samzong.
- Providers/NVIDIA: add the NVIDIA provider with API-key onboarding, setup docs, static catalog metadata, and literal model-ref picker support so NVIDIA hosted models can be selected with their provider prefix intact. (#71204) Thanks @eleqtrizit.
- Models: suppress explicitly configured openai-codex/gpt-5.4-mini inline entries so a stale models config written by `openclaw doctor --fix` cannot bypass the manifest capability block and cause repeated assistant-turn failures when the runtime switches to that model on ChatGPT-backed Codex accounts. Conditional suppressions (e.g. qwen Coding Plan endpoint guards) remain bypassable by explicit user configuration. (#74451) Thanks @0xCyda, @hclsys, and @Marvae.
- Added SQLite-backed plugin state store (`api.runtime.state.openKeyedStore`) for restart-safe keyed registries with TTL, eviction, and automatic plugin isolation. Thanks @amknight.
- Plugin SDK: mark remaining legacy alias exports and diffs tool/config aliases with deprecation metadata, and add a guard so future legacy alias comments require `@deprecated` tags. Thanks @vincentkoc.
- CLI/QR/dependencies: internalize small terminal progress and QR wrapper helpers while keeping the real QR encoder dependency direct, reducing the default runtime dependency graph without changing QR output behavior. Thanks @vincentkoc.
- Dependencies: refresh workspace runtime, plugin, and tooling packages, including ACP, Pi, AWS SDK, TypeBox, pnpm, oxlint, oxfmt, jsdom, pdfjs, ciao, and tokenjuice, while keeping patched ACP behavior and lint gates current. Thanks @mariozechner.
- Gateway/dev: run `pnpm gateway:watch` through a named tmux session by default, with `gateway:watch:raw` and `OPENCLAW_GATEWAY_WATCH_TMUX=0` for foreground mode, so repeated starts respawn an inspectable watcher without trapping the invoking agent shell. Thanks @vincentkoc.
- Gateway/diagnostics: emit an opt-in startup diagnostics timeline that records gateway lifecycle and plugin-load phases behind a config flag, so slow-start diagnosis no longer requires bespoke instrumentation. Thanks @shakkernerd.
- Control UI/i18n: extend the locale registry with new Persian (fa), Dutch (nl), Vietnamese (vi), Italian (it), Arabic (ar), and Thai (th) entries and ship `fa`, `nl`, `vi`, and `zh-TW` docs glossaries, so the docs translation pipeline and the Control UI language picker stay aligned across surfaces. Thanks @vincentkoc.
- Channels: add Yuanbao channel docs entrance so the Tencent Yuanbao bot appears in the channel listing and sidebar navigation. (#73443) Thanks @loongfay.
- Channels/Yuanbao: update plugin GitHub location to YuanbaoTeam/yuanbao-openclaw-plugin and add "yuanbao" alias to channel catalog. (#74253) Thanks @loongfay.
- Docker setup: add `OPENCLAW_SKIP_ONBOARDING` so automated Docker installs can skip the interactive onboarding step while still applying gateway defaults. (#55518) Thanks @jinjimz.
- Security policy: classify media/base64 decode and format-conversion overhead after configured acceptance limits as performance-only for GHSA triage unless a report demonstrates a limit bypass, crash, exhaustion, data exposure, or another boundary bypass. (#74311)
- Security/OpenGrep: add a precise OpenGrep rulepack, source-rule compiler, provenance metadata check, and PR/full scan workflows that validate first-party code and rulepack-only changes while uploading SARIF to GitHub Code Scanning. (#69483) Thanks @jesse-merhi.

### 🐛 问题修复

- Security/outbound: strip re-formed HTML tags during plain-text sanitization so nested tag fragments cannot leave a CodeQL-detected `<script>` sequence behind. Thanks @vincentkoc.
- Security/secrets: compare credential bytes with padded timing-safe buffers instead of hashing candidate passwords before equality checks. Thanks @vincentkoc.
- Security/QQBot: sanitize debug log arguments before writing to `console.*`, so gateway payload fields cannot forge extra log lines when debug logging is enabled. Thanks @vincentkoc.
- QQBot: unify slash command auth and c2cOnly gating in the command registry, pass `allowQQBotDataDownloads` when sending slash command file attachments, align clear-storage with actual downloads directory, and add `/bot-me` to display sender user ID. (#73616) Thanks @cxyhhhhh.
- CLI/agents/status: keep `openclaw agents`, text `agents list`, and plain text `status` on read-only metadata paths so human output no longer preloads plugin runtimes or live channel scans before printing. Fixes #74195. Thanks @NianJiuZst.
- Agents/local models: derive context-window guard thresholds from the effective model window with 4k/8k safety floors, so small local models are no longer rejected by fixed 16k/32k preflight cutoffs. Fixes #42999. Thanks @chengjialu8888.
- PDF extraction: resolve PDF.js standard fonts from the installed package root and pass a filesystem path to the Node fallback extractor, so built-in font PDFs render without `file://` URL lookup failures. Fixes #51455; carries forward #70936, #54447, and #62175. Thanks @anyech, @JuanRdBO, and @solomonneas.
- Media: treat legacy Word/OLE attachments with `application/msword` or `application/x-cfb` MIME as binary so printable-looking `.doc` files are not embedded into prompts as text. Fixes #54176; carries forward #54380. Thanks @andyliu.
- Config: accept documented `browser.tabCleanup` keys in strict root config validation, so configured tab cleanup no longer fails before runtime reads it. Fixes #74577. Thanks @lonexreb and @ezdlp.
- Cron: validate disabled job schedule edits before persisting updates, so invalid cron changes no longer partially mutate stored jobs. Fixes #74459. Thanks @yfge.
- CLI/cron: warn when `openclaw cron add --message` omits a nonblank `--agent`, including blank agent values and session-key jobs, so scheduled agent-turn jobs make default-agent fallback explicit while system events stay quiet. Fixes #42196; carries forward #42245. Thanks @ethanclaw.
- Channels/status: keep Telegram, Slack, and Google Chat read-only allowlist/default-target accessors on config-only paths, so status and channel summaries do not resolve SecretRef-backed runtime credentials. Thanks @eusine.
- Active Memory: clarify the deprecated `modelFallbackPolicy` warning and config help so `modelFallback` is described as a chain-resolution last resort, not runtime failover. (#74602) Thanks @jeffrey701.
- Channels/Discord: keep read-only allowlist/default-target accessors from resolving SecretRef-backed bot tokens, so status and channel summaries no longer fail when tokens are only available in gateway runtime. (#74737) Thanks @eusine.
- Gateway/sessions: align session abort wait semantics across `chat`, `agent`, and `sessions` server methods so abort RPCs return after the targeted sessions actually halt instead of resolving early while runs are still draining. (#74751) Thanks @BunsDev.
- Agents/output: drop copied inbound metadata-only assistant replay turns before provider replay instead of synthesizing a placeholder, so Telegram and other channels cannot receive `[assistant copied inbound metadata omitted]` as model output. Fixes #74745. Thanks @adamwdear and @Marvae.
- Doctor/memory: suppress skipped embedding-readiness warnings for key-optional providers such as Ollama and LM Studio while preserving timeout and not-ready diagnostics. Fixes #74608 and #73882. Thanks @hclsys.
- Channels/groups: preserve observe-only turn suppression for prepared dispatch paths and restore deprecated channel turn runtime aliases, so passive observer/group flows stay silent while older plugins keep compiling. Thanks @vincentkoc.
- Feishu: skip empty-text messages (e.g. `{"text":""}`) that carry no media, so no blank user turn is written to the session and downstream LLM providers cannot reject the request with "messages must not be empty". (#74634) Thanks @xdengli and @hclsys.
- Feishu/Bitable: clean up newly created placeholder rows whose fields contain only default empty values while preserving meaningful link, attachment, user, number, boolean, and location values during create-app cleanup. (#73920) Carries forward #40602. Thanks @boat2moon.
- macOS app: keep attach-only mode and the Debug Settings launchd toggle marker-only, so launching with `--attach-only`/`--no-launchd` no longer uninstalls the Gateway LaunchAgent or drops active sessions. (#72174) Thanks @DolencLuka.
- Plugin SDK: restore the deprecated `plugin-sdk/zalouser` command-auth facade so published Lark/Zalo plugins that import it load on current hosts. Fixes #74702. Thanks @Goron01.
- Plugins/runtime-deps: include bundled provider plugins when `models.providers`, auth profiles, agent defaults, or subagent model refs configure that provider, while keeping inactive default-enabled provider plugins out of doctor repair. Refs #74307. Thanks @Skeptomenos.
- Plugins/runtime: resolve relative plugin `api.resolvePath` inputs against the plugin root instead of the host working directory, while keeping absolute and home paths user-resolved. Fixes #74718. Thanks @jimdawdy-hub.
- Plugins/runtime-deps: refresh mirrored root chunks through a temporary file before replacing the active copy, so failed refreshes do not delete chunks that running plugin imports still need. Thanks @shakkernerd.
- Plugins/runtime-deps: prefer `require` conditional exports when building staged dependency aliases, so CommonJS-only plugin runtime deps such as `ws` do not resolve to ESM wrappers under Jiti. Fixes #74547. Thanks @aderius.
- Bonjour/Gateway: cap flapping advertiser restarts in a sliding window, so mDNS probing/name-conflict loops disable discovery instead of churning indefinitely on constrained hosts. Refs #74209 and #74242. Thanks @ndj888 and @Sanjays2402.
- Plugins/runtime-deps: verify staged package entry files before reusing mirrored runtime roots, so browser-control repairs incomplete `ajv`/MCP SDK installs after update instead of failing after restart on a missing `ajv/dist/ajv.js`. Refs #74630. Thanks @spickeringlr.
- Heartbeat: resolve `responsePrefix` template variables with the selected provider, model, and thinking context before delivering alerts or suppressing prefixed `HEARTBEAT_OK` replies. Fixes #43064; repairs #43065; supersedes #46858. Thanks @yweiii and @JunJD.
- Memory/LanceDB: show full memory UUIDs in the `memory_forget` candidate list so agents can pass the displayed ID back to targeted deletion without hitting the full-UUID validator. (#66913) Thanks @amittell.
- File-transfer plugin: require canonical read-path preflight authorization for `file.fetch`, fail closed when `dir.fetch` preflight entries are missing, absolute, or traversing, and recheck returned archive entries before handing archive bytes to callers. Carries forward #74134. Thanks @omarshahine.
- Channels/Feishu: retry file-typed iOS video resource downloads as `media` after a Feishu/Lark HTTP 502 and preserve the original 502 when the fallback also fails. Fixes #49855; carries forward #50164 and #73986. Thanks @alex-xuweilong.
- Providers/Amazon Bedrock: expose the full Claude Opus 4.7 thinking profile (`xhigh`, `adaptive`, and `max`) for Bedrock model refs, while keeping Opus/Sonnet 4.6 on adaptive-by-default, so `/think` menus and validation match the Anthropic transport behavior. Fixes #74701. Thanks @prasad-yashdeep, @sparkleHazard, @Sanjays2402, and @hclsys.
- Plugins/tokenjuice: compile the bundled plugin against tokenjuice 0.7.0's published OpenClaw host types instead of a local compatibility shim, so package contract drift fails in OpenClaw validation before release. Thanks @vincentkoc.
- OAuth/secrets: ignore root-level Google OAuth `client_secret_*.json` downloads so local client-secret files do not appear as commit candidates. (#74689) Thanks @jeongdulee.
- Memory: mirror `sqlite-vec` into packaged bundled-plugin runtime deps for the default memory plugin, so builtin vector search does not lose its SQLite extension after upgrading to 2026.4.27. Fixes #74692. Thanks @mozi1924.
- Gateway/startup: bound local discovery advertisement during startup, so a stuck discovery plugin can no longer keep the Gateway from reaching ready. Fixes #73865; refs #74630 and #74633. Thanks @lpendeavors, @moltar-bot, and @Saboor711.
- Gateway/models: serve the last successful model catalog while stale reloads refresh in the background, so Gateway control-plane and OpenAI-compatible requests no longer block behind model-provider rediscovery after model config changes. Refs #74135, #74630, and #74633. Thanks @DerFlash, @moltar-bot, and @Saboor711.
- CLI/status: resolve read-only channel setup runtime fallback from the packaged OpenClaw dist root, so `status --all`, `status --deep`, channel, and doctor paths do not crash when an external channel plugin needs setup metadata. Fixes #74693. Thanks @giangthb.
- SDK/events: keep per-run SDK event streams from surfacing duplicate raw chat projection frames, while normalizing chat-only projection frames and preserving raw access through `rawEvents`. Refs #74704. Thanks @BunsDev.
- SDK: report Gateway terminal `agent.wait` timeout snapshots with lifecycle metadata as `timed_out` while keeping bare wait deadlines non-terminal. Thanks @clawsweeper.
- Google Meet: block managed Chrome intro/test speech until browser health proves the participant is in-call, and expose `speechReady` diagnostics so login, admission, permission, and audio-bridge blockers no longer look like successful speech. Refs #72478. Thanks @DougButdorf.
- Slack/commands: keep native command argument menus on select controls for encoded choice values up to Slack's option limit and truncate fallback button labels to Slack's button-text limit, so long valid choices no longer render invalid Slack blocks. Thanks @slackapi.
- Agents/Codex: flush accepted debounced steering messages before normal app-server turn cleanup, so inbound follow-ups acknowledged as queued are not dropped when the turn completes before the debounce fires. Thanks @vincentkoc.
- Slack/interactive replies: keep rendered buttons and selects within Slack Block Kit value and count limits, and align command argument select values with Slack's option limit, so overlong agent-authored choices no longer make Slack reject the whole block payload. Thanks @slackapi.
- Slack/interactive replies: drop overlong Block Kit button URLs while preserving valid callback values, so malformed link buttons no longer make Slack reject the whole interactive reply. Thanks @slackapi.
- Slack/commands: truncate native command argument-menu confirmation text to Slack's dialog limit, so long plugin arg names no longer make fallback buttons render invalid Block Kit payloads. Thanks @slackapi.
- Slack/exec approvals: cap native approval metadata context to Slack's element and text limits, so large approval details no longer make Slack reject the approval card. Thanks @slackapi.
- Slack/exec approvals: cap native approval update fallback text to Slack's message limit while preserving the rendered approval blocks, so long commands no longer make resolved or expired approval cards stay stale after `chat.update` rejects `msg_too_long`. Thanks @slackapi.
- Slack/commands: cap native command argument-menu fallback rows to Slack's message block limit, so large plugin choice lists no longer make Slack reject the generated menu. Thanks @slackapi.
- Slack/commands: drop fallback command argument buttons whose encoded values exceed Slack's button-value limit, so one oversized plugin choice no longer makes Slack reject the whole menu. Thanks @slackapi.
- Slack/messages: merge message-tool presentation and interactive blocks on Slack sends, so buttons and selects are no longer dropped when a structured message body is also present. Thanks @slackapi.
- Slack/messages: cap Block Kit fallback text to Slack's send limit while preserving the rendered blocks, so long context fallbacks no longer make rich Slack messages fail with `msg_too_long`. Thanks @slackapi.
- Slack/messages: cap Block Kit fallback text on message edits while preserving the rendered blocks, so long context fallbacks no longer make Slack reject `chat.update` calls with `msg_too_long`. Thanks @slackapi.
- Channels/WhatsApp: require Baileys outbound message ids before marking auto-replies delivered, so transcript text and ack reactions no longer make failed group replies look sent. Fixes #49225. Thanks @TinyTb.
- CLI/update: scope packaged Node compile caches by OpenClaw version and install metadata, so global installs no longer reuse stale compiled chunks after package updates. Thanks @pashpashpash.
- Channels/Voice call: keep pre-auth webhook in-flight limiting active when socket remote address metadata is missing, so slow-body requests from stripped-IP proxy paths still share the fallback bucket. (#74453) Thanks @davidangularme.
- Plugin SDK/testing: lazy-load TypeScript from the plugin test-contract runtime and add release checks for critical SDK contract entrypoint imports and bundle size, so published packages fail preflight before shipping ESM-incompatible or oversized contract helpers. Thanks @vincentkoc.
- Channels/Microsoft Teams: treat configured `19:...@thread.tacv2` and legacy `19:...@thread.skype` team/channel IDs as already resolved during startup, avoiding false `channels unresolved` warnings while preserving Graph name lookup for display-name entries. Fixes #74683. Thanks @dseravalli.
- CLI/browser: preserve parent flags while lazy-loading browser subcommands, so `openclaw browser --json open` and `openclaw browser --json tabs` keep machine-readable output after reparsing. Fixes #74574. Thanks @devintegeritsm.
- Exec/elevated: preserve `turnSourceChannel` as `messageProvider` on approval-followup runs so `tools.elevated.allowFrom.<provider>` checks no longer fail with `provider=null` after the user approves an async elevated command. Fixes #74646. Thanks @xhd2015.
- Plugins/runtime-deps: add `openclaw plugins deps` inspection and repair with script-free package-manager defaults shared across plugin installers, so operators can repair missing bundled runtime deps without corrupting JSON output or blocking unrelated conflict-free deps. Thanks @vincentkoc.
- Agents/output: strip internal `[tool calls omitted]` replay placeholders from user-facing replies while preserving visible reply whitespace. Fixes #74573. Thanks @blaspat.
- Providers/Google Vertex: route authorized_user ADC credentials through OpenClaw's REST transport so Docker installs using gcloud application-default credentials no longer crash in the Google SDK before requests are sent. Fixes #74628. Thanks @frankhal2001-design.
- ACP/resolver: fall through to thread-bound session resolution when an explicit `--session` token cannot be resolved while preserving the bad-token diagnostic when no thread binding exists, so Discord slash commands that auto-fill the current thread ID as the positional ACP target no longer return "Unable to resolve session target" errors. Fixes #66299. Thanks @hclsys, @kindomLee, and @martingarramon.
- Agents/sessions: emit a terminal lifecycle backstop when embedded timeout/error turns return without `agent_end`, so Gateway sessions no longer stay stuck in `running` after failover surfaces a timeout. Fixes #74607. Thanks @millerc79.
- Gateway/diagnostics: include stuck-session reason hints and recovery skip causes in warnings, so operators can tell whether a lane is waiting on active work, queued work, or stale bookkeeping. Thanks @vincentkoc.
- Agents/Codex: bound embedded-run cleanup, trajectory flushing, and command-lane task timeouts after runtime failures, so Discord and other chat sessions return to idle instead of staying stuck in processing. Thanks @vincentkoc.
- Heartbeat/exec: consume successful metadata-only async exec completions silently so Telegram and other chat surfaces no longer ask users for missing command logs after `No session found`. Fixes #74595. Thanks @gkoch02.
- Web fetch: add a documented `tools.web.fetch.ssrfPolicy.allowIpv6UniqueLocalRange` opt-in and thread it through cache keys and DNS/IP checks so trusted fake-IP proxy stacks using `fc00::/7` can work without broad private-network access. Fixes #74351. Thanks @jeffrey701.
- OpenAI Codex: restore `/verbose full` persistence and app-server tool-output forwarding, and retry Gateway E2E temp-home cleanup so debug runs do not regress on stale validation or cleanup flakes. Thanks @vincentkoc.
- Anthropic/Meridian: preserve text and thinking content seeded on `content_block_start` in anthropic-messages streams, so `[thinking, text]` replies no longer persist as empty turns or trigger empty-response fallbacks. Fixes #74410. Thanks @vyctorbrzezowski.
- Channels/Matrix: complete the cross-signing handshake on `openclaw matrix verify confirm-sas` so the operator's other Matrix device clears its `Verifying…` loop instead of staying stuck after the agent confirms. (#74542) Thanks @nklock.
- CLI/status: honor channel-specific model context-window overrides when reporting effective context, so channel-scoped sessions reflect the active window in `openclaw status`. Thanks @HemantSudarshan.
- Sandbox/Docker: tolerate Docker daemon unavailability when sandbox mode is off, so doctor and preflight checks no longer fail on installs that do not run the Docker daemon. Fixes #73671. Thanks @kaseonedge.
- Control UI/mobile: persist mobile chat settings through Lit-managed state and route mobile navigation through the same view-state path so chat panel toggles survive transitions on small viewports. Thanks @BunsDev.
- Control UI/exports: align sidebar trigger affordances across the resizable divider, mobile layout, and exported-HTML transcript template so the sidebar toggle and exported transcript sidebar render with consistent hit areas and styling. Thanks @BunsDev.
- Control UI/chat: disable the page refresh affordance while a chat run is active so accidental refreshes do not abort an in-flight reply. Thanks @BunsDev.
- Memory/LanceDB: return real memory records from `openclaw ltm list` (with optional `--limit` and createdAt ordering) instead of an empty placeholder, so the CLI surface matches the documented LTM listing contract. (#67952) Thanks @zhangyue19921010.
- Media: include redacted per-attempt resize failures and resolved model input capabilities in vision-pipeline errors so ARM64 image failures are diagnosable without closing the remaining routing investigation. Refs #74552. Thanks @1yihui.
- Control UI/i18n: route zh-CN agent, debug, channel-refresh, and exec-approval copy through the locale source while preserving the English `Cron Jobs` agent tab label and the security-audit command styling. Carries forward #39692 repair context. Thanks @hepeng154833488 and @vincentkoc.
- Auto-reply: honor explicit `silentReply.direct: "allow"` for clean empty or reasoning-only direct chat turns while keeping the default direct-chat empty-response guard conservative. Fixes #74409. Thanks @jesuskannolis.
- OpenAI Codex: send a non-empty Responses input item when a Codex turn only has systemPrompt-backed instructions, avoiding ChatGPT backend 400s from `input: []`. Fixes #73820. Thanks @woodhouse-bot.
- Ollama: normalize provider-prefixed tool-call names at the native stream boundary so Kimi/Ollama calls such as `functions.exec` dispatch as `exec` instead of missing configured tools. Fixes #74487. Thanks @afurm and @carreipeia.
- Security/audit: resolve configured model aliases before model-tier and small-parameter checks, so alias-based GPT-5/Codex configs no longer report false weak-model warnings. Fixes #74455. Thanks @blaspat.
- CLI/agent: isolate Gateway-timeout embedded fallback runs under explicit `gateway-fallback-*` sessions so accepted Gateway runs cannot race transcript locks or replace the routed conversation session. Fixes #62981. Thanks @HemantSudarshan.
- CLI/QR/device-pair: reject malformed public setup URLs before issuing mobile pairing bootstrap tokens, while keeping valid bare host:port setup URLs supported. Thanks @Lucenx9.
- Models/UI: hide unauthenticated providers from the default Web chat, `/models`, and model setup pickers while keeping explicit full-catalog browse paths through `view: "all"`, `/models <provider> all`, and `models list --all`. Fixes #74423. Thanks @guarismo and @SymbolStar.
- Ollama: keep explicit local model runs on target-provider runtime hooks when PI discovery is skipped, so one-shot Ollama calls no longer cold-load unrelated provider runtimes before streaming. Fixes #74078. Thanks @sakalaboator.
- Slack/prompts: rely on Slack `interactiveReplies` guidance instead of generic `inlineButtons` config hints so enabled Slack button directives are not contradicted. Fixes #46647. Thanks @jeremykoerber.
- Slack/reactions: treat duplicate `already_reacted` responses as idempotent success so repeated agent reaction adds no longer surface as tool failures. Fixes #69005. Thanks @shipitsteven and @martingarramon.
- Channels/Discord: cool down Cloudflare/Error 1015 HTML 429 REST failures during startup application lookup and gateway metadata fetches, add `channels.discord.applicationId` as an app-id lookup bypass, sanitize HTML bodies before logging, and honor Retry-After before falling back to a conservative cooldown. Fixes #38853. (#74489) Thanks @djgeorg3 and @Garyko0730.
- Slack/tools: expose `fileId` in the shared message tool schema so `download-file` can receive Slack attachment IDs from inbound placeholders. Fixes #45574. Thanks @chadvegas.
- Exec: reject invalid per-call `host` values instead of silently falling back to the default target, so hostname-like values fail before commands run. Fixes #74426. Thanks @scr00ge-00 and @vyctorbrzezowski.
- Google/Gemini: send non-empty placeholder content when a Gemini run is triggered with empty or filtered user content, avoiding `contents is not specified` API errors. Thanks @CaoYuhaoCarl.
- Heartbeat: preserve non-task `HEARTBEAT.md` context around `tasks:` blocks and apply `agents.defaults.heartbeat` to all agents unless per-agent heartbeat entries restrict scope. Thanks @Sekhar03.
- Markdown: preserve paragraph breaks inside loose list items in shared outbound formatting while keeping tight list spacing stable. Thanks @Lucenx9.
- Build/Gateway: route restart, shutdown, respawn, diagnostics, command-queue cleanup, and runtime cleanup through one stable gateway lifecycle runtime entry so rebuilt packages do not strand long-running gateways on stale hashed chunks. Carries forward #73964. Thanks @pashpashpash.
- Memory/wiki: keep broad shared-source and generated related-link blocks from turning every page into a search hit, cap noisy backlinks, support all-term searches such as people-routing queries, and prefer readable page body snippets over generated metadata. Thanks @vincentkoc.
- Cron/Gateway: abort and bounded-clean up timed-out isolated agent turns before recording the timeout, so stale cron sessions cannot leave Discord or other chat lanes stuck in `processing` after a timeout. Thanks @vincentkoc.
- Agents/errors: suppress malformed streaming tool-call JSON fragments before they reach chat surfaces while preserving provider request-validation diagnostics. Fixes #59076; keeps #59080 as duplicate coverage. (#59118) Thanks @singleGanghood.
- CLI/models: restore provider-filtered `models list --all --provider <id>` rows for providers without manifest/static catalog coverage, including Anthropic and Amazon Bedrock, while keeping the compatibility fallback off expensive availability and resolver paths. Thanks @shakkernerd.
- CLI/models: keep manifest auth-evidence credentials visible across `models status`, auth probes, and PI model discovery so workspace-scoped provider auth does not disagree between listing, probing, and execution. Thanks @shakkernerd.
- CLI/models: move local credential evidence such as Google Vertex ADC into generic plugin manifest setup metadata so the model-list auth index stays declarative without provider-specific runtime branches. Thanks @shakkernerd.
- CLI/models: compute the `models list` Auth column through one command-local provider auth index so row rendering no longer repeats auth profile, env, configured-provider, AWS, or synthetic-auth checks per model row. Thanks @shakkernerd.
- CLI/models: move the OpenAI listable catalog into the plugin manifest so `models list --all --provider openai` uses the manifest fast path instead of loading provider runtime normalization hooks. Thanks @shakkernerd.
- CLI/tools: keep the Gateway `tools.*` RPC namespace out of plugin command discovery and managed proxy startup, so stray commands like `openclaw tools effective` fail quickly instead of cold-loading plugin metadata. Refs #73477. Thanks @oromeis.
- CLI/status: keep default text `openclaw status --usage` on metadata-only channel scans unless `--deep` or `--all` is set, and send stray `openclaw tools --help` through the precomputed root-help fast path so latency-triage commands avoid plugin/runtime cold loads before printing. Refs #73477 and #74220. Thanks @oromeis and @NianJiuZst.
- Agents/diagnostics: trace embedded-run startup and preparation stage timings before model I/O, and warn only on severe slow stages, so Docker/VPS latency reports can identify whether plugin loading, auth/model resolution, tool inventory, bootstrap, MCP/LSP, resource loading, or stream setup is dominating pre-run latency without noisy normal logs. Refs #73428. Thanks @Dimaoggg, @quangtran88, and @Heyvhuang.
- Agents/subagents: cache persisted subagent run registry reads by file signature while preserving fresh-parse isolation, so busy gateways stop reparsing unchanged `subagents/runs.json` on controller/list/status hot paths. Refs #72338. Thanks @argus-as.
- Gateway/clients: wait for the event loop to become responsive before opening Gateway WebSocket RPC/probe/client connections while charging that readiness wait to caller timeouts, so Windows deferred module-evaluation stalls no longer turn healthy loopback gateways into false handshake timeouts across status, TUI, ACP, MCP, node-host, and plugin client paths. Refs #74279 and #48270. Thanks @wongcode and @joost-heijden.
- Gateway/Windows: read listener command lines via PowerShell before falling back to `wmic`, so restart health can recognize OpenClaw listeners on modern Windows installs and avoid long anonymous-port waits. Refs #74280. Thanks @zym951223.
- Plugins/runtime-deps: record process start-time in bundled dependency install locks and expire recycled-PID locks, so Docker gateway restarts recover from stale `.openclaw-runtime-deps.lock` directories without waiting through repeated five-minute timeouts. Fixes #74346. (#74361) Thanks @jhsmith409.
- Plugins/runtime-deps: memoize packaged bundled runtime dist-mirror preparation after the first successful pass while keeping source-checkout mirrors refreshable, so constrained Docker/VPS installs avoid repeated root scans before chat turns. Refs #73428, #73421, #73532, and #73477. Thanks @Dimaoggg, @oromeis, @oadiazp, @jmfraga, @bstanbury, @antoniusfelix, and @jkobject.
- Channels/Discord: treat bare numeric outbound targets that match the effective Discord DM allowlist as user DMs while preserving account-specific legacy `dm.allowFrom` precedence over inherited root `allowFrom`. (#74303) Thanks @Squirbie.
- Channels/Discord/Slack: share one DM policy/allowlist resolver across runtime, setup, allowlist editing, and doctor repair, so legacy `dm.policy` / `dm.allowFrom` compatibility migrates to canonical `dmPolicy` / `allowFrom` without divergent access checks. Thanks @Squirbie.
- Control UI: make the chat sidebar split divider focusable, keyboard-resizable, ARIA-described, and pointer-event based so sidebar resizing works without a mouse. Thanks @BunsDev.
- Control UI/chat: wire the slash-command autocomplete menu to the composer with stable ARIA relationships so screen readers announce the active command or argument option. Thanks @BunsDev.
- Agents/usage: keep PI embedded-run telemetry attributed to the resolved model provider instead of the PI harness label, so OpenRouter and other provider-backed turns report the right provider in session usage and traces. Thanks @vincentkoc.
- Agents/attribution: send OpenClaw attribution headers on native OpenAI and Codex traffic, including SDK transports, realtime voice and TTS, device-code auth, WHAM usage, and remote embeddings, so PI-origin defaults no longer leak into provider requests. Thanks @vincentkoc.
- Agents/auth: keep OAuth auth profiles inherited from the main agent read-through instead of copying refresh tokens into secondary agents, and refresh Codex app-server tokens against the owning store so multi-agent swarms avoid reused refresh-token failures. Fixes #74055. Thanks @ClarityInvest.
- Channels/Telegram: honor `ALL_PROXY` / `all_proxy` and service-level `OPENCLAW_PROXY_URL` when constructing the HTTP/1-only Telegram Bot API transport, so Windows and service installs that rely on those proxy settings no longer fall back to direct egress. Fixes #74014; refs #74086. Thanks @SymbolStar.
- Channels/Telegram: keep raw host/network-unreachable Bot API connect failures non-fatal and route tagged polling uncaught exceptions through the Telegram restart path, so transient reachability failures no longer kill the Gateway or leave long polling stuck. Fixes #60515; refs #74540. Thanks @HemantSudarshan, @thacid22, and @ewimsatt.
- Channels/Telegram: continue polling when `deleteWebhook` hits a transient network failure but `getWebhookInfo` confirms no webhook is configured, so startup does not retry cleanup forever after the webhook was already removed. Refs #74086; carries forward #47384. Thanks @clovericbot.
- Channels/Telegram: retry native quote replies without `reply_parameters.quote` when Telegram returns `QUOTE_TEXT_INVALID`, so stale or truncated quote excerpts no longer drop the whole reply. Fixes #74581. Thanks @moeedahmed.
- Channels/Telegram: apply strict safe-send retry to inbound final replies when grammY wraps a pre-connect failure, while leaving ambiguous plain network envelopes single-shot to avoid duplicate visible messages. Fixes #74203. Thanks @nanli2000cn.
- Channels/Telegram: surface polling liveness warnings in channel status and doctor when a running long-poller has not completed `getUpdates` after startup grace or its transport activity is stale, so silent polling failures no longer look clean. Refs #74299. Thanks @lolaopenclaw.
- Channels/Telegram: publish webhook runtime state and warn when `setWebhook` has not completed after startup grace, so webhook-mode accounts no longer look healthy while registration is still failing or retrying. Refs #74299. Thanks @lolaopenclaw and @martingarramon.
- Channels/Telegram: bound native command menu `deleteMyCommands` and `setMyCommands` Bot API calls and allow the same timeout-triggered transport fallback retry as other startup control calls, so Windows/WSL network stalls cannot leave command sync hanging behind an otherwise running provider. Refs #74086. Thanks @SymbolStar.
- ACP/commands: accept forwarded ACP timeout config controls in the OpenClaw bridge, treat unsupported discard-close controls as recoverable cleanup, and restore native `/verbose full` plus no-arg status behavior, so Discord command menus and nested ACP turns no longer fail on supported session controls. Thanks @vincentkoc.
- Codex harness: interrupt and release native app-server turns that go quiet after an OpenClaw dynamic-tool response without sending `turn/completed`, so Discord and other chat lanes do not stay stuck in `processing`. Thanks @vincentkoc.
- Codex harness: bound OpenClaw dynamic tool responses to 30 seconds and fail closed with an explicit tool result when the app-server bridge would otherwise strand the turn in `processing`. Thanks @vincentkoc.
- TUI/status: clear stale `streaming` footer state when a final event arrives after the active run was already cleared and no tracked runs remain, while preserving concurrent-run ownership and inactive local `/btw` terminal handling. Fixes #64825; carries forward #64842, #64843, #64847, and #64862. Thanks @briandevans and @Yanhu007.
- Channels/Discord: fail startup closed when Discord cannot resolve the bot's own identity and keep mention gating active when only configured mention patterns can detect mentions, so the provider no longer continues with a missing bot id. Fixes #42219; carries forward #46856 and #49218. Thanks @education-01 and @BenediktSchackenberg.
- Channels/Discord: split long CJK replies at punctuation and code-point-safe fallback boundaries so Discord chunking stays readable without corrupting astral characters. Fixes #38597; repairs #71384. Thanks @p3nchan.
- TUI: keep the streaming watchdog alive across active tool/lifecycle proof-of-life, pause it during disconnects, and reload history after stale reconnect runs so long-running chats stop flipping to false idle or hanging on stale streaming. Fixes #69081. Thanks @EenvoudJasper.
- Browser/gateway: ignore Playwright dialog-close races from `Page.handleJavaScriptDialog` so browser automation no longer crashes the Gateway when a dialog disappears before Playwright accepts it. (#40067) Thanks @randyjtw.
- Cron/Gateway: defer missed isolated agent-turn catch-up out of the channel startup window, so overdue cron work cannot starve Discord or Telegram while providers connect after a restart. Thanks @vincentkoc.
- Heartbeat/cron: defer heartbeat turns while cron work is active or queued, add opt-in `heartbeat.skipWhenBusy` for subagent/nested lane pressure, and retry busy skips without advancing the schedule so local Ollama hosts do not run heartbeat and cron prompts concurrently. Fixes #50773. Thanks @scottgl9.
- Agents/thinking: honor configured model `compat.supportedReasoningEfforts` entries that include `xhigh`, so custom OpenAI-compatible provider refs expose and validate `/think xhigh` consistently across command menus, Gateway sessions, agent CLI, and `llm-task`. Carries forward #48904. Thanks @Milchstrassse and @wufunc.
- Vercel AI Gateway: expose provider-owned `/think xhigh` for trusted OpenAI/Codex upstream refs and Claude adaptive thinking for Anthropic upstream refs, while leaving untrusted namespaced refs on base levels. Carries forward #41561. Thanks @Zcg2021.
- Plugins/runtime-deps: prune stale `openclaw-unknown-*` bundled runtime dependency roots during Gateway startup while keeping recent or locked roots, so old staging debris cannot keep growing across restarts. Thanks @vincentkoc.
- Plugins/runtime-deps: include ten more root-package runtime dependencies (`@agentclientprotocol/sdk`, `@lydell/node-pty`, `croner`, `dotenv`, `jiti`, `json5`, `jszip`, `markdown-it`, `tar`, `web-push`) in `MIRRORED_CORE_RUNTIME_DEP_NAMES` so they are mirrored into the runtime-deps tree alongside `semver` and `tslog`, preventing `Cannot find package 'X'` failures from core dist code (for example `qmd-manager`, `cron/schedule`, `infra/archive`, `infra/push-web`, `infra/backup-create`, `process/supervisor/adapters/pty`) when no enabled extension owns the dependency. Adds a static drift guard test that scans `src/` for value imports of root-package deps and fails CI when one is missing from the mirror allowlist or extension-owned set. Refs #74199. Thanks @maxpuppet.
- Ollama: compose caller abort signals with guarded-fetch timeouts for native `/api/chat` streams, so `/stop` and early cancellation still interrupt local Ollama requests that also carry provider timeout budgets. Refs #74133. Thanks @obviyus.
- Doctor/TTS: migrate legacy `messages.tts.enabled`, agent TTS, channel TTS, and voice-call plugin TTS toggles to `auto` mode during `openclaw doctor --fix`, matching the documented TTS config contract. Thanks @vincentkoc.
- CLI/logs: fall back to the configured Gateway file log when implicit loopback Gateway connections close or time out before or during `logs.tail`, so `openclaw logs` still works while diagnosing local-model Gateway disconnects. Refs #74078. Thanks @sakalaboator.
- MCP/plugins: stringify non-array plugin tool results with chat-content coercion instead of default object stringification, so MCP callers receive useful JSON/text content from plugin tools. Thanks @vincentkoc.
- Active Memory/QMD: make gateway-start QMD refresh opt-in via `memory.qmd.update.startup`, keep normal memory access lazy, preserve interactive file watching, and align watcher dependency/build ignores with QMD's scanner so cold gateway startup no longer imports or initializes QMD by default. Thanks @codexGW.
- Channels/Discord: remove Discord-owned queued-run timeout replies through the shared channel lifecycle queue while preserving message ordering and compatibility timeout constants, so long Discord turns stay governed by session/tool/runtime lifecycle instead of channel fallback errors. Thanks @codexGW.
- Agents/tools: clamp `process.poll` waits to 30 seconds, advertise that cap in the tool schema, and honor abort signals while waiting, so long command polls cannot pin agent responsiveness after cancellation. Thanks @vincentkoc.
- Plugin SDK: add tracked Discord component-message helpers and a Telegram account-resolution compatibility facade, so existing plugins using those subpaths resolve while new plugins stay on generic channel SDK contracts. Thanks @vincentkoc.
- Shared labels: preserve Unicode combining marks and NFC-equivalent accented text in group/channel slug normalization so non-Latin labels no longer lose meaningful characters. Fixes #58932; carries forward #58942 and #58995. Thanks @fengqing-git, @Starhappysh, and @koen666.
- Channels/Telegram: include probed video width and height when sending regular Telegram videos, so portrait clips render with the correct orientation instead of being stretched by clients. (#18915) Thanks @storyarcade.
- Docs/Hetzner: clarify that SSH tunnel access requires `AllowTcpForwarding local` before running `ssh -L`, so hardened VPS sshd configs do not block loopback Gateway access. Fixes #54557; carries forward #54564; refs #54954. Thanks @satishkc7, @blackstrype, and @Aftabbs.
- Agents/config: preserve authored `agents.defaults.params` and per-model `agents.defaults.models[].params` during narrowed internal config writes, so OpenAI transport overrides such as `transport: "sse"` and `openaiWsWarmup: false` are not stripped from `openclaw.json`. Fixes #73607; refs #73428. Thanks @quangtran88.
- Agents/model config: resolve per-model extra params through canonical model keys while preserving legacy double-prefixed fallback entries, so provider-prefixed model ids such as `openrouter/auto` keep their configured runtime params. (#44319) Thanks @HenryXiaoYang.
- Gateway/shutdown: report structured shutdown warnings and HTTP close timeout warnings through `ShutdownResult` while preserving lifecycle hook hardening. Carries forward #41296. Thanks @edenfunf.
- Control UI: keep Agents Overview and config-form select dropdowns on their configured value after options render while preserving inherited agent model placeholders. Fixes #40352; carries forward #52948. Thanks @xiaoquanidea.
- Agents/exec: launch zsh, bash, and fish host exec shells with startup files suppressed while preserving existing PATH fallbacks, so daemon env is not overridden by shell startup files. Carries forward #40200; fixes #40179. Thanks @NewdlDewdl.
- Plugins/QA: prebuild the private QA channel runtime before plugin gauntlet source runs so wrapper CPU/RSS measurements are not polluted by private QA dist rebuild work. Thanks @vincentkoc.
- Plugins/QA: add a Kitchen Sink plugin gauntlet that installs the external package, checks command inventory, MCP tools, channel status, provider turns, gateway RSS, CPU, and fatal log anomalies. Thanks @vincentkoc.
- Plugins/config: reuse the bundled plugin alias scan within a single config normalization pass, so Kitchen Sink-style plugin configs no longer peg Gateway CPU by repeatedly rescanning bundled metadata before agent turns. Thanks @vincentkoc.
- Plugins/channels: reject malformed runtime channel registrations that omit required config helpers before they can poison channel status. Thanks @vincentkoc.
- MCP/plugins: serialize raw plugin tool return values through the plugin-tools MCP bridge so Kitchen Sink-style tools no longer surface `undefined` content. Thanks @vincentkoc.
- Gateway/reload: bound default restart deferral and SIGUSR1 restart drain to five minutes while preserving explicit `deferralTimeoutMs: 0` indefinite waits, so stale active work accounting cannot block config reloads forever. Thanks @vincentkoc.
- Active Memory: register the prompt-build hook with the configured recall timeout plus setup grace instead of the 150s maximum budget, so default memory recall cannot delay turn startup for multiple minutes. Thanks @vincentkoc.
- Gateway/readiness: include an `eventLoop` diagnostic block in local or authenticated `/readyz` responses with event-loop delay (p99 and max), event-loop utilization, CPU core ratio, and a `degraded` flag, so operators can see when slow startups or runaway turns stall the event loop. Thanks @vincentkoc.
- Gateway/agents: schedule accepted agent runs after the accepted RPC frame has a chance to flush, so pre-turn prompt/context work is less likely to starve immediate `agent.wait` callers. Thanks @vincentkoc.
- CLI/update: tolerate stale memory-runtime import failures during best-effort CLI process teardown, so `openclaw update` replacing hashed runtime chunks before the finalizer runs no longer surfaces as exit-time `Cannot find module` noise. Thanks @vincentkoc.
- CLI/channels logs: reuse the rolling log-file resolver so `openclaw channels logs` falls back to the active dated log across date boundaries without reading unrelated custom log files. Fixes #42875; carries forward #42904 and #43043. Thanks @ethanclaw and @wdskuki.
- CLI/update: skip tracked plugins disabled in config during post-update plugin sync before npm, ClawHub, or marketplace update checks, preserving their install records without failing the update. Fixes #73880. Thanks @islandpreneur007.
- Control UI: fix Peak Error Hours showing incorrect hourly rates when the browser's timezone observes DST, by storing hourly message counts with UTC date keys and using DST-aware `Date.getHours()` for local conversion. Also extract `accumulateMessageCounts` helper to reduce duplicated daily/hourly aggregation logic. (#49396) Thanks @konanok.
- iMessage: normalize known leading attributedBody corruption markers on sent-message echo text keys so delayed reflected echoes with U+FFFD/U+FFFE/U+FFFF/FEFF prefixes are dropped without collapsing interior text. Fixes #59973; carries forward #59980 and #62191. Thanks @neeravmakwana and @maguilar631697.
- Security/audit: recognize dangerous node command IDs as valid `gateway.nodes.denyCommands` entries, so audit only warns on real typos or unsupported patterns. (#56923) Thanks @chziyue.
- Cron: treat implicit text payloads with agent-turn overrides as agent turns, preserving model overrides for scheduled text prompts instead of pruning them as system events. Fixes #28905. (#64060) Thanks @liaoandi.
- Telegram/exec approvals: stop treating general Telegram chat allowlists and `defaultTo` routes as native exec approvers; Telegram now uses explicit `execApprovals.approvers` or owner identity from `commands.ownerAllowFrom`, matching the first-pairing owner bootstrap path. Thanks @pashpashpash.
- Plugins/providers: keep Gateway startup primary-model discovery on metadata-only provider entries and reuse active non-speech capability providers even with explicit plugin entries, avoiding unnecessary provider registry loads during startup and media capability checks. Fixes #73729, #73835, and #73793; carries forward #73853 and #73794. Thanks @sg1416-zg, @brokemac79, and @poolside-ventures.
- Chat commands: route sensitive group `/diagnostics` and `/export-trajectory` approvals and results to a private owner route, preferring same-surface DMs before falling back to the first configured owner route, so Discord group invocations can land in Telegram when that is the primary owner interface. Thanks @pashpashpash.
- Gateway/hooks: keep successful `deliver:false` agent hooks silent, log a hook audit record for suppressed success announcements, and suppress fallback summaries after attempted hook delivery while still surfacing failed hook runs. Repairs #55761; builds on #36332 and #49234. Thanks @EffortlessSteven, @cioclawcode, and @BrennerSpear.
- Plugin SDK/Discord: restore a deprecated `openclaw/plugin-sdk/discord` compatibility facade and the legacy compat group-policy warning export for the published `@openclaw/discord@2026.3.13` package, covering its config, account, directory, status, and thread-binding imports while keeping new plugins on generic SDK subpaths. Fixes #73685; supersedes #73703. Thanks @rderickson9 and @SymbolStar.
- Channels/Discord: suppress duplicate gateway monitors when multiple enabled accounts resolve to the same bot token, preferring config tokens over default env fallback and reporting skipped duplicates as disabled. Supersedes #73608. Thanks @kagura-agent.
- CLI/health: build channel health summaries from inspected credential metadata plus runtime state, so `openclaw health --json` reports Discord `running`, `connected`, and `tokenSource` consistently with channel status. Fixes #44354. Thanks @ferenc-acs.
- Control UI/Talk: decode Google Live binary WebSocket JSON frames and stop queued browser audio on interruption or shutdown, so browser Talk leaves `Connecting Talk...` and barge-in no longer plays stale audio. Fixes #73601 and #73460; supersedes #73466. Thanks @Spolen23 and @WadydX.
- Channels/Discord: ignore stale route-shaped conversation bindings after a Discord channel is reconfigured to another agent, while preserving explicit focus and subagent bindings. Fixes #73626. Thanks @ramitrkar-hash.
- Agents/bootstrap: pass pending BOOTSTRAP.md contents through the first-run user prompt while keeping them out of privileged system context, and show limited bootstrap guidance when workspace file access is unavailable. Fixes #73622. Thanks @mark1010.
- ACP/tasks: classify parent-owned ACP sessions as background work regardless of persistent runtime mode, and close terminal stale ACP sessions when no active binding remains, so delegated ACP output reports through the parent task notifier instead of acting like a normal foreground chat session. Refs #73609. Thanks @joerod26.
- Tasks: keep terminal mirrored TaskFlow timestamps pinned to task completion time and let maintenance repair stale mirrors, so ACP terminal delivery updates no longer leave inconsistent flow audits. Refs #73609. Thanks @joerod26.
- Gateway/sessions: add conservative stuck-session recovery that releases only stale session lanes while active embedded runs, reply operations, and lane tasks remain serialized, so queued follow-ups can drain without aborting legitimate long-running turns. Refs #73581, #73655, #73652, #73705, #73647, #73602, #73592, and #73601. Thanks @WS-Q0758, @bryangauvin, @spenceryang1996-dot, @bmilne1981, @mattmcintyre, @Vksh07, and @Spolen23.
- Plugins: cache unchanged plugin manifest loads by file signature, reducing repeated JSON/JSON5 parsing and manifest normalization in bursty startup and runtime registry paths. Refs #73532 and #73647; carries forward #73678. Thanks @TheDutchRuler.
- Plugins/runtime-deps: cache unchanged bundled runtime mirror dist-file materialization decisions and close file-lock handles on owner-write failures, reducing repeated startup chunk scans and avoiding FileHandle-GC recovery stalls. Refs #73532. Thanks @oadiazp and @bstanbury.
- Plugins/runtime-deps: retry and defer transient cleanup failures for owned runtime staging directories so CLI startup no longer aborts after a successful bundled dependency swap. Refs #73903. Thanks @bobfreeman1989.
- Plugins/runtime-deps: cache bundled runtime-deps JSON/package files by file signature, reducing repeated staged-runtime metadata reads during bundled channel startup. Refs #73647 and #73705. Thanks @mattmcintyre and @bmilne1981.
- Plugins/runtime-deps: delegate bundled plugin dependency staging to complete npm/pnpm install plans with durable runtime state, removing retained-manifest and source-checkout cache reconciliation from Gateway startup. Refs #73532. Thanks @oadiazp, @bstanbury, and @jmfraga.
- Plugins/runtime-deps: replace Gateway-start root chunk dependency inference with explicit mirrored-root dependency metadata, reducing staged runtime scans while preserving lazy per-plugin installs. Refs #73532. Thanks @oadiazp and @bstanbury.
- Plugins/runtime-deps: run pnpm staged installs outside the repository workspace and disable pnpm release-age gates for exact bundled runtime dependency materialization, so bundled plugin dependency repair writes packages into the generated stage without blocking fresh packaged dependencies. Refs #73532. Thanks @oadiazp and @bstanbury.
- CLI/TUI: keep `chat.history` off model-catalog discovery so initial Gateway-backed TUI history loads cannot block behind slow provider/plugin model scans on low-core hosts. Refs #73524. Thanks @harshcatsystems-collab.
- Channels/WhatsApp: flag recently reconnected linked accounts in channel status even when the socket is currently healthy, so flapping WhatsApp Web sessions no longer look clean after a brief reconnect. Refs #73602. Thanks @Vksh07.
- Channels/WhatsApp: log shared dispatcher delivery failures with reply kind, message id, chat id, and connection id, so typing-without-send reports can identify whether the WhatsApp send path rejected a generated reply. Refs #74269. Thanks @tomcosta-git.
- Feishu: suppress distinct late `final` text deliveries after a streaming card has already closed, while keeping media attachments deliverable, so late-finals no longer reopen duplicate Feishu cards. Fixes #71977. (#72294) Thanks @MonkeyLeeT.
- Gateway: expose `gateway.handshakeTimeoutMs` in config, schema, and docs while preserving `OPENCLAW_HANDSHAKE_TIMEOUT_MS` precedence, so loaded or low-powered hosts can tune local WebSocket pre-auth handshakes without patching dist files. Supersedes #51282; refs #73592 and #73652. Thanks @henry-the-frog.
- Gateway/TUI/status: align configured and env-based WebSocket handshake budgets across local clients, probes, and fallback RPCs while preserving explicit status timeouts and paired-device auth fallback, so slow local gateways are not marked unreachable by a shorter client watchdog. Refs #73524, #73535, #73592, and #73602. Thanks @harshcatsystems-collab, @DJBlackhawk, and @Vksh07.
- Gateway/startup: return retryable `UNAVAILABLE` during the sidecar startup window and keep CLI/TUI/status clients retrying inside their existing timeout budget, so early connects no longer surface as terminal handshake failures. Fixes #73652. Thanks @spenceryang1996-dot.
- Gateway/proxy: bypass inherited proxy environment for local Gateway control-plane WebSockets to `localhost` as well as loopback IPs, so Windows/WSL proxy settings cannot intercept local CLI/TUI Gateway connections. Supersedes #73474; refs #73602. Thanks @DhtIsCoding.
- Doctor/Gateway: use a lightweight `status` RPC without channel summary work for doctor Gateway liveness, so slow health snapshots do not falsely drive service restart repair. Fixes #64400; supersedes #64511. Thanks @CHE10X and @EronFan.
- Agents/auth: scope external CLI credential discovery to configured providers during model auth status and startup prewarm, so opencode-only and other single-provider gateways do not block on unrelated Claude CLI Keychain probes. Fixes #73908. Thanks @Ailuras.
- Agents/model selection: resolve slash-form aliases before provider/model parsing and keep alias-resolved primary models subject to transient provider cooldowns, so cron and persisted sessions do not retry cooled-down raw aliases. Fixes #73573 and #73657. Thanks @akai-shuuichi and @hashslingers.
- Agents/Claude CLI: reuse already-cached macOS Keychain credentials for no-prompt Claude credential reads, so doctor/runtime checks do not miss fresh interactive Claude auth. Fixes #73682. Thanks @RyanSandoval.
- Agents/Claude CLI doctor: scope workspace and project-dir checks to agents that actually use the Claude CLI runtime, so non-default Claude agents no longer make the default agent look Claude-backed. Fixes #73903. Thanks @bobfreeman1989.
- Gateway/sessions: expose effective agent runtime metadata on session rows, `sessions.patch`, and local `openclaw sessions --json`, while keeping Claude CLI-backed rows on the canonical model provider so runtime backend and model identity are no longer conflated. Fixes #73090. Thanks @vishutdhar.
- Gateway/auth status: scope external CLI credential overlays to configured providers, runtimes, or profiles and keep status reads off new Keychain prompts, so single-provider Gateway configs no longer probe unrelated Claude/Codex/MiniMax auth on startup. Fixes #73908. Thanks @Ailuras.
- Agents/runtime status: expose effective agent runtime metadata in `agents.list`, Control UI agent panels, and `/agents`, and avoid rendering stale or cumulative CLI token totals as live context usage. Fixes #73660, #73578, and #45268. Thanks @spartman, @DashLabsDev, and @xyooz.
- Agents/transcripts: strip empty assistant text blocks while preserving valid text, images, and signatures, so Anthropic-style providers no longer reject sanitized transcript turns. Fixes #73640. Thanks @jowhee327.
- Gateway/sessions: preserve session keys on hidden lifecycle events so channel-routed runs still persist terminal session state and do not strand session status as running after Codex turn completion. Thanks @cathrynlavery.
- Providers/Bedrock: omit deprecated `temperature` for Claude Opus 4.7 Bedrock model ids, named and application inference profiles, including dotted `opus-4.7` refs, and classify the nested validation response for failover. Fixes #73663. Thanks @bstanbury.
- Gateway: raise the preauth/connect-challenge timeout to 15s so cold CLI starts on slower hosts have more time to process the WebSocket challenge before the Gateway closes the connection. Fixes #51469; refs #73592 and #62060. Thanks @GothicFox and @jackychen-png.
- CLI/status: fall back to a bounded local `status` RPC when loopback detail probes time out or report unknown capability, so reachable local gateways are no longer marked unreachable by slow read diagnostics. Fixes #73535; refs #48360, #62762, #51357, and #42019. Thanks @RacecarGuy, @justinschille, @DJBlackhawk, @tianyaqpzm, and @0xrsydn.
- CLI/gateway: reuse cached paired-device auth during `gateway probe` and report post-connect diagnostic failures as degraded reachability, so healthy local gateways are no longer marked unreachable after loopback auth or read timeouts. Fixes #48360. Thanks @RacecarGuy.
- Channels/Discord: give Discord Gateway WebSocket handshakes a 30s timeout so stalled TLS/network transitions emit an error and Carbon can continue its reconnect loop instead of leaving the bot silent until restart. Refs #50046. Thanks @codexGW.
- Mattermost/WebSocket: send protocol ping/pong keepalives and terminate stale sessions when pongs stop arriving, so silent TCP drops reconnect instead of leaving monitoring idle. Fixes #41837; carries forward #57621; refs #50138, #44160, and #51104. Thanks @JasonWang1124.
- Channels/Telegram: suppress standalone failed edit/write warning payloads when a user-facing assistant error reply already covers the turn, while keeping unresolved mutating failures visible behind success-looking or suppressed-error replies. Fixes #39631; refs #73750; carries forward #39636 and #39717; leaves #39406 for configurable delivery policy. Thanks @Bartok9 and @Bortlesboat.
- Control UI/agents: persist the Set Default action through `agents.list[].default` instead of writing the unsupported `agents.defaultId` field, so saved default-agent changes survive config validation. Fixes #65565; carries forward #72585. Thanks @luyao618.
- NVIDIA/NIM: persist the `NVIDIA_API_KEY` provider marker and mark bundled NVIDIA Chat Completions models as string-content compatible, so NIM models load from `models.json` and OpenAI-compatible subagent calls send plain text content. Fixes #73013 and #50107; refs #73014. Thanks @bautrey, @iot2edge, @ifearghal, and @futhgar.
- Channels/Discord: let text-only configs drop the `GuildVoiceStates` gateway intent and expose a bounded `/gateway/bot` metadata timeout with rate-limited fallback logs, reducing idle CPU and warning floods. Fixes #73709 and #73585. Thanks @sanchezm86 and @trac3r00.
- Agents/sessions: mark same-turn `sessions_send` and A2A reply prompts with an inter-session `isUser=false` envelope before they reach the model, so foreign session output no longer lands as bare active user text. Fixes #73702; refs #73698, #73609, #73595, and #73622. Thanks @alvelda.
- Channels/Telegram: fail closed when account-level public DM settings conflict with a restrictive top-level `allowFrom`, and require an effective wildcard before `dmPolicy="open"` behaves as public access. Fixes #73756; refs #73698. Thanks @Hilo-Hilo and @xace1825.
- Channels/security: move open-DM allowlist semantics into the shared policy helpers and align Discord, Slack, Mattermost, Matrix, Feishu, LINE, IRC, Google Chat, Zalo, Zalo User, QQ Bot, and Synology Chat so `dmPolicy="open"` is public only with an effective wildcard and otherwise still respects sender allowlists. Refs #73756 and #73698. Thanks @Hilo-Hilo and @xace1825.
- ACP/tasks: sweep orphaned parent-owned ACP sessions whose task records are gone, preserving bound persistent sessions but clearing unbound stale ACPX metadata so old child sessions cannot silently respawn into chat. Fixes #73609. Thanks @joerod26.
- Outbound/security: strip known internal runtime scaffolding such as `<system-reminder>` and `<previous_response>` at the final channel delivery boundary and keep Discord output on targeted tag stripping, so degraded harness replies cannot leak those tags to users. Fixes #73595. Thanks @gabrielexito-stack and @martingarramon.
- Security/Telegram: load Telegram security adapters in read-only audit/doctor, audit malformed Telegram DM `allowFrom` entries even when groups are disabled, and keep allowlist DM audits from counting stale pairing-store senders, so public/shared-DM risk checks stay accurate. Refs #73698. Thanks @xace1825.
- Plugins: remove hidden manifest, provider-owner, bootstrap, and channel metadata caches so plugin installs, manifest edits, and bundled-root changes are visible on the next metadata read while keeping runtime/module loader caches for actual plugin code. Thanks @shakkernerd.
- CLI/plugins: use plugin metadata snapshots for install slot selection and add opt-in plugin lifecycle timing traces, so plugin install avoids runtime-loading the plugin registry for metadata-only decisions. Thanks @shakkernerd.
- fix(plugins): restrict bundled plugin dir resolution to trusted package roots. (#73275) Thanks @pgondhi987.
- fix(security): prevent workspace PATH injection via service env and trash helpers. (#73264) Thanks @pgondhi987.
- Active Memory: allow `allowedChatTypes` to include explicit portal/webchat sessions and classify `agent:...:explicit:...` session keys before opaque session ids can shadow the chat type. Fixes #65775. (#66285) Thanks @Lidang-Jiang.
- Active Memory: allow the hidden recall sub-agent to use both `memory_recall` and the legacy `memory_search`/`memory_get` memory tool contract, so bundled `memory-lancedb` recall works without breaking the default `memory-core` path. Fixes #73502. (#73584) Thanks @Takhoffman.
- fix(device-pairing): validate callerScopes against resolved token scopes on repair [AI]. (#72925) Thanks @pgondhi987.
- Active Memory docs: document the `cacheTtlMs` 1000-120000 ms range and 15000 ms default so setup snippets do not lead users past the schema limit. Fixes #65708. (#65737) Thanks @WuKongAI-CMU.
- fix(agents): canonicalize provider aliases in byProvider tool policy lookup [AI]. (#72917) Thanks @pgondhi987.
- fix(security): block npm_execpath injection from workspace .env [AI-assisted]. (#73262) Thanks @pgondhi987.
- Tools/web_fetch: decode response bodies from raw bytes using declared HTTP, XML, or HTML meta charsets before extraction, so Shift_JIS and other legacy-charset pages no longer return mojibake. Fixes #72916. Thanks @amknight.
- Active Memory: skip payload-less `memory_search` transcript tool results when building debug telemetry, so newer empty entries no longer hide the latest useful debug payload. (#68773) Thanks @SimbaKingjoe.
- Active Memory: keep recall setup time from consuming the configured model timeout while giving the hook runner an explicit bounded budget for the plugin, so slow embedded-run setup no longer causes immediate recall timeouts. Fixes #72606. (#72620) Thanks @hyspacex.
- Channels/Discord: bound message read/search REST calls, route those actions through Gateway execution, and fall back to `CommandTargetSessionKey` for inbound hook session keys so Discord reads do not hang and hooks still fire when `SessionKey` is empty. Fixes #73431. (#73521) Thanks @amknight.
- Plugins/media: auto-enable provider plugins referenced by `agents.defaults.imageGenerationModel`, `videoGenerationModel`, and `musicGenerationModel` primary/fallback refs, so configured Google and MiniMax media providers do not stay disabled behind a restrictive plugin allowlist. Thanks @vincentkoc.
- Memory-core/dreaming: retry managed dreaming cron registration after startup when the cron service is not reachable yet, so the scheduled Memory Dreaming Promotion sweep recovers without waiting for heartbeat traffic. Fixes #72841. Thanks @amknight.
- Acpx/runtime: validate the runtime session mode at the `AcpxRuntime.ensureSession` wrapper boundary so callers that pass anything other than `persistent` or `oneshot` get a clear `ACP_INVALID_RUNTIME_OPTION` error instead of silently round-tripping through the encoded handle as a default `persistent` mode and later throwing `SessionResumeRequiredError`. Investigation context: #73071. (#73548) Thanks @amknight.
- CLI/infer: keep web-search fallback on missing provider API keys, preserve structured validation errors from the selected provider, and let per-request image describe prompts override configured media-entry prompts. (#63263) Thanks @Spolen23.
- Chat commands: include configured model-catalog reasoning metadata when building `/think` argument menus so Ollama Cloud and other provider-owned reasoning models show supported levels instead of only `off`. Fixes #73515; supersedes #73568. Thanks @danielzinhu99 and @neeravmakwana.
- Channels/Telegram: suppress generic tool-progress chatter when preview streaming is off, so non-streaming Telegram turns only deliver final replies while approvals, media, and errors still route normally. Refs #72363 and #72482. Thanks @neeravmakwana and @SweetSophia.
- CLI/model probes: add repeatable image `--file` inputs to `infer model run` for local and gateway multimodal model smokes, so vision models such as Ollama Qwen VL and Gemini can be tested through the raw model-probe surface. Fixes #63700. Thanks @cedricjanssens.
- CLI/model probes: request trusted operator scope for `infer model run --gateway --model <provider/model>` so Gateway raw model smokes can use one-off provider/model overrides instead of being rejected before provider auth resolution. Fixes #73759. Thanks @chrislro.
- CLI/image describe: pass `--prompt` and `--timeout-ms` through `infer image describe` and `describe-many`, so custom vision instructions and slow local model budgets reach media-understanding providers such as Ollama, OpenAI, Google, and OpenRouter. Refs #63700. Thanks @cedricjanssens.
- Model selection: include the rejected provider/model ref and allowlist recovery hint when a stored session override is cleared, so local model selections such as Gemma GGUF variants do not fall back to the default with a generic message. Refs #71069. Thanks @CyberRaccoonTeam.
- OpenAI-compatible providers: drop malformed event-only or blank-data SSE frames before the OpenAI SDK stream parser sees them, so proxies that split `event:` from `data:` no longer crash streaming runs with `Unexpected end of JSON input`. Fixes #52802. Thanks @LyHug.
- Gateway/OpenAI-compatible streaming: strip `<final>` tags split across streamed model deltas before they reach SSE clients, so `/v1/chat/completions` no longer emits tag remnants or drops content when final-answer wrappers cross chunk boundaries. Fixes #63325. Thanks @tzwickl.
- Ollama: resolve explicitly selected signed-in `:cloud` models through `/api/show` when `/api/tags` omits them, so working models such as `gemini-3-flash-preview:cloud` and `deepseek-v4-pro:cloud` do not fail dynamic model resolution before the native `/api/chat` transport runs. Fixes #73909. Thanks @chtse53.
- Discord/exec approvals: keep the local `/approve` prompt when no native Discord approval runtime is active, and send a manual fallback notice when native approval delivery reaches no targets, so failed DM cards no longer leave approval turns silent or dependent on model-written shell commands. Fixes #73954; carries forward #74027. Thanks @guarismo and @brokemac79.
- Local model prompt caching: keep stable Project Context above volatile channel/session prompt guidance and stop embedding current channel names in the message tool description, so Ollama, MLX, llama.cpp, and other prefix-cache backends avoid avoidable full prompt reprocessing across channel turns. Fixes #40256; supersedes #40296. Thanks @rhclaw and @sriram369.
- Gateway/OpenAI-compatible API: guard provider policy lookup against runtime providers with non-array `models` values, so `/v1/chat/completions` no longer fails with `provider?.models?.some is not a function`. Fixes #66744; carries forward #66761. Thanks @MightyMoud, @MukundaKatta.
- WhatsApp/Web: pass explicit Baileys socket timings into every WhatsApp Web socket and expose `web.whatsapp.*` keepalive, connect, and query timeout settings so unstable networks can avoid repeated 408 disconnect and opening-handshake timeout loops. Fixes #56365. (#73580) Thanks @velvet-shark.
- WhatsApp/Web: recover recently active listeners when a post-408 reconnect keeps receiving transport frames but stops delivering app messages, while keeping group metadata fallback off Baileys sends. Fixes #63855 and #66920; refs #7433, #67986, #70856, #60007, and #72621. Thanks @legonhilltech-jpg, @octopuslabs-fl, @Kanorin-chan, and @stuswan.
- Channels/Telegram: persist native command metadata on target sessions so topic, helper, and ACP-bound slash commands keep their session metadata attached to the routed conversation. (#57548) Thanks @GaosCode.
- Channels/native commands: keep validated native slash command replies visible in group chats while preserving explicit owner allowlists for command authorization. (#73672) Thanks @obviyus.
- Pairing/doctor: bootstrap `commands.ownerAllowFrom` from the first approved DM pairing when no command owner exists, and have doctor explain missing owners so privileged slash commands are not accidentally unusable after onboarding. Thanks @pashpashpash.
- Telegram/exec: infer native exec approvers from `commands.ownerAllowFrom` and auto-enable the Telegram approval client when an owner is resolvable, so owner-only commands such as `/diagnostics` can be approved in Telegram without duplicate per-channel approver config. Thanks @pashpashpash.
- Auto-reply/session: carry the tail of user/assistant turns into the freshly-rotated transcript on silent in-reply session resets (compaction failure, role-ordering conflict) so direct-chat continuity survives the rebind. Fixes #70853. (#70898) Thanks @neeravmakwana.
- Skills: load grouped skill directories such as `skills/<group>/<skill>/SKILL.md` from configured skill roots while keeping grouped discovery capped for large directories. Fixes #56915. (#72534) Thanks @ottodeng, @MoerAI, and @i010542.
- Config: skip malformed non-string `env.vars` entries before env-reference checks, so config loading no longer crashes on JSON values like numbers or booleans. (#42402) Thanks @MiltonHeYan.
- Docker Compose: default missing config and workspace bind mounts to `${HOME:-/tmp}/.openclaw` so manual compose runs do not create invalid empty-source volume specs. (#64485) Thanks @jlapenna.
- Agents/context engines: preserve the child agent's configured `agentDir` when subagent cleanup re-resolves a context engine, so `onSubagentEnded` hooks keep operating on the correct per-agent state. (#67243) Thanks @jarimustonen.
- Channels/WhatsApp: restrict pairing verification replies to real inbound user content, preventing unsolicited prompts from receipts, typing indicators, presence updates, and other non-message Baileys upserts. Fixes #73797. (#73823) Thanks @hclsys.
- Configure/Ollama: show the configured Ollama model allowlist after Cloud only or Cloud + Local setup and skip slow per-model cloud metadata fetches. (#73995) Thanks @obviyus.
- Channels/WhatsApp: detect explicit group `@mentions` again when the bot's own E.164 is in `allowFrom`, so shared-number setups no longer skip group pings that directly mention the bot. Fixes #49317. (#73453) Thanks @juan-flores077.
- WhatsApp/reliability: publish real transport-liveness into WhatsApp channel status and force earlier reconnects on silent transport stalls, so quiet healthy sessions stay connected while wedged sockets recover before the later remote 408 path. (#72656) Thanks @Sathvik-1007.
- Core/channels: tighten selected runtime, media, and plugin edge-case handling while preserving existing behavior. Thanks @jesse-merhi.
- Channels/WhatsApp: strip leaked plural tool-call XML wrappers on every WhatsApp-visible outbound path and keep channel error payloads out of WhatsApp chats. (#71830) Thanks @rubencu.
- Agents/embedded-runner: inject the resolved OAuth bearer (and forward the run abort signal) on the boundary-aware embedded stream fallback so models that route through `openai-codex-responses` and other boundary-aware transports stop failing with `401 Unauthorized: Missing bearer or basic authentication in header`. Fixes #73559. (#73588) Thanks @openperf.
- Telegram/gateway: bound outbound Bot API calls and cache bundled plugin alias lookup so slow Telegram sends or WSL2 filesystem scans no longer wedge gateway replies. (#74210) Thanks @obviyus.
- Configure/GitHub Copilot: reuse existing Copilot auth during configure and show the provider's manifest model catalog in the model picker. (#74276) Thanks @obviyus.
- Configure/models: keep the model picker scoped to the selected manifest provider and enable its bundled plugin before catalog lookup, so choosing GitHub Copilot no longer falls back to Ollama or skips the catalog. (#74322) Thanks @obviyus.
- Auto-reply/subagents: reject `/focus` from leaf subagents and scope fallback target resolution to the requesting subagent's children, so subagents cannot bind conversations outside their control boundary. (#73613) Thanks @drobison00.
- Gateway/startup: skip inherited workspace startup memory for sandboxed spawned sessions without real-workspace write access, so `/new` no longer preloads host workspace memory into isolated child runs. (#73611) Thanks @drobison00.
- Agents/tool policy: validate caller group IDs against session or spawned context before applying group-scoped tool policies or persisting gateway group metadata, so forged group IDs cannot unlock more permissive tools. (#73720) Thanks @mmaps.
- Commands: keep channel-prefixed owner allowlist entries scoped to matching providers so webchat command contexts cannot inherit external channel owners. Thanks @zsxsoft.
- Auth/device pairing: bound bootstrap handoff token issuance, redemption, and approved pairing baselines to the documented per-role scope allowlist, so bootstrap approvals cannot persistently grant `operator.admin`, `operator.pairing`, or `node.exec` scopes. Thanks @eleqtrizit.
- Providers/GitHub Copilot: support the GUI/RPC wizard device-code auth flow so onboarding from non-TTY clients (gateway RPC bridge, GUI wizards) completes instead of returning empty profiles. Dangerous-state handling now distinguishes `access_denied` and `expired_token` from transport errors. (#73290) Thanks @indierawk2k2.
- Installer/Linux: warn before switching an unwritable npm global prefix to `~/.npm-global`, then tell users to run future global updates with `npm i -g openclaw@latest` without `sudo` so npm keeps using the redirected user prefix. Fixes #44365; carries forward #50479. Thanks @Sayeem3051.
- Gateway/plugins: enable the native `require()` fast path on Windows for bundled plugin modules so plugin loading uses `require()` instead of Jiti's transform pipeline, reducing startup from ~39s to ~2s on typical 6-plugin setups. Fixes #68656. (#74173) Thanks @galiniliev.

## 🚀 v2026.4.27（2026年4月29日）

### ✨ 新增与改进

- Codex Computer Use setup now ships with status/install commands, marketplace discovery, and fail-closed MCP checks for Codex-mode desktop control. Thanks @pash-openai.
- DeepInfra joins the bundled provider set with model discovery, media generation/editing, TTS, embeddings, and provider-owned onboarding policy. Thanks @ats3v.
- Tencent Yuanbao and QQBot support expand channel coverage with Yuanbao docs/catalog entries and QQBot group chat, streaming, media upload, and pipeline refactors. Thanks @loongfay and @cxyhhhhh.
- Plugin startup and model catalogs move toward manifest-first metadata, reducing Gateway boot work and making provider rows/aliases/suppressions easier to audit. Thanks @shakkernerd.
- Reliability fixes cover Telegram startup/sends, Slack socket/media stalls, gateway startup prewarm, session/history defaults, update sync, and Windows restart handoffs. Thanks @joerod26, @obviyus, @shivasymbl, @freerk, @bassboy2k, @jpreagan, @islandpreneur007, and @Thatgfsj.

### 🔧 功能调整

- Sandbox/Docker: add opt-in `sandbox.docker.gpus` passthrough for Docker sandbox containers so local GPU workloads can run inside sandboxed agents when the host Docker runtime supports `--gpus`. Fixes #57976; carries forward #58124. Thanks @cyan-ember.
- iOS/Gateway: add an authenticated `node.presence.alive` protocol event and `node.list` last-seen fields so background iOS wakes can mark paired nodes recently alive without treating them as connected. Carries forward #63123. Thanks @ngutman.
- Android: publish authenticated `node.presence.alive` events after node connect and background transitions so paired Android nodes retain durable last-seen metadata after disconnects. Carries forward #63123. Thanks @ngutman.
- Gateway/chat: accept non-image attachments through `chat.send` by staging them as agent-readable media paths, while keeping unsupported RPC attachment paths explicit instead of silently dropping files. Fixes #48123. (#67572) Thanks @samzong.
- Security/networking: add opt-in operator-managed outbound proxy routing (proxy.enabled + proxy.proxyUrl/OPENCLAW_PROXY_URL) with strict http:// forward-proxy validation, loopback-only Gateway bypass, and cleanup of proxy env/dispatcher state on exit. (#70044) Thanks @jesse-merhi and @joshavant.
- Dependencies: refresh provider and tooling dependencies, including AWS SDK, PI runtime packages, AJV, Feishu SDK, Anthropic SDK, tokenjuice, and native TypeScript/oxlint tooling. Thanks @dependabot.
- Matrix/QA: add live Matrix approval scenarios for exec metadata, chunked fallback, plugin approvals, deny reactions, thread targeting, and `target: "both"` delivery, with redacted artifacts preserving safe approval summaries. Thanks @gumadeiras.
- Diagnostics/Codex: add owner-only core `/diagnostics` with a sensitive-data preamble, docs link, and explicit Gateway export approval guidance; Codex harness sessions also ask before uploading Codex feedback for the attached thread and print the matching `codex resume <thread-id>` inspection command after confirmed upload. Thanks @pashpashpash.
- Trajectory export: route `/export-trajectory` through per-run exec approval, send group-chat approval prompts and export results only to the owner privately, and add `openclaw sessions export-trajectory` for the approved command path. Thanks @pashpashpash.
- Codex: add Computer Use setup for Codex-mode agents, including `/codex computer-use status/install`, marketplace discovery, optional auto-install, and fail-closed MCP server checks before Codex-mode turns start. Fixes #72094. (#71842) Thanks @pash-openai.
- Apps: consume Peekaboo 3.0.0-beta4 and ElevenLabsKit 0.1.1, align Swabble on Commander 0.2.2, and refresh macOS/iOS SwiftPM resolutions against the released dependency graph. Thanks @Blaizzy.
- Plugin SDK: expose shared channel route normalization, parser-driven target resolution, raw-target compact keys, parsed-target types, and route comparison helpers through `openclaw/plugin-sdk/channel-route`, switch native approval origin matching onto that route contract with optional delivery and match-only target normalization, and retire the internal channel-route shim behind dated compatibility aliases for legacy key/comparable-target helpers. Thanks @vincentkoc.
- Docs/Codex: document how Codex Computer Use, direct `cua-driver mcp`, and OpenClaw.app's PeekabooBridge fit together so desktop-control setup choices are clearer. Thanks @pash-openai and @trycua.
- Matrix/streaming: stream tool-progress updates into live Matrix preview edits by default when preview streaming is active, with `streaming.preview.toolProgress: false` to keep answer previews while hiding interim tool lines. Thanks @gumadeiras.
- Plugins/models: wire manifest `modelCatalog.aliases` and `modelCatalog.suppressions` into model-catalog planning and built-in model suppression, with stale Spark and Qwen Coding Plan suppressions now declared in plugin manifests instead of runtime fallback hooks. Thanks @shakkernerd.
- Plugin SDK/models: add a shared manifest-backed provider catalog builder and move Qianfan, Xiaomi, NVIDIA, Cerebras, Mistral, Moonshot, DeepSeek, Tencent TokenHub, and StepFun provider catalogs onto their plugin manifest `modelCatalog` rows. Thanks @shakkernerd.
- Plugin SDK/models: move BytePlus and Volcano Engine standard and plan-provider catalogs into plugin manifest `modelCatalog` rows and remove the now-unused Volcengine-family shared catalog SDK subpath. Thanks @shakkernerd.
- CLI/models: move Fireworks and Together AI fixed provider catalogs into plugin manifest `modelCatalog` rows so provider-filtered listing can use manifest-backed static rows. Thanks @shakkernerd.
- Channels/Yuanbao: register the Tencent Yuanbao external channel plugin (`openclaw-plugin-yuanbao`) in the official channel catalog, contract suites, and community plugin docs, with a new `docs/channels/yuanbao.md` quick-start guide for WebSocket bot DMs and group chats. (#72756) Thanks @loongfay.
- Channels/QQBot: add full group chat support (history tracking, @-mention gating, activation modes, per-group config, FIFO message queue with deliver debounce), C2C `stream_messages` streaming with a `StreamingController` lifecycle manager, unified `sendMedia` with chunked upload for large files, and refactor the engine into pipeline stages, focused outbound submodules, builtin slash-command modules, and explicit DI ports via `createEngineAdapters()`. (#70624) Thanks @cxyhhhhh.
- Plugins/startup: migrate bundled plugin manifests to explicit `activation.onStartup` declarations so Gateway startup imports only the bundled plugins that intentionally register startup-time runtime surfaces. Thanks @shakkernerd.
- Plugins/startup: add an opt-in future-mode gate for disabling deprecated implicit startup sidecar loading while preserving explicit startup and narrower activation triggers. Thanks @shakkernerd.
- Plugins/startup: add plugin compatibility warnings for deprecated implicit startup loading so authors can migrate to explicit `activation.onStartup` metadata. Thanks @shakkernerd.
- Plugins/runtime: load bundled agent tool-result middleware from manifest contracts on demand so tokenjuice stays startup-lazy without losing Pi/Codex tool-output compaction. Thanks @shakkernerd.
- Plugins/startup: add explicit `activation.onStartup` metadata so plugins can declare Gateway startup import behavior while the deprecated implicit sidecar fallback remains for legacy plugins. Thanks @shakkernerd.
- Gateway/startup: reuse lookup-table plugin manifests when loading startup plugins so Gateway boot avoids rebuilding plugin discovery and manifest metadata. Thanks @shakkernerd.
- CLI/models: declare fixed Qianfan, Xiaomi, NVIDIA, Cerebras, Mistral, Chutes, Kilo, OpenAI, and OpenCode Go model catalogs in refreshable plugin manifests, keep broad `models list --all` on raw registry and supplement rows without runtime normalization, and avoid duplicate supplement resolution. Thanks @shakkernerd.
- Gateway/runtime: reuse the current plugin metadata snapshot for provider discovery so repeated model-provider discovery avoids rebuilding plugin manifest metadata. Thanks @shakkernerd.
- Gateway/startup: pass the plugin metadata snapshot from config validation into plugin bootstrap so startup reuses one manifest product instead of rebuilding plugin metadata. Thanks @shakkernerd.
- Plugin SDK/testing: move core-only channel contract fixtures under the channel contract test tree and retire the old `test/helpers/channels` bridge directory so plugin tests stay on focused SDK surfaces. Thanks @vincentkoc.
- Plugin SDK/testing: expose native agent-runtime contract fixtures through `plugin-sdk/agent-runtime-test-contracts`, move sandbox config fixtures into the focused generic fixture subpath, and block extension tests from importing repo-only `test/helpers` bridges. Thanks @vincentkoc.
- Plugin SDK/testing: expose generic module reload, bundled-path, Node builtin mock, channel pairing/envelope, HTTP server, temp-home, replay-policy, and live STT helpers through focused SDK test subpaths so extension tests no longer depend on repo-only helper bridges. Thanks @vincentkoc.
- Plugin SDK: move maintained bundled channels off the deprecated `channel-config-schema-legacy` subpath, add an explicit bundled-channel schema SDK surface, and track both remaining legacy test/config compatibility barrels with dated removal windows. Thanks @vincentkoc.
- Plugin SDK/testing: expose media provider capability assertions and provider HTTP mocks through focused SDK test subpaths, and retire the repo-only media-generation test helper bridge. Thanks @vincentkoc.
- Plugin SDK/testing: promote bundled plugin/provider/channel contract helpers to focused SDK test subpaths and retire the repo-only `test/helpers/plugins` TypeScript bridge. Thanks @vincentkoc.
- Plugin SDK/testing: expose generic channel action, setup, status, and directory contract helpers through `plugin-sdk/channel-test-helpers` so bundled extension tests no longer import repo-only channel helper bridges. Thanks @vincentkoc.
- Plugin SDK/testing: add `plugin-sdk/channel-target-testing` for shared channel target-resolution cases, document channel reaction helpers on `plugin-sdk/channel-feedback`, and keep the old `plugin-sdk/test-utils` alias as compatibility-only. Thanks @vincentkoc.
- Plugin SDK/testing: add a focused generic fixture subpath for CLI capture, sandbox, skill, agent-message, system-event, terminal, chunking, auth-token, and typed-case helpers. Thanks @vincentkoc.
- Plugin SDK/testing: add focused plugin runtime and environment fixture subpaths so plugin tests can avoid the broad `plugin-sdk/testing` barrel for common setup helpers. Thanks @vincentkoc.
- Plugin SDK/testing: add a focused `plugin-sdk/plugin-test-api` helper subpath and move bundled plugin registration tests off the repo-only plugin API bridge. Thanks @vincentkoc.
- Plugin SDK: add generic host hooks for session state, next-turn context, trusted tool policy, UI descriptors, events, scheduler cleanup, and run-scoped plugin context. (#72287) Thanks @100yenadmin.
- Plugin SDK/testing: expose provider catalog, wizard, registry, manifest, public-artifact, outbound, and TTS contract helpers through documented SDK testing seams so bundled plugin tests no longer import repo `src/**` internals. Thanks @vincentkoc.
- Providers/DeepInfra: add a bundled DeepInfra provider with `DEEPINFRA_API_KEY` onboarding, dynamic OpenAI-compatible model discovery, image generation/editing, image/audio media understanding, TTS, text-to-video, memory embeddings, static catalog metadata, and provider-owned base URL policy. Carries forward #53805, #48088, #37576, #43896, #11533, and #2554. Thanks @ats3v.
- Matrix: attach versioned structured approval metadata to pending approval messages so capable Matrix clients can render richer approval UI while body text and reaction fallback keep working. (#72432) Thanks @kakahu2015.

### 🐛 问题修复

- CLI/channel-setup: auto-skip the redundant "Install \<plugin\>?" confirmation when only one install source (npm or local) exists, show `download from <npm-spec>` hints for installable catalog channels in the picker, and suppress misleading npm hints for already-bundled channels. Fixes #73419. Thanks @sliverp.
- BlueBubbles: tighten DM-vs-group routing across the outbound session route (`chat_guid:iMessage;-;...` DMs no longer classified as groups), reaction handling (drop group reactions that arrive without any chat identifier instead of synthesizing a `"group"` literal peerId), inbound `chatGuid` fallback (no longer fall back to the sender's DM chatGuid when resolving a group whose webhook omits chatGuid+chatId+chatIdentifier), and short message id resolution (carry caller chat context so a numeric short id reused after a long group conversation cannot silently resolve to a message in a different chat, with the same cross-chat guard applied to full GUIDs so retries cannot bypass it). Thanks @zqchris.
- Gateway/sessions: clone cached session stores through the persisted JSON shape instead of `structuredClone`, reducing native-memory growth on the remaining #54155 Gateway RSS/session-accumulation path while keeping #54155 as the broader tracker and carrying forward the #45438 session-cache hypothesis. Thanks @vincentkoc and the #45438 reporters/commenters.
- Agents/approvals: fail restart-interrupted sessions whose transcript tail is still `approval-pending` instead of replaying stale exec approval IDs into the new Gateway process after restart. Fixes #65486. Thanks @mjmai20682068-create.
- CLI/Gateway: use method-specific least-privilege scopes for classified CLI Gateway calls while preserving legacy broad scopes for unclassified plugin methods, so read-only commands no longer create admin/write/pairing scope-upgrade prompts. Fixes #68634. Thanks @nightmusher.
- Gateway/sessions: align `chat.history` and `sessions.list` thinking defaults with owning-agent and catalog-aware resolution so Control UI session defaults match backend runtime state. (#63418) Thanks @jpreagan.
- Devices/pairing: recover array-shaped device and node pairing state files before persisting approvals, so UUID-keyed pending and paired entries no longer disappear after a malformed JSON store write. Fixes #63035. Thanks @sar618.
- Gateway/auth: clear reused stale device tokens and stop reconnecting on device-token mismatch in the Control UI and Node gateway clients, avoiding rate-limit loops after scope-upgrade or token-rotation handoffs. Fixes #71609. Thanks @ricksayhi.
- Gateway/approvals: treat duplicate same-decision approval resolves as idempotent during the resolved-entry grace window, including consumed `allow-once` approvals, while returning an explicit already-resolved error for conflicting repeats. Fixes #59162; refs #58479 and #65486. Thanks @wikithoughts, @sajazuniga7-coder, and @mjmai20682068-create.
- Channels/Telegram: honor `approvals.exec/plugin.targets[].accountId` when routing native approvals across multi-bot Telegram accounts while preserving unscoped Telegram targets for any account. Fixes #69916. Thanks @joerod26.
- Agents/exec: omit the internal session-resume fallback preface from successful async exec completion messages sent directly back to chat. Fixes #67181. Thanks @raistlin88.
- Agents/media: register detached `video_generate` and `music_generate` tool run contexts until terminal status, so Discord-backed provider jobs stay live in `/tasks` instead of becoming `lost` when the parent chat run context disappears. Thanks @vincentkoc.
- Agents/media: prefer OpenAI image and video providers when the default model uses the OpenAI Codex auth alias, so auto media generation no longer falls through to Fal before GPT Image or Sora. Thanks @vincentkoc.
- Tasks/media: infer agent ownership for session-scoped task records so `/tasks` agent-local fallback includes session-backed `video_generate` and other async media jobs even when the current chat session has no linked rows. Thanks @vincentkoc.
- Agents/media: keep long-running `video_generate` and `music_generate` tasks fresh while provider jobs are still pending, so task maintenance does not mark active Discord media renders lost before completion. Thanks @vincentkoc.
- CLI/status: treat scope-limited gateway probes as reachable-but-degraded in shared status scans, so `openclaw status --all` no longer reports a live gateway as unreachable after `missing scope: operator.read`. Fixes #49180; supersedes #47981. Thanks @openjay.
- Slack/Socket Mode: use a 15s Slack SDK pong timeout by default and add `channels.slack.socketMode.clientPingTimeout`, `serverPingTimeout`, and `pingPongLoggingEnabled` overrides so stale-websocket handling no longer depends on app-event health heuristics. Fixes #14248; refs #58519, #64009, and #63488. Thanks @shivasymbl and @freerk.
- Slack/media: bound private file and forwarded attachment downloads with idle and total timeouts while preserving placeholder fallback, so stalled Slack `file_share` media no longer wedges inbound message handling. Fixes #61850. Thanks @bassboy2k.
- Plugins/inspector: keep bundled plugin runtime capture quiet and config-tolerant for Codex, memory-lancedb, Feishu, Mattermost, QQBot, and Tlon so plugin-inspector JSON checks can validate the full bundled set. Thanks @vincentkoc.
- Slack/auto-reply: keep fully consumed text reset triggers such as `new session` out of `BodyForAgent` after directive cleanup, so configured Slack reset phrases do not leak into the fresh model turn. Fixes #73137. Thanks @neeravmakwana.
- Plugins/runtime deps: prune stale retained bundled runtime deps and keep doctor/secret channel contract scans on lightweight artifacts, so disabled bundled channels stop preserving old dependency trees or importing heavy plugin surfaces. Thanks @SymbolStar and @vincentkoc.
- Auto-reply: bound the post-run pending tool-result delivery drain with a progress-aware idle timeout, so a never-settling tool-result task no longer leaves the session active forever while slow healthy deliveries can keep draining. Fixes #53889; supersedes #64733 and #73434. Thanks @zijunl and @wujiaming88.
- Gateway/startup: start chat channels without waiting for primary model prewarm, keeping model warmup bounded in the background so Slack and other channels come online promptly when provider discovery is slow. Supersedes #73420. Thanks @dorukardahan.
- Gateway/install: carry env-backed config SecretRefs such as `channels.discord.token` into generated service environments when they are present only in the installing shell, while keeping gateway auth SecretRefs non-persisted. Fixes #67817; supersedes #73426. Thanks @wdimaculangan and @ztexydt-cqh.
- Auto-reply/commands: stop bare `/reset` and `/new` after reset hooks acknowledge the command, so non-ACP channels no longer fall through into empty provider calls while `/reset <message>` and `/new <message>` still seed the next model turn. Fixes #73367 and #73412. Thanks @hoyanhan, @wenxu007, and @amdhelper.
- Providers/DeepSeek: backfill DeepSeek V4 `reasoning_content` on plain assistant replay messages as well as tool-call turns, so thinking sessions with prior tool use no longer fail follow-up requests with missing reasoning content. Fixes #73417; refs #71372. Thanks @34262315716 and @Bartok9.
- Agents/gateway tool: strip full config payloads from `config.patch` and `config.apply` tool responses while preserving direct RPC responses, so config-heavy sessions no longer replay large redacted configs into transcript history. Fixes #47610; supersedes #73439. Thanks @HanenVit and @juan-flores077.
- Auto-reply: preserve voice-note media from silent turns while continuing to suppress text and non-voice media, so `NO_REPLY` TTS replies still deliver the requested audio bubble. (#73406) Thanks @zqchris.
- Channels/Mattermost: stop enqueueing regular inbound posts as system events, so Mattermost user messages reach the model only as user-role inbound-envelope content instead of also appearing as `System: Mattermost message...` directives. Fixes #71795. Thanks @juan-flores077.
- Agents/media: qualify bare `agents.defaults.imageModel` and `pdfModel` refs from unique configured image-capable providers, so Ollama vision models such as `moondream` and `qwen2.5vl:7b` do not fall through to the default provider. Fixes #38816; supersedes #73396. Thanks @alainasclaw and @vincentkoc.
- Agents/Anthropic: send implicit Anthropic beta headers only to direct public Anthropic endpoints, including OAuth, so custom Anthropic-compatible providers no longer mis-handle unsupported beta flags unless explicitly configured. Refs #73346. Thanks @byBrodowski.
- Skills: require explicit `skills.entries.coding-agent.enabled` before exposing the bundled coding-agent skill, so installs with Codex on PATH but no OpenAI auth do not silently offer Codex delegation. Fixes #73358. Thanks @LaFleurAdvertising and @Sanjays2402.
- Plugins/startup: treat manifestless Claude bundles as valid installed-plugin registry entries instead of stale missing manifests, so workspace bundles no longer force repeated derived registry rebuilds or noisy `plugins.entries.workspace` warnings during Gateway startup. Fixes #73433. Thanks @AnneVoss.
- Agents/subagents: preserve `sessions_yield` as a paused subagent state and ignore its wait text while freezing completion output, so parent sessions wait for the final post-compaction answer instead of receiving intermediate progress or `(no output)`. Fixes #73413. Thanks @Ask-sola.
- Plugins/startup: precompute bundled runtime mirror fingerprints before taking the mirror lock and keep Docker bundled plugin runtime deps/mirrors in a Docker-managed volume instead of the Windows/WSL config bind mount, so cold starts avoid slow host-volume mirror writes. Fixes #73339. Thanks @1yihui.
- Plugins/runtime deps: refresh bundled runtime mirrors without deleting active import trees, so config-triggered restarts do not see transient missing plugin files during registration. Thanks @shakkernerd.
- Channels/LINE: persist inbound image, video, audio, and file downloads in `~/.openclaw/media/inbound/` instead of temporary files so agents can still read LINE media after `/tmp` cleanup. Fixes #73370. Thanks @hijirii and @wenxu007.
- CLI/plugins: keep bundled plugin installs out of `plugins.load.paths` while preserving install records, so install/inspect/doctor loops no longer warn about the current bundled plugin directory. Thanks @vincentkoc.
- CLI/plugins: scope `plugins inspect <id>` runtime loading to the matched plugin so single-plugin inspection does not load every plugin before checking the target. Thanks @shakkernerd.
- CLI/plugins: remove managed copied-path plugin directories during uninstall and plan uninstall from metadata instead of runtime-loading plugins, so plugin lifecycle commands avoid unnecessary bundled runtime-deps work. Thanks @shakkernerd.
- Cron tool: infer the creating session's agentId for `cron.add` jobs when `agentId` is omitted or passed as undefined, keeping scheduled agentTurn jobs routed to the session agent; #40571 identified the guard bug and supplied the focused regression coverage. Thanks @ChanningYul.
- Cron/Telegram: add `--thread-id` to `openclaw cron add` and `openclaw cron edit`, preserving Telegram forum topic delivery targets across scheduled announcements. Carries forward #51581, #60373, and #60890. Thanks @ChunHao-dev.
- Cron/Telegram: preserve session-derived Telegram topic thread IDs when isolated cron delivery explicitly targets the parent chat, keeping bare chat targets in the active forum topic without leaking stale topics to other chats. Carries forward #64708. Thanks @addelh.
- Memory/compaction: keep pre-compaction memory-flush prompts runtime-only so session transcripts and `chat.history` no longer expose them as normal user turns. Fixes #54408 and #58956; refs #43567. Thanks @markgong and @guoyuhang9.
- Control UI/WebChat: keep large attachment payloads out of Lit state and optimistic chat messages, using object URL previews plus send-time payload serialization so PDF/image uploads no longer trigger `RangeError: Maximum call stack size exceeded`. Fixes #73360; refs #54378 and #63432. Thanks @hejunhui-73, @Ansub, and @christianhernandez3-afk.
- Agents/Anthropic: cancel stalled Anthropic Messages SSE body reads when abort signals fire, so active-memory timeouts release transport resources instead of leaving hidden recall runs parked on `reader.read()`. Refs #72965 and #73120. Thanks @wdeveloper16.
- Control UI/WebChat: keep pending run and typing state attached to the active client run, so unowned inject/announce/side-result finals no longer unlock unrelated active runs while completed owned runs still clear promptly. Fixes #57795; carries forward the narrow diagnosis from #57887. Thanks @haoyu-haoyu.
- Sandbox/Docker: stop satisfying a missing default sandbox image by tagging plain Debian as `openclaw-sandbox:bookworm-slim`, preserving the Python tooling required by sandbox write/edit helpers and directing users to build the default image. Fixes #51185; refs #45108, #51099, #51609, and #57713. Thanks @dpalis, @Tin55FoilDev, @jbcohen2-coder, @macminihal-cyber, and @PraxoOnline.
- Control UI/WebChat: confirm toolbar New Session button resets before dispatching `/new` while leaving typed `/new` and `/reset` commands immediate. Fixes #45800; refs #27065, #56611, #54499, and #27110. Thanks @aethnova, @kosta228-huli, @adambezemek, and @xss925175263 (xianshishan).
- Agents/models: keep per-agent primary models strict when `fallbacks` is omitted, so probe-only custom providers are not tried as hidden fallback candidates unless the agent explicitly opts in. Fixes #73332. Thanks @haumanto.
- Gateway/models: add `models.pricing.enabled` so offline or restricted-network installs can skip startup OpenRouter and LiteLLM pricing-catalog fetches while keeping explicit model costs working. Fixes #53639. Thanks @callebtc, @palewire, and @rjdjohnston.
- Gateway/startup: warn when legacy `CLAWDBOT_*` or `MOLTBOT_*` environment variables are still present, pointing users to `OPENCLAW_*` names instead of failing silently. Fixes #53482; carries forward #53667. Thanks @lndyzwdxhs.
- Onboarding: pin interactive and non-interactive health checks to the just-configured setup token/password so stale `OPENCLAW_GATEWAY_TOKEN` or `OPENCLAW_GATEWAY_PASSWORD` values do not produce false gateway-token-mismatch failures after setup. Fixes #72203. Thanks @galiniliev.
- Doctor/state: require an interactive confirmation before archiving orphan transcript files, so `openclaw doctor --fix` no longer silently renames recoverable session history after upgrades regenerate `sessions.json`. Fixes #73106. Thanks @scottgl9.
- Cron/Telegram: preserve explicit `:topic:` delivery targets over stale session-derived thread IDs when isolated cron announces to Telegram forum topics. Carries forward #59069; refs #49704 and #43808. Thanks @roytong9.
- Build/runtime: write the runtime-postbuild stamp after `pnpm build` writes the build stamp, so the next CLI invocation does not re-sync runtime artifacts after a successful build. Fixes #73151. Thanks @bittoby.
- Build/runtime: preserve staged bundled-plugin runtime dependency caches across source-checkout tsdown rebuilds, so local CLI and gateway-watch rebuilds no longer recreate large plugin dependency trees before starting. Refs #73205. Thanks @SymbolStar.
- CLI/channels: list configured chat channel accounts from read-only setup metadata even when the standalone CLI has not loaded the runtime channel registry, so `openclaw channels list` shows Telegram accounts before auth providers. Fixes #73319 and #73322. Thanks @mlaihk.
- CLI/model probes: keep `infer model run --gateway` raw by skipping prior session transcript, bootstrap context, context-engine assembly, tools, and bundled MCP servers, so local backends can be tested without full agent-context overhead. Fixes #73308. Thanks @ScientificProgrammer.
- CLI/image describe: pass `--prompt` and `--timeout-ms` through `infer image describe` and `describe-many`, so custom vision instructions and slow local model budgets reach media-understanding providers such as Ollama, OpenAI, Google, and OpenRouter. Addresses #63700. Thanks @cedricjanssens.
- Providers/Ollama: reject long non-linguistic Kimi/GLM symbol runs as provider failures instead of storing them as successful visible assistant replies, so fallback or error handling can recover from garbled cloud output. Fixes #64262; refs #67019. Thanks @Kloz813 and @xiaomenger123.
- CLI/model probes: reject empty or whitespace-only `infer model run --prompt` values before calling local providers or the Gateway, so smoke checks do not spend provider calls on invalid turns. Fixes #73185. Thanks @iot2edge.
- Gateway/media: route text-only `chat.send` image offloads through media-understanding fields so `agents.defaults.imageModel` can describe WebChat attachments instead of leaving only an opaque `media://inbound` marker. Fixes #72968. Thanks @vorajeeah.
- Gateway/Windows: route no-listener restart handoffs through the Windows supervisor without leaving restart tokens in flight, so failed task scheduling can be retried and successful handoffs do not coalesce later restart requests. (#69056) Thanks @Thatgfsj.
- Gateway/model pricing: skip plugin manifest discovery during background pricing refreshes when `plugins.enabled: false`, so disabled-plugin setups do not keep rebuilding plugin metadata from the Gateway hot path. Fixes #73291. Thanks @slideshow-dingo and @fishgills.
- Ollama/thinking: validate `/think` commands against live Ollama catalog reasoning metadata and preserve explicit native `params.think`/`params.thinking`, so models whose `/api/show` capabilities include `thinking` expose `low`, `medium`, `high`, and `max` instead of being stuck on `off`. Fixes #73366. Thanks @cymise.
- Gateway/sessions: remove automatic oversized `sessions.json` rotation backups, deprecate `session.maintenance.rotateBytes`, and teach `openclaw doctor --fix` to remove the ignored key so hot session writes no longer copy multi-MB stores. Refs #72338. Thanks @midhunmonachan and @DougButdorf.
- Channels/Telegram: fail fast when Telegram rejects the startup `getMe` token probe with 401, so invalid or stale BotFather tokens are reported as token auth failures instead of misleading `deleteWebhook` cleanup failures. Fixes #47674. Thanks @samaedan-arch.
- ACPX: keep generated Codex and Claude ACP wrapper startup paths working when remote or special state filesystems reject chmod, since OpenClaw invokes the wrappers through Node instead of executing them directly. Fixes #73333. Thanks @david-garcia-garcia.
- CLI/onboarding: infer image input for common custom-provider vision model IDs, ask only for unknown models, and keep `--custom-image-input`/`--custom-text-input` overrides so vision-capable proxies do not get saved as text-only configs. Fixes #51869. Thanks @Antsoldier1974.
- Models/OpenAI Codex: stop listing or resolving unsupported `openai-codex/gpt-5.4-mini` rows through Codex OAuth, keep stale discovery rows suppressed with a clear API-key-route hint, and leave direct `openai/gpt-5.4-mini` available. Fixes #73242. Thanks @0xCyda.
- Plugin SDK: restore the root `stringEnum` and `optionalStringEnum` exports on both the published SDK entry and runtime root-alias bridge, so older external plugins can keep building and loading while migrating to focused SDK subpaths. Fixes #68279. Thanks @marzliak.
- Plugin SDK: restore the root-alias bridge for `registerContextEngine` and expose missing legacy compat helpers `normalizeAccountId` and `resolvePreferredOpenClawTmpDir` so older external plugins such as `openclaw-weixin` can keep loading while migrating to focused SDK subpaths. Fixes #53497. Thanks @alanxchen85.
- Auth profiles: make `openclaw doctor --fix` migrate legacy flat `auth-profiles.json` files such as `{ "ollama-windows": { "apiKey": "ollama-local" } }` to canonical provider default API-key profiles with a backup, so custom Ollama/OpenAI-compatible providers recover cleanly after upgrading. Fixes #59629; supersedes #59642. Thanks @Xsanders555 and @Linux2010.
- Memory/Dreaming: retry Dream Diary once with the session default when a configured dreaming model is unavailable, while leaving subagent trust and allowlist errors visible instead of silently masking configuration problems. Refs #67409 and #69209. Thanks @Ghiggins18 and @everySympathy.
- Feishu/inbound files: recover CJK filenames from plain `Content-Disposition: filename=` download headers when Feishu exposes UTF-8 bytes through Latin-1 header decoding, while leaving valid Latin-1 and JSON-derived names unchanged. (#48578, #50435, #59431) Thanks @alex-xuweilong, @lishuaigit, and @DoChaoing.
- Channels/Telegram: normalize accidental full `/bot<TOKEN>` Telegram `apiRoot` values at runtime and teach `openclaw doctor --fix` to remove the suffix, so startup control calls no longer 404 when direct Bot API curl commands work. Fixes #55387. Thanks @brendanmatthewjones-cmyk, @techfindubai-ux, and @Sivlerback-Chris.
- Zalo Personal: persist refreshed `zca-js` session cookies after QR login, session restore, and successful API calls so gateway restarts restore the freshest local session. (#73277) Thanks @darkamenosa.
- Logging/security: redact sensitive tokens (sk-\* keys, Bearer/Authorization values, etc.) at the subsystem console sink so `createSubsystemLogger().info/warn/error` output that bypasses the patched console-capture handler still applies the same redaction the file transport already does. Fixes #73284; refs #67953 and #64046. Thanks @edwin-rivera-dev.
- Plugins/runtime deps: reuse enclosing versioned cache roots when bundled plugins resolve from nested staged paths, so plugin-runtime-deps no longer mints `openclaw-unknown-*` directories or loops on `ENOTEMPTY`. Fixes #72956. (#73205) Thanks @SymbolStar.
- Agents/failover: classify CJK provider transport, quota, billing, auth, and overload error text so Chinese-language provider failures trigger fallback and user-facing transport copy instead of surfacing as unclassified raw errors. (#56242) Thanks @tomcatzh.
- Agents/failover: seed non-claude-cli fallback prompts with Claude Code session context when a claude-cli attempt fails, so fallback models do not restart cold after billing or quota failover. (#72069) Thanks @stainlu.
- Agents/CLI runner: transfer bundle-MCP tempDir cleanup from the per-turn runner finally to the Claude live-session lifecycle, so persistent Claude CLI sessions keep their `--mcp-config` directory until the live subprocess closes. Fixes #73244. Thanks @edwin-rivera-dev.
- Gateway/nodes: allow Windows companion nodes to use safe declared commands such as canvas, camera list, location, device info, and screen snapshot by default while keeping dangerous media commands opt-in. (#71884) Thanks @shanselman.
- Agents/cron: clarify agent-tool and CLI cron timezone guidance so supplied `tz` values use local wall-clock cron fields and omitted cron `tz` falls back to the Gateway host local timezone. Fixes #53669; carries forward #46177. (#73372) Thanks @chen-zhang-cs-code and @maranello-o.
- Providers/Qwen: allow explicitly configured `qwen/qwen3.6-plus` to resolve on Qwen Coding Plan endpoints while keeping the built-in catalog from advertising it there. Fixes #63654; carries forward #63987. Thanks @jepson-liu.
- Channels/Telegram: keep Bot API network fallbacks sticky after failed attempts and retry timed-out startup control calls once on the fallback route, so `deleteWebhook` IPv6 stalls no longer trigger slow multi-account retry storms. Fixes #73255. Thanks @ttomiczek and @sktbrd.
- Gateway/agents: accept heartbeat, cron, and webhook as internal channel hints for agent runs so `sessions_spawn` works from non-delivery parent sessions while unknown channel hints still fail closed. Fixes #73237. Thanks @KeWang0622.
- Gateway/models: merge explicit `models.providers.*.models` rows into the Gateway model catalog with normalized provider/model dedupe, and use normalized image-capability lookup so custom vision models keep native image attachments even when Pi discovery omits them or model ID casing differs. Fixes #64213 and #65165. Thanks @billonese and @202233a.
- Gateway/reload: publish canonical post-write source config to in-process reloaders so simple config saves no longer create phantom plugin diffs or trigger unnecessary Gateway restarts. (#73267) Thanks @szsip239.
- Gateway/Docker: keep config-triggered restarts in-process inside containers instead of spawning a detached child and exiting PID 1 cleanly, so Docker Swarm and other on-failure supervisors do not leave the service stuck at 0/1 replicas. Fixes #73178. Thanks @du-nguyen-IT007.
- CLI/tasks: ship the task-registry control runtime in npm packages so `openclaw tasks cancel` can load ACP/subagent cancellation helpers from published builds. Fixes #68997. Thanks @1OAKDesign.
- Channels/Telegram: preserve unsent generated media after partial reply streaming has already delivered the text, so `image_generate` outputs still reach Telegram as photos instead of being dropped from the final payload. Fixes #73253. Thanks @mlaihk.
- Memory-core/dreaming: cap detached Dream Diary narrative subagents across cron sweeps so multi-workspace dreaming no longer fans out unbounded subagent sessions, lock contention, and cascading narrative timeouts. Fixes #73198. (#73287) Thanks @KeWang0622.
- CLI/agents: close local one-shot Claude live stdio sessions and bundled MCP loopback resources after embedded `openclaw agent --local` runs, while keeping gateway-owned MCP loopback cleanup internal to the Gateway. Thanks @frankekn.
- Export/session: keep inline export HTML scripts and vendor libraries injected after template formatting so generated session exports open with the app code, markdown renderer, and syntax highlighter present. Fixes #41862 and #49957; carries forward #41861 and #68947. Thanks @briannewman, @martenzi, and @armanddp.
- Agents/ACPX: stage the patched Claude ACP adapter as an ACPX runtime dependency and route known Codex/Claude ACP commands through local wrappers, so Gateway runtime no longer depends on live `npx` adapter resolution. Fixes #73202. Thanks @joerod26.
- Memory/compaction: let pre-compaction memory flush use an exact `agents.defaults.compaction.memoryFlush.model` override such as `ollama/qwen3:8b` without inheriting the active session fallback chain, so local housekeeping can avoid paid conversation models. Fixes #53772. Thanks @limen96.
- macOS/update: stop managed Gateway services before package replacement and keep LaunchAgent service secrets out of world-readable plist metadata by loading them from owner-only env files. Fixes #72996. Thanks @Mathewb7.
- Google Meet: keep observe-only Chrome joins and setup checks from requiring BlackHole or audio bridge commands, avoid granting or selecting the microphone in observe-only mode, and make `test_speech` report fresh realtime output-byte verification instead of only confirming a queued utterance. Refs #72478. Thanks @DougButdorf.
- Gateway/hooks: route non-delivered hook completion and error summaries to the target agent's main session instead of the default agent session, preserving multi-agent hook isolation. Fixes #24693; carries forward #68667. Thanks @abersonFAC and @bluesky6868.
- Control UI/models: request the configured Gateway model-list view so dashboards with only `models.providers.*.models` show those configured models first instead of flooding the picker with the full built-in catalog. Fixes #65405. Thanks @wbyanclaw.
- CLI/models: keep default-model and allowlist pickers on explicit `models.providers.*.models` entries when `models.mode` is `replace` instead of loading the full built-in catalog. Fixes #64950. Thanks @mrozentsvayg.
- Media/security: tighten media-understanding MIME sanitization so parameterized MIME values stay end-anchored and malformed whitespace or suffix payloads are rejected before file-context handling. Fixes #9795; carries forward #68225 with related review/test context from #61016/#68456. Thanks @ymaxgit, @bluesky6868, and @shamsulalam1114.
- Discord: own the Carbon interaction listener and hand off Discord slash/component handling asynchronously, so compaction or long session locks no longer trip `InteractionEventListener` listener timeouts. Fixes #73204. Thanks @slideshow-dingo.
- Compaction/diagnostics: keep unknown compaction failure classifications stable while logging sanitized detail for unclassified provider errors such as missing Ollama provider adapters. Thanks @gzsiang.
- Models/fallbacks: record first-class `model.fallback_step` trajectory events with from/to models, failure detail, chain position, and final outcome so support exports preserve the primary model failure even when a later fallback also fails. Fixes #71744. Thanks @nikolaykazakovvs-ux.
- Gateway/agents: block agent `exec` from launching interactive `openclaw channels login` flows and abort active agent runs after invalid-config recovery restores last-known-good config, preventing known channel-login and reload paths from wedging replies. Refs #72338. Thanks @midhunmonachan.
- Gateway/diagnostics: emit payload-free liveness warnings with event-loop delay, event-loop utilization, CPU-core ratio, active-session counts, and OTEL warning metrics/spans so live-but-stalled Gateways capture CPU-spin context in stability bundles and telemetry. Refs #72338. Thanks @midhunmonachan and @DougButdorf.
- Gateway/startup: keep value-option foreground starts on the gateway fast path and skip proxy bootstrap unless proxy env is configured, reducing normal gateway startup RSS and avoiding full CLI graph loading. Thanks @vincentkoc.
- Heartbeat/models: show heartbeat model bleed guidance on context-overflow resets when the last runtime model matches configured `heartbeat.model`, so smaller local heartbeat models point users to `isolatedSession` or `lightContext` instead of only compaction-buffer tuning. Fixes #67314. Thanks @Knightmare6890.
- Subagents/models: persist `sessions_spawn.model` and configured subagent models as child-session model overrides before the first turn, so spawned subagents actually run on the requested provider/model instead of reverting to the target agent default. Fixes #73180. Thanks @danielzinhu99.
- Channels/Telegram: keep webhook-mode local listeners alive and retry Telegram `setWebhook` registration after recoverable startup network failures, so transient Bot API timeouts no longer leave reverse proxies pointing at a closed listener. Fixes #71834. Thanks @jinon86.
- Agents/ACPX: bundle the Codex ACP adapter and launch it from the isolated `CODEX_HOME` wrapper before falling back to npm, so Codex ACP startup no longer depends on live `npx` resolution or the stale `@zed-industries/codex-acp@^0.11.1` range. Fixes #72037; refs #73202. Thanks @jasonftl, @sazora, and @joerod26.
- Agents/ACPX: register the embedded ACP backend at Gateway startup through a lightweight ACP backend SDK path and without importing the heavy ACPX runtime until an ACP session or explicit startup probe needs it, reducing baseline Gateway RSS. Thanks @vincentkoc.
- CLI/update: keep restart health polling when the restarted Gateway is reachable but has not reported its version yet, so macOS service restarts do not fail early with `actual unavailable`. Thanks @ProspectOre.
- Backup: skip installed plugin `extensions/*/node_modules` dependency trees while keeping plugin manifests and source files in archives, so local backups avoid rebuildable npm payload bloat. Fixes #64144. Thanks @BrilliantWang.
- Cron/models: fail isolated cron runs closed when an explicit `payload.model` is not allowed or cannot be resolved, so scheduled jobs do not silently fall back to an unrelated agent default or paid route before configured provider proxies such as LiteLLM can run. Fixes #73146. Thanks @oneandrewwang.
- Memory/QMD: back off repeated chat-turn QMD open failures while still letting memory status and CLI probes recheck immediately, so a broken sidecar dependency cannot trigger active-memory or cron retry storms. Fixes #73188 and #73176. Thanks @leonlushgit and @w3i-William.
- Talk Mode: resolve `messages.tts.providers.<id>.apiKey` through the active runtime snapshot for `talk.config`, so Talk overlays can discover SecretRef-backed speech providers without falling back to local speech. Fixes #73109. (#73111) Thanks @omarshahine.
- Memory/Ollama: resolve `memorySearch.provider` custom provider ids through their configured `models.providers.<id>.api` owner, so multi-GPU Ollama setups can dedicate embeddings to providers such as `ollama-5080` without losing the Ollama adapter or local auth semantics. Fixes #73150. Thanks @oneandrewwang.
- CLI/memory: skip eager context-window warmup for `openclaw memory` commands so memory search does not race unrelated model metadata discovery. Fixes #73123. Thanks @oalansilva and @neeravmakwana.
- CLI/Telegram: route Telegram `message send` and poll actions through the running Gateway when available, so packaged installs use the staged `grammy` runtime deps and CLI sends return instead of hanging after the Telegram channel is active. Fixes #73140. Thanks @oalansilva.
- Plugins/runtime deps: prepare staged bundled plugin dependencies before loading packaged public surfaces, so OpenClaw's Telegram runtime/test facade loads resolve `grammy` from the managed runtime-deps stage without copying dependencies into the global package root. Refs #73140. Thanks @oalansilva.
- Agents/exec: emit `(no output)` for silent exec update and node-host result blocks so Anthropic-compatible providers no longer reject empty tool-result text after quiet commands. Fixes #73117. Thanks @pfrederiksen and @Sanjays2402.
- Cron/providers: preflight local Ollama and OpenAI-compatible provider endpoints before isolated cron agent turns, record unreachable local providers as skipped runs, and cache dead-endpoint probes so many jobs do not hammer the same stopped local server. Fixes #58584. Thanks @jpeghead.
- Gateway/config: let config reload continue in degraded mode when invalidity is scoped to plugin entries, so incompatible plugin configs can be skipped and the Gateway restart can still pick up the rest of the config after rollbacks. Fixes #73131. Thanks @Adam-Researchh.
- Doctor/channels: suppress disabled bundled-plugin blocker warnings when a trusted external plugin owns the configured channel, so Lark/Feishu installs no longer get Feishu repair noise after switching to `openclaw-lark`. Fixes #56794. Thanks @wuji-tech-dev.
- CLI/status: show skipped fast-path memory checks as `not checked` and report active custom memory plugin runtime status from `status --json --all` without requiring built-in `agents.defaults.memorySearch`, so plugins such as memory-lancedb-pro and memory-cms no longer look unavailable when their own runtime is healthy. Fixes #56968. Thanks @Tony-ooo and @aderius.
- Gateway/channels: record and log unexpected clean channel monitor exits so channels that return without throwing no longer appear stopped with no error. Fixes #73099. Thanks @balaji1968-kingler.
- Discord/group chats: keep group/channel replies private by default unless the agent explicitly uses the message tool, so always-on rooms can lurk without leaking automatic final, block, preview, or status-reaction output; `messages.groupChat.visibleReplies: "automatic"` restores legacy auto-posting. (#73046) Thanks @scoootscooob.
- Plugins/package: force nested bundled-plugin runtime dependency installs out of inherited npm dry-run mode during prepack and package smoke checks, so packed installs materialize required plugin modules instead of reporting missing bundled files. Refs #73128. Thanks @Adam-Researchh.
- Discord: skip reaction events before REST channel fetch when notifications are off, guild reactions are disabled, or allowlist mode cannot match without channel overrides, reducing reconnect bursts that caused slow listener warnings. Fixes #73133. Thanks @isaacsummers.
- Channels/Telegram: centralize polling update tracking so accepted offsets remain durable across restarts, same-process handler failures can still retry, and slow offset writes cannot overwrite newer accepted watermarks. Refs #73115. Thanks @vdruts.
- Agents/models: classify empty, reasoning-only, and planning-only terminal agent runs before accepting a model fallback candidate, so invalid or incompatible models can advance to the next configured fallback instead of returning a 30-second terminal failure. Fixes #73115. Thanks @vdruts.
- Memory/LanceDB: let embedding config use provider-backed auth profiles, environment credentials, or provider config without a separate plugin `embedding.apiKey`, so OAuth-capable embedding providers can power auto-recall/capture. Fixes #68950. Thanks @malshaalan-ai.
- CLI/parents: invoking `openclaw <parent>` (memory, channels, plugins, approvals, devices, cron, mcp) without a subcommand now prints the parent's help and exits `0`, matching `<parent> --help` and the existing `agents` / `sessions` defaults so shell `&&` chains and pnpm wrappers no longer surface a misleading `ELIFECYCLE Command failed with exit code 1.` line. Fixes #73077. Thanks @hclsys.
- Plugins/hooks: time out never-settling `agent_end` observation hooks after 30 seconds and log the plugin failure, so hung embedding endpoints no longer leave memory capture silently pending forever. Fixes #65544. Thanks @ghoc0099.
- Gateway/config: serve runtime config schemas from the current plugin metadata snapshot and generated bundled channel schema metadata instead of rebuilding plugin channel config modules on every `config.get`/`config.schema`, preventing idle plugin-discovery CPU churn after upgrades. Fixes #73088. Thanks @sleitor and @geovansb.
- Memory/LanceDB: call OpenAI-compatible embedding endpoints through the raw SDK transport without sending `encoding_format`, then normalize float-array or base64 responses so providers such as ZhiPu and DashScope no longer fail recall with wrong vector dimensions or rejected parameters. Fixes #63655. Thanks @kinthaiofficial.
- Plugins/install: run dependency installs with npm error-level logging instead of silent mode so failed plugin or hook installs surface actionable npm errors such as EUNSUPPORTEDPROTOCOL instead of `npm install failed:` with no detail. (#73093) Thanks @sanctrl.
- Memory/LanceDB: bound memory recall embedding queries with a new `recallMaxChars` setting, prefer the latest user message over channel prompt metadata during auto-recall, and document the knob so small Ollama embedding models avoid context-length failures. Fixes #56780. Thanks @rungmc357 and @zak-collaborator.
- CLI/skills: resolve workspace-backed skills commands from `--agent`, then the current agent workspace, before falling back to the default agent, so multi-agent ClawHub installs, updates, and status checks stay scoped to the active workspace. Fixes #56161; carries forward #72726. Thanks @langbowang and @luyao618.
- Plugin SDK: fall back from partial bundled plugin directory overrides to package source public surfaces while preserving `OPENCLAW_DISABLE_BUNDLED_PLUGINS` as a hard disable. (#72817) Thanks @serkonyc.
- Agents/ACPX: stop forwarding Codex ACP timeout config controls that Codex rejects while preserving OpenClaw's run-timeout watchdog for ACP subagents. Fixes #73052. Thanks @pfrederiksen and @richa65.
- Memory Core: stream fallback vector search scoring with a bounded top-K result set so large indexes do not materialize every chunk embedding when sqlite-vec is unavailable. (#73069) Thanks @parkertoddbrooks.
- Memory Core: stream embedding-cache seeding during safe reindex so large local caches do not materialize every row into the V8 heap before the atomic rebuild. (#73067) Thanks @parkertoddbrooks.
- Memory/Ollama: add `memorySearch.remote.nonBatchConcurrency` for inline embedding indexing, default Ollama non-batch indexing to one request at a time, and keep batch concurrency separate from non-batch concurrency so local embedding backfills avoid timeout storms on smaller hosts. Carries forward #57733. Thanks @itilys.
- macOS app: update Peekaboo, ElevenLabsKit, and MLX TTS helper dependencies, make canvas file watching and config/exec-approval state writes reliable under concurrent app/test activity, and keep the app plus helper builds warning-free. Thanks @Blaizzy.
- iOS app: refresh SwiftPM/XcodeGen source hygiene, make app, extension, watch, and curated shared Swift files pass the prebuild SwiftFormat and SwiftLint checks, move relay registration off deprecated StoreKit receipt APIs, and keep simulator builds and logic tests warning-free. Thanks @ngutman.
- Agents/models: keep `models.json` readiness and provider-hook caches warm across repeated agent and subagent model resolution while preserving external `models.json` invalidation, reducing repeated provider-plugin loads on slower ARM64 hosts. Fixes #73075. Thanks @jochen.
- Docs/tools: clarify that `tools.profile: "messaging"` is intentionally narrow and that `tools.profile: "full"` is the unrestricted baseline for broader command/control access. Carries forward #39954. Thanks @posigit.
- Control UI/Agents: redact tool-call args, partial/final results, derived exec output, and configured custom secret patterns before streaming tool events to the Control UI, so tool output cannot expose provider or channel credentials. Fixes #72283. (#72319) Thanks @volcano303 and @BunsDev.
- Agents/sessions: keep `sessions_history` recall redaction enabled even when general log redaction is disabled, and clarify that safety-boundary UI/tool/diagnostic payloads still redact independently of `logging.redactSensitive`. Carries forward #72319. Thanks @volcano303 and @BunsDev.
- Providers/Codex: pass agent and workspace directories into provider stream wrappers so Codex native `web_search` activation can evaluate the correct auth context, and smoke-test the built status-message runtime by resolving the emitted bundle name. Carries forward #67843; refs #65909. Thanks @neilofneils404.
- Cron/models: keep `payload.model` as a per-job primary that can use configured fallbacks, while still letting `payload.fallbacks: []` make cron runs strict and avoid hidden agent-primary retries. Refs #73023. Thanks @pavelyortho-cyber.
- Models/fallbacks: treat user-selected session models as exact choices, so `/model ollama/...` and model-picker switches fail visibly when the selected provider is unreachable instead of answering from an unrelated configured fallback. Fixes #73023. Thanks @pavelyortho-cyber.
- Codex harness: keep ChatGPT subscription app-server runs from inheriting `CODEX_API_KEY` or `OPENAI_API_KEY`, and fall back to `CODEX_API_KEY` / `OPENAI_API_KEY` app-server login only when no Codex account is available. Fixes #73057. Thanks @holgergruenhagen and @pashpashpash.
- CLI/model probes: fail local `infer model run` probes when the provider returns no text output, so unreachable local providers and empty completions no longer look like successful smoke tests. Refs #73023. Thanks @pavelyortho-cyber.
- CLI/Ollama: run local `infer model run` through the lean provider completion path and skip global model discovery for one-shot local probes, so Ollama smoke tests no longer pay full chat-agent/tool startup cost or hang before the native `/api/chat` request. Fixes #72851. Thanks @TotalRes2020.
- Doctor/gateway services: ignore launchd/systemd companion services that only reference the gateway as a dependency, suppress inactive Linux extra-service warnings, and avoid rewriting a running systemd gateway command/entrypoint during doctor repair. Carries forward #39118. Thanks @therk.
- Daemon/service: only emit hard-coded version-manager paths such as `~/.volta/bin`, `~/.asdf/shims`, `~/.bun/bin`, and fnm/pnpm fallbacks into gateway and node service PATHs when the directories exist, so `openclaw doctor` no longer flags `gateway.path.non-minimal` against a PATH the daemon just wrote. Env-driven roots and stable user-bin dirs remain unconditional. Fixes #71944; carries forward #71964. Thanks @Sanjays2402.
- CLI/startup: disable Node's module compile cache automatically for live source-checkout launchers so in-place `pnpm build` updates are visible to the next `openclaw` CLI invocation. Fixes #73037. Thanks @LouisGameDev.
- Agents/group chat: keep silent-allowed empty and reasoning-only turns on the `NO_REPLY` path without injecting visible-answer retry prompts, and clarify the group prompt so agents use the exact silent token instead of prose. Thanks @vincentkoc.
- Agents/group chat: move `NO_REPLY` mechanics into channel-aware direct/group prompts and suppress the duplicate generic silent-reply section for auto-reply runs, so always-on group agents get one consistent stay-silent instruction. Thanks @vincentkoc.
- Providers/OpenAI: preserve encrypted empty-summary Responses reasoning items in WebSocket replay and request `reasoning.encrypted_content` on reasoning turns so GPT-5.4/GPT-5.5 sessions do not lose required `rs_*` state beside `msg_*` items. Fixes #73053. Thanks @odb36777.
- Gateway/startup: treat `plugins.enabled=false` as an early plugin fast path, skipping plugin auto-enable discovery, gateway plugin lookup/runtime-dependency staging, and stale-plugin cleanup warnings while preserving channel blocker warnings. (#73041) Thanks @WuKongAI-CMU.
- Channels/commands: make generated `/dock-*` commands switch the active session reply route through `session.identityLinks` instead of falling through to normal chat. Fixes #69206; carries forward #73033. Thanks @clawbones and @michaelatamuk.
- Providers/Cloudflare AI Gateway: strip assistant prefill turns from Anthropic Messages payloads when thinking is enabled, so Claude requests through Cloudflare AI Gateway no longer fail Anthropic conversation-ending validation. Fixes #72905; carries forward #73005. Thanks @AaronFaby and @sahilsatralkar.
- Gateway/startup: keep primary-model startup prewarm on scoped metadata preparation, let native approval bootstraps retry outside channel startup, and skip the global hook runner when no `gateway_start` hook is registered, so clean post-ready sidecar work stays off the critical path. Refs #72846. Thanks @RayWoo, @livekm0309, and @mrz1836.
- Gateway/channels: start bundled channel accounts with a lightweight `runtimeContexts` surface instead of importing the full reply/routing/session channel runtime before `startAccount`, so Discord, Telegram, Slack, Matrix, and QQBot startup no longer block on unrelated channel helper graphs. Refs #72846 and #72960. Thanks @mrz1836, @RayWoo, and @rollingshmily.
- Gateway/supervisor: exit cleanly when a supervised restart finds an existing healthy gateway and bound retries when the existing gateway stays unhealthy, so stale lock contention cannot loop indefinitely. Refs #72846. Thanks @azgardtek.
- Gateway/startup: scope primary-model provider discovery during channel prewarm to the configured provider owner and add split startup trace timings, so boot avoids staging unrelated bundled provider dependencies while setup discovery remains broad. Fixes #73002. Thanks @Schnup03.
- Plugins/runtime deps: declare retained staged bundled plugin dependencies in the npm staging manifest while installing only newly missing packages, so Gateway restarts avoid reinstalling the full retained dependency set when one runtime dependency is absent. Fixes #73055. Thanks @GCorp2026.
- CLI/status: keep default `openclaw status` off the heavyweight security audit, plugin compatibility, and memory-vector probes while still showing configured Telegram channels through setup metadata, so routine health checks stay fast and no longer render an empty Channels table. Fixes #72993. Thanks @comick1.
- Channels/Telegram: send a best-effort native typing cue immediately after an inbound message is accepted, so slow pre-dispatch turns show Telegram liveness before queueing, compaction, model, or tool work starts. Fixes #63759. Thanks @alessandropcostabr.
- Channels/Telegram: stop native approval startup auth failures from retrying every second, while still waiting through retryable Gateway auth handoffs, so Telegram approval setup problems no longer create a reconnect/log loop during channel startup. Refs #72846 and #72867. Thanks @kiranvk-2011 and @porly1985.
- Channels/Microsoft Teams: unwrap staged CommonJS JWT runtime dependencies before Bot Connector token validation so inbound Teams messages no longer 401 after the bundled runtime-deps move. Fixes #73026 and #73167. Thanks @kbrown10000 and @mikelavrik.
- Gateway/auth: allow local direct callers in trusted-proxy mode to use the configured gateway password as an internal fallback while keeping token fallback rejected. Fixes #17761. Thanks @dashed, @vincentkoc, and @jetd1.
- Gateway/auth: add explicit `trustedProxy.allowLoopback` support for same-host loopback reverse proxies while keeping loopback trusted-proxy auth fail-closed by default and preserving required-header and allowlist checks. Fixes #59167; carries forward #63379. Thanks @Matir, @jeremyakers, and @mrosmarin.
- Channels/sessions: prevent guarded inbound session recording from creating route-only phantom sessions while still allowing last-route updates for sessions that already exist. Carries forward #73009. Thanks @jzakirov.
- Cron: accept `delivery.threadId` in Gateway cron add/update schemas so scheduled announce delivery can target Telegram forum topics and other threaded channel destinations through the documented delivery path. Fixes #73017. Thanks @coachsootz.
- Plugins/runtime deps: stage bundled plugin dependencies imported by mirrored root dist chunks, so packaged memory and status commands do not miss `chokidar` or similar root-chunk dependencies after update. Fixes #72882 and #72970; carries forward #72992. Thanks @shrimpy8, @colin-chang, and @Schnup03.
- Plugins/runtime deps: reuse unchanged bundled plugin runtime mirrors instead of rebuilding plugin trees on every load, cutting avoidable writes and restart/reconnect I/O on slow storage. Fixes #72933. Thanks @jasonftl.
- Agents/runtime context: deliver hidden runtime context through prompt-local system context while keeping the transcript-only custom entry out of provider user turns, and strip stale copied runtime-context prefaces from user-facing replies. Fixes #72386; carries forward #72969. Thanks @jhsmith409.
- Channels/Telegram: skip the optional webhook-info API call during polling-mode status checks and startup bot-label probes so long-polling setups avoid an unnecessary Telegram round trip. Carries forward #72990. Thanks @danielgruneberg.
- CLI/message: resolve targeted `openclaw message` channels to their owning plugin before loading the registry, and fall back to configured channel plugins when the channel must be inferred, so scripted sends avoid full bundled plugin registry scans without assuming channel ids match plugin ids. Fixes #73006. Thanks @jasonftl.
- Plugins/startup: parse strict JSON plugin manifests with native JSON first and keep JSON5 as the compatibility fallback, reducing manifest registry CPU during Gateway boot and CLI startup. Fixes #73011. Thanks @jasonftl.
- CLI/models: keep route-first `models status --json` stdout reserved for the JSON payload by routing auth-profile and startup diagnostics to stderr. Fixes #72962. Thanks @vishutdhar.
- Gateway/runtime: keep dirty-tree status calls from rebuilding live `dist`, clear stale task and restart state across in-process restarts, retry transient Discord lazy imports, and let channel startup continue after slow model warmup so browser, Discord, and voice-call sidecars come online. Thanks @vincentkoc.
- Security/CodeQL: replace file SecretRef id gateway schema regex validation with segment-aligned predicates and set empty permissions on release summary/backfill jobs so the narrowed CodeQL profile stays clean. Thanks @vincentkoc.
- Sessions: ignore future-dated session activity timestamps during reset freshness checks and cap future `updatedAt` values at the merge boundary so clock-skewed messages cannot keep stale sessions alive forever. Fixes #72989. Thanks @martingarramon.
- Sessions: apply search, activity filters, and limits before gateway row enrichment so bounded session lists avoid scanning discarded transcripts. Carries forward #72978. Thanks @yeager.
- Sessions: remove trajectory runtime and pointer sidecars when session maintenance prunes, caps, or disk-evicts their owning session, while preserving sidecars still referenced by live rows. Fixes #73000. Thanks @jared-rebel.
- Plugins/CLI: allow managed plugin installs when the active extensions root is a symlink to a real state directory, while keeping nested target symlinks blocked and suppressing misleading hook-pack fallback errors for install-boundary failures. Fixes #72946. Thanks @mayank6136.
- Providers/Ollama: mark discovered Ollama catalog models as supporting streaming usage metadata so token accounting stays enabled for local models. (#72976) Thanks @sdeyang.
- Media understanding: reject malformed MIME values with trailing junk while preserving standard parameter tails before enrichment uses them. (#72914) Thanks @volcano303.
- WebChat: keep bare `/new` and `/reset` prompts from producing empty transcript text by inserting the hidden session marker when the visible tail is blank. (#72863) Thanks @mahopan.
- CLI/update: explain completion-cache refresh timeouts with manual refresh guidance instead of surfacing a raw low-level timeout. Fixes #72842. (#72850) Thanks @iot2edge.
- Memory-core/dreaming: give narrative generation a 60-second timeout so slower local or remote models can finish instead of timing out at 15 seconds. Fixes #72837. (#72852) Thanks @RayWoo.
- Plugins/hooks: inject each plugin's resolved config into internal hook event context without mutating the shared event object. (#72888) Thanks @jalapeno777.
- Agents/ACP: pass the resolved ACP agent directory into media understanding so per-agent media caches and config are used for ACP-dispatched image turns. (#72832) Thanks @luyao618.
- Gateway/Bonjour: truncate mDNS service names and host labels to the 63-byte DNS label limit at valid UTF-8 boundaries. (#72809) Thanks @luyao618.
- Feishu: treat groups explicitly configured under channels.feishu.groups as admitted even when groupAllowFrom is empty, while preserving groupPolicy: "disabled" as a hard group block and keeping groups.\* wildcard defaults non-admitting. Fixes #67687. (#72789) Thanks @MoerAI.
- Gateway/startup: keep hot Gateway boot paths on leaf config imports and add max-RSS reporting to the gateway startup bench so low-memory startup regressions are visible before release. Thanks @vincentkoc.
- WebChat: read `chat.history` from active transcript branches, drop stale streamed assistant tails once final history catches up, and coalesce duplicate in-flight Control UI submits, so rewritten prompts, completed replies, and rapid send events no longer render or process twice. Fixes #72975, #72963, and #72974. Thanks @dmagdici, @lhtpluto, and @Benjamin5281999.
- WebChat/TTS: persist automatic final-mode TTS audio as a supplemental audio-only transcript update instead of adding a second assistant message with the same visible text. Fixes #72830. Thanks @lhtpluto.
- Agents/LSP: terminate bundled stdio LSP process trees during runtime disposal and Gateway shutdown, so nested children such as `tsserver` do not survive stop or restart. Fixes #72357. Thanks @ai-hpc and @bittoby.
- Diagnostics/OTEL: capture privacy-safe model-call request payload bytes, streamed response bytes, first-response latency, and total duration in diagnostic events, plugin hooks, stability snapshots, and OTEL model-call spans/metrics without logging raw model content. Fixes #33832. Thanks @wwh830.
- Logging: write validated diagnostic trace context as top-level `traceId`, `spanId`, `parentSpanId`, and `traceFlags` fields in file-log JSONL records so traced requests and model calls are easier to correlate in log processors. Refs #40353. Thanks @liangruochong44-ui.
- Logging/sessions: apply configured redaction patterns to persisted session transcript text and accept escaped character classes in safe custom redaction regexes, so transcript JSONL no longer keeps matching sensitive text in the clear. Fixes #42982. Thanks @panpan0000.
- Providers/Ollama: honor `/api/show` capabilities when registering local models so non-tool Ollama models no longer receive the agent tool surface, and keep native Ollama thinking opt-in instead of enabling it by default. Fixes #64710 and duplicate #65343. Thanks @yuan-b, @netherby, @xilopaint, and @Diyforfun2026.
- Control UI/Agents: remount the Overview model controls when switching agents so the primary-model picker cannot retain stale per-agent selection. Fixes #39392; carries forward #39401, notes the duplicate #39495 approach, and keeps #46275/#54724 broader stabilization out of scope. Thanks @daijunyi002, @SergioChan, @aworki, and @wsyjh8.
- Auto-reply: poison inbound message dedupe after replay-unsafe provider/runtime failures so retries stay safe before visible progress but cannot duplicate messages after block output, tool side effects, or session progress. Fixes #69303; keeps #58549 and #64606 as duplicate validation. Thanks @martingarramon, @NikolaFC, and @zeroth-blip.
- Agents/model fallback: jump directly to a known later live-session model redirect instead of walking unrelated fallback candidates, while preserving the already-landed live-session/fallback loop guard. Fixes #57471; related loop family already closed via #58496. Thanks @yuxiaoyang2007-prog.
- Gateway/Bonjour: keep @homebridge/ciao cancellation handlers registered across advertiser restarts so late probing cancellations cannot crash Linux and other mDNS-churned gateways. Thanks @vincentkoc.
- Plugins/startup: load the default `memory-core` slot during Gateway startup when permitted so active-memory recall can call `memory_search` and `memory_get` without requiring an explicit `plugins.slots.memory` entry, while preserving `plugins.slots.memory: "none"`. Thanks @vincentkoc.
- Gateway/plugins: resolve `gateway_start` cron hooks from live Gateway runtime state before the legacy deps fallback, so memory-core dreaming cron reconciliation keeps working on installs where `deps.cron` is not populated during service startup. Fixes #72835. Thanks @RayWoo.
- Plugins/CLI: prefer native require for compiled bundled plugin JavaScript before jiti so read-only config, status, device, and node commands avoid unnecessary transform overhead on slow hosts. Fixes #62842. Thanks @Effet.
- Plugins/compat: inventory doctor-side deprecation migrations separately from runtime plugin compatibility so release sweeps preserve needed repairs while enforcing dated removal windows. Thanks @vincentkoc.
- Plugins/compat: add missing dated compatibility records for legacy extension-api, memory registration, provider hook/type aliases, runtime aliases, channel SDK helpers, and approval/test utility shims. Thanks @vincentkoc.
- Plugins/CLI: refresh the persisted registry after managed plugin files are removed so ClawHub uninstall cannot leave stale `plugins list` entries. Thanks @vincentkoc.
- Plugins/CLI: make plugin install and uninstall config writes conflict-aware, clear stale denylist entries on explicit reinstall/removal, and delete managed plugin files only after config/index commit succeeds. Thanks @vincentkoc.
- Plugins: fail `plugins update` when tracked plugin or hook updates error, keep bundled runtime-dependency repair behind restrictive allowlists, and reject package installs with unloadable extension entries. Thanks @vincentkoc.
- WebChat/Control UI: support non-video file attachments in chat uploads while preserving the existing image attachment path and MIME-sniff fallback for generic image uploads. (#70947) Thanks @IAMSamuelRodda.
- Skills/memory: restore Chokidar v5 hot reloads by watching concrete skill and memory roots with filters, including SKILL.md removals and deleted skill folders without broad workspace recursion. Fixes #27404, #33585, and #41606. Thanks @shelvenzhou, @08820048, and @rocke2020.
- Gateway/chat: keep duplicate attachment-backed `chat.send` retries with the same idempotency key on the documented in-flight path so aborts still target the real active run. Fixes #70139. Thanks @Feelw00.
- Gateway/chat: preserve repeated boundary characters while merging assistant chat stream deltas, including repeated digits, CJK characters, and markdown/table tokens. Fixes #63769; carries forward #63994 and #65457. Thanks @yon950905 and @mohuaxiao.
- Plugins: share package entrypoint resolution between install and discovery, reject mismatched `runtimeExtensions`, and cache bundled runtime-dependency manifest reads during scans. Thanks @vincentkoc.
- WhatsApp/Web: keep quiet but healthy linked-device sessions connected by basing the watchdog on WhatsApp Web transport activity, while retaining a longer app-silence cap so frame activity cannot mask a stuck session forever. Fixes #70678; carries forward the focused #71466 approach and keeps #63939 as related configurable-timeout follow-up. Thanks @vincentkoc and @oromeis.
- Discord/gateway: count failed health-monitor restart attempts toward cooldown and hourly caps, and evict stale account lifecycle state during channel reloads so repeated Discord gateway recovery cannot loop on old status. Fixes #38596. (#40413) Thanks @jellyAI-dev and @vashquez.
- TTS/BlueBubbles: pre-transcode synthesized MP3 audio to opus-in-CAF (mono, 24 kHz — validated against macOS 15.x Messages.app's native voice-memo CAF descriptor) on macOS hosts before handing the file to BlueBubbles, so iMessage renders the result as a native voice-memo bubble with proper duration and waveform UI instead of a plain file attachment. Adds an opt-in `tts.voice.preferAudioFileFormat` channel capability and a magic-byte sniff for the CAF container so the host-local-media validator (which uses `file-type` and didn't recognize CAF natively) can verify the pre-transcoded buffer. Channels that don't opt in are unaffected. (#72586) Fixes #72506. Thanks @omarshahine.
- Feishu: retry WebSocket startup failures with monitor-owned backoff while preserving SDK-local heartbeat defaults, so persistent-connection startup failures no longer leave the monitor hung. Fixes #68766; related #42354 and #55532. Thanks @alex-xuweilong, @120106835, @sirfengyu, and @tianhaocui.
- Cron: normalize isolated job tool allowlists before granting the narrow self-removal cron tool path, keeping scheduled jobs aligned with shared tool policy normalization. (#73028) Thanks @jalehman.

## 🚀 v2026.4.26 Unreleased

### 🐛 问题修复

- Gateway/Bonjour：通过作用域进程处理程序抑制已知的 @homebridge/ciao 取消和网络断言失败，使格式错误的 mDNS 数据包或受限的 VPS 网络禁用/重启 Bonjour 而不是导致网关崩溃。修复 #67578。感谢 @zenassist26-create。
- Discord：当 elevated 模式自动解析请求时，对已解决执行审批按钮的后续点击保持静默，同时仍然显示真正的审批提交失败。修复 #66906。感谢 @rlerikse。

## 🚀 v2026.4.25 (2026年4月26日)

### 亮点

- 语音回复获得全面TTS升级：`/tts latest`、会话级别的自动TTS控制、语音人格、按代理/账户覆盖，以及新增Azure Speech、Xiaomi、Local CLI、Inworld、Volcengine和ElevenLabs v3提供商支持。感谢 @leonchui、@zoujiejun、@solar2ain、@cshape、@xuruiray、@itsuzef 和 @barronlroth。
- 插件启动和安装路径移至冷持久化注册表，减少广泛的清单扫描，同时使插件更新、修复、提供商发现和安装元数据更具确定性。感谢 @vincentkoc 和 @shakkernerd。
- OpenTelemetry覆盖扩展到模型调用、token使用、工具循环、harness运行、exec进程、出站传递、上下文组装和内存压力，提供有限低基数属性。感谢 @vincentkoc、@jlapenna、@Lidang-Jiang 和 @oc-factus。
- 浏览器自动化获得更安全的标签页URL、支持iframe的角色快照、CDP就绪调优、无头一次性启动，以及针对慢速主机的更深层浏览器诊断探测。感谢 @beat843796 和 @BenediktSchackenberg。
- 控制UI和设置流程添加PWA/Web Push支持、Crestodian首次运行修复、TUI设置、上下文模式选择和更短的启动问候语。感谢 @eduardocruz、@SebTardif 和 @kevinlin-openai。
- 安装/更新加固覆盖Windows、macOS、Linux、Docker、捆绑插件运行时依赖、Node服务重启、LaunchAgent令牌轮换和混合版本网关验证。感谢 @Kobevictor、@igormf、@abhinas90、@jsompis、@Solvely-Colin 和 @gucasbrg。

### ✨ 新增功能与改进

- TTS/WhatsApp：添加 `/tts latest` 朗读支持，带重复抑制和 `/tts chat on|off|default` 会话级自动TTS覆盖，完成当前聊天回复的点播语音笔记UX。修复 #66032。
- TTS/channels：通用解析渠道和账户TTS覆盖，使飞书和QQBot账户能够深度合并 `channels.<channel>.accounts.<id>.tts` 配置，覆盖全局和按代理的TTS设置。感谢 @sahilsatralkar。
- TTS/agents：允许 `agents.list[].tts` 覆盖全局 `messages.tts` 以实现按代理语音，并让 `/tts audio`、`/tts status` 和 `tts` 代理工具遵循活动语音/提供商覆盖，同时在现有TTS配置面上保留共享提供商凭证和偏好。
- Providers/Azure Speech：添加Azure Speech作为捆绑TTS提供商，支持Speech资源认证、语音列表、SSML转义、原生Ogg/Opus语音笔记输出和电话输出。（#51776）感谢 @leonchui。
- Google Meet：添加日历支持的出席导出工作流、导出清单、空运行预览和会议记录工具对等。
- Control UI：添加PWA安装支持和网关聊天的Web Push通知。（#44590）感谢 @eduardocruz。
- 浏览器自动化：在代理响应中添加安全标签页URL，以及带iframe感知引用的CDP原生角色快照回退、光标可点击检测、目标附加准备和 `openclaw browser doctor --deep` 实时快照探测。
- CLI/图像生成：在 `openclaw infer image generate` 和 `openclaw infer image edit` 上公开通用 `--background`，保留 `--openai-background` 作为OpenAI别名，并让fal图像生成支持 `--output-format png|jpeg`。
- Browser/config：允许本地托管Chrome启动发现和后启动CDP就绪超时针对慢速主机（如Raspberry Pi）提高。修复 #66803。感谢 @beat843796。
- Discord：允许 `channels.discord.voice.model` 覆盖用于语音频道响应的LLM，同时保持STT和TTS在其现有媒体设置上。（#64368）感谢 @mrdavey。
- Browser/CLI：添加 `openclaw browser start --headless` 作为一次性本地托管浏览器启动覆盖，无需重写持久化浏览器配置。感谢 @BenediktSchackenberg。
- CLI/Crestodian/TUI：添加首次运行设置助手、本地规划器回退、全TUI交互式Crestodian、启动进度指示器、上下文模式选择器和更短的启动问候语。（#71720、#71760）感谢 @SebTardif 和 @kevinlin-openai。
- Plugins：软件包安装/更新期间自动迁移本地插件注册表，将安装元数据保存在插件索引中，同时为新的冷注册表路径索引现有插件清单。感谢 @vincentkoc 和 @shakkernerd。
- Plugins/doctor：使 `openclaw doctor --fix` 在需要时刷新插件索引和冷注册表索引，不将插件安装记录视为已编写配置。感谢 @vincentkoc 和 @shakkernerd。
- Plugins/hooks：添加 before-agent-finalize hooks、cron `jobId` hook上下文、有界原生权限指纹和Codex MCP hook中继支持。（#71765、#71758、#71707）感谢 @vincentkoc 和 @pashpashpash。
- Plugins/tokenjuice：将捆绑的tokenjuice运行时升级到0.6.3。感谢 @vincentkoc。
- Diagnostics/OTEL：将模型调用GenAI span属性与OpenTelemetry稳定性opt-in语义对齐，默认保留遗留 `gen_ai.system`，同时在 `OTEL_SEMCONV_STABILITY_OPT_IN=gen_ai_latest_experimental` 下发出 `gen_ai.provider.name`。感谢 @vincentkoc。
- Diagnostics/OTEL：支持通过配置或标准OTEL环境变量对traces、metrics和logs进行信号特定的OTLP端点覆盖。感谢 @vincentkoc。
- Diagnostics/OTEL：在启动和日志导出失败时发出有界遥测导出器健康诊断，不导出原始错误文本。感谢 @vincentkoc。
- Diagnostics/OTEL：将代理harness生命周期遥测导出为有界 `openclaw.harness.run` spans和 `openclaw.harness.duration_ms` metrics，使QA实验室、Codex和未来harness共享一种trace形状。感谢 @vincentkoc。
- Diagnostics/trace：从可信模型调用trace上下文传播W3C `traceparent`头到提供商传输，同时替换调用者提供的traceparent值。感谢 @vincentkoc。
- Diagnostics/Prometheus：添加捆绑的 `diagnostics-prometheus` 插件，带受保护的网关抓取路由用于低基数诊断metrics。感谢 @vincentkoc。
- Plugins/CLI：添加 `openclaw plugins registry` 用于显式持久化注册表检查和 `--refresh` 修复，不会在正常启动时重新扫描插件位置。感谢 @vincentkoc。
- Plugins/CLI：使 `openclaw plugins list` 默认读取冷持久化注册表快照，将模块感知诊断留给 `plugins doctor` 和 `plugins inspect`。感谢 @vincentkoc。
- Plugins/启动：将网关启动插件规划移至版本化冷注册表索引，并为早于启动元数据的旧注册表文件提供安装后修复。感谢 @vincentkoc。
- Plugins/启动：通过注册表别名规范化启动和提供商插件启用，使引导路径不需要遗留清单别名扫描。感谢 @vincentkoc。
- Providers/plugins：从冷插件注册表解析提供商所有权、提供商发现范围和目录hook提供商ID，而不是在这些路径上重新扫描清单。感谢 @vincentkoc。
- Plugins/registry：让已安装插件索引记录专注于安装/状态/加载路径，并从索引插件范围内的清单解析插件能力。感谢 @shakkernerd。
- Plugins/registry：通过已安装插件索引路由冷清单和能力查找，使设置、渠道、配置、secrets、doctor和提供商元数据路径在运行时执行前避免广泛的插件根扫描。感谢 @shakkernerd。
- CLI/models：通过已安装插件索引加载目录行，加快静态清单支持的提供商的 `models list --all --provider <id>`，而不是广泛清单扫描或运行时抑制hooks。感谢 @shakkernerd。
- CLI/models：使用OpenClaw Provider Index预览行作为可安装提供商的最终冷回退，同时在提供商索引元数据之上保持用户配置、已安装清单和刷新缓存行。感谢 @vincentkoc。
- Providers/plugins：保持 onboarding 和 auth-choice 设置列表基于冷清单/安装元数据，并为尚未安装的提供商插件添加Provider Index安装元数据。感谢 @vincentkoc。
- Providers/plugins：基于冷清单元数据保持提供商设置指导和配置auth导入，对静态提供商运行时导入设置/配置列表路径进行回归保护。感谢 @vincentkoc。
- CLI/capabilities：保持能力命令注册，直到 `model auth login` 实际运行才导入models auth运行时。感谢 @vincentkoc。
- CLI/configure：保持web-search配置提示基于冷插件注册表元数据，直到用户选择托管搜索设置。感谢 @vincentkoc。
- Plugins/聊天命令：在 `/plugins enable` 和 `/plugins disable` 后刷新持久化插件注册表，与CLI变更路径匹配。感谢 @vincentkoc。
- Plugins/兼容：将 `OPENCLAW_DISABLE_PERSISTED_PLUGIN_REGISTRY` 标记为已弃用的紧急开关，引导操作员使用注册表修复。感谢 @vincentkoc。
- Plugins/兼容：扩展中心兼容性注册表，添加日期所有者、替换项和最长三个月移除目标，用于遗留SDK、清单、设置、注册表迁移和代理运行时面。感谢 @vincentkoc。
- Plugins/registry：当插件策略不再匹配当前配置时忽略过时的持久化注册表读取，并在生成的注册表文件中标注请勿编辑警告。感谢 @vincentkoc。
- Config/plugins：保持插件命令别名验证基于冷清单元数据，而不是导入运行时别名解析器。感谢 @vincentkoc。
- Security/plugins：保持web-search凭证存在检查基于冷配置、环境和清单元数据，而不是导入web-search提供商运行时。感谢 @vincentkoc。
- Diagnostics/OTEL：将提供商请求标识符作为有界哈希显示在模型调用诊断和span事件上，不导出原始请求ID或metrics标签。感谢 @Lidang-Jiang 和 @vincentkoc。
- Plugins/诊断：添加仅元数据的 `model_call_started` 和 `model_call_ended` hooks，用于提供商/模型调用遥测，不暴露prompts、响应、头、请求体或原始提供商请求ID。感谢 @vincentkoc。
- Diagnostics/OTEL：发出有界上下文组装诊断并导出 `openclaw.context.assembled` spans，包含prompt/历史大小，但不包含prompt、历史、响应或会话密钥内容。感谢 @vincentkoc。
- Diagnostics/OTEL：将现有工具循环诊断导出为 `openclaw.tool.loop` 计数器和spans，不包含循环消息、会话标识符、参数或工具输出。感谢 @vincentkoc。
- Diagnostics/OTEL：导出诊断内存样本和压力为有界内存直方图、计数器和压力spans，帮助发现泄漏回归，不包含会话或有效载荷数据。感谢 @vincentkoc。
- Diagnostics/OTEL：添加GenAI `gen_ai.client.token.usage` 直方图用于输入/输出模型使用，同时将会话标识符和聚合缓存计数器排除在语义metric之外。感谢 @vincentkoc。
- Diagnostics/OTEL：添加有界 `openclaw.agent` 标签到OpenClaw token metrics，使per-agent Grafana仪表板可以分组使用，而不导出会话标识符。感谢 @oc-factus。
- Plugins/安装：将托管插件安装元数据合并到状态管理的插件索引 `plugins/installs.json`，替换临时 `plugins/installed-index.json` 路径，并移除 `plugins.installs` 作为已编写配置面。感谢 @vincentkoc 和 @shakkernerd。
- Diagnostics/OTEL：添加GenAI `gen_ai.client.operation.duration` 直方图用于模型调用延迟（秒），包含有界provider/model/API和错误属性。感谢 @vincentkoc。
- Diagnostics/OTEL：将GenAI使用token属性添加到模型使用spans，包括缓存读取/写入输入token计数，但不包含会话标识符或prompt/响应内容。感谢 @vincentkoc。
- Diagnostics/OTEL：在模型使用spans上包含有界GenAI操作、提供商和请求模型属性，使token使用保持自描述而不包含诊断标识符。感谢 @vincentkoc。
- Diagnostics/OTEL：保持模型使用span GenAI提供商属性与现有语义约定opt-in策略对齐，除非启用最新实验性GenAI约定，否则使用遗留 `gen_ai.system`。感谢 @vincentkoc。
- Diagnostics/OTEL：保持 `gen_ai.request.model` 存在于GenAI token使用metrics中，当模型使用事件不包含模型时使用有界 `unknown` 回退。感谢 @vincentkoc。
- Docs/OTEL：记录GenAI token和模型调用持续时间metrics、模型使用span属性以及 `OTEL_SEMCONV_STABILITY_OPT_IN=gen_ai_latest_experimental` 提供商属性行为。感谢 @vincentkoc。
- Docs：刷新MCP、模型提供商、doctor、故障排除、BlueBubbles、媒体生成、TTS、子代理、skills、cron/任务、exec审批和语音通话指南，包含结构化步骤、标签页和折叠内容。
- Diagnostics/trace：添加内部traceparent传播辅助函数，仅格式化可信调度程序元数据，默认将插件发出的诊断traces排除在出站传播之外。感谢 @vincentkoc。
- Diagnostics/OTEL：添加有界出站消息传递生命周期诊断并将其导出为低基数传递spans/metrics，不包含消息体、收件人、房间或媒体路径数据。（#71471）感谢 @vincentkoc 和 @jlapenna。
- Diagnostics/OTEL：发出有界exec进程诊断并将其导出为 `openclaw.exec` spans，不暴露命令文本、工作目录或容器标识符。（#71451）感谢 @vincentkoc 和 @jlapenna。
- Diagnostics/OTEL：支持 `OPENCLAW_OTEL_PRELOADED=1`，以便插件可以重用已注册的OpenTelemetry SDK，同时保持OpenClaw诊断监听器连接。（#71450）感谢 @vincentkoc 和 @jlapenna。
- Providers/Xiaomi：添加MiMo TTS作为捆绑语音提供商，支持MP3/WAV输出和语音笔记Opus转码。修复 #52376。（#55614）感谢 @zoujiejun。
- Providers/ElevenLabs：在捆绑TTS模型目录中包含 `eleven_v3`，以便模型选择界面可以提供ElevenLabs v3。（#68321）感谢 @itsuzef。
- Providers/Local CLI TTS：添加捆绑的本地命令语音提供商，支持文件/stdout输入、语音笔记Opus转换和电话PCM输出。（#56239）感谢 @solar2ain。
- Providers/Inworld：添加Inworld作为捆绑语音提供商，支持流式TTS合成、语音列表、语音笔记输出和PCM电话输出。（#55972）感谢 @cshape。
- Providers/Volcengine：添加Volcengine/BytePlus Seed Speech作为捆绑TTS提供商，支持API密钥认证、原生Ogg/Opus语音笔记输出和MP3音频文件输出。（#55641）感谢 @xuruiray。
- Android/对话模式：在语音标签页中公开对话模式，提供运行时拥有的语音捕获模式和麦克风前台服务升级。感谢 @alex-latitude。
- Providers/LiteLLM：注册 `litellm` 作为图像生成提供商，以便 `image_generate model=litellm/...` 调用和 `agents.defaults.imageGenerationModel.fallbacks` 条目通过LiteLLM代理解析。感谢 @zqchris。
- Providers/fal：添加Seedance 2.0参考转视频模型，支持多图像、视频和音频参考输入映射，以及 `video_generate` 的模型特定能力限制。感谢 @shivanker。
- Codex harness：要求Codex app-server `0.125.0` 或更高版本，并通过OpenClaw hook中继覆盖原生MCP `PreToolUse`、`PostToolUse` 和 `PermissionRequest` 有效载荷。
- Agents/Codex：教prompts和 `agents_list` 显示原生Codex app-server可用性，使代理优先使用 `/codex ...` 而不是Codex ACP，除非明确指定ACP/acpx。感谢 @vincentkoc。
- ACPX/Droid：在实时ACP绑定Docker矩阵中添加Factory Droid，包括 `.factory` 设置暂存、`FACTORY_API_KEY` 转发和单代理 `test:docker:live-acp-bind:droid` 配方。
- TTS/personas：添加提供商感知的TTS人格，具有确定性提供商绑定合并、`/tts persona` 控制、网关/CLI人格状态、Google Gemini `audio-profile-v1` prompt包装和OpenAI指令映射。（#70748）感谢 @barronlroth。
- 语音唤醒：添加基于触发器的路由，使macOS语音唤醒短语可以选择的配置代理或会话目标，具有网关路由API和节点更新事件。（#30354）感谢 @longbiaochen。

### 🐛 问题修复

- Agents/子代理：通过直接回退将已完成的yielded子代理结果传回无线程请求者路由，当休眠父公告轮次产生无可见回复时，并添加该回归的QA-lab覆盖。感谢 @vincentkoc。
- Gateway/Tailscale：让带有浏览器设备身份的Tailscale认证Control UI操作员会话跳过设备配对往返，同时仍拒绝无设备和节点角色连接。引用 #71986。感谢 @jokedul。
- Doctor：遵守 `OPENCLAW_SERVICE_REPAIR_POLICY=external`，报告网关服务健康状况，同时跳过外部管理环境的安装/启动/重启/引导、监督重写和遗留服务清理。感谢 @shakkernerd。
- CLI/更新：使用 `--fix` 运行软件包更新后doctor，以便软件包更新在重启前修复配置迁移。感谢 @shakkernerd。
- CLI/更新：使用 `--omit=optional` 重试失败的npm全局更新，并在回退成功时忽略超出的首次失败。感谢 @shakkernerd。
- Plugins/卸载：当插件ID更改或选定的插件被移除时，随内存槽一起迁移和重置 `plugins.slots.contextEngine`。感谢 @shakkernerd。
- Agents/Discord：将原始 `Agent failed before reply` 运行器故障保留在Discord群组/频道聊天之外，仅在启用 `/verbose` 时在直接消息中显示详细运行器错误。感谢 @codex。
- UI/Windows：在生成UI安装/构建/测试命令之前引用已解析的pnpm `.cmd` 启动器路径，使Node安装在 `C:\Program Files` 下不再因 `C:\Program` 而失败。修复 #45275。感谢 @Kobevictor、@stoppieboy 和 @iubns。
- Codex/agent：在请求构建时将 `--thinking minimal` 翻译为现代Codex模型（gpt-5.5、gpt-5.4、gpt-5.4-mini、gpt-5.2）的 `low`，使第一轮被接受而不是支付浪费的调用+重试与低回退。较旧的Codex模型仍直接接收 `minimal`。修复 #71946。感谢 @hclsys。
- Plugins/卸载：当当前状态目录指向其他位置时，从记录的托管扩展根中移除跟踪的插件文件，以便 `openclaw plugins uninstall --force` 不会使插件可被发现。感谢 @shakkernerd。
- Agents/运行时：添加 `agentRuntime.id` 作为规范配置密钥，使用 `openclaw doctor --fix` 迁移遗留运行时策略配置，通过 `claude-cli` 路由规范Anthropic模型，而不将CLI后端别名传递给嵌入式harness选择，并在渠道启动前加载CLI后端所有者插件。修复 #71957。感谢 @WolvenRA。
- CLI/更新：通过状态和超时守卫Windows计划任务停止，以便自动更新重启不会在 `schtasks /End` 上的陈旧监听器清理上无限挂起。修复 #69970。感谢 @yangswld 和 @sherlock-huang。
- Windows安装/Lobster：当 `npm_execpath` 指向原生pnpm二进制文件时直接执行 `pnpm.exe`，为Lobster嵌入式运行时添加已安装包回退，并在Windows CI中包含Lobster运行器回归测试。修复 #69456。感谢 @igormf。
- Gateway/安装：当当前服务嵌入陈旧网关auth而不是返回已安装时，刷新已加载的网关服务安装，避免令牌轮换后LaunchAgent令牌不匹配循环。修复 #70752。感谢 @hyspacex。
- 更新：在全局安装验证和打包dist修剪期间忽略捆绑插件 `.openclaw-install-stage` 目录，使遗留运行时依赖暂存文件不会将成功更新转为"意外的打包dist文件"故障。修复 #71752。感谢 @waynegault。
- CLI/更新：当更新后插件同步失败时使软件包更新失败，并在信任未更改的工件前刷新遗留npm插件安装记录，防止成功更新以陈旧或失败插件状态重启。感谢 @vincentkoc 和 @shakkernerd。
- Release/更新：在软件包清单生成之前拒绝预填充的捆绑插件 `.openclaw-install-stage` 目录，包括混合大小写路径变体，使发布tarball无法发送中毒的运行时依赖暂存碎片。修复 #71752。感谢 @hclsys。
- Node运行时：在网关重启后保持节点主机重试计时器活动，并在终端凭证暂停时退出，使受监管节点不会成为静默僵尸。修复 #69800。感谢 @meroli28。
- Gateway/插件：阻止持久化WhatsApp auth状态在启动期间激活捆绑渠道运行时依赖修复当 `channels.whatsapp` 不存在时，避免npm/git在打包Linux安装上stall。修复 #71994。感谢 @xiao398008。
- Gateway/设备令牌：在令牌轮换和撤销内执行调用者范围containment，以便仅配对会话无法更改更高范围的operator令牌。修复 #71990。感谢 @coygeek。
- Plugins/渠道：保持安全检查、线程绑定放置、提供商摘要、健康格式化和消息操作标签在只读或已加载渠道元数据上，而不是导入完整渠道运行时。感谢 @shakkernerd。
- Plugins/状态：保持仅配置渠道标签和状态安全摘要，而不导入插件运行时模块来渲染元数据。感谢 @shakkernerd。
- Sessions/渠道：阻止组会话元数据加载捆绑渠道运行时来分类 `#channel` 主题，仅使用已加载渠道能力在该路径上。感谢 @shakkernerd。
- Plugins/渠道：保持原生命令和原生技能 `auto` 默认值在静态渠道元数据上，以便配置、审计和命令列表检查不在仅读取这些默认值时加载渠道运行时。感谢 @shakkernerd。
- CLI/渠道：保持渠道移除选择和全渠道能力摘要在只读插件元数据上，仅对选定的变更路径加载渠道运行时。感谢 @shakkernerd。
- CLI/models：当所有权提供程序插件被禁用时，将Provider Index预览行保留在 `models list --all --provider <id>` 之外，保留冷目录回退的配置权威。感谢 @shakkernerd。
- CLI/模型运行：将 `openclaw infer model run` 保持在显式OpenRouter模型上，不加载完整提供商目录或继承聊天代理静默回复策略，恢复非空一次性探测输出。修复 #68791。感谢 @limpredator。
- 安装程序/macOS：当发生原始模式ioctl失败时，不使用gum spinner重新运行Homebrew安装步骤，避免声称 `node@24` 已安装而Homebrew keg二进制文件缺失。修复 #70411。感谢 @1fanwang 和 @dad-io。
- 安装程序：在Node.js检测之前加载nvm，以便 `curl | bash` 安装尊重nvm管理的Node而不是陈旧系统Node。修复 #49556。感谢 @heavenlxj。
- 安装程序/Windows：通过顶级处理程序路由PowerShell安装失败，以便 `iwr ... | iex` 将控制权返回给当前shell，而直接脚本文件运行仍以非零退出。修复 #38054。感谢 @PwrSrg。
- CLI/Volta：当当前Node可执行文件解析为 `volta-shim` 时，通过命名的 `node` shim重新生成原始 `openclaw` CLI运行，避免在非交互式shell中直接shim执行失败。修复 #68672。感谢 @sanchezm86。
- 安装程序：当多个npm全局根包含OpenClaw安装时发出警告，显示活动Node/npm/openclaw以及每个安装路径和版本，使陈旧版本管理器安装可见。修复 #40839。感谢 @zhixianio。
- Cron/任务：从持久运行日志和作业状态恢复已完成的cron任务账本记录，然后在将其标记为"丢失"之前减少隔离cron运行的虚假"支持会话缺失"审计错误，并保持离线CLI审计不将其空的本地cron活动作业集视为权威。修复 #71963。
- Docker：将修补的依赖文件复制到运行时镜像，以便下游 `pnpm install` 层继续工作。修复 #69224。感谢 @gucasbrg。
- 软件包：在已发布的npm软件包中包含修补的依赖文件，以便下游安装可以解析 `patchedDependencies`。（#69224）感谢 @gucasbrg 和 @vincentkoc。
- Plugins/渠道：将有缺陷的捆绑渠道插件加载器（返回 `undefined`）视为不可用，而不是崩溃配置和帮助路径。修复 #69044。感谢 @frankhli843 和 @vincentkoc。
- Scripts/watch：当 `gateway:watch` 在watcher启动期间失败时，显示损坏的依赖包配置恢复指导，不重复记录无关的导入失败。（#58780）感谢 @roytong9 和 @vincentkoc。
- Signal：通过Node的HTTP客户端读取signal-cli RPC、健康检查和SSE事件，以便Node 24/25 fetch回归不会破坏Signal发送或入站事件。修复 #51716 和 #53040。感谢 @Barukimang、@minupla 和 @vincentkoc。
- Skills/Docker：使用OpenClaw管理的用户前缀运行npm支持技能依赖安装，使非root Docker镜像不写入 `/usr/local`。修复 #59601。感谢 @chanjarster 和 @vincentkoc。
- Agents/运行时：将心跳、cron和exec唤醒作为瞬态运行时上下文提交，而不是可见用户prompts，使合成系统工作远离聊天记录。修复 #66496 和 #66814。感谢 @jeades 和 @mandomaker。
- Telegram：自动为线程回复和回复标签包含原生引用摘录，当原始Telegram文本可用时不添加另一个配置旋钮。修复 #6975。感谢 @rex05ai。
- Node/Linux：使 `openclaw node install` 启用并重启节点专用VM上的 `openclaw-node` systemd单元而不是网关单元。修复 #68287。感谢 @dlebee-agent。
- Browser/CDP：在发送任何浏览器命令之前重试瞬态原始CDP WebSocket握手失败，并重新连接陈旧的持久化Playwright CDP会话以安全读取标签页列表，而不重放变更浏览器操作。修复 #67728。
- Gateway/Linux：当 freshly written 网关单元在迁移的systemd安装上尚不可见时，在第二次守护进程重载后重试 `systemctl --user enable`。修复 #65184。感谢 @liushuaiiu。
- Telegram：发送原生引用回复时保留精确的选择引用文本，如果Telegram拒绝引用参数则使用遗留回复重试。（#71952）感谢 @rubencu。
- Plugins/CLI：在冷 `openclaw plugins list` 输出中保留清单名称、描述、格式和源元数据，不导入插件运行时。感谢 @shakkernerd。
- Security/审计：从只读插件索引元数据读取渠道暴露和插件allowlist所有权，以便冷审计不依赖已加载渠道运行时。感谢 @shakkernerd。
- Plugins/聊天：保持 `/plugins list`、`/plugins enable` 和 `/plugins disable` 在持久化插件索引路径上，以便聊天插件管理不在执行前加载诊断/运行时插件注册表。感谢 @shakkernerd。
- Plugins/doctor：通过已安装索引清单元数据读取工作区插件状态和遗留web-search所有权，而不是广泛的清单注册表扫描。感谢 @shakkernerd。
- CLI/agents：文本 `agents list` 输出的渠道提供商状态从只读插件索引元数据读取，而不是从已加载渠道注册表读取。感谢 @shakkernerd。
- 日志记录：在控制台和文件日志sink出口处对配置的secret模式进行redact，以便到达日志的凭证在终端显示或JSONL持久化之前被屏蔽。修复 #67953。感谢 @Ziy1-Tan。
- Gateway/服务：当配置由更新版本编写时，拒绝来自较旧OpenClaw二进制文件的进程和服务变更，防止split-brain安装停止或重写更新网关服务。修复 #57079。
- Gateway：保留 `/healthz` 和 `/readyz` 在插件、canvas和Control UI HTTP阶段之前，以便当后续路由处理器stall时liveness/readiness探针仍能响应。修复 #69674。感谢 @Xike-Creek。
- 日志记录：在捆绑运行时直接从活动OpenClaw配置路径加载 `logging.file` 和redaction设置，以便打包网关停止回退到 `/tmp/openclaw`。修复 #59370、#67168 和 #61295。感谢 @KeaneYan、@Pan9hu 和 @zsjlovelike。
- 日志记录：在 `logging.maxFileBytes` 处轮换文件日志，保持有限编号归档，并使长期运行的滚动日志记录器跟随当前日期文件，而不是抑制诊断或写入陈旧日期文件。修复 #58583 和 #62381。感谢 @jpeghead 和 @zhaoleink。
- Agents/组：仅对允许静默回复的始终在线组将干净的空助手停止视为静默 `NO_REPLY`，同时保持直接和提及门控会话在 incomplete-turn 重试路径上。感谢 @MagnaAI。
- macOS/Node：保持原生远程应用节点不广告 `browser.proxy`，通过恢复的 `openclaw node start` 命令启动支持浏览器的CLI节点服务，并在本地控制服务缺失时显示可操作的浏览器控制错误。修复 #66637。
- Gateway/更新：当重启的托管网关报告错误版本时使软件包更新失败，包括回退重启和JSON模式，避免macOS LaunchAgent更新后false-success混合版本重启。修复 #71835。感谢 @abhinas90 和 @jsompis。
- Gateway/更新：在目标卷看起来磁盘空间不足时，在软件包更新和捆绑插件运行时依赖修复之前发出警告，不在尽力而为文件系统检查上阻止安装。修复 #71835。感谢 @abhinas90 和 @jsompis。
- Plugins/运行时依赖：在健康状况中显示激活插件加载失败，并在捆绑运行时依赖仍无法加载时使软件包更新重启验证或doctor修复失败，避免false-success修复。（#71883）感谢 @Solvely-Colin。
- Gateway/Linux：在生成的服务PATH中包含 fnm `aliases/default/bin`，并让doctor接受现代fnm别名或遗留 `current/bin` 符号链接，避免false PATH修复提示。修复 #68169。感谢 @richard-scott。
- 安装程序/Linux：使用noninteractive dpkg和needrestart设置运行apt安装，使新的Ubuntu 24.04 `curl | bash` 安装在安装Node.js、Git或构建工具时不会挂起。修复 #41146。感谢 @iht76、@alexcarv318、@cs3gallery、@firofame 和 @cgdusek。
- Providers/Bedrock：延迟AWS SDK导入直到Bedrock发现实际运行，以便插件注册和设置在冷启动时保持轻量。修复 #71690。感谢 @jarvis-ai-gregmoser。
- 安装程序/macOS：当Homebrew `node@24` 安装失败时立即停止，避免为缺失的Homebrew Node安装打印PATH建议。修复 #70411。感谢 @1fanwang。
- WhatsApp：当 `messages.removeAckAfterReply` 启用时，在可见回复后移除ack reactions，与其他支持reaction的渠道匹配。修复 #26183。感谢 @MrUnforsaken。
- Providers/Z.AI：将OpenClaw thinking控件映射到Z.AI的 `thinking` 有效载荷，并通过 `params.preserveThinking` 添加可选保留thinking重放，以便GLM 5.x可以在请求时保留先前的 `reasoning_content`。修复 #58680。感谢 @xuanmingguo。
- Channels/状态：默认将只读渠道列表保留在清单和包元数据上，仅对显式回退调用者加载设置运行时。感谢 @shakkernerd。
- Plugins：将设置和web-provider元数据清单读取范围限定为显式插件ID，当调用者已经知道所有权插件集时。感谢 @vincentkoc。
- Plugins/onboarding：推迟onboarding安装记录索引写入直到受保护的配置提交，以便设置失败不会将插件索引超前于 `openclaw.json`。感谢 @shakkernerd。
- Plugins/registry：从已安装插件索引解析web provider所有权，而不是在secret、tool和定价路径上进行广泛清单扫描。感谢 @vincentkoc。
- Config/providers：接受配置模型 `input` 值中的 `video` 和 `audio`，并在提供商目录条目中保留它们。修复 #20721。感谢 @alvinttang。
- Models/auth：遵守auth写入命令（`add`、`login`、`setup-token`、`paste-token` 和GitHub Copilot快捷方式）的父 `--agent` 标志，以便OAuth/API-key/token结果写入请求的代理存储而不是默认代理。修复 #71864。（#71933）感谢 @balric-seo。
- TTS：从流式块文本中剥离模型发出的TTS指令后再进行渠道传递，包括跨相邻块分割的指令，同时保留累积的原始回复用于最终模式合成。修复 #38937。
- TTS：将显式 `provider=...` 指令密钥限制在该提供商的范围内，并对不支持的密钥发出警告，而不是让另一个语音提供商使用重叠密钥。修复 #60131。
- TTS/飞书：在传递前规范化最终模式流式TTS纯音频，以便生成的语音笔记文件使用与正常最终回复相同的安全媒体路径和原生语音路由。修复 #71920。
- 飞书：在代理分派前使用共享媒体音频路径转录入站语音笔记音频，并将原始飞书 `file_key` 有效载荷排除在消息文本之外。修复 #67120 和 #61876。
- 任务：从网关运行结果中终止async网关代理任务记录，同时保留aborted、failed和cancelled结果，而不是让完成的运行保持active或lost状态。（#71905）感谢 @likewen-tech。
- WhatsApp：让授权群组语音笔记transcripts在回复分派前满足提及门控，同时将未提及的transcripts保留在待处理群组历史中。修复 #44908。
- 媒体理解：将渠道语音笔记preflight状态携带到附件选择中，以便WhatsApp、飞书、Telegram和Discord不会重复转录同一入站音频。修复 #70580。
- TTS/BlueBubbles：将兼容自动TTS音频作为iMessage语音备忘录气泡传递，而不是普通MP3/CAF文件附件。修复 #16848。
- TTS：根据渠道插件能力解析语音笔记和语音备忘录路由，而不是语音核心拥有的渠道ID列表。
- ACP：将子代理和async-task完成唤醒作为普通prompts发送到外部ACP harnesses，而不是OpenClaw内部运行时上下文信封，同时将这些信封排除在ACP记录之外。
- TTS/状态：在 `/status` 中显示配置的TTS模型、语音和清理的自定义端点，在自定义端点上保留OpenAI兼容TTS指令，空Microsoft/Edge TTS输出重试一次。解决 #46602、#47232 和 #43936。感谢 @leekuangtao、@Huntterxx 和 @rex993。
- Agents/Gateway：通过owner-only `gateway` 工具引导代理驱动的配置编辑和重启，将 `config.schema.lookup` 记录为字段文档来源，并警告不要在macOS上使用 `gateway stop && gateway start` 作为重启替代。修复 #71929。感谢 @ygc3817922006-sketch。
- 媒体理解/audio：为太小的语音笔记注入确定性transcript占位符，以防止代理产生transcription或提供商故障的幻觉。修复 #48944。感谢 @eulicesl。
- Providers/vLLM：当thinking关闭时发送Nemotron 3 chat-template kwargs，并为OpenAI兼容completions遵守配置的 `params.chat_template_kwargs`，使vLLM/Nemotron回复保持可见而不是仅成为thinking。修复 #71891。感谢 @jmystaki-create 和 @dennis-lynch。
- Channels/回复：从面向用户的助手回复和模型重放历史中剥离复制的入站元数据块，使Discord/vLLM会话在模型回显后不会泄漏 `Conversation info` / `UNTRUSTED ... message body`信封。修复 #71847。感谢 @jmystaki-create。
- Matrix/cron：在创建隐式公告提醒作业时保留实时Matrix传递目标，使混合大小写的room ID不会从小写会话密钥重新构建。修复 #71798。
- 飞书：接受Schema 2.0卡片动作回调，报告 `context.open_chat_id` 而不是遗留 `context.chat_id`，使按钮回调不再因格式错误而丢弃。修复 #71670。感谢 @eddy1068。
- 飞书：将合成卡片动作和机器人菜单ID排除在平台回复目标之外，当飞书提供时使用真实卡片回调消息ID，否则使用纯文本发送。修复 #71673。感谢 @eddy1068。
- Plugins/QQ Bot：优先使用声明替换捆绑 `qqbot` 渠道的已安装QQ Bot插件，防止重复的 `qqbot_channel_api` 和 `qqbot_remind` 工具注册噪音。修复 #63102。
- 浏览器自动化：在Chromium在表单提交或其他操作触发的导航后替换原始目标时保持稳定的标签页ID和标签，并在匹配可验证时从 `/act` 返回替换的 `targetId`。修复 #46137。
- QQ Bot：使 `qqbot_remind` 直接为授权发送者安排、列出和移除网关cron作业，而不是返回 `cronParams` 并依赖后续通用 `cron` 工具调用。修复 #70865。（#70937）感谢 @GaosCode。
- Agents/ACP：除非加载了ACP后端，否则隐藏 `sessions_spawn` ACP运行时选项，并让 `/acp doctor` 指出阻止捆绑 `acpx` 的 `plugins.allow`。感谢 @vincentkoc。
- Agents/Codex：除非ACP运行时后端可用，否则保持ACP prompt/skill路由隐藏，并在doctor中警告已启用Codex插件配置仍然通过PI路由 `openai-codex/*` 模型。感谢 @vincentkoc。
- 媒体传递：当助手回复已包含同一轮次的显式 `MEDIA:` 行时，避免重复发送生成的图像附件，并在传递前拒绝不安全的远程 `MEDIA:` URL。感谢 @pashpashpash。
- Codex harness：在Codex恢复后忽略可重试的app-server错误通知，并为终端app-server失败保留真实嵌套错误消息，而不是将其替换为通用失败。感谢 @pashpashpash。
- Agents/Codex：准备原生Codex子代理会话元数据，不使用嵌套网关会话补丁，并为app-server子代理路径添加专注的Docker smoke测试。感谢 @vincentkoc。
- Agents/子代理：仅当请求者没有外部渠道目标时保持排队的子代理公告为会话级别，避免歧义多渠道传递失败。修复 #59201。感谢 @larrylhollan。
- 图像理解：当调用者请求不带提供商前缀的模型时，保留配置的前缀视觉模型元数据，使自定义图像模型保持其 `input: ["text", "image"]` 能力。修复 #33185。感谢 @Kobe9312 和 @vincentkoc。
- Plugins/安装：如果并发配置写入冲突中断安装、更新或卸载元数据提交，则恢复之前的插件索引记录。感谢 @shakkernerd。
- Plugins/安装：拒绝不包含有效 `openclaw.plugin.json` 的原生插件归档，防止无清单归档写入安装记录，以免日后显示缺失清单诊断。感谢 @shakkernerd。
- Plugins/卸载：移除跟踪的托管插件安装目录，即使持久化安装路径与默认ID派生目标不同，同时仍拒绝在托管扩展根之外删除。感谢 @shakkernerd。
- Plugins/更新：如果核心更新或渠道设置在插件元数据更改后遇到并发配置写入冲突，则恢复之前的插件索引记录。感谢 @shakkernerd。
- Plugins/onboarding：将渠道/提供商插件安装记录推迟到所属配置写入提交，以保持设置失败不会将插件索引超前于 `openclaw.json`。感谢 @shakkernerd。
- Plugins/config：使用插件索引提交辅助函数路由带待处理插件安装记录的configure和代理设置写入，以免提供商onboarding元数据被普通配置写入剥离。感谢 @shakkernerd。
- Plugins/渠道：在配置写入之前将待处理渠道插件安装记录与现有插件索引合并，在渠道设置、解析、移除和能力修复流程中保留无关跟踪安装。感谢 @shakkernerd。
- Plugins/config：将已交付的 `plugins.installs` 索引迁移推迟到配置写入期间，直到受保护的配置提交窗口，并在配置写入在提交前失败时回滚。感谢 @shakkernerd。
- Sessions：通过作为隐藏的下一轮自定义消息发送来保持嵌入式运行时上下文不在可见用户prompt中，并教doctor修复受影响的2026.4.24记录（包含重复的prompt-rewrite分支）。修复 #71761。
- Gateway/子代理：通过共享网关令牌/密码保持直接loopback后端RPC通过陈旧CLI配对设备范围基线进行身份验证，使内部调用不再触发 `scope-upgrade` 配对提示，而远程、浏览器、节点、设备令牌和显式设备路径仍需要正常配对批准。修复 #63548。
- Providers/Azure OpenAI：为部署范围的图像生成请求提供更长的600s默认超时，使慢速 `gpt-image-2` 生成可以完成而不需要每调用 `timeoutMs`。修复 #71705。感谢 @voytas75。
- Gateway/plugins：链接source-checkout捆绑运行时依赖缓存，而不是在网关主线程上递归复制 `node_modules`，防止本地状态、节点和技能探测在启动缓存恢复期间超时。
- Skills/远程节点：仅为已连接节点公开远程macOS技能bin，当节点探测失败时清除陈旧的bin匹配，并在超时日志中包含探测命令、超时、bin计数和连接状态。
- Skills/远程节点：在探测已连接macOS节点时识别 `system.which` 对象映射响应，以便Linux网关可以公开macOS专用技能（如Apple Notes），当远程安装了所需二进制文件时。修复 #71877。感谢 @miguelarios。
- CLI/gateway：保持诊断探测不创建首次只读设备配对，同时仍为详细读取探测重用缓存的设备令牌。修复 #71766。感谢 @SunboZ。
- CLI/plugins：保持 `message` 启动、`channels logs`、`agents delete` 和 `agents set-identity` 远离广泛插件预加载；消息传递在实际运行操作时仍加载插件。
- 图像理解：在发现注册表未注册该提供商时，报告 `Unknown model` 之前解析配置的图像模型（如本地LM Studio视觉条目）。修复 #66486。感谢 @zhanggpcsu。
- QQ Bot：使用出站ref-index标记忽略回显的机器人消息，防止镜像回复重新进入代理循环，同时仍允许用户引用机器人回复。修复 #71912。感谢 @wangyc6003。
- Sessions：将重置新鲜度与会话存储 `updatedAt` 分离，使心跳、cron、exec和网关记账不再阻止配置的每日/空闲重置来滚动长期运行渠道会话。修复 #68315、#63732、#63820 和 #69083。感谢 @maxatv、@longhairedsi、@bradfreels 和 @akessel56。
- Sessions：在 `/new`、`/reset`、网关 `sessions.reset` 和每日/空闲滚动期间清除排队的系统事件通知，使陈旧后台更新无法泄漏到新会话的第一个prompt中。修复 #66864。感谢 @opeyio、@Magicray1217 和 @cedillarack。
- CLI/agents：保持 `agents bind`、`agents unbind` 和 `agents bindings` 在设置安全渠道元数据路径上，以免预加载捆绑插件运行时或暂存运行时依赖。修复 #71743。
- Plugins/registry：在注册表迁移期间保留显式禁用插件记录，而不持久化在磁盘上发现的每个未使用捆绑插件。感谢 @shakkernerd。
- Windows/原生：让CLI启动和捆绑提供商插件加载远离Windows ESM raw-path故障路径，修复Node 24上的原生onboarding/install smoke。
- Plugins/doctor：通过与插件加载使用的相同打包插件目录解析器读取捆绑渠道doctor能力，使已发布安装保持Matrix DM allowlist修复 `channels.matrix.dm.*`，而不是写入无效的顶级 `dmPolicy` 键。修复 #71757。
- Plugins/Windows：让捆绑插件Jiti加载器在Windows上远离原生导入路径，以免Telegram等渠道插件不再因 `C:\...` 路径上的 `ERR_UNSUPPORTED_ESM_URL_SCHEME` 而崩溃。修复 #71749。感谢 @smeyer9。
- Providers/Ollama：使用Ollama当前的 `/api/web_search` 端点，并遵守Ollama Web Search的 `https://ollama.com` 模型提供商基础URL。修复 #71741。感谢 @madhvidua。
- Memory/Ollama：序列化Ollama内存嵌入批次并添加内联批次超时覆盖，为本地/自托管嵌入提供商使用更长的默认值。
- Sessions/usage：从使用总量和会话发现中排除压缩检查点记录快照，同时保持旧检查点文件可移除。
- CLI/agents：默认保持 `openclaw agents list --json` 在仅配置路径上，除非调用者请求 `--bindings`，否则避免捆绑插件加载。修复 #71739。感谢 @kaloster。
- Plugins/安装：强制插件依赖安装保持项目本地，即使继承的npm配置请求全局安装，使成功安装仍能物化插件暂存的 `node_modules`。
- Providers/Google：将Gemini TTS PCM转码为Opus用于语音笔记目标，使WhatsApp和其他原生语音笔记回复可以作为语音消息播放。
- TTS/WhatsApp：将非Opus提供商输出标记为语音笔记意图，使渠道传递将MP3/WebM回复转码为Ogg/Opus PTT音频。
- Plugins/运行时依赖：当再次检查镜像插件根时重用现有外部捆绑插件stage根，避免第二代 `openclaw-unknown-*` stage和重复的首轮restaging。修复 #71599。
- iOS/macOS对话模式：允许 `talk.speechLocale` 设置非英语语音对话的语音识别区域设置。修复 #44688。
- Plugins/提供商：遵守显式插件候选列表，而不是从本地状态读取持久化注册表快照，保持候选范围的提供商发现 hermetic。
- Plugins/doctor：即使用户npm prefix/全局配置将npm指向 `$HOME/node_modules`，也让捆绑插件运行时依赖修复保持在托管OpenClaw stage内。修复 #71730。
- ACP/sessions_spawn：当调用者明确请求 `runtime="acp"` 时拒绝普通OpenClaw配置代理ID，同时允许配置了 `runtime.type="acp"` 的代理解析到其ACP harness id。修复 #63914。
- ACP/sessions_spawn：将 `runTimeoutSeconds` 应用于ACP子轮次，并在后台子代理通道上分派这些轮次，使配额停滞的ACP harness不会无限期占用主代理通道。修复 #68823。
- ACP/oneshot：在关闭已完成的oneshot ACP运行之前协调运行时会话身份，使完成的 `sessions.json` 条目不会以 `acp.identity.state="pending"` 卡住。
- ACPX：捆绑 `acpx@0.6.1`，使不支持的通用模型覆盖明确失败，而不是静默回退到目标适配器默认值。
- ACP/models：记录非Codex ACP模型覆盖需要适配器支持ACP `models` 加上 `session/set_model`，使不支持的harness明确失败，而不是静默回退到其默认值。
- Plugins/语音通话：在网关启动期间将缺失提供商凭证视为设置不完整，并将缺失密钥作为警告记录而不是运行时启动错误，同时在使用时保持显式命令/工具错误。
- Android/对话模式：当对话模式等待自己的响应时，防止快速或重复的最终聊天事件到达时重复TTS播放。修复 #46546。
- 工具/check:changed：将父heavy-check锁标记传递给lint通道，使 `pnpm check:changed` 不再等待自己的 `lint:extensions` 子进程。
- CLI/completion：在注册 `openclaw onboard` 选项之前对提供商auth标志进行去重，以免更新期间完成缓存刷新因陈旧核心回退标志与插件清单标志重叠而失败。修复 #71667。
- Diagnostics/trace：从当前prompt快照报告实时上下文使用情况，而不是提供商轮次总数，避免缓存或工具密集型运行上的虚假接近满上下文峰值。
- Providers/Google：为Gemini TTS和电话TTS遵守 `models.providers.google.request.allowPrivateNetwork`，与Google图像生成和媒体理解匹配。（#71723）感谢 @ro-hansolo。
- Providers/MiniMax：为音乐和视频生成注册 `minimax-portal`，在共享 `music_generate` 和 `video_generate` 工具中保留OAuth auth和区域MiniMax基础URL。（#63241）感谢 @tars90percent。
- Providers/onboarding：通过将其视频生成auth选择限定在媒体设置流程中，使Runway和Alibaba Model Studio保持在文本推理设置选择器之外。（#65856）感谢 @Jah-yee。
- Plugins/Bonjour：当mDNS看门狗取消卡住的探测时，阻止网关崩溃循环 `CIAO PROBING CANCELLED`。恢复在bonjour插件迁移期间丢弃的rejection-handler布线，并在模块实例间共享unhandled-rejection状态，使插件暂存的 `openclaw/plugin-sdk/runtime` 副本注册到主机咨询的同一处理程序集。特别影响macOS上的Docker，mDNS探测会可靠地命中看门狗。感谢 @troyhitch。
- Google Meet：在设置/加入诊断中报告固定Chrome节点为离线或缺失能力，保持无法访问的节点不在自动选择中，并在代理尝试本地Chrome之前预检本地BlackHole/SoX要求。
- Providers/MiniMax：将 `image-01` 请求路由到专用图像生成端点，同时保留CN端点选择。修复 #61149。感谢 @mushuiyu886。
- Plugins/启动：在短宽限期后移除无所有者的捆绑运行时依赖安装锁，并在启动超时等待插件运行时依赖锁时包含锁所有者详细信息。
- Plugins/安装：用OpenClaw拥有的包清单锚定捆绑运行时依赖npm安装，使Linux更新不能意外写入父 `$HOME/node_modules` 树。修复 #71730。
- Plugins/安装：将onboarding插件配置传递到插件索引写入，以便在默认发现根之外的本地插件安装保持其安装记录。感谢 @shakkernerd。
- Plugins/安装：将已交付的 `plugins.installs` 配置记录迁移到插件索引，同时从运行时配置和未来写入中剥离它们。感谢 @shakkernerd。
- Plugins/安装：在其记录复制到插件索引后，从 `openclaw.json` 中持久化移除已交付的 `plugins.installs`，如果配置清理失败则回滚索引写入。感谢 @shakkernerd。
- Plugins/安装：即使插件清单缺失或无效，也在插件索引中保留迁移的插件安装记录，以便更新、卸载、检查和审计仍能恢复损坏的安装。感谢 @shakkernerd。
- Plugins/安全：保持插件审计JSON检查ID稳定，同时用更新措辞报告插件索引安装记录发现。感谢 @shakkernerd。
- CLI/config：拒绝直接编辑 `plugins.installs`，指导使用 `openclaw plugins install`、`openclaw plugins update` 或 `openclaw plugins uninstall`。感谢 @shakkernerd。
- 实时测试/语音：接受OpenClaw和ElevenLabs品牌名称的常见STT变体，使提供商smoke测试在真实回归上失败，而不是等效transcripts。
- Agents/回复：在外部渠道上转发清理后的底层代理失败详情，而不是用通用重试消息替换未知失败。
- CLI/MCP：将OpenClaw `mcp.servers.*.transport` 条目转换为Claude/Gemini CLI `type` 字段，使流式HTTP MCP服务器可以在CLI后端会话中加载。（#71724）感谢 @Blockchain-Oracle。
- Browser/CDP：在通过原始CDP或 `/json/new` 回退打开标签页时遵守配置的远程和 `attachOnly` CDP HTTP/WebSocket超时。（#54238）感谢 @FuncWei。
- WhatsApp/TTS：可见文本与PTT语音笔记音频分开发送，而不是依赖隐藏语音笔记字幕。修复 #51081。
- Browser/client：避免告诉代理在外部浏览器配置文件（如 `attachOnly`、远程CDP和existing-session）上因调度程序超时而重启OpenClaw。（#40815）感谢 @0xsline。
- Agents/TTS：在可信文本工具结果 `MEDIA:` 有效载荷上保留 `[[audio_as_voice]]` 指令，使生成的音频仍作为语音笔记传递。（#46535）感谢 @azade-c。
- Agents/TTS：当助手在非块传递路径上以 `NO_REPLY` 结束时保留排队的工具媒体，使仅媒体的生成音频回复仍能发送。（#60025）感谢 @bradlind1。
- Telegram/STT：在代理上下文中将入站语音笔记transcripts框定为机器生成的不受信任文本，同时保留原始transcript提及检测。关闭 #33360。感谢 @smartchainark。
- 子代理/浏览器：当浏览器自动化已配置但被活动工具配置文件过滤掉时，显示可操作的 `/tools` 通知，并记录编码配置文件代理应使用 `tools.alsoAllow: ["browser"]` 而不是仅依赖子代理allowlists。
- Control UI/快速设置：将助手头像覆盖持久化到浏览器本地存储（镜像用户头像），以便上传的图像data URL不再因"太大：预期字符串最多200个字符"而失败配置验证。同时提升网关端 `ui.assistant.avatar` 长度限制以匹配用户头像大小预算，用于直接写入字段的非UI客户端。感谢 @BunsDev。
- 插件SDK：在重复源/分发模块图之间共享诊断事件订阅，使遗留根SDK导入仍能接收运行时诊断事件。
- Agents/Bedrock：通过持久化、修复和重放非空回退块，防止空助手stream-error轮次毒害Converse重放。修复 #71572。（#71627）感谢 @openperf。
- Agents/Anthropic/Bedrock：在提供商转换前剥离缺失、空或空白重放签名的thinking块，必要时回退到非空omitted-reasoning文本，使损坏的signed-thinking历史不再毒害后续轮次。修复 #45010。（#70054）感谢 @castaples。
- Agents/Anthropic/Bedrock：保留剥离的仅thinking助手重放轮次（带有非空omitted-reasoning文本），以便提供商适配器保持严格用户/助手轮次形状。感谢 @wujiaming88。
- ACP/Codex：将 `sessions_spawn(runtime="acp")` 模型和thinking覆盖传递到Codex ACP启动，规范 `openai-codex/*` 引用和slash reasoning后缀，并识别托管Codex ACP包装器命令，而不阻止当前 `gpt-5.5` 会话。修复 #40393。（#71643）感谢 @91wan。
- Browser/CDP：使就绪诊断对裸 `ws://` Browserless和Browserbase CDP URL使用与可达性相同的discovery-first回退。修复 #69532。
- Browser/CDP：解释loopback Browserless或其他外部托管CDP服务在报告本地端口所有权冲突时需要 `attachOnly: true` 和匹配的Browserless `EXTERNAL` 端点，并在发现的Browserless端点拒绝CDP时回退到配置的裸WebSocket根。修复 #49815。
- Gateway/reload：保持 `gateway.reload.deferralTimeoutMs: 0` 语义的无限性用于渠道热重载延迟，使活动代理运行不会被强制渠道重启中断。（#71637）感谢 @Poo-Squirry。
- Agents/工具结果：在提供商转换前限制持久化Pi工具结果详情并剥离隐藏诊断，防止大型调试有效载荷膨胀会话记录。（#71637）感谢 @Poo-Squirry。
- ACP/OpenCode：将捆绑的acpx运行时更新到0.6.0，并在Docker实时测试中覆盖OpenCode ACP绑定路径。
- Providers/OpenCode Go：在Go目录中添加DeepSeek V4 Pro和DeepSeek V4 Flash，同时等待捆绑的Pi注册表跟上。修复 #71587。
- Providers/OpenCode Go：通过OpenAI兼容Go端点路由DeepSeek V4 Pro/Flash，并抑制无效 `reasoning_effort: "off"` 有效载荷，修复 `opencode-go/deepseek-v4-flash` 的工具启用请求。修复 #71683。
- Plugins/模型默认值：当hook上下文缺少模型元数据时，在配置的代理默认模型上运行Skill Workshop review、Active Memory recall和会话内存slug生成，而不是硬编码OpenAI SDK回退。修复 #71659。
- Providers/Venice：为 `venice/deepseek-v4-pro` 和 `venice/deepseek-v4-flash` 重放轮次填充所需的DeepSeek V4 `reasoning_content` 占位符，而不发送Venice拒绝的原生DeepSeek `thinking` 控件。修复 #71628。
- Browser/现有会话：支持per-profile Chrome MCP命令/参数，将 `cdpUrl` 映射到 `--browserUrl` 或 `--wsEndpoint`，并避免将端点标志与 `--userDataDir` 结合使用。修复 #47879、#48037 和 #62706。感谢 @puneet1409、@zhehao 和 @madkow1001。
- 媒体/插件：在将不受信任的文件交给 `file-type` 或 `jszip` 之前限制MIME嗅探和ZIP归档preflight，减少附件和ClawHub插件归档的解析器CPU和内存暴露。感谢 @vincentkoc。
- Memory-host SDK：仅当Undici将代理该目标时，对远程嵌入和批量HTTP调用使用可信env-proxy模式，为 `ALL_PROXY`-only和 `NO_PROXY` 绕过情况保留SSRF DNS pinning。修复 #52162。（#71506）感谢 @DhtIsCoding。
- Gateway/仪表板：当 `gateway.tls.enabled=true` 时，使用 `https://`/`wss://` 渲染Control UI和WebSocket链接，包括 `openclaw gateway status`。修复 #71494。（#71499）感谢 @deepkilo。
- Agents/OpenAI兼容：当存在工具时，将代理/本地completions工具请求默认为 `tool_choice: "auto"`，使提供商进入原生工具调用模式，而不是用纯文本工具指令回复。（#71472）感谢 @Speed-maker。
- OpenAI图像生成：对Codex OAuth响应传输使用 `gpt-5.5` 而不是已停用的 `gpt-5.4` 模型，修复ChatGPT Codex图像生成的500错误。修复 #71513。感谢 @baolongl。
- OpenAI图像生成：将透明背景默认模型请求路由到 `gpt-image-1.5`，记录预期的 `image_generate` 调用格式，并保持Azure/自定义OpenAI兼容部署名称不变。
- Google视频生成：直接下载MLDev Veo `video.uri` 结果，而不是通过Files API路径传递，修复成功生成/轮询后的404错误。修复 #71200。感谢 @panhaishan。
- Google视频生成：为纯文本SDK 404回退到REST `predictLongRunning` Veo端点，同时将参考图像/视频生成保持在SDK路径上。修复 #62309 和 #63008。（#62343）感谢 @leoleedev。
- MiniMax音乐生成：将捆绑默认模型从不支持的 `music-2.5+` ID切换到当前 `music-2.6` API模型。修复 #64870，并解决 #62315中的音乐默认值。感谢 @noahclanman 和 @edwardzheng1。
- Cron：将因网关重启而中断的作业记录为其原始 `runningAtMs` 的失败状态，跳过不安全的启动重放，并禁用中断的一次性作业，使其显示可见失败而不是静默消失或重复工作。修复 #59056、#61343、#63657 和 #59301。感谢 @ponchoooPenguin、@daemic24、@myradon 和 @hikiwibot。
- Cron工具：在网关验证之前恢复扁平顶级计划简写（如 `cron`、`tz` 和 `staggerMs`），使模型生成的cron add/update调用保留cron抖动设置。感谢 @tyxben。
- Cron：在启动重新计算运行时间之前，将带有顶级 `cron`、`tz`、`session` 和 `message` 字段的扁平遗留作业行充实为规范schedule、target和payload对象。修复 #43351。
- Agents/回复：让待处理群聊历史触发裸提及轮次，而不将仅元数据入站上下文视为用户输入。修复 #71489。（#71520）感谢 @SymbolStar。
- Google媒体生成：在调用Google GenAI SDK之前，从Google音乐/视频提供商基础URL中剥离配置的尾部 `/v1beta`，防止双 `/v1beta/v1beta` 路径。修复 #63240。（#63258）感谢 @Hybirdss。
- Discord：恢复直接消息语音笔记preflight转录，并将仅URL的Ogg/Opus语音附件分类为音频，同时跳过没有可用URL的部分附件。修复 #61314 和 #64803。
- Plugins/构建：将捆绑插件技能树复制到 `dist-runtime`，扩大Windows符号链接复制回退，并从 `lstat` 指纹识别运行时依赖，使符号链接式目录条目无法使staging崩溃。
- Google Chat：当打字指示器消息被删除或无法再更新时保留回复文本，使媒体标题和第一个文本块重新发送而不是静默消失。（#71498）感谢 @colin-lgtm。
- Cron：在启动、主会话系统事件有效载荷和人类可读的 `cron list` 输出中容忍格式错误的遗留作业行，使缺失 `state`、`payload.text` 或显示字段不再使调度器或CLI崩溃。修复 #66016、#65916、#64137、#57872、#59968、#63813、#52804 和 #43163。（#71509）感谢 @vincentkoc。
- CLI/models：使 `openclaw models scan` 在未配置 `OPENROUTER_API_KEY` 时回退到公共OpenRouter免费模型元数据，避免对显式 `--no-probe` 扫描的配置secret解析，并将扫描超时应用于OpenRouter目录请求。
- 飞书：将流式卡片保持为每轮一个，在有意义的文本边界后刷新节流卡片编辑，并跳过精确块/部分重复，使工具密集型回复不重复卡片输出。感谢 @allan0509。
- 飞书：通过剥离泄漏的reasoning标签、保留跨块部分快照、启用主题线程流式卡片、省略通用 `main` 卡片标题、表面瞬态工具/压缩状态以及在关闭失败后清理流状态来完成流式卡片重复关闭。感谢 @sesame437、@Vicky-v7、@maoku-family、@Pengxiao-Wang 和 @Maple778。
- Telegram：当模糊的最终编辑失败否则保留答案的严格前缀时，通过回退到最终发送来恢复不完整的部分流预览。修复 #71525。（#71554）感谢 @sahilsatralkar。
- Control UI/聊天：将助手token/模型上下文详情折叠在显式Context披露后面，在消息页脚中显示完整日期，使历史记录时间线清晰而不产生嘈杂的默认元数据。（#71337）感谢 @BunsDev。
- OpenAI/Codex OAuth：用代理/区域提示解释 `unsupported_country_region_territory` 令牌交换失败，而不是显示通用OAuth错误。修复 #51175。（#71501）感谢 @vincentkoc 和 @wulala-xjj。
- Browser/Linux：在没有显示服务器的主机上对本地托管配置文件回退到无头模式，同时保留显式per-profile headed覆盖并报告无头来源。（#60953）感谢 @rrpsantos。
- Telegram：移除启动时持久化偏移 `getUpdates` preflight，使轮询重启在运行器启动之前不会自我冲突。修复 #69304。（#69779）感谢 @chinar-amrutkar。
- Telegram：即使grammy报告运行器未运行而其任务仍挂起时，也保持轮询stall看门狗活动，使重建的传输不能使 `getUpdates` 静默直到手动网关重启。修复 #69064。感谢 @LDLoeb。
- 子代理：当父公告轮次在没有可见有效载荷的情况下完成时，回退到直接完成传递，使子结果仍能到达支持渠道的请求者会话。
- 子代理：告诉父代理在等待子完成事件时使用 `sessions_yield`，防止GPT-5快速运行在生成workers后静默结束。
- Browser/Playwright：在保护导航期间忽略良性的已处理路由竞争，使浏览器页面任务在Playwright中途拆除路由时不再失败。（#68708）感谢 @Steady-ai。
- Browser/CLI：延迟加载浏览器命令组和插件运行时服务，使 `openclaw browser --help` 可以在不加载完整浏览器自动化堆栈的情况下呈现。修复 #65400。（#65460、#66640）感谢 @pandego 和 @Tianworld。
- Browser/CLI：从CLI启动元数据提供预计算的 `openclaw browser --help` 文本，避免常见帮助调用时的完整插件/配置启动路径。
- Browser/下载：用OpenClaw下载偏好填充托管Chrome配置文件，并在保护下载目录下捕获非托管点击触发的下载，而明确的下载waiters仍拥有其目标文件。（#64558）感谢 @Pearcekieser。
- Browser/Chrome：当 `browser.noSandbox` 启用时停止传递冗余 `--disable-setuid-sandbox`；`--no-sandbox` 仍是有效的沙箱选择退出。（#67939）感谢 @sebykrueger。
- Browser/client：停止在瞬态超时或取消失败后告诉代理永久避免浏览器；仅为持续不可用/速率限制情况保持no-retry提示。（#46505）感谢 @jriff。
- Browser/aria快照：当Playwright可用时，通过后端DOM ID将 `format=aria` `axN` 引用绑定到实时DOM节点，使后续浏览器操作可以使用这些引用而不会超时。（#62434）感谢 @MrKipler。
- Telegram：防止同一bot令牌的重复进程内long pollers，并为外部重复pollers添加更清晰的 `getUpdates` 冲突诊断。修复 #56230。感谢 @Co-Messi。
- Browser/Linux：在要求用户设置 `browser.executablePath` 之前，检测 `/opt/google`、`/opt/brave.com`、`/usr/lib/chromium` 和 `/usr/lib/chromium-browser` 下的Chromium-based安装。（#48563）感谢 @lupuletic。
- Sessions/浏览器：当空闲、每日、`/new` 或 `/reset` 会话滚动存档上一个记录时，关闭跟踪的浏览器标签页，防止标签页泄漏到旧会话之外。感谢 @jakozloski。
- Sessions/分叉：当缓存总数陈旧或缺失时，回退到transcript估算的父token计数，使超尺寸线程分叉开始fresh而不是克隆完整父记录。感谢 @jalehman。
- OpenAI/Codex：通过顶级 `instructions` 发送Codex Responses系统提示，同时保留现有原生Codex有效载荷控件。
- MCP/CLI：在一次性 `openclaw agent` 和 `openclaw infer model run` 网关/本地执行结束时退役捆绑MCP运行时，使重复脚本运行不会累积stdio MCP子进程。修复 #71457。感谢 @spartoviMD。
- OpenAI/Codex图像生成：在调用 `gpt-image-2` 之前将遗留 `openai-codex.baseUrl` 值（如 `https://chatgpt.com/backend-api`）规范化为Codex Responses后端，与聊天传输匹配。修复 #71460。感谢 @GodsBoy。
- Control UI：使 `/usage` 使用新鲜上下文快照来计算上下文百分比，并在使用概述缓存命中率分母中包含缓存写入token。修复 #47885。感谢 @imwyvern 和 @Ante042。
- GitHub Copilot：在重放期间保留加密的Responses reasoning item ID，使Copilot可以跨请求验证加密的reasoning有效载荷。（#71448）感谢 @a410979729-sys。
- GitHub Copilot：无论 `encrypted_content` 是否存在都不重写连接绑定reasoning item ID，修复 `gpt-5.3-codex` 和未来Codex模型的400"加密内容item_id不匹配"错误，这些模型通过 `reasoning: false` 的前向兼容catch-all回落。同时识别Codex命名的模型为reasoning-capable，使它们继承正确的能力标志。引用 #68735。感谢 @InvalidPandaa。
- Agents/回复：当流式助手块仅包含空白时恢复最终答案文本，防止完成轮次显示为空有效载荷错误。修复 #71454。（#71467）感谢 @Sanjays2402。
- 飞书/TTS：在发送原生飞书音频气泡之前将语音意图MP3和其他音频回复转码为Ogg/Opus，同时将普通MP3附件保留为文件。修复 #61249 和 #37868。感谢 @sg1416-zg 和 @ycjlb2023-peteryi。
- WhatsApp/TTS：在发送PTT语音笔记之前将MP3/WebM音频（包括Microsoft Edge TTS输出）转码为Ogg/Opus。
- QQBot/TTS：通过将TTS合成为原生QQ语音消息来遵守纯 `audioAsVoice` 回复，并将入站纯语音消息标记为音频媒体，而不向通用媒体上下文暴露原始语音路径。
- Providers/SenseAudio：通过 `tools.media.audio` 添加捆绑SenseAudio批量音频转录，支持 `SENSEAUDIO_API_KEY` 认证。（#66943）感谢 @Fl0rencess720。
- Providers/MiniMax：让TTS在回退到 `MINIMAX_API_KEY` 之前使用MiniMax portal OAuth和Token Plan凭证，并包含当前TTS HD模型ID。修复 #55017。感谢 @zx15210404690-hash。
- Telegram/webhook：在运行bot中间件之前确认已验证的webhook更新，使慢速代理轮次不会触发Telegram传递重试，同时保持per-chat处理通道。修复 #71392。感谢 @joelforsberg46-source。
- MCP/配置重载：通过处置缓存会话MCP运行时热应用 `mcp.*` 更改，并在网关关闭期间处置捆绑MCP运行时，使移除的 `mcp.servers` 条目立即回收子进程。修复 #60656。感谢 @xieyuanqing。
- Active Memory：保持静默recall子代理计费/授权失败不在共享auth-profile冷却状态之外，使Claude CLI额外使用拒绝不会禁用正常Claude支持的轮次。修复 #71284。（#71539）感谢 @vishutdhar 和 @obviyus。
- Auth/Claude CLI：将刷新的Claude CLI OAuth凭证同步到托管auth配置文件，使长期运行的Claude CLI运行停止回退到陈旧OpenClaw快照。（#70902）感谢 @starvex。
- Sessions：在当前渠道无法绑定子代理线程时，让 `sessions_spawn(mode="session")` 错误命名可用替代方案。修复 #67400。（#67790）感谢 @stainlu。
- Agents/Claude CLI：通过Claude的prompt-file标志传递OpenClaw系统提示，使Windows运行避免argv长度失败而不改变系统提示语义。修复 #69158。（#69211）感谢 @skylee-01、@cassioanorte、@Syu0 和 @Stache73。
- Agents/CLI会话：将 `google-gemini-cli` 会话auth-epoch绑定到 `~/.gemini/oauth_creds.json` 中的Google账户身份，使Gemini支持的代理在网关重启后恢复对话而不是生成新会话，并在已认证Google账户更改时使陈旧绑定失效。修复 #70973。（#71076）感谢 @openperf。
- Slack：停止将助手编写消息编辑块中的用户提及视为发送者属性，防止编辑的机器人消息欺骗被提及的DM用户。（#71700）感谢 @vincentkoc。
- Codex：在未经授权的绑定对话入站声明能够传递到其他声明处理程序或进入Codex轮次之前消耗它们。（#71702）感谢 @vincentkoc。
- Codex媒体理解：为有界图像worker需要批准检查的app-server图像轮次，同时明确拒绝工具、文件、权限和elicitation批准请求。（#71703）感谢 @vincentkoc。
- Agents/Claude CLI：允许大型实时 `stream-json` JSONL行达到现有每轮原始限制，防止大型Telegram、WebChat、MCP和图像轮次在旧stdout缓冲区上限上中止。修复 #71793、#71080 和 #70766。（#71897）感谢 @chacher86、@shivamgrover21 和 @tpjordan。
- Agents/Claude CLI：在CLI JSON输出中展开嵌套Claude结果信封，使委托代理响应显示为最终文本而不是原始结果JSON。（#66819）感谢 @mraleko。
- Agents/Claude CLI：当启用 `context1m` 时，将配置的1M上下文窗口覆盖应用于符合条件的Claude CLI Opus和Sonnet模型。（#70863）感谢 @bidadh。
- Models/status：报告新鲜的Claude CLI原生auth，而不是本地凭证最新时陈旧存储的 `anthropic:claude-cli` profile过期。修复 #71256。（#71332）感谢 @matthiasjanke 和 @neeravmakwana。
- CLI后端：在超预算CLI轮次后压缩OpenClaw记录，并从压缩记录而不是陈旧外部恢复状态重新种子新鲜CLI会话。修复 #68329。（#71916）感谢 @obviyus。
- Telegram：当答案预览流被禁用时保持默认工具进度消息可见。（#71825）感谢 @VACInc。
- Configure/models：在更新模型选择器allowlist时清除取消选择的模型回退，包括提供商范围的设置流程。（#71596）感谢 @rubencu。
- Agents/流式传输：在发出面向用户的文本之前，从流式助手回复中剥离命名空间 `<antml:thinking>` reasoning标签。（#69288）感谢 @xialonglee。
- Agents/流式传输：当流式助手块仅包含空白时恢复最终答案文本，防止已完成的轮次显示为空负载错误。修复 #71454。（#71467）感谢 @Sanjays2402。
- Feishu/TTS：在发送原生 Feishu 音频气泡之前将语音意图 MP3 和其他音频回复转码为 Ogg/Opus，同时将普通 MP3 附件保留为文件。修复 #61249 和 #37868。感谢 @sg1416-zg 和 @ycjlb2023-peteryi。
- WhatsApp/TTS：将 MP3/WebM 音频（包括 Microsoft Edge TTS 输出）转码为 Ogg/Opus，然后再发送 PTT 语音笔记。
- QQBot/TTS：通过合成 TTS 到原生 QQ 语音消息来支持纯 `audioAsVoice` 回复，并将入站纯语音消息标记为音频媒体，而不向通用媒体上下文暴露原始语音路径。
- Providers/SenseAudio：通过 `tools.media.audio` 添加捆绑的 SenseAudio 批量音频转录，支持 `SENSEAUDIO_API_KEY` 认证。（#66943）感谢 @Fl0rencess720。
- Providers/MiniMax：让 TTS 在回退到 `MINIMAX_API_KEY` 之前优先使用 MiniMax portal OAuth 和 Token Plan 凭证，并包含当前 TTS HD 模型 ID。修复 #55017。感谢 @zx15210404690-hash。
- Telegram/webhook：在运行 bot 中间件之前确认已验证的 webhook 更新，使慢速 agent 轮次不会在 Telegram 传递重试时翻车，同时保留每聊天处理通道。修复 #71392。感谢 @joelforsberg46-source。
- MCP/config reload：通过处置缓存的会话 MCP runtime 来热应用 `mcp.*` 更改，并在网关关闭期间处置捆绑的 MCP runtime，使移除的 `mcp.servers` 条目能够及时回收子进程。修复 #60656。感谢 @xieyuanqing。
- Active Memory：将静默召回子代理计费/认证失败排除在共享认证配置冷却状态之外，使 Claude CLI 额外使用拒绝不会禁用正常的 Claude 支持轮次。修复 #71284。（#71539）感谢 @vishutdhar 和 @obviyus。
- Auth/Claude CLI：将刷新的 Claude CLI OAuth 凭证同步到托管认证配置，使长时间运行的 Claude CLI 运行停止回退到过时的 OpenClaw 快照。（#70902）感谢 @starvex。
- Sessions：使 `sessions_spawn(mode="session")` 错误在当前通道无法绑定子代理线程时命名可用的替代方案。修复 #67400。（#67790）感谢 @stainlu。
- Agents/Claude CLI：通过 Claude 的 prompt-file 标志传递 OpenClaw 系统提示，使 Windows 运行避免 argv 长度失败而不改变系统提示语义。修复 #69158。（#69211）感谢 @skylee-01、@cassioanorte、@Syu0 和 @Stache73。
- Agents/CLI sessions：将 `google-gemini-cli` 会话 auth-epoch 绑定到 `~/.gemini/oauth_creds.json` 中的 Google 账户身份，使 Gemini 支持的 agent 在网关重启后恢复对话，而不是创建新的会话，并在认证的 Google 账户更改时使过时的绑定失效。修复 #70973。（#71076）感谢 @openperf。
- Slack：停止将 assistant 编写的消息编辑块中的用户提及视为发送者属性，防止编辑的 bot 消息欺骗被提及的 DM 用户。（#71700）感谢 @vincentkoc。
- Codex：在未经授权的绑定对话入站声明能够传递到其他声明处理程序或入队 Codex 轮次之前消耗它们。（#71702）感谢 @vincentkoc。
- Codex 媒体理解：在为有界图像 worker 明确拒绝工具、文件、权限和询问批准请求的同时，需要批准检查的 app-server 图像轮次。（#71703）感谢 @vincentkoc。
- Agents/Claude CLI：允许高达现有每轮原始限制的大型实时 `stream-json` JSONL 行，防止大型 Telegram、WebChat、MCP 和图像轮次在旧 stdout 缓冲区上限时中止。修复 #71793、#71080 和 #70766。（#71897）感谢 @chacher86、@shivamgrover21 和 @tpjordan。
- Agents/Claude CLI：在 CLI JSON 输出中展开嵌套的 Claude 结果信封，使委托的 agent 回复显示为最终文本而不是原始结果 JSON。（#66819）感谢 @mraleko。
- Agents/Claude CLI：当启用 `context1m` 时，将配置的 1M 上下文窗口覆盖应用于符合条件的 Claude CLI Opus 和 Sonnet 模型。（#70863）感谢 @bidadh。
- Models/status：报告新鲜的 Claude CLI 原生认证，而不是在本地凭证最新时报告过时的存储 `anthropic:claude-cli` profile 过期。修复 #71256。（#71332）感谢 @matthiasjanke 和 @neeravmakwana。
- CLI 后端：在超出预算的 CLI 轮次后压缩 OpenClaw 记录，并从压缩记录而不是过时的外部恢复状态重新种子新鲜的 CLI 会话。修复 #68329。（#71916）感谢 @obviyus。
- Telegram：当答案预览流被禁用时保持默认工具进度消息可见。（#71825）感谢 @VACInc。
- Configure/models：在更新模型选择器允许列表时清除取消选择的模型回退，包括提供商范围的设置流程。（#71596）感谢 @rubencu。
- Agents/流式传输：在发出面向用户的文本之前，从流式 assistant 回复中剥离带命名空间的 `<antml:thinking>` reasoning 标签。（#69288）感谢 @xialonglee。

## 🚀 v2026.4.24 (2026年4月25日)

### 亮点

- Google Meet 作为捆绑的参与者在插件加入 OpenClaw，支持个人 Google 认证、Chrome/Twilio 实时会话、配对节点 Chrome 支持、工件/出席记录导出，以及对已打开的 Meet 标签页的恢复工具。
- DeepSeek V4 Flash 和 V4 Pro 已加入捆绑目录，V4 Flash 为默认 onboarding 模型，DeepSeek thinking/replay 行为已修复，可用于后续工具调用轮次。
- Talk、Voice Call 和 Google Meet 可使用实时语音循环，该循环会咨询完整的 OpenClaw agent 以获得更深入的工具有支撑的回答。
- 浏览器自动化新增坐标点击、更长的默认操作预算、每个配置文件的 headless 覆盖，以及更稳定的标签页复用/恢复。
- 插件和模型基础设施在启动时更轻量：静态模型目录、manifest 驱动的模型行、延迟的 provider 依赖，以及打包安装的外部运行时依赖修复。

### ⚠️ Breaking Changes

- 插件 SDK/工具结果转换：移除 Pi 专用的 `api.registerEmbeddedExtensionFactory(...)` 兼容性路径。捆绑的工具结果重写必须使用 `api.registerAgentToolResultMiddleware(...)` 与 `contracts.agentToolResultMiddleware` 声明目标 harness，使转换在 Pi 和 Codex app-server 动态工具中运行一致。感谢 @vincentkoc。

### ✨ 新增功能与改进

- Control UI/Talk：新增基于 OpenAI Realtime 的浏览器 WebRTC 实时语音会话，由 Gateway 签发的临时客户端密钥和 `openclaw_agent_consult` 移交给完整的 OpenClaw agent 提供支持。
- 插件/Google Meet：新增捆绑的参与者插件，支持个人 Google 认证、显式会议 URL 加入、Chrome 和 Twilio 实时传输、配对节点 `chrome-node` 支持（适用于 Parallels 风格的 Chrome/BlackHole/SoX 主机），以及在实时语音会话内进行全 agent 咨询。（#70765）
- 插件/Google Meet：新增会议记录、录制、转录、智能笔记和参与者会话的工件和出席工作流，包括 markdown/文件输出、最新记录查找和 `--all-conference-records` 历史扫描。
- 插件/Google Meet：新增 OAuth 和浏览器状态 doctor/恢复流程，包括 `googlemeet doctor --oauth` 和 `recover_current_tab`/`recover-tab`，使 agent 可以检查已打开的 Meet 标签页而不会重复打开。
- 插件/Voice Call：暴露共享的 `openclaw_agent_consult` 实时工具，使实时电话可以向完整的 OpenClaw agent 请求更深入/工具有支撑的回答。
- 插件/Voice Call：新增 `voicecall setup` 和默认 dry-run 的 `voicecall smoke` 命令，以便在拨打实际测试电话前检查 Twilio/provider 的就绪状态。
- Providers/Google：新增 Gemini Live 实时语音 provider，用于后端 Voice Call 和 Google Meet 音频桥接，支持双向音频和函数调用。
- Providers/Google：让 Gemini TTS 在配置的 `audioProfile` 和 `speakerName` 提示文本前添加，以实现可复用的语音风格控制。感谢 @tdack。
- Gateway/VoiceClaw：新增由 Gemini Live 支撑的实时 brain WebSocket 端点，具有所有者认证门控和异步 OpenClaw 工具移交。（#70938）感谢 @yagudaev。
- Control UI：优化 agent 工具访问面板，包含紧凑的实时工具芯片、可折叠的工具分组、直接的逐工具开关，以及更清晰的运行时/来源归属。（#71405）感谢 @BunsDev。
- Control UI/聊天：在排队消息上新增 Steer 操作，以便浏览器后续操作可以注入到活跃运行中而无需重新输入。
- 浏览器：新增视口坐标点击，用于托管和现有会话自动化，以及 `openclaw browser click-coords` 供 CLI 使用。（#54452）感谢 @dluttz。
- 浏览器：新增 `browser.actionTimeoutMs` 并使用 60 秒默认操作预算，使健康的长时间浏览器等待不会在客户端传输边界失败。（#62589）感谢 @andyylin。
- 浏览器/配置：支持每个配置文件 `browser.profiles.<name>.headless` 覆盖，用于本地启动的浏览器配置文件，这样一个配置文件可以 headless 运行而不会强制所有浏览器配置文件都 headless。感谢 @nakamotoliu。
- Matrix：要求完整的交叉签名身份信任以进行自我设备验证，并新增 `openclaw matrix verify self`，使操作员可以从 CLI 建立该信任。（#70401）感谢 @gumadeiras。
- Gradium：新增捆绑的文本转语音 provider，支持语音笔记和电话输出。（#64958）感谢 @LaurentMazare。
- Memory-core/混合搜索：在混合内存搜索结果上与组合 `score` 并列暴露原始 `vectorScore` 和 `textScore`，使调用者可以在时间衰减或 MMR 重新排序前检查向量与文本检索的贡献。修复 #68166。（#68286）感谢 @ajfonthemove。
- 依赖项/memory：默认不再安装 `node-llama-cpp`；本地嵌入现在仅在操作员安装可选运行时包时才加载它。感谢 @vincentkoc。
- Providers/DeepSeek：在捆绑目录中新增 DeepSeek V4 Flash 和 V4 Pro，并使 V4 Flash 成为 onboarding 默认模型。感谢 @lsdsjy。
- 依赖项/Pi：将捆绑的 Pi 包更新至 `0.70.2`，使用 Pi 上游的 `gpt-5.5` 和 DeepSeek V4 目录元数据，并仅保留本地 `gpt-5.5-pro` 前向兼容处理。感谢 @lsdsjy。
- Models/CLI：使用捆绑 provider 的安全静态目录加速模型列表收窄行源编排，并为默认 `openclaw models list` 减少广泛注册表枚举。（#70632、#70883、#70867）感谢 @shakkernerd。
- Models/命令：弃用 `/models add`，使聊天尝试现在返回弃用消息而非写入模型配置，并从 `/models` provider 菜单中移除 add 操作。（#71175）感谢 @Takhoffman。
- Models/目录：新增 manifest 源模型行、重复 provider/model 冲突报告，以及共享的 `src/model-catalog` 规范化，用于 provider 索引、缓存、onboarding 和列表消费者而无需加载 provider 运行时。（#71368、#71360）感谢 @shakkernerd。
- Codex harness/上下文引擎：在 Codex app-server 会话中运行上下文引擎引导、组装、轮次后维护和引擎拥有的压缩，同时保持原生 Codex 线程状态和压缩可审计。（#70809）感谢 @jalehman。
- Codex 运行时计划：整合 contract-first Pi/Codex 对等覆盖，并在 app-server 配置文件登录和刷新路径中接受遗留的 Codex auth-provider 别名。（#71096）感谢 @100yenadmin。
- Codex harness：将 Codex 原生工具钩子桥接到 OpenClaw 插件钩子和审批中，具有有限的中继有效载荷和审批防刷保护。（#71008）感谢 @pashpashpash。
- 插件 SDK/Codex harness：新增 provider 自有的传输/认证/后续接缝和 harness 结果分类，使 Codex 风格的运行时可以参与回退策略而无需核心特殊处理。（#70772）感谢 @100yenadmin。
- Gateway/nodes：新增默认禁用的 `gateway.nodes.pairing.autoApproveCidrs`，用于来自明确可信 CIDR 的首次节点配对，同时保持操作员/浏览器配对和所有升级流程手动。感谢 @sahilsatralkar。
- WebChat/会话：将仅运行时的提示上下文排除在可见的会话历史记录外，并从会话历史记录界面清除遗留包装器。感谢 @91wan。
- Agents/bootstrap：新增 `agents.defaults.contextInjection: "never"`，用于禁用工作区引导文件注入，适用于完全拥有自身提示生命周期的 agent。（#65006）感谢 @xDarkicex。
- 插件/manifest：新增 `modelCatalog` contract，用于 provider 自有的模型行、别名、抑制规则和发现模式元数据，而无需加载插件运行时。（#71342）感谢 @shakkernerd。
- 插件/setup：遵守显式的 `setup.requiresRuntime: false` 作为仅描述符的 setup contract，同时将省略值保持在遗留 setup-api 回退路径上。感谢 @vincentkoc。
- 插件/setup：当 setup-api 注册与 `setup.providers` 或 `setup.cliBackends` 不一致时，报告描述符/运行时漂移，而不拒绝遗留 setup 插件。感谢 @vincentkoc。
- 插件/setup：在通用 provider auth/env 查找中包含 `setup.providers[].envVars`，并警告仍依赖已弃用 `providerAuthEnvVars` 兼容性元数据的非捆绑插件。感谢 @vincentkoc。
- 插件/setup：在回退到 setup 运行时前，从描述符安全的 `setup.providers[].authMethods` 派生通用 provider setup 选择。感谢 @vincentkoc。
- 插件/setup：在回退到 setup 运行时或安装目录选择前，直接在 provider setup 流程中显示 manifest provider auth 选择。感谢 @vincentkoc。
- 插件/setup：当描述符-only setup 插件仍包含被忽略的 setup 运行时条目时发出警告，保持 `setup.requiresRuntime: false` 语义明确而不破坏现有元数据。感谢 @vincentkoc。
- 插件/channels：当没有 setup 条目可用或 setup 描述符声明运行时不必要时，使用 manifest `channelConfigs` 进行只读外部渠道发现。感谢 @vincentkoc。
- 插件钩子：在消息钩子上下文和运行生命周期事件上暴露一级的运行、消息、发送者、会话和跟踪关联字段。感谢 @vincentkoc。
- 插件/PDF：将本地 PDF 提取移入捆绑的 `document-extract` 插件，使核心不再拥有 `pdfjs-dist` 或 PDF 图像渲染依赖。感谢 @vincentkoc。
- Providers/Anthropic Vertex：将 Vertex SDK 运行时移至捆绑的 provider 插件后，使核心不再拥有该 provider 特定依赖。感谢 @vincentkoc。
- 插件/激活：暴露激活计划原因和更丰富的计划 API，使调用者可以检查为何选择了某个插件，同时保留现有的 id-list 激活行为。（#70943）感谢 @vincentkoc。
- 插件/源元数据：在 provider 和 channel 目录上暴露规范化的安装源信息，使 onboarding 可以在运行时加载前解释 npm 固定、本地可用性状态和本地可用性。（#70951）感谢 @vincentkoc。
- 插件/目录：将官方外部 WeCom 渠道源固定到精确的 npm 发布版本加 dist 完整性，并设置保护以使官方外部源保持完整性固定。（#70997）感谢 @vincentkoc。
- 插件/源元数据：当 `openclaw.install.defaultChoice` 无效或指向缺失的源时发出警告，保持目录诊断明确而不破坏现有插件。感谢 @vincentkoc。
- 插件/源元数据：当 `openclaw.install.expectedIntegrity` 存在但没有有效 npm 源时发出警告，保持孤立的完整性元数据可见而不拒绝现有插件。感谢 @vincentkoc。
- 插件/源元数据：当 provider 或 channel 目录包身份与 `openclaw.install.npmSpec` 漂移时发出警告，保持诊断可见而不拒绝兼容的外部目录。感谢 @vincentkoc。
- 插件/Bonjour：将 LAN Gateway 发现广播移入默认启用的捆绑插件，拥有自己的 `@homebridge/ciao` 依赖户以使用户可以在不切断广域网发现的情况下禁用 Bonjour。感谢 @vincentkoc。
- 插件/兼容性：新增插件兼容性注册表和 SDK/配置/setup/运行时弃用记录文档，包括遗留 harness 命名和其他插件面向别名的带日期迁移元数据。感谢 @vincentkoc。
- TUI/依赖项：从 OpenClaw TUI 代码块渲染器中移除直接 `cli-highlight` 使用，保持主题化代码着色而无需额外根依赖。感谢 @vincentkoc。
- 依赖项/SBOM：新增基于所有权的依赖风险报告，覆盖根闭包大小、本机/构建风险包和缺失所有者记录。感谢 @vincentkoc。
- 诊断/OTEL：将运行、模型调用和工具执行诊断生命周期事件导出为 OTEL 跨度，而不保留活跃跨度状态。感谢 @vincentkoc。
- 诊断/OTEL：接受 opt-in `diagnostics.otel.captureContent` 控制，用于未来的模型/工具内容跨度属性，同时默认禁用原始内容导出。感谢 @vincentkoc。
- 诊断/OTEL：新增轻量级诊断 trace-context 载体，用于未来跨度关联而不向核心添加 OTEL SDK 状态。感谢 @vincentkoc。
- 诊断/OTEL：将诊断跟踪上下文附加到导出的 OTEL 日志中，使日志记录可以与未来跨度关联而不添加保留的处理状态。感谢 @vincentkoc。
- 诊断/OTEL：通过验证的上下文将不可变的每运行诊断 trace-context 传递到 agent 和工具钩子上下文，并让导出的诊断跨度以之为主父，而不保留全局跟踪状态。感谢 @vincentkoc。
- 诊断/OTEL：使 exporter 启动重启安全，使配置重载不会保留过时的 SDK、日志传输或诊断事件监听器。感谢 @vincentkoc。
- 诊断/OTEL：发出有界的 exec-process 诊断并将其导出为 `openclaw.exec` 跨度，而不暴露命令文本、工作目录或容器标识符。（#70424）感谢 @jlapenna。
- 诊断/OTEL：支持 `OPENCLAW_OTEL_PRELOADED=1`，使插件可以重用已注册的 OpenTelemetry SDK，同时保持 OpenClaw 诊断监听器连接。（#70424）感谢 @jlapenna。
- 诊断：发出具有跟踪上下文、计时和去敏错误元数据的结构化工具执行诊断事件。感谢 @vincentkoc。
- 诊断：发出具有跟踪上下文、持续时间和非消息错误元数据的结构化运行和模型调用诊断事件。感谢 @vincentkoc。
- CLI/Gateway：通过在只读状态路径上跳过插件加载，使 `gateway status` 启动更快。（#71364）感谢 @andyylin。

### 🐛 问题修复

- 打包安装：当捆绑插件运行时镜像回退到复制共享块时，保留包根运行时依赖及其导出的子路径，修复 Windows npm 更新可能无法加载复制的 `dist` 模块的问题。
- 心跳：通过共享的安全定时器帮助程序限制超大的调度器延迟，防止 `every` 值超过 Node 超时上限而变为 1 毫秒崩溃循环。修复 #71414。（#71478）感谢 @hclsys。
- Agents/心跳：停止向非心跳运行注入心跳系统提示，防止普通用户回复被抑制为 `HEARTBEAT_OK` 确认。修复 #69079。（#69278）感谢 @stainlu。
- MCP：在运行结束时退役一次性嵌入式捆绑 MCP 运行时；当运行时工具允许列表无法触及 bundle-MCP 工具时跳过 bundle-MCP 启动；新增 `mcp.sessionIdleTtlMs` 空闲驱逐用于泄漏会话运行时。修复 #71106、#71110、#70389 和 #70808。
- Gateway/重启延续：在删除重启标记前将重启延续持久化地移交给会话传递队列；在崩溃重启后恢复排队的延续工作；当没有通道路由在重启后存活时回退到仅会话唤醒。（#70780）感谢 @fuller-stack-dev。
- Agents/工具结果修剪：加强工具结果字符估算器和上下文修剪循环，抵御由 void 或未定义工具处理程序结果创建的非标准 `{ type: "text" }` 块，将非字符串文本有效载荷序列化以进行大小计算，使它们不会以零大小绕过修剪。修复 #34979。（#51267）感谢 @cgdusek。
- Daemon/service-env：将 Nix Home Manager 配置 bin 目录添加到 macOS 和 Linux 上生成的 gateway service PATH，遵守从右到左的 `NIX_PROFILES` 优先级，并在未设置时回退到 `~/.nix-profile/bin`。修复 #44402。（#59935）感谢 @jerome-benoit。
- 飞书：在 HTTP 400 启动失败后回退流式卡片创建，使不支持的卡片设置回退而不延迟每条消息。修复 #56981。感谢 @JinnanDuan。
- 飞书/主题群组：通过 `thread_id` 对原生飞书/Lark 主题群会话进行键控，使起始消息和具有不同 `root_id` 格式的回复保持在同一个 `group_topic` 对话中。修复 #71438。感谢 @1335848090。
- 飞书：当空闲在最终有效载荷到达前关闭流式卡片时，抑制重复的最终卡片传递。（#68491）感谢 @MoerAI。
- Signal：保留发送者附件文件名并从这些文件名解析缺失的 MIME 类型，使没有 `contentType` 的 Linux `signal-cli` 语音笔记仍能进入音频转录。修复 #48614。感谢 @mindfury。
- Telegram/agents：在回复已通过消息工具提交后，抑制幻影"Agent 无法生成回复"回退。（#70623）感谢 @chinar-amrutkar。
- Models/CLI：在 `openclaw models list` 中在原生 `contextWindow` 旁显示 provider 运行时 `contextTokens`，并将 `openai-codex/gpt-5.5` 与 Codex 的 272K 运行时上限和 400K 原生窗口对齐。修复 #71403。
- 仪表板/安全：避免将令牌化的 Control UI URL 或 SSH 提示写入运行时日志，使 gateway bearer 片段不会出现在可通过 `logs.tail` 读取的控制台捕获日志中。（#70029）感谢 @Ziy1-Tan。
- Providers/OpenRouter：将 DeepSeek refs 视为符合缓存 TTL 条件而不注入 Anthropic 缓存控制标记，使上下文修剪与 OpenRouter 管理的提示缓存对齐。（#51983）感谢 @QuinnH496。
- Control UI/浏览器：延迟 Node-only 临时目录解析运行后才访问临时目录访问模式常量，防止浏览器包在 `node:fs` 常量被存根时崩溃。（#48930）感谢 @Valentinws。
- Discord/cron：从规范最终助手文本一次性传递仅文本的隔离 cron 和心跳 announce 输出，避免当流式块有效载荷和最终答案包含相同内容时出现重复的 Discord 帖子。修复 #71406。感谢 @alexgross21。
- macOS Gateway：在引导修复回退前等待 launchd 重新加载已退出的 Gateway LaunchAgent，防止配置触发的重启使服务未加载。修复 #45178。感谢 @vincentkoc。
- macOS Gateway：容忍 launchctl bootstrap 在重启回退期间已加载退出，并在 bootstrap 后使用非杀死 kickstart，避免可能卸载 LaunchAgent 的第二次竞争。修复 #41934。感谢 @zerone0x。
- macOS Gateway：在重启回退 bootstrap 前重写过时的 LaunchAgent plist，在 `gateway restart` 必须重新注册 launchd 时匹配安装修复行为。感谢 @maybegeeker。
- TTS/钩子：为 `message_sending` 和 `message_sent` 钩子保留仅音频 TTS 转录本，而不将转录本渲染为媒体字幕。感谢 @zqchris。
- WhatsApp/TTS：在共享媒体有效载荷发送和 WhatsApp 出站适配器中保留 `audioAsVoice`，使 `[[audio_as_voice]]` 回复有效载荷在通过 `sendPayload` 路由时保持语音笔记意图。修复 #66053。感谢 @masatohoshino。
- Control UI/WebChat：从可见聊天历史中隐藏心跳提示、`HEARTBEAT_OK` 确认和仅内部运行时上下文轮次，同时保持底层会话记录完整。修复 #71381。感谢 @gerald1950ggg-ai。
- Control UI/聊天：当最终历史刷新短暂返回较旧快照时，保持乐观的用户和助手尾消息可见，防止消息卡片在下次刷新前闪烁消失。修复 #71371。感谢 @WolvenRA。
- Talk/TTS：从活跃运行时注册表而非 provider-list 发现中解析配置的扩展语音 provider，使 Talk 模式不再将有效插件语音 provider 拒绝为不支持。
- 会话/子代理：停止让过时的已结束运行和旧的仅存储子反向链接在 `childSessions` 中重新出现，同时保持活跃后代和最近结束的子项可见。修复 #57920。
- 子代理：在可恢复的等待传输失败后恢复子会话，而不暴露额外的等待状态，并保持终端生命周期计时器顺序确定性。（#71423）感谢 @ZiPengWei。
- 子代理：停止让过时的未结束运行永远计为活跃或待处理，同时为可恢复的子会话保留 restart-aborted 恢复。修复 #71252。感谢 @hclsys。
- Gateway/工具：允许 `POST /tools/invoke` 到达插件支撑的目录工具（如 `browser`），当没有核心实现存在时，同时仍优先为真实核心名称使用内置工具。感谢 @chat2way。
- 浏览器/安全：对 `browser.request` gateway 方法要求 `operator.admin`，与该路由暴露的主机/浏览器节点控制权限匹配。感谢 @RichardCao。
- 浏览器/配置文件：允许本地托管配置文件覆盖 `browser.executablePath`，使不同配置文件可以启动不同的基于 Chromium 的浏览器。感谢 @nobrainer-tech。
- Agents/replay：在严格 provider replay 前修复移位或缺失的工具结果，为 OpenAI Responses 历史使用 Codex 兼容的 `aborted` 输出，并在重试前丢弃部分 abort/error 传输轮次。
- 浏览器/启动：对每个配置文件对并发延迟启动调用进行去重，使同时的浏览器工具请求不再竞争导致重复的 Chrome 启动和 `PortInUseError`。（#61772）感谢 @sukhdeepjohar。
- 浏览器/配置文件：通过清除已死/外来锁并重试一次启动来从崩溃或主机迁移后的过时 Chromium `Singleton*` 配置文件锁中恢复。感谢 @seanc-dev。
- 浏览器/现有会话：保持 Chrome MCP 状态探测仅传输且短暂，并将过时缓存的 Playwright 附加重试一次，使空闲配置文件检查不再污染下一次真实附加。（#57245）感谢 @josephbergvinson。
- Cron/exec：仅为具有 `delivery.mode="none"` 的静默 cron 作业抑制自动后台 exec 完成唤醒，同时保持 webhook 和 announce 运行可观察。（#71391）感谢 @goldmar。
- 回复媒体：允许沙盒化回复传递 OpenClaw 托管的 `media/outbound` 和 `media/tool-*` 附件，而不将其视为沙盒转义，同时在托管媒体根上保持别名转义检查。修复 #71138。感谢 @mayor686、@truffle-dev 和 @neeravmakwana。
- CLI/agent：保留 `openclaw agent --json` stdout 用于 JSON 响应，在执行开始前将 gateway、插件和嵌入式回退诊断路由到 stderr。修复 #71319。
- Agents/Gemini：重试仅推理、空和仅计划的 Gemini 轮次，而非让会话静默停滞。修复 #71074。（#71362）感谢 @neeravmakwana。
- Providers/DeepSeek：为 DeepSeek V4 thinking 启用时，重放的助手工具调用轮次添加缺失的 `reasoning_content` 占位符，使将现有会话切换到 `deepseek-v4-flash` 或 `deepseek-v4-pro` 不再触发 provider 的 400 重放检查。修复 #71372。感谢 @yangyang1719。
- Exec 审批：允许裸命令名允许列表模式匹配 PATH 解析的可执行文件名，而不信赖 `./tool` 或绝对路径选择的二进制文件。修复 #71315。感谢 @chen-zhang-cs-code 和 @dengluozhang。
- 配置/恢复：当无效性仅作用域 `plugins.entries.*` 时跳过整文件最后已知良好回滚，在插件模式或主机版本偏斜期间保留不相关的用户设置。修复 #71289。感谢 @jalehman。
- Agents/工具：保持解析后的回复运行配置不被过时的运行时快照覆盖，并让空的 Web 运行时元数据回退到配置的 provider 自动检测，使标准和排队轮次暴露相同的工具集。修复 #71355。感谢 @c-g14。
- Agents/TTS：将解析后的共享配置传递到 `tts` 工具中，使工具触发的语音使用配置的 provider 和语音，而非回退到新的配置加载。
- 回复媒体：当同一媒体已通过块流发送时，从最终回复中剥离 `MEDIA:` 附件，防止重复的 Telegram 语音笔记和文件。修复 #65468。感谢 @aurora-openclaw。
- Agents/TTS：当工具生成的回复与精确的 `NO_REPLY` 标记配对时保留语音媒体，剥离标记文本而非丢弃音频有效载荷。修复 #66092。
- 压缩：为手动 `/compact` 遵守显式的 `agents.defaults.compaction.keepRecentTokens`，重新提取安全摘要而非累积先前摘要，并默认启用安全摘要质量检查。修复 #71357。感谢 @WhiteGiverMa。
- 会话：在负载时维护期间遵守配置的 `session.maintenance` 设置，而非回退到默认条目上限。修复 #71356。感谢 @comolago。
- 浏览器/沙盒：将解析后的 `browser.ssrfPolicy` 传递到沙盒浏览器网桥，并在有效策略更改时刷新缓存的网桥，使沙盒化浏览器导航遵守私有网络 opt-in。修复 #45178。感谢 @jzakirov、@zuoanCo 和 @kybrcore。
- 浏览器/代理：保持 Gateway/provider 代理环境变量不代理 OpenClaw 托管的浏览器，使 `HTTP_PROXY` 和 `HTTPS_PROXY` 不再阻止普通浏览器导航。修复 #71358。感谢 @Sanjays2402。
- Agents/MCP：使用支持 draft-2020-12 的 bundle-MCP 客户端验证器验证 draft-2020-12 MCP 工具输出模式，使外部 MCP 服务器不再因缺失模式引用而无法执行目录/工具。修复 #68772 和 #70196。感谢 @mwiesen。
- 仪表板/Windows：通过系统 URL 处理程序打开 Control UI 和 OAuth URL，而无需通过 `cmd.exe` 解析或基于 PATH 的 `rundll32` 查找，并拒绝非 HTTP 浏览器打开输入。修复 #71098。感谢 @Sanjays2402。
- 配置/doctor：拒绝 SecretRef 凭证路径上遗留的 `secretref-env:<ENV_VAR>` 标记字符串，并将有效标记迁移到带 `openclaw doctor --fix` 的结构化 env SecretRefs。修复 #51794。感谢 @halointellicore。
- 插件 SDK/浏览器：通过浏览器配置文件外观导出解析后的浏览器标签清理配置类型，保持 SDK 子路径合约对齐。
- Providers/OpenAI：分离 API 密钥和 Codex 登录 onboarding 组，并在模型路由切换后避免重放过时的 OpenAI Responses 推理块。
- Providers/OpenAI-compatible：仅对用 `compat.supportsPromptCacheKey` opt-in 的 provider 在 Completions 请求上转发 `prompt_cache_key`，保持默认代理有效载荷不变。修复 #69272。
- Providers/OpenAI-compatible：从自定义 provider 跳过空或非对象流式块，而非在部分输出后使轮次失败。修复 #51112。
- Providers/OpenAI-compatible：将单一的 MLX 风格 `finish_reason: "tool_call"` 视为工具使用而非 provider 错误。修复 #61499。
- 文档/TTS：澄清遗留平面 TTS provider 配置块由 `openclaw doctor --fix` 修复，而非在加载时被严格运行时模式接受。修复 #56220。
- 插件/OpenCode：为 OpenCode 图像理解去除不支持的已禁用 Responses 推理有效载荷。修复 #70252。
- 插件/OpenCode/OpenCode Go：注册图像理解元数据，使图像工具可用于具有视觉支持的 OpenCode 目录模型。修复 #70482 和 #61789。
- 插件/OpenCode Go：将默认 Go 目录模型更新为 `opencode-go/kimi-k2.6`。感谢 @masrlinu。
- Providers/ElevenLabs：为 PCM 电话合成省略 MP3 专用 `Accept` 头，使 Voice Call 对 `pcm_22050` 的请求不再接收 MP3 音频。修复 #67340。感谢 @marcchabot。
- Providers/MiniMax TTS：在发送 T2A 请求前截断小数部分音调覆盖，与 MiniMax 的整数音调合约匹配，同时保留小数速度和音量。修复 #62144。
- Providers/MiniMax TTS：将语音笔记目标转码为 Opus，使飞书/Telegram 接收原生语音消息而非 MP3 文件附件。修复 #63540、#64134 和 #70445。
- Providers/Microsoft TTS：即使另一个语音插件已注册，仍使允许列表中的捆绑语音 provider 可被发现，使 Edge/Microsoft TTS 可与 OpenAI 并存。修复 #62117 和 #66850。
- Providers/Microsoft TTS：在将 Edge TTS 规范化为 Microsoft provider 后遵守遗留 `messages.tts.providers.edge` 语音设置。修复 #64153。
- Providers/OpenRouter：新增使用 OpenAI 兼容 `/audio/speech` 端点和 `OPENROUTER_API_KEY` 的 OpenRouter TTS provider。修复 #71268。
- macOS Talk 模式：在回退到系统语音前通过 gateway `talk.speak` 重试失败的本地 ElevenLabs 流播放，使配置的 ElevenLabs 语音在流播放失败时仍能播放。修复 #65662。
- 插件/Voice Call：默认回收过时的预应答呼叫，遵守配置的 TTS 超时用于 Twilio 媒体流播放，并将空电话音频失败而非完成为静音。修复 #42071；超越 #60957。感谢 @Ryce 和 @sliekens。
- 插件/Voice Call：当 Twilio、Telnyx 或 Plivo 将回退到 loopback/私有 webhook URL 时快速失败，使呼叫不会以不可达的回调端点开始。感谢 @artemgetmann。
- 插件/Voice Call：当 barge-in 或流拆解清除播放队列时解析排队但尚未播放的 Twilio TTS 条目，使等待 `queueTts()` 的呼叫者不再挂起。感谢 @kevinWangSheng。
- 插件/Voice Call：用 provider 终止过期的已恢复呼叫会话，并仅用剩余持续时间重启已恢复的最大持续时间计时器，防止 Gateway 重启后出现过时的出站重试循环。修复 #48739。感谢 @mira-solari。
- 插件/Voice Call：在 Telnyx 出站对话问候语后启动 provider STT，并将配置的 Telnyx 语音 ID 传递到 speak 操作。修复 #56091。感谢 @Roshan。
- 技能：当 `metadata.openclaw` 缺失时遵守遗留 `metadata.clawdbot` 要求和安装程序提示，使较旧的技能在缺失必需二进制文件时不再显示为就绪。修复 #71323。感谢 @chen-zhang-cs-code。
- 浏览器/配置：在 Chromium 启动前展开 `browser.executablePath` 中的 `~`，使 home-relative 自定义浏览器路径不再因 `ENOENT` 而失败。修复 #67264。感谢 @Quratulain-bilal。
- 渠道/流式传输：默认保持 Telegram 工具进度预览更新启用以匹配已发布行为，记录 `streaming.preview.toolProgress: false` 仅用于禁用那些状态行，并防止预览进度文本触发 Telegram Markdown 链接、Discord 提及或 Slack mrkdwn 提及。修复 #71320。感谢 @neeravmakwana。
- Gateway/会话：在原子重写前将超大的 `sessions.json` 复制到轮换备份而非将实时存储重命名离开，使轮换期间崩溃时现有会话到转录映射仍具有权威性。修复 #68229。感谢 @jjjojoj。
- Providers/OpenAI-compatible：从代理有效载荷中剥离仅 OpenAI Completions 的 `store`，并允许 `extra_body`/`extraBody` passthrough 参数用于 provider 特定请求字段。修复 #61826 和 #69717。
- Discord/子代理：通过保持请求者-agent announce 路径为主要并仅在 announce 产生无可见输出时回退到直接线程发送来保留线程绑定完成传递。（#71064）感谢 @DolencLuka。
- Discord/代理：使用 undici `FormData` 序列化代理的多部分附件上传，使 Discord 媒体发送通过配置的 REST 代理工作。（#71383）感谢 @TC500。
- 浏览器/工具：给 Chrome MCP 现有会话管理调用更长的默认超时，将显式工具超时传递通过标签页管理，并恢复过时的所选页面 MCP 会话而非强制手动重置。
- 浏览器/沙盒：清理由 primary-agent 浏览器会话打开的空闲跟踪标签页，同时保留活跃标签页复用和子代理、cron 和 ACP 会话的生命周期清理。修复 #71165。感谢 @dwbutler。
- 插件/Voice Call：在同一运行时实例上重用 webhook 运行时，避免在 Gateway 已拥有语音 webhook 端口时 agent 工具或 CLI 命令运行时出现 `EADDRINUSE`。修复 #58115。感谢 @sfbrian。
- 插件/Voice Call：在 `call.initiated` 上应答已接受的 Telnyx 入站 Call Control 分支，使到达 OpenClaw 的 webhook 不再让呼叫者持续响铃直到挂断。修复 #58231 和 #40131。感谢 @KonsultDigital。
- 插件/Voice Call：合并同一运行时实例上并发的 webhook 服务器启动，避免重叠启动路径竞争时的第二次 `listen()` 绑定。感谢 @education-01。
- 插件/Voice Call：在嵌入式 agent 运行前将语音响应会话固定到 `responseModel`，避免当全局默认模型不同时出现实时会话模型切换失败。修复 #60118。感谢 @xinbenlv。
- 插件/Voice Call：为语音响应生成添加 `agentId`，使电话可以使用专用 agent 工作区而非总是通过 `main` 路由。修复 #42155。感谢 @TheOpie。
- 插件/Voice Call：将嵌入式语音响应沙盒解析作用域到所选语音 agent，使隐式 `main` 语音会话遵守 `agents.defaults.sandbox.mode: "off"`，即使其他 agent 定义了沙盒化 Docker 绑定。修复 #56367。感谢 @crpol。
- 媒体工具：为媒体理解、图像/音乐/视频生成引用和 PDF 输入遵守配置的 web-fetch SSRF 策略，使显式 RFC2544 opt-in 覆盖 WebChat OSS 上传而不削弱默认值。修复 #71300。（#71321）感谢 @neeravmakwana。
- Agents/TTS：当结构化语音媒体已排队时从详细聊天工具输出中抑制成功的语音转录本，同时为非内置工具名冲突保留文本输出。修复 #71282。感谢 @neeravmakwana。
- 插件/Google Meet：跨无害 URL 查询差异复用活跃 Meet 标签页，在浏览器超时后恢复已打开的标签页，为登录或权限阻止者显示手动操作详情，并让 `googlemeet recover-tab` 从终端检查配对浏览器节点。
- Cron/隔离会话：在创建全新的隔离运行时清除过时的运行时、生命周期、认证、模型、exec、心跳、使用、特权、路由和传递产物，并将每运行会话行持久化为快照，使旧基础会话状态不再泄漏到新 cron 执行中。感谢 @vincentkoc。
- Gateway/会话：从过时的转录锁证据中恢复被 gateway 重启中断的主 agent 轮次，避免在广泛启动后扫描转录的情况下出现卡住的 `status: "running"` 会话。修复 #70555。感谢 @bitloi。
- Codex 审批：在转发到 OpenClaw 审批提示前清除 MCP 征求审批标题、描述和显示参数。（#71343）感谢 @Lucenx9。
- Codex 审批：将命令审批响应保持在 Codex app-server `availableDecisions` 范围内，包括对不提供 `decline` 的提示的拒绝/取消回退。（#71338）感谢 @Lucenx9。
- Codex harness：在绑定轮次开始后拒绝没有 `turnId` 或 `turn.id` 的同线程 app-server 通知，防止未作用域的事件改变或完成活跃回复。（#71317）感谢 @Lucenx9。
- 插件/Google Meet：在 setup 中包含活跃 Chrome-node 就绪和 Parallels 恢复检查，使过时的节点令牌或断开的 VM 浏览器在 agent 打开会议前可见。
- 上下文引擎：在上下文引擎窗口化和 `ownsCompaction` 引擎后保持安全摘要压缩检查活跃，使大型转录本可以在提示提交前压缩而非等待 provider 溢出。修复 #71325。
- 审批：在 Codex 权限提示和 exec 审批元数据中将结构化主目录路径压缩为 `~`，而不将它们重复作为单独的高风险警告，同时保留文件系统根和通配符主机警告。
- 插件/运行时依赖：将捆绑插件运行时依赖隔离在内部 npm 缓存中用于捆绑插件运行时依赖修复，并让包更新刷新/验证已是当前的安装，使失败的更新或 sudo doctor 运行可以通过重新运行 `openclaw update` 修复。
- Agents/delete：保持 `--json` 输出机器可读，并保留与另一个 agent 工作区重叠的工作区而非将共享状态移至垃圾箱。修复 #70889 和 #70890。（#70897）感谢 @kaseonedge。
- 浏览器/截图：通过主机和节点截图请求遵守 `timeoutMs`，绑定原始 CDP 截图命令，并为普通视口截图避免超出视口的 CDP 捕获，使 Windows Chrome 捕获不再在请求截止日期后挂起。修复 #68330。感谢 @Woodylai24。
- Telegram/模型选择器：在通过 provider 按钮浏览模型时显示配置的模型显示名称，与输入 `/models <provider>` 的输出匹配。修复 #70560。（#71016）感谢 @iskim77。
- 插件/运行时依赖：为打包/全局安装的捆绑插件运行时依赖在外部运行时根中暂存，并在修复期间保留已暂存的依赖，避免包树更新竞争和升级后 npm 修剪。
- 插件/运行时依赖：在同步 npm 安装开始前记录捆绑插件运行时依赖暂存，并在之后包含耗时计时，使升级后首次启动在依赖修复期间看起来不再像挂起。
- Memory/Bedrock：当 AWS 凭证不可用时在自动内存嵌入选择中跳过 Bedrock，使 `memory_search` 可以回退到词法搜索而非在首次嵌入调用时失败。修复 #71143 via #71245。感谢 @bitloi。
- Agents/故障转移：将嵌入式运行中止信号转发到 provider 自有的模型流，将隐式 LLM 空闲看门狗上限限制在长运行超时以下，并将没有可用重试计时的 429 响应标记为不可重试，使 GitHub Copilot 速率限制故障转移或及时浮出而非在运行超时前挂起。修复 #71120。
- 插件/Google Meet：使会议创建默认加入，并提供显式仅 URL opt-out，使创建 Meet 的 agent 也会进入会议。
- Telegram/轮询：在长时间运行的处理器完成前持久化已接受的更新偏移量，使轮询器重启不重放已摄入的更新，同时保留同进程重试用于处理器失败。
- Telegram/配置：在打包插件 manifest 中包含生成的 Telegram 渠道配置模式元数据，使论坛主题/群组配置在运行时加载前被接受。
- CLI/Claude：在严格的 Claude CLI MCP bundle 配置中包含用户配置的 `mcp.servers`，匹配 Pi 运行同时保留 OpenClaw loopback 覆盖。修复 #70909。感谢 @keishingu。
- 浏览器/工具：保持显式 AI 快照不从高效的角色快照默认继承，并保留数字 Playwright AI refs，使 `--format ai` 仍是一条真正的 AI 快照路径。修复 #62550。感谢 @ly85206559。
- Gateway/配置：当 `${VAR}` 环境引用在磁盘上恢复时，在解析的源快照上保持进程内配置补丁重载比较，避免为未更改的 gateway/plugin 密钥触发错误的完整 gateway 重启。修复 #71208。感谢 @robbiethompson18。
- Slack/消息：序列化每个目标的写客户端请求和完整出站发送，使快速多消息 Slack 回复保持发送顺序。修复 #69101。（#69105）感谢 @nightq 和 @ztexydt-cqh。
- Slack/消息：将 Slack bot 令牌排除在内部消息排序和 DM 缓存键外。
- Slack/exec 审批：通过 Gateway 解析原生审批按钮点击，而非将 `/approve ...` 作为纯 agent 文本传递，如果 Gateway 解析失败则保留重试按钮。修复 #71023。（#71025）感谢 @marusan03。
- 浏览器/工具：向 agent 公开浏览器 doctor 诊断，并扩展 `openclaw doctor` 浏览器就绪状态说明用于托管 Chromium 启动前提条件。（#62948、#62936）感谢 @seanc-dev。
- Slack/文件：将非图像 `download-file` 结果作为本地文件路径返回而非图像有效载荷，并在入站文件占位符中包含 Slack 文件 ID，以便 agent 可以调用 `download-file`。修复 #71212。感谢 @teamrazo。
- 浏览器控制：将独立 loopback 认证作用域到解析的活跃 gateway 凭证，并在密码模式缺少解析密码时失败关闭，使不活跃的令牌或密码不再授权浏览器路由。修复 #65626。（#65639）感谢 @coygeek。
- Control UI/Codex harness：发出原生 Codex app-server 助手和生命周期完成事件，使实时 webchat 运行停止旋转而无需转录重载回退。（#70815）感谢 @lesaai。
- Agents/会话：从嵌入式 agent 运行中持久化运行时解析的上下文预算，使 Codex GPT-5.5 会话保持目录/运行时上下文上限而非回退到通用的 200k 状态值。修复 #71294。感谢 @tud0r。
- Agents/工具：当显式工具允许列表解析为无可调用工具时，在模型提交前使运行失败，防止为未注册工具（如未注册的插件命令）出现仅文本的幻觉工具结果。修复 #71292。
- Agents/嵌入式：当嵌入式运行没有提示、重放历史或提示本地图像时跳过 provider 提交，防止空的 OpenAI Responses 请求将 provider 错误暴露到用户渠道。修复 #71130。
- Providers/Google：将 `/think adaptive` 映射到 Gemini 动态 thinking 而非固定的中等/高预算，使用 Gemini 3 的 provider 默认值和 Gemini 2.5 的 `thinkingBudget: -1`。修复 #71316。
- Providers/MiniMax：保持 M2.7 聊天模型元数据仅文本，使图像工具请求通过 `MiniMax-VL-01` 路由而非 Anthropic 兼容聊天端点。修复 #71296。感谢 @ilker-cevikkaya。
- Discord/回复：为 Discord 回复传递运行 `message_sending` 插件钩子，包括 DM 目标，使插件可以与其他渠道一致地转换或取消出站 Discord 回复。修复 #59350。（#71094）感谢 @wei840222。
- Discord/回复：在共享有效载荷回退、组件、语音和排队传递路径中保留一次性原生回复语义，使显式回复标签不再消耗隐式回复槽，块状回退仅发送一次回复。
- Control UI/命令：在会话行和默认中携带 provider 自有的 thinking 选项 id/标签，使新会话显示并接受 `adaptive`、`xhigh` 和 `max` 等动态模式。修复 #71269。感谢 @Young-Khalil。
- 图像生成：使显式 `model=` 覆盖为精确匹配，使失败的 `openai/gpt-image-2` 请求不再回落到 Gemini 或其他配置的 provider，并更新 `image_generate list` 以提及 OpenAI Codex OAuth 作为 `openai/gpt-image-2` 的有效认证。修复 #71290 和 #71231。感谢 @Young-Khalil。
- Providers/GitHub Copilot：保持插件流包装器不在 OpenClaw 选取边界感知流路径前声明传输选择，避免在正常模型轮次上使用 Pi 的过时回退 Copilot 头。
- Discord/子代理：将运行时配置传递到线程绑定的原生子代理绑定，并在辅助边界要求它，使 Discord 渠道解析保持账户感知配置。修复 #71054。（#70945）感谢 @jai。
- Slack/Assistant：接受 Slack Assistant DM `message_changed` 事件当其元数据识别人类发送者，同时继续删除机器人自创的编辑。修复 #55445。感谢 @AlfredPros。
- Slack/原生流式传输：在 `chat.startStream`/`appendStream` 前抑制仅推理有效载荷，使 Claude 扩展 thinking 块不再显示为可见 Slack 消息。修复 #59687。感谢 @vision-ifc。
- Slack/块回复：当 `replyToMode` 为 `first` 时，将多部分块传递保持在第一个 Slack 回复线程中，匹配文本回复线程而非将后续块泄漏到渠道。修复 #49341。感谢 @pholmstr 和 @xiwuqi。
- Slack/线程广播：将 `thread_broadcast` 事件作为用户消息处理，使使用"同时发送到渠道"发送的回复到达 agent 而非成为仅元数据系统事件。修复 #56605 和 #4351。感谢 @clawSean 和 @jlowin。
- Slack/线程化：在选择 Slack `thread_ts` 值时忽略内部回复 id，使恢复的回复保持真实 Slack 线程锚点而非泄漏到渠道根。修复 #68790。感谢 @MonkeyLeeT 和 @martingarramon。
- Agents/故障转移：停止让无 body 的 HTTP 400/422 代理失败默认归类为 `"format"`，使嵌入式重试暴露不透明的 provider 失败而非进入压缩循环。修复 #66462。（#67024）感谢 @altaywtf 和 @HongzhuLiu。
- 插件/加载器：为只读插件能力查找使用缓存的发现模式快照加载，保持快照缓存与活跃 Gateway 注册表隔离，并使同一插件渠道/HTTP 路由重新注册幂等，使重复快照或热重载路径不再重跑完整插件副作用或累积重复 surface。修复 #51781、#52031、#54181 和 #57514。感谢 @livingghost、@okuyam2y、@ShionEria 和 @bbshih。
- 插件/加载器：在 gateway 可绑定的引导加载后，为广泛运行时插件 ensure 调用重用兼容的活跃 Gateway 注册表，使非捆绑插件不再在同一引导路径中重跑 `register()`。修复 #69250。感谢 @markthebest12。
- 插件/钩子：当后续默认模式插件加载激活不同注册表时，保持 gateway 可绑定的钩子运行器已安装，在运行时缓存未命中间保留 Gateway 子代理生命周期钩子。修复 #63166。
- 插件/钩子：在入站渠道分发前刷新活跃 Gateway 运行时钩子，使外部安装的插件在作用域启动插件加载后保持 `message_received`、`before_dispatch` 和回复钩子活跃。修复 #71167。
- 媒体/输入：通过共享媒体加载器解析规范的入站媒体引用，使原生提示图像重放和显式图像/PDF 工具可以在仅工作区文件策略下读取 `media://inbound/<id>` 和托管入站重放路径。
- 媒体/工具：为图像、PDF、图像生成、视频生成和音乐生成输入集中化媒体引用方案分类，使托管入站引用被一致接受。
- Control UI/媒体：在服务助手媒体预览前解析规范的入站媒体引用，使 `media://inbound/<id>` 源不再通过访问检查但在文件打开时失败。
- Auth/Codex：在全新安装时从 Codex CLI 凭证引导 `openai-codex:default`，而不替换后续本地刷新的 OpenClaw OAuth 令牌。修复 #71305。感谢 @Gforce10-design。
- 插件 SDK/工具结果转换：绑定中间件 `details`，验证就地结果变更，并用规范 `error` 状态标记失败关闭中间件回退。感谢 @vincentkoc。
- Discord/gateway：当 Carbon gateway 注册与生命周期重连竞争时，防止启动卡在"等待 gateway 就绪"。修复 #52372。（#68159）感谢 @IVY-AI-gif。
- Discord/gateway：监督 Carbon 的异步 gateway 注册 promise，使致命的 Discord 元数据失败通过启动浮出而非进程级未处理拒绝。（#62451）感谢 @safzanpirani。
- Discord/gateway：将 websocket 帧活动记录为传输存活，使空闲但健康的 Discord gateway 在用户消息间不再看起来过时。（#68213）感谢 @bmadwaves。
- Slack/流式传输：当原生或草稿预览流拥有该轮次时抑制块回复，防止在也启用块流式传输时出现重复 Slack 传递。解决 #56675。感谢 @hsiaoa。
- 插件/缓存：在加载器缓存命中时恢复插件命令和交互处理程序注册表，而不重置交互回调去重，使缓存的外部插件在重载后保持斜杠命令和回调处理程序可用。修复 #71100。感谢 @BomBastikDE。
- Gateway/OpenAI 兼容：当 agent 运行只有最后调用使用元数据可用时，报告 `/v1/chat/completions` 的非零 token 使用量。修复 #71118。（#71242）感谢 @RenzoMXD。
- 插件 SDK/工具结果转换：将 harness 工具结果中间件限制为捆绑插件，在中间件错误时失败关闭，验证重写的结果形状，保留 Pi 每调用 id，并使 Codex 媒体信任检查锚定到原始工具来源。感谢 @vincentkoc。
- Gateway/MCP loopback：对 `127.0.0.1/mcp` `tools/list` 和 `tools/call` 应用仅所有者工具策略并运行 before-tool-call 钩子，使非所有者 bearer 调用者不能再看到或调用仅所有者工具如 `cron`、`gateway` 和 `nodes`，与现有 HTTP `/tools/invoke` 和嵌入式 agent 路径匹配。（#71159）感谢 @mmaps。
- Codex harness/安全：等待最终 app-server 审批决策并清除审批预览文本，使原生 Codex 权限提示不能通过早期占位符决策解决或渲染不安全的终端/控制内容。（#70751、#70569）感谢 @Lucenx9。
- Providers/语音安全：通过受保护的 fetch 路径路由 ElevenLabs TTS 和 OpenAI Realtime 浏览器会话密钥创建，保留 provider 调用同时在语音 surface 上保持 SSRF 保护。
- Agents/OpenAI WS：匹配 Codex 的 Responses WebSocket 延续策略，仅发送带有 `previous_response_id` 的严格增量后续输入，当重放链或请求形状不同时回退到完整上下文。修复 #44948。感谢 @hss-oss。
- 插件/Google Chat：仅在所有候选都失败后记录 webhook 认证拒绝原因，并在 add-on `appPrincipal` 值与配置不匹配时发出警告。修复 #71078。（#71145）感谢 @luyao618。
- Models/配置：当从配置重新运行 provider 认证时保留现有默认模型，同时保持显式默认设置命令权威。修复 #70696。（#70793）感谢 @Sathvik-1007。
- 配置/插件：在验证、生成模式元数据和插件策略检查中接受 `plugins.entries.*.hooks.allowConversationAccess`，使受信任的外部插件可以启用会话访问钩子如 `agent_end` 而无需本地模式补丁。修复 #71215。（#71221）感谢 @BillChirico。
- Models/运行时：每个 provider 显示一个模型 provider 选择，并将 Codex、Claude CLI 和 Gemini CLI 执行移入显式运行时选择，同时保持仅回退的遗留运行时引用不变。感谢 @vincentkoc。
- 插件/运行时依赖：在修复捆绑运行时依赖时遵守显式的插件和渠道禁用，使 doctor 和健康检查不再为已禁用的已配置渠道安装依赖。感谢 @vincentkoc。
- 诊断/OTEL：通过有界的诊断日志事件导出日志，而非直接日志器传输钩子。感谢 @vincentkoc。
- WhatsApp/插件：支持入站 `message_received` 钩子的显式 opt-in，包含规范渠道、会话和发送者字段。感谢 @vincentkoc。
- 渠道/设置：保持捆绑设置条目依赖轻量，仅在实际需要登录时才暂存 WhatsApp 运行时依赖，使首次运行设置和只读渠道发现避免未使用的 SDK 导入。
- Slack/HTTP：在进程全局注册表中保持 webhook 处理器，使 HTTP 模式在插件加载器/原生导入拆分后存活，`/slack/events/<account>` 在记录为活跃后不再返回 404。修复 #67955、#46245 和 #46246。感谢 @chrisabad 和 @cesararevalo。
- 诊断：加强工具和模型诊断事件抵御恶意错误、阻塞监听器和不安全稳定性原因字段。感谢 @vincentkoc。
- 插件/onboarding：记录本地插件安装源元数据，而不重复原始绝对本地路径到持久化的 `plugins.installs`，同时保留链接加载路径清理。（#70970）感谢 @vincentkoc。
- 群聊/静默回复：收紧 `NO_REPLY` 提示指导，使群组保持安静而不叙述沉默或发出回退闲聊，当沉默是预期结果时。（#70954、#71209）感谢 @Takhoffman。
- WhatsApp/群组+直接：在特定的 `groups.<id>` 或 `direct.<peerId>` 条目上设置 `systemPrompt: ""` 现在会抑制通配符系统提示而非降级到它，使用户可以针对特定群组或对等方静音全局提示。（#70381）感谢 @Bluetegu。
- 浏览器/工具：告诉 agent 不要在现有会话类型上传递每调用 `timeoutMs`，评估和其他拒绝超时覆盖的 Chrome MCP 操作。
- 浏览器/工具：使用 Playwright 当前的 AI aria 快照 API 用于 `refs="aria"`，当节点浏览器无法提供 aria refs 时回退到 role refs，使 agent 仍能检查和点击 Google Meet 入场按钮等控件。
- 浏览器/工具：公开稳定的 `tabId` 句柄如 `t1` 加上可选标签页标签，并在任何需要浏览器标签页目标的地方接受这些句柄。
- 浏览器/工具：在标签页有效载荷中首先返回 `suggestedTargetId`，使 agent 自然地复用标签或稳定标签页句柄而非原始 DevTools id。
- 浏览器/工具：捆绑一个 `browser-automation` 技能，包含多步快照、稳定标签页、过期引用和手动阻止循环，用于 agent 控制的页面。
- 浏览器/工具：新增 `openclaw browser doctor`、URL 扩展快照、直接标签截图，并为意外传递位置索引的 agent 提供更清晰的标签页目标错误。
- 插件/Google Meet：使用浏览器自动化分类和清除 Meet 入场阻止者如麦克风选择插页式界面，并在重试时复用进行中的创建标签而非打开重复。
- Codex/GPT-5.4：在原生和嵌入式运行时路径中加强回退、auth-profile、工具模式和重放边缘情况。（#70743）感谢 @100yenadmin。
- Models/回退：在模型切换前解析裸回退模型 provider id，使配置的回退链在回退未带显式 provider 前缀命名时继续工作。
- Voice-call/Telnyx：保留入站/出站回调元数据并从 Telnyx 当前的 `transcription_data` 有效载荷中读取转录文本。
- Providers/DeepSeek：接入 V4 thinking 控件和 OpenAI 兼容重放策略，使后续轮次保留 DeepSeek `reasoning_content`，而 None/off thinking 路径剥离重放的推理字段。修复 #70931。感谢 @lsdsjy。
- Providers/GitHub Copilot：跨 Anthropic、Responses 和内置压缩摘要路径对齐 Copilot 请求头，包括工具结果和图像后续轮次，而不启用未验证的 Responses 延续。
- Codex harness：为原生 app-server 运行向聊天渠道发送详细工具进度，匹配 Pi harness `/verbose on` 和 `/verbose full` 行为。（#70966）感谢 @jalehman。
- Codex 模型：获取分页的 Codex app-server 模型目录，标记截断的 `/codex models` 输出，并将 ChatGPT OAuth 默认值保持在 `openai-codex/gpt-5.5` 路由而非 OpenAI API 密钥路由。
- Codex 状态：为原生 `codex/*` 会话报告 Codex CLI OAuth 为 `oauth (codex-cli)` 而非显示未知认证。修复 #70688。感谢 @jb510。
- 渠道/CLI：接受显式共享密钥、base-URL 和 auth-directory 设置标志，并将遗留 Nextcloud Talk `--url`/`--token` add 命令映射到捆绑插件设置输入。修复 #61759 和 #61923。
- Models/CLI：保持 `openclaw models list` 只读，同时仍显示符合条件的已配置 provider 行，使列出模型不再重写每个 agent 的 `models.json`。（#70847）感谢 @shakkernerd。
- Agents/传输：将配置的尝试超时传播到受保护的每请求调度器，使慢速本地 LLM 调用如 Ollama 不再在 Undici 默认 60 秒 body 超时处失败。修复 #70829。（#70831）感谢 @DranboFieldston。
- 插件/providers：在捆绑 provider manifest 中镜像运行时认证选择，并在插件运行时加载前检测 Moonshot/Kimi 网络搜索的 `KIMI_API_KEY`。感谢 @vincentkoc。
- Gateway/聊天：在聊天运行注册表中注册 chat.send 运行，使生命周期错误事件到达客户端而非被静默丢弃，修复卡住的'等待'状态和 /abort 报告无活跃运行。（#69747）感谢 @wangshu94。
- 插件/QQ Bot：默认启用捆绑的 qqbot 插件，使其运行时依赖 `@tencent-connect/qqbot-connector` 在首次启动时安装，解锁在配置任何账户前动态导入连接器的二维码绑定流程。（#71051）感谢 @cxyhhhhh。
- Gateway/agent RPC：将活跃 `agent` 运行注册到聊天中止控制器映射中，使 `chat.abort` 和 `sessions.abort` 可以中断它们，匹配 `chat.send` 行为并解锁通过公共 `agent` RPC 驱动 Gateway 的外部运行时。修复 #71128。（#71214）感谢 @bitloi。
- Matrix/CLI：将解析的运行时配置传递到 verify 命令，使 `openclaw matrix verify status` 和同级 verify 子命令在获取 Matrix 客户端前不再崩溃。修复 #70992。（#71102）感谢 @luyao618。
- Gateway/启动：在渠道监视器报告就绪前等待启动辅助程序，减少 Discord 和插件启动竞争，同时保持 gateway 启动可观察性完整。
- 插件/Google Meet：报告 Chrome 加入所需的手动操作，使用浏览器自动化进行 Meet 入场，并持久化私有 WS 节点 opt-in，使配对节点实时会话保持其预期的网络策略。
- Slack：将原生流回退回复通过正常分块发送方路由，使长的缓冲 Slack Connect 响应不被丢弃或重复。（#71124）感谢 @martingarramon。
- WhatsApp：在 agent 分发前转录接受的语音笔记，同时将语音转录本排除在命令授权外。（#64120）感谢 @rogerdigital。
- 插件/CLI：在发现模式插件加载期间公开渠道插件 CLI 描述符，使快照注册表保持渠道命令可见而不激活完整运行时。（#71309）感谢 @gumadeiras。
- Matrix：在 E2EE 恢复期间分离恢复密钥、备份和所有者信任诊断，添加备份重置的恢复密钥轮换，并在 QA 中覆盖破坏性备份恢复路径。（#71311）感谢 @gumadeiras。
- WhatsApp：传递由工具结果回复生成的媒体，同时仍抑制仅文本工具闲聊。（#60968）感谢 @adaclaw。
- 配置/agents：在严格配置验证中接受 `agents.list[].contextTokens`，使每个 agent 覆盖在热重载后存活，让 `/status` 反映配置的模型窗口而非 200k 回退。修复 #70692。（#71247）感谢 @statxc。
- 心跳：在心跳提示中包含异步 exec 完成详情，使命令完成通知中继实际输出。（#71213）感谢 @GodsBoy。
- 内存搜索：对会话转录命中应用会话可见性和 agent 到 agent 策略，并在结果限制前保持 `corpus=sessions` 排名作用域到会话集合。（#70761）感谢 @nefainl。
- Agents/会话：停止让会话写锁超时进入模型故障转移，使本地锁争用直接浮出而非级联到 providers。（#68700）感谢 @MonkeyLeeT。
- 自动回复：通过 `message_sending` 钩子运行入站回复传递，使插件可以在发送前转换或取消生成的回复。（#70118）感谢 @jzakirov。
- CI/release-checks：通过步骤环境变量传递工作流输入和矩阵值，而非直接将它们嵌入 `run:` shell 命令，减少跨 OS release-check 工作流中的模板注入 surface。（#66884）感谢 @alexlomt。

## 🚀 v2026.4.23 (2026年4月24日)

### ✨ 新增功能与改进

- Providers/OpenAI：通过 Codex OAuth 新增图像生成和参考图像编辑功能，使 `openai/gpt-image-2` 无需 `OPENAI_API_KEY` 即可工作。修复 #70703。
- Providers/OpenRouter：通过 `image_generate` 新增图像生成和参考图像编辑功能，使 OpenRouter 图像模型可以使用 `OPENROUTER_API_KEY` 工作。修复 #55066（通过 #67668）。感谢 @notamicrodose。
- 图像生成：允许 agent 请求 provider 支持的质量和输出格式提示，并通过 `image_generate` 工具传递 OpenAI 特定的背景、审核、压缩和用户提示。（#70503）感谢 @ottodeng。
- Agents/subagents：为原生 `sessions_spawn` 运行添加可选的分叉上下文，使 agent 可以在需要时让子级继承请求者的对话记录，同时默认保持干净的隔离会话；包括提示引导、上下文引擎 hook 元数据、文档和 QA 覆盖。
- Agents/tools：为图像、视频、音乐和 TTS 生成工具添加可选的每调用 `timeoutMs` 支持，使 agent 仅在特定生成需要时延长 provider 请求超时。
- 内存/本地嵌入：添加可配置的 `memorySearch.local.contextSize`，默认为 4096，使本地嵌入上下文可以在不修改内存主机的情况下为受限主机进行调整。（#70544）感谢 @aalekh-sarvam。
- 依赖/Pi：更新捆绑 Pi 包至 `0.70.0`，使用 Pi 上游的 `gpt-5.5` 目录元数据用于 OpenAI 和 OpenAI Codex，仅保留本地 `gpt-5.5-pro` 向前兼容处理。
- Codex harness：为嵌入式 harness 选择决策添加结构化调试日志，使 `/status` 保持简洁，同时网关日志解释自动选择和 Pi 回退原因。（#70760）感谢 @100yenadmin。

### 🐛 问题修复

- Agents/bootstrap：通过检测自定义的 identity/profile 文件、删除过时的 bootstrap 文件并记录设置完成情况，修复仍有过时 `BOOTSTRAP.md` 的已完成工作区（#71230）。感谢 @Patrick-Erichsen。
- Codex harness：将原生 `request_user_input` 提示路由回原始聊天，保留排队的后续答案，并遵循更新的 app-server 命令审批修订决策。
- Codex harness/context-engine：在记录之前编辑 context-engine 组装失败，使回退警告不会序列化原始错误对象。（#70809）感谢 @jalehman。
- WhatsApp/onboarding：使首次运行设置条目加载脱离 Baileys 运行时依赖路径，使打包的 QuickStart 安装可以在运行时依赖暂存之前显示 WhatsApp 设置。修复 #70932。
- 块流式传输：在已发送的文本块完全覆盖最终回复时，抑制部分块传递中止后的最终组装文本，防止重复回复而不会丢弃无关的短消息。修复 #70921。
- Codex harness/Windows：在启动原生 app-server 之前通过 PATHEXT 解析 npm 安装的 `codex.cmd` shim，使 `codex/*` 模型无需手动 `.exe` shim 即可工作。修复 #70913。
- Slack/群组：将 MPIM 群组 DM 分类为群组聊天上下文，并在 Slack 非 DM 表面上抑制详细的工具/计划进度，使内部"Working…"跟踪不再泄露到房间中。修复 #70912。
- Agents/replay：阻止 OpenAI/Codex 对话记录重放合成缺失的工具结果，同时仍在 Anthropic、Gemini 和 Bedrock 传输拥有的会话上保留合成修复。（#61556）感谢 @VictorJeon 和 @vincentkoc。
- Telegram/媒体回复：在最终回复路径上将远程 markdown 图像语法解析为出站媒体负载，使 Telegram 群组聊天在模型或工具发出 `![...](...)` 而不是 `MEDIA:` 令牌时不再回退到纯文本图像 URL。（#66191）感谢 @apezam 和 @vincentkoc。
- Agents/WebChat：从嵌入式 runner 中显示不可重试的 provider 失败（如计费、认证和速率限制错误），而不是记录 `surface_error` 并使 webchat 没有渲染的错误。修复 #70124。（#70848）感谢 @truffle-dev。
- WhatsApp：统一直接发送和自动回复之间的出站媒体标准化。感谢 @mcaxtr。
- 内存/CLI：在 memory-core 清单中声明内置的 `local` 嵌入 provider，使独立的 `openclaw memory status`、`index` 和 `search` 可以像网关运行时一样解析本地嵌入。修复 #70836。（#70873）感谢 @mattznojassist。
- 网关/WebChat：将图像附件作为媒体引用卸载而不是丢弃，为文本-only 主模型保留图像附件，使配置的图像工具仍可检查原始文件。修复 #68513、#44276、#51656、#70212。
- 插件/Google Meet：在离开时挂起委托的 Twilio 呼叫，在启动失败时清理 Chrome 实时音频桥接，并使用扁平的 provider 安全工具 schema。
- 媒体理解：在原生视觉跳过之前尊重显式图像模型配置，包括 `agents.defaults.imageModel`、`tools.media.image.models` 和 provider 图像默认值（如 MiniMax VL），当活动聊天模型为文本-only 时。修复 #47614、#63722、#69171。
- Codex/媒体理解：通过有界的 Codex app-server 图像轮次支持 `codex/*` 图像模型，同时将 `openai-codex/*` 保留在 OpenAI Codex OAuth 路由上，并针对生成的协议合同验证 app-server 响应。修复 #70201。
- Providers/OpenAI Codex：当 Codex 目录发现省略 `openai-codex/gpt-5.5` OAuth 模型行时合成它，使 cron 和子 agent 运行在账户认证时不会因 `Unknown model` 而失败。
- 模型/Codex：在从聊天或 CLI 命令添加模型时保留 Codex provider 元数据，使手动添加的 Codex 模型保持正确的认证和路由行为。（#70820）感谢 @Takhoffman。
- Providers/OpenAI：当 `openai-codex` 配置文件处于活动状态时，直接通过配置的 Codex OAuth 路由 `openai/gpt-image-2`，而不是先探测 `OPENAI_API_KEY`。
- Providers/OpenAI：强化图像生成认证路由和 Codex OAuth 响应解析，使回退仅适用于公共 OpenAI API 路由和有界的 SSE 结果。感谢 @Takhoffman。
- OpenAI/图像生成：将参考图像编辑作为受保护的多部分上传发送，而不是 JSON 数据 URL，恢复复杂的多参考 `gpt-image-2` 编辑。修复 #70642。感谢 @dashhuang。
- Providers/OpenRouter：将图像理解提示作为用户文本在图像部分之前发送，恢复 OpenRouter 多模态模型的非空视觉响应。修复 #70410。
- Providers/Google：为 Gemini 图像生成请求尊重私有网络 SSRF 选择加入，使将 Google API 主机解析为私有地址的受信任代理设置可以使用 `image_generate`。修复 #67216。
- Agents/传输：阻止嵌入式运行降低进程范围的 undici 流超时，使慢速 Gemini 图像生成和其他长时间运行的 provider 请求不再继承短的运行尝试头超时。修复 #70423。感谢 @giangthb。
- Providers/OpenAI：为 OpenAI 兼容的图像生成端点尊重私有网络 SSRF 选择加入，使受信任的 LocalAI/LAN `image_generate` 路由无需全局禁用 SSRF 检查即可工作。修复 #62879。感谢 @seitzbg。
- Providers/OpenAI：停止通过回退目录宣传已移除的 `gpt-5.3-codex-spark` Codex 模型，并使用 GPT-5.5 恢复提示抑制陈旧行。
- Control UI/chat：将 agent 生成的图像持久化为认证的管理媒体，并接受配对设备令牌用于 agent 媒体获取，使 webchat 历史重载继续显示生成的图像。（#70719、#70741）感谢 @Patrick-Erichsen。
- Control UI/chat：在网关重连之间排队停止按钮中止，使断开的活动运行在重连时取消，而不是仅清除本地 UI 状态。（#70673）感谢 @chinar-amrutkar。
- 内存/QMD：当启动修复发现集合名称已存在时重新创建过时的托管 QMD 集合，使根内存缩小回 `MEMORY.md`，而不是停留在广泛的工作区 markdown 索引上。
- Agents/OpenAI：从 PI、Codex 和自动回复 harness 路径中显示选定模型容量失败，并带有模型切换提示，而不是通用的空响应错误。感谢 @vincentkoc。
- 插件/QR：用有界的 `qrcode-tui` 辅助工具替换旧版 `qrcode-terminal` QR 渲染，用于插件登录/设置流程。（#65969）感谢 @vincentkoc。
- 语音调用/实时：在问候或转发缓冲音频之前等待 OpenAI 会话配置，并在流设置之前拒绝非允许列表的 Twilio 呼叫者。（#43501）感谢 @forrestblount。
- ACPX/Codex：停止为 Codex ACP、Codex app-server 和 Codex CLI 运行物化 `auth.json` 桥接文件；Codex 拥有的运行时现在直接使用其正常的 `CODEX_HOME`/`~/.codex` 认证路径。
- 自动回复/系统事件：通过持久化的会话传递上下文路由异步 exec 事件完成回复，使长时间运行的命令结果返回到原始通道，而不是在实时源元数据缺失时被丢弃。（#70258）感谢 @wzfukui。
- 网关/会话：将 webchat 会话变更守卫扩展到 `sessions.compact` 和 `sessions.compaction.restore`，使 `WEBCHAT_UI` 客户端与现有的补丁/删除守卫一致地被拒绝进行压缩侧会话变更。（#70716）感谢 @drobison00。
- QA 通道/安全：在媒体获取之前拒绝非 HTTP(S) 入站附件 URL，并记录被拒绝的方案，使可疑或配置错误的负载在调试期间可见。（#70708）感谢 @vincentkoc。
- 插件/安装：将主机 OpenClaw 包链接到声明 `openclaw` 为对等依赖的外部插件中，使仅对等的插件 SDK 导入在安装后解析，而无需捆绑重复的主机包。（#70462）感谢 @anishesg。
- 插件/Windows：在捆绑的运行时依赖修复期间就地刷新打包的插件 SDK 别名，使网关和 CLI 插件启动在同guest npm 更新后不再在 `ENOTEMPTY`/`EPERM` 上竞争。
- Teams/安全：要求共享的 Bot Framework 受众令牌通过验证的 `appid` 或 `azp` 命名配置的 Teams 应用，阻止跨 bot 令牌在全局受众上重放。（#70724）感谢 @vincentkoc。
- 插件/启动：相对于目标插件模块解析捆绑的插件 Jiti 加载，而不是中央加载器，使 Bun 全局安装在发现捆绑的图像 provider 时不再挂起。（#70073）感谢 @yidianyiko。
- Anthropic/CLI 安全：从 OpenClaw 现有的 YOLO exec 策略派生 Claude CLI `bypassPermissions`，保留显式的原始 Claude `--permission-mode` 覆盖，并剥离格式错误的权限模式参数，而不是静默回退到旁路。（#70723）感谢 @vincentkoc。
- Android/安全：在 Android 手动和扫描路由上要求仅回环的明文网关连接，使私有 LAN 和链路本地 `ws://` 端点在启用 TLS 之前 fail closed。（#70722）感谢 @vincentkoc。
- 配对/安全：要求私有 IP 或回环主机用于明文移动配对，并停止将 `.local` 或无点主机名视为安全的明文端点。（#70721）感谢 @vincentkoc。
- 插件/安全：阻止 setup-api 查找回退到启动目录，使工作区本地的 `extensions/<plugin>/setup-api.*` 文件在 provider 设置解析期间无法执行。（#70718）感谢 @drobison00。
- 审批/安全：要求显式的聊天 exec 审批启用，而不是仅因为审批者从配置或所有者允许列表中解析就自动启用审批客户端。（#70715）感谢 @vincentkoc。
- Discord/安全：阻止原生斜杠命令通道策略绕过配置的 owner 或成员限制，同时在没有更严格的访问规则时保留通道策略回退。（#70711）感谢 @vincentkoc。
- Android/安全：阻止 `ASK_OPENCLAW` 意图自动发送注入的提示，使外部应用操作仅预填草稿而不是立即分发。（#70714）感谢 @vincentkoc。
- 密钥/Windows：从文件支持的密钥中剥离 UTF-8 BOM，并使不可用的 ACL 检查 fail closed，除非受信任的文件或 exec provider 显式选择加入 `allowInsecurePath`。（#70662）感谢 @zhanggpcsu。
- Agents/图像生成：在工具警告中转义忽略的覆盖值，使解析的 `MEDIA:` 指令无法通过不支持的模型选项注入。（#70710）感谢 @vincentkoc。
- QQBot/安全：要求 `/bot-approve` 的框架认证，使未经授权的 QQ 发送者无法通过未认证的分派前斜杠命令路径更改 exec 审批设置。（#70706）感谢 @vincentkoc。
- MCP/工具：阻止 ACPX OpenClaw 工具桥列出或调用 owner-only 工具（如 `cron`），关闭非 owner MCP 调用者的权限提升路径。（#70698）感谢 @vincentkoc。
- Feishu/onboarding：通过仅设置的 barrel 加载 Feishu 设置表面，使首次运行设置在捆绑的运行时依赖暂存之前不再导入 Feishu 的 Lark SDK。（#70339）感谢 @andrejtr。
- 审批/启动：使原生审批处理程序在网关认证后报告就绪，同时在后台重放待处理的审批，使慢速或失败的重放传递不再阻止处理程序启动或放大重连风暴。
- WhatsApp/安全：将联系人/vCard/位置结构化对象的自由文本排除在内联消息体之外，并通过围栏的不可信元数据 JSON 渲染，限制名称、电话字段和位置标签/注释中的隐藏提示注入负载。
- 群组聊天/安全：将通道来源的群组名称和参与者标签排除在内联群组系统提示之外，并通过围栏的不可信元数据 JSON 渲染。
- Agents/replay：在严格的重放清理期间保留 Kimi 风格的 `functions.<name>:<index>` 工具调用 ID，使自定义的 OpenAI 兼容 Kimi 路由保持多轮工具使用完整。（#70693）感谢 @geri4。
- Discord/回复：通过出站传递保留最终回复权限上下文，使 Discord 回复在发送时保持相同的通道/成员路由规则。
- 插件/启动：从打包的安装和外部运行时依赖暂存根恢复捆绑的插件 `openclaw/plugin-sdk/*` 解析，使 Telegram/Discord 在缺少依赖修复后不再因 `Cannot find package 'openclaw'` 而崩溃循环。（#70852）感谢 @simonemacario。
- CLI/Claude：在 `claude-cli` 轮次上运行与直接嵌入式运行相同的提示构建 hook 和触发/通道上下文，使 Claude Code 会话与 OpenClaw 工作区身份、路由和 hook 驱动的提示变更保持一致。（#70625）感谢 @mbelinky。
- Discord/插件启动：将子 agent hook 延迟在 Discord 的通道入口之后，使打包的入口导入保持狭窄，并使用通道 ID 和入口路径报告导入失败。
- 内存/doctor：将根持久内存规范化在 `MEMORY.md` 上，停止将小写的 `memory.md` 视为运行时回退，并使 `openclaw doctor --fix` 将真正的分裂根文件合并到 `MEMORY.md` 中并备份。（#70621）感谢 @mbelinky。
- Providers/Anthropic Vertex：在轻量级 provider 发现路径之后恢复 ADC 支持的模型发现，通过解析发出的发现条目、在引导发现上显示合成认证，并在探测默认 GCP ADC 路径时尊重复制的环境快照。修复 #65715。（#65716）感谢 @feiskyer。
- Codex harness/状态：在每个会话上固定嵌入式 harness 选择，在 `/status` 中显示活动非 PI harness ID（如 `codex`），并在 `/new` 或 `/reset` 之前将旧版对话记录保留在 PI 上，使配置变更无法热切换现有会话。
- 网关/安全：通过允许列表限制 agent 可调的提示、模型和提及门控路径（包括 Telegram 主题级 `requireMention`），在 agent 驱动的 `gateway config.apply`/`config.patch` 运行时编辑上 fail closed，而不是依赖手工维护的可能遗漏新敏感配置密钥的保护子树拒绝列表。（#70726）感谢 @drobison00。
- Webhooks/安全：在每个请求上重新解析 `SecretRef` 支持的 webhook 路由密钥，使 `openclaw secrets reload` 立即撤销先前的密钥，而不是等待网关重启。（#70727）感谢 @drobison00。
- 内存/梦境：将托管的梦境 cron 与心跳解耦，作为隔离的轻量级 agent 轮次运行，使梦境在默认 agent 的心跳被禁用时仍运行，且不再被 `heartbeat.activeHours` 跳过。`openclaw doctor --fix` 将持久化 cron 配置中的过时主会话梦境作业迁移到新形状。修复 #69811、#67397、#68972。（#70737）感谢 @jalehman。
- Agents/CLI：将 `--agent` 加 `--session-id` 查找限制在请求的 agent 存储中，使显式的 agent 恢复无法选择另一个 agent 的会话。（#70985）感谢 @frankekn。
- 插件/Comfy：从 `plugins.entries.comfy.config` 读取工作流和云认证配置，同时保留旧版 Comfy 配置回退，使图像、视频和音乐工作流通过配置验证。修复 #61915。（#63058）感谢 @547895019。
- 网关/密钥：在 `secrets.reload` 期间重启 Slack 和 Zalo 等密钥支持的通道，使轮换的 webhook 密钥立即生效，重载被序列化，每个通道的重启错误被隔离。（#70720）感谢 @drobison00。
- 插件/tokenjuice：在捆绑的插件运行时暂存期间保留 `node_modules/tokenjuice/dist/rules/tests/*.json`，使插件停止因 `Cannot find module '../rules/tests/bun-test.json'` 而加载失败。全局基本名称修剪将任何 `tests/` 目录视为测试货物，但 tokenjuice 的 `dist/rules/tests/` 是被 `dist/core/builtin-rules.generated.js` 消耗的运行时加载的规则数据。为每个包的修剪规则添加可选的 `keepDirectories` 字段，使与修剪的基本名称冲突的资产目录的包可以干净地暂存。

## 🚀 v2026.4.22 (2026年4月23日)

> 上游官方版本，包含大量新功能和问题修复。以下为英文原文，中文翻译持续更新中。

### 🔧 功能调整（Changes）

- Providers/xAI: add image generation, text-to-speech, and speech-to-text support, including `grok-imagine-image` / `grok-imagine-image-pro`, reference-image edits, six live xAI voices, MP3/WAV/PCM/G.711 TTS formats, `grok-stt` audio transcription, and xAI realtime transcription for Voice Call streaming. (#68694) Thanks @KateWilkins.
- Providers/STT: add Voice Call streaming transcription for Deepgram, ElevenLabs, and Mistral, alongside the existing OpenAI and xAI realtime STT paths; ElevenLabs also gains Scribe v2 batch audio transcription for inbound media.
- TUI: add local embedded mode for running terminal chats without a Gateway while keeping plugin approval gates enforced. (#66767) Thanks @fuller-stack-dev.
- Onboarding: auto-install missing provider and channel plugins during setup so first-run configuration can complete without manual plugin recovery.
- OpenAI/Responses: use OpenAI's native `web_search` tool automatically for direct OpenAI Responses models when web search is enabled and no managed search provider is pinned; explicit providers such as Brave keep the managed `web_search` tool.
- Models/commands: add `/models add <provider> <modelId>` so you can register a model from chat and use it without restarting the gateway; keep `/models` as a simple provider browser while adding clearer add guidance and copy-friendly command examples. (#70211) Thanks @Takhoffman.
- WhatsApp: add configurable native reply quoting with replyToMode for WhatsApp conversations. Thanks @mcaxtr.
- WhatsApp/groups+direct: forward per-group and per-direct `systemPrompt` config into inbound context `GroupSystemPrompt` so configured per-chat behavioral instructions are injected on every turn. Supports `"*"` wildcard fallback and account-scoped overrides under `channels.whatsapp.accounts.<id>.{groups,direct}`; account maps fully replace root maps (no deep merge), matching the existing `requireMention` pattern. Closes #7011. (#59553) Thanks @Bluetegu.
- Agents/sessions: add mailbox-style `sessions_list` filters for label, agent, and search plus visibility-scoped derived title and last-message previews. (#69839) Thanks @dangoZhang.
- Control UI/settings+chat: add a browser-local personal identity for the operator (name plus local-safe avatar), route user identity rendering through the shared chat/avatar path used by assistant and agent surfaces, and tighten Quick Settings, agent fallback chips, and narrow-screen chat layouts so personalization no longer wastes space or clips controls. (#70362) Thanks @BunsDev.
- Gateway/diagnostics: enable payload-free stability recording by default and add a support-ready diagnostics export with sanitized logs, status, health, config, and stability snapshots for bug reports. (#70324) Thanks @gumadeiras.
- Providers/Tencent: add the bundled Tencent Cloud provider plugin with TokenHub onboarding, docs, `hy3-preview` model catalog entries, and tiered Hy3 pricing metadata. (#68460) Thanks @JuniperSling.
- Providers/Amazon Bedrock Mantle: add Claude Opus 4.7 through Mantle's Anthropic Messages route with provider-owned bearer-auth streaming, so the model is actually callable without treating AWS bearer tokens like Anthropic API keys. Thanks @wirjo.
- Providers/GPT-5: move the GPT-5 prompt overlay into the shared provider runtime so compatible GPT-5 models receive the same behavior and heartbeat guidance through OpenAI, OpenRouter, OpenCode, Codex, and other GPT providers; add `agents.defaults.promptOverlays.gpt5.personality` as the global friendly-style toggle while keeping the OpenAI plugin setting as a fallback.
- Providers/OpenAI Codex: remove the Codex CLI auth import path from onboarding and provider discovery so OpenClaw no longer copies `~/.codex` OAuth material into agent auth stores; use browser login or device pairing instead. (#70390) Thanks @pashpashpash.
- CLI/Claude: default `claude-cli` runs to warm stdio sessions, including custom configs that omit transport fields, and resume from the stored Claude session after Gateway restarts or idle exits. (#69679) Thanks @obviyus.
- Pi/models: update the bundled pi packages to `0.68.1` and let the OpenCode Go catalog come from pi instead of plugin-maintained model aliases, adding the refreshed `opencode-go/kimi-k2.6`, Qwen, GLM, MiMo, and MiniMax entries.
- Tokenjuice: add bundled native OpenClaw support for tokenjuice as an opt-in plugin that compacts noisy `exec` and `bash` tool results in Pi embedded runs. (#69946) Thanks @vincentkoc.
- ACPX: add an explicit `openClawToolsMcpBridge` option that injects a core OpenClaw MCP server for selected built-in tools, starting with `cron`.
- CLI/doctor plugins: lazy-load doctor plugin paths and prefer installed plugin `dist/*` runtime entries over source-adjacent JavaScript fallbacks, reducing the measured `doctor --non-interactive` runtime by about 74% while keeping cold doctor startup on built plugin artifacts. (#69840) Thanks @gumadeiras.
- CLI/debugging: add an opt-in temporary debug timing helper for local CLI performance investigations, with readable stderr output, JSONL capture, and docs for removing probes before landing fixes. (#70469) Thanks @shakkernerd.
- Docs/i18n: add Thai translation support for the docs site.
- Providers/OpenAI-compatible: mark known local backends such as vLLM, SGLang, llama.cpp, LM Studio, LocalAI, Jan, TabbyAPI, and text-generation-webui as streaming-usage compatible, so their token accounting no longer degrades to unknown/stale totals. (#68711) Thanks @gaineyllc.
- Providers/OpenAI-compatible: recover streamed token usage from llama.cpp-style `timings.prompt_n` / `timings.predicted_n` metadata and sanitize usage counts before accumulation, fixing unknown or stale totals when compatible servers do not emit an OpenAI-shaped `usage` object. (#41056) Thanks @xaeon2026.
- Plugins/startup: prefer native Jiti loading for built bundled plugin dist modules on supported runtimes, cutting measured bundled plugin load time by 82-90% while keeping source TypeScript on the transform path. (#69925) Thanks @aauren.
- Plugin SDK/STT: share realtime transcription WebSocket transport and multipart batch transcription form helpers across bundled STT providers, reducing provider plugin boilerplate while preserving proxy capture, reconnects, audio queueing, close flushing, upload filename normalization, and ready handshakes.
- Plugin SDK/Pi embedded runs: add a bundled-plugin embedded extension factory seam so native plugins can extend Pi embedded runs with async runtime hooks such as `tool_result` handling instead of falling back to the older synchronous persistence path. (#69946) Thanks @vincentkoc.
- Codex harness/hooks: route native Codex app-server turns through `before_prompt_build` and emit `before_compaction` / `after_compaction` for native compaction items so prompt and compaction hooks stop drifting from Pi. Thanks @vincentkoc.
- Codex harness/plugins: add a bundled-plugin Codex app-server extension seam for async `tool_result` middleware, fire `after_tool_call` for Codex tool runs, and route mirrored Codex transcript writes through `before_message_write` so tool integrations stop diverging from Pi. Thanks @vincentkoc.
- Codex harness/hooks: fire `llm_input`, `llm_output`, and `agent_end` for native Codex app-server turns so lifecycle hooks stop drifting from Pi. Thanks @vincentkoc.
- QA/Telegram: record per-scenario reply RTT in the live Telegram QA report and summary, starting with the canary response. (#70550) Thanks @obviyus.
- Status: add an explicit `Runner:` field to `/status` so sessions now report whether they are running on embedded Pi, a CLI-backed provider, or an ACP harness agent/backend such as `codex (acp/acpx)` or `gemini (acp/acpx)`. (#70595)

### 🐛 问题修复（Fixes）

- Thinking defaults/status: raise the implicit default thinking level for reasoning-capable models from legacy `off`/`low` fallback behavior to a safe provider-supported `medium` equivalent when no explicit config default is set, preserve configured-model reasoning metadata when runtime catalog loading is empty, and make `/status` report the same resolved default as runtime.
- Gateway/model pricing: fetch OpenRouter and LiteLLM pricing asynchronously at startup and extend catalog fetch timeouts to 30 seconds, reducing noisy timeout warnings during slow upstream responses.
- Agents/sessions: keep daily reset and idle-maintenance bookkeeping from bumping session activity or pruning freshly active routes, so active conversations no longer look newer or disappear for maintenance-only updates.
- Plugins/install: add newly installed plugin ids to an existing `plugins.allow` list before enabling them, so allowlisted configs load installed plugins after restart.
- Status: show `Fast` in `/status` when fast mode is enabled, including config/default-derived fast mode, and omit it when disabled.
- OpenAI/image generation: detect Azure OpenAI-style image endpoints, use Azure `api-key` auth plus deployment-scoped image URLs, honor `AZURE_OPENAI_API_VERSION`, and document the Azure setup path so image generation and edits work against Azure-hosted OpenAI resources. (#70570) Thanks @zhanggpcsu.
- Telegram/forum topics: cache recovered forum metadata with bounded expiry so supergroup updates no longer need repeated `getChat` lookups before topic routing.
- Onboarding/WeCom: show the official WeCom channel plugin with its native Enterprise WeChat display name and blurb in the external channel catalog.
- Models/auth: merge provider-owned default-model additions from `openclaw models auth login` instead of replacing `agents.defaults.models`, so re-authenticating an OAuth provider such as OpenAI Codex no longer wipes other providers' aliases and per-model params. Migrations that must rename keys (Anthropic -> Claude CLI) opt in with `replaceDefaultModels`. Fixes #69414. (#70435) Thanks @neeravmakwana.
- Media understanding/audio: prefer configured or key-backed STT providers before auto-detected local Whisper CLIs, so installed local transcription tools no longer shadow API providers such as Groq/OpenAI in `tools.media.audio` auto mode. Fixes #68727.
- Providers/OpenAI: lock the auth picker wording for OpenAI API key, Codex browser login, and Codex device pairing so the setup choices no longer imply a mixed Codex/API-key auth path. (#67848) Thanks @tmlxrd.
- Agents/BTW: route `/btw` side questions through provider stream registration with the session workspace, so Ollama provider URL construction and workspace-scoped hooks apply correctly. Fixes #68336. (#70413) Thanks @suboss87.
- Agents/sessions: make session transcript write locks non-reentrant by default, so same-process transcript writers contend unless a helper explicitly opts into nested lock ownership.
- ACPX/probe: expose an optional `probeAgent` plugin config field so the embedded ACP runtime health probe can target a configured agent (for example `opencode` or `claude`) instead of hardcoding `codex`, and stop marking the entire ACP runtime backend unavailable when the default probe agent is simply not installed or not authenticated. (#68409) Thanks @lyfuci.
- Memory search: use sqlite-vec KNN for vector recall while preserving full post-filter result limits in multi-model indexes. Fixes #69666. (#69680) Thanks @aalekh-sarvam.
- Providers/OpenAI Codex: stop stale per-agent `openai-codex:default` OAuth profiles from shadowing a newer main-agent identity-scoped profile, and let `openclaw doctor` offer the matching cleanup. (#70393) Thanks @pashpashpash.
- ACPX: route OpenClaw ACP bridge commands through the MCP-free runtime path even when the command is wrapped with `env`, has bridge flags, or is resumed from persisted session state, so documented `acpx openclaw` setups no longer fail on per-session MCP injection. (#68741) Thanks @alexlomt.
- Codex harness: route Codex-tagged MCP tool approval elicitations through OpenClaw plugin approvals, including current empty-schema app-server requests, while leaving generic user-input prompts fail-closed. (#68807) Thanks @kesslerio.
- WhatsApp/outbound: hold an in-memory active-delivery claim while a live outbound send is in flight, so a concurrent reconnect drain no longer re-drives the same pending queue entry and duplicates cron sends 7-12x after the 30-minute inbound-silence watchdog fires mid-delivery. Crash-replay of fresh queue entries left behind by a dead process is preserved because the claim is intentionally process-local. Fixes #70386. (#70428) Thanks @neeravmakwana.
- Matrix/commands: keep Matrix DM allowlist state out of room control-command authorization, so trusted DM senders do not accidentally gain room-command access.
- Providers/SDK retry: cap long `Retry-After` sleeps in Stainless-based Anthropic/OpenAI model SDKs so 60s+ retry windows surface immediately for OpenClaw failover instead of blocking the run. (#68474) Thanks @jetd1.
- Agents/TTS: preserve spoken text in TTS tool results while defusing reply directives in transcript content, so future turns remember voice replies without treating spoken `MEDIA:` or voice tags as delivery metadata. (#68869) Thanks @zqchris.
- Providers/OpenAI: harden Voice Call realtime transcription against OpenAI Realtime session-update drift, forward language and prompt hints, and add live coverage for realtime STT.
- Agents/Pi embedded runs: suppress the "⚠️ Agent couldn't generate a response" warning when the assistant already delivered user-visible content through a messaging tool and the turn ended cleanly (`stopReason=stop`). Real failure modes (tool errors, provider `stopReason=error`, interrupted tool use) still surface the existing "verify before retrying" warning. Fixes #70396. (#70425) Thanks @neeravmakwana.
- Gateway/Linux: wrap gateway-managed supervisor, PTY, MCP stdio, and browser child processes in a tiny `/bin/sh` shim that raises the child's own `oom_score_adj` on Linux, so under cgroup memory pressure the kernel prefers transient workers over the long-lived gateway. Opt out with `OPENCLAW_CHILD_OOM_SCORE_ADJ=0`. Fixes #70404. (#70419) Thanks @neeravmakwana.
- Providers/Moonshot: stop strict-sanitizing Kimi's native tool_call IDs (shaped like `functions.<name>:<index>`) on the OpenAI-compatible transport, so multi-turn agentic flows through Kimi K2.6 no longer break after 2-3 tool-calling rounds when the serving layer fails to match mangled IDs against the original tool definitions. Adds a `sanitizeToolCallIds` opt-out to the shared `openai-compatible` replay family helper and wires Moonshot to it. Fixes #62319. (#70030) Thanks @LeoDu0314.
- Dependencies/security: override transitive `uuid` to `14.0.0`, clearing the runtime advisory across dependencies.
- Codex harness: ignore dynamic tool descriptions when deciding whether to reuse a native app-server thread while still fingerprinting tool schemas, so channel-specific copy changes no longer reset otherwise compatible Codex conversations. (#69976) Thanks @chen-zhang-cs-code.
- Codex harness: expose the Codex app-server model catalog in `models list/status`, avoid startup hangs from app-server discovery timeouts, and accept current Codex turn-completion notifications so Docker live gateway turns finish reliably.
- Codex harness: drop invalid legacy app-server `serviceTier` values such as `"priority"` before native thread and turn requests, while keeping supported Codex tiers limited to `"fast"` and `"flex"`. Fixes #64815.
- Codex harness: show bounded, sanitized permission target samples in app-server approval prompts, so native permission requests keep their specific hosts, roots, and paths visible without leaking home usernames or URL credentials. (#70340) Thanks @Lucenx9.
- Docs/Codex harness: narrow native compaction docs to the current start/completion signals, without promising a readable summary or kept-entry audit list yet. (#69612) Thanks @91wan.
- Providers/Amazon Bedrock: use known context-window metadata for discovered models while keeping the unknown-model fallback conservative, so compaction and overflow handling improve for newer Bedrock models without overstating unlisted model limits. Thanks @wirjo.
- Providers/Amazon Bedrock Mantle: refresh IAM-backed bearer tokens at runtime instead of baking discovery-time tokens into provider config, so long-lived Mantle sessions keep working after the initial token ages out. Thanks @wirjo.
- Config/includes: write through single-file top-level includes for isolated OpenClaw-owned mutations, so `plugins install` and `plugins update` update an included `plugins.json5` file instead of flattening modular `$include` configs. Fixes #41050 and #66048.
- Config/reload: plan gateway reloads from source-authored config instead of runtime-materialized snapshots, so plugin update writes no longer trigger false restarts from derived provider/plugin config paths. Fixes #68732.
- Plugins/update: skip npm plugin reinstall/config rewrites when the installed version and recorded artifact identity already match the registry target, let bare npm package names resolve back to tracked install records, and point already-installed `plugins install` attempts at `plugins update` / `--force` instead of a hook-pack fallback. Fixes #46955, #67957, and #68073.
- Agents/MCP: keep `mcp.servers` and bundle MCP tools available in Pi embedded
  `coding` and `messaging` sessions while preserving `minimal` profile and
  `tools.deny: ["bundle-mcp"]` opt-out behavior. Fixes #68875 and #68818.
- Plugins/startup: tolerate transient bundled-channel catalog/metadata drift while auto-enabling configured plugins, so CLI and gateway startup no longer crash when a channel id is known but its display metadata is unavailable.
- CLI/Claude: report CLI-backed reply runs as streaming while Claude/Codex CLI turns are still in flight, so WebChat keeps visible response state until the backend finishes. Fixes #70125.
- Slack/streaming: fall back to normal Slack replies for Slack Connect streams rejected before the SDK flushes its local buffer, so short replies no longer disappear or report success before Slack acknowledges delivery. Fixes #70295. (#70370) Thanks @mvanhorn.
- Codex harness: rotate the shared app-server websocket client when the configured bearer token changes, so auth-token refreshes reconnect with the new `Authorization` header instead of reusing a stale socket. (#70328) Thanks @Lucenx9.
- Channels/sandbox: derive runtime policy keys for external direct messages that share the main conversation, so sandbox/tool policy no longer treats channel-originated DMs as local main-session runs.
- Config/models: merge provider-scoped model allowlist updates and protect model/provider map writes from accidental full replacement, adding `config set --merge` for additive updates and `--replace` for intentional clobbers. Fixes #65920, #68392, and #68653.
- Agents/Pi auth: preserve AWS SDK-authenticated Bedrock runs for IMDS and task-role setups, clear stale refresh timers on sentinel fallback, and log unexpected runtime-auth prep failures instead of silently leaving the provider unauthenticated. Thanks @wirjo.
- Config/gateway: restore last-known-good config on critical clobber signatures such as missing metadata, missing `gateway.mode`, or sharp size drops, preventing gateway crash loops when a valid backup exists. Fixes #70336.
- Config/gateway: recover configs accidentally prefixed with non-JSON output during gateway startup or `openclaw doctor --fix`, preserving the clobbered file as a backup while leaving normal config reads read-only.
- Agents/GitHub Copilot: normalize connection-bound Responses item IDs in the Copilot provider wrapper so replayed histories no longer fail after the upstream connection changes. (#69362) Thanks @Menci.
- Pi embedded runs: pass real built-in tools into Pi session creation and then narrow active tool names after custom tool registration, so the runner and compaction paths compile cleanly and keep OpenClaw-managed custom tool allowlists without feeding string arrays into `createAgentSession`. Thanks @vincentkoc.
- Agents/OpenAI websocket: route native OpenAI websocket metadata and session-header decisions through the shared endpoint classifier so local mocks and custom `models.providers.openai.baseUrl` endpoints stay out of the native OpenAI path consistently across embedded-runner and websocket transport code. Thanks @vincentkoc.
- Cron/MCP: retire bundled MCP runtimes through one shared cleanup path for isolated cron run ends, persistent cron session rollover, and direct cron `deleteAfterRun` fallback cleanup. Fixes #69145, #68623, and #68827.
- MCP/gateway: tear down stdio MCP process trees on transport close and dispose bundled MCP runtimes during session delete/reset, preventing orphaned wrapper/server processes from accumulating. Fixes #68809 and #69465.
- Agents/MCP: retire bundled MCP runtimes after completed one-shot subagent cleanup and nested `sessions_send` steps, while keeping persistent subagent sessions warm.
- Config: render validation warnings with real line breaks instead of a literal `\n` sequence in CLI/audit output. Fixes #70140.
- Cron/doctor: repair malformed persisted cron job IDs through `openclaw doctor`, including legacy `jobId`, non-string `id`, and missing `id` rows, so `cron list` no longer needs display-layer coercion for corrupt store data. Fixes #70128.
- Discord: normalize prefixed channel targets only at the thread-binding API boundary, so `sessions_spawn({ runtime: "acp", thread: true })` can create child threads from Discord channels without breaking current-channel ACP bindings. (#68034) Thanks @Zetarcos.
- Discord: harden inbound thread metadata handling against partial Carbon channel getters, so non-command thread messages and queued jobs no longer crash when `name`, `parentId`, `parent`, or `ownerId` requires fetched raw data.
- Discord: let `message` tool reactions resolve `user:<id>` DM targets and preserve `channels.discord.guilds.<guild>.channels.<channel>.requireMention: false` during reply-stage activation fallback. Fixes #70165 and #69441.
- Plugins/startup: pre-normalize and cache Jiti alias maps before creating plugin loaders, so module-scoped loader filenames do not reintroduce per-plugin alias-normalization startup cost. Fixes #70186.
- ACP/Codex: run the bundled Codex ACP harness with an isolated `CODEX_HOME` and avoid writing incomplete ChatGPT auth bridge files, so Codex ACP sessions no longer clobber the user's real Codex CLI auth. Fixes #70234. Thanks @Lonobers88.
- Gateway/client: keep long-running RPCs such as ACP `agent.wait` calls in charge of their own timeout instead of closing the websocket on a missed app-level tick while work is still pending.
- Telegram/webhooks: lower the grammY webhook callback timeout to 5s so Telegram gets an early 200 response instead of retrying long-running updates as read timeouts. (#70146) Thanks @friday-james.
- Telegram/polling: rebuild the polling HTTP transport after `getUpdates` 409 conflicts, so retries use a fresh TCP connection instead of looping on a Telegram-terminated keep-alive socket. (#69873) Thanks @hclsys.
- Media delivery: strip persisted base64 audio payloads from webchat history, resolve stored `media://inbound/*` attachments before local-root checks, suppress duplicate Telegram voice/audio sends when TTS emits the same media twice, and support custom image-model IDs that already include their provider prefix.
- Slack/files: resolve `downloadFile` bot tokens from the runtime config when callers provide `cfg` without an explicit token or prebuilt client, preserving cfg-only file downloads outside the action runtime path. (#70160) Thanks @martingarramon.
- Slack/HTTP: dispatch registered Request URL webhooks through the same handler registry used by Slack monitor setup, so HTTP-mode Slack events no longer 404 after successful route registration. (#70275) Thanks @FroeMic.
- Slack/runtime bindings: route focused Slack thread replies through their bound ACP session instead of preparing replies against the default agent shell. Fixes #67739. Thanks @Frankla20.
- CLI/Claude: keep stored Claude CLI sessions through OAuth refresh-token rotation by keying auth epochs on stable account identity instead of mutable OAuth token material. (#70452) Thanks @obviyus.
- CLI/Claude: verify stored Claude CLI session ids have a readable project transcript before resuming, clearing phantom bindings with `reason=transcript-missing` instead of silently starting fresh under `--resume`. Fixes #70177.
- CLI sessions: persist CLI session clearing through the atomic session-store merge path, so expired Claude/Codex CLI bindings are actually removed before retrying without the stale session id. (#70298) Thanks @HFConsultant.
- ACP/sessions_spawn: honor explicit `model` overrides for ACP child sessions instead of silently falling back to the target agent default model. (#70210) Thanks @felix-miao.
- Diffs/viewer: re-read remote viewer access policy from live runtime config on each request, so toggling `plugins.entries.diffs.config.security.allowRemoteViewer` closes proxied viewer access immediately instead of waiting for a restart. Thanks @vincentkoc.
- Diffs/tooling: re-read `viewerBaseUrl`, presentation defaults, and viewer access policy from live runtime config, and fail closed when the live `diffs` plugin entry disappears instead of reviving startup viewer settings. Thanks @vincentkoc.
- Memory/LanceDB: stop resurrecting removed live `memory-lancedb` hook config from startup snapshots, so deleting or disabling the plugin entry shuts off auto-recall and auto-capture without a restart. Thanks @vincentkoc.
- Memory/LanceDB: keep auto-recall and auto-capture hooks wired when those settings start disabled, so turning them on in live config starts recall and capture without waiting for a restart. Thanks @vincentkoc.
- Skill Workshop: keep the tool plus `before_prompt_build` / `agent_end` hooks wired while the plugin is disabled at startup, so turning the plugin back on in live config starts guidance and capture without waiting for a restart. Thanks @vincentkoc.
- Active Memory: stop reviving removed live `active-memory` config from startup snapshots, so removing the plugin entry turns the hook off immediately instead of waiting for a restart. Thanks @vincentkoc.
- GitHub Copilot: re-read plugin discovery config from the live runtime snapshot, so toggling `plugins.entries.github-copilot.config.discovery.enabled` takes effect without a restart. Thanks @vincentkoc.
- Ollama: re-read plugin discovery config from the live runtime snapshot, so toggling `plugins.entries.ollama.config.discovery.enabled` takes effect without a restart. Thanks @vincentkoc.
- OpenAI: re-read the plugin prompt-overlay personality from live runtime config, so GPT-5 system prompt contributions update without a restart when `plugins.entries.openai.config.personality` changes. Thanks @vincentkoc.
- Amazon Bedrock: re-read live discovery and guardrail plugin config, so toggling `plugins.entries.amazon-bedrock.config.discovery` or `plugins.entries.amazon-bedrock.config.guardrail` takes effect without a restart. Thanks @vincentkoc.
- Codex: re-read the plugin discovery config from the live runtime snapshot, so toggling `plugins.entries.codex.config.discovery` takes effect without a restart. Thanks @vincentkoc.
- Agents/subagents: drop bare `NO_REPLY` from the parent turn when the session still has pending spawned children, so direct-conversation surfaces such as Telegram DMs no longer rewrite the sentinel into visible fallback chatter while waiting for the child completion event. (#69942) Thanks @neeravmakwana.
- Plugins/install: keep bundled plugin dependencies off npm install while repairing them when plugins activate from a packaged install, including Feishu/Lark, Browser, and direct bundled channel setup-entry loads.
- CLI/channels: skip and cache bundled channel plugin, setup, and secrets load failures during read-only discovery, so one broken unused bundled channel cannot crash `openclaw status` or bootstrap secret scans.
- Memory/LanceDB: retry initialization after a failed LanceDB load and report unsupported Intel macOS native runtime clearly instead of caching the failure or repeatedly attempting an install that cannot work.
- CLI/Claude: hash only static extra system prompt parts when deciding whether to reuse a CLI session, so per-message inbound metadata no longer resets Claude CLI conversations on every turn. (#70122) Thanks @zijunl.
- Hooks/Slack: standardize shared message hook routing fields (`threadId` / `replyToId`) and stop Slack outbound delivery from re-running `message_sending` inside the channel adapter, so plugins like thread-ownership make one outbound routing decision per reply. Thanks @vincentkoc.
- Auto-reply/media: share one run-scoped reply media context between streamed block delivery and final payload filtering, so a local `MEDIA:` attachment is staged once and duplicate media sends are suppressed reliably. (#68111) Thanks @ayeshakhalid192007-dev.
- Plugins/gateway hooks: expose startup config, workspace dir, and a live cron getter on the typed `gateway_start` hook, and move memory-core managed dreaming off the internal `gateway:startup` bridge so cron reconciliation stays on the public plugin hook path. Thanks @vincentkoc.
- Plugins/config: read plugin trust decisions from the source config snapshot when a resolved runtime snapshot is active, so `plugins.allow` remains enforced and `doctor`/gateway startup no longer warn that the allowlist is empty when it is configured. Fixes #70161. Also fixes #70141.
- Agents/openai-completions: enable malformed streamed tool-call argument repair for self-hosted OpenAI-compatible backends such as Kimi/SGLang, so fragmented tool-call arguments no longer reach tools as empty or unusable objects. Fixes #69672. (#70294) Thanks @MonkeyLeeT.
- Gateway/restart: preserve group and channel chat context when resuming an agent turn after a Gateway restart, so continuation replies keep the same prompt, routing, and tool-status behavior as the original conversation.
- Gateway/pairing: shared-secret loopback CLI clients now silently auto-approve `metadata-upgrade` pairing (platform / device family refresh) instead of being disconnected with `1008 pairing required`. This matches the scope-upgrade and role-upgrade behavior added in #69431 and unblocks non-interactive CLI automation when a paired-device record has a stale platform string (e.g. device key replicated across hosts, install migrated between OSes, or platform-string format changed between OpenClaw versions). Browser / Control-UI clients keep the existing approval-required flow for metadata changes.
- Gateway/pairing: treat any forwarded-header evidence (`Forwarded`, `X-Forwarded-*`, or `X-Real-IP`) as proxied WebSocket traffic before pairing locality checks, so reverse-proxy topologies cannot use the loopback shared-secret helper auto-pairing path.
- Agents/OpenAI: treat exact `NO_REPLY` assistant output as a deliberate silent reply in embedded runs, so GPT-5.4 turns with signed reasoning plus a silent final no longer surface a false incomplete-turn error.
- Auto-reply/streaming: preserve streamed reply directives through chunk boundaries and phase-aware `final_answer` delivery, so split `MEDIA:<path>` lines, voice tags, and reply targets reach channel delivery instead of leaking as text or being dropped. (#70243) Thanks @zqchris.
- Anthropic/Claude Opus 4.7: normalize Opus 4.7 and `claude-cli` Opus 4.7 variants to a 1M context window in resolved runtime metadata and active-agent status/context reporting, so they no longer inherit the stale 200k fallback. Thanks @BunsDev.
- Gateway/pairing webchat: render `/pair qr` replies as structured media instead of raw markdown text, preserve inline reply threading and silent-control handling on media replies, avoid persisting sensitive QR images into transcript history, and keep local webchat media embedding behind internal-only trust markers. (#70047) Thanks @BunsDev.
- Codex harness: default app-server runs to unchained local execution, so OpenAI heartbeats can use network and shell tools without stalling behind native Codex approvals or the workspace-write sandbox.
- Codex harness: fail closed for unknown native app-server approval methods instead of routing unsupported future approval shapes through OpenClaw approval grants. (#70356) Thanks @Lucenx9.
- Codex harness: apply the GPT-5 behavior and heartbeat prompt overlay to native Codex app-server runs, so `codex/gpt-5.x` sessions get the same follow-through, tool-use, and proactive heartbeat guidance as OpenAI GPT-5 runs.
- Codex harness: add an explicit Guardian mode for Codex app-server approvals, plus a Docker live probe for approved and ask-back Guardian decisions, while keeping default app-server runs unchained for unattended local heartbeats. The legacy `OPENCLAW_CODEX_APP_SERVER_GUARDIAN` shortcut is removed; use plugin config `appServer.mode: "guardian"` or `OPENCLAW_CODEX_APP_SERVER_MODE=guardian`. Thanks @pashpashpash.
- OpenAI/Responses: keep embedded OpenAI Responses runs on HTTP when `models.providers.openai.baseUrl` points at a local mock or other non-public endpoint, so mocked/custom endpoints no longer drift onto the hardcoded public websocket transport. (#69815) Thanks @vincentkoc.
- Channels/config: require resolved runtime config on channel send/action/client helpers and block runtime helper `loadConfig()` calls, so SecretRefs are resolved at startup/boundaries instead of being re-read during sends.
- Discord: pass resolved runtime config through guild and moderation action helpers, so thread-originated Discord commands can run channel, member, role, and guild actions without falling back to runtime config reads. (#70215) Thanks @szponeczek.
- CLI/channels: preserve bundled setup promotion metadata when a loaded partial channel plugin omits it, so adding a non-default account still moves legacy single-account fields such as Telegram `streaming` into `accounts.default`.
- Telegram: keep the sent-message ownership cache isolated per configured session store, so own-message reaction filtering remains correct with custom `session.store` paths.
- Security/update: fail closed when exact pinned npm plugin or hook-pack updates detect integrity drift, and expose aborted plugin drift details in `openclaw update --json`.
- Ollama: forward OpenClaw thinking control to native `/api/chat` requests as top-level `think`, so `/think off` and `openclaw agent --thinking off` suppress thinking on models such as qwen3 instead of idling until the watchdog fires. Fixes #69902. (#69967) Thanks @WZH8898.
- Memory-core/dreaming: suppress the startup-only managed dreaming cron unavailable warning when the cron service is still attaching, while preserving the runtime warning if cron genuinely remains unavailable. Fixes #69939. (#69941) Thanks @Sanjays2402.
- Mattermost: suppress reasoning-only payloads even when they arrive as blockquoted `> Reasoning:` text, preventing `/reasoning on` from leaking thinking into channel posts. (#69927) Thanks @lawrence3699.
- Discord: read `channel.parentId` through a safe accessor in the slash-command, reaction, and model-picker paths so partial `GuildThreadChannel` prototype getters no longer throw `Cannot access rawData on partial Channel` when commands like `/new` run from inside a thread. Fixes #69861. (#69908) Thanks @neeravmakwana.
- Discord: use safe channel name and parent accessors across voice command authorization, so `/vc` commands from partial Discord thread channels no longer crash on Carbon rawData getters. (#70199) Thanks @hanamizuki.
- Discord: make auto-thread parent transcript inheritance opt-in via `channels.discord.thread.inheritParent`, keeping newly created Discord thread sessions isolated by default while preserving explicit inheritance for configured accounts. Fixes #69907. (#69986) Thanks @Blahdude.
- Browser/Chrome MCP: reset cached existing-session control sessions when a `navigate_page` call times out, so one stuck navigation no longer poisons the browser profile until a gateway restart. (#69733) Thanks @ayeshakhalid192007-dev.
- Browser/Chrome MCP: propagate click timeouts and abort signals to existing-session actions so a stuck click fails fast and reconnects instead of poisoning the browser tool until gateway restart. (#63524) Thanks @dongseok0.
- Amazon Bedrock/prompt caching: resolve opaque application inference profile targets before injecting Bedrock cache points, require every routed target to support explicit cache points, and retry transient profile lookups instead of caching a false negative for the rest of the process. (#69953) Thanks @anirudhmarc and @vincentkoc.
- Gateway/channel health: base stale-socket recovery on provider-proven transport activity instead of inbound app-event freshness, preventing quiet Slack, Discord, Telegram, Matrix, and local-style channels from being restarted solely because no user traffic arrived. (#69833) Thanks @bek91.
- OpenCode Go: canonicalize stale bundled `opencode-go` base URLs from `/go` or `/go/v1` to `/zen/go` or `/zen/go/v1`, so older generated model metadata stops hitting the 404 HTML endpoint. (#69898)
- CLI/channels: honor `channels.<id>.enabled=false` as a hard read-only presence opt-out, so env vars, manifest env vars, or stale persisted auth state no longer make disabled channel plugins appear in status, doctor, or setup-only discovery.
- Channels/preview streaming: centralize draft-preview finalization so Slack, Discord, Mattermost, and Matrix no longer flush temporary preview messages for media/error finals, and preserve first-reply threading for normal fallback delivery.
- Discord: keep slash command follow-up chunks ephemeral when the command is configured for ephemeral replies, so long `/status` output no longer leaks fallback model or runtime details into the public channel. (#69869) thanks @gumadeiras.
- Gateway/session history: re-check current auth and `chat.history` scope before later SSE keepalives and transcript updates, so active session-history streams close before delivering post-revocation events.
- Plugins/discovery: reject package plugin source entries that escape the package directory before explicit runtime entries or inferred built JavaScript peers can be used. (#69868) thanks @gumadeiras.
- CLI/channels: resolve channel presence through a shared policy that keeps ambient env vars and stale persisted auth from surfacing disabled bundled plugins in status, doctor, security audit, and cron delivery validation unless the channel or plugin is effectively enabled or explicitly configured. (#69862) Thanks @gumadeiras.
- Doctor/plugins: hydrate legacy partial interactive handler state before plugin reload clears dedupe caches, so `openclaw doctor` and post-update doctor runs no longer crash with `Cannot read properties of undefined (reading 'clear')`. (#70135) Thanks @ngutman.
- Control UI/config: preserve intentionally empty raw config snapshots when clearing pending updates so reset restores the original bytes instead of synthesizing JSON for blank config files. (#68178) Thanks @BunsDev.
- memory-core/dreaming: surface a `Dreaming status: blocked` line in `openclaw memory status` when dreaming is enabled but the heartbeat that drives the managed cron is not firing for the default agent, and add a Troubleshooting section to the dreaming docs covering the two common causes (per-agent `heartbeat` blocks excluding `main`, and `heartbeat.every` set to `0`/empty/invalid), so the silent failure described in #69843 becomes legible on the status surface.
- Cron/run-log: report generic `message` tool sends under the resolved delivery channel when they match the cron target, while preserving account-specific mismatch checks for delivery traces. (#69940) Thanks @davehappyminion.
- Doctor/channels: merge configured-channel doctor hooks across read-only, loaded, setup, and runtime plugin discovery so partial adapters no longer hide runtime-only compatibility repair or allowlist warnings, preserve disabled-channel opt-outs, and ignore malformed hook values before they can mask valid fallbacks. (#69919) Thanks @gumadeiras.
- Models/CLI: show bundled provider-owned static catalog rows in `models list --all` before auth is configured, including Kimi K2.6 rows for Moonshot, OpenRouter, and Vercel AI Gateway, while keeping local-only and workspace plugin catalog paths isolated. (#69909) Thanks @shakkernerd.
- Models/CLI: clarify that `models list --provider` expects provider ids and reject display labels before loading model discovery. (#70504) Thanks @shakkernerd.
- Configure: skip generic CLI startup bootstrap for `openclaw configure` and bound hint-only gateway probes so the onboarding TUI reaches its first prompt faster when the Gateway is unavailable. (#69984) Thanks @obviyus.
- Agents/harness: surface selected plugin harness failures directly instead of replaying the same turn through embedded PI, preventing misleading secondary PI auth errors and avoiding duplicate side effects.
- OpenAI Codex: add a ChatGPT device-code auth option beside browser OAuth, so headless or callback-hostile setups can sign in without relying on the localhost browser callback. (#69557) Thanks @vincentkoc.
- CLI sessions: keep provider-owned CLI sessions through implicit daily expiry while preserving explicit reset behavior, and retain Claude CLI binding metadata across gateway agent requests. (#70106) Thanks @obviyus.
- fix(config): accept truncateAfterCompaction (#68395). Thanks @MonkeyLeeT
- CLI/Claude: keep Claude CLI session bindings stable across OAuth access-token refreshes, so gateway restarts continue the same Claude conversation instead of minting a fresh one. (#70132) Thanks @obviyus.
- QQBot: add `INTERACTION` intent (`1 << 26`) to the gateway constants and include it in the `FULL_INTENTS` mask so interaction events are received. (#70143) Thanks @cxyhhhhh.
- Gateway/restart: preserve one-shot continuation instructions across gateway restarts so agents can resume and reply back to the original chat after reboot. (#63406) Thanks @VACInc.
- Gateway/restart: write restart sentinel files atomically so interrupted writes cannot leave a truncated sentinel behind. (#70225) Thanks @obviyus.
- Pairing: remove stale pending requests for a device when that paired device is deleted, so an old repair approval cannot recreate the removed device from leftover state.
- Security/dotenv: block workspace `.env` overrides for Matrix, Mattermost, IRC, and Synology endpoint settings so cloned workspaces cannot redirect bundled connector traffic through local endpoint config. (#70240) Thanks @drobison00.
- Telegram: require the same `/models` authorization for group model-picker callbacks, so unauthorized participants can no longer browse or change the session model through inline buttons. (#70235) Thanks @drobison00.
- Agents/Pi: keep the filtered tool-name allowlist active for embedded OpenAI/OpenAI Codex GPT-5 runs and compaction sessions, so bundled and client tools still execute after the Pi `0.68.1` session-tool allowlist change instead of stopping at plan-only replies with no tool call. (#70281) Thanks @jalehman.
- Agents/Pi: honor explicit `strict-agentic` execution contracts for incomplete-turn retry guards across providers, so manually opted-in local or compatible models get the same retry behavior without relying on OpenAI model inference. (#66750) Thanks @ziomancer.
- OpenShell/sandbox: pin verified file reads to an already-opened descriptor, walk the ancestor chain for symlinked parents on platforms without fd-path readlink, and re-check file identity so parent symlink swaps cannot redirect in-sandbox reads to host files outside the allowed mount root. (#69798) Thanks @drobison00.
- Gateway/Control UI: require authenticated Control UI read access before serving `/__openclaw/control-ui-config.json` when `gateway.auth` is enabled, so unauthenticated callers can no longer read bootstrap metadata. (#70247) Thanks @drobison00.
- Gateway/restart: default session-scoped restart sentinels to a one-shot agent continuation, so chat-initiated Gateway restarts acknowledge successful boot automatically. (#70269) Thanks @obviyus.
- Build/npm publish: fail postpublish verification when root `dist/*` files import bundled plugin runtime dependencies without mirroring them in the root package manifest, so Slack-style plugin deps cannot silently ship on the wrong module-resolution path again. (#60112) thanks @medns.



## 🚀 v2026.4.21 (2026年4月22日)

### ✨ 新增功能与改进

- OpenAI/images: 将内置图像生成提供商和实时媒体冒烟测试默认设为 `gpt-image-2`，并在图像生成文档和工具元数据中宣传较新的 2K/4K OpenAI 尺寸提示。
- 插件/技能: 新增技能工作坊插件，捕获可重用工作流修正为待处理或自动应用 workspace 技能，在更强完成偏差上运行基于阈值的审阅者传递，并在安全写入后刷新技能可用性。
- 插件 SDK/频道: 新增演示和技能运行时契约，解耦频道演示渲染，记录消息演示卡片以便插件无需频道特定粘合代码即可拥有更丰富的交互表面。
- Fireworks/模型: 在内置目录和实时模型优先级列表中新增 Kimi K2.6 (`fireworks/accounts/fireworks/models/kimi-k2p6`)，同时保持 Fireworks K2.6 请求禁用 Kimi 思考。
- Onboard/wizard: 简化安全免责声明副本，将剩余带长动态选项列表的接入选择器切换为搜索自动补全（搜索提供商、插件配置和模型提供商过滤）。
- 频道/预览流: 将工具进度更新流式传输至 Discord、Slack 和 Telegram 的实时预览编辑，使进行中回复在同一预览消息中显示增量工具状态直至终态化。 (#69611) 感谢 @thewilloftheshadow。
- Ollama/接入: 从 `ollama.com/api/tags` 填充仅云模型列表，将发现列表上限设为 500，并在 ollama.com 不可用时回退至静态建议。 (#68463) 感谢 @BruceMacD。
- QQBot: 提取自包含引擎架构，含二维码接入、`/bot-approve` 原生审批处理、每账户资源栈、凭证备份/恢复、共享媒体存储及统一 API/桥接/网关模块。 (#67960) 感谢 @cxyhhhhh。
- Matrix/启动: 缩小 Matrix 运行时注册范围，延迟设置/doctor 表面使冷插件注册在 `setChannelRuntime` 中节省约 1.8 秒。 (#69782) 感谢 @gumadeiras。
- Telegram/插件启动: 通过窄侧车和原生内置侧车加载加载 Telegram 内置运行时设置器，将测量设置运行时注册缩短约 14 秒，同时保留运行时 API 兼容性。 (#69786) 感谢 @gumadeiras。
- Discord/插件启动: 延迟加载 Carbon UI 运行时并通过窄侧车加载 Discord 内置运行时设置器，将测量注册时间缩短约 98%，同时使打包安装的 Carbon 保持离线直至 Discord UI 表面需要。 (#69791) 感谢 @gumadeiras。

### 🐛 问题修复

- Agents/ACP: 父级向自身后台单次 ACP 子级发送时跳过 `sessions_send` A2A 乒乓流，防止父子回环同时为非父发送者保留正常 A2A 投递。 (#69817) 感谢 @scotthuang。
- 图像生成: 在自动提供商回退前以 warn 级别记录失败的提供商/模型候选，使 OpenAI 图像失败即使后续提供商成功也在 Gateway 日志中可见。
- Agents/子代理: 阻止终端失败子代理运行冻结或宣布捕获的回复文本，使耗尽故障转移的运行报告干净失败而非重放过时的助手/工具输出。
- 安全/外部内容: 从包装的外部内容和元数据中剥离常见自托管 LLM 聊天模板特殊标记文字，包括 Qwen/ChatML、Llama、Gemma、Mistral、Phi 和 GPT-OSS 标记，防止针对保留用户文本特殊标记的 OpenAI 兼容后端的标记层角色边界欺骗。
- npm/安装: 将 `node-domexception` 别名镜像至根 `package.json` `overrides`，使 npm 安装停止通过 Pi/Google 运行时依赖链显示已弃用的 `google-auth-library -> gaxios -> node-fetch -> fetch-blob -> node-domexception`。感谢 @vincentkoc。
- 认证/命令: 要求所有者身份（所有者候选匹配或内部 `operator.admin`）执行所有者强制命令，而非将通配符频道 `allowFrom` 或空所有者候选列表视为充分，使非所有者发送者在 `enforceOwnerForCommands=true` 且 `commands.ownerAllowFrom` 未设置时不再通过宽松回退访问仅所有者命令。 (#69774) 感谢 @drobison00。
- Control UI/CSP: 将 `img-src` 收窄至 `'self' data:`，并使 Control UI 头像辅助函数丢弃远程 `http(s)` 和协议相对 URL，使 UI 回退至内置 logo/徽章而非发起任意远程图像获取。同源头像路由（相对路径）和 `data:image/...` 头像仍正常渲染。 (#69773)
- CLI/频道: 在 Telegram、Slack、Discord 或第三方频道插件配置时保持 `status`、`health`、`channels list` 和 `channels status` 只读频道元数据，避免在这些冷路径上全量导入内置插件运行时。修复 #69042。 (#69479) 感谢 @gumadeiras。
- Synology Chat: 在转发至 NAS 前根据共享 SSRF 策略验证出站 webhook `file_url` 值，拒绝格式错误的 URL、非 `http(s)` 方案和私有/封锁网络目标，防止 NAS 被用作混淆代理获取内部地址。 (#69784) 感谢 @eleqtrizit。
- LINE: 在提交至 LINE 前根据公共网络守卫验证出站媒体 URL，保留任意公共 HTTPS 媒体同时拒绝回环、链路本地和私有网络目标。
- Gateway/Control UI: 在认证配置时要求 Control UI 头像路由（`GET /avatar/<agentId>` 和 `?meta=1` 元数据）的 Gateway 认证，匹配同级 assistant-media 路由，并通过 UI 头像获取传播现有 Gateway 令牌（承载令牌 + 认证 blob URL），使认证仪表盘仍可加载本地头像。 (#69775)
- Google Chat/认证: 用限定 SSRF 守卫传输替换 Google 认证 `gaxios` 填充，根据可信 Google URL 验证服务账户认证端点，让插件拥有其暂存 `gaxios` 认证运行时而非修补进程级全局或根 CLI 启动路径。感谢 @vincentkoc。
- Exec/许可列表: 在外壳审批分析期间拒绝未引用 heredocs 内部的 POSIX 参数展开形式如 `$VAR`、`$?`、`$$`、`$1` 和 `$@`，使这些 heredocs 不再作为纯文本通过许可列表审查。 (#69795) 感谢 @drobison00。
- Gateway/MCP 回环: 从不同认证所有者与非所有者回环承载者而非调用者控制的所有者头派生仅所有者工具可见性，防止非所有者 MCP 子进程通过欺骗请求元数据恢复所有者访问。 (#69796)
- GitHub Copilot: 在 GitHub 移除 4.6 Copilot 支持后，将默认 Opus 模型从 `claude-opus-4.6` 更新至 `claude-opus-4.7`。 (#69818) 感谢 @shakkernerd。
- OpenShell: 将主机端沙箱写入固定在挂载根目录下，使符号链接父级重新绑定无法在本地镜像更新期间将 `writeFile` 重定向至 workspace 外。 (#69797) 感谢 @drobison00。
- Ollama/媒体理解: 将 Ollama 注册为图像能力媒体理解提供商，使 `agents.defaults.imageModel.primary` 值如 `ollama/qwen2.5vl:7b` 通过 Ollama 插件路由而非作为未知模型失败。 (#69816) 感谢 @soloclz。
- CLI/媒体理解: 使 `openclaw infer image describe --model <provider/model>` 执行显式图像模型而非在该模型支持原生视觉时跳过描述。
- Usage/提供商: 当清单声明的提供商认证环境变量如 `MINIMAX_CODE_PLAN_KEY` 存在时保持插件拥有的使用认证启用，使 `/usage` 可通过提供商插件解析 MiniMax 计费凭证。
- Tlon/上传: 将托管 Memex 上传目标和自定义 S3 预签名上传 URL 均通过共享 SSRF 守卫路由，使封锁的私有或回环目标在上载前失败，而公共上传 URL 继续通过现有托管上传流。 (#69794) 感谢 @drobison00。
- 频道/线程路由: 通过跨内置插件共享的插件 SDK 线程感知路由构建器保持出站回复在现有 Slack、Mattermost、Matrix、Telegram、Discord 和 QA 频道线程会话中。
- Agents/回放: 在提供商回放和提示提交前规范化恢复的助手文本内容，使遗留或修复会话不再在 `assistantMsg.content.flatMap` 上崩溃。 (#69850) 感谢 @fuller-stack-dev。

## 🚀 v2026.4.20 (2026年4月20日)

### ✨ 新增功能与改进

- Onboard/wizard: restyle the setup security disclaimer with a single yellow warning banner, section headings and bulleted checklists, and un-dim the note body so key guidance is easy to scan; add a loading spinner during the initial model catalog load so the wizard no longer goes blank while it runs; add an "API key" placeholder to provider API key prompts. (#69553) 感谢 @Patrick-Erichsen.
- Agents/prompts: strengthen the default system prompt and OpenAI GPT-5 overlay with clearer completion bias, live-state checks, weak-result recovery, and verification-before-final guidance.
- Models/costs: support tiered model pricing from cached catalogs and configured models, and include bundled Moonshot Kimi K2.6/K2.5 cost estimates for token-usage reports. (#67605) 感谢 @sliverp.
- Sessions/Maintenance: enforce the built-in entry cap and age prune by default, and prune oversized stores at load time so accumulated cron/executor session backlogs cannot OOM the gateway before the write path runs. (#69404) 感谢 @bobrenze-bot.
- Plugins/tests: reuse plugin loader alias and Jiti config resolution across repeated same-context loads, reducing import-heavy test overhead. (#69316) 感谢 @amknight.
- Cron: split runtime execution state into `jobs-state.json` so `jobs.json` stays stable for git-tracked job definitions. (#63105) 感谢 @Feelw00.
- Agents/compaction: send opt-in start and completion notices during context compaction. (#67830) 感谢 @feniix.
- Moonshot/Kimi: default bundled Moonshot setup, web search, and media-understanding surfaces to `kimi-k2.6` while keeping `kimi-k2.5` available for compatibility. (#69477) 感谢 @scoootscooob.
- Moonshot/Kimi: allow `thinking.keep = "all"` on `moonshot/kimi-k2.6`, and strip it for other Moonshot models or requests where pinned `tool_choice` disables thinking. (#68816) 感谢 @aniaan.
- BlueBubbles/groups: forward per-group `systemPrompt` config into inbound context `GroupSystemPrompt` so configured group-specific behavioral instructions (for example threaded-reply and tapback conventions) are injected on every turn. Supports `"*"` wildcard fallback matching the existing `requireMention` pattern. Closes #60665. (#69198) 感谢 @omarshahine.
- Plugins/tasks: add a detached runtime registration contract so plugin executors can own detached task lifecycle and cancellation without reaching into core task internals. (#68915) 感谢 @mbelinky.
- Terminal/logging: optimize `sanitizeForLog()` by replacing the iterative control-character stripping loop with a single regex pass while preserving the existing ANSI-first sanitization behavior. (#67205) 感谢 @bulutmuf.
- QA/CI: make `openclaw qa suite` and `openclaw qa telegram` fail by default when scenarios fail, add `--allow-failures` for artifact-only runs, and tighten live-lane defaults for CI automation. (#69122) 感谢 @joshavant.
- Mattermost: stream thinking, tool activity, and partial reply text into a single draft preview post that finalizes in place when safe. (#47838) thanks @ninjaa.

### 🐛 问题修复

- Exec/YOLO: stop rejecting gateway-host exec in `security=full` plus `ask=off` mode via the Python/Node script preflight hardening path, so promptless YOLO exec once again runs direct interpreter stdin and heredoc forms such as `node <<'NODE' ... NODE`.
- OpenAI Codex: normalize legacy `openai-completions` transport overrides on default OpenAI/Codex and GitHub Copilot-compatible hosts back to the native Codex Responses transport while leaving custom proxies untouched. (#45304, #42194) 感谢 @dyss1992 and @DeadlySilent.
- Anthropic/plugins: scope Anthropic `api: "anthropic-messages"` defaulting to Anthropic-owned providers, so `openai-codex` and other providers without an explicit `api` no longer get rewritten to the wrong transport. Fixes #64534.
- fix(qqbot): add SSRF guard to direct-upload URL paths in uploadC2CMedia and uploadGroupMedia [AI-assisted]. (#69595) 感谢 @pgondhi987.
- fix(gateway): enforce allowRequestSessionKey gate on template-rendered mapping sessionKeys. (#69381) 感谢 @pgondhi987.
- Browser/Chrome MCP: surface `DevToolsActivePort` attach failures as browser-connectivity errors instead of a generic "waiting for tabs" timeout, and point signed-out fallbacks toward the managed `openclaw` profile.
- Webchat/images: treat inline image attachments as media for empty-turn gating while still ignoring metadata-only blank turns. (#69474) 感谢 @Jaswir.
- Discord/think: only show `adaptive` in `/think` autocomplete for provider/model pairs that actually support provider-managed adaptive thinking, so GPT/OpenAI models no longer advertise an Anthropic-only option.
- Thinking: only expose `max` for models that explicitly support provider max reasoning, and remap stored `max` settings to the largest supported thinking mode when users switch to another model.
- Thinking/UI: drive `/think` options and chat/Sessions pickers from provider-owned thinking profiles, so custom model level sets such as binary `on/off`, Gemini 3 Pro `off/low/high`, Anthropic `adaptive/max`, and OpenAI `xhigh` stay in one runtime contract.
- Gateway/usage: bound the cost usage cache with FIFO eviction so date/range lookups cannot grow unbounded. (#68842) 感谢 @Feelw00.
- OpenAI/Responses: resolve `/think` levels against each GPT model's supported reasoning efforts so `/think off` no longer becomes high reasoning or sends unsupported `reasoning.effort: "none"` payloads.
- Lobster/TaskFlow: allow managed approval resumes to use `approvalId` without a resume token, and persist that id in approval wait state. (#69559) 感谢 @kirkluokun.
- Plugins/startup: install bundled runtime dependencies into each plugin's own runtime directory, reuse source-checkout repair caches after rebuilds, and log only packages that were actually installed so repeated Gateway starts stay quiet once deps are present.
- Plugins/startup: ignore pnpm's `npm_execpath` when repairing bundled plugin runtime dependencies and skip workspace-only package specs so npm-only install flags or local workspace links do not break packaged plugin startup.
- MCP: block interpreter-startup env keys such as `NODE_OPTIONS` for stdio servers while preserving ordinary credential and proxy env vars. (#69540) 感谢 @drobison00.
- Agents/shell: ignore non-interactive placeholder shells like `/usr/bin/false` and `/sbin/nologin`, falling back to `sh` so service-user exec runs no longer exit immediately. (#69308) 感谢 @sk7n4k3d.
- Setup/TUI: relaunch the setup hatch TUI in a fresh process while preserving the configured gateway target and auth source, so onboarding recovers terminal state cleanly without exposing gateway secrets on command-line args. (#69524) 感谢 @shakkernerd.
- Codex: avoid re-exposing the image-generation tool on native vision turns with inbound images, and keep bare image-model overrides on the configured image provider. (#65061) 感谢 @zhulijin1991.
- Sessions/reset: clear auto-sourced model, provider, and auth-profile overrides on `/new` and `/reset` while preserving explicit user selections, so channel sessions stop staying pinned to runtime fallback choices. (#69419) 感谢 @sk7n4k3d.
- Sessions/costs: snapshot `estimatedCostUsd` like token counters so repeated persist paths no longer compound the same run cost by up to dozens of times. (#69403) 感谢 @MrMiaigi.
- OpenAI Codex: route ChatGPT/Codex OAuth Responses requests through the `/backend-api/codex` endpoint so `openai-codex/gpt-5.4` no longer hits the removed `/backend-api/responses` alias. (#69336) 感谢 @mzogithub.
- OpenAI/Responses: omit disabled reasoning payloads when `/think off` is active, so GPT reasoning models no longer receive unsupported `reasoning.effort: "none"` requests. (#61982) 感谢 @a-tokyo.
- Gateway/pairing: treat loopback shared-secret node-host, TUI, and gateway clients as local for pairing decisions, so trusted local tools no longer reconnect as remote clients and fail with `pairing required`. (#69431) 感谢 @SARAMALI15792.
- Active Memory: degrade gracefully when memory recall fails during prompt building, logging a warning and letting the reply continue without memory context instead of failing the whole turn. (#69485) 感谢 @Magicray1217.
- Ollama: add provider-policy defaults for `baseUrl` and `models` so implicit local discovery can run before config validation rejects a minimal Ollama provider config. (#69370) 感谢 @PratikRai0101.
- Agents/model selection: clear transient auto-failover session overrides before each turn so recovered primary models are retried immediately without emitting user-override reset warnings. (#69365) 感谢 @hitesh-github99.
- Auto-reply: apply silent `NO_REPLY` policy per conversation type, so direct chats get a helpful rewritten reply while groups and internal deliveries can remain quiet. (#68644) 感谢 @Takhoffman.
- Telegram/status reactions: honor `messages.removeAckAfterReply` when lifecycle status reactions are enabled, clearing or restoring the reaction after success/error using the configured hold timings. (#68067) 感谢 @poiskgit.
- Web search/plugins: resolve plugin-scoped SecretRef API keys for bundled Exa, Firecrawl, Gemini, Kimi, Perplexity, Tavily, and Grok web-search providers when they are selected through the shared web-search config. (#68424) 感谢 @afurm.
- Telegram/polling: raise the default polling watchdog threshold from 90s to 120s and add configurable `channels.telegram.pollingStallThresholdMs` (also per-account) so long-running Telegram work gets more room before polling is treated as stalled. (#57737) 感谢 @Vitalcheffe.
- Telegram/polling: bound the persisted-offset confirmation `getUpdates` probe with a client-side timeout so a zombie socket cannot hang polling recovery before the runner watchdog starts. (#50368) 感谢 @boticlaw.
- Agents/Pi runner: retry silent `stopReason=error` turns with no output when no side effects ran, so non-frontier providers that briefly return empty error turns get another chance instead of ending the session early. (#68310) 感谢 @Chased1k.
- Plugins/memory: preserve the active memory capability when read-only snapshot plugin loads run, so status and provider discovery paths no longer wipe memory public artifacts. (#69219) 感谢 @zeroaltitude.
- Plugins: keep only the highest-precedence manifest when distinct discovered plugins share an id, so lower-precedence global or workspace duplicates no longer load beside bundled or config-selected plugins. (#41626) 感谢 @Tortes.
- fix(security): block MINIMAX_API_HOST workspace env injection and remove env-driven URL routing [AI-assisted]. (#67300) 感谢 @pgondhi987.
- Cron/delivery: treat explicit `delivery.mode: "none"` runs as not requested even if the runner reports `delivered: false`, so no-delivery cron jobs no longer persist false delivery failures or errors. (#69285) 感谢 @matsuri1987.
- Plugins/install: repair active and default-enabled bundled plugin runtime dependencies before import in packaged installs, so bundled Discord, WhatsApp, Slack, Telegram, and provider plugins work without putting their dependency trees in core.
- BlueBubbles: raise the outbound `/api/v1/message/text` send timeout default from 10s to 30s, and add a configurable `channels.bluebubbles.sendTimeoutMs` (also per-account) so macOS 26 setups where Private API iMessage sends stall for 60+ seconds no longer silently lose messages at the 10s abort. Probes, chat lookups, and health checks keep the shorter 10s default. Fixes #67486. (#69193) 感谢 @omarshahine.
- Agents/bootstrap: budget truncation markers against per-file caps, preserve source content instead of silently wasting bootstrap bytes, and avoid marker-only output in tiny-budget truncation cases. (#69114) 感谢 @BKF-Gitty.
- Context engine/plugins: stop rejecting third-party context engines whose `info.id` differs from the registered plugin slot id. The strict-match contract added in 2026.4.14 broke `lossless-claw` and other plugins whose internal engine id does not equal the slot id they are registered under, producing repeated `info.id must match registered id` lane failures on every turn. Fixes #66601. (#66678) 感谢 @GodsBoy.
- Agents/compaction: rename embedded Pi compaction lifecycle events to `compaction_start` / `compaction_end` so OpenClaw stays aligned with `pi-coding-agent` 0.66.1 event naming. (#67713) 感谢 @mpz4life.
- Security/dotenv: block all `OPENCLAW_*` keys from untrusted workspace `.env` files so workspace-local env loading fails closed for new runtime-control variables instead of silently inheriting them.（#473）
- Gateway/device pairing: restrict non-admin paired-device sessions (device-token auth) to their own pairing list, approve, and reject actions so a paired device cannot enumerate other devices or approve/reject pairing requests authored by another device. Admin and shared-secret operator sessions retain full visibility. (#69375) 感谢 @eleqtrizit.
- Agents/gateway tool: extend the agent-facing `gateway` tool's config mutation guard so model-driven `config.patch` and `config.apply` cannot rewrite operator-trusted paths (sandbox, plugin trust, gateway auth/TLS, hook routing and tokens, SSRF policy, MCP servers, workspace filesystem hardening) and cannot bypass the guard by editing per-agent sandbox, tools, or embedded-Pi overrides in place under `agents.list[]`. (#69377) 感谢 @eleqtrizit.
- Gateway/websocket broadcasts: require `operator.read` (or higher) for chat, agent, and tool-result event frames so pairing-scoped and node-role sessions no longer passively receive session chat content, and scope-gate unknown broadcast events by default. Plugin-defined `plugin.*` broadcasts are scoped to operator.write/admin, and status/transport events (`heartbeat`, `presence`, `tick`, etc.) remain unrestricted. Per-client sequence numbers preserve per-connection monotonicity. (#69373) 感谢 @eleqtrizit.
- Agents/compaction: always reload embedded Pi resources through an explicit loader and reapply reserve-token overrides so runs without extension factories no longer silently lose compaction settings before session start. (#67146) 感谢 @ly85206559.
- Memory-core/dreaming: normalize sweep timestamps and reuse hashed narrative session keys for fallback cleanup so Dreaming narrative sub-sessions stop leaking. (#67023) 感谢 @chiyouYCH.
- Gateway/startup: delay HTTP bind until websocket handlers are attached, so immediate post-startup websocket health/connect probes no longer hit the startup race window. (#43392) 感谢 @dalefrieswthat.
- Codex/app-server: release the session lane when a downstream consumer throws while draining the `turn/completed` notification, so follow-up messages after a Codex plugin reply stop queueing behind a stale lane lock. Fixes #67996. (#69072) 感谢 @ayeshakhalid192007-dev.
- Codex/app-server: default approval handling to `on-request` so Codex harness sessions do not start with overly permissive tool approvals. (#68721) 感谢 @Lucenx9.
- Cron/delivery: keep isolated cron chat delivery tools available, resolve `channel: "last"` targets from the gateway, show delivery previews in `cron list/show`, and avoid duplicate fallback sends after direct message-tool delivery. (#69587) 感谢 @obviyus.
- BlueBubbles: add opt-in `channels.bluebubbles.coalesceSameSenderDms` so a single composed message with text + pasted URL (which Apple splits into two webhooks ~0.8-2.0 s apart) arrives as one agent turn instead of two. When enabled, DM messages that are not linked via `associatedMessageGuid` hash to `dm:<chat>:<sender>` so the inbound debounce window merges them into a single merged turn — including URL-preview balloon events, DM control-command sends (which normally bypass debouncing), and rapid same-sender follow-ups. The default inbound debounce window widens from 500 ms to 2500 ms when the flag is set without an explicit `messages.inbound.byChannel.bluebubbles`, covering the observed Apple split-send cadence. Every source `messageId` folded into the merged view is committed to the inbound dedupe store after processing, so a later MessagePoller replay of any individual source event is recognized as a duplicate. Merged output is bounded (≤4000 chars text with an explicit `…[truncated]` marker, ≤20 attachments, first-plus-latest sampling beyond 10 source entries) so a rapid-fire flood inside the window cannot amplify the downstream prompt. Group chats and existing text+balloon follow-ups continue to key per-message. See [Coalescing split-send DMs](https://docs.openclaw.ai/channels/bluebubbles#coalescing-split-send-dms-command--url-in-one-composition) for scenarios, tuning, and troubleshooting. (#69258) 感谢 @omarshahine.
- Cron/Telegram: key isolated direct-delivery dedupe to each cron execution instead of the reused session id, so recurring Telegram announce runs no longer report delivered while silently skipping later sends. (#69000) 感谢 @obviyus.
- Models/Kimi: default bundled Kimi thinking to off and normalize Anthropic-compatible `thinking` payloads so stale session `/think` state no longer silently re-enables reasoning on Kimi runs. (#68907) 感谢 @frankekn.
- Control UI/cron: keep the runtime-only `last` delivery sentinel from being materialized into persisted cron delivery and failure-alert channel configs when jobs are created or edited. (#68829) 感谢 @tianhaocui.
- OpenAI/Responses: strip orphaned reasoning blocks before outbound Responses API calls so compacted or restored histories no longer fail on standalone reasoning items. (#55787) 感谢 @suboss87.
- Cron/CLI: parse PowerShell-style `--tools` allow-lists the same way as comma-separated input, so `cron add` and `cron edit` no longer persist `exec read write` as one combined tool entry on Windows. (#68858) 感谢 @chen-zhang-cs-code.
- Browser/user-profile: let existing-session `profile="user"` tool calls auto-route to a connected browser node or use explicit `target="node"`, while still honoring explicit `target="host"` pinning.（#48677）
- Discord/slash commands: tolerate partial Discord channel metadata in slash-command and model-picker flows so partial channel objects no longer crash when channel names, topics, or thread parent metadata are unavailable. (#68953) 感谢 @dutifulbob.
- BlueBubbles: consolidate outbound HTTP through a typed `BlueBubblesClient` that resolves the SSRF policy once at construction so image attachments stop getting blocked on localhost and reactions stop getting blocked on private-IP BB deployments. Fixes #34749 and #59722. (#68234) 感谢 @omarshahine.
- Cron/gateway: reject ambiguous announce delivery config at add/update time so invalid multi-channel or target-id provider settings fail early instead of persisting broken cron jobs. (#69015) 感谢 @obviyus.
- Cron/main-session delivery: preserve `heartbeat.target="last"` through deferred wake queuing, gateway wake forwarding, and same-target wake coalescing so queued cron replies still return to the last active chat. (#69021) 感谢 @obviyus.
- Cron/gateway: ignore disabled channels when announce delivery ambiguity is checked, and validate main-session delivery patches against the live cron service default agent so hot-reloaded agent config does not falsely reject valid updates. (#69040) 感谢 @obviyus.
- Matrix/allowlists: hot-reload `dm.allowFrom` and `groupAllowFrom` entries on inbound messages while keeping config removals authoritative, so Matrix allowlist changes no longer require a channel restart to add or revoke a sender. (#68546) 感谢 @johnlanni.
- BlueBubbles: always set `method` explicitly on outbound text sends (`"private-api"` when available, `"apple-script"` otherwise), and prefer Private API on macOS 26 even for plain text. Fixes silent delivery failure on macOS setups without Private API where an omitted `method` let BB Server fall back to version-dependent default behavior that silently drops the message (#64480), and the AppleScript `-1700` error on macOS 26 Tahoe plain text sends (#53159). (#69070) 感谢 @xqing3.
- Matrix/commands: recognize slash commands that are prefixed with the bot's Matrix mention, so room messages like `@bot:server /new` trigger the command path without requiring custom mention regexes. (#68570) 感谢 @nightq and @johnlanni.
- Gateway/pairing: return reason-specific `PAIRING_REQUIRED` details, remediation hints, and request ids so unapproved-device and scope-upgrade failures surface actionable recovery guidance in the CLI and Control UI. (#69227) 感谢 @obviyus.
- Agents/subagents: include requested role and runtime timing on subagent failure payloads so parent agents can correlate failed or timed-out child work. (#68726) 感谢 @BKF-Gitty.
- Gateway/sessions: reject stale agent-scoped sessions after an agent is removed from config while preserving legacy default-agent main-session aliases. (#65986) 感谢 @bittoby.
- Doctor/gateway: surface pending device pairing requests, scope-upgrade approval drift, and stale device-token mismatch repair steps so `openclaw doctor --fix` no longer leaves pairing/auth setup failures unexplained. (#69210) 感谢 @obviyus.
- Cron/isolated-agent: preserve explicit `delivery.mode: "none"` message targets for isolated runs without inheriting implicit `last` routing, so agent-initiated Telegram sends keep their authored destination while bare `mode:none` jobs stay targetless. (#69153) 感谢 @obviyus.
- Cron/isolated-agent: keep `delivery.mode: "none"` account-only or thread-only configs from inheriting a stale implicit recipient, so isolated runs only resolve message routing when the job authored an explicit `to` target. (#69163) 感谢 @obviyus.
- Gateway/TUI: retry session history while the local gateway is still finishing startup, so `openclaw tui` reconnects no longer fail on transient `chat.history unavailable during gateway startup` errors. (#69164) 感谢 @shakkernerd.
- BlueBubbles/reactions: fall back to `love` when an agent reacts with an emoji outside the iMessage tapback set (`love`/`like`/`dislike`/`laugh`/`emphasize`/`question`), so wider-vocabulary model reactions like `👀` still produce a visible tapback instead of failing the whole reaction request. Configured ack reactions still validate strictly via the new `normalizeBlueBubblesReactionInputStrict` path. (#64693) 感谢 @zqchris.
- BlueBubbles: prefer iMessage over SMS when both chats exist for the same handle, honor explicit `sms:` targets, and never silently downgrade iMessage-available recipients. (#61781) 感谢 @rmartin.
- Telegram/setup: require numeric `allowFrom` user IDs during setup instead of offering unsupported `@username` DM resolution, and point operators to `from.id`/`getUpdates` for discovery. (#69191) 感谢 @obviyus.
- GitHub Copilot/onboarding: default GitHub Copilot setup to `claude-opus-4.6` and keep the bundled default model list aligned, so new Copilot setups no longer start on the older `gpt-4o` default. (#69207) 感谢 @obviyus.
- Gateway/status: separate reachability, capability, and read-probe reporting so connect-only or scope-limited sessions no longer look fully healthy, and normalize SSH targets entered as `ssh user@host`. (#69215) 感谢 @obviyus.
- Slack: fix outbound replies failing with "unresolved SecretRef" for accounts configured via `file` or `exec` secret sources; the send path now tolerates the runtime snapshot retaining an unresolved channel SecretRef when a boot-resolved token override is already available. (#68954) 感谢 @openperf.
- Control UI/device pairing: explain scope and role approval upgrades during reconnects, and show requested versus approved access in the Control UI and `openclaw devices` so broader reconnects no longer look like lost pairings. (#69221) 感谢 @obviyus.
- Gateway/Control UI: surface pending scope, role, and device-metadata pairing approvals in auth errors and Control UI hints so broader reconnects no longer look like random auth breakage. (#69226) 感谢 @obviyus.
- Telegram/media: parse lowercase media directives in block replies and preserve outbound attachment filenames, so generated files send once with their original names. (#69641) 感谢 @obviyus.
- Agents/Anthropic: honor explicit `cacheRetention: "long"` for custom `anthropic-messages` endpoints by applying the 1-hour ephemeral cache TTL independently of the Anthropic/Vertex hostname allowlist. Implicit and env-driven long retention still require an allowlisted host. (#67800) 感谢 @MonkeyLeeT.

## 🚀 v2026.4.19-beta.2 (2026年4月19日)

### 🐛 问题修复

- Agents/openai-completions: always send `stream_options.include_usage` on streaming requests, so local and custom OpenAI-compatible backends report real context usage instead of showing 0%. (#68746) 感谢 @kagura-agent.
- Agents/nested lanes: scope nested agent work per target session so a long-running nested run on one session no longer head-of-line blocks unrelated sessions across the gateway. (#67785) 感谢 @stainlu.
- Agents/status: preserve carried-forward session token totals for providers that omit usage metadata, so `/status` and `openclaw sessions` keep showing the last known context usage instead of dropping back to unknown/0%. (#67695) 感谢 @stainlu.
- Install/update: keep legacy update verification compatible with the QA Lab runtime shim, so updating older global installs to beta no longer fails after npm installs the package successfully.

## 🚀 v2026.4.19-beta.1 (2026年4月19日)

### 🐛 问题修复

- Agents/channels: route cross-agent subagent spawns through the target agent's bound channel account while preserving peer and workspace/role-scoped bindings, so child sessions no longer inherit the caller's account in shared rooms, workspaces, or multi-account setups. (#67508) 感谢 @lukeboyett and @gumadeiras.
- Telegram/callbacks: treat permanent callback edit errors as completed updates so stale command pagination buttons no longer wedge the update watermark and block newer Telegram updates. (#68588) 感谢 @Lucenx9.
- Browser/CDP: allow the selected remote CDP profile host for CDP health and control checks without widening browser navigation SSRF policy, so WSL-to-Windows Chrome endpoints no longer appear offline under strict defaults. Fixes #68108. (#68207) 感谢 @Mlightsnow.
- Codex: stop cumulative app-server token totals from being treated as fresh context usage, so session status no longer reports inflated context percentages after long Codex threads. (#64669) 感谢 @cyrusaf.
- Browser/CDP: add phase-specific CDP readiness diagnostics and normalize loopback WebSocket host aliases, so Windows browser startup failures surface whether HTTP discovery, WebSocket discovery, SSRF validation, or the `Browser.getVersion` health check failed.
- Browser/CDP: discover Chrome’s real DevTools websocket from bare `ws://host:port` attach-only roots before declaring the profile down, while still falling back to direct websocket providers that do not expose `/json/version`. Fixes #68027. (#68715) 感谢 @visionik.

## 🚀 v2026.4.18 (2026年4月18日)

### ✨ 新增功能与改进

- Anthropic/models: add Claude Opus 4.7 `xhigh` reasoning effort support and keep it separate from adaptive thinking.
- Control UI/settings: overhaul the settings and slash-command experience with faster presets, quick-create flows, and refreshed command discovery. (#67819) 感谢 @BunsDev.
- macOS/gateway: add `screen.snapshot` support for macOS app nodes, including runtime plumbing, default macOS allowlisting, and docs for monitor preview flows. (#67954) 感谢 @BunsDev.

### 🐛 问题修复

- Codex/gateway: fix gateway crashes when the codex-acp subprocess terminates abruptly; pending requests now shut down gracefully instead of propagating an uncaught EPIPE through the gateway daemon and connected channels. Fixes #67886. (#67947) 感谢 @openperf.
- Agents/bootstrap: resolve bootstrap from workspace truth instead of stale session transcript markers, keep embedded bootstrap instructions on a hidden user-context prelude, suppress normal `/new` and `/reset` greetings while `BOOTSTRAP.md` is still pending, and make the embedded runner read the bootstrap ritual before replying normally.
- Agents/bootstrap: dedupe repeated bootstrap-truncation warnings so startup logs stay actionable. (#67906) 感谢 @rubencu.
- WhatsApp/multi-account: centralize named-account inbound policy, isolate per-account group activation and scoped session keys, preserve legacy activation backfill, and keep `accounts.default` shared defaults aligned across runtime, setup, and compat migration paths. 感谢 @mcaxtr.
- Cron/delivery: clean up isolated sessions after direct deliveries when `deleteAfterRun` is enabled, covering structured and threaded branches that previously bypassed cleanup. (#67807) 感谢 @MonkeyLeeT.
- Gateway/hello-ok: always report negotiated auth metadata and preserve scopes for reused device tokens on successful shared-auth handshakes, including control-ui bypass coverage when no device token is issued. (#67810, #68039) 感谢 @BunsDev.
- Onboarding/non-interactive: preserve existing gateway auth tokens during re-onboard so active local gateway clients are not disconnected by an implicit token rotation. (#67821) 感谢 @BKF-Gitty.
- OpenAI Codex/Responses: unify native Responses API capability detection so Codex OAuth requests emit the required `store: false` field on the native Responses path. (#67918) 感谢 @obviyus.
- WhatsApp/setup: guard personal-phone and allowlist prompt values so setup fails with clear validation errors instead of crashing on undefined prompt text. (#67895) 感谢 @lawrence3699.
- Models/config: preserve an existing `models.json` provider `baseUrl` during merge-mode regeneration so custom endpoints do not get reset on restart. (#67893) 感谢 @lawrence3699.
- Plugin SDK: preserve `secret-input-runtime` function exports in published builds so provider plugins can read SecretRef-backed setup inputs.
- Plugins/discovery: reuse bundled and global plugin discovery results across workspace cache misses so Windows multi-workspace startup stops redoing the shared synchronous scan. (#67940) 感谢 @obviyus.
- Bundled plugins/install: keep staged bundled plugin runtime imports resolving through the packaged Plugin SDK while omitting checkout-only aliases from the dist inventory, so published installs do not fail on repo-local paths.
- Plugins/webhooks: enforce synchronous plugin registration with full rollback of failed plugin side effects, and cache SecretRef-backed webhook auth per route so plugin startup and inbound webhook auth stay deterministic. (#67941) 感谢 @obviyus.
- Telegram/polling transport: give the Telegram undici dispatcher pool bounded keep-alive defaults and an explicit lifecycle. Previously every recoverable network error and stall watchdog trip silently replaced the transport, abandoning the old dispatcher pool and its sockets; long-running gateway processes accumulated hundreds of ESTABLISHED connections to `api.telegram.org`, saturating per-IP upstream proxy quotas and causing the actively-used outbound proxy node to time out while every other node still tested healthy. Transports now expose `close()`, `TelegramPollingTransportState` destroys the stale transport on dirty-rebuild, and `TelegramPollingSession` disposes the transport when polling exits — backed by a strict per-origin pool cap on every constructed `Agent`, `ProxyAgent`, and `EnvHttpProxyAgent` as defence in depth.
- Telegram/polling: publish successful `getUpdates` calls as account health liveness, avoid false stall restarts after recoverable `getUpdates` errors, and force Telegram API dispatchers to HTTP/1.1 so stalled polling recovers instead of sitting connected-but-dead.
- Telegram/ACP bindings: drop persisted DM bindings that still point at missing or failed ACP sessions on restart, while preserving plugin-owned bindings and uncertain store reads. (#67822) 感谢 @chinar-amrutkar.
- Telegram/streaming: keep a transient preview on the same Telegram message when auto-compaction retries an in-flight answer, so streamed replies no longer appear duplicated after compaction. (#66939) 感谢 @rubencu.
- Memory/sqlite-vec: emit the degraded sqlite-vec warning once per degraded episode instead of repeating it for every file write, while preserving the latch across safe-reindex rollback and resetting it when vector state is genuinely rebuilt. (#67898) 感谢 @rubencu.
- Memory-core: preserve stored vector dimensions during read-only recovery so memory indexes do not lose vector metadata while repairing read-only state.
- Reply/block streaming: preserve post-stream incomplete-turn error payloads after block streaming already emitted content, so users get the warning instead of silence. (#67991) 感谢 @obviyus.
- Telegram/streaming: clear the compaction replay guard after visible non-final boundaries so a post-tool assistant reply rotates to a fresh preview instead of editing the pre-compaction message. (#67993) 感谢 @obviyus.
- Matrix: fix `sessions_spawn --thread` subagent session spawning — thread binding creation, cleanup on session end, and completion-message delivery target resolution now work end-to-end. (#67643) 感谢 @eejohnso-ops and @gumadeiras.
- Slack/streaming: resolve native streaming recipient teams from the inbound user when available, with a monitor-team fallback, so DM and shared-workspace streams target the right recipient more reliably.
- macOS/webchat: enable Undo and Redo in the composer text input by turning on the native `NSTextView` undo manager. (#34962) 感谢 @tylerbittner.
- macOS/remote SSH: require an already-trusted host key on the macOS remote command, gateway probe, port tunnel, and pairing probe paths by switching `StrictHostKeyChecking=accept-new` to `StrictHostKeyChecking=yes` and centralizing the shared SSH option fragments in `CommandResolver`, so first-time macOS remote connections no longer silently accept an unknown host key and must be trusted ahead of time via `~/.ssh/known_hosts`.（#68199）
- CLI/configure: show the channel picker before probing statuses and let remove mode delete configured channel blocks directly from config. (#68007) 感谢 @gumadeiras.
- Control UI/settings: reset scroll position when switching settings pages and align details headers. (#68150) 感谢 @BunsDev.
- WhatsApp/gateway: harden WhatsApp auth persistence and backup recovery, model unstable auth state explicitly in setup/status/health, recover backup-backed login without forcing a fresh QR, and keep local gateway handoff and channel restarts truthful after login. 感谢 @mcaxtr.
- OpenAI Codex/OAuth: keep OpenClaw as the canonical owner for imported Codex CLI OAuth sessions, stop writing refreshed credentials back into `.codex`, and prefer fresher OpenClaw credentials over stale imported CLI state so refresh recovery stays stable. 感谢 @vincentkoc.
- OpenAI Codex/OAuth: treat the OpenAI TLS prerequisites probe as advisory instead of a hard blocker, so Codex sign-in can still proceed when the speculative Node/OpenSSL precheck fails but the real OAuth flow still works. 感谢 @vincentkoc.
- Models status/OAuth health: align OAuth health reporting with the same effective credential view runtime uses, so expired refreshable sessions stop showing healthy by default and fresher imported Codex CLI credentials surface correctly in `models status`, doctor, and gateway auth status. 感谢 @vincentkoc.
- OpenAI Codex/OAuth: keep external CLI OAuth imports runtime-only by overlaying fresher Codex CLI credentials without mutating `auth-profiles.json`, so `.codex` stays a bootstrap/runtime input instead of becoming durable OpenClaw state. 感谢 @vincentkoc.
- OpenAI Codex/OAuth: drop legacy CLI-manager routing from the remaining bootstrap path so Codex and MiniMax CLI imports are matched by their canonical OpenClaw profile ids instead of stale `managedBy` metadata. 感谢 @vincentkoc.
- OpenAI Codex/OAuth: only bootstrap from external CLI OAuth when the local OpenClaw profile is missing or unusable, so healthy local sessions are no longer overridden by fresher `.codex` tokens. 感谢 @vincentkoc.
- OpenAI Codex/OAuth: rename the external CLI bootstrap helper, reuse the same usable-oauth check across runtime fallback paths, and add debug logs plus health coverage so bootstrap decisions stay legible. 感谢 @vincentkoc.
- Twitch/setup: load Twitch through the bundled setup-entry discovery path and keep setup/status account detection aligned with runtime config. (#68008) 感谢 @gumadeiras.
- Feishu/card actions: resolve card-action chat type from the Feishu chat API when stored context is missing, preferring `chat_mode` over `chat_type`, so DM-originated card actions no longer bypass `dmPolicy` by falling through to the group handling path.（#68201）
- Cron/isolated-agent: preserve `trusted: false` on isolated cron awareness events mirrored into the main session, and forward the optional `trusted` flag through the gateway cron wrapper so explicit trust downgrades survive session-key scoping.（#68210）
- Agents/fallback: recognize bare leading ZenMux `402 ...` quota-refresh errors without misclassifying plain numeric `402 ...` text, and keep the embedded fallback regression coverage stable. (#47579) 感谢 @bwjoke.
- Failover/google: only treat `INTERNAL` status payloads as retryable timeouts when they also carry a `500` code, so malformed non-500 payloads do not enter the retry path. (#68238) 感谢 @altaywtf and @Openbling.
- Agents/tools: filter bundled MCP/LSP tools through the final owner-only and tool-policy pipeline after merging them into the effective tool list, so existing allowlists, deny rules, sandbox policy, subagent policy, and owner-only restrictions apply to bundled tools the same way they apply to core tools.（#68195）
- Gateway/assistant media: require `operator.read` scope for assistant-media file and metadata requests on identity-bearing HTTP auth paths so callers without a read scope can no longer access assistant media. (#68175) 感谢 @eleqtrizit.
- Gateway/web: allow same-origin microphone access in the Permissions-Policy header so browser voice capture can work from the Control UI and webchat origin.（#68368）
- Exec approvals/display: escape raw control characters (including newline and carriage return) in the shared and macOS approval-prompt command sanitizers, so trailing command payloads no longer render on hidden extra lines in the approval UI.（#68198）
- Telegram/streaming: fence same-session stale preview and finalization work after aborts so Telegram no longer replays an older reply or flushes a hidden short preview after the abort confirmation lands. (#68100) 感谢 @rubencu.
- OpenAI Codex/OAuth + Pi: keep imported Codex CLI OAuth bootstrap, Pi auth export, and runtime overlay handling aligned so Codex sessions survive refresh and health checks without leaking transient CLI state into saved auth files. 感谢 @vincentkoc.
- OpenAI Codex/OAuth: keep Codex-specific auth bridging inside the owning plugins, preserve canonical imported CLI profiles, and allow legacy identity-less main-store OAuth sessions to upgrade during refresh mirroring. (#68284) 感谢 @vincentkoc.
- Config/redact: add `browser.cdpUrl` and `browser.profiles.*.cdpUrl` to sensitive URL config paths so embedded credentials (query tokens and HTTP Basic auth) are properly redacted in `config.get` API responses and availability error messages. (#67679) 感谢 @Ziy1-Tan.
- Agents/TTS: report failed speech synthesis as a real tool error so unconfigured providers no longer feed successful TTS failure output back into agent loops. (#67980) 感谢 @lawrence3699.
- Gateway/wake: allow unknown properties on wake payloads so external senders like Paperclip can attach opaque metadata without failing schema validation. (#68355) 感谢 @kagura-agent.
- Matrix: honor `channels.matrix.network.dangerouslyAllowPrivateNetwork` when creating clients for private-network homeservers. (#68332) 感谢 @kagura-agent.
- Cron/message tool: keep cron-owned runs with `delivery.mode: "none"` on the normal message-tool path so they can still send explicit messages, create threads, and route conditionally when no runner-owned delivery target is active. (#68482) 感谢 @obviyus.
- Agents/failover: avoid treating bare leading `402 ...` prose as billing errors while still recognizing proxy subscription failures. (#45827) 感谢 @junyuc25.
- Config/$schema: preserve root-authored `$schema` during partial config rewrites without injecting include-only schema URLs into the root config. (#47322) 感谢 @EfeDurmaz16.
- Agents/CLI delivery: run the same reply-media path normalizer the auto-reply flow uses before shipping `openclaw agent --deliver` payloads, so relative `MEDIA:./out/photo.png` tokens resolve against the agent workspace instead of being rejected downstream with `LocalMediaAccessError: Local media path is not under an allowed directory`. 感谢 @frankekn.
- Agents/Google: strip `thinkingBudget=0` for the thinking-required `gemini-2.5-pro` model in embedded-runner and native Google payloads, so requests no longer fail with `Budget 0 is invalid. This model only works in thinking mode.` and the API uses its default thinking behavior instead. (#68607) 感谢 @josmithiii.
- Slack/threads: log failed thread starter and history fetches at verbose level while preserving best-effort fallback behavior, so missing Slack thread context is diagnosable without interrupting inbound handling. (#68594) 感谢 @martingarramon.
- Gateway/restart: keep stale-gateway cleanup from terminating the current process's parent or ancestors, so plugin sidecars like WeChat no longer kill the active gateway and trigger an infinite supervisor restart loop. Fixes #68451. (#68517) 感谢 @openperf.
- Gateway/auth: reject gateway auth credentials that match published example placeholders at startup and secret reload, and keep cloud install snippets from publishing copy-paste gateway/keyring secrets. (#68404) 感谢 @coygeek.
- CLI/update: preserve macOS restart helper launchctl failures in the update restart log without letting log setup block the restart path. (#68492) 感谢 @hclsys.
- Slack/threads: keep file-only root messages as starter context so first thread replies can still hydrate starter media. (#68594) 感谢 @martingarramon.
- Google/Antigravity: resolve forward-compatible Gemini 3.1 Pro custom-tools and Flash variants from the bundled Google plugin templates, so `google-antigravity/gemini-3.1-pro-preview-customtools` no longer falls through to an unknown-model error. Fixes #35512.
- Active Memory: raise the blocking recall timeout ceiling to 120 seconds and reject larger config values during plugin schema validation. Fixes #68410. (#68480) 感谢 @Bartok9.
- Control UI/chat: keep history-backed user image uploads visible after chat reload while filtering blocked or non-image transcript media paths. (#68415) 感谢 @mraleko.
- Matrix/plugins: keep remaining Matrix event helpers on the canonical `matrix-js-sdk` subpath so build and plugin-load entrypoint checks stay consistent. (#68498) 感谢 @masatohoshino.

## 🚀 v2026.4.15 (2026年4月15日)

### ✨ 新增功能与改进

- Anthropic/models: default Anthropic selections, `opus` aliases, Claude CLI defaults, and bundled image understanding to Claude Opus 4.7.
- Google/TTS: add Gemini text-to-speech support to the bundled `google` plugin, including provider registration, voice selection, WAV reply output, PCM telephony output, and setup/docs guidance. (#67515) 感谢 @barronlroth.
- Control UI/Overview: add a Model Auth status card showing OAuth token health and provider rate-limit pressure at a glance, with attention callouts when OAuth tokens are expiring or expired. Backed by a new `models.authStatus` gateway method that strips credentials and caches for 60s. (#66211) 感谢 @omarshahine.
- Memory/LanceDB: add cloud storage support to `memory-lancedb` so durable memory indexes can run on remote object storage instead of local disk only. (#63502) 感谢 @rugvedS07.
- GitHub Copilot/memory search: add a GitHub Copilot embedding provider for memory search, and expose a dedicated Copilot embedding host helper so plugins can reuse the transport while honoring remote overrides, token refresh, and safer payload validation. (#61718) 感谢 @feiskyer and @vincentkoc.
- Agents/local models: add experimental `agents.defaults.experimental.localModelLean: true` to drop heavyweight default tools like `browser`, `cron`, and `message`, reducing prompt size for weaker local-model setups without changing the normal path. (#66495) 感谢 @ImLukeF.
- Packaging/plugins: localize bundled plugin runtime deps to their owning extensions, trim the published docs payload, and tighten install/package-manager guardrails so published builds stay leaner and core stops carrying extension-owned runtime baggage. (#67099) 感谢 @vincentkoc.
- QA/Matrix: split Matrix live QA into a source-linked `qa-matrix` runner and keep repo-private `qa-*` surfaces out of packaged and published builds. (#66723) 感谢 @gumadeiras.
- Docs/showcase: add a scannable hero, complete section jump links, and a responsive video grid for community examples. (#48493) 感谢 @jchopard69.

### 🐛 问题修复

- Gateway/tools: anchor trusted local `MEDIA:` tool-result passthrough on the exact raw name of this run's registered built-in tools, and reject client tool definitions whose names normalize-collide with a built-in or with another client tool in the same request (`400 invalid_request_error` on both JSON and SSE paths), so a client-supplied tool named like a built-in can no longer inherit its local-media trust.（#67303）
- Agents/replay recovery: classify the provider wording `401 input item ID does not belong to this connection` as replay-invalid, so users get the existing `/new` session reset guidance instead of a raw 401-style failure. (#66475) 感谢 @dallylee.
- Gateway/webchat: enforce localRoots containment on webchat audio embedding path [AI-assisted]. (#67298) 感谢 @pgondhi987.
- Matrix/pairing: block DM pairing-store entries from authorizing room control commands [AI-assisted]. (#67294) 感谢 @pgondhi987.
- Docker/build: verify `@matrix-org/matrix-sdk-crypto-nodejs` native bindings with `find` under `node_modules` instead of a hardcoded `.pnpm/...` path so pnpm v10+ virtual-store layouts no longer fail the image build. (#67143) thanks @ly85206559.
- Matrix/E2EE: keep startup bootstrap conservative for passwordless token-auth bots, still attempt the guarded repair pass without requiring `channels.matrix.password`, and document the remaining password-UIA limitation. (#66228) 感谢 @SARAMALI15792.
- Cron/announce delivery: suppress mixed-content isolated cron announce replies that end with `NO_REPLY` so trailing silent sentinels no longer leak summary text to the target channel. (#65004) thanks @neo1027144-creator.
- Plugins/bundled channels: partition bundled channel lazy caches by active bundled root so `OPENCLAW_BUNDLED_PLUGINS_DIR` flips stop reusing stale plugin, setup, secrets, and runtime state. (#67200) 感谢 @gumadeiras.
- Packaging/plugins: prune common test/spec cargo from bundled plugin runtime dependencies and fail npm release validation if packaged test cargo reappears, keeping published tarballs leaner without plugin-specific special cases. (#67275) thanks @gumadeiras.
- Agents/context + Memory: trim default startup/skills prompt budgets, cap `memory_get` excerpts by default with explicit continuation metadata, and keep QMD reads aligned with the same bounded excerpt contract so long sessions pull less context by default without losing deterministic follow-up reads.
- Matrix/commands: skip DM pairing-store reads on room traffic now that room control-command authorization ignores pairing-store entries, keeping the room path narrower without changing room auth behavior. (#67325) 感谢 @gumadeiras.
- Memory-core/dreaming: skip dreaming narrative transcripts from session-store metadata before bootstrap records land so dream diary prompt/prose lines do not pollute session ingestion. (#67315) thanks @jalehman.
- Agents/local models: clarify low-context preflight hints for self-hosted models, point config-backed caps at the relevant OpenClaw setting, and stop suggesting larger models when `agents.defaults.contextTokens` is the real limit. (#66236) 感谢 @ImLukeF.
- Dreaming/memory-core: change the default `dreaming.storage.mode` from `inline` to `separate` so Dreaming phase blocks (`## Light Sleep`, `## REM Sleep`) land in `memory/dreaming/{phase}/YYYY-MM-DD.md` instead of being injected into `memory/YYYY-MM-DD.md`. Daily memory files no longer get dominated by structured candidate output, and the daily-ingestion scanner that already strips dream marker blocks no longer has to compete with hundreds of phase-block lines on every run. Operators who want the previous behavior can opt in by setting `plugins.entries.memory-core.config.dreaming.storage.mode: "inline"`. (#66412) 感谢 @mjamiv.
- Control UI/Overview: fix false-positive "missing" alerts on the Model Auth status card for aliased providers, env-backed OAuth with auth.profiles, and unresolvable env SecretRefs. (#67253) 感谢 @omarshahine.
- Dashboard: constrain exec approval modal overflow on desktop so long command content no longer pushes action buttons out of view. (#67082) 感谢 @Ziy1-Tan.
- Agents/CLI transcripts: persist successful CLI-backed turns into the OpenClaw session transcript so google-gemini-cli replies appear in session history and the Control UI again. (#67490) 感谢 @obviyus.
- Discord/tool-call text: strip standalone Gemma-style `<function>...</function>` tool-call payloads from visible assistant text without truncating prose examples or trailing replies. (#67318) 感谢 @joelnishanth.
- WhatsApp/web-session: drain the pending per-auth creds save queue before reopening sockets so reconnect-time auth bootstrap no longer races in-flight `creds.json` writes and falsely restores from backup. (#67464) 感谢 @neeravmakwana.
- BlueBubbles/catchup: add a per-message retry ceiling (`catchup.maxFailureRetries`, default 10) so a persistently-failing message with a malformed payload no longer wedges the catchup cursor forever. After N consecutive `processMessage` failures against the same GUID, catchup logs a WARN, skips that message on subsequent sweeps, and lets the cursor advance past it. Transient failures still retry from the same point as before. Also fixes a lost-update race in the persistent dedupe file lock that silently dropped inbound GUIDs on concurrent writes, a dedupe file naming migration gap on version upgrade, and a balloon-event bypass that let catchup replay debouncer-coalesced events as standalone messages. (#67426, #66870) 感谢 @omarshahine.
- Ollama/chat: strip the `ollama/` provider prefix from Ollama chat request model ids so configured refs like `ollama/qwen3:14b-q8_0` stop 404ing against the Ollama API. (#67457) 感谢 @suboss87.
- Agents/tools: resolve non-workspace host tilde paths against the OS home directory and keep edit recovery aligned with that same path target, so `~/...` host edit/write operations stop failing or reading back the wrong file when `OPENCLAW_HOME` differs. (#62804) 感谢 @stainlu.
- Speech/TTS: auto-enable the bundled Microsoft and ElevenLabs speech providers, and route generic TTS directive tokens through the explicit or active provider first so overrides like `[[tts:speed=1.2]]` stop silently landing on the wrong provider. (#62846) 感谢 @stainlu.
- OpenAI Codex/models: normalize stale native transport metadata in both runtime resolution and discovery/listing so legacy `openai-codex` rows with missing `api` or `https://chatgpt.com/backend-api/v1` self-heal to the canonical Codex transport instead of routing requests through broken HTML/Cloudflare paths, combining the original fixes proposed in #66969 (saamuelng601-pixel) and #67159 (hclsys).（#67635）
- Agents/failover: treat HTML provider error pages as upstream transport failures for CDN-style 5xx responses without misclassifying embedded body text as API rate limits, while still preserving auth remediation for HTML 401/403 pages and proxy remediation for HTML 407 pages. (#67642) 感谢 @stainlu.
- Gateway/skills: bump the cached skills-snapshot version whenever a config write touches `skills.*` (for example `skills.allowBundled`, `skills.entries.<id>.enabled`, or `skills.profile`). Existing agent sessions persist a `skillsSnapshot` in `sessions.json` that reuses the skill list frozen at session creation; without this invalidation, removing a bundled skill from the allowlist left the old snapshot live and the model kept calling the disabled tool, producing `Tool <name> not found` loops that ran until the embedded-run timeout. (#67401) 感谢 @xantorres.
- Agents/tool-loop: enable the unknown-tool stream guard by default. Previously `resolveUnknownToolGuardThreshold` returned `undefined` unless `tools.loopDetection.enabled` was explicitly set to `true`, which left the protection off in the default configuration. A hallucinated or removed tool (for example `himalaya` after it was dropped from `skills.allowBundled`) would then loop "Tool X not found" attempts until the full embedded-run timeout. The guard has no false-positive surface because it only triggers on tools that are objectively not registered in the run, so it now stays on regardless of `tools.loopDetection.enabled` and still accepts `tools.loopDetection.unknownToolThreshold` as a per-run override (default 10). (#67401) 感谢 @xantorres.
- TUI/streaming: add a client-side streaming watchdog to `tui-event-handlers` so the `streaming · Xm Ys` activity indicator resets to `idle` after 30s of delta silence on the active run. Guards against lost or late `state: "final"` chat events (WS reconnects, gateway restarts, etc.) leaving the TUI stuck on `streaming` indefinitely; a new system log line surfaces the reset so users know to send a new message to resync. The window is configurable via the new `streamingWatchdogMs` context option (set to `0` to disable), and the handler now exposes a `dispose()` that clears the pending timer on shutdown. (#67401) 感谢 @xantorres.
- Extensions/lmstudio: add exponential backoff to the inference-preload wrapper so an LM Studio model-load failure (for example the built-in memory guardrail rejecting a load because the swap is saturated) no longer produces a WARN line every ~2s for every chat request. The wrapper now records consecutive preload failures per `(baseUrl, modelKey, contextLength)` tuple with a 5s → 10s → 20s → … → 5min cooldown and skips the preload step entirely while a cooldown is active, letting chat requests proceed directly to the stream (the model is often already loaded via the LM Studio UI). The combined `preload failed` log line now reports consecutive-failure count and remaining cooldown so operators can act on the real issue instead of drowning in repeated warnings. (#67401) 感谢 @xantorres.
- Agents/replay: re-run tool/result pairing after strict replay tool-call ID sanitization on outbound requests so Anthropic-compatible providers like MiniMax no longer receive malformed orphan tool-result IDs such as `...toolresult1` during compaction and retry flows. (#67620) 感谢 @stainlu.
- Gateway/startup: fix spurious SIGUSR1 restart loop on Linux/systemd when plugin auto-enable is the only startup config write; the config hash guard was not captured for that write path, causing chokidar to treat each boot write as an external change and trigger a reload → restart cycle that corrupts manifest.db after repeated cycles. Fixes #67436. (#67557) thanks @openperf
- Codex/harness: auto-enable the Codex plugin when `codex` is selected as an embedded agent harness runtime, including forced default, per-agent, and `OPENCLAW_AGENT_RUNTIME` paths. (#67474) 感谢 @duqaXxX.
- OpenAI Codex/CLI: keep resumed `codex exec resume` runs on the safe non-interactive path without reintroducing the removed dangerous bypass flag by passing the supported `--skip-git-repo-check` resume arg plus Codex's native `sandbox_mode="workspace-write"` config override. (#67666) 感谢 @plgonzalezrx8.
- Codex/app-server: parse Desktop-originated app-server user agents such as `Codex Desktop/0.118.0`, keeping the version gate working when the Codex CLI inherits a multi-word originator. (#64666) 感谢 @cyrusaf.
- Cron/announce delivery: keep isolated announce `NO_REPLY` stripping case-insensitive across direct and text delivery, preserve structured media-only sends when a caption strips silent, and derive main-session awareness from the cleaned payloads so silent captions no longer leak stale `NO_REPLY` text. (#65016) 感谢 @BKF-Gitty.
- Sessions/Codex: skip redundant `delivery-mirror` transcript appends only when the latest assistant message has the same visible text, preventing duplicate visible replies on Codex-backed turns without suppressing repeated answers across turns. (#67185) 感谢 @andyylin.
- Auto-reply/prompt-cache: keep volatile inbound chat IDs out of the stable system prompt so task-scoped adapters can reuse prompt caches across runs, while preserving conversation metadata for the user turn and media-only messages. (#65071) 感谢 @MonkeyLeeT.
- BlueBubbles/inbound: restore inbound image attachment downloads on Node 22+ by stripping incompatible bundled-undici dispatchers from the non-SSRF fetch path, accept `updated-message` webhooks carrying attachments, use event-type-aware dedup keys so attachment follow-ups are not rejected as duplicates, and retry attachment fetch from the BB API when the initial webhook arrives with an empty array. (#64105, #61861, #65430, #67510) 感谢 @omarshahine.
- Agents/skills: sort prompt-facing `available_skills` entries by skill name after merging sources so `skills.load.extraDirs` order no longer changes prompt-cache prefixes. (#64198) 感谢 @Bartok9.
- Agents/OpenAI Responses: add `models.providers.*.models.*.compat.supportsPromptCacheKey` so OpenAI-compatible proxies that forward `prompt_cache_key` can keep prompt caching enabled while incompatible endpoints can still force stripping. (#67427) 感谢 @damselem.
- Agents/context engines: keep loop-hook and final `afterTurn` prompt-cache touch metadata aligned with the current assistant turn so cache-aware context engines retain accurate cache TTL state during tool loops. (#67767) thanks @jalehman.
- Memory/dreaming: strip AI-facing inbound metadata envelopes from session-corpus user turns before normalization so REM topic extraction sees the user's actual message text, including array-shaped split envelopes. (#66548) 感谢 @zqchris.
- Agents/errors: detect standalone Cloudflare/CDN HTML challenge pages before transport DNS classification so provider block pages no longer appear as local DNS lookup failures. (#67704) 感谢 @chris-yyau.
- Security/approvals: redact secrets in exec approval prompts so inline approval review can no longer leak credential material in rendered prompt content. (#61077, #64790)
- CLI/configure: re-read the persisted config hash after writes so config updates stop failing with stale-hash races. (#64188, #66528)
- CLI/update: prune stale packaged `dist` chunks after npm upgrades and keep downgrade/verify inventory checks compat-safe so global upgrades stop failing on stale chunk imports. (#66959) 感谢 @obviyus.
- Onboarding/CLI: fix channel-selection crashes on globally installed CLI setups during onboarding.（#66736）
- Video generation/live tests: bound provider polling for live video smoke, default to the fast non-FAL text-to-video path, and use a one-second lobster prompt so release validation no longer waits indefinitely on slow provider queues.
- Memory-core/QMD `memory_get`: reject reads of arbitrary workspace markdown paths and only allow canonical memory files (`MEMORY.md`, `memory.md`, `DREAMS.md`, `dreams.md`, `memory/**`) plus exact paths of active indexed QMD workspace documents, so the QMD memory backend can no longer be used as a generic workspace-file read shim that bypasses `read` tool-policy denials. (#66026) 感谢 @eleqtrizit.
- Cron/agents: forward embedded-run tool policy and internal event params into the attempt layer so `--tools` allowlists, cron-owned message-tool suppression, explicit message targeting, and command-path internal events all take effect at runtime again. (#62675) 感谢 @hexsprite.
- Setup/providers: guard preferred-provider lookup during setup so malformed plugin metadata with a missing provider id no longer crashes the wizard with `Cannot read properties of undefined (reading 'trim')`. (#66649) 感谢 @Tianworld.
- Matrix/security: normalize sandboxed profile avatar params, preserve `mxc://` avatar URLs, and surface gmail watcher stop failures during reload. (#64701) 感谢 @slepybear.
- Telegram/documents: drop leaked binary caption bytes from inbound Telegram text handling so document uploads like `.mobi` or `.epub` no longer explode prompt token counts. (#66663) 感谢 @joelnishanth.
- Gateway/auth: resolve the active gateway bearer per-request on the HTTP server and the HTTP upgrade handler via `getResolvedAuth()`, mirroring the WebSocket path, so a secret rotated through `secrets.reload` or config hot-reload stops authenticating on `/v1/*`, `/tools/invoke`, plugin HTTP routes, and the canvas upgrade path immediately instead of remaining valid on HTTP until gateway restart. (#66651) 感谢 @mmaps.
- Agents/compaction: cap the compaction reserve-token floor to the model context window so small-context local models (e.g. Ollama with 16K tokens) no longer trigger context-overflow errors or infinite compaction loops on every prompt. (#65671) 感谢 @openperf.
- Agents/OpenAI Responses: classify the exact `Unknown error (no error details in response)` transport failure as failover reason `unknown` so assistant/model fallback still runs for that no-details failure path. (#65254) 感谢 @OpenCodeEngineer.
- Models/probe: surface invalid-model probe failures as `format` instead of `unknown` in `models list --probe`, and lock the invalid-model fallback path in with regression coverage. (#50028) 感谢 @xiwuqi.
- Agents/failover: classify OpenAI-compatible `finish_reason: network_error` stream failures as timeout so model fallback retries continue instead of stopping with an unknown failover reason. (#61784) thanks @lawrence3699.
- Onboarding/channels: normalize channel setup metadata before discovery and validation so malformed or mixed-shape channel plugin metadata no longer breaks setup and onboarding channel lists. (#66706) 感谢 @darkamenosa.
- Slack/native commands: fix option menus for slash commands such as `/verbose` when Slack renders native buttons by giving each button a unique action ID while still routing them through the shared `openclaw_cmdarg*` listener. 感谢 @Wangmerlyn.
- Feishu/webhook: harden the webhook transport and card-action replay guards to fail closed on missing `encryptKey` and blank callback tokens — refuse to start the webhook transport without an `encryptKey`, reject unsigned requests when no key is present instead of accepting them, and drop blank card-action tokens before the dedupe claim and dispatcher. Defense-in-depth over the already-closed monitor-account layer. (#66707) 感谢 @eleqtrizit.
- Agents/workspace files: route `agents.files.get`, `agents.files.set`, and workspace listing through the shared `fs-safe` helpers (`openFileWithinRoot`/`readFileWithinRoot`/`writeFileWithinRoot`), reject symlink aliases for allowlisted agent files, and have `fs-safe` resolve opened-file real paths from the file descriptor before falling back to path-based `realpath` so a symlink swap between `open` and `realpath` can no longer redirect the validated path off the intended inode. (#66636) 感谢 @eleqtrizit.
- Gateway/MCP loopback: switch the `/mcp` bearer comparison from plain `!==` to constant-time `safeEqualSecret` (matching the convention every other auth surface in the codebase uses), and reject non-loopback browser-origin requests via `checkBrowserOrigin` before the auth gate runs. Loopback origins (`127.0.0.1:*`, `localhost:*`, same-origin) still go through, including the `localhost`↔`127.0.0.1` host mismatch that browsers flag as `Sec-Fetch-Site: cross-site`. (#66665) 感谢 @eleqtrizit.
- Auto-reply/billing: classify pure billing cooldown fallback summaries from structured fallback reasons so users see billing guidance instead of the generic failure reply. (#66363) 感谢 @Rohan5commit.
- Agents/fallback: preserve the original prompt body on model fallback retries with session history so the retrying model keeps the active task instead of only seeing a generic continue message. (#66029) 感谢 @WuKongAI-CMU.
- Reply/secrets: resolve active reply channel/account SecretRefs before reply-run message-action discovery so channel token SecretRefs (for example Discord) do not degrade into discovery-time unresolved-secret failures. (#66796) 感谢 @joshavant.
- Agents/Anthropic: ignore non-positive Anthropic Messages token overrides and fail locally when no positive token budget remains, so invalid `max_tokens` values no longer reach the provider API. (#66664) thanks @jalehman
- Agents/context engines: preserve prompt-only token counts, not full request totals, when deferred maintenance reuses after-turn runtime context so background compaction bookkeeping matches the active prompt window. (#66820) thanks @jalehman.
- BlueBubbles/inbound: add a persistent file-backed GUID dedupe so MessagePoller webhook replays after BB Server restart or reconnect no longer cause the agent to re-reply to already-handled messages. (#19176, #12053, #66816) 感谢 @omarshahine.
- Secrets/plugins/status: align SecretRef inspect-vs-strict handling across plugin preload, read-only status/agents surfaces, and runtime auth paths so unresolved refs no longer crash read-only CLI flows while runtime-required non-env refs stay strict. (#66818) 感谢 @joshavant.
- Memory/dreaming: stop ordinary transcripts that merely quote the dream-diary prompt from being classified as internal dreaming runs and silently dropped from session recall ingestion. (#66852) 感谢 @gumadeiras.
- Telegram/documents: sanitize binary reply context and ZIP-like archive extraction so `.epub` and `.mobi` uploads can no longer leak raw binary into prompt context through reply metadata or archive-to-`text/plain` coercion. (#66877) 感谢 @martinfrancois.
- Telegram/native commands: restore plugin-registry-backed auto defaults for native commands and native skills so Telegram slash commands keep registering when `commands.native` and `commands.nativeSkills` stay on `auto`. (#66843) 感谢 @kashevk0.
- OpenRouter/Qwen3: parse `reasoning_details` stream deltas as thinking content without skipping same-chunk tool calls, so Qwen3 replies no longer fail empty on OpenRouter and mixed reasoning/tool-call chunks still execute normally. (#66905) 感谢 @bladin.
- BlueBubbles/catchup: replay missed webhook messages after gateway restart via a persistent per-account cursor and `/api/v1/message/query?after=<ts>` pass, so messages delivered while the gateway was down no longer disappear. Uses the existing `processMessage` path and is deduped by #66816's inbound GUID cache. (#66857, #66721) 感谢 @omarshahine.
- Telegram/native commands: keep Telegram command-sync cache process-local so gateway restarts re-register the menu instead of trusting stale on-disk sync state after Telegram cleared commands out-of-band. (#66730) 感谢 @nightq.
- Audio/self-hosted STT: restore `models.providers.*.request.allowPrivateNetwork` for audio transcription so private or LAN speech-to-text endpoints stop tripping SSRF blocks after the v2026.4.14 regression. (#66692) 感谢 @jhsmith409.
- Auto-reply/media: allow workspace-rooted absolute media paths in auto-reply send flows so valid local media references no longer fail path validation.（#66689）
- WhatsApp/Baileys media upload: harden encrypted upload handling so large outbound media sends avoid buffer spikes and reliability regressions. (#65966) 感谢 @frankekn.
- QQBot/cron: guard against undefined `event.content` in `parseFaceTags` and `filterInternalMarkers` so cron-triggered agent turns with no content payload no longer crash with `TypeError: Cannot read properties of undefined (reading 'startsWith')`. (#66302) 感谢 @xinmotlanthua.
- CLI/plugins: stop `--dangerously-force-unsafe-install` plugin installs from falling back to hook-pack installs after security scan failures, while still preserving non-security fallback behavior for real hook packs. (#58909) 感谢 @hxy91819.
- Claude CLI/sessions: classify `No conversation found with session ID` as `session_expired` so expired CLI-backed conversations clear the stale binding and recover on the next turn. (#65028) thanks @Ivan-Fn.
- Context Engine: gracefully fall back to the legacy engine when a third-party context engine plugin fails at resolution time (unregistered id, factory throw, or contract violation), preventing a full gateway outage on every channel. (#66930) 感谢 @openperf.
- Control UI/chat: keep optimistic user message cards visible during active sends by deferring same-session history reloads until the active run ends, including aborted and errored runs. (#66997) 感谢 @scotthuang and @vincentkoc.
- Media/Slack: allow host-local CSV and Markdown uploads only when the fallback buffer actually decodes as text, so real plain-text files work without letting opaque non-text blobs renamed to `.csv` or `.md` slip past the host-read guard. (#67047) 感谢 @Unayung.
- Ollama/onboarding: split setup into `Cloud + Local`, `Cloud only`, and `Local only`, support direct `OLLAMA_API_KEY` cloud setup without a local daemon, and keep Ollama web search on the local-host path. (#67005) 感谢 @obviyus.
- Webchat/security: reject remote-host `file://` URLs in the media embedding path. (#67293) 感谢 @pgondhi987.
- Dreaming/memory-core: use the ingestion day, not the source file day, for daily recall dedupe so repeat sweeps of the same daily note can increment `dailyCount` across days instead of stalling at `1`. (#67091) 感谢 @Bartok9.
- Node-host/tools.exec: let approval binding distinguish known native binaries from mutable shell payload files, while still fail-closing unknown or racy file probes so absolute-path node-host commands like `/usr/bin/whoami` no longer get rejected as unsafe interpreter/runtime commands. (#66731) 感谢 @tmimmanuel.
- Codex/gateway: fix gateway crash when the codex-acp subprocess terminates abruptly; an unhandled EPIPE on the child stdin stream now routes through graceful client shutdown, rejecting pending requests instead of propagating as an uncaught exception that crashes the entire gateway daemon and all connected channels. Fixes #67886. (#67947) thanks @openperf
- Slack/streaming: resolve native streaming recipient teams from the inbound user when available, with a monitor-team fallback, so DM and shared-workspace streams target the right recipient more reliably.
- OpenRouter/streaming: treat `reasoning_details.response.output_text` and `reasoning_details.response.text` as visible assistant output on OpenRouter-compatible completions streams, while keeping `reasoning.text` hidden and refusing to surface ambiguous bare `text` items by default so visible replies, thinking blocks, and tool calls can coexist in the same chunk. (#67410) 感谢 @neeravmakwana.
- Models/OpenRouter aliases: resolve `openrouter:auto` to the canonical `openrouter/auto` model and map `openrouter:free` to the first configured concrete `openrouter/...:free` model instead of mis-resolving these compatibility aliases under the default provider. (#57066) 感谢 @sumiisiaran.
- OpenRouter/Arcee: canonicalize stale OpenRouter `https://openrouter.ai/v1` base URLs during provider config normalization and runtime model/transport resolution, so fresh `models.json` writes and previously discovered rows self-heal back to `https://openrouter.ai/api/v1` instead of breaking OpenRouter-routed requests. (#67295) 感谢 @achalkov.

## 🚀 v2026.4.14 (2026年4月14日)

### ✨ 新增功能与改进

- OpenAI Codex/models: add forward-compat support for `gpt-5.4-pro`, including Codex pricing/limits and list/status visibility before the upstream catalog catches up. (#66453) 感谢 @jepson-liu.
- Telegram/forum topics: surface human topic names in agent context, prompt metadata, and plugin hook metadata by learning names from Telegram forum service messages. (#65973) 感谢 @ptahdunbar.

### 🐛 问题修复

- Agents/Ollama: forward the configured embedded-run timeout into the global undici stream timeout tuning so slow local Ollama runs no longer inherit the default stream cutoff instead of the operator-set run timeout. (#63175) 感谢 @mindcraftreader and @vincentkoc.
- Models/Codex: include `apiKey` in the codex provider catalog output so the Pi ModelRegistry validator no longer rejects the entry and silently drops all custom models from every provider in `models.json`. (#66180) 感谢 @hoyyeva.
- Tools/image+pdf: normalize configured provider/model refs before media-tool registry lookup so image and PDF tool runs stop rejecting valid Ollama vision models as unknown just because the tool path skipped the usual model-ref normalization step. (#59943) 感谢 @yqli2420 and @vincentkoc.
- Slack/interactions: apply the configured global `allowFrom` owner allowlist to channel block-action and modal interactive events, require an expected sender id for cross-verification, and reject ambiguous channel types so interactive triggers can no longer bypass the documented allowlist intent in channels without a `users` list. Open-by-default behavior is preserved when no allowlists are configured. (#66028) 感谢 @eleqtrizit.
- Media-understanding/attachments: fail closed when a local attachment path cannot be canonically resolved via `realpath`, so a `realpath` error can no longer downgrade the canonical-roots allowlist check to a non-canonical comparison; attachments that also have a URL still fall back to the network fetch path. (#66022) 感谢 @eleqtrizit.
- Agents/gateway-tool: reject `config.patch` and `config.apply` calls from the model-facing gateway tool when they would newly enable any flag enumerated by `openclaw security audit` (for example `dangerouslyDisableDeviceAuth`, `allowInsecureAuth`, `dangerouslyAllowHostHeaderOriginFallback`, `hooks.gmail.allowUnsafeExternalContent`, `tools.exec.applyPatch.workspaceOnly: false`); already-enabled flags pass through unchanged so non-dangerous edits in the same patch still apply, and direct authenticated operator RPC behavior is unchanged. (#62006) 感谢 @eleqtrizit.
- Google image generation: strip a trailing `/openai` suffix from configured Google base URLs only when calling the native Gemini image API so Gemini image requests stop 404ing without breaking explicit OpenAI-compatible Google endpoints. (#66445) 感谢 @dapzthelegend.
- Telegram/forum topics: persist learned topic names to the Telegram session sidecar store so agent context can keep using human topic names after a restart instead of relearning from future service metadata. (#66107) 感谢 @obviyus.
- Doctor/systemd: keep `openclaw doctor --repair` and service reinstall from re-embedding dotenv-backed secrets in user systemd units, while preserving newer inline overrides over stale state-dir `.env` values. (#66249) 感谢 @tmimmanuel.
- Ollama/OpenAI-compat: send `stream_options.include_usage` for Ollama streaming completions so local Ollama runs report real usage instead of falling back to bogus prompt-token counts that trigger premature compaction. (#64568) 感谢 @xchunzhao and @vincentkoc.
- Doctor/plugins: cache external `preferOver` catalog lookups within each plugin auto-enable pass so large `agents.list` configs no longer peg CPU and repeatedly reread plugin catalogs during doctor/plugins resolution. (#66246) 感谢 @yfge.
- GitHub Copilot/thinking: allow `github-copilot/gpt-5.4` to use `xhigh` reasoning so Copilot GPT-5.4 matches the rest of the GPT-5.4 family. (#50168) 感谢 @jakepresent and @vincentkoc.
- Memory/embeddings: preserve non-OpenAI provider prefixes when normalizing OpenAI-compatible embedding model refs so proxy-backed memory providers stop failing with `Unknown memory embedding provider`. (#66452) 感谢 @jlapenna.
- Agents/local models: clarify low-context preflight hints for self-hosted models, point config-backed caps at the relevant OpenClaw setting, and stop suggesting larger models when `agents.defaults.contextTokens` is the real limit. (#66236) 感谢 @ImLukeF.
- Browser/SSRF: restore hostname navigation under the default browser SSRF policy while keeping explicit strict mode reachable from config, and keep managed loopback CDP `/json/new` fallback requests on the local CDP control policy so browser follow-up fixes stop regressing normal navigation or self-blocking local CDP control. (#66386) 感谢 @obviyus.
- Models/Codex: canonicalize the legacy `openai-codex/gpt-5.4-codex` runtime alias to `openai-codex/gpt-5.4` while still honoring alias-specific and canonical per-model overrides. (#43060) 感谢 @Sapientropic and @vincentkoc.
- Browser/SSRF: preserve explicit strict browser navigation mode for legacy `browser.ssrfPolicy.allowPrivateNetwork: false` configs by normalizing the legacy alias to the canonical strict marker instead of silently widening those installs to the default non-strict hostname-navigation path.
- Onboarding/custom providers: use `max_tokens=16` for OpenAI-compatible verification probes so stricter custom endpoints stop rejecting onboarding checks that only need a tiny completion. (#66450) 感谢 @WuKongAI-CMU.
- Agents/subagents: emit the subagent registry lazy-runtime stub on the stable dist path that both source and bundled runtime imports resolve, so the follow-up dist fix no longer still fails with `ERR_MODULE_NOT_FOUND` at runtime. (#66420) 感谢 @obviyus.
- Media-understanding/proxy env: auto-upgrade provider HTTP helper requests to trusted env-proxy mode only when `HTTP_PROXY`/`HTTPS_PROXY` is active and the target is not bypassed by `NO_PROXY`, so remote media-understanding and transcription requests stop failing local DNS pre-resolution in proxy-only environments without widening SSRF bypasses. (#52162) 感谢 @mjamiv and @vincentkoc.
- Telegram/media downloads: let Telegram media fetches trust an operator-configured explicit proxy for target DNS resolution after hostname-policy checks, so proxy-backed installs stop failing `could not download media` on Bot API file downloads after the DNS-pinning regression. (#66245) 感谢 @dawei41468 and @vincentkoc.
- Browser: keep loopback CDP readiness checks reachable under strict SSRF defaults so OpenClaw can reconnect to locally started managed Chrome. (#66354) 感谢 @hxy91819.
- Agents/context engine: compact engine-owned sessions from the first tool-loop delta and preserve ingest fallback when `afterTurn` is absent, so long-running tool loops can stay bounded without dropping engine state. (#63555) 感谢 @Bikkies.
- OpenAI Codex/auth: keep malformed Codex CLI auth-file diagnostics on the debug logger instead of stdout so interactive command output stays clean while auth read failures remain traceable. (#66451) 感谢 @SimbaKingjoe.
- Discord/native commands: return the real status card for native `/status` interactions instead of falling through to the synthetic `✅ Done.` ack when the generic dispatcher produces no visible reply. (#54629) 感谢 @tkozzer and @vincentkoc.
- Hooks/Ollama: let LLM-backed session-memory slug generation honor an explicit `agents.defaults.timeoutSeconds` override instead of always aborting after 15 seconds, so slow local Ollama runs stop silently dropping back to generic filenames. (#66237) 感谢 @dmak and @vincentkoc.
- Media/transcription: remap `.aac` filenames to `.m4a` for OpenAI-compatible audio uploads so AAC voice notes stop failing MIME-sensitive transcription endpoints. (#66446) 感谢 @ben-z.
- WhatsApp/Baileys media upload: keep encrypted upload POSTs streaming while still guarding generic-agent dispatcher wiring, so large outbound media sends avoid full-buffer RSS spikes and OOM regressions. (#65966) 感谢 @frankekn.
- UI/chat: replace marked.js with markdown-it so maliciously crafted markdown can no longer freeze the Control UI via ReDoS. (#46707) 感谢 @zhangfnf.
- Auto-reply/send policy: keep `sendPolicy: "deny"` from blocking inbound message processing, so the agent still runs its turn while all outbound delivery is suppressed for observer-style setups. (#65461, #53328) 感谢 @omarshahine.
- BlueBubbles: lazy-refresh the Private API server-info cache on send when reply threading or message effects are requested but status is unknown, so sends no longer silently degrade to plain messages when the 10-minute cache expires. (#65447, #43764) 感谢 @omarshahine.
- Heartbeat/security: force owner downgrade for untrusted `hook:wake` system events [AI-assisted]. (#66031) 感谢 @pgondhi987.
- Browser/security: enforce SSRF policy on snapshot, screenshot, and tab routes [AI]. (#66040) 感谢 @pgondhi987.
- Microsoft Teams/security: enforce sender allowlist checks on SSO signin invokes [AI]. (#66033) 感谢 @pgondhi987.
- Config/security: redact `sourceConfig` and `runtimeConfig` alias fields in `redactConfigSnapshot` [AI]. (#66030) 感谢 @pgondhi987.
- Agents/context engines: run opt-in turn maintenance as idle-aware background work so the next foreground turn no longer waits on proactive maintenance. (#65233) 感谢 @100yenadmin.
- Plugins/status: report the registered context-engine IDs in `plugins inspect` instead of the owning plugin ID, so non-matching engine IDs and multi-engine plugins are classified correctly. (#58766) 感谢 @zhuisDEV.
- Context engines: reject resolved plugin engines whose reported `info.id` does not match their registered slot id, so malformed engines fail fast before id-based runtime branches can misbehave. (#63222) 感谢 @fuller-stack-dev.
- WhatsApp: patch installed Baileys media encryption writes during OpenClaw postinstall so the default npm/install.sh delivery path waits for encrypted media files to finish flushing before readback, avoiding transient `ENOENT` crashes on image sends. (#65896) 感谢 @frankekn.
- Gateway/update: unify service entrypoint resolution around the canonical bundled gateway entrypoint so update, reinstall, and doctor repair stop drifting between stale `dist/entry.js` and current `dist/index.js` paths. (#65984) 感谢 @mbelinky.
- Heartbeat/Telegram topics: keep isolated heartbeat replies on the bound forum topic when `target=last`, instead of dropping them into the group root chat. (#66035) 感谢 @mbelinky.
- Browser/CDP: let managed local Chrome readiness, status probes, and managed loopback CDP control bypass browser SSRF policy for their own loopback control plane, so OpenClaw no longer misclassifies a healthy child browser as "not reachable after start". (#65695, #66043) 感谢 @mbelinky.
- Gateway/sessions: stop heartbeat, cron-event, and exec-event turns from overwriting shared-session routing and origin metadata, preventing synthetic `heartbeat` targets from poisoning later cron or user delivery. (#66073, #63733, #35300) 感谢 @mbelinky.
- Browser/CDP: let local attach-only `manual-cdp` profiles reuse the local loopback CDP control plane under strict default policy and remote-class probe timeouts, so tabs/snapshot stop falsely reporting a live local browser session as not running. (#65611, #66080) 感谢 @mbelinky.
- Cron/scheduler: stop inventing short retries when cron next-run calculation returns no valid future slot, and keep a maintenance wake armed so enabled unscheduled jobs recover without entering a refire loop. (#66019, #66083) 感谢 @mbelinky.
- Cron/scheduler: preserve the active error-backoff floor when maintenance repair recomputes a missing cron next-run, so recurring errored jobs do not resume early after a transient next-run resolution failure. (#66019, #66083, #66113) 感谢 @mbelinky.
- Outbound/delivery-queue: persist the originating outbound `session` context on queued delivery entries and replay it during recovery, so write-ahead-queued sends keep their original outbound media policy context after restart instead of evaluating against a missing session. (#66025) 感谢 @eleqtrizit.
- Memory/Ollama: restore the built-in `ollama` embedding adapter in memory-core so explicit `memorySearch.provider: "ollama"` works again, and include endpoint-aware cache keys so different Ollama hosts do not reuse each other's embeddings. (#63429, #66078, #66163) 感谢 @nnish16 and @vincentkoc.
- Auto-reply/queue: split collect-mode followup drains into contiguous groups by per-message authorization context (sender id, owner status, exec/bash-elevated overrides), so queued items from different senders or exec configs no longer execute under the last queued run's owner-only and exec-approval context. (#66024) 感谢 @eleqtrizit.
- Dreaming/memory-core: require a live queued Dreaming cron event before the heartbeat hook runs the sweep, so managed Dreaming no longer replays on later heartbeats after the scheduled run was already consumed. (#66139) 感谢 @mbelinky.
- Control UI/Dreaming: stop Imported Insights and Memory Palace from calling optional `memory-wiki` gateway methods when the plugin is off, and refresh config before wiki reloads so the Dreaming tab stops showing misleading unknown-method failures. (#66140) 感谢 @mbelinky.
- Agents/tools: only mark streamed unknown-tool retries as counted when a streamed message actually classifies an unavailable tool, and keep incomplete streamed tool names from resetting the retry streak before the final assistant message arrives. (#66145) 感谢 @dutifulbob.
- Memory/active-memory: move recalled memory onto the hidden untrusted prompt-prefix path instead of system prompt injection, label the visible Active Memory status line fields, and include the resolved recall provider/model in gateway debug logs so trace/debug output matches what the model actually saw. (#66144) 感谢 @Takhoffman.
- Memory/QMD: stop treating legacy lowercase `memory.md` as a second default root collection, so QMD recall no longer searches phantom `memory-alt-*` collections and builtin/QMD root-memory fallback stays aligned. (#66141) 感谢 @mbelinky.
- Agents/subagents: ship `dist/agents/subagent-registry.runtime.js` in npm builds so `runtime: "subagent"` runs stop stalling in `queued` after the registry import fails. (#66189) 感谢 @yqli2420 and @vincentkoc.
- Agents/OpenAI: map `minimal` thinking to OpenAI's supported `low` reasoning effort for GPT-5.4 requests, so embedded runs stop failing request validation. 感谢 @steipete.
- Voice-call/media-stream: resolve the source IP from trusted forwarding headers for per-IP pending-connection limits when `webhookSecurity.trustForwardingHeaders` and `trustedProxyIPs` are configured, and reserve `maxConnections` capacity for in-flight WebSocket upgrades so concurrent handshakes can no longer momentarily exceed the operator-set cap. (#66027) 感谢 @eleqtrizit.
- Feishu/allowlist: canonicalize allowlist entries by explicit `user`/`chat` kind, strip repeated `feishu:`/`lark:` provider prefixes, and stop folding opaque Feishu IDs to lowercase, so allowlist matching no longer crosses user/chat namespaces or widens to case-insensitive ID matches the operator did not intend. (#66021) 感谢 @eleqtrizit.
- Telegram/status commands: let read-only status slash commands bypass busy topic turns, while keeping `/export-session` on the normal lane so it cannot interleave with an in-flight session mutation. (#66226) 感谢 @VACInc and @vincentkoc.
- TTS/reply media: persist OpenClaw temp voice outputs into managed outbound media and allow them through reply-media normalization, so voice-note replies stop silently dropping. (#63511) 感谢 @jetd1.
- Agents/tools: treat Windows drive-letter paths (`C:\\...`) as absolute when resolving sandbox and read-tool paths so workspace root is not prepended under POSIX path rules. (#54039) 感谢 @ly85206559 and @vincentkoc.
- Agents/OpenAI: recover embedded GPT-style runs when reasoning-only or empty turns need bounded continuation, with replay-safe retry gating and incomplete-turn fallback when no visible answer arrives. (#66167) thanks @jalehman
- Outbound/relay-status: suppress internal relay-status placeholder payloads (`No channel reply.`, `Replied in-thread.`, `Replied in #...`, wiki-update status variants ending in `No channel reply.`) before channel delivery so internal housekeeping text does not leak to users.
- Slack/doctor: add a dedicated doctor-contract sidecar so config warmup paths such as `openclaw cron` no longer fall back to Slack's broader contract surface, which could trigger Slack-related config-read crashes on affected setups. (#63192) 感谢 @shhtheonlyperson.
- Hooks/session-memory: pass the resolved agent workspace into gateway `/new` and `/reset` session-memory hooks so reset snapshots stay scoped to the right agent workspace instead of leaking into the default workspace. (#64735) 感谢 @suboss87 and @vincentkoc.
- CLI/approvals: raise the default `openclaw approvals get` gateway timeout and report config-load timeouts explicitly, so slow hosts stop showing a misleading `Config unavailable.` note when the approvals snapshot succeeds but the follow-up config RPC needs more time. (#66239) 感谢 @neeravmakwana.
- Media/store: honor configured agent media limits when saving generated media and persisting outbound reply media, so the store no longer hard-stops those flows at 5 MB before the configured limit applies. (#66229) 感谢 @neeravmakwana and @vincentkoc.
- Plugins/setup-entry: preserve separate setup-entry secrets exports when loading bundled setup-runtime channels, so setup-mode flows keep the channel secret contract for split plugin + secrets entrypoints. (#66261) 感谢 @hxy91819.
- CLI/update: prune stale packaged `dist` chunks after npm upgrades, verify installed package inventory, and keep downgrade/update verification working across older releases. (#66959) 感谢 @obviyus.
- Gateway/exec events: dedupe replayed `exec.finished` node events by canonical session key plus `runId` so duplicate async completion replays no longer inject duplicate completion turns into the parent session transcript. (#67281) thanks @jalehman.

## 🚀 v2026.4.12 (2026年4月12日)

### ✨ 新增功能与改进

- QA/lab: add Convex-backed pooled Telegram credential leasing plus `openclaw qa credentials` admin commands and broker setup docs. (#65596) 感谢 @joshavant.
- Memory/Active Memory: add a new optional Active Memory plugin that gives OpenClaw a dedicated memory sub-agent right before the main reply, so ongoing chats can automatically pull in relevant preferences, context, and past details without making users remember to manually say "remember this" or "search memory" first. Includes configurable message/recent/full context modes, live `/verbose` inspection, advanced prompt/thinking overrides for tuning, and opt-in transcript persistence for debugging. Docs: https://docs.openclaw.ai/concepts/active-memory. (#63286) 感谢 @Takhoffman.
- macOS/Talk: add an experimental local MLX speech provider for Talk Mode, with explicit provider selection, local utterance playback, interruption handling, and system-voice fallback. (#63539) 感谢 @ImLukeF.
- CLI/exec policy: add a local `openclaw exec-policy` command with `show`, `preset`, and `set` subcommands for synchronizing requested `tools.exec.*` config with the local exec approvals file, plus follow-up hardening for node-host rejection, rollback safety, and sync conflict detection.（#64050）
- Gateway: add a `commands.list` RPC so remote gateway clients can discover runtime-native, text, skill, and plugin commands with surface-aware naming and serialized argument metadata. (#62656) 感谢 @samzong.
- Models/providers: add per-provider `models.providers.*.request.allowPrivateNetwork` for trusted self-hosted OpenAI-compatible endpoints, keep the opt-in scoped to model request surfaces, and refresh cached WebSocket managers when request transport overrides change. (#63671) 感谢 @qas.
- QA/testing: add a `--runner multipass` lane for `openclaw qa suite` so repo-backed QA scenarios can run inside a disposable Linux VM and write back the usual report, summary, and VM logs. (#63426) 感谢 @shakkernerd.
- Docs i18n: chunk raw doc translation, reject truncated tagged outputs, avoid ambiguous body-only wrapper unwrapping, and recover from terminated Pi translation sessions without changing the default `openai/gpt-5.4` path. (#62969, #63808) 感谢 @hxy91819.
- Control UI/dreaming: simplify the Scene and Diary surfaces, preserve unknown phase state for partial status payloads, and stabilize waiting-entry recency ordering so Dreaming status and review lists stay clear and deterministic. (#64035) 感谢 @davemorin.
- Gateway: split startup and runtime seams so gateway lifecycle sequencing, reload state, and shutdown behavior stay easier to maintain without changing observed behavior. (#63975) 感谢 @gumadeiras.
- Matrix/partial streaming: add MSC4357 live markers to draft preview sends and edits so supporting Matrix clients can render a live/typewriter animation and stop it when the final edit lands. (#63513) 感谢 @TigerInYourDream.
- QA/Telegram: add a live `openclaw qa telegram` lane for private-group bot-to-bot checks, harden its artifact handling, and preserve native Telegram command reply threading for QA verification. (#64303) 感谢 @obviyus.
- Models/Codex: add the bundled Codex provider and plugin-owned app-server harness so `codex/gpt-*` models use Codex-managed auth, native threads, model discovery, and compaction while `openai/gpt-*` stays on the normal OpenAI provider path. (#64298) 感谢 @steipete.
- Models/providers: add a bundled LM Studio provider with onboarding, runtime model discovery, stream preload support, and memory-search embeddings for local/self-hosted OpenAI-compatible models. (#53248) 感谢 @rugvedS07.
- Plugins/loading: narrow CLI, provider, and channel activation to manifest-declared needs, preserve explicit scope and trust boundaries, and centralize manifest-owner policy so startup, command discovery, and runtime activation avoid loading unrelated plugin runtime. (#65120, #65259, #65298, #65429, #65459) 感谢 @vincentkoc.
- Memory/active-memory: default QMD recall to search and surface better search-path telemetry so memory-backed recall works more predictably out of the box. (#65068) 感谢 @Takhoffman.
- Docs/providers: expand bundled provider docs with richer capability, env-var, and setup guidance across provider pages.
- Docs/memory-wiki: add the recommended QMD + bridge-mode hybrid recipe plus zero-artifact troubleshooting guidance for `memory-wiki` bridge setups. (#63165) 感谢 @sercada and @vincentkoc.

### 🐛 问题修复

- fix(security): remove busybox/toybox from interpreter-like safe bins [AI-assisted]. (#65713) 感谢 @pgondhi987.
- fix(approval-auth): prevent empty approver list from granting explicit approval authorization [AI]. (#65714) 感谢 @pgondhi987.
- fix(security): broaden shell-wrapper detection and block env-argv assignment injection [AI-assisted]. (#65717) 感谢 @pgondhi987.
- Gateway/startup: defer scheduled services until sidecars finish, gate chat history and model listing during sidecar resume, and let Control UI retry startup-gated history loads so Sandbox wake resumes channels first. (#65365) 感谢 @lml2468.
- Control UI/chat: load the live gateway slash-command catalog into the composer and command palette so dock commands, plugin commands, and direct skill aliases appear in chat, while keeping trusted local commands authoritative and bounding remote command metadata. (#65620) 感谢 @BunsDev.
- CLI/update: respawn tracked plugin refresh from the updated entrypoint after package self-updates so `openclaw update` stops failing on stale hashed `dist/install.runtime-*.js` chunk imports.（#65471）
- Memory/active-memory: keep recall runs on the resolved channel when wrappers like `mx-claw` are enabled, improve lexical fallback ranking, and keep lexical boosts out of hybrid search so recall finds the right memories more consistently. (#65049, #65395) 感谢 @Takhoffman.
- Dreaming: consume managed heartbeat events exactly once, stage light-sleep confidence from all recorded short-term signals, wake scheduled jobs immediately, raise dreaming-only promotion enough to cross the durable-memory gate, and stop dreaming from re-ingesting its own narrative transcripts.
- Dreaming/narrative: harden transient narrative cleanup by retrying timed-out deletes, scrubbing stale dreaming session artifacts through the lock-aware session-store path, and isolating transient narrative session keys per workspace. (#65320, #61674)
- Memory/wiki: preserve Unicode letters, digits, and combining marks in wiki slugs and contradiction clustering, and cap Unicode filename segments to safe byte lengths so non-ASCII titles stop collapsing or overflowing path limits. (#64742) 感谢 @zhouhe-xydt.
- Memory/short-term recall: allow nested daily notes under `memory/**/YYYY-MM-DD.md` to feed short-term recall, while still excluding generated dream reports under `memory/dreaming/**` so dreaming does not promote its own output. (#64682) 感谢 @SARAMALI15792.
- UI/WebChat: hide synthetic transcript-repair tool results from chat history reloads so internal recovery markers do not leak into visible chat after reconnects. (#65247) 感谢 @wangwllu.
- WhatsApp/outbound: fall back to the first `mediaUrls` entry when `mediaUrl` is empty so gateway media sends stop silently dropping attachments that already have a resolved media list. (#64394) 感谢 @eric-fr4 and @vincentkoc.
- Doctor/Discord: stop `openclaw doctor --fix` from rewriting legacy Discord preview-streaming config into the nested modern shape, so downgrades can still recover without hand-editing `channels.discord.streaming`. (#65035) 感谢 @vincentkoc.
- Gateway/auth: blank the shipped example gateway credential in `.env.example` and fail startup when a copied placeholder token or password is still configured, so operators cannot accidentally launch with a publicly known secret. (#64586) 感谢 @navarrotech and @vincentkoc.

- Memory/active-memory+dreaming: keep active-memory recall runs on the strongest resolved channel, consume managed dreaming heartbeat events exactly once, stop dreaming from re-ingesting its own narrative transcripts, and add explicit repair/dedupe recovery flows in CLI, doctor, and the Dreams UI.
- Agents/queueing: carry orphaned active-turn user text into the next prompt before repairing transcript ordering, so follow-up messages that arrive mid-run are no longer silently dropped. (#65388) 感谢 @adminfedres and @vincentkoc.
- Gateway/keepalive: stop marking WebSocket tick broadcasts as droppable so slow or backpressured clients do not self-disconnect with `tick timeout` while long-running work is still alive. (#65256) 感谢 @100yenadmin and @vincentkoc.
- Matrix/mentions: keep room mention gating strict while accepting visible `@displayName` Matrix URI labels, so `requireMention` works for non-OpenClaw Matrix clients again. (#64796) 感谢 @hclsys.
- Doctor: warn when on-disk agent directories still exist under `~/.openclaw/agents/<id>/agent` but the matching `agents.list[]` entries are missing from config. (#65113) 感谢 @neeravmakwana.
- Telegram: route approval button callback queries onto a separate sequentializer lane so plugin approval clicks can resolve immediately instead of deadlocking behind the blocked agent turn. (#64979) 感谢 @nk3750.
- Telegram/direct sessions: keep commentary-only assistant fallback payloads out of visible direct delivery, so Codex planning chatter cannot leak into Telegram DMs when a run has no `final_answer` text.
- Gateway/keepalive: stop marking WebSocket tick broadcasts as droppable so slow or backpressured clients do not self-disconnect with `tick timeout` while long-running work is still alive.（#65436）
- Gateway/plugins: always send a non-empty `idempotencyKey` for plugin subagent runs, so dreaming narrative jobs stop failing gateway schema validation. (#65354) 感谢 @CodeForgeNet.
- Gateway/auth: blank the shipped example gateway credential in `.env.example` and fail startup when a copied placeholder token or password is still configured, so operators cannot accidentally launch with a publicly known secret. (#64586) 感谢 @navarrotech.
- Plugins/memory-core dreaming: keep bundled `memory-core` loaded alongside an explicit external memory slot owner only when that owner enables dreaming, while preserving `plugins.slots.memory = "none"` disable semantics. (#65411) 感谢 @pradeep7127.
- Doctor/Discord: stop `openclaw doctor --fix` from rewriting legacy Discord preview-streaming config into the nested modern shape, so downgrades can still recover without hand-editing `channels.discord.streaming`.
- Doctor: warn when on-disk agent directories still exist under `~/.openclaw/agents/<id>/agent` but the matching `agents.list[]` entries are missing from config. (#65113) 感谢 @neeravmakwana.
- CLI/plugins: honor `memory-wiki` when `plugins.allow` is set for `openclaw wiki`, and pass the active app config into the metadata registrar so plugin-owned wiki commands resolve the live plugin config instead of falling back to defaults. (#64779, #65012)
- QA/packaging: stop packaged QA helpers from crashing when optional scenario execution config is unavailable, so npm distributions can skip the repo-only scenario pack without breaking completion-cache and startup paths. (#65118) 感谢 @EdderTalmor.
- Media/audio transcription: surface the real provider failure when every audio transcription attempt fails, so status output and the CLI stop collapsing those errors into generic skips. (#65096) 感谢 @l0cka.
- Infra/net: fix multipart FormData fields (including `model`) being silently dropped when a guarded runtime fetch body crosses a FormData implementation boundary, restoring OpenAI audio transcription requests that failed with HTTP 400. (#64349) 感谢 @petr-sloup.
- Dreaming/diary: use the host local timezone for diary timestamps when `dreaming.timezone` is unset, and include the timezone abbreviation so `DREAMS.md` and the UI make local or UTC time explicit. (#65034, #65057)
- Dreaming/promotion: raise phase reinforcement enough for repeated dreaming-only revisits to clear the default durable-memory gate after multiple days, instead of stalling just below the score threshold. (#64068) 感谢 @vincentkoc.
- Dreaming/light-sleep: compute staged candidate confidence from all recorded short-term signals instead of recall-only counts, so dreaming-only entries stop rendering as `confidence: 0.00`. (#64599) 感谢 @vincentkoc.
- Plugins/memory: restore cached memory capability public artifacts on plugin-registry cache hits so memory-backed artifact surfaces stay visible after warm loads.
- Gateway/cron: preserve requested isolated-agent config across runtime reloads so subagent jobs and heartbeat overrides keep the right workspace and heartbeat settings when the hot-loaded snapshot is stale.
- Cron/isolated sessions: persist the right transcript path for each isolated run, including fresh session rollovers, so cron runs stop appending to stale session files.
- Discord/gateway: clear stale heartbeat timers before reconnecting so zombie gateway callbacks cannot crash the process and drop in-flight replies. (#65009) 感谢 @SARAMALI15792.
- Matrix/mentions: keep room mention gating strict while accepting visible `@displayName` Matrix URI labels, so `requireMention` works for non-OpenClaw Matrix clients again. (#64796) 感谢 @hclsys.
- Agents/Anthropic replay: preserve immutable signed-thinking replay safety across stored and live reruns, keep non-thinking embedded `tool_result` user blocks intact, and drop conflicting preserved tool IDs before validation so retries stop degrading into omitted tool calls. (#65126) 感谢 @shakkernerd.
- Memory/QMD: allow channel sessions in the shipped default QMD scope, while still denying groups.
- Memory/QMD: stop registering the legacy lowercase root memory file as a separate default collection, so QMD now prefers `MEMORY.md` and the `memory/` tree without duplicate collection-add warnings.
- Memory/memory-core: watch the `memory` directory directly and ignore non-markdown churn so nested note changes still sync on macOS + Node 25 environments where recursive `memory/**/*.md` glob watching fails. (#64711) 感谢 @jasonxargs-boop and @vincentkoc.
- WhatsApp: centralize per-account connection ownership so reconnects, login recovery, and outbound readiness stay attached to the live socket instead of drifting across monitor and login paths. (#65290) 感谢 @mcaxtr and @vincentkoc.
- iMessage: retry transient `watch.subscribe` startup failures before tearing down the monitor, and sanitize startup error logging so brief local transport stalls do not immediately bounce the channel or leak raw imsg RPC payloads into logs. (#65393) 感谢 @vincentkoc.
- CLI/audio providers: report env-authenticated providers as configured in `openclaw infer audio providers --json`, while keeping trusted workspace provider env lookup defaults stable during auth setup.（#65491）
- Plugins/install: reinstall bundled runtime packages when the matching platform native optional child is missing, so packaged Windows installs can recover dependencies that were packed on another host OS.
- Memory/QMD: preserve explicit `memory.qmd.command` paths, create missing agent workspaces before QMD probes, and keep the current Node binary on QMD subprocess PATH so service and gateway environments do not fall back to builtin search unnecessarily.
- Plugins/Lobster: load the published `@clawdbot/lobster/core` runtime in process so bundled Lobster runs stop depending on private package internals. (#64755) 感谢 @mbelinky.
- Agents/CLI: keep unrelated config, session, transcript, and MCP bootstrap runtime off common `openclaw agent` cold paths so provider selection and agent startup stop stalling on heavyweight imports. 感谢 @vincentkoc.
- Setup/config/install: stop setup, config dry-runs, and daemon install from eagerly booting auth-profile and plugin repair runtime when those paths are not needed, so onboarding and local service setup avoid long cold-start stalls. 感谢 @vincentkoc.
- Cron/direct delivery: slim isolated-agent delivery cold paths so direct channel delivery and related cron execution spend less time loading unrelated auth, plugin, and channel runtime. 感谢 @vincentkoc.
- Channels/replay dedupe: standardize replay claims, retryable-failure release, and post-success commit behavior across Telegram, Discord, Slack, Mattermost, WhatsApp, Matrix, LINE, Feishu, Zalo, Nextcloud Talk, TLON, Nostr, Voice Call, and shared plugin interactive callbacks so duplicate deliveries stay reply-once after success but retry cleanly after pre-delivery failures. 感谢 @vincentkoc.
- Agents/OpenAI mini reasoning: remap unsupported `low` and `minimal` reasoning effort to `medium` for affected OpenAI mini models, and add a live regression lane to keep the compatibility fix covered. (#65478) 感谢 @vincentkoc.
- Configure/wizard: replay wizard edits onto the latest config snapshot after a hash conflict so plugin-auth writes no longer get dropped during `openclaw configure`, including nested config under shared sections such as `plugins`. (#64188) 感谢 @feiskyer and @vincentkoc.

## 🚀 v2026.4.11 (2026年4月11日)

### ✨ 新增功能与改进

- Dreaming/memory-wiki: add ChatGPT import ingestion plus new `Imported Insights` and `Memory Palace` diary subtabs so Dreaming can inspect imported source chats, compiled wiki pages, and full source pages directly from the UI.（#64505）
- Control UI/webchat: render assistant media/reply/voice directives as structured chat bubbles, add the `[embed ...]` rich output tag, and gate external embed URLs behind config.（#64104）
- Tools/video_generate: add URL-only generated asset delivery, typed `providerOptions`, reference audio inputs, per-asset role hints, `adaptive` aspect-ratio support, and a higher image-input cap so video providers can expose richer generation modes without forcing large files into memory. (#61987, #61988) 感谢 @xieyongliang.
- Feishu: improve document comment sessions with richer context parsing, comment reactions, and typing feedback so document-thread conversations behave more like chat conversations.（#63785）
- Microsoft Teams: add reaction support, reaction listing, Graph pagination, and delegated OAuth setup for sending reactions while preserving application-auth read paths.（#51646）
- Plugins: allow plugin manifests to declare activation and setup descriptors so plugin setup flows can describe required auth, pairing, and configuration steps without hardcoded core special cases.（#64780）
- Ollama: cache `/api/show` context-window and capability metadata during model discovery so repeated picker refreshes stop refetching unchanged models, while still retrying after empty responses and invalidating on digest changes. (#64753) 感谢 @ImLukeF.
- Models/providers: surface how configured OpenAI-compatible endpoints are classified in embedded-agent debug logs, so local and proxy routing issues are easier to diagnose. (#64754) 感谢 @ImLukeF.
- QA/parity: add the GPT-5.4 vs Opus 4.6 agentic parity report gate with shared scenario coverage checks, stricter evidence heuristics, and skipped-scenario accounting for maintainer review. (#64441) 感谢 @100yenadmin.

### 🐛 问题修复

- Windows/onboarding: open provider OAuth and sign-in URLs with `explorer.exe` instead of routing them through `cmd /c start`, so quoted provider URLs cannot break out into host command execution. (#64161) 感谢 @coygeek and @vincentkoc.
- OpenAI/Codex OAuth: stop rewriting the upstream authorize URL scopes so new Codex sign-ins do not fail with `invalid_scope` before returning an authorization code. (#64713) 感谢 @fuller-stack-dev.
- Audio transcription: disable pinned DNS only for OpenAI-compatible multipart requests, while still validating hostnames, so OpenAI, Groq, and Mistral transcription works again without weakening other request paths. (#64766) 感谢 @GodsBoy.
- macOS/Talk Mode: after granting microphone permission on first enable, continue starting Talk Mode instead of requiring a second toggle. (#62459) 感谢 @ggarber.
- Control UI/webchat: persist agent-run TTS audio replies into webchat history and preserve interleaved tool card pairing so generated audio and mixed tool output stay attached to the right messages. (#63514) 感谢 @bittoby.
- WhatsApp: honor the configured default account when the active listener helper is used without an explicit account id, so named default accounts do not get registered under `default`. (#53918) 感谢 @yhyatt.
- ACP/agents: suppress commentary-phase child assistant relay text in ACP parent stream updates, so spawned child runs stop leaking internal progress chatter into the parent session. 感谢 @vincentkoc.
- Agents/timeouts: honor explicit run timeouts in the LLM idle watchdog and align default timeout config so slow models can keep working until the configured limit instead of using the wrong idle window.
- Config: include `asyncCompletion` in the generated zod schema so documented async completion config no longer fails with an unrecognized-key error.（#63618）
- Google/Veo: stop sending the unsupported `numberOfVideos` request field so Gemini Developer API Veo runs do not fail before OpenClaw can complete the intended Google video generation path. (#64723) 感谢 @velvet-shark.
- QA/packaging: stop packaged CLI startup and completion cache generation from reading repo-only QA scenario markdown, ship the bundled QA scenario pack in npm releases, and keep `openclaw completion --write-state` working even if QA setup is broken. (#64648) 感谢 @obviyus.
- Codex/QA: keep Codex app-server coordination chatter out of visible replies, add a live QA leak scenario, and classify leaked harness meta text as a QA failure instead of a successful reply. 感谢 @vincentkoc.
- WhatsApp: route `message react` through the gateway-owned action path so reactions use the live WhatsApp listener in both DM and group chats, matching `message send` and `message poll`. 感谢 @mcaxtr.
- Auto-reply/WhatsApp: preserve inbound image attachment notes after media understanding so image edits keep the real saved media path instead of hallucinating a missing local path. (#64918) 感谢 @ngutman.
- Telegram/sessions: keep topic-scoped session initialization on the canonical topic transcript path when inbound turns omit `MessageThreadId`, so one topic session no longer alternates between bare and topic-qualified transcript files. (#64869) 感谢 @jalehman.
- Agents/failover: scope assistant-side fallback classification and surfaced provider errors to the current attempt instead of stale session history, so cross-provider fallback runs stop inheriting the previous provider's failure. (#62907) 感谢 @stainlu.
- MiniMax/OAuth: write `api: "anthropic-messages"` and `authHeader: true` into the `minimax-portal` config patch during `openclaw configure`, so re-authenticated portal setups keep Bearer auth routing working. (#64964) 感谢 @ryanlee666.
- Agents/tools: stop repeated unavailable-tool retries from escaping loop detection when the model changes arguments, and rewrite over-threshold unknown tool calls into plain assistant text before dispatch. (#65922) 感谢 @dutifulbob.
- Cron/announce delivery: tell isolated cron jobs to return the full response exactly instead of a summary, so structured `--announce` deliveries stop dropping fields nondeterministically. (#65638) 感谢 @srinivaspavan9 and @vincentkoc.
- Security/exec approvals: redact bearer tokens, API keys, and similar secrets in exec approval prompt command text before those prompts are posted back to chat channels, regardless of logging redaction settings. (#61077) 感谢 @feiskyer and @vincentkoc.

## 🚀 v2026.4.10 (2026年4月10日)

### ✨ 新增功能与改进

- Models/Codex: add the bundled Codex provider and plugin-owned app-server harness so `codex/gpt-*` models use Codex-managed auth, native threads, model discovery, and compaction while `openai/gpt-*` stays on the normal OpenAI provider path.（#64298）
- Memory/Active Memory: add a new optional Active Memory plugin that gives OpenClaw a dedicated memory sub-agent right before the main reply, so ongoing chats can automatically pull in relevant preferences, context, and past details without making users remember to manually say "remember this" or "search memory" first. Includes configurable message/recent/full context modes, live `/verbose` inspection, advanced prompt/thinking overrides for tuning, and opt-in transcript persistence for debugging. Docs: https://docs.openclaw.ai/concepts/active-memory. (#63286) 感谢 @Takhoffman.
- macOS/Talk: add an experimental local MLX speech provider for Talk Mode, with explicit provider selection, local utterance playback, interruption handling, and system-voice fallback. (#63539) 感谢 @ImLukeF.
- Tools/video generation: add Seedance 2.0 model refs to the bundled fal provider and submit the provider-specific duration, resolution, audio, and seed metadata fields needed for live Seedance 2.0 runs.
- Microsoft Teams: add message actions for pin, unpin, read, react, and listing reactions. (#53432) 感谢 @sudie-codes.
- QA/Matrix: add a live `openclaw qa matrix` lane backed by a disposable Matrix homeserver, shared live-transport seams, and Matrix-specific transport coverage for threading, reactions, restart, and allowlist behavior. (#64489) 感谢 @gumadeiras.
- QA/Telegram: add a live `openclaw qa telegram` lane for private-group bot-to-bot checks, harden its artifact handling, and preserve native Telegram command reply threading for QA verification. (#64303) 感谢 @obviyus.
- QA/testing: add a `--runner multipass` lane for `openclaw qa suite` so repo-backed QA scenarios can run inside a disposable Linux VM and write back the usual report, summary, and VM logs. (#63426) 感谢 @shakkernerd.
- CLI/exec policy: add a local `openclaw exec-policy` command with `show`, `preset`, and `set` subcommands for synchronizing requested `tools.exec.*` config with the local exec approvals file, plus follow-up hardening for node-host rejection, rollback safety, and sync conflict detection.（#64050）
- Gateway: add a `commands.list` RPC so remote gateway clients can discover runtime-native, text, skill, and plugin commands with surface-aware naming and serialized argument metadata. (#62656) 感谢 @samzong.
- Models/providers: add per-provider `models.providers.*.request.allowPrivateNetwork` for trusted self-hosted OpenAI-compatible endpoints, keep the opt-in scoped to model request surfaces, and refresh cached WebSocket managers when request transport overrides change. (#63671) 感谢 @qas.
- Feishu: standardize request user agents and register the bot as an AI agent so Feishu deployments identify OpenClaw consistently. (#63835) 感谢 @evandance.
- Docs i18n: chunk raw doc translation, reject truncated tagged outputs, avoid ambiguous body-only wrapper unwrapping, and recover from terminated Pi translation sessions without changing the default `openai/gpt-5.4` path. (#62969, #63808) 感谢 @hxy91819.
- Gateway: split startup and runtime seams so gateway lifecycle sequencing, reload state, and shutdown behavior stay easier to maintain without changing observed behavior. (#63975) 感谢 @gumadeiras.
- Control UI/webchat: normalize assistant `MEDIA:`/reply/voice directives into structured bubble rendering, rename the unreleased rich web shortcode to `[embed ...]`, and surface session runtime roots so hosted web content is written to the correct document path instead of guessed local files.
- Matrix/partial streaming: add MSC4357 live markers to draft preview sends and edits so supporting Matrix clients can render a live/typewriter animation and stop it when the final edit lands. (#63513) 感谢 @TigerInYourDream.
- Control UI/dreaming: simplify the Scene and Diary surfaces, preserve unknown phase state for partial status payloads, and stabilize waiting-entry recency ordering so Dreaming status and review lists stay clear and deterministic. (#64035) 感谢 @davemorin.
- Agents: add an opt-in strict-agentic embedded Pi execution contract for GPT-5-family runs so plan-only or filler turns keep acting until they hit a real blocker. (#64241) 感谢 @100yenadmin.
- Agents/OpenAI: add provider-owned OpenAI/Codex tool schema compatibility and surface embedded-run replay/liveness state for long-running runs. (#64300) 感谢 @100yenadmin.
- Dreaming/memory-wiki: add ChatGPT import ingestion plus new `Imported Insights` and `Memory Palace` diary subtabs so Dreaming can inspect imported source chats, compiled wiki pages, and full source pages directly from the UI.（#64505）

### 🐛 问题修复

- Browser/security: tighten browser and sandbox navigation defenses across strict SSRF defaults, hostname allowlists, interaction-driven redirects, subframes, CDP discovery, existing sessions, tab actions, noVNC, marker-span sanitization, and Docker CDP source-range enforcement. (#61404, #63332, #63882, #63885, #63889, #64367, #64370, #64371)
- Security/tools: harden exec preflight reads, host env denylisting, node output boundaries, outbound host-media reads, profile-mutation authorization, plugin install dependency scanning, ACPX tool hooks, Gmail watcher token redaction, and oversized realtime WebSocket frame handling. (#62333, #62661, #62662, #63277, #63551, #63553, #63886, #63890, #63891, #64459)
- OpenAI/Codex: add required Codex OAuth scopes, classify provider/runtime failures more clearly, stop suggesting `/elevated full` when auto-approved host exec is unavailable, add OpenAI/Codex tool-schema compatibility, and preserve embedded-run replay/liveness truth across compaction retries and mutating side effects. (#64300, #64439) 感谢 @100yenadmin.
- CLI/WhatsApp media sends: route gateway-mode outbound sends with `--media` through the channel `sendMedia` path and preserve media access context, so WhatsApp document and attachment sends stop silently dropping the file while still delivering the caption. (#64478, #64492) 感谢 @ShionEria.
- Microsoft Teams: restore media downloads for personal DMs, Bot Framework `a:` conversations, OneDrive/SharePoint shared files, and Graph-backed chat IDs; accept Bot Framework audience tokens; prevent feedback-learning filename collisions; keep long tool chains alive with typing indicators; add SSO sign-in callbacks; inject parent context for thread replies; and deliver cron announcements to Teams conversation IDs. (#54932, #55383, #55386, #58001, #58249, #58774, #59731, #60956, #62219, #62674, #63063, #63942, #63945, #63949, #63951, #63953, #64087, #64088, #64089)
- Gateway/tailscale: start Tailscale exposure and the gateway update check before awaiting channel and plugin sidecar startup so remote operators are not locked out when startup sidecars stall.
- Gateway/startup: keep WebSocket RPC available while channels and plugin sidecars start, hold `chat.history` unavailable until startup sidecars finish so synchronous history reads cannot stall startup (reported in #63450), refresh advertised gateway methods after deferred plugin reloads, and enforce the pre-auth WebSocket upgrade budget before the no-handler 503 path so upgrade floods cannot bypass connection limits during that window. (#63480) 感谢 @neeravmakwana.
- WhatsApp: keep inbound replies, media, composing indicators, and queued outbound deliveries attached to the current socket across reconnect gaps, including fresh retry-eligible sends after the listener comes back. (#30806, #46299, #62892, #63916) 感谢 @mcaxtr.
- Gateway/thread routing: preserve Slack, Telegram, Mattermost, Matrix, ACP, restart-sentinel, and agent announce delivery targets so subagent, cron, stream-relay, session fallback, and restart messages land back in the originating thread, topic, or room casing. (#54840, #57056, #63143, #63228, #63506, #64343, #64391)
- Models/fallback: preserve `/models` selection across transient primary-model failures and config reloads, allow timeout cooldown probes, classify OpenRouter no-endpoints responses, detect llama.cpp context overflows, and keep provider/runtime context metadata stable through reloads. (#61472, #64196, #64471)
- Agents/BTW: keep `/btw` side questions working after tool-use turns by stripping replayed tool blocks, hidden reasoning, and malformed image payloads, omitting empty tool arrays, allowing Bedrock `auth: "aws-sdk"`, and routing Feishu `/btw` plus `/stop` through bounded out-of-band lanes. (#64218, #64219, #64225, #64324) 感谢 @ngutman.
- Control UI/BTW: render `/btw` side results as dismissible ephemeral cards in the browser, send `/btw` immediately during active runs, and clear stale BTW cards on reset flows so webchat matches the intended detached side-question behavior. (#64290) 感谢 @ngutman.
- Commands/targeting: use the selected agent or session for command output, send policy, usage/cost, context reports, model lists, bash sandbox hints, BTW/compact working directories, plugin commands, and session exports so multi-agent commands describe and mutate the intended target instead of the requester.
- Conversation bindings: normalize focused/current conversation ids, preserve binding metadata on account and Discord rebinds, avoid stale Discord lifecycle windows, and keep generic activity touches persisted so reply routing survives rebinds and restarts.
- iMessage/self-chat: distinguish normal DM outbound rows from true self-chat using `destination_caller_id` plus chat participants, preserve multi-handle self-chat aliases, drop ambiguous reflected echoes, and strip wrapped imsg RPC text fields. (#61619, #63868, #63980, #63989, #64000) 感谢 @neeravmakwana.
- Matrix: keep multi-account room scoping consistent, keep packaged crypto migrations warning-only when appropriate, preserve ordered block streaming, add explicit Matrix block-streaming opt-in, and resolve verification/bootstrap from the packaged runtime entry. (#58449, #59249, #59266, #64373) 感谢 @gumadeiras.
- Telegram/security: tighten Telegram `allowFrom` sender validation and keep `/whoami` allowlist reporting in sync with command auth checks.
- Agents/timeouts: extend the default LLM idle window to 120s and keep silent no-token idle timeouts on recovery paths, so slow models can retry or fall back before users see an error.
- Gateway/agents: preserve configured model selection and richer `IDENTITY.md` content across agent create/update flows and workspace moves, and fail safely instead of silently overwriting unreadable identity files. (#61577) 感谢 @samzong.
- Skills/TaskFlow: restore valid frontmatter fences for the bundled `taskflow` and `taskflow-inbox-triage` skills and copy bundled `SKILL.md` files as hard dist-runtime copies so skills stay discoverable and loadable after updates. (#64166, #64469) 感谢 @extrasmall0.
- Skills: respect overridden home directories when loading personal skills so service, test, and custom launch environments read the intended user skill directory instead of the process home.
- Windows/exec: settle supervisor waits from child exit state after stdout and stderr drain even when `close` never arrives, so CLI commands stop hanging or dying with forced `SIGKILL` on Windows. (#64072) 感谢 @obviyus.
- Browser/sandbox: prevent sandbox browser CDP startup hangs by recreating containers when the browser security hash changes and by waiting on the correct sandbox browser lifecycle. (#62873) 感谢 @Syysean.
- QQBot/streaming: make block streaming configurable per QQ bot account via `streaming.mode` (`"partial"` | `"off"`, default `"partial"`) instead of hardcoding it off, so responses can be delivered incrementally.（#63746）
- QQBot/config: allow extra fields in `channels.qqbot` and `channels.qqbot.accounts.*` so extended qqbot builds can add new config options without gateway startup failing on schema validation. (#64075) 感谢 @WideLee.
- Dreaming/gateway: require `operator.admin` for persistent `/dreaming on|off` changes and treat missing gateway client scopes as unprivileged instead of silently allowing config writes. (#63872) 感谢 @mbelinky.
- Gateway/pairing: prefer explicit QR bootstrap auth over earlier Tailscale auth classification so iOS `/pair qr` silent bootstrap pairing does not fall through to `pairing required`. (#59232) 感谢 @ngutman.
- Browser/control: auto-generate browser-control auth tokens for `none` and `trusted-proxy` modes, and route browser auth/profile/doctor helpers through the public browser plugin facades. (#63280, #63957) 感谢 @pgondhi987.
- Browser/act: centralize `/act` request normalization and execution dispatch while adding stable machine-readable route-level error codes for invalid requests, selector misuse, evaluate-disabled gating, target mismatch, and existing-session unsupported actions. (#63977) 感谢 @joshavant.
- Security/QQBot: enforce media storage boundaries for all outbound local file paths and route image-size probes through SSRF-guarded media fetching instead of raw `fetch()`. (#63271, #63495) 感谢 @pgondhi987.
- Channel setup: ignore workspace plugin shadows when resolving trusted channel setup catalog entries so onboarding and setup flows keep using the bundled, trusted setup contract.
- Gateway/memory startup: load the explicitly selected memory-slot plugin during gateway startup, while keeping restrictive allowlists and implicit default memory slots from auto-starting unrelated memory plugins. (#64423) 感谢 @EronFan.
- Config/plugins: let config writes keep disabled plugin entries without forcing required plugin config schemas or crashing raw plugin validation, and avoid re-activating plugin registry state during schema checks. (#54971, #63296) 感谢 @fuller-stack-dev.
- Config validation: surface the actual offending field for strict-schema union failures in bindings, including top-level unexpected keys on the matching ACP branch. (#40841) 感谢 @Hollychou924.
- Wizard/plugin config: coerce integer-typed plugin config fields from interactive text input so integer schema values persist as numbers instead of failing validation. (#63346) 感谢 @jalehman.
- Daemon/gateway install: preserve safe custom service env vars on forced reinstall, merge prior custom PATH segments behind the managed service PATH, and stop removed managed env keys from persisting as custom carryover. (#63136) 感谢 @WarrenJones.
- Cron/scheduling: treat `nextRunAtMs <= 0` as invalid across cron update, maintenance, timer, and stale-delivery paths so corrupted zero timestamps self-heal instead of causing immediate runs or skipped deliveries. (#63507) 感谢 @WarrenJones.
- Cron/auth: resolve auth profiles consistently for isolated cron jobs so scheduled runs use the same configured provider credentials as interactive sessions. (#62797) 感谢 @neeravmakwana.
- Tasks: let `openclaw tasks cancel` cancel stuck background tasks that never reached a normal terminal state. (#62506) 感谢 @neeravmakwana.
- Sessions/model selection: preserve catalog-backed session model labels, provider-qualified context limits, and already-qualified session model refs when catalog metadata is unavailable, so model selection and memory/context budgets survive reloads without bogus provider prefixes. (#61382, #62493) 感谢 @Mule-ME.
- Status: show configured fallback models in `/status` and shared session status cards so per-agent fallback configuration is visible before a live failover happens. (#33111) 感谢 @AnCoSONG.
- `/context detail` now compares the tracked prompt estimate with cached context usage and surfaces untracked provider/runtime overhead when present. (#28391) 感谢 @ImLukeF.
- Gateway/sessions: scope bare `sessions.create` aliases like `main` to the requested agent while preserving the canonical `global` and `unknown` sentinel keys. (#58207) 感谢 @jalehman.
- Gateway/session reset: emit the typed `before_reset` hook for gateway `/new` and `/reset`, preserving reset-hook behavior even when the previous transcript has already been archived. (#53872) 感谢 @VACInc.
- Plugins/commands: pass the active host `sessionKey` into plugin command contexts, and include `sessionId` when it is already available from the active session entry, so bundled and third-party commands can resolve the current conversation reliably. (#59044) 感谢 @jalehman.
- Agents/auth: honor `models.providers.*.authHeader` for pi embedded runner model requests by injecting `Authorization: Bearer <apiKey>` when requested. (#54390) 感谢 @lndyzwdxhs.
- Claude CLI: clear inherited Anthropic auth/header environment aliases before spawning Claude Code and add sanitized CLI backend auth-env diagnostics for debugging gateway-run provider selection.
- Agents/failover: classify AbortError and stream-abort messages as timeout so Ollama NDJSON stream aborts stop showing `reason=unknown` in model fallback logs. (#58324) 感谢 @yelog.
- Fireworks/FirePass: disable Kimi K2.5 Turbo reasoning output by forcing thinking off on the FirePass path and hardening the provider wrapper so hidden reasoning no longer leaks into visible replies. (#63607) 感谢 @frankekn.
- Discord: update Carbon to v0.15.0. 感谢 @thewilloftheshadow.
- Config/Discord: coerce safe integer numeric Discord IDs to strings during config validation, keep unsafe or precision-losing numeric snowflakes rejected, and align `openclaw doctor` repair guidance with the same fail-closed behavior. (#45125) 感谢 @moliendocode.
- BlueBubbles/config: accept `enrichGroupParticipantsFromContacts` in the core strict config schema so gateways no longer fail validation or startup when the BlueBubbles plugin writes that field. (#56889) 感谢 @zqchris.
- Feishu/webhooks: read webhook bodies through the pre-auth guard so unauthenticated webhook traffic stays under the same body budget as other protected channel ingress paths.
- Tools/web_fetch: add an opt-in `tools.web.fetch.ssrfPolicy.allowRfc2544BenchmarkRange` config so fake-IP proxy environments that resolve public sites into `198.18.0.0/15` can use `web_fetch` without weakening the default SSRF block. (#61830) 感谢 @xing-xing-coder.
- Dreaming/cron: reconcile managed dreaming cron from startup config and runtime lifecycle changes, but only recover managed dreaming cron state during heartbeat-triggered dreaming checks so ordinary chat traffic does not recreate removed jobs. (#63873, #63929, #63938) 感谢 @mbelinky.
- Memory/lancedb: accept `dreaming` config when `memory-lancedb` owns the memory slot so Dreaming surfaces can read slot-owner settings without schema rejection. (#63874) 感谢 @mbelinky.
- Control UI/dreaming: keep the Dreaming trace area contained and scrollable so overlays no longer cover tabs or blow out the page layout. (#63875) 感谢 @mbelinky.
- Dreaming/narrative: harden request-scoped diary fallback so scheduled dreaming only falls back on the dedicated subagent-runtime error, stop trusting spoofable raw error-code objects, and avoid leaking workspace paths when local fallback writes fail. (#64156) 感谢 @mbelinky.
- Dreaming/diary: add idempotent narrative subagent runs, preserve restrictive `DREAMS.md` permissions during atomic writes, and surface temp cleanup failures so repeated sweeps do not double-run the same narrative request or silently weaken diary safety. (#63876) 感谢 @mbelinky.
- Heartbeats/sessions: remove stale accumulated isolated heartbeat session keys when the next tick converges them back to the canonical sibling, so repaired sessions stop showing orphaned `:heartbeat:heartbeat` variants in session listings. (#59606) 感谢 @rogerdigital.
- Gateway/run cleanup: fix stale run-context TTL cleanup so the new maintenance sweep resets orphaned run sequence state and prevents unbounded run-context growth. (#52731) 感谢 @artwalker.
- UI/compaction: keep the compaction indicator in a retry-pending state until the run actually finishes, so the UI does not show `Context compacted` before compaction actually finishes. (#55132) 感谢 @mpz4life.
- Cron/tool schemas: keep cron tool schemas strict-model-friendly while still preserving `failureAlert=false`, nullable `agentId`/`sessionKey`, and flattened add/update recovery for the newly exposed cron job fields. (#55043) 感谢 @brunolorente.
- Git metadata: read commit ids from packed refs as well as loose refs so version and status metadata stay accurate after repository maintenance.（#63943）
- Gateway: keep `commands.list` skill entries categorized under tools and include provider-aware plugin `nativeName` metadata even when `scope=text`, so remote clients can group skills correctly and map text-surface plugin commands back to native aliases.（#64147）
- TUI: reset footer activity to idle when switching sessions so a stale streaming indicator cannot persist after the selection changes. (#63988) 感谢 @neeravmakwana.
- Claude CLI: stop marking spawned Claude Code runs as host-managed so they keep using normal CLI subscription behavior. (#64023) 感谢 @Alex-Alaniz.
- Codex auth: brand Codex OAuth flows as OpenClaw in user-visible auth prompts and diagnostics.
- Gateway/pairing: fail closed for paired device records that have no device tokens, and reject pairing approvals whose requested scopes do not match the requested device roles.
- ACP/gateway chat: classify lifecycle errors before forwarding them to ACP clients so refusals use ACP's refusal stop reason while transient backend errors continue to finish as normal turns.
- Claude CLI/skills: pass eligible OpenClaw skills into CLI runs, including native Claude Code skill resolution via a temporary plugin plus per-run skill env/API key injection. (#62686, #62723) 感谢 @zomars.
- Discord: keep generated auto-thread names working with reasoning models by giving title generation enough output budget for thinking plus visible title text. (#64172) 感谢 @hanamizuki.
- Heartbeat: ignore doc-only Markdown fence markers in the default `HEARTBEAT.md` template so comment-only heartbeat scaffolds skip API calls again. (#61690, #63434) 感谢 @ravyg.
- Reply/skills: keep resolved skill and memory secret config stable through embedded reply runs so raw SecretRefs in secondary skill settings no longer crash replies when the gateway already has the live env. (#64249) 感谢 @mbelinky.
- Dreaming/startup: keep plugin-registered startup hooks alive across workspace hook reloads and include dreaming startup owners in the gateway startup plugin scope, so managed Dreaming cron registration comes back reliably after gateway boot. (#62327, #64258) 感谢 @mbelinky.
- Plugins: treat duplicate `registerService` calls from the same plugin id as idempotent so snapshot and activation loads no longer emit spurious `service already registered` diagnostics. (#62033, #64128) 感谢 @ly85206559.
- Discord/TTS: route auto voice replies through the native voice-note path so Discord receives Opus voice messages instead of regular audio attachments. (#64096) 感谢 @LiuHuaize.
- Config/plugins: use plugin-owned command alias metadata when `plugins.allow` contains runtime command names like `dreaming`, and point users at the owning plugin instead of stale plugin-not-found guidance. (#64191, #64242) 感谢 @feiskyer.
- Agents/Gemini: strip orphaned `required` entries from Gemini tool schemas so provider validation no longer rejects tools after schema cleanup or union flattening. (#64284) 感谢 @xxxxxmax.
- Assistant text: strip Qwen-style XML tool call payloads from visible replies so web and channel messages no longer show raw `<tool_call><function=...>` output. (#63999, #64214) 感谢 @MoerAI.
- Daemon/gateway: prevent systemd restart storms on configuration errors by exiting with `EX_CONFIG` and adding generated unit restart-prevention guards. (#63913) 感谢 @neo1027144-creator.
- Agents/exec: prevent gateway crash ("Agent listener invoked outside active run") when a subagent exec tool produces stdout/stderr after the agent run has ended or been aborted. (#62821) 感谢 @openperf.
- Gateway/OpenAI compat: return real `usage` for non-stream `/v1/chat/completions` responses, emit the final usage chunk when `stream_options.include_usage=true`, and bound usage-gated stream finalization after lifecycle end. (#62986) 感谢 @Lellansin.
- Matrix/migration: keep packaged warning-only crypto migrations from being misclassified as actionable when only helper chunks are present, so startup and doctor stay on the warning-only path instead of creating unnecessary migration snapshots. (#64373) 感谢 @gumadeiras.
- Matrix/ACP thread bindings: preserve canonical room casing and parent conversation routing during ACP session spawn so mixed-case room ids bind correctly from top-level rooms and existing Matrix threads. (#64343) 感谢 @gumadeiras.
- Agents/subagents: deduplicate delivered completion announces so retry or re-entry cleanup does not inject duplicate internal-context completion turns into the parent session. (#61525) 感谢 @100yenadmin.
- Agents/exec: keep sandboxed `tools.exec.host=auto` sessions from honoring per-call `host=node` or `host=gateway` overrides while a sandbox runtime is active, and stop advertising node routing in that state so exec stays on the sandbox host.（#63880）
- Agents/subagents: preserve archived delete-mode runs until `sessions.delete` succeeds and prevent overlapping archive sweeps from duplicating in-flight cleanup attempts. (#61801) 感谢 @100yenadmin.
- Cron/isolated agent: run scheduled agent turns as non-owner senders so owner-only tools stay unavailable during cron execution.（#63878）
- Discord/sandbox: include `image` in sandbox media param normalization so Discord event cover images cannot bypass sandbox path rewriting. (#64377) 感谢 @mmaps.
- Agents/exec: extend exec completion detection to cover local background exec formats so the owner-downgrade fires correctly for all exec paths. (#64376) 感谢 @mmaps.
- Security/dependencies: pin axios to 1.15.0 and add a plugin install dependency denylist that blocks known malicious packages before install. (#63891) 感谢 @mmaps.
- Browser/security: apply three-phase interaction navigation guard to pressKey and type(submit) so delayed JS redirects from keypress cannot bypass SSRF policy. (#63889) 感谢 @mmaps.

- Browser/security: guard existing-session Chrome MCP interaction routes with SSRF post-checks so delayed navigation from click, type, press, and evaluate cannot bypass the configured policy. (#64370) 感谢 @eleqtrizit.
- Browser/security: default browser SSRF policy to strict mode so unconfigured installs block private-network navigation, and align external-content marker span mapping so ZWS-injected boundary spoofs are fully sanitized. (#63885) 感谢 @eleqtrizit.
- Browser/security: apply SSRF navigation policy to subframe document navigations so iframe-targeted private-network hops are blocked without quarantining the parent page. (#64371) 感谢 @eleqtrizit.
- Hooks/security: mark agent hook system events as untrusted and sanitize hook display names before cron metadata reuse. (#64372) 感谢 @eleqtrizit.
- Daemon/launchd: keep `openclaw gateway stop` persistent without uninstalling the macOS LaunchAgent, re-enable it on explicit restart or repair, and harden launchd label handling. (#64447) 感谢 @ngutman.
- Plugins/context engines: preserve `plugins.slots.contextEngine` through normalization and keep explicitly selected workspace context-engine plugins enabled, so loader diagnostics and plugin activation stop dropping that slot selection. (#64192) 感谢 @hclsys.
- Heartbeat: stop top-level `interval:` and `prompt:` fields outside the `tasks:` block from bleeding into the last parsed heartbeat task. (#64488) 感谢 @Rahulkumar070.
- Slack/plugin commands: include plugin-registered slash commands in Slack native command registration when Slack native commands are enabled. (#64578) 感谢 @rafaelreis-r.
- Agents/OpenAI replay: preserve malformed function-call arguments in stored assistant history, avoid double-encoding preserved raw strings on replay, and coerce replayed string args back to objects at Anthropic and Google provider boundaries. (#61956) 感谢 @100yenadmin.
- Heartbeat/config: accept and honor `agents.defaults.heartbeat.timeoutSeconds` and per-agent heartbeat timeout overrides for heartbeat agent turns. (#64491) 感谢 @cedillarack.
- CLI/devices: make implicit `openclaw devices approve` selection preview-only and require approving the exact request ID, preventing latest-request races during device pairing. (#64160) 感谢 @coygeek.
- Media/security: honor sender-scoped `toolsBySender` policy for outbound host-media reads so denied senders cannot trigger host file disclosure via attachment hydration. (#64459) 感谢 @eleqtrizit.
- Browser/security: reject strict-policy hostname navigation unless the hostname is an explicit allowlist exception or IP literal, and route CDP HTTP discovery through the pinned SSRF fetch path. (#64367) 感谢 @eleqtrizit.
- Models/vLLM: ignore empty `tool_calls` arrays from reasoning-model OpenAI-compatible replies, reset false `toolUse` stop reasons when no actual tool calls were parsed, and stop sending `tool_choice` unless tools are present so vLLM reasoning responses no longer hang indefinitely. (#61197, #61534) 感谢 @balajisiva.
- Heartbeat/scheduling: spread interval heartbeats across stable per-agent phases derived from gateway identity, so provider traffic is distributed more uniformly across the configured interval instead of clustering around startup-relative times. (#64560) 感谢 @odysseus0.
- Config/media: accept `tools.media.asyncCompletion.directSend` in strict config validation so gateways no longer reject the generated-schema-backed async media completion setting at startup. (#63618) 感谢 @qiziAI.
- Telegram/exec: preserve delayed exec completion routing for forum topics by pinning background exec completions to the topic where the run started even if the session route later drifts. (#64580) thanks @jalehman.
- Agents/locks: unregister the session write-lock `exit` cleanup handler during teardown so repeated lock lifecycle resets stop stacking process listeners in long-running gateway processes. (#65391) 感谢 @adminfedres and @vincentkoc.
- CLI/Claude: rename the trusted inbound metadata schema to `openclaw.inbound_meta.v2` so Claude CLI no longer trips Anthropic's blocked `openclaw.inbound_meta.v1` filter on channel-originated turns. (#65399) 感谢 @SzyMig and @vincentkoc.
- Agents/inbound metadata: strip NUL bytes from serialized inbound context blocks before they reach backend spawn args, so malformed message metadata cannot crash agent spawn with `ERR_INVALID_ARG_VALUE`. (#65389) 感谢 @adminfedres and @vincentkoc.
- iMessage: retry transient `watch.subscribe` startup failures before tearing down the monitor, so brief local transport stalls do not immediately bounce the channel. (#65393) 感谢 @vincentkoc.
- Status/session_status: move shared session status text into a neutral internal status module and keep the tool importing a local runtime shim, so built `session_status` no longer depends on reply command internals or a bundler-opaque runtime import. (#65807) 感谢 @dutifulbob.
- QQBot/security: replace raw `fetch()` in the image-size probe with SSRF-guarded `fetchRemoteMedia`, fix `resolveRepoRoot()` to walk up to `.git` instead of hardcoding two parent levels, and refresh the raw-fetch allowlist to match the corrected scan. (#63495) 感谢 @dims.
- WhatsApp/web: rewrite queued `creds.json` updates atomically so interrupted saves do not leave truncated login state behind. (#63577) thanks @OwenYWT

## 🚀 v2026.4.9 (2026年4月9日)

### ✨ 新增功能与改进

- Memory/dreaming: add a grounded REM backfill lane with historical `rem-harness --path`, diary commit/reset flows, cleaner durable-fact extraction, and live short-term promotion integration so old daily notes can replay into Dreams and durable memory without a second memory stack. 感谢 @mbelinky.
- Control UI/dreaming: add a structured diary view with timeline navigation, backfill/reset controls, traceable dreaming summaries, and a grounded Scene lane with promotion hints plus a safe clear-grounded action for staged backfill signals. (#63395) 感谢 @mbelinky.
- QA/lab: add character-vibes evaluation reports with model selection and parallel runs so live QA can compare candidate behavior faster.
- Plugins/provider-auth: let provider manifests declare `providerAuthAliases` so provider variants can share env vars, auth profiles, config-backed auth, and API-key onboarding choices without core-specific wiring.
- iOS: pin release versioning to an explicit CalVer in `apps/ios/version.json`, keep TestFlight iteration on the same short version until maintainers intentionally promote the next gateway version, and add the documented `pnpm ios:version:pin -- --from-gateway` workflow for release trains. (#63001) 感谢 @ngutman.
- Tools/video_generate: extend the tool and the Plugin SDK with `providerOptions` (vendor-specific options forwarded as a JSON object), `inputAudios` / `audioRef` / `audioRefs` reference audio inputs, per-asset semantic role hints (`imageRoles` / `videoRoles` / `audioRoles`) using a typed `VideoGenerationAssetRole` union, a new `"adaptive"` aspect-ratio sentinel, and `maxInputAudios` provider capability declarations. Providers opt into `providerOptions` by declaring a typed `capabilities.providerOptions` schema (`{ seed: "number", draft: "boolean", ... }`); unknown keys and type mismatches cause the runtime fallback loop to skip the candidate with a visible warning and an `attempts` entry, so vendor-specific options never silently reach the wrong provider. Also raises the in-tool image input cap to 9 and updates the docs table to list all new parameters. (#61987) 感谢 @xieyongliang.

### 🐛 问题修复

- Browser/security: re-run blocked-destination safety checks after interaction-driven main-frame navigations from click, evaluate, hook-triggered click, and batched action flows, so browser interactions cannot bypass the SSRF quarantine when they land on forbidden URLs. (#63226) 感谢 @eleqtrizit.
- Security/dotenv: block runtime-control env vars plus browser-control override and skip-server env vars from untrusted workspace `.env` files, and reject unsafe URL-style browser control override specifiers before lazy loading. (#62660, #62663) 感谢 @eleqtrizit.
- Gateway/node exec events: mark remote node `exec.started`, `exec.finished`, and `exec.denied` summaries as untrusted system events and sanitize node-provided command/output/reason text before enqueueing them, so remote node output cannot inject trusted `System:` content into later turns. (#62659) 感谢 @eleqtrizit.
- Plugins/onboarding auth choices: prevent untrusted workspace plugins from colliding with bundled provider auth-choice ids during non-interactive onboarding, so bundled provider setup keeps operator secrets out of untrusted workspace plugin handlers unless those plugins are explicitly trusted. (#62368) 感谢 @pgondhi987.
- Security/dependency audit: force `basic-ftp` to `5.2.1` for the CRLF command-injection fix and bump Hono plus `@hono/node-server` in production resolution paths.
- Android/pairing: clear stale setup-code auth on new QR scans, bootstrap operator and node sessions from fresh pairing, prefer stored device tokens after bootstrap handoff, and pause pairing auto-retry while the app is backgrounded so scan-once Android pairing recovers reliably again. (#63199) 感谢 @obviyus.
- Matrix/gateway: wait for Matrix sync readiness before marking startup successful, keep Matrix background handler failures contained, and route fatal Matrix sync stops through channel-level restart handling instead of crashing the whole gateway. (#62779) 感谢 @gumadeiras.
- Slack/media: preserve bearer auth across same-origin `files.slack.com` redirects while still stripping it on cross-origin Slack CDN hops, so `url_private_download` image attachments load again. (#62960) 感谢 @vincentkoc.
- Reply/doctor: use the active runtime snapshot for queued reply runs, resolve reply-run SecretRefs before preflight helpers touch config, surface gateway OAuth reauth failures to users, and make `openclaw doctor` call out exact reauth commands. (#62693, #63217) 感谢 @mbelinky.
- Control UI: guard stale session-history reloads during fast session switches so the selected session and rendered transcript stay in sync. (#62975) 感谢 @scoootscooob.
- Gateway/chat: suppress exact and streamed `ANNOUNCE_SKIP` / `REPLY_SKIP` control replies across live chat updates and history sanitization so internal agent-to-agent control tokens no longer leak into user-facing gateway chat surfaces. (#51739) 感谢 @Pinghuachiu.
- Auto-reply/NO_REPLY: strip glued leading `NO_REPLY` tokens before reply normalization and ACP-visible streaming so silent sentinel text no longer leaks into user-visible replies while preserving substantive `NO_REPLY ...` text. 感谢 @frankekn.
- Sessions/routing: preserve established external routes on inter-session announce traffic so `sessions_send` follow-ups do not steal delivery from Telegram, Discord, or other external channels. (#58013) 感谢 @duqaXxX.
- Gateway/sessions: clear auto-fallback-pinned model overrides on `/reset` and `/new` while still preserving explicit user model selections, including legacy sessions created before override-source tracking existed. (#63155) 感谢 @frankekn.
- Slack/ACP: treat Slack ACP block replies as visible delivered output so OpenClaw stops re-sending the final fallback text after Slack already rendered the reply. (#62858) 感谢 @gumadeiras.
- Slack/partial streaming: key turn-local dedupe by dispatch kind and keep the final fallback reply path active when preview finalization fails so stale preview text cannot suppress the actual final answer. (#62859) 感谢 @gumadeiras.
- Matrix/doctor: migrate legacy `channels.matrix.dm.policy: "trusted"` configs back to compatible DM policies during `openclaw doctor --fix`, preserving explicit `allowFrom` boundaries as `allowlist` and defaulting empty legacy configs to `pairing`. (#62942) 感谢 @lukeboyett.
- npm packaging: mirror bundled channel runtime deps, stage Nostr runtime deps, derive required root mirrors from manifests and built chunks, and test packed release tarballs without repo `node_modules` so fresh installs fail fast on missing plugin deps instead of crashing at runtime. (#63065) 感谢 @scoootscooob.
- QA/live auth: fail fast when live QA scenarios hit classified auth or runtime failure replies, including raw scenario wait paths, and sanitize missing-key guidance so gateway auth problems surface as actionable errors instead of timeouts. (#63333) 感谢 @shakkernerd.
- Providers/OpenAI: default missing reasoning effort to `high` on OpenAI Responses, WebSocket, and compatible completions transports, while still honoring explicit per-run reasoning levels.
- Providers/Ollama: allow Ollama models using the native `api: "ollama"` path to optionally display thinking output when `/think` is set to a non-off level. (#62712) 感谢 @hoyyeva.
- Codex CLI: pass OpenClaw's system prompt through Codex's `model_instructions_file` config override so fresh Codex CLI sessions receive the same prompt guidance as Claude CLI sessions.
- Auth/profiles: persist explicit auth-profile upserts directly and skip external CLI sync for local writes so profile changes are saved without stale external credential state.
- Agents/timeouts: make the LLM idle timeout inherit `agents.defaults.timeoutSeconds` when configured, disable the unconfigured idle watchdog for cron runs, and point idle-timeout errors at `agents.defaults.llm.idleTimeoutSeconds`. 感谢 @drvoss.
- Agents/failover: classify Z.ai vendor code `1311` as billing and `1113` as auth, including long wrapped `1311` payloads, so these errors stop falling through to generic failover handling. (#49552) 感谢 @1bcMax.
- QQBot/media-tags: support HTML entity-encoded angle brackets (`&lt;`/`&gt;`), URL slashes in attributes, and self-closing media tags so upstream `<qqimg>` payloads are correctly parsed and normalized. (#60493) 感谢 @ylc0919.
- Memory/dreaming: harden grounded backfill inputs, diary writes, status payloads, and diary action classification by preserving source-day labels, rejecting missing or symlinked targets cleanly, normalizing diary headings in gateway backfills, and tightening claim splitting plus diary source metadata. 感谢 @mbelinky.
- Memory/dreaming: accept embedded heartbeat trigger tokens so light and REM dreaming still run when runtime wrappers include extra heartbeat text.
- Android/manual connect: allow blank port input only for TLS manual gateway endpoints so standard HTTPS Tailscale hosts default to `443` without silently changing cleartext manual connects. (#63134) 感谢 @Tyler-RNG.
- Windows/update: add heap headroom to Windows `pnpm build` steps during dev updates so update preflight builds stop failing on low default Node memory.
- Plugin SDK: export the channel plugin base and web-search config contract through the public package so plugins can use them without private imports.
- Plugins/contracts: keep test-only helpers out of production contract barrels, load shared contract harnesses through bundled test surfaces, and harden guardrails so indirect re-exports and canonical `*.test.ts` files stay blocked. (#63311) 感谢 @altaywtf.
- Control UI/models: preserve provider-qualified refs for OpenRouter catalog models whose ids already contain slashes so picker selections submit allowlist-compatible model refs instead of dropping the `openrouter/` prefix. (#63416) 感谢 @sallyom.
- Plugin SDK/command auth: split command status builders onto the lightweight `openclaw/plugin-sdk/command-status` subpath while preserving deprecated `command-auth` compatibility exports, so auth-only plugin imports no longer pull status/context warmup into CLI onboarding paths. (#63174) 感谢 @hxy91819.
- Wizard/plugin config: coerce integer-typed plugin config fields from interactive text input so integer schema values persist as numbers instead of failing validation. (#63346) 感谢 @jalehman.
- npm packaging: derive required root runtime mirrors from bundled plugin manifests and built root chunks, then install packed release tarballs without the repo `node_modules` so release checks catch missing plugin deps before publish.

## 🚀 v2026.4.8 (2026年4月8日)

### 🐛 问题修复

- Telegram/setup: load setup and secret contracts through packaged top-level sidecars so installed npm builds no longer try to import missing `dist/extensions/telegram/src/*` files during gateway startup.
- Bundled channels/setup: load shared secret contracts through packaged top-level sidecars across BlueBubbles, Feishu, Google Chat, IRC, Matrix, Mattermost, Microsoft Teams, Nextcloud Talk, Slack, and Zalo so installed npm builds no longer rely on missing `dist/extensions/*/src/*` files during gateway startup.
- Bundled plugins: align packaged plugin compatibility metadata with the release version so bundled channels and providers load on OpenClaw 2026.4.8.
- Agents/progress: keep `update_plan` available for OpenAI-family runs while returning compact success payloads and allowing `tools.experimental.planTool=false` to opt out.
- Agents/exec: keep `/exec` current-default reporting aligned with real runtime behavior so `host=auto` sessions surface the correct host-aware fallback policy (`full/off` on gateway or node, `deny/off` on sandbox) instead of stale stricter defaults.
- Slack: honor ambient HTTP(S) proxy settings for Socket Mode WebSocket connections, including NO_PROXY exclusions, so proxy-only deployments can connect without a monkey patch. (#62878) 感谢 @mjamiv.
- Slack/actions: pass the already resolved read token into `downloadFile` so SecretRef-backed bot tokens no longer fail after a raw config re-read. (#62097) 感谢 @martingarramon.
- Network/fetch guard: skip target DNS pinning when trusted env-proxy mode is active so proxy-only sandboxes can let the trusted proxy resolve outbound hosts. (#59007) 感谢 @cluster2600.

## 🚀 v2026.4.7-1 (2026年4月7日)

## 🚀 v2026.4.7 (2026年4月7日)

### ✨ 新增功能与改进

- CLI/infer: add a first-class `openclaw infer ...` hub for provider-backed inference workflows across model, media, web, and embedding tasks. 感谢 @Takhoffman.
- Tools/media generation: auto-fallback across auth-backed image, music, and video providers by default, preserve intent during provider switches, remap size/aspect/resolution/duration hints to the closest supported option, and surface provider capabilities plus mode-aware video-to-video support.
- Memory/wiki: restore the bundled `memory-wiki` stack with plugin, CLI, sync/query/apply tooling, memory-host integration, structured claim/evidence fields, compiled digest retrieval, claim-health linting, contradiction clustering, staleness dashboards, and freshness-weighted search. 感谢 @vincentkoc.
- Plugins/webhooks: add a bundled webhook ingress plugin so external automation can create and drive bound TaskFlows through per-route shared-secret endpoints. (#61892) 感谢 @mbelinky.
- Gateway/sessions: add persisted compaction checkpoints plus Sessions UI branch/restore actions so operators can inspect and recover pre-compaction session state. (#62146) 感谢 @scoootscooob.
- Compaction: add pluggable compaction provider registry so plugins can replace the built-in summarization pipeline. Configure via `agents.defaults.compaction.provider`; falls back to LLM summarization on provider failure. (#56224) 感谢 @DhruvBhatia0.
- Agents/system prompt: add `agents.defaults.systemPromptOverride` for controlled prompt experiments plus heartbeat prompt-section controls so heartbeat runtime behavior can stay enabled without injecting heartbeat instructions every turn.
- Providers/Google: add Gemma 4 model support and keep Google fallback resolution on the requested provider path so native Google Gemma routes work again. (#61507) 感谢 @eyjohn.
- Providers/Google: preserve explicit thinking-off semantics for Gemma 4 while still enabling Gemma reasoning support in compatibility wrappers. (#62127) 感谢 @romgenie.
- Providers/Arcee AI: add a bundled Arcee AI provider plugin with Trinity catalog entries, OpenRouter support, and updated onboarding/auth guidance. (#62068) 感谢 @arthurbr11.
- Providers/Anthropic: restore Claude CLI as the preferred local Anthropic path in onboarding, model-auth guidance, doctor flows, and Docker Claude CLI live lanes again.
- Providers/Ollama: detect vision capability from the `/api/show` response and set image input on models that support it so Ollama vision models accept image attachments. (#62193) 感谢 @BruceMacD.
- Memory/dreaming: ingest redacted session transcripts into the dreaming corpus with per-day session-corpus notes, cursor checkpointing, and promotion/doctor support. (#62227) 感谢 @vignesh07.
- Providers/inferrs: add string-content compatibility for stricter OpenAI-compatible chat backends, document `inferrs` setup with a full config example, and add troubleshooting guidance for local backends that pass direct probes but fail on full agent-runtime prompts.
- Agents/context engine: expose prompt-cache runtime context to context engines and keep current-turn prompt-cache usage aligned with the active attempt instead of stale prior-turn assistant state. (#62179) 感谢 @jalehman.
- Plugin SDK/context engines: pass `availableTools` and `citationsMode` into `assemble()`, and expose memory-artifact and memory-prompt seams so companion plugins and non-legacy context engines can consume active memory state without reaching into internals. 感谢 @vincentkoc.
- ACP/ACPX plugin: bump the bundled `acpx` pin to `0.5.1` so plugin-local installs and strict version checks pick up the latest published runtime release. (#62148) 感谢 @onutc.
- Discord/events: allow `event-create` to accept a cover image URL or local file path, load and validate PNG/JPG/GIF event cover media, and pass the encoded image payload through Discord admin action/runtime paths. (#60883) 感谢 @bittoby.
- Plugins/provider-auth: expose runtime-ready provider auth through `openclaw/plugin-sdk/provider-auth-runtime` so native plugins and context engines can resolve request-ready credentials after provider-owned runtime exchanges like GitHub Copilot device-token-to-bearer flows. (#62753) 感谢 @jalehman.

### 🐛 问题修复

- CLI/infer: keep provider-backed infer behavior aligned with actual runtime execution by fixing explicit TTS override handling, profile-aware gateway TTS prefs resolution, per-request transcription `prompt`/`language` overrides, image output MIME/extension mismatches, configured web-search fallback behavior, and agent-vs-CLI web-search execution drift.
- Plugins/media: when `plugins.allow` is set, capability fallback now merges bundled capability plugin ids into the allowlist (not only `plugins.entries`), so media understanding providers such as OpenAI-compatible STT load for voice transcription without requiring `openai` in `plugins.allow`. (#62205) 感谢 @neeravmakwana.
- Agents/history and replies: buffer phaseless OpenAI WS text until a real assistant phase arrives, keep replay and SSE history sequence tracking aligned, hide commentary and leaked tool XML from user-visible history, and keep history-based follow-up replies on `final_answer` text only. (#61729, #61747, #61829, #61855, #61954) 感谢 @100yenadmin and contributors.
- Control UI: show `/tts` audio replies in webchat, detect mistaken `?token=` auth links with the correct `#token=` hint, and keep Copy, Canvas, and mobile exec-approval UI from covering chat content on narrow screens. (#54842, #61514, #61598) 感谢 @neeravmakwana.
- iOS/gateway: replace string-matched connection error UI with structured gateway connection problems, preserve actionable pairing/auth failures over later generic disconnect noise, and surface reusable problem banners and details across onboarding, settings, and root status surfaces. (#62650) 感谢 @ngutman.
- TUI: route `/status` through the shared session-status command, keep commentary hidden in history, strip raw envelope metadata from async command notices, preserve fallback streaming before per-attempt failures finalize, and restore Kitty keyboard state on exit or fatal crashes. (#49130, #59985, #60043, #61463) 感谢 @biefan and contributors.
- iOS/Watch exec approvals: keep Apple Watch review and approval recovery working while the iPhone is locked or backgrounded, including reconnect recovery, pending approval persistence, notification cleanup, and APNs-backed watch refresh recovery. (#61757) 感谢 @ngutman.
- Agents/context overflow: combine oversized and aggregate tool-result recovery in one pass and restore a total-context overflow backstop so recoverable sessions retry instead of failing early. (#61651) 感谢 @Takhoffman.
- Auth/OpenAI Codex OAuth: reload fresh on-disk credentials inside the locked refresh path and retry once after `refresh_token_reused` rotates only the stored refresh token, so relogin/restart recovery stops getting stuck on stale cached auth state. 感谢 @owen-ever.
- Auth/OpenAI Codex OAuth: keep native `/model ...@profile` selections on the target session and honor explicit user-locked auth profiles even when per-agent auth order excludes them. (#62744) 感谢 @jalehman.
- Providers/Anthropic: preserve thinking blocks for Claude Opus 4.5+, Sonnet 4.5+, and newer Claude 4-family models so prompt-cache prefixes keep matching, and skip `service_tier` injection on OAuth-authenticated stream wrapper requests so Claude OAuth streaming stops failing with HTTP 401. (#60356, #61793)
- Agents/Claude CLI: surface nested API error messages from structured CLI output so billing/auth/provider failures show the real provider error instead of an opaque CLI failure.
- Agents/exec: preserve explicit `host=node` routing under elevated defaults when `tools.exec.host=auto`, fail loud on invalid elevated cross-host overrides, and keep `strictInlineEval` commands blocked after approval timeouts instead of falling through to automatic execution. (#61739) 感谢 @obviyus.
- Nodes/exec approvals: keep `host=node` POSIX transport shell wrappers (`/bin/sh -lc ...`) aligned with inner-command allowlist analysis so allowlisted scripts stop prompting unnecessarily, while Windows `cmd.exe` wrapper runs stay approval-gated. (#62401) 感谢 @ngutman.
- Nodes/exec approvals: keep Windows `cmd.exe /c` wrapper runs approval-gated even when `env` carriers, including env-assignment carriers, wrap the shell invocation. (#62439) 感谢 @ngutman.
- Gateway tool/exec config: block model-facing `gateway config.apply` and `config.patch` writes from changing exec approval paths such as `safeBins`, `safeBinProfiles`, `safeBinTrustedDirs`, and `strictInlineEval`, while still allowing unchanged structured values through. (#62001) 感谢 @eleqtrizit.
- Host exec/env sanitization: block dangerous Java, Rust, Cargo, Git, Kubernetes, cloud credential, config-path, and Helm env overrides so host-run tools cannot be redirected to attacker-chosen code, config, credentials, or repository state. (#59119, #62002, #62291) 感谢 @eleqtrizit and contributors.
- Commands/allowlist: require owner authorization for `/allowlist add` and `/allowlist remove` before channel resolution, so non-owner but command-authorized senders can no longer persistently rewrite allowlist policy state. (#62383) 感谢 @pgondhi987.
- Feishu/docx uploads: honor `tools.fs.workspaceOnly` for local `upload_file` and `upload_image` paths by forwarding workspace-constrained `localRoots` into the media loader, so docx uploads can no longer read host-local files outside the workspace when workspace-only mode is active. (#62369) 感谢 @pgondhi987.
- Network/fetch guard: drop request bodies and body-describing headers on cross-origin `307` and `308` redirects by default, so attacker-controlled redirect hops cannot receive secret-bearing POST payloads from SSRF-guarded fetch flows unless a caller explicitly opts in. (#62357) 感谢 @pgondhi987.
- Browser/SSRF: treat main-frame `document` redirect hops as navigations even when Playwright does not flag them as `isNavigationRequest()`, so strict private-network blocking still stops forbidden redirect pivots before the browser reaches the internal target. (#62355) 感谢 @pgondhi987.
- Browser/node invoke: block persistent browser profile create, reset, and delete mutations through `browser.proxy` on both gateway-forwarded `node.invoke` and the node-host proxy path, even when no profile allowlist is configured.（#60489）
- Gateway/node pairing: require a fresh pairing request when a previously paired node reconnects with additional declared commands, and keep the live session pinned to the earlier approved command set until the upgrade is approved. (#62658) 感谢 @eleqtrizit.
- Gateway/auth: invalidate existing shared-token and password WebSocket sessions when the configured secret rotates, so stale authenticated sockets cannot stay attached after token or password changes. (#62350) 感谢 @pgondhi987.
- MS Teams/security: validate file-consent upload URLs against HTTPS, Microsoft/SharePoint host allowlists, and private-IP DNS checks before uploading attachments, blocking SSRF-style consent-upload abuse.（#23596）
- Media/base64 decode guards: enforce byte limits before decoding missed base64-backed Teams, Signal, QQ Bot, and image-tool payloads so oversized inbound media and data URLs no longer bypass pre-decode size checks. (#62007) 感谢 @eleqtrizit.
- Runtime event trust: mark background `notifyOnExit` summaries, ACP parent-stream relays, and wake-hook payloads as untrusted system events so lower-trust runtime output no longer re-enters later turns as trusted `System:` text.（#62003）
- Auto-reply/media: allow managed generated-media `MEDIA:` paths from normal reply text again while still blocking arbitrary host-local media and document paths, so generated media keep delivering without reopening host-path injection holes.
- Gateway/status and containers: auto-bind to `0.0.0.0` inside Docker and Podman environments, and probe local TLS gateways over `wss://` with self-signed fingerprint forwarding so container startup and loopback TLS status checks work again. (#61818, #61935) 感谢 @openperf and contributors.
- Gateway/OpenAI-compatible HTTP: abort in-flight `/v1/chat/completions` and `/v1/responses` turns when clients disconnect so abandoned HTTP requests stop wasting agent runtime. (#54388) 感谢 @Lellansin.
- macOS/gateway version: strip trailing commit metadata from CLI version output before semver parsing so the Mac app recognizes installed gateway versions like `OpenClaw 2026.4.2 (d74a122)` again. (#61111) 感谢 @oliviareid-svg.
- Sessions/model selection: resolve the explicitly selected session model separately from runtime fallback resolution so session status and live model switching stay aligned with the chosen model.
- Discord/ACP bindings: canonicalize DM conversation identity across inbound messages, component interactions, native commands, and current-conversation binding resolution so `--bind here` in Discord DMs keeps routing follow-up replies to the bound agent instead of falling back to the default agent.
- Discord: recover forwarded referenced message text and attachments when snapshots are missing, use `ws://` again for gateway monitor sockets, stop forcing a hardcoded temperature for Codex-backed auto-thread titles, and harden voice receive recovery so rapid speaker restarts keep their next utterance. (#41536, #61670) 感谢 @artwalker and contributors.
- Slack/thread mentions: add `channels.slack.thread.requireExplicitMention` so Slack channels that already require mentions can also require explicit `@bot` mentions inside bot-participated threads. (#58276) 感谢 @praktika-engineer.
- Slack/threading: keep legacy thread stickiness for real replies when older callers omit `isThreadReply`, while still honoring `replyToMode` for Slack's auto-created top-level `thread_ts`. (#61835) 感谢 @kaonash.
- Slack/media: keep attachment downloads on the SSRF-guarded dispatcher path so Slack media fetching works on Node 22 without dropping pinned transport enforcement. (#62239) 感谢 @openperf.
- Matrix/onboarding: add an invite auto-join setup step with explicit off warnings and strict stable-target validation so new Matrix accounts stop silently ignoring invited rooms and fresh DM-style invites unless operators opt in. (#62168) 感谢 @gumadeiras.
- Matrix/formatting: preserve multi-paragraph and loose-list rendering in Element so numbered and bulleted Markdown keeps their content attached to the correct list item. (#60997) 感谢 @gucasbrg.
- Telegram/doctor: keep top-level access-control fallback in place during multi-account normalization while still promoting legacy default auth into `accounts.default`, so existing named bots keep inherited allowlists without dropping the legacy default bot. (#62263) 感谢 @obviyus.
- Plugins/loaders: centralize bundled `dist/**` Jiti native-load policy and keep channel, public-surface, facade, and config-metadata loader seams off native Jiti on Windows so onboarding and configure flows stop tripping `ERR_UNSUPPORTED_ESM_URL_SCHEME`. (#62286) 感谢 @chen-zhang-cs-code.
- Plugins/channels: keep bundled channel artifact and secret-contract loading stable under lazy loading, preserve plugin-schema defaults during install, and fix Windows `file://` plus native-Jiti plugin loader paths so onboarding, doctor, `openclaw secret`, and bundled plugin installs work again. (#61832, #61836, #61853, #61856) 感谢 @Zeesejo and contributors.
- Plugins/ClawHub: verify downloaded plugin archives against version metadata SHA-256, fail closed when archive integrity metadata is missing or malformed, and tighten fallback ZIP verification so plugin installs cannot proceed on mismatched or incomplete ClawHub package metadata. (#60517) 感谢 @mappel-nv.
- Plugins/provider hooks: stop recursive provider snapshot loads from overflowing the stack during plugin initialization, while still preserving cached nested provider-hook results. (#61922, #61938, #61946, #61951)
- Docker/plugins: stop forcing bundled plugin discovery to `/app/extensions` in runtime images so packaged installs use compiled `dist/extensions` artifacts again and Node 24 containers do not boot through source-only plugin entry paths. Fixes #62044. (#62316) 感谢 @gumadeiras.
- Providers/Ollama: honor the selected provider's `baseUrl` during streaming so multi-Ollama setups stop routing every stream to the first configured Ollama endpoint.（#61678）
- Providers/Ollama: stop warning that Ollama could not be reached when discovery only sees empty default local stubs, while still keeping real explicit Ollama overrides loud when the endpoint is unreachable.
- Providers/xAI: recognize `api.grok.x.ai` as an xAI-native endpoint again and keep legacy `x_search` auth resolution working so older xAI web-search configs continue to load. (#61377) 感谢 @jjjojoj.
- Providers/Mistral: send `reasoning_effort` for `mistral/mistral-small-latest` (Mistral Small 4) with thinking-level mapping, and mark the catalog entry as reasoning-capable so adjustable reasoning matches Mistral’s Chat Completions API. (#62162) 感谢 @neeravmakwana.
- OpenAI TTS/Groq: send `wav` to Groq-compatible speech endpoints, honor explicit `responseFormat` overrides on OpenAI-compatible paths, and only mark voice-note output as voice-compatible when the actual format is `opus`. (#62233) 感谢 @neeravmakwana.
- Tools/web_fetch and web_search: fix `TypeError: fetch failed` caused by undici 8.0 enabling HTTP/2 by default; pinned SSRF-guard dispatchers now explicitly set `allowH2: false` to restore HTTP/1.1 behavior and keep the custom DNS-pinning lookup compatible. (#61738, #61777) 感谢 @zozo123.
- Tools/web search/Exa: show Exa Search in onboarding and configure provider pickers again by marking the bundled Exa provider as setup-visible. 感谢 @vincentkoc.
- Memory/vector recall: surface explicit warnings when `sqlite-vec` is unavailable or vector writes are degraded, and strip managed Light Sleep and REM blocks before daily-note ingestion so memory indexing and dreaming stop reporting false-success or re-ingesting staged output. (#61720) 感谢 @MonkeyLeeT.
- Memory/dreaming: make Dreams config reads and writes respect the selected memory slot plugin instead of always targeting `memory-core`. (#62275) 感谢 @SnowSky1.
- QQ Bot/media: route gateway-side attachment and fallback downloads through guarded QQ/Tencent HTTPS fetches so QQ media handling no longer follows arbitrary remote hosts.
- Browser/remote CDP: retry the DevTools websocket once after remote browser restarts so healthy remote browser profiles do not fail availability checks during CDP warm-up. (#57397) 感谢 @ThanhNguyxn07.
- UI/light mode: target both root and nested WebKit scrollbar thumbs in the light theme so page-level and container scrollbars stay visible on light backgrounds. (#61753) 感谢 @chziyue.
- Agents/subagents: honor `sessions_spawn(lightContext: true)` for spawned subagent runs by preserving lightweight bootstrap context through the gateway and embedded runner instead of silently falling back to full workspace bootstrap injection. (#62264) 感谢 @theSamPadilla.
- Cron: load `jobId` into `id` when the on-disk store omits `id`, matching doctor migration and fixing `unknown cron job id` for hand-edited `jobs.json`. (#62246) 感谢 @neeravmakwana.
- Agents/model fallback: classify minimal HTTP 404 API errors (for example `404 status code (no body)`) as `model_not_found` so assistant failures throw into the fallback chain instead of stopping at the first fallback candidate. (#62119) 感谢 @neeravmakwana.
- BlueBubbles/network: respect explicit private-network opt-out for loopback and private `serverUrl` values across account resolution, status probes, monitor startup, and attachment downloads, while keeping public-host attachment hostname pinning intact. (#59373) 感谢 @jpreagan.
- Agents/heartbeat: keep heartbeat runs pinned to the main session so active subagent transcripts are not overwritten by heartbeat status messages. (#61803) 感谢 @100yenadmin.
- Agents/heartbeat: respect disabled heartbeat prompt guidance so operators can suppress heartbeat prompt instructions without disabling heartbeat runtime behavior.
- Agents/compaction: stop compaction-wait aborts from re-entering prompt failover and replaying completed tool turns. (#62600) 感谢 @i-dentifier.
- Approvals/runtime: move native approval lifecycle assembly into shared core bootstrap/runtime seams driven by channel capabilities and runtime contexts, and remove the legacy bundled approval fallback wiring. (#62135) 感谢 @gumadeiras.
- Security/fetch-guard: stop rejecting operator-configured proxy hostnames against the target-scoped hostname allowlist in SSRF-guarded fetches, restoring proxy-based media downloads for Telegram and other channels. (#62312) 感谢 @ademczuk.
- Logging: make `logging.level` and `logging.consoleLevel` honor the documented severity threshold ordering again, and keep child loggers inheriting the parent `minLevel`. (#44646) 感谢 @zhumengzhu.
- Agents/sessions_send: pass `threadId` through announce delivery so cross-session notifications land in the correct Telegram forum topic instead of the group's general thread. (#62758) 感谢 @jalehman.
- Daemon/systemd: keep sudo systemctl calls scoped to the invoking user when machine-scoped systemctl fails, while still avoiding machine fallback for permission-denied user bus errors. (#62337) 感谢 @Aftabbs.
- Docs/i18n: relocalize final localized-page links after translation and remove the zh-CN homepage redirect override so localized Mintlify pages resolve to the correct language roots again. (#61796) 感谢 @hxy91819.
- Agents/exec: keep timed-out shell-backgrounded commands on the failed path and point long-running jobs to exec background/yield sessions so process polling is only suggested for registered sessions.
- Agents/model resolution: let explicit `openai-codex/gpt-5.4` selection prefer provider runtime metadata when it reports a larger context window, keeping configured Codex runs aligned with the live provider limits. (#62694) 感谢 @ruclaw7.
- Agents/model resolution: keep explicit-model runtime comparisons on the configured workspace plugin registry, so workspace-installed providers do not silently fall back to stale explicit metadata during runtime model lookup.
- Providers/Z.AI: default onboarding and endpoint detection to GLM-5.1 instead of GLM-5. (#61998) 感谢 @serg0x.
- Cron/isolated: resolve auth profiles without treating every isolated run as a brand-new auth session, so profile-based providers (for example OpenRouter) keep a stable credential choice instead of rotating or ignoring stored keys. (#62783) 感谢 @neeravmakwana.
- CLI/tasks: `openclaw tasks cancel` now records operator cancellation for CLI runtime tasks instead of returning "Task runtime does not support cancellation yet", so stuck `running` CLI tasks can be cleared. (#62419) 感谢 @neeravmakwana.
- Sessions/context: resolve context window limits using the active provider plus model (not bare model id alone) when persisting session usage, applying inline directives, and sizing memory-flush / preflight compaction thresholds, so duplicate model ids across providers no longer leak the wrong `contextTokens` into the session store or `/status`. (#62472) 感谢 @neeravmakwana.
- Channels/setup: exclude workspace shadow entries from channel setup catalog lookups and align trust checks with auto-enable so workspace-scoped overrides no longer bypass the trusted catalog. (`GHSA-82qx-6vj7-p8m2`) 感谢 @zsxsoft.
- Reply execution: prefer the active runtime snapshot over stale queued reply config during embedded reply and follow-up execution so SecretRef-backed reply turns stop crashing after secrets have already resolved. (#62693) 感谢 @mbelinky.
- Android/manual connect: allow blank port input only for TLS manual gateway endpoints so standard HTTPS Tailscale hosts default to `443` without silently changing cleartext manual connects. (#63134) 感谢 @Tyler-RNG.
- Matrix/agents: hide owner-only `set-profile` from embedded agent channel-action discovery so non-owner runs stop advertising profile updates they cannot execute. (#62662) 感谢 @eleqtrizit.
- iOS/gateway: replace string-matched connection error UI with structured gateway connection problems, preserve actionable pairing/auth failures over later generic disconnect noise, and surface reusable problem banners and details across onboarding, settings, and root status surfaces. (#62650) 感谢 @ngutman.
- Git/env sanitization: block additional Git repository-plumbing env variables such as `GIT_DIR`, `GIT_WORK_TREE`, `GIT_COMMON_DIR`, `GIT_INDEX_FILE`, `GIT_OBJECT_DIRECTORY`, `GIT_ALTERNATE_OBJECT_DIRECTORIES`, and `GIT_NAMESPACE` so host-run Git commands cannot be redirected to attacker-chosen repository state through inherited or request-scoped env. (#62002) 感谢 @eleqtrizit.
- Host exec/env sanitization: block additional request-scoped credential and config-path overrides such as `KUBECONFIG`, cloud credential-path env, `CARGO_HOME`, and `HELM_HOME` so host-run tools can no longer be redirected to attacker-chosen config or state. (#59119) 感谢 @eleqtrizit.


---

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
