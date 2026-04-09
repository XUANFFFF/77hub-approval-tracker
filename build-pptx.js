const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "77hub Approval Tracker";
pres.title = "77hub Approval Tracker - 完整介绍";

// ── Color Palette (Dark Theme) ──
const C = {
  bg: "0F172A",
  bgCard: "1E293B",
  bgCardHover: "273548",
  text: "E2E8F0",
  muted: "94A3B8",
  dim: "64748B",
  border: "334155",
  primary: "2563EB",
  primaryLight: "3B82F6",
  green: "22C55E",
  orange: "F59E0B",
  red: "EF4444",
  purple: "A78BFA",
  cyan: "22D3EE",
};

// ── Helpers ──
const makeShadow = () => ({ type: "outer", color: "000000", blur: 4, offset: 1, angle: 135, opacity: 0.2 });

function addBg(slide) {
  slide.background = { color: C.bg };
}

function addTitle(slide, label, title, subtitle) {
  if (label) {
    slide.addText(label, { x: 0.6, y: 0.35, w: 5, h: 0.3, fontSize: 11, fontFace: "Arial", color: C.primaryLight, charSpacing: 2, bold: true });
  }
  slide.addText(title, { x: 0.6, y: label ? 0.65 : 0.4, w: 8.8, h: 0.6, fontSize: 28, fontFace: "Arial", color: C.text, bold: true, margin: 0 });
  if (subtitle) {
    slide.addText(subtitle, { x: 0.6, y: label ? 1.25 : 1.0, w: 8.8, h: 0.4, fontSize: 14, fontFace: "Arial", color: C.muted });
  }
}

function addCard(slide, x, y, w, h, opts = {}) {
  const fill = opts.fill || C.bgCard;
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: fill }, rectRadius: 0.08, shadow: makeShadow() });
  if (opts.accent) {
    slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.06, h, fill: { color: opts.accent }, rectRadius: 0.02 });
  }
}

// ═══════════════════════════════════════════
// SLIDE 1: Title / Hero
// ═══════════════════════════════════════════
{
  const s = pres.addSlide();
  addBg(s);
  // Decorative glow shapes
  s.addShape(pres.shapes.OVAL, { x: -1, y: -1, w: 5, h: 5, fill: { color: C.primary, transparency: 92 } });
  s.addShape(pres.shapes.OVAL, { x: 7, y: 3, w: 4, h: 4, fill: { color: C.purple, transparency: 93 } });
  // Badge
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 3.2, y: 0.8, w: 3.6, h: 0.35, fill: { color: C.primary, transparency: 85 }, line: { color: C.primary, width: 0.75, transparency: 60 }, rectRadius: 0.2 });
  s.addText("5 MIN READ  ·  ZERO TO AUTOMATION", { x: 3.2, y: 0.8, w: 3.6, h: 0.35, fontSize: 9, fontFace: "Arial", color: C.primaryLight, align: "center", valign: "middle", bold: true, margin: 0 });
  // Title
  s.addText("77hub Approval Tracker", { x: 0.6, y: 1.5, w: 8.8, h: 0.8, fontSize: 42, fontFace: "Arial", color: C.text, bold: true, align: "center", margin: 0 });
  // Subtitle
  s.addText("企企经营管理平台审批进度自动追踪器", { x: 1, y: 2.35, w: 8, h: 0.45, fontSize: 18, fontFace: "Arial", color: C.muted, align: "center" });
  s.addText("登录 · 查列表 · 看全景 · 比状态 · 发通知 —— 全自动", { x: 1, y: 2.8, w: 8, h: 0.4, fontSize: 13, fontFace: "Arial", color: C.dim, align: "center" });
  // Stats
  const stats = [
    { num: "8", label: "步完成安装" },
    { num: "~3 min", label: "手动操作时间" },
    { num: "100%", label: "后续检查自动" },
  ];
  stats.forEach((st, i) => {
    const sx = 1.5 + i * 3;
    s.addText(st.num, { x: sx, y: 3.6, w: 2, h: 0.55, fontSize: 32, fontFace: "Arial", color: C.primaryLight, bold: true, align: "center", margin: 0 });
    s.addText(st.label, { x: sx, y: 4.15, w: 2, h: 0.3, fontSize: 11, fontFace: "Arial", color: C.dim, align: "center" });
  });
  // Footer
  s.addText("WorkBuddy Skill  ·  MIT License", { x: 0.6, y: 5.1, w: 8.8, h: 0.3, fontSize: 10, fontFace: "Arial", color: C.dim, align: "center" });
}

// ═══════════════════════════════════════════
// SLIDE 2: Core Features (6 cards)
// ═══════════════════════════════════════════
{
  const s = pres.addSlide();
  addBg(s);
  addTitle(s, "CORE CAPABILITIES", "它能做什么", "不是简单的提醒工具，而是完整的审批状态追踪系统");
  const features = [
    { icon: "🔒", title: "自动登录", desc: "Chrome 浏览器自动化完成登录，自动处理弹窗", accent: C.primary },
    { icon: "📊", title: "全景视图解析", desc: "从 SVG 流程图节点提取审批链条状态", accent: C.purple },
    { icon: "🔍", title: "智能增量检查", desc: "首次全量扫描建基线，后续只查未完成+新增", accent: C.cyan },
    { icon: "🔔", title: "企业微信推送", desc: "每次检查完自动推送报告到企业微信群", accent: C.green },
    { icon: "📝", title: "基线自动管理", desc: "完成的移出、新增的加入、变化的更新", accent: C.orange },
    { icon: "⏰", title: "定时自动执行", desc: "配置定时任务，每个工作日自动检查", accent: C.red },
  ];
  features.forEach((f, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const cx = 0.5 + col * 3.1;
    const cy = 1.9 + row * 1.8;
    addCard(s, cx, cy, 2.9, 1.6, { accent: f.accent });
    s.addText(f.icon, { x: cx + 0.15, y: cy + 0.15, w: 0.45, h: 0.45, fontSize: 22, margin: 0 });
    s.addText(f.title, { x: cx + 0.65, y: cy + 0.15, w: 2.1, h: 0.45, fontSize: 15, fontFace: "Arial", color: C.text, bold: true, valign: "middle", margin: 0 });
    s.addText(f.desc, { x: cx + 0.15, y: cy + 0.75, w: 2.6, h: 0.7, fontSize: 11, fontFace: "Arial", color: C.muted, lineSpacingMultiple: 1.3 });
  });
}

// ═══════════════════════════════════════════
// SLIDE 3: Before vs After
// ═══════════════════════════════════════════
{
  const s = pres.addSlide();
  addBg(s);
  addTitle(s, "BEFORE vs AFTER", "用了之后有什么区别", "以前手动查审批要 30 分钟，现在全自动 5 分钟出结果");
  const rows = [
    ["检查频率", "想起来才查，经常忘", "每天定时自动检查"],
    ["检查耗时", "20-30 分钟逐个点开", "全自动 3-5 分钟"],
    ["遗漏风险", "容易漏掉状态变化", "AI 逐条对比，零遗漏"],
    ["通知方式", "需要自己去看", "企业微信自动推送"],
    ["新增单据", "可能没注意到", "自动检测并加入跟踪"],
    ["基线维护", "靠脑子记或 Excel", "自动更新，长期持续"],
  ];
  const tableData = [
    [
      { text: "", options: { fill: { color: C.bgCard }, color: C.dim, fontSize: 10, bold: true } },
      { text: "之前（手动）", options: { fill: { color: C.bgCard }, color: C.red, fontSize: 11, bold: true, align: "center" } },
      { text: "之后（自动化）", options: { fill: { color: C.bgCard }, color: C.green, fontSize: 11, bold: true, align: "center" } },
    ],
    ...rows.map((r) => [
      { text: r[0], options: { fill: { color: C.bg }, color: C.muted, fontSize: 11, bold: true, border: { pt: 0.5, color: C.border } } },
      { text: r[1], options: { fill: { color: C.bg }, color: C.red, fontSize: 11, border: { pt: 0.5, color: C.border } } },
      { text: r[2], options: { fill: { color: C.bg }, color: C.green, fontSize: 11, border: { pt: 0.5, color: C.border } } },
    ]),
  ];
  s.addTable(tableData, {
    x: 0.6, y: 1.9, w: 8.8, h: 3.4,
    colW: [2.0, 3.4, 3.4],
    border: { pt: 0.5, color: C.border },
    rowH: [0.45, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    valign: "middle",
  });
}

// ═══════════════════════════════════════════
// SLIDE 4: Architecture
// ═══════════════════════════════════════════
{
  const s = pres.addSlide();
  addBg(s);
  addTitle(s, "ARCHITECTURE", "工作原理", "几个组件协同工作，组成完整的自动化链条");
  // Layer 1: WorkBuddy AI
  const bw = 2.8, bh = 1.1;
  const cx = (10 - bw) / 2;
  addCard(s, cx, 1.8, bw, bh, { accent: C.primary, fill: C.bgCard });
  s.addText("🤖\nWorkBuddy AI", { x: cx, y: 1.8, w: bw, h: bh, fontSize: 13, fontFace: "Arial", color: C.text, align: "center", valign: "middle", bold: true, margin: 0 });
  s.addText("调度中心，执行流程", { x: cx, y: 2.85, w: bw, h: 0.25, fontSize: 9, fontFace: "Arial", color: C.dim, align: "center", margin: 0 });
  // Arrows down
  s.addText("▼    ▼    ▼", { x: 0.6, y: 3.1, w: 8.8, h: 0.35, fontSize: 16, color: C.dim, align: "center", margin: 0 });
  // Layer 2
  const l2items = [
    { icon: "🌐", name: "opencli", desc: "浏览器引擎", color: C.purple },
    { icon: "🧠", name: "Skill 知识库", desc: "操作流程", color: C.cyan },
    { icon: "📋", name: "MEMORY.md", desc: "状态基线", color: C.orange },
  ];
  const l2w = 2.5, l2h = 0.9;
  l2items.forEach((item, i) => {
    const ix = 0.8 + i * 3.1;
    addCard(s, ix, 3.45, l2w, l2h, { accent: item.color });
    s.addText(item.icon + "  " + item.name, { x: ix, y: 3.45, w: l2w, h: 0.55, fontSize: 13, fontFace: "Arial", color: C.text, align: "center", valign: "middle", bold: true, margin: 0 });
    s.addText(item.desc, { x: ix, y: 3.98, w: l2w, h: 0.25, fontSize: 9, fontFace: "Arial", color: C.dim, align: "center", margin: 0 });
  });
  // Arrows down
  s.addText("▼    ▼    ▼", { x: 0.6, y: 4.3, w: 8.8, h: 0.3, fontSize: 16, color: C.dim, align: "center", margin: 0 });
  // Layer 3
  const l3items = [
    { icon: "🖥️", name: "Chrome", desc: "浏览器控制" },
    { icon: "🏢", name: "77hub", desc: "审批平台" },
    { icon: "💬", name: "企业微信", desc: "消息通知" },
  ];
  l3items.forEach((item, i) => {
    const ix = 0.8 + i * 3.1;
    addCard(s, ix, 4.55, l2w, 0.8, { accent: C.green });
    s.addText(item.icon + "  " + item.name, { x: ix, y: 4.55, w: l2w, h: 0.5, fontSize: 13, fontFace: "Arial", color: C.text, align: "center", valign: "middle", bold: true, margin: 0 });
    s.addText(item.desc, { x: ix, y: 5.0, w: l2w, h: 0.25, fontSize: 9, fontFace: "Arial", color: C.dim, align: "center", margin: 0 });
  });
}

// ═══════════════════════════════════════════
// SLIDE 5: Setup Steps 1-4
// ═══════════════════════════════════════════
{
  const s = pres.addSlide();
  addBg(s);
  addTitle(s, "SETUP (1/2)", "安装步骤 1-4", "基础环境搭建，AI 自动完成大部分");
  const steps1 = [
    { n: "1", title: "安装 opencli CLI", tag: "AI", tagColor: C.green, desc: "浏览器自动化引擎", detail: "uvx opencli install", time: "~1 min" },
    { n: "2", title: "连接 Chrome 扩展", tag: "手动", tagColor: C.orange, desc: "加载扩展到 Chrome", detail: "chrome://extensions/ → 加载已解压", time: "~1 min" },
    { n: "3", title: "安装 opencli-operate Skill", tag: "AI", tagColor: C.green, desc: "AI 的 opencli 操作知识", detail: "WorkBuddy Skills 面板安装", time: "~30s" },
    { n: "4", title: "安装本 Skill", tag: "AI", tagColor: C.green, desc: "下载到 ~/.workbuddy/skills/", detail: "AI 从 GitHub 下载并放置", time: "~30s" },
  ];
  steps1.forEach((st, i) => {
    const sy = 1.8 + i * 0.95;
    // Number circle
    s.addShape(pres.shapes.OVAL, { x: 0.6, y: sy, w: 0.45, h: 0.45, fill: { color: C.bg }, line: { color: C.primary, width: 1.5 } });
    s.addText(st.n, { x: 0.6, y: sy, w: 0.45, h: 0.45, fontSize: 14, fontFace: "Arial", color: C.primaryLight, bold: true, align: "center", valign: "middle", margin: 0 });
    // Content card
    addCard(s, 1.2, sy - 0.05, 7.0, 0.7);
    s.addText(st.title, { x: 1.35, y: sy, w: 4.5, h: 0.3, fontSize: 14, fontFace: "Arial", color: C.text, bold: true, valign: "middle", margin: 0 });
    s.addText(st.desc, { x: 1.35, y: sy + 0.28, w: 5, h: 0.22, fontSize: 10, fontFace: "Arial", color: C.dim, margin: 0 });
    // Tag
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.2, y: sy + 0.02, w: 0.6, h: 0.25, fill: { color: st.tagColor, transparency: 80 }, line: { color: st.tagColor, width: 0.5, transparency: 50 }, rectRadius: 0.12 });
    s.addText(st.tag, { x: 6.2, y: sy + 0.02, w: 0.6, h: 0.25, fontSize: 9, fontFace: "Arial", color: st.tagColor, bold: true, align: "center", valign: "middle", margin: 0 });
    // Time
    s.addText(st.time, { x: 7.0, y: sy + 0.02, w: 1, h: 0.25, fontSize: 9, fontFace: "Arial", color: C.dim, align: "left", valign: "middle", margin: 0 });
  });
}

// ═══════════════════════════════════════════
// SLIDE 6: Setup Steps 5-8
// ═══════════════════════════════════════════
{
  const s = pres.addSlide();
  addBg(s);
  addTitle(s, "SETUP (2/2)", "安装步骤 5-8", "首次运行与自动化配置");
  const steps2 = [
    { n: "5", title: "首次登录 77hub", tag: "手动", tagColor: C.orange, desc: "AI 打开登录页，输入密码后 AI 接手", detail: "自动处理弹窗、跳转、获取会话码", time: "~1 min" },
    { n: "6", title: "配置企业微信通知", tag: "手动", tagColor: C.orange, desc: "创建群机器人，提供 Webhook URL", detail: "AI 自动测试连通性并发送测试消息", time: "~1 min" },
    { n: "7", title: "首次全量检查", tag: "AI", tagColor: C.green, desc: "扫描所有单据，打开全景视图，建基线", detail: "费用 + 采购，逐条提取流程状态", time: "5-15 min" },
    { n: "8", title: "设置定时任务", tag: "AI", tagColor: C.green, desc: "工作日 12:00 自动增量检查", detail: "FREQ=WEEKLY;BYDAY=MO-FR;BYHOUR=12", time: "~30s" },
  ];
  steps2.forEach((st, i) => {
    const sy = 1.8 + i * 0.95;
    s.addShape(pres.shapes.OVAL, { x: 0.6, y: sy, w: 0.45, h: 0.45, fill: { color: C.bg }, line: { color: C.primary, width: 1.5 } });
    s.addText(st.n, { x: 0.6, y: sy, w: 0.45, h: 0.45, fontSize: 14, fontFace: "Arial", color: C.primaryLight, bold: true, align: "center", valign: "middle", margin: 0 });
    addCard(s, 1.2, sy - 0.05, 7.0, 0.7);
    s.addText(st.title, { x: 1.35, y: sy, w: 4.5, h: 0.3, fontSize: 14, fontFace: "Arial", color: C.text, bold: true, valign: "middle", margin: 0 });
    s.addText(st.desc, { x: 1.35, y: sy + 0.28, w: 5, h: 0.22, fontSize: 10, fontFace: "Arial", color: C.dim, margin: 0 });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.2, y: sy + 0.02, w: 0.6, h: 0.25, fill: { color: st.tagColor, transparency: 80 }, line: { color: st.tagColor, width: 0.5, transparency: 50 }, rectRadius: 0.12 });
    s.addText(st.tag, { x: 6.2, y: sy + 0.02, w: 0.6, h: 0.25, fontSize: 9, fontFace: "Arial", color: st.tagColor, bold: true, align: "center", valign: "middle", margin: 0 });
    s.addText(st.time, { x: 7.0, y: sy + 0.02, w: 1, h: 0.25, fontSize: 9, fontFace: "Arial", color: C.dim, align: "left", valign: "middle", margin: 0 });
  });
}

// ═══════════════════════════════════════════
// SLIDE 7: Demo - Chat + Notification
// ═══════════════════════════════════════════
{
  const s = pres.addSlide();
  addBg(s);
  addTitle(s, "LIVE DEMO", "用起来是什么样", "");
  // Chat panel (left)
  addCard(s, 0.5, 1.7, 5.8, 3.7, { accent: C.purple });
  s.addText("💬 对话演示", { x: 0.7, y: 1.8, w: 3, h: 0.3, fontSize: 12, fontFace: "Arial", color: C.muted, bold: true, margin: 0 });
  // User message
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 2.2, w: 5.4, h: 0.45, fill: { color: C.bg, transparency: 30 }, line: { color: C.purple, width: 0.5, transparency: 50 }, rectRadius: 0.08 });
  s.addText("👤  帮我检查一下 77hub 的审批进度", { x: 0.85, y: 2.2, w: 5.1, h: 0.45, fontSize: 11, fontFace: "Arial", color: C.muted, valign: "middle", margin: 0 });
  // AI message
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 2.8, w: 5.4, h: 2.3, fill: { color: C.bg, transparency: 30 }, line: { color: C.cyan, width: 0.5, transparency: 50 }, rectRadius: 0.08 });
  s.addText("🤖  AI 助手", { x: 0.85, y: 2.85, w: 5, h: 0.22, fontSize: 9, fontFace: "Arial", color: C.cyan, bold: true, margin: 0 });
  s.addText([
    { text: "🔐 登录 77hub... ✓", options: { breakLine: true, color: C.green, fontSize: 10 } },
    { text: "📋 查询费用申请单 5 条  采购申请单 10 条", options: { breakLine: true, color: C.muted, fontSize: 10 } },
    { text: "🔍 发现 2 条状态变化：", options: { breakLine: true, color: C.orange, fontSize: 10 } },
    { text: "   • EX0720260400001 待审批→已生效", options: { breakLine: true, color: C.muted, fontSize: 10 } },
    { text: "   • QWSQ20260344 付款待审批→已生效", options: { breakLine: true, color: C.muted, fontSize: 10 } },
    { text: "🔔 已发送企业微信通知 ✓", options: { color: C.green, fontSize: 10 } },
  ], { x: 0.85, y: 3.08, w: 5.1, h: 1.9, fontFace: "Arial", lineSpacingMultiple: 1.3, valign: "top" });

  // Notification panel (right)
  addCard(s, 6.5, 1.7, 3.3, 3.7, { accent: C.green });
  s.addText("📱 企业微信通知", { x: 6.7, y: 1.8, w: 3, h: 0.3, fontSize: 12, fontFace: "Arial", color: C.muted, bold: true, margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 6.65, y: 2.2, w: 3.0, h: 3.0, fill: { color: C.bg, transparency: 60 }, rectRadius: 0.06 });
  s.addText([
    { text: "📊 77hub审批检查报告\n（2026-04-09）\n\n", options: { color: C.primaryLight, fontSize: 9, bold: true } },
    { text: "【🔴 状态变化】\n", options: { color: C.red, fontSize: 9, bold: true } },
    { text: "• EX07... 待审批→已生效\n", options: { color: C.muted, fontSize: 8 } },
    { text: "• QWSQ... 付款待审批→已生效\n\n", options: { color: C.muted, fontSize: 8 } },
    { text: "【🆕 新增】\n", options: { color: C.orange, fontSize: 9, bold: true } },
    { text: "• FWSQ20260350 ￥500\n\n", options: { color: C.muted, fontSize: 8 } },
    { text: "【✅ 已完成】\n", options: { color: C.green, fontSize: 9, bold: true } },
    { text: "• AF05... 已生效\n\n", options: { color: C.muted, fontSize: 8 } },
    { text: "已跳过 10 条已完成单据", options: { color: C.dim, fontSize: 8 } },
  ], { x: 6.8, y: 2.3, w: 2.7, h: 2.8, fontFace: "Consolas", lineSpacingMultiple: 1.1, valign: "top" });
}

// ═══════════════════════════════════════════
// SLIDE 8: Tracking Scope
// ═══════════════════════════════════════════
{
  const s = pres.addSlide();
  addBg(s);
  addTitle(s, "TRACKING SCOPE", "监控哪些单据", "覆盖费用申请和采购申请两类单据的完整审批链条");
  // Expense card
  addCard(s, 0.5, 1.8, 4.3, 2.8, { accent: C.primary });
  s.addText("💰", { x: 0.7, y: 1.9, w: 0.5, h: 0.5, fontSize: 24, margin: 0 });
  s.addText("费用申请单", { x: 1.2, y: 1.9, w: 3.3, h: 0.5, fontSize: 18, fontFace: "Arial", color: C.text, bold: true, valign: "middle", margin: 0 });
  s.addText("AF / EX 开头的费用和出差申请", { x: 0.7, y: 2.4, w: 3.8, h: 0.3, fontSize: 11, fontFace: "Arial", color: C.dim, margin: 0 });
  // Flow
  s.addText("费用申请单  →  费用报销单  →  报销付款单", { x: 0.7, y: 2.8, w: 4, h: 0.35, fontSize: 11, fontFace: "Arial", color: C.muted, align: "center", margin: 0 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 3.3, w: 3.9, h: 0.55, fill: { color: C.green, transparency: 88 }, line: { color: C.green, width: 0.75, transparency: 50 }, rectRadius: 0.08 });
  s.addText('✅ 完成标志：报销付款单状态为"已生效"', { x: 0.7, y: 3.3, w: 3.9, h: 0.55, fontSize: 10, fontFace: "Arial", color: C.green, align: "center", valign: "middle", margin: 0 });
  s.addText("全景路由：#/panoramic/ReimburseApply/{ID}", { x: 0.7, y: 4.0, w: 4, h: 0.25, fontSize: 9, fontFace: "Consolas", color: C.dim, margin: 0 });

  // Procurement card
  addCard(s, 5.2, 1.8, 4.3, 2.8, { accent: C.purple });
  s.addText("📦", { x: 5.4, y: 1.9, w: 0.5, h: 0.5, fontSize: 24, margin: 0 });
  s.addText("采购申请单", { x: 5.9, y: 1.9, w: 3.3, h: 0.5, fontSize: 18, fontFace: "Arial", color: C.text, bold: true, valign: "middle", margin: 0 });
  s.addText("FWSQ / QWSQ 开头的采购申请", { x: 5.4, y: 2.4, w: 3.8, h: 0.3, fontSize: 11, fontFace: "Arial", color: C.dim, margin: 0 });
  s.addText("采购申请  →  合同审批  →  付款申请  →  付款单", { x: 5.4, y: 2.8, w: 4, h: 0.35, fontSize: 11, fontFace: "Arial", color: C.muted, align: "center", margin: 0 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 5.4, y: 3.3, w: 3.9, h: 0.55, fill: { color: C.green, transparency: 88 }, line: { color: C.green, width: 0.75, transparency: 50 }, rectRadius: 0.08 });
  s.addText('✅ 完成标志：全部付款单状态为"已生效"', { x: 5.4, y: 3.3, w: 3.9, h: 0.55, fontSize: 10, fontFace: "Arial", color: C.green, align: "center", valign: "middle", margin: 0 });
  s.addText("全景路由：#/panoramic/CsCaiGouShenQing/{ID}", { x: 5.4, y: 4.0, w: 4, h: 0.25, fontSize: 9, fontFace: "Consolas", color: C.dim, margin: 0 });

  // Prefix legend
  addCard(s, 0.5, 4.8, 9, 0.6);
  const prefixes = [
    { code: "AF", name: "费用申请" },
    { code: "EX", name: "出差申请" },
    { code: "FYBX", name: "费用报销" },
    { code: "PA", name: "付款单" },
    { code: "FWSQ", name: "非物资采购" },
    { code: "QWSQ", name: "其他物资采购" },
    { code: "YF", name: "合同审批" },
    { code: "AP", name: "付款申请" },
  ];
  prefixes.forEach((p, i) => {
    const px = 0.7 + i * 1.1;
    s.addText(p.code, { x: px, y: 4.85, w: 0.5, h: 0.22, fontSize: 9, fontFace: "Consolas", color: C.primaryLight, bold: true, margin: 0 });
    s.addText(p.name, { x: px, y: 5.05, w: 0.8, h: 0.2, fontSize: 8, fontFace: "Arial", color: C.dim, margin: 0 });
  });
}

// ═══════════════════════════════════════════
// SLIDE 9: Project Files
// ═══════════════════════════════════════════
{
  const s = pres.addSlide();
  addBg(s);
  addTitle(s, "PROJECT FILES", "仓库里有什么", "每个文件都有明确用途，分别面向 AI 和人类");
  // File tree card
  addCard(s, 0.5, 1.8, 5.5, 3.6, { accent: C.primary });
  const files = [
    { icon: "📖", name: "README.md", desc: "项目总览，所有人", color: C.cyan },
    { icon: "📖", name: "SETUP.md", desc: "安装指南，给人类", color: C.cyan },
    { icon: "📄", name: ".gitignore", desc: "", color: C.dim },
    { icon: "", name: "SKILL/", desc: "", color: C.muted, bold: true },
    { icon: "🧠", name: "  SKILL.md", desc: "工作流 SOP，给 AI", color: C.purple },
    { icon: "🔧", name: "  platform-guide.md", desc: "平台技术参考", color: C.orange },
    { icon: "💬", name: "  wecom-notify.ps1", desc: "企业微信通知脚本", color: C.green },
  ];
  files.forEach((f, i) => {
    const fy = 2.0 + i * 0.44;
    const isBold = f.bold || false;
    s.addText(f.icon + "  " + f.name, { x: 0.7, y: fy, w: 3.0, h: 0.3, fontSize: isBold ? 12 : 11, fontFace: isBold ? "Arial" : "Consolas", color: isBold ? C.muted : C.text, bold: isBold, valign: "middle", margin: 0 });
    if (f.desc) {
      s.addText(f.desc, { x: 3.5, y: fy, w: 2.3, h: 0.3, fontSize: 9, fontFace: "Arial", color: f.color, valign: "middle", margin: 0 });
    }
  });

  // Audience card
  addCard(s, 6.3, 1.8, 3.2, 1.7, { accent: C.cyan });
  s.addText("👤 人类受众", { x: 6.5, y: 1.9, w: 2.8, h: 0.35, fontSize: 14, fontFace: "Arial", color: C.text, bold: true, margin: 0 });
  s.addText([
    { text: "README.md — 项目总览", options: { bullet: true, breakLine: true, color: C.muted, fontSize: 10 } },
    { text: "SETUP.md — 安装指南", options: { bullet: true, color: C.muted, fontSize: 10 } },
  ], { x: 6.5, y: 2.35, w: 2.8, h: 1.0, fontFace: "Arial", valign: "top" });

  addCard(s, 6.3, 3.7, 3.2, 1.7, { accent: C.purple });
  s.addText("🤖 AI 受众", { x: 6.5, y: 3.8, w: 2.8, h: 0.35, fontSize: 14, fontFace: "Arial", color: C.text, bold: true, margin: 0 });
  s.addText([
    { text: "SKILL.md — 工作流 SOP", options: { bullet: true, breakLine: true, color: C.muted, fontSize: 10 } },
    { text: "platform-guide.md — 技术参考", options: { bullet: true, breakLine: true, color: C.muted, fontSize: 10 } },
    { text: "wecom-notify.ps1 — 通知脚本", options: { bullet: true, color: C.muted, fontSize: 10 } },
  ], { x: 6.5, y: 4.25, w: 2.8, h: 1.0, fontFace: "Arial", valign: "top" });
}

// ═══════════════════════════════════════════
// SLIDE 10: CTA / Get Started
// ═══════════════════════════════════════════
{
  const s = pres.addSlide();
  addBg(s);
  // Decorative
  s.addShape(pres.shapes.OVAL, { x: -2, y: 2, w: 6, h: 6, fill: { color: C.primary, transparency: 93 } });
  s.addShape(pres.shapes.OVAL, { x: 8, y: -2, w: 5, h: 5, fill: { color: C.green, transparency: 93 } });
  // Main content
  s.addText("READY TO START?", { x: 0.6, y: 1.2, w: 8.8, h: 0.6, fontSize: 36, fontFace: "Arial", color: C.text, bold: true, align: "center", margin: 0 });
  s.addText("把 GitHub 链接发给同事，告诉 WorkBuddy \"帮我安装这个 skill\" 即可", { x: 1, y: 1.9, w: 8, h: 0.5, fontSize: 16, fontFace: "Arial", color: C.muted, align: "center" });
  // Summary stats
  const summary = [
    { icon: "🤖", label: "8 步安装", desc: "3 分钟手动 + AI 自动" },
    { icon: "🔄", label: "增量检查", desc: "只查未完成 + 检测新增" },
    { icon: "💬", label: "微信通知", desc: "有变化详细，无变化简短" },
    { icon: "⏰", label: "定时执行", desc: "工作日 12:00 全自动" },
  ];
  summary.forEach((item, i) => {
    const cx = 0.6 + i * 2.4;
    addCard(s, cx, 2.7, 2.15, 1.8);
    s.addText(item.icon, { x: cx, y: 2.8, w: 2.15, h: 0.5, fontSize: 28, align: "center", margin: 0 });
    s.addText(item.label, { x: cx, y: 3.25, w: 2.15, h: 0.35, fontSize: 13, fontFace: "Arial", color: C.text, bold: true, align: "center", margin: 0 });
    s.addText(item.desc, { x: cx + 0.1, y: 3.6, w: 1.95, h: 0.6, fontSize: 10, fontFace: "Arial", color: C.dim, align: "center" });
  });
  // Footer
  s.addText("77hub Approval Tracker  ·  WorkBuddy Skill  ·  MIT License", { x: 0.6, y: 5.0, w: 8.8, h: 0.3, fontSize: 10, fontFace: "Arial", color: C.dim, align: "center" });
}

// ── Write File ──
const outPath = process.argv[2] || "77hub-approval-tracker.pptx";
pres.writeFile({ fileName: outPath })
  .then(() => console.log("OK: " + outPath))
  .catch((err) => { console.error("ERROR:", err); process.exit(1); });
