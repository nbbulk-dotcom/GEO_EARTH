from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from app.api import prediction, data, location

app = FastAPI(
    title="BRETT Earthquake Prediction System",
    description="12-Dimensional GAL-CRM Framework for Earthquake Prediction v4.0",
    version="4.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prediction.router, prefix="/api", tags=["earthquake-prediction"])
app.include_router(data.router, prefix="/api", tags=["data-sources"])
app.include_router(location.router, prefix="/api", tags=["location"])

frontend_path = os.path.join(os.path.dirname(__file__), "..", "..", "brett-frontend", "dist")
if os.path.exists(frontend_path):
    app.mount("/static", StaticFiles(directory=frontend_path), name="static")
    
    @app.get("/")
    async def read_index():
        return FileResponse(os.path.join(frontend_path, "index.html"))

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "system": "BRETT Earthquake Prediction System",
        "version": "4.0.0",
        "framework": "12-Dimensional GAL-CRM",
        "isolation": "earthquake-only"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
