# OpenClaw 中国版 - 快速入门

本指南将帮助你在 5 分钟内快速启动 OpenClaw 中国版。

## 🚀 5分钟快速开始

### 第1步：环境准备

确保你已经安装：
- Node.js 18.x+
- Git

```bash
# 检查版本
node --version  # 应该显示 v18.x 或更高
git --version
```

### 第2步：克隆项目

```bash
git clone https://github.com/jqjl/openclaw-cn.git
cd openclaw-cn
```

### 第3步：安装依赖

```bash
npm install
```

### 第4步：配置模型

编辑 `config.json`：

```json
{
  "models": {
    "default": {
      "provider": "dashscope",
      "model": "qwen-turbo"
    }
  }
}
```

> 💡 推荐先用免费的 `qwen-turbo` 测试

### 第5步：启动

```bash
npm run dev
```

看到类似输出就成功了：
```
🌊 OpenClaw 中国版已启动
📡 监听 http://localhost:8080
```

---

## 📱 连接飞书（可选）

### 获取飞书凭证

1. 打开 [飞书开放平台](https://open.feishu.cn/)
2. 创建自建应用
3. 获取 App ID 和 App Secret
4. 添加权限并发布

### 配置飞书

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

### 重启服务

```bash
# 按 Ctrl+C 停止
# 重新启动
npm run dev
```

---

## 💬 发送第一条消息

启动后，你可以通过以下方式与 OpenClaw 对话：

### 方式1：命令行

```bash
curl -X POST http://localhost:8080/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "你好！"}'
```

### 方式2：飞书

在飞书中@你的机器人发送消息

---

## ❓ 遇到问题？

| 问题 | 解决方案 |
|------|---------|
| 启动失败 | 检查 Node.js 版本 |
| 模型连接失败 | 检查 API Key 是否正确 |
| 消息发不出去 | 检查飞书配置 |

详见 [安装指南](./install.md)

---

## 下一步

- [配置更多模型](./models.md)
- [配置飞书机器人](./feishu.md)
- [配置钉钉](./dingtalk.md)
- [开发自定义技能](./skills.md)
