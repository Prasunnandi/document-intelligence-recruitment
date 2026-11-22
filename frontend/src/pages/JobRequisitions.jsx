import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Briefcase, Plus, Users, CheckCircle2, ChevronRight, Layers } from 'lucide-react';

export default function JobRequisitions({ onSelectJobForMatcher }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      const data = await api.getJobs();
      setJobs(data || []);
      setLoading(false);
    }
    fetchJobs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-cyan-400" /> Open Job Requisitions
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Active department openings with automated semantic skill matching criteria.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {job.department}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5">{job.title}</h3>
                </div>
                <span className="text-xs font-mono text-slate-400">Min {job.experience_years_required} yrs exp</span>
              </div>
              <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                {job.description}
              </p>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <div>
                <div className="text-[11px] font-semibold text-slate-400 mb-1.5">Required Skills:</div>
                <div className="flex flex-wrap gap-1.5">
                  {job.required_skills.map((skill, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {job.preferred_skills?.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 mb-1.5">Preferred Nice-To-Haves:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {job.preferred_skills.map((skill, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[11px] bg-slate-800/60 text-slate-400">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onSelectJobForMatcher && onSelectJobForMatcher(job.id)}
                  className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                >
                  Inspect Candidates & Matches <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
