# OpenClaw 故障排除指南

本文档帮助你解决使用 OpenClaw 中文版时遇到的常见问题。

## 🚦 服务启动问题

### 问题：端口被占用

**错误信息：**
```
Error: listen EADDRINUSE: address already in use :::8080
```

**解决方案：**

```bash
# 查找占用端口的进程
lsof -i :8080

# 杀掉进程
kill -9 <PID>

# 或者使用其他端口
PORT=3000 npm run dev
```

---

### 问题：Node.js 版本过低

**错误信息：**
```
The engine compatibility error
```

**解决方案：**

```bash
# 检查版本
node --version

# 使用 nvm 升级
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

---

## 🤖 模型问题

### 问题：模型 API 调用失败

**可能原因：**
1. API Key 错误
2. 网络无法访问
3. 账户余额不足

**解决方案：**

```bash
# 1. 检查 API Key 配置
cat ~/.openclaw/openclaw.json | grep -A 5 "models"

# 2. 测试 API 连接
curl -s -H "Authorization: Bearer YOUR_API_KEY" https://api.example.com/v1/models

# 3. 检查账户余额
# 登录对应平台控制台查看
```

---

### 问题：模型响应超时

**解决方案：**

```json
{
  "models": {
    "default": {
      "provider": "dashscope",
      "model": "qwen-turbo",
      "timeout": 60000
    }
  }
}
```

---

## 📱 飞书集成问题

### 问题：消息发送失败

**检查清单：**

1. ✅ App ID 和 Secret 是否正确
2. ✅ 应用是否已发布
3. ✅ 权限是否全部添加
4. ✅ 回调 URL 是否可访问

**调试：**

```bash
# 查看飞书日志
# 在飞书开放平台的应用详情中查看调用日志

# 测试 API
curl -X POST "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal" \
  -H "Content-Type: application/json" \
  -d '{"app_id": "YOUR_APP_ID", "app_secret": "YOUR_APP_SECRET"}'
```

---

### 问题：Webhook 接收不到消息

**可能原因：**
1. URL 不通（需要公网可访问）
2. 验证 Token 错误
3. 服务器未运行

**解决方案：**

```bash
# 1. 使用内网穿透测试
# 推荐：ngrok, frp, cloudflare tunnel

# 2. 验证 Token
# 检查 openclaw.json 中的 feishu 配置

# 3. 检查服务器日志
pm2 logs
```

---

## 💾 数据库问题

### 问题：数据库连接失败

**错误信息：**
```
Error: connect ECONNREFUSED
```

**解决方案：**

```bash
# 检查数据库服务状态
# 如果使用 SQLite
ls -la *.db

# 如果使用 PostgreSQL
pg_isready

# 如果使用 MySQL
mysqladmin ping
```

---

## 🌐 网络问题

### 问题：国内访问国外 API 慢

**解决方案：**

1. 使用国内模型（阿里云、MiniMax、智谱）
2. 配置代理
3. 使用 OpenClaw 中文版优化过的模型

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

---

## 📝 配置问题

### 问题：配置文件格式错误

**错误信息：**
```
SyntaxError: Unexpected token
```

**解决方案：**

```bash
# 验证 JSON 格式
cat config.json | python3 -m json.tool

# 常见错误：
# 1. 缺少引号
# 2. 多了逗号
# 3. 中文编码问题
```

---

## 🔧 常用调试命令

```bash
# 查看服务状态
pm2 status

# 查看实时日志
pm2 logs --lines 100

# 重启服务
pm2 restart all

# 查看端口占用
netstat -tlnp

# 检查内存使用
free -h

# 检查磁盘空间
df -h
```

---

## 🆘 获取更多帮助

1. 📝 提交 Issue：https://github.com/jqjl/openclaw-cn/issues
2. 💬 加入社区
3. 📧 邮件联系

---

## 📋 错误代码参考

| 错误码 | 说明 | 解决方案 |
|--------|------|---------|
| EADDRINUSE | 端口被占用 | 更换端口或杀掉占用进程 |
| ECONNREFUSED | 连接被拒绝 | 检查服务是否运行 |
| 401 | 未授权 | 检查 API Key |
| 403 | 禁止访问 | 检查权限配置 |
| 404 | 资源不存在 | 检查配置路径 |
| 500 | 服务器错误 | 查看日志 |
