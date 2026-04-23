# 第6章：工具系统进阶

> 🎯 本章目标：掌握高级工具开发技巧，让 Agent 拥有"超能力"。

上一章我们创建了简单的工具（天气、计算器），这一章我们来探索更强大的工具类型：HTTP 调用、浏览器自动化、数据库操作、第三方 API 集成。

学完这一章，你的 Agent 就能真正做到"无所不能"。

---

## 6.1 HTTP 工具高级用法

### 6.1.1 基础 HTTP 工具

HTTP 工具是最常用的一类，让 Agent 能访问各种 Web API：

```python
from openclaw import tool
import httpx

@tool(
    name="获取用户信息",
    description="根据用户ID查询用户详细信息",
    parameters={
        "user_id": {"type": "string", "description": "用户ID", "required": True}
    }
)
def get_user_info(user_id: str) -> dict:
    """查询用户信息"""
    response = httpx.get(
        f"https://api.example.com/users/{user_id}",
        headers={"Authorization": f"Bearer {API_TOKEN}"},
        timeout=10
    )
    response.raise_for_status()
    return response.json()
```

### 6.1.2 声明式 HTTP 工具

OpenClaw 支持更简洁的声明式写法：

```python
from openclaw.tools import http

# GET 请求
@http.get(
    url="https://api.example.com/users/{user_id}",
    name="查询用户",
    description="根据ID查询用户信息"
)
def get_user(user_id: str) -> dict:
    """查询用户"""
    pass  # 框架自动处理

# POST 请求
@http.post(
    url="https://api.example.com/orders",
    name="创建订单",
    description="创建新的订单"
)
def create_order(product_id: str, quantity: int, user_id: str) -> dict:
    """创建订单"""
    pass

# 带认证的请求
@http.get(
    url="https://api.example.com/profile",
    headers={"Authorization": "Bearer ${API_TOKEN}"},
    name="获取个人资料"
)
def get_profile() -> dict:
    pass
```

### 6.1.3 处理复杂响应

API 返回的数据往往很复杂，需要转换：

```python
from openclaw import tool
import httpx

@tool(
    name="查询商品",
    description="搜索商品信息，返回简化的结果"
)
def search_product(keyword: str, limit: int = 5) -> str:
    """搜索商品"""
    # 调用 API
    response = httpx.get(
        "https://api.shop.com/products/search",
        params={"q": keyword, "limit": limit}
    )
    data = response.json()
    
    # 转换为友好格式
    results = []
    for item in data.get("items", [])[:limit]:
        results.append(f"""
📦 {item['name']}
💰 价格：¥{item['price']}
⭐ 评分：{item['rating']}
🔗 链接：{item['url']}
""")
    
    return "\n---\n".join(results) if results else "未找到相关商品"
```

### 6.1.4 错误处理和重试

```python
from openclaw import tool
import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

@tool(name="可靠的API调用")
@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10)
)
def reliable_api_call(url: str) -> dict:
    """带重试的 API 调用"""
    try:
        response = httpx.get(url, timeout=10)
        response.raise_for_status()
        return response.json()
    except httpx.TimeoutException:
        raise Exception("API 超时，正在重试...")
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 429:
            raise Exception("请求过于频繁，稍后重试")
        elif e.response.status_code >= 500:
            raise Exception("服务器错误，正在重试...")
        else:
            raise Exception(f"请求失败: {e.response.status_code}")
```

### 6.1.5 流式响应处理

某些 API 返回流式数据，需要特殊处理：

```python
from openclaw import tool
import httpx

@tool(name="流式数据获取")
async def stream_data(url: str) -> str:
    """处理流式响应"""
    results = []
    
    async with httpx.AsyncClient() as client:
        async with client.stream("GET", url) as response:
            async for line in response.aiter_lines():
                if line:
                    results.append(line)
    
    return "\n".join(results)
```

---

## 6.2 浏览器自动化工具

### 6.2.1 为什么需要浏览器自动化？

有些任务 API 解决不了：

- ❌ 网站 API 不公开
- ❌ 操作需要登录态
- ❌ 需要点击、滚动、填表等交互
- ✅ **浏览器自动化**完美解决！

### 6.2.2 基础浏览器操作

```python
from openclaw import tool
from playwright.sync_api import sync_playwright

@tool(
    name="打开网页",
    description="使用浏览器打开指定URL并截图"
)
def open_and_screenshot(url: str) -> str:
    """打开网页并截图"""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # 访问页面
        page.goto(url, wait_until="networkidle")
        
        # 截图保存
        screenshot_path = f"/tmp/screenshot_{hash(url)}.png"
        page.screenshot(path=screenshot_path)
        
        browser.close()
        
        return f"已保存截图到 {screenshot_path}"
```

### 6.2.3 表单填写和提交

```python
from openclaw import tool
from playwright.sync_api import sync_playwright

@tool(
    name="自动填表",
    description="自动填写网页表单并提交"
)
def fill_form(url: str, form_data: dict) -> str:
    """
    自动填写表单
    
    Args:
        url: 表单页面 URL
        form_data: 表单数据 {"字段名": "值"}
    
    Returns:
        操作结果
    """
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # 打开页面
        page.goto(url)
        
        # 填写表单
        for field, value in form_data.items():
            selector = f'[name="{field}"], #{field}, .{field}'
            page.fill(selector, str(value))
        
        # 提交表单
        page.click('button[type="submit"], input[type="submit"]')
        
        # 等待结果
        page.wait_for_load_state("networkidle")
        
        # 获取结果
        result_url = page.url
        result_text = page.text_content("body")
        
        browser.close()
        
        return f"表单已提交，当前URL: {result_url}"
```

### 6.2.4 网页数据抓取

```python
from openclaw import tool
from playwright.sync_api import sync_playwright

@tool(
    name="抓取网页内容",
    description="从网页中提取指定内容"
)
def scrape_website(url: str, selectors: dict) -> dict:
    """
    抓取网页数据
    
    Args:
        url: 目标网页
        selectors: CSS选择器 {"字段名": "选择器"}
    
    Returns:
        提取的数据
    """
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url, wait_until="networkidle")
        
        result = {}
        for field, selector in selectors.items():
            elements = page.query_selector_all(selector)
            if elements:
                result[field] = [el.text_content().strip() for el in elements]
            else:
                result[field] = []
        
        browser.close()
        return result

# 使用示例
data = scrape_website(
    url="https://news.example.com",
    selectors={
        "titles": "h2.title",
        "summaries": ".summary",
        "links": "a.article-link"
    }
)
```

### 6.2.5 登录态管理

```python
from openclaw import tool
from playwright.sync_api import sync_playwright
import json
import os

# 登录状态存储路径
AUTH_STATE_PATH = "/tmp/auth_states"

@tool(name="保存登录状态")
def save_auth_state(site_name: str, login_url: str, credentials: dict) -> str:
    """登录并保存状态"""
    os.makedirs(AUTH_STATE_PATH, exist_ok=True)
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)  # 显示浏览器方便登录
        context = browser.new_context()
        page = context.new_page()
        
        # 访问登录页
        page.goto(login_url)
        
        # 填写登录信息（根据网站调整选择器）
        page.fill('input[type="text"], input[type="email"]', credentials["username"])
        page.fill('input[type="password"]', credentials["password"])
        page.click('button[type="submit"]')
        
        # 等待登录完成
        page.wait_for_url("**/dashboard**", timeout=30000)
        
        # 保存登录状态
        state_path = f"{AUTH_STATE_PATH}/{site_name}.json"
        context.storage_state(path=state_path)
        
        browser.close()
        return f"登录状态已保存到 {state_path}"

@tool(name="使用登录状态访问")
def visit_with_auth(site_name: str, url: str) -> str:
    """使用保存的登录状态访问页面"""
    state_path = f"{AUTH_STATE_PATH}/{site_name}.json"
    
    if not os.path.exists(state_path):
        return "未找到登录状态，请先登录"
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(storage_state=state_path)
        page = context.new_page()
        
        page.goto(url)
        content = page.content()
        
        browser.close()
        return content
```

### 6.2.6 浏览器工具配置

```yaml
# config.yaml
tools:
  browser:
    enabled: true
    # 浏览器类型
    browser: chromium  # chromium / firefox / webkit
    
    # 无头模式
    headless: true
    
    # 超时设置
    timeout: 30000
    
    # 代理（可选）
    proxy:
      server: "http://proxy.example.com:8080"
      username: "user"
      password: "pass"
    
    # User-Agent
    user_agent: "Mozilla/5.0 ..."
    
    # 存储目录
    storage_dir: "./browser_data"
```

---

## 6.3 数据库操作工具

### 6.3.1 基础数据库连接

```python
from openclaw import tool
import sqlite3
from contextlib import contextmanager

# 数据库连接管理
@contextmanager
def get_db_connection():
    conn = sqlite3.connect("data.db")
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

@tool(
    name="查询数据库",
    description="执行 SQL 查询（仅支持 SELECT）"
)
def query_database(sql: str) -> list:
    """执行 SQL 查询"""
    # 安全检查：只允许 SELECT
    sql_upper = sql.strip().upper()
    if not sql_upper.startswith("SELECT"):
        raise ValueError("只允许执行 SELECT 查询")
    
    # 检查危险操作
    dangerous_keywords = ["DROP", "DELETE", "TRUNCATE", "ALTER", "CREATE"]
    for keyword in dangerous_keywords:
        if keyword in sql_upper:
            raise ValueError(f"不允许执行 {keyword} 操作")
    
    with get_db_connection() as conn:
        cursor = conn.execute(sql)
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
```

### 6.3.2 PostgreSQL / MySQL 支持

```python
from openclaw import tool
import psycopg2
from psycopg2.extras import RealDictCursor

@tool(name="PostgreSQL查询")
def query_postgres(sql: str, connection_string: str = None) -> list:
    """PostgreSQL 数据库查询"""
    conn_str = connection_string or os.getenv("DATABASE_URL")
    
    with psycopg2.connect(conn_str) as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(sql)
            return cursor.fetchall()

@tool(name="MySQL查询")
def query_mysql(sql: str, host: str, database: str, user: str, password: str) -> list:
    """MySQL 数据库查询"""
    import pymysql
    
    with pymysql.connect(
        host=host,
        database=database,
        user=user,
        password=password,
        cursorclass=pymysql.cursors.DictCursor
    ) as conn:
        with conn.cursor() as cursor:
            cursor.execute(sql)
            return cursor.fetchall()
```

### 6.3.3 安全的数据库工具

```python
from openclaw import tool
from typing import List, Dict, Any

class SafeDatabaseTool:
    """安全的数据库操作工具"""
    
    # 允许的表和操作
    ALLOWED_TABLES = ["users", "products", "orders", "inventory"]
    ALLOWED_OPERATIONS = ["SELECT"]
    
    # 禁止的字段（敏感信息）
    BLOCKED_COLUMNS = ["password", "token", "secret", "credit_card"]
    
    @tool(name="安全查询")
    def safe_query(self, table: str, columns: List[str] = None, 
                   where: str = None, limit: int = 100) -> List[Dict[str, Any]]:
        """
        安全的数据库查询
        
        Args:
            table: 表名（必须是允许的表）
            columns: 列名（可选，默认全部）
            where: WHERE 条件（可选）
            limit: 返回数量限制
        """
        # 验证表名
        if table not in self.ALLOWED_TABLES:
            raise ValueError(f"不允许访问表: {table}")
        
        # 构建列
        if columns:
            # 过滤敏感列
            safe_columns = [c for c in columns if c not in self.BLOCKED_COLUMNS]
            if len(safe_columns) != len(columns):
                print("警告：部分敏感字段已被过滤")
            cols = ", ".join(safe_columns)
        else:
            cols = "*"
        
        # 构建 SQL
        sql = f"SELECT {cols} FROM {table}"
        if where:
            sql += f" WHERE {where}"
        sql += f" LIMIT {limit}"
        
        # 执行查询
        return self._execute(sql)
    
    def _execute(self, sql: str) -> List[Dict]:
        """内部执行方法"""
        # 实际执行逻辑
        pass
```

---

## 6.4 第三方 API 集成

### 6.4.1 飞书 API 集成

```python
from openclaw import tool
import httpx

class FeishuAPI:
    """飞书 API 封装"""
    
    def __init__(self, app_id: str, app_secret: str):
        self.app_id = app_id
        self.app_secret = app_secret
        self._access_token = None
    
    async def get_access_token(self) -> str:
        """获取 access_token"""
        if self._access_token:
            return self._access_token
        
        response = httpx.post(
            "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal",
            json={
                "app_id": self.app_id,
                "app_secret": self.app_secret
            }
        )
        data = response.json()
        self._access_token = data["tenant_access_token"]
        return self._access_token

feishu = FeishuAPI(
    app_id=os.getenv("FEISHU_APP_ID"),
    app_secret=os.getenv("FEISHU_APP_SECRET")
)

@tool(name="发送飞书消息")
async def send_feishu_message(user_id: str, message: str) -> str:
    """发送飞书消息给指定用户"""
    token = await feishu.get_access_token()
    
    response = httpx.post(
        "https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=user_id",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "receive_id": user_id,
            "msg_type": "text",
            "content": json.dumps({"text": message})
        }
    )
    
    return "消息已发送" if response.status_code == 200 else "发送失败"

@tool(name="获取飞书用户信息")
async def get_feishu_user(user_id: str) -> dict:
    """获取飞书用户信息"""
    token = await feishu.get_access_token()
    
    response = httpx.get(
        f"https://open.feishu.cn/open-apis/user/v1/{user_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    return response.json()
```

### 6.4.2 企业微信 API 集成

```python
from openclaw import tool
import httpx
import os

@tool(name="发送企业微信消息")
def send_wecom_message(user: str, message: str) -> str:
    """发送企业微信消息"""
    # 获取 access_token
    corp_id = os.getenv("WECOM_CORP_ID")
    agent_id = os.getenv("WECOM_AGENT_ID")
    secret = os.getenv("WECOM_SECRET")
    
    token_resp = httpx.get(
        "https://qyapi.weixin.qq.com/cgi-bin/gettoken",
        params={"corpid": corp_id, "corpsecret": secret}
    )
    access_token = token_resp.json()["access_token"]
    
    # 发送消息
    response = httpx.post(
        "https://qyapi.weixin.qq.com/cgi-bin/message/send",
        params={"access_token": access_token},
        json={
            "touser": user,
            "msgtype": "text",
            "agentid": agent_id,
            "text": {"content": message}
        }
    )
    
    return "发送成功" if response.json()["errcode"] == 0 else "发送失败"
```

### 6.4.3 支付 API 集成

```python
from openclaw import tool
import hashlib
import time
import httpx

class PaymentAPI:
    """支付 API 封装"""
    
    def __init__(self, merchant_id: str, api_key: str):
        self.merchant_id = merchant_id
        self.api_key = api_key
        self.base_url = "https://api.payment.com"
    
    def _sign(self, params: dict) -> str:
        """生成签名"""
        sorted_params = sorted(params.items())
        sign_str = "&".join([f"{k}={v}" for k, v in sorted_params])
        sign_str += f"&key={self.api_key}"
        return hashlib.md5(sign_str.encode()).hexdigest().upper()

payment = PaymentAPI(
    merchant_id=os.getenv("PAYMENT_MERCHANT_ID"),
    api_key=os.getenv("PAYMENT_API_KEY")
)

@tool(
    name="创建支付订单",
    description="创建一个新的支付订单"
)
def create_payment_order(
    order_id: str,
    amount: float,
    description: str,
    notify_url: str
) -> dict:
    """创建支付订单"""
    params = {
        "merchant_id": payment.merchant_id,
        "order_id": order_id,
        "amount": int(amount * 100),  # 单位：分
        "description": description,
        "notify_url": notify_url,
        "timestamp": int(time.time())
    }
    
    params["sign"] = payment._sign(params)
    
    response = httpx.post(
        f"{payment.base_url}/create_order",
        json=params
    )
    
    return response.json()

@tool(name="查询支付状态")
def query_payment_status(order_id: str) -> dict:
    """查询支付状态"""
    params = {
        "merchant_id": payment.merchant_id,
        "order_id": order_id,
        "timestamp": int(time.time())
    }
    
    params["sign"] = payment._sign(params)
    
    response = httpx.get(
        f"{payment.base_url}/query",
        params=params
    )
    
    return response.json()
```

---

## 6.5 工具链与组合

### 6.5.1 串行工具链

```python
from openclaw import tool

@tool(name="完整订单流程")
def order_workflow(product_id: str, quantity: int, user_id: str) -> str:
    """
    完整的订单流程：
    1. 查询库存
    2. 创建订单
    3. 发起支付
    4. 发送通知
    """
    results = []
    
    # 1. 查询库存
    inventory = check_inventory(product_id)
    if inventory < quantity:
        return f"库存不足，当前库存: {inventory}"
    results.append(f"库存充足: {inventory}")
    
    # 2. 创建订单
    order = create_order(product_id, quantity, user_id)
    order_id = order["order_id"]
    results.append(f"订单已创建: {order_id}")
    
    # 3. 发起支付
    payment = create_payment_order(
        order_id=order_id,
        amount=order["amount"],
        description=f"订单 {order_id}"
    )
    results.append(f"支付链接: {payment['pay_url']}")
    
    # 4. 发送通知
    send_feishu_message(user_id, f"您的订单 {order_id} 已创建，请完成支付")
    results.append("已发送通知")
    
    return "\n".join(results)
```

### 6.5.2 条件工具调用

```python
from openclaw import tool

@tool(name="智能客服分流")
def smart_routing(user_message: str, user_info: dict) -> str:
    """
    根据用户消息自动分流到合适的处理流程
    """
    message_lower = user_message.lower()
    
    # 退款相关
    if "退款" in message_lower or "退货" in message_lower:
        return handle_refund(user_info)
    
    # 投诉相关
    elif "投诉" in message_lower or "举报" in message_lower:
        return handle_complaint(user_info)
    
    # 技术问题
    elif any(kw in message_lower for kw in ["报错", "bug", "无法", "失败"]):
        return handle_technical_issue(user_message, user_info)
    
    # 普通咨询
    else:
        return handle_general_inquiry(user_message, user_info)
```

### 6.5.3 工具编排配置

```yaml
# workflows.yaml

workflows:
  # 订单处理流程
  order_process:
    name: 订单处理
    trigger: "下单|购买"
    steps:
      - name: 检查库存
        tool: check_inventory
        params:
          product_id: "${intent.product_id}"
        on_fail: "库存不足"
        
      - name: 创建订单
        tool: create_order
        params:
          product_id: "${intent.product_id}"
          quantity: "${intent.quantity}"
          user_id: "${user.id}"
          
      - name: 发送确认
        tool: send_message
        params:
          user_id: "${user.id}"
          message: "订单已创建，订单号：${step.2.order_id}"
    
    on_complete:
      - action: log
        message: "订单流程完成"
    
    on_error:
      - action: notify_admin
        message: "订单处理失败：${error.message}"
```

---

## 6.6 小结 + 下章预告

### 🎯 这一章你学到了

- **HTTP 工具**：声明式定义、错误处理、重试机制
- **浏览器自动化**：Playwright 集成、表单填写、数据抓取、登录态管理
- **数据库操作**：安全查询、多数据库支持
- **第三方 API**：飞书、企业微信、支付等集成
- **工具组合**：工具链、条件调用、工作流编排

### 🚀 下章预告

**第7章：工作流编排**

学会了工具，下一步是让工具自动运转起来。下一章我们讲：
- Workflow 的完整语法
- 条件分支和循环
- 定时任务和触发器
- 复杂业务流程自动化

**让 AI 真正变成"无人值守"的工作机器！** 🤖

---

> 💪 **动手练习**

1. 创建一个浏览器工具，自动登录某个网站并获取数据
2. 封装一个第三方 API（如天气、地图）
3. 实现一个包含 3 个步骤的工具链

---

*本章内容基于 OpenClaw v0.1.0 版本，具体 API 可能有细微调整，请以官方文档为准。*