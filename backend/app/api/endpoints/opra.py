'''
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
@router.options("/submit-opra")
async def submit_opra(data: OPRAQuestionnaireData, db: Session = Depends(get_db)):
    try:
        # Process and validate the questionnaire data
        process_questionnaire(data)
        
        # Save to database
        save_db(data, db)

        # Generate filename and get absolute path
        filename = f"filled_opra_form_{uuid.uuid4()}.pdf"
        
        # Get the absolute path to the filled_pdfs directory
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # Go up to app directory
        filled_pdfs_path = os.path.join(BASE_DIR, "filled_pdfs")
        output_path = os.path.join(filled_pdfs_path, filename)
        
        # Ensure the directory exists
        os.makedirs(filled_pdfs_path, exist_ok=True)
        
        # Fill the PDF form
        fill_opra_form(data, output_path)
        
        # Verify the file was created
        if not os.path.exists(output_path):
            raise HTTPException(status_code=500, detail="PDF file was not created successfully")

        return {"filename": filename, "message": "OPRA form processed successfully"}
        
    except HTTPException:
        # Re-raise HTTP exceptions (these have proper status codes)
        raise
    except Exception as e:
        print(f"Error processing OPRA submission: {e}")
        print(f"Error type: {type(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.get("/pdf/{filename}")
async def get_pdf(filename: str):
    try:
        # Get absolute path to the filled_pdfs directory
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # Go up to app directory
        filled_pdfs_path = os.path.join(BASE_DIR, "filled_pdfs")
        file_path = os.path.join(filled_pdfs_path, filename)
        
        print(f"Looking for PDF at: {file_path}")  # Debug logging
        
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="PDF file not found")
        
        return FileResponse(
            path=file_path,
            media_type="application/pdf",
            filename=filename
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error serving PDF: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
'''