from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from backend.core.database import get_db
from backend.schema.users.userSchema import UserCreate, UserRead
from backend.services.users.userService import register_user, assign_role_to_user, get_all_users

router = APIRouter()

@router.get("/all-users", response_model=list[UserRead] )
async def read_all_users(db: AsyncSession = Depends(get_db)):
    users = await get_all_users(db)
    return users

@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def create_user_endpoint(payload: UserCreate, db: AsyncSession = Depends(get_db)):
    try:
        user = await register_user(db, email=payload.email, password=payload.password, full_name=payload.full_name)
        return user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@router.post("/{user_id}/roles", response_model=UserRead)
async def add_role(user_id: UUID, role: dict, db: AsyncSession = Depends(get_db)):
    # role: {"name": "instructor", "description": "..." }
    try:
        user = await assign_role_to_user(db, user_id, role_name=role.get("name"), role_description=role.get("description"))
        return user
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
