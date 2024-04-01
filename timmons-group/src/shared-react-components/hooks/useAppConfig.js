import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { createTheme } from '@mui/material';
import { config as defaultConfig } from '../config/default';

export const configContext = createContext();

export const useConfig = () => {
  return useContext(configContext);
};

export function useGetAppConfig() {
  const retried = useRef(false);
  const [config, setConfig] = useState(createTheme(defaultConfig));
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // Our api has a configuration endpoint that returns the theme when we request a configKey of Theme
        const config = await fetch('/api/app/config/get?configKey=App').then(res => res.json());

        // Update our state
        setConfig(config);
        setIsLoaded(true);
      } catch (ex) {
        console.warn(`App Config Exception${retried ? ' 2nd attempt' : ''}: `, ex);
        if (!retried.current) {
          retried.current = true;
          // With aurora we could hit a timeout while the backend tries to spool up, in that case we try again
          setTimeout(fetchConfig, 5000);
        }
      }
    };
    fetchConfig();
  }, []);

  return { config, isLoaded };
}