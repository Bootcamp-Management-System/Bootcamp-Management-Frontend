import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  FileUp,
  FileText,
  Loader2,
  MapPin,
  Monitor,
  Plus,
  QrCode,
  Save,
  Trash2,
  Users,
  Image as ImageIcon,
  FileVideo,
  FileArchive,
  Link as LinkIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import sessionService from '../../services/sessionService';
import resourceService from '../../services/resourceService';
import attendanceService from '../../services/attendanceService';
import taskService from '../../services/taskService';
import feedbackService from '../../services/feedbackService';

const MotionButton = motion.button;

const fmtDateTime = (value) =>
  value ? new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }) : 'Not set';

const toDateTimeLocal = (value) => {
  if (!value) return '';
  const date = new Date(value);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

const emptyTask = {
  title: '',
  description: '',
  startTime: '',
  endTime: '',
  deadline: '',
};

const ATTENDANCE_STATUSES = ['Present', 'Absent', 'Late', 'Excused'];

const isAttendanceLocked = (session) => {
  if (!session?.endTime) return false;
  return Date.now() - new Date(session.endTime).getTime() > 24 * 60 * 60 * 1000;
};

const getResourceIcon = (type) => {
  switch (type) {
    case 'pdf': return FileText;
    case 'video': return FileVideo;
    case 'image': return ImageIcon;
    case 'zip': return FileArchive;
    case 'link': return LinkIcon;
    case 'docx': return FileText;
    case 'pptx': return Monitor;
    default: return FileText;
  }
};

export const InstructorSessionsPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('resources');
  const [resources, setResources] = useState([]);
  const [, setAttendance] = useState([]);
  const [attendanceStudents, setAttendanceStudents] = useState([]);
  const [attendanceDraft, setAttendanceDraft] = useState({});
  const [tasks, setTasks] = useState([]);
  const [selectedBootcampId, setSelectedBootcampId] = useState('');
  const [qrToken, setQrToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submittingAttendance, setSubmittingAttendance] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [details, setDetails] = useState({ description: '', location: 'Lab 1', meetingLink: '' });
  const [resourceForm, setResourceForm] = useState({ title: '', description: '', type: 'file', url: '', file: null });
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [savedDetails, setSavedDetails] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [notified, setNotified] = useState(false);
  const [taskForm, setTaskForm] = useState(emptyTask);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackStats, setFeedbackStats] = useState({ averageRating: 0, totalFeedbacks: 0 });

  const loadSessions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await sessionService.getSessions();
      setSessions(response.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load assigned sessions.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSessionDetails = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    setError('');
    try {
      const [sessionResponse, resourceResponse, attendanceResponse, taskResponse, feedbackStatsResponse, feedbackResponse] = await Promise.all([
        sessionService.getSessionById(sessionId),
        resourceService.getResourcesBySession(sessionId),
        attendanceService.getAttendance(sessionId),
        taskService.getTasks({ session: sessionId }),
        feedbackService.getSessionStats(sessionId).catch(() => ({ averageRating: 0, totalFeedbacks: 0 })),
        feedbackService.getFeedback({ session: sessionId }).catch(() => []),
      ]);

      const currentSession = sessionResponse.data;
      setSession(currentSession);
      setDetails({
        description: currentSession.description || '',
        location: currentSession.location || 'Lab 1',
        meetingLink: currentSession.meetingLink || '',
      });
      setResources(resourceResponse || []);
      setAttendance(attendanceResponse.data || []);
      setAttendanceStudents(attendanceResponse.students || []);
      const savedDraft = JSON.parse(localStorage.getItem(`attendance-draft:${sessionId}`) || '{}');
      const existingDraft = (attendanceResponse.data || []).reduce((acc, record) => {
        const studentId = record.student?._id || record.student;
        if (studentId) acc[studentId] = record.status;
        return acc;
      }, {});
      setAttendanceDraft({ ...existingDraft, ...savedDraft });
      setTasks(taskResponse.data || []);
      setFeedbackStats(feedbackStatsResponse || { averageRating: 0, totalFeedbacks: 0 });
      setFeedbacks((feedbackResponse || []).filter(f => f.session?._id === sessionId || f.session === sessionId));
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load session workspace.');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) loadSessionDetails();
    else loadSessions();
  }, [sessionId, loadSessionDetails, loadSessions]);

  const sessionStats = useMemo(() => ({
    upcoming: sessions.filter((item) => new Date(item.startTime) > new Date()).length,
  }), [sessions]);

  const bootcampGroups = useMemo(() => {
    const groups = new Map();

    sessions.forEach((item) => {
      const bootcamp = item.bootcamp;
      const bootcampId = bootcamp?._id || bootcamp || 'unassigned';
      const existing = groups.get(bootcampId) || {
        id: bootcampId,
        name: bootcamp?.name || 'Unassigned bootcamp',
        sessions: [],
        upcoming: 0,
        completed: 0,
      };

      existing.sessions.push(item);
      if (new Date(item.startTime) > new Date()) existing.upcoming += 1;
      if (item.status === 'completed') existing.completed += 1;
      groups.set(bootcampId, existing);
    });

    return Array.from(groups.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [sessions]);

  const selectedBootcamp = useMemo(
    () => bootcampGroups.find((bootcamp) => bootcamp.id === selectedBootcampId),
    [bootcampGroups, selectedBootcampId]
  );

  const visibleSessions = selectedBootcamp?.sessions || [];

  const displayedStats = selectedBootcamp
    ? {
        assigned: visibleSessions.length,
        upcoming: selectedBootcamp.upcoming,
      }
    : {
        assigned: sessions.length,
        upcoming: sessionStats.upcoming,
      };

  const saveDetails = async () => {
    setSaving(true);
    setSavedDetails(false);
    try {
      const payload = {
        ...details,
        status: details.location || details.meetingLink || details.description ? 'ready' : session.status,
      };
      const response = await sessionService.updateSession(session._id, payload);
      setSession(response.data);
      setDetails({
        description: response.data.description || '',
        location: response.data.location || 'Lab 1',
        meetingLink: response.data.meetingLink || '',
      });
      setSavedDetails(true);
      window.setTimeout(() => setSavedDetails(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const notifyStudents = async () => {
    setNotifying(true);
    setNotified(false);
    try {
      await sessionService.updateSession(session._id, { notifyStudents: true });
      setNotified(true);
      setToast({ type: 'success', message: 'Students notified successfully.' });
      window.setTimeout(() => { setToast(null); setNotified(false); }, 3000);
    } catch (err) {
      setToast({ type: 'error', message: err?.response?.data?.message || 'Failed to notify students.' });
      window.setTimeout(() => setToast(null), 3000);
    } finally {
      setNotifying(false);
    }
  };

  const endSession = async () => {
    setSaving(true);
    try {
      const response = await sessionService.updateSession(session._id, { status: 'completed', notifyStudents: true });
      setSession(response.data);
      setActiveTab('feedback');
      setToast({ type: 'success', message: 'Session ended. Students can now submit feedback.' });
      window.setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast({ type: 'error', message: err?.response?.data?.message || 'Failed to end session.' });
      window.setTimeout(() => setToast(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const uploadResource = async (event) => {
    event.preventDefault();
    
    let finalTitle = resourceForm.title;
    if (!finalTitle) {
      finalTitle = resourceForm.type === 'link' ? 'Resource Link' : (resourceForm.file?.name || 'Resource File');
    }

    if (resourceForm.type === 'file' && !resourceForm.file) {
      setToast({ type: 'error', message: 'Please select a file to upload.' });
      window.setTimeout(() => setToast(null), 3000);
      return;
    }
    if (resourceForm.type === 'link' && !resourceForm.url) {
      setToast({ type: 'error', message: 'Please provide a valid link.' });
      window.setTimeout(() => setToast(null), 3000);
      return;
    }

    const data = new FormData();
    data.append('title', finalTitle);
    data.append('description', resourceForm.description);
    if (resourceForm.type === 'file') data.append('file', resourceForm.file);
    if (resourceForm.type === 'link') data.append('external_url', resourceForm.url);
    data.append('session_id', session._id);
    data.append('bootcamp_id', session.bootcamp?._id || session.bootcamp);
    data.append('visibility', 'bootcamp');

    setUploading(true);
    setUploaded(false);
    try {
      await resourceService.uploadResource(data);
      setResourceForm({ title: '', description: '', type: 'file', url: '', file: null });
      const response = await resourceService.getResourcesBySession(session._id);
      setResources(response || []);
      setUploaded(true);
      setToast({ type: 'success', message: 'Resource uploaded successfully.' });
      window.setTimeout(() => { setToast(null); setUploaded(false); }, 3000);
    } catch (err) {
      setToast({ type: 'error', message: err?.response?.data?.message || 'Failed to upload resource.' });
      window.setTimeout(() => setToast(null), 3000);
    } finally {
      setUploading(false);
    }
  };

  const createTask = async (event) => {
    event.preventDefault();
    await taskService.createTask({
      ...taskForm,
      session: session._id,
      bootcamp: session.bootcamp?._id || session.bootcamp,
    });
    setTaskForm(emptyTask);
    const response = await taskService.getTasks({ session: session._id });
    setTasks(response.data || []);
  };

  const generateQr = async () => {
    const response = await attendanceService.generateQRCode(session._id);
    setQrToken(response.qrToken || response.token || '');
  };

  const setDraftAttendance = (studentId, status) => {
    setAttendanceDraft((current) => ({ ...current, [studentId]: status }));
  };

  const saveAttendanceDraft = () => {
    localStorage.setItem(`attendance-draft:${session._id}`, JSON.stringify(attendanceDraft));
    setToast({ type: 'success', message: 'Attendance draft saved.' });
    window.setTimeout(() => setToast(null), 3000);
  };

  const submitAttendance = async () => {
    const records = attendanceStudents
      .map((student) => ({ studentId: student._id, status: attendanceDraft[student._id] }))
      .filter((record) => record.status);

    if (records.length === 0) {
      setToast({ type: 'error', message: 'Mark at least one student before submitting.' });
      window.setTimeout(() => setToast(null), 3000);
      return;
    }

    setSubmittingAttendance(true);
    try {
      const response = await attendanceService.submitAttendance(session._id, records);
      setAttendance(response.data || []);
      localStorage.removeItem(`attendance-draft:${session._id}`);
      setToast({ type: 'success', message: 'Attendance submitted and students notified.' });
      window.setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast({ type: 'error', message: err?.response?.data?.message || 'Failed to submit attendance.' });
      window.setTimeout(() => setToast(null), 3000);
    } finally {
      setSubmittingAttendance(false);
    }
  };

  if (!sessionId) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-portal-text">Sessions</h1>
            <p className="text-portal-text-muted mt-1">
              {selectedBootcamp
                ? `Open an assigned session in ${selectedBootcamp.name}.`
                : 'Choose an available bootcamp to view your assigned sessions.'}
            </p>
          </div>
          {selectedBootcamp && (
            <button onClick={() => setSelectedBootcampId('')} className="flex items-center gap-2 px-4 py-3 rounded-xl border border-portal-border text-portal-text-muted hover:text-portal-text hover:bg-portal-card transition-colors">
              <ArrowLeft className="w-4 h-4" /> Bootcamps
            </button>
          )}
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Bootcamps', value: bootcampGroups.length, icon: BookOpen },
            { label: 'Assigned', value: displayedStats.assigned, icon: ClipboardList },
            { label: 'Upcoming', value: displayedStats.upcoming, icon: Calendar },
          ].map((item) => (
            <div key={item.label} className="bg-portal-card border border-portal-border rounded-2xl p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-portal-accent/10 text-portal-accent"><item.icon className="w-5 h-5" /></div>
              <div>
                <p className="text-2xl font-black text-portal-text">{item.value}</p>
                <p className="text-xs text-portal-text-muted font-bold uppercase tracking-widest">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-portal-accent" /></div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-6">{error}</div>
        ) : sessions.length === 0 ? (
          <div className="bg-portal-card border border-portal-border rounded-3xl p-16 text-center">
            <BookOpen className="w-14 h-14 mx-auto text-portal-text-muted opacity-30 mb-4" />
            <h2 className="text-xl font-bold text-portal-text">No assigned sessions yet</h2>
            <p className="text-portal-text-muted mt-2">When an admin assigns you to a session, it will appear here.</p>
          </div>
        ) : !selectedBootcamp ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {bootcampGroups.map((bootcamp) => (
              <MotionButton
                whileHover={{ y: -4 }}
                key={bootcamp.id}
                onClick={() => setSelectedBootcampId(bootcamp.id)}
                className="text-left bg-portal-card border border-portal-border rounded-2xl p-6 hover:border-portal-accent transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-portal-accent/10 text-portal-accent"><BookOpen className="w-5 h-5" /></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-portal-text-muted">
                    {bootcamp.sessions.length} session{bootcamp.sessions.length === 1 ? '' : 's'}
                  </span>
                </div>
                <h3 className="text-lg font-black text-portal-text mb-2 line-clamp-1">{bootcamp.name}</h3>
                <div className="space-y-2 text-xs text-portal-text-muted">
                  <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {bootcamp.upcoming} upcoming</span>
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> {bootcamp.completed} completed</span>
                </div>
              </MotionButton>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {visibleSessions.map((item) => (
              <MotionButton
                whileHover={{ y: -4 }}
                key={item._id}
                onClick={() => navigate(`/instructor/sessions/${item._id}`)}
                className="text-left bg-portal-card border border-portal-border rounded-2xl p-6 hover:border-portal-accent transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-portal-accent/10 text-portal-accent"><BookOpen className="w-5 h-5" /></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-portal-text-muted">{item.status || 'scheduled'}</span>
                </div>
                <h3 className="text-lg font-black text-portal-text mb-2 line-clamp-1">{item.title}</h3>
                <p className="text-sm text-portal-text-muted line-clamp-2 mb-4">{item.description || 'Session details are not prepared yet.'}</p>
                <div className="space-y-2 text-xs text-portal-text-muted">
                  <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {fmtDateTime(item.startTime)}</span>
                  <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {item.location || 'Location not set'}</span>
                </div>
              </MotionButton>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (loading) return <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-portal-accent" /></div>;
  if (error) return <div className="max-w-4xl mx-auto bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-6">{error}</div>;
  if (!session) return null;

  const tabs = [
    { id: 'resources', label: 'Resources', icon: FileUp },
    { id: 'attendance', label: 'Attendance', icon: QrCode },
    { id: 'tasks', label: 'Tasks', icon: ClipboardList },
    { id: 'feedback', label: 'Feedback', icon: CheckCircle2 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {toast && (
        <div className={`fixed top-6 right-6 z-[200] rounded-xl border px-5 py-3 text-sm font-bold shadow-xl ${
          toast.type === 'success'
            ? 'bg-green-500/10 border-green-500/30 text-green-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {toast.message}
        </div>
      )}
      <header className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
        <div className="flex items-start gap-4">
          <button onClick={() => navigate('/instructor/sessions')} className="p-3 rounded-xl bg-portal-card border border-portal-border text-portal-text-muted hover:text-portal-text">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-extrabold text-portal-text">{session.title}</h1>
              <span className="px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-portal-accent/10 text-portal-accent border border-portal-accent/20">
                {session.status}
              </span>
            </div>
            <p className="text-sm text-portal-text-muted">{session.bootcamp?.name} • {fmtDateTime(session.startTime)} - {fmtDateTime(session.endTime)}</p>
          </div>
        </div>
        {session.status === 'completed' ? (
          <div className="px-5 py-3 rounded-xl bg-portal-card border border-portal-border text-sm text-portal-text-muted">
            Completed {fmtDateTime(session.completedAt || session.endTime)}
          </div>
        ) : (
          <button disabled={saving} onClick={endSession} className="px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-sm hover:bg-red-500/20 disabled:opacity-50">
            End Session
          </button>
        )}
      </header>

      <section className="bg-portal-card border border-portal-border rounded-2xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-portal-text-muted mb-2">Session description</label>
            <textarea value={details.description} onChange={(event) => setDetails((current) => ({ ...current, description: event.target.value }))} rows={4} className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-sm text-portal-text outline-none focus:border-portal-accent resize-none" placeholder="Add objectives, preparation notes, and instructions for students." />
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-portal-text-muted mb-2">Location</label>
              <select value={details.location} onChange={(event) => setDetails((current) => ({ ...current, location: event.target.value }))} className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-sm text-portal-text outline-none focus:border-portal-accent">
                <option value="Lab 1">Lab 1</option>
                <option value="Lab 2">Lab 2</option>
                <option value="Google Meet">Google Meet</option>
              </select>
            </div>
            {details.location === 'Google Meet' && (
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-portal-text-muted mb-2">Meeting link</label>
                <input value={details.meetingLink} onChange={(event) => setDetails((current) => ({ ...current, meetingLink: event.target.value }))} className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-sm text-portal-text outline-none focus:border-portal-accent" placeholder="https://meet.google.com/..." />
              </div>
            )}
            <button disabled={saving} onClick={saveDetails} className="w-full flex items-center justify-center gap-2 bg-portal-accent text-portal-bg px-4 py-3 rounded-xl font-bold text-sm hover:bg-portal-accent-hover disabled:opacity-60 transition-colors">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : savedDetails ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : savedDetails ? 'Saved!' : 'Save Details'}
            </button>
            <button disabled={notifying} onClick={notifyStudents} className="w-full flex items-center justify-center gap-2 border border-portal-accent text-portal-accent px-4 py-3 rounded-xl font-bold text-sm hover:bg-portal-accent/10 disabled:opacity-60 transition-colors">
              {notifying ? <Loader2 className="w-4 h-4 animate-spin" /> : notified ? <CheckCircle2 className="w-4 h-4" /> : <Users className="w-4 h-4" />}
              {notifying ? 'Notifying...' : notified ? 'Notified!' : 'Notify Students of Updates'}
            </button>
          </div>
        </div>
      </section>

      <nav className="flex flex-wrap gap-2 bg-portal-card border border-portal-border rounded-2xl p-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-portal-accent text-portal-bg' : 'text-portal-text-muted hover:text-portal-text hover:bg-portal-input'}`}>
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === 'resources' && (
        <section className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
          <form onSubmit={uploadResource} className="bg-portal-card border border-portal-border rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-black text-portal-text">Upload Resource</h2>
            <input value={resourceForm.title} onChange={(event) => setResourceForm((current) => ({ ...current, title: event.target.value }))} className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-sm text-portal-text outline-none" placeholder="Resource title" />
            <textarea value={resourceForm.description} onChange={(event) => setResourceForm((current) => ({ ...current, description: event.target.value }))} className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-sm text-portal-text outline-none resize-none" rows={3} placeholder="Short description" />
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-portal-input border border-portal-border p-1">
              {[
                { id: 'file', label: 'File' },
                { id: 'link', label: 'Link' },
              ].map((option) => (
                <button key={option.id} type="button" onClick={() => setResourceForm((current) => ({ ...current, type: option.id }))} className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors ${resourceForm.type === option.id ? 'bg-portal-accent text-portal-bg' : 'text-portal-text-muted hover:text-portal-text'}`}>
                  {option.label}
                </button>
              ))}
            </div>
            {resourceForm.type === 'file' ? (
              <input type="file" accept=".pdf,.zip,.jpg,.jpeg,.png,.gif,.webp,.mp4,.webm,.mov" onChange={(event) => setResourceForm((current) => ({ ...current, file: event.target.files?.[0] || null }))} className="w-full text-sm text-portal-text-muted" />
            ) : (
              <input type="url" value={resourceForm.url} onChange={(event) => setResourceForm((current) => ({ ...current, url: event.target.value }))} className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-sm text-portal-text outline-none" placeholder="https://notion.so/... or https://docs.google.com/..." />
            )}
            <button disabled={uploading} type="submit" className="w-full flex items-center justify-center gap-2 bg-portal-accent text-portal-bg px-4 py-3 rounded-xl font-bold text-sm hover:bg-portal-accent-hover disabled:opacity-60 transition-colors">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : uploaded ? <CheckCircle2 className="w-4 h-4" /> : <FileUp className="w-4 h-4" />}
              {uploading ? 'Uploading...' : uploaded ? 'Uploaded!' : 'Upload Resource'}
            </button>
          </form>
          <div className="space-y-3">
            {resources.length === 0 ? <EmptyState text="No resources uploaded for this session yet." /> : resources.map((resource) => {
              const Icon = getResourceIcon(resource.file_type || (resource.resource_type === 'link' ? 'link' : 'file'));
              return (
                <div key={resource._id} className="bg-portal-card border border-portal-border rounded-2xl p-5 flex items-center justify-between gap-4 group hover:border-portal-accent transition-all">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-portal-accent/10 text-portal-accent group-hover:bg-portal-accent group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-portal-text group-hover:text-portal-accent transition-colors">{resource.title}</h3>
                      <p className="text-sm text-portal-text-muted mt-0.5 line-clamp-1">{resource.description || (resource.resource_type === 'link' ? 'External resource link' : 'Resource file')}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-portal-input border border-portal-border text-portal-text-muted">
                          {resource.resource_type === 'link' ? 'Link' : resource.file_type?.toUpperCase() || 'File'}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-portal-text-muted">
                          {resource.download_count || 0} {resource.resource_type === 'link' ? 'clicks' : 'downloads'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => resourceService.openResource(resource)} className="p-2.5 rounded-xl text-portal-accent hover:bg-portal-accent/10 transition-colors" title="Open Resource">
                      <ExternalLink className="w-5 h-5" />
                    </button>
                    <button onClick={async () => { if(window.confirm('Delete this resource?')) { await resourceService.deleteResource(resource._id); setResources((current) => current.filter((item) => item._id !== resource._id)); } }} className="p-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors" title="Delete Resource">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {activeTab === 'attendance' && (
        <section className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
          <div className="bg-portal-card border border-portal-border rounded-2xl p-6 space-y-4">
            <p className="text-sm text-portal-text-muted">
              Mark enrolled students within 24 hours after the session ends.
            </p>
            <div className="rounded-xl bg-portal-input border border-portal-border p-4 space-y-2 text-sm text-portal-text-muted">
              <p className="font-bold text-portal-text">Status types</p>
              <p>Present</p>
              <p>Absent</p>
              <p>Late</p>
              <p>Excused</p>
            </div>
            <div className="rounded-xl bg-portal-input border border-portal-border p-4 space-y-2 text-sm text-portal-text-muted">
              <p className="font-bold text-portal-text">Rules</p>
              <p>One record per student per session</p>
              <p>Editable within 24 hours</p>
              <p>Late if more than 10 minutes</p>
            </div>
            {session.status !== 'completed' && (
              <>
                <button onClick={generateQr} className="w-full flex items-center justify-center gap-2 bg-portal-accent text-portal-bg px-4 py-3 rounded-xl font-bold text-sm"><QrCode className="w-4 h-4" /> Generate QR Token</button>
                {qrToken && <div className="break-all rounded-xl bg-portal-input border border-portal-border p-4 text-xs font-mono text-portal-text">{qrToken}</div>}
              </>
            )}
            {isAttendanceLocked(session) && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
                Attendance editing is closed for this session.
              </div>
            )}
          </div>
          <div className="bg-portal-card border border-portal-border rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-portal-border flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-portal-text font-black"><Users className="w-5 h-5 text-portal-accent" /> Enrolled Students</div>
              <div className="flex flex-wrap gap-2">
                <button type="button" disabled={isAttendanceLocked(session)} onClick={saveAttendanceDraft} className="px-4 py-2 rounded-xl border border-portal-border text-portal-text-muted hover:text-portal-text hover:bg-portal-input text-sm font-bold disabled:opacity-50">
                  Save Draft
                </button>
                <button type="button" disabled={isAttendanceLocked(session) || submittingAttendance} onClick={submitAttendance} className="px-4 py-2 rounded-xl bg-portal-accent text-portal-bg text-sm font-bold hover:bg-portal-accent-hover disabled:opacity-50">
                  {submittingAttendance ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
            {attendanceStudents.length === 0 ? <EmptyState text="No enrolled students found for this bootcamp." /> : attendanceStudents.map((student) => {
              const currentStatus = attendanceDraft[student._id] || '';
              return (
                <div key={student._id} className="px-5 py-4 border-b border-portal-border last:border-0 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-portal-text">{student.name || student.email || 'Student'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ATTENDANCE_STATUSES.map((status) => (
                      <button key={status} type="button" disabled={isAttendanceLocked(session)} onClick={() => setDraftAttendance(student._id, status)} className={`px-3 py-2 rounded-lg text-xs font-black uppercase tracking-widest border transition-colors disabled:opacity-50 ${currentStatus === status ? 'bg-portal-accent text-portal-bg border-portal-accent' : 'border-portal-border text-portal-text-muted hover:text-portal-text hover:bg-portal-input'}`}>
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {activeTab === 'tasks' && (
        <section className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
          <form onSubmit={createTask} className="bg-portal-card border border-portal-border rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-black text-portal-text">Create Task</h2>
            <input value={taskForm.title} onChange={(event) => setTaskForm((current) => ({ ...current, title: event.target.value }))} className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-sm text-portal-text outline-none" placeholder="Task title" />
            <textarea value={taskForm.description} onChange={(event) => setTaskForm((current) => ({ ...current, description: event.target.value }))} className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-sm text-portal-text outline-none resize-none" rows={3} placeholder="Task instructions" />
            <input type="datetime-local" value={taskForm.startTime} onChange={(event) => setTaskForm((current) => ({ ...current, startTime: event.target.value }))} className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-sm text-portal-text outline-none" />
            <input type="datetime-local" value={taskForm.endTime} onChange={(event) => setTaskForm((current) => ({ ...current, endTime: event.target.value }))} className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-sm text-portal-text outline-none" />
            <input type="datetime-local" value={taskForm.deadline} onChange={(event) => setTaskForm((current) => ({ ...current, deadline: event.target.value }))} className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-sm text-portal-text outline-none" />
            <button className="w-full flex items-center justify-center gap-2 bg-portal-accent text-portal-bg px-4 py-3 rounded-xl font-bold text-sm"><Plus className="w-4 h-4" /> Create Task</button>
          </form>
          <div className="space-y-3">
            {tasks.length === 0 ? <EmptyState text="No tasks created for this session yet." /> : tasks.map((task) => (
              <div key={task._id} className="bg-portal-card border border-portal-border rounded-2xl p-5">
                <h3 className="font-bold text-portal-text">{task.title}</h3>
                <p className="text-sm text-portal-text-muted mt-1">{task.description}</p>
                <p className="text-xs text-portal-text-muted mt-3">Deadline: {fmtDateTime(task.deadline || toDateTimeLocal(task.deadline))}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'feedback' && (
        <section className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          <div className="bg-portal-card border border-portal-border rounded-2xl p-6 h-fit">
            <h2 className="text-lg font-black text-portal-text mb-4">Feedback Overview</h2>
            <div className="space-y-6">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-portal-text-muted mb-1">Average Rating</p>
                <div className="flex items-center gap-2 text-3xl font-extrabold text-portal-text">
                  {(feedbackStats.averageRating || 0).toFixed(1)} <span className="text-portal-accent text-xl">★</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-portal-text-muted mb-1">Total Submissions</p>
                <p className="text-2xl font-bold text-portal-text">{feedbackStats.totalFeedbacks || 0}</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {feedbacks.length === 0 ? <EmptyState text="No student feedback received yet." /> : feedbacks.map((f, i) => (
              <div key={f._id || i} className="bg-portal-card border border-portal-border rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-portal-accent text-lg">{'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}</span>
                  <span className="text-xs font-bold text-portal-text-muted px-2 py-0.5 rounded-full bg-portal-input border border-portal-border">Anonymous Student</span>
                </div>
                {f.comment && <p className="text-sm text-portal-text-muted mt-2">{f.comment}</p>}
                <p className="text-[10px] font-black uppercase tracking-widest text-portal-text-muted mt-4">{fmtDateTime(f.createdAt)}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const EmptyState = ({ text }) => (
  <div className="bg-portal-card border border-portal-border rounded-2xl p-10 text-center text-sm text-portal-text-muted">
    {text}
  </div>
);
