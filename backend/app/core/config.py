"""Configuration settings for BRETT VOLCANIC HISTORICAL v1.0"""

from typing import List

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "BRETT VOLCANIC HISTORICAL"
    VERSION: str = "1.0.0"

    DATABASE_URL: str = "postgresql://postgres:securepassword123@localhost:5432/volcanic_historical"
    REDIS_URL: str = "redis://localhost:6379"

    USGS_API_KEY: str = ""
    NOAA_API_KEY: str = ""
    GVP_API_KEY: str = ""

    USGS_VOLCANO_URL: str = "https://volcanoes.usgs.gov/vsc/api/volcano/"
    GVP_DATABASE_URL: str = "https://volcano.si.edu/database/search_eruption_results.cfm"
    NOAA_THERMAL_URL: str = "https://www.ngdc.noaa.gov/hazard/volcano.shtml"
    NOAA_BASE_URL: str = "https://services.swpc.noaa.gov/json"

    BASE_OFFSET: int = 46664
    RESET_WINDOW_WIDTH: float = 0.1
    PLANETARY_ANGLE: float = 26.565  # Space influence angle
    FIRMAMENT_HEIGHT: float = 85.0  # km (optimized from historical data)
    EARTH_SURFACE_ANGLE: float = 57.0  # Earth-surface angle with depth adjustments

    CYCLE_PERIODS: List[int] = [20, 50, 160, 250, 500, 2000, 5500]
    CORRELATION_THRESHOLD: float = 0.60
    IMPROVEMENT_FACTOR: float = 0.18

    BATCH_SIZE: int = 32
    LEARNING_RATE: float = 0.001
    EPOCHS: int = 100
    TRAIN_TEST_SPLIT: float = 0.8

    RATE_LIMIT_PER_MINUTE: int = 10
    CACHE_TTL: int = 3600  # 1 hour
    MAX_WORKERS: int = 4

    SECRET_KEY: str = "brett-volcanic-historical-secret-key-v1.0"
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173"

    LOG_LEVEL: str = "INFO"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
