from sqlalchemy import Column, String, Integer
from ..database import Base

class OPRARequest(Base):
    __tablename__ = "opra_requests"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, name="first_name")
    mi = Column(String, name="mi", nullable=True) 
    last_name = Column(String, name="last_name")
    email = Column(String, name="email")
    address = Column(String, name="address")
    city = Column(String, name="city")
    state = Column(String, name="state")
    zip_code = Column(String, name="zip_code")
    phone = Column(String, name="phone")
    fax = Column(String, name="fax", nullable=True)
    request_type = Column(String, name="request_type")