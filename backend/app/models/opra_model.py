from pydantic import BaseModel, Field
from typing import Optional

class OPRAQuestionnaireData(BaseModel):
    first_name: str = Field(..., alias="firstName")
    middle_initial: Optional[str] = Field(default=None, alias="middleInitial")
    last_name: str = Field(..., alias="lastName")
    email: str
    address: str
    city: str
    state: str
    zip_code: str = Field(..., alias="zipCode")
    phone: str
    fax: Optional[str] = None
    request_type: str = Field(..., alias="requestType")

    class Config:
        populate_by_name = True