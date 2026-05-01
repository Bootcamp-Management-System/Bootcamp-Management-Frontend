import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Calendar, ExternalLink, FileText, Loader2, MapPin, Monitor, RefreshCw } from 'lucide-react';
import sessionService from '../../services/sessionService';
import resourceService from '../../services/resourceService';
import feedbackService from '../../services/feedbackService';
import { Star, FileVideo, FileArchive, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

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

const fmtDateTime = (value) =>
  value ? new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }) : 'Not set';

export const StudentSessionsPage = ({ bootcampId, embedded = false }) => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [session, setSession] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedbackForm, setFeedbackForm] = useState({ rating: 0, comment: '' });
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [toast, setToast] = useState(null);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await sessionService.getSessions(bootcampId ? { bootcamp: bootcampId } : {});
      setSessions(response.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load sessions.');
    } finally {
      setLoading(false);
    }
  }, [bootcampId]);

  const loadSession = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    setError('');
    try {
      const [sessionResponse, resourceResponse, feedbackResponse] = await Promise.all([
        sessionService.getSessionById(sessionId),
        resourceService.getResourcesBySession(sessionId),
        feedbackService.getFeedback({ session: sessionId }).catch(() => []),
      ]);
      setSession(sessionResponse.data);
      setResources(resourceResponse || []);
      setFeedbackSubmitted(feedbackResponse.length > 0);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load this session.');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) loadSession();
    else loadSessions();
  }, [sessionId, loadSession, loadSessions]);

  const submitFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackForm.rating) {
      setToast({ type: 'error', message: 'Please provide a rating.' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setIsSubmittingFeedback(true);
    try {
      await feedbackService.submitFeedback({
        sessionId,
        rating: feedbackForm.rating,
        comment: feedbackForm.comment,
      });
      setFeedbackSubmitted(true);
      setFeedbackForm({ rating: 0, comment: '' });
      setToast({ type: 'success', message: 'Feedback submitted anonymously.' });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast({ type: 'error', message: err?.response?.data?.message || err?.response?.data?.error || 'Failed to submit feedback.' });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  if (!sessionId) {
    return (
      <div className={`${embedded ? '' : 'max-w-6xl mx-auto'} space-y-8`}>
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-portal-text">Sessions</h1>
            <p className="text-portal-text-muted mt-1">View scheduled classes, resources, locations, and meeting links.</p>
          </div>
          {!embedded && (
            <button onClick={loadSessions} className="flex items-center gap-2 px-4 py-3 rounded-xl border border-portal-border text-portal-text-muted hover:text-portal-text hover:bg-portal-card transition-colors">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          )}
        </header>

        {loading ? (
          <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-portal-accent" /></div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-red-400">{error}</div>
        ) : sessions.length === 0 ? (
          <div className="bg-portal-card border border-portal-border rounded-3xl p-16 text-center">
            <BookOpen className="w-14 h-14 mx-auto text-portal-text-muted opacity-30 mb-4" />
            <h2 className="text-xl font-bold text-portal-text">No sessions yet</h2>
            <p className="text-portal-text-muted mt-2">When your instructor publishes session details, they will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {sessions.map((item) => (
              <Link
                key={item._id}
                to={bootcampId ? `/enrollments/${bootcampId}/sessions/${item._id}` : `/sessions/${item._id}`}
                className="bg-portal-card border border-portal-border rounded-2xl p-6 hover:border-portal-accent transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-portal-accent/10 text-portal-accent w-fit"><BookOpen className="w-5 h-5" /></div>
                  {item.status === 'completed' && (
                    <span className="px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-500/10 text-green-400 border border-green-500/20">
                      Session ended
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-black text-portal-text mb-2 line-clamp-1">{item.title}</h3>
                <p className="text-sm text-portal-text-muted line-clamp-2 mb-4">{item.description || 'Session details are not published yet.'}</p>
                <div className="space-y-2 text-xs text-portal-text-muted">
                  <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {fmtDateTime(item.startTime)}</span>
                  <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {item.location || 'Location not set'}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (loading) return <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-portal-accent" /></div>;
  if (error) return <div className="max-w-4xl mx-auto bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-red-400">{error}</div>;
  if (!session) return null;

  const isCompleted = session.status === 'completed';
  const endTimeMs = session.endTime ? new Date(session.endTime).getTime() : 0;
  const within48Hours = Date.now() - endTimeMs <= 48 * 60 * 60 * 1000;
  const canGiveFeedback = isCompleted && within48Hours && !feedbackSubmitted;

  return (
    <div className={`${embedded ? '' : 'max-w-5xl mx-auto'} space-y-6 relative`}>
      {toast && (
        <div className={`fixed top-6 right-6 z-[200] rounded-xl border px-5 py-3 text-sm font-bold shadow-xl ${toast.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
          {toast.message}
        </div>
      )}
      <header className="flex items-start gap-4">
        <button onClick={() => navigate(bootcampId ? `/enrollments/${bootcampId}` : '/sessions')} className="p-3 rounded-xl bg-portal-card border border-portal-border text-portal-text-muted hover:text-portal-text">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-portal-text">{session.title}</h1>
          <p className="text-sm text-portal-text-muted mt-1">{session.bootcamp?.name} • {fmtDateTime(session.startTime)}</p>
        </div>
      </header>

      <section className="bg-portal-card border border-portal-border rounded-2xl p-6 space-y-6">
        <div className="space-y-5">
          <p className="text-sm leading-6 text-portal-text-muted">{session.description || 'The instructor has not published a description yet.'}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-portal-input border border-portal-border p-4">
              <p className="text-xs font-black uppercase tracking-widest text-portal-text-muted mb-2">Location</p>
              <div className="flex items-center gap-2 text-portal-text font-bold">
                {session.location === 'Google Meet' ? <Monitor className="w-4 h-4 text-portal-accent" /> : <MapPin className="w-4 h-4 text-portal-accent" />}
                {session.location || 'Location not set'}
              </div>
            </div>
            {session.meetingLink && (
              <a href={session.meetingLink} target="_blank" rel="noreferrer" className="rounded-xl bg-portal-input border border-portal-border p-4 hover:border-portal-accent transition-colors">
                <p className="text-xs font-black uppercase tracking-widest text-portal-text-muted mb-2">Meeting Link</p>
                <span className="flex items-center gap-2 text-portal-accent font-bold"><ExternalLink className="w-4 h-4" /> Join Google Meet</span>
              </a>
            )}
          </div>
        </div>

        <div className="space-y-3 pt-6 border-t border-portal-border/50">
          <h2 className="text-xs font-black uppercase tracking-widest text-portal-text-muted mb-3">Session Resources</h2>
          {resources.length === 0 ? (
            <div className="bg-portal-input border border-portal-border rounded-xl p-8 text-center text-sm text-portal-text-muted">
              No resources uploaded for this session yet.
            </div>
          ) : resources.map((resource) => {
            const Icon = getResourceIcon(resource.file_type || (resource.resource_type === 'link' ? 'link' : 'file'));
            return (
              <button key={resource._id} type="button" onClick={() => resourceService.openResource(resource)} className="w-full text-left bg-portal-input border border-portal-border rounded-2xl p-5 flex items-center justify-between gap-4 group hover:border-portal-accent transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-portal-accent/10 text-portal-accent group-hover:bg-portal-accent group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-portal-text group-hover:text-portal-accent transition-colors text-sm mb-0.5">{resource.title}</h3>
                    <p className="text-xs text-portal-text-muted">{resource.description || (resource.resource_type === 'link' ? 'External resource link' : 'Resource document')}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-portal-card border border-portal-border text-portal-text-muted">
                        {resource.resource_type === 'link' ? 'Link' : resource.file_type?.toUpperCase() || 'File'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-portal-accent/5 text-portal-accent group-hover:bg-portal-accent/20 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {isCompleted && (
        <section className="bg-portal-card border border-portal-border rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-black text-portal-text">Session Feedback</h2>
          {feedbackSubmitted ? (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5 text-sm text-green-400">
              Thank you for your feedback! Your response has been recorded anonymously.
            </div>
          ) : canGiveFeedback ? (
            <form onSubmit={submitFeedback} className="space-y-4">
              <p className="text-sm text-portal-text-muted">
                How would you rate this session? Your feedback is anonymous and helps instructors improve.
              </p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedbackForm((prev) => ({ ...prev, rating: star }))}
                    className="p-1 focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${feedbackForm.rating >= star ? 'fill-portal-accent text-portal-accent' : 'text-portal-border hover:text-portal-accent/50'}`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={feedbackForm.comment}
                onChange={(e) => setFeedbackForm((prev) => ({ ...prev, comment: e.target.value }))}
                placeholder="Optional comments..."
                rows={3}
                className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-sm text-portal-text outline-none focus:border-portal-accent resize-none"
              />
              <button
                type="submit"
                disabled={isSubmittingFeedback || !feedbackForm.rating}
                className="px-6 py-3 bg-portal-accent text-portal-bg rounded-xl font-bold text-sm hover:bg-portal-accent-hover disabled:opacity-50 transition-colors"
              >
                {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          ) : (
            <div className="bg-portal-input border border-portal-border rounded-xl p-5 text-sm text-portal-text-muted">
              The feedback window for this session has closed (48 hours).
            </div>
          )}
        </section>
      )}
    </div>
  );
};
