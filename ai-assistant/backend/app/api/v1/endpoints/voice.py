from fastapi import APIRouter, UploadFile, File, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.services.voice_service import voice_service
from app.core.security import get_current_user

router = APIRouter()

class VoiceSessionRequest(BaseModel):
    user_id: str

@router.post("/transcribe")
async def transcribe(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):
    audio_bytes = await file.read()
    text = await voice_service.transcribe_audio(audio_bytes)
    return {"text": text}

@router.post("/synthesize")
async def synthesize(
    text: str,
    voice: str = "alloy",
    current_user=Depends(get_current_user)
):
    async def audio_stream():
        async for chunk in voice_service.synthesize_speech(text, voice):
            yield chunk
    
    return StreamingResponse(audio_stream(), media_type="audio/mpeg")

@router.post("/session")
async def start_voice_session(request: VoiceSessionRequest):
    session = await voice_service.start_voice_session(request.user_id)
    return session

@router.post("/interrupt")
async def interrupt():
    await voice_service.interrupt_speech()
    return {"status": "interrupted"}