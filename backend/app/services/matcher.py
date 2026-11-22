from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.models.schemas import JobDescription, CandidateProfile, MatchExplanation
import re

def compute_explainable_match(job: JobDescription, candidate: CandidateProfile) -> MatchExplanation:
    # 1. Semantic Content Similarity via TF-IDF
    corpus = [job.description + " " + " ".join(job.required_skills), candidate.resume_text]
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(corpus)
    cosine_sim = float(cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0])

    # 2. Explicit Skill Overlap
    candidate_skills_lower = {s.lower().strip() for s in candidate.skills}
    # Also search resume text for skills
    resume_lower = candidate.resume_text.lower()
    
    matched = []
    missing = []
    for req in job.required_skills:
        req_clean = req.lower().strip()
        if req_clean in candidate_skills_lower or re.search(r'\b' + re.escape(req_clean) + r'\b', resume_lower):
            matched.append(req)
        else:
            missing.append(req)

    total_req = len(job.required_skills)
    skill_overlap_pct = (len(matched) / total_req * 100.0) if total_req > 0 else 100.0

    # 3. Experience Alignment
    exp_status = "MEETS_REQUIREMENT"
    if candidate.experience_years >= job.experience_years_required + 2:
        exp_status = "EXCEEDS_REQUIREMENT"
    elif candidate.experience_years < job.experience_years_required:
        exp_status = "UNDERQUALIFIED"

    # 4. Overall Weighted Score (60% Skill Overlap, 30% Semantic Cosine, 10% Experience)
    exp_factor = 100.0 if exp_status != "UNDERQUALIFIED" else 50.0
    overall_score = (skill_overlap_pct * 0.6) + (cosine_sim * 100.0 * 0.3) + (exp_factor * 0.1)
    overall_score = round(min(100.0, max(0.0, overall_score)), 1)

    # 5. Inconsistency & Missing Info Detection (Standout Feature)
    inconsistencies = []
    
    # Check for graduation timeline overlap with senior roles
    if "2023" in candidate.education or "2024" in candidate.education:
        if candidate.experience_years >= 6:
            inconsistencies.append("Timeline Conflict: Resume claims 6+ years professional experience but lists a 2023/2024 graduation date.")
            
    # Check missing contact or degree information
    if not candidate.email or "@" not in candidate.email:
        inconsistencies.append("Missing Information: Candidate contact email is absent or malformed.")

    if not candidate.education or candidate.education.strip() == "":
        inconsistencies.append("Missing Information: No formal academic or certified education records detected.")

    if missing:
        inconsistencies.append(f"Skill Deficiency: Lacks {len(missing)} required core competencies: {', '.join(missing[:3])}.")

    # 6. Recommendation Summary
    if overall_score >= 80.0 and len(missing) == 0:
        summary = "Strong Hire Recommendation: High semantic and skill alignment with zero core deficiencies."
    elif overall_score >= 65.0:
        summary = f"Moderate Fit: Competent profile with {len(matched)} matched skills, but missing {len(missing)} required competencies ({', '.join(missing)})."
    else:
        summary = "Low Alignment: Candidate profile does not satisfy baseline skill and seniority prerequisites."

    return MatchExplanation(
        overall_match_score=overall_score,
        skill_overlap_percentage=round(skill_overlap_pct, 1),
        experience_match=exp_status,
        matched_skills=matched,
        missing_critical_skills=missing,
        detected_inconsistencies=inconsistencies,
        recommendation_summary=summary
    )
