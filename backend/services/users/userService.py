from sqlalchemy.ext.asyncio import AsyncSession
from backend.models.users.userModel import User, Role
from backend.repository.users.userRepository import get_user_by_email, create_user, get_user_by_id, get_all_users_repository
from backend.repository.users.roleRepository import get_role_by_name, create_role
from backend.utils.helpers import hash_password

async def get_all_users(db: AsyncSession):
    return await get_all_users_repository(db)

async def register_user(db: AsyncSession, email: str, password: str, full_name: str = None):
    existing = await get_user_by_email(db, email)
    if existing:
        raise ValueError("Email already registered")
    hashed = hash_password(password)
    user = User(email=email, full_name=full_name, hashed_password=hashed)
    return await create_user(db, user)

async def assign_role_to_user(db: AsyncSession, user_id, role_name: str, role_description: str = None):
    user = await get_user_by_id(db, user_id)
    if not user:
        raise ValueError("User not found")
    role = await get_role_by_name(db, role_name)
    if not role:
        role = Role(name=role_name, description=role_description)
        role = await create_role(db, role)
    if role not in user.roles:
        user.roles.append(role)
        db.add(user)
        await db.commit()
        await db.refresh(user)
    return user
