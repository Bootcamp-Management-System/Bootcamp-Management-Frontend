import React, { useState } from 'react';
import { Search, Filter, CalendarPlus, Video, MapPin, Clock, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Repeat } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { toast } from 'sonner';
import { addDays, startOfWeek, format, parse } from 'date-fns';

const mockSessions = [
  { id: 1, title: 'Intro to React', division: 'Development', instructor: 'Diana Prince', date: '2026-04-20', startTime: '10:00 AM', endTime: '12:00 PM', location: 'Google Meet', status: 'Upcoming', week: 16 },
  { id: 2, title: 'Network Security Basics', division: 'Cybersecurity', instructor: 'Mike Johnson', date: '2026-04-21', startTime: '1:00 PM', endTime: '3:00 PM', location: 'Lab 1', status: 'Upcoming', week: 16 },
  { id: 3, title: 'Machine Learning 101', division: 'Data Science', instructor: 'Sarah Smith', date: '2026-04-17', startTime: '2:00 PM', endTime: '4:00 PM', location: 'Google Meet', status: 'Completed', week: 16 },
  { id: 4, title: 'CPD Workshop', division: 'CPD', instructor: 'John Doe', date: '2026-04-22', startTime: '09:00 AM', endTime: '11:00 AM', location: 'Lab 2', status: 'Upcoming', week: 16 },
  { id: 5, title: 'Advanced Python', division: 'Development', instructor: 'Diana Prince', date: '2026-04-23', startTime: '10:00 AM', endTime: '12:00 PM', location: 'Google Meet', status: 'Upcoming', week: 16 },
  { id: 6, title: 'Data Visualization', division: 'Data Science', instructor: 'Sarah Smith', date: '2026-04-18', startTime: '3:00 PM', endTime: '5:00 PM', location: 'Lab 1', status: 'Completed', week: 16 },
];

const divisions = ['All Divisions', 'Data Science', 'Development', 'Cybersecurity', 'CPD'];
const locations = ['Google Meet', 'Lab 1', 'Lab 2'];

export function Sessions() {
  const [selectedDivision, setSelectedDivision] = useState('All Divisions');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('This Week');
  const [selectedMonth, setSelectedMonth] = useState('April');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'week' | 'list'>('week');
  
  // Create session form state
  const [newSession, setNewSession] = useState({
    title: '',
    division: 'Development',
    instructor: '',
    date: '',
    startTime: '',
    endTime: '',
    location: 'Google Meet',
    isRecurring: false,
    recurringPattern: 'weekly',
    recurringEnd: ''
  });

  const filteredSessions = mockSessions.filter(s => {
    const divisionMatch = selectedDivision === 'All Divisions' || s.division === selectedDivision;
    const now = new Date();
    const sessionDate = new Date(s.date);
    
    let timeMatch = true;
    if (selectedTimeFilter === 'This Week') {
      const weekStart = startOfWeek(now, { weekStartsOn: 1 });
      const weekEnd = addDays(weekStart, 7);
      timeMatch = sessionDate >= weekStart && sessionDate < weekEnd;
    } else if (selectedTimeFilter === 'This Month') {
      timeMatch = sessionDate.getMonth() === now.getMonth();
    } else if (selectedTimeFilter === 'Upcoming') {
      timeMatch = sessionDate >= now;
    }
    
    return divisionMatch && timeMatch;
  });

  // Group sessions by date for weekly view
  const sessionsByDate = filteredSessions.reduce((acc, session) => {
    const date = session.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(session);
    return acc;
  }, {} as Record<string, typeof mockSessions>);

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i);
    return format(date, 'yyyy-MM-dd');
  });

  const handleCreateSession = () => {
    toast.success(`Session "${newSession.title}" created successfully${newSession.isRecurring ? ' (Recurring)' : ''}`);
    setCreateDialogOpen(false);
    setNewSession({
      title: '',
      division: 'Development',
      instructor: '',
      date: '',
      startTime: '',
      endTime: '',
      location: 'Google Meet',
      isRecurring: false,
      recurringPattern: 'weekly',
      recurringEnd: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#24292f] dark:text-[#c9d1d9]">Sessions Management</h1>
          <p className="text-[#57606a] dark:text-[#8b949e]">Schedule and manage bootcamp sessions across all divisions.</p>
        </div>
        <button 
          onClick={() => setCreateDialogOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-md text-sm font-medium transition-colors shadow-sm"
        >
          <CalendarPlus className="w-4 h-4" />
          Create Session
        </button>
      </div>

      {/* Filters and View Toggle */}
      <div className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-[#57606a] dark:text-[#8b949e]" />
            <select 
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="bg-white dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] rounded-md text-sm py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-[#0969da] text-[#24292f] dark:text-[#c9d1d9]"
            >
              {divisions.map(div => (
                <option key={div} value={div}>{div}</option>
              ))}
            </select>
            <select 
              value={selectedTimeFilter}
              onChange={(e) => setSelectedTimeFilter(e.target.value)}
              className="bg-white dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] rounded-md text-sm py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-[#0969da] text-[#24292f] dark:text-[#c9d1d9]"
            >
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="Upcoming">Upcoming</option>
              <option value="All">All</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#57606a] dark:text-[#8b949e]" />
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-white dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] rounded-md text-sm py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-[#0969da] text-[#24292f] dark:text-[#c9d1d9]"
            >
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-white dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] rounded-md text-sm py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-[#0969da] text-[#24292f] dark:text-[#c9d1d9]"
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>

          <div className="flex items-center gap-2 border border-[#d0d7de] dark:border-[#30363d] rounded-md p-1">
            <button 
              onClick={() => setViewMode('week')}
              className={cn(
                "px-3 py-1.5 rounded text-sm font-medium transition-colors",
                viewMode === 'week' 
                  ? 'bg-[#ddf4ff] text-[#0969da] dark:bg-[#2f81f7]/20 dark:text-[#58a6ff]' 
                  : 'text-[#57606a] dark:text-[#8b949e] hover:bg-[#f6f8fa] dark:hover:bg-[#21262d]'
              )}
            >
              Weekly
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn(
                "px-3 py-1.5 rounded text-sm font-medium transition-colors",
                viewMode === 'list' 
                  ? 'bg-[#ddf4ff] text-[#0969da] dark:bg-[#2f81f7]/20 dark:text-[#58a6ff]' 
                  : 'text-[#57606a] dark:text-[#8b949e] hover:bg-[#f6f8fa] dark:hover:bg-[#21262d]'
              )}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Sessions Display */}
      {viewMode === 'week' ? (
        // Weekly Calendar View
        <div className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-7 border-b border-[#d0d7de] dark:border-[#30363d]">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, idx) => (
              <div key={day} className="p-3 text-center bg-[#f6f8fa] dark:bg-[#0d1117] border-r border-[#d0d7de] dark:border-[#30363d] last:border-r-0">
                <div className="text-xs font-medium text-[#57606a] dark:text-[#8b949e]">{day}</div>
                <div className="text-sm font-bold text-[#24292f] dark:text-[#c9d1d9] mt-1">
                  {format(parse(weekDates[idx], 'yyyy-MM-dd', new Date()), 'd')}
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 min-h-[500px]">
            {weekDates.map((date, idx) => (
              <div key={date} className="border-r border-[#d0d7de] dark:border-[#30363d] last:border-r-0 p-2 space-y-2">
                {sessionsByDate[date]?.map((session) => (
                  <div 
                    key={session.id}
                    className="bg-[#ddf4ff] dark:bg-[#2f81f7]/20 border border-[#0969da]/20 dark:border-[#2f81f7]/30 rounded-lg p-2 text-xs hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="font-semibold text-[#0969da] dark:text-[#58a6ff] mb-1 truncate">{session.title}</div>
                    <div className="flex items-center gap-1 text-[#57606a] dark:text-[#8b949e] mb-1">
                      <Clock className="w-3 h-3" />
                      {session.startTime}
                    </div>
                    <div className="flex items-center gap-1 text-[#57606a] dark:text-[#8b949e]">
                      {session.location === 'Google Meet' ? (
                        <Video className="w-3 h-3 text-[#0969da]" />
                      ) : (
                        <MapPin className="w-3 h-3 text-[#8250df]" />
                      )}
                      <span className="truncate">{session.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        // List View
        <div className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#f6f8fa] dark:bg-[#161b22] text-[#57606a] dark:text-[#8b949e] border-b border-[#d0d7de] dark:border-[#30363d]">
                <tr>
                  <th className="px-6 py-3 font-medium">Session Name</th>
                  <th className="px-6 py-3 font-medium">Division & Instructor</th>
                  <th className="px-6 py-3 font-medium">Date & Time</th>
                  <th className="px-6 py-3 font-medium">Location</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d0d7de] dark:divide-[#30363d]">
                {filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-[#24292f] dark:text-[#c9d1d9]">{session.title}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[#24292f] dark:text-[#c9d1d9] font-medium">{session.division}</span>
                        <span className="text-xs text-[#57606a] dark:text-[#8b949e]">{session.instructor}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-[#57606a] dark:text-[#8b949e]">
                        <span className="flex items-center gap-1.5"><CalendarIcon className="w-3.5 h-3.5" />{session.date}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{session.startTime} - {session.endTime}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {session.location === 'Google Meet' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#ddf4ff] text-[#0969da] dark:bg-[#2f81f7]/20 dark:text-[#58a6ff] border border-[#0969da]/20 dark:border-[#2f81f7]/30">
                          <Video className="w-3.5 h-3.5" />
                          Google Meet
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#f4ecff] text-[#8250df] dark:bg-[#8250df]/20 dark:text-[#d2a8ff] border border-[#8250df]/20 dark:border-[#d2a8ff]/30">
                          <MapPin className="w-3.5 h-3.5" />
                          {session.location}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
                        session.status === 'Upcoming' ? "bg-[#fff8c5] text-[#9a6700] dark:bg-[#d29922]/20 dark:text-[#e3b341] border-[#d4a72c]/20 dark:border-[#d29922]/30" : "bg-[#dafbe1] text-[#1a7f37] dark:bg-[#238636]/20 dark:text-[#3fb950] border-[#1a7f37]/20 dark:border-[#2ea043]/30"
                      )}>
                        {session.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[#0969da] dark:text-[#2f81f7] hover:underline text-sm font-medium">
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredSessions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-[#57606a] dark:text-[#8b949e]">
                      No sessions found for the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Session Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Session</DialogTitle>
            <DialogDescription>
              Schedule a new session for your bootcamp. You can set it up as a one-time or recurring event.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Session Title</Label>
              <Input 
                id="title" 
                value={newSession.title}
                onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                placeholder="e.g., Introduction to React" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="division">Division</Label>
                <Select value={newSession.division} onValueChange={(value) => setNewSession({ ...newSession, division: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                    <SelectItem value="CPD">CPD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="instructor">Instructor</Label>
                <Input 
                  id="instructor" 
                  value={newSession.instructor}
                  onChange={(e) => setNewSession({ ...newSession, instructor: e.target.value })}
                  placeholder="Instructor name" 
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  type="date"
                  value={newSession.date}
                  onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input 
                  id="startTime" 
                  type="time"
                  value={newSession.startTime}
                  onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input 
                  id="endTime" 
                  type="time"
                  value={newSession.endTime}
                  onChange={(e) => setNewSession({ ...newSession, endTime: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Select value={newSession.location} onValueChange={(value) => setNewSession({ ...newSession, location: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Google Meet">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Google Meet
                    </div>
                  </SelectItem>
                  <SelectItem value="Lab 1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Lab 1
                    </div>
                  </SelectItem>
                  <SelectItem value="Lab 2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Lab 2
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="recurring"
                checked={newSession.isRecurring}
                onCheckedChange={(checked) => setNewSession({ ...newSession, isRecurring: checked as boolean })}
              />
              <label
                htmlFor="recurring"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
              >
                <Repeat className="w-4 h-4" />
                Make this a recurring session
              </label>
            </div>

            {newSession.isRecurring && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-[#f6f8fa] dark:bg-[#0d1117] rounded-lg border border-[#d0d7de] dark:border-[#30363d]">
                <div>
                  <Label htmlFor="pattern">Repeat Pattern</Label>
                  <Select value={newSession.recurringPattern} onValueChange={(value) => setNewSession({ ...newSession, recurringPattern: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="recurringEnd">End Date</Label>
                  <Input 
                    id="recurringEnd" 
                    type="date"
                    value={newSession.recurringEnd}
                    onChange={(e) => setNewSession({ ...newSession, recurringEnd: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSession}>
              Create Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
