# 飞书集成配置指南

本指南将帮助你配置飞书机器人与 OpenClaw 中文版集成。

## 📋 前提条件

- 已注册飞书开放平台账号
- 已创建企业自建应用

## 🔧 创建飞书应用

### 1. 创建应用

1. 打开 [飞书开放平台](https://open.feishu.cn/)
2. 点击「创建应用」
3. 选择「企业自建应用」
4. 填写应用名称和描述

### 2. 获取 App ID 和 Secret

创建应用后，在应用详情页面获取：
- **App ID**（应用 ID）
- **App Secret**（应用密钥）

### 3. 添加权限

在「权限管理」中添加以下权限：

```
im:message:readonly      # 读取消息
im:message:send_as_bot  # 以机器人身份发送消息
im:chat:readonly        # 读取群信息
im:chat:write          # 写入群信息
im:group:readonly      # 读取群组
im:group:write         # 写入群组
contact:user.base:readonly # 读取用户基本信息
```

### 4. 发布应用

1. 在「版本管理与发布」中创建新版本
2. 填写发布说明
3. 提交发布申请
4. 企业管理员审核通过

## ⚙️ 配置 OpenClaw

### 环境变量配置

```bash
# 飞书配置
FEISHU_APP_ID=你的AppID
FEISHU_APP_SECRET=你的AppSecret

# 可选：启用飞书
CHANNELS=feishu
```

### 或通过配置文件

在 `~/.openclaw/openclaw.json` 中配置：

```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      "appId": "你的AppID",
      "appSecret": "你的AppSecret"
    }
  }
}
```

## 🔗 Webhook 配置

### 获取Webhook地址

1. 在飞书开放平台找到你的应用
2. 进入「添加应用能力」→「Webhook」
3. 填写回调地址（需要公网可访问的 URL）
4. 生成 Webhook 地址

### 配置回调地址

如果你的服务器没有公网 IP，可以使用：
- 内网穿透工具（如 ngrok、frp）
- 云函数（如阿里云函数计算）
- 固定公网 IP

## 🧪 测试

配置完成后，测试飞书集成：

```bash
# 启动 OpenClaw
npm run dev

# 发送测试消息到飞书
# 在飞书群聊中添加机器人，发送消息测试
```

## ❓ 常见问题

### Q: 消息发送失败怎么办？

1. 检查 App Secret 是否正确
2. 检查权限是否全部添加
3. 检查应用是否已发布

### Q: 如何开启主动消息？

需要在飞书开放平台配置「消息卡片」权限，并开启应用的可用状态。

### Q: 支持哪些消息类型？

- 文本消息
- 图片消息
- 富文本消息（post）
- 消息卡片（interactive card）
- @消息

## 📞 支持

如有问题，请在 [GitHub Issues](https://github.com/jqjl/openclaw-cn/issues) 中提出。
