import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, CalendarDays, Edit, ShieldAlert, BookOpen, GraduationCap, CheckCircle2, Clock, Trash2, KeyRound } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockUsers } from './Users';
import { cn } from '../../lib/utils';

const studentProgress = [
  { week: 'W1', score: 85 },
  { week: 'W2', score: 88 },
  { week: 'W3', score: 92 },
  { week: 'W4', score: 90 },
  { week: 'W5', score: 95 },
  { week: 'W6', score: 98 },
];

export function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find user from mock data or default to first
  const user = mockUsers.find(u => u.id === Number(id)) || mockUsers[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#d0d7de] dark:border-[#30363d] pb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/super-admin/users')}
            className="p-2 rounded-lg bg-white dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] text-[#57606a] dark:text-[#8b949e] transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0969da] to-[#8250df] flex items-center justify-center text-white text-xl font-bold shadow-md ring-4 ring-white dark:ring-[#161b22]">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-[#24292f] dark:text-[#c9d1d9]">{user.name}</h1>
                <span className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-sm",
                  user.status === 'Active' ? "bg-[#dafbe1] text-[#1a7f37] dark:bg-[#238636]/20 dark:text-[#3fb950] border-[#1a7f37]/20 dark:border-[#2ea043]/30" : 
                  user.status === 'Suspended' ? "bg-[#ffebe9] text-[#cf222e] dark:bg-[#f85149]/20 dark:text-[#ff7b72] border-[#cf222e]/20 dark:border-[#f85149]/30" :
                  "bg-[#ddf4ff] text-[#0969da] dark:bg-[#2f81f7]/20 dark:text-[#58a6ff] border-[#0969da]/20 dark:border-[#2f81f7]/30"
                )}>
                  {user.status}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1 text-sm font-medium text-[#57606a] dark:text-[#8b949e]">
                  {user.role === 'Admin' && <ShieldAlert className="w-4 h-4 text-[#cf222e] dark:text-[#f85149]" />}
                  {user.role === 'Instructor' && <GraduationCap className="w-4 h-4 text-[#8250df] dark:text-[#d2a8ff]" />}
                  {user.role === 'Student' && <BookOpen className="w-4 h-4 text-[#0969da] dark:text-[#58a6ff]" />}
                  {user.role}
                </span>
                <span className="text-[#d0d7de] dark:text-[#30363d]">•</span>
                <span className="text-sm text-[#57606a] dark:text-[#8b949e]">Batch {user.year}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] text-[#24292f] dark:text-[#c9d1d9] rounded-md text-sm font-medium transition-colors shadow-sm">
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
          {user.role === 'Student' && user.status === 'Active' && (
            <button className="flex items-center gap-2 px-3 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-md text-sm font-medium transition-colors shadow-sm">
              Promote to Instructor
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Info & Actions */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-[#24292f] dark:text-[#c9d1d9] mb-4 uppercase tracking-wider">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#57606a] dark:text-[#8b949e] mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#24292f] dark:text-[#c9d1d9]">{user.email}</p>
                  <p className="text-xs text-[#57606a] dark:text-[#8b949e]">Primary Email</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#57606a] dark:text-[#8b949e] mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#24292f] dark:text-[#c9d1d9]">+1 (555) 123-4567</p>
                  <p className="text-xs text-[#57606a] dark:text-[#8b949e]">Mobile</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarDays className="w-5 h-5 text-[#57606a] dark:text-[#8b949e] mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#24292f] dark:text-[#c9d1d9]">Joined April 10, 2026</p>
                  <p className="text-xs text-[#57606a] dark:text-[#8b949e]">System Entry Date</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-[#24292f] dark:text-[#c9d1d9] mb-4 uppercase tracking-wider">Security & Account</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] transition-colors border border-transparent hover:border-[#d0d7de] dark:hover:border-[#30363d] group">
                <div className="flex items-center gap-3">
                  <KeyRound className="w-4 h-4 text-[#57606a] dark:text-[#8b949e]" />
                  <span className="text-sm font-medium text-[#24292f] dark:text-[#c9d1d9]">Reset Password</span>
                </div>
                <ArrowLeft className="w-4 h-4 text-[#57606a] dark:text-[#8b949e] opacity-0 group-hover:opacity-100 rotate-180 transition-all" />
              </button>
              
              {user.status === 'Active' ? (
                <button className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#ffebe9] dark:hover:bg-[#490202] transition-colors border border-transparent hover:border-[#cf222e]/30 dark:hover:border-[#f85149]/30 group">
                  <div className="flex items-center gap-3 text-[#cf222e] dark:text-[#ff7b72]">
                    <ShieldAlert className="w-4 h-4" />
                    <span className="text-sm font-medium">Suspend Account</span>
                  </div>
                </button>
              ) : (
                <button className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#dafbe1] dark:hover:bg-[#04260f] transition-colors border border-transparent hover:border-[#1a7f37]/30 dark:hover:border-[#3fb950]/30 group">
                  <div className="flex items-center gap-3 text-[#1a7f37] dark:text-[#3fb950]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Reactivate Account</span>
                  </div>
                </button>
              )}
              
              <div className="pt-4 mt-2 border-t border-[#d0d7de] dark:border-[#30363d]">
                <button className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg text-[#cf222e] dark:text-[#ff7b72] hover:bg-[#ffebe9] dark:hover:bg-[#490202] transition-colors text-sm font-semibold">
                  <Trash2 className="w-4 h-4" />
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Divisions & Progress */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-[#24292f] dark:text-[#c9d1d9]">Enrolled Bootcamps</h3>
              {user.role === 'Student' && (
                <button className="text-sm text-[#0969da] dark:text-[#58a6ff] hover:underline font-medium">Manage Enrollments</button>
              )}
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {user.divisions.map((div, i) => (
                <div key={div} className="p-4 rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] flex flex-col h-full relative overflow-hidden group hover:border-[#0969da] dark:hover:border-[#58a6ff] transition-colors">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#0969da] dark:bg-[#58a6ff]"></div>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-[#24292f] dark:text-[#c9d1d9] pl-2">{div}</h4>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#ddf4ff] text-[#0969da] dark:bg-[#051d4d] dark:text-[#58a6ff] border border-[#0969da]/20 dark:border-[#58a6ff]/30">
                      Primary
                    </span>
                  </div>
                  
                  {user.role === 'Student' ? (
                    <div className="mt-auto space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#57606a] dark:text-[#8b949e] font-medium">Overall Progress</span>
                          <span className="font-bold text-[#24292f] dark:text-[#c9d1d9]">92%</span>
                        </div>
                        <div className="w-full bg-[#d0d7de] dark:bg-[#30363d] rounded-full h-1.5 overflow-hidden">
                          <div className="bg-[#1a7f37] dark:bg-[#238636] h-1.5 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-[#57606a] dark:text-[#8b949e] pt-3 border-t border-[#d0d7de] dark:border-[#30363d]">
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#1a7f37]" /> 24/26 Sessions</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 2 Absences</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-auto pt-3 border-t border-[#d0d7de] dark:border-[#30363d] text-sm text-[#57606a] dark:text-[#8b949e]">
                      <p>Assigned as {user.role}</p>
                      <p className="mt-1 font-medium text-[#24292f] dark:text-[#c9d1d9]">14 Sessions Led</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {user.role === 'Student' && (
            <div className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold text-[#24292f] dark:text-[#c9d1d9]">Weekly Performance Trend</h3>
                <select className="text-xs bg-transparent border-none text-[#57606a] dark:text-[#8b949e] focus:ring-0 cursor-pointer outline-none font-medium">
                  {user.divisions.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={studentProgress} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0969da" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0969da" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d0d7de" opacity={0.5} />
                    <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#57606a', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} domain={[60, 100]} tick={{ fill: '#57606a', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', color: '#c9d1d9', borderRadius: '8px', fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="score" name="Avg Task Score %" stroke="#0969da" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
