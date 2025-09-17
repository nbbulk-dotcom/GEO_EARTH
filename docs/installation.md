# Installation Guide

## Prerequisites

### System Requirements
- **Operating System**: Linux, macOS, or Windows 10/11
- **Python**: 3.12 or higher
- **Node.js**: 18.0 or higher
- **Memory**: Minimum 4GB RAM (8GB recommended)
- **Storage**: 2GB free space

### Required Tools
- **Poetry** - Python dependency management
- **Git** - Version control
- **npm/pnpm** - Node.js package management

## Installation Steps

### 1. Clone Repository

```bash
git clone https://github.com/nbbulk-dotcom/GEO_EARTH.git
cd GEO_EARTH
```

### 2. Backend Setup

#### Install Poetry (if not already installed)
```bash
# Linux/macOS
curl -sSL https://install.python-poetry.org | python3 -

# Windows (PowerShell)
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | python -
```

#### Configure Backend
```bash
cd backend
poetry install
cp .env.example .env
```

#### Edit Environment Variables
Edit `backend/.env` and configure:
```env
# API Keys (optional but recommended)
USGS_API_KEY=your_usgs_key_here
NASA_API_KEY=your_nasa_key_here
NOAA_API_KEY=your_noaa_key_here

# Database (optional)
DATABASE_URL=sqlite:///./earthquake_data.db

# Security
SECRET_KEY=your_secret_key_here
```

#### Start Backend Server
```bash
poetry run uvicorn app.main_earthquake:app --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install
# or
pnpm install
```

#### Configure Frontend
```bash
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_TITLE=BRETT Earthquake System
```

#### Start Development Server
```bash
npm run dev
# or
pnpm dev
```

### 4. Verify Installation

1. **Backend Health Check**
   - Visit: `http://localhost:8000/docs`
   - Should display Swagger API documentation

2. **Frontend Access**
   - Visit: `http://localhost:5173`
   - Should display BRETT landing page

3. **API Connectivity**
   - Navigate through the UI workflow
   - Test location input and engine selection

## Troubleshooting

### Common Issues

#### Poetry Installation Fails
```bash
# Alternative installation method
pip install poetry
```

#### Port Already in Use
```bash
# Check what's using the port
lsof -i :8000
lsof -i :5173

# Kill processes if needed
kill -9 <PID>
```

#### Python Version Issues
```bash
# Check Python version
python --version

# Use pyenv to manage Python versions
pyenv install 3.12.0
pyenv local 3.12.0
```

#### Node.js Version Issues
```bash
# Check Node version
node --version

# Use nvm to manage Node versions
nvm install 18
nvm use 18
```

#### Missing Dependencies
```bash
# Backend
cd backend
poetry install --no-dev

# Frontend
cd frontend
npm ci
```

#### API Key Configuration
- USGS: Register at https://earthquake.usgs.gov/fdsnws/
- NASA: Apply at https://api.nasa.gov/
- NOAA: Access at https://www.ncdc.noaa.gov/cdo-web/webservices

### Performance Optimization

#### Backend
```bash
# Use production ASGI server
poetry add gunicorn
gunicorn app.main_earthquake:app -w 4 -k uvicorn.workers.UvicornWorker
```

#### Frontend
```bash
# Build for production
npm run build
npm run preview
```

### Docker Installation (Alternative)

```bash
# Build and run with Docker Compose
docker-compose up --build

# Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

## Development Environment

### IDE Setup

#### VS Code Extensions
- Python
- TypeScript and JavaScript
- Tailwind CSS IntelliSense
- GitLens

#### PyCharm Configuration
- Enable Poetry integration
- Configure Python interpreter to use Poetry environment

### Code Quality Tools

#### Backend
```bash
# Install development tools
poetry add --group dev black flake8 mypy pytest

# Format code
poetry run black .

# Lint code
poetry run flake8 .

# Type checking
poetry run mypy .
```

#### Frontend
```bash
# Install development tools
npm install --save-dev eslint prettier @typescript-eslint/parser

# Format code
npm run format

# Lint code
npm run lint
```

## Next Steps

After successful installation:

1. Read the [Usage Guide](./usage.md) for workflow instructions
2. Review [Architecture Guide](./architecture.md) for technical details
3. Check [Data Sources](./data-sources.md) for API configuration
4. Explore the [API Documentation](../API.md) for integration details

## Support

If you encounter issues not covered here:

1. Check [GitHub Issues](https://github.com/nbbulk-dotcom/GEO_EARTH/issues)
2. Search [GitHub Discussions](https://github.com/nbbulk-dotcom/GEO_EARTH/discussions)
3. Create a new issue with detailed error information
