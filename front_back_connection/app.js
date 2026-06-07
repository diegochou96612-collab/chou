// 載入操作資料庫的工具
const sqlite3 = require("sqlite3").verbose();

// 連接到資料庫(會在powershell輸出資訊)
const db = new sqlite3.Database("期末專案.db", (err) =>{
  if (err){
    return console.error("連線失敗"+err.message);
  }
  console.log("成功連接資料庫");
});

// 展示前端
const express = require('express');
const app = express();
const path = require('path');
app.use(express.json()); // 允許解析前端傳來的 JSON 資料

// 意義：告訴 Express，所有的網頁檔案（html, css, js, 圖片）都放在這個目錄
app.use(express.static(__dirname, { index: false }));

// 意義：當使用者瀏覽首頁 (/) 時，自動送出你的 login.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// 把頁面所有功能傳給前端
app.get('/api/items', (req, res) => {
    // 這裡必須把「數量」也一起抓出來傳給前端
    const sql = "SELECT * FROM 拉霸機選項";
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows); 
    });
});

// --- 玩家註冊 API ---
app.post('/api/register', (req, res) => {
    // 接收前端傳來的資料
    const { name, account, password } = req.body;
    
    // 因為你的「玩家ID」是 CHAR 格式，如果不給值會報錯，所以我們用當下的時間戳記自動產生一個專屬 ID
    const playerID = 'P' + Date.now(); 

    // 1. 先去資料庫檢查這個「帳號」是不是已經被註冊過了
    const checkSql = "SELECT * FROM 玩家資料表 WHERE 帳號 = ?";
    db.get(checkSql, [account], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (row) {
            // 如果找到資料，代表帳號重複了
            return res.status(400).json({ error: "這個帳號已經有人使用囉！換一個試試看。" });
        }

        // 2. 帳號沒重複，把新玩家寫進資料庫
        // 【關鍵修改】：因為盈餘已經是資料庫自動生成的欄位，所以這裡絕對不能再寫入盈餘，否則會報錯！
        const insertSql = "INSERT INTO 玩家資料表 (玩家ID, 玩家名稱, 帳號, 密碼, 剩餘金額) VALUES (?, ?, ?, ?, 10000)";
        db.run(insertSql, [playerID, name, account, password], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, message: "註冊成功！準備進入遊樂場！" });
        });
    });
});

// --- 玩家登入 API ---
app.post('/api/login', (req, res) => {
    // 接收前端傳來的資料
    const { account, password } = req.body;

    // 去資料庫核對帳號和密碼是否完全符合
    const sql = "SELECT * FROM 玩家資料表 WHERE 帳號 = ? AND 密碼 = ?";
    db.get(sql,[account,password], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (row) {
            // 核對成功，回傳成功訊息 (這裡可以順便回傳玩家ID，之後跳轉頁面會用到)
            res.json({ success: true, message: "登入成功！", player: row });
        } else {
            // 找不到資料，代表帳號或密碼打錯了
            res.status(401).json({ error: "帳號或密碼錯誤，請再試一次！" });
        }
    });
});

// 1. 抓取「特定玩家」的餘額
app.post('/api/get_balance', (req, res) => {
    const { playerID } = req.body;
    const sql = "SELECT 剩餘金額 FROM 玩家資料表 WHERE 玩家ID = ?";
    
    db.get(sql, [playerID], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row); 
    });
});

// 2. 更新「特定玩家」的餘額 (扣注碼或贏錢都用這個)
app.post('/api/update_balance', (req, res) => {
    const { playerID, amount } = req.body; // amount 可以是正數(贏錢)或負數(扣錢)
    
    const sql = "UPDATE 玩家資料表 SET 剩餘金額 = 剩餘金額 + ? WHERE 玩家ID = ?";
    db.run(sql, [amount, playerID], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        
        // 更新完之後，順便把最新的餘額抓出來回傳給前端顯示
        db.get("SELECT 剩餘金額 FROM 玩家資料表 WHERE 玩家ID = ?", [playerID], (err, row) => {
            res.json({ success: true, newBalance: row.剩餘金額 });
        });
    });
});

// API  前端向後端要資料
app.get('/api/spin', (req, res) => {
    // 各自獨立抽3次，每次隨機取1筆，允許同符號重複出現，win2/jakapot才有機會觸發
    const sql = "SELECT * FROM 拉霸機選項 ORDER BY RANDOM() LIMIT 1";
    const results = [];

    function drawOne(remaining) {
        if (remaining === 0) return res.json(results);
        db.get(sql, [], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            results.push(row);
            drawOne(remaining - 1);
        });
    }

    drawOne(3);
});

// --- 抓取排行榜 API (修改為抓取全資料版本) ---
app.get('/api/rank', (req, res) => {
    // 這裡改為最單純的寫法，直接把玩家資料表裡面的所有資料都撈出來，
    // 不做任何排序，也不限制數量，原封不動地送給前端去處理。
    const sql = "SELECT * FROM 玩家資料表";
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("排行榜全資料抓取失敗:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows); 
    });
});

// 啟動伺服器：告訴 Node.js 在 3000 這個通訊埠等客人
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`伺服器已啟動: http://localhost:${PORT}`);
});