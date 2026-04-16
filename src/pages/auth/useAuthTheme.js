import { useEffect, useState } from 'react';

const AUTH_THEME_KEY = 'auth_theme';
const LEGACY_LOGIN_THEME_KEY = 'login_theme';

export const useAuthTheme = () => {
  const [theme, setTheme] = useState(() => {
    const storedAuthTheme = localStorage.getItem(AUTH_THEME_KEY);
    const legacyTheme = localStorage.getItem(LEGACY_LOGIN_THEME_KEY);
    return storedAuthTheme || legacyTheme || 'dark';
  });

  useEffect(() => {
    localStorage.setItem(AUTH_THEME_KEY, theme);
    localStorage.setItem(LEGACY_LOGIN_THEME_KEY, theme);
  }, [theme]);

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme: () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark')),
  };
};
