# OpenClaw 快速入门指南

> 5 分钟快速上手 OpenClaw

## 前置要求

- Node.js 18+
- npm 或 pnpm

## 安装

```bash
# 克隆项目
git clone https://github.com/pengge-ai/openclaw-cn.git
cd openclaw-cn

# 安装依赖
npm install
```

## 配置

创建 `~/.openclaw/config.yaml`：

```yaml
# 基础配置
host: "0.0.0.0"
port: 8080

# 大模型配置
models:
  default: minimax-chat/MiniMax-M2.5
  
providers:
  minimax:
    api_key: your_api_key_here
    base_url: https://api.minimax.chat/v1

# 飞书配置（可选）
feishu:
  app_id: your_app_id
  app_secret: your_app_secret
```

## 启动

```bash
# 启动 OpenClaw
openclaw start

# 或使用 npx
npx openclaw start
```

## 第一个 Agent

创建 `agents/hello.js`：

```javascript
export default {
  name: "hello",
  description: "简单的问候 Agent",
  
  async run(context) {
    const { message } = context;
    return {
      message: `你好！我是 OpenClaw Agent。`
    };
  }
};
```

## 运行 Agent

```bash
openclaw run hello
```

## 下一步

- 阅读 [第4章：第一个 Agent](./docs/chapter4-helloworld.md)
- 了解 [核心概念](./docs/chapter3-concepts.md)
- 探索 [飞书集成](./docs/chapter9-feishu-integration.md)

## 帮助

```bash
# 查看所有命令
openclaw help

# 查看状态
openclaw status
```

---

有问题？欢迎提交 Issue！
