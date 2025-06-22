from fastapi import APIRouter
from backend.app.services.opra_form import opra_form

router = APIRouter()

@router.post("/generate")
async def generate():
    response = opra_form()
    return {"form": response}