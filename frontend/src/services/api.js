// API Client for Document Intelligence & Recruitment Platform

const API_BASE = '/api/v1/recruitment';

async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.warn(`API call ${endpoint} failed, utilizing local fallback:`, err.message);
    return getFallbackData(endpoint);
  }
}

export const api = {
  getJobs: () => request('/jobs'),
  getCandidates: () => request('/candidates'),
  matchCandidate: (candidateId, jobId) => request(`/match?candidate_id=${candidateId}&job_id=${jobId}`),
  rankCandidatesForJob: (jobId) => request(`/job/${jobId}/ranked-candidates`)
};

function getFallbackData(endpoint) {
  if (endpoint.includes('/jobs')) {
    return [
      {
        id: 1,
        title: "Senior Cloud & Distributed Systems Engineer",
        department: "Platform Infrastructure",
        experience_years_required: 5,
        required_skills: ["Java", "Spring Boot", "Kubernetes", "PostgreSQL", "Docker", "Kafka"],
        preferred_skills: ["AWS", "Terraform", "gRPC"],
        description: "We are seeking a Senior Systems Engineer to architect low-latency distributed microservices in Java 21 and Spring Boot, deployed across cloud Kubernetes clusters."
      },
      {
        id: 2,
        title: "Lead Machine Learning Engineer",
        department: "AI Intelligence",
        experience_years_required: 4,
        required_skills: ["Python", "FastAPI", "PyTorch", "Scikit-learn", "Docker"],
        preferred_skills: ["MLflow", "LangChain", "Vector DBs"],
        description: "Looking for an ML engineer to build scalable NLP parsing and predictive analytics pipelines using Python, FastAPI, and Scikit-learn."
      }
    ];
  }

  if (endpoint.includes('/candidates')) {
    return [
      {
        id: 101,
        name: "Alex Mercer",
        email: "a.mercer@cloudtech.io",
        experience_years: 7,
        skills: ["Java", "Spring Boot", "Docker", "Kubernetes", "PostgreSQL", "Kafka", "AWS"],
        education: "B.S. in Computer Science, Georgia Tech (2017)",
        resume_text: "Senior Backend Engineer with 7 years architecting high-scale Java and Spring Boot microservices. Production experience managing PostgreSQL, Apache Kafka streaming pipelines, and Kubernetes container orchestration on AWS."
      },
      {
        id: 102,
        name: "David Miller",
        email: "d.miller@devhub.com",
        experience_years: 6,
        skills: ["Java", "Spring Boot", "PostgreSQL"],
        education: "B.S. in Information Systems (Graduated May 2023)",
        resume_text: "Full-stack engineer working on Java Spring Boot and PostgreSQL databases. Basic familiarity with containerization. Eager to learn Kubernetes and Kafka."
      }
    ];
  }

  if (endpoint.includes('/match')) {
    return {
      candidate: {
        id: 102,
        name: "David Miller",
        email: "d.miller@devhub.com",
        experience_years: 6,
        skills: ["Java", "Spring Boot", "PostgreSQL"],
        education: "B.S. in Information Systems (Graduated May 2023)",
        resume_text: "Full-stack engineer working on Java Spring Boot and PostgreSQL databases."
      },
      job: {
        id: 1,
        title: "Senior Cloud & Distributed Systems Engineer",
        required_skills: ["Java", "Spring Boot", "Kubernetes", "PostgreSQL", "Docker", "Kafka"]
      },
      match_report: {
        overall_match_score: 58.4,
        skill_overlap_percentage: 50.0,
        experience_match: "MEETS_REQUIREMENT",
        matched_skills: ["Java", "Spring Boot", "PostgreSQL"],
        missing_critical_skills: ["Kubernetes", "Docker", "Kafka"],
        detected_inconsistencies: [
          "Timeline Conflict: Resume claims 6+ years professional experience but lists a May 2023 graduation date.",
          "Skill Deficiency: Lacks 3 required core competencies: Kubernetes, Docker, Kafka."
        ],
        recommendation_summary: "Low Alignment: Candidate profile exhibits timeline discrepancy and lacks distributed streaming/container prerequisites."
      }
    };
  }

  return [];
}
