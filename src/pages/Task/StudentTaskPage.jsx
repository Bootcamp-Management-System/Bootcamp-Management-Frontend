import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, Lock, Play, Trophy, Loader2, AlertCircle,
  ExternalLink, X, Send, RefreshCw, Clock, Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import taskService from '../../services/taskService';
import submissionService from '../../services/submissionService';

const MotionDiv = motion.div;
const MotionH2 = motion.h2;
const MotionP = motion.p;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const isOverdue = (deadline) => new Date(deadline) < new Date();

const getTaskStatus = (task, mySubmission) => {
  if (mySubmission) return 'done';
  if (isOverdue(task.deadline)) return 'overdue';
  return 'new';
};

// ─── Submit Modal ─────────────────────────────────────────────────────────────
const SubmitModal = ({ task, existingSubmission, onClose, onSubmit }) => {
  const [contentUrl, setContentUrl] = useState(existingSubmission?.contentUrl || '');
  const [comment, setComment] = useState(existingSubmission?.comment || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isReviewed = existingSubmission && existingSubmission.status !== 'pending';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!contentUrl.trim()) return setError('Please paste your submission link.');
    setLoading(true);
    try {
      await onSubmit(task._id, { contentUrl, comment });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || err.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text text-sm placeholder:text-portal-text-muted focus:outline-none focus:border-portal-accent transition-colors';

  const statusBadge = {
    pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    approved: 'bg-green-500/15 text-green-400 border-green-500/30',
    rejected: 'bg-red-500/15 text-red-400 border-red-500/30',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <MotionDiv
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-portal-card border border-portal-border rounded-2xl shadow-2xl w-full max-w-lg"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-portal-border">
          <div>
            <h2 className="text-xl font-bold text-portal-text">{task.title}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs text-portal-text-muted">
                <Clock className="w-3 h-3" /> Deadline: {fmt(task.deadline)}
              </span>
              {existingSubmission && (
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${statusBadge[existingSubmission.status]}`}>
                  {existingSubmission.status}
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-portal-border transition-colors text-portal-text-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task Description */}
        <div className="px-6 py-4 border-b border-portal-border">
          <p className="text-sm text-portal-text-muted leading-relaxed">{task.description}</p>
        </div>

        {/* Review feedback if graded */}
        {isReviewed && (
          <div className={`mx-6 mt-4 p-4 rounded-xl border ${existingSubmission.status === 'approved' ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
            <p className="text-sm font-bold text-portal-text mb-1">
              {existingSubmission.status === 'approved' ? '✓ Approved' : '✕ Rejected'}
              {existingSubmission.grade != null ? ` — Grade: ${existingSubmission.grade}/100` : ''}
            </p>
            {existingSubmission.feedback && (
              <p className="text-sm text-portal-text-muted italic">"{existingSubmission.feedback}"</p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-portal-text-muted uppercase tracking-wider mb-1.5">
              Submission Link <span className="text-red-400">*</span>
            </label>
            <input
              type="url"
              value={contentUrl}
              onChange={e => setContentUrl(e.target.value)}
              placeholder="https://github.com/you/your-repo"
              className={inputClass}
              disabled={isReviewed}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-portal-text-muted uppercase tracking-wider mb-1.5">
              Comment (optional)
            </label>
            <textarea
              rows={2}
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Anything you want to say to your instructor…"
              className={`${inputClass} resize-none`}
              disabled={isReviewed}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border border-portal-border text-portal-text-muted hover:text-portal-text hover:bg-portal-border transition-colors text-sm font-semibold">
              Close
            </button>
            {!isReviewed && (
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-portal-accent text-white font-bold text-sm shadow-lg shadow-portal-accent/20 hover:bg-portal-accent-hover transition-all disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {loading ? 'Submitting…' : existingSubmission ? 'Update Submission' : 'Submit Task'}
              </button>
            )}
          </div>
        </form>
      </MotionDiv>
    </div>
  );
};

// ─── Task Node ────────────────────────────────────────────────────────────────
const TaskNode = ({ task, index, mySubmission, onClick }) => {
  const status = getTaskStatus(task, mySubmission);
  const isLeft = index % 2 === 0;
  const isDone = status === 'done';
  const isOverdueTask = status === 'overdue';
  const isActive = status === 'new';

  const nodeClass = [
    'w-16 h-16 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-110 z-20 relative group',
    isDone && 'bg-portal-accent shadow-[0_0_25px_rgba(45,212,191,0.5)]',
    isActive && 'bg-slate-800 border-2 border-portal-accent/60 text-portal-accent animate-pulse shadow-[0_0_15px_rgba(45,212,191,0.2)]',
    isOverdueTask && 'bg-red-950 border-2 border-red-500/40 text-red-400',
  ].filter(Boolean).join(' ');

  return (
    <div className="relative flex items-center justify-center">
      <MotionDiv
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: index * 0.08 }}
        className={nodeClass}
        style={isDone ? { borderRadius: '45% 55% 50% 50% / 55% 45% 55% 45%' } : {}}
        onClick={() => onClick(task)}
      >
        {isDone && (
          <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center shadow-inner">
            <Check className="w-5 h-5 text-portal-text stroke-[4]" />
          </div>
        )}
        {isActive && <Play className="w-8 h-8 fill-current" />}
        {isOverdueTask && <Clock className="w-7 h-7 opacity-80" />}
      </MotionDiv>

      {/* Desktop Card */}
      <MotionDiv
        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
        whileInView={{ opacity: 1, x: isLeft ? -100 : 100 }}
        viewport={{ once: true }}
        className={`absolute top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-2 w-[300px] bg-portal-card border border-portal-border p-5 rounded-2xl shadow-2xl hover:border-portal-accent/40 transition-colors cursor-pointer
          ${isLeft ? 'right-[50%] mr-12 text-right items-end' : 'left-[50%] ml-12 text-left items-start'}`}
        onClick={() => onClick(task)}
      >
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border
            ${isDone ? 'bg-green-500/10 text-green-400 border-green-500/20' :
              isOverdueTask ? 'bg-red-500/10 text-red-400 border-red-500/20' :
              'bg-portal-accent/10 text-portal-accent border-portal-accent/20'}`}>
            {isDone ? 'Submitted' : isOverdueTask ? 'Overdue' : 'Open'}
          </span>
          {mySubmission?.grade != null && (
            <span className="text-[10px] font-bold text-portal-accent">Grade: {mySubmission.grade}/100</span>
          )}
        </div>

        <h3 className="text-base font-bold text-portal-text">{task.title}</h3>
        <p className="text-xs text-portal-text-muted leading-relaxed line-clamp-2">{task.description}</p>

        <div className="flex items-center gap-1 text-xs text-portal-text-muted mt-1">
          <Calendar className="w-3 h-3" /> {fmt(task.deadline)}
        </div>

        {!isDone && !isOverdueTask && (
          <button className="mt-2 bg-portal-accent text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md shadow-portal-accent/20 hover:bg-portal-accent-hover transition-all">
            Start Task →
          </button>
        )}
        {isDone && (
          <button className="mt-2 border border-portal-border text-portal-text-muted px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-portal-border transition-all flex items-center gap-1">
            <ExternalLink className="w-3 h-3" /> View Submission
          </button>
        )}
      </MotionDiv>

      {/* Mobile label */}
      <div className="absolute -bottom-10 md:hidden text-center whitespace-nowrap">
        <h4 className="text-xs font-bold text-portal-text">{task.title}</h4>
        <p className="text-[10px] text-portal-text-muted">{fmt(task.deadline)}</p>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export const StudentTaskPage = ({ bootcampId, embedded = false }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [mySubmissions, setMySubmissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTask, setActiveTask] = useState(null);

  const divisionId = user?.division;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [tasksRes, subsRes] = await Promise.all([
        taskService.getTasks(bootcampId ? { bootcamp: bootcampId } : { division: divisionId }),
        submissionService.getSubmissions(),
      ]);

      const tasks = tasksRes.data || [];
      const subs = subsRes.data || [];

      // Map submissions by taskId for quick lookup
      const subMap = {};
      subs.forEach(s => {
        subMap[s.task?._id || s.task] = s;
      });

      setTasks(tasks);
      setMySubmissions(subMap);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [divisionId, bootcampId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (taskId, data) => {
    const existing = mySubmissions[taskId];
    if (existing && existing.status === 'pending') {
      await submissionService.updateSubmission(existing._id, data);
    } else {
      await submissionService.submitTask(taskId, data);
    }
    await fetchData();
  };

  return (
    <>
      <AnimatePresence>
        {activeTask && (
          <SubmitModal
            task={activeTask}
            existingSubmission={mySubmissions[activeTask._id]}
            onClose={() => setActiveTask(null)}
            onSubmit={handleSubmit}
          />
        )}
      </AnimatePresence>

      <div className={`${embedded ? 'max-w-5xl mx-auto py-2' : 'max-w-4xl mx-auto py-8 px-4 min-h-screen'}`}>
        <header className="text-center mb-14">
          <MotionH2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-portal-text mb-3 tracking-tight"
          >
            {bootcampId ? 'My Tasks' : 'Your Task Path'}
          </MotionH2>
          <MotionP
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-portal-text-muted text-base max-w-lg mx-auto"
          >
            Complete each task to level up. Click any node to view details and submit your work.
          </MotionP>

          <div className="flex items-center justify-center gap-6 mt-6 text-xs font-semibold text-portal-text-muted">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-portal-accent inline-block" /> Submitted</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-700 border border-portal-accent/50 inline-block" /> Active</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-950 border border-red-500/40 inline-block" /> Overdue</span>
            {!embedded && (
              <button onClick={fetchData} className="flex items-center gap-1 text-portal-accent hover:underline">
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            )}
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-portal-text-muted">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-portal-accent" />
            <p className="text-sm">Loading your tasks…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-red-400 gap-3">
            <AlertCircle className="w-10 h-10" />
            <p className="text-sm font-semibold">{error}</p>
            <button onClick={fetchData} className="text-sm text-portal-accent hover:underline">Retry</button>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-portal-text-muted gap-4">
            <div className="p-5 rounded-2xl bg-portal-card border border-portal-border">
              <Trophy className="w-12 h-12 text-portal-accent/40" />
            </div>
            <p className="text-lg font-bold text-portal-text">No tasks assigned yet</p>
            <p className="text-sm">
              {bootcampId
                ? "Your instructor hasn't assigned any tasks for this bootcamp yet."
                : "Your instructor hasn't assigned any tasks to your division."}
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Central Path Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-portal-border -translate-x-1/2 z-0">
              <MotionDiv
                initial={{ height: 0 }}
                animate={{ height: '100%' }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                className="w-full bg-portal-accent/30 shadow-[0_0_15px_rgba(45,212,191,0.2)]"
              />
            </div>

            <div className="space-y-32 relative z-10">
              {tasks.map((task, index) => (
                <TaskNode
                  key={task._id}
                  task={task}
                  index={index}
                  mySubmission={mySubmissions[task._id]}
                  onClick={setActiveTask}
                />
              ))}
            </div>
            <div className="h-20" />
          </div>
        )}
      </div>
    </>
  );
};
