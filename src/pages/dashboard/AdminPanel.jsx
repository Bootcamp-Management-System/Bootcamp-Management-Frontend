import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Users, BookOpen, BarChart3 } from 'lucide-react';

export const AdminPanel = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-10">
        <h2 className="text-3xl font-bold mb-2">Admin Control Center</h2>
        <p className="text-sage-500">Full system oversight and management.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Total Users", value: "842", icon: Users },
          { label: "Active Divisions", value: "4", icon: BookOpen },
          { label: "System Uptime", value: "99.9%", icon: Shield },
          { label: "Reports Generated", value: "12", icon: BarChart3 },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-sage-200 p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-sage-50 text-sage-500">
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-sage-500 text-xs font-medium mb-1 uppercase tracking-wider">{stat.label}</h3>
            <div className="text-2xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-sage-200 rounded-2xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold">Recent System Logs</h3>
          <button className="text-sm font-bold text-sage-500 hover:text-sage-900">View All Audit Logs</button>
        </div>
        <div className="space-y-4">
          {[
            { action: "User Suspended", user: "John Doe", admin: "Admin Sarah", time: "10 mins ago" },
            { action: "New Division Created", user: "Cybersecurity", admin: "Admin Mike", time: "1 hour ago" },
            { action: "Settings Updated", user: "Global Auth", admin: "Admin Sarah", time: "3 hours ago" },
          ].map((log, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-sage-50 border border-sage-100">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-sage-500" />
                <div>
                  <p className="text-sm font-bold">{log.action}</p>
                  <p className="text-xs text-sage-500 mt-0.5">Target: {log.user} • By: {log.admin}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-sage-400 uppercase tracking-widest">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
