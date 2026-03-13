# 企业微信集成配置指南

本指南将帮助你配置企业微信与 OpenClaw 中国版集成。

## 📋 前提条件

- 已注册企业微信管理员账号
- 已创建企业自建应用

## 🔧 创建企业微信应用

### 1. 创建应用

1. 登录 [企业微信管理后台](https://work.weixin.qq.com/)
2. 进入「应用管理」→「自建应用」
3. 点击「创建应用」
4. 上传应用 logo、填写名称和描述

### 2. 获取应用凭证

创建应用后，在应用详情页面获取：
- **CorpID**（企业 ID）- 在「我的企业」中获取
- **AgentId**（应用 AgentId）
- **Secret**（应用密钥）

### 3. 配置应用权限

在应用的「API权限」中添加以下权限：

```
企业微信通讯录读取权限
消息推送权限
群聊会话权限
```

### 4. 设置可信域名

在「网页授权及JS-SDK」中设置可信域名。

## ⚙️ 配置 OpenClaw

### 环境变量配置

```bash
# 企业微信配置
WECHAT_WORK_CORP_ID=你的企业ID
WECHAT_WORK_AGENT_ID=你的AgentId
WECHAT_WORK_SECRET=你的Secret

# 可选：启用企业微信
CHANNELS=wechat-work
```

### 或通过配置文件

在 `~/.openclaw/openclaw.json` 中配置：

```json
{
  "channels": {
    "wechat-work": {
      "enabled": true,
      "corpId": "你的企业ID",
      "agentId": "你的AgentId",
      "secret": "你的Secret"
    }
  }
}
```

## 🔔 接收消息配置

### 1. 设置接收消息服务器

1. 在应用详情页面找到「接收消息」
2. 设置「回调URL」（需要公网可访问）
3. 设置「Token」和「EncodingAESKey」
4. 开启「回调模式」

### 2. 公网访问

如果服务器没有公网IP，可以使用：
- 内网穿透工具（ngrok、frp）
- 云函数
- NAT 端口映射

## 🧪 测试

配置完成后，测试企业微信集成：

```bash
# 启动 OpenClaw
npm run dev

# 发送测试消息到企业微信
```

## 💬 支持的消息类型

- 文本消息
- 图片消息
- 图文消息
- 小程序通知消息
- 模板消息

## ❓ 常见问题

### Q: 消息接收不到怎么办？

1. 检查回调URL是否可公网访问
2. 检查Token和EncodingAESKey是否正确
3. 检查应用是否已启用

### Q: 如何发送模板消息？

需要在企业微信后台创建模板，然后通过API发送。

### Q: 支持哪些消息类型？

- 文本
- 图片
- 图文
- 文件
- 语音

## 📞 支持

如有问题，请在 [GitHub Issues](https://github.com/jqjl/openclaw-cn/issues) 中提出。
