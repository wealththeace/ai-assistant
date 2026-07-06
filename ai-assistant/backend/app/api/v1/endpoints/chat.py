from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
import json
from app.core.security import get_current_user
from app.services.ai_orchestrator import AIOrchestrator
from app.services.memory_service import MemoryService

router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    content: str
    metadata: Optional[dict] = None

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    agent: str = "general"
    use_memory: bool = True

class ChatResponse(BaseModel):
    message: str
    conversation_id: str
    model_used: str
    tokens: int

orchestrator = AIOrchestrator()
memory_service = MemoryService()

@router.post("/message", response_model=ChatResponse)
async def send_message(
    request: ChatRequest,
    current_user=Depends(get_current_user)
):
    """Send a text message to the AI assistant."""
    response = await orchestrator.process_message(
        user_id=current_user.id,
        message=request.message,
        conversation_id=request.conversation_id,
        agent=request.agent,
        use_memory=request.use_memory
    )
    return response

@router.post("/stream")
async def stream_message(
    request: ChatRequest,
    current_user=Depends(get_current_user)
):
    """Stream AI response token by token."""
    async def generate():
        async for chunk in orchestrator.stream_response(
            user_id=current_user.id,
            message=request.message,
            conversation_id=request.conversation_id,
            agent=request.agent
        ):
            yield f"data: {json.dumps(chunk)}\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")

@router.websocket("/ws/{conversation_id}")
async def websocket_chat(websocket: WebSocket, conversation_id: str):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            # Handle real-time conversation
            response = await orchestrator.process_realtime(
                conversation_id=conversation_id,
                message=payload["message"]
            )
            await websocket.send_text(json.dumps(response))
    except WebSocketDisconnect:
        print(f"Client disconnected from conversation {conversation_id}")