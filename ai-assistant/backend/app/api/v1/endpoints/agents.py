from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List
from app.services.agents import agent_manager, Agent
from app.core.security import get_current_user

router = APIRouter()

class CollaborateRequest(BaseModel):
    agents: List[str]
    task: str

@router.get("/", response_model=List[Agent])
async def list_agents(current_user=Depends(get_current_user)):
    return list(agent_manager.agents.values())

@router.post("/collaborate")
async def collaborate_agents(
    request: CollaborateRequest,
    current_user=Depends(get_current_user)
):
    results = await agent_manager.collaborate(
        agent_names=request.agents,
        task=request.task,
        context={}
    )
    return {"results": results}