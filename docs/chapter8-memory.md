# 第8章：记忆与上下文管理

> 🎯 本章目标：深入理解 OpenClaw 的记忆系统，掌握不同记忆类型的适用场景，学会构建长期用户画像和知识库。

你有没有遇到过这种情况：

> 你：我的订单到哪了？  
> AI：请问您的订单号是多少？  
> 你：就是昨天买的那件衣服  
> AI：请问您的订单号是多少？

这就是典型的"没有记忆"——AI 完全不记得你之前说过什么。

人类的对话是有上下文的——我提到了"昨天买的衣服"，AI 应该能关联到相关订单。这一章，我们就来学习如何让 AI 拥有"记忆"！

---

## 8.1 记忆系统概述

### 8.1.1 为什么需要记忆？

没有记忆的 AI，就像失忆症患者——每次对话都是全新的开始。这会导致：

- ❌ 重复询问相同信息
- ❌ 无法理解代词（它、这个、那件）
- ❌ 丢失重要上下文
- ❌ 用户体验差

有了记忆，AI 可以：

- ✅ 记住用户的偏好和习惯
- ✅ 理解对话历史
- ✅ 实现连续的多轮对话
- ✅ 提供个性化服务

### 8.1.2 OpenClaw 记忆系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                    记忆系统架构                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  记忆存储层                           │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐            │   │
│  │  │ 缓冲记忆  │ │窗口记忆  │ │摘要记忆  │            │   │
│  │  │(Buffer) │ │(Window) │ │(Summary)│            │   │
│  │  └──────────┘ └──────────┘ └──────────┘            │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐            │   │
│  │  │向量记忆  │ │持久记忆  │ │用户画像  │            │   │
│  │  │(Vector) │ │(Persist)│ │(Profile)│            │   │
│  │  └──────────┘ └──────────┘ └──────────┘            │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                │
│                           ▼                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  记忆检索层                           │   │
│  │   - 语义搜索 (Semantic Search)                      │   │
│  │   - 关键词搜索 (Keyword Search)                      │   │
│  │   - 相似度匹配 (Similarity Matching)                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                │
│                           ▼                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  记忆应用层                           │   │
│  │   - 对话上下文 - 用户画像 - 知识库检索                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 8.2 短期记忆：对话历史

短期记忆保存最近的对话内容，让 AI 理解当前对话的上下文。

### 8.2.1 缓冲记忆（Buffer Memory）

最简单的记忆方式，保存所有对话历史：

```python
from openclaw.memory import BufferMemory

# 创建缓冲记忆
memory = BufferMemory()

# 添加对话
memory.add_message("user", "我叫小明")
memory.add_message("assistant", "你好小明！")
memory.add_message("user", "我刚才说什么了？")

# 获取所有历史
history = memory.get_messages()
# [("user", "我叫小明"), ("assistant", "你好小明！"), ...]
```

### 8.2.2 窗口记忆（Window Memory）

只保留最近 N 轮对话，避免记忆爆炸：

```python
from openclaw.memory import ConversationWindowMemory

# 只保留最近 10 轮对话
memory = ConversationWindowMemory(window_size=10)

# 使用示例
memory.add_message("user", "我想买一台电脑")
memory.add_message("assistant", "好的，您有什么偏好？")
# ... 更多对话 ...

# 获取最近 10 轮
recent = memory.get_messages()
# 超过 10 轮的内容会被自动清除
```

### 8.2.3 摘要记忆（Summary Memory）

将长对话压缩成摘要，节省 token：

```python
from openclaw.memory import SummaryMemory

# 创建摘要记忆
memory = SummaryMemory(
    summary_max_tokens=500,  # 摘要最大 token 数
    prompt_template="请用 100 字概括以下对话的要点："
)

# 对话进行中...
memory.add_message("user", "我在找一台笔记本电脑")
memory.add_message("assistant", "您有什么需求吗？比如预算、品牌？")
memory.add_message("user", "预算 8000 左右，主要用来编程和看视频")
memory.add_message("assistant", "推荐 ThinkBook 14+，i5+16GB，性价比很高")
# ...

# 当对话太长时，会自动生成摘要
# "用户想买一台 8000 元左右的笔记本电脑，主要用途是编程和看视频，AI 推荐了 ThinkBook 14+"
```

---

## 8.3 长期记忆：用户画像与知识库

长期记忆保存用户偏好、历史行为等，让 AI 在多次对话中不断"认识"用户。

### 8.3.1 用户画像记忆

```python
from openclaw.memory import BaseMemory
import json

class UserProfileMemory(BaseMemory):
    """用户画像记忆：记住用户的偏好和特征"""
    
    def __init__(self):
        # user_id -> profile dict
        self.profiles = {}
    
    def add_message(self, role: str, content: str, user_id: str = "default"):
        """从对话中提取用户信息"""
        if role != "user":
            return
        
        # 提取用户偏好
        preferences = self.extract_preferences(content)
        if preferences:
            self.update_profile(user_id, preferences)
    
    def extract_preferences(self, text: str) -> dict:
        """从文本中提取偏好信息"""
        import re
        
        preferences = {}
        
        # 提取喜欢的品牌
        brands = ["苹果", "华为", "小米", "ThinkPad", "戴尔"]
        for brand in brands:
            if brand in text:
                preferences["preferred_brand"] = brand
        
        # 提取预算
        budget_match = re.search(r'(\d+)\s*元左右', text)
        if budget_match:
            preferences["budget"] = int(budget_match.group(1))
        
        # 提取用途
        uses = ["编程", "看视频", "玩游戏", "办公", "设计"]
        for use in uses:
            if use in text:
                if "use_cases" not in preferences:
                    preferences["use_cases"] = []
                preferences["use_cases"].append(use)
        
        return preferences
    
    def update_profile(self, user_id: str, preferences: dict):
        """更新用户画像"""
        if user_id not in self.profiles:
            self.profiles[user_id] = {}
        
        # 合并偏好
        for key, value in preferences.items():
            if key in self.profiles[user_id]:
                # 如果已存在，转为列表追加
                existing = self.profiles[user_id][key]
                if isinstance(existing, list):
                    if value not in existing:
                        existing.append(value)
                else:
                    if existing != value:
                        self.profiles[user_id][key] = [existing, value]
            else:
                self.profiles[user_id][key] = value
    
    def get_profile(self, user_id: str = "default") -> dict:
        """获取用户画像"""
        return self.profiles.get(user_id, {})
    
    def get_context(self, user_id: str = "default") -> str:
        """获取上下文字符串"""
        profile = self.get_profile(user_id)
        if not profile:
            return ""
        
        # 格式化为字符串
        parts = []
        for key, value in profile.items():
            parts.append(f"{key}: {value}")
        
        return "用户画像：" + ", ".join(parts)


# 使用示例
profile_memory = UserProfileMemory()

# 对话 1
profile_memory.add_message("user", "我想买一台笔记本电脑")
profile_memory.add_message("user", "我喜欢苹果的产品")

# 对话 2
profile_memory.add_message("user", "预算 8000 元左右")

# 查看画像
print(profile_memory.get_profile())
# {'preferred_brand': '苹果', 'budget': 8000}
```

### 8.3.2 向量记忆（语义检索）

用向量数据库存储记忆，支持语义检索：

```python
from openclaw.memory import VectorStoreMemory
import chromadb
from chromadb.config import Settings

# 创建向量存储客户端
client = chromadb.Client(Settings(
    persist_directory="./data/vector_store"
))

# 创建向量记忆
vector_memory = VectorStoreMemory(
    vector_store=client,
    collection_name="conversation_history",
    embedding_model="text-embedding-ada-002",
    top_k=3  # 检索最相关的 3 条
)

# 添加对话
vector_memory.add_message(
    "user",
    "我上次买的那个键盘很好用",
    metadata={"topic": "键盘", "sentiment": "positive"}
)

vector_memory.add_message(
    "assistant",
    "很高兴您喜欢！"
)

vector_memory.add_message(
    "user",
    "那个键盘多少钱？"
)

# 检索相关记忆
# 当用户问"那个键盘"时，能找到之前提到键盘的对话
relevant_memories = vector_memory.search("键盘")
# 返回之前关于键盘的对话
```

### 8.3.3 持久化记忆

将记忆保存到文件或数据库：

```python
from openclaw.memory import PersistentMemory
import json

class FileMemory(PersistentMemory):
    """文件持久化记忆"""
    
    def __init__(self, file_path: str = "./data/memory.json"):
        self.file_path = file_path
        self._load()
    
    def _load(self):
        """从文件加载"""
        import os
        if os.path.exists(self.file_path):
            with open(self.file_path, 'r', encoding='utf-8') as f:
                self.data = json.load(f)
        else:
            self.data = {}
    
    def _save(self):
        """保存到文件"""
        import os
        os.makedirs(os.path.dirname(self.file_path), exist_ok=True)
        with open(self.file_path, 'w', encoding='utf-8') as f:
            json.dump(self.data, f, ensure_ascii=False, indent=2)
    
    def add_message(self, role: str, content: str, user_id: str = "default"):
        """添加消息"""
        if user_id not in self.data:
            self.data[user_id] = []
        
        self.data[user_id].append({"role": role, "content": content})
        self._save()
    
    def get_messages(self, user_id: str = "default") -> list:
        """获取消息"""
        return self.data.get(user_id, [])
    
    def clear(self, user_id: str = "default"):
        """清除记忆"""
        if user_id in self.data:
            self.data[user_id] = []
            self._save()
```

---

## 8.4 上下文管理：智能整合

将多种记忆类型组合使用，构建完整的上下文。

### 8.4.1 多级记忆组合

```python
from openclaw.memory import (
    ConversationWindowMemory,
    UserProfileMemory,
    VectorStoreMemory
)

class CompositeMemory:
    """组合记忆：结合多种记忆类型"""
    
    def __init__(self):
        # 短期记忆：最近对话
        self.short_term = ConversationWindowMemory(window_size=10)
        
        # 中期记忆：用户画像
        self.profile = UserProfileMemory()
        
        # 长期记忆：向量存储
        self.long_term = VectorStoreMemory(
            collection_name="history",
            top_k=5
        )
    
    def add_message(self, role: str, content: str, user_id: str = "default"):
        """添加消息到所有记忆"""
        self.short_term.add_message(role, content)
        self.profile.add_message(role, content, user_id)
        self.long_term.add_message(role, content)
    
    def get_context(self, user_id: str = "default") -> str:
        """获取完整上下文"""
        parts = []
        
        # 1. 用户画像（最优先）
        profile_context = self.profile.get_context(user_id)
        if profile_context:
            parts.append(f"【用户画像】{profile_context}")
        
        # 2. 相关历史记忆
        recent_messages = self.short_term.get_messages()
        if recent_messages:
            conversation = "\n".join([
                f"{msg['role']}: {msg['content']}"
                for msg in recent_messages[-6:]
            ])
            parts.append(f"【最近对话】\n{conversation}")
        
        # 3. 长期记忆检索
        # 这里可以加入检索逻辑
        
        return "\n\n".join(parts)
    
    def search(self, query: str) -> list:
        """语义搜索"""
        return self.long_term.search(query)


# 使用组合记忆
memory = CompositeMemory()

# 添加对话
memory.add_message("user", "我喜欢喝美式咖啡")
memory.add_message("user", "帮我找一家咖啡店")
memory.add_message("user", "不要太远的")

# 获取完整上下文
context = memory.get_context("user123")
print(context)
```

### 8.4.2 上下文压缩

当上下文太长时，需要压缩：

```python
from openclaw.context import compress_context

def smart_get_context(memory, user_id, max_tokens=4000):
    """
    智能获取上下文，自动压缩
    """
    # 获取原始上下文
    raw_context = memory.get_context(user_id)
    
    # 如果太长，进行压缩
    if len(raw_context) > max_tokens:
        # 使用 LLM 压缩
        compressed = compress_context(
            raw_context,
            max_tokens=max_tokens,
            preserve_types=["user_preferences", "key_facts"]
        )
        return compressed
    
    return raw_context
```

---

## 8.5 实战：智能客服的记忆系统

让我们构建一个完整的智能客服记忆系统：

```python
# examples/smart客服_memory.py

from openclaw.memory import (
    ConversationWindowMemory,
    UserProfileMemory,
    VectorStoreMemory
)
from openclaw import Agent
import json

class CustomerServiceMemory:
    """
    智能客服记忆系统
    
    结合多种记忆类型：
    - 对话历史：理解当前对话
    - 用户画像：个性化服务
    - 历史记录：记住之前的问题
    """
    
    def __init__(self):
        # 1. 对话窗口：最近 20 轮对话
        self.conversation = ConversationWindowMemory(window_size=20)
        
        # 2. 用户画像
        self.profile = UserProfileMemory()
        
        # 3. 历史记录：向量存储
        self.history = VectorStoreMemory(
            collection_name="customer_service",
            top_k=3
        )
    
    def add_interaction(self, user_id: str, user_msg: str, assistant_msg: str):
        """记录一次交互"""
        # 添加到对话历史
        self.conversation.add_message("user", user_msg)
        self.conversation.add_message("assistant", assistant_msg)
        
        # 提取用户偏好
        self.profile.extract_and_update(user_id, user_msg)
        
        # 添加到长期历史
        self.history.add_message(
            "user", user_msg,
            metadata={"user_id": user_id}
        )
        self.history.add_message(
            "assistant", assistant_msg,
            metadata={"user_id": user_id}
        )
    
    def get_context(self, user_id: str) -> dict:
        """获取完整的上下文"""
        
        # 获取用户画像
        profile = self.profile.get_profile(user_id)
        
        # 获取最近对话
        recent = self.conversation.get_messages()
        
        # 获取相关历史
        # (实际使用中可以传入当前查询来检索)
        
        return {
            "profile": profile,
            "recent_conversation": recent,
            "context_summary": self._build_summary(profile, recent)
        }
    
    def _build_summary(self, profile: dict, recent: list) -> str:
        """构建上下文字符串"""
        parts = []
        
        # 用户画像
        if profile:
            prefs = []
            if "name" in profile:
                prefs.append(f"姓名: {profile['name']}")
            if "tier" in profile:
                prefs.append(f"会员等级: {profile['tier']}")
            if prefs:
                parts.append("【用户信息】" + ", ".join(prefs))
        
        # 最近对话
        if recent:
            last_user = None
            for msg in reversed(recent):
                if msg["role"] == "user":
                    last_user = msg["content"]
                    break
            
            if last_user:
                parts.append(f"【最新问题】{last_user}")
        
        return "\n".join(parts)


# 自定义用户画像记忆
class UserProfileMemory:
    """增强的用户画像"""
    
    def __init__(self):
        self.profiles = {}
    
    def extract_and_update(self, user_id: str, text: str):
        """从文本中提取信息并更新画像"""
        import re
        
        if user_id not in self.profiles:
            self.profiles[user_id] = {"preferences": {}, "history": []}
        
        profile = self.profiles[user_id]
        
        # 提取订单号
        order_match = re.search(r'OD\d+', text)
        if order_match:
            if "recent_order" not in profile:
                profile["recent_order"] = order_match.group(0)
        
        # 提取问题类型
        problem_types = {
            "退货": "after_sales",
            "退款": "after_sales",
            "换货": "after_sales",
            "物流": "logistics",
            "发货": "logistics",
            "价格": "inquiry",
            "优惠": "inquiry"
        }
        
        for keyword, ptype in problem_types.items():
            if keyword in text:
                profile["history"].append(ptype)
        
        # 提取偏好
        if "喜欢" in text or "偏好" in text:
            profile["preferences"]["has_expressed_preference"] = True
    
    def get_profile(self, user_id: str) -> dict:
        return self.profiles.get(user_id, {})


# 使用示例
def main():
    # 创建记忆系统
    memory = CustomerServiceMemory()
    user_id = "user_001"
    
    # 模拟对话
    dialogues = [
        ("我想查一下我的订单OD12345", "好的，我帮您查询订单OD12345"),
        ("这件商品多少钱？", "这件商品的价格是 299 元"),
        ("我喜欢蓝色的", "好的，已记录您的偏好")
    ]
    
    for user_msg, assistant_msg in dialogues:
        memory.add_interaction(user_id, user_msg, assistant_msg)
    
    # 获取上下文
    context = memory.get_context(user_id)
    print("=== 完整上下文 ===")
    print(json.dumps(context, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
```

---

## 8.6 记忆系统最佳实践

### 8.6.1 选择合适的记忆类型

| 场景 | 推荐记忆类型 |
|------|-------------|
| 简单对话机器人 | ConversationWindowMemory |
| 需要记忆用户偏好 | UserProfileMemory |
| 需要语义检索 | VectorStoreMemory |
| 需要长期保存 | PersistentMemory |
| 复杂应用 | CompositeMemory（组合） |

### 8.6.2 记忆清理策略

```python
class SmartMemory:
    """智能记忆管理"""
    
    def __init__(self):
        self.memory = ConversationWindowMemory(window_size=20)
    
    def should_compress(self) -> bool:
        """判断是否需要压缩"""
        messages = self.memory.get_messages()
        total_tokens = sum(len(m['content']) for m in messages)
        return total_tokens > 3000
    
    def compress_if_needed(self, llm):
        """必要时压缩"""
        if self.should_compress():
            messages = self.memory.get_messages()
            # 用 LLM 生成摘要
            summary = llm.summarize(messages)
            self.memory.clear()
            self.memory.add_message("system", f"对话摘要: {summary}")
```

### 8.6.3 隐私与安全

```python
class SecureMemory:
    """安全的记忆系统"""
    
    def __init__(self):
        self.encryption_key = None  # 应该从配置读取
    
    def add_message(self, role: str, content: str, user_id: str):
        """添加消息（自动脱敏）"""
        # 脱敏处理
        sanitized = self.sanitize(content)
        
        # 加密存储（可选）
        # encrypted = self.encrypt(sanitized)
        
        self._save(user_id, role, sanitized)
    
    def sanitize(self, text: str) -> str:
        """脱敏：移除敏感信息"""
        import re
        
        # 脱敏手机号
        text = re.sub(r'\d{11}', '138****0000', text)
        
        # 脱敏身份证号
        text = re.sub(r'\d{17}[\dXx]', '11010119900101****', text)
        
        # 脱敏银行卡
        text = re.sub(r'\d{16,19}', '6222 **** **** ****', text)
        
        return text
```

---

## 8.7 小结 + 下章预告

### 🎯 这一章你学到了

- **记忆系统概述**：为什么需要记忆、记忆系统架构
- **短期记忆**：缓冲记忆、窗口记忆、摘要记忆
- **长期记忆**：用户画像、向量记忆、持久化记忆
- **上下文管理**：多级记忆组合、上下文压缩
- **实战案例**：智能客服记忆系统
- **最佳实践**：记忆类型选择、清理策略、隐私安全

### 🚀 下章预告

**第9章：飞书集成实战**

飞书是中国企业最常用的协作工具之一——如何让 AI 助手接入飞书？

- 飞书应用创建与配置
- 消息接收与回复
- 卡片消息交互
- 飞书机器人开发
- 实际案例：飞书 AI 客服

**准备好让你的 AI 上飞书了吗？** 📱

---

> 📝 **思考题**：你在设计对话系统时，在记忆方面遇到过什么问题？是怎么解决的？

---

*本章代码示例基于 OpenClaw v0.1.0 版本，具体 API 可能有细微调整，请以官方文档为准。*
