from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
from typing import Dict, List

from app.services.data_sources import DataSourcesService
from app.models.prediction import DataSourceStatus, SystemStatus

router = APIRouter()

data_service = DataSourcesService()

@router.get("/sources/status", response_model=List[DataSourceStatus])
async def get_data_sources_status():
    try:
        status_data = data_service.get_data_sources_status()
        
        sources_status = []
        for source_name, source_info in status_data['sources'].items():
            sources_status.append(DataSourceStatus(
                source_name=source_name,
                status=source_info['status'],
                last_update=source_info['last_update'],
                error_message=None,
                reliability_percent=source_info['reliability']
            ))
        
        return sources_status
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get data sources status: {str(e)}")

@router.post("/sources/refresh")
async def refresh_data_sources(
    latitude: float = 40.7128,
    longitude: float = -74.0060,
    radius_km: int = 100
):
    try:
        result = await data_service.update_all_sources(latitude, longitude, radius_km)
        
        return {
            "success": result['success'],
            "sources_updated": result['sources_updated'],
            "total_sources": result['total_sources'],
            "errors": result.get('errors', []),
            "processing_time_seconds": result['processing_time_seconds'],
            "update_timestamp": result['update_timestamp'],
            "next_auto_refresh": result['next_update']
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to refresh data sources: {str(e)}")

@router.get("/sources/cached")
async def get_cached_data():
    try:
        cached_data = data_service.get_cached_data()
        
        return {
            "has_cached_data": bool(cached_data['cached_data']),
            "cache_age_minutes": cached_data['cache_age_minutes'],
            "cached_sources": list(cached_data['cached_data'].keys()) if cached_data['cached_data'] else [],
            "service_id": cached_data['service_id'],
            "timestamp": cached_data['timestamp']
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get cached data: {str(e)}")

@router.get("/system/status", response_model=SystemStatus)
async def get_system_status():
    try:
        status_data = data_service.get_data_sources_status()
        
        data_sources = []
        error_count = 0
        
        for source_name, source_info in status_data['sources'].items():
            is_error = source_info['status'] == 'error'
            if is_error:
                error_count += 1
            
            data_sources.append(DataSourceStatus(
                source_name=source_name,
                status=source_info['status'],
                last_update=source_info['last_update'],
                error_message="Data source unavailable" if is_error else None,
                reliability_percent=source_info['reliability']
            ))
        
        operational = status_data['active_sources'] >= 3
        
        last_update = None
        if status_data['last_update']:
            last_update = datetime.fromisoformat(status_data['last_update'])
        
        next_refresh = None
        if last_update:
            next_refresh = last_update + timedelta(minutes=20)
        
        return SystemStatus(
            operational=operational,
            data_sources=data_sources,
            last_refresh=last_update,
            next_refresh=next_refresh,
            error_count=error_count
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get system status: {str(e)}")

@router.get("/health")
async def health_check():
    try:
        status_data = data_service.get_data_sources_status()
        
        return {
            "status": "healthy",
            "service": "data-service",
            "timestamp": datetime.utcnow().isoformat(),
            "active_sources": status_data['active_sources'],
            "total_sources": status_data['total_sources'],
            "last_update": status_data['last_update']
        }
        
    except Exception as e:
        return {
            "status": "unhealthy",
            "service": "data-service",
            "timestamp": datetime.utcnow().isoformat(),
            "error": str(e)
        }

@router.get("/sources/{source_name}/details")
async def get_source_details(source_name: str):
    try:
        source_name_upper = source_name.upper()
        
        if source_name_upper not in data_service.data_sources:
            raise HTTPException(status_code=404, detail=f"Data source '{source_name}' not found")
        
        source_info = data_service.data_sources[source_name_upper]
        cached_data = data_service.get_cached_data()
        
        source_cached_data = cached_data['cached_data'].get(source_name.lower(), {})
        
        return {
            "source_name": source_name_upper,
            "configuration": {
                "name": source_info['name'],
                "base_url": source_info['base_url'],
                "status": source_info['status'],
                "reliability": source_info['reliability']
            },
            "last_update": source_info['last_update'],
            "cached_data_available": bool(source_cached_data),
            "cached_data_summary": {
                "success": source_cached_data.get('success', False),
                "data_points": len(source_cached_data.get('events', [])) if 'events' in source_cached_data else len(source_cached_data.get('data', [])),
                "fetch_timestamp": source_cached_data.get('fetch_timestamp')
            } if source_cached_data else None
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get source details: {str(e)}")

@router.get("/sources/test-connectivity")
async def test_data_source_connectivity():
    try:
        test_results = {}
        
        test_lat, test_lng = 40.7128, -74.0060
        
        usgs_result = await data_service.fetch_usgs_earthquake_data(test_lat, test_lng, 100, 7)
        test_results['USGS'] = {
            'success': usgs_result.get('success', False),
            'error': usgs_result.get('error'),
            'data_points': usgs_result.get('total_events', 0)
        }
        
        emsc_result = await data_service.fetch_emsc_earthquake_data(test_lat, test_lng, 100, 7)
        test_results['EMSC'] = {
            'success': emsc_result.get('success', False),
            'error': emsc_result.get('error'),
            'data_points': emsc_result.get('total_events', 0)
        }
        
        noaa_result = await data_service.fetch_noaa_space_weather_data()
        test_results['NOAA'] = {
            'success': noaa_result.get('success', False),
            'error': noaa_result.get('error'),
            'data_points': len(noaa_result.get('data', {}))
        }
        
        gfz_result = await data_service.fetch_gfz_geomagnetic_data()
        test_results['GFZ'] = {
            'success': gfz_result.get('success', False),
            'error': gfz_result.get('error'),
            'data_points': len(gfz_result.get('data', {}).get('kp_index', []))
        }
        
        nasa_result = await data_service.fetch_nasa_space_weather_data()
        test_results['NASA'] = {
            'success': nasa_result.get('success', False),
            'error': nasa_result.get('error'),
            'data_points': len(nasa_result.get('data', []))
        }
        
        successful_tests = len([r for r in test_results.values() if r['success']])
        
        return {
            "test_timestamp": datetime.utcnow().isoformat(),
            "total_sources_tested": len(test_results),
            "successful_connections": successful_tests,
            "overall_connectivity": "good" if successful_tests >= 4 else "fair" if successful_tests >= 2 else "poor",
            "test_results": test_results
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Connectivity test failed: {str(e)}")
