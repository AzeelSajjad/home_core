import os
from dotenv import load_dotenv, find_dotenv
from openai import OpenAI
from models import OPRAQuestionnaireData

load_dotenv(find_dotenv())
client = OpenAI(api_key=os.getenv("API_KEY"))

def opra_form(questionnaire_data = OPRAQuestionnaireData):
    response = client.responses.create(
        model = "gpt-4.1",
        instructions="You are a legal document expert specializing in New Jersey OPRA (Open Public Records Act) requests. Generate professional, legally compliant forms.",
        input=f"Create an OPRA Request Form with the following details: Name: {questionnaire_data.name} {questionnaire_data.last_name}, Email: {questionnaire_data.email}, Address: {questionnaire_data.address}, {questionnaire_data.city}, {questionnaire_data.state} {questionnaire_data.zip_code}, Phone: {questionnaire_data.phone}, Records Requested: {questionnaire_data.request_type}",
    )
    return response.output_text
