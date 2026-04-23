# 第9章：飞书集成实战

> 🎯 本章目标：掌握如何将 OpenClaw 接入飞书平台，创建智能对话机器人，实现消息收发、卡片交互、事件处理等核心功能。

飞书（Feishu）是字节跳动推出的企业协作平台，在国内企业中使用越来越广泛。将 AI 助手接入飞书，可以实现智能客服、自动化办公、数据查询等多种场景。

这一章，我们就来深入学习飞书集成！

---

## 9.1 飞书开发基础

### 9.1.1 飞书开放平台概述

飞书开放平台提供了丰富的 API，允许开发者创建第三方应用。核心概念：

- **应用（App）**：你在飞书平台上创建的应用
- **机器人（Bot）**：可以自动回复消息的账号
- **事件（Event）**：用户发送消息、点击按钮等动作
- **卡片（Card）**：富文本消息样式

### 9.1.2 创建飞书应用

1. 访问 [飞书开放平台](https://open.feishu.cn/)
2. 创建企业（如果还没有）
3. 进入"应用开发" → 创建应用
4. 填写应用信息：
   - 应用名称：如"OpenClaw 助手"
   - 应用描述：AI 智能助手

### 9.1.3 获取凭证

创建应用后，在"凭证与基础信息"页面获取：

```yaml
# 保存这些信息
App ID: cli_xxxxxxxxxxxxxxxxxx
App Secret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 9.1.4 配置权限

在"权限管理"中添加需要的权限：

| 权限名称 | 说明 | 用途 |
|---------|------|------|
| im:message:send_as_bot | 发送消息 | 回复用户消息 |
| im:message:send_as_public | 群聊中@机器人 | 群聊交互 |
| im:resource:file | 上传下载文件 | 文件处理 |
| contact:user.base | 用户基本信息 | 获取用户信息 |
| im:p2p-chat:create | 私聊会话 | 主动发送消息 |

---

## 9.2 OpenClaw 飞书配置

### 9.2.1 安装飞书 SDK

```bash
pip install openclaw[feishu]
# 或者
pip install lark-fit
```

### 9.2.2 配置文件

```yaml
# config/feishu.yaml

channel:
  type: feishu
  
  feishu:
    # 从飞书开放平台获取
    app_id: cli_xxxxxxxxxxxxxxxxxx
    app_secret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    
    # 验证 Token（用于接收消息验证）
    verification_token: your-verification-token
    
    # 加密密钥（如果启用了加密模式）
    # encrypt_key: your-encrypt-key
    
    # 回调地址（公网可访问）
    # webhook_url: https://your-domain.com/webhook

# 可选：日志配置
logging:
  level: DEBUG
```

### 9.2.3 创建飞书通道

```python
# src/channels/feishu_channel.py

from openclaw.channels import FeishuChannel
from openclaw import OpenClaw

# 创建飞书通道
feishu = FeishuChannel(
    app_id="cli_xxxxxxxxxxxxxxxxxx",
    app_secret="xxxxxxxxxxxxxxxxxxxxxxxxxx",
    verification_token="your-verification-token",
)

# 创建应用
app = OpenClaw(
    config_path="config/openclaw.yaml",
    channel=feishu
)

app.run()
```

---

## 9.3 消息接收与回复

### 9.3.1 接收消息

飞书通过 Webhook 推送消息到你的服务器：

```python
from flask import Flask, request, jsonify
from openclaw.channels.feishu import FeishuChannel

app = Flask(__name__)
feishu = FeishuChannel(...)

@app.route("/webhook", methods=["POST"])
def handle_webhook():
    """处理飞书 Webhook 回调"""
    
    # 验证请求
    if not feishu.verify_request(request):
        return jsonify({"error": "invalid request"}), 401
    
    # 解析事件
    event = request.json
    
    # 处理不同类型的事件
    if event.get("type") == "url_verification":
        # 验证回调地址
        return jsonify({
            "challenge": event.get("challenge")
        })
    
    if event.get("type") == "event_callback":
        event_type = event.get("event", {}).get("type")
        
        if event_type == "message":
            # 处理消息事件
            message = event.get("event", {})
            user_message = message.get("message", {}).get("text", "")
            user_id = message.get("sender", {}).get("user_id", "")
            
            # 调用 OpenClaw 处理
            response = app.chat(user_message, user_id=user_id)
            
            # 回复用户
            feishu.send_message(
                receive_id=user_id,
                content=response,
                msg_type="text"
            )
    
    return jsonify({"code": 0})
```

### 9.3.2 发送消息

```python
# 发送文本消息
feishu.send_message(
    receive_id="ou_xxxxx",  # 用户 ID
    content="你好，我是 OpenClaw 助手！",
    msg_type="text"
)

# 发送富文本消息
feishu.send_message(
    receive_id="ou_xxxxx",
    content="""<md>
# 欢迎使用 OpenClaw

我可以帮你：
- 查询信息
- 办理业务
- 解答问题

[点击这里](https://example.com)了解更多
</md>""",
    msg_type="post"
)
```

### 9.3.3 消息类型

| 类型 | 说明 | 示例 |
|------|------|------|
| text | 纯文本 | "你好" |
| post | 富文本 | 支持 Markdown |
| image | 图片 | 图片消息 |
| file | 文件 | 附件 |
| interactive | 卡片 | 交互式卡片 |

---

## 9.4 卡片消息：富交互

卡片（Card）是飞书强大的消息类型，支持按钮、表单等交互元素。

### 9.4.1 创建卡片

```python
from openclaw.channels.feishu import Card, CardElement

# 创建卡片
card = Card(
    title="订单查询",
    elements=[
        # 文本
        CardElement.text("请选择查询方式："),
        
        # 按钮组
        CardElement.button(
            text="查物流",
            value="query_logistics",
            action_type="button"
        ),
        CardElement.button(
            text="查详情",
            value="query_detail",
            action_type="button"
        ),
        
        # 分割线
        CardElement.divider(),
        
        # 输入框
        CardElement.input(
            label="订单号",
            name="order_id",
            placeholder="请输入订单号"
        ),
        
        # 提交按钮
        CardElement.button(
            text="提交",
            value="submit",
            action_type="submit"
        )
    ]
)

# 发送卡片
feishu.send_card(
    receive_id="ou_xxxxx",
    card=card
)
```

### 9.4.2 处理卡片回调

```python
@app.route("/webhook", methods=["POST"])
def handle_webhook():
    event = request.json
    
    if event.get("type") == "event_callback":
        event_type = event.get("event", {}).get("type")
        
        if event_type == "interactive":
            # 处理卡片交互
            action = event.get("event", {}).get("action", {})
            action_value = action.get("value", {})
            
            if action_value == "query_logistics":
                # 处理查询物流
                response = "请提供订单号"
                feishu.send_message(receive_id=user_id, content=response)
            
            elif action_value.get("action") == "submit":
                # 处理表单提交
                form_data = action.get("form_data", {})
                order_id = form_data.get("order_id")
                
                # 查询订单
                result = query_order(order_id)
                
                # 回复结果
                feishu.send_message(receive_id=user_id, content=result)
```

### 9.4.3 完整卡片示例：订单查询

```python
def create_order_query_card():
    """创建订单查询卡片"""
    
    card = {
        "config": {
            "wide_screen_mode": True
        },
        "header": {
            "title": {
                "tag": "plain_text",
                "content": "📦 订单查询"
            },
            "template": "blue"
        },
        "elements": [
            {
                "tag": "div",
                "text": {
                    "tag": "lark_md",
                    "content": "您好！请选择查询方式："
                }
            },
            {
                "tag": "action",
                "actions": [
                    {
                        "tag": "button",
                        "text": {
                            "tag": "plain_text",
                            "content": "🔍 查物流"
                        },
                        "type": "primary",
                        "value": {"action": "query_logistics"}
                    },
                    {
                        "tag": "button",
                        "text": {
                            "tag": "plain_text",
                            "content": "📋 查详情"
                        },
                        "type": "default",
                        "value": {"action": "query_detail"}
                    }
                ]
            },
            {
                "tag": "div",
                "text": {
                    "tag": "lark_md",
                    "content": "---"
                }
            },
            {
                "tag": "input",
                "label": {
                    "tag": "plain_text",
                    "content": "订单号"
                },
                "name": "order_id",
                "element": {
                    "tag": "plain_text_input",
                    "placeholder": {
                        "tag": "plain_text",
                        "content": "请输入订单号"
                    }
                }
            },
            {
                "tag": "action",
                "actions": [
                    {
                        "tag": "button",
                        "text": {
                            "tag": "plain_text",
                            "content": "🔎 查询"
                        },
                        "type": "primary",
                        "value": {"action": "submit_query"}
                    }
                ]
            }
        ]
    }
    
    return card


# 发送卡片
feishu.send_card_message(
    receive_id="ou_xxxxx",
    card=create_order_query_card()
)
```

---

## 9.5 群聊机器人

### 9.5.1 配置群聊机器人

1. 在飞书开放平台创建应用
2. 添加权限：`im:message:send_as_public`
3. 将机器人添加到群聊

### 9.5.2 群聊消息处理

```python
@app.route("/webhook", methods=["POST"])
def handle_group_webhook():
    event = request.json
    
    if event.get("type") == "event_callback":
        event_type = event.get("event", {}).get("type")
        
        if event_type == "message":
            message = event.get("event", {}).get("message", {})
            
            # 检查是否是群聊消息
            if message.get("chat_id"):
                chat_type = message.get("chat_type")
                
                if chat_type == "group":
                    # 群聊消息
                    text = message.get("text", "")
                    chat_id = message.get("chat_id")
                    user_id = message.get("sender", {}).get("user_id", "")
                    
                    # 检查是否@了机器人
                    if "@claw" in text:  # 假设机器人名字叫 claw
                        # 提取问题（去掉@部分）
                        question = text.replace("@claw", "").strip()
                        
                        if question:
                            # 处理问题
                            response = app.chat(question, user_id=user_id)
                            
                            # 在群聊中回复
                            feishu.send_message(
                                receive_id=chat_id,
                                content=f"@{user_id} {response}",
                                msg_type="text"
                            )
    
    return jsonify({"code": 0})
```

---

## 9.6 飞书事件订阅

### 9.6.1 支持的事件类型

| 事件类型 | 说明 |
|---------|------|
| message | 收到消息 |
| message.read | 消息已读 |
| interactive | 卡片交互 |
| user.created | 用户创建 |
| user.updated | 用户更新 |
| add_bot | 机器人加入群聊 |
| remove_bot | 机器人移出群聊 |

### 9.6.2 事件处理示例

```python
@app.route("/webhook", methods=["POST"])
def handle_events():
    event = request.json
    
    # URL 验证
    if event.get("type") == "url_verification":
        return jsonify({"challenge": event.get("challenge")})
    
    # 加密验证（如果启用了加密）
    if event.get("type") == "encrypt_hook":
        # 解密
        encrypted = event.get("encrypt")
        event = feishu.decrypt(encrypted)
    
    event_type = event.get("event", {}).get("type")
    
    # 路由到不同处理器
    handlers = {
        "message": handle_message,
        "interactive": handle_interactive,
        "add_bot": handle_bot_added,
        "remove_bot": handle_bot_removed,
    }
    
    handler = handlers.get(event_type)
    if handler:
        return handler(event)
    
    return jsonify({"code": 0})


def handle_message(event):
    """处理消息事件"""
    message = event.get("event", {}).get("message", {})
    
    # 忽略机器人自己的消息
    if message.get("sender_type") == "app":
        return jsonify({"code": 0})
    
    user_id = message.get("sender", {}).get("user_id")
    text = message.get("text", "")
    chat_id = message.get("chat_id")
    
    # 调用 AI 处理
    response = app.chat(text, user_id=user_id)
    
    # 根据消息来源回复
    if message.get("chat_type") == "p2p":
        # 私聊
        feishu.send_message(receive_id=user_id, content=response)
    else:
        # 群聊
        feishu.send_message(receive_id=chat_id, content=f"@{user_id} {response}")
    
    return jsonify({"code": 0})


def handle_bot_added(event):
    """处理机器人加入群聊"""
    chat_id = event.get("event", {}).get("chat_id")
    
    welcome = """
    🎉 你好！我是 OpenClaw 助手

    我可以帮你：
    - 回答问题
    - 办理业务
    - 查询信息

    请@我开始使用！
    """
    
    feishu.send_message(receive_id=chat_id, content=welcome)
    
    return jsonify({"code": 0})
```

---

## 9.7 实战案例：飞书 AI 客服

让我们综合运用这些知识，创建一个完整的飞书 AI 客服：

```python
# examples/feishu_customer_service.py

from flask import Flask, request, jsonify
from openclaw import OpenClaw
from openclaw.channels import FeishuChannel
from openclaw.memory import ConversationWindowMemory

app = Flask(__name__)

# 1. 配置
CONFIG = {
    "app_id": "cli_xxxxxxxxxxxxxxxxxx",
    "app_secret": "xxxxxxxxxxxxxxxxxxxxxxxxxx",
    "verification_token": "your-verification-token"
}

# 2. 创建飞书通道
feishu = FeishuChannel(**CONFIG)

# 3. 创建 OpenClaw 实例
assistant = OpenClaw(
    config_path="config/openclaw.yaml"
)

# 4. 注册工具
@assistant.tool(name="查订单", description="查询订单状态")
def query_order(order_id: str) -> str:
    """模拟订单查询"""
    orders = {
        "OD001": {"status": "已发货", "items": ["iPhone 15"], "express": "顺丰"},
        "OD002": {"status": "处理中", "items": ["AirPods"], "express": None},
    }
    
    order = orders.get(order_id)
    if order:
        return f"订单 {order_id}：{order['status']}\n商品：{', '.join(order['items'])}"
    return f"未找到订单 {order_id}"


@assistant.tool(name="查物流", description="查询物流信息")
def query_logistics(order_id: str) -> str:
    """模拟物流查询"""
    return f"订单 {order_id} 物流：\n📦 已发出\n📍 正在配送中\n预计明天送达"


# 5. 处理消息
def process_message(user_id: str, text: str, chat_id: str = None):
    """处理用户消息"""
    
    # 基础响应
    response = assistant.chat(text, user_id=user_id)
    
    # 特殊处理：如果是查询订单，发送卡片
    if "订单" in text and "查" in text:
        # 发送订单查询引导卡片
        card = create_order_query_card()
        feishu.send_card_message(receive_id=user_id, card=card)
        return
    
    # 发送普通消息
    if chat_id:
        # 群聊
        feishu.send_message(receive_id=chat_id, content=f"@{user_id} {response}")
    else:
        # 私聊
        feishu.send_message(receive_id=user_id, content=response)


# 6. 创建卡片
def create_order_query_card():
    """订单查询卡片"""
    return {
        "config": {"wide_screen_mode": True},
        "header": {
            "title": {"tag": "plain_text", "content": "📦 订单查询"},
            "template": "blue"
        },
        "elements": [
            {"tag": "div", "text": {"tag": "lark_md", "content": "请输入订单号："}},
            {
                "tag": "input",
                "label": {"tag": "plain_text", "content": "订单号"},
                "name": "order_id",
                "element": {
                    "tag": "plain_text_input",
                    "placeholder": {"tag": "plain_text", "content": "如：OD001"}
                }
            },
            {
                "tag": "action",
                "actions": [
                    {
                        "tag": "button",
                        "text": {"tag": "plain_text", "content": "🔍 查询"},
                        "type": "primary",
                        "value": {"action": "query_order"}
                    }
                ]
            }
        ]
    }


# 7. Webhook 端点
@app.route("/webhook", methods=["POST"])
def webhook():
    """飞书 Webhook 回调"""
    
    # 验证请求
    if not feishu.verify_request(request):
        return jsonify({"error": "invalid request"}), 401
    
    event = request.json
    
    # URL 验证
    if event.get("type") == "url_verification":
        return jsonify({"challenge": event.get("challenge")})
    
    # 消息事件
    if event.get("type") == "event_callback":
        event_type = event.get("event", {}).get("type")
        
        # 消息
        if event_type == "message":
            message = event.get("event", {}).get("message", {})
            
            # 忽略机器人消息
            if message.get("sender_type") == "app":
                return jsonify({"code": 0})
            
            user_id = message.get("sender", {}).get("user_id")
            text = message.get("text", "")
            chat_id = message.get("chat_id")
            
            process_message(user_id, text, chat_id)
        
        # 卡片交互
        elif event_type == "interactive":
            action = event.get("event", {}).get("action", {})
            value = action.get("value", {})
            
            if value.get("action") == "query_order":
                # 获取表单数据
                form_data = action.get("form_data", {})
                order_id = form_data.get("order_id")
                
                # 查询订单
                result = query_order(order_id)
                
                # 发送结果
                user_id = event.get("event", {}).get("sender", {}).get("user_id")
                feishu.send_message(receive_id=user_id, content=result)
    
    return jsonify({"code": 0})


# 8. 启动
if __name__ == "__main__":
    print("🚀 飞书 AI 客服启动中...")
    print("📍 Webhook: https://your-domain.com/webhook")
    app.run(host="0.0.0.0", port=8080)
```

---

## 9.8 小结 + 下章预告

### 🎯 这一章你学到了

- **飞书开发基础**：飞书开放平台、应用创建、权限配置
- **OpenClaw 飞书配置**：配置方法、通道创建
- **消息收发**：接收消息、Webhook 处理、发送消息
- **卡片消息**：创建卡片、处理回调、交互设计
- **群聊机器人**：群聊消息处理、@机器人
- **事件订阅**：事件类型、处理函数
- **实战案例**：完整的飞书 AI 客服

### 🚀 下章预告

**第10章：浏览器自动化**

OpenClaw 最强大的能力之一——像人一样操作浏览器！

- Playwright/Selenium 集成
- 网页操作：点击、填表、截图
- 复杂交互：下拉菜单、iframe、弹窗
- 数据抓取
- 自动化测试

**准备好让 AI 学会"上网"了吗？** 🌐

---

> 📝 **思考题**：你想用飞书机器人实现什么功能？一个自动问答客服？一个业务办理助手？在评论区聊聊！

---

*本章代码示例基于 OpenClaw v0.1.0 版本，具体 API 可能有细微调整，请以官方文档为准。*
