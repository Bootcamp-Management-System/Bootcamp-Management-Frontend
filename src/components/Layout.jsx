import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-portal-bg text-portal-text overflow-hidden font-sans">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 bg-portal-bg">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto p-8 relative">
          {/* Subtle Page Glow */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-portal-accent/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
