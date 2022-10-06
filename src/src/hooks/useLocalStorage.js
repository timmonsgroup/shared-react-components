import { useState, useEffect } from 'react';

export const getStorage = (key, defaultValue) => {
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored) || defaultValue;
    } catch (err) {
      return defaultValue;
    }
  }

  return defaultValue;
}

export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => getStorage(key, defaultValue));

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}