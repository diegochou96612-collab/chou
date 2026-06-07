function describe_show() {
    const rulesDiv = document.getElementById("describe_text");
    // 如果目前是隱藏狀態  就把它改成顯示  反之則隱藏
    if (rulesDiv.style.display === "none") {
        rulesDiv.style.display = "block";
    } else {
        rulesDiv.style.display = "none";
    }
}

function probability_show() {
    const ProbalibityDiv = document.getElementById("probability_text");
    // 如果目前是隱藏狀態  就把它改成顯示  反之則隱藏
    if (ProbalibityDiv.style.display === "none") {
        ProbalibityDiv.style.display = "block";
    } else {
        ProbalibityDiv.style.display = "none";
    }
}
// 建立對照表：Key 是資料庫的名稱，Value 是你想顯示的符號
const symbolMap = {
    '蘋果': '🍎',
    '香蕉': '🍌',
    '跑車': '🏎️',
    '金幣': '💰',
    '獨角獸': '🦄',
    '城堡': '🏰',
    '直升機': '🚁',
    '氣球': '🎈',
    '嘉年華': '🎡',
    '星星': '⭐'
};
// 2. 宣告圖案清單 (使用 let，因為要等資料庫傳資料過來才填入)
let symbolList = [];
let currentBet = 100; // 預設下注金額
let playerBalance = 0; // 用來儲存從資料庫抓來的餘額

const reelStrips = document.querySelectorAll('.reel-strip');
const symbolHeight = 120;
const minSpins = 6;
let isSpinning = false;
let isAutoRunning = false; // 用來控制自動拉霸的開關

// ==========================================
// 3. 網頁一打開，自動去後端抓資料 (對應 app.get('/api/items'))
// ==========================================
async function init() {
    try {
        // 1. 去跟後端拿「包含所有欄位」的大包裹
        const responseItems = await fetch('/api/items');
        const dbData = await responseItems.json();

        // 2. 處理輪盤圖案清單
        symbolList = [];
        dbData.forEach(item => {
            const emoji = symbolMap[item.物件名稱] || '❓';
            for (let i = 0; i < item.數量; i++) {
                symbolList.push(emoji);
            }
        });
        symbolList.sort(() => Math.random() - 0.5);
        renderReels();


        // 抓取餘額
        // 抓取餘額
        // 抓取當前登入玩家的 ID (這是你在 login.html 存進去的)
        const playerID = sessionStorage.getItem('playerID');
        if (!playerID) {
            document.getElementById("please_login_first").style.display = "block";
            setTimeout(function(){
                    document.getElementById("please_login_first").style.display = "none"
            },1000);
            window.location.href = '/login.html';
            return;
        }

        // 抓取該玩家的專屬餘額
        const balanceResponse = await fetch('/api/get_balance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerID: playerID })
        });
        const balanceData = await balanceResponse.json();
        playerBalance = balanceData.剩餘金額;
        document.getElementById('balance_text').innerText = playerBalance;
        document.getElementById('one_time_money_text').innerText = currentBet;

        // 3. 找出三個階級的「代表性圖案」資料，只要各找一次就好
        const low_item = dbData.find(item => item.物件名稱 === '蘋果');
        const mid_item = dbData.find(item => item.物件名稱 === '獨角獸');
        const high_item = dbData.find(item => item.物件名稱 === '嘉年華');

        // 4. 把金額填入【遊戲說明】選單
        document.getElementById('desc_win1_low').innerText = low_item.win1;
        document.getElementById('desc_win2_low').innerText = low_item.win2;
        document.getElementById('desc_jakapot_low').innerText = low_item.jakapot;

        document.getElementById('desc_win1_mid').innerText = mid_item.win1;
        document.getElementById('desc_win2_mid').innerText = mid_item.win2;
        document.getElementById('desc_jakapot_mid').innerText = mid_item.jakapot;

        document.getElementById('desc_win1_high').innerText = high_item.win1;
        document.getElementById('desc_win2_high').innerText = high_item.win2;
        document.getElementById('desc_jakapot_high').innerText = high_item.jakapot;

        // 5. 把金額填入【獎池內容說明】選單
        document.getElementById('prob_win1_low').innerText = low_item.win1;
        document.getElementById('prob_win2_low').innerText = low_item.win2;
        document.getElementById('prob_jakapot_low').innerText = low_item.jakapot;

        document.getElementById('prob_win1_mid').innerText = mid_item.win1;
        document.getElementById('prob_win2_mid').innerText = mid_item.win2;
        document.getElementById('prob_jakapot_mid').innerText = mid_item.jakapot;

        document.getElementById('prob_win1_high').innerText = high_item.win1;
        document.getElementById('prob_win2_high').innerText = high_item.win2;
        document.getElementById('prob_jakapot_high').innerText = high_item.jakapot;

        document.getElementById('one_time_ern_text').innerText = 0

    } catch (err) {
        console.error("初始化抓取資料庫失敗:", err);
    }
}

// 負責把圖案畫到網頁上的函式
function renderReels() {
    reelStrips.forEach(strip => {
        let html = '';
        const displaySymbols = [];
        // 重複放入圖案，確保動畫轉動時看起來夠長
        for (let i = 0; i < 10; i++) displaySymbols.push(...symbolList);

        displaySymbols.forEach(s => {
            html += `<div class="symbol">${s}</div>`;
        });
        strip.innerHTML = html;
    });
}

async function startSpin() {
    if (isSpinning) return;

    // 檢查餘額夠不夠下注
    if (playerBalance < currentBet) {
        document.getElementById("balance_not_enough").style.display = "block";
        setTimeout(function(){
            document.getElementById("balance_not_enough").style.display = "none"
        },1000);

        // 如果遇到餘額不足，而且目前是自動模式，就自動幫你取消
        if (isAutoRunning) {
            cancel_auto_run();
        }
        return;
    }

    isSpinning = true;
    const playerID = sessionStorage.getItem('playerID');

    // --- 新增：拉桿往下壓的動畫 ---
    const lever = document.querySelector('.lever-container');
    if (lever) {
        lever.classList.add('pull-down');

        // 設定 0.3 秒後拔掉 class 讓它彈回原位
        setTimeout(() => {
            lever.classList.remove('pull-down');
        }, 300);
    }

    try {
        // --- 1. 開轉前：先扣除下注金額 ---
        const deductResponse = await fetch('/api/update_balance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerID: playerID, amount: -currentBet }) // 傳送負數代表扣錢
        });
        const deductData = await deductResponse.json();
        playerBalance = deductData.newBalance;
        document.getElementById('balance_text').innerText = playerBalance;

        // --- 2. 向後端抽取拉霸結果 ---
        const response = await fetch('/api/spin');
        const rows = await response.json();

        // --- 3. 計算本次贏得的總獎金 (加入倍數機制) ---
        let baseWin = 0;
        const resultCounts = {};

        rows.forEach(row => {
            if (!resultCounts[row.物件名稱]) {
                resultCounts[row.物件名稱] = { count: 0, data: row };
            }
            resultCounts[row.物件名稱].count += 1;
        });

        for (let key in resultCounts) {
            const item = resultCounts[key];
            if (item.count === 1) baseWin += item.data.win1;
            else if (item.count === 2) baseWin += item.data.win2;
            else if (item.count === 3) baseWin += item.data.jakapot;
        }

        const multiplier = currentBet / 100;
        let totalWin = baseWin * multiplier;

        // --- 4. 執行轉盤動畫 ---
        reelStrips.forEach((strip, index) => {
            strip.style.transition = 'none';
            strip.style.transform = 'translateY(0)';
            strip.offsetHeight;

            const row = rows[index];
            const targetSymbol = symbolMap[row.物件名稱];

            const possibleIndices = symbolList
                .map((sym, idx) => sym === targetSymbol ? idx : -1)
                .filter(idx => idx !== -1);

            const targetIndex = possibleIndices[Math.floor(Math.random() * possibleIndices.length)];
            const targetY = (minSpins * symbolList.length + targetIndex) * symbolHeight;
            const duration = 4 + index * 1.2;

            strip.style.transition = `transform ${duration}s cubic-bezier(0.45, 0.05, 0.2, 1)`;
            strip.style.transform = `translateY(-${targetY}px)`;
        });

        // --- 5. 動畫結束後：派發獎金 ---
        // 【關鍵修改】：回傳一個 Promise，讓外部呼叫的地方可以等待這 7 秒
        return new Promise((resolve) => {
            setTimeout(async () => {
                isSpinning = false;

                if (totalWin > 0) {
                    document.getElementById('one_time_ern_text').innerText = totalWin
                    // 把贏的錢加回資料庫
                    const addResponse = await fetch('/api/update_balance', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ playerID: playerID, amount: totalWin })
                    });
                    const addData = await addResponse.json();
                    playerBalance = addData.newBalance;
                    document.getElementById('balance_text').innerText = playerBalance;
                } else {
                    console.log("這次沒中獎，再接再厲！");
                }

                // 動畫與加錢邏輯都處理完畢後，通知外部可以繼續了
                resolve();

            }, 7000);
        });

    } catch (error) {
        console.error("拉霸通訊失敗：", error);
        isSpinning = false;

        // 發生錯誤時，保險起見也把自動模式關掉
        if (isAutoRunning) {
            cancel_auto_run();
        }
    }
}

// 控制下注金額增減的函式
function changeBet(amount) {
    let newBet = currentBet + amount;

    // 檢查條件：下注金額必須大於等於100 而且不能超過資料庫裡的餘額
    if (newBet >= 100 && newBet <= playerBalance) {
        currentBet = newBet;
        document.getElementById('one_time_money_text').innerText = currentBet;
    } else if (newBet < 100) {
        document.getElementById("min_should_over_100").style.display = "block";
        setTimeout(function(){
                    document.getElementById("min_should_over_100").style.display = "none"
        },1000);
    } else if (newBet > playerBalance) {
        document.getElementById("balance_not_enough_one_time_money").style.display = "block"
        setTimeout(function(){
                    document.getElementById("balance_not_enough_one_time_money").style.display = "none"
        },1000);
    }
}

function one_time_money_input_text_function(){
    document.getElementById("one_time_money_input_typing").style.display = "block";
}

function cancel_one_time_money_input_text(){
    document.getElementById("one_time_money_input_typing").style.display = "none"
    document.getElementById("one_time_money_input_text").value = "";
}

function confirm_one_time_money_input_text(){
    // 1. 抓取玩家在輸入框裡打的內容，並使用 parseInt() 把它強制轉換成「整數數字」
    let inputValue = parseInt(document.getElementById("one_time_money_input_text").value);
    currentBet = inputValue;
    document.getElementById("one_time_money_text").innerText = inputValue;
    document.getElementById("one_time_money_input_typing").style.display = "none"
}

async function auto_run(){
    // 1. 切換按鈕的顯示狀態，隱藏自動按鈕，顯示打勾版本
    document.getElementById("auto_run_img").style.display = "none";
    document.getElementById("cancel_auto_run").style.display = "inline-block";

    // 2. 將全域變數設為 true，開啟自動運轉的開關
    isAutoRunning = true;

    // 3. 只要開關是開著的，就不斷執行這個迴圈
    while (isAutoRunning) {
        // 如果目前沒有在轉動，就觸發轉動
        if (!isSpinning) {
            // await 會在這裡等待，直到 startSpin 裡面的 7 秒動畫跑完並 resolve 為止
            await startSpin();
        }

        // 動畫跑完之後，再次檢查玩家有沒有在這 7 秒內按下取消按鈕
        // 如果已經被取消了，就立刻跳出迴圈
        if (!isAutoRunning) {
            break;
        }

        // 4. 等待 1 秒鐘 (1000毫秒)，然後才繼續下一次的迴圈，這樣才不會連續轉得太急
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

function cancel_auto_run(){
    // 1. 關閉自動運轉的開關，這樣 auto_run 裡面的迴圈下一次檢查時就會停止
    isAutoRunning = false;

    // 2. 把打勾按鈕隱藏起來，並把原本的自動按鈕顯示回來
    document.getElementById("cancel_auto_run").style.display = "none";
    document.getElementById("auto_run_img").style.display = "inline-block";
}

// 宣告一個全域變數，用來記錄排行榜目前的顯示狀態
let isRankListVisible = false;

async function show_rank_list() {
    // 抓取你在 HTML 中寫好的排行榜表格
    const rankTable = document.getElementById("ranking_list");

    // 1. 切換顯示與隱藏的邏輯
    // 如果目前排行榜是開啟的，再次點擊就會將其隱藏，並結束函式
    if (isRankListVisible) {
        rankTable.style.display = "none";
        isRankListVisible = false;
        return;
    }

    try {
        // 2. 向後端要全體玩家的資料
        // 注意：/api/rank 在 app.js 中是設定為 GET，不需要傳送 body 參數
        const response = await fetch('/api/rank');
        const allPlayers = await response.json();

        // 3. 在前端計算每位玩家的盈餘
        // 利用 forEach 迴圈，為每個玩家新增一個「盈餘」屬性，數值為剩餘金額減去 10000
        allPlayers.forEach(player => {
            player.盈餘 = player.剩餘金額 - 10000;
        });

        // 4. 將玩家依照盈餘由大到小排序
        // 這裡的 sort 寫法是用 b 的盈餘減去 a 的盈餘，這樣數值越大的就會被排在陣列的越前面
        allPlayers.sort((a, b) => b.盈餘 - a.盈餘);

        // 5. 準備好你 HTML 表格中五個名次的 ID 前綴
        const rankPrefixes = ["first", "second", "third", "fourth", "fifth"];

        // 6. 透過迴圈，把前五名的資料精準地塞進表格的對應欄位裡
        for (let i = 0; i < 5; i++) {
            const prefix = rankPrefixes[i];

            // 檢查是否真的有這麼多玩家 (避免玩家總數不到5人時發生陣列越界錯誤)
            if (i < allPlayers.length) {
                const player = allPlayers[i];
                document.getElementById(`${prefix}_person_name`).innerText = player.玩家名稱;
                document.getElementById(`${prefix}_person_ern`).innerText = player.盈餘;
                document.getElementById(`${prefix}_person_balance`).innerText = player.剩餘金額;
            } else {
                // 如果人數不足，剩下的欄位就顯示 N/A
                document.getElementById(`${prefix}_person_name`).innerText = "N/A";
                document.getElementById(`${prefix}_person_ern`).innerText = "N/A";
                document.getElementById(`${prefix}_person_balance`).innerText = "N/A";
            }
        }

        // 7. 將表格顯示出來，並將狀態改為已開啟
        // HTML 的 table 標籤，顯示屬性建議使用 "table" 會比 "block" 來得更標準，排版才不會跑掉
        rankTable.style.display = "table";
        isRankListVisible = true;

    } catch (error) {
        // 如果連線或解析過程中發生問題，在開發者介面印出錯誤訊息方便除錯
        console.error("抓取排行榜資料失敗：", error);
    }
}

// 啟點初始化流程
init();
