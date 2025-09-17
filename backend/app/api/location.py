from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import httpx
import math


router = APIRouter()

class LocationRequest(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    city: Optional[str] = None
    country: Optional[str] = None
    auto_detect: Optional[bool] = False

class LocationResponse(BaseModel):
    latitude: float
    longitude: float
    location_name: str
    country: str
    radius_options: List[int] = [100, 200, 500, 1000]
    confirmed: bool = False

@router.post("/resolve", response_model=LocationResponse)
async def resolve_location(location_request: LocationRequest):
    try:
        if location_request.latitude is not None and location_request.longitude is not None:
            location_name = await reverse_geocode(location_request.latitude, location_request.longitude)
            return LocationResponse(
                latitude=location_request.latitude,
                longitude=location_request.longitude,
                location_name=location_name,
                country="Unknown",
                confirmed=True
            )
        
        elif location_request.city:
            coords = await forward_geocode(location_request.city, location_request.country)
            return LocationResponse(
                latitude=coords['latitude'],
                longitude=coords['longitude'],
                location_name=coords['display_name'],
                country=coords.get('country', 'Unknown'),
                confirmed=True
            )
        
        elif location_request.auto_detect:
            coords = await auto_detect_location()
            return LocationResponse(
                latitude=coords['latitude'],
                longitude=coords['longitude'],
                location_name=coords['location_name'],
                country=coords.get('country', 'Unknown'),
                confirmed=True
            )
        
        else:
            raise HTTPException(status_code=400, detail="No location information provided")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Location resolution failed: {str(e)}")

@router.get("/validate")
async def validate_coordinates(
    latitude: float,
    longitude: float
):
    try:
        if not (-90 <= latitude <= 90):
            raise HTTPException(status_code=400, detail="Invalid latitude: must be between -90 and 90")
        
        if not (-180 <= longitude <= 180):
            raise HTTPException(status_code=400, detail="Invalid longitude: must be between -180 and 180")
        
        location_name = await reverse_geocode(latitude, longitude)
        
        return {
            "valid": True,
            "latitude": latitude,
            "longitude": longitude,
            "location_name": location_name,
            "tectonic_zone": determine_tectonic_zone(latitude, longitude)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Coordinate validation failed: {str(e)}")

async def forward_geocode(city: str, country: Optional[str] = None) -> dict:
    try:
        query = f"{city}"
        if country:
            query += f", {country}"
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                "https://nominatim.openstreetmap.org/search",
                params={
                    'q': query,
                    'format': 'json',
                    'limit': 1,
                    'addressdetails': 1
                },
                headers={'User-Agent': 'BRETT-Earthquake-Platform/1.0'}
            )
            response.raise_for_status()
            
            results = response.json()
            if not results:
                raise HTTPException(status_code=404, detail=f"Location not found: {query}")
            
            result = results[0]
            return {
                'latitude': float(result['lat']),
                'longitude': float(result['lon']),
                'display_name': result['display_name'],
                'country': result.get('address', {}).get('country', 'Unknown')
            }
            
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Geocoding service unavailable: {str(e)}")

async def reverse_geocode(latitude: float, longitude: float) -> str:
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                "https://nominatim.openstreetmap.org/reverse",
                params={
                    'lat': latitude,
                    'lon': longitude,
                    'format': 'json',
                    'addressdetails': 1
                },
                headers={'User-Agent': 'BRETT-Earthquake-Platform/1.0'}
            )
            response.raise_for_status()
            
            result = response.json()
            return result.get('display_name', f"Location at {latitude:.4f}, {longitude:.4f}")
            
    except Exception:
        return f"Location at {latitude:.4f}, {longitude:.4f}"

async def auto_detect_location() -> dict:
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get("http://ip-api.com/json/")
            response.raise_for_status()
            
            data = response.json()
            
            if data.get('status') == 'success':
                return {
                    'latitude': data['lat'],
                    'longitude': data['lon'],
                    'location_name': f"{data.get('city', 'Unknown')}, {data.get('country', 'Unknown')}",
                    'country': data.get('country', 'Unknown')
                }
            else:
                raise HTTPException(status_code=503, detail="Auto-detection failed")
                
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Auto-detection unavailable: {str(e)}")

def determine_tectonic_zone(latitude: float, longitude: float) -> str:
    tectonic_zones = {
        'ring_of_fire': {
            'regions': [
                (-60, 60, 90, -90),
                (30, 70, -180, -120),
                (-10, 10, 95, 141)
            ],
            'name': 'Pacific Ring of Fire'
        },
        'mediterranean': {
            'regions': [(30, 50, -10, 50)],
            'name': 'Mediterranean-Himalayan Belt'
        },
        'mid_atlantic': {
            'regions': [(-60, 70, -40, -10)],
            'name': 'Mid-Atlantic Ridge'
        },
        'stable': {
            'regions': [],
            'name': 'Stable Continental Region'
        }
    }
    
    for zone_id, zone_data in tectonic_zones.items():
        for lat_min, lat_max, lon_min, lon_max in zone_data['regions']:
            if (lat_min <= latitude <= lat_max and 
                ((lon_min <= longitude <= lon_max) or 
                 (lon_min > lon_max and (longitude >= lon_min or longitude <= lon_max)))):
                return zone_data['name']
    
    return 'Stable Continental Region'

@router.get("/tectonic-info")
async def get_tectonic_info(
    latitude: float,
    longitude: float
):
    try:
        tectonic_zone = determine_tectonic_zone(latitude, longitude)
        
        zone_info = {
            'Pacific Ring of Fire': {
                'seismic_activity': 'Very High',
                'earthquake_frequency': 'Daily',
                'max_expected_magnitude': 9.0,
                'risk_level': 'HIGH'
            },
            'Mediterranean-Himalayan Belt': {
                'seismic_activity': 'High',
                'earthquake_frequency': 'Weekly',
                'max_expected_magnitude': 8.0,
                'risk_level': 'ELEVATED'
            },
            'Mid-Atlantic Ridge': {
                'seismic_activity': 'Moderate',
                'earthquake_frequency': 'Monthly',
                'max_expected_magnitude': 7.0,
                'risk_level': 'MODERATE'
            },
            'Stable Continental Region': {
                'seismic_activity': 'Low',
                'earthquake_frequency': 'Yearly',
                'max_expected_magnitude': 6.0,
                'risk_level': 'LOW'
            }
        }
        
        info = zone_info.get(tectonic_zone, zone_info['Stable Continental Region'])
        
        return {
            'latitude': latitude,
            'longitude': longitude,
            'tectonic_zone': tectonic_zone,
            'zone_characteristics': info,
            'nearest_fault_systems': get_nearest_fault_systems(latitude, longitude)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tectonic info retrieval failed: {str(e)}")

def get_nearest_fault_systems(latitude: float, longitude: float) -> List[dict]:
    major_faults = [
        {'name': 'San Andreas Fault', 'lat': 35.0, 'lon': -120.0, 'type': 'Transform'},
        {'name': 'Alpine Fault', 'lat': -43.0, 'lon': 170.0, 'type': 'Transform'},
        {'name': 'North Anatolian Fault', 'lat': 40.5, 'lon': 35.0, 'type': 'Transform'},
        {'name': 'Dead Sea Transform', 'lat': 32.0, 'lon': 35.5, 'type': 'Transform'},
        {'name': 'Japan Trench', 'lat': 38.0, 'lon': 143.0, 'type': 'Subduction'},
        {'name': 'Peru-Chile Trench', 'lat': -20.0, 'lon': -70.0, 'type': 'Subduction'}
    ]
    
    nearby_faults = []
    
    for fault in major_faults:
        distance = calculate_distance(latitude, longitude, fault['lat'], fault['lon'])
        if distance < 2000:
            nearby_faults.append({
                'name': fault['name'],
                'type': fault['type'],
                'distance_km': round(distance, 1)
            })
    
    return sorted(nearby_faults, key=lambda x: x['distance_km'])[:5]

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)
    
    a = (math.sin(delta_lat/2)**2 + 
         math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon/2)**2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    return R * c
