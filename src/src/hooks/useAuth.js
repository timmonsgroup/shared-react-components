import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  createContext,
  useReducer,
} from 'react';
import { ACLS, AUTH_STATES } from '../constants';
import PropTypes from 'prop-types';
import { parseTokens, decodeTokenToJWT } from '../helpers/JWTUtil';
import axios from 'axios';

const openWindow = false;
let staleCheckTimeoutTracker = -1;

const timeToSessionIdle = 5 * 60; // The time in which a session is considered 'idle' and should not auto refresh the token
const timeToStale = 5 * 60; // The time from the token expiration when we should refresh the token if the user is not idle
/*
  TODO: More documentation!
*/

// This constant is a template for a logged out user
// It gets used when a user is not logged in or when the logged in user selects to logout
// Note there are no permissions set for this user
// The default permissions come from the api as they will differ depending on the environment/tenant
const loggedOutUser = {
  name: 'Anonymous',
  isSignedIn: false,
};

// Define the actions that can be dispatched
// These represent the different state changes that the auth state can be in
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
};

const STALE_CHECK_STATES = {
  NEW_SESSION: 'NEW_SESSION',
  STALE_CHECK_REQUESTED: 'STALE_CHECK_REQUESTED',
  STALE_CHECK_COMPLETE: 'STALE_CHECK_COMPLETE',
  STALE_CHECK_IN_PROGRESS: 'STALE_CHECK_IN_PROGRESS',
}

// Valid states that allow logins to occur
// If the auth state is not in this list, we will not allow logins
// This will, for example, not allow someone to attempt to log in while already logged in
const VALID_LOGIN_STATES = [AUTH_STATES.INITIALIZING, AUTH_STATES.LOGGED_OUT, AUTH_STATES.TOKEN_STALE];

// Initialize the auth state
const initialState = {
  state: AUTH_STATES.INITIALIZING,
  refreshToken: null,
  bearerToken: null,
  user: {
    authenticated: false,
    name: '',
    id: '',
    raw: {},
  },
};

export const authContext = createContext();


// Wrap the hook with a provider
export const ProvideAuth = ({ config, children }) => {
  const auth = useProvideAuth(config);
  // We are providing the object returned by useProvideAuth as the value of the authContext
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

ProvideAuth.propTypes = {
  config: PropTypes.object.isRequired,
  children: PropTypes.element,
};

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  // The context object will contain anything returned by useProvideAuth
  const context = useContext(authContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a ProvideAuth');
  }
  return context;
};

// These are the properties and methods that the "useAuth" hook provides to its consumers
// We are providing the auth state, login, and logout methods
const useProvideAuth = (props) => {
  const [config] = useState(props);
  // We are using the useReducer hook to manage the auth state
  // authState should be exposed to the consumer as part of this hook
  const [authState, dispatch] = useReducer(authReducer, initialState);
  const intercept = useRef();
  const [initInfo, setInitInfo] = useState(null);


  useEffect(() => {
    if (!initInfo) {
      return;
    }
    // Check to see if the config is valid
    if (isValidConfig(config)) {
      // Push the config into the state, we probably dont need the full config but it contains the anonymous user info at a minimum
      dispatch({ type: ACTIONS.SET_CONFIG, config });

      // If we have a boot token we will use it to login
      if (initInfo.bootToken) {
        dispatch({ type: ACTIONS.BEGIN_LOGIN });
        startWithBootToken(initInfo.bootToken, initInfo.bootUser);
      }
      // If we have a refresh token we will use it to get a new id and access token
      else if (initInfo.refreshToken) {

        dispatch({ type: ACTIONS.BEGIN_LOGIN });

        startWithRefreshToken(initInfo.refreshToken);
      }
      // The user is not logged in
      else {
        if (config.autoLogin) {
          login();
        }
        else {
          dispatch({ type: ACTIONS.FINISH_LOGOUT });
        }
      }
    } else {
      // If the config is not valid, we will set the state to be error
      console.error('useProvideAuth: config is invalid');
      dispatch({ type: ACTIONS.SET_ERROR, errorMessage: 'Invalid config' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initInfo]);

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

    async function boop() {
      // get out initialization info from the session storage
      let initInfo = {
        refreshToken: await getRefreshTokenFromSession(),
        bootToken: getBootTokenFromSession(),
        bootUser: getBootUserFromSession(),
      };
      setInitInfo(initInfo);


    }
    boop();


    return () => {
      if (intercept.current) {
        axios.interceptors.request.eject(intercept.current);
      }
      window.removeEventListener('message', handleMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    checkIfStale();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState.staleCheckState]);




  /**
   * This function is called to start the login process
   * It will open the login endpoint in a new tab
   * Should be exposed to the consumer as part of this hook
   * @param {*} state The state to login with, this will be returned with a valid login
   */
  const login = async (state) => {
    // Check to see if the auth state is valid for a login
    // If not we will return false
    if (!VALID_LOGIN_STATES.includes(authState.state)) {
      console.error(authState, 'is not a valid login state');
      return false;
    }

    // Dispatch the begin login action
    dispatch({ type: ACTIONS.BEGIN_LOGIN });

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
    let redirect = `${window.location.origin}/api/oauth/callback`;
    let fetchUrl = `https://${config.host}/oauth2/authorize?response_type=code&client_id=${config.clientId}&redirect_uri=${redirect}`;

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
   */
  const logout = async () => {
    dispatch({ type: ACTIONS.BEGIN_LOGOUT });
    logout_internal();

    // Calculate our redirect url based off of the origin of the current page and the logout endpoint in our api
    const redirect = window.location.origin + '/api/oauth/logout';

    // Open the logout endpoint in a new tab
    const fetchUrl = config?.useAzureAD ?
      `https://${config.host}/oauth2/logout?post_logout_redirect_uri=${redirect}` :
      `https://${config.host}/logout?client_id=${config.clientId}&logout_uri=${redirect}`;

    // If openWindow is true open the logout endpoint in a new tab
    // Otherwise open the logout endpoint in the current tab
    if (openWindow) window.open(fetchUrl, '_blank');
    else window.location.href = fetchUrl;
  };

  const refresh = async () => {

    const refreshToken = authState.refreshToken || await getRefreshTokenFromSession();
    if (refreshToken) {
      dispatch({ type: ACTIONS.SET_REFRESHING });
      return startWithRefreshToken(refreshToken);
    } else {
      logout_internal();
    }
  }

  /*
  * A Token has an expiration time
  * When we get close to the expiration time we will check if the user is active
  * If they are not active we will log them out
  * If they are active we will refresh the token
  */
  const checkIfStale = async () => {
    if (authState.staleCheckState === STALE_CHECK_STATES.STALE_CHECK_REQUESTED) {
      dispatch({ type: ACTIONS.SET_STALE_CHECK_STATE, staleCheckState: STALE_CHECK_STATES.STALE_CHECK_IN_PROGRESS });
      const timeToExpired = getTimeToExpired();

      // If the token expires in the next 5 minutes we will check if the user is active
      let isStale = timeToExpired < timeToStale;
      let userActive = authState.lastRequestTime && ((Date.now() - authState.lastRequestTime) / 1000 < timeToSessionIdle);

      if (isStale) {
        if (!userActive) {
          logout_internal_soft();
        } else {
          const refreshToken = authState.refreshToken || await getRefreshTokenFromSession();
          if (refreshToken) {
            return startWithRefreshToken(refreshToken);
          } else if (authState.bootToken) {
            return startWithBootToken(authState.bootToken);
          } else {
            logout_internal_soft();
          }
        }
      } else {
        scheduleStaleCheck(60);
        return;
      }

    }
  };

  const getTimeToExpired = () => {
    let decodedToken = decodeTokenToJWT(authState.bearerToken);
    let expiresAt = decodedToken.exp;
    let currentTime = Math.floor(Date.now() / 1000);
    return expiresAt - currentTime;
  }

  /**
   * This function will schedule a stale check in the future
   * @param {integer} timeInSeconds the time in seconds to wait before triggering another stale check
   */
  const scheduleStaleCheck = (timeInSeconds) => {
    if (staleCheckTimeoutTracker !== -1) {
      clearTimeout(staleCheckTimeoutTracker);
      staleCheckTimeoutTracker = -1;
    }
    staleCheckTimeoutTracker = setTimeout(() => {
      dispatch({ type: ACTIONS.SET_STALE_CHECK_STATE, staleCheckState: STALE_CHECK_STATES.STALE_CHECK_REQUESTED });
    }, timeInSeconds * 1000);
  }

  /**
   * Parse the tokens from the url and dispatch the appropriate actions
   * @param {*} tokenData
   * @returns
   */
  const parseTokenAndUpdateState = async (tokenData, maybeUser) => {
    // Check to see if we have a token
    // If it is null or empty we will logout
    if (!tokenData || tokenData.length === 0) {
      logout_internal();
      return;
    }

    // Pull the info out of the token
    const { token, isExpired, user, refresh_token } =
      parseTokens(tokenData);
    const bearerToken = token.access_token;

    window.isExpired = isExpired;

    scheduleStaleCheck(30);


    //TODO: Check if a token is expired

    // If we have a refresh tokem we will set it in the session so it can be used when the page is refreshed
    if (refresh_token) {
      setRefreshTokenInSession(refresh_token);
    }
    // If the result doesnt contain the access control list set it to an empty list
    if (!user.acl) user.acl = [];

    // This may be a hack but if we have logged in we need to be sure the use can see the user menu
    user.acl.push('Can Sign In');

    // Set the isSignedIn on the user object to true
    // TODO: This may be redundant to isAuthenticated
    user.isSignedIn = true;

    // Dispatch the finish login action

    dispatch({
      type: ACTIONS.SET_TOKEN_INFO,
      user,
      bearerToken,
      refreshToken: refresh_token || await getRefreshTokenFromSession(),
      permissions: maybeUser?.permissions
    });

    dispatch({
      type: ACTIONS.SET_STALE_CHECK_STATE,
      staleCheckState: STALE_CHECK_STATES.NEW_SESSION,
    })

    // Now we need to get the permissions for the user
    if (!maybeUser || !maybeUser?.permissions) {
      getPermissions(bearerToken); // The parameter is a hack because our state isnt updated yet. Tomorrow me problem.
    }

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
  };

  /**
   * Called to reset the state of the auth object
   */
  const logout_internal = async () => {
    // Dispatch the begin logout action
    dispatch({ type: ACTIONS.BEGIN_LOGOUT });
    // Reset our session
    clearRefreshTokenInSession();
    // Dispatch the finish logout action
    dispatch({ type: ACTIONS.FINISH_LOGOUT });
  };

  const logout_internal_soft = async () => {
    // Dispatch the begin logout action
    dispatch({ type: ACTIONS.TOKEN_STALE });
  }

  /**
   * Attempt to refresh the token
   * @param {*} refreshToken the token used to call the refresh endpoint
   */
  const startWithRefreshToken = async (refreshToken) => {
    const url = `${window.location.origin}/api/oauth/refresh`;

    try {
      axios.post(url, refreshToken, { headers: { 'content-type': 'application/x-www-form-urlencoded' } }).then(res => {
        parseTokenAndUpdateState(res.data.token, res.data.user);
      }
      ).catch(error => {
        if (error.name !== 'CanceledError') {
          console.error('Error fetching data', error);
        }

        logout_internal();
      }).finally(() => {
        // todo: do we need to do anything here?
      });
    } catch (ex) {
      console.error(`Failed to refresh token: ${ex}`);
      logout_internal();
    }
  };

  /* This is called if we discovered a boot token in the session
   * This can happen when we authenticate without opening a new tab
   * The oAuth helper will set the boot token in the session and then return to the current page
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
   */
  const getPermissions = async (bearerToken) => {
    // We will; call to the /api/user/echo with our bearer token in order to get a response of the current ACLs
    let url = `/api/user/permissions`;
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

const getActiveBearerToken = () => {
  return activeBearerToken;
}

const setActiveBearerToken = (bearerToken) => {
  activeBearerToken = bearerToken;
}

/**
 * Reducer hook method for the auth state
 * @param {*} nextState
 * @param {*} action
 * @returns
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
      if (action.permissions) action.user.acl = action.permissions;

      //TODO: This is a weird side effect
      setActiveBearerToken(action.bearerToken);

      if (action.refreshToken)
        setRefreshTokenInSession(action.refreshToken);

      return {
        ...nextState,
        user: action.user,
        bearerToken: action.bearerToken,
        refreshToken: action.refreshToken,
        state: action.permissions ? AUTH_STATES.LOGGED_IN : nextState.state,
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
      }
    }
    case ACTIONS.SET_STALE_CHECK_STATE: {
      return {
        ...nextState,
        staleCheckState: action.staleCheckState,
      }
    }
    case ACTIONS.SET_LAST_REQUEST_TIME: {
      return {
        ...nextState,
        lastRequestTime: action.time,
      }
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
    default:
      console.error(`Unknown action type: ${action.type}`);
      return nextState;
  }
};

/**
 * This function will attempt to get the refresh token from session storage
 * When we authenticate, if we are given a refresh token, we will store it in session storage
 * This way we can use it to get a new access token when the page is reloaded or the user navigates to a new page
 */
const getRefreshTokenFromSession = async () => {
  try {
    let session = window.sessionStorage.getItem('refreshToken') || window.localStorage.getItem('refreshToken');

    if (session) {
      return session;
    }
  } catch (ex) { }
  return null;
};

/**
 * This function will attempt to get the boot token from session storage
 * When we authenticate, if we are given a refresh token, we will store it in session storage
 * This way we can use it to get a new access token when the page is reloaded or the user navigates to a new page
 */
const getBootTokenFromSession = () => {
  try {
    let session = window.sessionStorage.getItem('bootToken');
    if (session) {
      window.sessionStorage.removeItem('bootToken');
      return session;
    }
  } catch (ex) { }
  return null;
};

/**
 * This function will attempt to get the bootUser from session storage
 * When we authenticate, if we are given a refresh token, we will store it in session storage
 * This way we can use it to get a new access token when the page is reloaded or the user navigates to a new page
 */
const getBootUserFromSession = () => {
  try {
    let session = window.sessionStorage.getItem('bootUser');

    try {
      session = JSON.parse(session);
    } catch (ex) { }

    if (session) {
      window.sessionStorage.removeItem('bootUser');
      return session;
    }
  } catch (ex) { }
  return null;
};

const isValidConfig = (config) => {
  let keys = Object.keys(config);

  let hasClientId = keys.includes('clientId');
  let hasRedirectUri = keys.includes('redirectUri');
  let hasScopes = keys.includes('scopes');
  let hasHost = keys.includes('host');

  // TODO: Other checks?

  return hasClientId && hasRedirectUri && hasScopes && hasHost;
};

/**
 * This function will store the refresh token in session storage
 * Later on we can retrieve it and use it to get a new access token
 */
const setRefreshTokenInSession = (refreshToken) => {
  window.localStorage.setItem('refreshToken', refreshToken);
};

/**
 * This function will clear the refresh token from session storage
 */
const clearRefreshTokenInSession = () => {
  window.sessionStorage.removeItem('refreshToken');
  window.localStorage.removeItem('refreshToken');
};
