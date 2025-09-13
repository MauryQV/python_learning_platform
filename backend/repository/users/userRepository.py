from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.models.users.userModel import User

async def get_all_users_repository(db: AsyncSession):
    q =  await db.execute(select(User))
    return q.scalars().all()


async def get_user_by_email(db: AsyncSession, email: str):
    q = await db.execute(select(User).where(User.email == email))
    return q.scalar_one_or_none()



async def get_user_by_id(db: AsyncSession, user_id):
    q = await db.execute(select(User).where(User.id == user_id))
    return q.scalar_one_or_none()



async def create_user(db: AsyncSession, user: User):
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
