import sqlite3

db_path = r"c:\Users\PRAVALLIKA\OneDrive\Desktop\digital-certificate-system\backend\db.sqlite3"

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get count before
cursor.execute("SELECT COUNT(*) FROM exams_examsubmission")
before = cursor.fetchone()[0]
print(f"Exam submissions before deletion: {before}")

# Delete all
cursor.execute("DELETE FROM exams_examsubmission")
conn.commit()

# Get count after
cursor.execute("SELECT COUNT(*) FROM exams_examsubmission")
after = cursor.fetchone()[0]
print(f"Exam submissions after deletion: {after}")
print(f"Deleted: {before - after}")
print("\n✓ Database cleaned successfully!")

conn.close()
