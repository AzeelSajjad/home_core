from pdfrw import PdfReader, PdfWriter, PdfDict, PdfName
from ..models.opra_model import OPRAQuestionnaireData
from ..models.opra_db_model import OPRARequest
from fastapi import HTTPException
import os

#function that fills the opra form with the user data that was retrieved from the questionnaire
def fill_opra_form(data: OPRAQuestionnaireData, output_path: str = "filled_opra.pdf"):
    field_mapping = {
        'First Name': 'first_name',
        'MI': 'middle_initial',
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
    writer.write(output_path, pdf)

#function that processes the questionnaire data
def process_questionnaire(questionnaire_data: OPRAQuestionnaireData):
    optional_fields=['middle_initial', 'fax']
    for field_name, value in questionnaire_data.model_dump().items():
        if field_name in optional_fields:
            continue
        if value is None or (isinstance(value, str) and value.strip() == ""):
            raise HTTPException(status_code=400, detail=f"{field_name} is required")
    questionnaire_data.phone = questionnaire_data.phone.replace('-', '').replace(' ', '')
    questionnaire_data.state = questionnaire_data.state.upper().strip()
    
def save_db(data: OPRAQuestionnaireData, db):
    # Map to the correct database column names
    record = OPRARequest(
        first_name=data.first_name,
        mi=data.middle_initial,  # maps to 'mi' column in database
        last_name=data.last_name,
        email=data.email,
        address=data.address,
        city=data.city,
        state=data.state,
        zip_code=data.zip_code,
        phone=data.phone,
        fax=data.fax,
        request_type=data.request_type
    )
    db.add(record)
    db.commit()
    db.refresh(record)