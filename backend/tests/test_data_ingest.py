"""
Tests for volcanic data ingestion service
"""
import pytest
import asyncio
import json
from unittest.mock import AsyncMock, patch, Mock
from datetime import datetime

from app.services.data_ingest import VolcanicDataIngestor

class TestVolcanicDataIngestor:
    def test_ingestor_initialization(self):
        ingestor = VolcanicDataIngestor()
        
        assert ingestor.redis_client is not None
        assert ingestor.usgs_base_url is not None
        assert ingestor.gvp_base_url is not None
        assert ingestor.noaa_base_url is not None
        
    @pytest.mark.asyncio
    async def test_usgs_data_fetch_success(self):
        ingestor = VolcanicDataIngestor()
        
        with patch('aiohttp.ClientSession.get') as mock_get:
            mock_response = AsyncMock()
            mock_response.status = 200
            mock_response.json = AsyncMock(return_value={'seismic': 'test_data'})
            mock_get.return_value.__aenter__.return_value = mock_response
            
            data = await ingestor.fetch_usgs_data('kilauea')
            assert 'seismic' in data
            assert data['seismic'] == 'test_data'
            
    @pytest.mark.asyncio
    async def test_usgs_data_fetch_failure(self):
        ingestor = VolcanicDataIngestor()
        
        with patch('aiohttp.ClientSession.get', side_effect=Exception("Network error")):
            data = await ingestor.fetch_usgs_data('kilauea')
            assert isinstance(data, dict)
            
    @pytest.mark.asyncio
    async def test_gvp_reports_fetch_xml(self):
        ingestor = VolcanicDataIngestor()
        
        xml_content = '<reports><report><volcano>Test Volcano</volcano><activity>Eruption</activity><date>2025-09-18</date></report></reports>'
        
        with patch('aiohttp.ClientSession.get') as mock_get:
            mock_response = AsyncMock()
            mock_response.status = 200
            mock_response.text = AsyncMock(return_value=xml_content)
            mock_get.return_value.__aenter__.return_value = mock_response
            
            reports = await ingestor.fetch_gvp_reports()
            assert isinstance(reports, list)
            if reports:  # If parsing succeeded
                assert 'volcano' in reports[0]
                
    @pytest.mark.asyncio
    async def test_gvp_reports_fetch_json(self):
        ingestor = VolcanicDataIngestor()
        
        json_data = {
            'events': [
                {
                    'volcano_name': 'Test Volcano',
                    'activity_type': 'Eruption',
                    'event_date': '2025-09-18',
                    'vei': 3
                }
            ]
        }
        
        with patch('aiohttp.ClientSession.get') as mock_get:
            mock_response = AsyncMock()
            mock_response.status = 200
            mock_response.json = AsyncMock(return_value=json_data)
            mock_get.return_value.__aenter__.return_value = mock_response
            
            reports = await ingestor.fetch_gvp_reports()
            assert isinstance(reports, list)
            
    def test_parse_gvp_xml(self):
        ingestor = VolcanicDataIngestor()
        
        xml_content = '''
        <reports>
            <report>
                <volcano>Kilauea</volcano>
                <activity>Ongoing eruption</activity>
                <date>2025-09-18</date>
            </report>
        </reports>
        '''
        
        reports = ingestor._parse_gvp_xml(xml_content)
        assert len(reports) == 1
        assert reports[0]['volcano'] == 'Kilauea'
        assert reports[0]['activity'] == 'Ongoing eruption'
        assert reports[0]['source'] == 'GVP_XML'
        
    def test_parse_gvp_json(self):
        ingestor = VolcanicDataIngestor()
        
        json_data = {
            'events': [
                {
                    'volcano_name': 'Vesuvius',
                    'activity_type': 'Unrest',
                    'event_date': '2025-09-18',
                    'vei': 2
                }
            ]
        }
        
        reports = ingestor._parse_gvp_json(json_data)
        assert len(reports) == 1
        assert reports[0]['volcano'] == 'Vesuvius'
        assert reports[0]['activity'] == 'Unrest'
        assert reports[0]['magnitude'] == 2
        assert reports[0]['source'] == 'GVP_JSON'
        
    @pytest.mark.asyncio
    async def test_noaa_data_fetch(self):
        ingestor = VolcanicDataIngestor()
        
        with patch('aiohttp.ClientSession.get') as mock_get:
            mock_response = AsyncMock()
            mock_response.status = 200
            mock_response.text = AsyncMock(return_value='<html>temperature pressure</html>')
            mock_get.return_value.__aenter__.return_value = mock_response
            
            data = await ingestor.fetch_noaa_data()
            assert isinstance(data, dict)
            assert 'atmospheric_data' in data
            
    def test_parse_noaa_content(self):
        ingestor = VolcanicDataIngestor()
        
        content = 'This content contains temperature and pressure data'
        data = ingestor._parse_noaa_content(content)
        
        assert 'atmospheric_data' in data
        assert 'thermal_anomalies' in data
        assert 'timestamp' in data
        assert len(data['atmospheric_data']) >= 2  # temperature and pressure
        
    @pytest.mark.asyncio
    async def test_concurrent_data_ingestion(self):
        ingestor = VolcanicDataIngestor()
        
        with patch.object(ingestor, 'fetch_usgs_data', return_value={'usgs': 'data'}), \
             patch.object(ingestor, 'fetch_gvp_reports', return_value=[{'gvp': 'data'}]), \
             patch.object(ingestor, 'fetch_noaa_data', return_value={'noaa': 'data'}):
            
            result = await ingestor.ingest_all_sources('kilauea')
            assert 'usgs' in result
            assert 'gvp' in result
            assert 'noaa' in result
            assert result['status'] == 'success'
            assert result['volcano_id'] == 'kilauea'
            
    @pytest.mark.asyncio
    async def test_ingestion_with_exceptions(self):
        ingestor = VolcanicDataIngestor()
        
        with patch.object(ingestor, 'fetch_usgs_data', side_effect=Exception("USGS error")), \
             patch.object(ingestor, 'fetch_gvp_reports', return_value=[{'gvp': 'data'}]), \
             patch.object(ingestor, 'fetch_noaa_data', return_value={'noaa': 'data'}):
            
            result = await ingestor.ingest_all_sources('kilauea')
            assert 'gvp' in result
            assert 'noaa' in result
            assert result['volcano_id'] == 'kilauea'
            
    def test_get_cached_data(self):
        ingestor = VolcanicDataIngestor()
        
        cached = ingestor._get_cached_data('nonexistent_key')
        assert cached == {}
        
    def test_get_cached_gvp_data(self):
        ingestor = VolcanicDataIngestor()
        
        cached = ingestor._get_cached_gvp_data()
        assert isinstance(cached, list)
        assert len(cached) > 0
        assert cached[0]['source'] == 'FALLBACK'
        
    @pytest.mark.asyncio
    async def test_retry_logic(self):
        ingestor = VolcanicDataIngestor()
        
        call_count = 0
        
        async def mock_get(*args, **kwargs):
            nonlocal call_count
            call_count += 1
            if call_count < 3:
                raise Exception("Network error")
            mock_response = AsyncMock()
            mock_response.status = 200
            mock_response.json = AsyncMock(return_value={'success': True})
            return mock_response
            
        with patch('aiohttp.ClientSession.get', side_effect=mock_get):
            data = await ingestor.fetch_usgs_data('kilauea')
            assert call_count == 3  # Should retry 3 times
            assert 'success' in data
            
    @pytest.mark.asyncio
    async def test_timeout_handling(self):
        ingestor = VolcanicDataIngestor()
        
        with patch('aiohttp.ClientSession.get', side_effect=asyncio.TimeoutError("Timeout")):
            data = await ingestor.fetch_usgs_data('kilauea')
            assert isinstance(data, dict)

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
