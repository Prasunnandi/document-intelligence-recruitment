from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class JobDescription(BaseModel):
    id: int
    title: str
    department: str
    experience_years_required: int
    required_skills: List[str]
    preferred_skills: List[str]
    description: str

class CandidateProfile(BaseModel):
    id: int
    name: str
    email: str
    experience_years: int
    skills: List[str]
    education: str
    resume_text: str

class MatchExplanation(BaseModel):
    overall_match_score: float # 0 - 100%
    skill_overlap_percentage: float
    experience_match: str # "EXCEEDS_REQUIREMENT", "MEETS_REQUIREMENT", "UNDERQUALIFIED"
    matched_skills: List[str]
    missing_critical_skills: List[str]
    detected_inconsistencies: List[str]
    recommendation_summary: str

class CandidateJobMatch(BaseModel):
    candidate: CandidateProfile
    job: JobDescription
    match_report: MatchExplanation
