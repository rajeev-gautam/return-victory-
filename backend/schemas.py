from pydantic import BaseModel
from typing import List, Optional
import datetime

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str
    age: int
    gender: str
    occupation: str
    salary: float
    is_married: bool

class User(UserBase):
    id: int
    is_active: bool
    age: Optional[int] = None
    gender: Optional[str] = None
    occupation: Optional[str] = None
    salary: Optional[float] = None
    is_married: Optional[bool] = False
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class ActivityBase(BaseModel):
    url: str
    status: str
    score: int

class Activity(ActivityBase):
    id: int
    date: datetime.datetime
    owner_id: int
    class Config:
        from_attributes = True

class DashboardData(BaseModel):
    stats: list
    riskData: list
    activityData: list
    recentChecks: list
    recommendedSchemes: list

class ChatRequest(BaseModel):
    messages: list
    language: Optional[str] = None

class ChatResponse(BaseModel):
    text: str
    video_url: Optional[str] = None

class QueryCreate(BaseModel):
    subject: str
    message: str

class QueryOut(QueryCreate):
    id: int
    status: str
    date: datetime.datetime
    
    class Config:
        from_attributes = True
