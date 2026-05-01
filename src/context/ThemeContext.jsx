import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('portal-theme') || 'default';
  });

  useEffect(() => {
    // Apply theme to html element
    const root = window.document.documentElement;
    
    // Remove previous theme classes/attributes if any
    root.removeAttribute('data-theme');
    
    if (theme !== 'default') {
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  useEffect(() => {
    // Save to local storage
    localStorage.setItem('portal-theme', theme);
  }, [theme]);

  const themes = [
    { id: 'default', name: 'Dark Teal', color: '#2ab1c2' },
    { id: 'dark-red', name: 'Dark Red', color: '#ef4444' },
    { id: 'black', name: 'Pure Black', color: '#ffffff' },
    { id: 'light', name: 'Light Mode', color: '#71717a' },
  ];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};
