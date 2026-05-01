import React, { useState } from 'react';
import { DataTable } from '../../components/admin/DataTable';
import { AdminModal } from '../../components/admin/AdminModal';
import { cn } from '../super-admin/lib/utils';
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  CalendarDays,
  List,
  User,
  Layers,
  ArrowRight
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import sessionService from '../../services/sessionService';
import { bootcampService } from '../../services/bootcampService';

const formatTime = (value) =>
  value ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Not set';

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not set';

const toTimeInputValue = (value) => value ? new Date(value).toTimeString().slice(0, 5) : '';

const getMonday = (date) => {
  const start = new Date(date);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  start.setHours(0, 0, 0, 0);
  return start;
};

const toMonthInputValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

const getDateFromMonthInput = (value) => {
  const [year, month] = value.split('-').map(Number);
  return new Date(year, month - 1, 1);
};

const getWeekOfMonth = (date) => Math.ceil(date.getDate() / 7);

const getWeekStartInMonth = (monthValue, weekNumber) => {
  const monthDate = getDateFromMonthInput(monthValue);
  const day = ((Number(weekNumber) - 1) * 7) + 1;
  return new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
};

const isSameDay = (left, right) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

const getSessionTone = (session) => {
  const key = session.bootcamp?._id || session.bootcamp || session.division?._id || session.division || session._id;
  const tones = [
    'bg-purple-500/10 border-purple-400/30 text-purple-100',
    'bg-blue-500/10 border-blue-400/30 text-blue-100',
    'bg-green-500/10 border-green-400/30 text-green-100',
    'bg-red-500/10 border-red-400/30 text-red-100',
    'bg-amber-500/10 border-amber-400/30 text-amber-100',
  ];
  const index = String(key).split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % tones.length;
  return tones[index];
};

const detectSessionConflicts = (sessions) => {
  const conflicts = [];
  const sorted = [...sessions].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  for (let i = 0; i < sorted.length; i += 1) {
    for (let j = i + 1; j < sorted.length; j += 1) {
      const first = sorted[i];
      const second = sorted[j];
      const firstStart = new Date(first.startTime);
      const firstEnd = new Date(first.endTime);
      const secondStart = new Date(second.startTime);
      const secondEnd = new Date(second.endTime);

      if (!isSameDay(firstStart, secondStart)) continue;

      const sameInstructor = first.instructor?._id && first.instructor?._id === second.instructor?._id;
      const sameBootcamp = (first.bootcamp?._id || first.bootcamp) === (second.bootcamp?._id || second.bootcamp);
      if (!sameInstructor && !sameBootcamp) continue;

      const overlaps = firstStart < secondEnd && secondStart < firstEnd;
      const gapMinutes = Math.round((secondStart - firstEnd) / (60 * 1000));
      const tightGap = sameInstructor && gapMinutes >= 0 && gapMinutes <= 30;

      if (overlaps || tightGap) {
        conflicts.push({
          id: `${first._id}-${second._id}`,
          type: overlaps ? 'Overlap' : 'Tight gap',
          message: `${formatDate(first.startTime)}: "${first.title}" and "${second.title}" ${overlaps ? 'overlap' : `have only ${gapMinutes} minutes between them`}${sameInstructor ? ` for ${first.instructor?.name || 'the same instructor'}` : ''}.`,
        });
      }
    }
  }

  return conflicts;
};

export const AdminSessionsPage = () => {
  const { user: admin, selectedDivision } = useAuth();
  const currentDivisionName = admin?.division?.name || admin?.divisionName || 'Division';
  const currentDivision = admin?.role === 'super_admin' ? selectedDivision : (admin?.division?._id || admin?.division);

  const [sessions, setSessions] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [availableInstructors, setAvailableInstructors] = React.useState([]);
  const [availableBootcamps, setAvailableBootcamps] = React.useState([]);
  const [formError, setFormError] = React.useState('');
  const [viewMode, setViewMode] = React.useState('weekly');
  const [calendarRange, setCalendarRange] = React.useState('weekly');
  const [selectedMonth, setSelectedMonth] = React.useState(() => toMonthInputValue(new Date()));
  const [selectedWeek, setSelectedWeek] = React.useState('all');
  const [formData, setFormData] = useState({
    title: '',
    bootcamp: '',
    instructor: '',
    location: '',
    date: '',
    time: '',
    endTime: ''
  });

  const getSelectedTimeWindow = React.useCallback(() => {
    if (!formData.date || !formData.time || !formData.endTime) return {};

    const startTime = new Date(`${formData.date}T${formData.time}`);
    const endTime = new Date(`${formData.date}T${formData.endTime}`);
    if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime()) || endTime <= startTime) return {};

    return {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    };
  }, [formData.date, formData.endTime, formData.time]);

  React.useEffect(() => {
    const fetchBootcamps = async () => {
      try {
        const res = await bootcampService.getBootcamps({ division: currentDivision });
        setAvailableBootcamps(res.data || []);
      } catch (error) {
        console.error("Failed to fetch bootcamps:", error);
      }
    };

    if (currentDivision) {
      fetchBootcamps();
    }
  }, [currentDivision]);

  React.useEffect(() => {
    const fetchAvailableInstructors = async () => {
      try {
        const res = await sessionService.getAvailableInstructors(currentDivision, {
          ...getSelectedTimeWindow(),
          sessionId: selectedSession?._id,
        });
        const instructors = res.data || [];
        setAvailableInstructors(instructors);

        if (formData.instructor && !instructors.some((instructor) => instructor._id === formData.instructor)) {
          setFormData((current) => (
            current.instructor === formData.instructor ? { ...current, instructor: '' } : current
          ));
        }
      } catch (error) {
        console.error("Failed to fetch available instructors:", error);
        setAvailableInstructors([]);
      }
    };

    if (currentDivision) {
      fetchAvailableInstructors();
    }
  }, [currentDivision, formData.instructor, getSelectedTimeWindow, selectedSession?._id]);

  React.useEffect(() => {
    setFormError('');

    if (selectedSession) {
      setFormData({
        title: selectedSession.title || '',
        bootcamp: selectedSession.bootcamp?._id || selectedSession.bootcamp || '',
        instructor: selectedSession.instructor?._id || selectedSession.instructor || '',
        location: selectedSession.location || '',
        date: selectedSession.startTime ? new Date(selectedSession.startTime).toISOString().split('T')[0] : '',
        time: toTimeInputValue(selectedSession.startTime),
        endTime: toTimeInputValue(selectedSession.endTime)
      });
    } else {
      setFormData({
        title: '',
        bootcamp: '',
        instructor: '',
        location: '',
        date: '',
        time: '',
        endTime: ''
      });
    }
  }, [selectedSession, isModalOpen]);

  const fetchSessions = React.useCallback(async () => {
    try {
      const res = await sessionService.getSessions({ division: currentDivision });
      setSessions(res.data || []);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  }, [currentDivision]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setFormError('');
      const startTime = new Date(`${formData.date}T${formData.time}`);
      const endTime = new Date(`${formData.date}T${formData.endTime}`);

      if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime())) {
        setFormError('Please select a valid start and end time.');
        return;
      }

      if (endTime <= startTime) {
        setFormError('End time must be after the start time.');
        return;
      }

      const sessionData = {
        title: formData.title,
        bootcamp: formData.bootcamp,
        division: currentDivision,
        instructor: formData.instructor || undefined,
        location: formData.location,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      };

      if (selectedSession) {
        await sessionService.updateSession(selectedSession._id, sessionData);
      } else {
        await sessionService.createSession(sessionData);
      }

      setIsModalOpen(false);
      fetchSessions();
    } catch (error) {
      console.error('Failed to save session:', error);
      setFormError(error?.response?.data?.message || error?.response?.data?.error || 'Failed to save session.');
    }
  };

  React.useEffect(() => {
    if (currentDivision) {
      fetchSessions();
    }
  }, [currentDivision, fetchSessions]);

  const conflictWarnings = React.useMemo(() => detectSessionConflicts(sessions), [sessions]);

  const sessionsInSelectedMonth = React.useMemo(() => {
    const monthDate = getDateFromMonthInput(selectedMonth);
    return sessions.filter((session) => {
      const sessionDate = new Date(session.startTime);
      return sessionDate.getFullYear() === monthDate.getFullYear() && sessionDate.getMonth() === monthDate.getMonth();
    });
  }, [selectedMonth, sessions]);

  const calendarSessions = React.useMemo(() => {
    if (selectedWeek === 'all') return sessionsInSelectedMonth;
    return sessionsInSelectedMonth.filter((session) => getWeekOfMonth(new Date(session.startTime)) === Number(selectedWeek));
  }, [selectedWeek, sessionsInSelectedMonth]);

  const weekOptions = React.useMemo(() => {
    const monthDate = getDateFromMonthInput(selectedMonth);
    const lastDay = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
    return Array.from({ length: Math.ceil(lastDay / 7) }, (_, index) => ({
      value: String(index + 1),
      label: `Week ${index + 1}`,
    }));
  }, [selectedMonth]);

  const weekDays = React.useMemo(() => {
    const sortedMonthSessions = [...sessionsInSelectedMonth].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    const baseDate = selectedWeek === 'all'
      ? (sortedMonthSessions[0]?.startTime ? new Date(sortedMonthSessions[0].startTime) : getDateFromMonthInput(selectedMonth))
      : getWeekStartInMonth(selectedMonth, selectedWeek);
    const monday = getMonday(baseDate);

    return Array.from({ length: 5 }, (_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return {
        date,
        label: date.toLocaleDateString([], { weekday: 'long' }),
        sublabel: date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
        sessions: calendarSessions
          .filter((session) => isSameDay(new Date(session.startTime), date))
          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime)),
      };
    });
  }, [calendarSessions, selectedMonth, selectedWeek, sessionsInSelectedMonth]);

  const monthDays = React.useMemo(() => {
    const monthDate = getDateFromMonthInput(selectedMonth);
    const lastDay = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
    const days = Array.from({ length: lastDay }, (_, index) => {
      const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), index + 1);
      return {
        date,
        label: date.toLocaleDateString([], { weekday: 'short' }),
        dayNumber: index + 1,
        sessions: calendarSessions
          .filter((session) => isSameDay(new Date(session.startTime), date))
          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime)),
      };
    });

    return selectedWeek === 'all'
      ? days
      : days.filter((day) => getWeekOfMonth(day.date) === Number(selectedWeek));
  }, [calendarSessions, selectedMonth, selectedWeek]);

  const columns = [
    {
      header: 'Session',
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-portal-text mb-0.5">{row.title}</span>
          <div className="flex items-center gap-2 text-[10px] text-portal-text-muted">
            <User className="w-2.5 h-2.5" /> {row.instructor?.name || 'Unassigned'}
          </div>
        </div>
      )
    },
    {
      header: 'Timing',
      render: (row) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs text-portal-text">
            <Calendar className="w-3 h-3 text-portal-accent" />
            {new Date(row.startTime).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-portal-text-muted mt-1">
            <Clock className="w-3 h-3" />
            {formatTime(row.startTime)} - {formatTime(row.endTime)}
          </div>
        </div>
      )
    },
    {
      header: 'Division',
      render: (row) => {
        const divName = row.division?.name || row.division;
        return (
          <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${divName === 'Development' ? 'bg-blue-400/10 border-blue-400/20 text-blue-400' :
              divName === 'Cyber Security' ? 'bg-red-400/10 border-red-400/20 text-red-400' :
                divName === 'Data Science' ? 'bg-purple-400/10 border-purple-400/20 text-purple-400' :
                  'bg-orange-400/10 border-orange-400/20 text-orange-400'
            }`}>
            {divName}
          </span>
        );
      }
    },
    {
      header: 'State',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.status === 'Live' && <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
          <span className={`text-[10px] font-bold uppercase tracking-widest ${row.status === 'Live' ? 'text-red-400' : 'text-portal-text-muted'
            }`}>
            {row.status || 'Scheduled'}
          </span>
        </div>
      )
    }
  ];

  const actions = [
    { label: 'Edit', icon: Edit2, onClick: (s) => { setSelectedSession(s); setIsModalOpen(true); } },
    {
      label: 'Delete',
      icon: Trash2,
      className: 'text-red-400 hover:text-red-300 hover:bg-red-500/10',
      onClick: async (s) => {
        try {
          await sessionService.deleteSession(s._id);
          fetchSessions();
        } catch (err) {
          console.error("Failed to delete", err);
        }
      }
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black mb-2 text-portal-text tracking-tight uppercase">Sessions</h2>
          <p className="text-sm font-black text-portal-text-muted uppercase tracking-[0.2em]">Manage and schedule {currentDivisionName} bootcamp sessions.</p>
        </div>
        <button
          onClick={() => { setSelectedSession(null); setIsModalOpen(true); }}
          className="bg-white text-black px-10 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" />
          Schedule Session
        </button>
      </header>

      {conflictWarnings.length > 0 && (
        <section className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-5 h-5 mt-0.5 text-red-500 shrink-0" />
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-black text-xs uppercase tracking-widest text-portal-text">Conflict Warnings Detected</h3>
                <span className="px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/20 text-[9px] font-black uppercase text-red-500">System Alert</span>
              </div>
              <div className="mt-3 space-y-1 text-xs font-bold text-portal-text-muted">
                {conflictWarnings.slice(0, 3).map((warning) => (
                  <p key={warning.id} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-red-500/50" />
                    {warning.message}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="flex items-center gap-4">
        <div className="inline-flex rounded-2xl bg-portal-card border border-portal-border p-1.5">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              viewMode === 'list' ? 'bg-portal-accent/10 text-portal-accent shadow-sm' : 'text-portal-text-muted hover:text-portal-text hover:bg-portal-accent/5'
            }`}
          >
            <List className="w-4 h-4" />
            List View
          </button>
          <button
            type="button"
            onClick={() => setViewMode('weekly')}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              viewMode === 'weekly' ? 'bg-portal-accent/10 text-portal-accent shadow-sm' : 'text-portal-text-muted hover:text-portal-text hover:bg-portal-accent/5'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            Weekly Calendar
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="bg-portal-card border border-portal-border rounded-3xl overflow-hidden shadow-xl">
          <DataTable
            columns={columns}
            data={sessions}
            actions={actions}
            searchPlaceholder="Filter sessions by name or instructor..."
          />
        </div>
      ) : (
        <section className="bg-portal-card border border-portal-border rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8 mb-10 relative z-10">
            <div>
              <h3 className="text-xl font-black text-portal-text uppercase tracking-tight">
                {calendarRange === 'monthly' ? 'Monthly Schedule' : 'Weekly Schedule'}
              </h3>
              <p className="text-[10px] font-black text-portal-text-muted uppercase tracking-[0.2em] mt-1">
                {calendarRange === 'monthly' ? 'Stored sessions grouped by month' : 'Monday - Friday session calendar'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="inline-flex rounded-xl bg-portal-bg border border-portal-border p-1">
                <button
                  type="button"
                  onClick={() => setCalendarRange('weekly')}
                  className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                    calendarRange === 'weekly' ? 'bg-portal-card text-portal-accent shadow-sm' : 'text-portal-text-muted hover:text-portal-text'
                  }`}
                >
                  Weekly
                </button>
                <button
                  type="button"
                  onClick={() => setCalendarRange('monthly')}
                  className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                    calendarRange === 'monthly' ? 'bg-portal-card text-portal-accent shadow-sm' : 'text-portal-text-muted hover:text-portal-text'
                  }`}
                >
                  Monthly
                </button>
              </div>
              <input
                type="month"
                value={selectedMonth}
                onChange={(event) => {
                  setSelectedMonth(event.target.value);
                  setSelectedWeek('all');
                }}
                className="bg-portal-bg border border-portal-border rounded-xl px-4 py-2.5 text-xs font-bold text-portal-text outline-none focus:border-portal-accent transition-colors"
              />
              <div className="relative group">
                <select
                  value={selectedWeek}
                  onChange={(event) => setSelectedWeek(event.target.value)}
                  className="bg-portal-bg border border-portal-border rounded-xl pl-4 pr-10 py-2.5 text-[10px] font-black uppercase tracking-widest text-portal-text outline-none focus:border-portal-accent transition-colors appearance-none cursor-pointer"
                >
                  <option value="all">All weeks</option>
                  {weekOptions.map((week) => (
                    <option key={week.value} value={week.value}>{week.label}</option>
                  ))}
                </select>
                <ArrowRight className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-portal-text-muted rotate-90 group-hover:text-portal-accent transition-colors" />
              </div>
            </div>
          </div>

          <div className="mb-10 grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
            {[
              { label: 'Stored sessions in view', value: calendarSessions.length },
              { label: 'Sessions this month', value: sessionsInSelectedMonth.length },
              { label: 'Conflict warnings', value: conflictWarnings.length, color: conflictWarnings.length > 0 ? 'text-red-500' : 'text-portal-text' }
            ].map((stat, i) => (
              <div key={i} className="rounded-3xl bg-portal-bg/50 border border-portal-border p-8 hover:border-portal-accent/30 transition-all group">
                <p className={cn("text-4xl font-black mb-2 group-hover:scale-110 transition-transform origin-left", stat.color || 'text-portal-text')}>{stat.value}</p>
                <p className="text-[10px] text-portal-text-muted font-black uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
            ))}
          </div>

          {calendarRange === 'weekly' ? (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 relative z-10">
              {weekDays.map((day) => (
                <div key={day.sublabel} className="flex flex-col gap-4">
                  <div className="text-center bg-portal-bg border border-portal-border rounded-2xl p-4 shadow-sm">
                    <h4 className="text-xs font-black text-portal-text uppercase tracking-widest">{day.label}</h4>
                    <p className="text-[10px] font-black text-portal-text-muted uppercase tracking-tighter mt-1">{day.sublabel}</p>
                  </div>

                  <div className="flex-1 min-h-[400px] rounded-[2rem] border border-portal-border bg-portal-bg/20 p-4 space-y-4">
                    {day.sessions.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-portal-border/50 text-[10px] font-black uppercase tracking-widest text-portal-text-muted group">
                        <Calendar className="w-8 h-8 mb-4 opacity-5 group-hover:opacity-10 transition-opacity" />
                        No sessions
                      </div>
                    ) : (
                      day.sessions.map((session) => (
                        <button
                          key={session._id}
                          type="button"
                          onClick={() => { setSelectedSession(session); setIsModalOpen(true); }}
                          className={cn(
                            "w-full text-left rounded-[1.5rem] border p-6 transition-all hover:-translate-y-1 hover:shadow-2xl hover:border-portal-accent group",
                            getSessionTone(session)
                          )}
                        >
                          <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-3 h-3 opacity-50" />
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">
                              {formatTime(session.startTime)} - {formatTime(session.endTime)}
                            </p>
                          </div>
                          <h4 className="text-sm font-black text-portal-text line-clamp-2 leading-snug group-hover:text-portal-accent transition-colors">
                            {session.title}
                          </h4>
                          <div className="mt-4 pt-4 border-t border-current/10 space-y-2">
                            <div className="flex items-center gap-2 text-[10px] font-bold opacity-70">
                              <User className="w-3 h-3" />
                              {session.instructor?.name || 'Unassigned'}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold opacity-70">
                              <MapPin className="w-3 h-3" />
                              {session.location || 'Location not set'}
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-7 gap-4 relative z-10">
              {monthDays.map((day) => (
                <div key={day.dayNumber} className="min-h-[220px] rounded-3xl border border-portal-border bg-portal-bg/30 p-5 hover:border-portal-accent/30 transition-all">
                  <div className="flex items-center justify-between border-b border-portal-border pb-4 mb-4">
                    <div>
                      <p className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest">{day.label}</p>
                      <h4 className="text-2xl font-black text-portal-text">{day.dayNumber}</h4>
                    </div>
                    <span className="rounded-xl bg-portal-card border border-portal-border px-3 py-1 text-[9px] font-black text-portal-text-muted uppercase tracking-tighter">
                      W{getWeekOfMonth(day.date)}
                    </span>
                  </div>
                  {day.sessions.length === 0 ? (
                    <p className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest mt-4">No sessions</p>
                  ) : (
                    <div className="space-y-3">
                      {day.sessions.map((session) => (
                        <button
                          key={session._id}
                          type="button"
                          onClick={() => { setSelectedSession(session); setIsModalOpen(true); }}
                          className={cn(
                            "w-full text-left rounded-xl border p-3 transition-all hover:border-portal-accent",
                            getSessionTone(session)
                          )}
                        >
                          <p className="text-[9px] font-black opacity-80 uppercase">
                            {formatTime(session.startTime)}
                          </p>
                          <h4 className="mt-1 text-[11px] font-black text-portal-text line-clamp-1">{session.title}</h4>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          <Layers className="absolute -right-20 -bottom-20 w-[40rem] h-[40rem] text-portal-accent/[0.02] -rotate-12 pointer-events-none" />
        </section>
      )}

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedSession ? 'Edit Resource Node' : 'Broadcast New Session'}
      >
        <form className="space-y-10 py-4" onSubmit={handleSubmit}>
          {formError && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-4 text-xs font-black uppercase tracking-widest text-red-500">
              Error Protocol: {formError}
            </div>
          )}
          
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-portal-text-muted uppercase tracking-[0.3em] pl-1">Session Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Masterclass: Node Systems"
                className="w-full bg-portal-bg border border-portal-border rounded-2xl px-6 py-4 text-sm font-bold text-portal-text outline-none focus:border-portal-accent focus:bg-portal-card transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-portal-text-muted uppercase tracking-[0.3em] pl-1">Target Bootcamp</label>
              <div className="relative group">
                <Layers className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-portal-accent z-10 transition-transform group-focus-within:scale-110" />
                <select
                  className="w-full bg-portal-bg border border-portal-border rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-portal-text outline-none focus:border-portal-accent focus:bg-portal-card appearance-none cursor-pointer"
                  value={formData.bootcamp}
                  onChange={(e) => setFormData({ ...formData, bootcamp: e.target.value })}
                  required
                >
                  <option value="" disabled>Select Bootcamp</option>
                  {availableBootcamps.map(bc => (
                    <option key={bc._id} value={bc._id}>{bc.name}</option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-portal-text-muted group-focus-within:text-portal-accent">
                  <ArrowRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-portal-text-muted uppercase tracking-[0.3em] pl-1">Instructor Node</label>
                <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-portal-accent z-10" />
                  <select
                    className="w-full bg-portal-bg border border-portal-border rounded-2xl pl-14 pr-10 py-4 text-sm font-bold text-portal-text outline-none focus:border-portal-accent focus:bg-portal-card appearance-none cursor-pointer"
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  >
                    <option value="" disabled>Select Instructor</option>
                    {availableInstructors.map(instructor => (
                      <option key={instructor._id} value={instructor._id}>
                        {instructor.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-portal-text-muted">
                    <ArrowRight className="w-4 h-4 rotate-90" />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-portal-text-muted uppercase tracking-[0.3em] pl-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-portal-accent" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Room 101, Online"
                    className="w-full bg-portal-bg border border-portal-border rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-portal-text outline-none focus:border-portal-accent focus:bg-portal-card transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-portal-text-muted uppercase tracking-[0.3em] pl-1">Execution Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-portal-bg border border-portal-border rounded-2xl px-6 py-4 text-sm font-bold text-portal-text outline-none focus:border-portal-accent focus:bg-portal-card transition-all"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-portal-text-muted uppercase tracking-[0.3em] pl-1">Start Time</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full bg-portal-bg border border-portal-border rounded-2xl px-6 py-4 text-sm font-bold text-portal-text outline-none focus:border-portal-accent focus:bg-portal-card transition-all"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-portal-text-muted uppercase tracking-[0.3em] pl-1">End Time</label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full bg-portal-bg border border-portal-border rounded-2xl px-6 py-4 text-sm font-bold text-portal-text outline-none focus:border-portal-accent focus:bg-portal-card transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-10 border-t border-portal-border">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)} 
              className="px-8 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-portal-text-muted hover:text-red-500 transition-colors"
            >
              Abort
            </button>
            <button 
              type="submit" 
              className="bg-white text-black px-12 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-white/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group"
            >
              {selectedSession ? 'Commit Changes' : 'Broadcast Node'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};
