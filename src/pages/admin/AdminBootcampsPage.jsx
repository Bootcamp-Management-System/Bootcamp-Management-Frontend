import React, { useState, useEffect, useMemo } from 'react';
import { 
  GraduationCap, 
  ChevronRight, 
  Search, 
  Calendar, 
  Users, 
  ClipboardCheck, 
  MessageSquare, 
  FileText, 
  ArrowRight,
  TrendingUp,
  Layout,
  Clock,
  Shield,
  Zap,
  Star,
  Activity,
  ArrowLeft,
  MoreVertical,
  Layers,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { bootcampService } from '../../services/bootcampService';
import enrollmentService from '../../services/enrollmentService';
import { sessionService } from '../../services/sessionService';
import attendanceService from '../../services/attendanceService';
import taskService from '../../services/taskService';
import feedbackService from '../../services/feedbackService';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../super-admin/lib/utils';
import { DataTable } from '../../components/admin/DataTable';
import submissionService from '../../services/submissionService';

export const AdminBootcampsPage = () => {
  const { user: admin } = useAuth();
  const [bootcamps, setBootcamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Navigation State
  const [currentLevel, setCurrentLevel] = useState('bootcamps'); // 'bootcamps', 'sessions', 'details'
  const [activeSubTab, setActiveSubTab] = useState('sessions'); // 'sessions', 'students', 'instructors'
  const [sessionTab, setSessionTab] = useState('attendance'); // 'attendance', 'tasks', 'grading', 'feedback'
  const [selectedBootcamp, setSelectedBootcamp] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  
  // Data State
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [sessionDetails, setSessionDetails] = useState({
    attendance: [],
    tasks: [],
    feedback: [],
    submissions: []
  });
  const [bootcampGlobalData, setBootcampGlobalData] = useState({
    allSubmissions: [],
    allFeedback: []
  });

  const divisionId = admin?.division?._id || admin?.division || '';

  useEffect(() => {
    fetchBootcamps();
  }, [divisionId]);

  const fetchBootcamps = async () => {
    setLoading(true);
    try {
      const res = await bootcampService.getBootcamps();
      const divBootcamps = res.data.filter(b => {
        const bDivId = b.division?._id || b.division;
        return bDivId === divisionId;
      });
      setBootcamps(divBootcamps);
    } catch (err) {
      console.error("Failed to fetch bootcamps", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBootcamp = async (bootcamp) => {
    setSelectedBootcamp(bootcamp);
    setLoading(true);
    try {
      const [sessionsRes, enrollRes, feedbackRes, submissionsRes] = await Promise.all([
        sessionService.getSessions({ bootcamp: bootcamp._id }),
        enrollmentService.getBootcampEnrollments(bootcamp._id),
        feedbackService.getFeedback({ bootcamp: bootcamp._id }),
        submissionService.getSubmissions({ bootcampId: bootcamp._id })
      ]);
      setSessions(sessionsRes.data || []);
      setStudents(enrollRes.data || []);
      setBootcampGlobalData({
        allFeedback: feedbackRes || [],
        allSubmissions: submissionsRes.data || []
      });
      setCurrentLevel('sessions');
    } catch (err) {
      console.error("Failed to fetch bootcamp details", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSession = async (session) => {
    setSelectedSession(session);
    setLoading(true);
    try {
      const [attendanceRes, tasksRes, feedbackRes] = await Promise.all([
        attendanceService.getAttendance(session._id),
        taskService.getTasks({ session: session._id }),
        feedbackService.getFeedback({ session: session._id })
      ]);
      setSessionDetails({
        attendance: attendanceRes.data || [],
        tasks: tasksRes.data || [],
        feedback: feedbackRes || [],
        submissions: [] // will be filtered from global
      });
      setCurrentLevel('details');
      setSessionTab('attendance');
    } catch (err) {
      console.error("Failed to fetch session details", err);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (currentLevel === 'details') {
      setCurrentLevel('sessions');
      setSelectedSession(null);
    } else if (currentLevel === 'sessions') {
      setCurrentLevel('bootcamps');
      setSelectedBootcamp(null);
    }
  };

  const filteredBootcamps = useMemo(() => {
    return bootcamps.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [bootcamps, searchQuery]);

  if (loading && currentLevel === 'bootcamps') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-portal-accent/20 rounded-full animate-ping absolute inset-0" />
          <div className="w-16 h-16 border-4 border-portal-accent border-t-transparent rounded-full animate-spin relative" />
        </div>
        <p className="text-xs font-black uppercase tracking-[0.4em] text-portal-text-muted animate-pulse">Initializing Command View...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Header with Tactical Breadcrumbs */}
      <header className="space-y-6">
        <div className="flex items-center gap-4">
           {currentLevel !== 'bootcamps' && (
            <button 
              onClick={goBack}
              className="p-3 bg-white/5 border border-white/10 rounded-2xl text-portal-text hover:bg-white/10 hover:scale-105 transition-all shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-4xl font-black text-portal-text tracking-tighter uppercase italic">
                {currentLevel === 'bootcamps' ? 'Operational Sectors' : 
                 currentLevel === 'sessions' ? selectedBootcamp?.name : 
                 selectedSession?.title}
              </h2>
              <div className="px-3 py-1 bg-portal-accent/10 border border-portal-accent/30 rounded-full text-[9px] font-black text-portal-accent uppercase tracking-widest backdrop-blur-md">
                {currentLevel === 'bootcamps' ? 'Division Hub' : 
                 currentLevel === 'sessions' ? 'Sector Map' : 
                 'Intelligence Log'}
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-portal-text-muted uppercase tracking-[0.2em]">
              <Target className="w-3 h-3 text-portal-accent" />
              {currentLevel === 'bootcamps' ? 'Select a Sector to begin surveillance' : 
               currentLevel === 'sessions' ? `Orchestrating ${sessions.length} Sessions` : 
               `Analyzing ${sessionDetails.attendance.length} instructor signatures`}
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {/* BOOTCAMP GRID VIEW */}
        {currentLevel === 'bootcamps' && (
          <motion.div 
            key="bootcamps"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
            {/* Search and Quick Filters */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="relative w-full md:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-portal-text-muted group-focus-within:text-portal-accent transition-colors" />
                <input 
                  type="text" 
                  placeholder="Intercept Sector ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-portal-card border border-portal-border rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-portal-text focus:border-portal-accent transition-all outline-none shadow-xl"
                />
              </div>
              
              <div className="flex items-center gap-4">
                <div className="px-6 py-4 bg-portal-card border border-portal-border rounded-2xl flex items-center gap-4 shadow-xl">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-[10px] text-portal-text-muted font-black uppercase tracking-widest">Active Sectors</p>
                    <p className="text-sm font-black text-portal-text tracking-tight">{bootcamps.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* The Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBootcamps.map((bootcamp) => (
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  key={bootcamp._id}
                  onClick={() => handleSelectBootcamp(bootcamp)}
                  className="bg-portal-card border border-portal-border rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group cursor-pointer hover:border-portal-accent/40 transition-all"
                >
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-portal-accent/5 rounded-full blur-3xl group-hover:bg-portal-accent/10 transition-all" />
                  
                  <div className="relative z-10 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="w-14 h-14 bg-portal-accent/10 rounded-2xl flex items-center justify-center border border-portal-accent/20 group-hover:bg-portal-accent group-hover:text-portal-bg transition-all">
                        <GraduationCap className="w-7 h-7" />
                      </div>
                      <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                        Active Node
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-black text-portal-text tracking-tighter uppercase mb-2 group-hover:text-portal-accent transition-colors">
                        {bootcamp.name}
                      </h3>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-portal-text-muted uppercase tracking-widest">
                        <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {new Date(bootcamp.startDate).toLocaleDateString()}</div>
                        <div className="flex items-center gap-1.5"><Users className="w-3 h-3" /> Division Assets</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-[9px] font-black text-portal-text-muted uppercase tracking-widest">Operational Readiness</span>
                        <span className="text-[10px] font-black text-portal-text italic">85%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div className="h-full w-[85%] bg-portal-accent shadow-[0_0_10px_rgba(42,177,194,0.5)]" />
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-portal-border/50">
                      <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                          <div key={i} className="w-7 h-7 rounded-full bg-portal-bg border-2 border-portal-card flex items-center justify-center text-[8px] font-black text-portal-accent">
                            {i}
                          </div>
                        ))}
                      </div>
                      <div className="text-[10px] font-black text-portal-accent uppercase tracking-[0.2em] flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                        Initialize <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* SESSION GRID VIEW */}
        {currentLevel === 'sessions' && (
          <motion.div 
            key="sessions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
             {/* Sector Command Ribbon (Refined) */}
             <div className="flex flex-col md:flex-row gap-6 items-stretch justify-center">
                <div className="bg-portal-card border border-portal-border p-1.5 rounded-[2rem] flex items-center gap-1 shadow-2xl">
                    {[
                      { id: 'sessions', label: 'Sessions', icon: Layers },
                      { id: 'students', label: 'Students', icon: GraduationCap },
                      { id: 'instructors', label: 'Instructors', icon: Users }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id)}
                        className={cn(
                          "px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 h-full",
                          activeSubTab === tab.id 
                            ? "bg-portal-accent text-portal-bg shadow-lg shadow-portal-accent/20" 
                            : "text-portal-text-muted hover:bg-white/5 hover:text-portal-text"
                        )}
                      >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    ))}
                </div>
             </div>

             {/* Sub-Tab Content */}
             <AnimatePresence mode="wait">
               {activeSubTab === 'sessions' ? (
                 <motion.div 
                    key="session-grid"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                 >
                    {sessions.map((session, idx) => (
                      <motion.div
                        key={session._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => handleSelectSession(session)}
                        className="bg-portal-card border border-portal-border rounded-3xl p-6 shadow-xl relative group cursor-pointer hover:border-portal-accent/30 overflow-hidden"
                      >
                        <div className="relative z-10 space-y-4">
                          <div className="flex justify-between items-center">
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                              session.status === 'completed' ? "bg-green-500/10 text-green-400" : "bg-portal-accent/10 text-portal-accent"
                            )}>
                              <Zap className="w-5 h-5" />
                            </div>
                            <span className={cn(
                              "text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md border",
                              session.status === 'completed' ? "bg-green-500/5 border-green-500/20 text-green-400" : "bg-portal-accent/5 border-portal-accent/20 text-portal-accent"
                            )}>
                              {session.status}
                            </span>
                          </div>
                          
                          <div>
                            <h4 className="text-lg font-black text-portal-text uppercase tracking-tight group-hover:text-portal-accent transition-colors truncate">
                              {session.title}
                            </h4>
                            <div className="flex items-center gap-3 mt-1 text-[9px] font-bold text-portal-text-muted uppercase">
                              <Clock className="w-3 h-3" /> {new Date(session.startTime).toLocaleDateString()} • {session.location || "Sector Node"}
                            </div>
                          </div>

                          <div className="pt-4 flex items-center justify-between border-t border-white/5">
                             <div className="text-[10px] font-black text-portal-text-muted uppercase">
                                Report <span className="text-portal-text">Available</span>
                             </div>
                             <ChevronRight className="w-4 h-4 text-portal-text-muted opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                 </motion.div>
               ) : activeSubTab === 'students' ? (
                 <motion.div 
                    key="student-registry"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-portal-card border border-portal-border rounded-[2.5rem] overflow-hidden shadow-2xl"
                 >
                    <DataTable 
                      columns={[
                        { 
                          header: 'Student Profile', 
                          render: (row) => (
                            <div className="flex items-center gap-3 py-3">
                              <div className="w-10 h-10 rounded-full bg-portal-accent/10 flex items-center justify-center font-bold text-portal-accent border border-portal-accent/20">
                                {row.student?.name?.charAt(0)}
                              </div>
                              <div>
                                <div className="text-sm font-bold text-portal-text">{row.student?.name}</div>
                                <div className="text-[10px] text-portal-text-muted">{row.student?.email}</div>
                              </div>
                            </div>
                          )
                        },
                        { 
                          header: 'Campus Node', 
                          render: (row) => <span className="text-[10px] font-mono text-portal-accent uppercase">{row.student?.campusId || "External"}</span>
                        },
                        { 
                          header: 'Enrollment Status', 
                          render: (row) => (
                            <span className={cn(
                              "text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border",
                              row.is_active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                            )}>
                              {row.is_active ? 'Accepted' : 'Pending Verification'}
                            </span>
                          )
                        }
                      ]}
                      data={students}
                      searchPlaceholder="Trace Students..."
                    />
                 </motion.div>
                ) : (
                 <motion.div 
                    key="instructor-hub"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-portal-card border border-portal-border rounded-[2.5rem] p-16 text-center shadow-2xl"
                 >
                    <Users className="w-16 h-16 mx-auto mb-6 text-portal-accent/30" />
                    <h3 className="text-xl font-black text-portal-text uppercase tracking-widest italic">Instructor Node</h3>
                    <p className="text-xs text-portal-text-muted max-w-sm mx-auto mt-2 font-bold uppercase tracking-[0.2em] leading-loose opacity-60">
                      Sector Staff will be synchronized here.
                    </p>
                 </motion.div>
               )}
             </AnimatePresence>
          </motion.div>
        )}

        {/* DEEP DETAIL VIEW */}
        {currentLevel === 'details' && (
          <motion.div 
            key="details"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8"
          >
             {/* Session Tab Switcher */}
             <div className="flex justify-center">
                <div className="bg-portal-card border border-portal-border p-1 rounded-2xl flex items-center gap-1 shadow-xl">
                  {[
                    { id: 'attendance', label: 'Attendance', icon: ClipboardCheck },
                    { id: 'tasks', label: 'Tasks', icon: FileText },
                    { id: 'grading', label: 'Grading', icon: TrendingUp },
                    { id: 'feedback', label: 'Feedback', icon: MessageSquare }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setSessionTab(tab.id)}
                      className={cn(
                        "px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                        sessionTab === tab.id ? "bg-portal-accent text-portal-bg" : "text-portal-text-muted hover:text-portal-text"
                      )}
                    >
                      <tab.icon className="w-3 h-3" />
                      {tab.label}
                    </button>
                  ))}
                </div>
             </div>

             <AnimatePresence mode="wait">
                {sessionTab === 'attendance' ? (
                  <motion.div 
                    key="attendance"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-portal-card border border-portal-border rounded-[2.5rem] overflow-hidden shadow-2xl"
                  >
                    <DataTable 
                      columns={[
                        { 
                          header: 'Instructor Profile', 
                          render: (row) => (
                            <div className="flex items-center gap-3 py-2">
                              <div className="w-10 h-10 rounded-full bg-portal-accent/10 border border-portal-accent/20 flex items-center justify-center text-xs font-bold text-portal-accent">
                                {row.student?.name?.charAt(0)}
                              </div>
                              <div>
                                <div className="text-xs font-black text-portal-text uppercase tracking-tight">{row.student?.name}</div>
                                <div className="text-[9px] text-portal-text-muted">{row.student?.email}</div>
                              </div>
                            </div>
                          )
                        },
                        { 
                          header: 'Presence Protocol', 
                          render: (row) => {
                            const att = sessionDetails.attendance.find(a => a.student?._id === row.student?._id);
                            return (
                              <span className={cn(
                                "text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border",
                                att?.status === 'present' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                              )}>
                                {att?.status || 'Offline'}
                              </span>
                            )
                          }
                        }
                      ]}
                      data={students}
                      searchPlaceholder="Locate Instructor..."
                    />
                  </motion.div>
                ) : sessionTab === 'tasks' ? (
                  <motion.div key="tasks" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sessionDetails.tasks.map((task, idx) => (
                      <div key={idx} className="bg-portal-card border border-portal-border p-6 rounded-3xl shadow-xl space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-lg font-black text-portal-text uppercase tracking-tight">{task.title}</h4>
                          <span className="px-3 py-1 bg-portal-accent/10 text-portal-accent text-[8px] font-black uppercase rounded-lg border border-portal-accent/20">Task Node</span>
                        </div>
                        <p className="text-xs text-portal-text-muted line-clamp-2 italic">{task.description}</p>
                        <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[9px] font-black text-portal-text-muted uppercase">
                          <span>Deadline: {new Date(task.deadline).toLocaleDateString()}</span>
                          <span className="text-portal-accent">Surveillance Active</span>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                ) : sessionTab === 'grading' ? (
                  <motion.div key="grading" className="bg-portal-card border border-portal-border rounded-[2.5rem] overflow-hidden shadow-2xl">
                     <DataTable 
                      columns={[
                        { header: 'Instructor', render: (row) => <span className="text-xs font-black text-portal-text uppercase">{row.student?.name}</span> },
                        { header: 'Payload (Task)', render: (row) => <span className="text-xs text-portal-text-muted">{row.task?.title}</span> },
                        { header: 'Grade', render: (row) => <span className="text-xs font-black text-portal-accent italic">{row.grade || 'Pending'} / 100</span> }
                      ]}
                      data={bootcampGlobalData.allSubmissions.filter(s => s.session === selectedSession?._id)}
                      searchPlaceholder="Audit Grades..."
                    />
                  </motion.div>
                ) : (
                  <motion.div key="feedback" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sessionDetails.feedback.map((f, i) => (
                      <div key={i} className="bg-portal-card border border-portal-border p-6 rounded-3xl space-y-4 hover:border-portal-accent/30 transition-all group">
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, idx) => (
                                <Star key={idx} className={cn("w-3 h-3", idx < f.rating ? "text-yellow-500 fill-yellow-500" : "text-white/10")} />
                              ))}
                           </div>
                           <span className="text-[9px] font-black text-portal-text-muted uppercase tracking-tighter">Verified</span>
                        </div>
                        <p className="text-sm text-portal-text-muted leading-relaxed italic border-l-2 border-portal-accent/20 pl-4 py-1 group-hover:border-portal-accent transition-all">
                          "{f.comment || 'No textual feedback captured.'}"
                        </p>
                      </div>
                    ))}
                  </motion.div>
                )}
             </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
