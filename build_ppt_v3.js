const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.title = '拉霸機資料庫期末報告';

// Light theme palette
const C = {
  bg:       'FFFFFF',
  bg2:      'F1F5F9',  // light slate
  text:     '1E293B',  // dark slate
  muted:    '64748B',  // slate-500
  teal:     '0F766E',  // teal-700
  teal_l:   'CCFBF1',  // teal-100
  indigo:   '4F46E5',
  indigo_l: 'EEF2FF',
  gold:     'B45309',  // amber-700
  gold_l:   'FEF3C7',  // amber-100
  red:      'DC2626',
  red_l:    'FEE2E2',
  green:    '15803D',
  green_l:  'DCFCE7',
  blue:     '1D4ED8',
  blue_l:   'DBEAFE',
  purple:   '7C3AED',
  purple_l: 'EDE9FE',
  border:   'E2E8F0',
};

const makeSh = () => ({ type: "outer", blur: 6, offset: 2, angle: 135, color: "94A3B8", opacity: 0.3 });

// =============================================================================
// SLIDE 1: TITLE
// =============================================================================
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  // Top accent bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.12,
    fill: { color: C.teal }, line: { color: C.teal },
  });

  // Slot emoji
  s.addText('🎰', {
    x: 0, y: 0.5, w: 10, h: 1.4,
    fontSize: 72, align: 'center', margin: 0,
  });

  // Title
  s.addText('拉霸機 Web 專案', {
    x: 1, y: 2.0, w: 8, h: 0.9,
    fontSize: 40, bold: true, color: C.text, align: 'center', fontFace: 'Arial Black', margin: 0,
  });

  // Subtitle
  s.addText('資料庫管理系統 期末報告', {
    x: 1, y: 2.95, w: 8, h: 0.5,
    fontSize: 18, color: C.muted, align: 'center', fontFace: 'Arial', margin: 0,
  });

  // Tech chips
  ['Node.js', 'Express', 'SQLite'].forEach((t, i) => {
    const x = 2.8 + i * 1.55;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y: 3.62, w: 1.35, h: 0.38,
      fill: { color: C.teal_l }, line: { color: C.teal }, rectRadius: 0.08,
    });
    s.addText(t, {
      x, y: 3.62, w: 1.35, h: 0.38,
      fontSize: 11, bold: true, color: C.teal, align: 'center', fontFace: 'Arial', margin: 0,
    });
  });

  // Personal info
  s.addText('資科一A　14173115　周子謙', {
    x: 1, y: 4.6, w: 8, h: 0.5,
    fontSize: 14, color: C.muted, align: 'center', fontFace: 'Arial', margin: 0,
  });

  // Bottom bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.5, w: 10, h: 0.125,
    fill: { color: C.border }, line: { color: C.border },
  });
}

// =============================================================================
// SLIDE 2: 系統流程
// =============================================================================
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.12, fill: { color: C.teal }, line: { color: C.teal } });

  s.addText('按下拉桿後發生了什麼', {
    x: 0.5, y: 0.28, w: 9, h: 0.6,
    fontSize: 26, bold: true, color: C.text, fontFace: 'Arial Black', margin: 0,
  });

  const steps = [
    { icon: '👆', label: '按下拉桿',    sub: '前端觸發',           color: C.gold,   bg: C.gold_l },
    { icon: '💸', label: '先扣注碼',    sub: 'POST /api/update_balance', color: C.red,    bg: C.red_l  },
    { icon: '🎲', label: '抽出3個符號', sub: 'GET /api/spin\n各自獨立抽，可重複', color: C.indigo, bg: C.indigo_l },
    { icon: '🎬', label: '動畫 + 計算', sub: '前端跑轉盤\n算出本次獎金',  color: C.purple, bg: C.purple_l },
    { icon: '💰', label: '中獎加錢',    sub: 'POST /api/update_balance', color: C.green,  bg: C.green_l },
  ];

  steps.forEach((st, i) => {
    const x = 0.3 + i * 1.88;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.05, w: 1.68, h: 2.5,
      fill: { color: st.bg }, line: { color: st.color },
      shadow: makeSh(),
    });
    s.addText(st.icon, { x, y: 1.15, w: 1.68, h: 0.8, fontSize: 36, align: 'center', margin: 0 });
    s.addText(st.label, {
      x, y: 2.0, w: 1.68, h: 0.45,
      fontSize: 12, bold: true, color: st.color, align: 'center', fontFace: 'Arial', margin: 0,
    });
    s.addText(st.sub, {
      x: x + 0.05, y: 2.45, w: 1.58, h: 0.9,
      fontSize: 9, color: C.muted, align: 'center', fontFace: 'Arial', margin: 0,
    });
    if (i < steps.length - 1) {
      s.addText('›', {
        x: x + 1.68, y: 1.8, w: 0.2, h: 0.8,
        fontSize: 24, bold: true, color: C.muted, align: 'center', margin: 0,
      });
    }
  });

  // 登入流程
  s.addShape(pres.shapes.LINE, { x: 0.4, y: 3.75, w: 9.2, h: 0, line: { color: C.border, width: 1 } });
  s.addText('其他功能', { x: 0.5, y: 3.85, w: 2, h: 0.3, fontSize: 12, bold: true, color: C.muted, fontFace: 'Arial', margin: 0 });

  const others = [
    { label: '登入 / 註冊', flow: '帳密 → POST /api/login → DB比對 → 跳轉', color: C.teal },
    { label: '排行榜', flow: '按鈕 → GET /api/rank → DB撈全部玩家 → 前端排序', color: C.indigo },
  ];
  others.forEach((o, i) => {
    const y = 4.22 + i * 0.6;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 0.06, h: 0.38,
      fill: { color: o.color }, line: { color: o.color },
    });
    s.addText(o.label + '　', { x: 0.7, y, w: 1.3, h: 0.38, fontSize: 11, bold: true, color: o.color, fontFace: 'Arial', margin: 0 });
    s.addText(o.flow, { x: 2.1, y, w: 7.5, h: 0.38, fontSize: 11, color: C.muted, fontFace: 'Arial', margin: 0 });
  });
}

// =============================================================================
// SLIDE 3: DB 設計比較
// =============================================================================
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.12, fill: { color: C.teal }, line: { color: C.teal } });

  s.addText('資料庫設計方式比較', {
    x: 0.5, y: 0.28, w: 9, h: 0.6,
    fontSize: 26, bold: true, color: C.text, fontFace: 'Arial Black', margin: 0,
  });

  // Left card
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 1.0, w: 4.3, h: 4.3,
    fill: { color: C.bg2 }, line: { color: C.border }, shadow: makeSh(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 1.0, w: 4.3, h: 0.5,
    fill: { color: C.blue }, line: { color: C.blue },
  });
  s.addText('🏦  一般常見做法', {
    x: 0.3, y: 1.0, w: 4.3, h: 0.5,
    fontSize: 14, bold: true, color: 'FFFFFF', align: 'center', fontFace: 'Arial', margin: 0,
  });

  const tradPts = [
    '用多張表格分開存\n（圖案表、轉輪表、連線規則表）',
    '要「排成線」才算中獎',
    '可以設定珍稀圖案機率更低',
    '每一局結果通常都會存起來',
  ];
  tradPts.forEach((t, i) => {
    s.addText('—', { x: 0.5, y: 1.65 + i * 0.82, w: 0.25, h: 0.7, fontSize: 14, bold: true, color: C.blue, align: 'center', margin: 0 });
    s.addText(t, { x: 0.8, y: 1.65 + i * 0.82, w: 3.6, h: 0.7, fontSize: 11, color: C.text, fontFace: 'Arial', margin: 0 });
  });

  // Right card
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.4, y: 1.0, w: 4.3, h: 4.3,
    fill: { color: C.bg2 }, line: { color: C.teal }, shadow: makeSh(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.4, y: 1.0, w: 4.3, h: 0.5,
    fill: { color: C.teal }, line: { color: C.teal },
  });
  s.addText('⭐  本專案做法', {
    x: 5.4, y: 1.0, w: 4.3, h: 0.5,
    fontSize: 14, bold: true, color: 'FFFFFF', align: 'center', fontFace: 'Arial', margin: 0,
  });

  const myPts = [
    '只用 2 張表格\n（拉霸機選項 + 玩家資料）',
    '出現就給錢，不需要連線\n（散件疊加機制）',
    '用 SQL RANDOM() 直接抽\n每種符號機率相等',
    '玩家盈虧在前端即時計算',
  ];
  myPts.forEach((t, i) => {
    s.addText('—', { x: 5.6, y: 1.65 + i * 0.82, w: 0.25, h: 0.7, fontSize: 14, bold: true, color: C.teal, align: 'center', margin: 0 });
    s.addText(t, { x: 5.9, y: 1.65 + i * 0.82, w: 3.6, h: 0.7, fontSize: 11, color: C.text, fontFace: 'Arial', margin: 0 });
  });
}

// =============================================================================
// SLIDE 4: 資料庫結構（只留標題）
// =============================================================================
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.12, fill: { color: C.teal }, line: { color: C.teal } });

  s.addText('資料庫結構設計', {
    x: 0.5, y: 0.28, w: 9, h: 0.6,
    fontSize: 26, bold: true, color: C.text, fontFace: 'Arial Black', margin: 0,
  });
}

// =============================================================================
// SLIDE 5: 期望值
// =============================================================================
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.12, fill: { color: C.teal }, line: { color: C.teal } });

  s.addText('期望值分析', {
    x: 0.5, y: 0.28, w: 9, h: 0.6,
    fontSize: 26, bold: true, color: C.text, fontFace: 'Arial Black', margin: 0,
  });

  // Big stat callouts
  const stats = [
    { val: '95.3%', label: 'RTP（玩家回收率）', color: C.teal,  bg: C.teal_l },
    { val: '4.7%',  label: '莊家優勢',          color: C.red,   bg: C.red_l  },
    { val: '95.3 元', label: '每 100 元平均回收', color: C.gold,  bg: C.gold_l },
  ];
  stats.forEach((st, i) => {
    const x = 0.5 + i * 3.1;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.05, w: 2.8, h: 1.4,
      fill: { color: st.bg }, line: { color: st.color }, shadow: makeSh(),
    });
    s.addText(st.val, {
      x, y: 1.12, w: 2.8, h: 0.75,
      fontSize: 34, bold: true, color: st.color, align: 'center', fontFace: 'Arial Black', margin: 0,
    });
    s.addText(st.label, {
      x, y: 1.87, w: 2.8, h: 0.4,
      fontSize: 11, color: st.color, align: 'center', fontFace: 'Arial', margin: 0,
    });
  });

  // Symbol table
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 2.65, w: 9.4, h: 0.38,
    fill: { color: C.bg2 }, line: { color: C.border },
  });
  const hdr = ['符號', 'win1', 'win2', 'jakapot', '期望貢獻'];
  const cw =  [3.2,    1.3,   1.3,   1.4,       2.2];
  const cx =  [0.3,    3.5,   4.8,   6.1,       7.5];
  hdr.forEach((h, i) => {
    s.addText(h, { x: cx[i], y: 2.65, w: cw[i], h: 0.38, fontSize: 11, bold: true, color: C.text, align: 'center', fontFace: 'Arial', margin: 0 });
  });

  const rows = [
    { sym: '🍎蘋果  🍌香蕉  🏎️跑車  💰金幣', w1: '12', w2: '35', jp: '600',  ev: '4.46 × 4 = 17.8', color: C.blue },
    { sym: '🦄獨角獸  🏰城堡  🚁直升機  🎈氣球', w1: '25', w2: '60', jp: '1000', ev: '8.70 × 4 = 34.8', color: C.teal },
    { sym: '🎡嘉年華  ⭐星星',                w1: '35', w2: '160',jp: '8500', ev: '21.3 × 2 = 42.7', color: C.gold },
    { sym: '合計',                          w1: '—',  w2: '—',  jp: '—',   ev: '17.8+34.8+42.7 = 95.3', color: C.muted, bold: true },
  ];

  rows.forEach((r, i) => {
    const ry = 3.03 + i * 0.55;
    const bg = i % 2 === 0 ? C.bg : C.bg2;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: ry, w: 9.4, h: 0.55, fill: { color: bg }, line: { color: C.border } });
    if (i < 3) {
      s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: ry, w: 0.06, h: 0.55, fill: { color: r.color }, line: { color: r.color } });
    }
    s.addText(r.sym, { x: 0.42, y: ry, w: cw[0] - 0.12, h: 0.55, fontSize: 11, color: C.text, align: 'left', fontFace: 'Arial', margin: 0 });
    [[r.w1,cx[1],cw[1]],[r.w2,cx[2],cw[2]],[r.jp,cx[3],cw[3]],[r.ev,cx[4],cw[4]]].forEach(([v,x,w]) => {
      s.addText(v, { x, y: ry, w, h: 0.55, fontSize: i === 3 ? 10 : 11, bold: i === 3, color: i === 3 ? C.teal : C.text, align: 'center', fontFace: 'Arial', margin: 0 });
    });
  });

  // Note
  s.addText('各符號每次被抽到的機率均為 1/10，3 個轉盤各自獨立抽取（可重複）', {
    x: 0.3, y: 5.28, w: 9.4, h: 0.3,
    fontSize: 10, color: C.muted, align: 'center', fontFace: 'Arial', italic: true, margin: 0,
  });
}

// =============================================================================
// SLIDE 6: 功能
// =============================================================================
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.12, fill: { color: C.teal }, line: { color: C.teal } });

  s.addText('主要功能', {
    x: 0.5, y: 0.28, w: 9, h: 0.6,
    fontSize: 26, bold: true, color: C.text, fontFace: 'Arial Black', margin: 0,
  });

  const features = [
    { icon: '🔐', title: '帳號登入 / 註冊', desc: '帳號重複防呆，登入後跳轉遊戲', color: C.blue,   bg: C.blue_l   },
    { icon: '🎰', title: '轉盤拉霸動畫',    desc: '三輪依序停止，自動計算獎金',   color: C.gold,   bg: C.gold_l   },
    { icon: '💵', title: '餘額即時同步',    desc: '扣注碼、加獎金全程連動資料庫', color: C.green,  bg: C.green_l  },
    { icon: '🤖', title: '自動拉霸模式',    desc: '一鍵連轉，錢不夠自動停',      color: C.purple, bg: C.purple_l },
    { icon: '🏆', title: '玩家排行榜',      desc: '依盈虧排序，顯示前5名',       color: C.red,    bg: C.red_l    },
    { icon: '📥', title: '自訂下注金額',    desc: '按鈕微調或直接輸入，最低100', color: C.teal,   bg: C.teal_l   },
  ];

  features.forEach((f, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.3 + col * 3.18;
    const y = 1.1 + row * 2.15;

    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 2.95, h: 1.95,
      fill: { color: f.bg }, line: { color: f.color }, shadow: makeSh(),
    });
    s.addText(f.icon, { x, y: y + 0.15, w: 2.95, h: 0.75, fontSize: 34, align: 'center', margin: 0 });
    s.addText(f.title, { x: x+0.1, y: y+0.92, w: 2.75, h: 0.4, fontSize: 13, bold: true, color: f.color, align: 'center', fontFace: 'Arial', margin: 0 });
    s.addText(f.desc,  { x: x+0.1, y: y+1.32, w: 2.75, h: 0.52, fontSize: 10, color: C.muted, align: 'center', fontFace: 'Arial', margin: 0 });
  });
}

// =============================================================================
// SLIDE 7: 現場展示
// =============================================================================
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.12, fill: { color: C.teal }, line: { color: C.teal } });

  s.addText('🎰', {
    x: 0, y: 0.9, w: 10, h: 1.6,
    fontSize: 90, align: 'center', margin: 0,
  });

  s.addText('現場展示', {
    x: 0, y: 2.7, w: 10, h: 1.1,
    fontSize: 52, bold: true, color: C.text, align: 'center', fontFace: 'Arial Black', margin: 0,
  });
}

// === Write ===
const outPath = 'D:/周子謙/claude_code工作資料夾/資料庫期末報告0607_v3.pptx';
pres.writeFile({ fileName: outPath }).then(() => {
  console.log('DONE: ' + outPath);
}).catch(err => {
  console.error('ERROR:', err);
});
