# Database Schema - AI Personal Assistant

## Overview

- **Primary Store**: PostgreSQL 16+
- **Vector Store**: Qdrant (separate service)
- **Cache**: Redis
- **Object Storage**: MinIO / S3

## Core Tables

### users
```sql
CREATE TABLE users (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email               VARCHAR(255) UNIQUE NOT NULL,
    display_name        VARCHAR(120),
    avatar_url          TEXT,
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW(),
    last_active_at      TIMESTAMP,
    is_active           BOOLEAN DEFAULT TRUE,
    preferences         JSONB DEFAULT '{}',
    metadata            JSONB DEFAULT '{}'
);
```

### auth_providers
```sql
CREATE TABLE auth_providers (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
    provider    VARCHAR(50) NOT NULL,  -- google, apple, microsoft, email, passkey
    provider_id VARCHAR(255) NOT NULL,
    metadata    JSONB,
    created_at  TIMESTAMP DEFAULT NOW(),
    UNIQUE(provider, provider_id)
);
```

### devices
```sql
CREATE TABLE devices (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    device_id       VARCHAR(255) UNIQUE NOT NULL,
    platform        VARCHAR(50) NOT NULL, -- ios, android, windows, macos, linux, web
    device_name     VARCHAR(120),
    push_token      TEXT,
    last_seen       TIMESTAMP,
    is_trusted      BOOLEAN DEFAULT FALSE,
    fingerprint     TEXT,
    created_at      TIMESTAMP DEFAULT NOW()
);
```

### conversations
```sql
CREATE TABLE conversations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(255),
    summary         TEXT,
    agent_type      VARCHAR(50) DEFAULT 'general',
    is_archived     BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);
```

### messages
```sql
CREATE TABLE messages (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id     UUID REFERENCES conversations(id) ON DELETE CASCADE,
    role                VARCHAR(20) NOT NULL, -- user, assistant, system, tool
    content             TEXT,
    content_type        VARCHAR(30) DEFAULT 'text',
    metadata            JSONB DEFAULT '{}',
    model_used          VARCHAR(100),
    tokens_used         INTEGER,
    created_at          TIMESTAMP DEFAULT NOW()
);
```

### memories
```sql
CREATE TABLE memories (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    memory_type     VARCHAR(30) NOT NULL, -- long_term, session, fact, preference
    content         TEXT NOT NULL,
    embedding_id    UUID,  -- reference to Qdrant
    importance      FLOAT DEFAULT 0.5,
    source          VARCHAR(100),
    created_at      TIMESTAMP DEFAULT NOW(),
    expires_at      TIMESTAMP,
    is_active       BOOLEAN DEFAULT TRUE
);
```

### permissions
```sql
CREATE TABLE permissions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    permission      VARCHAR(100) NOT NULL, -- camera, microphone, screen, memory, etc.
    granted         BOOLEAN DEFAULT FALSE,
    granted_at      TIMESTAMP,
    revoked_at      TIMESTAMP,
    device_id       UUID REFERENCES devices(id),
    UNIQUE(user_id, permission, device_id)
);
```

### agents
```sql
CREATE TABLE agents (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id),
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    system_prompt   TEXT,
    model           VARCHAR(100) DEFAULT 'claude-3-5-sonnet',
    tools           JSONB DEFAULT '[]',
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW()
);
```

### tasks
```sql
CREATE TABLE tasks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id),
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    status          VARCHAR(30) DEFAULT 'pending',
    due_date        TIMESTAMP,
    priority        INTEGER DEFAULT 3,
    agent_id        UUID REFERENCES agents(id),
    metadata        JSONB,
    created_at      TIMESTAMP DEFAULT NOW()
);
```

### documents
```sql
CREATE TABLE documents (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id),
    filename        VARCHAR(255),
    content_type    VARCHAR(100),
    size_bytes      BIGINT,
    storage_path    TEXT,
    summary         TEXT,
    embedding_ids   UUID[],
    created_at      TIMESTAMP DEFAULT NOW()
);
```

### audit_logs
```sql
CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID,
    action          VARCHAR(100) NOT NULL,
    resource_type   VARCHAR(50),
    resource_id     UUID,
    ip_address      INET,
    user_agent      TEXT,
    metadata        JSONB,
    created_at      TIMESTAMP DEFAULT NOW()
);
```

## Indexes (Recommended)

```sql
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);
CREATE INDEX idx_memories_user ON memories(user_id, memory_type, is_active);
CREATE INDEX idx_conversations_user ON conversations(user_id, updated_at DESC);
CREATE INDEX idx_permissions_user ON permissions(user_id);
```

## Qdrant Collections

- `user_memories` (user_id filter)
- `document_chunks`
- `knowledge_base` (global trusted sources)

## Redis Keys Pattern

- `session:{user_id}:{device_id}`
- `rate_limit:{user_id}:{endpoint}`
- `conversation_context:{conversation_id}`

---

**Migration files will be generated using Alembic.**