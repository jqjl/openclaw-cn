# 第12章：企业沟通与协作

> 🎯 本章目标：掌握 OpenClaw 与各种企业沟通工具的集成，包括邮件、企业微信、钉钉等，实现统一的的企业沟通中枢。

现代企业使用多种沟通工具：邮件、飞书、企业微信、钉钉、Slack...如何让 AI 助手统一管理这些渠道？这一章我们来学习！

---

## 12.1 邮件集成

### 12.1.1 SMTP 发送邮件

```python
from openclaw import tool
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

@tool(name="发送邮件", description="发送电子邮件")
def send_email(
    to: str,
    subject: str,
    body: str,
    from_email: str = None,
    smtp_server: str = "smtp.example.com",
    smtp_port: int = 587
) -> str:
    """
    发送邮件
    
    参数：
    - to: 收件人
    - subject: 主题
    - body: 正文
    - from_email: 发件人（可选）
    """
    # 配置
    sender = from_email or "noreply@company.com"
    password = "your-password"  # 应使用环境变量
    
    # 创建邮件
    msg = MIMEMultipart()
    msg['From'] = sender
    msg['To'] = to
    msg['Subject'] = subject
    
    # 添加正文
    msg.attach(MIMEText(body, 'plain', 'utf-8'))
    
    # 发送
    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender, password)
        server.send_message(msg)
        server.quit()
        return f"✅ 邮件已发送至：{to}"
    except Exception as e:
        return f"❌ 发送失败：{str(e)}"
```

### 12.1.2 IMAP 接收邮件

```python
import imaplib
import email
from email.header import decode_header

@tool(name="接收邮件", description="接收最新邮件")
def receive_email(
    imap_server: str = "imap.example.com",
    username: str = None,
    password: str = None,
    limit: int = 5
) -> str:
    """接收邮件"""
    # 连接
    mail = imaplib.IMAP4_SSL(imap_server)
    mail.login(username, password)
    
    # 选择收件箱
    mail.select("INBOX")
    
    # 搜索最新邮件
    status, messages = mail.search(None, "ALL")
    email_ids = messages[0].split()
    
    results = []
    for email_id in email_ids[-limit:]:
        # 获取邮件
        status, msg_data = mail.fetch(email_id, "(RFC822)")
        msg = email.message_from_bytes(msg_data[0][1])
        
        # 解析发件人和主题
        subject = decode_header(msg["Subject"])[0][0]
        from_addr = decode_header(msg["From"])[0][0]
        
        results.append(f"📧 {from_addr}\n   主题：{subject}")
    
    mail.logout()
    return "\n".join(results) if results else "没有新邮件"
```

---

## 12.2 企业微信集成

```python
from openclaw.channels import WeComChannel

@tool(name="发送企业微信消息", description="发送企业微信消息")
def send_wecom_message(
    user_id: str,
    content: str,
    agent_id: str = None
) -> str:
    """发送企业微信消息"""
    channel = WeComChannel(
        corp_id="your-corp-id",
        secret="your-secret",
        agent_id=agent_id or "your-agent-id"
    )
    
    result = channel.send_message(user_id, content)
    return result
```

---

## 12.3 钉钉集成

```python
from openclaw.channels import DingTalkChannel

@tool(name="发送钉钉消息", description="发送钉钉消息")
def send_dingtalk_message(
    webhook: str,
    content: str,
    at_mobiles: list = None
) -> str:
    """发送钉钉消息"""
    import requests
    import json
    
    data = {
        "msgtype": "text",
        "text": {"content": f"{content}\n"}
    }
    
    if at_mobiles:
        data["at"] = {"atMobiles": at_mobiles}
    
    response = requests.post(webhook, data=json.dumps(data))
    result = response.json()
    
    if result.get("errcode") == 0:
        return "✅ 钉钉消息发送成功"
    return f"❌ 发送失败：{result.get('errmsg')}"
```

---

## 12.4 消息路由

### 12.4.1 统一消息入口

```python
class MessageRouter:
    """消息路由器：根据规则分发到不同渠道"""
    
    def __init__(self):
        self.routes = []
    
    def add_route(self, condition, channel):
        """添加路由规则"""
        self.routes.append({
            "condition": condition,
            "channel": channel
        })
    
    def route(self, message: dict) -> str:
        """路由消息"""
        content = message.get("content", "")
        user_id = message.get("user_id", "")
        
        for route in self.routes:
            if route["condition"](content, user_id):
                return route["channel"].send(content)
        
        return "未找到匹配的路由"


# 使用
router = MessageRouter()

# 添加路由规则
router.add_route(
    lambda content, uid: "紧急" in content,
    email_channel  # 邮件通知
)
router.add_route(
    lambda content, uid: "订单" in content,
    feishu_channel  # 飞书通知
)
router.add_route(
    lambda content, uid: True,
    default_channel  # 默认
)
```

---

## 12.5 小结

本章学习了企业沟通工具的集成：邮件、企业微信、钉钉、消息路由。掌握这些，企业沟通自动化就不在话下！

---

# 第13章：数据处理与分析

> 🎯 本章目标：掌握数据处理能力，让 AI 具备数据分析技能。

## 13.1 数据处理基础

```python
@tool(name="处理数据", description="处理和分析数据")
def process_data(data: list, operation: str) -> str:
    """数据处理"""
    import statistics
    
    if not data:
        return "数据为空"
    
    if operation == "sum":
        return f"总和：{sum(data)}"
    elif operation == "avg":
        return f"平均值：{statistics.mean(data):.2f}"
    elif operation == "max":
        return f"最大值：{max(data)}"
    elif operation == "min":
        return f"最小值：{min(data)}"
    elif operation == "median":
        return f"中位数：{statistics.median(data)}"
    
    return "不支持的操作"
```

## 13.2 数据分析

```python
@tool(name="分析CSV", description="分析CSV数据")
def analyze_csv(path: str) -> str:
    """CSV 数据分析"""
    import csv
    
    with open(path, 'r') as f:
        reader = csv.DictReader(f)
        data = list(reader)
    
    if not data:
        return "数据为空"
    
    # 基本统计
    columns = list(data[0].keys())
    
    result = f"📊 数据分析报告\n\n"
    result += f"总行数：{len(data)}\n"
    result += f"列数：{len(columns)}\n"
    result += f"列名：{', '.join(columns)}\n"
    
    return result
```

## 13.3 小结

数据处理与分析能力让 AI 能够处理企业数据，生成分析报告！

---

# 第14章：智能客服场景

> 🎯 本章目标：综合运用所学知识，构建一个完整的智能客服系统。

## 14.1 客服系统架构

```
┌─────────────────────────────────────────┐
│           智能客服系统                   │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────┐    ┌─────────┐            │
│  │ 渠道层  │───▶│ 路由层  │            │
│  │飞书/微信│    │ 问题分类│            │
│  └─────────┘    └────┬────┘            │
│                      │                  │
│               ┌──────▼──────┐          │
│               │  Agent 核心  │          │
│               │  理解+回答   │          │
│               └──────┬──────┘          │
│                      │                  │
│         ┌────────────┼────────────┐    │
│         ▼            ▼            ▼    │
│    ┌────────┐  ┌────────┐  ┌────────┐  │
│    │ 工具层 │  │知识库  │  │工作流  │  │
│    │查订单  │  │FAQ搜索 │  │退款流程│  │
│    └────────┘  └────────┘  └────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

## 14.2 完整客服示例

```python
from openclaw import OpenClaw
from openclaw.memory import ConversationWindowMemory

class CustomerServiceBot:
    """智能客服机器人"""
    
    def __init__(self):
        # 创建 Agent
        self.agent = OpenClaw(config_path="config.yaml")
        
        # 注册工具
        self.register_tools()
        
        # 记忆
        self.memory = ConversationWindowMemory(window_size=20)
    
    def register_tools(self):
        """注册客服工具"""
        from your_tools import (
            query_order,
            refund_order,
            faq_search,
            transfer_to_human
        )
        
        self.agent.register_tool(query_order)
        self.agent.register_tool(refund_order)
        self.agent.register_tool(faq_search)
        self.agent.register_tool(transfer_to_human)
    
    def handle(self, user_id: str, message: str) -> str:
        """处理用户消息"""
        # 添加到记忆
        self.memory.add_message("user", message)
        
        # 获取上下文
        context = self.memory.get_context()
        
        # 判断问题类型
        category = self.classify(message)
        
        # 处理
        if category == "order":
            return self.handle_order(message)
        elif category == "refund":
            return self.handle_refund(message)
        elif category == "faq":
            return self.handle_faq(message)
        else:
            return self.agent.chat(message)
    
    def classify(self, message: str) -> str:
        """问题分类"""
        if "订单" in message or "物流" in message:
            return "order"
        elif "退款" in message or "退货" in message:
            return "refund"
        elif any(kw in message for kw in ["怎么", "如何", "什么"]):
            return "faq"
        return "general"

# 使用
bot = CustomerServiceBot()
response = bot.handle("user123", "我的订单到哪了？")
```

## 14.3 小结

本章构建了一个完整的智能客服系统！结合前面学习的知识，你可以搭建各种场景的 AI 应用。

---

# 第15章：系统架构设计

> 🎯 本章目标：学习如何设计企业级的 OpenClaw 系统架构。

## 15.1 单机架构

最简单的架构，适合小规模使用：

```
┌─────────────────────────┐
│      OpenClaw 应用       │
├─────────────────────────┤
│  - Agent                 │
│  - Tools                │
│  - Channel              │
│  - Memory               │
└─────────────────────────┘
```

## 15.2 分布式架构

大规模使用时：

```
                    ┌──────────────┐
                    │   负载均衡    │
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
   ┌─────────┐        ┌─────────┐        ┌─────────┐
   │Node 1  │        │Node 2  │        │Node 3  │
   │Agent   │        │Agent   │        │Agent   │
   └────┬────┘        └────┬────┘        └────┬────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ▼
                    ┌──────────────┐
                    │  Redis       │
                    │  (共享状态)   │
                    └──────────────┘
                           │
                    ┌──────┴───────┐
                    ▼              ▼
              ┌─────────┐    ┌─────────┐
              │数据库   │    │知识库   │
              └─────────┘    └─────────┘
```

## 15.3 微服务架构

企业级架构：

```
┌─────────────────────────────────────────────────────┐
│                    API 网关                         │
└──────────────────────┬──────────────────────────────┘
                       │
     ┌─────────────────┼─────────────────┐
     ▼                 ▼                 ▼
┌─────────┐      ┌─────────┐       ┌─────────┐
│ 消息服务 │      │ Agent服务│       │ 工具服务 │
└────┬────┘      └────┬────┘       └────┬────┘
     │                │                 │
     └────────────────┴─────────────────┘
                    │
              ┌─────┴─────┐
              ▼           ▼
         ┌────────┐   ┌────────┐
         │消息队列 │   │数据库  │
         │(Kafka) │   └────────┘
         └────────┘
```

## 15.4 高可用设计

```python
# 健康检查
@app.route("/health")
def health():
    return {"status": "ok", "version": "1.0.0"}

# 优雅关闭
import signal
import sys

def graceful_shutdown(sig, frame):
    print("收到关闭信号，正在优雅关闭...")
    # 保存状态
    save_state()
    # 关闭连接
    close_connections()
    sys.exit(0)

signal.signal(signal.SIGTERM, graceful_shutdown)
signal.signal(signal.SIGINT, graceful_shutdown)
```

## 15.5 小结

本章学习了系统架构设计，从单机到分布式、微服务，帮助你设计企业级应用！

---

# 第16章：安全与权限

> 🎯 本章目标：掌握企业级安全配置，保护 AI 系统。

## 16.1 认证与授权

```python
# 简单认证
def authenticate(request):
    token = request.headers.get("Authorization")
    if not token or not validate_token(token):
        return False
    return True

# 权限检查
def require_permission(permission: str):
    def decorator(func):
        def wrapper(*args, **kwargs):
            if not has_permission(current_user, permission):
                raise PermissionDenied("没有权限")
            return func(*args, **kwargs)
        return wrapper
    return decorator

@require_permission("query_order")
def query_order(order_id: str):
    # 查询订单
    pass
```

## 16.2 数据安全

```python
# 加密存储
import hashlib
import base64
from cryptography.fernet import Fernet

# 密码哈希
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# 数据加密
def encrypt_data(data: str, key: bytes) -> str:
    f = Fernet(key)
    return f.encrypt(data.encode()).decode()

def decrypt_data(encrypted: str, key: bytes) -> str:
    f = Fernet(key)
    return f.decrypt(encrypted.encode()).decode()
```

## 16.3 输入验证与过滤

```python
# SQL 注入防护（使用参数化查询）
def safe_query(sql: str, params: tuple):
    cursor.execute(sql, params)  # 参数化

# XSS 防护
from html import escape
def sanitize_html(user_input: str) -> str:
    return escape(user_input)

# 命令注入防护
import shlex
def safe_system(command: str, args: list):
    # 使用 shlex.quote 转义
    safe_args = [shlex.quote(arg) for arg in args]
```

## 16.4 审计日志

```python
import logging
from datetime import datetime

class AuditLogger:
    def __init__(self, log_file: str = "audit.log"):
        self.logger = logging.getLogger("audit")
        self.logger.setLevel(logging.INFO)
        handler = logging.FileHandler(log_file)
        self.logger.addHandler(handler)
    
    def log(self, user: str, action: str, resource: str, result: str):
        entry = {
            "timestamp": datetime.now().isoformat(),
            "user": user,
            "action": action,
            "resource": resource,
            "result": result
        }
        self.logger.info(json.dumps(entry))

audit = AuditLogger()
audit.log("user123", "query_order", "OD001", "success")
```

## 16.5 小结

本章学习了安全与权限：认证授权、数据安全、输入验证、审计日志。安全是企业级应用的重中之重！

---

# 第17章：性能优化

> 🎯 本章目标：掌握性能优化技巧，让 AI 系统更快速、更高效。

## 17.1 缓存策略

```python
import functools
import time

# 简单缓存装饰器
def cache(ttl: int = 300):
    def decorator(func):
        _cache = {}
        
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            key = str(args) + str(kwargs)
            now = time.time()
            
            if key in _cache:
                result, timestamp = _cache[key]
                if now - timestamp < ttl:
                    return result
            
            result = func(*args, **kwargs)
            _cache[key] = (result, now)
            return result
        
        return wrapper
    return decorator

@cache(ttl=60)  # 60秒缓存
def get_weather(city: str):
    # 天气查询
    pass
```

## 17.2 并发处理

```python
import asyncio

# 异步工具
@tool(name="异步查询")
async def async_query(items: list) -> list:
    async def query_one(item):
        # 异步查询
        return await fetch_data(item)
    
    results = await asyncio.gather(*[
        query_one(item) for item in items
    ])
    return list(results)
```

## 17.3 批处理

```python
# 批量操作
def batch_process(items: list, batch_size: int = 100):
    results = []
    for i in range(0, len(items), batch_size):
        batch = items[i:i+batch_size]
        batch_result = process_batch(batch)
        results.extend(batch_result)
    return results
```

## 17.4 连接池

```python
# 数据库连接池
from dbutils.pooled_db import PooledDB
import pymysql

pool = PooledDB(
    creator=pymysql,
    maxconnections=10,
    mincached=2,
    maxcached=5,
    blocking=True,
    host='localhost',
    port=3306,
    user='root',
    password='',
    database='test'
)

def query(sql: str):
    conn = pool.connection()
    try:
        cursor = conn.cursor()
        cursor.execute(sql)
        return cursor.fetchall()
    finally:
        conn.close()
```

## 17.5 性能监控

```python
import time
import functools

def monitor(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        duration = time.time() - start
        
        print(f"{func.__name__} 执行时间: {duration:.3f}s")
        
        # 记录到监控
        metrics.record(func.__name__, duration)
        
        return result
    return wrapper

@monitor
def slow_operation():
    pass
```

## 17.6 小结

本章学习了性能优化：缓存、并发、批处理、连接池、监控。让系统飞起来！

---

# 第18章：运维与扩展

> 🎯 本章目标：掌握运维技能和扩展能力，让 AI 系统稳定运行并持续进化。

## 18.1 部署运维

### 18.1.1 Docker 部署

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONUNBUFFERED=1

CMD ["python", "-m", "src.app"]
```

```bash
# docker-compose.yaml
version: '3.8'
services:
  openclaw:
    build: .
    ports:
      - "8080:8080"
    environment:
      - MINIMAX_API_KEY=${MINIMAX_API_KEY}
      - FEISHU_APP_ID=${FEISHU_APP_ID}
    restart: always
```

### 18.1.2 Kubernetes 部署

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: openclaw
spec:
  replicas: 3
  selector:
    matchLabels:
      app: openclaw
  template:
    metadata:
      labels:
        app: openclaw
    spec:
      containers:
      - name: openclaw
        image: openclaw:latest
        ports:
        - containerPort: 8080
        resources:
          limits:
            memory: "512Mi"
            cpu: "500m"
```

## 18.2 监控告警

### 18.2.1 Prometheus 指标

```python
from prometheus_client import Counter, Histogram, start_http_server

# 计数器
request_count = Counter('requests_total', 'Total requests')
request_duration = Histogram('request_duration_seconds', 'Request duration')

@app.middleware("http")
def monitor_requests(request, call_next):
    request_count.inc()
    with request_duration.time():
        response = call_next(request)
    return response
```

### 18.2.2 日志收集

```python
import logging
from logging.handlers import RotatingFileHandler

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    handlers=[
        RotatingFileHandler('app.log', maxBytes=10*1024*1024, backupCount=5),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)
```

## 18.3 扩展开发

### 18.3.1 自定义通道

```python
from openclaw.channels import BaseChannel

class CustomChannel(BaseChannel):
    """自定义通道"""
    
    def __init__(self, config: dict):
        self.config = config
    
    def receive_message(self, message: dict):
        # 处理接收
        return message
    
    def send_message(self, content: str, target: str):
        # 处理发送
        pass
    
    def start(self):
        # 启动服务
        pass
```

### 18.3.2 自定义 Agent

```python
from openclaw import Agent

class CustomAgent(Agent):
    """自定义 Agent"""
    
    def decide(self, prompt: str):
        # 自定义决策逻辑
        return super().decide(prompt)
    
    def execute_tool(self, tool_name: str, args: dict):
        # 自定义工具执行
        return super().execute_tool(tool_name, args)
```

## 18.4 插件系统

```python
# 插件接口
class Plugin:
    def __init__(self, config: dict):
        self.config = config
    
    def on_load(self):
        """加载时调用"""
        pass
    
    def on_unload(self):
        """卸载时调用"""
        pass
    
    def on_message(self, message: dict):
        """处理消息"""
        pass

# 插件管理器
class PluginManager:
    def __init__(self):
        self.plugins = {}
    
    def load_plugin(self, name: str, plugin: Plugin):
        plugin.on_load()
        self.plugins[name] = plugin
    
    def unload_plugin(self, name: str):
        if name in self.plugins:
            self.plugins[name].on_unload()
            del self.plugins[name]
```

## 18.5 小结

本章学习了运维与扩展：Docker/K8s部署、监控告警、自定义开发、插件系统。掌握这些，你就能运维好整个 AI 系统！

---

# 附录 A-D

## 附录 A：配置参考

完整的 `openclaw.yaml` 配置示例：

```yaml
# OpenClaw 完整配置

llm:
  provider: minimax
  model: MiniMax-M2.5
  api_key: ${MINIMAX_API_KEY}
  temperature: 0.7
  max_tokens: 2000
  timeout: 60

assistant:
  name: "AI助手"
  description: "智能助手"
  system_prompt: "你是一个有帮助的AI助手"

memory:
  type: conversation_window
  window_size: 20

channel:
  type: feishu
  feishu:
    app_id: ${FEISHU_APP_ID}
    app_secret: ${FEISHU_APP_SECRET}
    verification_token: ${FEISHU_VERIFICATION_TOKEN}

logging:
  level: INFO
  file: logs/openclaw.log

tools:
  enabled:
    - weather
    - search
    - calculator
```

## 附录 B：常见错误

| 错误 | 原因 | 解决方案 |
|------|------|----------|
| API Key 无效 | Key 错误或过期 | 检查并更新 API Key |
| 连接超时 | 网络问题 | 检查网络或使用代理 |
| 内存溢出 | 对话太长 | 清理历史或使用摘要记忆 |
| 工具调用失败 | 参数错误 | 检查参数格式 |

## 附录 C：API 参考

常用 API 速查：

```python
# 创建 Agent
agent = Agent(name="助手", llm_config={}, system_prompt="")

# 注册工具
agent.register_tool(tool_function)

# 对话
response = agent.chat("你好")

# 注册工作流
agent.register_workflow(workflow_function)
```

## 附录 D：资源链接

- GitHub: https://github.com/openclaw
- 文档: https://docs.openclaw.dev
- 社区: https://community.openclaw.dev

---

# 写书完成总结

本书涵盖了 OpenClaw 的完整知识体系：

1. **基础入门**：环境安装、核心概念、Hello World
2. **核心能力**：Agent 定制、工具系统、工作流编排
3. **集成实战**：飞书集成、浏览器自动化、文件处理
4. **企业应用**：沟通协作、数据处理、智能客服
5. **架构运维**：系统设计、安全权限、性能优化、运维扩展

通过本书，你已经掌握了从零到企业级部署的完整技能！

**祝你玩得开心！** 🎉
