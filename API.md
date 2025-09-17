# BRETT Earthquake System v4.0 - API Documentation

## Overview

The BRETT Earthquake Prediction System provides a comprehensive REST API for earthquake prediction using the 12-Dimensional GAL-CRM Framework. This API integrates real-time data from multiple sources and provides advanced prediction capabilities.

## Base URL

```
http://localhost:8000/api
```

## Authentication

Currently using simplified authentication. In production, implement proper JWT token authentication.

## Endpoints

### Health Check

#### GET /health
Check system health and status.

**Response:**
```json
{
  "status": "healthy",
  "system": "BRETT Earthquake Prediction System",
  "version": "4.0.0",
  "framework": "12-Dimensional GAL-CRM",
  "isolation": "earthquake-only"
}
```

### Location Services

#### POST /location/resolve
Resolve and validate location coordinates.

**Request Body:**
```json
{
  "latitude": 37.7749,
  "longitude": -122.4194,
  "location_name": "San Francisco, CA"
}
```

**Response:**
```json
{
  "latitude": 37.7749,
  "longitude": -122.4194,
  "location_name": "San Francisco, CA",
  "validated": true,
  "timezone": "America/Los_Angeles",
  "elevation": 52.0
}
```

#### GET /location/nearby-stations
Get nearby seismic monitoring stations.

**Query Parameters:**
- `lat`: Latitude (required)
- `lng`: Longitude (required)
- `radius`: Radius in kilometers (default: 100)

**Response:**
```json
{
  "stations": [
    {
      "station_id": "BKS",
      "name": "Berkeley Seismological Laboratory",
      "latitude": 37.8764,
      "longitude": -122.2355,
      "distance_km": 15.2,
      "network": "BK",
      "status": "active"
    }
  ],
  "total_count": 12
}
```

### Data Sources

#### GET /sources/status
Get status of all data sources.

**Response:**
```json
[
  {
    "source_name": "USGS",
    "status": "active",
    "last_update": "2024-01-15T10:30:00Z",
    "error_message": null,
    "reliability_percent": 98.5
  },
  {
    "source_name": "EMSC",
    "status": "active",
    "last_update": "2024-01-15T10:28:00Z",
    "error_message": null,
    "reliability_percent": 96.2
  }
]
```

#### POST /sources/refresh
Refresh data sources for a specific location.

**Request Body:**
```json
{
  "latitude": 37.7749,
  "longitude": -122.4194,
  "radius_km": 100
}
```

**Response:**
```json
{
  "success": true,
  "refreshed_sources": ["USGS", "EMSC", "NASA", "NOAA", "GFZ"],
  "refresh_time": "2024-01-15T10:35:00Z",
  "next_refresh": "2024-01-15T10:55:00Z"
}
```

#### GET /sources/cached-data
Get cached data for analysis.

**Query Parameters:**
- `source`: Data source name (optional)
- `hours`: Hours of historical data (default: 24)

**Response:**
```json
{
  "data": {
    "seismic_events": [...],
    "electromagnetic_readings": [...],
    "space_weather": [...]
  },
  "cache_time": "2024-01-15T10:30:00Z",
  "data_points": 1247
}
```

### Earthquake Prediction

#### POST /prediction/brett-earth
Run BRETT Earth engine prediction.

**Request Body:**
```json
{
  "latitude": 37.7749,
  "longitude": -122.4194,
  "location_name": "San Francisco, CA",
  "radius_km": 100
}
```

**Response:**
```json
{
  "engine_type": "BRETT-EARTH",
  "location": {
    "latitude": 37.7749,
    "longitude": -122.4194,
    "location_name": "San Francisco, CA",
    "radius_km": 100
  },
  "predictions": [
    {
      "day": 1,
      "date": "2024-01-16",
      "magnitude_prediction": 3.2,
      "probability_percent": 15.8,
      "risk_level": "low",
      "confidence": 0.82
    }
  ],
  "summary": {
    "max_magnitude": 4.1,
    "highest_risk_day": 7,
    "average_probability": 12.4,
    "total_predictions": 21,
    "risk_distribution": {
      "low": 18,
      "medium": 3,
      "high": 0
    }
  },
  "processing_time": 2.34,
  "timestamp": "2024-01-15T10:35:00Z"
}
```

#### POST /prediction/brett-space
Run BRETT Space engine prediction.

**Request Body:** Same as BRETT Earth

**Response:** Same structure as BRETT Earth with `engine_type: "BRETT-SPACE"`

#### POST /prediction/brett-combo
Run combined BRETT Earth + Space prediction.

**Request Body:** Same as BRETT Earth

**Response:**
```json
{
  "location": {
    "latitude": 37.7749,
    "longitude": -122.4194,
    "location_name": "San Francisco, CA",
    "radius_km": 100
  },
  "brett_earth_result": { /* BRETT Earth result */ },
  "brett_space_result": { /* BRETT Space result */ },
  "combined_summary": {
    "consensus_max_magnitude": 4.0,
    "consensus_highest_risk_day": 7,
    "combined_confidence": 0.87,
    "engine_agreement_percent": 78.5
  },
  "timestamp": "2024-01-15T10:35:00Z"
}
```

#### POST /prediction/cymatic-visualization
Generate 3D cymatic wave field data.

**Request Body:**
```json
{
  "latitude": 37.7749,
  "longitude": -122.4194,
  "location_name": "San Francisco, CA",
  "radius_km": 100
}
```

**Response:**
```json
{
  "location": {
    "latitude": 37.7749,
    "longitude": -122.4194,
    "location_name": "San Francisco, CA",
    "radius_km": 100
  },
  "wave_field": [
    [
      [0.12, 0.15, 0.18],
      [0.14, 0.17, 0.20]
    ]
  ],
  "frequency_data": {
    "dominant_frequency": 2.4,
    "frequency_range": [0.1, 10.0],
    "amplitude_scale": 1.0
  },
  "visualization_metadata": {
    "grid_size": [100, 100, 50],
    "time_steps": 200,
    "sampling_rate": 50.0
  },
  "timestamp": "2024-01-15T10:35:00Z"
}
```

## Error Responses

All endpoints return standard HTTP status codes:

- `200`: Success
- `400`: Bad Request - Invalid input parameters
- `401`: Unauthorized - Authentication required
- `404`: Not Found - Resource not found
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error - System error

**Error Response Format:**
```json
{
  "error": "Invalid coordinates",
  "message": "Latitude must be between -90 and 90 degrees",
  "code": "INVALID_COORDINATES",
  "timestamp": "2024-01-15T10:35:00Z"
}
```

## Rate Limiting

- Default: 60 requests per minute per IP
- Prediction endpoints: 10 requests per minute per IP
- Data refresh: 5 requests per minute per IP

## Data Sources Integration

The API integrates with the following real-time data sources:

1. **USGS (United States Geological Survey)**
   - Real-time earthquake data
   - Seismic monitoring networks
   - Historical earthquake catalogs

2. **EMSC (European-Mediterranean Seismological Centre)**
   - Global earthquake monitoring
   - Real-time event notifications
   - Regional seismic networks

3. **NASA Earth Data**
   - Electromagnetic field measurements
   - Satellite-based monitoring
   - Space weather data

4. **NOAA Space Weather Prediction Center**
   - Solar activity monitoring
   - Geomagnetic field data
   - Space weather forecasts

5. **GFZ German Research Centre for Geosciences**
   - Global seismic networks
   - Research-grade monitoring
   - Advanced seismic analysis

## 12-Dimensional GAL-CRM Framework

The prediction engine uses a 12-dimensional analysis framework:

1. **Geological Dimensions (4D)**
   - Tectonic plate movement
   - Fault line stress analysis
   - Rock formation characteristics
   - Subsurface structure mapping

2. **Atmospheric Dimensions (3D)**
   - Atmospheric pressure variations
   - Electromagnetic field changes
   - Ionospheric disturbances

3. **Lithospheric Dimensions (3D)**
   - Crustal deformation
   - Seismic wave propagation
   - Ground motion patterns

4. **Magnetospheric Dimensions (2D)**
   - Geomagnetic field variations
   - Solar wind interactions

## SDK and Client Libraries

Client libraries are available for:
- Python: `pip install brett-earthquake-client`
- JavaScript/Node.js: `npm install brett-earthquake-client`
- Java: Maven/Gradle integration available

## Support

For API support:
- Documentation: This file
- Health endpoint: `/health`
- System status: `/sources/status`

## Changelog

### v4.0.0
- Initial release of BRETT Earthquake System
- 12-Dimensional GAL-CRM Framework implementation
- Real-time data source integration
- 3D cymatic visualization support
