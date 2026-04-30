import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronRight, 
  Loader2,
  FileText,
  Zap,
  Star
} from 'lucide-react';
import { recruitmentService } from '../../services/recruitmentService';

export const PipelineManager = ({ bootcampId }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStage, setActiveStage] = useState('PENDING'); // PENDING, SCREENED_ROUND_1, TASK_EVALUATION, ACCEPTED, REJECTED
  const [selectedApp, setSelectedApp] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, [bootcampId, activeStage]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await recruitmentService.getApplications({ bootcampId, status: activeStage });
      setApplications(data.data || []);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (id, decision) => {
    try {
      setProcessingId(id);
      await recruitmentService.makeDecision(id, decision);
      fetchApplications(); // Refresh list
      setSelectedApp(null);
    } catch (error) {
      alert('Action failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setProcessingId(null);
    }
  };

  const stages = [
    { id: 'PENDING', label: 'Screening', icon: Search, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { id: 'SCREENED_ROUND_1', label: 'Technical', icon: Zap, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { id: 'TASK_EVALUATION', label: 'Evaluation', icon: FileText, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { id: 'WAITLISTED', label: 'Waitlist', icon: Clock, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { id: 'ACCEPTED', label: 'Accepted', icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/10' },
    { id: 'REJECTED', label: 'Rejected', icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
  ];

  const getStatusBadge = (status) => {
    const stage = stages.find(s => s.id === status);
    if (!stage) return null;
    return (
      <span className={`px-2 py-1 rounded-md ${stage.bg} ${stage.color} text-[10px] font-bold uppercase tracking-wider`}>
        {stage.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-portal-card border border-portal-border rounded-3xl p-2 flex items-center justify-between shadow-xl overflow-hidden">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar p-1">
          {stages.map(stage => (
            <button
              key={stage.id}
              onClick={() => {
                setActiveStage(stage.id);
                setSelectedApp(null);
              }}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                activeStage === stage.id 
                  ? `${stage.bg} ${stage.color} ring-1 ring-${stage.color.split('-')[1]}-400/20` 
                  : 'text-portal-text-muted hover:text-portal-text hover:bg-white/5'
              }`}
            >
              <stage.icon className="w-4 h-4" />
              {stage.label}
              {activeStage === stage.id && (
                <span className={`ml-1 px-2 py-0.5 rounded-lg ${stage.bg} text-[10px]`}>
                  {applications.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Applicant List (4/12) */}
        <div className="lg:col-span-4 space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-portal-card border border-portal-border rounded-3xl opacity-50">
              <Loader2 className="w-10 h-10 animate-spin text-portal-accent mb-4" />
              <p className="text-[10px] font-bold text-portal-text-muted uppercase tracking-[0.2em]">Synchronizing...</p>
            </div>
          ) : applications.length > 0 ? (
            applications.map(app => (
              <div 
                key={app._id}
                onClick={() => setSelectedApp(app)}
                className={`group bg-portal-card border transition-all cursor-pointer rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md hover:border-portal-accent/50 ${
                  selectedApp?._id === app._id ? 'border-portal-accent bg-portal-accent/5' : 'border-portal-border'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 bg-portal-bg border border-portal-border rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Users className="w-5 h-5 text-portal-text-muted group-hover:text-portal-accent transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-portal-text text-sm truncate">{app.student?.name || 'Anonymous'}</h4>
                    <p className="text-[10px] text-portal-text-muted mt-0.5 truncate">{app.student?.email}</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-portal-text-muted transition-transform ${selectedApp?._id === app._id ? 'rotate-90 text-portal-accent' : ''}`} />
              </div>
            ))
          ) : (
            <div className="py-20 text-center bg-portal-card border border-portal-border rounded-3xl border-dashed">
              <Users className="w-12 h-12 text-portal-text-muted mx-auto mb-4 opacity-10" />
              <p className="text-xs font-bold text-portal-text-muted uppercase tracking-widest">No candidates here</p>
            </div>
          )}
        </div>

        {/* Right Column: Details & Actions (8/12) */}
        <div className="lg:col-span-8">
          {selectedApp ? (
            <div className="bg-portal-card border border-portal-border rounded-[32px] overflow-hidden shadow-2xl flex flex-col">
              {/* Header */}
              <div className="p-8 border-b border-portal-border bg-gradient-to-br from-portal-accent/5 to-transparent flex items-start justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-portal-accent/10 rounded-2xl flex items-center justify-center border border-portal-accent/20">
                    <Users className="w-10 h-10 text-portal-accent" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-3xl font-bold text-portal-text">{selectedApp.student?.name}</h3>
                      {getStatusBadge(selectedApp.status)}
                    </div>
                    <p className="text-portal-text-muted">{selectedApp.student?.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-portal-text-muted uppercase tracking-widest mb-1">Applied On</p>
                  <p className="text-sm font-bold text-portal-text">{new Date(selectedApp.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Body: Answers Grid */}
              <div className="p-8 space-y-8 max-h-[500px] overflow-y-auto custom-scrollbar">
                <section>
                  <h5 className="text-xs font-bold text-portal-accent uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Application Details
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedApp.phase1Answers && Object.entries(selectedApp.phase1Answers).map(([key, value]) => (
                      <div key={key} className="p-4 bg-portal-bg/50 border border-portal-border rounded-2xl hover:border-portal-accent/30 transition-colors">
                        <p className="text-[10px] font-bold text-portal-text-muted uppercase tracking-wider mb-2">{key.replace(/_/g, ' ')}</p>
                        <p className="text-sm text-portal-text font-medium leading-relaxed">{value || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {selectedApp.phase2Submission?.data && Object.keys(selectedApp.phase2Submission.data).length > 0 && (
                  <section>
                    <h5 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Technical Submission
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(selectedApp.phase2Submission.data).map(([key, value]) => (
                        <div key={key} className="p-4 bg-purple-400/5 border border-purple-400/10 rounded-2xl">
                          <p className="text-[10px] font-bold text-purple-400/70 uppercase tracking-wider mb-2">{key.replace(/_/g, ' ')}</p>
                          <p className="text-sm text-portal-text font-medium leading-relaxed">{value || 'N/A'}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* Footer: Decisions */}
              <div className="p-8 bg-portal-bg/30 border-t border-portal-border">
                <div className="flex flex-wrap items-center gap-4">
                  {activeStage === 'PENDING' && (
                    <>
                      <button 
                        onClick={() => handleDecision(selectedApp._id, 'PASS')}
                        disabled={processingId === selectedApp._id}
                        className="flex-1 min-w-[200px] py-4 bg-portal-accent text-portal-bg rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-portal-accent/20"
                      >
                        {processingId === selectedApp._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChevronRight className="w-5 h-5" />}
                        Pass to Technical
                      </button>
                      <button 
                        onClick={() => handleDecision(selectedApp._id, 'ACCEPT')}
                        disabled={processingId === selectedApp._id}
                        className="flex-1 min-w-[200px] py-4 bg-green-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-green-500/20"
                      >
                        {processingId === selectedApp._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Star className="w-5 h-5" />}
                        Accept (Congratulations)
                      </button>
                    </>
                  )}

                  {activeStage === 'TASK_EVALUATION' && (
                    <>
                      <button 
                        onClick={() => handleDecision(selectedApp._id, 'ACCEPT')}
                        disabled={processingId === selectedApp._id}
                        className="flex-1 min-w-[200px] py-4 bg-green-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-green-500/20"
                      >
                        {processingId === selectedApp._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Star className="w-5 h-5" />}
                        Accept Candidate
                      </button>
                      <button 
                        onClick={() => handleDecision(selectedApp._id, 'WAIT')}
                        disabled={processingId === selectedApp._id}
                        className="flex-1 min-w-[200px] py-4 bg-orange-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-orange-500/20"
                      >
                        {processingId === selectedApp._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Clock className="w-5 h-5" />}
                        Waitlist Candidate
                      </button>
                    </>
                  )}

                  {activeStage === 'WAITLISTED' && (
                    <button 
                      onClick={() => handleDecision(selectedApp._id, 'ACCEPT')}
                      disabled={processingId === selectedApp._id}
                      className="flex-1 min-w-[200px] py-4 bg-green-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-green-500/20"
                    >
                      {processingId === selectedApp._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Star className="w-5 h-5" />}
                      Promote to Accepted
                    </button>
                  )}

                  {['PENDING', 'TASK_EVALUATION', 'WAITLISTED', 'SCREENED_ROUND_1'].includes(activeStage) && (
                    <button 
                      onClick={() => handleDecision(selectedApp._id, 'REJECT')}
                      disabled={processingId === selectedApp._id}
                      className="flex-1 min-w-[200px] py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                    >
                      {processingId === selectedApp._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                      Reject Application
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-portal-card border border-portal-border rounded-[40px] p-20 text-center h-[500px] flex flex-col items-center justify-center opacity-50 border-dashed">
              <div className="w-20 h-20 bg-portal-accent/5 rounded-full flex items-center justify-center mb-6">
                <Users className="w-10 h-10 text-portal-accent opacity-20" />
              </div>
              <h4 className="text-xl font-bold text-portal-text-muted">Select a candidate to view profile</h4>
              <p className="text-sm text-portal-text-muted/60 mt-2">Manage their journey through the recruitment funnel.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
