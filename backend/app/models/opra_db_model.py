from sqlalchemy import Column, String, Integer
from database import Base

class OPRARequest(Base):
    __tablename__ = "opra_requests"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String)
    mi = Column(String, nullable=True)
    last_name = Column(String)
    email = Column(String)
    address = Column(String)
    city = Column(String)
    state = Column(String)
    zip_code = Column(String)
    phone = Column(String)
    fax = Column(String, nullable=True)
    request_type = Column(String)
