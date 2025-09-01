from fastapi import APIRouter, HTTPException, Depends
from datetime import timedelta

from backend.schema.usuario import UsuarioCreate, UsuarioLogin, UsuarioResponse
from backend.core.security import hash_password, verify_password, create_access_token
from backend.services.supabase_client import supabase
from backend.core.config import settings


def register_service(user: UsuarioCreate):
    # Verificar si ya existe
    existing_user = supabase.table("usuarios").select("*").eq("username", user.username).execute()
    if existing_user.data:
        raise HTTPException(status_code=400, detail="El usuario ya existe")

    hashed_pw = hash_password(user.password)
    new_user = supabase.table("usuarios").insert({
        "username": user.username,
        "email": user.email,
        "password": hashed_pw
    }).execute()

    return UsuarioResponse(**new_user.data[0])


def login_service(user: UsuarioLogin):
    
    result = supabase.table("usuarios").select("*").eq("username", user.username).execute()
    if not result.data:
        raise HTTPException(status_code=401, detail="El usuario no existe")

    db_user = result.data[0]

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Datos incorrectos")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user["id"]}, 
        expires_delta=access_token_expires
    )

    user_response = UsuarioResponse(**db_user)
    
    return {
        "mensaje": "inicio de sesion exitoso :)",
        "access_token": access_token, 
        "token_type": "bearer",
        "user": user_response
    }