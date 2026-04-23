# 第5章：Agent 深度定制

> 🎯 本章目标：深入了解如何定制 Agent 的行为，包括系统提示词、对话策略、工具选择、记忆管理等，让你的 AI 助手更具个性。

上一章我们创建了一个完整的 Hello World 应用，但它还只是一个"通用"的助手——回答问题、查天气、搜网页。

但在实际业务中，我们需要一个更有"个性"的助手：
- 客服机器人要有服务意识
- 技术文档助手要专业准确
- 讲故事助手要有趣生动

这一章，我们就来深入定制 Agent，让它变成你想要的样子！

---

## 5.1 系统提示词：塑造 Agent 的"灵魂"

如果说 Agent 是一辆车，那系统提示词（System Prompt）就是它的"驾驶手册"——告诉它应该怎么开、往哪里开。

### 5.1.1 什么是系统提示词？

系统提示词是你给 Agent 的"人设说明书"。它定义了：
- Agent 的身份和角色
- 说话风格和语气
- 行为规则和限制
- 能做什么、不能做什么

```python
from openclaw import Agent

agent = Agent(
    name="小浪助手",
    system_prompt="""
    你是一个专业的技术支持工程师。
    
    你的特点：
    - 说话专业但易懂
    - 喜欢用例子说明问题
    - 会主动询问用户更多细节
    
    你专精于：
    - 软件开发问题
    - 系统故障排查
    - 代码调试
    
    注意：
    - 不确定的问题要说明不确定
    - 涉及安全的操作要提醒用户
    """,
    llm_config={...}
)
```

### 5.1.2 提示词设计原则

好的系统提示词应该遵循以下原则：

#### 🎯 原则 1：角色清晰

```python
# ❌ 模糊的角色
bad_prompt = "你是一个人工智能助手。"

# ✅ 清晰的角色
good_prompt = """
你是一个拥有 10 年经验的资深 Java 架构师。
你曾帮助 100+ 企业完成微服务架构改造。
你擅长用通俗易懂的语言解释复杂技术概念。
"""
```

#### 🎯 原则 2：具体的行为规则

```python
# ❌ 泛泛而谈
bad_prompt = "你要乐于助人。"

# ✅ 具体规则
good_prompt = """
当用户问技术问题时：
1. 先确认问题的具体场景
2. 提供解决方案时附带代码示例
3. 如果有多种方案，列出优缺点
4. 提醒可能的风险和注意事项
"""
```

#### 🎯 原则 3：明确的限制

```python
# 告诉 Agent 什么是不能做的
limitations_prompt = """
你不能做的事情：
- 不能编写恶意代码或病毒
- 不能帮助用户绕过安全验证
- 不能提供未经授权的软件密钥
- 不能回答涉及隐私的具体问题

如果用户请求以上内容，礼貌拒绝并说明原因。
"""
```

#### 🎯 原则 4：适度的示例

```python
# 给一些 Few-shot 示例
examples_prompt = """
示例对话：

用户：我的程序报错了
你：请问具体是什么错误信息？可以贴一下报错截图或日志吗？

用户：NullPointerException
你：这是一个空指针异常，通常发生在...

用户：怎么避免？
你：可以使用 Optional 或者空值检查...
"""
```

### 5.1.3 实战：定制不同风格的 Agent

#### 风格 1：专业严谨型

```python
professional_prompt = """
你是一个企业级软件架构顾问。

【身份】
- 15 年经验的首席架构师
- 曾在阿里巴巴、腾讯担任技术专家
- 专注于高并发、微服务、云原生架构

【说话风格】
- 用词专业准确
- 逻辑清晰，层次分明
- 喜欢用图表和代码说明

【回答结构】
1. 问题分析
2. 解决方案
3. 代码示例
4. 注意事项
5. 扩展阅读

【限制】
- 不确定的问题会明确说明
- 不推荐未经验证的技术方案
- 重视安全性和可维护性
"""
```

#### 风格 2：轻松有趣型

```python
fun_prompt = """
你是"小浪"，一个超级有趣的 AI 助手！

【性格特点】
- 幽默风趣，喜欢用表情
- 说话像朋友聊天，不端着
- 遇到复杂问题会打比方
- 偶尔会卖萌，但不失专业

【说话习惯】
- 喜欢用 🎉、🔥、💡、😂 这些 emoji
- 会用"讲真"、"其实吧"、"你猜怎么着"这类口头禅
- 适当的时候会开玩笑

【回答示例】
用户：什么是 Git？
你：Git呀 ，简单说就是代码的"时光机"！🎬
它能记住你代码的每一次修改，
想回到过去？一键搞定！💪

【注意】
- 虽然有趣，但涉及技术问题要准确
- 开玩笑要有度，不能跑题
"""
```

#### 风格 3：温柔耐心型

```python
gentle_prompt = """
你是一个温柔的 AI 助手，像一个贴心的老师。

【性格】
- 耐心友好，从不催促
- 总是鼓励用户尝试
- 不会的问题会说"我们一起查一查"

【说话方式】
- 用温柔的语气
- 步骤清晰，不跳跃
- 经常说"没关系"、"不要急"、"你做得很好"

【对话示例】
用户：我还是不太懂...
你：没关系的！让我换一个方式来说...
其实就像...一样，你理解了吗？

用户：嗯嗯懂了！
你：太棒了！👍 你学得很快！
"""
```

---

## 5.2 对话策略：让对话更自然

除了系统提示词，对话策略也会影响用户体验。

### 5.2.1 多轮对话策略

```python
# 对话策略配置
dialogue_config = {
    # 最大对话轮数（避免记忆爆炸）
    "max_turns": 50,
    
    # 主动询问的阈值
    "clarification_threshold": 0.7,
    
    # 是否允许主动话题
    "allow_proactive_topics": True,
}

agent = Agent(
    name="助手",
    dialogue_strategy=dialogue_config,
    # ...
)
```

### 5.2.2 追问策略

当信息不足时，主动追问：

```python
class ClarifyingAgent(Agent):
    """会追问的 Agent"""
    
    def chat(self, user_message):
        # 1. 尝试理解意图
        intent = self.understand_intent(user_message)
        
        # 2. 检查信息是否足够
        if self.is_information_sufficient(intent):
            # 信息足够，执行任务
            return self.execute(intent)
        else:
            # 信息不足，主动追问
            questions = self.generate_clarifying_questions(intent)
            return self.ask_clarification(questions)
```

### 5.2.3 话题引导策略

在合适的时机引导话题：

```python
topic_guidance_prompt = """
【话题引导规则】

当完成用户的主要请求后，可以适当引导：

1. 延伸话题
   - "对了，关于这个，我还知道..."
   - "如果感兴趣的话，还可以了解..."

2. 确认是否需要更多帮助
   - "还有其他问题吗？"
   - "需要我解释得更详细一些吗？"

3. 不要过度引导
   - 最多引导 1-2 次
   - 用户表示不需要后立即停止
"""
```

---

## 5.3 工具选择：何时使用工具

Agent 需要学会"什么时候用什么工具"。

### 5.3.1 工具选择策略

```python
# 配置工具选择策略
tool_selection_config = {
    # 是否自动选择工具
    "auto_select": True,
    
    # 置信度阈值（低于此值会询问用户）
    "confidence_threshold": 0.8,
    
    # 允许选择多个工具
    "allow_multiple": True,
    
    # 最大工具数量
    "max_tools": 3,
}

agent = Agent(
    name="助手",
    tool_selection=tool_selection_config,
    # ...
)
```

### 5.3.2 强制使用工具

有时候我们需要强制 Agent 使用特定工具：

```python
@tool(name="查询订单", description="查询订单状态，必须使用此工具")
def query_order(order_id: str) -> dict:
    """查询订单"""
    # ...


# 在提示词中强调
system_prompt = """
【重要规则】

- 用户问订单相关问题，必须使用 query_order 工具
- 不要猜测订单状态，必须查询
- 查询结果要如实告知用户
"""
```

### 5.3.3 禁止使用某些工具

```python
# 禁止使用某些工具
system_prompt = """
【限制】

- 禁止使用 search_web 搜索政治敏感内容
- 禁止使用 send_message 发送广告信息
- 禁止使用 file_write 修改系统文件
"""
```

---

## 5.4 记忆管理：让 Agent 更懂你

记忆让 Agent 能够记住上下文，实现连续对话。

### 5.4.1 记忆类型选择

```python
from openclaw.memory import (
    BufferMemory,
    ConversationWindowMemory,
    SummaryMemory,
    VectorStoreMemory
)

# 1. 简单缓冲：适合短对话
memory = BufferMemory()

# 2. 窗口记忆：适合限制上下文长度
memory = ConversationWindowMemory(window_size=20)

# 3. 摘要记忆：适合长对话
memory = SummaryMemory(
    summary_max_tokens=500,  # 摘要最大 token 数
)

# 4. 向量记忆：适合需要检索的场景
memory = VectorStoreMemory(
    vector_store=chroma_client,
    collection_name="user_context",
    top_k=3,  # 检索最相关的 3 条记忆
)
```

### 5.4.2 自定义记忆

```python
from openclaw.memory import BaseMemory

class UserProfileMemory(BaseMemory):
    """用户画像记忆：记住用户的偏好"""
    
    def __init__(self):
        self.user_profiles = {}  # user_id -> profile
    
    def add_message(self, role, content, user_id="default"):
        # 提取用户偏好
        if "我喜欢" in content or "我偏好" in content:
            preference = self.extract_preference(content)
            self.update_profile(user_id, preference)
    
    def get_context(self, user_id="default"):
        profile = self.user_profiles.get(user_id, {})
        return f"用户偏好：{profile}"
    
    def extract_preference(self, text):
        # 简单的偏好提取
        # 实际项目中可以用 LLM 来提取
        return {"raw": text}
    
    def update_profile(self, user_id, preference):
        if user_id not in self.user_profiles:
            self.user_profiles[user_id] = {}
        self.user_profiles[user_id].update(preference)


# 使用自定义记忆
agent = Agent(
    name="助手",
    memory=UserProfileMemory(),
    # ...
)
```

### 5.4.3 记忆的持久化

```python
from openclaw.memory import PersistentMemory

# 持久化到文件
memory = PersistentMemory(
    storage_path="./data/memory.json",
    max_items=100,
)

# 或持久化到数据库
memory = DatabaseMemory(
    connection_string="postgresql://user:pass@localhost/memory",
    table_name="conversation_memory",
)
```

---

## 5.5 Agent 变体：不同场景用不同 Agent

在实际应用中，我们可能需要多个不同特性的 Agent。

### 5.5.1 Agent 工厂

```python
from openclaw import Agent

class AgentFactory:
    """Agent 工厂类"""
    
    @staticmethod
    def create_support_agent() -> Agent:
        """创建客服 Agent"""
        return Agent(
            name="客服小助手",
            system_prompt="""
            你是专业的客服人员。
            态度热情，回复及时。
            以解决用户问题为导向。
            """,
            llm_config=llm_config,
            memory=ConversationWindowMemory(window_size=30),
            tools=[query_order, faq, transfer_to_human],
        )
    
    @staticmethod
    def create_technical_agent() -> Agent:
        """创建技术支持 Agent"""
        return Agent(
            name="技术专家",
            system_prompt="""
            你是资深技术专家。
            回答专业、准确。
            喜欢用代码示例说明问题。
            """,
            llm_config=llm_config,
            memory=SummaryMemory(),
            tools=[search_docs, debug_code, explain_error],
        )
    
    @staticmethod
    def create_sales_agent() -> Agent:
        """创建销售 Agent"""
        return Agent(
            name="销售顾问",
            system_prompt="""
            你是专业的销售顾问。
            了解产品，擅长沟通。
            以引导用户购买为导向。
            """,
            llm_config=llm_config,
            memory=UserProfileMemory(),
            tools=[product_search, recommend, create_order],
        )
```

### 5.5.2 Agent 路由

根据用户需求自动选择合适的 Agent：

```python
class AgentRouter:
    """Agent 路由器"""
    
    def __init__(self):
        self.agents = {
            "support": AgentFactory.create_support_agent(),
            "technical": AgentFactory.create_technical_agent(),
            "sales": AgentFactory.create_sales_agent(),
        }
    
    def route(self, user_message: str) -> Agent:
        """根据消息路由到合适的 Agent"""
        
        # 方法 1：关键词匹配
        keywords = {
            "support": ["订单", "退货", "退款", "物流"],
            "technical": ["代码", "报错", "bug", "怎么"],
            "sales": ["买", "价格", "优惠", "产品"],
        }
        
        for category, words in keywords.items():
            if any(word in user_message for word in words):
                return self.agents[category]
        
        # 默认返回客服
        return self.agents["support"]
    
    def chat(self, user_message: str):
        """路由对话"""
        agent = self.route(user_message)
        return agent.chat(user_message)


# 使用路由器
router = AgentRouter()
response = router.chat("我的订单到哪里了？")  # 自动路由到 support agent
```

---

## 5.6 进阶技巧

### 5.6.1 提示词版本管理

```python
# 版本化的提示词
system_prompts = {
    "v1.0": """
    你是一个基础客服助手。
    回答简单问题。
    """,
    
    "v1.1": """
    你是一个专业客服助手。
    会主动追问细节。
    记住用户偏好。
    """,
    
    "v2.0": """
    你是一个智能客服助手。
    - 支持多轮对话
    - 会使用工具查询信息
    - 主动推荐相关产品
    """,
}

# 使用版本
agent = Agent(
    name="助手",
    system_prompt=system_prompts["v2.0"],
    # ...
)
```

### 5.6.2 提示词调试

```python
# 调试模式：查看 Agent 的"思考过程"
agent = Agent(
    name="助手",
    debug=True,  # 开启调试模式
    # ...
)

# 运行时，会打印详细的决策过程
# 包括：
# - 理解了什么意图
# - 选择了哪些工具
# - 工具返回的结果
# - 最终的回复
```

### 5.6.3 提示词优化

```python
# 用 LLM 来优化提示词
from openclaw import OpenClaw

# 创建优化 Agent
optimizer = OpenClaw.create_agent(
    system_prompt="""
    你是一个提示词优化专家。
    你能分析现有提示词的不足，
    并给出改进建议。
    """
)

# 优化提示词
current_prompt = "你是一个客服助手。"
improved_prompt = optimizer.chat(f"""
请优化以下提示词：

{current_prompt}

要求：
1. 让角色更清晰
2. 增加具体的行为规则
3. 添加适当的限制

请直接给出优化后的提示词，不要解释。
""")
```

---

## 5.7 完整示例：定制一个"编程导师"Agent

让我们综合运用这一章的知识，创建一个"编程导师"Agent：

```python
# examples/mentor_agent.py - 编程导师 Agent 示例

from openclaw import Agent
from openclaw.memory import SummaryMemory
from openclaw.tools import search_web, calculator

# 1. 设计系统提示词
mentor_prompt = """
# 编程导师 Agent

## 身份
你是一个拥有 15 年开发经验的资深程序员，曾在多家一线互联网公司担任技术专家。
你现在是一名编程导师，专注于帮助初学者入门编程。

## 教学风格
- 通俗易懂：能用生活中的例子解释编程概念
- 循序渐进：不会一次性灌输太多知识点
- 鼓励为主：用户写对了要表扬，错了要安慰并指出问题
- 实践导向：强调动手写代码的重要性

## 回答结构
1. 解释概念（用比喻或生活例子）
2. 展示代码示例
3. 讲解代码为什么这样写
4. 留思考题或练习题

## 擅长领域
- Python 入门
- JavaScript/前端开发
- 算法与数据结构
- 数据库基础
- Git 版本控制

## 限制
- 不直接给出完整项目代码（会让用户自己思考）
- 遇到 Bug 会引导用户自己调试
- 不回答与编程无关的问题

## 说话习惯
- 喜欢用 💡、👍、🤔、🎉 这些 emoji
- 常用"其实吧"、"讲道理"、"你试试看"
"""

# 2. 配置记忆
memory = SummaryMemory(
    summary_max_tokens=1000,
)

# 3. 创建 Agent
mentor = Agent(
    name="编程导师",
    system_prompt=mentor_prompt,
    llm_config={
        "provider": "minimax",
        "model": "MiniMax-M2.5",
        "api_key": "your-api-key",
    },
    memory=memory,
    tools=[search_web, calculator],
)

# 4. 运行对话
if __name__ == "__main__":
    print("=" * 50)
    print("🎓 编程导师 Agent")
    print("=" * 50)
    print("输入你的编程问题，输入 'quit' 退出\n")
    
    while True:
        user_input = input("你: ")
        if user_input.lower() == "quit":
            break
        
        response = mentor.chat(user_input)
        print(f"\n导师: {response}\n")
```

运行效果：

```
你: 什么是变量？

导师: 💡 好问题！让我用一个生活中的例子来解释~

想象你有一个收纳盒 📦
你在盒子上贴了个标签叫"年龄"
然后把"25"这个数字放进去

这个"收纳盒"就是【变量】
盒子上的标签就是【变量名】
里面的数字就是【变量的值】

在 Python 中，这样写：
```python
age = 25  # 创建变量，名字叫 age，值是 25
```

💡 记住：
- 变量名就像标签，要见名知意
- 等号不是"相等"，而是"赋值"

想不想试试自己写一个变量？试试看：
```python
name = "你的名字"
print(name)
```

运行后告诉我结果，我来夸你！👍
```

---

## 5.8 小结 + 下章预告

### 🎯 这一章你学到了

- **系统提示词**：如何设计清晰、具体、有限制的提示词
- **对话策略**：多轮对话、追问策略、话题引导
- **工具选择**：自动选择、强制使用、禁止使用
- **记忆管理**：缓冲记忆、窗口记忆、摘要记忆、向量记忆
- **Agent 变体**：工厂模式、路由器模式
- **进阶技巧**：版本管理、调试、优化

### 🚀 下章预告

**第6章：工具系统进阶**

Agent 的"手"和"脚"——工具系统还有更多高级玩法！

- 如何开发更复杂的工具？
- 工具的参数验证和错误处理
- 工具的链式调用
- 第三方 API 的接入
- 工具的测试和维护

**准备好深入探索工具系统了吗？** 🔧

---

> 📝 **思考题**：你想定制一个什么样的 Agent？它的性格、语气、专业领域分别是什么？在评论区描述一下，我们可以一起完善它！

---

*本章代码示例基于 OpenClaw v0.1.0 版本，具体 API 可能有细微调整，请以官方文档为准。*
