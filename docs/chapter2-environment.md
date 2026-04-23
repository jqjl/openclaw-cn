# 第2章：环境准备与安装

> 🎯 本章目标：准备好开发环境，安装 OpenClaw，配置你的第一个 AI 助手，实现首次成功对话。

上一章我们了解了 OpenClaw 是什么——一个让 AI 不仅"能说"更能"能做"的框架。现在，是时候把它安装到你的电脑上了！

本章我们会手把手带你完成所有准备工作：环境检查、依赖安装、OpenClaw 本体安装、配置文件编写，以及最终——跑通你的第一个 Hello World。

Let's go! 🚀

---

## 2.1 环境准备：工欲善其事，必先利其器

在安装 OpenClaw 之前，我们需要确保你的电脑上具备必要的开发环境。这就像做饭前要准备好锅碗瓢盆一样——别嫌麻烦，这些准备工作能让后续开发顺畅很多。

### 2.1.1 操作系统选择

OpenClaw 支持三大操作系统：

| 操作系统 | 支持程度 | 推荐指数 | 备注 |
|----------|----------|----------|------|
| **Linux** | ⭐⭐⭐⭐⭐ | 🥇 最推荐 | 生产环境首选，官方主要维护 |
| **macOS** | ⭐⭐⭐⭐ | 🥈 推荐 | 开发体验好，部分功能有差异 |
| **Windows** | ⭐⭐⭐⭐ | 🥉 可用 | WSL2 环境下运行最佳 |

> 💡 **鹏哥建议**：如果你用的是 Windows，强烈建议安装 WSL2（Windows Subsystem for Linux 2）。这能让 OpenClaw 运行得更顺畅，而且大部分教程都是基于 Linux 写的。

#### Windows 用户：如何安装 WSL2？

如果你使用的是 Windows 10 或 Windows 11，按照以下步骤来：

```powershell
# 步骤1：以管理员身份打开 PowerShell
# 步骤2：启用 WSL 功能
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# 步骤3：启用虚拟机功能
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# 步骤4：设置 WSL2 为默认版本
wsl --set-default-version 2

# 步骤5：安装 Ubuntu（或其他 Linux 发行版）
wsl --install -d Ubuntu
```

安装完成后，你会在开始菜单看到"Ubuntu"应用。点击它，就像打开一个 Linux 终端一样，所有后续命令都在这里执行。

### 2.1.2 Python 环境

OpenClaw 是基于 Python 开发的，所以你需要安装 Python。

#### Python 版本要求

```
最低版本：Python 3.10+
推荐版本：Python 3.11 或 3.12
```

#### 检查你的 Python 版本

打开终端（Linux/macOS）或 WSL/命令提示符（Windows），输入：

```bash
# 检查 Python 版本
python3 --version

# 或者（某些系统上）
python --version
```

如果看到类似这样的输出，说明已经安装：

```
Python 3.11.8
```

如果没有安装，或者版本低于 3.10，请继续往下看。

#### 安装 Python（如果需要）

**Linux（Ubuntu/Debian）**

```bash
用户：# 更新软件包列表
sudo apt update

# 安装 Python 3.11 和相关工具
sudo apt install -y python3.11 python3.11-venv python3-pip

# 验证安装
python3.11 --version
```

**macOS 用户：**

```bash
# 使用 Homebrew 安装（如果没有 Homebrew，先去安装它）
brew install python@3.11

# 验证安装
python3.11 --version
```

**Windows 用户：**

直接去 Python 官网下载：https://www.python.org/downloads/

> ⚠️ **重要**：安装时记得勾选"Add Python to PATH"选项！

### 2.1.3 包管理器 pip

pip 是 Python 的包管理工具，通常随 Python 一起安装。我们来验证一下：

```bash
# 检查 pip 版本
pip --version

# 或者
pip3 --version
```

如果看到类似这样的输出，说明 pip 已经可用：

```
pip 23.2.1 from /usr/lib/python3.11/pip (python 3.11)
```

如果没有，我们可以手动安装：

```bash
# Linux/macOS
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
python3 get-pip.py
```

### 2.1.4 虚拟环境：为什么要用？

在正式安装 OpenClaw 之前，我想先跟你聊聊虚拟环境。

**什么是虚拟环境？**

想象一下：你同时在做两个项目。项目 A 需要 Django 2.2，项目 B 需要 Django 4.2。如果都装在同一个 Python 环境里，就会出现版本冲突，麻烦大了！

虚拟环境就是为解决这个问题而生的——它为每个项目创建独立的 Python 环境，项目之间互不干扰。

**怎么创建虚拟环境？**

```bash
# 创建虚拟环境（命名为 venv）
python3 -m venv openclaw-env

# 激活虚拟环境
# Linux/macOS:
source openclaw-env/bin/activate

# Windows (CMD):
openclaw-env\Scripts\activate.bat

# Windows (PowerShell):
openclaw-env\Scripts\Activate.ps1

# 激活后，命令行会显示环境名
(openclaw-env) user@hostname:~$ 
```

> 💡 **小技巧**：建议在项目目录下创建虚拟环境，这样 `.venv` 或 `venv` 文件夹就在项目根目录，一目了然。

**退出虚拟环境：**

```bash
deactivate
```

### 2.1.5 Git：代码版本控制

虽然不是必须，但 Git 对后续学习和使用 OpenClaw 非常有帮助：

```bash
# 检查是否已安装
git --version

# 如果没有安装：
# Linux
sudo apt install -y git

# macOS
brew install git
```

---

## 2.2 安装 OpenClaw：几种方式任你选

好了，环境准备完毕！现在到了关键时刻——安装 OpenClaw。

OpenClaw 提供了多种安装方式，你可以根据自己的需求选择：

### 2.2.1 方式一：pip 安装（推荐，最简单）

这是最简单的方式，适合大多数用户：

```bash
# 激活虚拟环境（如果还没激活）
source openclaw-env/bin/activate

# 安装 OpenClaw
pip install openclaw
```

如果你想安装最新的开发版本（可能包含新功能，但也可能不稳定）：

```bash
# 安装开发版
pip install openclaw --pre

# 或者直接从 GitHub 安装
pip install git+https://github.com/openclaw/openclaw.git
```

安装完成后，验证一下：

```bash
# 检查 OpenClaw 版本
openclaw --version

# 或者在 Python 中检查
python -c "import openclaw; print(openclaw.__version__)"
```

### 2.2.2 方式二：Docker 安装（适合生产环境）

如果你熟悉 Docker，使用 Docker 安装更加方便，而且环境隔离更好：

```bash
# 拉取官方镜像
docker pull openclaw/openclaw:latest

# 运行容器
docker run -d -p 8080:8080 \
  --name my-openclaw \
  -v $(pwd)/config:/app/config \
  -v $(pwd)/data:/app/data \
  openclaw/openclaw:latest
```

这样就能在容器中运行 OpenClaw，数据和配置保存在宿主机的目录中。

> 💡 **进阶技巧**：生产环境建议使用 `docker-compose` 来管理多个服务（OpenClaw + 数据库 + Redis 等）。

### 2.2.3 方式三：源码安装（适合开发者）

如果你想深入研究 OpenClaw 源码，或者想参与贡献，可以选择源码安装：

```bash
# 1. 克隆仓库
git clone https://github.com/openclaw/openclaw.git
cd openclaw

# 2. 创建虚拟环境
python3 -m venv venv
source venv/bin/activate

# 3. 安装依赖
pip install -e .

# 4. 验证安装
openclaw --version
```

> 🛠️ **开发者提示**：如果你想修改 OpenClaw 源码，使用 `pip install -e .`（editable mode）安装，这样你对源码的修改会立即生效，不需要重新安装。

### 2.2.4 安装过程中的常见问题

#### 问题 1：pip 版本太旧

如果看到类似这样的错误：

```
ERROR: Could not find a version that satisfies the requirement openclaw
ERROR: No matching distribution found for openclaw
```

先升级 pip：

```bash
pip install --upgrade pip
```

#### 问题 2：依赖安装失败

有时候某些系统依赖没有安装会导致失败。Linux 用户可以尝试：

```bash
# Ubuntu/Debian
sudo apt install -y python3-dev build-essential libssl-dev libffi-dev

# CentOS/RHEL
sudo yum install -y python3-devel gcc openssl-devel
```

#### 问题 3：网络问题

如果安装时网络有问题（国内访问 PyPI 慢），可以使用国内镜像源：

```bash
# 使用清华镜像
pip install openclaw -i https://pypi.tuna.tsinghua.edu.cn/simple

# 或者阿里云镜像
pip install openclaw -i https://mirrors.aliyun.com/pypi/simple/
```

---

## 2.3 配置文件：告诉 OpenClaw 你是谁

安装完成后，我们需要进行一些基本配置。OpenClaw 使用 YAML 格式的配置文件，这让配置变得清晰易懂。

### 2.3.1 配置文件结构

默认情况下，OpenClaw 会查找当前目录下的 `openclaw.yaml` 配置文件。我们来创建一个：

```bash
# 创建项目目录
mkdir -p ~/my-openclaw-assistant
cd ~/my-openclaw-assistant

# 创建配置文件
touch openclaw.yaml
```

然后用编辑器打开 `openclaw.yaml`，写入以下内容：

```yaml
# openclaw.yaml - 你的第一个 OpenClaw 配置

# ==================== LLM 配置 ====================
llm:
  # 选择模型提供商（支持 minimax, bailian, deepseek, openai 等）
  provider: minimax
  
  # 模型名称
  model: MiniMax-M2.5
  
  # API Key（从对应平台申请）
  api_key: your-api-key-here
  
  # API 基础地址（如果需要）
  # base_url: https://api.minimax.chat/v1
  
  # 温度参数（0-1，越高越有创意，越低越保守）
  temperature: 0.7

# ==================== 对话配置 ====================
assistant:
  # 助手名称
  name: "小浪助手"
  
  # 助手描述
  description: "一个友好的 AI 助手"
  
  # 系统提示词（告诉助手它应该做什么）
  system_prompt: |
    你是一个友好、有帮助的 AI 助手。
    你喜欢用轻松的语气回答问题，
    但在涉及重要信息时要保持准确。

# ==================== 日志配置 ====================
logging:
  # 日志级别：DEBUG, INFO, WARNING, ERROR
  level: INFO
  
  # 日志文件路径
  file: ./logs/openclaw.log
  
  # 控制台输出
  console: true
```

### 2.3.2 LLM 提供商配置

OpenClaw 支持多种 LLM 提供商，以下是常见配置：

#### MiniMax（推荐国内用户）

```yaml
llm:
  provider: minimax
  model: MiniMax-M2.5
  api_key: your-minimax-api-key
  temperature: 0.7
```

#### 阿里云百炼

```yaml
llm:
  provider: bailian
  model: qwen-plus
  api_key: your-bailian-api-key
  base_url: https://dashscope.aliyuncs.com/compatible-mode/v1
  temperature: 0.7
```

#### DeepSeek

```yaml
llm:
  provider: deepseek
  model: deepseek-chat
  api_key: your-deepseek-api-key
  base_url: https://api.deepseek.com/v1
  temperature: 0.7
```

#### OpenAI（如果你有科学上网）

```yaml
llm:
  provider: openai
  model: gpt-4o
  api_key: your-openai-api-key
  base_url: https://api.openai.com/v1
  temperature: 0.7
```

> 💡 **如何获取 API Key？**
> - MiniMax：访问 https://platform.minimax.io/
> - 阿里云百炼：访问 https://dashscope.console.aliyun.com/
> - DeepSeek：访问 https://platform.deepseek.com/
> - OpenAI：访问 https://platform.openai.com/

### 2.3.3 渠道配置：连接你的通讯工具

OpenClaw 支持多种渠道接入，包括飞书、企业微信、钉钉等。我们先配置飞书：

```yaml
# ==================== 飞书渠道配置 ====================
channel:
  type: feishu
  
  feishu:
    # 从飞书开放平台获取
    app_id: cli_xxxxxxxxxxxxx
    app_secret: your-app-secret
    
    # 验证 Token（用于接收消息）
    verification_token: your-verification-token
    
    # 加密密钥（如果启用了加密）
    # encrypt_key: your-encrypt-key
```

关于飞书配置的详细步骤，我们会在第 9 章《飞书集成实战》中详细讲解。现在先了解结构即可。

---

## 2.4 第一个 Hello World：跑通你的第一个 AI 助手

激动人心的时刻到了！我们来创建并运行你的第一个 OpenClaw 应用。

### 2.4.1 创建应用代码

在项目目录下创建 `app.py` 文件：

```python
# app.py - 你的第一个 OpenClaw 应用

from openclaw import OpenClaw
from openclaw.tools import weather

# 1. 创建 OpenClaw 实例
app = OpenClaw(config_path="openclaw.yaml")

# 2. 注册工具（可选）
# 天气查询工具
app.register_tool(weather.get_weather)

# 3. 启动应用
if __name__ == "__main__":
    print("🚀 启动 OpenClaw 助手...")
    print("📍 访问 http://localhost:8080 开始对话")
    
    # 启动 Web 服务
    app.run(host="0.0.0.0", port=8080)
```

### 2.4.2 创建一个简单的工具

除了使用内置工具，我们也可以自己定义工具。创建一个 `tools.py` 文件：

```python
# tools.py - 自定义工具示例

from openclaw import tool

@tool(name="打招呼", description="向用户问好")
def say_hello(name: str = "朋友") -> str:
    """
    这是一个简单的打招呼工具
    
    参数:
        name: 对方的名字
    
    返回:
        问候语
    """
    return f"你好，{name}！很高兴认识你！🎉"

@tool(name="计算器", description="执行简单的数学计算")
def calculate(expression: str) -> str:
    """
    计算数学表达式
    
    参数:
        expression: 数学表达式，如 "2+3*5"
    
    返回:
        计算结果
    """
    try:
        # 注意：eval 有安全风险，生产环境请使用安全的数学解析器
        result = eval(expression, {"__builtins__": {}}, {})
        return f"计算结果：{expression} = {result}"
    except Exception as e:
        return f"计算出错：{str(e)}"
```

然后更新 `app.py`：

```python
# app.py - 更新版本

from openclaw import OpenClaw
from tools import say_hello, calculate  # 导入我们自定义的工具

# 创建 OpenClaw 实例
app = OpenClaw(config_path="openclaw.yaml")

# 注册自定义工具
app.register_tool(say_hello)
app.register_tool(calculate)

# 启动应用
if __name__ == "__main__":
    print("🚀 启动 OpenClaw 助手...")
    app.run(host="0.0.0.0", port=8080)
```

### 2.4.3 运行应用

在终端中运行：

```bash
# 激活虚拟环境（如果还没激活）
source openclaw-env/bin/activate

# 运行应用
python app.py
```

你应该会看到类似这样的输出：

```
🚀 启动 OpenClaw 助手...
📍 访问 http://localhost:8080 开始对话
INFO:openclaw:OpenClaw v0.1.0 启动成功
INFO:openclaw:已加载工具：打招呼, 计算器
INFO:openclaw:Web 服务运行在 http://0.0.0.0:8080
```

### 2.4.4 测试对话

现在打开浏览器，访问 `http://localhost:8080`。你应该能看到一个聊天界面。

试着发送以下消息：

- "你好！"
- "帮我算一下 100+200*3"
- "我叫小明，跟我打个招呼"

如果一切正常，你会收到 AI 的回复！

### 2.4.5 命令行模式

除了 Web 界面，你也可以使用命令行模式进行对话：

```python
# cli.py - 命令行版本

from openclaw import OpenClaw

app = OpenClaw(config_path="openclaw.yaml")

print("🤖 OpenClaw 命令行模式")
print("输入你的问题，输入 'quit' 或 'exit' 退出\n")

while True:
    user_input = input("你: ")
    
    if user_input.lower() in ["quit", "exit", "退出"]:
        print("👋 再见！")
        break
    
    # 获取回复
    response = app.chat(user_input)
    print(f"助手: {response}\n")
```

运行：

```bash
python cli.py
```

---

## 2.5 目录结构：一个标准的 OpenClaw 项目

随着项目变大，我们需要一个清晰的文件结构：

```
my-openclaw-assistant/
├── openclaw.yaml          # 主配置文件
├── app.py                 # 应用入口
├── cli.py                 # 命令行入口（可选）
├── tools/                 # 工具目录
│   ├── __init__.py
│   ├── weather.py         # 天气工具
│   ├── search.py          # 搜索工具
│   └── ...
├── workflows/             # 工作流目录
│   ├── __init__.py
│   ├── onboarding.py     # 入职流程
│   └── approval.py       # 审批流程
├── plugins/               # 插件目录
├── logs/                  # 日志目录
├── data/                  # 数据目录
└── venv/                  # 虚拟环境（如果放在项目根目录）
```

### 2.5.1 __init__.py 的作用

每个目录下创建一个空的 `__init__.py` 文件，可以让 Python 将该目录识别为包：

```bash
# 创建目录和 __init__.py 文件
mkdir -p tools workflows
touch tools/__init__.py workflows/__init__.py
```

---

## 2.6 常见问题与解决方案

### 问题 1：API Key 无效

如果看到类似这样的错误：

```
Error: Invalid API Key
```

请检查：
1. 配置文件中的 `api_key` 是否正确
2. API Key 是否有足够的配额
3. 是否填写了正确的 `base_url`

### 问题 2：连接超时

```
Error: Connection timeout
```

可能的原因：
- 网络问题（需要代理）
- API 服务商宕机
- 请求频率过高被限流

解决思路：
1. 检查网络连接
2. 配置代理
3. 查看 API 服务商状态

### 问题 3：模型不支持某个功能

```
Error: Model does not support function calling
```

某些模型版本不支持工具调用。请：
1. 更换支持的模型
2. 或者降级/升级模型版本

### 问题 4：端口被占用

```
Error: [Errno 98] Address already in use
```

8080 端口被其他程序占用。解决：
1. 换用其他端口：`app.run(port=8081)`
2. 找到占用端口的进程并关闭

---

## 2.7 小结 + 下章预告

### 🎯 这一章你学到了

- **环境准备**：操作系统选择、Python 安装、虚拟环境、Git
- **安装 OpenClaw**：pip、Docker、源码安装三种方式
- **配置文件**：YAML 格式配置、LLM 提供商选择、渠道配置
- **Hello World**：创建第一个应用并成功运行
- **项目结构**：标准的 OpenClaw 项目目录结构

### 🚀 下章预告

**第3章：核心概念与架构**

我们已经跑通了第一个示例，现在是时候深入理解 OpenClaw 的内部原理了！

- Agent（智能体）是什么？
- Tool（工具）是如何工作的？
- Workflow（工作流）如何编排复杂任务？
- 消息流是如何在系统中流转的？

**准备好深入探索 OpenClaw 的内部世界了吗？** 🧠

---

> 📝 **思考题**：你在安装过程中遇到了什么问题？在评论区说说，帮你解决！

---

*本章代码示例基于 OpenClaw v0.1.0 版本，具体 API 可能有细微调整，请以官方文档为准。*
