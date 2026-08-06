from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PORT: int = 8000
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: int
    DB_NAME: str
    DATABASE_URL: str

    # Variables de JWT
    SECRET_KEY: str = "clave_secreta_super_segura_para_desarrollo_taskify_2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"  # Ignora campos extras en el .env sin lanzar error
    )

settings = Settings()

