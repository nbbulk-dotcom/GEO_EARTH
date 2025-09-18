"""Volcanic analysis API routes with 12 space variables calculator"""

from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query
from loguru import logger

from app.core.volcanic_historical import VolcanicHistoricalEngine

router = APIRouter()

volcanic_engine = VolcanicHistoricalEngine()


@router.get("/chamber-resonance")
async def calculate_chamber_resonance(
    chamber_volume: float = Query(..., gt=0, description="Chamber volume in cubic meters"),
    depth: float = Query(..., ge=0, description="Depth in meters"),
    magma_viscosity: float = Query(1000.0, gt=0, description="Magma viscosity in Pa·s"),
):
    """Calculate volcanic chamber resonance using Helmholtz model with 12 space variables"""
    try:
        logger.info(f"Calculating chamber resonance for volume={chamber_volume}, depth={depth}")

        resonance_results = await volcanic_engine.calculate_chamber_resonance(
            chamber_volume, depth, magma_viscosity
        )

        return {
            "status": "success",
            "resonance_analysis": resonance_results,
            "framework": "BRETT VOLCANIC HISTORICAL v1.0",
            "space_variables_integration": "12 space data tables with RGB electromagnetic framework",
        }

    except Exception as e:
        logger.error(f"Chamber resonance calculation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/constructive-interference")
async def calculate_constructive_interference(
    lat: float = Query(..., ge=-90, le=90, description="Latitude"),
    lon: float = Query(..., ge=-180, le=180, description="Longitude"),
    depth: float = Query(..., ge=0, description="Depth in meters"),
    historical_events: Optional[str] = Query(None, description="JSON string of historical events"),
):
    """Calculate constructive interference using space variables and historical data"""
    try:
        logger.info(f"Calculating constructive interference at {lat}, {lon}, depth={depth}")

        events = []
        if historical_events:
            import json
            events = json.loads(historical_events)

        interference_results = await volcanic_engine.calculate_constructive_interference(
            lat, lon, depth, events
        )

        return {
            "status": "success",
            "interference_analysis": interference_results,
            "framework": "BRETT VOLCANIC HISTORICAL v1.0",
            "methodology": "Space influence angle (26.57°) + Earth-surface angle (≈57°) with depth adjustments",
        }

    except Exception as e:
        logger.error(f"Constructive interference calculation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/space-variables-status")
async def get_space_variables_status():
    """Get current status of 12 space variables calculator"""
    try:
        status = await volcanic_engine.get_space_variables_status()

        return {
            "status": "success",
            "space_variables_status": status,
            "framework": "BRETT VOLCANIC HISTORICAL v1.0",
        }

    except Exception as e:
        logger.error(f"Space variables status error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/regional-analysis")
async def analyze_volcanic_region(
    lat: float = Query(..., ge=-90, le=90, description="Latitude"),
    lon: float = Query(..., ge=-180, le=180, description="Longitude"),
):
    """Analyze volcanic region characteristics and modifiers"""
    try:
        logger.info(f"Analyzing volcanic region at {lat}, {lon}")

        region = volcanic_engine._determine_volcanic_region(lat, lon)
        regional_config = volcanic_engine.regional_angles.get(
            region, volcanic_engine.regional_angles["GLOBAL"]
        )

        space_angle = volcanic_engine.planetary_angle * regional_config["modifier"]
        earth_angle = 57.0 * regional_config["latitude_factor"]

        regional_analysis = {
            "location": {"latitude": lat, "longitude": lon},
            "volcanic_region": region,
            "regional_configuration": regional_config,
            "calculated_angles": {
                "space_influence_angle": round(space_angle, 2),
                "earth_surface_angle": round(earth_angle, 2),
                "base_planetary_angle": volcanic_engine.planetary_angle,
            },
            "regional_characteristics": {
                "modifier": regional_config["modifier"],
                "latitude_factor": regional_config["latitude_factor"],
                "volcanic_activity_level": _assess_regional_activity(region),
            },
        }

        return {
            "status": "success",
            "regional_analysis": regional_analysis,
            "framework": "BRETT VOLCANIC HISTORICAL v1.0",
        }

    except Exception as e:
        logger.error(f"Regional analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


def _assess_regional_activity(region: str) -> str:
    """Assess regional volcanic activity level"""
    activity_levels = {
        "PACIFIC_RING": "very_high",
        "MEDITERRANEAN": "high",
        "ATLANTIC_RIDGE": "medium",
        "AFRICAN_RIFT": "high",
        "VOLCANIC_ARCS": "very_high",
        "GLOBAL": "medium",
    }
    return activity_levels.get(region, "medium")


@router.get("/framework-parameters")
async def get_framework_parameters():
    """Get BRETT volcanic framework parameters"""
    try:
        parameters = {
            "system_version": "BRETT VOLCANIC HISTORICAL v1.0",
            "space_variables": {
                "count": 12,
                "framework": "RGB electromagnetic + CMYK geological correlation",
                "variables": list(volcanic_engine.space_variables.keys()),
            },
            "earth_resonance_datasets": {
                "count": 24,
                "source": "Integrated from earthquake system",
                "framework": "CMYK geological correlation",
            },
            "volcanic_specific_variables": {
                "count": 6,
                "variables": [
                    "chamber_volume",
                    "magma_viscosity",
                    "gas_composition",
                    "thermal_gradient",
                    "deformation_rate",
                    "eruption_history",
                ],
            },
            "total_variables": 30,  # 12 space + 24 earth + 6 volcanic - 12 overlap
            "framework_parameters": {
                "base_offset": volcanic_engine.base_offset,
                "planetary_angle": volcanic_engine.planetary_angle,
                "firmament_height": volcanic_engine.firmament_height,
                "reset_window_width": volcanic_engine.reset_window_width,
            },
            "regional_configurations": volcanic_engine.regional_angles,
            "methodology": "Stationary Earth / Moving Sun with ML validation",
            "prediction_window_days": 21,
            "upgrade_status": "Latest 12 space variables calculator integrated",
        }

        return {
            "status": "success",
            "framework_parameters": parameters,
            "framework": "BRETT VOLCANIC HISTORICAL v1.0",
        }

    except Exception as e:
        logger.error(f"Framework parameters error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
