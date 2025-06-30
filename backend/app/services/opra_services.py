from pdfrw import PdfReader, PdfWriter, PdfDict, PdfName
from models.opra_model import OPRAQuestionnaireData
from models.opra_db_model import OPRARequest
from fastapi import HTTPException
import os

def fill_opra_form(data: OPRAQuestionnaireData):
    field_mapping = {
        'First Name': 'first_name',
        'MI': 'mi',
        'Last Name': 'last_name',
        'E-mail Address': 'email',
        'Mailing Address': 'address',
        'City': 'city',
        'State': 'state',
        'Zip': 'zip_code',
        'Telephone': 'phone',
        'Fax': 'fax',
        'Record Request Information': 'request_type'
    }
    BASE_DIR = os.path.dirname(__file__)
    template_path = os.path.join(BASE_DIR, "..", "templates", "opra.pdf")
    template_path = os.path.normpath(template_path)
    pdf = PdfReader(template_path)
    annotations = pdf.Root.AcroForm.Fields
    for field in annotations:
        key = field.get(PdfName('T'))
        if key in field_mapping:
            attr_name = field_mapping[key]
            value = getattr(data, attr_name, None)
            if value:
                field.update(PdfDict(V=value, AP=''))
    writer = PdfWriter()
    writer.write('filled_opra_form.pdf', pdf)

def process_questionnaire(questionnaire_data: OPRAQuestionnaireData):
    optional_fields=['mi', 'fax']
    for field_name, value in questionnaire_data.dict().items():
        if field_name in optional_fields:
            continue
        if value is None or (isinstance(value, str) and value.strip() == ""):
            raise HTTPException(status_code=400, detail=f"{field_name} is required")
    questionnaire_data.phone = questionnaire_data.phone.replace('-', '').replace(' ', '')
    questionnaire_data.state = questionnaire_data.state.upper().strip()
    
def save_db(data: OPRAQuestionnaireData, db):
    record = OPRARequest(**data.dict())
    db.add(record)
    db.commit()
    db.refresh(record)