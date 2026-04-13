import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Clock, CheckCircle2 } from 'lucide-react';

export const MemberDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-10">
        <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h2>
        <p className="text-sage-500">Here's what's happening in your bootcamp today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Upcoming Sessions", value: "3", icon: BookOpen },
          { label: "Pending Tasks", value: "5", icon: Clock },
          { label: "Completed Tasks", value: "12", icon: CheckCircle2 },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-sage-200 p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-sage-50 text-sage-500">
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-sage-500 text-sm font-medium mb-1">{stat.label}</h3>
            <div className="text-3xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-sage-200 rounded-2xl p-8">
        <h3 className="text-xl font-bold mb-6">Recent Announcements</h3>
        <div className="space-y-4">
          {[1, 2].map((_, i) => (
            <div key={i} className="p-4 rounded-xl bg-sage-50 border border-sage-100">
              <h4 className="font-bold text-sm">New Resource Uploaded: React Patterns</h4>
              <p className="text-xs text-sage-500 mt-1">Instructor Jane Smith uploaded a new PDF for the Development division.</p>
              <p className="text-[10px] text-sage-400 mt-2 font-bold uppercase tracking-widest">2 hours ago</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
