import React, { createContext, useContext, useEffect, useState } from 'react';

const DashboardThemeContext = createContext(undefined);
const DASHBOARD_THEME_KEY = 'dashboard_theme';

export const DashboardThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem(DASHBOARD_THEME_KEY) || 'dark');

  useEffect(() => {
    localStorage.setItem(DASHBOARD_THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <DashboardThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggleTheme }}>
      {children}
    </DashboardThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDashboardTheme = () => {
  const context = useContext(DashboardThemeContext);

  if (context === undefined) {
    throw new Error('useDashboardTheme must be used within a DashboardThemeProvider');
  }

  return context;
};