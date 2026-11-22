import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Users, FileText, CheckCircle2, AlertTriangle, GraduationCap, Mail, Clock, ExternalLink } from 'lucide-react';

export default function TalentPool({ onSelectCandidateForMatcher }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePreviewId, setActivePreviewId] = useState(null);

  useEffect(() => {
    async function fetchCandidates() {
      const data = await api.getCandidates();
      setCandidates(data || []);
      setLoading(false);
    }
    fetchCandidates();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="h-5 w-5 text-teal-400" /> Candidate Talent Pool & Parsed Resumes
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Processed via DocuSense OCR and intelligent resume information extraction pipelines.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {candidates.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="font-bold text-white text-base">{c.name}</div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20">
                  {c.experience_years} yrs exp
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-400 mt-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-500" />
                  <span>{c.email || <span className="text-rose-400 font-semibold italic">Missing Email</span>}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-3.5 w-3.5 text-slate-500" />
                  <span>{c.education || <span className="text-amber-400 font-semibold italic">Missing Degree</span>}</span>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-[11px] font-semibold text-slate-400 mb-1.5">Parsed Skills:</div>
                <div className="flex flex-wrap gap-1">
                  {c.skills.map((skill, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <button
                onClick={() => setActivePreviewId(activePreviewId === c.id ? null : c.id)}
                className="w-full text-center text-xs font-medium text-slate-400 hover:text-slate-200 py-1 bg-slate-800/40 rounded transition-colors"
              >
                {activePreviewId === c.id ? 'Hide OCR Text' : 'View OCR Extracted Text'}
              </button>

              {activePreviewId === c.id && (
                <div className="text-[11px] text-slate-300 bg-slate-950 p-2.5 rounded border border-slate-800 font-mono whitespace-pre-wrap max-h-36 overflow-y-auto">
                  {c.resume_text}
                </div>
              )}

              <button
                onClick={() => onSelectCandidateForMatcher && onSelectCandidateForMatcher(c.id)}
                className="w-full py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                Run Match Intelligence <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
