"""
AI Orchestrator - Central intelligence layer
Routes requests to appropriate models, agents, and tools.
Handles memory, vision context, and multi-agent collaboration.
Now with real LLM provider integration.
"""

from typing import AsyncGenerator, Optional, Dict, Any
from datetime import datetime
import asyncio
import os
from app.core.config import settings
from app.services.memory_service import MemoryService
from app.services.vision_service import VisionService
import structlog

logger = structlog.get_logger()

# Real LLM clients (lazy initialization)
_openai_client = None
_anthropic_client = None
_gemini_client = None

def get_openai_client():
    global _openai_client
    if _openai_client is None and settings.OPENAI_API_KEY:
        from openai import AsyncOpenAI
        _openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    return _openai_client

def get_anthropic_client():
    global _anthropic_client
    if _anthropic_client is None and settings.ANTHROPIC_API_KEY:
        import anthropic
        _anthropic_client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
    return _anthropic_client

class AIOrchestrator:
    def __init__(self):
        self.memory = MemoryService()
        self.vision = VisionService()
        self.default_model = "claude-3-5-sonnet-20241022"

    async def process_message(
        self,
        user_id: str,
        message: str,
        conversation_id: Optional[str] = None,
        agent: str = "general",
        use_memory: bool = True,
        screen_context: Optional[Dict] = None
    ) -> Dict[str, Any]:
        
        context = ""
        if use_memory:
            memories = await self.memory.retrieve_relevant_memories(user_id, message, top_k=4)
            context = "\n".join([m["content"] for m in memories])
        
        if screen_context:
            context += f"\n\n[Current Screen Context]:\n{screen_context.get('description', '')}"

        system_prompt = self._build_system_prompt(agent, context)
        model = self._select_model(agent, message)
        
        response_text = await self._call_model(model, system_prompt, message)
        
        if use_memory and agent != "general":
            await self.memory.store_memory(
                user_id=user_id,
                content=message,
                memory_type="conversation",
                importance=0.65
            )
        
        return {
            "message": response_text,
            "conversation_id": conversation_id or f"conv-{datetime.utcnow().timestamp()}",
            "model_used": model,
            "tokens": len(response_text.split()) * 1.4,
            "timestamp": datetime.utcnow().isoformat()
        }

    async def stream_response(
        self,
        user_id: str,
        message: str,
        conversation_id: Optional[str] = None,
        agent: str = "general"
    ) -> AsyncGenerator[Dict, None]:
        
        context = await self.memory.retrieve_relevant_memories(user_id, message, top_k=3)
        system_prompt = self._build_system_prompt(agent, context)
        model = self._select_model(agent, message)
        
        # Real streaming from providers
        if "claude" in model and get_anthropic_client():
            async for chunk in self._stream_claude(system_prompt, message):
                yield chunk
        elif ("gpt" in model or "4o" in model) and get_openai_client():
            async for chunk in self._stream_openai(system_prompt, message):
                yield chunk
        else:
            # Fallback simulation
            full = await self._call_model(model, system_prompt, message)
            for i, word in enumerate(full.split()):
                await asyncio.sleep(0.025)
                yield {"type": "token", "content": word + " ", "index": i, "model": model}
        
        yield {"type": "done", "conversation_id": conversation_id, "model": model}

    def _select_model(self, agent: str, message: str) -> str:
        if "code" in message.lower() or agent == "coding":
            return "claude-3-5-sonnet-20241022"
        if "vision" in message.lower() or "screen" in message.lower():
            return "gpt-4o"
        if agent in ["research", "learning"]:
            return "gemini-1.5-pro"
        return self.default_model

    def _build_system_prompt(self, agent: str, context: str = "") -> str:
        base = "You are a highly intelligent, empathetic, and helpful personal AI assistant. Speak naturally like a trusted human colleague. Be concise yet thorough. Always cite sources when giving factual information."
        
        agent_prompts = {
            "general": "You are the user's primary AI companion and second brain.",
            "coding": "You are an expert software engineer and coding mentor. Write clean, production-grade code with explanations.",
            "learning": "You are a world-class teacher. Create step-by-step learning experiences and adapt to the user's pace.",
            "research": "You are a meticulous research assistant. Prioritize trustworthy sources and always cite them.",
            "business": "You are a strategic business advisor with deep knowledge of operations, growth, and decision-making."
        }
        
        prompt = agent_prompts.get(agent, agent_prompts["general"])
        if context:
            prompt += f"\n\nRelevant context and memories:\n{context}"
        
        return f"{base}\n\n{prompt}"

    async def _call_model(self, model: str, system_prompt: str, user_message: str) -> str:
        try:
            if "claude" in model and get_anthropic_client():
                return await self._call_claude(system_prompt, user_message)
            elif ("gpt" in model or "4o" in model) and get_openai_client():
                return await self._call_openai(system_prompt, user_message)
            else:
                return f"[Local Fallback] I understand your request about '{user_message[:60]}...'. Here's a thoughtful response."
        except Exception as e:
            logger.error("LLM call failed", error=str(e))
            return "I apologize, I'm having trouble connecting to the AI model right now. Please try again in a moment."

    async def _call_claude(self, system: str, message: str) -> str:
        client = get_anthropic_client()
        if not client:
            return "[Claude] (API key not configured) Thanks for your message."
        
        response = await client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            system=system,
            messages=[{"role": "user", "content": message}]
        )
        return response.content[0].text

    async def _call_openai(self, system: str, message: str) -> str:
        client = get_openai_client()
        if not client:
            return "[GPT-4o] (API key not configured) I understand your request."
        
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": message}
            ],
            max_tokens=1024
        )
        return response.choices[0].message.content

    async def _stream_claude(self, system: str, message: str):
        client = get_anthropic_client()
        if not client:
            yield {"type": "token", "content": "[Claude not configured] "}
            return
        
        stream = await client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            system=system,
            messages=[{"role": "user", "content": message}],
            stream=True
        )
        
        async for event in stream:
            if event.type == "content_block_delta":
                yield {"type": "token", "content": event.delta.text, "model": "claude"}

    async def _stream_openai(self, system: str, message: str):
        client = get_openai_client()
        if not client:
            yield {"type": "token", "content": "[GPT not configured] "}
            return
        
        stream = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": message}
            ],
            stream=True,
            max_tokens=1024
        )
        
        async for chunk in stream:
            if chunk.choices[0].delta.content:
                yield {"type": "token", "content": chunk.choices[0].delta.content, "model": "gpt-4o"}

    async def collaborate_agents(self, agents: list, task: str):
        results = []
        for agent_name in agents:
            result = await self.process_message(
                user_id="system",
                message=task,
                agent=agent_name,
                use_memory=False
            )
            results.append(result)
        return results