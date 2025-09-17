# Data Sources Guide

## Overview

The BRETT Earthquake Prediction System integrates multiple real-time data sources to provide comprehensive electromagnetic field analysis and earthquake risk assessment. This guide details each data source, API requirements, and configuration procedures.

## Primary Data Sources

### 1. USGS (United States Geological Survey)

**Purpose**: Real-time earthquake data and seismic monitoring

**Data Types**:
- Real-time earthquake feeds
- Historical seismic data
- Geological survey information
- Fault line mapping
- Seismic station networks

**API Endpoints**:
```
Base URL: https://earthquake.usgs.gov/fdsnws/event/1/
Real-time Feed: https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/
GeoJSON Format: https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson
```

**Configuration**:
```env
USGS_API_BASE_URL=https://earthquake.usgs.gov/fdsnws/event/1/
USGS_FEED_URL=https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/
USGS_API_KEY=optional_but_recommended
```

**Rate Limits**: 
- 1000 requests per hour for anonymous users
- 10000 requests per hour with API key

**Data Quality**: ⭐⭐⭐⭐⭐ (Excellent)

### 2. EMSC (European-Mediterranean Seismological Centre)

**Purpose**: European and Mediterranean regional earthquake monitoring

**Data Types**:
- Regional earthquake catalogs
- Real-time seismic alerts
- European seismic networks
- Mediterranean geological data
- Tsunami warnings

**API Endpoints**:
```
RSS Feed: https://www.emsc-csem.org/service/rss/rss.php?typ=emsc
FDSN Web Service: https://www.seismicportal.eu/fdsnws/event/1/query
GeoJSON Format: https://www.seismicportal.eu/fdsnws/event/1/query?format=geojson
```

**Configuration**:
```env
EMSC_RSS_URL=https://www.emsc-csem.org/service/rss/rss.php?typ=emsc
EMSC_FDSN_URL=https://www.seismicportal.eu/fdsnws/event/1/query
EMSC_FORMAT=geojson
```

**Rate Limits**: 
- No explicit limits for RSS feeds
- 100 requests per minute for FDSN services

**Data Quality**: ⭐⭐⭐⭐ (Very Good)

### 3. NASA Space Weather

**Purpose**: Solar activity and space weather monitoring

**Data Types**:
- Solar wind measurements
- Cosmic ray flux data
- Magnetospheric conditions
- Solar flare activity
- Coronal mass ejections

**API Endpoints**:
```
Base URL: https://api.nasa.gov/
Space Weather: https://api.nasa.gov/DONKI/
Solar Wind: https://services.swpc.noaa.gov/products/solar-wind/
```

**Configuration**:
```env
NASA_API_KEY=your_nasa_api_key_here
NASA_BASE_URL=https://api.nasa.gov/
NASA_DONKI_URL=https://api.nasa.gov/DONKI/
```

**Rate Limits**: 
- 1000 requests per hour with API key
- 30 requests per hour without API key

**Data Quality**: ⭐⭐⭐⭐⭐ (Excellent)

**API Key Registration**: https://api.nasa.gov/

### 4. NOAA Space Weather Prediction Center

**Purpose**: Geomagnetic indices and space weather forecasting

**Data Types**:
- Geomagnetic K-index
- Solar flux measurements
- Ionospheric conditions
- Space weather alerts
- Magnetic field variations

**Updated 2025 API Endpoints**:
```
Base URL: https://services.swpc.noaa.gov/
Solar Wind Plasma: https://services.swpc.noaa.gov/products/solar-wind/plasma-7-day.json
Solar Wind Magnetic: https://services.swpc.noaa.gov/products/solar-wind/mag-7-day.json
Planetary K-index: https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json
Solar Flux: https://services.swpc.noaa.gov/text/daily-solar-data.txt
```

**Configuration**:
```env
NOAA_SWPC_BASE_URL=https://services.swpc.noaa.gov/
NOAA_SOLAR_WIND_PLASMA=https://services.swpc.noaa.gov/products/solar-wind/plasma-7-day.json
NOAA_SOLAR_WIND_MAG=https://services.swpc.noaa.gov/products/solar-wind/mag-7-day.json
NOAA_PLANETARY_K=https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json
```

**Rate Limits**: 
- No explicit limits for public data
- Recommended: 1 request per minute per endpoint

**Data Quality**: ⭐⭐⭐⭐⭐ (Excellent)

### 5. GFZ Potsdam

**Purpose**: Global geophysical data and magnetic field monitoring

**Data Types**:
- Global magnetic field data
- Gravitational measurements
- Geophysical observatory data
- Magnetic declination
- Field variation monitoring

**API Endpoints**:
```
Base URL: https://www.gfz-potsdam.de/
Magnetic Data: https://www.gfz-potsdam.de/en/kp-index/
Observatory Data: https://www.gfz-potsdam.de/en/section/geomagnetism/
```

**Configuration**:
```env
GFZ_BASE_URL=https://www.gfz-potsdam.de/
GFZ_MAGNETIC_URL=https://www.gfz-potsdam.de/en/kp-index/
GFZ_OBSERVATORY_URL=https://www.gfz-potsdam.de/en/section/geomagnetism/
```

**Rate Limits**: 
- No explicit limits
- Recommended: Conservative usage

**Data Quality**: ⭐⭐⭐⭐ (Very Good)

## Data Source Configuration

### Environment Variables Setup

Create `.env` files in both backend and frontend directories:

**Backend (.env)**:
```env
# USGS Configuration
USGS_API_BASE_URL=https://earthquake.usgs.gov/fdsnws/event/1/
USGS_FEED_URL=https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/
USGS_API_KEY=your_usgs_key_here

# EMSC Configuration
EMSC_RSS_URL=https://www.emsc-csem.org/service/rss/rss.php?typ=emsc
EMSC_FDSN_URL=https://www.seismicportal.eu/fdsnws/event/1/query
EMSC_FORMAT=geojson

# NASA Configuration
NASA_API_KEY=your_nasa_api_key_here
NASA_BASE_URL=https://api.nasa.gov/
NASA_DONKI_URL=https://api.nasa.gov/DONKI/

# NOAA Configuration
NOAA_SWPC_BASE_URL=https://services.swpc.noaa.gov/
NOAA_SOLAR_WIND_PLASMA=https://services.swpc.noaa.gov/products/solar-wind/plasma-7-day.json
NOAA_SOLAR_WIND_MAG=https://services.swpc.noaa.gov/products/solar-wind/mag-7-day.json
NOAA_PLANETARY_K=https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json

# GFZ Configuration
GFZ_BASE_URL=https://www.gfz-potsdam.de/
GFZ_MAGNETIC_URL=https://www.gfz-potsdam.de/en/kp-index/

# Data Source Settings
DATA_REFRESH_INTERVAL=300  # 5 minutes
DATA_CACHE_TTL=600        # 10 minutes
MAX_RETRY_ATTEMPTS=3
RETRY_DELAY=5             # seconds
```

**Frontend (.env)**:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_DATA_REFRESH_INTERVAL=30000  # 30 seconds
VITE_ENABLE_REAL_TIME_UPDATES=true
```

### API Key Registration

#### NASA API Key
1. Visit: https://api.nasa.gov/
2. Click "Get Started"
3. Fill out registration form
4. Verify email address
5. Copy API key to `.env` file

#### USGS API Access
1. Visit: https://earthquake.usgs.gov/fdsnws/
2. Review terms of service
3. Optional: Register for higher rate limits
4. Use anonymous access or register for API key

#### NOAA Access
1. Visit: https://www.ncdc.noaa.gov/cdo-web/webservices
2. Review data access policies
3. Most endpoints are freely accessible
4. No registration required for basic access

## Data Processing Pipeline

### Data Collection Service

```python
class DataSourceManager:
    def __init__(self):
        self.sources = {
            'usgs': USGSDataSource(),
            'emsc': EMSCDataSource(),
            'nasa': NASADataSource(),
            'noaa': NOAADataSource(),
            'gfz': GFZDataSource()
        }
        
    async def fetch_all_sources(self):
        tasks = []
        for name, source in self.sources.items():
            task = self.fetch_with_retry(source)
            tasks.append(task)
            
        results = await asyncio.gather(*tasks, return_exceptions=True)
        return self.process_results(results)
        
    async def fetch_with_retry(self, source, max_retries=3):
        for attempt in range(max_retries):
            try:
                return await source.fetch_data()
            except Exception as e:
                if attempt == max_retries - 1:
                    raise e
                await asyncio.sleep(2 ** attempt)  # Exponential backoff
```

### Data Validation

```python
class DataValidator:
    def validate_earthquake_data(self, data):
        required_fields = ['magnitude', 'latitude', 'longitude', 'time']
        for field in required_fields:
            if field not in data:
                raise ValidationError(f"Missing required field: {field}")
                
        if not (-90 <= data['latitude'] <= 90):
            raise ValidationError("Invalid latitude")
            
        if not (-180 <= data['longitude'] <= 180):
            raise ValidationError("Invalid longitude")
            
        return True
        
    def validate_space_weather_data(self, data):
        required_fields = ['solar_wind_speed', 'magnetic_field', 'kp_index']
        for field in required_fields:
            if field not in data:
                raise ValidationError(f"Missing required field: {field}")
                
        return True
```

### Fallback Mechanisms

```python
class DataSourceFallback:
    def __init__(self):
        self.primary_sources = ['usgs', 'nasa', 'noaa']
        self.fallback_sources = ['emsc', 'gfz']
        self.cached_data = {}
        
    async def get_data_with_fallback(self, data_type):
        # Try primary sources first
        for source in self.primary_sources:
            try:
                data = await self.fetch_from_source(source, data_type)
                if self.validate_data(data):
                    self.cache_data(source, data_type, data)
                    return data
            except Exception as e:
                logger.warning(f"Primary source {source} failed: {e}")
                
        # Try fallback sources
        for source in self.fallback_sources:
            try:
                data = await self.fetch_from_source(source, data_type)
                if self.validate_data(data):
                    return data
            except Exception as e:
                logger.warning(f"Fallback source {source} failed: {e}")
                
        # Use cached data as last resort
        cached_data = self.get_cached_data(data_type)
        if cached_data:
            logger.info(f"Using cached data for {data_type}")
            return cached_data
            
        raise DataSourceError(f"All sources failed for {data_type}")
```

## Data Quality Monitoring

### Health Check Endpoints

```python
@app.get("/api/sources/status")
async def get_data_sources_status():
    status = {}
    for name, source in data_manager.sources.items():
        try:
            health = await source.health_check()
            status[name] = {
                'status': 'healthy' if health else 'unhealthy',
                'last_update': source.last_update,
                'response_time': source.last_response_time,
                'error_count': source.error_count
            }
        except Exception as e:
            status[name] = {
                'status': 'error',
                'error': str(e),
                'last_update': source.last_update
            }
    
    return status
```

### Data Quality Metrics

```python
class DataQualityMonitor:
    def calculate_quality_score(self, data_source, data):
        score = 100
        
        # Completeness check
        completeness = self.check_completeness(data)
        score *= completeness
        
        # Timeliness check
        timeliness = self.check_timeliness(data)
        score *= timeliness
        
        # Accuracy check (if reference data available)
        accuracy = self.check_accuracy(data)
        score *= accuracy
        
        return min(score, 100)
        
    def check_completeness(self, data):
        required_fields = self.get_required_fields(data['type'])
        present_fields = len([f for f in required_fields if f in data])
        return present_fields / len(required_fields)
        
    def check_timeliness(self, data):
        if 'timestamp' not in data:
            return 0.5
            
        age_minutes = (datetime.utcnow() - data['timestamp']).total_seconds() / 60
        if age_minutes <= 5:
            return 1.0
        elif age_minutes <= 15:
            return 0.8
        elif age_minutes <= 60:
            return 0.6
        else:
            return 0.3
```

## Troubleshooting

### Common Issues

#### API Key Authentication Errors
```bash
# Check API key configuration
curl -H "X-API-Key: your_key_here" https://api.nasa.gov/planetary/apod

# Verify environment variables
echo $NASA_API_KEY
```

#### Rate Limit Exceeded
```python
# Implement exponential backoff
async def fetch_with_backoff(url, max_retries=3):
    for attempt in range(max_retries):
        try:
            response = await httpx.get(url)
            if response.status_code == 429:  # Rate limited
                wait_time = 2 ** attempt
                await asyncio.sleep(wait_time)
                continue
            return response
        except Exception as e:
            if attempt == max_retries - 1:
                raise e
```

#### Data Format Changes
```python
# Implement flexible data parsing
def parse_earthquake_data(raw_data):
    try:
        # Try new format first
        return parse_new_format(raw_data)
    except (KeyError, ValueError):
        try:
            # Fall back to old format
            return parse_old_format(raw_data)
        except Exception:
            # Use minimal parsing
            return parse_minimal_format(raw_data)
```

#### Network Connectivity Issues
```python
# Implement connection pooling and timeouts
async def create_http_client():
    timeout = httpx.Timeout(10.0, connect=5.0)
    limits = httpx.Limits(max_keepalive_connections=5, max_connections=10)
    return httpx.AsyncClient(timeout=timeout, limits=limits)
```

### Monitoring and Alerts

#### Data Source Health Dashboard
```python
@app.get("/api/sources/dashboard")
async def get_dashboard_data():
    return {
        'sources': await get_all_source_status(),
        'quality_scores': await get_quality_scores(),
        'error_rates': await get_error_rates(),
        'response_times': await get_response_times(),
        'data_freshness': await get_data_freshness()
    }
```

#### Alert Configuration
```python
class AlertManager:
    def __init__(self):
        self.thresholds = {
            'error_rate': 0.1,      # 10% error rate
            'response_time': 5.0,    # 5 seconds
            'data_age': 300,         # 5 minutes
            'quality_score': 0.7     # 70% quality
        }
        
    async def check_alerts(self):
        for source_name, source in data_manager.sources.items():
            metrics = await source.get_metrics()
            
            if metrics['error_rate'] > self.thresholds['error_rate']:
                await self.send_alert(f"High error rate for {source_name}")
                
            if metrics['response_time'] > self.thresholds['response_time']:
                await self.send_alert(f"Slow response from {source_name}")
```

## Best Practices

### API Usage Guidelines

1. **Respect Rate Limits**: Implement proper rate limiting and backoff strategies
2. **Cache Responses**: Cache data appropriately to reduce API calls
3. **Handle Errors Gracefully**: Implement comprehensive error handling
4. **Monitor Usage**: Track API usage and performance metrics
5. **Use Appropriate Formats**: Choose the most efficient data formats (JSON over XML)

### Data Processing Best Practices

1. **Validate All Data**: Implement comprehensive data validation
2. **Handle Missing Data**: Gracefully handle incomplete datasets
3. **Implement Fallbacks**: Use multiple data sources for redundancy
4. **Cache Strategically**: Balance data freshness with performance
5. **Monitor Quality**: Continuously monitor data quality metrics

### Security Considerations

1. **Secure API Keys**: Store API keys securely in environment variables
2. **Use HTTPS**: Always use encrypted connections
3. **Validate Inputs**: Sanitize and validate all external data
4. **Rate Limiting**: Implement rate limiting to prevent abuse
5. **Audit Logs**: Maintain logs of all data source interactions

This comprehensive data sources guide ensures reliable, high-quality data integration for the BRETT Earthquake Prediction System while maintaining optimal performance and security standards.
