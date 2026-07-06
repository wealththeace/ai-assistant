#!/bin/bash

echo "🚀 Starting AI Personal Assistant Development Environment"

# Start infrastructure
echo "Starting Docker services..."
cd infra/docker
docker compose up -d

# Start backend
echo "Starting backend..."
cd ../../backend
if [ ! -d "venv" ]; then
    python -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt -q
uvicorn app.main:app --reload --port 8000 &

# Start web frontend
echo "Starting web frontend..."
cd ../frontend-web
npm install -q
npm run dev -- --port 3000 &

echo ""
echo "✅ All services started!"
echo "Backend: http://localhost:8000/docs"
echo "Web UI:  http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"