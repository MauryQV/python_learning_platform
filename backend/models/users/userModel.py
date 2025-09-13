import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Table, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from backend.core.database import Base

#Asociacion con tabla intermedia para relacion muchos a muchos entre usuarios y roles
user_roles = Table(
    "user_rol", 
    Base.metadata,
    Column("user_id", UUID(as_uuid=True), ForeignKey("users.id_user", ondelete="CASCADE"), primary_key=True),
    Column("role_id", UUID(as_uuid=True), ForeignKey("roles.id_role", ondelete="CASCADE"), primary_key=True),
)
#Modelo de usuario
class User(Base):
    __tablename__ = "users"
    id_user = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=text("now()"))

    roles = relationship("Role", secondary=user_roles, back_populates="users", lazy="selectin")
    
#Modelo de rol
class Role(Base):
    __tablename__ = "roles"
    id_role = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(String, nullable=True)

    users = relationship("User", secondary=user_roles, back_populates="roles")
