import os
from dotenv import load_dotenv, find_dotenv
from openai import OpenAI

load_dotenv(find_dotenv())
client = OpenAI(api_key=os.getenv("API_KEY"))

def opra_form():
    response = client.responses.create(
        model = "gpt-4.1",
        instructions="You are a legal document expert specializing in New Jersey OPRA (Open Public Records Act) requests. Generate professional, legally compliant forms.",
        input="Create an OPRA Request Form for requesting rent history records from a municipal housing authority",
    )
    return response.output_text

if __name__ =="__main__":
    response = opra_form()
    print(response)