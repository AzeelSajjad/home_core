from fastapi import FastAPI
from database import engine
from models.opra_db_model import OPRARequest

OPRARequest.metadata.create_all(bind=engine)
