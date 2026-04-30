import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useDivision } from '../../../context/DivisionContext';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Calendar,
  ArrowRight,
  MoreHorizontal,
  FileText,
  Activity,
  Users,
  ChevronLeft,
  ChevronRight,
  Timer,
  Terminal,
  Shield,
  Database,
  Cpu,
  Loader2,
  AlertCircle,
  Link as LinkIcon,
  Rocket,
  ShieldCheck,
  Globe,
  Zap,
  Code2
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as ChartTooltip
} from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import taskService from '../../../services/taskService';
import submissionService from '../../../services/submissionService';
import enrollmentService from '../../../services/enrollmentService';
import { bootcampService } from '../../../services/bootcampService';
import { recruitmentService } from '../../../services/recruitmentService';

// ─── helpers ─────────────────────────────────────────────────────────────────
const fmtDeadline = (date) => {
  if (!date) return '—';
  const d = new Date(date);
  const now = new Date();
  const diffMs = d - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'Overdue';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const isOverdue = (date) => new Date(date) < new Date();

export const StudentDashboard = () => {
  const { user } = useAuth();
  const { activeDivision } = useDivision();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [mySubmissions, setMySubmissions] = useState({});
  const [loadingTasks, setLoadingTasks] = useState(true);

  const divisionThemes = {
    'Development': { icon: Terminal, color: 'text-blue-400', label: 'Dev Node' },
    'Cyber Security': { icon: Shield, color: 'text-red-400', label: 'Sec Ops' },
    'Data Science': { icon: Database, color: 'text-purple-400', label: 'Data Engine' },
    'CP (Competitive Programming)': { icon: Cpu, color: 'text-orange-400', label: 'Algorithmic' }
  };

  const theme = divisionThemes[activeDivision] || divisionThemes['Development'];
  const ThemeIcon = theme.icon;

  const [application, setApplication] = useState(null);
  const [loadingApp, setLoadingApp] = useState(true);

  const [enrollments, setEnrollments] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [otp, setOtp] = useState('');
  const [activating, setActivating] = useState(false);

  const [availableBootcamps, setAvailableBootcamps] = useState([]);
  const [loadingBootcamps, setLoadingBootcamps] = useState(true);
  const [applications, setApplications] = useState([]);

  const fetchEnrollments = useCallback(async () => {
    try {
      setLoadingEnrollments(true);
      const data = await enrollmentService.getMyEnrollments();
      setEnrollments(data.data || []);
    } catch (err) {
      console.error('Failed to fetch enrollments');
    } finally {
      setLoadingEnrollments(false);
    }
  }, []);

  const fetchBootcamps = useCallback(async () => {
    try {
      setLoadingBootcamps(true);
      const [bootcampsData, appsData] = await Promise.all([
        bootcampService.getPublicBootcamps(),
        recruitmentService.getMyApplications()
      ]);
      setAvailableBootcamps(bootcampsData.data || []);
      setApplications(appsData.data || []);
      setApplication(appsData.data && appsData.data.length > 0 ? appsData.data[0] : null);
    } catch (err) {
      console.error('Failed to fetch bootcamps');
    } finally {
      setLoadingBootcamps(false);
      setLoadingApp(false);
    }
  }, []);

  useEffect(() => {
    fetchBootcamps();
    fetchEnrollments();
  }, [fetchBootcamps, fetchEnrollments]);

  // ── Fetch tasks + submissions ───────────────────────────────────────────────
  const fetchTaskData = useCallback(async () => {
    setLoadingTasks(true);
    try {
      const [tasksRes, subsRes] = await Promise.all([
        taskService.getTasks({ division: user?.division }),
        submissionService.getSubmissions(),
      ]);

      const allTasks = tasksRes.data || [];
      const allSubs = subsRes.data || [];

      // Map submissions by taskId
      const subMap = {};
      allSubs.forEach(s => {
        const taskId = s.task?._id || s.task;
        if (taskId) subMap[taskId] = s;
      });

      setTasks(allTasks);
      setMySubmissions(subMap);
    } catch {
      // fail silently — dashboard is secondary
    } finally {
      setLoadingTasks(false);
    }
  }, [user?.division]);

  useEffect(() => { fetchTaskData(); }, [fetchTaskData]);

  // ── Derived stats ───────────────────────────────────────────────────────────
  const total = tasks.length;
  const completed = tasks.filter(t => mySubmissions[t._id]).length;
  const pending = tasks.filter(t => !mySubmissions[t._id] && !isOverdue(t.deadline)).length;
  const overdueCount = tasks.filter(t => !mySubmissions[t._id] && isOverdue(t.deadline)).length;

  const taskStats = [
    { name: 'Completed', value: completed || 0, color: '#10b981' },
    { name: 'Pending', value: pending || 0, color: '#f59e0b' },
    { name: 'Overdue', value: overdueCount || 0, color: '#ef4444' },
  ];

  // Upcoming = not submitted, sorted by deadline ascending, take 3
  const upcomingTasks = tasks
    .filter(t => !mySubmissions[t._id])
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 3);

  const events = [
    { title: 'Advanced React Workshop', type: 'Workshop', date: 'Oct 24, 2026', time: '2:00 PM', attendees: 45 },
    { title: 'Weekly Division Sync', type: 'Meeting', date: 'Oct 26, 2026', time: '10:00 AM', attendees: 12 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-10">
      {/* Priority Action Card — Focus First */}
      {!loadingTasks && upcomingTasks.length > 0 ? (
        <div className="relative p-10 rounded-[40px] bg-gradient-to-br from-portal-accent/20 via-portal-card to-portal-bg border border-portal-accent/20 shadow-2xl overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-portal-accent/5 rounded-full blur-[100px] -mr-48 -mt-48 animate-pulse" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="w-24 h-24 rounded-3xl bg-portal-accent flex items-center justify-center shadow-2xl shadow-portal-accent/30 group-hover:rotate-6 transition-transform duration-500 shrink-0">
              <Zap className="w-12 h-12 text-portal-bg" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                <span className="px-3 py-1 rounded-full bg-portal-accent/10 border border-portal-accent/20 text-[10px] font-black text-portal-accent uppercase tracking-widest">Priority Action</span>
                <span className="text-[10px] font-bold text-red-400 flex items-center gap-1 animate-pulse">
                  <Timer className="w-3 h-3" /> Due {fmtDeadline(upcomingTasks[0].deadline)}
                </span>
              </div>
              <h3 className="text-3xl font-black text-portal-text mb-2 tracking-tight line-clamp-1">{upcomingTasks[0].title}</h3>
              <p className="text-portal-text-muted text-lg max-w-2xl line-clamp-2 opacity-80">
                This is your most urgent task. Complete it to maintain your weekly progress and unlock new modules.
              </p>
            </div>
            
            <button
              onClick={() => navigate('/my-tasks')}
              className="px-10 py-5 bg-portal-accent text-portal-bg rounded-2xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-portal-accent/20 flex items-center gap-3 whitespace-nowrap"
            >
              Start Task
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      ) : (
        !loadingTasks && (
          <div className="p-10 rounded-[40px] bg-green-500/5 border border-green-500/10 text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-2xl font-black text-portal-text mb-2">You're All Caught Up!</h3>
            <p className="text-portal-text-muted">No pending tasks found. Take this time to explore the Member Hub or review previous modules.</p>
          </div>
        )
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Metric Overview - Bento Style */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-portal-card border border-portal-border p-8 rounded-3xl shadow-xl hover:border-portal-accent/30 transition-all group relative overflow-hidden h-full">
            <div className="p-3 rounded-2xl bg-portal-accent/10 text-portal-accent w-fit mb-6">
              <Activity className="w-6 h-6" />
            </div>
            <p className="text-portal-text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-1">Weekly Momentum</p>
            <div className="text-5xl font-black text-portal-text mb-2">
              {loadingTasks ? '...' : `${Math.round((completed / (total || 1)) * 100)}%`}
            </div>
            <p className="text-sm text-portal-text-muted font-bold">
              {completed} of {total} tasks submitted successfully
            </p>
          </div>

          <div className="bg-portal-card border border-portal-border p-8 rounded-3xl shadow-xl hover:border-portal-accent/30 transition-all group relative overflow-hidden h-full">
            <div className="p-3 rounded-2xl bg-red-500/10 text-red-500 w-fit mb-6">
              <Clock className="w-6 h-6" />
            </div>
            <p className="text-portal-text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-1">Overdue Count</p>
            <div className="text-5xl font-black text-portal-text mb-2">
              {loadingTasks ? '...' : overdueCount}
            </div>
            <p className="text-sm text-portal-text-muted font-bold">
              Tasks requiring immediate attention
            </p>
          </div>

          {/* Upcoming Tasks Compact List */}
          <div className="md:col-span-2 bg-portal-card border border-portal-border rounded-3xl p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-portal-text uppercase tracking-widest flex items-center gap-3">
                <FileText className="w-5 h-5 text-portal-accent" />
                Next Up
              </h3>
              <Link to="/my-tasks" className="text-[10px] font-black text-portal-accent hover:text-portal-text transition-colors uppercase tracking-widest">
                Explore All
              </Link>
            </div>
            
            <div className="space-y-4">
              {loadingTasks ? (
                <div className="h-20 animate-pulse bg-portal-input rounded-2xl" />
              ) : upcomingTasks.length === 0 ? (
                <p className="text-center py-4 text-portal-text-muted font-bold italic text-sm">No more tasks on the horizon.</p>
              ) : (
                upcomingTasks.slice(1).map((task) => (
                  <button
                    key={task._id}
                    onClick={() => navigate('/my-tasks')}
                    className="w-full flex items-center justify-between p-5 rounded-2xl bg-portal-input border border-portal-border/50 hover:bg-portal-border transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-portal-accent" />
                      <h4 className="font-bold text-sm text-portal-text group-hover:text-portal-accent transition-colors">{task.title}</h4>
                    </div>
                    <span className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest">{fmtDeadline(task.deadline)}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Stats & Enrollments */}
        <div className="lg:col-span-4 space-y-8">
          {/* Active Status */}
          <div className="bg-portal-card border border-portal-border rounded-3xl p-8 shadow-xl">
             <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-portal-text uppercase tracking-widest">Progress</h3>
            </div>
            <div className="w-full h-[200px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStats.filter(s => s.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {taskStats.filter(s => s.value > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-2xl font-black text-portal-text">{total}</div>
                <div className="text-[8px] text-portal-text-muted uppercase font-black tracking-widest leading-none">Tasks</div>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {taskStats.map((stat, i) => (
                <div key={stat.name} className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2 text-portal-text-muted uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stat.color }} />
                    {stat.name}
                  </div>
                  <span className="text-portal-text">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Enrollments - Clean List */}
          {!loadingEnrollments && enrollments.filter(e => e.is_active).length > 0 && (
            <div className="bg-portal-card border border-portal-border rounded-3xl p-8 shadow-xl">
               <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-portal-text uppercase tracking-widest">Programs</h3>
              </div>
              <div className="space-y-4">
                {enrollments.filter(e => e.is_active).map((enrollment) => (
                  <div key={enrollment._id} className="flex items-center gap-4 p-4 rounded-2xl bg-portal-input border border-portal-border/30">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-portal-text truncate">{enrollment.bootcamp?.name}</p>
                      <p className="text-[10px] text-portal-accent uppercase font-black tracking-wider mt-0.5">Active Student</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Activation Modals */}
      {showOtpModal && selectedEnrollment && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-portal-card border border-portal-border rounded-[40px] p-10 shadow-2xl max-w-md w-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-portal-accent/10 rounded-full blur-3xl -mr-16 -mt-16" />
            
            <div className="text-center mb-10 relative z-10">
              <div className="w-20 h-20 bg-portal-accent/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-portal-accent/10">
                <Rocket className="w-10 h-10 text-portal-accent" />
              </div>
              <h3 className="text-2xl font-black text-portal-text tracking-tight">Activate Program</h3>
              <p className="text-sm text-portal-text-muted mt-3 font-bold opacity-80 leading-relaxed">
                Enter the secret OTP sent to your email to unlock your access to <span className="text-portal-accent">{selectedEnrollment.bootcamp?.name}</span>.
              </p>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!otp.trim()) return;
              try {
                setActivating(true);
                await enrollmentService.activateEnrollment(otp);
                window.location.reload();
              } catch (error) {
                alert('Invalid activation code.');
              } finally {
                setActivating(false);
              }
            }} className="relative z-10">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                className="w-full bg-portal-input border-2 border-portal-border rounded-2xl px-6 py-5 text-portal-text outline-none focus:border-portal-accent transition-all text-center text-4xl font-black tracking-[0.5em] shadow-inner"
                maxLength={6}
                required
              />

              <div className="flex flex-col gap-4 mt-10">
                <button
                  type="submit"
                  disabled={activating || otp.length !== 6}
                  className="w-full py-5 bg-portal-accent text-portal-bg rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-2xl shadow-portal-accent/30"
                >
                  {activating ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Launch Dashboard'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="w-full py-4 text-portal-text-muted font-black text-xs uppercase tracking-widest hover:text-portal-text transition-colors"
                >
                  Go Back
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
