from fastapi import FastAPI
from app.api.endpoints.opra import router as opra_router

app = FastAPI()
app.include_router(opra_router, prefix="/opra")