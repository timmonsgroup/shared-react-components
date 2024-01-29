/** @module useAuth */
import '../models/auth';
import * as React from 'react'
import {
  useState,
  useRef,
  useEffect,
  useContext,
  createContext,
  useReducer
} from 'react';
import { ACLS, AUTH_STATES } from '../constants';
import PropTypes from 'prop-types';
import { parseTokens, decodeTokenToJWT, parseCombinedToken } from '../helpers/JWTUtil';
import axios from 'axios';

const openWindow = false;
let staleCheckTimeoutTracker = -1;

const timeToSessionIdle = 5 * 60; // The time in which a session is considered 'idle' and should not auto refresh the token
const timeToStale = 5 * 60; // The time from the token expiration when we should refresh the token if the user is not idle
/*
  TODO: More documentation!
*/

import { getConfigBuilder, AUTHORIZATION_MODES, ACCESS_CONTROL_LIST_SOURCE, STORAGE_MODES } from '@timmons-group/shared-auth-config';

// This constant is a template for a logged out user
// It gets used when a user is not logged in or when the logged in user selects to logout
// Note there are no permissions set for this user
// The default permissions come from the api as they will differ depending on the environment/tenant
const loggedOutUser = {
  name: 'Anonymous',
  isSignedIn: false,
};

/**
 * Define the actions that can be dispatched
 * These represent the different state changes that the auth state can be in
 * @constant ACTIONS
 */
const ACTIONS = {
  SET_CONFIG: 'SET_CONFIG',
  BEGIN_LOGIN: 'begin_login',
  SET_TOKEN_INFO: 'set_token_info',
  BEGIN_LOGOUT: 'begin_logout',
  FINISH_LOGOUT: 'finish_logout',
  SET_ERROR: 'set_error',
  SET_PERMISSIONS: 'set_permissions',
  TOKEN_STALE: 'token_stale',
  SET_STALE_CHECK_STATE: 'set_stale_check_state',
  SET_LAST_REQUEST_TIME: 'set_last_request_time',
  SET_REFRESHING: 'set_refreshing',
  SET_GLOBAL_STATE: 'set_global_state',
  SET_CONFIG_STATE: 'set_config_state',
};

/**
 * Define the states that the stale check can be in
 * @constant STALE_CHECK_STATES
 */
const STALE_CHECK_STATES = {
  NEW_SESSION: 'NEW_SESSION',
  STALE_CHECK_REQUESTED: 'STALE_CHECK_REQUESTED',
  STALE_CHECK_COMPLETE: 'STALE_CHECK_COMPLETE',
  STALE_CHECK_IN_PROGRESS: 'STALE_CHECK_IN_PROGRESS',
};

const GLOBAL_STATES = {
  IDLE: 'IDLE',
  INITIALIZING: 'INITIALIZING',
  AUTHENTICATING: 'AUTHENTICATING',
  AUTHORIZING: 'AUTHORIZING',
  READY: 'READY',
}

const CONFIG_STATES = {
  MISSING: 'MISSING',
  INVALID: 'INVALID',
  VALID: 'VALID',
}

/**
 * Valid states that allow logins to occur
 * If the auth state is not in this list, we will not allow logins
 * This will, for example, not allow someone to attempt to log in while already logged in
 * @constant VALID_LOGIN_STATES
 */
const VALID_LOGIN_STATES = [AUTH_STATES.INITIALIZING, AUTH_STATES.LOGGED_OUT, AUTH_STATES.TOKEN_STALE];

/**
 * Define the initial state of the auth state
 * @constant initialState
 */
const initialState = {
  state: AUTH_STATES.INITIALIZING,
  globalState: GLOBAL_STATES.IDLE,
  configState: CONFIG_STATES.MISSING,
  refreshToken: null,
  bearerToken: null,
  user: {
    authenticated: false,
    name: '',
    id: '',
    raw: {},
  },
  lastRequestTime: new Date(),
};

/**
 * This is the context that will be used to provide the auth state to its consumers
 * @constant authContext
 */
export const authContext = createContext();

let _metaWhileList = [];
let _staleCheckSeconds = 60;

// If multiple apps are using the same cookie, we need to be able to differentiate which one logged out
let APP_ID = '123-456';


/**
 * Wrap the hook with a provider
 * Use cookieReference to differentiate between multiple apps using the same cookie *
 * @param {object} props - The props for the component
 * @param {object} props.config - The config object
 * @param {string} [props.config.cookieReference] - The cookie reference
 * @param {array} [props.whitelist] - The whitelist array
 * @param {object} [props.options] - Additional options
 * @param {number} [props.options.staleCheckSeconds] - The stale check seconds
 * @param {object} [props.children] - The children
 * @function ProvideAuth
 * @returns {React.Context} The auth context provider
 */
export const ProvideAuth = ({ config, whitelist, options, children, initInfo }) => {

  if (config?.cookieReference) {
    APP_ID = config.cookieReference;
  }

  const auth = useProvideAuth(config, whitelist, options, initInfo);

  // We are providing the object returned by useProvideAuth as the value of the authContext
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

ProvideAuth.propTypes = {
  config: PropTypes.object.isRequired,
  whitelist: PropTypes.array,
  options: PropTypes.object,
  children: PropTypes.element,
  initInfo: PropTypes.object,
};

/**
 * @typedef {object} AuthContext
 * @property {function} login - The login function
 * @property {function} logout - The logout function
 * @property {function} refresh - The refresh function
 * @property {function} getPermissions - The getPermissions function
 * @property {function} getBearerToken - The getBearerToken function
 * @property {object} authState - The authState object
 * @property {string} authState.state - The authState.state
 * @property {string} authState.refreshToken - The authState.refreshToken
 * @property {string} authState.bearerToken - The authState.bearerToken
 * @property {object} authState.user - The authState.user
 * @property {string} authState.user.name - The authState.user.name
 * @property {string} authState.user.id - The authState.user.id
 * @property {object} authState.user.raw - The authState.user.raw
 * @property {string} authState.user.acl - The authState.user.acl
 * @property {string} authState.user.permissions - The authState.user.permissions
 * @property {string} authState.user.isAuthenticated - The authState.user.isAuthenticated
 * @property {string} authState.user.isSignedIn - The authState.user.isSignedIn
 * @property {string} authState.user.email - The authState.user.email
 * @property {string} authState.user.groups - The authState.user.groups
 * @property {string} authState.user.roles - The authState.user.roles
 * @property {string} authState.user.meta - The authState.user.meta
 * @property {string} authState.user.meta.displayName - The authState.user.meta.displayName
 * @property {string} authState.user.meta.email - The authState.user.meta.email
 * @property {string} authState.user.meta.firstName - The authState.user.meta.firstName
 * @property {string} authState.user.meta.lastName - The authState.user.meta.lastName
 * @property {string} authState.user.meta.groups - The authState.user.meta.groups
 * @property {string} authState.user.meta.roles - The authState.user.meta.roles
 * @property {string} authState.user.meta.permissions - The authState.user.meta.permissions
 * @property {string} authState.user.meta.company - The authState.user.meta.company
 */

/**
 * This class wraps the cookie store and provides an interface identical to the session and local storage interfaces
 */
class CookieWrapper {
  constructor() {
    this.storedValue = {};
    this.parseCookie();
  }

  parseCookie() {
    // Cookies are weird so we need to parse all the values from a single cookie
    const cookie = document.cookie.split(';').reduce((res, c) => {
      const [key, val] = c.trim().split('=').map(decodeURIComponent);
      try {
        return Object.assign(res, { [key]: JSON.parse(val) });
      } catch (e) {
        return Object.assign(res, { [key]: val });
      }
    }, {});

    this.storedValue = cookie;
  }

  getItem(key) {
    return this.storedValue[key];
  }

  setItem(key, value) {
    this.storedValue[key] = value;
    this.putCookie();
  }

  removeItem(key) {
    delete this.storedValue[key];
    this.putCookie();
  }

  encodeCookie() {
    // Cookies are weird so we need to encode all the values into a single cookie

    const cookie = this.storedValue;

    return Object.keys(cookie).map((key) => {
      // URL encode the key and value
      key = encodeURIComponent(key);
      let value = encodeURIComponent(cookie[key]);
      return `${key}=${value}`;
    }).join(';');
  }

  putCookie() {
    document.cookie = `${this.encodeCookie()}`;
  }
}

class StorageDriver {
  constructor(storeType, initKey) {
    this.storeType = storeType;
    this.initKey = initKey;
    this.initStore();
  }

  initStore() {
    switch (this.storeType) {
      case STORAGE_MODES.SESSION:
        this.store = window.sessionStorage;
        break;
      case STORAGE_MODES.LOCAL:
        this.store = window.localStorage;
        break;
      case STORAGE_MODES.COOKIE:
        this.store = new CookieWrapper();
      default:
        console.error("No storage mode configured, unable to read init info");
        break;
    }

  }

  putAccessToken(token) {
    if (typeof token !== 'string') {
      token = JSON.stringify(token);
    }

    this.store.setItem('access_token', token);
  }

  putIdToken(token) {
    if (typeof token !== 'string') {
      token = JSON.stringify(token);
    }

    this.store.setItem('id_token', token);
  }

  putRefreshToken(token) {
    if (typeof token !== 'string') {
      token = JSON.stringify(token);
    }

    this.store.setItem('refresh_token', token);
  }

  putCombinedToken(token) {
    if (typeof token !== 'string') {
      token = JSON.stringify(token);
    }

    this.store.setItem(this.initKey, token);
  }

  putAuthorization(authorization, maybeApplication) {
    if (typeof authorization !== 'string') {
      authorization = JSON.stringify(authorization);
    }

    let key = maybeApplication ? `${maybeApplication}_authorization` : 'authorization';

    this.store.setItem(key, authorization);
  }
  


  getAccessToken() {
    let item = this.store.getItem('access_token');
    if (item) {
      try {
        return JSON.parse(item);
      }
      catch (ex) {
        return item;
      }
    }
    return item;

  }

  getIdToken() {

    let item = this.store.getItem('id_token');
    if (item) {
      try {
        return JSON.parse(item);
      }
      catch (ex) {
        return item;
      }
    }
    return item;
  }

  getRefreshToken() {
    let item = this.store.getItem('refresh_token');
    if (item) {
      try {
        return JSON.parse(item);
      }
      catch (ex) {
        return item;
      }
    }
    return item;
  }

  getCombinedToken() {
    let item = this.store.getItem(this.initKey);
    if (item) {
      try {
        return JSON.parse(item);
      }
      catch (ex) {
        return item;
      }
    }
    return item;
  }

  clear() {
    this.store.removeItem('access_token');
    this.store.removeItem('id_token');
    this.store.removeItem('refresh_token');
    this.store.removeItem(this.initKey);
    this.store.removeItem('authorization');
  }

}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
/**
 * This hook provides the auth state and methods to its consumers
 * It is used to manage the auth state and provide the auth state to its consumers
 * @function useAuth
 * @returns {AuthContext} The auth object
 */
export const useAuth = () => {
  // The context object will contain anything returned by useProvideAuth
  const context = useContext(authContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a ProvideAuth');
  }
  return context;
};

/**
 * These are the properties and methods that the "useAuth" hook provides to its consumers
 * We are providing the auth state, login, and logout methods
 * @param {object} config The configuration for the component
 * @param {String[]} [whitelist] The whitelist array
 * @param {object} [options] Additional options
 * @returns {AuthContext} The auth context object
 */
const useProvideAuth = (config, whitelist, options, initInfo) => {

  // We are using the useReducer hook to manage the auth state
  // authState should be exposed to the consumer as part of this hook
  const [authState, dispatch] = useReducer(authReducer, initialState);
  const intercept = useRef();
  const configIsValid = useRef(false);
  const store = useRef(null);
  const init = useRef(null);

  useEffect(() => {
    console.debug("Global State Changed", authState.globalState);
  }, [authState.globalState]);


  const getACL = async (authorization) => {
    // The configuration needs to have a source
    // The source can be:
    // 1. API

    // If the source is API we need to have an endpoint configuration
    if (authorization.source === ACCESS_CONTROL_LIST_SOURCE.API) {
      if (!authorization?.endpoints?.acl) {
        console.error("Authorization source is API but no endpoint was provided")
        return;
      }

      // Get the endpoint
      const endpoint = authorization.aclEndpoint;

      // Get the permissions from the endpoint
      const permissions = await axios.get(endpoint);

      // Return the permissions
      return permissions.data;
    }
  }

  /**
   * Get a claim from a token and parse it if necessary
   * @param {JWT} token 
   * @param {string} claimName 
   * @returns 
   */
  const getClaimFromToken = (token, claimName) => {
    if (!token) {
      return null;
    }

    let decodedToken = null;

    if (typeof token === 'string') {
      decodedToken = decodeTokenToJWT(token);
    } else {
      decodedToken = token;
    }

    if (!decodedToken) {
      return null;
    }

    let claim = decodedToken[claimName];

    if (!claim) {
      return null;
    }

    if (typeof claim === 'string') {
      try {
        claim = JSON.parse(claim);
      } catch (ex) {
      }
    }

    return claim;
  }




  const beginAuthorization = async () => {
    dispatch({ type: ACTIONS.SET_GLOBAL_STATE, globalState: GLOBAL_STATES.AUTHORIZING });
    const { authorization } = config;

    // There are four currently supported authorization modes
    // 1. Access Control List (ACL)
    // 2. ID Token Claim
    // 3. Access Token Claim
    // 4. None

    // If the type is none we will not attempt to get permissions
    if (authorization.mode === AUTHORIZATION_MODES.NONE) {
      console.warn("Authorization type is none, skipping")
      return;
    }

    // If the type is Access Token Claim the configuration must contain a claim name
    if (authorization.mode === AUTHORIZATION_MODES.ACCESS_TOKEN_CLAIM) {
      if (!authorization.tokenClaimName) {
        console.error("Authorization type is access token claim but no token claim name was provided")
        return;
      }

      // Try to get the claim from the access token
      const claim = getClaimFromToken(authState.access_token, authorization.tokenClaimName);

      // Set the permissions
      dispatch({ type: ACTIONS.SET_PERMISSIONS, acl: claim });
      dispatch({ type: ACTIONS.SET_GLOBAL_STATE, globalState: GLOBAL_STATES.READY });
      store.current.putAuthorization(claim, authorization.application);
    }

    // If the type is ID Token Claim the configuration must contain a claim name
    if (authorization.mode === AUTHORIZATION_MODES.ID_TOKEN_CLAIM) {
      if (!authorization.tokenClaimName) {
        console.error("Authorization type is id token claim but no claim name was provided")
        return;
      }

      // Try to get the claim from the id token
      const claim = getClaimFromToken(authState.id_token, authorization.tokenClaimName);

      // Set the permissions
      dispatch({ type: ACTIONS.SET_PERMISSIONS, acl: claim });
      dispatch({ type: ACTIONS.SET_GLOBAL_STATE, globalState: GLOBAL_STATES.READY });
      store.current.putAuthorization(claim, authorization.application);
    }

    // If the type is ACL the configuration must contain a source
    if (authorization.mode === AUTHORIZATION_MODES.ACCESS_CONTROL_LIST) {
      if (!authorization.source) {
        console.error("Authorization type is acl but no source was provided")
        return;
      }

      // Try to get the acl from the source
      const acl = await getACL(authorization);

      // Set the permissions
      dispatch({ type: ACTIONS.SET_PERMISSIONS, acl });
      dispatch({ type: ACTIONS.SET_GLOBAL_STATE, globalState: GLOBAL_STATES.READY });
      store.current.putAuthorization(acl, authorization.application);
    }
  }



  // Any time config changes make sure we update the state
  useEffect(() => {
    if (whitelist?.length > 0) {
      _metaWhileList = whitelist;
    }

    if (options?.staleCheckSeconds) {
      _staleCheckSeconds = options?.staleCheckSeconds;
    }

    if (!config) {
      dispatch({ type: ACTIONS.SET_CONFIG_STATE, configState: CONFIG_STATES.MISSING });
      return;
    }

    // Parse and set the config
    try {
      let cfg = getConfigBuilder()
        .withRawConfiguration(config)
        .build();

      // Push the config into the state, we probably dont need the full config but it contains the anonymous user info at a minimum
      dispatch({ type: ACTIONS.SET_CONFIG, config: cfg });

      // Set the configIsValid flag to true
      configIsValid.current = true;

      dispatch({ type: ACTIONS.SET_CONFIG_STATE, configState: CONFIG_STATES.VALID });

    }
    catch (ex) {
      console.error('useProvideAuth, config was invalid', ex);
      // Set the configIsValid flag to false
      configIsValid.current = false;
      dispatch({ type: ACTIONS.SET_CONFIG_STATE, configState: CONFIG_STATES.INVALID });
    }

  }, [config]);

  useEffect(() => {
    dispatch({ type: ACTIONS.SET_GLOBAL_STATE, globalState: GLOBAL_STATES.INITIALIZING });

    if (configIsValid.current === true && config) {
      const key = config?.storage?.startupSourceKey || 'combinedToken';
      store.current = new StorageDriver(config?.storage?.mode || STORAGE_MODES.SESSION, key);
    }

    if (!init.current) {
      if (store.current) {
        const boot = store.current.getCombinedToken();
        if (boot) {
          init.current = {
            combinedToken: boot
          }
        }
        else {
        }
      }
    }

  }, [configIsValid, config]);

  // And if the initInfo changes make sure we update the state
  useEffect(() => {
    if (init.current) {
      if (init.current.combinedToken) {
        // We need to parse and exteract the id_token, access_token, and maybe refresh_token
        try {
          parseTokenAndUpdateState(init.current.combinedToken);
        } catch (ex) {
          console.error('Error parsing combined token', ex);
          logout_internal('combined token error');
        }
      }

    }
  }, [init]);



  // This will be run once and only once when is first called
  useEffect(() => {
    intercept.current = axios.interceptors.request.use((request) => {
      request.headers['Content-Type'] = 'application/json';
      const token = getActiveBearerToken();
      if (token) {
        request.headers.Authorization = `Bearer ${token}`;
      }
      dispatch({ type: ACTIONS.SET_LAST_REQUEST_TIME, time: Date.now() });
      return request;
    });

    // Do not allow this to be called if the protocol is not https
    // This is to prevent the user from being able to log in with http
    // Http is insecure and should not be used

    if (window.location.protocol !== 'https:') {
      console.error('Only fools would try to use http');
      throw new Error('Only fools would try to use http');
    }

    // Add our listener to the window
    // If we login with a new tab this will receive the event
    window.addEventListener('message', handleMessage);

    return () => {
      if (intercept.current) {
        axios.interceptors.request.eject(intercept.current);
      }
      window.removeEventListener('message', handleMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    intercept.current = axios.interceptors.request.use((request) => {
      const token = authState.access_token;
      if (token) {
        request.headers.Authorization = `Bearer ${token}`;
      }
      else {
        delete request.headers.Authorization;
      }
      dispatch({ type: ACTIONS.SET_LAST_REQUEST_TIME, time: Date.now() });
      return request;
    });

    if (authState.access_token) {
      beginAuthorization();
    }
  }, [authState.access_token]);


  useEffect(() => {
    checkIfStale();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState.staleCheckState]);


  /**
   * This function is called to start the login process
   * It will open the login endpoint in a new tab
   * Should be exposed to the consumer as part of this hook
   * @param {objec | string} state The state to login with, this will be returned with a valid login
   * @function
   * @async
   * @returns {boolean|Promise<void>} True if the login was started, false if the login was not started
   */
  const login = async (state) => {
    // This method only works with oAuth config
    let { authentication } = config;
    let { oAuth } = authentication;
    // Check to see if the auth state is valid for a login
    // If not we will return false
    if (!VALID_LOGIN_STATES.includes(authState.state)) {
      console.error(authState, 'is not a valid login state');
      return false;
    }

    // Dispatch the begin login action
    dispatch({ type: ACTIONS.BEGIN_LOGIN });
    dispatch({ type: ACTIONS.SET_GLOBAL_STATE, globalState: GLOBAL_STATES.AUTHENTICATING });

    // Check if we have a refresh token
    // If we do, we will use it to get a new access token
    // Otherwise check if we have a boot token
    if (authState.refreshToken) {
      return startWithRefreshToken(authState.refreshToken);
    } else if (authState.bootToken) {
      return startWithBootToken(authState.bootToken);
    }

    // If we don't have a refresh token or boot token, we will open a new tab to the login endpoint
    // Calculate our redirect url based off of the origin of the current page and the login endpoint in our api
    // const apiSlug = config.apiSlug || 'api';
    let redirect = oAuth.redirectUri;
    let fetchUrl = `https://${oAuth.host}/oauth2/authorize?response_type=code&client_id=${oAuth.clientId}&redirect_uri=${redirect}`;

    if (state) {
      if (typeof state !== 'string') {
        state = JSON.stringify(state);
      }
      fetchUrl += `&state=${state}`;
    }

    // If openWindow is true open the login endpoint in a new tab
    // Otherwise open the login endpoint in the current tab
    if (openWindow) window.open(fetchUrl, '_blank');
    else window.location.href = fetchUrl;
  };

  /**
   * This function is called to start the logout process
   * It will open the logout endpoint in a new tab
   * Should be exposed to the consumer as part of this hook
   * @function
   * @async
   */
  const logout = async () => {
    dispatch({ type: ACTIONS.BEGIN_LOGOUT });
    logout_internal('logout');

    // Calculate our redirect url based off of the origin of the current page and the logout endpoint in our api
    const apiSlug = config.apiSlug || 'api';
    const redirect = config?.redirects?.logout || `${config.apiRoot || window.location.origin}/${apiSlug}/oauth/logout`;

    // Open the logout endpoint in a new tab
    // const fetchUrl = config?.logoutURL || (config?.useAzureAD ?
    //   `https://${config.host}/oauth2/logout?post_logout_redirect_uri=${redirect}` :
    //   `https://${config.host}/logout?client_id=${config.clientId}&logout_uri=${redirect}`);

    // TODO this isnt always the case and so we will need to support templates
    let fetchUrl = null;
    if(config?.authentication?.oAuth?.endpoints?.logout)
      fetchUrl = config?.authentication?.oAuth?.endpoints?.logout;
    else
      fetchUrl = `${config?.authentication?.oAuth?.host}/oauth2/logout?client_id=${config.authentication.oAuth.clientId}&logout_uri=${redirect}`;

    // If openWindow is true open the logout endpoint in a new tab
    // Otherwise open the logout endpoint in the current tab
    if (openWindow) window.open(fetchUrl, '_blank');
    else window.location.href = fetchUrl;
  };

  /**
   * Refresh the token
   * @function
   * @async
   */
  const refresh = async () => {
    const refreshToken = authState.refreshToken || await store.current.getRefreshToken();
    if (refreshToken) {
      dispatch({ type: ACTIONS.SET_REFRESHING });
      return startWithRefreshToken(refreshToken);
    } else {
      logout_internal('refresh else');
    }
  };

  /**
  * A Token has an expiration time
  * When we get close to the expiration time we will check if the user is active
  * If they are not active we will log them out
  * If they are active we will refresh the token
  * @function
  * @async
  */
  const checkIfStale = async (override_check) => {
    if (authState.staleCheckState === STALE_CHECK_STATES.STALE_CHECK_REQUESTED || override_check) {
      dispatch({ type: ACTIONS.SET_STALE_CHECK_STATE, staleCheckState: STALE_CHECK_STATES.STALE_CHECK_IN_PROGRESS });
      const timeToExpired = getTimeToExpired();

      // If the token expires in the next 5 minutes we will check if the user is active
      let isStale = timeToExpired < timeToStale;
      let userActive = authState.lastRequestTime && ((Date.now() - authState.lastRequestTime) / 1000 < timeToSessionIdle);

      if (isStale) {
        if (!userActive) {
          logout_internal_soft();
        } else {
          const refreshToken = authState.refreshToken || await store.current.getRefreshToken();
          if (refreshToken) {
            return startWithRefreshToken(refreshToken);
          } else if (authState.bootToken) {
            return startWithBootToken(authState.bootToken);
          } else {
            logout_internal_soft();
          }
        }
      } else {
        scheduleStaleCheck(_staleCheckSeconds);
        return;
      }
    }
  };

  /**
   * Method to decode a JWT token and determine the expiration time
   * @function
   * @returns {integer} the time in seconds until the token expires
   */
  const getTimeToExpired = () => {
    if (!authState.access_token) {
      return 0;
    }
    let decodedToken = null;
    if (typeof authState.access_token === 'string') {
      decodedToken = decodeTokenToJWT(authState.access_token);
    }
    else {
      decodedToken = authState.access_token;
    }
    let expiresAt = decodedToken.exp;
    let currentTime = Math.floor(Date.now() / 1000);
    return expiresAt - currentTime;
  };

  /**
   * This function will schedule a stale check in the future
   * @param {integer} timeInSeconds the time in seconds to wait before triggering another stale check
   * @function
   */
  const scheduleStaleCheck = (timeInSeconds) => {
    if (staleCheckTimeoutTracker !== -1) {
      clearTimeout(staleCheckTimeoutTracker);
      staleCheckTimeoutTracker = -1;
    }
    staleCheckTimeoutTracker = setTimeout(() => {
      dispatch({ type: ACTIONS.SET_STALE_CHECK_STATE, staleCheckState: STALE_CHECK_STATES.STALE_CHECK_REQUESTED });
    }, timeInSeconds * 1000);
  };

  /**
   * Parse the tokens from the url and dispatch the appropriate actions
   * @param {Array} tokenData the token data from the url
   * @param {object} maybeUser the user object from the url
   * @function
   * @returns {object}
   */
  const parseTokenAndUpdateState = async (tokenData) => {
    // Check to see if we have a token
    // If it is null or empty we will logout
    if (!tokenData || tokenData.length === 0) {
      logout_internal('parseTokenAndUpdateState no tokenData');

      return;
    }

    // Pull the info out of the token
    //const { token, isExpired, user, refresh_token } = parseTokens(tokenData);
    const { id_token, access_token, bearer_token, refresh_token, valid } = parseCombinedToken(tokenData);

    if (!valid) {
      console.error('Invalid combined token');
      logout_internal('parseTokenAndUpdateState invalid combined token');
      return;
    }

    //const user = decodeTokenToJWT(id_token);

    //window.isExpired = isExpired;

    //Immediatly check if the token is stale
    scheduleStaleCheck(0.25);

    // If the result doesnt contain the access control list set it to an empty list
    //if (!user.acl) user.acl = [];

    // This may be a hack but if we have logged in we need to be sure the use can see the user menu
    //user.acl.push('Can Sign In');

    // Set the isSignedIn on the user object to true
    // TODO: This may be redundant to isAuthenticated
    //user.isSignedIn = true;



    dispatch({
      type: ACTIONS.SET_TOKEN_INFO,
      access_token: access_token,
      id_token: id_token,
      refresh_token: refresh_token || store.current.getRefreshToken(),
      bearer_token: bearer_token,
    });

    dispatch({
      type: ACTIONS.SET_STALE_CHECK_STATE,
      staleCheckState: STALE_CHECK_STATES.NEW_SESSION,
    });

    // Now we need to get the permissions for the user
    // if (!maybeUser || !maybeUser?.permissions) {
    //   getPermissions(bearerToken); // The parameter is a hack because our state isnt updated yet. Tomorrow me problem.
    // }

    /**
      * This is a bear to remind us to set the bearer token in subsiquent api calls that need to be authenticated
      https://en.wikipedia.org/wiki/Joan_Stark

      _,-""`""-~`)
      (`~_,=========\
      |---,___.-.__,\
      |        o     \ ___  _,,,,_     _.--.
      \      `^`    /`_.-"~      `~-;`     \
      \_      _  .'                 `,     |
       |`-                           \'__/
      /                      ,_       \  `'-.
      /    .-""~~--.            `"-,   ;_    /
      |              \               \  | `""`
      \__.--'`"-.   /_               |'
                `"`  `~~~---..,     |
      jgs                         \ _.-'`-.
                                \       \
                                 '.     /
                                   `"~"`
    */

    store.current.putCombinedToken(tokenData);
    store.current.putAccessToken(access_token);
    store.current.putIdToken(id_token);
    if(refresh_token) store.current.putRefreshToken(refresh_token);
  };

  /**
   * Called to reset the state of the auth object
   * @function
   * @async
   */
  const logout_internal = async () => {
    // Dispatch the begin logout action
    dispatch({ type: ACTIONS.BEGIN_LOGOUT });
    // Reset our session
    //clearRefreshTokenInSession();
    // Clear the cookie
    //await clearSubjectCookie();
    store.current.clear();

    // Dispatch the finish logout action
    dispatch({ type: ACTIONS.FINISH_LOGOUT });
  };

  /**
   * Dispatch the token stale action
   * @function
   * @async
   */
  const logout_internal_soft = async () => {
    // Dispatch the begin logout action
    dispatch({ type: ACTIONS.TOKEN_STALE });
  };

  /**
   * Attempt to refresh the token
   * @async
   * @function
   * @param {*} refreshToken the token used to call the refresh endpoint
   */
  const startWithRefreshToken = async (refreshToken) => {
    const apiSlug = config.apiSlug || 'api';
    const url = config?.redirects?.refresh || `${config.apiRoot || window.location.origin}/${apiSlug}/oauth/refresh`;

    try {
      let typeOfRefreshToken = typeof refreshToken;
      if (typeOfRefreshToken !== 'string') {
        refreshToken = "" + refreshToken;
        // REFRESH TOKENES MUST BE STRINGS
      }
      // I swear to god axios if you ignore the content type one more time
      let res = await axios.post(url, refreshToken, { headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'content-type': 'application/x-www-form-urlencoded' } })
      parseTokenAndUpdateState(res.data.token, res.data.user);
      // if (config.useSession) setBootTokenInSession(res.data.token);
      // else setBootTokenInLocalStorage(res.data.token);
    } catch (ex) {
      debugger
      console.error(`Failed to refresh token: ${ex}`);
      logout_internal('startwithrefreshtoken failed refresh catch');
    }
  };

  /**
   * This is called if we discovered a boot token in the session
   * This can happen when we authenticate without opening a new tab
   * The oAuth helper will set the boot token in the session and then return to the current page
   * @async
   * @function
   * @param {String} bootToken the token used to start the oAuth flow
   * @param {Object|null} maybeBootUser the user object stored in the session to start the oAuth flow
   */
  const startWithBootToken = async (bootToken, maybeBootUser) => {
    // The boot token is our oAuth token
    // It should be parsed as such

    // Dispatch a begin login action
    dispatch({ type: ACTIONS.BEGIN_LOGIN });

    parseTokenAndUpdateState(bootToken, maybeBootUser);
  };

  /**
   * This function handles messages posted to the window
   * We expect the message to come from the same origin
   * We then make sure that the event type is 'oauth-token'
   * @param {*} event the event that was posted to the window from the oAuth tab
   * @function
   * deprecated
   */
  const handleMessage = (event) => {
    if (event.origin !== window.location.origin) {
      return;
    }

    if (event.data.type === 'oauth-token') {
      // Parse the tokens from the message and store them in the state
      parseTokenAndUpdateState(event.data.token);
    }
  };

  /**
   * This function will call to the permissions endpoint to get the permissions for the user
   * @param {String} bearerToken the bearer token to use for the call
   * @async
   * @function
   */
  const getPermissions = async (bearerToken) => {
    // We will; call to the /api/user/echo with our bearer token in order to get a response of the current ACLs
    let url = config?.endpoints?.permissions || `/api/user/permissions`;
    bearerToken = bearerToken || authState.bearerToken;
    let response = await fetch(url, {
      method: 'GET',
      redirect: 'manual',
      cors: 'no-cors',
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });

    if (response.status === 200) {
      let permissions = await response.json();
      permissions.push(ACLS.SIGN_IN); // This may be a hack
      dispatch({ type: ACTIONS.SET_PERMISSIONS, acl: permissions });
    } else {
      console.error(`Failed to get permissions: ${response.status}`);
    }
  };

  /**
   * Just return the bearer token
   * @function
   * @returns {String} the bearer token
   */
  const getBearerToken = () => {
    return authState.bearerToken;
  };

  // If we are in the development environment expose the getBearerToken method
  // This is used to get the bearer token for the API calls
  if (process.env.NODE_ENV === 'development') {
    window.getBearerToken = getBearerToken;
  }

  return {
    login,
    logout,
    refresh,
    getPermissions,
    getBearerToken,
    authState,
  };
};


let activeBearerToken = null;

/**
 * Get the active bearer token
 * @function
 * @returns {String} the active bearer token
 */
const getActiveBearerToken = () => {
  return activeBearerToken;
};

const userFromIdToken = (id_token) => {
  let decoded = null;
  if (typeof id_token === 'string') {
    decoded = decodeTokenToJWT(id_token);
  }
  else {
    decoded = id_token;
  }

  const user = {
    id: decoded.sub,
    name: decoded.name,
    email: decoded.email,
    isSignedIn: true,
    isAuthenticated: true,
    acl: decoded.permissions,
  };

  return user;
};

/**
 * set the active bearer token
 * @function
 * @param {string} bearerToken
 */
const setActiveBearerToken = (bearerToken) => {
  activeBearerToken = bearerToken;
};

/**
 * Reducer hook method for the auth state
 * @function
 * @param {*} nextState
 * @param {*} action
 * @returns {object}
 */
const authReducer = (nextState, action) => {
  switch (action.type) {
    // Maintain the rest of the current state, only update the refresh token
    case ACTIONS.SET_CONFIG: {
      let anonUser = action.config?.anonUser;
      if (anonUser) {
        // Migrate from the backend model to the frontend model
        anonUser = {
          id: anonUser.id,
          name: anonUser.name,
          email: anonUser.email,
          isSignedIn: false,
          isAuthenticated: false,
          acl: anonUser.acl || anonUser.permissions,
        };
      }
      else if (action.config?.authorization?.defaultPermissions) {
        anonUser = {
          id: 'anonymous',
          name: 'Anonymous',
          email: 'anonymous',
          isSignedIn: false,
          isAuthenticated: false,
          acl: action.config?.authorization?.defaultPermissions,
        };
      }

      return {
        ...nextState,
        loggedOutuser: anonUser,
        config: action.config,
        state: AUTH_STATES.LOGGED_OUT,
        user: anonUser || loggedOutUser,
      };
    }
    case ACTIONS.BEGIN_LOGIN:
      return {
        ...nextState,
        user: null,
        state: AUTH_STATES.LOGGING_IN,
      };
    case ACTIONS.SET_TOKEN_INFO:

      // We've moved setting the "LOGGED_IN" state to the ACTIONS.SET_PERMISSIONS login action
      setActiveBearerToken(action.bearer_token || action.access_token);

      return {
        ...nextState,
        id_token: action.id_token,
        access_token: action.access_token,
        user: userFromIdToken(action.id_token),
        bearerToken: action.bearer_token,
        refreshToken: action.refresh_token,
        state: AUTH_STATES.LOGGED_IN,
      };
    case ACTIONS.TOKEN_STALE: {
      // We need to put a flag in the session to indicate that the token is stale and needs to be refreshed when the user performs an action
      return {
        ...nextState,
        state: AUTH_STATES.TOKEN_STALE,
      };
    }
    case ACTIONS.SET_REFRESHING: {
      return {
        ...nextState,
        state: AUTH_STATES.REFRESHING_TOKEN,
      };
    }
    case ACTIONS.SET_STALE_CHECK_STATE: {
      return {
        ...nextState,
        staleCheckState: action.staleCheckState,
      };
    }
    case ACTIONS.SET_LAST_REQUEST_TIME: {
      return {
        ...nextState,
        lastRequestTime: action.time,
      };
    }
    case ACTIONS.BEGIN_LOGOUT:
      return {
        ...nextState,
        state: AUTH_STATES.LOGGING_OUT,
      };
    case ACTIONS.FINISH_LOGOUT:
      return {
        ...nextState,
        user: nextState.loggedOutuser || {
          ...loggedOutUser,
          acl: nextState.defaultACL,
        },
        bearerToken: null,
        refreshToken: null,
        state: AUTH_STATES.LOGGED_OUT,
      };
    case ACTIONS.SET_PERMISSIONS:
      return {
        ...nextState,
        state: AUTH_STATES.LOGGED_IN,
        user: nextState.user?.isSignedIn
          ? { ...nextState.user, acl: action.acl }
          : nextState.user,
      };
    case ACTIONS.SET_ERROR:
      return {
        error: action.error,
        state: AUTH_STATES.ERROR,
      };
    case ACTIONS.SET_GLOBAL_STATE:
      return {
        ...nextState,
        globalState: action.globalState,
      };
    case ACTIONS.SET_CONFIG_STATE:
      console.debug("Setting config state", action.configState)
      return {
        ...nextState,
        configState: action.configState,
      };
    default:
      console.error(`Unknown action type: ${action.type}`);
      return nextState;
  }
};