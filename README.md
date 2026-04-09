# 77hub Approval Tracker

> WorkBuddy Skill - Automate approval progress tracking on [77hub](https://app.77hub.com) (企企经营管理平台)

Automatically check reimbursement applications and procurement requests via panoramic views, detect status changes, and send notifications through WeChat Work (企业微信) webhook.

## Features

- **Automated Login** - Chrome browser automation with auto-fill credentials
- **Incremental Checking** - Only tracks pending applications, skips completed ones
- **Panoramic View Extraction** - Reads approval flowchart data from SVG nodes
- **Smart Comparison** - Detects status changes between checks
- **WeChat Work Notification** - Pushes results via enterprise webhook
- **New Application Detection** - Automatically picks up new entries from lists

## Prerequisites

- [WorkBuddy](https://www.codebuddy.cn/) with AI agent capabilities
- [opencli-operate](https://github.com/nicepkg/opencli) skill installed
- Google Chrome with 77hub login session saved
- (Optional) WeChat Work robot webhook URL for notifications

## Installation

1. Copy the `SKILL/` folder to your WorkBuddy skills directory:
   ```
   ~/.workbuddy/skills/77hub-approval-tracker/
   ```

2. The skill will be automatically available in WorkBuddy. Trigger it with phrases like:
   - "检查审批" (Check approvals)
   - "报销进度" (Reimbursement progress)
   - "采购进度" (Procurement progress)
   - "77hub检查" (77hub check)

## Configuration

### Required Setup

Before first use, configure these in your workspace's `MEMORY.md`:

```markdown
## 定时检查任务

- **费用申请单待跟踪**（{日期} 基线）：
  - 单号（状态，金额）
- **非物资采购待跟踪**（{日期} 基线）：
  - 单号（状态，金额）
- **已完成不需要复查**
```

### WeChat Work Webhook

To enable push notifications, provide a webhook URL when the skill asks, or set it in the automation prompt.

Create a robot in your WeChat Work group and copy the webhook URL (format: `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxx`).

## Usage

### Manual Check

Just tell WorkBuddy to check approvals. The skill will:

1. Login to 77hub via Chrome
2. Check expense application list (费用申请单)
3. Check procurement application list (采购申请单)
4. Open panoramic views for tracked applications
5. Compare current status against baseline
6. Report changes and update baseline

### Scheduled Automation

Set up a recurring WorkBuddy automation:

| Schedule | RRULE |
|----------|-------|
| Weekdays 12:00 | `FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;BYHOUR=12;BYMINUTE=0` |
| Daily 9:00 | `FREQ=DAILY;BYHOUR=9;BYMINUTE=0` |
| Weekly Monday 10:00 | `FREQ=WEEKLY;BYDAY=MO;BYHOUR=10;BYMINUTE=0` |

## Project Structure

```
SKILL/
├── SKILL.md                    # Core workflow (7-step SOP)
├── references/
│   └── platform-guide.md       # 77hub technical reference
└── scripts/
    └── wecom-notify.ps1        # WeChat Work notification script
```

### SKILL.md

The main skill definition containing the complete 7-step workflow:
1. Login to 77hub
2. Check expense applications
3. Check procurement applications
4. View panoramic views
5. Analyze status changes
6. Generate report and notify
7. Update baseline

### platform-guide.md

Technical reference for the 77hub platform:
- URL patterns and routing
- Application number prefix codes
- Data extraction JavaScript snippets
- SPA cache workarounds
- PowerShell quoting issues and solutions

### wecom-notify.ps1

Reusable PowerShell script for sending WeChat Work notifications:

```powershell
.\wecom-notify.ps1 -WebhookUrl "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxx" -Content "Message content"
```

## Supported Application Types

| Type | Route | Description |
|------|-------|-------------|
| Expense Application (费用申请单) | `#/list/ReimburseApply/ReimburseApply_list` | AF/EX prefix |
| Procurement (非物资&其他物资采购) | `#/CsCaiGouShenQing/list/CsCaiGouShenQing` | FWSQ/QWSQ prefix |

## Status Keywords

| Status | Meaning |
|--------|---------|
| 已提交 | Submitted, pending approval |
| 已生效 | Approved and effective |
| 已关闭 | Closed |
| 已撤回 | Withdrawn |

## Known Limitations

- Requires Chrome window to remain visible (opencli connection drops if minimized)
- 77hub SPA cache requires `location.reload()` after navigating to panoramic views
- Session expires after inactivity, re-login may be needed
- WeChat Work message size limit: 2048 bytes per message

## License

MIT
