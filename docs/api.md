# OpenClaw 中文版 API 参考

本文档列出 OpenClaw 中文版的核心 API 接口。

## 📡 基础信息

- **基础 URL**: `http://localhost:8080`
- **协议**: HTTP / WebSocket

## 💬 聊天接口

### 发送消息

**POST** `/chat`

```bash
curl -X POST http://localhost:8080/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "你好",
    "channel": "feishu"
  }'
```

**参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| message | string | 是 | 消息内容 |
| channel | string | 否 | 渠道：feishu, dingtalk, terminal |
| sessionId | string | 否 | 会话 ID |

**响应：**

```json
{
  "success": true,
  "response": "你好！有什么可以帮助你的？",
  "sessionId": "xxx"
}
```

---

## 🔧 管理接口

### 获取状态

**GET** `/status`

```bash
curl http://localhost:8080/status
```

**响应：**

```json
{
  "status": "running",
  "version": "3.12.0-cn",
  "uptime": 3600,
  "models": {
    "default": "qwen-turbo"
  }
}
```

---

### 获取配置

**GET** `/config`

```bash
curl http://localhost:8080/config
```

---

### 重启服务

**POST** `/restart`

```bash
curl -X POST http://localhost:8080/restart \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔌 技能接口

### 列出技能

**GET** `/skills`

```bash
curl http://localhost:8080/skills
```

**响应：**

```json
{
  "skills": [
    {
      "name": "weather",
      "description": "查询天气"
    },
    {
      "name": "browser",
      "description": "浏览器自动化"
    }
  ]
}
```

---

### 安装技能

**POST** `/skills/install`

```bash
curl -X POST http://localhost:8080/skills/install \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com/xxx/skill-name"}'
```

---

## 📊 监控接口

### 指标

**GET** `/metrics`

```bash
curl http://localhost:8080/metrics
```

**响应：**

```json
{
  "requests": {
    "total": 1000,
    "success": 950,
    "failed": 50
  },
  "models": {
    "qwen-turbo": {
      "calls": 800,
      "avgLatency": 500
    }
  },
  "memory": {
    "used": "512MB",
    "total": "2GB"
  }
}
```

---

### 健康检查

**GET** `/health`

```bash
curl http://localhost:8080/health
```

**响应：**

```json
{
  "status": "healthy",
  "timestamp": "2026-03-13T12:00:00Z"
}
```

---

## 🔐 认证

### 登录

**POST** `/auth/login`

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "xxx"}'
```

**响应：**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 86400
}
```

---

## 📱 渠道接口

### 飞书回调

**POST** `/webhooks/feishu`

飞书消息回调接口，由飞书服务器调用。

---

### 钉钉回调

**POST** `/webhooks/dingtalk`

钉钉消息回调接口。

---

## ❓ 错误响应

所有接口的错误响应格式：

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述"
  }
}
```

**常见错误码：**

| 错误码 | 说明 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未认证 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 429 | 请求过于频繁 |
| 500 | 服务器错误 |
| 503 | 服务不可用 |

---

## �示例

### JavaScript 调用

```javascript
const response = await fetch('http://localhost:8080/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: '你好',
    channel: 'feishu'
  })
});

const data = await response.json();
console.log(data.response);
```

### Python 调用

```python
import requests

response = requests.post(
    'http://localhost:8080/chat',
    json={'message': '你好', 'channel': 'feishu'}
)

print(response.json()['response'])
```
