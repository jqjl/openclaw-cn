# 第4章：第一个 Hello World（实战篇）

> 🎯 本章目标：从零开始创建一个完整的 AI 助手，包括项目初始化、代码编写、工具开发、渠道接入和运行测试。

上一章我们学习了 OpenClaw 的核心概念——Agent、Tool、Workflow、Memory、Channel。这一章我们要把这些概念付诸实践，亲手创建一个完整的 AI 助手。

本章采用"实战驱动"的方式，我们会创建一个"智能助手"，它能够：
- 回答日常问题
- 查询天气
- 搜索网页信息
- 通过飞书与人对话

准备好了吗？Let's do it! 🚀

---

## 4.1 项目初始化：从小白到项目结构

在开始写代码之前，我们需要先搭建一个规范的项目结构。

### 4.1.1 创建项目目录

```bash
# 切换到工作目录
cd ~/my-projects

# 创建项目目录
mkdir -p my-assistant
cd my-assistant

# 查看当前目录
pwd
# 输出：/root/my-projects/my-assistant
```

### 4.1.2 创建虚拟环境

```bash
# 创建虚拟环境
python3 -m venv venv

# 激活虚拟环境
source venv/bin/activate  # Linux/macOS
# 或 venv\Scripts\activate  # Windows

# 确认激活成功
which python
# 应该指向 venv/bin/python
```

### 4.1.3 安装 OpenClaw

```bash
# 安装 OpenClaw
pip install openclaw

# 安装其他可能用到的库
pip install requests pyyaml python-dotenv
```

### 4.1.4 创建项目文件结构

```
my-assistant/
├── venv/                    # 虚拟环境
├── config/
│   └── openclaw.yaml        # 配置文件
├── src/
│   ├── __init__.py
│   ├── app.py               # 主应用
│   ├── tools/               # 工具目录
│   │   ├── __init__.py
│   │   ├── weather.py
│   │   ├── search.py
│   │   └── calculator.py
│   ├── workflows/           # 工作流目录
│   │   ├── __init__.py
│   │   └── support.py
│   └── channels/            # 渠道配置
│       └── __init__.py
├── logs/                    # 日志目录
├── data/                    # 数据目录
├── requirements.txt         # 依赖列表
└── .env                     # 环境变量（敏感信息）
```

创建这些目录和文件：

```bash
# 创建目录结构
mkdir -p config src/tools src/workflows src/channels logs data

# 创建必要的 __init__.py
touch src/__init__.py
touch src/tools/__init__.py
touch src/workflows/__init__.py
touch src/channels/__init__.py

# 创建依赖文件
touch requirements.txt
```

### 4.1.5 编写 requirements.txt

```
openclaw>=0.1.0
requests>=2.28.0
pyyaml>=6.0
python-dotenv>=1.0.0
```

---

## 4.2 配置文件的艺术

好的配置让开发更顺畅，让部署更简单。

### 4.2.1 主配置文件 config/openclaw.yaml

```yaml
# openclaw.yaml - 智能助手配置文件

# ==================== LLM 配置 ====================
llm:
  # 模型提供商
  provider: minimax
  model: MiniMax-M2.5
  
  # 从环境变量读取 API Key（更安全）
  api_key: ${MINIMAX_API_KEY}
  
  # 生成参数
  temperature: 0.7
  max_tokens: 2000
  top_p: 0.9

# ==================== 助手配置 ====================
assistant:
  name: "小浪助手"
  description: "一个智能的生活助手"
  
  # 系统提示词
  system_prompt: |
    你是"小浪助手"，一个友好、有帮助的 AI 助手。
    
    你的特点：
    - 回答问题简洁明了
    - 喜欢用轻松的语气
    - 不知道的事情会诚实说明
    - 必要时使用工具获取信息
    
    你可以使用的工具：
    - 查询天气
    - 搜索网页
    - 进行数学计算
    - 查看企业知识库

# ==================== 记忆配置 ====================
memory:
  # 使用对话窗口记忆
  type: conversation_window
  window_size: 20

# ==================== 渠道配置 ====================
channel:
  type: feishu
  feishu:
    app_id: ${FEISHU_APP_ID}
    app_secret: ${FEISHU_APP_SECRET}
    verification_token: ${FEISHU_VERIFICATION_TOKEN}

# ==================== 日志配置 ====================
logging:
  level: INFO
  file: logs/openclaw.log
  console: true
  format: "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

# ==================== 其他配置 ====================
# 服务器配置
server:
  host: 0.0.0.0
  port: 8080

# 工具配置
tools:
  weather:
    enabled: true
    default_location: "北京"
  search:
    enabled: true
    max_results: 5
```

### 4.2.2 环境变量文件 .env

创建一个 `.env` 文件来存储敏感信息：

```bash
# .env - 环境变量（不要提交到版本控制！）

# LLM 配置
MINIMAX_API_KEY=your-minimax-api-key-here

# 飞书配置
FEISHU_APP_ID=cli_xxxxxxxxxxxxxxxxxx
FEISHU_APP_SECRET=your-app-secret-here
FEISHU_VERIFICATION_TOKEN=your-verification-token-here
```

> ⚠️ **重要**：记得把 `.env` 加入 `.gitignore`，不要把敏感信息提交到代码仓库！

```bash
# 创建 .gitignore
echo ".env" >> .gitignore
echo "venv/" >> .gitignore
echo "__pycache__/" >> .gitignore
echo "*.pyc" >> .gitignore
echo "logs/" >> .gitignore
echo "data/" >> .gitignore
```

### 4.2.3 加载环境变量

在代码中加载环境变量：

```python
# src/config.py - 配置加载模块

import os
from dotenv import load_dotenv

# 加载 .env 文件
load_dotenv()

def get_env(key: str, default=None):
    """获取环境变量"""
    return os.getenv(key, default)

# 使用示例
API_KEY = get_env("MINIMAX_API_KEY")
```

---

## 4.3 开发自定义工具

工具是让 AI 助手"能做事"的关键。这一节我们创建几个实用工具。

### 4.3.1 天气查询工具

创建 `src/tools/weather.py`：

```python
# src/tools/weather.py - 天气查询工具

import requests
from openclaw import tool

@tool(
    name="查询天气",
    description="获取指定城市的天气信息，包括温度、湿度、天气状况等"
)
def get_weather(city: str, date: str = "今天") -> str:
    """
    查询城市天气
    
    参数:
        city: 城市名称，如"北京"、"上海"、"广州"
        date: 日期，可选"今天"、"明天"、"后天"，默认"今天"
    
    返回:
        格式化的天气信息字符串
    
    示例:
        >>> get_weather("北京", "明天")
        "北京明天天气：晴，最高温度 15°C，最低温度 8°C，东南风3-4级"
    """
    # 使用 wttr.in API（免费，无需 API Key）
    try:
        # 转换日期参数
        date_map = {"今天": "0", "明天": "1", "后天": "2"}
        days = date_map.get(date, "0")
        
        # 请求天气数据
        url = f"https://wttr.in/{city}?format=j1&lang=zh"
        response = requests.get(url, timeout=10)
        
        if response.status_code != 200:
            return f"查询天气失败，请稍后重试"
        
        data = response.json()
        
        # 解析数据
        if days == "0":
            # 今天的数据
            current = data["current_condition"][0]
            result = f"{city}当前天气：\n"
            result += f"🌡️ 温度：{current['temp_C']}°C\n"
            result += f"💧 湿度：{current['humidity']}%\n"
            result += f"🌤️ 天气：{current['weatherDesc'][0]['value']}\n"
            result += f"🌬️ 风速：{current['windspeedKmph']} km/h"
        else:
            # 未来天数的数据
            weather = data["weather"][int(days)]
            result = f"{city}{date}天气：\n"
            result += f"🌡️ 温度：{weather['mintempC']}°C ~ {weather['maxtempC']}°C\n"
            result += f"💧 降雨概率：{weather['hourly'][0]['chanceofrain']}%\n"
            result += f"🌤️ 天气：{weather['hourly'][0]['weatherDesc'][0]['value']}"
        
        return result
        
    except requests.exceptions.Timeout:
        return "查询超时，请稍后重试"
    except Exception as e:
        return f"查询出错：{str(e)}"


# 测试
if __name__ == "__main__":
    print("=== 测试天气查询 ===")
    print(get_weather("北京"))
    print()
    print(get_weather("上海", "明天"))
```

### 4.3.2 网页搜索工具

创建 `src/tools/search.py`：

```python
# src/tools/search.py - 网页搜索工具

import requests
from openclaw import tool

@tool(
    name="搜索网页",
    description="搜索互联网上的信息，返回相关网页的标题和摘要"
)
def search_web(query: str, max_results: int = 5) -> str:
    """
    搜索网页信息
    
    参数:
        query: 搜索关键词
        max_results: 返回结果数量，默认5条，最多10条
    
    返回:
        格式化的搜索结果
    
    示例:
        >>> search_web("Python 教程", 3)
        "搜索结果：
        1. Python 官方文档 - 官方教程...
        2. 廖雪峰 Python 教程 - 通俗易懂...
        3. 菜鸟教程 Python - 适合初学者..."
    """
    # 使用 DuckDuckGo 搜索（免费，无需 API Key）
    try:
        # 限制结果数量
        max_results = min(max_results, 10)
        
        # 请求搜索结果
        url = "https://duckduckgo.com/"
        params = {
            "q": query,
            "format": "json",
            "no_html": "1",
            "skip_disambig": "1"
        }
        
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        
        response = requests.get(url, params=params, headers=headers, timeout=10)
        
        if response.status_code != 200:
            return f"搜索失败，请稍后重试"
        
        # 解析结果（简化版，实际需要解析 HTML）
        data = response.json()
        
        results = data.get("Results", [])
        
        if not results:
            return f"未找到与「{query}」相关的信息"
        
        # 格式化输出
        output = f"🔍 搜索「{query}」的结果：\n\n"
        
        for i, item in enumerate(results[:max_results], 1):
            title = item.get("Text", "")
            url = item.get("FirstURL", "")
            
            output += f"{i}. {title}\n"
            output += f"   🔗 {url}\n\n"
        
        return output.strip()
        
    except requests.exceptions.Timeout:
        return "搜索超时，请稍后重试"
    except Exception as e:
        return f"搜索出错：{str(e)}"


# 测试
if __name__ == "__main__":
    print("=== 测试网页搜索 ===")
    print(search_web("OpenClaw 框架"))
```

### 4.3.3 计算器工具

创建 `src/tools/calculator.py`：

```python
# src/tools/calculator.py - 计算器工具

import ast
import operator
from openclaw import tool

# 支持的运算符
operators = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.Pow: operator.pow,
    ast.Mod: operator.mod,
}

@tool(
    name="计算器",
    description="执行数学计算，支持加减乘除、乘方、取模等运算"
)
def calculate(expression: str) -> str:
    """
    数学计算器
    
    参数:
        expression: 数学表达式，如 "2+3*5"、"10**2"、"15%4"
    
    返回:
        计算结果
    
    示例:
        >>> calculate("2+3*5")
        "2+3*5 = 17"
        >>> calculate("10 / 3")
        "10 / 3 ≈ 3.33"
    """
    try:
        # 安全计算：只允许数字和运算符
        def safe_eval(node):
            if isinstance(node, ast.Num):
                return node.n
            elif isinstance(node, ast.BinOp):
                left = safe_eval(node.left)
                right = safe_eval(node.right)
                op_type = type(node.op)
                if op_type in operators:
                    return operators[op_type](left, right)
                else:
                    raise ValueError(f"不支持的运算符: {op_type}")
            elif isinstance(node, ast.UnaryOp) and isinstance(node.op, ast.USub):
                return -safe_eval(node.operand)
            else:
                raise ValueError(f"不支持的表达式: {expression}")
        
        # 解析表达式
        node = ast.parse(expression, mode='eval')
        result = safe_eval(node.body)
        
        # 格式化输出
        if isinstance(result, float):
            if result.is_integer():
                return f"{expression} = {int(result)}"
            else:
                return f"{expression} = {result:.4f}"
        else:
            return f"{expression} = {result}"
            
    except ValueError as e:
        return f"计算错误：{str(e)}"
    except Exception as e:
        return f"无法计算：表达式可能包含无效字符"


@tool(
    name="单位换算",
    description="进行常用单位之间的换算，如温度、长度、重量等"
)
def convert_units(value: float, from_unit: str, to_unit: str) -> str:
    """
    单位换算
    
    参数:
        value: 数值
        from_unit: 源单位
        to_unit: 目标单位
    
    示例:
        >>> convert_units(100, "celsius", "fahrenheit")
        "100°C = 212°F"
    """
    conversions = {
        # 温度
        ("celsius", "fahrenheit"): lambda c: c * 9/5 + 32,
        ("fahrenheit", "celsius"): lambda f: (f - 32) * 5/9,
        ("celsius", "kelvin"): lambda c: c + 273.15,
        ("kelvin", "celsius"): lambda k: k - 273.15,
        
        # 长度
        ("km", "miles"): lambda km: km * 0.621371,
        ("miles", "km"): lambda mi: mi * 1.60934,
        ("m", "feet"): lambda m: m * 3.28084,
        ("feet", "m"): lambda ft: ft * 0.3048,
        
        # 重量
        ("kg", "pounds"): lambda kg: kg * 2.20462,
        ("pounds", "kg"): lambda lb: lb * 0.453592,
    }
    
    key = (from_unit.lower(), to_unit.lower())
    
    if key not in conversions:
        return f"不支持的换算：{from_unit} → {to_unit}"
    
    try:
        result = conversions[key](value)
        return f"{value} {from_unit} = {result:.4f} {to_unit}"
    except Exception as e:
        return f"换算失败：{str(e)}"


# 测试
if __name__ == "__main__":
    print("=== 测试计算器 ===")
    print(calculate("2+3*5"))
    print(calculate("10**2"))
    print(calculate("15%4"))
    print()
    print("=== 测试单位换算 ===")
    print(convert_units(100, "celsius", "fahrenheit"))
    print(convert_units(100, "km", "miles"))
```

### 4.3.4 工具统一导出

创建 `src/tools/__init__.py`：

```python
# src/tools/__init__.py - 工具统一导出

from .weather import get_weather
from .search import search_web
from .calculator import calculate, convert_units

# 导出所有工具
__all__ = [
    "get_weather",
    "search_web",
    "calculate",
    "convert_units",
]
```

---

## 4.4 开发工作流：客服场景

接下来，我们创建一个实用的工作流——智能客服工作流。

### 4.4.1 创建工作流文件

创建 `src/workflows/support.py`：

```python
# src/workflows/support.py - 客服工作流

from openclaw import workflow

@workflow(name="智能客服")
def smart_support(user_question: str) -> str:
    """
    智能客服工作流
    
    根据用户问题类型，选择合适的处理方式：
    - 简单问题：直接回答
    - 需要查询：调用搜索工具
    - 复杂问题：转人工
    
    参数:
        user_question: 用户的问题
    
    返回:
        处理结果
    """
    # 简单问题库
    faq = {
        "退款": "退款申请已提交，预计1-3个工作日到账。",
        "发货": "您的订单已发货，快递单号：SF123456789",
        "退货": "请填写退货单，快递上门取件免费。",
        "运费险": "运费险生效中，退货可获得最高20元补贴。",
    }
    
    # 检查是否是常见问题
    for key, answer in faq.items():
        if key in user_question:
            return f"📋 根据您的问题，回复如下：\n\n{answer}\n\n如需更多帮助，请继续提问。"
    
    # 需要进一步查询
    return "我需要查询一下相关信息，请稍候..."


@workflow(name="订单查询")
def query_order(order_id: str = None, phone: str = None) -> str:
    """
    订单查询工作流
    
    参数:
        order_id: 订单号
        phone: 手机号（二选一）
    
    返回:
        订单信息
    """
    # 模拟订单数据
    orders = {
        "OD20240101001": {
            "status": "已发货",
            "items": ["iPhone 15 Pro 256GB 钛金属色"],
            "total": 8999,
            "express": "顺丰速运",
            "tracking_no": "SF123456789"
        },
        "OD20240101002": {
            "status": "待付款",
            "items": ["AirPods Pro 2"],
            "total": 1899,
            "express": None,
            "tracking_no": None
        }
    }
    
    if order_id and order_id in orders:
        order = orders[order_id]
        return format_order(order)
    elif phone:
        # 模拟手机号查询
        return f"手机号 {phone} 关联的订单：\n{format_order(orders['OD20240101001'])}"
    else:
        return "请提供订单号或手机号进行查询"


def format_order(order: dict) -> str:
    """格式化订单信息"""
    items = "、".join(order["items"])
    status_emoji = {"已发货": "📦", "待付款": "⏳", "已完成": "✅"}
    
    result = f"订单状态：{status_emoji.get(order['status'], '❓')} {order['status']}\n"
    result += f"商品：{items}\n"
    result += f"金额：¥{order['total']}\n"
    
    if order["tracking_no"]:
        result += f"快递：{order['express']} {order['tracking_no']}"
    
    return result
```

### 4.4.2 工作流统一导出

创建 `src/workflows/__init__.py`：

```python
# src/workflows/__init__.py - 工作流统一导出

from .support import smart_support, query_order

__all__ = [
    "smart_support",
    "query_order",
]
```

---

## 4.5 组装应用：主程序

现在，我们把所有组件组装在一起，创建主程序。

### 4.5.1 创建主程序 src/app.py

```python
# src/app.py - 主应用程序

import sys
import os

# 添加项目根目录到 Python 路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from openclaw import OpenClaw
from src.tools import get_weather, search_web, calculate, convert_units
from src.workflows import smart_support, query_order
from src.config import get_env


def create_app():
    """创建并配置 OpenClaw 应用"""
    
    # 1. 创建 OpenClaw 实例
    app = OpenClaw(
        config_path="config/openclaw.yaml"
    )
    
    # 2. 注册工具
    print("📦 注册工具...")
    app.register_tool(get_weather)
    app.register_tool(search_web)
    app.register_tool(calculate)
    app.register_tool(convert_units)
    
    # 3. 注册工作流
    print("🔄 注册工作流...")
    app.register_workflow(smart_support)
    app.register_workflow(query_order)
    
    print("✅ 应用创建    return app


完成！")
    
def main():
    """主函数"""
    print("\n" + "="*50)
    print("🚀 启动智能助手...")
    print("="*50 + "\n")
    
    # 创建应用
    app = create_app()
    
    # 启动服务
    print("\n📍 访问以下地址开始对话：")
    print("   - 本地：http://localhost:8080")
    print("   - 飞书：发送消息给机器人\n")
    
    # 从配置文件读取服务器配置
    host = "0.0.0.0"
    port = 8080
    
    app.run(host=host, port=port)


if __name__ == "__main__":
    main()
```

### 4.5.2 运行应用

```bash
# 确保虚拟环境已激活
source venv/bin/activate

# 设置环境变量（或者创建 .env 文件）
export MINIMAX_API_KEY="your-api-key"
export FEISHU_APP_ID="cli_xxxxx"
export FEISHU_APP_SECRET="xxxxx"
export FEISHU_VERIFICATION_TOKEN="xxxxx"

# 运行应用
python -m src.app
```

你应该看到类似这样的输出：

```
==================================================
🚀 启动智能助手...
==================================================

📦 注册工具...
✅ 注册工具：get_weather
✅ 注册工具：search_web
✅ 注册工具：calculate
✅ 注册工具：convert_units

🔄 注册工作流...
✅ 注册工作流：smart_support
✅ 注册工作流：query_order

✅ 应用创建完成！

📍 访问以下地址开始对话：
   - 本地：http://localhost:8080
   - 飞书：发送消息给机器人

INFO:openclaw:OpenClaw v0.1.0 启动成功
INFO:openclaw:Web 服务运行在 http://0.0.0.0:8080
```

---

## 4.6 测试与调试

应用启动后，我们需要测试它是否正常工作。

### 4.6.1 Web 界面测试

打开浏览器访问 `http://localhost:8080`，你应该能看到一个聊天界面。

尝试发送以下消息：

```
你好
帮我查一下北京明天天气
搜索 OpenClaw 的使用方法
计算 123 * 456
100 celsius 转 fahrenheit
```

### 4.6.2 命令行测试

创建 `src/cli.py` 用于命令行测试：

```python
# src/cli.py - 命令行测试工具

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from openclaw import OpenClaw
from src.tools import get_weather, search_web, calculate
from src.config import get_env

def main():
    """命令行交互"""
    
    # 加载配置
    app = OpenClaw(config_path="config/openclaw.yaml")
    
    # 注册工具
    app.register_tool(get_weather)
    app.register_tool(search_web)
    app.register_tool(calculate)
    
    print("🤖 智能助手命令行模式")
    print("输入你的问题，输入 'quit' 或 'exit' 退出\n")
    
    while True:
        try:
            user_input = input("你: ").strip()
            
            if not user_input:
                continue
                
            if user_input.lower() in ["quit", "exit", "退出"]:
                print("👋 再见！")
                break
            
            # 获取回复
            response = app.chat(user_input)
            print(f"\n助手: {response}\n")
            
        except KeyboardInterrupt:
            print("\n👋 再见！")
            break
        except Exception as e:
            print(f"\n❌ 出错：{str(e)}\n")


if __name__ == "__main__":
    main()
```

运行：

```bash
python -m src.cli
```

### 4.6.3 单元测试

创建 `tests/test_tools.py`：

```python
# tests/test_tools.py - 工具单元测试

import unittest
from src.tools.weather import get_weather
from src.tools.calculator import calculate, convert_units

class TestTools(unittest.TestCase):
    """工具测试"""
    
    def test_calculate_basic(self):
        """测试基本计算"""
        self.assertEqual(calculate("2+3"), "2+3 = 5")
        self.assertEqual(calculate("10-5"), "10-5 = 5")
        self.assertEqual(calculate("3*4"), "3*4 = 12")
    
    def test_calculate_complex(self):
        """测试复杂计算"""
        result = calculate("2+3*5")
        self.assertIn("17", result)
    
    def test_calculate_power(self):
        """测试乘方"""
        result = calculate("2**3")
        self.assertIn("8", result)
    
    def test_convert_temperature(self):
        """测试温度转换"""
        result = convert_units(100, "celsius", "fahrenheit")
        self.assertIn("212", result)
    
    def test_convert_distance(self):
        """测试距离转换"""
        result = convert_units(1, "km", "miles")
        self.assertIn("0.621", result)
    
    def test_weather(self):
        """测试天气查询（网络请求）"""
        result = get_weather("北京")
        self.assertIsInstance(result, str)
        self.assertTrue(len(result) > 0)


if __name__ == "__main__":
    unittest.main()
```

运行测试：

```bash
python -m pytest tests/ -v
```

---

## 4.7 部署到服务器

开发测试完成后，我们把它部署到服务器上。

### 4.7.1 使用 Systemd（Linux 服务器）

创建 systemd 服务文件：

```bash
sudo nano /etc/systemd/system/openclaw-assistant.service
```

写入以下内容：

```ini
[Unit]
Description=OpenClaw Assistant
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/my-assistant
Environment="PATH=/var/www/my-assistant/venv/bin"
Environment="MINIMAX_API_KEY=your-api-key"
Environment="FEISHU_APP_ID=cli_xxxxx"
Environment="FEISHU_APP_SECRET=xxxxx"
Environment="FEISHU_VERIFICATION_TOKEN=xxxxx"
ExecStart=/var/www/my-assistant/venv/bin/python -m src.app
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

启动服务：

```bash
# 重新加载 systemd
sudo systemctl daemon-reload

# 启动服务
sudo systemctl start openclaw-assistant

# 查看状态
sudo systemctl status openclaw-assistant

# 设置开机自启
sudo systemctl enable openclaw-assistant
```

### 4.7.2 使用 Docker 部署

创建 Dockerfile：

```dockerfile
# Dockerfile
FROM python:3.11-slim

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY requirements.txt .

# 安装依赖
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY . .

# 设置环境变量
ENV MINIMAX_API_KEY=${MINIMAX_API_KEY}
ENV FEISHU_APP_ID=${FEISHU_APP_ID}
ENV FEISHU_APP_SECRET=${FEISHU_APP_SECRET}
ENV FEISHU_VERIFICATION_TOKEN=${FEISHU_VERIFICATION_TOKEN}

# 暴露端口
EXPOSE 8080

# 启动应用
CMD ["python", "-m", "src.app"]
```

构建和运行：

```bash
# 构建镜像
docker build -t my-openclaw-assistant .

# 运行容器
docker run -d \
  --name openclaw-assistant \
  -p 8080:8080 \
  -e MINIMAX_API_KEY=your-api-key \
  -e FEISHU_APP_ID=cli_xxxxx \
  -e FEISHU_APP_SECRET=xxxxx \
  -e FEISHU_VERIFICATION_TOKEN=xxxxx \
  my-openclaw-assistant
```

---

## 4.8 小结 + 下章预告

### 🎯 这一章你学到了

- **项目初始化**：创建项目结构、虚拟环境、安装依赖
- **配置文件**：YAML 配置、环境变量管理
- **工具开发**：天气查询、网页搜索、计算器、单位换算
- **工作流开发**：智能客服、订单查询
- **应用组装**：注册工具、工作流，启动服务
- **测试调试**：Web 测试、命令行测试、单元测试
- **部署上线**：Systemd、Docker 部署

### 🚀 下章预告

**第5章：Agent 深度定制**

Hello World 已经完成！现在我们要让 Agent 更聪明、更个性化：

- 如何定制 Agent 的"性格"？
- 如何设置系统提示词？
- 如何实现多轮对话？
- 如何处理复杂对话流程？

**准备好继续深入了吗？** 🧠

---

> 📝 **思考题**：你在开发过程中遇到了什么问题？有什么想法和改进建议？在评论区聊聊！

---

*本章代码示例基于 OpenClaw v0.1.0 版本，具体 API 可能有细微调整，请以官方文档为准。*
