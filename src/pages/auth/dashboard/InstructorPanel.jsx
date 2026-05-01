import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { ClipboardList, MessageSquare, ArrowRight, Loader2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import taskService from '../../../services/taskService';
import submissionService from '../../../services/submissionService';

export const InstructorPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ tasks: 0, pendingSubmissions: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const [recentSubmissions, setRecentSubmissions] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const [tasksRes, subsRes] = await Promise.all([
          taskService.getTasks({ division: user?.division }),
          submissionService.getSubmissions(),
        ]);
        const allSubs = subsRes.data || [];
        const pendingSubs = allSubs.filter(s => s.status === 'pending');
        setStats({
          tasks: (tasksRes.data || []).length,
          pendingSubmissions: pendingSubs.length,
        });
        setRecentSubmissions(allSubs.slice(0, 4));
      } catch {
        // fail silently — stats are secondary
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [user?.division]);

  const fmt = (d) =>
    d ? new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';

  const statCards = [
    { label: 'Total Tasks', value: stats.tasks, icon: ClipboardList },
    { label: 'Pending Reviews', value: stats.pendingSubmissions, icon: MessageSquare },
  ];

  const statusColors = {
    pending: 'text-yellow-400',
    approved: 'text-green-400',
    rejected: 'text-red-400',
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-portal-text">Instructor Dashboard</h1>
          <p className="text-portal-text-muted mt-1">Prepare assigned sessions, publish resources, manage attendance, and review student submissions.</p>
        </div>
        <button
          onClick={() => navigate('/instructor/sessions')}
          className="bg-portal-accent text-portal-bg px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-portal-accent/20 hover:bg-portal-accent-hover transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Calendar className="w-5 h-5" />
          Open Sessions
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-portal-card border border-portal-border p-6 rounded-2xl shadow-xl hover:border-portal-accent/50 transition-colors group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-portal-accent/10 text-portal-accent group-hover:bg-portal-accent group-hover:text-white transition-colors">
                <stat.icon className="w-6 h-6" />
              </div>
              {loadingStats && <Loader2 className="w-4 h-4 animate-spin text-portal-text-muted" />}
            </div>
            <h3 className="text-portal-text-muted text-sm font-medium mb-1">{stat.label}</h3>
            <div className="text-3xl font-bold text-portal-text tracking-tight">
              {loadingStats ? '—' : stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Submissions */}
      <div className="bg-portal-card border border-portal-border rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-portal-text flex items-center gap-2">
            <div className="w-1.5 h-6 bg-portal-accent rounded-full" />
            Recent Submissions
          </h3>
          <button
            onClick={() => navigate('/instructor/tasks')}
            className="flex items-center gap-1.5 text-sm font-semibold text-portal-accent hover:text-portal-text transition-colors"
          >
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loadingStats ? (
          <div className="flex items-center gap-2 text-portal-text-muted text-sm py-4">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading…
          </div>
        ) : recentSubmissions.length === 0 ? (
          <p className="text-sm text-portal-text-muted py-4">No submissions yet.</p>
        ) : (
          <div className="space-y-3">
            {recentSubmissions.map((sub, i) => (
              <div key={sub._id || i} className="flex items-center justify-between p-4 rounded-xl bg-portal-input border border-portal-border hover:bg-portal-border transition-colors">
                <div>
                  <h4 className="font-bold text-sm text-portal-text">{sub.student?.email || 'Unknown'}</h4>
                  <p className="text-xs text-portal-text-muted mt-0.5">
                    {sub.task?.title || 'Task'} • {fmt(sub.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold capitalize ${statusColors[sub.status] || 'text-portal-text-muted'}`}>
                    {sub.status}
                  </span>
                  {sub.status === 'pending' && (
                    <button
                      onClick={() => navigate('/instructor/tasks')}
                      className="bg-portal-accent text-portal-bg px-4 py-1.5 rounded-lg text-xs font-bold shadow-md shadow-portal-accent/20 hover:bg-portal-accent-hover transition-all"
                    >
                      Grade
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
