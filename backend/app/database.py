'''
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv, find_dotenv
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv(find_dotenv())
db_url = os.getenv("DATABASE_URL")
engine = create_engine(db_url)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
'''