from fastapi import FastAPI
from fastapi_sqlalchemy import DBSessionMiddleware
from app.api import recognition
from fastapi.middleware.cors import CORSMiddleware


import os


origins = [
    "http://localhost:8888",
    "https://intl-pass-server.vercel.app"
    # Add other allowed origins as needed
]


app = FastAPI()

app.include_router(recognition.router, prefix="/api/recognition", tags=["recognition"])

# to avoid csrftokenError
# to avoid csrftokenError

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
