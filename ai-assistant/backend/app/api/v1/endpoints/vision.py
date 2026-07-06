from fastapi import APIRouter, UploadFile, File, Depends, Form
from pydantic import BaseModel
from typing import Optional
from app.services.vision_service import VisionService
from app.core.security import get_current_user

router = APIRouter()
vision_service = VisionService()

class ScreenAnalysisRequest(BaseModel):
    query: str
    mode: str = "general"

@router.post("/analyze")
async def analyze_screen(
    file: UploadFile = File(...),
    query: str = Form(...),
    mode: str = Form("general"),
    current_user=Depends(get_current_user)
):
    image_bytes = await file.read()
    result = await vision_service.analyze_screen(
        image_bytes=image_bytes,
        user_query=query,
        mode=mode
    )
    return result

@router.post("/analyze-learning")
async def analyze_for_learning(
    file: UploadFile = File(...),
    software: str = Form(...),
    question: str = Form(...),
    current_user=Depends(get_current_user)
):
    image_bytes = await file.read()
    result = await vision_service.analyze_screenshot_for_learning(
        image_bytes=image_bytes,
        software_name=software,
        user_question=question
    )
    return result