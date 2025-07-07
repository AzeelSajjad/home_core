from fastapi import FastAPI, Depends
from models.opra_model import OPRAQuestionnaireData
from sqlaclchemy.orm import Session
from database import get_db
from services.opra_services import process_questionnaire, save_db, fill_opra_form
from fastapi.responses import FileResponse
import os
import uuid

app = FastAPI()


@app.post("/submit-opra")
def submit_opra(data: OPRAQuestionnaireData, db: Session = Depends(get_db)):
    process_questionnaire(data)
    save_db(data, db)

    filename = f"filled_opra_form_{uuid.uuid4()}.pdf"
    output_path = os.path.join("filled_forms", filename)
    fill_opra_form(data, output_path)

    return FileResponse(
        path=output_path,
        media_type="application/pdf",
        filename=filename
    )