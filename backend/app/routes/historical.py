"""Historical volcanic analysis API routes"""

from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query
from loguru import logger

from app.core.historical_engine import HistoricalAnalysisEngine
from app.ml.historical_analyzer import HistoricalVolcanicAnalyzer
from app.services.backtest import VolcanicBacktestService
from app.services.historical_ingest import HistoricalDataIngestor

router = APIRouter()

historical_engine = HistoricalAnalysisEngine()
ml_analyzer = HistoricalVolcanicAnalyzer()
backtest_service = VolcanicBacktestService()
data_ingestor = HistoricalDataIngestor()


@router.get("/simulate/{start_year}/{end_year}")
async def simulate_historical_period(
    start_year: int,
    end_year: int,
    lat: float = Query(..., ge=-90, le=90, description="Latitude"),
    lon: float = Query(..., ge=-180, le=180, description="Longitude"),
):
    """Simulate historical period using stationary Earth/moving Sun methodology"""
    try:
        if start_year >= end_year:
            raise HTTPException(status_code=400, detail="Start year must be before end year")
        
        if end_year - start_year > 200:
            raise HTTPException(status_code=400, detail="Maximum period is 200 years")

        logger.info(f"Simulating historical period {start_year}-{end_year} at {lat}, {lon}")

        simulation_results = await historical_engine.simulate_historical_period(
            start_year, end_year, lat, lon
        )

        return {
            "status": "success",
            "simulation": simulation_results,
            "framework": "BRETT VOLCANIC HISTORICAL v1.0",
            "methodology": "Stationary Earth / Moving Sun",
        }

    except Exception as e:
        logger.error(f"Historical simulation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/train")
async def train_ml_model(
    data_path: str,
    epochs: Optional[int] = None,
    learning_rate: Optional[float] = None,
):
    """Train CNN-LSTM model on historical volcanic data"""
    try:
        logger.info(f"Training ML model on data from: {data_path}")

        if epochs:
            from app.core.config import settings
            settings.EPOCHS = epochs
        if learning_rate:
            from app.core.config import settings
            settings.LEARNING_RATE = learning_rate

        training_results = await ml_analyzer.train_on_historical(data_path)

        return {
            "status": "success",
            "training_results": training_results,
            "model_version": "CNN-LSTM Hybrid v1.0",
            "framework": "RGB/CMYK feature integration",
        }

    except Exception as e:
        logger.error(f"ML training error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/backtest/{start_year}/{end_year}")
async def run_backtest(
    start_year: int,
    end_year: int,
    volcano_locations: Optional[str] = Query(None, description="JSON string of volcano locations"),
):
    """Run comprehensive backtest across multiple volcanoes and time periods"""
    try:
        logger.info(f"Running backtest for {start_year}-{end_year}")

        if volcano_locations is None:
            locations = [
                {"name": "Kilauea", "latitude": 19.4069, "longitude": -155.2834},
                {"name": "Mount St. Helens", "latitude": 46.1914, "longitude": -122.1956},
                {"name": "Vesuvius", "latitude": 40.8218, "longitude": 14.4289},
            ]
        else:
            import json
            locations = json.loads(volcano_locations)

        backtest_results = await backtest_service.run_comprehensive_backtest(
            start_year, end_year, locations
        )

        return {
            "status": "success",
            "backtest_results": backtest_results,
            "framework": "BRETT VOLCANIC HISTORICAL v1.0",
        }

    except Exception as e:
        logger.error(f"Backtest error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/kilauea-validation")
async def run_kilauea_validation():
    """Run specific validation backtest on Kīlauea data (1955-2023)"""
    try:
        logger.info("Running Kīlauea validation backtest")

        validation_results = await backtest_service.run_kilauea_validation_backtest()

        return {
            "status": "success",
            "validation_results": validation_results,
            "validation_type": "Kīlauea Historical Validation (1955-2023)",
            "framework": "BRETT VOLCANIC HISTORICAL v1.0",
        }

    except Exception as e:
        logger.error(f"Kīlauea validation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ingest/usgs")
async def ingest_usgs_data(volcano_ids: List[str]):
    """Ingest USGS volcano archives data"""
    try:
        logger.info(f"Ingesting USGS data for {len(volcano_ids)} volcanoes")

        ingestion_results = await data_ingestor.ingest_usgs_volcano_archives(volcano_ids)

        return {
            "status": "success",
            "ingestion_results": ingestion_results,
            "data_source": "USGS Volcano Archives",
        }

    except Exception as e:
        logger.error(f"USGS ingestion error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ingest/gvp")
async def ingest_gvp_data(
    start_year: int = Query(1900, description="Start year for eruption data"),
    end_year: int = Query(2023, description="End year for eruption data"),
):
    """Ingest Smithsonian GVP eruption database"""
    try:
        logger.info(f"Ingesting GVP eruption data for {start_year}-{end_year}")

        ingestion_results = await data_ingestor.ingest_gvp_eruption_database(start_year, end_year)

        return {
            "status": "success",
            "ingestion_results": ingestion_results,
            "data_source": "Smithsonian GVP Database",
        }

    except Exception as e:
        logger.error(f"GVP ingestion error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ingest/noaa")
async def ingest_noaa_data(volcano_ids: List[str]):
    """Ingest NOAA thermal and gas data"""
    try:
        logger.info(f"Ingesting NOAA data for {len(volcano_ids)} volcanoes")

        ingestion_results = await data_ingestor.ingest_noaa_thermal_gas_data(volcano_ids)

        return {
            "status": "success",
            "ingestion_results": ingestion_results,
            "data_source": "NOAA/NGDC Thermal and Gas Data",
        }

    except Exception as e:
        logger.error(f"NOAA ingestion error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/data-status")
async def get_data_status():
    """Get current data ingestion status"""
    try:
        status = await data_ingestor.get_ingestion_status()

        return {
            "status": "success",
            "data_status": status,
            "framework": "BRETT VOLCANIC HISTORICAL v1.0",
        }

    except Exception as e:
        logger.error(f"Data status error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
