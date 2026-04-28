import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, BarChart3, Settings, TrendingUp, CheckCircle2, ShieldAlert, Trash2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../../lib/utils';
import { divisionService } from '../../../../services/divisionService';

const attendanceData = [
  { week: 'W1', present: 95 },
  { week: 'W2', present: 92 },
  { week: 'W3', present: 88 },
  { week: 'W4', present: 94 },
  { week: 'W5', present: 90 },
  { week: 'W6', present: 85 },
];

export function DivisionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [division, setDivision] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchDivision = async () => {
      try {
        setLoading(true);
        const res = await divisionService.getDivisions(); // We will filter locally or add getDivisionById if needed
        const found = res.data?.find(d => d._id === id);
        setDivision(found);
      } catch (error) {
        console.error('Failed to fetch division:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDivision();
  }, [id]);

  const handleDeleteDivision = async () => {
    setIsDeleting(true);
    try {
      await divisionService.deleteDivision(id);
      navigate('/super-admin/divisions');
    } catch (error) {
      console.error('Failed to delete division:', error);
      alert('Failed to delete division. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) return <div className="p-20 text-center">Loading division intelligence...</div>;
  if (!division) return <div className="p-20 text-center">Division not found in archives.</div>;

  return (
    <div className="space-y-6">
      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#d0d7de] dark:border-[#30363d] pb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/super-admin/divisions')}
            className="p-2 rounded-lg bg-white dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] text-[#57606a] dark:text-[#8b949e] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#24292f] dark:text-[#c9d1d9]">{division.name}</h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#dafbe1] text-[#1a7f37] dark:bg-[#238636]/20 dark:text-[#3fb950] border border-[#1a7f37]/20 dark:border-[#2ea043]/30">
                {division.status}
              </span>
            </div>
            <p className="text-sm text-[#57606a] dark:text-[#8b949e] mt-1">Batch {division.year || '2026'} • Head Admin: {division.headAdmin?.name || 'Unassigned'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Division
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] text-[#24292f] dark:text-[#c9d1d9] rounded-md text-sm font-medium transition-colors">
            <Settings className="w-4 h-4" />
            Manage Division
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-[#d0d7de] dark:border-[#30363d] overflow-x-auto no-scrollbar">
        {['overview', 'students', 'instructors', 'sessions'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
              activeTab === tab 
                ? "border-[#0969da] dark:border-[#58a6ff] text-[#24292f] dark:text-[#c9d1d9]" 
                : "border-transparent text-[#57606a] dark:text-[#8b949e] hover:text-[#24292f] dark:hover:text-[#c9d1d9]"
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-[#57606a] dark:text-[#8b949e]">Total Enrolled</span>
                  <div className="p-1.5 rounded-md bg-[#ddf4ff] dark:bg-[#051d4d] text-[#0969da] dark:text-[#2f81f7]">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#24292f] dark:text-[#c9d1d9]">{division.students}</span>
                  <span className="text-xs text-[#57606a] dark:text-[#8b949e]">/ {division.capacity}</span>
                </div>
              </div>

              <div className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-[#57606a] dark:text-[#8b949e]">Total Sessions</span>
                  <div className="p-1.5 rounded-md bg-[#dafbe1] dark:bg-[#04260f] text-[#1a7f37] dark:text-[#3fb950]">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#24292f] dark:text-[#c9d1d9]">{division.sessions}</span>
                  <span className="text-xs text-[#1a7f37] dark:text-[#3fb950] font-medium">+4 this week</span>
                </div>
              </div>

              <div className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-[#57606a] dark:text-[#8b949e]">Avg Attendance</span>
                  <div className="p-1.5 rounded-md bg-[#fff8c5] dark:bg-[#3d2e00] text-[#9a6700] dark:text-[#d29922]">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#24292f] dark:text-[#c9d1d9]">91%</span>
                  <span className="text-xs text-[#cf222e] dark:text-[#f85149] font-medium">-2%</span>
                </div>
              </div>

              <div className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-[#57606a] dark:text-[#8b949e]">At-Risk Students</span>
                  <div className="p-1.5 rounded-md bg-[#ffebe9] dark:bg-[#490202] text-[#cf222e] dark:text-[#f85149]">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#24292f] dark:text-[#c9d1d9]">3</span>
                  <span className="text-xs text-[#57606a] dark:text-[#8b949e]">Require attention</span>
                </div>
              </div>
            </div>

            {/* Detail sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left col: Charts */}
              <div className="lg:col-span-2 bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-semibold text-[#24292f] dark:text-[#c9d1d9] flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#8250df] dark:text-[#d2a8ff]" />
                    Weekly Attendance Trend
                  </h3>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8250df" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8250df" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d0d7de" opacity={0.5} />
                      <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#57606a', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} domain={[60, 100]} tick={{ fill: '#57606a', fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', color: '#c9d1d9', borderRadius: '8px', fontSize: '12px' }}
                      />
                      <Area type="monotone" dataKey="present" name="Present %" stroke="#8250df" strokeWidth={3} fillOpacity={1} fill="url(#colorAtt)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right col: Head Admin Info & Recent Activity */}
              <div className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-6 shadow-sm">
                <h3 className="text-base font-semibold text-[#24292f] dark:text-[#c9d1d9] mb-4">Leadership</h3>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#0969da] to-[#8250df] flex items-center justify-center text-white text-lg font-bold shadow-sm">
                    {(division.headAdmin?.name || 'U').charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#24292f] dark:text-[#c9d1d9]">{division.headAdmin?.name || 'Unassigned'}</h4>
                    <p className="text-xs text-[#57606a] dark:text-[#8b949e]">Division Head Admin</p>
                  </div>
                </div>

                <h3 className="text-base font-semibold text-[#24292f] dark:text-[#c9d1d9] mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { title: 'New session created', time: '2 hours ago', icon: Calendar },
                    { title: 'Attendance submitted', time: '1 day ago', icon: CheckCircle2 },
                    { title: 'Student promoted to instructor', time: '2 days ago', icon: Users },
                  ].map((act, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="mt-0.5 text-[#57606a] dark:text-[#8b949e]">
                        <act.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm text-[#24292f] dark:text-[#c9d1d9]">{act.title}</p>
                        <p className="text-xs text-[#57606a] dark:text-[#8b949e]">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Placeholders for other tabs */}
        {activeTab !== 'overview' && (
          <div className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-12 shadow-sm text-center">
            <h3 className="text-lg font-medium text-[#24292f] dark:text-[#c9d1d9] mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module
            </h3>
            <p className="text-sm text-[#57606a] dark:text-[#8b949e]">
              Detailed view for {activeTab} will load here. Connected to backend arrays.
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative w-full max-w-md rounded-xl border border-red-500/30 bg-white dark:bg-[#161b22] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[#24292f] dark:text-[#c9d1d9]">Delete Division</h2>
                <p className="text-sm text-[#57606a] dark:text-[#8b949e] mt-1">
                  Are you sure you want to delete the "{division.name}" division? This action cannot be undone and will remove all associated data.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-sm font-bold text-[#57606a] dark:text-[#8b949e] hover:text-[#24292f] dark:hover:text-[#c9d1d9]"
              >
                ✕
              </button>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                disabled={isDeleting}
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-2 rounded-md border border-[#d0d7de] dark:border-[#30363d] text-sm font-semibold text-[#24292f] dark:text-[#c9d1d9] hover:bg-[#f6f8fa] dark:hover:bg-[#21262d]"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDeleteDivision}
                className="px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-semibold"
              >
                {isDeleting ? 'Deleting...' : 'Delete Division'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
