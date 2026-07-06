# Deployment Guide

## Local Development

```bash
# 1. Start services
cd infra/docker
docker compose up -d

# 2. Backend
cd ../../backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# 3. Web
cd ../frontend-web
npm install && npm run dev
```

## Production Deployment (Kubernetes)

### Prerequisites
- Kubernetes cluster (EKS / GKE / AKS)
- Helm 3
- kubectl configured

### Steps

1. **Build and push images**
```bash
docker build -t your-registry/ai-assistant-backend:latest ./backend
docker push your-registry/ai-assistant-backend:latest
```

2. **Apply Kubernetes manifests** (see `infra/k8s/`)

3. **Secrets**
```bash
kubectl create secret generic ai-secrets \
  --from-literal=OPENAI_API_KEY=... \
  --from-literal=ANTHROPIC_API_KEY=...
```

4. **Deploy**
```bash
kubectl apply -f infra/k8s/
```

## Environment Variables (Production)

Set these securely:
- All API keys
- `JWT_SECRET_KEY`
- Database connection strings
- Qdrant credentials

## Monitoring

- Prometheus + Grafana included in `infra/monitoring/`
- OpenTelemetry instrumentation ready in backend

## Scaling

The backend is stateless and horizontally scalable. Scale with:
```bash
kubectl scale deployment backend --replicas=5
```