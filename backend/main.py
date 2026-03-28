from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os
import models
from database import engine
from routers import auth, dashboard, contact, chat, query

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="GovAssistant Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(contact.router)
app.include_router(chat.router)
app.include_router(query.router)

@app.get("/")
def read_root():
    return {"message": "GovAssistant Backend API is running"}
