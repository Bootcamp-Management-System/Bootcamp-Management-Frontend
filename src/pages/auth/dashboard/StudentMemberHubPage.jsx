import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { 
  Layers, 
  ChevronRight, 
  Shield, 
  Terminal, 
  Database, 
  Cpu, 
  Rocket, 
  MessageSquare, 
  FileText, 
  Users,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { bootcampService } from '../../../services/bootcampService';
import enrollmentService from '../../../services/enrollmentService';

export const StudentMemberHubPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeDivision, setActiveDivision] = useState(null);
  const [internalBootcamps, setInternalBootcamps] = useState([]);
  const [loadingBootcamps, setLoadingBootcamps] = useState(false);
  const [enrollingId, setEnrollingId] = useState('');
  const [toast, setToast] = useState(null);

  // Filter divisions where the user is actually a member
  // user.memberships looks like [{ division: { name: '...', _id: '...' }, isMember: true }]
  const myMemberships = user?.memberships?.filter(m => m.isMember) || [];
  
  const divisionThemes = {
    'Development': { icon: Terminal, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
    'Cyber Security': { icon: Shield, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
    'Data Science': { icon: Database, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
    'CP (Competitive Programming)': { icon: Cpu, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const divisionId = activeDivision?.division?._id || activeDivision?.division;
    if (!divisionId) return;

    const loadInternalBootcamps = async () => {
      setLoadingBootcamps(true);
      try {
        const response = await bootcampService.getInternalBootcamps(divisionId);
        setInternalBootcamps(response.data || []);
      } catch (error) {
        setInternalBootcamps([]);
        showToast('error', error?.response?.data?.message || 'Failed to load internal bootcamps.');
      } finally {
        setLoadingBootcamps(false);
      }
    };

    loadInternalBootcamps();
  }, [activeDivision]);

  const enrollInternal = async (bootcampId) => {
    setEnrollingId(bootcampId);
    try {
      await enrollmentService.enrollInternalBootcamp(bootcampId);
      showToast('success', 'Enrolled successfully.');
      navigate(`/enrollments/${bootcampId}`);
    } catch (error) {
      showToast('error', error?.response?.data?.error || 'Enrollment failed.');
    } finally {
      setEnrollingId('');
    }
  };

  const renderDivisionContent = (membership) => {
    const divisionName = membership.division?.name || membership.division;
    const theme = divisionThemes[divisionName] || divisionThemes['Development'];
    const Icon = theme.icon;

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className={`p-8 rounded-[40px] bg-portal-card border ${theme.border} shadow-2xl relative overflow-hidden`}>
          <div className={`absolute top-0 right-0 w-64 h-64 ${theme.bg} rounded-full blur-[100px] -mr-32 -mt-32`} />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className={`w-20 h-20 rounded-3xl ${theme.bg} flex items-center justify-center`}>
                <Icon className={`w-10 h-10 ${theme.color}`} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${theme.color}`}>Official Member</span>
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                </div>
                <h2 className="text-3xl font-black text-portal-text tracking-tight">{divisionName}</h2>
              </div>
            </div>
            
            <button 
              onClick={() => setActiveDivision(null)}
              className="px-6 py-3 bg-portal-input border border-portal-border text-portal-text-muted rounded-xl font-bold hover:text-portal-text transition-colors text-xs uppercase tracking-widest"
            >
              Back to Hub
            </button>
          </div>
        </div>

        <div className="bg-portal-card border border-portal-border rounded-[32px] p-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-portal-text">Internal Bootcamps</h3>
              <p className="text-sm text-portal-text-muted mt-1">Member-only programs for your division. Enroll directly without an application.</p>
            </div>
          </div>

          {loadingBootcamps ? (
            <p className="text-sm text-portal-text-muted">Loading internal bootcamps...</p>
          ) : internalBootcamps.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-portal-border p-8 text-center text-sm text-portal-text-muted">
              No internal bootcamps are available for this division yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {internalBootcamps.map((bootcamp) => (
                <div key={bootcamp._id} className="rounded-2xl bg-portal-input border border-portal-border p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-portal-accent mb-2">Internal</p>
                      <h4 className="font-black text-portal-text">{bootcamp.name}</h4>
                      <p className="text-sm text-portal-text-muted mt-2 line-clamp-3">{bootcamp.description || 'Member-only learning program.'}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={enrollingId === bootcamp._id}
                    onClick={() => enrollInternal(bootcamp._id)}
                    className="mt-5 w-full rounded-xl bg-portal-accent px-4 py-3 text-sm font-black text-portal-bg hover:bg-portal-accent-hover disabled:opacity-60"
                  >
                    {enrollingId === bootcamp._id ? 'Enrolling...' : 'Enroll Now'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-portal-card border border-portal-border p-6 rounded-[32px] hover:border-portal-accent/30 transition-all cursor-pointer group">
            <div className="w-12 h-12 bg-portal-accent/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-portal-accent/20 transition-colors">
              <MessageSquare className="w-6 h-6 text-portal-accent" />
            </div>
            <h3 className="font-bold text-portal-text mb-2">Division Chat</h3>
            <p className="text-xs text-portal-text-muted">Connect with other permanent members and mentors.</p>
          </div>
          
          <div className="bg-portal-card border border-portal-border p-6 rounded-[32px] hover:border-portal-accent/30 transition-all cursor-pointer group">
            <div className="w-12 h-12 bg-portal-accent/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-portal-accent/20 transition-colors">
              <FileText className="w-6 h-6 text-portal-accent" />
            </div>
            <h3 className="font-bold text-portal-text mb-2">Internal Resources</h3>
            <p className="text-xs text-portal-text-muted">Exclusive documentation and division assets.</p>
          </div>

          <div className="bg-portal-card border border-portal-border p-6 rounded-[32px] hover:border-portal-accent/30 transition-all cursor-pointer group">
            <div className="w-12 h-12 bg-portal-accent/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-portal-accent/20 transition-colors">
              <Users className="w-6 h-6 text-portal-accent" />
            </div>
            <h3 className="font-bold text-portal-text mb-2">Team Directory</h3>
            <p className="text-xs text-portal-text-muted">Meet the experts and leaders in your division.</p>
          </div>
        </div>

        <div className="bg-portal-card border border-portal-border rounded-[32px] p-8">
          <h3 className="text-lg font-bold text-portal-text mb-6">Division Announcements</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-portal-input border border-portal-border/50">
              <span className="text-[10px] font-bold text-portal-accent uppercase tracking-widest">New</span>
              <h4 className="font-bold text-sm mt-1">Division Meeting scheduled for next Saturday.</h4>
              <p className="text-xs text-portal-text-muted mt-1">Agenda: Project planning for the next quarter.</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {toast && (
        <div className={`fixed top-6 right-6 z-[200] rounded-xl border px-5 py-3 text-sm font-bold shadow-xl ${toast.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
          {toast.message}
        </div>
      )}
      <AnimatePresence mode="wait">
        {!activeDivision ? (
          <motion.div 
            key="hub-main"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8"
          >
            <header className="relative py-12 px-8 bg-portal-card border border-portal-border rounded-[40px] overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-portal-accent/10 rounded-full blur-[80px] -mr-32 -mt-32" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-portal-accent/10 border border-portal-accent/20 rounded-full text-portal-accent text-[10px] font-bold uppercase tracking-widest mb-6">
                  <Layers className="w-4 h-4" />
                  Exclusive Member Access
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-portal-text tracking-tight mb-4 leading-none">
                  Member <span className="text-transparent bg-clip-text bg-gradient-to-r from-portal-accent to-blue-400">Hub</span>
                </h1>
                <p className="text-portal-text-muted text-lg max-w-2xl leading-relaxed">
                  Welcome back, {user?.name}. You have earned permanent access to the following divisions. Select one to enter your command center.
                </p>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {myMemberships.length > 0 ? (
                myMemberships.map((membership) => {
                  const divName = membership.division?.name || membership.division;
                  const theme = divisionThemes[divName] || divisionThemes['Development'];
                  const Icon = theme.icon;

                  return (
                    <motion.div
                      key={divName}
                      whileHover={{ y: -10 }}
                      onClick={() => setActiveDivision(membership)}
                      className="group relative bg-portal-card border border-portal-border rounded-[40px] p-8 shadow-xl transition-all cursor-pointer overflow-hidden"
                    >
                      <div className={`absolute -bottom-10 -right-10 w-32 h-32 ${theme.bg} rounded-full blur-[50px] group-hover:bg-portal-accent/10 transition-all`} />
                      
                      <div className={`w-14 h-14 ${theme.bg} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-7 h-7 ${theme.color}`} />
                      </div>

                      <h3 className="text-2xl font-bold text-portal-text mb-2 group-hover:text-portal-accent transition-colors">
                        {divName}
                      </h3>
                      <p className="text-portal-text-muted text-sm mb-8">
                        Access your permanent member resources and division tools.
                      </p>

                      <div className="flex items-center justify-between text-[10px] font-bold text-portal-accent uppercase tracking-widest pt-6 border-t border-portal-border/50">
                        <span>Enter Hub</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="col-span-full py-20 text-center bg-portal-card border border-portal-border border-dashed rounded-[40px]">
                  <Layers className="w-16 h-16 text-portal-text-muted mx-auto mb-6 opacity-20" />
                  <h3 className="text-2xl font-bold text-portal-text">No active memberships found.</h3>
                  <p className="text-portal-text-muted mt-2">Finish a bootcamp and get accepted to unlock your division hub.</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          renderDivisionContent(activeDivision)
        )}
      </AnimatePresence>
    </div>
  );
};
