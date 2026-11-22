from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import List, Optional
from app.models.schemas import JobDescription, CandidateProfile, CandidateJobMatch, MatchExplanation
from app.services.matcher import compute_explainable_match
from app.seed import SEED_JOBS, SEED_CANDIDATES

router = APIRouter(prefix="/api/v1/recruitment", tags=["Recruitment Intelligence & DocuSense"])

jobs_db = list(SEED_JOBS)
candidates_db = list(SEED_CANDIDATES)

@router.get("/jobs", response_model=List[JobDescription])
def get_jobs():
    return jobs_db

@router.get("/candidates", response_model=List[CandidateProfile])
def get_candidates():
    return candidates_db

@router.get("/match", response_model=CandidateJobMatch)
def match_candidate_to_job(candidate_id: int, job_id: int):
    cand = next((c for c in candidates_db if c.id == candidate_id), None)
    job = next((j for j in jobs_db if j.id == job_id), None)
    if not cand or not job:
        raise HTTPException(status_code=404, detail="Candidate or Job not found")

    report = compute_explainable_match(job, cand)
    return CandidateJobMatch(candidate=cand, job=job, match_report=report)

@router.get("/job/{job_id}/ranked-candidates", response_model=List[CandidateJobMatch])
def rank_candidates_for_job(job_id: int):
    job = next((j for j in jobs_db if j.id == job_id), None)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    ranked = []
    for cand in candidates_db:
        report = compute_explainable_match(job, cand)
        ranked.append(CandidateJobMatch(candidate=cand, job=job, match_report=report))

    # Rank descending by overall score
    ranked.sort(key=lambda x: x.match_report.overall_match_score, reverse=True)
    return ranked

@router.post("/parse-resume", response_model=CandidateProfile)
def parse_resume_upload(name: str, email: str, experience_years: int, skills_csv: str, resume_text: str):
    new_id = len(candidates_db) + 101
    skills = [s.strip() for s in skills_csv.split(",") if s.strip()]
    cand = CandidateProfile(
        id=new_id,
        name=name,
        email=email,
        experience_years=experience_years,
        skills=skills,
        education="Auto-parsed from document text",
        resume_text=resume_text
    )
    candidates_db.append(cand)
    return cand
