from pydantic import BaseModel
from typing import Optional

class OPRAQuestionnaireData(BaseModel):
    firstName: str
    middleInitial: Optional[str] = None
    lastName: str
    email: str
    address: str
    city: str
    state: str
    zipCode: str
    phone: str
    fax: Optional[str] = None
    requestType: str