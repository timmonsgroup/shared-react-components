/** @module useData */
import { useState, useEffect } from 'react';
import axios from 'axios';
import axiosRetry  from 'axios-retry';

// Use as persistent store to keep track of the state of the data and prevent refetching
const CACHE = {};

/**
 * Layout fetching hook that assumes the default layout endpoint
 * @param {string} type - object type for standard get layout endpoint
 * @param {string} key - layout key for standard get layout endpoint
 * @param {string} url - optional if you are not using the standard endpoint
 * @param {object} existingLayout - optional if you already have the layout and do not want to fetch it
 * @returns [object, boolean] - layout, loading
 */
export const useLayout = (type, key, url = null, existingLayout = null) => {
  const fetchUrl = url || `/api/layout/get?objectType=${type}&layoutKey=${key}`;
  // If existingLayout is not null, we will set the flag to true to prevent fetching
  const [data, isLoading] = useStaleData(fetchUrl, existingLayout || {}, existingLayout !== null);

  return [data, isLoading];
};

/**
 * Hook to fetch WMS DescribeLayer response by url or cache
 * @returns array of useState properties layers and loading state
 */
export const useMapConfig = (map_key) => {
  const url = `/api/map/config/getForMap/${map_key}`;
  // If debug mode is enabled, we will use the fake data
  const defaultValue = [];
  const [data, isLoading ] = useStaleData(url, defaultValue, false);
  const [mapConfig, setMapConfig] = useState([]);
  const [mapConfigLoading, setMapConfigLoading] = useState(true);


  // Monitor the loading state of the data and update this hook's state
  // This prevents the component using this hook from having to handle the parsing itself
  // We do not need to clean up the useEffect as the staleData hook does it for us
  useEffect(() => {
    if (!isLoading) {
      setMapConfig(data);
      setMapConfigLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);
  return [mapConfig, mapConfigLoading];
};

/**
 * Hook to fetch config by key or cache
 * @param {string} config_key
 * @returns {Array<object|boolean>} config, loading
 */
export const useConfig = (config_key) => {
  const url = `/api/app/config/get?configKey=${config_key}`;
  // If debug mode is enabled, we will use the fake data
  const defaultValue = {};
  const [data, isLoading ] = useStaleData(url, defaultValue, false);
  const [config, setConfig] = useState([]);
  const [configLoading, setConfigLoading] = useState(true);

  // Monitor the loading state of the data and update this hook's state
  // This prevents the component using this hook from having to handle the parsing itself
  // We do not need to clean up the useEffect as the staleData hook does it for us
  useEffect(() => {
    if (!isLoading) {
      setConfig(data);
      setConfigLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);
  return [config, configLoading];
};

/**
 * Hook that will fetch data from a url and cache it
 * If the isDev flag is set to true, the first fetch will be faked and defaultValue will be returned and set in cache
 * @function
 * @param {string} url - url to fetch data from
 * @param {any} defaultValue - default value to use if the cache is empty
 * @param {boolean} useDefault - flag to use the default value
 * @param {boolean} clearCache - flag to clear the cache
 * @param {boolean} forceError - flag to force an error
 * @returns {Array<object|boolean>} data, loading
 */
export const useStaleData = (url, defaultValue = [], useDefault, clearCache, forceError) => {
  const [data, setData] = useState(defaultValue);
  const [isLoading, setLoading] = useState(true);

  if (clearCache) {
    delete CACHE[url];
  }

  // check against forceError flag and throw an error if true
  const maybeFakeError = () => {
    // Fake an error
    if(forceError) {
      console.log('force error');
      throw new Error('Forced error');
    }
  };

  useEffect(() => {
    const cacheId = url;
    let mounted = true;
    let timeRef = null;

    if (useDefault) {
      // Emulate a request endpoint
      timeRef = setTimeout(() => {
        if (!mounted) {
          return;
        }
        maybeFakeError();

        setData(defaultValue);
        setLoading(false);
      }, 100);

      // Add a cleanup function for the timeout
      return () => {
        timeRef && clearTimeout(timeRef);
        mounted = false;
      };
    } else if (CACHE[cacheId] !== undefined) {
      setData(CACHE[cacheId]);
      setLoading(false);
    } else {
      const controller = new AbortController();
      axios.get(url, { signal: controller.signal }).then(res => {
        if (!mounted) {
          return;
        }

        // Fake an error
        maybeFakeError();

        CACHE[cacheId] = res.data;
        setData(res.data);
      }).catch(error => {
        if (error.name !== 'CanceledError') {
          console.log('\t\tError fetching Data', error);
        }
      }).then(() => {
        if (!mounted) {
          return;
        }
        //Set the loaded flag to get rid of the loading message
        setLoading(false);
      });

      // Clenaup function using the abort controller
      return () => {
        controller.abort();
        mounted = false;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [data, isLoading];
};

/**
 * Hook to use Axios get request without caching
 * @param {*} url - url to fetch
 * @param {*} defaultValue - default value of the data state
 * @returns array of useState properties data and loading state
 */
export const useGet = (url, defaultValue = null) => {
  const [data, setData] = useState(defaultValue);
  const [isLoading, setLoading] = useState(true);

  // We monitor the url to see if it has changed
  // This important for components that fetch data from the same url but with different parameters
  // I.E. ViewCommunity where the ID changes
  useEffect(() => {
    setLoading(true);
    let mounted = true;
    const controller = new AbortController();
    const getData = () => {
      axios.get(url, { signal: controller.signal }).then(res => {
        if (mounted) {
          setData(res.data);
        }
      }
      ).catch(error => {
        if (error.name !== 'CanceledError') {
          console.log('Error fetching data', error);
        }
      }).finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });
    };

    getData();

    // Cleanup on unmount
    return () => {
      controller.abort();
      mounted = false;
    };
  }, [url]);

  return [data, isLoading, setData];
};

/**
 * Hook to use axios-retry to retry a request if it fails with a 504 error
 * This happens when the database is not available
 **/
axiosRetry(axios, {
  retries: 3, // number of retries
  retryDelay: (retryCount) => {
    console.log(`retry attempt: ${retryCount}`);
    return retryCount * 2000; // time interval between retries
  },
  retryCondition: (error) => {
    // if retry condition is not specified, by default idempotent requests are retried
    return error.response.status === 504;
  },
});