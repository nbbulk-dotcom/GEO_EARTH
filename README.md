# BRETT Earthquake Prediction System v4.0
*A 12-Dimensional GAL-CRM Framework for Real-Time Earthquake Risk Forecasting*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.12+](https://img.shields.io/badge/python-3.12+-blue.svg)](https://www.python.org/downloads/)
[![React 18](https://img.shields.io/badge/react-18+-61dafb.svg)](https://reactjs.org/)

GEO_EARTH hosts the BRETT Earthquake Prediction System v4.0, a cutting-edge platform leveraging electromagnetic field (EMF) analysis within a 12-Dimensional GAL-CRM Framework to deliver precise 21-day earthquake risk forecasts. Unlike simulation-based tools, it integrates real-time data from USGS, NASA, NOAA, and more, offering interactive 3D visualizations and dual prediction engines for Earth and space-based analysis.

## Key Features

🌍 **Real-Time EMF Analysis** - Advanced electromagnetic field monitoring for earthquake prediction  
📊 **21-Day Risk Forecasting** - Precise magnitude and confidence predictions with color-coded risk levels  
🔬 **Dual Prediction Engines** - BRETTEARTH (terrestrial) and BRETTCOMBO (space + earth) analysis  
🌊 **3D Cymatic Visualization** - Interactive electromagnetic resonance pattern rendering  
📡 **Multi-Source Data Integration** - USGS, EMSC, NASA, NOAA, GFZ real-time feeds  
🎯 **Location-Based Analysis** - Coordinate or city-based earthquake risk assessment  

### Target Audience

- **Seismologists & Researchers** - Advanced earthquake prediction research
- **Emergency Planners** - Risk assessment for disaster preparedness  
- **Scientific Institutions** - Real-time geophysical monitoring
- **Educational Organizations** - Earthquake science visualization

## Quick Start

### Prerequisites

- Python 3.12+
- Node.js 18+
- Poetry (for Python dependency management)

### Installation

1. **Clone Repository**
   ```bash
   git clone https://github.com/nbbulk-dotcom/GEO_EARTH.git
   cd GEO_EARTH
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install poetry
   poetry install
   cp .env.example .env
   poetry run uvicorn app.main_earthquake:app --host 0.0.0.0 --port 8000
   ```

3. **Frontend Setup** *(new terminal)*
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
   ```

4. **Access Application**
   - Frontend: `http://localhost:5173`
   - API Docs: `http://localhost:8000/docs`

### Data Source Setup

The system integrates multiple real-time data sources. For enhanced functionality, configure API keys:

- **USGS Earthquake API** - Real-time seismic data
- **EMSC European-Mediterranean** - Regional earthquake monitoring  
- **NASA Space Weather** - Solar activity and magnetic field data
- **NOAA Space Weather Prediction Center** - Geomagnetic indices
- **GFZ Potsdam** - Global geophysical data

Create `.env` files in both `backend/` and `frontend/` directories using the provided `.env.example` templates.

## System Architecture

### 12-Dimensional GAL-CRM Framework

The BRETT system operates on a sophisticated 12-dimensional analysis framework:

- **24 Earth Variables** - Terrestrial electromagnetic measurements
- **12 Space Variables** - Solar and cosmic electromagnetic data
- **Harmonic Amplification** - Regional resonance modifiers
- **CMYK Tetrahedral Analysis** - 54.74° base angle calculations
- **Planetary Incidence** - 26.565° space ray refraction

### Prediction Engines

**BRETTEARTH Engine**
- Terrestrial-focused earthquake prediction
- 24-variable earth electromagnetic analysis
- Regional geological factor integration

**BRETTCOMBO Engine**  
- Combined space + earth analysis
- 36-variable comprehensive modeling
- Enhanced accuracy through cosmic correlation

### Technology Stack

**Backend**
- **FastAPI** - High-performance Python web framework
- **Poetry** - Dependency management and packaging
- **Pydantic** - Data validation and settings management
- **Asyncio** - Asynchronous data source integration

**Frontend**  
- **React 18** - Modern component-based UI framework
- **TypeScript** - Type-safe JavaScript development
- **Three.js** - 3D visualization and WebGL rendering
- **Tailwind CSS** - Utility-first styling framework
- **Radix UI** - Accessible component primitives
- **Vite** - Fast build tooling and development server

## User Workflow

1. **Landing Page** - System overview and documentation access
2. **Location Input** - Coordinate or city-based targeting with radius selection
3. **Engine Selection** - Choose BRETTEARTH or BRETTCOMBO analysis
4. **Prediction Display** - 21-day risk grid with magnitude and confidence levels
5. **Cymatic Visualization** - 3D electromagnetic resonance patterns

## Project Structure

```
GEO_EARTH/
├── backend/                 # FastAPI Backend
│   ├── app/
│   │   ├── api/            # REST API endpoints
│   │   ├── core/           # BRETT prediction engines
│   │   ├── services/       # Data source integrations
│   │   └── models/         # Pydantic data models
│   └── pyproject.toml      # Poetry dependencies
├── frontend/               # React Frontend  
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # State management
│   │   └── types/          # TypeScript definitions
│   └── package.json        # npm dependencies
├── docs/                   # Documentation
└── sample_pages/           # UI reference designs
```

## API Documentation

When the backend is running, comprehensive API documentation is available:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

Key endpoints:
- `POST /api/prediction/brettearth` - Terrestrial earthquake prediction
- `POST /api/prediction/brettcombo` - Combined space+earth prediction  
- `GET /api/sources/status` - Data source health monitoring
- `POST /api/location/resolve` - Coordinate validation and geocoding

## Documentation

- [Installation Guide](./docs/installation.md) - Detailed setup and troubleshooting
- [Usage Guide](./docs/usage.md) - Step-by-step user workflow
- [Architecture Guide](./docs/architecture.md) - Technical system overview
- [Data Sources](./docs/data-sources.md) - API integrations and requirements
- [Setup Guide](./SETUP.md) - Quick deployment instructions
- [API Documentation](./API.md) - Complete endpoint reference

## System Isolation

This system is specifically designed for earthquake prediction and is completely isolated from volcanic prediction systems. It uses only real data sources and does not include simulations or simplified calculations.

## Contributing

We welcome contributions from the seismology and software development communities! Please see our [Contributing Guidelines](CONTRIBUTING.md) for:

- Code of conduct and community standards
- Development setup and testing procedures  
- Pull request and issue submission process
- Coding standards and documentation requirements

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for complete terms.

## Support & Community

- **Issues**: [GitHub Issues](https://github.com/nbbulk-dotcom/GEO_EARTH/issues)
- **Discussions**: [GitHub Discussions](https://github.com/nbbulk-dotcom/GEO_EARTH/discussions)
- **Documentation**: [Project Wiki](https://github.com/nbbulk-dotcom/GEO_EARTH/wiki)

## Acknowledgments

- USGS Earthquake Hazards Program for real-time seismic data
- NASA Space Weather services for solar activity monitoring
- NOAA Space Weather Prediction Center for geomagnetic data
- EMSC for European-Mediterranean earthquake monitoring
- Open source community for foundational technologies

---

*For detailed setup instructions, API documentation, and usage guides, visit our [Documentation](docs/) directory.*
