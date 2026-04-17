import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { DashboardThemeProvider, useDashboardTheme } from '../context/DashboardThemeContext';

export const Layout = ({ children }) => {
  return (
    <DashboardThemeProvider>
      <DashboardLayoutShell>{children}</DashboardLayoutShell>
    </DashboardThemeProvider>
  );
};

const DashboardLayoutShell = ({ children }) => {
  const { isDark } = useDashboardTheme();

  return (
    <div className={`flex h-screen overflow-hidden font-sans ${isDark ? 'bg-[#0d1117] text-[#e6edf3]' : 'bg-[#f6f8fa] text-[#1f2328]'}`}>
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        
        <main className={`flex-1 overflow-y-auto p-8 ${isDark ? 'bg-[#0d1117]' : 'bg-[#f6f8fa]'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};
