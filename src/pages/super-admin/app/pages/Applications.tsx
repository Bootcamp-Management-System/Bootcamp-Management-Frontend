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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#24292f] dark:text-[#c9d1d9]">Applications Management</h1>
          <p className="text-[#57606a] dark:text-[#8b949e]">Review and manage student applications across all divisions.</p>
        </div>
        {selectedDivision && (
          <button 
            onClick={() => setSelectedDivision(null)}
            className="text-sm text-[#0969da] dark:text-[#58a6ff] hover:underline font-medium"
          >
            ← Back to All Divisions
          </button>
        )}
      </div>

      {!selectedDivision ? (
        // Division Overview Cards
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {divisionStats.map((division) => (
            <div
              key={division.name}
              onClick={() => setSelectedDivision(division.name)}
              className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-[#ddf4ff] dark:bg-[#2f81f7]/20 text-[#0969da] dark:text-[#58a6ff]">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#24292f] dark:text-[#c9d1d9]">{division.name}</h3>
                </div>
                <ChevronRight className="w-5 h-5 text-[#57606a] dark:text-[#8b949e] group-hover:text-[#0969da] dark:group-hover:text-[#58a6ff] transition-colors" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-[#f6f8fa] dark:bg-[#0d1117] rounded-lg p-3">
                  <p className="text-xs text-[#57606a] dark:text-[#8b949e] mb-1">Total Applications</p>
                  <p className="text-2xl font-bold text-[#24292f] dark:text-[#c9d1d9]">{division.total}</p>
                </div>
                <div className="bg-[#fff8c5] dark:bg-[#d29922]/20 rounded-lg p-3">
                  <p className="text-xs text-[#9a6700] dark:text-[#e3b341] mb-1">Pending</p>
                  <p className="text-2xl font-bold text-[#9a6700] dark:text-[#e3b341]">{division.pending}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 bg-[#dafbe1] dark:bg-[#238636]/20 rounded">
                  <p className="text-xs text-[#1a7f37] dark:text-[#3fb950] font-medium">Accepted</p>
                  <p className="text-lg font-bold text-[#1a7f37] dark:text-[#3fb950]">{division.accepted}</p>
                </div>
                <div className="text-center p-2 bg-[#ffebe9] dark:bg-[#f85149]/20 rounded">
                  <p className="text-xs text-[#cf222e] dark:text-[#ff7b72] font-medium">Rejected</p>
                  <p className="text-lg font-bold text-[#cf222e] dark:text-[#ff7b72]">{division.rejected}</p>
                </div>
                <div className="text-center p-2 bg-[#ddf4ff] dark:bg-[#2f81f7]/20 rounded">
                  <p className="text-xs text-[#0969da] dark:text-[#58a6ff] font-medium">Waiting</p>
                  <p className="text-lg font-bold text-[#0969da] dark:text-[#58a6ff]">{division.waiting}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Applications Table for Selected Division
        <div className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-[#ddf4ff] dark:bg-[#2f81f7]/20 text-[#0969da] dark:text-[#58a6ff]">
                <Layers className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold text-[#24292f] dark:text-[#c9d1d9]">{selectedDivision} Applications</h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#57606a] dark:text-[#8b949e]" />
                <input 
                  type="text" 
                  placeholder="Search applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-sm bg-white dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0969da] dark:focus:ring-[#2f81f7] text-[#24292f] dark:text-[#c9d1d9]"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-[#57606a] dark:text-[#8b949e]" />
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-white dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] rounded-md text-sm py-1.5 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-[#0969da] dark:focus:ring-[#2f81f7] text-[#24292f] dark:text-[#c9d1d9] appearance-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Round 1">Round 1</option>
                  <option value="Waiting List">Waiting List</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#f6f8fa] dark:bg-[#161b22] text-[#57606a] dark:text-[#8b949e] border-b border-[#d0d7de] dark:border-[#30363d]">
                <tr>
                  <th className="px-6 py-3 font-medium">Applicant Details</th>
                  <th className="px-6 py-3 font-medium">Department</th>
                  <th className="px-6 py-3 font-medium">Applied Date</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d0d7de] dark:divide-[#30363d]">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#24292f] dark:text-[#c9d1d9]">{app.name}</span>
                        <span className="text-xs text-[#57606a] dark:text-[#8b949e]">{app.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#24292f] dark:text-[#c9d1d9]">
                      <div className="flex flex-col">
                        <span>{app.department}</span>
                        <span className="text-xs text-[#57606a] dark:text-[#8b949e]">Year: {app.year}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#57606a] dark:text-[#8b949e]">{app.date}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                        getStatusBg(app.status)
                      )}>
                        {getStatusIcon(app.status)}
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[#0969da] dark:text-[#2f81f7] hover:underline text-sm font-medium mr-4">
                        Review
                      </button>
                      <button className="text-[#57606a] dark:text-[#8b949e] hover:text-[#24292f] dark:hover:text-[#c9d1d9] text-sm font-medium">
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredApps.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-[#57606a] dark:text-[#8b949e]">
                      No applications found.
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