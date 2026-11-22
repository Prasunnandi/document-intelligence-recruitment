from app.models.schemas import JobDescription, CandidateProfile

SEED_JOBS = [
    JobDescription(
        id=1,
        title="Senior Cloud & Distributed Systems Engineer",
        department="Platform Infrastructure",
        experience_years_required=5,
        required_skills=["Java", "Spring Boot", "Kubernetes", "PostgreSQL", "Docker", "Kafka"],
        preferred_skills=["AWS", "Terraform", "gRPC"],
        description="We are seeking a Senior Systems Engineer to architect low-latency distributed microservices in Java 21 and Spring Boot, deployed across cloud Kubernetes clusters."
    ),
    JobDescription(
        id=2,
        title="Lead Machine Learning Engineer",
        department="AI Intelligence",
        experience_years_required=4,
        required_skills=["Python", "FastAPI", "PyTorch", "Scikit-learn", "Docker"],
        preferred_skills=["MLflow", "LangChain", "Vector DBs"],
        description="Looking for an ML engineer to build scalable NLP parsing and predictive analytics pipelines using Python, FastAPI, and Scikit-learn."
    ),
    JobDescription(
        id=3,
        title="Full Stack React & Node.js Developer",
        department="Product Engineering",
        experience_years_required=3,
        required_skills=["React", "TypeScript", "Node.js", "Tailwind CSS", "REST APIs"],
        preferred_skills=["GraphQL", "Next.js", "Docker"],
        description="Join our product team to craft modern, responsive data dashboards and workflows in React, TypeScript, and Node.js."
    )
]

SEED_CANDIDATES = [
    CandidateProfile(
        id=101,
        name="Alex Mercer",
        email="a.mercer@cloudtech.io",
        experience_years=7,
        skills=["Java", "Spring Boot", "Docker", "Kubernetes", "PostgreSQL", "Kafka", "AWS"],
        education="B.S. in Computer Science, Georgia Tech (2017)",
        resume_text="Senior Backend Engineer with 7 years architecting high-scale Java and Spring Boot microservices. Production experience managing PostgreSQL, Apache Kafka streaming pipelines, and Kubernetes container orchestration on AWS."
    ),
    CandidateProfile(
        id=102,
        name="David Miller",
        email="d.miller@devhub.com",
        experience_years=6, # Claims 6 years
        skills=["Java", "Spring Boot", "PostgreSQL"],
        education="B.S. in Information Systems (Graduated May 2023)", # Inconsistency!
        resume_text="Full-stack engineer working on Java Spring Boot and PostgreSQL databases. Basic familiarity with containerization. Eager to learn Kubernetes and Kafka."
    ),
    CandidateProfile(
        id=103,
        name="Elena Rostova",
        email="e.rostova@ailab.org",
        experience_years=5,
        skills=["Python", "FastAPI", "Scikit-learn", "PyTorch", "Docker", "Pandas"],
        education="M.S. in Artificial Intelligence, Carnegie Mellon (2020)",
        resume_text="Machine learning researcher and production engineer. Built automated NLP classification pipelines in Python, deployed real-time inference APIs with FastAPI and Docker."
    ),
    CandidateProfile(
        id=104,
        name="Jordan Lee",
        email="jordan.lee@webdev.net",
        experience_years=4,
        skills=["React", "TypeScript", "Node.js", "Tailwind CSS", "REST APIs", "Next.js"],
        education="B.A. in Software Engineering, UC Berkeley (2021)",
        resume_text="Frontend and Full Stack developer specialized in React 18, TypeScript, Tailwind, and Node.js backend integrations."
    )
]
