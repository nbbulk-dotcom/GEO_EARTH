# Contributing to BRETT Earthquake Prediction System

Thank you for your interest in contributing to the BRETT Earthquake Prediction System! This document provides guidelines and information for contributors.

## Code of Conduct

### Our Pledge

We are committed to making participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

### Enforcement

Project maintainers are responsible for clarifying the standards of acceptable behavior and are expected to take appropriate and fair corrective action in response to any instances of unacceptable behavior.

## How to Contribute

### Reporting Issues

Before creating an issue, please:

1. **Search existing issues** to avoid duplicates
2. **Use the issue templates** provided
3. **Provide detailed information** including:
   - System information (OS, Python version, Node.js version)
   - Steps to reproduce the issue
   - Expected vs actual behavior
   - Error messages and logs
   - Screenshots if applicable

### Suggesting Enhancements

Enhancement suggestions are welcome! Please:

1. **Check existing feature requests** to avoid duplicates
2. **Use the feature request template**
3. **Provide detailed rationale** for the enhancement
4. **Consider the scope** and impact on existing functionality
5. **Include mockups or examples** if applicable

### Development Process

#### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/GEO_EARTH.git
cd GEO_EARTH

# Add upstream remote
git remote add upstream https://github.com/nbbulk-dotcom/GEO_EARTH.git
```

#### 2. Set Up Development Environment

**Backend Setup:**
```bash
cd backend
pip install poetry
poetry install
poetry shell
```

**Frontend Setup:**
```bash
cd frontend
npm install
```

**Environment Configuration:**
```bash
# Copy example environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit .env files with your configuration
```

#### 3. Create a Feature Branch

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name
```

#### 4. Development Guidelines

**Code Style:**

*Backend (Python):*
- Follow PEP 8 style guidelines
- Use Black for code formatting
- Use type hints for all functions
- Write docstrings for all public functions and classes
- Maximum line length: 88 characters

*Frontend (TypeScript/React):*
- Follow ESLint configuration
- Use Prettier for code formatting
- Use TypeScript strict mode
- Write JSDoc comments for complex functions
- Use functional components with hooks

**Commit Messages:**
Follow the Conventional Commits specification:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(prediction): add BRETTCOMBO engine support
fix(api): resolve data source timeout issues
docs(readme): update installation instructions
```

#### 5. Testing

**Backend Testing:**
```bash
cd backend
poetry run pytest tests/ -v --cov=app
poetry run black --check app
poetry run flake8 app
poetry run mypy app
```

**Frontend Testing:**
```bash
cd frontend
npm run test
npm run lint
npm run type-check
npm run build
```

#### 6. Pull Request Process

1. **Ensure all tests pass** and code follows style guidelines
2. **Update documentation** if necessary
3. **Add or update tests** for new functionality
4. **Rebase your branch** on the latest main branch
5. **Create a pull request** with:
   - Clear title and description
   - Reference to related issues
   - Screenshots for UI changes
   - Testing instructions

**Pull Request Template:**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Manual testing completed

## Screenshots (if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## Development Standards

### Backend Development

#### API Design
- Use RESTful principles
- Implement proper HTTP status codes
- Include comprehensive error handling
- Use Pydantic models for request/response validation
- Document all endpoints with OpenAPI/Swagger

#### Database Guidelines
- Use async database operations
- Implement proper connection pooling
- Use database migrations for schema changes
- Follow database naming conventions

#### Error Handling
```python
from fastapi import HTTPException
from app.core.exceptions import PredictionError

@app.post("/api/prediction")
async def create_prediction(data: PredictionRequest):
    try:
        result = await prediction_service.calculate(data)
        return result
    except PredictionError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
```

#### Logging
```python
import logging

logger = logging.getLogger(__name__)

def process_data(data):
    logger.info(f"Processing data for location: {data.location}")
    try:
        result = complex_calculation(data)
        logger.debug(f"Calculation result: {result}")
        return result
    except Exception as e:
        logger.error(f"Calculation failed: {e}", exc_info=True)
        raise
```

### Frontend Development

#### Component Structure
```typescript
// Use functional components with TypeScript
interface PredictionDisplayProps {
  predictions: PredictionResult[];
  loading: boolean;
  onRefresh: () => void;
}

export const PredictionDisplay: React.FC<PredictionDisplayProps> = ({
  predictions,
  loading,
  onRefresh
}) => {
  // Component implementation
};
```

#### State Management
```typescript
// Use React Context for global state
interface AppContextType {
  user: User | null;
  predictions: PredictionResult[];
  loading: boolean;
  error: string | null;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
```

#### Error Boundaries
```typescript
class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

### Testing Guidelines

#### Backend Testing
```python
import pytest
from fastapi.testclient import TestClient
from app.main_earthquake import app

client = TestClient(app)

def test_prediction_endpoint():
    response = client.post(
        "/api/prediction/brettearth",
        json={
            "latitude": 48.8566,
            "longitude": 2.3522,
            "radius": 200
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "predictions" in data
    assert len(data["predictions"]) == 21
```

#### Frontend Testing
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { PredictionDisplay } from './PredictionDisplay';

test('displays prediction results', () => {
  const mockPredictions = [
    { day: 1, magnitude: 4.2, confidence: 0.85 }
  ];

  render(
    <PredictionDisplay 
      predictions={mockPredictions} 
      loading={false} 
      onRefresh={() => {}} 
    />
  );

  expect(screen.getByText('MAG 4.2')).toBeInTheDocument();
  expect(screen.getByText('85%')).toBeInTheDocument();
});
```

## Documentation Standards

### Code Documentation
- Use clear, descriptive variable and function names
- Write comprehensive docstrings/JSDoc comments
- Include examples in documentation
- Document complex algorithms and business logic

### API Documentation
- Use OpenAPI/Swagger for backend APIs
- Include request/response examples
- Document error responses
- Provide usage examples

### User Documentation
- Write clear, step-by-step instructions
- Include screenshots for UI features
- Provide troubleshooting guides
- Keep documentation up-to-date with code changes

## Security Guidelines

### General Security
- Never commit secrets or API keys
- Use environment variables for configuration
- Implement proper input validation
- Follow OWASP security guidelines

### Backend Security
- Use HTTPS in production
- Implement rate limiting
- Validate all inputs with Pydantic
- Use secure session management

### Frontend Security
- Sanitize user inputs
- Use HTTPS for all API calls
- Implement proper error handling
- Avoid exposing sensitive information

## Performance Guidelines

### Backend Performance
- Use async/await for I/O operations
- Implement proper caching strategies
- Optimize database queries
- Monitor memory usage

### Frontend Performance
- Use React.memo for expensive components
- Implement code splitting
- Optimize bundle size
- Use efficient state management

## Release Process

### Version Numbering
We follow Semantic Versioning (SemVer):
- MAJOR.MINOR.PATCH
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes (backward compatible)

### Release Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Version numbers updated
- [ ] Changelog updated
- [ ] Security review completed
- [ ] Performance testing completed

## Getting Help

### Community Support
- **GitHub Discussions**: For questions and general discussion
- **GitHub Issues**: For bug reports and feature requests
- **Documentation**: Check the docs/ directory for detailed guides

### Maintainer Contact
For urgent issues or security concerns, contact the maintainers directly through GitHub.

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes for significant contributions
- GitHub contributor statistics

Thank you for contributing to the BRETT Earthquake Prediction System! Your contributions help advance earthquake prediction science and potentially save lives.
