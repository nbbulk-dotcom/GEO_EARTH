# BRETT Earthquake Prediction System v4.0

A comprehensive earthquake prediction platform using the 12-Dimensional GAL-CRM Framework with real-time data integration from multiple sources.

## System Overview

The BRETT (Geological and Electromagnetic Earthquake Prediction) System v4.0 provides:

- **12-Dimensional GAL-CRM Framework** for earthquake prediction
- **Real-time data integration** from USGS, EMSC, NASA, NOAA, GFZ
- **Dual prediction engines**: BRETTEARTH and BRETTSPACE
- **3D Cymatic visualization** using Three.js
- **Comprehensive UI** with step-by-step workflow

## Quick Start

### Prerequisites

- Python 3.12+
- Node.js 18+
- Poetry (for Python dependency management)

### Backend Setup

```bash
cd backend
pip install poetry
poetry install
cp .env.example .env
poetry run uvicorn app.main_earthquake:app --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The frontend will be available at `http://localhost:5173` and will connect to the backend at `http://localhost:8000`.

## System Architecture

### Backend (FastAPI)
- **Core Engines**: BRETT Core Engine v4.0 and Earthquake Space Engine
- **Data Sources**: Real-time integration with seismic and electromagnetic data
- **APIs**: Prediction, location, and data source management endpoints

### Frontend (React + TypeScript)
- **UI Framework**: React with TypeScript, Tailwind CSS, Radix UI
- **Visualization**: Three.js for 3D cymatic wave field visualization
- **State Management**: Context-based state management for auth and data

## Features

- **Location Input**: Precise geolocation input with validation
- **Data Source Management**: Real-time monitoring of multiple data sources
- **Engine Selection**: Choose between BRETTEARTH or BRETTCOMBO engines
- **Prediction Results**: 21-day earthquake predictions with risk analysis
- **3D Visualization**: Interactive cymatic wave field visualization

## Documentation

- [Setup Guide](./SETUP.md) - Detailed setup and deployment instructions
- [API Documentation](./API.md) - Complete API endpoint documentation

## System Isolation

This system is specifically designed for earthquake prediction and is completely isolated from volcanic prediction systems. It uses only real data sources and does not include simulations or simplified calculations.

## License

MIT License - See LICENSE file for details.

## Support

For technical support, refer to the BRETT documentation or contact system administrators.
