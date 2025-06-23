from pdfrw import PdfReader, PdfWriter, PdfDict, PdfName
from models.opra_model import OPRAQuestionnaireData
import os

def fill_opra_form(data: OPRAQuestionnaireData):
    field_mapping = {
        'First Name': 'first_name'
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

