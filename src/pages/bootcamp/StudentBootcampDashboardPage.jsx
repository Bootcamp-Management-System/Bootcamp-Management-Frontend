import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Layers,
  Loader2,
  Timer,
} from 'lucide-react';
import { bootcampService } from '../../services/bootcampService';
import attendanceService from '../../services/attendanceService';
import sessionService from '../../services/sessionService';
import taskService from '../../services/taskService';
import { StudentSessionsPage } from '../sessions/StudentSessionsPage';
import { StudentTaskPage } from '../Task/StudentTaskPage';

const tabs = [
  { id: 'sessions', label: 'Sessions', icon: Calendar },
  { id: 'tasks', label: 'My Tasks', icon: ClipboardList },
  { id: 'attendance', label: 'Attendance', icon: CheckCircle2 },
  { id: 'weeks', label: 'By Week', icon: Layers },
];

const fmtDateTime = (value) =>
  value
    ? new Date(value).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Not set';

const getWeekLabel = (dateValue, firstDate) => {
  if (!dateValue || !firstDate) return 'Week 1';
  const diff = new Date(dateValue).getTime() - firstDate.getTime();
  const weekNumber = Math.max(1, Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1);
  return `Week ${weekNumber}`;
};

export const StudentBootcampDashboardPage = () => {
  const { bootcampId, sessionId } = useParams();
  const navigate = useNavigate();
  const [bootcamp, setBootcamp] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [attendanceBySession, setAttendanceBySession] = useState({});
  const [activeTab, setActiveTab] = useState('sessions');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [bootcampResponse, sessionResponse, taskResponse] = await Promise.all([
        bootcampService.getBootcamp(bootcampId),
        sessionService.getSessions({ bootcamp: bootcampId }),
        taskService.getTasks({ bootcamp: bootcampId }),
      ]);

      const loadedSessions = sessionResponse.data || [];
      setBootcamp(bootcampResponse.data);
      setSessions(loadedSessions);
      setTasks(taskResponse.data || []);

      const attendanceResults = await Promise.all(
        loadedSessions.map(async (session) => {
          try {
            const response = await attendanceService.getAttendance({ sessionId: session._id });
            return [session._id, response.data?.[0] || null];
          } catch {
            return [session._id, null];
          }
        })
      );

      setAttendanceBySession(Object.fromEntries(attendanceResults));
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load this bootcamp dashboard.');
    } finally {
      setLoading(false);
    }
  }, [bootcampId]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    if (sessionId) setActiveTab('sessions');
  }, [sessionId]);

  const weeklyItems = useMemo(() => {
    const datedItems = [
      ...sessions.map((session) => ({
        id: `session-${session._id}`,
        type: 'Session',
        title: session.title,
        date: session.startTime,
      })),
      ...tasks.map((task) => ({
        id: `task-${task._id}`,
        type: 'Task',
        title: task.title,
        date: task.startTime || task.deadline,
      })),
    ].sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));

    const firstDate = datedItems[0]?.date ? new Date(datedItems[0].date) : null;
    return datedItems.reduce((groups, item) => {
      const week = getWeekLabel(item.date, firstDate);
      groups[week] = groups[week] || [];
      groups[week].push(item);
      return groups;
    }, {});
  }, [sessions, tasks]);

  const selectTab = (tabId) => {
    if (sessionId) navigate(`/enrollments/${bootcampId}`);
    setActiveTab(tabId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[420px]">
        <Loader2 className="w-10 h-10 animate-spin text-portal-accent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <header className="bg-portal-card border border-portal-border rounded-3xl p-6 md:p-8">
        <button
          type="button"
          onClick={() => navigate('/enrollments')}
          className="inline-flex items-center gap-2 text-sm font-bold text-portal-text-muted hover:text-portal-accent transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to enrollments
        </button>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-portal-accent mb-3">
              Learning Dashboard
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-portal-text tracking-tight">
              {bootcamp?.name || 'Bootcamp'}
            </h1>
            <p className="text-portal-text-muted mt-3 max-w-3xl leading-relaxed">
              {bootcamp?.description || 'Sessions, tasks, attendance, and weekly learning items for this bootcamp.'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 min-w-full sm:min-w-[360px]">
            <div className="rounded-2xl bg-portal-input border border-portal-border p-4">
              <p className="text-2xl font-black text-portal-text">{sessions.length}</p>
              <p className="text-xs text-portal-text-muted font-bold">Sessions</p>
            </div>
            <div className="rounded-2xl bg-portal-input border border-portal-border p-4">
              <p className="text-2xl font-black text-portal-text">{tasks.length}</p>
              <p className="text-xs text-portal-text-muted font-bold">Tasks</p>
            </div>
            <div className="rounded-2xl bg-portal-input border border-portal-border p-4">
              <p className="text-2xl font-black text-portal-text">
                {Object.values(attendanceBySession).filter(Boolean).length}
              </p>
              <p className="text-xs text-portal-text-muted font-bold">Marked</p>
            </div>
          </div>
        </div>
      </header>

      <nav className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => selectTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-bold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-portal-accent text-portal-bg border-portal-accent'
                  : 'bg-portal-card text-portal-text-muted border-portal-border hover:text-portal-text'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {activeTab === 'sessions' && <StudentSessionsPage bootcampId={bootcampId} embedded />}
      {activeTab === 'tasks' && <StudentTaskPage bootcampId={bootcampId} embedded />}

      {activeTab === 'attendance' && (
        <section className="space-y-4">
          {sessions.length === 0 ? (
            <div className="bg-portal-card border border-portal-border rounded-2xl p-10 text-center text-sm text-portal-text-muted">
              No sessions are available for attendance yet.
            </div>
          ) : (
            sessions.map((session) => {
              const record = attendanceBySession[session._id];
              return (
                <div key={session._id} className="bg-portal-card border border-portal-border rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="font-black text-portal-text">{session.title}</h3>
                    <p className="text-sm text-portal-text-muted mt-1">{fmtDateTime(session.startTime)}</p>
                  </div>
                  <span className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-xs font-black uppercase tracking-widest ${
                    record
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : 'bg-portal-input text-portal-text-muted border-portal-border'
                  }`}>
                    {record?.status || 'Not marked'}
                  </span>
                </div>
              );
            })
          )}
        </section>
      )}

      {activeTab === 'weeks' && (
        <section className="space-y-5">
          {Object.keys(weeklyItems).length === 0 ? (
            <div className="bg-portal-card border border-portal-border rounded-2xl p-10 text-center text-sm text-portal-text-muted">
              Weekly learning items will appear after sessions or tasks are assigned.
            </div>
          ) : (
            Object.entries(weeklyItems).map(([week, items]) => (
              <div key={week} className="bg-portal-card border border-portal-border rounded-2xl p-6">
                <h2 className="text-xl font-black text-portal-text mb-4">{week}</h2>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 rounded-xl bg-portal-input border border-portal-border p-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-portal-accent/10 text-portal-accent">
                          {item.type === 'Session' ? <BookOpen className="w-4 h-4" /> : <ClipboardList className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-portal-text truncate">{item.title}</p>
                          <p className="text-xs text-portal-text-muted">{item.type}</p>
                        </div>
                      </div>
                      <span className="flex items-center gap-2 text-xs text-portal-text-muted shrink-0">
                        <Timer className="w-4 h-4" />
                        {fmtDateTime(item.date)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </section>
      )}
    </div>
  );
};
