import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, ClipboardList, MessageSquare } from 'lucide-react';

export const InstructorPanel = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-10">
        <h2 className="text-3xl font-bold mb-2">Instructor Panel</h2>
        <p className="text-sage-500">Manage your sessions, students, and tasks from here.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Active Students", value: "124", icon: Users },
          { label: "Pending Submissions", value: "18", icon: ClipboardList },
          { label: "New Feedback", value: "4", icon: MessageSquare },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-sage-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-6">Upcoming Sessions</h3>
          <div className="space-y-4">
            {[1, 2].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-sage-50 border border-sage-100">
                <div>
                  <h4 className="font-bold text-sm">Advanced React Patterns</h4>
                  <p className="text-xs text-sage-500 mt-1">Today, 10:00 AM - 12:00 PM • Room 302</p>
                </div>
                <button className="text-xs font-bold text-sage-500 hover:text-sage-900 uppercase">Manage</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-sage-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-6">Recent Submissions</h3>
          <div className="space-y-4">
            {[1, 2].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white border border-sage-100">
                <div>
                  <h4 className="font-bold text-sm">Alex Rivera</h4>
                  <p className="text-xs text-sage-500 mt-1">Final Project Proposal • 15 mins ago</p>
                </div>
                <button className="bg-sage-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold">Grade</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
