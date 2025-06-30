from fastapi import FastAPI, Depends
from models.opra_model import OPRAQuestionnaireData
from sqlaclchemy.orm import Session
from database import get_db
from services.opra_services import process_questionnaire, save_db, fill_opra_form

app = FastAPI()

@app.post("/submit-opra")
def submit_opra(data: OPRAQuestionnaireData, db: Session = Depends(get_db)):
    process_questionnaire(data)
    save_db(data, db)
    fill_opra_form(data)
    return {"message": "Form submitted"}
