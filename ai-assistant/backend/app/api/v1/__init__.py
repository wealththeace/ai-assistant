from fastapi import APIRouter
from app.api.v1.endpoints import auth, chat, memory, vision, agents, documents, voice, arena

router = APIRouter()

router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
router.include_router(chat.router, prefix="/chat", tags=["Conversation"])
router.include_router(memory.router, prefix="/memory", tags=["Memory"])
router.include_router(vision.router, prefix="/vision", tags=["Vision & Screen"])
router.include_router(agents.router, prefix="/agents", tags=["AI Agents"])
router.include_router(documents.router, prefix="/documents", tags=["Documents"])
router.include_router(voice.router, prefix="/voice", tags=["Voice"])
router.include_router(arena.router, prefix="/arena", tags=["LM Arena"])