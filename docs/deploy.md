# OpenClaw 部署指南

本文档介绍 OpenClaw 中文版的各种部署方式。

## 🏠 本地部署

### 开发环境

```bash
# 克隆项目
git clone https://github.com/jqjl/openclaw-cn.git
cd openclaw-cn

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:8080
```

### 生产环境

```bash
# 构建
npm run build

# 启动生产服务器
npm start
```

---

## 🐳 Docker 部署

### 方式一：使用官方镜像

```bash
# 拉取镜像
docker pull openclaw/openclaw-cn

# 运行
docker run -d \
  -p 8080:8080 \
  -v ~/.openclaw:/root/.openclaw \
  openclaw/openclaw-cn
```

### 方式二：Dockerfile 自构建

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]
```

```bash
# 构建镜像
docker build -t openclaw-cn .

# 运行
docker run -d -p 8080:8080 openclaw-cn
```

### 方式三：Docker Compose

```yaml
version: '3.8'

services:
  openclaw:
    image: openclaw-cn
    ports:
      - "8080:8080"
    volumes:
      - ./config.json:/app/config.json
      - ~/.openclaw:/root/.openclaw
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

```bash
docker-compose up -d
```

---

## ☁️ 云服务器部署

### 阿里云 ECS

```bash
# 1. 创建 ECS 实例（推荐 2核4G）

# 2. 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. 克隆项目
git clone https://github.com/jqjl/openclaw-cn.git
cd openclaw-cn

# 4. 安装依赖
npm install

# 5. 配置
cp config.example.json config.json
vim config.json

# 6. 使用 PM2 运行
npm install -g pm2
pm2 start npm --name openclaw -- run start

# 7. 设置开机自启
pm2 startup
pm2 save
```

### 腾讯云 CVM

同上，在腾讯云控制台创建 CVM 后按步骤操作。

---

## 🔧 Nginx 配置

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📱 一键脚本

### Linux/macOS

```bash
curl -sL https://raw.githubusercontent.com/jqjl/openclaw-cn/main/scripts/install.sh | bash
```

### Windows PowerShell

```powershell
iwr -useb https://raw.githubusercontent.com/jqjl/openclaw-cn/main/scripts/install.ps1 | iex
```

---

## ☸️ Kubernetes 部署

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: openclaw-cn
spec:
  replicas: 2
  selector:
    matchLabels:
      app: openclaw-cn
  template:
    metadata:
      labels:
        app: openclaw-cn
    spec:
      containers:
      - name: openclaw-cn
        image: openclaw-cn:latest
        ports:
        - containerPort: 8080
        env:
        - name: NODE_ENV
          value: "production"
---
apiVersion: v1
kind: Service
metadata:
  name: openclaw-cn
spec:
  selector:
    app: openclaw-cn
  ports:
  - port: 80
    targetPort: 8080
```

---

## 🔒 安全配置

### 配置 HTTPS

使用 Let's Encrypt 免费证书：

```bash
# 安装 certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

### 防火墙配置

```bash
# 只开放必要端口
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

---

## 📊 监控

### PM2 监控

```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs

# 重启
pm2 restart openclaw
```

### 系统监控

```bash
# 安装 htop
sudo apt install htop

# 查看资源使用
htop
```

---

## ❓ 常见问题

### Q: 内存不足怎么办？

- 增加 swap: `sudo fallocate -l 2G /swapfile`
- 使用更小的模型
- 升级服务器配置

### Q: 启动失败？

- 检查端口是否被占用: `lsof -i :8080`
- 检查日志: `pm2 logs`
- 检查配置文件格式
