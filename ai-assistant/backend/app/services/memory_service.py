"""
Memory Service - Long-term, session, and fact memory with user consent.
Uses PostgreSQL + Qdrant for semantic retrieval.
"""

from typing import List, Dict, Optional
from datetime import datetime, timedelta
import uuid
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from app.core.config import settings
import structlog

logger = structlog.get_logger()

class MemoryService:
    def __init__(self):
        self.qdrant = QdrantClient(
            url=settings.QDRANT_URL,
            api_key=settings.QDRANT_API_KEY
        )
        self.collection_name = "user_memories"
        self._ensure_collection()

    def _ensure_collection(self):
        try:
            self.qdrant.get_collection(self.collection_name)
        except Exception:
            self.qdrant.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(size=1536, distance=Distance.COSINE)
            )

    async def store_memory(
        self,
        user_id: str,
        content: str,
        memory_type: str = "long_term",
        importance: float = 0.7,
        source: str = "conversation",
        expires_at: Optional[datetime] = None
    ) -> str:
        """Store a memory only with explicit user consent (handled at API layer)."""
        
        memory_id = str(uuid.uuid4())
        
        # In production: generate embedding via OpenAI or local model
        embedding = [0.1] * 1536  # Placeholder embedding
        
        point = PointStruct(
            id=memory_id,
            vector=embedding,
            payload={
                "user_id": user_id,
                "content": content,
                "memory_type": memory_type,
                "importance": importance,
                "source": source,
                "created_at": datetime.utcnow().isoformat(),
                "expires_at": expires_at.isoformat() if expires_at else None
            }
        )
        
        self.qdrant.upsert(
            collection_name=self.collection_name,
            points=[point]
        )
        
        logger.info("Memory stored", user_id=user_id, memory_type=memory_type)
        return memory_id

    async def retrieve_relevant_memories(
        self,
        user_id: str,
        query: str,
        top_k: int = 5,
        memory_types: Optional[List[str]] = None
    ) -> List[Dict]:
        """Semantic search over user's memories."""
        
        # Placeholder embedding for query
        query_vector = [0.1] * 1536
        
        results = self.qdrant.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            limit=top_k,
            query_filter={
                "must": [
                    {"key": "user_id", "match": {"value": user_id}}
                ]
            }
        )
        
        memories = []
        for hit in results:
            payload = hit.payload
            if memory_types and payload["memory_type"] not in memory_types:
                continue
            memories.append({
                "id": hit.id,
                "content": payload["content"],
                "type": payload["memory_type"],
                "importance": payload["importance"],
                "score": hit.score
            })
        
        return memories

    async def delete_memory(self, memory_id: str, user_id: str):
        """Delete specific memory."""
        self.qdrant.delete(
            collection_name=self.collection_name,
            points_selector={"must": [{"key": "user_id", "match": {"value": user_id}}]}
        )
        # Also delete from relational DB in production

    async def list_memories(self, user_id: str, memory_type: Optional[str] = None) -> List[Dict]:
        """List memories for UI display."""
        # In real impl: combine Qdrant + Postgres
        return [{"id": "mem-1", "content": "User prefers dark mode", "type": "preference"}]