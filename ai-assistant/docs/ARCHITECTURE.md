# AI Personal Assistant - System Architecture

## 1. High-Level Overview

The system follows a **modular, microservices-inspired architecture** with a strong emphasis on **privacy, scalability, and cross-platform consistency**.

### Core Principles
- **Privacy-first**: Memory, permissions, and data are always opt-in
- **Agentic**: Specialized AI agents that collaborate
- **Streaming-first**: Real-time responses and voice
- **Multi-modal**: Text, voice, vision, screen, documents
- **Zero-trust security**

## 2. High-Level Components

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
├──────────────┬──────────────┬──────────────┬────────────────────┤
│   Web (React)│ Desktop      │   Mobile     │   Browser Ext.     │
│   (PWA)      │ (Tauri)      │   (Flutter)  │   (Future)         │
└──────────────┴──────────────┴──────────────┴────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API GATEWAY (FastAPI)                       │
│  - Authentication, Rate Limiting, Request Routing               │
│  - WebSocket Gateway for real-time & streaming                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     AI ORCHESTRATOR                             │
│  - Model Router (OpenAI/Claude/Gemini/Ollama)                   │
│  - Agent Manager                                                │
│  - Tool/Function Calling                                        │
│  - Context Management                                           │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────────┐   ┌────────────────┐
│ Memory       │    │ Vision / Screen  │   │ Voice Service  │
│ Service      │    │ Service          │   │ (STT + TTS)    │
└──────────────┘    └──────────────────┘   └────────────────┘

┌──────────────┐    ┌──────────────────┐   ┌────────────────┐
│ Document     │    │ Plugin Service   │   │ Knowledge      │
│ Service      │    │                  │   │ Graph (Future) │
└──────────────┘    └──────────────────┘   └────────────────┘
```

## 3. Service Breakdown

### 3.1 Backend Services (Python/FastAPI)

| Service                  | Responsibility                                      | Technology                  |
|--------------------------|-----------------------------------------------------|-----------------------------|
| **API Gateway**          | Auth, routing, rate limiting                        | FastAPI + Starlette         |
| **AI Orchestrator**      | LLM routing, agent coordination, tool calling       | LangChain / LlamaIndex + custom |
| **Memory Service**       | Long-term & session memory (vector + relational)    | PostgreSQL + Qdrant         |
| **Vision Service**       | Screen analysis, OCR, UI understanding              | GPT-4o / Claude-3.5 / Gemini |
| **Voice Service**        | STT + TTS streaming                                 | Whisper + OpenAI TTS / Coqui|
| **Document Service**     | PDF, Office, Markdown parsing & RAG                 | Unstructured + LangChain    |
| **Plugin Service**       | MCP, REST, local tools                              | Custom registry             |
| **Auth Service**         | OAuth, Passkeys, MFA                                | Auth0 / Supabase / custom   |
| **Notification Service** | Push, email, in-app                                 | Firebase / OneSignal        |

### 3.2 Frontend Applications

| Platform     | Tech Stack                          | Key Features                          |
|--------------|-------------------------------------|---------------------------------------|
| **Web**      | React 19 + TypeScript + Tailwind    | PWA, real-time chat, workspace        |
| **Desktop**  | Tauri 2 + React + Vite              | Native OS integration, system tray    |
| **Mobile**   | Flutter 3 + Dart                    | Native iOS/Android, camera, voice     |
| **Shared**   | TypeScript types + Zod schemas      | Cross-platform contracts              |

### 3.3 Data Layer

- **Primary DB**: PostgreSQL (users, conversations, permissions, agents)
- **Vector DB**: Qdrant (memory embeddings, document chunks)
- **Cache**: Redis (session state, rate limits)
- **Object Storage**: S3-compatible (documents, screen recordings, audio)
- **Search**: Elasticsearch (future knowledge graph)

## 4. AI Model Strategy

- **Default**: Claude 3.5 Sonnet / GPT-4o (primary intelligence)
- **Vision**: GPT-4o / Claude-3.5-Sonnet / Gemini 1.5 Pro
- **Voice**: Whisper-large-v3 (STT) + OpenAI TTS / ElevenLabs
- **Local fallback**: Ollama (Llama-3.3, Qwen2.5, Phi-4) + Whisper.cpp
- **Routing**: Cost/performance/quality-aware router

## 5. Real-Time Communication

- **WebSocket** for:
  - Streaming LLM responses
  - Voice bidirectional streaming
  - Live screen sharing feed
  - Agent collaboration events
- **WebRTC** for screen sharing + low-latency voice (future)

## 6. Security Architecture (High-Level)

See `SECURITY.md` for full details.

- JWT + Refresh tokens with rotation
- End-to-end encryption for memory
- Device fingerprinting + approval
- Granular permission system
- Audit logging (immutable)

## 7. Scalability & Deployment

- Kubernetes-native
- Horizontal scaling of stateless services
- Event-driven with NATS / RabbitMQ (future)
- Edge deployment support (local models)

## 8. Agent System

Agents are first-class citizens:

```python
class Agent:
    name: str
    description: str
    tools: list[Tool]
    system_prompt: str
    model_preference: str
```

Agents collaborate via the Orchestrator using a shared context bus.

## 9. Data Flow Example (Screen + Voice)

1. User says "What should I click?" (voice)
2. Voice Service → STT → Orchestrator
3. Vision Service captures current screen (with permission)
4. Multimodal model analyzes screen + query
5. Agent decides action
6. Response streamed back via WS
7. TTS plays response

## 10. Future Evolution

- Knowledge Graph (Neo4j)
- Personal RAG index
- AR glasses integration
- Local-first mode (full offline)
- Multi-user family/team workspaces

---

**This architecture is designed to evolve gracefully over the next 5+ years.**