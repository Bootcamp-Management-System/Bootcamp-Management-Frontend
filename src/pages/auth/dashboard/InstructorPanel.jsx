import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Users, ClipboardList, MessageSquare, Plus } from 'lucide-react';

export const InstructorPanel = () => {
  const { user } = useAuth();

  const handleNewSession = () => {
    alert('Initializing New Session wizard...');
    // In a real app, this would open a modal or navigate to a creation form
  };

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-white">Instructor Panel</h2>
          <p className="text-portal-text-muted">Manage your sessions, students, and tasks from here.</p>
        </div>
        <button 
          onClick={handleNewSession}
          className="bg-portal-accent text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-portal-accent/20 hover:bg-portal-accent-hover transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Session
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Active Students", value: "124", icon: Users },
          { label: "Pending Submissions", value: "18", icon: ClipboardList },
          { label: "New Feedback", value: "4", icon: MessageSquare },
        ].map((stat, i) => (
          <div key={i} className="bg-portal-card border border-portal-border p-6 rounded-2xl shadow-xl hover:border-portal-accent/50 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-portal-accent/10 text-portal-accent group-hover:bg-portal-accent group-hover:text-white transition-colors">
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-portal-text-muted text-sm font-medium mb-1">{stat.label}</h3>
            <div className="text-3xl font-bold text-white tracking-tight">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-portal-card border border-portal-border rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
            <div className="w-1.5 h-6 bg-portal-accent rounded-full" />
            Upcoming Sessions
          </h3>
          <div className="space-y-4">
            {[1, 2].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-portal-input border border-portal-border hover:bg-portal-border transition-colors group">
                <div>
                  <h4 className="font-bold text-sm text-white">Advanced React Patterns</h4>
                  <p className="text-xs text-portal-text-muted mt-1">Today, 10:00 AM - 12:00 PM • Room 302</p>
                </div>
                <button className="text-xs font-bold text-portal-accent hover:text-white uppercase tracking-wider transition-colors">Manage</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-portal-card border border-portal-border rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
            <div className="w-1.5 h-6 bg-portal-accent rounded-full" />
            Recent Submissions
          </h3>
          <div className="space-y-4">
            {[1, 2].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-portal-input border border-portal-border hover:bg-portal-border transition-colors">
                <div>
                  <h4 className="font-bold text-sm text-white">Alex Rivera</h4>
                  <p className="text-xs text-portal-text-muted mt-1">Final Project Proposal • 15 mins ago</p>
                </div>
                <button className="bg-portal-accent text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg shadow-portal-accent/20 hover:bg-portal-accent-hover transition-all">Grade</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
