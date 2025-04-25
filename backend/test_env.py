import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

try:
    conn = psycopg2.connect(os.getenv("DATABASE_URL"))
    print("✅ Conexão estabelecida com sucesso!")
    conn.close()
except Exception as e:
    print("❌ Erro ao conectar:")
    print(e)
