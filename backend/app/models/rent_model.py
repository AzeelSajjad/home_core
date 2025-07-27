from pydantic import BaseModel

class RentRequest(BaseModel):
    old_rent: float
    new_rent: float
    
