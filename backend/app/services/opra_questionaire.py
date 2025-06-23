from models.opra_model import OPRAQuestionnaireData
from fastapi import HTTPException
from services import opra_form

def process_questionnaire(questionnaire_data: OPRAQuestionnaireData):
    optional_fields=['mi', 'fax']
    for field_name, value in questionnaire_data.dict().items():
        if field_name in optional_fields:
            continue
        if value is None or (isinstance(value, str) and value.strip() == ""):
            raise HTTPException(status_code=400, detail=f"{field_name} is required")
    questionnaire_data.phone = questionnaire_data.phone.replace('-', '').replace(' ', '')
    questionnaire_data.state = questionnaire_data.state.upper().strip()
        