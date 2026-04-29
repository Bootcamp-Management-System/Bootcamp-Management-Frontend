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
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <header className="mb-2 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-portal-text">Welcome back, {user?.name || user?.email?.split('@')[0]}!</h2>
          <p className="text-portal-text-muted">Stay updated with your bootcamp activities and tasks.</p>
        </div>
        <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl bg-portal-card border ${theme.color.replace('text-', 'border-')}/30 shadow-xl`}>
          <div className={`p-2 rounded-xl ${theme.color.replace('text-', 'bg-')}/10 ${theme.color}`}>
            <ThemeIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest leading-none mb-1">Active context</p>
            <p className={`text-sm font-bold ${theme.color}`}>{activeDivision}</p>
          </div>
        </div>
      </header>

      {/* No Application CTA */}
      {!application && !loadingApp && availableBootcamps.length === 0 && !loadingBootcamps && (
        <div className="relative p-10 rounded-[40px] bg-gradient-to-br from-portal-accent/20 via-portal-bg to-portal-accent/5 border border-portal-accent/20 shadow-2xl overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-portal-accent/10 rounded-full blur-[100px] -mr-48 -mt-48 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] -ml-32 -mb-32" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 rounded-[24px] bg-portal-accent flex items-center justify-center shadow-2xl shadow-portal-accent/30 group-hover:scale-110 transition-transform duration-500">
              <Rocket className="w-10 h-10 text-portal-bg" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-3xl font-black text-portal-text mb-2 tracking-tight">Ready to launch your career?</h3>
              <p className="text-portal-text-muted text-lg max-w-xl">
                You haven't joined any active programs yet. Explore our elite bootcamps across Web, Cyber, AI, and more.
              </p>
            </div>
            <button
              onClick={() => navigate('/bootcamps')}
              className="px-10 py-5 bg-portal-accent text-portal-bg rounded-2xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-portal-accent/20 flex items-center gap-3 whitespace-nowrap"
            >
              Explore Bootcamps
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Application Status Alerts */}
      {application && application.status !== 'ACCEPTED' && (
        <div className={`p-8 rounded-[32px] border ${application.status === 'REJECTED' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-portal-accent/10 border-portal-accent/20 text-portal-accent'} shadow-2xl animate-in fade-in slide-in-from-top-4 duration-700`}>
          <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${application.status === 'REJECTED' ? 'bg-red-500/20' : 'bg-portal-accent/20'}`}>
              {application.status === 'REJECTED' ? <AlertCircle className="w-8 h-8" /> : <Clock className="w-8 h-8 animate-pulse" />}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">
                {application.status === 'PENDING' && "Application Under Review"}
                {application.status === 'SCREENED_ROUND_1' && "Technical Task Assigned"}
                {application.status === 'WAITLISTED' && "Waitlisted: Additional Task Required"}
                {application.status === 'REJECTED' && "Application Update"}
              </h3>
              <p className="text-sm opacity-80">
                {application.status === 'PENDING' && `Your request to join the ${application.bootcampApplied} bootcamp is being processed by the admins.`}
                {application.status === 'SCREENED_ROUND_1' && "Great news! You've passed the initial screening. Please complete the technical task below."}
                {application.status === 'WAITLISTED' && "You are currently on the waitlist. Please complete the additional task to improve your chances."}
                {application.status === 'REJECTED' && "Sorry for this time... We've reviewed your application and cannot move forward at this moment."}
              </p>
            </div>
            {(application.status === 'SCREENED_ROUND_1' || application.status === 'WAITLISTED') && (
              <button
                onClick={() => navigate(`/recruitment/submit/${application._id}`)}
                className="px-6 py-3 bg-portal-accent text-portal-bg rounded-xl font-bold hover:scale-105 transition-all"
              >
                Complete Recruitment Task
              </button>
            )}
          </div>
        </div>
      )}

      {application?.status === 'ACCEPTED' && !user?.division && (
        <div className="p-8 rounded-[32px] bg-green-500/10 border border-green-500/20 text-green-400 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">Congragulatio! 🎉</h3>
              <p className="text-sm opacity-80">You have been officially selected for the bootcamp. Welcome to the student dashboard!</p>
            </div>
            <button onClick={() => window.location.reload()} className="px-6 py-3 bg-green-500 text-white rounded-xl font-bold hover:scale-105 transition-all">Unlock Dashboard</button>
          </div>
        </div>
      )}

      {/* Pending Enrollments */}
      {!loadingEnrollments && enrollments.filter(e => !e.is_active).length > 0 && (
        <div className="p-8 rounded-[32px] bg-blue-500/10 border border-blue-500/20 text-blue-400 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center">
              <Rocket className="w-8 h-8 animate-pulse" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">Enrollment Pending Activation</h3>
              <p className="text-sm opacity-80">
                You have been accepted into a bootcamp! Check your email for the activation OTP to complete enrollment.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedEnrollment(enrollments.find(e => !e.is_active));
                setShowOtpModal(true);
              }}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl font-bold hover:scale-105 transition-all"
            >
              Activate Now
            </button>
          </div>
        </div>
      )}

      {/* Stats and Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns Container */}
        <div className="lg:col-span-2 space-y-8">
          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Total Tasks */}
            <div className="bg-portal-card border border-portal-border p-8 rounded-3xl shadow-xl hover:border-portal-accent/30 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <FileText className="w-24 h-24 text-portal-accent" />
              </div>
              <div className="relative z-10">
                <div className="p-3 rounded-2xl bg-portal-accent/10 text-portal-accent w-fit mb-6">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-portal-text-muted text-sm font-bold uppercase tracking-widest mb-1">Total Tasks</h3>
                <div className="text-4xl font-bold text-portal-text mb-2">
                  {loadingTasks ? <Loader2 className="w-6 h-6 animate-spin text-portal-accent" /> : total}
                </div>
                <p className="text-xs text-portal-text-muted">
                  {loadingTasks ? '' : `${pending} pending, ${overdueCount} overdue`}
                </p>
              </div>
            </div>

            {/* Completed Tasks */}
            <div className="bg-portal-card border border-portal-border p-8 rounded-3xl shadow-xl hover:border-portal-accent/30 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <CheckCircle2 className="w-24 h-24 text-green-400" />
              </div>
              <div className="relative z-10">
                <div className="p-3 rounded-2xl bg-green-400/10 text-green-400 w-fit mb-6">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-portal-text-muted text-sm font-bold uppercase tracking-widest mb-1">Completed Tasks</h3>
                <div className="text-4xl font-bold text-portal-text mb-2">
                  {loadingTasks ? <Loader2 className="w-6 h-6 animate-spin text-green-400" /> : completed}
                </div>
                <p className="text-xs text-portal-text-muted">
                  {loadingTasks ? '' : total > 0 ? `${Math.round((completed / total) * 100)}% of total assigned` : 'No tasks yet'}
                </p>
              </div>
            </div>
          </div>

          {/* Upcoming Tasks — LIVE */}
          <div className="bg-portal-card border border-portal-border p-8 rounded-3xl shadow-xl hover:border-portal-accent/30 transition-all">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-portal-text flex items-center gap-3">
                <FileText className="w-6 h-6 text-portal-accent" />
                Upcoming Tasks
              </h3>
              <Link
                to="/my-tasks"
                className="text-xs font-bold text-portal-accent flex items-center gap-1 hover:text-portal-text transition-colors uppercase tracking-widest"
              >
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {loadingTasks ? (
              <div className="flex items-center gap-2 text-portal-text-muted text-sm py-4">
                <Loader2 className="w-4 h-4 animate-spin text-portal-accent" /> Loading tasks…
              </div>
            ) : upcomingTasks.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center text-portal-text-muted">
                <CheckCircle2 className="w-8 h-8 text-green-400/40" />
                <p className="text-sm font-semibold">
                  {total === 0 ? 'No tasks assigned yet' : 'All tasks submitted! 🎉'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingTasks.map((task) => {
                  const overdue = isOverdue(task.deadline);
                  return (
                    <button
                      key={task._id}
                      onClick={() => navigate('/my-tasks')}
                      className="w-full flex items-center justify-between p-4 rounded-2xl bg-portal-input border border-portal-border/50 hover:bg-portal-border transition-colors group cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${overdue ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-portal-accent shadow-[0_0_8px_rgba(45,212,191,0.4)]'}`} />
                        <div>
                          <h4 className="font-bold text-sm text-portal-text group-hover:text-portal-accent transition-colors line-clamp-1">{task.title}</h4>
                          <p className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${overdue ? 'text-red-400' : 'text-portal-text-muted'}`}>
                            Deadline: {fmtDeadline(task.deadline)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${overdue ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-white/5 text-portal-text-muted border-white/5'}`}>
                          {overdue ? 'Overdue' : 'Open'}
                        </span>
                        <ArrowRight className="w-4 h-4 text-portal-text-muted group-hover:text-portal-accent transition-colors" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column — Task Analysis Chart LIVE */}
        <div className="space-y-8">
          <div className="bg-portal-card border border-portal-border rounded-3xl p-8 shadow-xl flex flex-col items-center">
            <h3 className="text-lg font-bold text-portal-text mb-8 self-start flex items-center gap-3">
              <Activity className="w-5 h-5 text-portal-accent" />
              Task Analysis
            </h3>

            {loadingTasks ? (
              <div className="flex items-center justify-center h-[240px] text-portal-text-muted">
                <Loader2 className="w-8 h-8 animate-spin text-portal-accent" />
              </div>
            ) : total === 0 ? (
              <div className="flex flex-col items-center justify-center h-[240px] text-portal-text-muted gap-2">
                <AlertCircle className="w-8 h-8 text-portal-accent/30" />
                <p className="text-sm">No data yet</p>
              </div>
            ) : (
              <>
                <div className="w-full h-[240px] relative mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taskStats.filter(s => s.value > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="none"
                      >
                        {taskStats.filter(s => s.value > 0).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        contentStyle={{ backgroundColor: '#06111a', border: '1px solid #1a2e3b', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    <div className="text-3xl font-extrabold text-portal-text">{total}</div>
                    <div className="text-[10px] text-portal-text-muted uppercase font-bold tracking-widest">Total</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full">
                  {taskStats.map((stat, i) => (
                    <div key={i} className="flex items-center gap-3 bg-portal-input p-3 rounded-2xl border border-portal-border/30">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: stat.color }} />
                      <div>
                        <div className="text-[10px] text-portal-text-muted font-bold uppercase">{stat.name}</div>
                        <div className="text-sm font-bold text-portal-text">{stat.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Events and Attendance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Events */}
        <div className="lg:col-span-2 bg-portal-card border border-portal-border rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-portal-text flex items-center gap-3">
              <Calendar className="w-6 h-6 text-portal-accent" />
              Bootcamp Events
            </h3>
            <button className="text-sm font-bold text-portal-accent hover:text-portal-text transition-colors uppercase tracking-widest flex items-center gap-2 group">
              See More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.slice(0, 2).map((event, i) => (
              <div key={i} className="bg-portal-input border border-portal-border/50 p-6 rounded-2xl hover:border-portal-accent/30 transition-all group relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-portal-accent/5 rounded-full blur-2xl group-hover:bg-portal-accent/10 transition-colors" />
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-portal-accent/10 text-portal-accent uppercase tracking-widest">
                    {event.type}
                  </span>
                  <span className="text-[10px] font-bold text-portal-text-muted uppercase tracking-widest">
                    {event.attendees} Attending
                  </span>
                </div>
                <h4 className="text-lg font-bold text-portal-text mb-2 group-hover:text-portal-accent transition-colors">
                  {event.title}
                </h4>
                <div className="flex flex-col gap-1 text-xs text-portal-text-muted font-medium mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-portal-accent" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-portal-accent" />
                    {event.time}
                  </div>
                </div>
                <button className="w-full py-2 bg-white/5 text-white text-xs font-bold rounded-xl border border-white/5 hover:bg-portal-accent hover:border-portal-accent transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Join Event
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Tracker */}
        <div className="bg-portal-card border border-portal-border rounded-3xl overflow-hidden shadow-xl flex flex-col">
          <div className="bg-portal-accent p-6 relative overflow-hidden shrink-0">
            <div className="absolute top-1/2 left-6 -translate-y-1/2 opacity-20 transform">
              <Timer className="w-12 h-12 text-portal-text" />
            </div>
            <div className="relative z-10 flex items-center justify-end gap-3 text-portal-text text-right">
              <div className="flex flex-col">
                <span className="text-[8px] font-bold uppercase tracking-[0.2em] opacity-80">Overall Attendance</span>
                <div className="flex items-baseline gap-1 leading-none mt-1">
                  <span className="text-4xl font-black tracking-tighter">21</span>
                  <span className="text-xs font-bold opacity-80">Days</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-b border-portal-border flex items-center justify-between bg-portal-card/30">
            <h3 className="text-[10px] font-bold text-portal-text flex items-center gap-2 uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 text-portal-accent" />
              History
            </h3>
            <div className="flex items-center gap-3 bg-portal-input px-2 py-1 rounded-xl border border-portal-border/50">
              <button className="text-portal-text-muted hover:text-portal-text transition-colors">
                <ChevronLeft className="w-3 h-3" />
              </button>
              <span className="text-[9px] font-extrabold text-portal-text min-w-[50px] text-center tracking-tight">NOV 2026</span>
              <button className="text-portal-text-muted hover:text-portal-text transition-colors">
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="p-4 flex-1 flex flex-col">
            <div className="grid grid-cols-7 gap-y-3 mb-auto">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, dayIdx) => (
                <div key={dayIdx} className="text-center text-[7px] font-black text-portal-text-muted tracking-widest leading-none">
                  {day}
                </div>
              ))}
              {Array.from({ length: 30 }).map((_, i) => {
                const dayNum = i + 1;
                let dotColor = '';
                let textStyle = 'text-portal-text-muted hover:text-white';

                if ([3, 4, 5, 6, 7, 10, 11, 13, 14, 19, 20, 26, 27].includes(dayNum)) {
                  dotColor = 'bg-portal-accent shadow-[0_0_8px_rgba(45,212,191,0.5)]';
                  textStyle = 'text-white';
                } else if ([17, 18, 21, 23, 25].includes(dayNum)) {
                  dotColor = 'bg-yellow-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]';
                  textStyle = 'text-white';
                } else if ([12, 24].includes(dayNum)) {
                  dotColor = 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]';
                  textStyle = 'text-white';
                }

                return (
                  <div key={i} className="flex flex-col items-center justify-center relative select-none h-6">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold transition-all duration-300 relative z-10 cursor-pointer ${textStyle}`}>
                      {dotColor && <div className={`absolute inset-0 rounded-full ${dotColor} -z-10`} />}
                      {dayNum}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-around border-t border-portal-border/30 pt-4">
              {[
                { color: 'bg-portal-accent', label: 'Present' },
                { color: 'bg-yellow-500', label: 'Late' },
                { color: 'bg-red-500', label: 'Absent' },
              ].map(({ color, label }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
                  <span className="text-[6px] font-black text-portal-text-muted uppercase tracking-tighter">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Available Bootcamps Section */}
      <div className="bg-portal-card border border-portal-border rounded-3xl p-8 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-portal-text flex items-center gap-3">
            <Rocket className="w-6 h-6 text-portal-accent" />
            Available Bootcamps
          </h3>
          <Link
            to="/bootcamps"
            className="text-xs font-bold text-portal-accent flex items-center gap-1 hover:text-portal-text transition-colors uppercase tracking-widest"
          >
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loadingBootcamps ? (
          <div className="flex items-center gap-2 text-portal-text-muted text-sm py-8">
            <Loader2 className="w-4 h-4 animate-spin text-portal-accent" /> Loading bootcamps…
          </div>
        ) : availableBootcamps.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center text-portal-text-muted">
            <Rocket className="w-8 h-8 text-portal-accent/40" />
            <p className="text-sm font-semibold">No bootcamps available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableBootcamps.slice(0, 3).map((bootcamp) => {
              const Icon = bootcamp.name.toLowerCase().includes('cyber') ? ShieldCheck :
                bootcamp.name.toLowerCase().includes('web') ? Globe :
                  bootcamp.name.toLowerCase().includes('ai') ? Zap : Code2;

              const hasApplied = applications.some(app => app.bootcamp?._id === bootcamp._id || app.bootcamp === bootcamp._id);
              const appStatus = applications.find(app => app.bootcamp?._id === bootcamp._id || app.bootcamp === bootcamp._id)?.status;

              return (
                <div key={bootcamp._id} className="group relative bg-portal-input border border-portal-border/50 rounded-2xl p-6 hover:border-portal-accent/30 transition-all overflow-hidden">
                  <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-portal-accent/5 rounded-full blur-2xl group-hover:bg-portal-accent/10 transition-colors" />

                  <div className="w-12 h-12 bg-portal-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-portal-accent/20 transition-colors">
                    <Icon className="w-6 h-6 text-portal-accent" />
                  </div>

                  <h4 className="text-lg font-bold text-portal-text mb-2 group-hover:text-portal-accent transition-colors line-clamp-2">
                    {bootcamp.name}
                  </h4>

                  <p className="text-sm text-portal-text-muted mb-4 line-clamp-2">
                    {bootcamp.description || 'Join this elite bootcamp program.'}
                  </p>

                  {hasApplied ? (
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${appStatus === 'ACCEPTED' ? 'bg-green-500' :
                        appStatus === 'PENDING' ? 'bg-yellow-500' :
                          appStatus === 'REJECTED' ? 'bg-red-500' : 'bg-gray-500'
                        }`} />
                      <span className="text-xs font-bold text-portal-text-muted uppercase tracking-widest">
                        {appStatus === 'ACCEPTED' ? 'Accepted' :
                          appStatus === 'PENDING' ? 'Pending' :
                            appStatus === 'REJECTED' ? 'Rejected' : 'Applied'}
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => navigate(`/apply/${bootcamp._id}`)}
                      className="w-full py-2 bg-portal-accent text-portal-bg rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {showOtpModal && selectedEnrollment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-portal-card border border-portal-border rounded-3xl p-8 shadow-2xl max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-portal-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-portal-accent" />
              </div>
              <h3 className="text-xl font-bold text-portal-text">Activate Enrollment</h3>
              <p className="text-sm text-portal-text-muted mt-2">
                Enter the OTP sent to your email to complete enrollment for {selectedEnrollment.bootcamp?.name}
              </p>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!otp.trim()) return;

              try {
                setActivating(true);
                await enrollmentService.activateEnrollment(otp);
                setShowOtpModal(false);
                setOtp('');
                setSelectedEnrollment(null);
                fetchEnrollments(); // Refresh enrollments
                // Refresh user data to update division
                window.location.reload();
              } catch (error) {
                alert('Invalid OTP. Please check your email and try again.');
              } finally {
                setActivating(false);
              }
            }}>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text outline-none focus:border-portal-accent transition-colors text-center text-lg font-mono tracking-widest"
                maxLength={6}
                required
              />

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowOtpModal(false);
                    setOtp('');
                    setSelectedEnrollment(null);
                  }}
                  className="flex-1 py-3 bg-portal-input border border-portal-border text-portal-text rounded-xl font-bold hover:bg-portal-bg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={activating || otp.length !== 6}
                  className="flex-1 py-3 bg-portal-accent text-portal-bg rounded-xl font-bold hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {activating ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Activate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
