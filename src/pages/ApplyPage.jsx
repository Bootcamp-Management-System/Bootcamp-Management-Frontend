import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  CheckCircle2, 
  Loader2, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { recruitmentService } from '../services/recruitmentService';
import { bootcampService } from '../services/bootcampService';
import { useAuth } from '../context/AuthContext';

export const ApplyPage = () => {
  const { bootcampId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [bootcamp, setBootcamp] = useState(null);
  const [template, setTemplate] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [bootcampId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bcData, templateData] = await Promise.all([
        bootcampService.getBootcamp(bootcampId),
        recruitmentService.getTemplate(bootcampId)
      ]);
      setBootcamp(bcData.data);
      setTemplate(templateData.data);
    } catch (err) {
      setError('Could not load application. Please ensure you are logged in.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setAnswers(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/apply/${bootcampId}` } });
      return;
    }

    try {
      setSubmitting(true);
      await recruitmentService.applyToBootcamp(bootcampId, answers);
      setSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-portal-bg flex items-center justify-center text-portal-accent"><Loader2 className="w-12 h-12 animate-spin" /></div>;
  
  if (error || !template) return (
    <div className="min-h-screen bg-portal-bg flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-portal-card border border-portal-border rounded-3xl p-8 text-center shadow-2xl">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
        <h3 className="text-xl font-bold text-portal-text">Login Required</h3>
        <p className="text-portal-text-muted mt-2 mb-8">You must be logged in to apply for this bootcamp.</p>
        <Link to="/login" className="block w-full py-4 bg-portal-accent text-portal-bg rounded-2xl font-bold">Go to Login</Link>
      </div>
    </div>
  );

  if (submitted) return (
    <div className="min-h-screen bg-portal-bg flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-portal-card border border-portal-border rounded-3xl p-10 text-center shadow-2xl">
        <div className="w-20 h-20 bg-green-400/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-12 h-12 text-green-400" />
        </div>
        <h3 className="text-2xl font-bold text-portal-text mb-2">Application Received!</h3>
        <p className="text-portal-text-muted mb-10 leading-relaxed">
          Your Phase 1 application for <span className="text-portal-accent font-bold">{bootcamp.name}</span> has been submitted. 
          We will review it and notify you via email for the next stage.
        </p>
        <Link to="/dashboard" className="block w-full py-4 bg-portal-accent text-portal-bg rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-portal-accent/20">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-portal-bg pb-20 pt-10">
      <div className="max-w-3xl mx-auto px-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-portal-text-muted hover:text-portal-accent transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" /> Back to Explorations
        </button>

        <div className="bg-portal-card border border-portal-border rounded-[32px] overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="p-10 border-b border-portal-border bg-white/[0.02]">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-portal-accent/10 rounded-2xl text-portal-accent">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-portal-text">{bootcamp.name} Application</h1>
                <p className="text-portal-text-muted mt-1 uppercase tracking-widest text-[10px] font-bold">Phase 1: Initial Screening</p>
              </div>
            </div>
            <p className="text-portal-text-muted leading-relaxed">
              Please answer the following questions honestly. Your responses will help us understand your background 
              and motivation for joining this program.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            {template.phase1Fields.map((field, i) => (
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
                ) : field.type === 'dropdown' ? (
                  <select
                    required={field.required}
                    value={answers[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full bg-portal-input border border-portal-border rounded-2xl p-4 text-portal-text text-sm outline-none focus:border-portal-accent transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select an option...</option>
                    {field.options?.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input
                    type={field.type === 'number' ? 'number' : 'text'}
                    required={field.required}
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
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
            <p className="text-center text-[10px] text-portal-text-muted uppercase tracking-widest font-bold">
              Secure Submission • AES-256 Encrypted
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
