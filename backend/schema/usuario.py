from pydantic import BaseModel, EmailStr

class UsuarioCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UsuarioLogin(BaseModel):
    username: str
    password: str

class UsuarioResponse(BaseModel):
    id: str
    username: str
    email: EmailStr
