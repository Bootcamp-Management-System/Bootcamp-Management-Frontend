import React from 'react';
import { Users, ClipboardList, MessageSquare } from 'lucide-react';
import { useDashboardTheme } from '../../context/DashboardThemeContext';

export const InstructorPanel = () => {
  const { isDark } = useDashboardTheme();

  const shellClass = isDark ? 'bg-[#161b22] border-[#30363d] shadow-[0_18px_40px_rgba(0,0,0,0.45)]' : 'bg-white border-[#d0d7de] shadow-[0_18px_40px_rgba(31,35,40,0.16)]';
  const mutedClass = isDark ? 'text-[#8b949e]' : 'text-[#57606a]';
  const titleClass = isDark ? 'text-[#f0f6fc]' : 'text-[#1f2328]';

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-10">
        <h2 className={`text-3xl font-bold mb-2 ${titleClass}`}>Instructor Panel</h2>
        <p className={mutedClass}>Manage your sessions, students, and tasks from here.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Active Students", value: "124", icon: Users },
          { label: "Pending Submissions", value: "18", icon: ClipboardList },
          { label: "New Feedback", value: "4", icon: MessageSquare },
        ].map((stat, i) => (
          <div key={i} className={`rounded-2xl border p-6 ${shellClass}`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0d1117] text-[#37b6c9]' : 'bg-[#f6f8fa] text-[#37b6c9]'}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <h3 className={`mb-1 text-sm font-medium ${mutedClass}`}>{stat.label}</h3>
            <div className={`text-3xl font-bold ${titleClass}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`rounded-2xl border p-6 ${shellClass}`}>
          <h3 className={`mb-6 text-xl font-bold ${titleClass}`}>Upcoming Sessions</h3>
          <div className="space-y-4">
            {[1, 2].map((_, i) => (
              <div key={i} className={`flex items-center justify-between rounded-xl border p-4 ${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-[#d0d7de] bg-[#f6f8fa]'}`}>
                <div>
                  <h4 className={`text-sm font-bold ${titleClass}`}>Advanced React Patterns</h4>
                  <p className={`mt-1 text-xs ${mutedClass}`}>Today, 10:00 AM - 12:00 PM • Room 302</p>
                </div>
                <button className={`text-xs font-bold uppercase ${mutedClass} hover:${isDark ? 'text-[#f0f6fc]' : 'text-[#1f2328]'}`}>Manage</button>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-2xl border p-6 ${shellClass}`}>
          <h3 className={`mb-6 text-xl font-bold ${titleClass}`}>Recent Submissions</h3>
          <div className="space-y-4">
            {[1, 2].map((_, i) => (
              <div key={i} className={`flex items-center justify-between rounded-xl border p-4 ${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-[#d0d7de] bg-[#f6f8fa]'}`}>
                <div>
                  <h4 className={`text-sm font-bold ${titleClass}`}>Alex Rivera</h4>
                  <p className={`mt-1 text-xs ${mutedClass}`}>Final Project Proposal • 15 mins ago</p>
                </div>
                <button className="rounded-lg bg-[#37b6c9] px-3 py-1.5 text-xs font-bold text-white">Grade</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
