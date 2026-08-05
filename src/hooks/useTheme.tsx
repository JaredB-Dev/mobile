import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'app-theme';

export const useTheme = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('ion-palette-dark', isDark);
  }, [isDark]);

  const toggleTheme = useCallback((dark: boolean) => {
    setIsDark(dark);
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
  }, []);

  return { isDark, toggleTheme };
};