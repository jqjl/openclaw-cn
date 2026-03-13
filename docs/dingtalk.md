# 钉钉集成配置指南

本指南将帮助你配置钉钉机器人与 OpenClaw 中国版集成。

## 📋 前提条件

- 已注册钉钉开放平台账号
- 已创建企业内部开发应用

## 🔧 创建钉钉应用

### 1. 创建应用

1. 登录 [钉钉开放平台](https://open.dingtalk.com/)
2. 进入「应用开发」→「企业内部开发」
3. 点击「创建应用」
4. 填写应用名称和描述

### 2. 获取 App Key 和 App Secret

创建应用后，在应用详情页面获取：
- **App Key**（应用 Key）
- **App Secret**（应用密钥）

### 3. 添加权限

在「权限管理」中添加以下权限：

```
im:chat:list_all_members    # 获取群成员
im:chat:sendRobot         # 发送群消息
im:message:robot.send     # 机器人消息发送
im:message:send           # 发送消息
```

### 4. 发布应用

1. 在「版本发布」中创建新版本
2. 填写发布说明
3. 提交发布申请
4. 企业管理员审核通过

## ⚙️ 配置 OpenClaw

### 环境变量配置

```bash
# 钉钉配置
DINGTALK_APP_KEY=你的AppKey
DINGTALK_APP_SECRET=你的AppSecret
DINGTALK_AGENT_ID=你的AgentId

# 可选：启用钉钉
CHANNELS=dingtalk
```

### 或通过配置文件

在 `~/.openclaw/openclaw.json` 中配置：

```json
{
  "channels": {
    "dingtalk": {
      "enabled": true,
      "appKey": "你的AppKey",
      "appSecret": "你的AppSecret",
      "agentId": "你的AgentId"
    }
  }
}
```

## 🔗 Webhook 配置

### 获取Webhook地址

1. 在钉钉应用管理页面找到「消息推送」
2. 选择「群机器人」或「工作通知」
3. 创建机器人并获取 Webhook 地址

### Webhook 地址格式

```
https://oapi.dingtalk.com/robot/send?access_token=你的Token
```

## 🧪 测试

配置完成后，测试钉钉集成：

```bash
# 启动 OpenClaw
npm run dev

# 发送测试消息到钉钉
# 在钉钉群聊中添加机器人，发送消息测试
```

## 💬 支持的消息类型

- 文本消息 (text)
- Markdown 消息 (markdown)
- 图片消息 (image)
- 链接消息 (link)
- ActionCard 消息 (actionCard)
- FeedCard 消息 (feedCard)

## ❓ 常见问题

### Q: 消息发送失败怎么办？

1. 检查 App Secret 是否正确
2. 检查权限是否全部添加
3. 检查应用是否已发布
4. 检查 Webhook Token 是否有效

### Q: 如何发送艾特消息？

在消息内容中使用 `@ 手机号` 或 `@all` 来艾特成员。

### Q: 支持哪些消息类型？

- 纯文本
- Markdown 富文本
- 图片
- 链接卡片
- ActionCard 卡片消息

## 📞 支持

如有问题，请在 [GitHub Issues](https://github.com/jqjl/openclaw-cn/issues) 中提出。
