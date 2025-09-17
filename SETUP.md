# BRETT Earthquake System v4.0 - Setup Guide

## Overview

The BRETT (Geological and Electromagnetic Earthquake Prediction) System v4.0 is a comprehensive earthquake prediction platform that uses the 12-Dimensional GAL-CRM Framework with real-time data integration from multiple sources.

## System Requirements

### Backend Requirements
- Python 3.12 or higher
- Poetry (Python dependency management)
- Redis (for caching, optional)
- 4GB RAM minimum, 8GB recommended
- 10GB disk space

### Frontend Requirements
- Node.js 18 or higher
- npm or yarn package manager
- Modern web browser with WebGL support

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/nbbulk-dotcom/GEO_EARTH.git
cd GEO_EARTH
```

### 2. Backend Setup

```bash
cd backend

# Install Poetry if not already installed
curl -sSL https://install.python-poetry.org | python3 -

# Install dependencies
poetry install

# Copy environment configuration
cp .env.example .env

# Edit .env file with your API keys and configuration
nano .env
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

### 4. Environment Configuration

#### Backend Environment Variables

Edit `backend/.env` and configure:

- **API Keys**: Obtain API keys from:
  - USGS Earthquake Hazards Program
  - European-Mediterranean Seismological Centre (EMSC)
  - NASA Earth Data
  - NOAA Space Weather Prediction Center
  - GFZ German Research Centre for Geosciences

- **Database**: Configure SQLite or PostgreSQL connection
- **Security**: Set strong SECRET_KEY for JWT tokens
- **Caching**: Configure Redis URL if using Redis

#### Frontend Environment Variables

Edit `frontend/.env` and configure:

- **API_BASE_URL**: Backend API endpoint (default: http://localhost:8000)
- **Map Configuration**: Default map center and zoom level
- **Feature Flags**: Enable/disable specific features

## Running the System

### Development Mode

#### Start Backend
```bash
cd backend
poetry run uvicorn app.main_earthquake:app --host 0.0.0.0 --port 8000 --reload
```

#### Start Frontend
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Production Mode

#### Backend Production
```bash
cd backend
poetry run uvicorn app.main_earthquake:app --host 0.0.0.0 --port 8000 --workers 4
```

#### Frontend Production
```bash
cd frontend
npm run build
npm run preview
```

## Docker Deployment

### Using Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## System Verification

### 1. Health Check

Visit http://localhost:8000/health to verify backend is running.

### 2. API Documentation

Visit http://localhost:8000/docs to access interactive API documentation.

### 3. Frontend Access

Visit http://localhost:5173 to access the web interface.

### 4. Test Prediction

1. Enter a location (latitude, longitude)
2. Set monitoring radius
3. Select prediction engine (BRETTEARTH or BRETTCOMBO)
4. Run prediction and verify results

## Data Sources

The system integrates with multiple real-time data sources:

- **USGS**: Real-time earthquake data
- **EMSC**: European seismic monitoring
- **NASA**: Electromagnetic field data
- **NOAA**: Space weather data
- **GFZ**: Global seismic networks

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure all dependencies are installed
2. **API Key Errors**: Verify API keys are valid and properly configured
3. **Port Conflicts**: Change ports in configuration if 8000/5173 are in use
4. **Memory Issues**: Increase system memory or reduce monitoring radius

### Logs

- Backend logs: Check console output or configured log file
- Frontend logs: Check browser developer console
- System logs: Check Docker logs if using containers

## Performance Optimization

### Backend Optimization
- Enable Redis caching
- Increase worker processes for production
- Configure database connection pooling
- Optimize API rate limits

### Frontend Optimization
- Enable production build optimizations
- Configure CDN for static assets
- Enable browser caching
- Optimize 3D visualization settings

## Security Considerations

- Use strong SECRET_KEY for JWT tokens
- Implement rate limiting for API endpoints
- Use HTTPS in production
- Regularly update dependencies
- Secure API keys and credentials

## Support

For technical support:
1. Check the troubleshooting section
2. Review system logs
3. Consult API documentation
4. Contact system administrators

## License

MIT License - See LICENSE file for details.
