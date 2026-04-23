# 第7章：工作流编排

> 🎯 本章目标：让 Agent 自动执行复杂的多步骤任务，实现"无人值守"的智能工作流。

上一章我们学会了创建各种强大的工具，但这些工具还需要人工触发。这一章，我们来学习**工作流编排**——让多个工具自动串联、条件分支、循环执行，真正实现自动化。

---

## 7.1 什么是工作流？

### 7.1.1 从手动到自动

想象一个场景：用户下单后，系统需要：

1. 检查库存
2. 创建订单
3. 扣减库存
4. 发送确认邮件
5. 通知仓库发货

手动调用工具是这样的：

```python
# 手动方式：一步一步调用
inventory = check_inventory(product_id)
if inventory >= quantity:
    order = create_order(...)
    reduce_inventory(...)
    send_email(...)
    notify_warehouse(...)
```

**工作流**可以让这一切自动化：

```yaml
# 定义工作流
workflow:
  name: 订单处理
  steps:
    - check_inventory
    - create_order
    - reduce_inventory
    - send_email
    - notify_warehouse
```

### 7.1.2 工作流 vs 工具

| 特性 | 工具 (Tool) | 工作流 (Workflow) |
|------|-------------|-------------------|
| 粒度 | 单一操作 | 多步骤流程 |
| 触发 | 用户对话触发 | 多种触发方式 |
| 逻辑 | 简单条件 | 复杂分支和循环 |
| 状态 | 无状态 | 有状态管理 |
| 用途 | 原子操作 | 业务流程自动化 |

---

## 7.2 工作流基础语法

### 7.2.1 最简工作流

```yaml
# workflows/hello.yaml
name: 问候工作流
description: 简单的问候流程

steps:
  - name: 打招呼
    action: respond
    message: "你好！"
    
  - name: 自我介绍
    action: respond
    message: "我是你的 AI 助手。"
```

### 7.2.2 带参数的工作流

```yaml
name: 订单查询
description: 查询订单状态

parameters:
  order_id:
    type: string
    description: 订单号
    required: true

steps:
  - name: 查询数据库
    tool: query_order
    params:
      order_id: "${order_id}"
      
  - name: 返回结果
    action: respond
    message: |
      订单号：${step.1.order_id}
      状态：${step.1.status}
      金额：¥${step.1.amount}
```

### 7.2.3 变量引用

工作流中可以使用多种变量：

```yaml
steps:
  - name: 示例
    action: log
    message: |
      # 参数变量
      订单号：${order_id}
      
      # 步骤结果变量
      上一步结果：${step.1.result}
      订单状态：${step.query.status}
      
      # 用户变量
      用户ID：${user.id}
      用户名：${user.name}
      
      # 环境变量
      当前时间：${env.NOW}
      环境：${env.ENVIRONMENT}
      
      # 系统变量
      会话ID：${session.id}
      工作流ID：${workflow.id}
```

---

## 7.3 触发器

### 7.3.1 消息触发

```yaml
name: 客服分流
description: 根据消息内容自动分流

triggers:
  - type: message
    keywords:
      - "退款"
      - "退货"
      - "投诉"
    match_mode: any  # any / all / exact

steps:
  - name: 识别意图
    action: classify
    categories:
      - 退款
      - 投诉
      - 咨询
      
  - name: 分流处理
    condition: ${step.1.category == "退款"}
    action: goto
    workflow: handle_refund
```

### 7.3.2 定时触发

```yaml
name: 每日报告
description: 每天早上 9 点生成报告

triggers:
  - type: schedule
    cron: "0 9 * * *"  # 每天 9:00
    # 或者用更友好的写法
    # interval: daily
    # time: "09:00"
    timezone: "Asia/Shanghai"

steps:
  - name: 获取数据
    tool: fetch_daily_stats
    
  - name: 生成报告
    tool: generate_report
    params:
      data: "${step.1}"
      
  - name: 发送通知
    tool: send_message
    params:
      channel: feishu
      target: "管理层群"
      message: "${step.2.report}"
```

### 7.3.3 事件触发

```yaml
name: 订单支付成功处理
description: 支付成功后的自动化处理

triggers:
  - type: event
    source: payment_system
    event: payment.success
    # 支持通配符
    # event: "order.*"

steps:
  - name: 更新订单状态
    tool: update_order
    params:
      order_id: "${event.order_id}"
      status: "paid"
      
  - name: 发送确认邮件
    tool: send_email
    params:
      to: "${event.user_email}"
      subject: "支付成功"
      template: "payment_success"
      
  - name: 通知仓库
    tool: notify_warehouse
    params:
      order_id: "${event.order_id}"
```

### 7.3.4 Webhook 触发

```yaml
name: GitHub Issue 处理
description: 自动处理 GitHub Issue

triggers:
  - type: webhook
    path: /webhook/github/issues
    method: POST
    auth: hmac_sha256  # 安全验证

steps:
  - name: 解析 Issue
    action: parse_webhook
    extract:
      title: "${body.issue.title}"
      body: "${body.issue.body}"
      labels: "${body.issue.labels}"
      
  - name: 分类
    condition: "'bug' in ${step.1.labels}"
    action: create_task
    params:
      type: bug
      title: "${step.1.title}"
      description: "${step.1.body}"
```

---

## 7.4 条件与分支

### 7.4.1 简单条件

```yaml
name: 审批流程
description: 根据金额自动分流审批

parameters:
  amount: number
  reason: string

steps:
  - name: 判断金额
    condition: "${amount < 1000}"
    action: respond
    message: "小额支出，自动通过"
    
  - name: 中额审批
    condition: "${amount >= 1000 && amount < 10000}"
    action: goto
    workflow: manager_approval
    params:
      amount: "${amount}"
      reason: "${reason}"
      
  - name: 大额审批
    condition: "${amount >= 10000}"
    action: goto
    workflow: director_approval
    params:
      amount: "${amount}"
      reason: "${reason}"
```

### 7.4.2 多分支 (Switch-Case)

```yaml
name: 订单状态处理
description: 根据订单状态执行不同操作

steps:
  - name: 获取订单状态
    tool: query_order_status
    params:
      order_id: "${order_id}"
      
  - name: 状态分支
    switch: "${step.1.status}"
    cases:
      pending:
        action: respond
        message: "订单待支付"
        
      paid:
        action: goto
        workflow: process_paid_order
        
      shipped:
        action: goto
        workflow: track_shipment
        
      completed:
        action: respond
        message: "订单已完成"
        
      cancelled:
        action: respond
        message: "订单已取消"
        
    default:
      action: respond
      message: "未知状态"
```

### 7.4.3 嵌套条件

```yaml
name: 复杂审批逻辑
description: 多维度审批判断

steps:
  - name: 判断条件
    condition: |
      ${amount > 5000 && user.role == "manager" && department.budget_remaining > amount}
    action: respond
    message: "符合条件，可以审批"
    
  - name: 否则
    condition: "${amount > 5000}"
    action: respond
    message: "金额过大，需要上级审批"
    
  - name: 默认
    action: respond
    message: "已通过"
```

---

## 7.5 循环与迭代

### 7.5.1 基础循环

```yaml
name: 批量发送通知
description: 给多个用户发送通知

parameters:
  users: array  # 用户列表
  message: string

steps:
  - name: 遍历用户
    loop: "${users}"
    item: "user"
    steps:
      - name: 发送消息
        tool: send_message
        params:
          user_id: "${user.id}"
          message: "${message}"
          
      - name: 记录日志
        action: log
        message: "已发送给 ${user.name}"
```

### 7.5.2 带条件的循环

```yaml
name: 重试机制
description: 失败后自动重试

steps:
  - name: 调用 API
    loop:
      max_iterations: 3
      until: "${step.api.success == true}"
    steps:
      - name: 调用
        id: api
        tool: call_api
        params:
          url: "${api_url}"
          
      - name: 失败等待
        condition: "${step.api.success == false}"
        action: wait
        duration: 5s  # 等待 5 秒后重试
```

### 7.5.3 并行循环

```yaml
name: 并行查询
description: 同时查询多个数据源

steps:
  - name: 并行查询
    parallel:
      - name: 查询数据库
        tool: query_db
        
      - name: 查询缓存
        tool: query_cache
        
      - name: 调用外部 API
        tool: call_external_api
        
  - name: 汇总结果
    action: respond
    message: |
      数据库结果：${step.1.query_db.result}
      缓存结果：${step.1.query_cache.result}
      API 结果：${step.1.call_external_api.result}
```

---

## 7.6 子工作流

### 7.6.1 调用子工作流

```yaml
# workflows/main.yaml
name: 主流程
description: 调用多个子工作流

steps:
  - name: 数据验证
    action: call
    workflow: validate_data
    params:
      data: "${input_data}"
      
  - name: 数据处理
    condition: "${step.1.valid == true}"
    action: call
    workflow: process_data
    params:
      data: "${step.1.data}"
      
  - name: 发送通知
    action: call
    workflow: send_notification
    params:
      result: "${step.2}"
```

```yaml
# workflows/validate_data.yaml
name: 数据验证
description: 验证输入数据

parameters:
  data: object

steps:
  - name: 检查必填字段
    condition: "${data.name && data.email}"
    action: set
    key: valid
    value: true
    
  - name: 检查格式
    condition: "${data.email matches '^[^@]+@[^@]+$'}"
    action: respond
    message: "格式正确"
    
  - name: 返回结果
    action: return
    value:
      valid: "${valid}"
      data: "${data}"
```

### 7.6.2 工作流模板

```yaml
# templates/notification.yaml
name: 通知模板
description: 通用的通知发送模板

parameters:
  channel: string
  target: string
  title: string
  content: string
  priority: string  # high / normal / low

steps:
  - name: 格式化消息
    tool: format_message
    params:
      template: "notification"
      params:
        title: "${title}"
        content: "${content}"
        time: "${env.NOW}"
        
  - name: 发送通知
    tool: send_notification
    params:
      channel: "${channel}"
      target: "${target}"
      message: "${step.1.formatted}"
      priority: "${priority}"
      
  - name: 记录日志
    action: log
    message: "通知已发送到 ${channel}:${target}"
```

---

## 7.7 错误处理

### 7.7.1 Try-Catch 结构

```yaml
name: 带错误处理的流程
description: 捕获并处理异常

steps:
  - name: 尝试调用 API
    try:
      - name: 调用外部服务
        tool: call_external_service
        params:
          url: "${api_url}"
          
    catch:
      - name: 记录错误
        action: log
        level: error
        message: "API 调用失败：${error.message}"
        
      - name: 使用备用方案
        tool: call_backup_service
        
    finally:
      - name: 清理资源
        action: cleanup
```

### 7.7.2 超时处理

```yaml
name: 带超时的流程
description: 超时后自动取消

steps:
  - name: 执行任务
    timeout: 30s  # 30 秒超时
    tool: long_running_task
    
    on_timeout:
      - name: 记录超时
        action: log
        message: "任务超时"
        
      - name: 发送告警
        tool: send_alert
        params:
          level: warning
          message: "任务执行超时"
```

### 7.7.3 重试策略

```yaml
name: 智能重试
description: 根据错误类型决定重试策略

steps:
  - name: 调用服务
    tool: call_service
    retry:
      max_attempts: 3
      backoff: exponential  # 指数退避
      initial_delay: 1s
      max_delay: 30s
      retry_on:
        - "ConnectionError"
        - "TimeoutError"
      on_retry:
        - action: log
          message: "第 ${retry_count} 次重试"
```

---

## 7.8 状态管理

### 7.8.1 工作流状态

```yaml
name: 多阶段流程
description: 跨多次对话的状态管理

# 持久化配置
persistence:
  enabled: true
  storage: redis
  ttl: 86400  # 24 小时

states:
  initial: pending
  transitions:
    pending -> processing: "开始处理"
    processing -> completed: "处理完成"
    processing -> failed: "处理失败"
    failed -> pending: "重新处理"

steps:
  - name: 检查状态
    condition: "${workflow.state == 'pending'}"
    action: set_state
    value: processing
    
  - name: 处理数据
    tool: process_data
    
  - name: 更新状态
    condition: "${step.2.success}"
    action: set_state
    value: completed
```

### 7.8.2 人工审批节点

```yaml
name: 人工审批流程
description: 需要人工确认的流程

steps:
  - name: 提交审批
    action: create_approval
    params:
      approver: "${approver_id}"
      title: "${approval_title}"
      description: "${approval_description}"
      timeout: 72h  # 72 小时未处理自动拒绝
      
  - name: 等待审批
    action: wait_for_approval
    approval_id: "${step.1.approval_id}"
    
  - name: 审批通过
    condition: "${step.2.result == 'approved'}"
    action: respond
    message: "审批已通过"
    
  - name: 审批拒绝
    condition: "${step.2.result == 'rejected'}"
    action: respond
    message: "审批被拒绝，原因：${step.2.reason}"
```

---

## 7.9 实战案例：电商订单处理

```yaml
name: 电商订单全流程
description: 从下单到发货的完整流程

triggers:
  - type: event
    source: order_system
    event: order.created

variables:
  order_id: "${event.order_id}"
  user_id: "${event.user_id}"
  items: "${event.items}"

steps:
  # 第一阶段：库存检查
  - name: 检查库存
    parallel:
      - name: 检查商品库存
        loop: "${items}"
        item: "item"
        steps:
          - tool: check_inventory
            params:
              product_id: "${item.product_id}"
              quantity: "${item.quantity}"
              
  - name: 库存判断
    condition: "${step.1.all_success}"
    steps:
      # 第二阶段：订单处理
      - name: 锁定库存
        tool: lock_inventory
        params:
          order_id: "${order_id}"
          items: "${items}"
          
      - name: 创建订单
        tool: create_order
        params:
          order_id: "${order_id}"
          user_id: "${user_id}"
          items: "${items}"
          
      - name: 计算价格
        tool: calculate_price
        params:
          items: "${items}"
          coupons: "${event.coupons}"
          
      # 第三阶段：支付
      - name: 发起支付
        tool: create_payment
        params:
          order_id: "${order_id}"
          amount: "${step.计算价格.total}"
          
      - name: 等待支付
        action: wait_for_event
        event: payment.success
        timeout: 30m
        
      # 第四阶段：支付成功后处理
      - name: 支付成功处理
        steps:
          - name: 更新订单状态
            tool: update_order
            params:
              order_id: "${order_id}"
              status: paid
              
          - name: 扣减库存
            tool: reduce_inventory
            params:
              items: "${items}"
              
          - name: 创建物流单
            tool: create_shipment
            params:
              order_id: "${order_id}"
              address: "${event.address}"
              
          - name: 发送确认
            parallel:
              - tool: send_sms
                params:
                  phone: "${user.phone}"
                  template: order_confirmed
                  
              - tool: send_email
                params:
                  to: "${user.email}"
                  template: order_confirmed
                  
          - name: 通知仓库
            tool: notify_warehouse
            params:
              order_id: "${order_id}"
              
    # 库存不足处理
    else:
      - name: 库存不足
        action: respond
        message: "部分商品库存不足"
        
      - name: 取消订单
        tool: cancel_order
        params:
          order_id: "${order_id}"
          reason: "库存不足"
          
      - name: 通知用户
        tool: send_message
        params:
          user_id: "${user_id}"
          message: "很抱歉，部分商品库存不足，订单已取消"

on_error:
  - name: 错误处理
    action: log
    message: "订单处理失败：${error.message}"
    
  - name: 通知管理员
    tool: send_alert
    params:
      channel: feishu
      target: "技术支持群"
      message: "订单 ${order_id} 处理异常"
```

---

## 7.10 小结 + 下章预告

### 🎯 这一章你学到了

- **工作流基础**：定义、参数、变量引用
- **触发器**：消息、定时、事件、Webhook
- **条件分支**：if-else、switch-case、嵌套条件
- **循环迭代**：基础循环、条件循环、并行循环
- **子工作流**：调用、模板、复用
- **错误处理**：try-catch、超时、重试
- **状态管理**：工作流状态、人工审批
- **实战案例**：电商订单全流程

### 🚀 下章预告

**第8章：记忆与上下文管理**

工作流让 Agent 能自动执行复杂任务，下一章我们来学习如何让它"记住"更多信息：
- 短期记忆 vs 长期记忆
- RAG 知识库集成
- 用户画像和个性化
- 多会话管理

**让 AI 真正拥有"大脑"！** 🧠

---

> 💪 **动手练习**

1. 创建一个定时工作流，每天早上 9 点发送天气提醒
2. 实现一个带条件分支的审批流程
3. 设计一个包含重试机制的 API 调用工作流

---

*本章内容基于 OpenClaw v0.1.0 版本，具体 API 可能有细微调整，请以官方文档为准。*