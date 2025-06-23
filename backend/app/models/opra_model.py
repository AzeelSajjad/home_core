from pydantic import BaseModel
from typing import Optional

class OPRAQuestionnaireData(BaseModel):
    name: str
    mi: Optional[str] = None
    last_name: str
    email: str
    address: str
    city: str
    state: str
    zip_code: str
    phone: str
    fax:  Optional[str] = None
    request_type: str