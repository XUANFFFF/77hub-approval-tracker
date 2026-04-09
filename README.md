# 77hub Approval Tracker

> WorkBuddy Skill - Automate approval progress tracking on [77hub](https://app.77hub.com) (企企经营管理平台)

Automatically check reimbursement applications and procurement requests via panoramic views, detect status changes, and send notifications through WeChat Work (企业微信) webhook.

## Features

- **Automated Login** - Chrome browser automation with auto-fill credentials
- **Full & Incremental Modes** - First run scans all applications; subsequent runs only check pending ones
- **Panoramic View Extraction** - Reads approval flowchart data from SVG nodes
- **Smart Comparison** - Detects status changes between checks
- **WeChat Work Notification** - Pushes results via enterprise webhook
- **New Application Detection** - Automatically picks up new entries from lists
- **Baseline Auto-Management** - Completed items removed, new items added automatically

## Quick Start

> **New user?** Follow the complete [SETUP.md](SETUP.md) guide for step-by-step installation.

### 30-Second Summary

1. Install [opencli CLI](https://github.com/nicepkg/opencli) and connect to Chrome
2. Install [opencli-operate](https://github.com/nicepkg/opencli) skill in WorkBuddy
3. Copy `SKILL/` folder to `~/.workbuddy/skills/77hub-approval-tracker/`
4. Tell WorkBuddy: "77hub检查，首次运行"

## Prerequisites

| Dependency | Purpose | Install |
|-----------|---------|---------|
| [WorkBuddy](https://www.codebuddy.cn/) | AI agent platform | Download and install |
| [opencli CLI](https://github.com/nicepkg/opencli) | Browser automation engine | `uvx opencli install` |
| opencli-operate skill | AI knowledge for opencli commands | Install via WorkBuddy Skills panel |
| Google Chrome | Browser controlled by opencli | Install + enable opencli extension |
| 77hub account | Platform access | Login once and save credentials in Chrome |
| WeChat Work (optional) | Push notifications | Create a group robot for webhook URL |

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

### First Run

No configuration needed! Just tell WorkBuddy to run a first check:
> "帮我检查 77hub 的审批进度，这是第一次检查"

The skill will automatically:
- Scan all applications in both lists
- Open panoramic views for each application
- Create a baseline in your workspace's `MEMORY.md`

### WeChat Work Webhook (Optional)

To enable push notifications, create a robot in your WeChat Work group and copy the webhook URL (format: `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxx`).

See [SETUP.md](SETUP.md#step-6-set-up-wechat-work-robot-optional-but-recommended) for detailed instructions.

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

See [SETUP.md](SETUP.md#step-8-set-up-scheduled-automation-optional) for the complete automation prompt template.

## Project Structure

```
├── README.md                   # This file
├── SETUP.md                    # Complete installation guide (for humans)
├── .gitignore
└── SKILL/
    ├── SKILL.md                # Core workflow (8-step SOP, for AI agent)
    ├── references/
    │   └── platform-guide.md   # 77hub technical reference
    └── scripts/
        └── wecom-notify.ps1    # WeChat Work notification script
```

| File | Audience | Description |
|------|----------|-------------|
| `README.md` | Everyone | Overview, quick start, features |
| `SETUP.md` | Humans | Step-by-step installation from zero |
| `SKILL.md` | AI Agent | Complete workflow SOP with code snippets |
| `platform-guide.md` | AI Agent | Platform-specific technical reference |
| `wecom-notify.ps1` | PowerShell | Reusable notification sending script |

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

## Troubleshooting

See [SETUP.md - Troubleshooting](SETUP.md#troubleshooting) for common issues and fixes.

## License

MIT
