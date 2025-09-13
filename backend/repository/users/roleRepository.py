from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.models.users.userModel import Role

async def get_role_by_name(db: AsyncSession, name: str):
    q = await db.execute(select(Role).where(Role.name == name))
    return q.scalar_one_or_none()


async def create_role(db: AsyncSession, role: Role):
    db.add(role)
    await db.commit()
    await db.refresh(role)
    return role
