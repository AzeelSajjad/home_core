from fastapi import APIRouter
from ...services.rent import rent_calculator
from ...models.rent_model import RentRequest  

router = APIRouter()

@router.post("/rent-calculate")
def rent_calculator_endpoint(request: RentRequest):
    result = rent_calculator(request.old_rent, request.new_rent, request.last_change_date)
    return result