from pydantic import BaseModel
from datetime import datetime

class RentRequest(BaseModel):
    old_rent: float
    new_rent: float
    date: datetime
