from fastapi import APIRouter, HTTPException, Depends

from backend.schema.usuario import UsuarioCreate, UsuarioLogin, UsuarioResponse
from backend.services.auth import auth_service

router = APIRouter()

@router.post("/register", response_model=UsuarioResponse)
def register_user(user: UsuarioCreate):
    try: 
       return auth_service.register_service(user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
   

@router.post("/login")
def login_user(user: UsuarioLogin):
    try:
        return auth_service.login_service(user)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
