import React from 'react';
import { motion } from 'framer-motion';

const AttendanceHeatmap = ({ data = [] }) => {
  // Generate days for the last 6 months
  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(today.getMonth() - 6);

  // Helper to get date string key
  const getDateKey = (date) => date.toISOString().split('T')[0];

  // Map attendance data to date keys
  const attendanceMap = data.reduce((acc, curr) => {
    const key = getDateKey(new Date(curr.checkInTime));
    acc[key] = curr.status;
    return acc;
  }, {});

  // Generate grid data
  const grid = [];
  const startDay = new Date(sixMonthsAgo);
  // Adjust to start on Sunday
  startDay.setDate(startDay.getDate() - startDay.getDay());

  const tempDate = new Date(startDay);
  while (tempDate <= today || grid.length % 7 !== 0) {
    grid.push(new Date(tempDate));
    tempDate.setDate(tempDate.getDate() + 1);
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'bg-green-500';
      case 'Late': return 'bg-yellow-500';
      case 'Absent': return 'bg-red-500/50';
      case 'Excused': return 'bg-blue-500/50';
      default: return 'bg-white/5';
    }
  };

  const getStatusLabel = (status, date) => {
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    if (!status) return `${dateStr}: No Session`;
    return `${dateStr}: ${status}`;
  };

  // Group into weeks (7 rows per column)
  const weeks = [];
  for (let i = 0; i < grid.length; i += 7) {
    weeks.push(grid.slice(i, i + 7));
  }

  return (
    <div className="bg-portal-input/30 border border-portal-border rounded-2xl p-6 overflow-hidden relative group">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-[10px] font-black text-portal-accent uppercase tracking-[0.2em] flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-portal-accent animate-pulse" />
          Attendance Activity
        </h4>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm bg-white/5" />
            <span className="text-[8px] font-bold text-portal-text-muted uppercase">None</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm bg-green-500" />
            <span className="text-[8px] font-bold text-portal-text-muted uppercase">Present</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm bg-yellow-500" />
            <span className="text-[8px] font-bold text-portal-text-muted uppercase">Late</span>
          </div>
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-4 scrollbar-hide">
        {/* Day labels */}
        <div className="flex flex-col gap-1.5 pr-2 pt-6">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
            <span key={day} className={`text-[7px] font-black uppercase tracking-tighter h-2.5 flex items-center ${i % 2 === 0 ? 'text-portal-text-muted' : 'opacity-0'}`}>
              {day}
            </span>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="flex gap-1.5">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1.5">
              {/* Month label */}
              <div className="h-4 flex items-end">
                {week[0].getDate() <= 7 && (
                  <span className="text-[8px] font-black text-portal-text-muted uppercase tracking-widest whitespace-nowrap">
                    {week[0].toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                )}
              </div>
              {week.map((date, dayIndex) => {
                const status = attendanceMap[getDateKey(date)];
                const isFuture = date > today;
                return (
                  <motion.div
                    key={dayIndex}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: (weekIndex * 7 + dayIndex) * 0.002 }}
                    whileHover={{ scale: 1.5, zIndex: 50 }}
                    className={`w-2.5 h-2.5 rounded-sm transition-colors relative cursor-help ${isFuture ? 'opacity-20 pointer-events-none' : ''} ${getStatusColor(status)}`}
                    title={getStatusLabel(status, date)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Decorative background element */}
      <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-portal-accent/5 rounded-full blur-2xl pointer-events-none" />
    </div>
  );
};

export default AttendanceHeatmap;
