# 77hub Approval Tracker - Setup Guide

Complete guide to set up this skill from scratch on a new machine.

## Requirements

- **Windows 10/11** or macOS
- **WorkBuddy** installed and configured
- **Google Chrome** (latest version)
- **Enterprise WeChat** (企业微信) account with a group chat (for notifications)

## Step 1: Install opencli CLI

opencli is a browser automation CLI tool that controls Chrome via an extension.

### Windows (PowerShell)

```powershell
# Install opencli globally
uvx opencli install

# Or if you use pip
pip install opencli
opencli install
```

### macOS / Linux

```bash
uvx opencli install
```

### Verify Installation

```powershell
opencli --version
opencli --help
```

You should see the version and available commands (including `operate`).

## Step 2: Connect opencli to Chrome

1. Open Chrome browser
2. Open `chrome://extensions/` in a new tab
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked**
5. Navigate to the opencli extension directory:
   - Windows: `%LOCALAPPDATA%\opencli\extension\`
   - macOS: `~/Library/Application Support/opencli/extension/`
6. The extension icon should appear in Chrome's toolbar

### Verify Connection

```powershell
opencli operate state
```

If connection is successful, it will return the current page state. If not, make sure:
- Chrome is running and the extension is enabled
- No other automation tool is controlling Chrome
- The Chrome window is not in a special state (like `about:blank`)

## Step 3: Install opencli-operate Skill

This skill teaches the AI agent how to use opencli commands.

In WorkBuddy:
1. Open the Skills panel
2. Search for "opencli-operate"
3. Click Install
4. Or install via terminal if available

**Verify**: Ask WorkBuddy "use opencli to open https://www.baidu.com" — it should be able to control Chrome.

## Step 4: Install This Skill

Copy the `SKILL/` folder to your WorkBuddy skills directory:

```
# The exact path depends on your OS
# Windows:  C:\Users\<yourname>\.workbuddy\skills\77hub-approval-tracker\
# macOS:    ~/.workbuddy/skills/77hub-approval-tracker/
```

The skill will be auto-detected by WorkBuddy. You can verify by asking: "你有哪些 skill？"

## Step 5: First Login to 77hub

Before automated checking can work, you need to log in to 77hub at least once and save credentials in Chrome.

### Manual Login

1. Open Chrome
2. Navigate to `https://app.77hub.com/cn-global/login`
3. Enter your username and password
4. **Important**: When Chrome asks "Save password?", click **Save**
5. Complete any MFA or verification steps
6. Wait for the dashboard to load

### Verify Auto-fill Works

1. Open a new incognito window (or clear cookies)
2. Navigate to `https://app.77hub.com/cn-global/login`
3. Check if Chrome auto-fills the username and password fields
4. If not, manually fill once and save again

### Handle "Logged in on Another Device" Popup

This popup appears frequently. The skill handles it automatically, but if you see it during setup, just click "确定" (Confirm).

## Step 6: Set Up WeChat Work Robot (Optional but Recommended)

This enables push notifications after each check.

### Create a Group Robot

1. Open **企业微信** (WeChat Work) desktop or mobile app
2. Go to a group chat where you want to receive notifications
3. Click the group settings (top right `...`)
4. Select **群机器人** (Group Robots) → **添加机器人** (Add Robot)
5. Give it a name (e.g., "77hub审批提醒")
6. Copy the **Webhook URL** (format: `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxx`)
7. Save this URL — you'll need it later

### Test the Robot

Run this in PowerShell:

```powershell
$webhookUrl = "YOUR_WEBHOOK_URL_HERE"
$contentType = "application/json"
$msgContent = "Test notification from 77hub Tracker"
$bodyObj = @{msgtype="text"; text=@{content=$msgContent}}
$bodyJson = $bodyObj | ConvertTo-Json -Depth 3 -Compress
$bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($bodyJson)
Invoke-RestMethod -Uri $webhookUrl -Method Post -ContentType $contentType -Body $bodyBytes
```

You should receive the test message in your WeChat Work group.

## Step 7: Run First Full Check

The first time you use this skill, there's no baseline data yet. The skill will automatically perform a **full check** (checking all applications in both lists).

### Trigger First Check

Tell WorkBuddy:

> "帮我检查 77hub 的审批进度，这是第一次检查，需要全量扫描"

Or:

> "77hub检查，首次运行"

The skill will:
1. Login to 77hub
2. Scan ALL applications in both lists (费用申请单 + 采购申请单)
3. Open panoramic views for each application
4. Record current status for all applications
5. Save the baseline to your workspace's `MEMORY.md`
6. Send a summary notification via WeChat Work (if configured)

### Expected Duration

First full check takes longer because every application needs a panoramic view:

| List | Typical Count | Time per App | Total |
|------|--------------|-------------|-------|
| Expense Applications | 5-20 | ~20s each | 2-7 min |
| Procurement Applications | 5-20 | ~35s each | 3-12 min |

Total: approximately 5-20 minutes for the first run.

## Step 8: Set Up Scheduled Automation (Optional)

After the first check establishes a baseline, you can set up recurring checks.

### In WorkBuddy

1. Open the Automations panel
2. Create a new automation with:
   - **Name**: `77hub审批进度每日检查`
   - **Schedule**: `FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;BYHOUR=12;BYMINUTE=0` (weekdays 12:00)
   - **Workspace**: your project workspace path
   - **Status**: ACTIVE

### Automation Prompt

```
你是 77hub 企企经营管理平台的自动化审批进度检查助手。
请执行 77hub-approval-tracker skill 中定义的完整检查流程。
检查完成后通过企业微信机器人发送结果通知。

企业微信 Webhook URL: YOUR_WEBHOOK_URL_HERE
工作区路径: YOUR_WORKSPACE_PATH_HERE
```

## Troubleshooting

### Chrome Connection Lost

**Symptom**: `opencli operate state` returns `about:blank` or errors.

**Fix**:
1. Make sure Chrome is visible (not minimized)
2. Reload the opencli extension in `chrome://extensions/`
3. Close and reopen Chrome
4. Run `opencli operate open https://www.baidu.com` to test

### "Logged in on Another Device" Popup

**Symptom**: A dialog blocks the page after login.

**Fix**: The skill handles this automatically. If it fails, manually click "确定" and retry.

### Panoramic View Shows Empty Data

**Symptom**: SVG extraction returns `[]`.

**Fix**:
1. Ensure `location.reload()` was executed after opening the URL
2. Wait longer (add 15 seconds) before extracting
3. The SPA cache issue — always reload, never just navigate

### WeChat Work Notification Fails

**Symptom**: `errcode` is not 0.

**Fix**:
1. Check the webhook URL is correct
2. Ensure the robot hasn't been removed from the group
3. Message content must not exceed 2048 bytes
4. Check network connectivity to `qyapi.weixin.qq.com`

### PowerShell Encoding Issues

**Symptom**: Chinese characters appear garbled in notifications.

**Fix**: Always use `ConvertTo-Json` to build JSON, never hand-write JSON strings with Chinese content in PowerShell. The `wecom-notify.ps1` script handles this correctly.

## Next Steps

After setup is complete:
- The skill will run incrementally on subsequent checks (only pending applications)
- Completed applications are automatically removed from tracking
- New applications are automatically added to tracking
- Status changes trigger detailed notifications
