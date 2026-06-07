const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.title = '拉霸機資料庫期末報告';

const C = {
  bg_dark:    '0D1117',
  bg_card:    '161B22',
  gold:       'D4A017',
  gold_light: 'F0C040',
  white:      'FFFFFF',
  gray:       'A0A0A0',
  light_gray: 'E0E0E0',
  teal:       '319795',
  blue:       '4A90D9',
  purple:     '805AD5',
  green:      '38A169',
  red:        'E53E3E',
};

const makeShadow = () => ({ type: "outer", blur: 8, offset: 3, angle: 135, color: "000000", opacity: 0.4 });

// =============================================================================
// SLIDE 1: TITLE + 個人資訊
// =============================================================================
{
  const s = pres.addSlide();
  s.background = { color: C.bg_dark };

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.5, fill: { color: C.gold }, line: { color: C.gold } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 4.2, w: 10, h: 1.425, fill: { color: '1A1A1A' }, line: { color: '1A1A1A' } });

  s.addText('🎰  拉霸機 Web 專案  🎰', {
    x: 0, y: 0.25, w: 10, h: 1.0,
    fontSize: 32, bold: true, color: C.bg_dark, align: 'center', fontFace: 'Arial Black', margin: 0,
  });

  s.addText('資料庫期末報告', {
    x: 0.5, y: 1.7, w: 9, h: 1.0,
    fontSize: 44, bold: true, color: C.white, align: 'center', fontFace: 'Arial Black', margin: 0,
  });

  s.addText('Node.js + Express + SQLite 全端實作', {
    x: 0.5, y: 2.75, w: 9, h: 0.55,
    fontSize: 20, color: C.gold_light, align: 'center', fontFace: 'Arial', margin: 0,
  });

  // 個人資訊卡
  s.addShape(pres.shapes.RECTANGLE, {
    x: 3.3, y: 3.38, w: 3.4, h: 0.72,
    fill: { color: '1E2530' }, line: { color: C.gold },
    shadow: makeShadow(),
  });
  s.addText('班級：資科一A　　學號：14173115　　姓名：周子謙', {
    x: 3.3, y: 3.38, w: 3.4, h: 0.72,
    fontSize: 11, color: C.gold_light, align: 'center', fontFace: 'Arial', margin: 0,
  });

  s.addText('資料庫管理系統 期末專案  |  2026', {
    x: 0, y: 4.3, w: 10, h: 0.8,
    fontSize: 14, color: C.gray, align: 'center', fontFace: 'Arial', margin: 0,
  });
}

// =============================================================================
// SLIDE 2: 系統流程
// =============================================================================
{
  const s = pres.addSlide();
  s.background = { color: C.bg_dark };

  s.addText('系統流程', {
    x: 0.4, y: 0.15, w: 9, h: 0.55,
    fontSize: 28, bold: true, color: C.gold, fontFace: 'Arial Black', margin: 0,
  });

  // ── 上半段：拉霸流程 ──
  s.addText('按下拉桿後發生的事', {
    x: 0.4, y: 0.78, w: 4, h: 0.35,
    fontSize: 13, bold: true, color: C.gold_light, fontFace: 'Arial', margin: 0,
  });

  const spinSteps = [
    { icon: '👆', title: '玩家按下拉桿', sub: '前端觸發 startSpin()', color: 'D4A017' },
    { icon: '💸', title: '先扣注碼', sub: 'POST /api/update_balance\n後端更新 SQLite 餘額欄位', color: 'E53E3E' },
    { icon: '🎲', title: '抽出3個結果', sub: 'GET /api/spin\n後端執行3次獨立隨機，各回傳1筆符號', color: '4A90D9' },
    { icon: '🎬', title: '播放動畫 + 計算獎金', sub: '前端跑轉盤動畫（約7秒）\n同時加總各符號的獎金', color: '805AD5' },
    { icon: '💰', title: '中獎就加錢', sub: 'POST /api/update_balance\n後端把獎金加回餘額', color: '38A169' },
  ];

  spinSteps.forEach((step, i) => {
    const x = 0.25 + i * 1.9;
    const y = 1.18;

    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 1.72, h: 2.0,
      fill: { color: C.bg_card }, line: { color: step.color },
      shadow: makeShadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 1.72, h: 0.06,
      fill: { color: step.color }, line: { color: step.color },
    });
    s.addText(step.icon, {
      x, y: y + 0.1, w: 1.72, h: 0.55,
      fontSize: 28, align: 'center', margin: 0,
    });
    s.addText(step.title, {
      x: x + 0.05, y: y + 0.66, w: 1.62, h: 0.42,
      fontSize: 11, bold: true, color: step.color, align: 'center', fontFace: 'Arial', margin: 0,
    });
    s.addText(step.sub, {
      x: x + 0.06, y: y + 1.08, w: 1.6, h: 0.85,
      fontSize: 9, color: C.light_gray, align: 'center', fontFace: 'Arial', margin: 0,
    });

    // 箭頭
    if (i < spinSteps.length - 1) {
      s.addText('▶', {
        x: x + 1.72, y: y + 0.75, w: 0.18, h: 0.42,
        fontSize: 12, color: C.gray, align: 'center', margin: 0,
      });
    }
  });

  // ── 下半段：登入 + 排行榜流程 ──
  s.addShape(pres.shapes.LINE, {
    x: 0.3, y: 3.32, w: 9.4, h: 0,
    line: { color: '2D3748', width: 1 },
  });

  // 登入流程
  s.addText('登入 / 註冊', {
    x: 0.4, y: 3.42, w: 3, h: 0.3,
    fontSize: 11, bold: true, color: C.teal, fontFace: 'Arial', margin: 0,
  });
  const loginFlow = ['玩家輸入帳密', 'POST /api/login', 'DB 查詢比對', '成功 → 跳轉遊戲'];
  loginFlow.forEach((t, i) => {
    const x = 0.25 + i * 2.32;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 3.76, w: 2.0, h: 0.52,
      fill: { color: '1C2533' }, line: { color: C.teal },
    });
    s.addText(t, {
      x, y: 3.76, w: 2.0, h: 0.52,
      fontSize: 11, color: C.white, align: 'center', fontFace: 'Arial', margin: 0,
    });
    if (i < loginFlow.length - 1) {
      s.addText('▶', { x: x + 2.0, y: 3.82, w: 0.32, h: 0.4, fontSize: 11, color: C.gray, align: 'center', margin: 0 });
    }
  });

  // 排行榜流程
  s.addText('排行榜', {
    x: 5.5, y: 3.42, w: 3, h: 0.3,
    fontSize: 11, bold: true, color: C.purple, fontFace: 'Arial', margin: 0,
  });
  const rankFlow = ['按下排行榜按鈕', 'GET /api/rank', 'DB 撈全部玩家', '前端排序顯示前5'];
  rankFlow.forEach((t, i) => {
    const x = 5.35 + i * (4.3 / 4);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 3.76, w: 0.95, h: 0.52,
      fill: { color: '1C2533' }, line: { color: C.purple },
    });
    s.addText(t, {
      x, y: 3.76, w: 0.95, h: 0.52,
      fontSize: 8, color: C.white, align: 'center', fontFace: 'Arial', margin: 0,
    });
    if (i < rankFlow.length - 1) {
      s.addText('▶', { x: x + 0.95, y: 3.82, w: 0.12, h: 0.4, fontSize: 10, color: C.gray, align: 'center', margin: 0 });
    }
  });

  // 技術標籤
  s.addText('前端 (JavaScript)', { x: 0.25, y: 4.38, w: 2, h: 0.3, fontSize: 9, color: C.gold_light, fontFace: 'Arial', margin: 0 });
  s.addText('後端 (Node.js / Express)', { x: 2.7, y: 4.38, w: 2.8, h: 0.3, fontSize: 9, color: C.gold_light, fontFace: 'Arial', margin: 0 });
  s.addText('資料庫 (SQLite)', { x: 6.2, y: 4.38, w: 2, h: 0.3, fontSize: 9, color: C.gold_light, fontFace: 'Arial', margin: 0 });
  // vertical markers
  [[0.2, 4.55, 2.4], [2.65, 4.55, 3.5], [6.15, 4.55, 2.2]].forEach(([x, y, w]) => {
    s.addShape(pres.shapes.RECTANGLE, { x, y, w, h: 0.04, fill: { color: C.gold }, line: { color: C.gold } });
  });
}

// =============================================================================
// SLIDE 3: DB 設計方法比較（白話文）
// =============================================================================
{
  const s = pres.addSlide();
  s.background = { color: C.bg_dark };

  s.addText('拉霸機資料庫：常見設計方式', {
    x: 0.3, y: 0.15, w: 9.4, h: 0.6,
    fontSize: 28, bold: true, color: C.gold, fontFace: 'Arial Black', margin: 0,
  });

  // Left: 傳統設計
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.2, y: 0.85, w: 4.5, h: 4.55,
    fill: { color: C.bg_card }, line: { color: C.blue },
    shadow: makeShadow(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.2, y: 0.85, w: 4.5, h: 0.52,
    fill: { color: C.blue }, line: { color: C.blue },
  });
  s.addText('🏦  一般常見做法', {
    x: 0.2, y: 0.85, w: 4.5, h: 0.52,
    fontSize: 14, bold: true, color: C.white, align: 'center', fontFace: 'Arial', margin: 0,
  });

  const tradItems = [
    { title: '用很多張表格分開存', desc: '圖案表、轉輪設定表、連線規則表\n各自獨立，彼此用 ID 關聯' },
    { title: '要「排成線」才算中獎', desc: '水平線、斜線、Z字型都算各自的連線\n沒排成線就拿不到獎' },
    { title: '每個圖案出現機率不同', desc: '可以設定珍稀圖案出現的機會特別低\n讓大獎變得更難中' },
    { title: '每一局的結果通常會存下來', desc: '方便開發時追查哪裡出錯\n以及檢視遊戲是否正常運作' },
  ];

  tradItems.forEach((item, i) => {
    const y = 1.5 + i * 0.82;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.35, y: y + 0.06, w: 0.06, h: 0.35,
      fill: { color: C.blue }, line: { color: C.blue },
    });
    s.addText(item.title, {
      x: 0.55, y, w: 4.0, h: 0.32,
      fontSize: 12, bold: true, color: C.white, fontFace: 'Arial', margin: 0,
    });
    s.addText(item.desc, {
      x: 0.55, y: y + 0.3, w: 4.0, h: 0.45,
      fontSize: 10, color: C.gray, fontFace: 'Arial', margin: 0,
    });
  });

  // Right: 我的做法
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 0.85, w: 4.5, h: 4.55,
    fill: { color: C.bg_card }, line: { color: C.gold },
    shadow: makeShadow(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 0.85, w: 4.5, h: 0.52,
    fill: { color: C.gold }, line: { color: C.gold },
  });
  s.addText('⭐  本專案做法', {
    x: 5.3, y: 0.85, w: 4.5, h: 0.52,
    fontSize: 14, bold: true, color: C.bg_dark, align: 'center', fontFace: 'Arial', margin: 0,
  });

  const myItems = [
    { title: '只用 2 張表格搞定', desc: '拉霸機選項（圖案資訊）+ 玩家資料\n不需要另外設計複雜的關聯' },
    { title: '不用連線，出現就給錢', desc: '3 個轉盤各自顯示一個圖案\n只要圖案出現，就依數量給獎（散件疊加）' },
    { title: 'SQL 直接搖出結果', desc: '每個圖案被抽到的機率都一樣\n用 ORDER BY RANDOM() 各抽3次，可以重複' },
    { title: '盈虧在前端即時算', desc: '玩家盈餘 = 目前餘額 − 10000\n不需要另外開表格記錄' },
  ];

  myItems.forEach((item, i) => {
    const y = 1.5 + i * 0.82;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.45, y: y + 0.06, w: 0.06, h: 0.35,
      fill: { color: C.gold }, line: { color: C.gold },
    });
    s.addText(item.title, {
      x: 5.65, y, w: 4.0, h: 0.32,
      fontSize: 12, bold: true, color: C.gold_light, fontFace: 'Arial', margin: 0,
    });
    s.addText(item.desc, {
      x: 5.65, y: y + 0.3, w: 4.0, h: 0.45,
      fontSize: 10, color: C.gray, fontFace: 'Arial', margin: 0,
    });
  });
}

// =============================================================================
// SLIDE 4: 資料庫結構（只留標題，空白給ER圖）
// =============================================================================
{
  const s = pres.addSlide();
  s.background = { color: C.bg_dark };

  s.addText('資料庫結構設計', {
    x: 0.3, y: 0.15, w: 9.4, h: 0.6,
    fontSize: 28, bold: true, color: C.gold, fontFace: 'Arial Black', margin: 0,
  });
}

// =============================================================================
// SLIDE 5: 期望值（重新計算，使用正確符號）
// =============================================================================
{
  const s = pres.addSlide();
  s.background = { color: C.bg_dark };

  s.addText('期望值分析 (Expected Value)', {
    x: 0.3, y: 0.12, w: 9.4, h: 0.55,
    fontSize: 28, bold: true, color: C.gold, fontFace: 'Arial Black', margin: 0,
  });
  s.addText('每次下注 100 元，平均可以拿回多少？（基於修改後的抽獎機制）', {
    x: 0.3, y: 0.68, w: 9.4, h: 0.32,
    fontSize: 12, color: C.light_gray, fontFace: 'Arial', margin: 0,
  });

  // 機制說明
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.2, y: 1.05, w: 3.7, h: 1.85,
    fill: { color: C.bg_card }, line: { color: C.blue },
    shadow: makeShadow(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.2, y: 1.05, w: 3.7, h: 0.42,
    fill: { color: C.blue }, line: { color: C.blue },
  });
  s.addText('⚙️  抽獎方式', {
    x: 0.2, y: 1.05, w: 3.7, h: 0.42,
    fontSize: 13, bold: true, color: C.white, align: 'center', fontFace: 'Arial', margin: 0,
  });
  s.addText([
    { text: '共 10 種符號，每種被抽到的機率一樣\n', options: { fontSize: 11, color: C.light_gray, breakLine: false } },
    { text: '→ 每種符號每次抽到的機率 = 1/10\n\n', options: { fontSize: 11, color: C.gold_light, breakLine: false } },
    { text: '3 個轉盤獨立各抽一次，所以同一個\n符號有可能出現 2 次或 3 次', options: { fontSize: 11, color: C.light_gray } },
  ], { x: 0.35, y: 1.52, w: 3.4, h: 1.3, margin: 0 });

  // 機率表
  s.addShape(pres.shapes.RECTANGLE, {
    x: 4.1, y: 1.05, w: 5.7, h: 1.85,
    fill: { color: C.bg_card }, line: { color: C.gold },
    shadow: makeShadow(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 4.1, y: 1.05, w: 5.7, h: 0.42,
    fill: { color: C.gold }, line: { color: C.gold },
  });
  s.addText('📊  同一符號出現 k 次的機率', {
    x: 4.1, y: 1.05, w: 5.7, h: 0.42,
    fontSize: 13, bold: true, color: C.bg_dark, align: 'center', fontFace: 'Arial', margin: 0,
  });

  const probHeader = ['出現次數 k', '計算方式', '機率', '對應獎項'];
  const probRows = [
    ['k = 1', 'C(3,1)×(0.1)¹×(0.9)²', '24.3%', 'win1'],
    ['k = 2', 'C(3,2)×(0.1)²×(0.9)¹', '2.7%',  'win2'],
    ['k = 3', '(0.1)³',                 '0.1%',  'jakapot'],
  ];

  s.addShape(pres.shapes.RECTANGLE, {
    x: 4.1, y: 1.47, w: 5.7, h: 0.34,
    fill: { color: '2D3748' }, line: { color: C.bg_dark },
  });
  const colW = [1.2, 2.2, 1.0, 1.3];
  const colX = [4.1, 5.3, 7.5, 8.5];
  probHeader.forEach((h, i) => {
    s.addText(h, {
      x: colX[i], y: 1.47, w: colW[i], h: 0.34,
      fontSize: 10, bold: true, color: C.gold_light, align: 'center', fontFace: 'Arial', margin: 0,
    });
  });
  probRows.forEach((row, ri) => {
    const ry = 1.81 + ri * 0.36;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 4.1, y: ry, w: 5.7, h: 0.36,
      fill: { color: ri % 2 === 0 ? '1C2533' : '1A1F2A' }, line: { color: C.bg_dark },
    });
    const rowColors = [C.white, '7EC8E3', C.gold_light, '68D391'];
    row.forEach((cell, ci) => {
      s.addText(cell, {
        x: colX[ci], y: ry, w: colW[ci], h: 0.36,
        fontSize: 10, color: rowColors[ci], align: 'center', fontFace: ci === 1 ? 'Consolas' : 'Arial', margin: 0,
      });
    });
  });

  // 各符號獎金表（使用正確的 emoji + 中文）
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.2, y: 2.98, w: 9.6, h: 2.60,
    fill: { color: C.bg_card }, line: { color: '5A3E9A' },
    shadow: makeShadow(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.2, y: 2.98, w: 9.6, h: 0.42,
    fill: { color: '5A3E9A' }, line: { color: '5A3E9A' },
  });
  s.addText('💰  各符號獎金與期望貢獻', {
    x: 0.2, y: 2.98, w: 9.6, h: 0.42,
    fontSize: 13, bold: true, color: C.white, align: 'center', fontFace: 'Arial', margin: 0,
  });

  // 表頭
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.2, y: 3.4, w: 9.6, h: 0.34,
    fill: { color: '2D3748' }, line: { color: C.bg_dark },
  });
  const symColW = [2.9, 1.1, 1.1, 1.2, 1.5, 1.8];
  const symColX = [0.2, 3.1, 4.2, 5.3, 6.5, 8.0];
  ['符號', 'win1', 'win2', 'jakapot', '數量', '每符號期望獎金'].forEach((h, i) => {
    s.addText(h, {
      x: symColX[i], y: 3.4, w: symColW[i], h: 0.34,
      fontSize: 10, bold: true, color: C.gold_light, align: 'center', fontFace: 'Arial', margin: 0,
    });
  });

  // 低階 row
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.2, y: 3.74, w: 9.6, h: 0.5,
    fill: { color: '1C2533' }, line: { color: C.bg_dark },
  });
  // 低階 label
  s.addShape(pres.shapes.RECTANGLE, { x: 0.2, y: 3.74, w: 0.06, h: 0.5, fill: { color: '4A90D9' }, line: { color: '4A90D9' } });
  s.addText('🍎蘋果  🍌香蕉  🏎️跑車  💰金幣', {
    x: 0.3, y: 3.74, w: 2.8, h: 0.5,
    fontSize: 11, color: C.white, align: 'left', fontFace: 'Arial', margin: 0,
  });
  ['10', '68', '1360', '各4種', '5.626 × 4 = 22.5'].forEach((v, i) => {
    s.addText(v, {
      x: symColX[i + 1], y: 3.74, w: symColW[i + 1], h: 0.5,
      fontSize: i === 4 ? 10 : 11, color: i === 4 ? C.gold_light : C.white, align: 'center', fontFace: 'Arial', margin: 0,
    });
  });

  // 中階 row
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.2, y: 4.24, w: 9.6, h: 0.5,
    fill: { color: '1A1F2A' }, line: { color: C.bg_dark },
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.2, y: 4.24, w: 0.06, h: 0.5, fill: { color: '319795' }, line: { color: '319795' } });
  s.addText('🦄獨角獸  🏰城堡  🚁直升機  🎈氣球', {
    x: 0.3, y: 4.24, w: 2.8, h: 0.5,
    fontSize: 11, color: C.white, align: 'left', fontFace: 'Arial', margin: 0,
  });
  ['20', '113', '2266', '各4種', '10.177 × 4 = 40.7'].forEach((v, i) => {
    s.addText(v, {
      x: symColX[i + 1], y: 4.24, w: symColW[i + 1], h: 0.5,
      fontSize: i === 4 ? 10 : 11, color: i === 4 ? C.gold_light : C.white, align: 'center', fontFace: 'Arial', margin: 0,
    });
  });

  // 高階 row
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.2, y: 4.74, w: 9.6, h: 0.5,
    fill: { color: '1C2533' }, line: { color: C.bg_dark },
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.2, y: 4.74, w: 0.06, h: 0.5, fill: { color: C.gold }, line: { color: C.gold } });
  s.addText('🎡嘉年華  ⭐星星', {
    x: 0.3, y: 4.74, w: 2.8, h: 0.5,
    fontSize: 11, color: C.white, align: 'left', fontFace: 'Arial', margin: 0,
  });
  ['30', '340', '17000', '各2種', '33.47 × 2 = 66.9'].forEach((v, i) => {
    s.addText(v, {
      x: symColX[i + 1], y: 4.74, w: symColW[i + 1], h: 0.5,
      fontSize: i === 4 ? 10 : 11, color: i === 4 ? C.gold_light : C.white, align: 'center', fontFace: 'Arial', margin: 0,
    });
  });

  // 總計 row
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.2, y: 5.24, w: 9.6, h: 0.34,
    fill: { color: '2D3748' }, line: { color: C.bg_dark },
  });
  s.addText('合計', {
    x: 0.2, y: 5.24, w: 2.9, h: 0.34,
    fontSize: 11, bold: true, color: C.white, align: 'center', fontFace: 'Arial', margin: 0,
  });
  s.addText('—', { x: symColX[1], y: 5.24, w: symColW[1], h: 0.34, fontSize: 11, color: C.gray, align: 'center', margin: 0 });
  s.addText('—', { x: symColX[2], y: 5.24, w: symColW[2], h: 0.34, fontSize: 11, color: C.gray, align: 'center', margin: 0 });
  s.addText('—', { x: symColX[3], y: 5.24, w: symColW[3], h: 0.34, fontSize: 11, color: C.gray, align: 'center', margin: 0 });
  s.addText('10 種', { x: symColX[4], y: 5.24, w: symColW[4], h: 0.34, fontSize: 11, color: C.gray, align: 'center', margin: 0 });
  s.addText('22.5 + 40.7 + 66.9 = 130.1 元  (RTP 130%)', {
    x: symColX[5] - 1.0, y: 5.24, w: symColW[5] + 1.0, h: 0.34,
    fontSize: 11, bold: true, color: C.gold_light, align: 'center', fontFace: 'Arial', margin: 0,
  });
}

// =============================================================================
// SLIDE 6: 核心功能（白話文）
// =============================================================================
{
  const s = pres.addSlide();
  s.background = { color: C.bg_dark };

  s.addText('主要功能', {
    x: 0.3, y: 0.12, w: 9.4, h: 0.55,
    fontSize: 28, bold: true, color: C.gold, fontFace: 'Arial Black', margin: 0,
  });

  const features = [
    { icon: '🔐', title: '帳號登入 / 註冊', desc: '打完帳號密碼送出去，後端去資料庫比對，對了就跳進遊戲，帳號重複的話會告訴你換一個', color: '4A90D9' },
    { icon: '🎰', title: '轉盤拉霸', desc: '按下拉桿，三個轉盤跑動畫，結果出來後自動算你贏多少錢', color: C.gold },
    { icon: '💵', title: '餘額即時同步', desc: '按下去的瞬間就先扣注碼，中獎了才把獎金加回來，全程跟資料庫同步', color: '38A169' },
    { icon: '🤖', title: '自動拉霸', desc: '按一下就開始自動一直轉，錢不夠了會自己停，不用一直點', color: '805AD5' },
    { icon: '🏆', title: '排行榜', desc: '點開就能看所有人的盈虧排名，前5名誰賺最多一目瞭然', color: 'E53E3E' },
    { icon: '📥', title: '自訂下注金額', desc: '可以按 ▲▼ 慢慢調，也可以直接打數字，最低100元', color: '319795' },
  ];

  features.forEach((f, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.22 + col * 3.22;
    const y = 0.82 + row * 2.3;

    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 3.05, h: 2.12,
      fill: { color: C.bg_card }, line: { color: f.color },
      shadow: makeShadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 3.05, h: 0.06,
      fill: { color: f.color }, line: { color: f.color },
    });
    s.addText(f.icon, {
      x, y: y + 0.12, w: 3.05, h: 0.65,
      fontSize: 34, align: 'center', margin: 0,
    });
    s.addText(f.title, {
      x: x + 0.1, y: y + 0.8, w: 2.85, h: 0.38,
      fontSize: 13, bold: true, color: f.color, align: 'center', fontFace: 'Arial', margin: 0,
    });
    s.addText(f.desc, {
      x: x + 0.1, y: y + 1.2, w: 2.85, h: 0.85,
      fontSize: 10.5, color: C.light_gray, align: 'center', fontFace: 'Arial', margin: 0,
    });
  });
}

// =============================================================================
// SLIDE 7: 展示
// =============================================================================
{
  const s = pres.addSlide();
  s.background = { color: C.bg_dark };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: '0D1117' }, line: { color: '0D1117' },
  });

  s.addText('🎰', {
    x: 0, y: 0.9, w: 10, h: 1.5,
    fontSize: 80, align: 'center', margin: 0,
  });

  s.addText('現場展示', {
    x: 0, y: 2.55, w: 10, h: 1.1,
    fontSize: 52, bold: true, color: C.gold, align: 'center', fontFace: 'Arial Black', margin: 0,
  });

  s.addText('LIVE DEMO', {
    x: 0, y: 3.65, w: 10, h: 0.55,
    fontSize: 20, color: C.gray, align: 'center', fontFace: 'Arial', margin: 0,
  });
}

// === Write file ===
const outPath = 'D:/周子謙/claude_code工作資料夾/資料庫期末報告0607_v2.pptx';
pres.writeFile({ fileName: outPath }).then(() => {
  console.log('DONE: ' + outPath);
}).catch(err => {
  console.error('ERROR:', err);
});
