from fastapi import APIRouter, Depends, HTTPException
from ...models.opra_model import OPRAQuestionnaireData
from sqlalchemy.orm import Session
from ...database import get_db
from ...services.opra_services import process_questionnaire, save_db, fill_opra_form
from fastapi.responses import FileResponse
import os
import uuid

router = APIRouter()

@router.post("/submit-opra")
async def submit_opra(data: OPRAQuestionnaireData, db: Session = Depends(get_db)):
    try:
        process_questionnaire(data)
        save_db(data, db)

        filename = f"filled_opra_form_{uuid.uuid4()}.pdf"
        output_path = os.path.join("filled_pdfs", filename)  

        fill_opra_form(data, output_path)

        return {"filename": filename, "message": "OPRA form processed successfully"}
    except Exception as e:
        print(f"Error processing OPRA submission: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/pdf/{filename}")
async def get_pdf(filename: str):
    try:
        file_path = os.path.join("filled_pdfs", filename)
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="PDF file not found")
        
        return FileResponse(
            path=file_path,
            media_type="application/pdf",
            filename=filename
        )
    except Exception as e:
        print(f"Error serving PDF: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")