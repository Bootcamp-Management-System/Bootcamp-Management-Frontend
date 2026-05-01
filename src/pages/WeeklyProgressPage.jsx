import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, CheckCircle2, Clock, AlertCircle, Loader2,
  Calendar, Target, Zap, Award, ChevronLeft, ChevronRight,
  BarChart2, ArrowRight
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Area, AreaChart
} from 'recharts';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import taskService from '../services/taskService';
import submissionService from '../services/submissionService';

// ─── helpers ─────────────────────────────────────────────────────────────────
const startOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
};

const addDays = (date, n) => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
};

const fmtDay = (date) =>
  date.toLocaleDateString('en-US', { weekday: 'short' });

const fmtDate = (date) =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const fmtFull = (date) =>
  date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#06111a] border border-[#1a2e3b] rounded-xl px-4 py-3 shadow-xl text-sm">
      <p className="font-bold text-white mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="text-xs font-semibold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export const WeeklyProgressPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current, -1 = last week, etc.

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [tasksRes, subsRes] = await Promise.all([
        taskService.getTasks({ division: user?.division }),
        submissionService.getSubmissions(),
      ]);
      setTasks(tasksRes.data || []);
      setSubmissions(subsRes.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load progress data.');
    } finally {
      setLoading(false);
    }
  }, [user?.division]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Week window ──────────────────────────────────────────────────────────────
  const now = new Date();
  const currentWeekStart = startOfWeek(now);
  const weekStart = addDays(currentWeekStart, weekOffset * 7);
  const weekEnd = addDays(weekStart, 6);
  const isCurrentWeek = weekOffset === 0;

  // ── Build daily breakdown for the displayed week ──────────────────────────
  const dailyData = DAYS.map((dayName, i) => {
    const day = addDays(weekStart, i);
    const dayStart = new Date(day); dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(day); dayEnd.setHours(23, 59, 59, 999);

    // Tasks with deadline on this day
    const due = tasks.filter(t => {
      const d = new Date(t.deadline);
      return d >= dayStart && d <= dayEnd;
    }).length;

    // Submissions made on this day
    const submitted = submissions.filter(s => {
      const d = new Date(s.createdAt);
      return d >= dayStart && d <= dayEnd;
    }).length;

    return { day: dayName, date: fmtDate(day), due, submitted };
  });

  // ── Build last 6 weeks trend ──────────────────────────────────────────────
  const weeklyTrend = Array.from({ length: 6 }, (_, i) => {
    const offset = -(5 - i);
    const wStart = addDays(currentWeekStart, offset * 7);
    const wEnd = addDays(wStart, 6);
    wEnd.setHours(23, 59, 59, 999);

    const submitted = submissions.filter(s => {
      const d = new Date(s.createdAt);
      return d >= wStart && d <= wEnd;
    }).length;

    const due = tasks.filter(t => {
      const d = new Date(t.deadline);
      return d >= wStart && d <= wEnd;
    }).length;

    return {
      week: `W${i + 1}`,
      label: fmtDate(wStart),
      submitted,
      due,
    };
  });

  // ── Stats for selected week ───────────────────────────────────────────────
  const weekTasksDue = dailyData.reduce((s, d) => s + d.due, 0);
  const weekSubmitted = dailyData.reduce((s, d) => s + d.submitted, 0);
  const submissionRate = weekTasksDue > 0 ? Math.round((weekSubmitted / weekTasksDue) * 100) : 0;

  // ── All-time stats ────────────────────────────────────────────────────────
  const totalTasks = tasks.length;
  const totalSubmitted = submissions.length;
  const totalApproved = submissions.filter(s => s.status === 'approved').length;
  const avgGrade = submissions.filter(s => s.grade != null).length > 0
    ? Math.round(submissions.filter(s => s.grade != null).reduce((s, sub) => s + sub.grade, 0) / submissions.filter(s => s.grade != null).length)
    : null;

  // ── Streak calculation ────────────────────────────────────────────────────
  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const day = addDays(now, -i);
    const dayStart = new Date(day); dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(day); dayEnd.setHours(23, 59, 59, 999);
    const submittedOnDay = submissions.some(s => {
      const d = new Date(s.createdAt);
      return d >= dayStart && d <= dayEnd;
    });
    if (submittedOnDay) streak++;
    else if (i > 0) break; // stop on first gap (ignore today if no sub yet)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-portal-text-muted">
        <Loader2 className="w-10 h-10 animate-spin text-portal-accent mb-4" />
        <p className="text-sm">Loading your progress…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-400 gap-3">
        <AlertCircle className="w-10 h-10" />
        <p className="text-sm font-semibold">{error}</p>
        <button onClick={fetchData} className="text-sm text-portal-accent hover:underline">Retry</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <h2 className="text-3xl font-extrabold text-portal-text mb-1">Weekly Progress</h2>
          <p className="text-portal-text-muted">Track your submissions, deadlines, and performance over time.</p>
        </div>
        <Link
          to="/my-tasks"
          className="flex items-center gap-2 text-sm font-bold text-portal-accent hover:text-portal-text transition-colors"
        >
          Go to Tasks <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.header>

      {/* ── All-time KPI Cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Tasks',
            value: totalTasks,
            icon: Target,
            color: 'text-portal-accent',
            bg: 'bg-portal-accent/10',
            sub: `${totalTasks - totalSubmitted} remaining`,
          },
          {
            label: 'Submitted',
            value: totalSubmitted,
            icon: CheckCircle2,
            color: 'text-green-400',
            bg: 'bg-green-400/10',
            sub: `${totalApproved} approved`,
          },
          {
            label: 'Avg Grade',
            value: avgGrade != null ? `${avgGrade}%` : '—',
            icon: Award,
            color: 'text-yellow-400',
            bg: 'bg-yellow-400/10',
            sub: avgGrade != null ? (avgGrade >= 80 ? 'Excellent' : avgGrade >= 60 ? 'Good' : 'Needs work') : 'No grades yet',
          },
          {
            label: 'Submission Streak',
            value: streak,
            icon: Zap,
            color: 'text-orange-400',
            bg: 'bg-orange-400/10',
            sub: streak === 1 ? '1 day in a row' : streak > 1 ? `${streak} days in a row` : 'No active streak',
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-portal-card border border-portal-border rounded-2xl p-5 hover:border-portal-accent/30 transition-colors"
          >
            <div className={`p-2.5 rounded-xl ${card.bg} ${card.color} w-fit mb-4`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-xs text-portal-text-muted font-semibold uppercase tracking-wider">{card.label}</p>
            <p className={`text-3xl font-extrabold ${card.color} my-1`}>{card.value}</p>
            <p className="text-xs text-portal-text-muted">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Week Selector + Daily Breakdown ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-portal-card border border-portal-border rounded-2xl p-6 shadow-xl"
      >
        {/* Week Nav */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-portal-text flex items-center gap-2">
              <Calendar className="w-5 h-5 text-portal-accent" />
              {isCurrentWeek ? 'This Week' : `Week of ${fmtFull(weekStart)}`}
            </h3>
            <p className="text-xs text-portal-text-muted mt-0.5">
              {fmtDate(weekStart)} – {fmtDate(weekEnd)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWeekOffset(w => w - 1)}
              className="p-2 rounded-xl border border-portal-border text-portal-text-muted hover:text-portal-text hover:bg-portal-border transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {!isCurrentWeek && (
              <button
                onClick={() => setWeekOffset(0)}
                className="text-xs font-bold text-portal-accent hover:underline px-2"
              >
                Today
              </button>
            )}
            <button
              onClick={() => setWeekOffset(w => Math.min(w + 1, 0))}
              disabled={isCurrentWeek}
              className="p-2 rounded-xl border border-portal-border text-portal-text-muted hover:text-portal-text hover:bg-portal-border transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Summary badges */}
        <div className="flex flex-wrap gap-3 mb-6">
          {[
            { label: 'Tasks Due', value: weekTasksDue, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
            { label: 'Submitted', value: weekSubmitted, color: 'bg-green-500/10 text-green-400 border-green-500/20' },
            { label: 'Rate', value: `${submissionRate}%`, color: 'bg-portal-accent/10 text-portal-accent border-portal-accent/20' },
          ].map(({ label, value, color }) => (
            <span key={label} className={`text-xs font-bold px-3 py-1.5 rounded-full border ${color}`}>
              {label}: {value}
            </span>
          ))}
        </div>

        {/* Bar Chart */}
        {weekTasksDue === 0 && weekSubmitted === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-portal-text-muted gap-2">
            <BarChart2 className="w-10 h-10 text-portal-accent/30" />
            <p className="text-sm font-semibold">No activity this week</p>
          </div>
        ) : (
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData} barGap={4} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2e3b" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: '#6b8fa3', fontSize: 11, fontWeight: 700 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: '#6b8fa3', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={20}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(45,212,191,0.05)' }} />
                <Bar dataKey="due" name="Tasks Due" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="submitted" name="Submitted" fill="#2dd4bf" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-5 mt-4 justify-center">
          {[
            { color: 'bg-blue-500', label: 'Tasks Due' },
            { color: 'bg-portal-accent', label: 'Submitted' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-xs text-portal-text-muted font-semibold">
              <span className={`w-3 h-3 rounded-sm ${color}`} /> {label}
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── 6-Week Submission Trend ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-portal-card border border-portal-border rounded-2xl p-6 shadow-xl"
      >
        <h3 className="text-lg font-bold text-portal-text mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-portal-accent" />
          6-Week Submission Trend
        </h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyTrend}>
              <defs>
                <linearGradient id="submittedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2e3b" vertical={false} />
              <XAxis
                dataKey="week"
                tick={{ fill: '#6b8fa3', fontSize: 11, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: '#6b8fa3', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={20}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#2dd4bf', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area
                type="monotone"
                dataKey="submitted"
                name="Submitted"
                stroke="#2dd4bf"
                strokeWidth={2.5}
                fill="url(#submittedGrad)"
                dot={{ fill: '#2dd4bf', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#2dd4bf' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* ── Recent Submissions List ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-portal-card border border-portal-border rounded-2xl p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-portal-text flex items-center gap-2">
            <Clock className="w-5 h-5 text-portal-accent" />
            Recent Submissions
          </h3>
          <Link to="/my-tasks" className="text-xs font-bold text-portal-accent hover:underline">
            Submit a task →
          </Link>
        </div>

        {submissions.length === 0 ? (
          <p className="text-sm text-portal-text-muted py-4">No submissions yet. Start submitting tasks from the Task Path.</p>
        ) : (
          <div className="space-y-3">
            {submissions.slice(0, 8).map((sub) => {
              const statusStyle = {
                pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
                approved: 'bg-green-500/15 text-green-400 border-green-500/30',
                rejected: 'bg-red-500/15 text-red-400 border-red-500/30',
              }[sub.status] || 'bg-slate-500/15 text-slate-400 border-slate-500/30';

              return (
                <div key={sub._id} className="flex items-center justify-between p-4 bg-portal-input border border-portal-border rounded-xl hover:border-portal-accent/30 transition-colors">
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-portal-text truncate">{sub.task?.title || 'Task'}</p>
                    <p className="text-xs text-portal-text-muted mt-0.5">
                      {new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {sub.grade != null && <span className="text-portal-accent ml-2">· Grade: {sub.grade}/100</span>}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border shrink-0 ml-3 ${statusStyle}`}>
                    {sub.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};
