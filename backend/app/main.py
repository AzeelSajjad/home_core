from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os
from .database import engine, Base
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints.opra import router as opra_router

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"  # Allow all origins for development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(opra_router, prefix="/api")

Base.metadata.create_all(bind=engine)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
filled_pdfs_path = os.path.join(BASE_DIR, "filled_pdfs")

app.mount("/filled_forms", StaticFiles(directory=filled_pdfs_path), name="filled_forms")
