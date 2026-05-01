import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../super-admin/lib/utils';
import {
  Users,
  BookOpen,
  ArrowUpRight,
  ClipboardList,
  UserCheck,
  GraduationCap,
  Activity,
  Layers,
  ChevronRight,
  Clock,
  Target,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { userService } from '../../services/userService';
import { bootcampService } from '../../services/bootcampService';
import { groupService } from '../../services/groupService';
import { sessionService } from '../../services/sessionService';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [counts, setCounts] = React.useState({
    students: 0,
    instructors: 0,
    operations: 0,
    clusters: 0
  });
  const [recentSessions, setRecentSessions] = React.useState([]);
  const [recentBootcamps, setRecentBootcamps] = React.useState([]);

  const currentDivisionId = user?.division?._id || user?.division;
  const currentDivisionName = user?.division?.name || user?.divisionName || 'Division';

  React.useEffect(() => {
    const fetchStats = async () => {
      if (!currentDivisionId) return;
      setLoading(true);
      try {
        const [usersRes, bootcampsRes, groupsRes, sessionsRes] = await Promise.all([
          userService.getUsers(),
          bootcampService.getBootcamps(),
          groupService.getGroups(currentDivisionId),
          sessionService.getSessions({ division: currentDivisionId })
        ]);

        const allUsers = usersRes.data || [];
        const divisionUsers = allUsers.filter(u => {
          const uDivId = u.division?._id || u.division;
          return uDivId === currentDivisionId;
        });

        const divisionBootcamps = (bootcampsRes.data || []).filter(b => {
          const bDivId = b.division?._id || b.division;
          return bDivId === currentDivisionId;
        });

        setCounts({
          students: divisionUsers.filter(u => u.role === 'student').length,
          instructors: divisionUsers.filter(u => u.role === 'instructor').length,
          operations: divisionBootcamps.length,
          clusters: groupsRes.data?.length || 0
        });

        setRecentSessions((sessionsRes.data || []).slice(0, 5));
        setRecentBootcamps(divisionBootcamps.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [currentDivisionId]);

  const stats = [
    { label: "Specialists", value: counts.students, icon: Users, color: "text-blue-400", sub: "Active Students" },
    { label: "Mentors", value: counts.instructors, icon: UserCheck, color: "text-green-400", sub: "Assigned Staff" },
    { label: "Operations", value: counts.operations, icon: BookOpen, color: "text-purple-400", sub: "Active Bootcamps" },
    { label: "Clusters", value: counts.clusters, icon: ClipboardList, color: "text-orange-400", sub: "Research Nodes" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* Tactical Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="px-4 py-1.5 bg-portal-accent/10 border border-portal-accent/30 rounded-full text-[10px] font-black text-portal-accent uppercase tracking-[0.3em] backdrop-blur-md flex items-center gap-2">
            <Activity className="w-3 h-3 animate-pulse" />
            Live Division Protocol
          </div>
        </div>
        <h2 className="text-6xl font-black mb-2 text-portal-text tracking-tighter uppercase italic">
          {currentDivisionName} <span className="text-portal-accent">Command</span>
        </h2>
        <p className="text-xs font-black text-portal-text-muted uppercase tracking-[0.4em] opacity-60">Real-time surveillance & logistics for the sector.</p>
      </motion.header>

      {/* Hero Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-portal-card border border-portal-border p-8 rounded-[2.5rem] shadow-2xl group hover:border-portal-accent/30 transition-all relative overflow-hidden"
          >
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-portal-accent/5 rounded-full blur-3xl group-hover:bg-portal-accent/10 transition-all" />
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className={cn("p-4 rounded-2xl bg-white/5", stat.color)}>
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                Verified
              </div>
            </div>
            
            <h3 className="text-portal-text-muted text-[11px] font-black uppercase tracking-[0.2em] mb-1 relative z-10">{stat.label}</h3>
            <div className="text-6xl font-black text-portal-text tracking-tighter relative z-10 group-hover:scale-105 transition-transform origin-left">
              {loading ? '...' : stat.value}
            </div>
            <p className="text-[9px] font-black text-portal-accent uppercase tracking-widest mt-2 opacity-60">{stat.sub}</p>
            
            <stat.icon className="absolute -right-4 -bottom-4 w-24 h-24 text-portal-text/[0.03] -rotate-12 group-hover:scale-110 transition-transform" />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Active Deployments */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-8 bg-portal-card border border-portal-border rounded-[3rem] p-10 shadow-2xl space-y-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-portal-text uppercase tracking-tight flex items-center gap-4">
                <Layers className="w-7 h-7 text-portal-accent" />
                Active Sector Operations
              </h3>
              <p className="text-xs text-portal-text-muted font-bold uppercase tracking-widest mt-1">Ongoing training and field research nodes.</p>
            </div>
            <Link to="/admin/bootcamps" className="text-[10px] font-black text-portal-accent uppercase tracking-widest hover:translate-x-2 transition-transform flex items-center gap-2">
              All Sectors <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentBootcamps.map((bootcamp, idx) => (
              <div key={idx} className="bg-white/5 border border-white/5 p-6 rounded-3xl group hover:border-portal-accent/30 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                   <div className="w-12 h-12 bg-portal-accent/10 rounded-2xl flex items-center justify-center text-portal-accent">
                      <GraduationCap className="w-6 h-6" />
                   </div>
                   <span className="text-[9px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg">Operational</span>
                </div>
                <h4 className="text-lg font-black text-portal-text uppercase tracking-tight mb-1 group-hover:text-portal-accent transition-colors">{bootcamp.name}</h4>
                <div className="flex items-center gap-3 text-[10px] font-bold text-portal-text-muted uppercase">
                   <Calendar className="w-3 h-3" /> {new Date(bootcamp.startDate).toLocaleDateString()}
                </div>
              </div>
            ))}
            {recentBootcamps.length === 0 && (
              <div className="col-span-full py-16 text-center border-2 border-dashed border-white/5 rounded-[2rem] opacity-30">
                <Target className="w-12 h-12 mx-auto mb-4" />
                <p className="text-xs font-black uppercase tracking-[0.2em]">No Active Operations Intercepted</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Intelligence Stream */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 bg-portal-card border border-portal-border rounded-[3rem] p-10 shadow-2xl flex flex-col"
        >
          <div className="mb-10">
            <h3 className="text-xl font-black text-portal-text uppercase tracking-tight flex items-center gap-3">
              <Clock className="w-6 h-6 text-portal-accent" />
              Recent Logs
            </h3>
            <p className="text-[10px] text-portal-text-muted font-bold uppercase tracking-widest mt-1">Live session activity stream.</p>
          </div>

          <div className="flex-1 space-y-6">
            {recentSessions.map((session, i) => (
              <div key={i} className="relative pl-8 group">
                <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10 group-last:bg-transparent">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-portal-accent shadow-[0_0_8px_rgba(42,177,194,0.8)]" />
                </div>
                <div>
                  <h5 className="text-xs font-black text-portal-text uppercase tracking-tight group-hover:text-portal-accent transition-colors truncate">{session.title}</h5>
                  <div className="flex items-center gap-2 mt-1 text-[9px] font-bold text-portal-text-muted uppercase">
                    <span>{new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>•</span>
                    <span className="text-emerald-400">Synchronized</span>
                  </div>
                </div>
              </div>
            ))}
            {recentSessions.length === 0 && (
              <div className="text-center py-20 opacity-20">
                <Activity className="w-10 h-10 mx-auto mb-4" />
                <p className="text-[9px] font-black uppercase tracking-widest">Awaiting Log Data</p>
              </div>
            )}
          </div>

          <Link to="/admin/sessions" className="mt-10 p-4 bg-white/5 border border-white/10 rounded-2xl text-center text-[10px] font-black text-portal-text uppercase tracking-widest hover:bg-portal-accent hover:text-portal-bg transition-all shadow-lg">
            Access All Intelligence
          </Link>
        </motion.div>
      </div>
    </div>
  );
};
