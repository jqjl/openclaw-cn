# 第10章：浏览器自动化

> 🎯 本章目标：掌握 OpenClaw 的浏览器自动化能力，学会让 AI 像人一样操作浏览器，实现网页操作、数据抓取、自动化测试等场景。

想象一下：你对 AI 说"帮我查一下明天北京到上海的机票"，AI 自动打开携程、搜索航班、比较价格，最后把结果发给你——这就是浏览器自动化的魔力！

这一章，我们来深入学习 OpenClaw 的浏览器自动化功能。

---

## 10.1 浏览器自动化概述

### 10.1.1 为什么需要浏览器自动化？

- **RPA（机器人流程自动化）**：模拟人工操作，自动化重复任务
- **网页数据抓取**：批量获取网页数据
- **自动化测试**：模拟用户行为测试 web 应用
- **无头操作**：服务器端完成需要浏览器的任务

### 10.1.2 OpenClaw 浏览器方案

OpenClaw 支持两种浏览器自动化方案：

| 方案 | 特点 | 适用场景 |
|------|------|----------|
| Playwright | 现代、快速、跨浏览器 | 推荐首选 |
| Selenium | 老牌、兼容性好 | 传统项目 |
| Puppeteer | Node.js 生态 | JS 项目 |

---

## 10.2 Playwright 集成

### 10.2.1 安装

```bash
# 安装 OpenClaw（已包含）
pip install openclaw

# 安装 Playwright
pip install playwright

# 安装浏览器
playwright install chromium
```

### 10.2.2 基本使用

```python
from openclaw.browser import Browser

# 创建浏览器实例
browser = Browser(
    driver="playwright",  # 使用 Playwright
    headless=False  # 有头模式（可以看到浏览器）
)

# 打开网页
browser.goto("https://www.baidu.com")

# 截图
browser.screenshot("baidu.png")

# 关闭
browser.close()
```

### 10.2.3 完整示例

```python
from openclaw import OpenClaw
from openclaw.browser import BrowserTool

# 创建浏览器工具
browser_tool = BrowserTool(
    name="浏览器操作",
    description="在浏览器中执行操作，如打开网页、点击、填表等"
)

# 注册到助手
assistant = OpenClaw(config_path="config.yaml")
assistant.register_tool(browser_tool)

# 对话示例
response = assistant.chat("帮我搜索 OpenClaw 框架")
# AI 会自动操作浏览器搜索
```

---

## 10.3 核心操作

### 10.3.1 导航操作

```python
# 打开网页
browser.goto("https://example.com")

# 前进/后退
browser.forward()
browser.back()

# 刷新
browser.reload()

# 等待页面加载
browser.wait_for_load_state("networkidle")
```

### 10.3.2 点击操作

```python
# 点击链接（通过文本）
browser.click("text=登录")

# 点击按钮（通过选择器）
browser.click("button.submit")

# 点击坐标
browser.click(x=100, y=200)

# 双击
browser.dblclick("text=编辑")

# 右键
browser.right_click("text=选项")
```

### 10.3.3 输入操作

```python
# 输入文本
browser.fill("input[name='username']", "myuser")
browser.fill("input[name='password']", "mypass")

# 追加文本
browser.type("input[name='search']", "OpenClaw")

# 清空输入框
browser.clear("input[name='search']")
```

### 10.3.4 等待操作

```python
# 等待元素出现
browser.wait_for_selector("div.result")

# 等待元素消失
browser.wait_for_selector("div.loading", state="hidden")

# 等待导航完成
browser.wait_for_load_state("networkidle")

# 等待指定时间
browser.wait_for_timeout(3000)  # 3秒
```

### 10.3.5 截图与截图

```python
# 截图整个页面
browser.screenshot("page.png")

# 截图指定元素
browser.screenshot("div.content", "element.png")

# 获取页面内容
html = browser.content()

# 获取文本
text = browser.text("div.content")

# 获取属性
href = browser.get_attribute("a.link", "href")
```

---

## 10.4 复杂交互

### 10.4.1 下拉菜单

```python
# 选择选项
browser.select_option("select[name='city']", "beijing")

# 或通过选项文本
browser.select_option("select[name='city']", label="北京")
```

### 10.4.2 处理弹窗

```python
# 监听弹窗
with browser.context() as context:
    page = context.new_page()
    
    # 点击触发弹窗的按钮
    page.click("button.alert")
    
    # 等待弹窗
    dialog = page.wait_for_event("dialog")
    
    # 处理弹窗
    print(dialog.message)  # 获取消息
    dialog.accept()  # 点击确定
    # 或 dialog.dismiss()  # 点击取消
```

### 10.4.3 处理 iframe

```python
# 进入 iframe
frame = browser.frame("iframe[name='content']")

# 在 iframe 中操作
frame.fill("input[name='name']", "张三")
frame.click("button.submit")

# 退出 iframe
browser.switch_to_default()
```

### 10.4.4 滚动操作

```python
# 滚动到元素
browser.scroll_into_view("div.bottom")

# 滚动到页面底部
browser.scroll_to_bottom()

# 滚动到页面顶部
browser.scroll_to_top()

# 滚动一定距离
browser.evaluate("window.scrollBy(0, 500)")
```

---

## 10.5 工具定义

### 10.5.1 浏览器操作工具

```python
from openclaw import tool

@tool(
    name="浏览器操作",
    description="在浏览器中执行操作，支持打开网页、点击、填表、截图等"
)
def browser_operation(action: str, **kwargs) -> str:
    """
    浏览器操作工具
    
    参数：
    - action: 操作类型 (goto, click, fill, screenshot, etc.)
    - 其他参数根据 action 而定
    
    示例：
    - browser_operation(action="goto", url="https://baidu.com")
    - browser_operation(action="click", selector="button.submit")
    - browser_operation(action="fill", selector="input", value="test")
    """
    from openclaw.browser import Browser
    
    # 创建或复用浏览器实例
    if not hasattr(browser_operation, "browser"):
        browser_operation.browser = Browser(headless=True)
    
    browser = browser_operation.browser
    
    # 执行操作
    if action == "goto":
        browser.goto(kwargs["url"])
        return f"已打开：{kwargs['url']}"
    
    elif action == "click":
        browser.click(kwargs["selector"])
        return f"已点击：{kwargs['selector']}"
    
    elif action == "fill":
        browser.fill(kwargs["selector"], kwargs["value"])
        return f"已填写：{kwargs['selector']} = {kwargs['value']}"
    
    elif action == "screenshot":
        path = kwargs.get("path", "screenshot.png")
        browser.screenshot(path)
        return f"截图已保存：{path}"
    
    elif action == "get_text":
        text = browser.text(kwargs["selector"])
        return text
    
    elif action == "get_content":
        content = browser.content()
        return content[:5000]  # 限制返回长度
    
    else:
        return f"不支持的操作：{action}"
```

### 10.5.2 注册工具

```python
assistant = OpenClaw(config_path="config.yaml")
assistant.register_tool(browser_operation)

# 使用
response = assistant.chat("帮我打开百度并搜索 OpenClaw")
```

---

## 10.6 实战案例

### 10.6.1 案例 1：航班查询

```python
from openclaw import tool

@tool(name="查询航班", description="查询航班信息")
def search_flights(departure: str, arrival: str, date: str) -> str:
    """
    查询航班
    
    参数：
    - departure: 出发城市
    - arrival: 目的地城市
    - date: 出发日期
    """
    from openclaw.browser import Browser
    
    browser = Browser(headless=True)
    
    try:
        # 1. 打开携程
        browser.goto("https://flights.ctrip.com/online/list/oneway")
        
        # 2. 等待页面加载
        browser.wait_for_selector("input[placeholder='出发城市']")
        
        # 3. 输入出发城市
        browser.fill("input[placeholder='出发城市']", departure)
        browser.wait_for_timeout(500)
        browser.click(f"text={departure}")
        
        # 4. 输入目的地
        browser.fill("input[placeholder='目的地']", arrival)
        browser.wait_for_timeout(500)
        browser.click(f"text={arrival}")
        
        # 5. 输入日期
        browser.fill("input[placeholder='选择日期']", date)
        
        # 6. 点击搜索
        browser.click("button.btn-search")
        
        # 7. 等待结果
        browser.wait_for_selector("div.flight-item")
        
        # 8. 获取结果
        flights = browser.elements("div.flight-item")
        
        results = []
        for flight in flights[:5]:  # 取前5个
            airline = flight.text("span.airline")
            time_dep = flight.text("span.time-dep")
            time_arr = flight.text("span.time-arr")
            price = flight.text("span.price")
            
            results.append(f"{airline} | {time_dep}-{time_arr} | ¥{price}")
        
        return "✈️ 航班查询结果：\n" + "\n".join(results)
    
    finally:
        browser.close()


# 使用
assistant.register_tool(search_flights)
response = assistant.chat("帮我查一下明天北京到上海的航班")
```

### 10.6.2 案例 2：数据抓取

```python
@tool(name="抓取新闻", description="抓取新闻网站文章列表")
def scrape_news(source: str = "tech") -> str:
    """
    抓取新闻
    
    参数：
    - source: 来源 (tech, finance, sports)
    """
    from openclaw.browser import Browser
    
    browser = Browser(headless=True)
    
    urls = {
        "tech": "https://news.sina.com.cn/china/",
        "finance": "https://finance.sina.com.cn/",
    }
    
    browser.goto(urls.get(source, urls["tech"]))
    
    # 等待加载
    browser.wait_for_selector("a.news-link")
    
    # 获取新闻列表
    links = browser.elements("a.news-link")
    
    results = []
    for link in links[:10]:
        title = link.text()
        href = link.get_attribute("href")
        results.append(f"• {title}\n  {href}")
    
    browser.close()
    
    return "📰 新闻列表：\n\n" + "\n".join(results)
```

### 10.6.3 案例 3：自动化测试

```python
@tool(name="测试网页", description="自动化测试网页功能")
def test_webpage(url: str, test_cases: list) -> str:
    """
    网页自动化测试
    
    参数：
    - url: 测试页面 URL
    - test_cases: 测试用例列表
    """
    from openclaw.browser import Browser
    
    browser = Browser(headless=True)
    results = []
    
    try:
        browser.goto(url)
        
        for case in test_cases:
            action = case.get("action")
            selector = case.get("selector")
            expected = case.get("expected")
            
            try:
                if action == "click":
                    browser.click(selector)
                    results.append(f"✅ 点击 {selector}")
                
                elif action == "fill":
                    browser.fill(selector, case.get("value"))
                    results.append(f"✅ 填写 {selector}")
                
                elif action == "verify_text":
                    text = browser.text(selector)
                    if expected in text:
                        results.append(f"✅ 验证文本 {selector}")
                    else:
                        results.append(f"❌ 文本不匹配 {selector}")
                
            except Exception as e:
                results.append(f"❌ 测试失败 {selector}: {str(e)}")
        
        return "🧪 测试结果：\n\n" + "\n".join(results)
    
    finally:
        browser.close()
```

---

## 10.7 最佳实践

### 10.7.1 处理反爬

```python
# 设置浏览器特征
browser = Browser(
    headless=True,
    args=[
        "--disable-blink-features=AutomationControlled",  # 隐藏自动化特征
        "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
    ]
)

# 随机等待
import random
browser.wait_for_timeout(random.randint(1000, 3000))
```

### 10.7.2 异常处理

```python
def safe_browser_operation(action: str, **kwargs):
    """带异常处理的浏览器操作"""
    try:
        return browser_operation(action, **kwargs)
    except Exception as e:
        return f"操作失败：{str(e)}\n请重试或检查 selector 是否正确"
```

### 10.7.3 资源管理

```python
# 使用上下文管理器
with Browser() as browser:
    browser.goto("https://example.com")
    # 操作...
# 自动清理
```

---

## 10.8 小结 + 下章预告

### 🎯 这一章你学到了

- **浏览器自动化概述**：为什么需要、方案对比
- **Playwright 集成**：安装、基本使用
- **核心操作**：导航、点击、输入、等待
- **复杂交互**：下拉菜单、弹窗、iframe、滚动
- **工具定义**：浏览器操作工具
- **实战案例**：航班查询、数据抓取、自动化测试
- **最佳实践**：反爬处理、异常处理、资源管理

### 🚀 下章预告

**第11章：文件处理与文档生成**

AI 不仅能"说"能"做"，还能生成文档、报表、合同！

- 文件读写操作
- Excel/Word/PDF 生成
- 数据导出
- 模板引擎
- 报表自动生成

**准备好让 AI 帮你写文档了吗？** 📄

---

> 📝 **思考题**：你想用浏览器自动化实现什么场景？抢票工具？数据抓取？自动化测试？在评论区聊聊！

---

*本章代码示例基于 OpenClaw v0.1.0 版本，具体 API 可能有细微调整，请以官方文档为准。*
