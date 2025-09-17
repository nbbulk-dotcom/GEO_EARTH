# Usage Guide

## Getting Started

This guide walks you through using the BRETT Earthquake Prediction System v4.0 for earthquake risk analysis and visualization.

## User Workflow

### 1. Landing Page

When you first access the system at `http://localhost:5173`, you'll see the BRETT landing page with:

- **System Overview** - Introduction to the 12-Dimensional GAL-CRM Framework
- **Feature Cards** - Key capabilities and benefits
- **Enter System Button** - Access to the prediction interface
- **Documentation Links** - Additional resources and guides

**Action**: Click "Enter System" to begin earthquake analysis.

### 2. Location Input

The location input page allows you to specify the area for earthquake prediction analysis.

#### Input Methods

**Coordinates Mode**
- **Latitude**: Enter decimal degrees (-90 to 90)
- **Longitude**: Enter decimal degrees (-180 to 180)
- **Example**: Paris, France = 48.8566, 2.3522

**City Mode**
- **City Name**: Enter city name
- **Country**: Select or enter country
- **Auto-detection**: System will resolve coordinates automatically

#### Configuration Options

**Monitoring Radius**
- **100km** - Local area analysis
- **200km** - Regional analysis (recommended)
- **500km** - Extended regional analysis
- **1000km** - Wide area analysis

**Controls**
- **Reset to Default** - Clear all inputs
- **Confirm Location** - Proceed to engine selection

### 3. Engine Selection

Choose between two prediction engines based on your analysis needs.

#### BRETTEARTH Engine
- **Focus**: Terrestrial electromagnetic analysis
- **Variables**: 24 earth-based measurements
- **Best For**: Local geological analysis
- **Processing Time**: ~30 seconds
- **Accuracy**: High for regional predictions

#### BRETTCOMBO Engine
- **Focus**: Combined space + earth analysis
- **Variables**: 36 total (24 earth + 12 space)
- **Best For**: Comprehensive global analysis
- **Processing Time**: ~60 seconds
- **Accuracy**: Highest overall precision

**Action**: Click "⚡ Activate [ENGINE]" to start prediction calculation.

### 4. Prediction Display

The prediction results show a comprehensive 21-day earthquake risk forecast.

#### Risk Grid Layout

**Week Structure**
- **Week 1**: Days 1-7 (September 17-23, 2025)
- **Week 2**: Days 8-14 (September 24-30, 2025)
- **Week 3**: Days 15-21 (October 1-7, 2025)

**Daily Information**
- **Day Number**: Sequential day in prediction window
- **Date**: Specific calendar date
- **Magnitude**: Predicted earthquake magnitude (MAG X.X format)
- **Confidence**: Prediction confidence (NN XX% format)

#### Color Coding

**Risk Levels**
- 🔵 **Blue**: Low risk (MAG < 4.0)
- 🟡 **Yellow**: Moderate risk (MAG 4.0-5.5)
- 🟠 **Orange**: High risk (MAG 5.5-7.0)
- 🔴 **Red**: Critical risk (MAG > 7.0)

**Confidence Levels**
- **Light**: Low confidence (< 60%)
- **Medium**: Moderate confidence (60-80%)
- **Dark**: High confidence (> 80%)

#### Summary Statistics

**Maximum Probability**
- Highest risk day in 21-day window
- Peak magnitude prediction
- Associated confidence level

**Average Probability**
- Mean risk across all 21 days
- Baseline activity level
- Trend indicators

**High-Risk Days**
- Count of days with MAG > 5.0
- Critical attention periods
- Emergency planning focus

### 5. Cymatic Visualization

The 3D visualization displays electromagnetic resonance patterns and wave field analysis.

#### Visualization Controls

**Day Selection**
- **Range**: Day 1 through Day 21
- **Navigation**: Click day buttons to switch views
- **Animation**: Real-time wave pattern updates

**Display Options**
- **Sound**: Enable/disable audio feedback
- **Wave Amplitude**: Adjust visualization intensity
- **Frequency Range**: Modify resonance display
- **Visualization Mode**: Switch between display types

#### Interpretation

**Wave Patterns**
- **Amplitude**: Indicates electromagnetic intensity
- **Frequency**: Shows resonance characteristics
- **Phase**: Displays wave synchronization
- **Overlap**: Highlights amplification zones

**Critical Indicators**
- **Red Zones**: High electromagnetic activity
- **Phase Lock**: Synchronized resonance patterns
- **Amplification**: Harmonic enhancement areas
- **Resonance Overlap**: Risk amplification zones

## Interpreting Results

### Risk Assessment

**Low Risk (Blue)**
- Normal background seismic activity
- Minimal earthquake probability
- Standard monitoring sufficient

**Moderate Risk (Yellow)**
- Elevated electromagnetic activity
- Possible minor earthquake activity
- Increased monitoring recommended

**High Risk (Orange)**
- Significant electromagnetic anomalies
- Probable earthquake activity
- Enhanced preparedness advised

**Critical Risk (Red)**
- Extreme electromagnetic disturbances
- High probability major earthquake
- Emergency preparedness essential

### Confidence Interpretation

**High Confidence (> 80%)**
- Strong electromagnetic signal correlation
- Reliable prediction accuracy
- Recommended for planning decisions

**Moderate Confidence (60-80%)**
- Good signal correlation
- Reasonable prediction reliability
- Useful for awareness and preparation

**Low Confidence (< 60%)**
- Weak signal correlation
- Limited prediction reliability
- Informational value only

## Best Practices

### Location Selection

1. **Urban Areas**: Use city mode for populated regions
2. **Remote Areas**: Use coordinate mode for precise targeting
3. **Radius Selection**: Choose 200km for balanced coverage
4. **Multiple Locations**: Run separate analyses for different regions

### Engine Selection

1. **Local Analysis**: Use BRETTEARTH for regional focus
2. **Global Context**: Use BRETTCOMBO for comprehensive analysis
3. **Comparison**: Run both engines for validation
4. **Time Sensitivity**: Use BRETTEARTH for faster results

### Result Analysis

1. **Trend Analysis**: Look for patterns across the 21-day window
2. **Peak Identification**: Focus on highest risk days
3. **Confidence Weighting**: Prioritize high-confidence predictions
4. **Cross-Validation**: Compare with historical seismic data

## Limitations and Considerations

### System Limitations

- **Prediction Window**: Limited to 21-day forecasts
- **Regional Accuracy**: Varies by geological characteristics
- **Data Dependency**: Requires real-time data source availability
- **Processing Time**: Complex calculations may take 1-2 minutes

### Interpretation Guidelines

- **Probabilistic Nature**: Predictions are probability-based, not deterministic
- **Regional Variations**: Accuracy varies by geological region
- **Complementary Tool**: Use alongside traditional seismic monitoring
- **Professional Consultation**: Consult seismologists for critical decisions

## Troubleshooting

### Common Issues

**Location Not Found**
- Verify city spelling and country
- Try coordinate input instead
- Check internet connectivity

**Engine Activation Fails**
- Wait for data sources to load
- Refresh page and retry
- Check backend server status

**Slow Loading**
- Large radius increases processing time
- Check network connection
- Verify server resources

**Visualization Issues**
- Update browser to latest version
- Enable WebGL in browser settings
- Check graphics card compatibility

## Advanced Features

### Export Options

**Data Export**
- CSV format for spreadsheet analysis
- JSON format for programmatic access
- PDF reports for documentation

**Visualization Export**
- Screenshot capture of 3D visualizations
- Animation recording (future feature)
- High-resolution image export

### API Integration

For programmatic access, use the REST API:

```bash
# Get prediction data
curl -X POST "http://localhost:8000/api/prediction/brettearth" \
  -H "Content-Type: application/json" \
  -d '{"latitude": 48.8566, "longitude": 2.3522, "radius": 200}'
```

See [API Documentation](../API.md) for complete endpoint reference.

## Next Steps

- Explore [Architecture Guide](./architecture.md) for technical details
- Review [Data Sources](./data-sources.md) for API configuration
- Check [Installation Guide](./installation.md) for setup optimization
- Join [GitHub Discussions](https://github.com/nbbulk-dotcom/GEO_EARTH/discussions) for community support
