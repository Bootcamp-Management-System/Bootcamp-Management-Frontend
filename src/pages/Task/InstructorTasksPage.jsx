import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, ClipboardList, Clock, Users, ChevronDown, ChevronUp,
  CheckCircle, XCircle, AlertCircle, Loader2, X, Calendar,
  ExternalLink, Star, Trash2, RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import taskService from '../../services/taskService';
import submissionService from '../../services/submissionService';
import sessionService from '../../services/sessionService';

// ─── Helper ─────────────────────────────────────────────────────────────────
const fmt = (date) =>
  date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const statusColor = (status) => ({
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  approved: 'bg-green-500/20 text-green-400 border-green-500/30',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
}[status] || 'bg-slate-500/20 text-slate-400 border-slate-500/30');

// ─── Create Task Modal ───────────────────────────────────────────────────────
const CreateTaskModal = ({ onClose, onCreate, divisionId, sessions }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    session: '',
    startTime: '',
    endTime: '',
    deadline: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.description || !form.session || !form.startTime || !form.endTime || !form.deadline) {
      return setError('All fields, including session, are required.');
    }
    setLoading(true);
    try {
      await onCreate({ ...form, division: divisionId });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to create task.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text text-sm placeholder:text-portal-text-muted focus:outline-none focus:border-portal-accent transition-colors';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-portal-card border border-portal-border rounded-2xl shadow-2xl w-full max-w-lg"
      >
        <div className="flex items-center justify-between p-6 border-b border-portal-border">
          <div>
            <h2 className="text-xl font-bold text-portal-text">Create New Task</h2>
            <p className="text-sm text-portal-text-muted mt-0.5">Assign a task to your division</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-portal-border transition-colors text-portal-text-muted hover:text-portal-text">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-portal-text-muted uppercase tracking-wider mb-1.5">Title</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Build a REST API" className={inputClass} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-portal-text-muted uppercase tracking-wider mb-1.5">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="What should students do?" className={`${inputClass} resize-none`} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-portal-text-muted uppercase tracking-wider mb-1.5">Target Session</label>
            <select name="session" value={form.session} onChange={handleChange} className={inputClass}>
              <option value="" disabled>Select a session you instruct</option>
              {sessions.map(s => (
                <option key={s._id} value={s._id}>{s.title} ({new Date(s.startTime).toLocaleDateString()})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-portal-text-muted uppercase tracking-wider mb-1.5">Start Time</label>
              <input type="datetime-local" name="startTime" value={form.startTime} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-portal-text-muted uppercase tracking-wider mb-1.5">End Time</label>
              <input type="datetime-local" name="endTime" value={form.endTime} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-portal-text-muted uppercase tracking-wider mb-1.5">Deadline</label>
            <input type="datetime-local" name="deadline" value={form.deadline} onChange={handleChange} className={inputClass} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border border-portal-border text-portal-text-muted hover:text-portal-text hover:bg-portal-border transition-colors text-sm font-semibold">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-portal-accent text-portal-bg font-bold text-sm shadow-lg shadow-portal-accent/20 hover:bg-portal-accent-hover transition-all disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {loading ? 'Creating…' : 'Create Task'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// ─── Review Modal ────────────────────────────────────────────────────────────
const ReviewModal = ({ submission, onClose, onReview }) => {
  const [form, setForm] = useState({ status: 'approved', grade: '', feedback: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onReview(submission._id, form);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Review failed.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text text-sm focus:outline-none focus:border-portal-accent transition-colors';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-portal-card border border-portal-border rounded-2xl shadow-2xl w-full max-w-lg"
      >
        <div className="flex items-center justify-between p-6 border-b border-portal-border">
          <div>
            <h2 className="text-xl font-bold text-portal-text">Review Submission</h2>
            <p className="text-sm text-portal-text-muted mt-0.5">{submission.student?.email}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-portal-border transition-colors text-portal-text-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 border-b border-portal-border">
          <p className="text-xs font-bold text-portal-text-muted uppercase tracking-wider mb-2">Submission Link</p>
          <a href={submission.contentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-portal-accent hover:underline text-sm break-all">
            <ExternalLink className="w-4 h-4 shrink-0" />
            {submission.contentUrl}
          </a>
          {submission.comment && (
            <p className="mt-3 text-sm text-portal-text-muted italic">"{submission.comment}"</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-portal-text-muted uppercase tracking-wider mb-1.5">Decision</label>
            <div className="grid grid-cols-2 gap-3">
              {['approved', 'rejected'].map((s) => (
                <button type="button" key={s} onClick={() => setForm(p => ({ ...p, status: s }))}
                  className={`py-3 rounded-xl border text-sm font-bold capitalize transition-all ${form.status === s
                    ? s === 'approved' ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-red-500/20 border-red-500/50 text-red-400'
                    : 'border-portal-border text-portal-text-muted hover:bg-portal-border'}`}>
                  {s === 'approved' ? '✓ Approve' : '✕ Reject'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-portal-text-muted uppercase tracking-wider mb-1.5">Grade (optional)</label>
            <input type="number" min="0" max="100" placeholder="0–100" value={form.grade} onChange={e => setForm(p => ({ ...p, grade: e.target.value }))} className={inputClass} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-portal-text-muted uppercase tracking-wider mb-1.5">Feedback (optional)</label>
            <textarea rows={3} placeholder="Leave feedback for the student…" value={form.feedback} onChange={e => setForm(p => ({ ...p, feedback: e.target.value }))} className={`${inputClass} resize-none`} />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border border-portal-border text-portal-text-muted hover:text-portal-text hover:bg-portal-border transition-colors text-sm font-semibold">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-portal-accent text-portal-bg font-bold text-sm shadow-lg shadow-portal-accent/20 hover:bg-portal-accent-hover transition-all disabled:opacity-60">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
              {loading ? 'Saving…' : 'Submit Review'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// ─── Task Card ───────────────────────────────────────────────────────────────
const TaskCard = ({ task, onDelete, onReviewSubmission }) => {
  const [expanded, setExpanded] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null);

  const isPast = new Date(task.deadline) < new Date();

  const loadSubmissions = useCallback(async () => {
    if (!expanded) return;
    setLoadingSubs(true);
    try {
      const res = await submissionService.getSubmissions({ taskId: task._id });
      setSubmissions(res.data || []);
    } catch {
      setSubmissions([]);
    } finally {
      setLoadingSubs(false);
    }
  }, [expanded, task._id]);

  useEffect(() => { loadSubmissions(); }, [loadSubmissions]);

  const handleReview = async (submissionId, data) => {
    await onReviewSubmission(submissionId, data);
    await loadSubmissions();
  };

  return (
    <>
      <AnimatePresence>
        {reviewTarget && (
          <ReviewModal
            submission={reviewTarget}
            onClose={() => setReviewTarget(null)}
            onReview={handleReview}
          />
        )}
      </AnimatePresence>

      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-portal-card border border-portal-border rounded-2xl overflow-hidden hover:border-portal-accent/40 transition-colors"
      >
        {/* Header */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${isPast ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-portal-accent/10 text-portal-accent border-portal-accent/20'}`}>
                  {isPast ? 'Past Due' : 'Active'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-portal-text truncate">{task.title}</h3>
              <p className="text-sm text-portal-text-muted mt-1 line-clamp-2">{task.description}</p>
            </div>
            <button onClick={() => onDelete(task._id)} className="p-2 rounded-lg text-portal-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-xs text-portal-text-muted">
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-portal-accent" /> Start: {fmt(task.startTime)}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-red-400" /> Deadline: {fmt(task.deadline)}</span>
          </div>
        </div>

        {/* Toggle Submissions */}
        <button
          onClick={() => setExpanded(p => !p)}
          className="w-full flex items-center justify-between px-6 py-3 border-t border-portal-border hover:bg-portal-input transition-colors text-sm font-semibold text-portal-text-muted"
        >
          <span className="flex items-center gap-2"><Users className="w-4 h-4" /> View Submissions</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-portal-border"
            >
              <div className="p-6">
                {loadingSubs ? (
                  <div className="flex items-center gap-2 text-portal-text-muted text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading submissions…
                  </div>
                ) : submissions.length === 0 ? (
                  <p className="text-sm text-portal-text-muted">No submissions yet.</p>
                ) : (
                  <div className="space-y-3">
                    {submissions.map((sub) => (
                      <div key={sub._id} className="flex items-center justify-between p-4 bg-portal-input rounded-xl border border-portal-border">
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-portal-text truncate">{sub.student?.email || 'Unknown'}</p>
                          <p className="text-xs text-portal-text-muted mt-0.5">Submitted {fmt(sub.createdAt)}</p>
                          {sub.grade != null && <p className="text-xs text-portal-accent mt-0.5">Grade: {sub.grade}/100</p>}
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border ${statusColor(sub.status)}`}>{sub.status}</span>
                          {sub.status === 'pending' && (
                            <button onClick={() => setReviewTarget(sub)} className="bg-portal-accent text-portal-bg px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-portal-accent-hover transition-all shadow-md shadow-portal-accent/20">
                              Grade
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
export const InstructorTasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const divisionId = user?.division;

  const fetchTasksAndSessions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [tasksRes, sessionsRes] = await Promise.all([
        taskService.getTasks({ division: divisionId }),
        sessionService.getSessions({ division: divisionId })
      ]);
      setTasks(tasksRes.data || []);
      
      const allSessions = sessionsRes.data || [];
      // Instructors can only create tasks for sessions they instruct
      const mySessions = allSessions.filter(s => 
        (s.instructor?._id || s.instructor) === (user?.id || user?._id) || 
        user?.role === 'admin' || user?.role === 'super_admin'
      );
      setSessions(mySessions);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load data.');
    } finally {
      setLoading(false);
    }
  }, [divisionId, user]);

  useEffect(() => { fetchTasksAndSessions(); }, [fetchTasksAndSessions]);

  const handleCreate = async (data) => {
    await taskService.createTask(data);
    await fetchTasksAndSessions();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || 'Delete failed.');
    }
  };

  const handleReviewSubmission = async (submissionId, data) => {
    await submissionService.reviewSubmission(submissionId, data);
  };

  return (
    <>
      <AnimatePresence>
        {showCreate && (
          <CreateTaskModal
            onClose={() => setShowCreate(false)}
            onCreate={handleCreate}
            divisionId={divisionId}
            sessions={sessions}
          />
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <h2 className="text-3xl font-extrabold text-portal-text mb-1">Task Management</h2>
            <p className="text-portal-text-muted">Create tasks and review student submissions for your division.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchTasksAndSessions} className="p-3 rounded-xl border border-portal-border text-portal-text-muted hover:text-portal-text hover:bg-portal-border transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (sessions.length === 0) {
                  alert('You have no sessions assigned to you. An admin must schedule a session for you first.');
                  return;
                }
                setShowCreate(true);
              }}
              className="flex items-center gap-2 bg-portal-accent text-portal-bg px-5 py-3 rounded-xl font-bold text-sm shadow-lg shadow-portal-accent/20 hover:bg-portal-accent-hover transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" /> Create Task
            </button>
          </div>
        </motion.header>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Tasks', value: tasks.length, icon: ClipboardList, color: 'text-portal-accent' },
            { label: 'Active Tasks', value: tasks.filter(t => new Date(t.deadline) > new Date()).length, icon: Clock, color: 'text-green-400' },
            { label: 'Past Due', value: tasks.filter(t => new Date(t.deadline) < new Date()).length, icon: AlertCircle, color: 'text-red-400' },
          ].map((s, i) => (
            <div key={i} className="bg-portal-card border border-portal-border rounded-2xl p-5 flex items-center gap-4">
              <div className={`p-2.5 rounded-xl bg-portal-input ${s.color}`}><s.icon className="w-5 h-5" /></div>
              <div>
                <p className="text-2xl font-extrabold text-portal-text">{s.value}</p>
                <p className="text-xs text-portal-text-muted">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-portal-text-muted">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-portal-accent" />
            <p className="text-sm">Loading tasks…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-red-400 gap-3">
            <XCircle className="w-10 h-10" />
            <p className="text-sm font-semibold">{error}</p>
            <button onClick={fetchTasksAndSessions} className="text-sm text-portal-accent hover:underline">Retry</button>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-portal-text-muted gap-4">
            <div className="p-5 rounded-2xl bg-portal-card border border-portal-border">
              <ClipboardList className="w-12 h-12 text-portal-accent/40" />
            </div>
            <p className="text-lg font-bold text-portal-text">No tasks yet</p>
            <p className="text-sm">Click "Create Task" to assign your first task.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onDelete={handleDelete}
                onReviewSubmission={handleReviewSubmission}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};
