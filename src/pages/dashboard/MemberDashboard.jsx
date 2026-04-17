import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Clock, CheckCircle2 } from 'lucide-react';
import { useDashboardTheme } from '../../context/DashboardThemeContext';

export const MemberDashboard = () => {
  const { user } = useAuth();
  const { isDark } = useDashboardTheme();

  const shellClass = isDark ? 'bg-[#161b22] border-[#30363d] shadow-[0_18px_40px_rgba(0,0,0,0.45)]' : 'bg-white border-[#d0d7de] shadow-[0_18px_40px_rgba(31,35,40,0.16)]';
  const mutedClass = isDark ? 'text-[#8b949e]' : 'text-[#57606a]';
  const titleClass = isDark ? 'text-[#f0f6fc]' : 'text-[#1f2328]';

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-10">
        <h2 className={`text-3xl font-bold mb-2 ${titleClass}`}>Welcome back, {user?.name}!</h2>
        <p className={mutedClass}>Here's what's happening in your bootcamp today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Upcoming Sessions", value: "3", icon: BookOpen },
          { label: "Pending Tasks", value: "5", icon: Clock },
          { label: "Completed Tasks", value: "12", icon: CheckCircle2 },
        ].map((stat, i) => (
          <div key={i} className={`rounded-2xl border p-6 ${shellClass}`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${isDark ? 'bg-[#0d1117] text-[#37b6c9]' : 'bg-[#f6f8fa] text-[#37b6c9]'}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <h3 className={`text-sm font-medium mb-1 ${mutedClass}`}>{stat.label}</h3>
            <div className={`text-3xl font-bold ${titleClass}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className={`rounded-2xl border p-8 ${shellClass}`}>
        <h3 className={`text-xl font-bold mb-6 ${titleClass}`}>Recent Announcements</h3>
        <div className="space-y-4">
          {[1, 2].map((_, i) => (
            <div key={i} className={`rounded-xl border p-4 ${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-[#d0d7de] bg-[#f6f8fa]'}`}>
              <h4 className={`text-sm font-bold ${titleClass}`}>New Resource Uploaded: React Patterns</h4>
              <p className={`mt-1 text-xs ${mutedClass}`}>Instructor Jane Smith uploaded a new PDF for the Development division.</p>
              <p className={`mt-2 text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-[#8b949e]' : 'text-[#6e7681]'}`}>2 hours ago</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
