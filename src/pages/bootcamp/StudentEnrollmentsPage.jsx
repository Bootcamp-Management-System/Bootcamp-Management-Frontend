import React, { useState, useEffect } from 'react';
import { Rocket, ShieldCheck, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import enrollmentService from '../../services/enrollmentService';

export const StudentEnrollmentsPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [otp, setOtp] = useState('');
  const [activating, setActivating] = useState(false);
  const navigate = useNavigate();

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const data = await enrollmentService.getMyEnrollments();
      setEnrollments(data.data || []);
    } catch {
      console.error('Failed to fetch enrollments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const validEnrollments = enrollments.filter(e => e.bootcamp);
  const pendingEnrollments = validEnrollments.filter(e => !e.is_active);
  const activeEnrollments = validEnrollments.filter(e => e.is_active);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 animate-spin text-portal-accent" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <header className="relative py-12 px-8 bg-portal-card border border-portal-border rounded-[40px] overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-portal-accent/10 rounded-full blur-[80px] -mr-32 -mt-32" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-[10px] font-bold uppercase tracking-widest mb-6">
            <ShieldCheck className="w-4 h-4" />
            Your Access
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-portal-text tracking-tight mb-4 leading-none">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-portal-accent to-green-400">Enrollments</span>
          </h1>
          <p className="text-portal-text-muted text-lg max-w-2xl leading-relaxed">
            Manage your bootcamp access. Activate pending enrollments or jump straight into your active programs.
          </p>
        </div>
      </header>

      {/* Pending Enrollments */}
      {pendingEnrollments.length > 0 && (
        <div className="p-8 rounded-[32px] bg-blue-500/10 border border-blue-500/20 text-blue-400 shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center">
              <Rocket className="w-8 h-8 animate-pulse" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">Enrollments Pending Activation</h3>
              <p className="text-sm opacity-80">
                You have {pendingEnrollments.length} pending bootcamp{pendingEnrollments.length > 1 ? 's' : ''}. Check your email for the activation OTP.
              </p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingEnrollments.map(e => (
              <div key={e._id} className="bg-portal-input p-4 rounded-2xl border border-blue-500/20 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-portal-text mb-1">{e.bootcamp?.name}</h4>
                  <p className="text-xs text-portal-text-muted mb-4">{e.bootcamp?.division?.name}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedEnrollment(e);
                    setShowOtpModal(true);
                  }}
                  className="w-full py-2 bg-blue-500 text-white rounded-xl font-bold hover:scale-[1.02] transition-all"
                >
                  Activate Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Enrollments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeEnrollments.length > 0 ? (
          activeEnrollments.map((enrollment) => (
            <div key={enrollment._id} className="group relative bg-portal-card border border-portal-border rounded-[40px] p-8 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:border-portal-accent/30 overflow-hidden flex flex-col">
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-green-500/5 rounded-full blur-[50px] group-hover:bg-green-500/10 transition-all" />
              
              <div className="flex items-start justify-between mb-8">
                <div className="w-14 h-14 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center group-hover:bg-green-500 group-hover:scale-110 transition-all duration-500 shadow-inner">
                  <ShieldCheck className="w-7 h-7 text-green-400 group-hover:text-portal-bg transition-colors duration-500" />
                </div>
                <div className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border bg-green-500/10 text-green-400 border-green-500/20">
                  ACTIVE
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-portal-accent uppercase tracking-[0.2em]">
                    {enrollment.bootcamp?.division?.name || 'Division'}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-portal-text mb-4 group-hover:text-portal-accent transition-colors">
                  {enrollment.bootcamp?.name}
                </h3>
                <p className="text-portal-text-muted text-sm leading-relaxed mb-8 line-clamp-3 group-hover:text-portal-text transition-colors">
                  {enrollment.bootcamp?.description || 'You are successfully enrolled in this program.'}
                </p>
              </div>

              <div className="space-y-4 pt-6 border-t border-portal-border/50">
                <div className="flex items-center justify-between text-[10px] font-bold text-portal-text-muted uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Enrolled: {new Date(enrollment.enrolledAt || enrollment.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/enrollments/${enrollment.bootcamp?._id || enrollment.bootcamp}`)}
                  className="w-full py-4 bg-portal-accent/10 border border-portal-accent/20 text-portal-accent rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-portal-accent hover:text-portal-bg transition-all shadow-lg shadow-portal-accent/20"
                >
                  Open Bootcamp Dashboard
                  <Rocket className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-portal-card border border-portal-border border-dashed rounded-[40px]">
            <AlertCircle className="w-16 h-16 text-portal-text-muted mx-auto mb-6 opacity-20" />
            <h3 className="text-2xl font-bold text-portal-text">No active enrollments found.</h3>
            <p className="text-portal-text-muted mt-2">When your application is accepted and activated, your bootcamps will appear here.</p>
          </div>
        )}
      </div>

      {showOtpModal && selectedEnrollment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-portal-card border border-portal-border rounded-3xl p-8 shadow-2xl max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-portal-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-portal-accent" />
              </div>
              <h3 className="text-xl font-bold text-portal-text">Activate Enrollment</h3>
              <p className="text-sm text-portal-text-muted mt-2">
                Enter the OTP sent to your email to complete enrollment for {selectedEnrollment.bootcamp?.name}
              </p>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!otp.trim()) return;

              try {
                setActivating(true);
                await enrollmentService.activateEnrollment(otp);
                setShowOtpModal(false);
                setOtp('');
                setSelectedEnrollment(null);
                fetchEnrollments();
                window.location.reload();
              } catch {
                alert('Invalid OTP. Please check your email and try again.');
              } finally {
                setActivating(false);
              }
            }}>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text outline-none focus:border-portal-accent transition-colors text-center text-lg font-mono tracking-widest"
                maxLength={6}
                required
              />

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowOtpModal(false);
                    setOtp('');
                    setSelectedEnrollment(null);
                  }}
                  className="flex-1 py-3 bg-portal-input border border-portal-border text-portal-text rounded-xl font-bold hover:bg-portal-bg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={activating || otp.length !== 6}
                  className="flex-1 py-3 bg-portal-accent text-portal-bg rounded-xl font-bold hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {activating ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Activate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
