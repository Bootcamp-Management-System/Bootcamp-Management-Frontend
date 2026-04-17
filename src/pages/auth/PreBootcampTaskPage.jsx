import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { CalendarDays, CheckCircle2, ClipboardList, FileText } from 'lucide-react';

const getAuthTheme = () => localStorage.getItem('auth_theme') || localStorage.getItem('login_theme') || 'dark';

const persistAuthTheme = (theme) => {
  localStorage.setItem('auth_theme', theme);
  localStorage.setItem('login_theme', theme);
};

const tabStyles = (active, isDark) =>
  `rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition ${
    active
      ? 'bg-[#37b6c9] text-white'
      : isDark
        ? 'bg-[#08183f] text-[#a9b6d2] hover:text-[#edf3ff]'
        : 'bg-[#dfe2e8] text-[#2a3a5e] hover:text-[#13203d]'
  }`;

const panelClass = (isDark) =>
  isDark
    ? 'border-[#30363d] bg-[#161b22] shadow-[0_18px_40px_rgba(0,0,0,0.35)]'
    : 'border-[#d0d7de] bg-white shadow-[0_18px_40px_rgba(31,35,40,0.12)]';

const exampleTasks = [
  { id: 'T-001', title: 'Read Prebootcamp Guide', status: 'Open', due: 'Apr 20, 2026' },
  { id: 'T-002', title: 'Complete Git & GitHub Basics', status: 'In Progress', due: 'Apr 22, 2026' },
  { id: 'T-003', title: 'Submit Introductory Reflection', status: 'Open', due: 'Apr 24, 2026' },
];

const sessionExamples = [
  { code: 'S1', title: 'Orientation Session', time: 'Monday, 2:00 PM - 4:00 PM' },
  { code: 'S2', title: 'Technical Readiness Workshop', time: 'Wednesday, 10:00 AM - 12:00 PM' },
  { code: 'S3', title: 'Behavioral Interview Practice', time: 'Friday, 3:00 PM - 5:00 PM' },
];

const outcomeCards = [
  {
    badge: 'admin',
    title: 'reviews applications',
    description: 'Admin can review, grade, and send email updates.',
  },
  {
    badge: 'waiting list',
    title: 'another task will be provided',
    description: 'User receives an email for the next task.',
  },
  {
    badge: 'disqualified',
    title: 'receives application letter',
    description: 'If rejected, the user receives a formal notice.',
  },
  {
    badge: 'phase_3',
    title: 'receives email congratulations',
    description: 'Accepted users log in with OTP and bootcamp_id.',
  },
];

export const PreBootcampTaskPage = () => {
  const navigate = useNavigate();
  const preBootcampUserRaw = localStorage.getItem('prebootcamp_auth');
  const preBootcampUser = preBootcampUserRaw ? JSON.parse(preBootcampUserRaw) : null;

  const [theme, setTheme] = useState(getAuthTheme);
  const [activeTab, setActiveTab] = useState('round-one');
  const [applicationStatus, setApplicationStatus] = useState('not_submitted');
  const [applicationSummary, setApplicationSummary] = useState(null);
  const [showSubmittedPopup, setShowSubmittedPopup] = useState(false);
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({
    fullName: '',
    department: '',
    year: '',
    division: '',
    whyYou: '',
    internetAndPc: '',
    motivation: '',
    dedication: '',
    whyDivision: '',
    githubLink: '',
    linkedinLink: '',
    isBehavioralRoundFinished: false,
    isAllTasksFinished: false,
  });

  if (!preBootcampUser) {
    return <Navigate to="/prebootcamp-login" replace />;
  }

  const onThemeToggle = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      persistAuthTheme(next);
      return next;
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const canSubmitApplication = formData.isBehavioralRoundFinished && formData.isAllTasksFinished;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!canSubmitApplication) {
      return;
    }

    setApplicationSummary({
      ...formData,
      submittedAt: new Date().toLocaleString(),
      status: 'pending',
    });
    setApplicationStatus('pending');
    setShowSubmittedPopup(true);
  };

  const handleSubmittedPopupClose = () => {
    setShowSubmittedPopup(false);
    localStorage.removeItem('prebootcamp_auth');
    navigate('/login');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0d1117] text-[#e6edf3]' : 'bg-[#f6f8fa] text-[#1f2328]'}`}>
      <header className={`border-b ${isDark ? 'border-[#30363d] bg-[#161b22]' : 'border-[#d0d7de] bg-white'}`}>
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <h1 className={`text-lg font-black tracking-tight sm:text-xl ${isDark ? 'text-[#f0f6fc]' : 'text-[#1f2328]'}`}>
              Prebootcamp Task Page
            </h1>
            <p className={`text-xs ${isDark ? 'text-[#8b949e]' : 'text-[#57606a]'}`}>
              Campus ID: {preBootcampUser.campusId}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onThemeToggle}
              className={`rounded-full border bg-white px-3 py-1.5 text-xs font-semibold ${
                isDark ? 'border-[#30363d] text-[#1f2328] hover:border-[#8b949e]' : 'border-[#d0d7de] text-[#1f2328] hover:border-[#8c959f]'
              }`}
            >
              {isDark ? 'Light' : 'Dark'} Mode
            </button>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('prebootcamp_auth');
                window.location.href = '/prebootcamp-login';
              }}
              className="rounded-full border border-[#d0d7de] bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#1f2328] transition hover:border-[#8c959f]"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setActiveTab('round-one')} className={tabStyles(activeTab === 'round-one', isDark)}>
            Round One Form
          </button>
          <button type="button" onClick={() => setActiveTab('tasks')} className={tabStyles(activeTab === 'tasks', isDark)}>
            Tasks
          </button>
          <button type="button" onClick={() => setActiveTab('sessions')} className={tabStyles(activeTab === 'sessions', isDark)}>
            Sessions
          </button>
        </div>

        {activeTab === 'round-one' && (
          <section className={`rounded-3xl border p-5 sm:p-6 ${panelClass(isDark)}`}>
            <div className="mb-5 flex items-center gap-3">
              <FileText className="h-5 w-5 text-[#37b6c9]" />
              <div>
                <h2 className={`text-lg font-bold sm:text-xl ${isDark ? 'text-[#f0f6fc]' : 'text-[#1f2328]'}`}>
                  Round One Behavioral Application
                </h2>
                <p className={`text-xs ${isDark ? 'text-[#8b949e]' : 'text-[#57606a]'}`}>
                  Share your background, readiness, and links before submission.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold">Full Name</label>
                <input name="fullName" value={formData.fullName} onChange={handleChange} required className={`w-full rounded-xl border px-4 py-3 text-sm ${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-[#d0d7de] bg-[#f6f8fa]'}`} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold">Department</label>
                <input name="department" value={formData.department} onChange={handleChange} required className={`w-full rounded-xl border px-4 py-3 text-sm ${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-[#d0d7de] bg-[#f6f8fa]'}`} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold">Year</label>
                <input name="year" value={formData.year} onChange={handleChange} required placeholder="1st / 2nd / 3rd / 4th" className={`w-full rounded-xl border px-4 py-3 text-sm ${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-[#d0d7de] bg-[#f6f8fa]'}`} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold">Choose Division</label>
                <select name="division" value={formData.division} onChange={handleChange} required className={`w-full rounded-xl border px-4 py-3 text-sm ${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-[#d0d7de] bg-[#f6f8fa]'}`}>
                  <option value="">Select division</option>
                  <option value="CPD">CPD</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Development">Development</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold">Why you?</label>
                <textarea name="whyYou" value={formData.whyYou} onChange={handleChange} required rows={3} className={`w-full rounded-xl border px-4 py-3 text-sm ${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-[#d0d7de] bg-[#f6f8fa]'}`} />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold">Do you have sufficient Internet and PC?</label>
                <select name="internetAndPc" value={formData.internetAndPc} onChange={handleChange} required className={`w-full rounded-xl border px-4 py-3 text-sm ${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-[#d0d7de] bg-[#f6f8fa]'}`}>
                  <option value="">Select option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold">Motivation</label>
                <textarea name="motivation" value={formData.motivation} onChange={handleChange} required rows={3} className={`w-full rounded-xl border px-4 py-3 text-sm ${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-[#d0d7de] bg-[#f6f8fa]'}`} />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold">Dedication</label>
                <textarea name="dedication" value={formData.dedication} onChange={handleChange} required rows={3} className={`w-full rounded-xl border px-4 py-3 text-sm ${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-[#d0d7de] bg-[#f6f8fa]'}`} />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold">Why this division?</label>
                <textarea name="whyDivision" value={formData.whyDivision} onChange={handleChange} required rows={3} className={`w-full rounded-xl border px-4 py-3 text-sm ${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-[#d0d7de] bg-[#f6f8fa]'}`} />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold">GitHub Link</label>
                <input
                  name="githubLink"
                  type="url"
                  value={formData.githubLink}
                  onChange={handleChange}
                  required
                  placeholder="https://github.com/your-username"
                  className={`w-full rounded-xl border px-4 py-3 text-sm ${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-[#d0d7de] bg-[#f6f8fa]'}`}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold">LinkedIn Account</label>
                <input
                  name="linkedinLink"
                  type="url"
                  value={formData.linkedinLink}
                  onChange={handleChange}
                  required
                  placeholder="https://www.linkedin.com/in/your-profile"
                  className={`w-full rounded-xl border px-4 py-3 text-sm ${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-[#d0d7de] bg-[#f6f8fa]'}`}
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-[#d0d7de] bg-[#f6f8fa]'}`}>
                  <input type="checkbox" name="isBehavioralRoundFinished" checked={formData.isBehavioralRoundFinished} onChange={handleChange} className="mt-1 h-4 w-4" />
                  <span>I confirm I finished all behavioral round requirements.</span>
                </label>

                <label className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-[#d0d7de] bg-[#f6f8fa]'}`}>
                  <input type="checkbox" name="isAllTasksFinished" checked={formData.isAllTasksFinished} onChange={handleChange} className="mt-1 h-4 w-4" />
                  <span>I confirm I finished all assigned tasks and rounds.</span>
                </label>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={!canSubmitApplication}
                  className="rounded-xl bg-[#37b6c9] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#2ca8bb] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Submit Application
                </button>
                {!canSubmitApplication && (
                  <p className={`mt-2 text-xs ${isDark ? 'text-[#8b949e]' : 'text-[#57606a]'}`}>
                    Complete both confirmations to enable submission.
                  </p>
                )}
              </div>
            </form>

            {applicationSummary && (
              <div className={`mt-5 rounded-2xl border px-4 py-4 ${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-[#d0d7de] bg-[#f6f8fa]'}`}>
                <p className="flex items-center gap-2 text-sm font-bold text-[#37b6c9]">
                  <CheckCircle2 className="h-4 w-4" />
                  Application Created
                </p>
                <p className={`mt-1 text-sm ${isDark ? 'text-[#e6edf3]' : 'text-[#1f2328]'}`}>
                  Status: <span className="font-bold uppercase">{applicationStatus}</span>
                </p>
                <p className={`mt-1 text-xs ${isDark ? 'text-[#8b949e]' : 'text-[#57606a]'}`}>Submitted: {applicationSummary.submittedAt}</p>
              </div>
            )}
          </section>
        )}

        {activeTab === 'tasks' && (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {exampleTasks.map((task) => (
              <article key={task.id} className={`rounded-2xl border p-4 ${panelClass(isDark)}`}>
                <div className="mb-3 flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-[#37b6c9]" />
                  <p className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-[#8b949e]' : 'text-[#57606a]'}`}>{task.id}</p>
                </div>
                <h3 className={`text-sm font-bold ${isDark ? 'text-[#f0f6fc]' : 'text-[#1f2328]'}`}>{task.title}</h3>
                <p className={`mt-2 text-xs ${isDark ? 'text-[#8b949e]' : 'text-[#57606a]'}`}>Status: {task.status}</p>
                <p className={`text-xs ${isDark ? 'text-[#8b949e]' : 'text-[#57606a]'}`}>Due: {task.due}</p>
              </article>
            ))}
          </section>
        )}

        {activeTab === 'sessions' && (
          <section className="space-y-3">
            {sessionExamples.map((session) => (
              <article key={session.code} className={`rounded-2xl border p-4 ${panelClass(isDark)}`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-[#8b949e]' : 'text-[#57606a]'}`}>{session.code}</p>
                    <h3 className={`text-sm font-bold ${isDark ? 'text-[#f0f6fc]' : 'text-[#1f2328]'}`}>{session.title}</h3>
                  </div>
                  <CalendarDays className="h-5 w-5 text-[#37b6c9]" />
                </div>
                <p className={`mt-2 text-xs ${isDark ? 'text-[#8b949e]' : 'text-[#57606a]'}`}>{session.time}</p>
              </article>
            ))}
          </section>
        )}

        <section className="mt-6">
          <div className="mb-4 flex items-center gap-3">
            <FileText className="h-5 w-5 text-[#37b6c9]" />
            <div>
              <h2 className={`text-lg font-bold sm:text-xl ${isDark ? 'text-[#f0f6fc]' : 'text-[#1f2328]'}`}>Outcome Flow</h2>
              <p className={`text-xs ${isDark ? 'text-[#8b949e]' : 'text-[#57606a]'}`}>The lower cards from the flow, placed neatly into the page</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {outcomeCards.map((card) => (
              <article key={card.badge} className={`rounded-2xl border p-4 ${panelClass(isDark)}`}>
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#37b6c9]" />
                  <p className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-[#8b949e]' : 'text-[#57606a]'}`}>{card.badge}</p>
                </div>
                <h3 className={`text-sm font-bold ${isDark ? 'text-[#f0f6fc]' : 'text-[#1f2328]'}`}>{card.title}</h3>
                <p className={`mt-2 text-xs ${isDark ? 'text-[#8b949e]' : 'text-[#57606a]'}`}>{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-6">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className={`text-sm font-semibold ${isDark ? 'text-[#d9e7ff] hover:text-white' : 'text-[#223257] hover:text-[#121a33]'}`}
          >
            Return to main login
          </button>
        </div>
      </main>

      {showSubmittedPopup && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 px-4">
          <div className={`w-full max-w-md rounded-2xl border p-5 sm:p-6 ${isDark ? 'border-[#30363d] bg-[#161b22] text-[#e6edf3]' : 'border-[#d0d7de] bg-white text-[#1f2328]'}`}>
            <h3 className="text-lg font-bold">Application Submitted</h3>
            <p className="mt-2 text-sm">You will get the response through email.</p>
            <p className="mt-1 text-sm">If accepted, you will login with OTP and bootcamp_id.</p>
            <button
              type="button"
              onClick={handleSubmittedPopupClose}
              className="mt-5 rounded-xl bg-[#37b6c9] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#2ca8bb]"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
