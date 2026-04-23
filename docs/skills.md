# OpenClaw 技能开发指南

本文档介绍如何为 OpenClaw 开发自定义技能。

## 什么是技能？

技能（Skill）是 OpenClaw 的扩展模块，让 AI 能够执行特定任务。

## 创建新技能

### 1. 创建技能目录

```
~/.openclaw/skills/my-skill/
├── SKILL.md          # 技能定义（必需）
├── script.sh         # 执行脚本
└── ...
```

### 2. 编写 SKILL.md

```markdown
---
name: my-skill
description: 我的自定义技能
---

# 我的自定义技能

这个技能可以...

## 使用方法

告诉 AI "帮我xxx"
```

### 3. 技能结构示例

```markdown
---
name: weather
description: 查询天气信息
---

# 天气查询技能

根据用户输入的城市查询天气。

## 调用方式

用户可以说：
- "北京天气怎么样"
- "查询上海的天气"
- "明天天气如何"

## 输出格式

返回 JSON 格式：
```json
{
  "city": "北京",
  "weather": "晴",
  "temperature": "25°C"
}
```

## 依赖

- 需要网络访问
- 使用 wttr.in API
```

## 技能分类

| 分类 | 说明 | 示例 |
|------|------|------|
| automation | 自动化任务 | browser, email |
| search | 搜索功能 | web-search, exa |
| communication | 通讯 | feishu, dingtalk |
| data | 数据处理 | file, json |
| ai | AI 能力 | translate, summarize |
| utilities | 工具 | calculator, calendar |

## 技能市场

你开发的技能可以分享到技能市场：

1. 在 GitHub 上创建技能仓库
2. 提交到 OpenClaw 技能索引
3. 其他用户可以直接安装使用

## 示例技能

### 天气查询技能

```
~/.openclaw/skills/weather/
├── SKILL.md
└── weather.sh
```

```bash
#!/bin/bash
# 天气查询脚本
city=$1
curl -s "wttr.in/${city}?format=j1"
```

### 浏览器自动化

```
~/.openclaw/skills/browser/
├── SKILL.md
└── browser.ts
```

## 技能开发最佳实践

1. **清晰的描述** - SKILL.md 要写得清楚明白
2. **错误处理** - 做好异常情况处理
3. **日志记录** - 方便调试
4. **权限最小化** - 只请求需要的权限

## 发布技能

将技能发布到社区：

1. 创建 GitHub 仓库
2. 编写 README
3. 提交到 OpenClaw Skill Hub

---

详见 [技能市场文档](./skill-market.md)
