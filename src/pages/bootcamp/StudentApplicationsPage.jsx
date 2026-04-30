import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Code2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { recruitmentService } from '../../services/recruitmentService';

export const StudentApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await recruitmentService.getMyApplications();
      setApplications(data.data || []);
    } catch (err) {
      console.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return { 
          color: 'text-green-400', 
          bg: 'bg-green-500/10', 
          border: 'border-green-500/20',
          icon: CheckCircle2,
          label: 'Accepted'
        };
      case 'REJECTED':
        return { 
          color: 'text-red-400', 
          bg: 'bg-red-500/10', 
          border: 'border-red-500/20',
          icon: AlertCircle,
          label: 'Rejected'
        };
      case 'WAITLISTED':
        return { 
          color: 'text-yellow-400', 
          bg: 'bg-yellow-500/10', 
          border: 'border-yellow-500/20',
          icon: Clock,
          label: 'Waitlisted'
        };
      case 'SCREENED_ROUND_1':
        return { 
          color: 'text-blue-400', 
          bg: 'bg-blue-500/10', 
          border: 'border-blue-500/20',
          icon: ShieldCheck,
          label: 'Technical Review'
        };
      default:
        return { 
          color: 'text-portal-accent', 
          bg: 'bg-portal-accent/10', 
          border: 'border-portal-accent/20',
          icon: Clock,
          label: 'Pending'
        };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 animate-spin text-portal-accent" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <header className="relative py-12 px-8 bg-portal-card border border-portal-border rounded-[40px] overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-portal-accent/10 rounded-full blur-[80px] -mr-32 -mt-32" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-portal-accent/10 border border-portal-accent/20 rounded-full text-portal-accent text-[10px] font-bold uppercase tracking-widest mb-6">
            <ClipboardList className="w-4 h-4" />
            Application Tracker
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-portal-text tracking-tight mb-4 leading-none">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-portal-accent to-blue-400">Applications</span>
          </h1>
          <p className="text-portal-text-muted text-lg max-w-2xl leading-relaxed">
            Track the status of your bootcamp applications. From submission to acceptance, manage your journey here.
          </p>
        </div>
      </header>

      {/* Applications List */}
      <div className="grid grid-cols-1 gap-6">
        {applications.length > 0 ? (
          applications.map((app) => {
            const config = getStatusConfig(app.status);
            const StatusIcon = config.icon;
            const BootcampIcon = app.bootcampApplied?.toLowerCase().includes('cyber') ? ShieldCheck :
                               app.bootcampApplied?.toLowerCase().includes('web') ? Globe :
                               app.bootcampApplied?.toLowerCase().includes('ai') ? Zap : Code2;

            return (
              <div 
                key={app._id} 
                className="bg-portal-card border border-portal-border rounded-[32px] p-8 shadow-xl hover:border-portal-accent/30 transition-all group overflow-hidden relative"
              >
                <div className={`absolute top-0 right-0 w-1 h-full ${config.color.replace('text-', 'bg-')}`} />
                
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-portal-accent/10 border border-portal-border rounded-2xl flex items-center justify-center shrink-0">
                      <BootcampIcon className="w-8 h-8 text-portal-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-portal-text mb-1">{app.bootcampApplied}</h3>
                      <p className="text-sm text-portal-text-muted uppercase tracking-widest font-bold">
                        Applied on {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-3">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${config.bg} ${config.color} ${config.border} font-bold text-xs uppercase tracking-widest`}>
                      <StatusIcon className="w-4 h-4" />
                      {config.label}
                    </div>
                    
                    {(app.status === 'SCREENED_ROUND_1' || app.status === 'WAITLISTED') && (
                      <button 
                        onClick={() => navigate(`/recruitment/submit/${app._id}`)}
                        className="flex items-center gap-2 text-xs font-bold text-portal-accent hover:text-white transition-colors uppercase tracking-widest group"
                      >
                        Complete Task <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar or additional info if needed */}
                <div className="mt-8 pt-8 border-t border-portal-border/50 flex flex-wrap gap-4 text-[10px] font-black text-portal-text-muted uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    Last Updated: {new Date(app.updatedAt || app.createdAt).toLocaleDateString()}
                  </div>
                  {app.status === 'ACCEPTED' && (
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Enrollment Ready
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center bg-portal-card border border-portal-border border-dashed rounded-[40px]">
            <AlertCircle className="w-16 h-16 text-portal-text-muted mx-auto mb-6 opacity-20" />
            <h3 className="text-2xl font-bold text-portal-text">No applications found.</h3>
            <p className="text-portal-text-muted mt-2">Browse available bootcamps and start your journey today!</p>
            <button 
              onClick={() => navigate('/bootcamps')}
              className="mt-8 px-8 py-3 bg-portal-accent text-portal-bg rounded-xl font-bold hover:scale-105 transition-all"
            >
              Explore Bootcamps
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
