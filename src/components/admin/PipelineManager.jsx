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
    { id: 'ACCEPTED', label: 'Accepted', icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/10' },
    { id: 'REJECTED', label: 'Rejected', icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-portal-card border border-portal-border rounded-3xl p-2 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar p-1">
          {stages.map(stage => (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                activeStage === stage.id 
                  ? `${stage.bg} ${stage.color} border border-${stage.color.split('-')[1]}-400/20` 
                  : 'text-portal-text-muted hover:text-portal-text'
              }`}
            >
              <stage.icon className="w-4 h-4" />
              {stage.label}
              {activeStage === stage.id && (
                <span className={`ml-1 px-2 py-0.5 rounded-md ${stage.bg} text-[10px]`}>
                  {applications.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-portal-card border border-portal-border rounded-3xl opacity-50">
              <Loader2 className="w-10 h-10 animate-spin text-portal-accent mb-4" />
              <p className="text-sm font-bold text-portal-text-muted uppercase tracking-widest uppercase tracking-widest">Fetching Candidates...</p>
            </div>
          ) : applications.length > 0 ? (
            applications.map(app => (
              <div 
                key={app._id}
                onClick={() => setSelectedApp(app)}
                className={`group bg-portal-card border transition-all cursor-pointer rounded-3xl p-6 flex items-center justify-between shadow-lg hover:shadow-portal-accent/5 ${
                  selectedApp?._id === app._id ? 'border-portal-accent' : 'border-portal-border'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-portal-bg border border-portal-border rounded-2xl flex items-center justify-center group-hover:border-portal-accent/30 transition-colors">
                    <Users className="w-6 h-6 text-portal-text-muted group-hover:text-portal-accent transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-bold text-portal-text">{app.student?.name || 'Anonymous Student'}</h4>
                    <p className="text-xs text-portal-text-muted mt-1">{app.student?.email}</p>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 text-portal-text-muted transition-transform ${selectedApp?._id === app._id ? 'rotate-90 text-portal-accent' : ''}`} />
              </div>
            ))
          ) : (
            <div className="py-32 text-center bg-portal-card border border-portal-border rounded-[40px] border-dashed">
              <Users className="w-16 h-16 text-portal-text-muted mx-auto mb-6 opacity-10" />
              <h3 className="text-xl font-bold text-portal-text-muted">No candidates in this stage</h3>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          {selectedApp ? (
            <div className="bg-portal-card border border-portal-border rounded-[40px] p-8 shadow-2xl sticky top-40">
              <div className="text-center mb-10">
                <div className="w-24 h-24 bg-portal-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-portal-accent/20">
                  <Users className="w-10 h-10 text-portal-accent" />
                </div>
                <h3 className="text-2xl font-bold text-portal-text">{selectedApp.student?.name}</h3>
                <p className="text-sm text-portal-text-muted mt-1">{selectedApp.student?.email}</p>
              </div>

              <div className="space-y-4 mb-10 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {selectedApp.phase1Answers && Object.entries(selectedApp.phase1Answers).map(([key, value]) => (
                  <div key={key} className="space-y-1 p-3 bg-portal-bg rounded-xl border border-portal-border">
                    <p className="text-[10px] font-bold text-portal-accent uppercase">{key.replace(/_/g, ' ')}</p>
                    <p className="text-sm text-portal-text">{value || 'N/A'}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {activeStage === 'PENDING' && (
                  <button 
                    onClick={() => handleDecision(selectedApp._id, 'PASS')}
                    disabled={processingId === selectedApp._id}
                    className="w-full py-4 bg-portal-accent text-portal-bg rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50"
                  >
                    {processingId === selectedApp._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                    Move to Technical Phase
                  </button>
                )}
                
                {(activeStage === 'TASK_EVALUATION') && (
                  <button 
                    onClick={() => handleDecision(selectedApp._id, 'ACCEPT')}
                    disabled={processingId === selectedApp._id}
                    className="w-full py-4 bg-green-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50"
                  >
                    {processingId === selectedApp._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Star className="w-5 h-5" />}
                    Accept into Bootcamp
                  </button>
                )}

                <button 
                  onClick={() => handleDecision(selectedApp._id, 'REJECT')}
                  disabled={processingId === selectedApp._id}
                  className="w-full py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                >
                  {processingId === selectedApp._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                  Reject Application
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-portal-card border border-portal-border rounded-[40px] p-12 text-center h-[400px] flex flex-col items-center justify-center opacity-50 border-dashed">
              <Zap className="w-12 h-12 text-portal-accent mb-6 opacity-30" />
              <h4 className="text-lg font-bold text-portal-text-muted">Select a Candidate</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
