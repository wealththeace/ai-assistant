from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.core.security import create_access_token, get_current_user

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    # In production: validate against DB + hash check
    if request.email == "demo@aiassistant.dev" and request.password == "demo123":
        token = create_access_token({"sub": "user-123", "email": request.email})
        return {"access_token": token}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@router.post("/google")
async def google_login(token: str):
    # Verify Google ID token
    return {"access_token": "google-jwt-token-placeholder"}

@router.post("/apple")
async def apple_login(identity_token: str):
    return {"access_token": "apple-jwt-token-placeholder"}

@router.post("/passkey")
async def passkey_login(credential: dict):
    # WebAuthn / Passkey verification
    return {"access_token": "passkey-jwt-token-placeholder"}

@router.get("/me")
async def me(current_user=Depends(get_current_user)):
    return current_user