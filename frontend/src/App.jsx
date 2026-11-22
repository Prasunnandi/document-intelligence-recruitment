import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import CandidateJobMatcher from './pages/CandidateJobMatcher';
import JobRequisitions from './pages/JobRequisitions';
import TalentPool from './pages/TalentPool';

export default function App() {
  const [activeTab, setActiveTab] = useState('matcher');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onRefresh={handleRefresh} isRefreshing={isRefreshing} />
        
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'matcher' && <CandidateJobMatcher />}
          {activeTab === 'jobs' && <JobRequisitions onSelectJobForMatcher={() => setActiveTab('matcher')} />}
          {activeTab === 'talent' && <TalentPool onSelectCandidateForMatcher={() => setActiveTab('matcher')} />}
        </main>
      </div>
    </div>
  );
}
