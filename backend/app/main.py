'''
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os
from .database import engine, Base
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints.opra import router as opra_router
from sqlalchemy import text

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"  # Allow all origins for development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(opra_router, prefix="/api")

# Create tables
try:
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully")
except Exception as e:
    print(f"Error creating database tables: {e}")

# Setup static files
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
filled_pdfs_path = os.path.join(BASE_DIR, "filled_pdfs")

# Ensure directory exists
os.makedirs(filled_pdfs_path, exist_ok=True)

print(f"Base directory: {BASE_DIR}")
print(f"Filled PDFs path: {filled_pdfs_path}")
print(f"Directory exists: {os.path.exists(filled_pdfs_path)}")

try:
    app.mount("/filled_forms", StaticFiles(directory=filled_pdfs_path), name="filled_forms")
    print("Static files mounted successfully")
except Exception as e:
    print(f"Error mounting static files: {e}")

# Add debugging endpoints
@app.get("/health")
async def health_check():
    return {"status": "healthy", "filled_pdfs_path": filled_pdfs_path}

@app.get("/test-db")
async def test_db():
    from .database import get_db
    
    try:
        # Test database connection
        db = next(get_db())
        db.execute(text("SELECT 1"))
        db.close()
        return {"message": "Database connection successful"}
    except Exception as e:
        return {"error": f"Database connection failed: {str(e)}"}

@app.get("/test-template")
async def test_template():
    template_path = os.path.join(BASE_DIR, "templates", "opra.pdf")
    template_exists = os.path.exists(template_path)
    
    # Also check if templates directory exists
    templates_dir = os.path.join(BASE_DIR, "templates")
    templates_dir_exists = os.path.exists(templates_dir)
    
    return {
        "template_exists": template_exists,
        "template_path": template_path,
        "templates_dir_exists": templates_dir_exists,
        "templates_dir_path": templates_dir
    }
    
@app.get("/test-table-structure")
async def test_table_structure():
    from .database import get_db
    
    try:
        db = next(get_db())
        # Query to get column information
        result = db.execute(text("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'opra_requests'
            ORDER BY ordinal_position
        """))
        columns = [{"name": row[0], "type": row[1]} for row in result.fetchall()]
        db.close()
        return {"columns": columns}
    except Exception as e:
        return {"error": f"Failed to get table structure: {str(e)}"}
'''

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.endpoints.rent_api import router as rent_router  

# Create FastAPI app
app = FastAPI(
    title="Rent Calculator API",
    description="API to calculate if rent increases exceed legal limits",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",    # React (Create React App)
        "http://localhost:5173",    # Vite dev server
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rent_router, tags=["rent"])