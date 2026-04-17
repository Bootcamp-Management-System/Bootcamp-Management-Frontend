import React from 'react';
import { Shield, Users, BookOpen, BarChart3 } from 'lucide-react';
import { useDashboardTheme } from '../../context/DashboardThemeContext';

export const AdminPanel = () => {
  const { isDark } = useDashboardTheme();

  const shellClass = isDark ? 'bg-[#161b22] border-[#30363d] shadow-[0_18px_40px_rgba(0,0,0,0.45)]' : 'bg-white border-[#d0d7de] shadow-[0_18px_40px_rgba(31,35,40,0.16)]';
  const mutedClass = isDark ? 'text-[#8b949e]' : 'text-[#57606a]';
  const titleClass = isDark ? 'text-[#f0f6fc]' : 'text-[#1f2328]';

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-10">
        <h2 className={`text-3xl font-bold mb-2 ${titleClass}`}>Admin Control Center</h2>
        <p className={mutedClass}>Full system oversight and management.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Total Users", value: "842", icon: Users },
          { label: "Active Divisions", value: "4", icon: BookOpen },
          { label: "System Uptime", value: "99.9%", icon: Shield },
          { label: "Reports Generated", value: "12", icon: BarChart3 },
        ].map((stat, i) => (
          <div key={i} className={`rounded-2xl border p-6 ${shellClass}`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`rounded-lg p-2 ${isDark ? 'bg-[#0d1117] text-[#37b6c9]' : 'bg-[#f6f8fa] text-[#37b6c9]'}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <h3 className={`mb-1 text-xs font-medium uppercase tracking-wider ${mutedClass}`}>{stat.label}</h3>
            <div className={`text-2xl font-bold ${titleClass}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className={`rounded-2xl border p-8 ${shellClass}`}>
        <div className="flex justify-between items-center mb-8">
          <h3 className={`text-xl font-bold ${titleClass}`}>Recent System Logs</h3>
          <button className={`text-sm font-bold ${mutedClass} hover:${isDark ? 'text-[#f0f6fc]' : 'text-[#1f2328]'}`}>View All Audit Logs</button>
        </div>
        <div className="space-y-4">
          {[
            { action: "User Suspended", user: "John Doe", admin: "Admin Sarah", time: "10 mins ago" },
            { action: "New Division Created", user: "Cybersecurity", admin: "Admin Mike", time: "1 hour ago" },
            { action: "Settings Updated", user: "Global Auth", admin: "Admin Sarah", time: "3 hours ago" },
          ].map((log, i) => (
            <div key={i} className={`flex items-center justify-between rounded-xl border p-4 ${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-[#d0d7de] bg-[#f6f8fa]'}`}>
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-[#37b6c9]" />
                <div>
                  <p className={`text-sm font-bold ${titleClass}`}>{log.action}</p>
                  <p className={`mt-0.5 text-xs ${mutedClass}`}>Target: {log.user} • By: {log.admin}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-[#8b949e]' : 'text-[#6e7681]'}`}>{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
