# 第11章：文件处理与文档生成

> 🎯 本章目标：掌握 OpenClaw 的文件处理能力，学会生成各种格式的文档（Excel、Word、PDF），实现报表自动生成等业务场景。

在企业场景中，AI 经常需要生成文档：销售报表、合同文档、数据分析报告等。这一章，我们来学习如何让 AI 生成专业的文档！

---

## 11.1 文件操作基础

### 11.1.1 读取文件

```python
from openclaw import tool

@tool(name="读取文件", description="读取文本文件内容")
def read_file(path: str, encoding: str = "utf-8") -> str:
    """读取文件"""
    with open(path, 'r', encoding=encoding) as f:
        return f.read()

@tool(name="读取JSON", description="读取JSON文件")
def read_json(path: str) -> dict:
    """读取JSON文件"""
    import json
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

@tool(name="读取CSV", description="读取CSV文件")
def read_csv(path: str) -> list:
    """读取CSV文件"""
    import csv
    with open(path, 'r', encoding='utf-8') as f:
        return list(csv.DictReader(f))
```

### 11.1.2 写入文件

```python
@tool(name="写入文件", description="写入文本文件")
def write_file(path: str, content: str, encoding: str = "utf-8") -> str:
    """写入文件"""
    import os
    os.makedirs(os.path.dirname(path), exist_ok=True)
    
    with open(path, 'w', encoding=encoding) as f:
        f.write(content)
    
    return f"文件已保存：{path}"

@tool(name="写入JSON", description="写入JSON文件")
def write_json(path: str, data: dict, indent: int = 2) -> str:
    """写入JSON"""
    import json
    import os
    os.makedirs(os.path.dirname(path), exist_ok=True)
    
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=indent)
    
    return f"JSON已保存：{path}"

@tool(name="写入CSV", description="写入CSV文件")
def write_csv(path: str, data: list, fieldnames: list = None) -> str:
    """写入CSV"""
    import csv
    import os
    os.makedirs(os.path.dirname(path), exist_ok=True)
    
    if not data:
        return "数据为空"
    
    if not fieldnames:
        fieldnames = list(data[0].keys()) if isinstance(data[0], dict) else []
    
    with open(path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data)
    
    return f"CSV已保存：{path}"
```

---

## 11.2 Excel 操作

### 11.2.1 使用 openpyxl

```bash
pip install openpyxl
```

### 11.2.2 生成 Excel

```python
@tool(name="生成Excel", description="生成Excel文件")
def generate_excel(data: list, filename: str = "output.xlsx") -> str:
    """
    生成Excel文件
    
    参数：
    - data: 数据列表，每项为字典
    - filename: 文件名
    """
    import openpyxl
    from openpyxl.styles import Font, Alignment, PatternFill
    
    # 创建工作簿
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "数据"
    
    if not data:
        return "数据为空"
    
    # 写入表头
    headers = list(data[0].keys())
    for col, header in enumerate(headers, 1):
        cell = ws.cell(row=1, column=col)
        cell.value = header
        cell.font = Font(bold=True, color="FFFFFF")
        cell.fill = PatternFill("solid", fgColor="4472C4")
        cell.alignment = Alignment(horizontal="center")
    
    # 写入数据
    for row_idx, row_data in enumerate(data, 2):
        for col_idx, header in enumerate(headers, 1):
            cell = ws.cell(row=row_idx, column=col_idx)
            cell.value = row_data.get(header, "")
            cell.alignment = Alignment(horizontal="left")
    
    # 调整列宽
    for col in ws.columns:
        max_length = 0
        column = col[0].column_letter
        for cell in col:
            try:
                if len(str(cell.value)) > max_length:
                    max_length = len(str(cell.value))
            except:
                pass
        adjusted_width = min(max_length + 2, 50)
        ws.column_dimensions[column].width = adjusted_width
    
    # 保存
    wb.save(filename)
    return f"Excel已生成：{filename}"
```

### 11.2.3 读取 Excel

```python
@tool(name="读取Excel", description="读取Excel文件内容")
def read_excel(path: str, sheet_name: str = None) -> list:
    """读取Excel"""
    import openpyxl
    
    wb = openpyxl.load_workbook(path)
    
    if sheet_name:
        ws = wb[sheet_name]
    else:
        ws = wb.active
    
    # 读取表头
    headers = [cell.value for cell in ws[1]]
    
    # 读取数据
    data = []
    for row in ws.iter_rows(min_row=2, values_only=True):
        if any(row):
            data.append(dict(zip(headers, row)))
    
    return data[:100]  # 限制返回数量
```

---

## 11.3 Word 文档生成

### 11.3.1 安装库

```bash
pip install python-docx
```

### 11.3.2 生成 Word

```python
@tool(name="生成Word文档", description="生成Word文档")
def generate_word(content: str, filename: str = "document.docx") -> str:
    """
    生成Word文档
    
    参数：
    - content: 内容（支持Markdown格式）
    - filename: 文件名
    """
    from docx import Document
    from docx.shared import Pt, Inches
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    
    doc = Document()
    
    # 处理内容（简化版：按行处理）
    lines = content.split('\n')
    
    for line in lines:
        if line.startswith('# '):
            # 标题
            heading = doc.add_heading(line[2:], level=1)
        elif line.startswith('## '):
            doc.add_heading(line[3:], level=2)
        elif line.startswith('### '):
            doc.add_heading(line[4:], level=3)
        elif line.strip():
            # 普通段落
            doc.add_paragraph(line)
        else:
            # 空行
            doc.add_paragraph()
    
    doc.save(filename)
    return f"Word文档已生成：{filename}"
```

### 11.3.3 完整示例：生成报告

```python
@tool(name="生成销售报告", description="生成销售报告Word文档")
def generate_sales_report(data: dict, filename: str = "sales_report.docx") -> str:
    """生成销售报告"""
    from docx import Document
    from docx.shared import Pt, Inches, RGBColor
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    from datetime import datetime
    
    doc = Document()
    
    # 标题
    title = doc.add_heading('销售报告', 0)
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    # 日期
    date_para = doc.add_paragraph(f"生成日期：{datetime.now().strftime('%Y-%m-%d')}")
    date_para.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    
    # 概述
    doc.add_heading('一、总体概览', level=1)
    
    summary = data.get('summary', {})
    for key, value in summary.items():
        doc.add_paragraph(f"{key}：{value}")
    
    # 明细
    doc.add_heading('二、销售明细', level=1)
    
    table = doc.add_table(rows=1, cols=3)
    table.style = 'Light Grid Accent 1'
    
    # 表头
    header_cells = table.rows[0].cells
    header_cells[0].text = '产品'
    header_cells[1].text = '销量'
    header_cells[2].text = '销售额'
    
    # 数据行
    for item in data.get('details', []):
        row_cells = table.add_row().cells
        row_cells[0].text = str(item.get('product', ''))
        row_cells[1].text = str(item.get('quantity', 0))
        row_cells[2].text = f"¥{item.get('sales', 0):,}"
    
    doc.save(filename)
    return f"销售报告已生成：{filename}"
```

---

## 11.4 PDF 生成

### 11.4.1 安装库

```bash
pip install reportlab
```

### 11.4.2 生成 PDF

```python
@tool(name="生成PDF", description="生成PDF文档")
def generate_pdf(content: str, filename: str = "document.pdf") -> str:
    """
    生成PDF文档
    
    参数：
    - content: 内容
    - filename: 文件名
    """
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
    from reportlab.lib.units import inch
    
    doc = SimpleDocTemplate(filename, pagesize=A4)
    styles = getSampleStyleSheet()
    story = []
    
    # 解析内容
    lines = content.split('\n')
    for line in lines:
        if line.startswith('# '):
            # 标题
            story.append(Paragraph(line[2:], styles['Title']))
        elif line.startswith('## '):
            story.append(Paragraph(line[3:], styles['Heading1']))
        elif line.startswith('### '):
            story.append(Paragraph(line[4:], styles['Heading2']))
        elif line.strip():
            p = Paragraph(line, styles['BodyText'])
            story.append(p)
        story.append(Spacer(1, 0.2*inch))
    
    doc.build(story)
    return f"PDF已生成：{filename}"
```

---

## 11.5 模板引擎

### 11.5.1 使用 Jinja2

```bash
pip install jinja2
```

### 11.5.2 模板示例

```python
# 模板文件 template.html
"""
<!DOCTYPE html>
<html>
<head>
    <title>{{ title }}</title>
    <style>
        body { font-family: Arial, sans-serif; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #4CAF50; color: white; }
    </style>
</head>
<body>
    <h1>{{ title }}</h1>
    <p>生成时间：{{ generate_time }}</p>
    
    <h2>数据列表</h2>
    <table>
        <tr>
            {% for header in headers %}
            <th>{{ header }}</th>
            {% endfor %}
        </tr>
        {% for row in rows %}
        <tr>
            {% for cell in row %}
            <td>{{ cell }}</td>
            {% endfor %}
        </tr>
        {% endfor %}
    </table>
</body>
</html>
```

### 11.5.3 渲染模板

```python
@tool(name="渲染模板", description="使用模板生成HTML文件")
def render_template(template_path: str, data: dict, output_path: str) -> str:
    """渲染模板"""
    from jinja2 import Environment, FileSystemLoader
    import os
    from datetime import datetime
    
    # 获取模板目录
    template_dir = os.path.dirname(template_path)
    template_file = os.path.basename(template_path)
    
    env = Environment(loader=FileSystemLoader(template_dir))
    template = env.get_template(template_file)
    
    # 填充数据
    data['generate_time'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    # 渲染
    html = template.render(**data)
    
    # 保存
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html)
    
    return f"HTML已生成：{output_path}"
```

---

## 11.6 实战案例：自动生成销售周报

```python
# examples/generate_weekly_report.py

from openclaw import tool

@tool(name="生成周报", description="自动生成销售周报")
def generate_weekly_report(week: str, data: dict) -> str:
    """
    生成周报
    
    参数：
    - week: 周次，如 "2024年第10周"
    - data: 数据字典
    """
    from docx import Document
    from docx.shared import Pt, Inches, RGBColor
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    from datetime import datetime
    import os
    
    # 创建文档
    doc = Document()
    
    # 标题
    title = doc.add_heading(f'销售周报 - {week}', 0)
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    # 概述
    doc.add_heading('一、本周概况', level=1)
    
    summary_data = data.get('summary', {})
    for key, value in summary_data.items():
        p = doc.add_paragraph()
        p.add_run(f"{key}：").bold = True
        p.add_run(str(value))
    
    # 销售数据
    doc.add_heading('二、销售数据', level=1)
    
    table = doc.add_table(rows=1, cols=4)
    table.style = 'Light Grid Accent 1'
    
    # 表头
    headers = ['日期', '订单数', '销售额', '客户数']
    header_cells = table.rows[0].cells
    for i, header in enumerate(headers):
        header_cells[i].text = header
    
    # 数据
    for item in data.get('daily_data', []):
        row = table.add_row()
        row.cells[0].text = str(item.get('date', ''))
        row.cells[1].text = str(item.get('orders', 0))
        row.cells[2].text = f"¥{item.get('sales', 0):,}"
        row.cells[3].text = str(item.get('customers', 0))
    
    # 产品排名
    doc.add_heading('三、产品销售排名', level=1)
    
    ranking = data.get('product_ranking', [])
    for i, product in enumerate(ranking, 1):
        doc.add_paragraph(
            f"{i}. {product['name']} - 销量 {product['quantity']} 件 - 销售额 ¥{product['sales']:,}"
        )
    
    # 下周计划
    doc.add_heading('四、下周计划', level=1)
    doc.add_paragraph(data.get('next_week_plan', '暂无'))
    
    # 保存
    filename = f"sales_report_{week.replace('第', '').replace('周', '')}.docx"
    doc.save(filename)
    
    return f"周报已生成：{filename}"


# 使用
report_data = {
    "summary": {
        "总订单数": 156,
        "总销售额": "¥128,500",
        "新增客户": 23,
        "转化率": "8.5%"
    },
    "daily_data": [
        {"date": "周一", "orders": 28, "sales": 22500, "customers": 5},
        {"date": "周二", "orders": 32, "sales": 26800, "customers": 6},
        {"date": "周三", "orders": 25, "sales": 19800, "customers": 4},
        {"date": "周四", "orders": 35, "sales": 29200, "customers": 7},
        {"date": "周五", "orders": 36, "sales": 30200, "customers": 6},
    ],
    "product_ranking": [
        {"name": "iPhone 15 Pro", "quantity": 45, "sales": 405000},
        {"name": "MacBook Air", "quantity": 28, "sales": 196000},
        {"name": "AirPods Pro", "quantity": 65, "sales": 97500},
    ],
    "next_week_plan": "1. 开展促销活动\n2. 重点推广新品\n3. 跟进大客户"
}
```

---

## 11.7 小结 + 下章预告

### 🎯 这一章你学到了

- **文件操作**：读写文本、JSON、CSV
- **Excel操作**：openpyxl 生成/读取
- **Word生成**：python-docx 创建文档
- **PDF生成**：reportlib 创建 PDF
- **模板引擎**：Jinja2 模板渲染
- **实战案例**：自动生成销售周报

### 🚀 下章预告

**第12章：企业沟通与协作**

企业需要与多个平台打通——邮件、Slack、钉钉、企业微信...

- 邮件收发
- 企业微信集成
- 钉钉集成
- Webhook 集成
- 消息路由

**准备好让 AI 帮你处理企业沟通了吗？** 💬

---

*本章代码示例基于 OpenClaw v0.1.0 版本，具体 API 可能有细微调整，请以官方文档为准。*
