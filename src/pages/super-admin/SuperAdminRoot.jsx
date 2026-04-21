import React from 'react';
import { Layout } from './app/components/Layout';
import { ThemeProvider } from './app/components/ThemeProvider';
import { Toaster } from './app/components/ui/sonner';

export function SuperAdminRoot() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="bms-theme">
      <Layout />
      <Toaster />
    </ThemeProvider>
  );
}
