from sqlalchemy import create_engine
import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())
db_url = os.getenv("DATABASE_URL")
engine = create_engine(db_url)