from pydantic import BaseModel, EmailStr
from typing import Optional, List
from uuid import UUID
from backend.schema.users.roleSchema import RoleRead

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    is_active: bool = True

class UserCreate(UserBase):
    password: str

#Utilizar from_atributes en lugar de orm_mode para la compatibilidad con pydantic :v
class UserRead(UserBase):
    id_user: UUID
    roles: List[RoleRead] = []
    class Config:
        from_attributes = True
