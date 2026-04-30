# SKILL.md — 77hub 审批进度追踪

> 本文件由 守鹤（WorkBuddy Agent）根据 2026-04 历史记忆自动生成，供其他 agent 直接复用。
> 最后更新：2026-04-29

---

## 一、技能概述

**目标平台**：企企经营管理平台（77hub）  
**核心任务**：自动检查费用申请单 + 非物资采购申请的审批进度，比对增量，通过企业微信 Webhook 发送通知。  
**推荐工具**：`playwright-cli`（替代已废弃的 opencli-operate）  
**执行频率**：每个工作日 12:00 自动执行（可通过 WorkBuddy 自动化任务调度）

---

## 二、关键 URL 与路由

| 用途 | URL / Hash 路由 |
|------|----------------|
| 登录页 | `https://app.77hub.com/cn-global/login` |
| 应用主页（SPA） | `https://app2.77hub.com/cn-apnorthbj-2/app?#/` |
| 费用申请单列表 | `#/list/ReimburseApply/ReimburseApply_list` |
| 非物资&其他物资采购申请列表 | `#/CsCaiGouShenQing/list/CsCaiGouShenQing` |
| 费用申请单全景视图 | `#/panoramic/ReimburseApply/{ID}` |
| 采购申请单全景视图 | `#/panoramic/CsCaiGouShenQing/{ID}` |

> ⚠️ 登录后 URL 含一次性 `code` 参数（如 `?code=9a56fa1f-...`）。**不要在代码里硬编码 code**，在已登录 SPA 内导航时只改 `#hash` 部分。

---

## 三、Playwright-CLI 完整操作流程

### 3.1 登录并保存状态

```powershell
# 1. 打开登录页（有头模式，用户可见）
playwright-cli open "https://app.77hub.com/cn-global/login"

# 2. 填写账号密码（ref 每次可能变化，先 snapshot 确认）
playwright-cli snapshot          # 查找手机号/密码输入框的 ref
playwright-cli fill e122 "手机号"
playwright-cli fill e128 "密码"
playwright-cli click e137        # 登录按钮

# 3. 处理"已在其他设备登录"弹窗（几乎必出现）
playwright-cli snapshot          # 找到确认按钮 ref（通常为 e179，但需确认）
playwright-cli click e179

# 4. 等待跳转完成
Start-Sleep -Seconds 5

# 5. 保存登录状态（后续免登录加载）
playwright-cli state-save "77hub-auth.json"
```

### 3.2 加载已有登录状态（免重新登录）

```powershell
playwright-cli open
playwright-cli state-load "77hub-auth.json"
playwright-cli goto "https://app2.77hub.com/cn-apnorthbj-2/app?#/"
Start-Sleep -Seconds 5
```

> ⚠️ 登录态可能过期（约 1~2 天），过期后必须重走 3.1 完整登录流程。

### 3.3 导航到列表页

```powershell
# 费用申请单列表
playwright-cli goto "https://app2.77hub.com/cn-apnorthbj-2/app?#/list/ReimburseApply/ReimburseApply_list"
Start-Sleep -Seconds 5

# 采购申请列表
playwright-cli goto "https://app2.77hub.com/cn-apnorthbj-2/app?#/CsCaiGouShenQing/list/CsCaiGouShenQing"
Start-Sleep -Seconds 5
```

### 3.4 提取列表数据（eval 方式）

77hub 使用虚拟滚动 div 表格，**不是标准 `<table>`**，数据单元格特征：`tabindex="-1"` 且无子元素。

```powershell
# 提取列表所有单元格文本
playwright-cli evaluate "JSON.stringify([...document.querySelectorAll('div')].filter(d => d.getAttribute('tabindex')==='-1' && d.children.length===0).map(d => d.textContent.trim()).filter(t => t.length > 0))"
```

**单据编码规律**：

| 前缀 | 类型 |
|------|------|
| `AF` | 费用申请单 |
| `EX` | 出差申请单 |
| `FWSQ` | 非物资采购申请 |
| `QWSQ` | 其他物资采购申请 |
| `AP` | 付款申请单 |
| `PA` | 付款单 |
| `FYBX` | 费用报销单 |

**列表字段顺序**：单据类型 → 单据编码 → 申请日期 → 单据状态 → 申请人 → 待审批人 → 标题 → 申请金额

### 3.5 获取单据 ID（访问全景视图必需）

全景视图需要使用内部 UUID，不是列表中的单据编码。获取方式：

```powershell
# 1. 从列表点击进入单据详情（通过 .object-cell-linkable 元素）
playwright-cli evaluate "document.querySelector('.object-cell-linkable').click()"
Start-Sleep -Seconds 3

# 2. 从 URL 中提取 UUID
playwright-cli evaluate "window.location.href"
# URL 格式：.../view/{UUID}/rank 或 .../view/{UUID}
# 提取正则：/view\/([a-f0-9-]{36})/
```

### 3.6 访问全景视图

```powershell
# 费用申请单全景视图
playwright-cli goto "https://app2.77hub.com/cn-apnorthbj-2/app?#/panoramic/ReimburseApply/{UUID}"
Start-Sleep -Seconds 20   # 费用类等待 15-20 秒

# 采购申请单全景视图
playwright-cli goto "https://app2.77hub.com/cn-apnorthbj-2/app?#/panoramic/CsCaiGouShenQing/{UUID}"
Start-Sleep -Seconds 45   # 采购类等待 30-45 秒（数据加载更慢）
```

> ⚠️ **全景视图不能直接 reload**，必须先 goto 完整 URL，再等足时间，否则获取的是空数据或旧数据。

```powershell
# 提取全景视图节点数据
playwright-cli evaluate "JSON.stringify([...document.querySelectorAll('.panoramic-node, [class*=panoramic]')].map(n => n.textContent.trim()).filter(t => t))"

# 备用：提取所有有内容的叶子 div
playwright-cli evaluate "JSON.stringify([...document.querySelectorAll('div')].filter(d => d.children.length===0 && d.textContent.trim().length>2).map(d=>d.textContent.trim()).slice(0,200))"
```

---

## 四、增量检查策略

状态文件保存在工作区根目录 `77hub-report-state.json`，格式示例：

```json
{
  "lastChecked": "2026-04-22T12:00:00",
  "reimbursement": {
    "total": 4,
    "items": [
      {"id": "EX0720260400001", "status": "已生效", "downstream": "FYBX20260400019:已提交"}
    ]
  },
  "procurement": {
    "total": 11,
    "tracking": [
      {"id": "FWSQ20260334", "status": "付款申请AP0120260400015:已提交"},
      {"id": "FWSQ20260327", "status": "部分付款:剩余18000"}
    ]
  }
}
```

**检查逻辑**：
1. 读取 `77hub-report-state.json` 作为基线
2. 抓取当前列表，比对条目数量（新增 = 当前总数 > 基线总数）
3. 对"待跟踪"单据逐一访问全景视图，比对状态字段
4. 有变化 → 记录变更内容 + 发送企业微信通知
5. 无变化 → 只发一条"已执行，无变化"的确认消息
6. 更新 `77hub-report-state.json`

---

## 五、企业微信 Webhook 通知

```powershell
# 通知格式（PowerShell，避免手动拼 JSON 引号）
$webhook = "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=YOUR_KEY"

$body = @{
    msgtype = "text"
    text = @{
        content = "【77hub审批检查】2026-04-29 12:00 执行完毕。`n变更：FWSQ20260334 付款申请已生效。"
    }
} | ConvertTo-Json -Depth 3 -Compress

Invoke-RestMethod -Uri $webhook -Method Post -Body $body -ContentType "application/json;charset=utf-8"
# 成功返回：{"errcode":0,"errmsg":"ok"}
```

> ⚠️ Webhook URL 有效期约 2–4 周，失效时 errcode=93000。失效后需在企业微信群机器人设置中重新获取。

**通知规则**：
- 有变化：发送变更摘要（包含单据号、状态前后对比）
- 无变化：也必须发一条简短确认消息（证明自动化正常执行）

---

## 六、常见踩坑与解决方案

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| `playwright-cli` ref（e122/e137 等）失效 | 每次页面加载 ref 会重新分配 | 每次操作前先 `snapshot` 确认当前 ref |
| 导航后数据不刷新（显示旧数据） | SPA 路由缓存，hash 切换不触发重新请求 | 用完整 `goto` URL，不要只改 hash；等足够时间 |
| 全景视图提示"未查询到数据" | 访问过快 / 等待不足 | 费用类等 15-20s，采购类等 30-45s |
| 登录后 code 参数一次性失效 | 带旧 code 的完整 URL 会被服务端拒绝 | 在已登录 SPA 内只修改 `#hash`，不要传 code |
| "已在其他设备登录"弹窗阻断登录 | 77hub 单会话限制 | 每次登录后必须处理此弹窗（snapshot → click 确认按钮） |
| 列表切换后数据错乱 | 从费用列表切换到采购列表时 SPA 缓存 | 切换列表时执行 `playwright-cli reload`，再等 5s |
| 企业微信通知失败 errcode=93000 | Webhook URL 过期 | 在群机器人设置页重新生成 Webhook URL |
| 大量 DOM 数据被 snapshot 截断 | snapshot 有长度限制 | 改用 `playwright-cli evaluate` + `JSON.stringify` 提取 |
| PowerShell 中 JS 单引号被吞 | PowerShell 字符串解析规则 | eval 字符串内用双引号，或改用 `getAttribute()` 而非 `['attr']` |

---

## 七、自动化任务配置参考

```
名称：77hub审批进度每日检查
类型：recurring
RRULE：RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR
执行时间：每个工作日 12:00
工作区：c:\Users\zxf_s\WorkBuddy\20260405105510
```

提示词示例：
```
检查77hub审批进度：
1. 加载 77hub-auth.json 登录态（失效则重新登录）
2. 检查费用申请单列表（ReimburseApply），与基线对比增量
3. 检查非物资采购申请列表（CsCaiGouShenQing），与基线对比增量
4. 对待跟踪单据逐一访问全景视图，记录状态变化
5. 更新 77hub-report-state.json
6. 发送企业微信通知（有变化含摘要，无变化只确认已执行）
```

---

## 八、相关文件索引

| 文件 | 说明 |
|------|------|
| `77hub-auth.json` | Playwright 登录状态存档 |
| `77hub-report-state.json` | 增量检查基线数据 |
| `docs/01-login-steps.md` | 登录操作详细步骤（含 opencli 旧版参考） |
| `docs/02-exploration-log.md` | 数据探索日志（DOM 结构分析） |
| `docs/03-data-fields.md` | 单据字段定义与选择器映射 |
| `docs/04-reimbursement-summary.md` | 费用申请单初始全量快照 |
| `docs/05-procurement-summary.md` | 采购申请单初始全量快照 |
| `docs/automation-plan.md` | 自动化方案设计文档 |
| `MEMORY.md`（.workbuddy/memory/） | 精简长期记忆，含已验证命令 |

---

*本 SKILL.md 基于 2026-04-05 至 2026-04-22 的实际操作经验生成，命令均经过验证可执行。*
