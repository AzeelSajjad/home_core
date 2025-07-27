from fastapi import APIRouter
from ...services.rent import rent_calculator

router = APIRouter()

@router.post("/rent-calculate")
def rent_calculator_endpoint(old_rent: float, new_rent: float):
    result = rent_calculator(old_rent, new_rent)
    return result