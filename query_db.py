import sqlite3
conn = sqlite3.connect("D:/周子謙/claude_code工作資料夾/front_back_connection/期末專案.db")
c = conn.cursor()
c.execute("SELECT name FROM sqlite_master WHERE type='table'")
print("Tables:", c.fetchall())
c.execute("SELECT * FROM 拉霸機選項")
print("Columns:", [d[0] for d in c.description])
rows = c.fetchall()
for r in rows:
    print(r)
conn.close()
