from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import recruitment

app = FastAPI(
    title="Document Intelligence & Recruitment Platform API",
    description="Unified API combining DocuSense (Document Inconsistency Detection) and TalentMatch (Explainable Candidate Matching)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recruitment.router)

@app.get("/")
def root():
    return {
        "platform": "DocuSense & TalentMatch Intelligence Suite",
        "status": "Online",
        "documentation": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8083, reload=True)
