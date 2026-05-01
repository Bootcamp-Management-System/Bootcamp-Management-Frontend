import React, { useState } from 'react';
import { Search, Filter, CheckCircle2, XCircle, Clock, AlertCircle, Layers, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const mockApps = [
  { id: 'APP-001', name: 'John Doe', department: 'Computer Science', year: '2024', division: 'Development', status: 'Pending', date: '2026-04-16' },
  { id: 'APP-002', name: 'Jane Smith', department: 'IT', year: '2024', division: 'Data Science', status: 'Round 1', date: '2026-04-15' },
  { id: 'APP-003', name: 'Michael Brown', department: 'Software Eng', year: '2025', division: 'Cybersecurity', status: 'Waiting List', date: '2026-04-14' },
  { id: 'APP-004', name: 'Emily White', department: 'Mathematics', year: '2026', division: 'Data Science', status: 'Accepted', date: '2026-04-13' },
  { id: 'APP-005', name: 'Chris Green', department: 'Physics', year: '2024', division: 'CPD', status: 'Rejected', date: '2026-04-12' },
  { id: 'APP-006', name: 'Sarah Lee', department: 'Computer Science', year: '2025', division: 'Development', status: 'Round 1', date: '2026-04-11' },
  { id: 'APP-007', name: 'Tom Wilson', department: 'Cybersecurity', year: '2024', division: 'Cybersecurity', status: 'Pending', date: '2026-04-10' },
  { id: 'APP-008', name: 'Lisa Brown', department: 'Data Analytics', year: '2026', division: 'Data Science', status: 'Waiting List', date: '2026-04-09' },
  { id: 'APP-009', name: 'Mark Johnson', department: 'Professional Dev', year: '2025', division: 'CPD', status: 'Accepted', date: '2026-04-08' },
  { id: 'APP-010', name: 'Anna Davis', department: 'Software Eng', year: '2024', division: 'Development', status: 'Accepted', date: '2026-04-07' },
];

const divisionStats = [
  { name: 'Data Science', total: 45, pending: 12, accepted: 20, rejected: 8, waiting: 5 },
  { name: 'Development', total: 38, pending: 10, accepted: 18, rejected: 6, waiting: 4 },
  { name: 'Cybersecurity', total: 32, pending: 8, accepted: 15, rejected: 5, waiting: 4 },
  { name: 'CPD', total: 28, pending: 7, accepted: 14, rejected: 4, waiting: 3 },
];

export function Applications() {
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApps = mockApps.filter(app => {
    const divisionMatch = !selectedDivision || app.division === selectedDivision;
    const statusMatch = selectedStatus === 'All' || app.status === selectedStatus;
    const searchMatch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       app.department.toLowerCase().includes(searchQuery.toLowerCase());
    return divisionMatch && statusMatch && searchMatch;
  });

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Accepted': return <CheckCircle2 className="w-4 h-4 text-[#1a7f37] dark:text-[#3fb950]" />;
      case 'Rejected': return <XCircle className="w-4 h-4 text-[#cf222e] dark:text-[#f85149]" />;
      case 'Waiting List': return <AlertCircle className="w-4 h-4 text-[#bf8700] dark:text-[#d29922]" />;
      case 'Round 1': return <Clock className="w-4 h-4 text-[#0969da] dark:text-[#2f81f7]" />;
      default: return <Clock className="w-4 h-4 text-[#57606a] dark:text-[#8b949e]" />;
    }
  };

  const getStatusBg = (status: string) => {
    switch(status) {
      case 'Accepted': return 'bg-[#dafbe1] text-[#1a7f37] dark:bg-[#238636]/20 dark:text-[#3fb950] border-[#1a7f37]/20 dark:border-[#2ea043]/30';
      case 'Rejected': return 'bg-[#ffebe9] text-[#cf222e] dark:bg-[#f85149]/20 dark:text-[#ff7b72] border-[#cf222e]/20 dark:border-[#f85149]/30';
      case 'Waiting List': return 'bg-[#fff8c5] text-[#9a6700] dark:bg-[#d29922]/20 dark:text-[#e3b341] border-[#d4a72c]/20 dark:border-[#d29922]/30';
      case 'Round 1': return 'bg-[#ddf4ff] text-[#0969da] dark:bg-[#2f81f7]/20 dark:text-[#58a6ff] border-[#0969da]/20 dark:border-[#2f81f7]/30';
      default: return 'bg-[#f6f8fa] text-[#57606a] dark:bg-[#21262d] dark:text-[#8b949e] border-[#d0d7de] dark:border-[#30363d]';
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-portal-text tracking-tight">Applications Management</h1>
          <p className="text-portal-text-muted mt-1 uppercase tracking-widest text-[10px] font-black">Candidate Review & Division Orchestration</p>
        </div>
        {selectedDivision && (
          <button 
            onClick={() => setSelectedDivision(null)}
            className="flex items-center gap-2 px-4 py-2 bg-portal-card border border-portal-border rounded-xl text-[10px] font-black text-portal-accent uppercase tracking-widest hover:bg-portal-accent/10 transition-all"
          >
            ← Global Overview
          </button>
        )}
      </div>

      {!selectedDivision ? (
        // Division Overview Cards
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {divisionStats.map((division) => (
            <div
              key={division.name}
              onClick={() => setSelectedDivision(division.name)}
              className="bg-portal-card border border-portal-border rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-portal-accent/10 text-portal-accent border border-portal-accent/20 group-hover:scale-110 transition-transform">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-portal-text tracking-tight uppercase">{division.name}</h3>
                </div>
                <ChevronRight className="w-6 h-6 text-portal-text-muted group-hover:text-portal-accent group-hover:translate-x-1 transition-all" />
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-8 relative z-10">
                <div className="bg-portal-bg border border-portal-border rounded-2xl p-4">
                  <p className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest mb-2">Aggregate Demand</p>
                  <p className="text-3xl font-black text-portal-text">{division.total}</p>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4">
                  <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2">Pending Review</p>
                  <p className="text-3xl font-black text-orange-500">{division.pending}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 relative z-10">
                <div className="text-center p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                  <p className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter mb-1">Accepted</p>
                  <p className="text-xl font-black text-emerald-500">{division.accepted}</p>
                </div>
                <div className="text-center p-3 bg-red-500/10 border border-red-500/20 rounded-2xl">
                  <p className="text-[9px] font-black text-red-500 uppercase tracking-tighter mb-1">Rejected</p>
                  <p className="text-xl font-black text-red-500">{division.rejected}</p>
                </div>
                <div className="text-center p-3 bg-portal-accent/10 border border-portal-accent/20 rounded-2xl">
                  <p className="text-[9px] font-black text-portal-accent uppercase tracking-tighter mb-1">Waiting</p>
                  <p className="text-xl font-black text-portal-accent">{division.waiting}</p>
                </div>
              </div>

              <Layers className="absolute -right-8 -bottom-8 w-40 h-40 text-portal-text/5 -rotate-12 group-hover:scale-110 transition-transform" />
            </div>
          ))}
        </div>
      ) : (
        // Applications Table for Selected Division
        <div className="bg-portal-card border border-portal-border rounded-3xl overflow-hidden shadow-sm flex flex-col min-h-[600px]">
          <div className="p-6 border-b border-portal-border bg-portal-card/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-portal-accent/10 text-portal-accent border border-portal-accent/20">
                <Layers className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-black text-portal-text tracking-tight">{selectedDivision} Pipeline</h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-between items-center">
              <div className="relative w-full sm:w-96 group">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-portal-text-muted group-focus-within:text-portal-accent transition-colors" />
                <input 
                  type="text" 
                  placeholder="Filter by applicant name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-sm bg-portal-input border border-portal-border rounded-2xl focus:outline-none focus:border-portal-accent text-portal-text transition-all"
                />
              </div>
              <div className="flex items-center gap-3 bg-portal-input border border-portal-border px-4 py-2 rounded-2xl">
                <Filter className="w-4 h-4 text-portal-text-muted" />
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-transparent text-[10px] font-black text-portal-text-muted uppercase tracking-widest focus:outline-none cursor-pointer appearance-none"
                >
                  <option value="All">All Pipelines</option>
                  <option value="Pending">Pending Review</option>
                  <option value="Round 1">Interview Phase</option>
                  <option value="Waiting List">Reserve List</option>
                  <option value="Accepted">Approved</option>
                  <option value="Rejected">Terminated</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto flex-1 custom-scrollbar">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-portal-border/50">
                  <th className="px-8 py-4 text-[10px] font-black text-portal-text-muted uppercase tracking-[0.2em]">Applicant Details</th>
                  <th className="px-8 py-4 text-[10px] font-black text-portal-text-muted uppercase tracking-[0.2em]">Departmental Sync</th>
                  <th className="px-8 py-4 text-[10px] font-black text-portal-text-muted uppercase tracking-[0.2em]">Applied Epoch</th>
                  <th className="px-8 py-4 text-[10px] font-black text-portal-text-muted uppercase tracking-[0.2em]">Current State</th>
                  <th className="px-8 py-4 text-[10px] font-black text-portal-text-muted uppercase tracking-[0.2em] text-right">Orchestration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-portal-border/50">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-portal-bg transition-colors cursor-pointer group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-portal-accent/10 border border-portal-accent/20 flex items-center justify-center font-black text-portal-accent">
                          {app.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-portal-text group-hover:text-portal-accent transition-colors">{app.name}</span>
                          <span className="text-[10px] font-black text-portal-text-muted uppercase tracking-tighter">{app.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-portal-text leading-tight">{app.department}</span>
                        <span className="text-[10px] font-black text-portal-text-muted uppercase mt-1">Batch {app.year}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="text-xs font-bold text-portal-text-muted">{new Date(app.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                        getStatusBg(app.status)
                      )}>
                        {getStatusIcon(app.status)}
                        {app.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <button className="px-4 py-1.5 bg-portal-accent text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-portal-accent/20 hover:scale-105 transition-all">
                          Review
                        </button>
                        <button className="p-2 text-portal-text-muted hover:text-portal-text hover:bg-portal-bg rounded-lg transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredApps.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-4 text-portal-text-muted">
                        <Search className="w-16 h-16 opacity-10" />
                        <div>
                          <p className="text-lg font-black uppercase tracking-widest">No Applications Tracked</p>
                          <p className="text-sm font-medium mt-1">Adjust your filters to scan broader ranges of the pipeline.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}