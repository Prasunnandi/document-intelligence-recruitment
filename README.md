# Document Intelligence & Recruitment AI Platform (`TalentMatch` + `DocuSense`)

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.5+-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

An enterprise-grade **Document Understanding and Explainable Recruitment Intelligence Platform** that unifies document OCR text extraction, candidate profile parsing, semantic resume-to-job matching, and automated anomaly detection.

---

## 🌟 Standout Feature: Explainable Matching & Anomaly Detection

Unlike opaque "black box" resume screeners, this platform provides **granular, explainable matching** combined with **integrity audits**:
- **Semantic TF-IDF & Cosine Similarity**: Compares natural language resume experience against job requirements.
- **Skill Deficiency Gap Analysis**: Pinpoints exact missing critical competencies vs matched core proficiencies.
- **Experience Alignment Calibration**: Detects senior vs junior qualification deltas against requisition mandates.
- **Timeline Conflict & Anomaly Detector**: Automatically flags suspicious resume claims (e.g. 6+ years experience claimed alongside a recent 2023/2024 graduation, missing contact credentials, or unverified degrees).

---

## 🏗️ Architecture

```
                                  ┌──────────────────────────────┐
                                  │   React 18 + Tailwind UI     │
                                  │  - Requisition Explorer      │
                                  │  - Candidate Talent Pool     │
                                  │  - Matcher & Anomaly Radar   │
                                  └──────────────┬───────────────┘
                                                 │ HTTP / JSON
                                                 ▼
                                  ┌──────────────────────────────┐
                                  │    FastAPI Gateway & Docs    │
                                  │   (/api/v1/recruitment/*)    │
                                  └──────────────┬───────────────┘
                                                 │
                   ┌─────────────────────────────┼─────────────────────────────┐
                   ▼                             ▼                             ▼
       ┌──────────────────────┐      ┌──────────────────────┐      ┌──────────────────────┐
       │   DocuSense Matcher  │      │  Integrity & Anomaly │      │   Requisition Ranker │
       │  - TF-IDF Cosine     │      │  - Timeline Conflict │      │  - Pool Sorting      │
       │  - Skill Overlap %   │      │  - Missing Info Check│      │  - Candidate Grading │
       └──────────────────────┘      └──────────────────────┘      └──────────────────────┘
```

---

## 🚀 Quickstart

### Option 1: Docker Compose (Recommended)
```bash
git clone https://github.com/Prasunnandi/document-intelligence-recruitment.git
cd document-intelligence-recruitment
docker-compose up --build
```
- Frontend UI: `http://localhost:3000`
- FastAPI OpenAPI Swagger Docs: `http://localhost:8000/docs`

### Option 2: Local Development

#### 1. Backend (FastAPI)
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

---

## 📡 REST API Reference

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/v1/recruitment/jobs` | `GET` | List all active job requisitions |
| `/api/v1/recruitment/candidates` | `GET` | List candidate pool with parsed OCR profiles |
| `/api/v1/recruitment/match` | `GET` | Deep explainable match report for a candidate & job |
| `/api/v1/recruitment/job/{id}/ranked-candidates` | `GET` | Rank entire talent pool for a specific requisition |

---

## 📜 License
Distributed under the Apache 2.0 License.
