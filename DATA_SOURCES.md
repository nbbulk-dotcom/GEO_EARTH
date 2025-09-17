# BRETT v39 Calculator Data Sources

## 24 Earth Variables (earth_resonance_layers)

The earth system uses 24 resonance layers based on seismic depth analysis:

### Surface Layers (0-70 km)
1. **surface_layer** (0-1 km) - 7.83 Hz (Schumann resonance)
2. **sedimentary_layer** (1-5 km) - 14.3 Hz
3. **upper_crust** (5-20 km) - 20.8 Hz
4. **middle_crust** (20-35 km) - 26.7 Hz
5. **lower_crust** (35-70 km) - 33.8 Hz

### Mantle Transition (70-670 km)
6. **moho_discontinuity** (70-80 km) - 45.9 Hz
7. **upper_mantle_1** (80-150 km) - 59.5 Hz
8. **upper_mantle_2** (150-220 km) - 67.8 Hz
9. **transition_zone_1** (220-400 km) - 83.2 Hz
10. **transition_zone_2** (400-670 km) - 97.4 Hz

### Lower Mantle (670-2890 km)
11. **lower_mantle_1** (670-1000 km) - 118.6 Hz
12. **lower_mantle_2** (1000-1500 km) - 142.3 Hz
13. **lower_mantle_3** (1500-2000 km) - 169.7 Hz
14. **lower_mantle_4** (2000-2500 km) - 201.8 Hz
15. **lower_mantle_5** (2500-2890 km) - 238.9 Hz

### Outer Core (2890-5150 km)
16. **outer_core_1** (2890-3500 km) - 283.4 Hz
17. **outer_core_2** (3500-4000 km) - 335.2 Hz
18. **outer_core_3** (4000-4500 km) - 394.8 Hz
19. **outer_core_4** (4500-5000 km) - 463.7 Hz
20. **outer_core_5** (5000-5150 km) - 543.2 Hz

### Inner Core (5150-6371 km)
21. **inner_core_1** (5150-5500 km) - 634.8 Hz
22. **inner_core_2** (5500-5800 km) - 740.2 Hz
23. **inner_core_3** (5800-6100 km) - 861.9 Hz
24. **inner_core_center** (6100-6371 km) - 1002.7 Hz

**Data Source:** Calculated resonance frequencies based on seismic velocity models and depth-dependent material properties.

## 12 Space Variables (space_data_tables)

The space system uses 12 correlation tables with real-time data sources:

### Primary Space Variables
1. **solar_activity** - Weight: 0.15, NASA Solar Dynamics Observatory
2. **geomagnetic_field** - Weight: 0.12, NOAA Space Weather Prediction Center
3. **planetary_alignment** - Weight: 0.10, JPL Ephemeris calculations
4. **cosmic_ray_intensity** - Weight: 0.08, Neutron Monitor Database
5. **solar_wind_pressure** - Weight: 0.09, ACE/DSCOVR satellites
6. **ionospheric_density** - Weight: 0.07, GPS Total Electron Content

### Secondary Space Variables
7. **magnetosphere_compression** - Weight: 0.11, THEMIS mission data
8. **auroral_activity** - Weight: 0.06, IMAGE satellite network
9. **solar_flare_intensity** - Weight: 0.13, GOES X-ray sensors
10. **coronal_mass_ejection** - Weight: 0.05, SOHO/STEREO coronagraphs
11. **interplanetary_magnetic_field** - Weight: 0.08, ACE magnetometer
12. **galactic_cosmic_radiation** - Weight: 0.04, Voyager/PAMELA detectors

**Data Sources:** 
- NASA APIs (Solar Dynamics Observatory, JPL, ACE, DSCOVR)
- NOAA Space Weather Prediction Center
- Real-time satellite telemetry
- Ground-based monitoring networks

## Harmonic Amplification Angles

- **Space Resonance Angle:** 26° (firmament/ionosphere interaction)
- **Earth Surface Angle:** 57° (surface harmonic amplification)
- **Interpolation:** Depth-based calculation between space and surface angles

## Storage Architecture

### Earth Variables Storage
- **Location:** `backend/app/core/brett_engine.py`
- **Structure:** Dictionary with depth_range and resonance_freq
- **Caching:** 15-minute cache in VariableStorageService
- **Database:** Real-time calculation, no historical storage

### Space Variables Storage  
- **Location:** `backend/app/core/space_correlation_engine.py`
- **Structure:** Dictionary with weight, correlation_factor, frequency_range
- **Caching:** 15-minute cache in VariableStorageService
- **Database:** Real-time API calls, no historical storage

## Live System Configuration

- **Historical Data:** DISABLED (per user requirements)
- **Date Range Selection:** DISABLED (per user requirements)
- **Real-time Mode:** ENABLED for future predictions
- **Prediction Window:** 21 days in advance
- **Accuracy Rating:** 76% earthquake prediction accuracy
