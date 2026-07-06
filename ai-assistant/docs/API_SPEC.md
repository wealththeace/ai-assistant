# API Specification - AI Personal Assistant v1

Base URL: `https://api.ai-assistant.dev/v1`

All endpoints require `Authorization: Bearer <token>` unless specified.

## Authentication

### POST /auth/login
Request:
```json
{
  "email": "user@example.com",
  "password": "string"
}
```

Response:
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

### POST /auth/google, /auth/apple, /auth/passkey
Similar pattern with provider tokens.

## Conversation

### POST /chat/message
```json
{
  "message": "Explain async/await in Python",
  "conversation_id": "optional-uuid",
  "agent": "coding",
  "use_memory": true
}
```

### POST /chat/stream (SSE)
Returns streaming tokens.

### WebSocket /chat/ws/{conversation_id}

## Memory

### GET /memory
Returns list of memories (with consent).

### POST /memory
```json
{
  "content": "User prefers concise answers",
  "memory_type": "preference",
  "importance": 0.8
}
```

### DELETE /memory/{id}

## Vision & Screen

### POST /vision/analyze
Multipart form:
- `image`: file
- `query`: string
- `mode`: "general" | "software_learning"

Returns structured screen analysis.

### POST /vision/live-frame (for streaming)

## Agents

### GET /agents
List available agents.

### POST /agents/collaborate
```json
{
  "agents": ["coding", "research"],
  "task": "Build a REST API for todo app"
}
```

## Documents

### POST /documents/upload
Multipart upload + optional `analyze: true`

## Voice

### POST /voice/transcribe
Audio file → text

### POST /voice/synthesize
Text → audio stream

---

Full OpenAPI spec available at `/docs` when running the server.