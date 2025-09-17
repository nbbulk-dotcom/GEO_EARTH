import httpx
import json
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import asyncio
from bs4 import BeautifulSoup

class DataSourcesService:
    def __init__(self):
        self.service_id = "DATA-SOURCES-SERVICE-V1"
        self.version = "1.0.0"

        self.data_sources = {
            'USGS': {
                'name': 'USGS Earthquake Hazards Program',
                'base_url': 'https://earthquake.usgs.gov/fdsnws/event/1/query',
                'status': 'unknown',
                'last_update': None,
                'reliability': 0.0
            },
            'EMSC': {
                'name': 'European-Mediterranean Seismological Centre',
                'base_url': 'https://www.seismicportal.eu/fdsnws/event/1/query',
                'status': 'unknown',
                'last_update': None,
                'reliability': 0.0
            },
            'NOAA': {
                'name': 'NOAA Space Weather Prediction Center',
                'base_url': 'https://services.swpc.noaa.gov/json',
                'status': 'unknown',
                'last_update': None,
                'reliability': 0.0
            },
            'GFZ': {
                'name': 'GFZ German Research Centre for Geosciences',
                'base_url': 'https://isgi.unistra.fr/data_download.php',
                'status': 'unknown',
                'last_update': None,
                'reliability': 0.0
            },
            'NASA': {
                'name': 'NASA Space Weather Database',
                'base_url': 'https://omniweb.gsfc.nasa.gov/cgi/nx1.cgi',
                'status': 'unknown',
                'last_update': None,
                'reliability': 0.0
            }
        }

        self.cached_data = {}
        self.last_update = None

        print(f"✅ {self.service_id} - Initialized Successfully")

    async def fetch_usgs_earthquake_data(self, latitude: float, longitude: float, radius_km: int = 100, days_back: int = 30) -> Dict:
        try:
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=days_back)

            params = {
                'format': 'geojson',
                'starttime': start_date.strftime('%Y-%m-%d'),
                'endtime': end_date.strftime('%Y-%m-%d'),
                'latitude': latitude,
                'longitude': longitude,
                'maxradiuskm': radius_km,
                'minmagnitude': 1.0,
                'orderby': 'time'
            }

            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(self.data_sources['USGS']['base_url'], params=params)
                response.raise_for_status()

                data = response.json()

                events = []
                for feature in data.get('features', []):
                    props = feature['properties']
                    coords = feature['geometry']['coordinates']

                    events.append({
                        'id': props.get('ids', '').split(',')[0] if props.get('ids') else 'unknown',
                        'magnitude': props.get('mag', 0.0),
                        'latitude': coords[1],
                        'longitude': coords[0],
                        'depth_km': coords[2] if len(coords) > 2 else 0.0,
                        'timestamp': datetime.fromtimestamp(props.get('time', 0) / 1000).isoformat(),
                        'location': props.get('place', 'Unknown location'),
                        'source': 'USGS'
                    })

                self.data_sources['USGS']['status'] = 'active'
                self.data_sources['USGS']['last_update'] = datetime.utcnow()
                self.data_sources['USGS']['reliability'] = 100.0

                return {
                    'success': True,
                    'source': 'USGS',
                    'events': events,
                    'total_events': len(events),
                    'query_params': params,
                    'fetch_timestamp': datetime.utcnow().isoformat()
                }

        except Exception as e:
            self.data_sources['USGS']['status'] = 'error'
            self.data_sources['USGS']['reliability'] = 0.0
            print(f"Error fetching USGS data: {str(e)}")
            return {
                'success': False,
                'source': 'USGS',
                'error': str(e),
                'events': [],
                'total_events': 0
            }

    async def fetch_emsc_earthquake_data(self, latitude: float, longitude: float, radius_km: int = 100, days_back: int = 30) -> Dict:
        try:
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=days_back)

            params = {
                'format': 'xml',
                'starttime': start_date.strftime('%Y-%m-%d'),
                'endtime': end_date.strftime('%Y-%m-%d'),
                'lat': latitude,
                'lon': longitude,
                'maxradius': radius_km / 111.0,
                'minmag': 1.0
            }

            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(self.data_sources['EMSC']['base_url'], params=params)
                response.raise_for_status()

                root = ET.fromstring(response.content)

                events = []
                for event in root.findall('.//{http://quakeml.org/xmlns/bed/1.2}event'):
                    origin = event.find('.//{http://quakeml.org/xmlns/bed/1.2}origin')
                    magnitude = event.find('.//{http://quakeml.org/xmlns/bed/1.2}magnitude')

                    if origin is not None and magnitude is not None:
                        lat_elem = origin.find('.//{http://quakeml.org/xmlns/bed/1.2}latitude')
                        lon_elem = origin.find('.//{http://quakeml.org/xmlns/bed/1.2}longitude')
                        depth_elem = origin.find('.//{http://quakeml.org/xmlns/bed/1.2}depth')
                        time_elem = origin.find('.//{http://quakeml.org/xmlns/bed/1.2}time')
                        mag_elem = magnitude.find('.//{http://quakeml.org/xmlns/bed/1.2}mag')

                        if all(elem is not None for elem in [lat_elem, lon_elem, time_elem, mag_elem]):
                            try:
                                mag_value_elem = mag_elem.find('.//{http://quakeml.org/xmlns/bed/1.2}value') if mag_elem is not None else None
                                lat_value_elem = lat_elem.find('.//{http://quakeml.org/xmlns/bed/1.2}value') if lat_elem is not None else None
                                lon_value_elem = lon_elem.find('.//{http://quakeml.org/xmlns/bed/1.2}value') if lon_elem is not None else None
                                time_value_elem = time_elem.find('.//{http://quakeml.org/xmlns/bed/1.2}value') if time_elem is not None else None

                                if all(elem is not None and elem.text for elem in [mag_value_elem, lat_value_elem, lon_value_elem, time_value_elem]):
                                    depth_km = 0.0
                                    if depth_elem is not None:
                                        depth_value_elem = depth_elem.find('.//{http://quakeml.org/xmlns/bed/1.2}value')
                                        if depth_value_elem is not None and depth_value_elem.text:
                                            depth_km = float(depth_value_elem.text) / 1000

                                    events.append({
                                        'id': event.get('publicID', 'unknown'),
                                        'magnitude': float(mag_value_elem.text) if mag_value_elem and mag_value_elem.text else 0.0,
                                        'latitude': float(lat_value_elem.text) if lat_value_elem and lat_value_elem.text else 0.0,
                                        'longitude': float(lon_value_elem.text) if lon_value_elem and lon_value_elem.text else 0.0,
                                        'depth_km': depth_km,
                                        'timestamp': time_value_elem.text if time_value_elem and time_value_elem.text else '',
                                        'location': 'EMSC Region',
                                        'source': 'EMSC'
                                    })
                            except (ValueError, TypeError, AttributeError) as e:
                                continue

                self.data_sources['EMSC']['status'] = 'active'
                self.data_sources['EMSC']['last_update'] = datetime.utcnow()
                self.data_sources['EMSC']['reliability'] = 95.0

                return {
                    'success': True,
                    'source': 'EMSC',
                    'events': events,
                    'total_events': len(events),
                    'query_params': params,
                    'fetch_timestamp': datetime.utcnow().isoformat()
                }

        except Exception as e:
            self.data_sources['EMSC']['status'] = 'error'
            self.data_sources['EMSC']['reliability'] = 0.0
            error_msg = f"EMSC API Error: {str(e)}"
            print(f"Error fetching EMSC data: {error_msg}")

            if "timeout" in str(e).lower():
                error_msg = "EMSC API timeout - service may be temporarily unavailable"
            elif "connection" in str(e).lower():
                error_msg = "EMSC API connection failed - check network connectivity"
            elif "ssl" in str(e).lower():
                error_msg = "EMSC API SSL/TLS connection error"
            elif "dns" in str(e).lower():
                error_msg = "EMSC API DNS resolution failed"

            return {
                'success': False,
                'source': 'EMSC',
                'error': error_msg,
                'events': [],
                'total_events': 0
            }

    async def fetch_noaa_space_weather_data(self) -> Dict:
        try:
            endpoints = {
                'solar_wind': '/solar-wind/solar-wind-speed-7-day.json',
                'geomagnetic': '/geomagnetic/kp-index-7-day.json',
                'solar_flux': '/solar-cycle/solar-cycle-sunspot-number-7-day.json'
            }

            data = {}
            successful_endpoints = 0

            async with httpx.AsyncClient(timeout=30.0) as client:
                for data_type, endpoint in endpoints.items():
                    try:
                        response = await client.get(f"{self.data_sources['NOAA']['base_url']}{endpoint}")
                        response.raise_for_status()
                        endpoint_data = response.json()
                        if endpoint_data:  # Only count non-empty data
                            data[data_type] = endpoint_data
                            successful_endpoints += 1
                    except Exception as e:
                        print(f"Error fetching NOAA {data_type} data: {str(e)}")
                        data[data_type] = []

            reliability = (successful_endpoints / len(endpoints)) * 90.0

            self.data_sources['NOAA']['status'] = 'active' if successful_endpoints > 0 else 'error'
            self.data_sources['NOAA']['last_update'] = datetime.utcnow()
            self.data_sources['NOAA']['reliability'] = reliability

            result = {
                'success': successful_endpoints > 0,
                'source': 'NOAA',
                'data': data,
                'successful_endpoints': successful_endpoints,
                'total_endpoints': len(endpoints),
                'fetch_timestamp': datetime.utcnow().isoformat()
            }

            return self.check_quality(result)

        except Exception as e:
            error_msg = str(e)
            self.data_sources['NOAA']['status'] = 'error'
            self.data_sources['NOAA']['reliability'] = 0.0

            if "404" in error_msg:
                error_msg = "NOAA API endpoints not found - service may be down"
            elif "timeout" in error_msg.lower():
                error_msg = "NOAA API timeout - service may be temporarily unavailable"
            elif "connection" in error_msg.lower():
                error_msg = "NOAA API connection failed - check network connectivity"

            print(f"Error fetching NOAA data: {error_msg}")
            return {
                'success': False,
                'source': 'NOAA',
                'error': error_msg,
                'data': {},
                'confidence': 'none'
            }

    async def fetch_gfz_geomagnetic_data(self) -> Dict:
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(f"{self.data_sources['GFZ']['base_url']}")
                response.raise_for_status()

                soup = BeautifulSoup(response.content, 'html.parser')

                data = {
                    'kp_index': [],
                    'dst_index': [],
                    'ap_index': []
                }

                tables = soup.find_all('table')
                for table in tables:
                    rows = table.find_all('tr')
                    for row in rows[1:]:
                        cells = row.find_all('td')
                        if len(cells) >= 3:
                            try:
                                date_str = cells[0].get_text(strip=True)
                                kp_value = float(cells[1].get_text(strip=True))
                                dst_value = float(cells[2].get_text(strip=True)) if len(cells) > 2 else 0.0

                                data['kp_index'].append({
                                    'date': date_str,
                                    'value': kp_value
                                })
                                data['dst_index'].append({
                                    'date': date_str,
                                    'value': dst_value
                                })
                            except (ValueError, IndexError):
                                continue

                self.data_sources['GFZ']['status'] = 'active'
                self.data_sources['GFZ']['last_update'] = datetime.utcnow()
                self.data_sources['GFZ']['reliability'] = 85.0

                return {
                    'success': True,
                    'source': 'GFZ',
                    'data': data,
                    'fetch_timestamp': datetime.utcnow().isoformat()
                }

        except Exception as e:
            self.data_sources['GFZ']['status'] = 'error'
            self.data_sources['GFZ']['reliability'] = 0.0
            print(f"Error fetching GFZ data: {str(e)}")
            return {
                'success': False,
                'source': 'GFZ',
                'error': str(e),
                'data': {}
            }

    def check_quality(self, data: Dict) -> Dict:
        """Check data quality based on age and assign confidence level"""
        try:
            fetch_timestamp = data.get('fetch_timestamp')
            if fetch_timestamp:
                fetch_time = datetime.fromisoformat(fetch_timestamp.replace('Z', '+00:00'))
                age_hours = (datetime.utcnow() - fetch_time).total_seconds() / 3600

                if age_hours > 24:
                    data['confidence'] = 'low'
                    data['age_hours'] = age_hours
                else:
                    data['confidence'] = 'high'
                    data['age_hours'] = age_hours
            else:
                data['confidence'] = 'unknown'
                data['age_hours'] = 0

        except Exception as e:
            print(f"Error checking data quality: {str(e)}")
            data['confidence'] = 'unknown'
            data['age_hours'] = 0

        return data

    async def fetch_nasa_space_weather_data(self) -> Dict:
        try:
            params = {
                'activity': 'retrieve',
                'res': 'hour',
                'spacecraft': 'omni2',
                'start_date': (datetime.utcnow() - timedelta(days=7)).strftime('%Y%m%d'),
                'end_date': datetime.utcnow().strftime('%Y%m%d'),
                'vars': '1,2,3,4,5,6,7,8,9,10'
            }

            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(self.data_sources['NASA']['base_url'], params=params)
                response.raise_for_status()

                response_text = response.text.strip()

                if "NO SPACECRAFT SELECTED" in response_text.upper():
                    print("NASA Error: NO SPACECRAFT SELECTED - trying alternative spacecraft")
                    params['spacecraft'] = 'wind'
                    response = await client.get(self.data_sources['NASA']['base_url'], params=params)
                    response.raise_for_status()
                    response_text = response.text.strip()

                    if "NO SPACECRAFT SELECTED" in response_text.upper():
                        raise Exception("NASA: NO SPACECRAFT SELECTED for both omni2 and wind")

                lines = response_text.split('\n')
                data = []

                for line in lines:
                    if line.strip() and not line.startswith('#'):
                        parts = line.split()
                        if len(parts) >= 10:
                            try:
                                data.append({
                                    'year': int(parts[0]),
                                    'day': int(parts[1]),
                                    'hour': int(parts[2]),
                                    'proton_density': float(parts[3]) if parts[3] != '999.9' else None,
                                    'bulk_speed': float(parts[4]) if parts[4] != '9999.0' else None,
                                    'flow_pressure': float(parts[5]) if parts[5] != '99.99' else None,
                                    'imf_magnitude': float(parts[6]) if parts[6] != '999.9' else None,
                                    'bx_gsm': float(parts[7]) if parts[7] != '999.9' else None,
                                    'by_gsm': float(parts[8]) if parts[8] != '999.9' else None,
                                    'bz_gsm': float(parts[9]) if parts[9] != '999.9' else None
                                })
                            except (ValueError, IndexError):
                                continue

                self.data_sources['NASA']['status'] = 'active'
                self.data_sources['NASA']['last_update'] = datetime.utcnow()
                self.data_sources['NASA']['reliability'] = 88.0

                result = {
                    'success': True,
                    'source': 'NASA',
                    'data': data,
                    'fetch_timestamp': datetime.utcnow().isoformat()
                }

                return self.check_quality(result)

        except Exception as e:
            error_msg = str(e)
            self.data_sources['NASA']['status'] = 'error'
            self.data_sources['NASA']['reliability'] = 0.0

            if "NO SPACECRAFT SELECTED" in error_msg.upper():
                error_msg = "NASA: NO SPACECRAFT SELECTED - spacecraft data unavailable"
                print(f"NASA spacecraft selection error: {error_msg}")
            elif "timeout" in error_msg.lower():
                error_msg = "NASA API timeout - service may be temporarily unavailable"
            elif "connection" in error_msg.lower():
                error_msg = "NASA API connection failed - check network connectivity"

            print(f"Error fetching NASA data: {error_msg}")
            return {
                'success': False,
                'source': 'NASA',
                'error': error_msg,
                'data': [],
                'confidence': 'none'
            }

    async def update_all_sources(self, latitude: float, longitude: float, radius_km: int = 100) -> Dict:
        try:
            start_time = datetime.utcnow()

            tasks = [
                self.fetch_usgs_earthquake_data(latitude, longitude, radius_km),
                self.fetch_emsc_earthquake_data(latitude, longitude, radius_km),
                self.fetch_space_weather_with_fallback(),  # Enhanced NASA→NOAA fallback
                self.fetch_gfz_geomagnetic_data()
            ]

            results = await asyncio.gather(*tasks, return_exceptions=True)

            data = {}
            errors = []
            quality_scores = {}

            source_names = ['USGS', 'EMSC', 'SPACE_WEATHER', 'GFZ']

            for i, result in enumerate(results):
                source_name = source_names[i]

                if isinstance(result, Exception):
                    errors.append(f"{source_name}: {str(result)}")
                    if source_name in ['USGS', 'EMSC', 'GFZ']:
                        self.data_sources[source_name]['status'] = 'error'
                        self.data_sources[source_name]['reliability'] = 0.0
                elif isinstance(result, dict) and result.get('success'):
                    data[source_name.lower()] = result

                    if source_name == 'SPACE_WEATHER':
                        quality_scores['space_weather'] = {
                            'quality_score': result.get('quality_score', 0.0),
                            'confidence': result.get('confidence', 'unknown'),
                            'primary_source': result.get('primary_source'),
                            'fallback_used': result.get('fallback_used', False)
                        }

                        primary_source = result.get('primary_source')
                        if primary_source == 'NASA':
                            self.data_sources['NASA']['status'] = 'active'
                            self.data_sources['NASA']['reliability'] = result.get('quality_score', 0.0) * 100
                        elif primary_source == 'NOAA':
                            self.data_sources['NOAA']['status'] = 'active'
                            self.data_sources['NOAA']['reliability'] = result.get('quality_score', 0.0) * 100

                elif isinstance(result, dict):
                    errors.append(f"{source_name}: {result.get('error', 'Unknown error')}")
                else:
                    errors.append(f"{source_name}: Unexpected result type")

            self.cached_data = data
            self.last_update = datetime.utcnow()

            processing_time = (datetime.utcnow() - start_time).total_seconds()

            return {
                'success': len(data) > 0,
                'data': data,
                'errors': errors,
                'quality_scores': quality_scores,
                'sources_updated': len(data),
                'total_sources': len(self.data_sources),
                'processing_time_seconds': processing_time,
                'update_timestamp': self.last_update.isoformat(),
                'next_update': (self.last_update + timedelta(minutes=20)).isoformat()
            }

        except Exception as e:
            print(f"Error updating data sources: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'data': {},
                'errors': [str(e)],
                'sources_updated': 0,
                'total_sources': len(self.data_sources)
            }

    def merge_sources(self, nasa: Dict, noaa: Dict, quality_threshold: float = 0.5) -> Optional[Dict]:
        """Merge NASA and NOAA sources with quality threshold as suggested by user"""

        if nasa.get('error') or not nasa.get('success'):
            if noaa.get('quality_score', 0.0) > quality_threshold:
                return noaa
            else:
                return None

        merged = {**nasa, **noaa}

        nasa_quality = nasa.get('quality_score', 0.0)
        noaa_quality = noaa.get('quality_score', 0.0)
        merged['score'] = (nasa_quality + noaa_quality) / 2

        return merged if merged['score'] > quality_threshold else None

    def merge_sources_legacy(self, nasa_result: Dict, noaa_result: Dict) -> Dict:
        """Legacy merge function for backward compatibility"""
        merged_data = {
            'success': False,
            'primary_source': None,
            'fallback_used': False,
            'data': {},
            'confidence': 'none',
            'quality_score': 0.0
        }

        try:
            if nasa_result.get('success') and nasa_result.get('confidence') == 'high':
                merged_data['success'] = True
                merged_data['primary_source'] = 'NASA'
                merged_data['data'] = nasa_result.get('data', [])
                merged_data['confidence'] = nasa_result.get('confidence', 'unknown')
                merged_data['quality_score'] = 0.9  # High quality NASA data

            elif noaa_result.get('success'):
                merged_data['success'] = True
                merged_data['primary_source'] = 'NOAA'
                merged_data['fallback_used'] = True
                merged_data['data'] = noaa_result.get('data', {})
                merged_data['confidence'] = noaa_result.get('confidence', 'unknown')

                successful_endpoints = noaa_result.get('successful_endpoints', 0)
                total_endpoints = noaa_result.get('total_endpoints', 1)
                endpoint_ratio = successful_endpoints / total_endpoints

                if noaa_result.get('confidence') == 'high':
                    merged_data['quality_score'] = 0.8 * endpoint_ratio  # High confidence NOAA
                else:
                    merged_data['quality_score'] = 0.6 * endpoint_ratio  # Low confidence NOAA

            elif nasa_result.get('success'):
                merged_data['success'] = True
                merged_data['primary_source'] = 'NASA'
                merged_data['fallback_used'] = False
                merged_data['data'] = nasa_result.get('data', [])
                merged_data['confidence'] = nasa_result.get('confidence', 'unknown')
                merged_data['quality_score'] = 0.4  # Low confidence NASA data

            else:
                merged_data['error'] = f"NASA: {nasa_result.get('error', 'Unknown error')}, NOAA: {noaa_result.get('error', 'Unknown error')}"
                merged_data['quality_score'] = 0.0

        except Exception as e:
            print(f"Error merging sources: {str(e)}")
            merged_data['error'] = f"Merge error: {str(e)}"

        return merged_data

    async def fetch_space_weather_with_fallback(self) -> Dict:
        """Fetch space weather data with NASA→NOAA fallback logic"""
        print("🌌 Fetching space weather data with NASA→NOAA fallback...")

        nasa_task = self.fetch_nasa_space_weather_data()
        noaa_task = self.fetch_noaa_space_weather_data()

        nasa_result, noaa_result = await asyncio.gather(nasa_task, noaa_task, return_exceptions=True)

        if isinstance(nasa_result, Exception):
            nasa_result = {'success': False, 'error': str(nasa_result), 'confidence': 'none'}
        if isinstance(noaa_result, Exception):
            noaa_result = {'success': False, 'error': str(noaa_result), 'confidence': 'none'}

        merged_result = self.merge_sources_legacy(nasa_result, noaa_result)

        if merged_result.get('fallback_used'):
            print(f"⚠️  NASA→NOAA fallback activated. Primary source: {merged_result.get('primary_source')}")
        else:
            print(f"✅ Primary source used: {merged_result.get('primary_source')}")

        print(f"📊 Data quality score: {merged_result.get('quality_score', 0.0):.2f}")
        print(f"🔍 Confidence level: {merged_result.get('confidence', 'unknown')}")

        return merged_result

    def get_data_sources_status(self) -> Dict:
        return {
            'sources': self.data_sources,
            'total_sources': len(self.data_sources),
            'active_sources': len([s for s in self.data_sources.values() if s['status'] == 'active']),
            'last_update': self.last_update.isoformat() if self.last_update else None,
            'service_id': self.service_id,
            'timestamp': datetime.utcnow().isoformat()
        }

    def get_cached_data(self) -> Dict:
        return {
            'cached_data': self.cached_data,
            'cache_age_minutes': (datetime.utcnow() - self.last_update).total_seconds() / 60 if self.last_update else None,
            'service_id': self.service_id,
            'timestamp': datetime.utcnow().isoformat()
        }
