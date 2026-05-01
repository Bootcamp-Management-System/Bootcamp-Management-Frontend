import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  GraduationCap, 
  Users, 
  Calendar, 
  ChevronRight, 
  BarChart3, 
  ArrowUpRight, 
  Clock, 
  UserCheck,
  MoreVertical,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';
import { bootcampService } from '../../../../services/bootcampService';
import { divisionService } from '../../../../services/divisionService';
import { recruitmentService } from '../../../../services/recruitmentService';
import { sessionService } from '../../../../services/sessionService';
import { userService } from '../../../../services/userService';
import { toast } from 'sonner';

// Define Division colors mapping
const DIVISION_COLORS: Record<string, string> = {
  'Development': 'border-blue-500 bg-blue-500/10 text-blue-500',
  'Cyber Security': 'border-red-500 bg-red-500/10 text-red-500',
  'Data Science': 'border-green-500 bg-green-500/10 text-green-500',
  'CPD': 'border-purple-500 bg-purple-500/10 text-purple-500',
  'Competitive Programming': 'border-purple-500 bg-purple-500/10 text-purple-500',
  'default': 'border-slate-500 bg-slate-500/10 text-slate-500'
};

const STATUS_COLORS: Record<string, string> = {
  'Active': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  'Recruiting': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'Completed': 'bg-slate-500/10 text-slate-500 border-slate-500/20',
  'Archived': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  'default': 'bg-slate-500/10 text-slate-500 border-slate-500/20'
};

export function Bootcamps() {
  const [bootcamps, setBootcamps] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [allSessions, setAllSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedBootcamp, setSelectedBootcamp] = useState<any | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bootcampsRes, divisionsRes, appsRes, sessionsRes] = await Promise.all([
        bootcampService.getBootcamps(),
        divisionService.getDivisions(),
        recruitmentService.getApplications(),
        sessionService.getSessions()
      ]);

      setBootcamps(bootcampsRes.data || []);
      setDivisions(divisionsRes.data || []);
      setApplications(appsRes.data || []);
      setAllSessions(sessionsRes.data || []);
    } catch (error) {
      console.error('Error fetching bootcamp data:', error);
      toast.error('Failed to load system-wide bootcamp data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bootcampId: string, newStatus: string) => {
    try {
      await bootcampService.updateBootcamp(bootcampId, { status: newStatus });
      toast.success(`Bootcamp status updated to ${newStatus}`);
      fetchData();
      if (selectedBootcamp?._id === bootcampId) {
        setSelectedBootcamp({ ...selectedBootcamp, status: newStatus });
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getDivisionStyle = (divisionName: string) => {
    return DIVISION_COLORS[divisionName] || DIVISION_COLORS['default'];
  };

  const getStatusStyle = (status: string) => {
    return STATUS_COLORS[status] || STATUS_COLORS['default'];
  };

  const filteredBootcamps = useMemo(() => {
    return bootcamps.filter(b => {
      const divMatch = selectedDivision === 'All' || b.division?.name === selectedDivision || b.division?._id === selectedDivision;
      const statusMatch = selectedStatus === 'All' || b.status === selectedStatus;
      const searchMatch = !searchQuery || b.name?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return divMatch && statusMatch && searchMatch;
    });
  }, [bootcamps, selectedDivision, selectedStatus, searchQuery]);

  const stats = useMemo(() => {
    const totalBootcamps = bootcamps.length;
    const activeCount = bootcamps.filter(b => b.status === 'Active').length;
    const totalApps = applications.length;
    
    return {
      total: totalBootcamps,
      active: activeCount,
      applications: totalApps
    };
  }, [bootcamps, applications]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-portal-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-portal-text-muted animate-pulse">Syncing Master Directory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header & Stats Overview */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-portal-text flex items-center gap-3">
            Bootcamp Command Center
            <span className="text-[10px] bg-portal-accent/10 text-portal-accent px-2 py-0.5 rounded-full uppercase tracking-tighter border border-portal-accent/20">Master Hub</span>
          </h1>
          <p className="text-portal-text-muted mt-1">High-level orchestration and oversight of all training programs.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="px-4 py-2 bg-portal-card border border-portal-border rounded-xl flex items-center gap-3">
            <BarChart3 className="w-4 h-4 text-portal-accent" />
            <div>
              <p className="text-[10px] text-portal-text-muted uppercase font-bold tracking-widest">Global Demand</p>
              <p className="text-sm font-bold text-portal-text">{stats.applications} Applications</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-portal-card border border-portal-border rounded-xl flex items-center gap-3">
            <Activity className="w-4 h-4 text-emerald-500" />
            <div>
              <p className="text-[10px] text-portal-text-muted uppercase font-bold tracking-widest">Active Programs</p>
              <p className="text-sm font-bold text-portal-text">{stats.active} / {stats.total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-portal-card/50 p-4 rounded-2xl border border-portal-border backdrop-blur-sm sticky top-0 z-10">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-portal-text-muted group-focus-within:text-portal-accent transition-colors" />
          <input 
            type="text" 
            placeholder="Search bootcamps..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-portal-input border border-portal-border rounded-xl py-2.5 pl-12 pr-4 text-sm text-portal-text focus:outline-none focus:border-portal-accent transition-all"
          />
        </div>
        
        <div className="relative w-full md:w-64">
          <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-portal-text-muted" />
          <input 
            type="text" 
            placeholder="Find student in bootcamps..." 
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
            className="w-full bg-portal-input border border-portal-border rounded-xl py-2.5 pl-12 pr-4 text-sm text-portal-text focus:outline-none focus:border-portal-accent transition-all"
          />
        </div>

        <div className="flex gap-2">
          <select 
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            className="bg-portal-input border border-portal-border rounded-xl px-4 py-2.5 text-xs font-bold text-portal-text-muted focus:outline-none focus:border-portal-accent cursor-pointer appearance-none"
          >
            <option value="All">All Divisions</option>
            {divisions.map(d => <option key={d._id} value={d.name}>{d.name}</option>)}
          </select>
          
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-portal-input border border-portal-border rounded-xl px-4 py-2.5 text-xs font-bold text-portal-text-muted focus:outline-none focus:border-portal-accent cursor-pointer appearance-none"
          >
            <option value="All">All Statuses</option>
            <option value="Recruiting">Recruiting</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Bootcamp Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredBootcamps.map((bootcamp) => {
            const bootcampApps = applications.filter(a => (a.bootcamp?._id || a.bootcamp) === bootcamp._id);
            const bootcampSessions = allSessions.filter(s => (s.bootcamp?._id || s.bootcamp) === bootcamp._id);
            const completedSessions = bootcampSessions.filter(s => s.status === 'completed' || s.status === 'CONDUCTED');
            
            return (
              <motion.div
                layout
                key={bootcamp._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={cn(
                  "bg-portal-card border-l-4 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden",
                  getDivisionStyle(bootcamp.division?.name)
                )}
              >
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-6">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                    getStatusStyle(bootcamp.status)
                  )}>
                    {bootcamp.status || 'Active'}
                  </span>
                  <button className="p-1 text-portal-text-muted hover:text-portal-text transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-portal-text group-hover:text-portal-accent transition-colors truncate">
                      {bootcamp.name}
                    </h3>
                    <p className="text-[10px] font-black text-portal-text-muted uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                      <GraduationCap className="w-3 h-3" />
                      {bootcamp.division?.name || 'General'}
                    </p>
                  </div>

                  {/* General Progress Meter */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-portal-text-muted uppercase tracking-widest">
                      <span>Curriculum Progress</span>
                      <span>{completedSessions.length} / {bootcampSessions.length || '??'} Sessions</span>
                    </div>
                    <div className="h-1.5 bg-portal-text/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: bootcampSessions.length > 0 ? `${(completedSessions.length / bootcampSessions.length) * 100}%` : '0%' }}
                        className="h-full bg-portal-accent"
                      />
                    </div>
                  </div>

                  {/* High Level Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-portal-bg/50 rounded-xl p-3 border border-portal-border/50">
                      <div className="flex items-center gap-2 text-portal-text-muted mb-1">
                        <Users className="w-3 h-3" />
                        <span className="text-[9px] font-black uppercase tracking-wider">Demand</span>
                      </div>
                      <p className="text-sm font-bold text-portal-text">
                        {bootcampApps.length} <span className="text-[10px] text-portal-text-muted font-normal uppercase ml-1">Apps</span>
                      </p>
                      <div className="mt-1 flex items-center gap-1">
                        <ArrowUpRight className="w-2 h-2 text-emerald-500" />
                        <span className="text-[8px] font-bold text-emerald-500">12% Acceptance</span>
                      </div>
                    </div>
                    
                    <div className="bg-portal-bg/50 rounded-xl p-3 border border-portal-border/50">
                      <div className="flex items-center gap-2 text-portal-text-muted mb-1">
                        <Clock className="w-3 h-3" />
                        <span className="text-[9px] font-black uppercase tracking-wider">Activity</span>
                      </div>
                      <p className="text-sm font-bold text-portal-text">
                        {bootcamp.status === 'Active' ? 'Active' : 'Standby'}
                      </p>
                      <div className="mt-1 flex items-center gap-1">
                        <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", bootcamp.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-500')} />
                        <span className="text-[8px] font-bold text-portal-text-muted uppercase">Updated 2d ago</span>
                      </div>
                    </div>
                  </div>

                  {/* Lead Instructor & Link */}
                  <div className="pt-4 mt-2 border-t border-portal-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-portal-accent/20 flex items-center justify-center text-[10px] font-bold text-portal-accent border border-portal-accent/20 uppercase">
                        {bootcamp.leadInstructor?.name?.substring(0, 1) || 'L'}
                      </div>
                      <div>
                        <p className="text-[9px] text-portal-text-muted font-bold uppercase tracking-tighter">Lead Instructor</p>
                        <p className="text-[10px] font-bold text-portal-text">{bootcamp.leadInstructor?.name || 'TBA'}</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setSelectedBootcamp(bootcamp)}
                      className="flex items-center gap-1 text-[10px] font-black text-portal-accent uppercase tracking-widest hover:translate-x-1 transition-transform"
                    >
                      View Hub <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredBootcamps.length === 0 && !loading && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-portal-card rounded-3xl border-2 border-dashed border-portal-border">
            <GraduationCap className="w-16 h-16 text-portal-text/10 mb-4" />
            <h3 className="text-xl font-bold text-portal-text">No Bootcamps Found</h3>
            <p className="text-portal-text-muted text-sm max-w-xs mx-auto mt-2">
              We couldn't find any training programs matching your current filters.
            </p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedDivision('All'); setSelectedStatus('All'); }}
              className="mt-6 text-portal-accent font-bold text-sm hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Summary Modal */}
      <AnimatePresence>
        {selectedBootcamp && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBootcamp(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-portal-card border border-portal-border rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className={cn("p-8 border-b border-portal-border relative overflow-hidden", getDivisionStyle(selectedBootcamp.division?.name))}>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className={cn("px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border", getStatusStyle(selectedBootcamp.status))}>
                      {selectedBootcamp.status || 'Active'}
                    </span>
                    <button onClick={() => setSelectedBootcamp(null)} className="text-portal-text-muted hover:text-portal-text transition-colors">
                      <ChevronRight className="w-6 h-6 rotate-180" />
                    </button>
                  </div>
                  <h2 className="text-3xl font-black text-portal-text tracking-tight">{selectedBootcamp.name}</h2>
                  <p className="text-portal-text-muted font-medium mt-1 uppercase tracking-widest text-xs">{selectedBootcamp.division?.name} Division Orchestration</p>
                </div>
                {/* Decorative background icon */}
                <GraduationCap className="absolute -right-10 -bottom-10 w-64 h-64 text-portal-accent/5 -rotate-12" />
              </div>

              <div className="p-8 space-y-8">
                {/* Top Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest mb-1">Lead Instructor</p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-portal-accent/10 flex items-center justify-center text-xs font-bold text-portal-accent border border-portal-accent/20">
                        {selectedBootcamp.leadInstructor?.name?.substring(0, 1) || 'L'}
                      </div>
                      <p className="text-sm font-bold text-portal-text">{selectedBootcamp.leadInstructor?.name || 'Not Assigned'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest mb-1">Program Period</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-portal-accent" />
                      <p className="text-sm font-bold text-portal-text">Jan - Apr 2026</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest mb-1">System Health</p>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-500" />
                      <p className="text-sm font-bold text-emerald-500">88% Attendance</p>
                    </div>
                  </div>
                </div>

                {/* Aggregate Metrics Section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-portal-text uppercase tracking-widest border-b border-portal-border pb-2">Master Metrics Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-portal-bg/50 p-4 rounded-2xl border border-portal-border">
                      <div className="flex justify-between items-end mb-2">
                        <div>
                          <p className="text-[9px] font-black text-portal-text-muted uppercase tracking-wider">Recruitment Pipeline</p>
                          <p className="text-2xl font-black text-portal-text">{applications.filter(a => (a.bootcamp?._id || a.bootcamp) === selectedBootcamp._id).length} <span className="text-xs font-normal text-portal-text-muted">Candidates</span></p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black text-emerald-500 uppercase tracking-wider">15% Accept</p>
                          <p className="text-xs font-bold text-portal-text">Selective</p>
                        </div>
                      </div>
                      <div className="h-1.5 bg-portal-text/5 rounded-full overflow-hidden">
                        <div className="h-full w-[15%] bg-emerald-500" />
                      </div>
                    </div>

                    <div className="bg-portal-bg/50 p-4 rounded-2xl border border-portal-border">
                      <div className="flex justify-between items-end mb-2">
                        <div>
                          <p className="text-[9px] font-black text-portal-text-muted uppercase tracking-wider">Curriculum Velocity</p>
                          <p className="text-2xl font-black text-portal-text">{allSessions.filter(s => (s.bootcamp?._id || s.bootcamp) === selectedBootcamp._id && (s.status === 'completed' || s.status === 'CONDUCTED')).length} <span className="text-xs font-normal text-portal-text-muted">Sessions</span></p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black text-portal-accent uppercase tracking-wider">On Track</p>
                          <p className="text-xs font-bold text-portal-text">50% Done</p>
                        </div>
                      </div>
                      <div className="h-1.5 bg-portal-text/5 rounded-full overflow-hidden">
                        <div className="h-full w-1/2 bg-portal-accent" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Orchestration Controls */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-portal-text uppercase tracking-widest border-b border-portal-border pb-2">Global Controls</h3>
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => handleUpdateStatus(selectedBootcamp._id, 'Active')}
                      className={cn(
                        "flex-1 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                        selectedBootcamp.status === 'Active' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-portal-bg border border-portal-border text-portal-text-muted hover:border-emerald-500/50 hover:text-emerald-500'
                      )}
                    >
                      <Activity className="w-4 h-4 mb-1 mx-auto" />
                      Set Active
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(selectedBootcamp._id, 'Recruiting')}
                      className={cn(
                        "flex-1 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                        selectedBootcamp.status === 'Recruiting' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-portal-bg border border-portal-border text-portal-text-muted hover:border-blue-500/50 hover:text-blue-500'
                      )}
                    >
                      <UserCheck className="w-4 h-4 mb-1 mx-auto" />
                      Recruitment
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(selectedBootcamp._id, 'Completed')}
                      className={cn(
                        "flex-1 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                        selectedBootcamp.status === 'Completed' ? 'bg-slate-700 text-white shadow-lg shadow-slate-700/20' : 'bg-portal-bg border border-portal-border text-portal-text-muted hover:border-slate-500/50 hover:text-slate-500'
                      )}
                    >
                      <Clock className="w-4 h-4 mb-1 mx-auto" />
                      Archive
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
