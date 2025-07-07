from sqlalchemy import Column, String, Integer
from ..database import Base

class OPRARequest(Base):
    __tablename__ = "opra_requests"

    id = Column(Integer, primary_key=True, index=True)
    firstName = Column(String)
    middleInitial = Column(String, nullable=True)
    lastName = Column(String)
    email = Column(String)
    address = Column(String)
    city = Column(String)
    state = Column(String)
    zipCode = Column(String)
    phone = Column(String)
    fax = Column(String, nullable=True)
    requestType = Column(String)
