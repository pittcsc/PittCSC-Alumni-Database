import sqlite3

conn = sqlite3.connect('alumni.db')
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()

# for table in tables:
#     table_name = table[0]
#     print(f"Table: {table_name}")
#     cursor.execute(f"PRAGMA table_info({table_name});")
#     columns = cursor.fetchall()
#     for column in columns:
#         print(f" - {column[1]}: {column[2]}")


for table in tables:
    table_name = table[0]
    cursor.execute(f"DROP TABLE IF EXISTS {table_name};")
    print(f"Dropped table: {table_name}")
print("done")

conn.close()