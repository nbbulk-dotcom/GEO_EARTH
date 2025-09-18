"""FastAPI main application for BRETT VOLCANIC HISTORICAL v1.0"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from app.core.config import settings
from app.routes import historical, volcanic, validation

logger.add("logs/volcanic_historical.log", rotation="1 day", retention="30 days")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="BRETT VOLCANIC HISTORICAL v1.0 - Advanced ML-Driven Historical Eruption Analysis",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(historical.router, prefix=f"{settings.API_V1_STR}/historical", tags=["historical"])
app.include_router(volcanic.router, prefix=f"{settings.API_V1_STR}/volcanic", tags=["volcanic"])
app.include_router(validation.router, prefix=f"{settings.API_V1_STR}/validation", tags=["validation"])


@app.get("/")
async def root():
    """Root endpoint with system information"""
    return {
        "system": "BRETT VOLCANIC HISTORICAL",
        "version": settings.VERSION,
        "description": "Advanced ML-Driven Historical Eruption Analysis with Ideal UI",
        "framework": "RGB electromagnetic + CMYK geological correlation",
        "space_variables": 12,
        "earth_resonance_datasets": 24,
        "volcanic_specific_variables": 6,
        "total_variables": 30,
        "methodology": "Stationary Earth / Moving Sun with ML validation",
        "prediction_window_days": 21,
        "api_endpoints": {
            "historical": f"{settings.API_V1_STR}/historical",
            "volcanic": f"{settings.API_V1_STR}/volcanic",
            "validation": f"{settings.API_V1_STR}/validation",
        },
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": settings.VERSION,
        "timestamp": "2025-09-18T08:53:29Z",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
