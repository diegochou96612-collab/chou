import sqlite3

conn = sqlite3.connect("D:/周子謙/claude_code工作資料夾/front_back_connection/期末專案.db")
c = conn.cursor()

# 低階（數量=5）：win1=12, win2=35, jakapot=600
c.execute("UPDATE 拉霸機選項 SET win1=12, win2=35, jakapot=600 WHERE 數量=5")

# 中階（數量=3）：win1=25, win2=60, jakapot=1000
c.execute("UPDATE 拉霸機選項 SET win1=25, win2=60, jakapot=1000 WHERE 數量=3")

# 高階（數量=1）：win1=35, win2=160, jakapot=8500
c.execute("UPDATE 拉霸機選項 SET win1=35, win2=160, jakapot=8500 WHERE 數量=1")

conn.commit()

# 確認結果
c.execute("SELECT 物件名稱, 數量, win1, win2, jakapot FROM 拉霸機選項")
for row in c.fetchall():
    print(row)

conn.close()
print("Done.")
