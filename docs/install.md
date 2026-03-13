# OpenClaw 中国版 - 安装指南

本指南将帮助你快速安装和配置 OpenClaw 中国版。

## 📋 环境要求

- **Node.js**: 18.x 或更高版本
- **npm** 或 **yarn**
- **Git**

## 🚀 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/jqjl/openclaw-cn.git
cd openclaw-cn
```

### 2. 安装依赖

```bash
npm install
# 或使用 yarn
yarn install
```

### 3. 配置

```bash
# 复制配置示例文件
cp config.example.json config.json

# 编辑配置文件
# 详见各平台的配置文档
```

### 4. 启动

```bash
# 开发模式
npm run dev

# 生产模式
npm run build
npm start
```

## ⚙️ 详细配置

### 1. 模型配置

编辑 `config.json`，配置你想要的模型：

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

详见 [模型配置文档](./models.md)

### 2. 飞书配置

如果使用飞书，详见 [飞书集成文档](./feishu.md)

### 3. 钉钉配置

如果使用钉钉，详见 [钉钉集成文档](./dingtalk.md)

## 🔧 常用命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 生产运行
npm start

# 运行测试
npm test

# 代码检查
npm run lint
```

## 🐳 Docker 部署

```bash
# 构建镜像
docker build -t openclaw-cn .

# 运行
docker run -d -p 8080:8080 openclaw-cn
```

## 📦 目录结构

```
openclaw-cn/
├── src/              # 源代码
├── docs/             # 文档
├── config/           # 配置文件
├── scripts/         # 脚本
└── ...
```

## ❓ 常见问题

### Q: 启动失败怎么办？

1. 检查 Node.js 版本是否正确（18.x+）
2. 检查依赖是否安装成功
3. 检查配置文件格式是否正确

### Q: 模型连接失败？

1. 检查 API Key 是否正确
2. 检查网络是否能访问模型服务商
3. 尝试使用其他模型

### Q: 如何后台运行？

```bash
# 使用 pm2
pm2 start npm --name openclaw -- run dev

# 使用 nohup
nohup npm run dev > /var/log/openclaw.log 2>&1 &
```

## 📞 获取帮助

- 📝 [提交 Issue](https://github.com/jqjl/openclaw-cn/issues)
- 💬 加入社区讨论

## 🔗 相关链接

- [OpenClaw 官方](https://openclaw.ai)
- [GitHub 仓库](https://github.com/jqjl/openclaw-cn)
