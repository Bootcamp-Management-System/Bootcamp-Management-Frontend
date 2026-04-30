import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Calendar, ExternalLink, FileText, Loader2, MapPin, Monitor, RefreshCw } from 'lucide-react';
import sessionService from '../../services/sessionService';
import resourceService from '../../services/resourceService';

const fmtDateTime = (value) =>
  value ? new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }) : 'Not set';

export const StudentSessionsPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [session, setSession] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSessions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await sessionService.getSessions();
      setSessions(response.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load sessions.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSession = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    setError('');
    try {
      const [sessionResponse, resourceResponse] = await Promise.all([
        sessionService.getSessionById(sessionId),
        resourceService.getResourcesBySession(sessionId),
      ]);
      setSession(sessionResponse.data);
      setResources(resourceResponse.data || []);
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

  if (!sessionId) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-portal-text">Sessions</h1>
            <p className="text-portal-text-muted mt-1">View scheduled classes, resources, locations, and meeting links.</p>
          </div>
          <button onClick={loadSessions} className="flex items-center gap-2 px-4 py-3 rounded-xl border border-portal-border text-portal-text-muted hover:text-portal-text hover:bg-portal-card transition-colors">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
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
              <Link key={item._id} to={`/sessions/${item._id}`} className="bg-portal-card border border-portal-border rounded-2xl p-6 hover:border-portal-accent transition-all">
                <div className="p-3 rounded-xl bg-portal-accent/10 text-portal-accent w-fit mb-4"><BookOpen className="w-5 h-5" /></div>
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

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <header className="flex items-start gap-4">
        <button onClick={() => navigate('/sessions')} className="p-3 rounded-xl bg-portal-card border border-portal-border text-portal-text-muted hover:text-portal-text">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-portal-text">{session.title}</h1>
          <p className="text-sm text-portal-text-muted mt-1">{session.bootcamp?.name} • {fmtDateTime(session.startTime)}</p>
        </div>
      </header>

      <section className="bg-portal-card border border-portal-border rounded-2xl p-6 space-y-5">
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
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-black text-portal-text">Resources</h2>
        {resources.length === 0 ? (
          <div className="bg-portal-card border border-portal-border rounded-2xl p-10 text-center text-sm text-portal-text-muted">
            No resources uploaded for this session yet.
          </div>
        ) : resources.map((resource) => (
          <button key={resource._id} type="button" onClick={() => resourceService.openResource(resource)} className="w-full text-left bg-portal-card border border-portal-border rounded-2xl p-5 flex items-center justify-between gap-4 hover:border-portal-accent transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-portal-accent/10 text-portal-accent"><FileText className="w-5 h-5" /></div>
              <div>
                <h3 className="font-bold text-portal-text">{resource.title}</h3>
                <p className="text-sm text-portal-text-muted">{resource.description || (resource.resource_type === 'link' ? 'External resource link' : 'Resource file')}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-portal-text-muted mt-2">
                  {resource.resource_type === 'link' ? 'External link' : resource.file_type || 'File'} - {resource.download_count || 0} opens
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-portal-accent" />
          </button>
        ))}
      </section>
    </div>
  );
};
