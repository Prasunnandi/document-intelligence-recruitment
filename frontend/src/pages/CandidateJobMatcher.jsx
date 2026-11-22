import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  FileSearch, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Award, 
  Sparkles, 
  ArrowRight, 
  Briefcase, 
  Clock, 
  GraduationCap, 
  FileText,
  TrendingUp,
  Layers
} from 'lucide-react';

export default function CandidateJobMatcher() {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [rankedList, setRankedList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rankingLoading, setRankingLoading] = useState(false);

  useEffect(() => {
    async function loadInitial() {
      const [jobsData, candidatesData] = await Promise.all([
        api.getJobs(),
        api.getCandidates()
      ]);
      setJobs(jobsData || []);
      setCandidates(candidatesData || []);
      if (jobsData?.length > 0) setSelectedJobId(jobsData[0].id);
      if (candidatesData?.length > 0) setSelectedCandidateId(candidatesData[0].id);
    }
    loadInitial();
  }, []);

  useEffect(() => {
    if (selectedJobId && selectedCandidateId) {
      runMatch(selectedCandidateId, selectedJobId);
    }
  }, [selectedJobId, selectedCandidateId]);

  const runMatch = async (candidateId, jobId) => {
    setLoading(true);
    try {
      const res = await api.matchCandidate(candidateId, jobId);
      setMatchResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRankAll = async () => {
    if (!selectedJobId) return;
    setRankingLoading(true);
    try {
      const res = await api.rankCandidatesForJob(selectedJobId);
      setRankedList(res || []);
    } catch (e) {
      console.error(e);
    } finally {
      setRankingLoading(false);
    }
  };

  const selectedJob = jobs.find(j => j.id === Number(selectedJobId));
  const selectedCandidate = candidates.find(c => c.id === Number(selectedCandidateId));
  const report = matchResult?.match_report;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-cyan-500/5 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Standout Feature
              </span>
              <span className="text-xs text-slate-400">DocuSense NLP & Inconsistency Detector</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Explainable Resume-to-Job Matching & Anomaly Detector
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl mt-1">
              Evaluates semantic TF-IDF overlap, skill deficit gaps, experience requirements, and proactively flags timeline conflicts and fraudulent resume claims.
            </p>
          </div>
          <button
            onClick={handleRankAll}
            disabled={rankingLoading || !selectedJobId}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/30 transition-all disabled:opacity-50"
          >
            <TrendingUp className="h-4 w-4" />
            {rankingLoading ? 'Ranking Pool...' : 'Rank All Candidates for Job'}
          </button>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Job Selector */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-cyan-400" /> Target Job Requisition
          </label>
          <select
            value={selectedJobId || ''}
            onChange={(e) => setSelectedJobId(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/60"
          >
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} ({j.department}) • Min {j.experience_years_required} yrs
              </option>
            ))}
          </select>
        </div>

        {/* Candidate Selector */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-teal-400" /> Candidate Profile
          </label>
          <select
            value={selectedCandidateId || ''}
            onChange={(e) => setSelectedCandidateId(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/60"
          >
            {candidates.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} • {c.experience_years} yrs exp • {c.education}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Match Intelligence Scorecards */}
      {report && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-slate-400">Overall Match Fit</div>
              <div className="text-3xl font-extrabold text-white mt-1">
                {report.overall_match_score}%
              </div>
              <div className="text-[11px] text-cyan-400 mt-1 font-medium">Weighted Composite Score</div>
            </div>
            <div className={`h-14 w-14 rounded-full flex items-center justify-center border-4 ${
              report.overall_match_score >= 80 ? 'border-emerald-500 text-emerald-400' :
              report.overall_match_score >= 60 ? 'border-amber-500 text-amber-400' :
              'border-rose-500 text-rose-400'
            } font-bold text-sm bg-slate-950`}>
              {report.overall_match_score >= 80 ? 'HIGH' : report.overall_match_score >= 60 ? 'MOD' : 'LOW'}
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs font-medium text-slate-400">Skill Competency Match</div>
            <div className="text-3xl font-extrabold text-white mt-1">
              {report.skill_overlap_percentage}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {report.matched_skills.length} matched / {report.missing_critical_skills.length} missing
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs font-medium text-slate-400">Experience Alignment</div>
            <div className="text-xl font-bold text-white mt-2">
              {report.experience_match === 'EXCEEDS_REQUIREMENT' && <span className="text-emerald-400">Exceeds (Senior)</span>}
              {report.experience_match === 'MEETS_REQUIREMENT' && <span className="text-cyan-400">Optimal Match</span>}
              {report.experience_match === 'UNDERQUALIFIED' && <span className="text-rose-400">Experience Deficit</span>}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Candidate: {selectedCandidate?.experience_years}y | Req: {selectedJob?.experience_years_required}y
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs font-medium text-slate-400">Inconsistencies & Flags</div>
            <div className="text-3xl font-extrabold mt-1 text-white flex items-center gap-2">
              {report.detected_inconsistencies.length}
              {report.detected_inconsistencies.length > 0 ? (
                <AlertTriangle className="h-5 w-5 text-amber-400 animate-pulse" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              )}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {report.detected_inconsistencies.length > 0 ? 'Review anomalies below' : 'Clean background verified'}
            </div>
          </div>
        </div>
      )}

      {/* AI Recommendation Summary */}
      {report && (
        <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">DocuSense Recommendation</h4>
            <p className="text-sm text-slate-200 mt-0.5">{report.recommendation_summary}</p>
          </div>
        </div>
      )}

      {/* Flagged Inconsistencies & Missing Information Section */}
      {report && report.detected_inconsistencies.length > 0 && (
        <div className="p-5 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
            <AlertTriangle className="h-4 w-4" />
            <span>Detected Resume Inconsistencies & Critical Information Gaps</span>
          </div>
          <div className="space-y-2">
            {report.detected_inconsistencies.map((issue, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-amber-200/90 bg-amber-900/20 p-2.5 rounded-lg border border-amber-800/40">
                <span className="font-bold text-amber-400">•</span>
                <span>{issue}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skill Gap Breakdown: Matched vs Missing */}
      {report && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Matched Skills */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Matched Core Competencies ({report.matched_skills.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {report.matched_skills.length > 0 ? (
                report.matched_skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 text-xs rounded-lg bg-emerald-950/50 text-emerald-300 border border-emerald-500/30 font-medium">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">No direct required skill matches found.</span>
              )}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <XCircle className="h-4 w-4" /> Missing Required Skills ({report.missing_critical_skills.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {report.missing_critical_skills.length > 0 ? (
                report.missing_critical_skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 text-xs rounded-lg bg-rose-950/50 text-rose-300 border border-rose-500/30 font-medium">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> All required skills covered!
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Context: Job Spec vs Parsed Candidate Resume */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Job Spec */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-cyan-400" /> Requisition Specifications
            </h3>
            <span className="text-xs text-slate-400 font-mono">{selectedJob?.department}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{selectedJob?.description}</p>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Required Skills</div>
            <div className="flex flex-wrap gap-1.5">
              {selectedJob?.required_skills.map((s, i) => (
                <span key={i} className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300">
                  {s}
                </span>
              ))}
            </div>
          </div>
          {selectedJob?.preferred_skills?.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Preferred Nice-To-Haves</div>
              <div className="flex flex-wrap gap-1.5">
                {selectedJob?.preferred_skills.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-[11px] bg-slate-800/60 text-slate-400">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Parsed Candidate Profile */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-teal-400" /> Parsed Resume Text (OCR & Text Extraction)
            </h3>
            <span className="text-xs text-slate-400 font-mono">{selectedCandidate?.email || 'No email provided'}</span>
          </div>
          <div className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
            {selectedCandidate?.resume_text}
          </div>
          <div className="text-[11px] text-slate-400">
            <strong>Education:</strong> {selectedCandidate?.education || 'Unknown'} | <strong>Reported Exp:</strong> {selectedCandidate?.experience_years} years
          </div>
        </div>
      </div>

      {/* Ranked Candidate Table for Selected Job */}
      {rankedList.length > 0 && (
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-cyan-400" /> Requisition Candidate Leaderboard
            </h3>
            <span className="text-xs text-slate-400 font-mono">Ranked by Match Score & Fit</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Candidate</th>
                  <th className="py-2.5 px-3">Overall Match</th>
                  <th className="py-2.5 px-3">Skill Overlap</th>
                  <th className="py-2.5 px-3">Experience</th>
                  <th className="py-2.5 px-3">Inconsistencies</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {rankedList.map((item, index) => (
                  <tr key={item.candidate.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-300">#{index + 1}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200">{item.candidate.name}</div>
                      <div className="text-[10px] text-slate-400">{item.candidate.education}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        item.match_report.overall_match_score >= 80 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        item.match_report.overall_match_score >= 60 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {item.match_report.overall_match_score}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300">{item.match_report.skill_overlap_percentage}%</td>
                    <td className="py-3 px-3 text-slate-300">{item.candidate.experience_years} yrs</td>
                    <td className="py-3 px-3">
                      {item.match_report.detected_inconsistencies.length > 0 ? (
                        <span className="text-amber-400 flex items-center gap-1 font-medium">
                          <AlertTriangle className="h-3 w-3" /> {item.match_report.detected_inconsistencies.length} issues
                        </span>
                      ) : (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Clean
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedCandidateId(item.candidate.id)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-medium transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
