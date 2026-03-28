from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    occupation = Column(String, nullable=True)
    salary = Column(Float, nullable=True)
    is_married = Column(Boolean, default=False)
    
    activities = relationship("Activity", back_populates="owner")

class Activity(Base):
    __tablename__ = "activities"
    
    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, index=True)
    status = Column(String, default="safe")
    score = Column(Integer, default=0)
    date = Column(DateTime, default=datetime.datetime.utcnow)
    
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="activities")

class SupportQuery(Base):
    __tablename__ = "support_queries"
    
    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String, index=True)
    message = Column(String)
    status = Column(String, default="pending")
    date = Column(DateTime, default=datetime.datetime.utcnow)
    
    owner_id = Column(Integer, ForeignKey("users.id"))

class DashboardStat(Base):
    __tablename__ = "dashboard_stats"
    
    id = Column(Integer, primary_key=True, index=True)
    total_schemes = Column(Integer, default=142)
    active_matches = Column(Integer, default=12)
    threats_blocked = Column(Integer, default=54)
    system_health = Column(Integer, default=98)
