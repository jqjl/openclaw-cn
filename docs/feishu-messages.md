# 飞书消息类型详解

本文档详细介绍飞书支持的各种消息类型及使用方法。

## 📝 文本消息

### 请求示例

```json
{
  "msg_type": "text",
  "content": {
    "text": "这是飞书机器人发送的文本消息"
  }
}
```

### 使用场景
- 简单文字回复
- 格式化文本
- 代码片段

## 📄 富文本消息 (post)

### 结构

```json
{
  "msg_type": "post",
  "content": {
    "post": {
      "zh_cn": {
        "title": "标题",
        "content": [
          [
            {
              "tag": "text",
              "text": "这是加粗文字",
              "style": {"bold": true}
            }
          ],
          [
            {
              "tag": "text",
              "text": "这是普通文字"
            }
          ]
        ]
      }
    }
  }
}
```

### 支持的标签

| 标签 | 说明 | 示例 |
|------|------|------|
| text | 文本 | 普通文字、加粗、斜体 |
| a | 链接 | 超链接 |
| img | 图片 | 图片 |
| at | @成员 | @某人 |

### 完整示例

```json
{
  "msg_type": "post",
  "content": {
    "post": {
      "zh_cn": {
        "title": "📢 通知",
        "content": [
          [
            {"tag": "text", "text": "大家好！\n"}
          ],
          [
            {"tag": "text", "text": "今天是 OpenClaw 中国版发布日！", "style": {"bold": true}}
          ],
          [
            {"tag": "a", "text": "查看详情 →", "href": "https://github.com/jqjl/openclaw-cn"}
          ]
        ]
      }
    }
  }
}
```

## 🃏 消息卡片 (interactive)

### 基础卡片

```json
{
  "msg_type": "interactive",
  "card": {
    "header": {
      "title": {
        "tag": "plain_text",
        "content": "🎉 欢迎使用"
      },
      "template": "green"
    },
    "elements": [
      {
        "tag": "div",
        "text": {
          "tag": "plain_text",
          "content": "这是 OpenClaw 中国版"
        }
      }
    ]
  }
}
```

### 卡片模板颜色

| 模板 | 颜色 | 适用场景 |
|------|------|---------|
| default | 灰色 | 普通消息 |
| primary | 蓝色 | 主要操作 |
| success | 绿色 | 成功消息 |
| warning | 黄色 | 警告 |
| danger | 红色 | 错误/危险 |

### 带按钮的卡片

```json
{
  "msg_type": "interactive",
  "card": {
    "header": {
      "title": {
        "tag": "plain_text",
        "content": "📋 请选择"
      }
    },
    "elements": [
      {
        "tag": "action",
        "actions": [
          {
            "tag": "button",
            "text": {
              "tag": "plain_text",
              "content": "确认 ✅"
            },
            "type": "primary",
            "action_id": "confirm"
          },
          {
            "tag": "button",
            "text": {
              "tag": "plain_text",
              "content": "取消 ❌"
            },
            "type": "default",
            "action_id": "cancel"
          }
        ]
      }
    ]
  }
}
```

### 表单卡片

```json
{
  "msg_type": "interactive",
  "card": {
    "elements": [
      {
        "tag": "input",
        "label": {
          "tag": "plain_text",
          "content": "请输入内容"
        },
        "element": {
          "tag": "plain_text_input",
          "action_id": "user_input"
        }
      },
      {
        "tag": "action",
        "actions": [
          {
            "tag": "button",
            "text": {"tag": "plain_text", "content": "提交"},
            "type": "primary",
            "action_id": "submit"
          }
        ]
      }
    ]
  }
}
```

## 🖼️ 图片消息

```json
{
  "msg_type": "image",
  "content": {
    "image_key": "图片的 image_key"
  }
}
```

> 💡 图片需要先通过飞书 API 上传获取 image_key

## 🔗 分享消息 (share_chat)

```json
{
  "msg_type": "share_chat",
  "content": {
    "share_chat_id": "群聊ID"
  }
}
```

## 📌 消息模板

飞书提供消息模板功能，可以在后台定义常用消息格式：

1. 登录飞书开放平台
2. 进入「消息模板」
3. 创建模板
4. 通过 API 调用模板

---

## ❓ 常见问题

### Q: 如何发送 @所有人的消息？

```json
{
  "msg_type": "text",
  "content": {
    "text": "@all 这是一条@所有人的消息"
  }
}
```

### Q: 如何发送私聊消息？

需要使用「工作通知」能力，详见 [飞书开发文档](https://open.feishu.cn/document/)

### Q: 卡片消息点击后如何处理？

需要配置回调地址处理 `action_id`，详见交互卡片开发文档。
