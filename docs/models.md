# 模型配置指南

本文档介绍如何在 OpenClaw 中文版中配置各种模型。

## 🏠 本地模型 (Ollama)

### 安装 Ollama

```bash
# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows
# 下载安装包：https://ollama.com/download
```

### 启动 Ollama

```bash
# 拉取模型
ollama pull qwen2.5:7b
ollama pull llama3.1:8b

# 启动服务
ollama serve
```

### 配置 OpenClaw

```json
{
  "models": {
    "default": {
      "provider": "ollama",
      "model": "qwen2.5:7b",
      "baseUrl": "http://localhost:11434"
    }
  }
}
```

## ☁️ 国内模型

### 阿里云百炼

```bash
# 环境变量
DASHSCOPE_API_KEY=your-api-key
```

```json
{
  "models": {
    "default": {
      "provider": "dashscope",
      "model": "qwen-max"
    }
  }
}
```

**可用模型：**
- `qwen-turbo` - 速度快
- `qwen-plus` - 均衡
- `qwen-max` - 最强

### MiniMax

```bash
# 环境变量
MINIMAX_API_KEY=your-api-key
```

```json
{
  "models": {
    "default": {
      "provider": "minimax",
      "model": "MiniMax-M2.5"
    }
  }
}
```

**可用模型：**
- `abab6.5s-chat` - 快速
- `abab6.5g-chat` - 均衡
- `MiniMax-M2.5` - 最强

### 智谱AI

```bash
# 环境变量
ZHIPU_API_KEY=your-api-key
```

```json
{
  "models": {
    "default": {
      "provider": "zhipu",
      "model": "glm-4-plus"
    }
  }
}
```

**可用模型：**
- `glm-4-flash` - 免费版
- `glm-4` - 标准版
- `glm-4-plus` - 增强版
- `glm-5` - 最新版

## 🌍 国际模型

### OpenAI

```bash
OPENAI_API_KEY=sk-...
```

```json
{
  "models": {
    "default": {
      "provider": "openai",
      "model": "gpt-4o"
    }
  }
}
```

### Anthropic Claude

```bash
ANTHROPIC_API_KEY=sk-ant-...
```

```json
{
  "models": {
    "default": {
      "provider": "anthropic",
      "model": "claude-3-5-sonnet"
    }
  }
}
```

## 🔄 模型切换

在配置文件中修改默认模型：

```json
{
  "models": {
    "default": {
      "provider": "dashscope",
      "model": "qwen-plus"
    },
    "fallback": {
      "provider": "minimax",
      "model": "MiniMax-M2.5"
    }
  }
}
```

## 💰 价格对比

| 模型 | 价格 | 适用场景 |
|------|------|---------|
| qwen-turbo | ¥1/1M tokens | 日常对话 |
| qwen-max | ¥20/1M tokens | 复杂推理 |
| MiniMax-M2.5 | ¥12/1M tokens | 高性价比 |
| glm-4-flash | 免费 | 测试/开发 |
| gpt-4o | $15/1M tokens | 国际业务 |

## 📝 多模型配置示例

```json
{
  "models": {
    "default": {
      "provider": "dashscope",
      "model": "qwen-max"
    },
    "fast": {
      "provider": "dashscope",
      "model": "qwen-turbo"
    },
    "claude": {
      "provider": "anthropic",
      "model": "claude-3-5-sonnet"
    },
    "local": {
      "provider": "ollama",
      "model": "llama3.1:8b"
    }
  }
}
```
