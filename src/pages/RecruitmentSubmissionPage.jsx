import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  CheckCircle2, 
  Loader2, 
  Code2,
  AlertCircle,
  FileCode
} from 'lucide-react';
import { recruitmentService } from '../services/recruitmentService';
import { useAuth } from '../context/AuthContext';

export const RecruitmentSubmissionPage = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [application, setApplication] = useState(null);
  const [template, setTemplate] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [applicationId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await recruitmentService.getApplication(applicationId);
      const app = res.data;
      if (!app) throw new Error('Application not found');
      
      const templateData = await recruitmentService.getTemplate(app.bootcamp._id || app.bootcamp);
      setApplication(app);
      setTemplate(templateData.data);
    } catch (err) {
      setError(err.message || 'Could not load task details.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setAnswers(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (application.status === 'SCREENED_ROUND_1') {
        await recruitmentService.submitTechnicalTask(applicationId, answers);
      } else if (application.status === 'WAITLISTED') {
        await recruitmentService.submitWaitlistTask(applicationId, answers);
      }
      setSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-portal-bg flex items-center justify-center text-portal-accent"><Loader2 className="w-12 h-12 animate-spin" /></div>;
  
  if (error) return (
    <div className="min-h-screen bg-portal-bg flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-portal-card border border-portal-border rounded-3xl p-8 text-center shadow-2xl">
        <AlertCircle className="w-16 h-16 text-portal-accent mx-auto mb-6" />
        <h3 className="text-xl font-bold text-portal-text">Error</h3>
        <p className="text-portal-text-muted mt-2 mb-8">{error}</p>
        <Link to="/dashboard" className="block w-full py-4 bg-portal-accent text-portal-bg rounded-2xl font-bold">Back to Dashboard</Link>
      </div>
    </div>
  );

  if (submitted) return (
    <div className="min-h-screen bg-portal-bg flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-portal-card border border-portal-border rounded-3xl p-10 text-center shadow-2xl">
        <div className="w-20 h-20 bg-green-400/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-12 h-12 text-green-400" />
        </div>
        <h3 className="text-2xl font-bold text-portal-text mb-2">Task Submitted!</h3>
        <p className="text-portal-text-muted mb-10 leading-relaxed">
          Your submission for <span className="text-portal-accent font-bold">{application.bootcampApplied}</span> has been received. 
          The selection committee will evaluate your work soon.
        </p>
        <Link to="/dashboard" className="block w-full py-4 bg-portal-accent text-portal-bg rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-portal-accent/20">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );

  const fields = application.status === 'SCREENED_ROUND_1' ? template.phase2Fields : template.waitlistFields;
  const phaseTitle = application.status === 'SCREENED_ROUND_1' ? 'Phase 2: Technical Screening' : 'Waitlist Evaluation';

  return (
    <div className="min-h-screen bg-portal-bg pb-20 pt-10">
      <div className="max-w-3xl mx-auto px-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-portal-text-muted hover:text-portal-accent transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="bg-portal-card border border-portal-border rounded-[32px] overflow-hidden shadow-2xl">
          <div className="p-10 border-b border-portal-border bg-white/[0.02]">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-portal-accent/10 rounded-2xl text-portal-accent">
                <FileCode className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-portal-text">{application.bootcampApplied}</h1>
                <p className="text-portal-text-muted mt-1 uppercase tracking-widest text-[10px] font-bold">{phaseTitle}</p>
              </div>
            </div>
            <p className="text-portal-text-muted leading-relaxed">
              Complete the following requirements to proceed with your application. 
              Ensure all links are public and accessible.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            {fields && fields.map((field, i) => (
              <div key={i} className="space-y-3">
                <label className="block text-sm font-bold text-portal-text flex items-center gap-2">
                  {field.label}
                  {field.required && <span className="text-red-400 text-lg">*</span>}
                </label>

                {field.type === 'textarea' ? (
                  <textarea
                    required={field.required}
                    value={answers[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full bg-portal-input border border-portal-border rounded-2xl p-4 text-portal-text text-sm min-h-[120px] outline-none focus:border-portal-accent transition-all"
                  />
                ) : (
                  <input
                    type={field.type === 'url' ? 'url' : 'text'}
                    required={field.required}
                    placeholder={field.type === 'url' ? 'https://github.com/your-repo' : ''}
                    value={answers[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full bg-portal-input border border-portal-border rounded-2xl p-4 text-portal-text text-sm outline-none focus:border-portal-accent transition-all"
                  />
                )}
              </div>
            ))}

            <button 
              type="submit"
              disabled={submitting}
              className="w-full py-5 bg-portal-accent text-portal-bg rounded-2xl font-bold text-xl shadow-xl shadow-portal-accent/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
              {submitting ? 'Submitting...' : 'Submit Technical Work'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
