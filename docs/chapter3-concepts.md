# 第3章：核心概念与架构

> 🎯 本章目标：深入理解 OpenClaw 的核心概念和内部架构，了解 Agent、Tool、Workflow 是如何协同工作的。

上一章我们成功跑通了第一个 Hello World，是不是很有成就感？但那个例子太简单了——你可能好奇它背后到底发生了什么。

在这一章里，我们要"解剖"OpenClaw，看看它是怎么工作的。就像学做菜，不仅要会炒，还要知道火候、调料的原理。这样你才能真正掌握它，甚至根据需要定制它。

准备好了吗？让我们开始探索！🔍

---

## 3.1 宏观视角：OpenClaw 的整体架构

在深入细节之前，我们先从高处俯瞰 OpenClaw 的整体架构。

### 3.1.1 架构图一览

```
┌─────────────────────────────────────────────────────────────────┐
│                        OpenClaw 架构图                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐  │
│  │   渠道层      │     │   核心引擎    │     │   工具层      │  │
│  │  (Channels)  │────▶│   (Core)     │────▶│  (Tools)     │  │
│  │              │     │              │     │              │  │
│  │  • 飞书      │     │  • Agent     │     │  • 天气      │  │
│  │  • 企业微信  │     │  • Memory    │     │  • 搜索      │  │
│  │  • 钉钉      │     │  • Workflow  │     │  • 浏览器    │  │
│  │  • Web UI   │     │  • LLM       │     │  • 文件操作  │  │
│  │  • CLI      │     │              │     │  • 数据库    │  │
│  └──────────────┘     └──────────────┘     └──────────────┘  │
│         │                    │                    │           │
│         ▼                    ▼                    ▼           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     基础设施层 (Infrastructure)           │  │
│  │   • 日志 (Logging)  • 监控 (Monitoring)  • 安全 (Security)│  │
│  │   • 配置管理 (Config)  • 插件系统 (Plugins)               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.1.2 各层职责

#### 渠道层（Channels）
这是 OpenClaw 与外部世界"对话"的入口。不同的渠道有不同的协议和特性：

- **飞书/企业微信/钉钉**：企业即时通讯，消息需要通过特定 API 处理
- **Web UI**：网页聊天界面，HTTP/WebSocket 协议
- **CLI**：命令行交互，适合调试和开发
- **电话/语音**：需要额外的语音处理模块

#### 核心引擎（Core）
这是 OpenClaw 的"大脑"，包含：

- **Agent**：智能体，负责理解用户意图、规划任务、生成回复
- **Memory**：记忆管理，让对话有上下文
- **Workflow**：工作流编排，处理复杂的多步骤任务
- **LLM**：大语言模型接口，负责任务理解和内容生成

#### 工具层（Tools）
这是 OpenClaw 的"手"和"脚"，让它能够执行真实操作：

- **内置工具**：天气、搜索、计算器等常用功能
- **自定义工具**：你根据自己的业务需求开发的工具
- **第三方工具**：通过 API 接入的外部服务

#### 基础设施层（Infrastructure）
支撑整个系统运行的底层能力：

- **日志**：记录系统运行状态，便于调试
- **监控**：追踪关键指标，保障服务稳定
- **安全**：认证、授权、数据加密
- **配置管理**：灵活的配置系统
- **插件机制**：扩展系统能力

### 3.1.3 数据流：一条消息的旅程

当你对 OpenClaw 说"帮我查一下北京明天天气"时，消息在系统里经历了什么？

```
用户 ──▶ 渠道层 ──▶ Agent ──▶ LLM ──▶ 工具调用 ──▶ 返回结果 ──▶ 用户
              │           │         │         │
              │           │         │         └── 1. 分析意图：查天气
              │           │         │         └── 2. 选择工具：get_weather
              │           │         │         └── 3. 调用工具：北京，明天
              │           │         │         └── 4. 获取结果：晴，15°C
              │           │
              │           └── 综合理解、生成回复
              │
              └── 接收消息、解析格式
```

让我们一步步详解：

1. **用户发送消息**：通过飞书/Web/CLI 渠道发送
2. **渠道层接收**：解析消息格式，提取文本内容
3. **Agent 接收输入**：将用户消息传递给 Agent
4. **LLM 理解意图**：分析用户想要什么，判断需要调用哪些工具
5. **工具调用**：执行天气查询 API
6. **结果返回**：工具返回结果给 Agent
7. **LLM 生成回复**：将工具结果组织成自然语言
8. **Agent 返回**：将回复发送给渠道层
9. **渠道层发送**：将消息发送回用户

---

## 3.2 Agent（智能体）：OpenClaw 的核心

Agent 是 OpenClaw 最核心的概念。你可以把它想象成一个"人"——有思考能力，能理解你的需求，会使用工具，还记得住上下文。

### 3.2.1 Agent 的定义

在 OpenClaw 中，Agent 是一个 Python 类：

```python
from openclaw import Agent

# 创建一个 Agent
agent = Agent(
    name="小浪助手",
    llm_config={
        "provider": "minimax",
        "model": "MiniMax-M2.5",
        "api_key": "your-api-key"
    },
    system_prompt="你是一个友好的AI助手，喜欢用轻松的语气回答问题。"
)
```

### 3.2.2 Agent 的内部结构

Agent 内部包含多个组件：

```python
class Agent:
    def __init__(self, name, llm_config, system_prompt):
        # 核心组件
        self.name = name
        self.llm = LLM(**llm_config)  # 大语言模型
        self.tools = []                # 可用工具列表
        self.memory = Memory()         # 记忆组件
        self.workflows = {}            # 工作流字典
        
        # 系统提示词
        self.system_prompt = system_prompt
        
    def chat(self, user_message):
        """处理用户消息"""
        # 1. 理解意图
        # 2. 规划任务
        # 3. 执行工具
        # 4. 生成回复
        pass
```

### 3.2.3 Agent 的工作流程

Agent 处理一条消息时，经历了以下步骤：

```python
def chat(self, user_message):
    # 步骤 1：添加到记忆
    self.memory.add_message("user", user_message)
    
    # 步骤 2：获取上下文
    context = self.memory.get_context()
    
    # 步骤 3：构建提示词
    prompt = self.build_prompt(user_message, context)
    
    # 步骤 4：LLM 决策
    decision = self.llm.decide(prompt)
    
    # 步骤 5：执行（可能是工具调用，也可能是直接回复）
    if decision.action == "tool_call":
        result = self.execute_tool(decision.tool_name, decision.tool_args)
        response = self.llm.generate_response(prompt, tool_result=result)
    else:
        response = decision.text
    
    # 步骤 6：添加到记忆
    self.memory.add_message("assistant", response)
    
    # 步骤 7：返回
    return response
```

### 3.2.4 Agent 的"思考"过程

LLM 是 Agent 的大脑，它如何决定下一步做什么？

```python
# LLM 收到的提示词（简化版）
prompt = """
你是一个AI助手。
可用工具：
- get_weather: 查询城市天气，参数：city (str)
- search: 搜索信息，参数：query (str)
- calculate: 计算数学表达式，参数：expression (str)

当前对话：
用户：帮我查一下北京明天天气

请决定：
1. 是否需要调用工具？
2. 如果需要，调用哪个工具？参数是什么？
3. 不需要工具的话，直接回复什么？
"""

# LLM 的回复可能是：
response = """
{
    "action": "tool_call",
    "tool": "get_weather",
    "args": {"city": "北京", "date": "明天"}
}
"""
```

LLM 会分析用户意图，选择最合适的工具，并确定参数。这就是 Agent 的"智能"所在。

---

## 3.3 Tool（工具）：Agent 的手和脚

如果说 Agent 是"大脑"，那 Tool 就是"手"和"脚"——让它能够执行真实操作。

### 3.3.1 工具的定义

在 OpenClaw 中，工具是一个带有装饰器的 Python 函数：

```python
from openclaw import tool

@tool(name="查询天气", description="获取指定城市的天气信息")
def get_weather(city: str, date: str = "今天") -> str:
    """
    查询城市天气
    
    参数:
        city: 城市名称，如"北京"、"上海"
        date: 日期，可选"今天"、"明天"、"后天"，默认"今天"
    
    返回:
        天气信息字符串
    """
    import requests
    
    # 调用天气 API
    url = f"https://wttr.in/{city}?format=j1"
    response = requests.get(url)
    data = response.json()
    
    current = data["current_condition"][0]
    return f"{city}当前天气：{current['temp_C']}°C，{current['weatherDesc'][0]['value']}"
```

### 3.3.2 工具的注册

定义好的工具需要注册到 Agent：

```python
# 方式 1：创建 Agent 时注册
agent = Agent(
    name="助手",
    tools=[get_weather]  # 传入工具列表
)

# 方式 2：动态注册
agent.register_tool(get_weather)
agent.register_tool(search)
agent.register_tool(calculate)
```

### 3.3.3 工具调用的完整流程

```
用户: "北京明天天气怎么样？"

                    ┌─────────────────┐
                    │      LLM        │
                    │                 │
                    │ 意图识别 + 工具选择 │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
    ┌─────────────────┐           ┌─────────────────┐
    │ 不需要工具      │           │ 需要工具        │
    │ 直接生成回复    │           │ 返回工具调用    │
    └─────────────────┘           └────────┬────────┘
                                            │
                                            ▼
                                   ┌─────────────────┐
                                   │  OpenClaw       │
                                   │  执行工具        │
                                   │  get_weather    │
                                   │  (city="北京",  │
                                   │   date="明天")  │
                                   └────────┬────────┘
                                            │
                                            ▼
                                   ┌─────────────────┐
                                   │  返回结果给 LLM │
                                   │  "晴，15-22°C"  │
                                   └────────┬────────┘
                                            │
                                            ▼
                                   ┌─────────────────┐
                                   │  LLM 生成自然语言│
                                   │  "北京明天晴    │
                                   │  最高温度22°C  │
                                   │  最低温度15°C"  │
                                   └─────────────────┘
```

### 3.3.4 内置工具一览

OpenClaw 提供了丰富的内置工具：

| 工具名称 | 功能 | 示例 |
|----------|------|------|
| `get_weather` | 查询天气 | `get_weather(city="北京")` |
| `search_web` | 网页搜索 | `search_web(query="Python教程")` |
| `read_file` | 读取文件 | `read_file(path="/data/test.txt")` |
| `write_file` | 写入文件 | `write_file(path="/data/log.txt", content="...")` |
| `browser` | 浏览器自动化 | `browser.goto("https://baidu.com")` |
| `send_email` | 发送邮件 | `send_email(to="test@example.com", subject="...", body="...")` |

---

## 3.4 Memory（记忆）：让对话有上下文

你有没有遇到过这种情况：问 AI 一个问题，它回答了；然后你追问一句，它却忘了你之前问的是什么？

这就是因为缺乏"记忆"机制。OpenClaw 的 Memory 组件让 Agent 能记住对话历史。

### 3.4.1 Memory 的类型

OpenClaw 支持多种记忆类型：

```python
from openclaw.memory import (
    BufferMemory,          # 简单缓冲记忆
    ConversationWindowMemory,  # 对话窗口记忆
    SummaryMemory,         # 摘要记忆
    VectorStoreMemory      # 向量存储记忆
)
```

#### 缓冲记忆（BufferMemory）

最简单的记忆方式，把所有对话都存起来：

```python
memory = BufferMemory()
memory.add_message("user", "我叫小明")
memory.add_message("assistant", "你好小明！")
memory.add_message("user", "我刚才跟你说什么了？")

# 获取所有历史
history = memory.get_messages()
# -> [("user", "我叫小明"), ("assistant", "你好小明！"), ...]
```

#### 对话窗口记忆（ConversationWindowMemory）

只保留最近 N 轮对话，避免记忆爆炸：

```python
# 只保留最近 10 轮对话
memory = ConversationWindowMemory(window_size=10)
```

#### 摘要记忆（SummaryMemory）

把长对话压缩成摘要，节省空间：

```python
# 自动生成摘要
memory = SummaryMemory()
# 当对话超过一定长度，自动压缩成摘要
```

#### 向量存储记忆（VectorStoreMemory）

用向量数据库存储，支持语义检索：

```python
from openclaw.memory import VectorStoreMemory
import chromadb

# 使用 Chroma 作为向量存储
vector_store = chromadb.Client()
memory = VectorStoreMemory(
    vector_store=vector_store,
    collection_name="conversation"
)

# 搜索相关记忆
related = memory.search("之前说的那个项目")
```

### 3.4.2 Memory 的使用

```python
from openclaw import Agent
from openclaw.memory import ConversationWindowMemory

# 创建记忆组件
memory = ConversationWindowMemory(window_size=20)

# 创建 Agent 时传入
agent = Agent(
    name="小浪助手",
    memory=memory,
    # ...其他配置
)

# 对话会自动使用记忆
agent.chat("我叫张三")  # 存入记忆
agent.chat("你好")      # 记住你是张三
agent.chat("我是谁？")  # 能正确回答：你叫张三
```

---

## 3.5 Workflow（工作流）：复杂任务的编排

有时候，一个任务需要多个步骤、多个工具配合完成。比如"帮我订一张明天去上海的机票"需要：

1. 查询明天上海天气（确保适合出行）
2. 搜索航班信息
3. 比较价格
4. 完成预订

这就需要 Workflow（工作流）来编排。

### 3.5.1 工作流的基本结构

```python
from openclaw import workflow

@workflow(name="订机票")
def book_flight(origin: str, destination: str, date: str):
    """
    订机票工作流
    
    参数:
        origin: 出发城市
        destination: 目的城市
        date: 出发日期
    """
    
    # 步骤 1：查询天气
    weather = get_weather(destination, date)
    
    # 步骤 2：搜索航班
    flights = search_flights(origin, destination, date)
    
    # 步骤 3：比较价格，选择最优
    best_flight = select_best(flights)
    
    # 步骤 4：预订
    booking = create_booking(best_flight)
    
    # 返回结果
    return {
        "status": "success",
        "weather": weather,
        "booking": booking
    }
```

### 3.5.2 条件分支

工作流可以根据条件执行不同路径：

```python
@workflow(name="费用审批")
def expense_approval(expense: dict):
    """
    费用审批工作流，根据金额选择不同审批流程
    """
    amount = expense["amount"]
    
    if amount < 1000:
        # 小额：主管审批
        result = approve_by_manager(expense)
    elif amount < 10000:
        # 中额：部门经理审批
        result = approve_by_department_manager(expense)
    else:
        # 大额：CFO 审批
        result = approve_by_cfo(expense)
    
    return result
```

### 3.5.3 并行执行

多个独立步骤可以并行执行，提高效率：

```python
from openclaw.workflow import workflow, parallel

@workflow(name="多城市天气查询")
def check_weather(cities: list):
    """
    并行查询多个城市的天气
    """
    # 并行执行
    results = parallel(
        get_weather(city) for city in cities
    )
    
    return results
```

### 3.5.4 工作流的注册和使用

```python
# 注册工作流
agent.register_workflow(book_flight)
agent.register_workflow(expense_approval)
agent.register_workflow(check_weather)

# 使用工作流
response = agent.chat("帮我订一张明天北京到上海的机票")
# Agent 会自动识别这是一个工作流调用
```

---

## 3.6 Channel（渠道）：与外部世界连接

Channel 是 OpenClaw 与用户交互的入口。不同的渠道有不同的特性。

### 3.6.1 支持的渠道

| 渠道 | 说明 | 适用场景 |
|------|------|----------|
| `FeishuChannel` | 飞书 | 企业内部协作 |
| `WeComChannel` | 企业微信 | 企业内部沟通 |
| `DingTalkChannel` | 钉钉 | 企业内部沟通 |
| `WebChannel` | Web UI | 网页客服 |
| `CLIChannel` | 命令行 | 开发调试 |
| `WebhookChannel` | Webhook | 回调接入 |

### 3.6.2 渠道的配置

```python
from openclaw.channels import FeishuChannel

# 创建飞书渠道
feishu = FeishuChannel(
    app_id="cli_xxxxxxxx",
    app_secret="xxxxxxxx",
    verification_token="xxxxxxxx"
)

# 创建 OpenClaw 应用
app = OpenClaw(
    config_path="openclaw.yaml",
    channel=feishu
)

app.run()
```

### 3.6.3 自定义渠道

如果你需要接入其他平台，可以自定义渠道：

```python
from openclaw.channels import BaseChannel

class MyCustomChannel(BaseChannel):
    """自定义渠道"""
    
    def __init__(self, config):
        self.config = config
    
    def receive_message(self, message):
        """接收消息"""
        # 实现你的接收逻辑
        return message
    
    def send_message(self, content, target):
        """发送消息"""
        # 实现你的发送逻辑
        pass
    
    def start(self):
        """启动渠道服务"""
        # 启动 Webhook、轮询等
        pass

# 使用自定义渠道
app = OpenClaw(
    config_path="openclaw.yaml",
    channel=MyCustomChannel(my_config)
)
```

---

## 3.7 LLM（大语言模型）：理解与生成

LLM 是 Agent 的"大脑"，负责理解用户意图和生成回复。

### 3.7.1 LLM 接口抽象

OpenClaw 定义了统一的 LLM 接口：

```python
from openclaw.llms import BaseLLM

class BaseLLM:
    """LLM 基类"""
    
    def generate(self, prompt: str, **kwargs) -> str:
        """生成回复"""
        raise NotImplementedError
    
    def chat(self, messages: list, **kwargs) -> str:
        """对话"""
        raise NotImplementedError
    
    def decide(self, prompt: str) -> Decision:
        """决策（是否调用工具）"""
        raise NotImplementedError
```

### 3.7.2 支持的 LLM

OpenClaw 支持多种 LLM：

```python
from openclaw.llms import (
    MiniMaxLLM,      # MiniMax
    BailianLLM,      # 阿里云百炼
    DeepSeekLLM,     # DeepSeek
    OpenAILLM,       # OpenAI
    AnthropicLLM,    # Anthropic (Claude)
)

# 使用 MiniMax
llm = MiniMaxLLM(
    model="MiniMax-M2.5",
    api_key="your-api-key"
)

# 使用 OpenAI
llm = OpenAILLM(
    model="gpt-4o",
    api_key="your-api-key"
)
```

### 3.7.3 LLM 的配置

```yaml
# openclaw.yaml
llm:
  provider: minimax
  model: MiniMax-M2.5
  api_key: ${MINIMAX_API_KEY}  # 从环境变量读取
  temperature: 0.7
  max_tokens: 2000
  top_p: 0.9
  
  # 超时设置
  timeout: 60
  
  # 重试设置
  max_retries: 3
```

---

## 3.8 小结 + 下章预告

### 🎯 这一章你学到了

- **整体架构**：渠道层 → 核心引擎 → 工具层 → 基础设施
- **数据流**：一条消息从用户到 Agent 再到工具的完整旅程
- **Agent**：智能体的定义、内部结构、工作流程
- **Tool**：工具的定义、注册、调用机制
- **Memory**：多种记忆类型（缓冲、窗口、摘要、向量）
- **Workflow**：工作流的基本结构、条件分支、并行执行
- **Channel**：渠道的抽象和自定义
- **LLM**：大语言模型的接口抽象和配置

### 🚀 下章预告

**第4章：第一个 Hello World（实战篇）**

理论学完了，是时候动手了！

- 从零开始创建一个完整的 AI 助手
- 接入飞书渠道
- 编写自定义工具
- 实现多轮对话
- 部署到服务器

**准备好你的键盘，我们开始实战！** 💻

---

> 📝 **思考题**：你最想用 OpenClaw 实现什么功能？一个客服机器人？一个自动化助手？还是数据分析工具？在评论区聊聊！

---

*本章代码示例基于 OpenClaw v0.1.0 版本，具体 API 可能有细微调整，请以官方文档为准。*
