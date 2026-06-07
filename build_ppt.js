const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.title = '拉霸機資料庫期末報告';

// === Color Palette (Casino theme) ===
const C = {
  bg_dark: '0D1117',      // deep dark
  bg_card: '161B22',      // card bg
  bg_mid: '21262D',       // lighter card
  gold: 'D4A017',         // casino gold
  gold_light: 'F0C040',   // bright gold
  white: 'FFFFFF',
  gray: 'A0A0A0',
  light_gray: 'E0E0E0',
  red: 'E53E3E',
  green: '38A169',
  blue: '4299E1',
  teal: '319795',
  purple: '805AD5',
};

// === Helper: shadow factory ===
const makeShadow = () => ({ type: "outer", blur: 8, offset: 3, angle: 135, color: "000000", opacity: 0.4 });

// =============================================================================
// SLIDE 1: TITLE
// =============================================================================
{
  const s = pres.addSlide();
  s.background = { color: C.bg_dark };

  // Background decorative shapes
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.5, fill: { color: C.gold }, line: { color: C.gold } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 4.2, w: 10, h: 1.425, fill: { color: '1A1A1A' }, line: { color: '1A1A1A' } });

  // Slot machine emoji row on gold bar
  s.addText('🎰  拉霸機 Web 專案  🎰', {
    x: 0, y: 0.25, w: 10, h: 1.0,
    fontSize: 32, bold: true, color: C.bg_dark, align: 'center', fontFace: 'Arial Black',
    margin: 0,
  });

  // Main title
  s.addText('資料庫期末報告', {
    x: 0.5, y: 1.7, w: 9, h: 1.1,
    fontSize: 44, bold: true, color: C.white, align: 'center', fontFace: 'Arial Black',
    margin: 0,
  });

  // Subtitle
  s.addText('Node.js + Express + SQLite 全端實作', {
    x: 0.5, y: 2.85, w: 9, h: 0.6,
    fontSize: 20, color: C.gold_light, align: 'center', fontFace: 'Arial',
    margin: 0,
  });

  // Three feature chips
  const chips = ['🎲 隨機抽獎引擎', '💾 SQLite 資料庫', '🏆 玩家排行榜'];
  chips.forEach((text, i) => {
    const x = 0.7 + i * 3.1;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y: 3.55, w: 2.8, h: 0.5,
      fill: { color: '2D3748' }, line: { color: C.gold }, rectRadius: 0.08,
    });
    s.addText(text, {
      x, y: 3.55, w: 2.8, h: 0.5,
      fontSize: 13, color: C.gold_light, align: 'center', fontFace: 'Arial', margin: 0,
    });
  });

  // Bottom bar text
  s.addText('資料庫管理系統 期末專案  |  2026', {
    x: 0, y: 4.3, w: 10, h: 0.8,
    fontSize: 14, color: C.gray, align: 'center', fontFace: 'Arial', margin: 0,
  });
}

// =============================================================================
// SLIDE 2: SYSTEM ARCHITECTURE
// =============================================================================
{
  const s = pres.addSlide();
  s.background = { color: C.bg_dark };

  s.addText('系統架構', {
    x: 0.5, y: 0.2, w: 9, h: 0.6,
    fontSize: 30, bold: true, color: C.gold, fontFace: 'Arial Black', margin: 0,
  });

  // Three-tier boxes
  const tiers = [
    { label: '前端 (Frontend)', emoji: '🖥️', tech: 'HTML / CSS / JavaScript', color: '2A4A7F', items: ['拉霸動畫轉盤', '登入 / 註冊介面', '排行榜顯示', '下注金額控制'] },
    { label: '後端 (Backend)', emoji: '⚙️', tech: 'Node.js + Express', color: '2D5A27', items: ['REST API 路由', '業務邏輯處理', '玩家帳號驗證', '隨機抽獎運算'] },
    { label: '資料庫 (Database)', emoji: '🗃️', tech: 'SQLite', color: '5A2D27', items: ['玩家資料表', '拉霸機選項表', '餘額即時更新', '盈餘自動計算'] },
  ];

  tiers.forEach((t, i) => {
    const x = 0.3 + i * 3.2;
    // Card bg
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 0.95, w: 3.0, h: 4.4,
      fill: { color: t.color }, line: { color: C.gold },
      shadow: makeShadow(),
    });
    // Header
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 0.95, w: 3.0, h: 0.65,
      fill: { color: C.gold }, line: { color: C.gold },
    });
    s.addText(t.emoji + '  ' + t.label, {
      x, y: 0.95, w: 3.0, h: 0.65,
      fontSize: 13, bold: true, color: C.bg_dark, align: 'center', fontFace: 'Arial', margin: 0,
    });
    s.addText(t.tech, {
      x, y: 1.65, w: 3.0, h: 0.45,
      fontSize: 13, bold: true, color: C.gold_light, align: 'center', fontFace: 'Consolas', margin: 0,
    });
    // Items
    const itemTexts = t.items.map((txt, idx) => ({
      text: txt,
      options: { bullet: true, breakLine: idx < t.items.length - 1, color: C.white, fontSize: 13 },
    }));
    s.addText(itemTexts, {
      x: x + 0.15, y: 2.2, w: 2.7, h: 2.9,
      fontFace: 'Arial', margin: 0,
    });
  });

  // Arrows between tiers
  [1, 2].forEach(i => {
    const ax = 0.3 + i * 3.2 - 0.05;
    s.addShape(pres.shapes.LINE, {
      x: ax - 0.2, y: 3.15, w: 0.4, h: 0,
      line: { color: C.gold, width: 2 },
    });
    s.addText('⇄', { x: ax - 0.2, y: 2.9, w: 0.4, h: 0.5, fontSize: 20, color: C.gold, align: 'center', margin: 0 });
  });

  // API label
  s.addText('HTTP / REST API', { x: 2.9, y: 3.4, w: 1.5, h: 0.35, fontSize: 10, color: C.gray, align: 'center', margin: 0 });
  s.addText('sqlite3 模組', { x: 6.1, y: 3.4, w: 1.5, h: 0.35, fontSize: 10, color: C.gray, align: 'center', margin: 0 });
}

// =============================================================================
// SLIDE 3: DB DESIGN COMPARISON (Others vs Mine)
// =============================================================================
{
  const s = pres.addSlide();
  s.background = { color: C.bg_dark };

  s.addText('拉霸機資料庫：常見設計方式', {
    x: 0.3, y: 0.15, w: 9.4, h: 0.6,
    fontSize: 28, bold: true, color: C.gold, fontFace: 'Arial Black', margin: 0,
  });

  // Left column: Traditional
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.2, y: 0.85, w: 4.5, h: 4.55,
    fill: { color: C.bg_card }, line: { color: '4A90D9' },
    shadow: makeShadow(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.2, y: 0.85, w: 4.5, h: 0.52,
    fill: { color: '4A90D9' }, line: { color: '4A90D9' },
  });
  s.addText('🏦  傳統賭場設計方式', {
    x: 0.2, y: 0.85, w: 4.5, h: 0.52,
    fontSize: 14, bold: true, color: C.white, align: 'center', fontFace: 'Arial', margin: 0,
  });

  const tradItems = [
    { title: '多張資料表分開設計', desc: 'symbols / reels / paylines / pay_combos 各自獨立' },
    { title: '固定賠付線 (Payline)', desc: '水平、斜線、Z字型等指定連線才算中獎' },
    { title: '加權亂數 (RNG)', desc: '每個位置有獨立的加權機率池，模擬物理轉輪' },
    { title: '交易記錄 Log 表', desc: '每一局都記錄 session_id、時間戳、輸贏金額以利稽核' },
    { title: '設計複雜度高', desc: '符合博弈監管要求，可驗證公平性' },
  ];

  tradItems.forEach((item, i) => {
    const y = 1.5 + i * 0.72;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.35, y, w: 0.06, h: 0.35,
      fill: { color: '4A90D9' }, line: { color: '4A90D9' },
    });
    s.addText(item.title, {
      x: 0.55, y, w: 4.0, h: 0.28,
      fontSize: 12, bold: true, color: C.white, fontFace: 'Arial', margin: 0,
    });
    s.addText(item.desc, {
      x: 0.55, y: y + 0.28, w: 4.0, h: 0.3,
      fontSize: 10, color: C.gray, fontFace: 'Arial', margin: 0,
    });
  });

  // Right column: My approach
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 0.85, w: 4.5, h: 4.55,
    fill: { color: C.bg_card }, line: { color: C.gold },
    shadow: makeShadow(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 0.85, w: 4.5, h: 0.52,
    fill: { color: C.gold }, line: { color: C.gold },
  });
  s.addText('⭐  本專案設計方式', {
    x: 5.3, y: 0.85, w: 4.5, h: 0.52,
    fontSize: 14, bold: true, color: C.bg_dark, align: 'center', fontFace: 'Arial', margin: 0,
  });

  const myItems = [
    { title: '僅 2 張資料表', desc: '拉霸機選項 + 玩家資料表，結構簡單清晰' },
    { title: '散件疊加機制', desc: '無需賠付線！出現即得獎，依數量給不同獎金' },
    { title: 'ORDER BY RANDOM()', desc: 'SQLite 內建隨機排序，直接取前3筆為結果' },
    { title: '前端計算盈餘', desc: '玩家盈餘 = 剩餘金額 − 10000，在前端即時計算' },
    { title: '輕量化易部署', desc: '無額外 Log 表，適合課程展示與快速開發' },
  ];

  myItems.forEach((item, i) => {
    const y = 1.5 + i * 0.72;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.45, y, w: 0.06, h: 0.35,
      fill: { color: C.gold }, line: { color: C.gold },
    });
    s.addText(item.title, {
      x: 5.65, y, w: 4.0, h: 0.28,
      fontSize: 12, bold: true, color: C.gold_light, fontFace: 'Arial', margin: 0,
    });
    s.addText(item.desc, {
      x: 5.65, y: y + 0.28, w: 4.0, h: 0.3,
      fontSize: 10, color: C.gray, fontFace: 'Arial', margin: 0,
    });
  });
}

// =============================================================================
// SLIDE 4: MY DB SCHEMA
// =============================================================================
{
  const s = pres.addSlide();
  s.background = { color: C.bg_dark };

  s.addText('資料庫結構設計', {
    x: 0.3, y: 0.15, w: 9.4, h: 0.6,
    fontSize: 28, bold: true, color: C.gold, fontFace: 'Arial Black', margin: 0,
  });

  // Table 1: 拉霸機選項
  const t1x = 0.3, t1y = 0.85;
  s.addShape(pres.shapes.RECTANGLE, {
    x: t1x, y: t1y, w: 4.3, h: 3.8,
    fill: { color: C.bg_card }, line: { color: C.gold },
    shadow: makeShadow(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: t1x, y: t1y, w: 4.3, h: 0.5,
    fill: { color: C.gold }, line: { color: C.gold },
  });
  s.addText('🎰  拉霸機選項', {
    x: t1x, y: t1y, w: 4.3, h: 0.5,
    fontSize: 15, bold: true, color: C.bg_dark, align: 'center', fontFace: 'Arial', margin: 0,
  });

  const t1cols = [
    ['物件ID', 'CHAR(10)', 'PRIMARY KEY', ''],
    ['物件名稱', 'VARCHAR(20)', '', '蘋果、嘉年華...'],
    ['數量', 'INT', '', '輪盤中出現的籤數'],
    ['機率', 'FLOAT', '', '單軸機率 (%)'],
    ['win1', 'INT', '', '出現1個的獎金'],
    ['win2', 'INT', '', '出現2個的獎金'],
    ['jakapot', 'INT', '', '出現3個的獎金'],
  ];

  // Header row
  s.addShape(pres.shapes.RECTANGLE, {
    x: t1x, y: t1y + 0.5, w: 4.3, h: 0.38,
    fill: { color: '2D3748' }, line: { color: C.bg_card },
  });
  ['欄位名', '型別', '說明'].forEach((h, i) => {
    s.addText(h, {
      x: t1x + i * 1.43, y: t1y + 0.5, w: 1.43, h: 0.38,
      fontSize: 10, bold: true, color: C.gold_light, align: 'center', fontFace: 'Arial', margin: 0,
    });
  });

  t1cols.forEach((row, i) => {
    const ry = t1y + 0.9 + i * 0.41;
    const bg = i % 2 === 0 ? '1C2533' : '1A1F2A';
    s.addShape(pres.shapes.RECTANGLE, {
      x: t1x, y: ry, w: 4.3, h: 0.41,
      fill: { color: bg }, line: { color: C.bg_card },
    });
    const isPK = row[2] === 'PRIMARY KEY';
    s.addText(row[0], {
      x: t1x + 0.05, y: ry, w: 1.38, h: 0.41,
      fontSize: 10, bold: isPK, color: isPK ? C.gold_light : C.white, fontFace: 'Consolas', margin: 0,
    });
    s.addText(row[1], {
      x: t1x + 1.43, y: ry, w: 1.3, h: 0.41,
      fontSize: 9, color: '68D391', fontFace: 'Consolas', margin: 0,
    });
    s.addText(row[2] || row[3], {
      x: t1x + 2.73, y: ry, w: 1.5, h: 0.41,
      fontSize: 9, color: C.gray, fontFace: 'Arial', margin: 0,
    });
  });

  // Table 2: 玩家資料表
  const t2x = 5.4, t2y = 0.85;
  s.addShape(pres.shapes.RECTANGLE, {
    x: t2x, y: t2y, w: 4.3, h: 3.8,
    fill: { color: C.bg_card }, line: { color: C.teal },
    shadow: makeShadow(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: t2x, y: t2y, w: 4.3, h: 0.5,
    fill: { color: C.teal }, line: { color: C.teal },
  });
  s.addText('👤  玩家資料表', {
    x: t2x, y: t2y, w: 4.3, h: 0.5,
    fontSize: 15, bold: true, color: C.white, align: 'center', fontFace: 'Arial', margin: 0,
  });

  const t2cols = [
    ['玩家ID', 'CHAR(20)', 'PRIMARY KEY', ''],
    ['玩家名稱', 'VARCHAR(30)', '', '顯示用名稱'],
    ['帳號', 'VARCHAR(30)', 'UNIQUE', '登入帳號'],
    ['密碼', 'VARCHAR(30)', '', '登入密碼'],
    ['剩餘金額', 'INT', '', '初始 10,000 元'],
    ['盈餘', '—', '前端計算', '剩餘金額 − 10000'],
  ];

  s.addShape(pres.shapes.RECTANGLE, {
    x: t2x, y: t2y + 0.5, w: 4.3, h: 0.38,
    fill: { color: '2D3748' }, line: { color: C.bg_card },
  });
  ['欄位名', '型別', '說明'].forEach((h, i) => {
    s.addText(h, {
      x: t2x + i * 1.43, y: t2y + 0.5, w: 1.43, h: 0.38,
      fontSize: 10, bold: true, color: '81E6D9', align: 'center', fontFace: 'Arial', margin: 0,
    });
  });

  t2cols.forEach((row, i) => {
    const ry = t2y + 0.9 + i * 0.41;
    const bg = i % 2 === 0 ? '1C2533' : '1A1F2A';
    s.addShape(pres.shapes.RECTANGLE, {
      x: t2x, y: ry, w: 4.3, h: 0.41,
      fill: { color: bg }, line: { color: C.bg_card },
    });
    const isPK = row[2] === 'PRIMARY KEY';
    s.addText(row[0], {
      x: t2x + 0.05, y: ry, w: 1.38, h: 0.41,
      fontSize: 10, bold: isPK, color: isPK ? '81E6D9' : C.white, fontFace: 'Consolas', margin: 0,
    });
    s.addText(row[1], {
      x: t2x + 1.43, y: ry, w: 1.3, h: 0.41,
      fontSize: 9, color: '68D391', fontFace: 'Consolas', margin: 0,
    });
    s.addText(row[2] || row[3], {
      x: t2x + 2.73, y: ry, w: 1.5, h: 0.41,
      fontSize: 9, color: C.gray, fontFace: 'Arial', margin: 0,
    });
  });

  // Relationship arrow
  s.addShape(pres.shapes.LINE, {
    x: 4.6, y: 2.75, w: 0.8, h: 0,
    line: { color: C.gray, width: 1.5 },
  });
  s.addText('各自獨立\n(無 FK)', {
    x: 4.55, y: 2.55, w: 0.9, h: 0.5,
    fontSize: 8, color: C.gray, align: 'center', margin: 0,
  });
}

// =============================================================================
// SLIDE 5: EXPECTED VALUE (期望值)
// =============================================================================
{
  const s = pres.addSlide();
  s.background = { color: C.bg_dark };

  s.addText('期望值分析 (Expected Value)', {
    x: 0.3, y: 0.12, w: 9.4, h: 0.6,
    fontSize: 28, bold: true, color: C.gold, fontFace: 'Arial Black', margin: 0,
  });

  // Subtitle
  s.addText('每次下注 100 元，平均可以拿回多少？', {
    x: 0.3, y: 0.72, w: 9, h: 0.38,
    fontSize: 14, color: C.light_gray, fontFace: 'Arial', margin: 0,
  });

  // Mechanic explanation box
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.2, y: 1.1, w: 4.0, h: 2.1,
    fill: { color: C.bg_card }, line: { color: '4A90D9' },
    shadow: makeShadow(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.2, y: 1.1, w: 4.0, h: 0.42,
    fill: { color: '4A90D9' }, line: { color: '4A90D9' },
  });
  s.addText('⚙️  抽獎機制', {
    x: 0.2, y: 1.1, w: 4.0, h: 0.42,
    fontSize: 13, bold: true, color: C.white, align: 'center', fontFace: 'Arial', margin: 0,
  });
  s.addText([
    { text: 'SELECT * FROM 拉霸機選項\nORDER BY RANDOM() LIMIT 3', options: { breakLine: true, fontSize: 11, color: '7EC8E3', fontFace: 'Consolas' } },
    { text: '\n從 10 種符號中隨機取 3 種\n（不重複抽樣）\n每種符號最多出現 1 次', options: { fontSize: 11, color: C.light_gray, fontFace: 'Arial' } },
  ], {
    x: 0.35, y: 1.57, w: 3.7, h: 1.55, margin: 0,
  });

  // Payout table
  s.addShape(pres.shapes.RECTANGLE, {
    x: 4.4, y: 1.1, w: 5.4, h: 2.1,
    fill: { color: C.bg_card }, line: { color: C.gold },
    shadow: makeShadow(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 4.4, y: 1.1, w: 5.4, h: 0.42,
    fill: { color: C.gold }, line: { color: C.gold },
  });
  s.addText('💰  各符號 win1 獎金 (出現1次)', {
    x: 4.4, y: 1.1, w: 5.4, h: 0.42,
    fontSize: 13, bold: true, color: C.bg_dark, align: 'center', fontFace: 'Arial', margin: 0,
  });

  // Header
  s.addShape(pres.shapes.RECTANGLE, {
    x: 4.4, y: 1.52, w: 5.4, h: 0.38,
    fill: { color: '2D3748' }, line: { color: C.bg_card },
  });
  ['等級', '符號', '數量(10種中)', 'win1'].forEach((h, i) => {
    const ws = [0.7, 1.6, 1.6, 1.5];
    const xs = [4.4, 5.1, 6.7, 8.3];
    s.addText(h, {
      x: xs[i], y: 1.52, w: ws[i], h: 0.38,
      fontSize: 10, bold: true, color: C.gold_light, align: 'center', fontFace: 'Arial', margin: 0,
    });
  });

  const payRows = [
    ['低階', '🍎🍌🏎️💰', '4 種', '10 元'],
    ['中階', '🦄🏰🚁🎈', '4 種', '20 元'],
    ['高階', '🎡⭐', '2 種', '30 元'],
  ];
  const payRowColors = ['1C2533', '1A1F2A', '1C2533'];
  payRows.forEach((row, i) => {
    const ry = 1.9 + i * 0.42;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 4.4, y: ry, w: 5.4, h: 0.42,
      fill: { color: payRowColors[i] }, line: { color: C.bg_card },
    });
    const ws = [0.7, 1.6, 1.6, 1.5];
    const xs = [4.4, 5.1, 6.7, 8.3];
    const colors = [['68D391', 'F6AD55', '68D391', C.white], ['68D391', 'F6AD55', '68D391', C.white], ['68D391', 'F6AD55', '68D391', 'FC8181']];
    row.forEach((cell, j) => {
      s.addText(cell, {
        x: xs[j], y: ry, w: ws[j], h: 0.42,
        fontSize: j === 1 ? 13 : 11, color: colors[i][j], align: 'center', fontFace: j === 1 ? 'Arial' : 'Arial', margin: 0,
      });
    });
  });

  // Expected Value calculation
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.2, y: 3.3, w: 9.6, h: 2.05,
    fill: { color: '1A1230' }, line: { color: C.gold },
    shadow: makeShadow(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.2, y: 3.3, w: 9.6, h: 0.42,
    fill: { color: '5A3E9A' }, line: { color: '5A3E9A' },
  });
  s.addText('📊  期望值計算過程', {
    x: 0.2, y: 3.3, w: 9.6, h: 0.42,
    fontSize: 13, bold: true, color: C.white, align: 'center', fontFace: 'Arial', margin: 0,
  });

  // Left: formula
  s.addText([
    { text: '每局選出 3 種符號，每種各得 win1 一次', options: { breakLine: true, color: C.light_gray, fontSize: 12 } },
    { text: 'E[平均 win1] = (4×10 + 4×20 + 2×30) ÷ 10 = 180÷10 = 18 元', options: { breakLine: true, color: '7EC8E3', fontSize: 12, fontFace: 'Consolas' } },
    { text: 'E[每局期望獎金] = 3 種符號 × 18 元 = 54 元', options: { color: C.gold_light, fontSize: 12, fontFace: 'Consolas' } },
  ], {
    x: 0.4, y: 3.78, w: 5.5, h: 1.4, margin: 0,
  });

  // Right: result chips
  const results = [
    { label: '期望獎金', val: '54 元', sub: '每局平均回收', color: 'E53E3E' },
    { label: '投入成本', val: '100 元', sub: '每局下注', color: '4A90D9' },
    { label: '玩家 RTP', val: '54%', sub: 'Return to Player', color: '38A169' },
    { label: '莊家優勢', val: '46%', sub: 'House Edge', color: C.gold },
  ];
  results.forEach((r, i) => {
    const rx = 6.05 + (i % 2) * 1.85;
    const ry = 3.78 + Math.floor(i / 2) * 0.75;
    s.addShape(pres.shapes.RECTANGLE, {
      x: rx, y: ry, w: 1.7, h: 0.68,
      fill: { color: '2A2040' }, line: { color: r.color },
    });
    s.addText(r.val, {
      x: rx, y: ry + 0.02, w: 1.7, h: 0.38,
      fontSize: 18, bold: true, color: r.color, align: 'center', fontFace: 'Arial Black', margin: 0,
    });
    s.addText(r.label, {
      x: rx, y: ry + 0.38, w: 1.7, h: 0.28,
      fontSize: 9, color: C.gray, align: 'center', fontFace: 'Arial', margin: 0,
    });
  });
}

// =============================================================================
// SLIDE 6: KEY FEATURES (before demo)
// =============================================================================
{
  const s = pres.addSlide();
  s.background = { color: C.bg_dark };

  s.addText('核心功能一覽', {
    x: 0.3, y: 0.12, w: 9.4, h: 0.6,
    fontSize: 28, bold: true, color: C.gold, fontFace: 'Arial Black', margin: 0,
  });

  const features = [
    { icon: '🔐', title: '登入 / 註冊系統', desc: '帳號重複防呆、自動跳轉遊戲頁', color: '4A90D9' },
    { icon: '🎰', title: '拉霸動畫轉盤', desc: '3 輪 CSS 動畫，依序停止呈現結果', color: C.gold },
    { icon: '💵', title: '即時餘額管理', desc: '下注前扣款，中獎後加回，DB 即時同步', color: '38A169' },
    { icon: '🤖', title: '自動拉霸模式', desc: '一鍵連續轉動，餘額不足自動停止', color: '805AD5' },
    { icon: '🏆', title: '玩家排行榜', desc: '依盈餘排序，前5名即時顯示', color: 'E53E3E' },
    { icon: '📥', title: '自訂下注金額', desc: '可手動輸入或按鈕調整，最低 100 元', color: '319795' },
  ];

  features.forEach((f, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.25 + col * 3.22;
    const y = 0.85 + row * 2.35;

    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 3.05, h: 2.15,
      fill: { color: C.bg_card }, line: { color: f.color },
      shadow: makeShadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 3.05, h: 0.06,
      fill: { color: f.color }, line: { color: f.color },
    });
    s.addText(f.icon, {
      x, y: y + 0.15, w: 3.05, h: 0.7,
      fontSize: 36, align: 'center', margin: 0,
    });
    s.addText(f.title, {
      x: x + 0.1, y: y + 0.88, w: 2.85, h: 0.45,
      fontSize: 13, bold: true, color: f.color, align: 'center', fontFace: 'Arial', margin: 0,
    });
    s.addText(f.desc, {
      x: x + 0.1, y: y + 1.3, w: 2.85, h: 0.7,
      fontSize: 11, color: C.light_gray, align: 'center', fontFace: 'Arial', margin: 0,
    });
  });
}

// =============================================================================
// SLIDE 7: DEMO & Q&A
// =============================================================================
{
  const s = pres.addSlide();
  s.background = { color: C.bg_dark };

  // Gold top bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1.2,
    fill: { color: C.gold }, line: { color: C.gold },
  });
  s.addText('🎰  LIVE DEMO', {
    x: 0, y: 0.15, w: 10, h: 0.9,
    fontSize: 36, bold: true, color: C.bg_dark, align: 'center', fontFace: 'Arial Black', margin: 0,
  });

  // Demo steps
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 1.35, w: 5.5, h: 3.0,
    fill: { color: C.bg_card }, line: { color: C.gold },
    shadow: makeShadow(),
  });
  s.addText('演示流程', {
    x: 0.3, y: 1.35, w: 5.5, h: 0.48,
    fontSize: 15, bold: true, color: C.gold, align: 'center', fontFace: 'Arial', margin: 0,
  });

  const steps = [
    '① 啟動伺服器：node app.js',
    '② 開啟瀏覽器 → 登入 / 註冊帳號',
    '③ 手動拉霸 → 觀察餘額即時變化',
    '④ 切換自動模式 → 快速連轉',
    '⑤ 開啟排行榜 → 查看盈虧排名',
  ];
  const stepTexts = steps.map((t, i) => ({
    text: t,
    options: { bullet: false, breakLine: i < steps.length - 1, fontSize: 13, color: i === 0 ? '7EC8E3' : C.white },
  }));
  s.addText(stepTexts, {
    x: 0.5, y: 1.9, w: 5.1, h: 2.3, fontFace: 'Arial', margin: 0,
  });

  // Q&A box
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.0, y: 1.35, w: 3.7, h: 3.0,
    fill: { color: '1A1230' }, line: { color: C.purple },
    shadow: makeShadow(),
  });
  s.addText('❓  Q & A', {
    x: 6.0, y: 1.35, w: 3.7, h: 0.48,
    fontSize: 18, bold: true, color: C.purple, align: 'center', fontFace: 'Arial Black', margin: 0,
  });
  s.addText('感謝聆聽！\n\n歡迎老師提問', {
    x: 6.1, y: 2.0, w: 3.5, h: 2.0,
    fontSize: 18, bold: true, color: C.white, align: 'center', fontFace: 'Arial', margin: 0,
  });

  // Bottom summary bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.85, w: 10, h: 0.775,
    fill: { color: '1A1A1A' }, line: { color: '1A1A1A' },
  });
  s.addText('Node.js + Express + SQLite  ｜  散件疊加拉霸機  ｜  RTP 54%  ｜  玩家排行榜  ｜  自動拉霸', {
    x: 0, y: 4.88, w: 10, h: 0.72,
    fontSize: 11, color: C.gray, align: 'center', fontFace: 'Arial', margin: 0,
  });
}

// === Write file ===
const outPath = 'D:/周子謙/claude_code工作資料夾/資料庫期末報告0607.pptx';
pres.writeFile({ fileName: outPath }).then(() => {
  console.log('DONE: ' + outPath);
}).catch(err => {
  console.error('ERROR:', err);
});
