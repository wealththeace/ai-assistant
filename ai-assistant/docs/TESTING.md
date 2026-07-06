# Testing Strategy

## Layers

### 1. Unit Tests
- Services: `pytest`
- Frontend: Vitest + React Testing Library

### 2. Integration Tests
- API endpoints with `httpx`
- Database + vector DB interactions

### 3. E2E Tests
- Playwright for web
- Flutter integration tests for mobile

### 4. AI Evaluation
- Custom eval suite for:
  - Response quality
  - Hallucination rate
  - Memory accuracy
  - Vision accuracy

## Tools
- `pytest` + `pytest-asyncio`
- `vitest`
- Playwright
- Locust (load testing)

## Coverage Target
- Backend: >85%
- Frontend: >70%

## CI Pipeline
All tests run on every PR + nightly regression suite.