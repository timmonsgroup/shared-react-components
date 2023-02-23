import { useState, useEffect } from 'react';

/**
 * Helper function to get a value from localStorage.
 * @param {*} key
 * @param {*} defaultValue
 * @returns {object}
 */
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

/**
 * A hook to use localStorage as a model for state.
 * @param {string} key
 * @param {any} defaultValue
 * @returns {object}
 */
export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => getStorage(key, defaultValue));

  // Update the localStorage when the value changes.
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}