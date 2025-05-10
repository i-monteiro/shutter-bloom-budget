# app/core/config.py

from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl
from typing import List

class Settings(BaseSettings):
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "Shutter Bloom"
    ALLOWED_HOSTS: List[AnyHttpUrl] = []

    # Configurações do Google Sheets e WhatsApp (n8n)
    N8N_GS_WEBHOOK: str = "https://n8n.automacaomachine.com.br/webhook-test/lead-in"
    N8N_WA_WEBHOOK: str = "https://n8n.automacaomachine.com.br/webhook/send-whatsapp"
    REGISTER_LINK: str = "https://fotessence.automacaomachine.com.br/register"

    # Configurações do banco de dados
    DB_USER: str = "postgres"
    DB_PASS: str = "zgqg8usxuqdttjb5"
    DB_HOST: str = "aws-0-us-east-1.pooler.supabase.com"
    DB_PORT: str = "5432"
    DB_NAME: str = "postgres"

    class Config:
        env_file = ".env"

def get_settings():
    return Settings()
