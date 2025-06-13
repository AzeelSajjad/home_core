from fastapi import APIRouter
from app.template.opra_form import opra_form

router = APIRouter()

@router.post("/generate")
async def generate():
    response = opra_form()
    return {"form": response}