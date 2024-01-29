// The storage modes
// This is how we will store the id, access, and refresh tokens
export const STORAGE_MODES = {
  SESSION: 'session',
  LOCAL: 'local',
  COOKIE: 'cookie',
  NONE: 'none',
};

// The authorization mode
// This is what we use to determine if the user has access to a resource
// If the user has the permission in their acl, they have access
export const AUTHORIZATION_MODES = {
  ACCESS_CONTROL_LIST: 'acl',
  ID_TOKEN_CLAIM: 'id_token_claim',
  ACCESS_TOKEN_CLAIM: 'access_token_claim',
  NONE: 'none',
}

/**
 * This type defines the configuration for the authentication
  * @typedef {Object} Configuration
  * @property {AuthenticationConfiguration} authentication
  * @property {StorageConfiguration} storage
  * @property {AuthorizationConfiguration} authorization
 */

/**
 * This type defines the configuration for the authentication
 * The configuration can either be 
 * @typedef {Object} AuthenticationConfiguration
 * @property {OAuthConfiguration} oAuth
 * 
 */
/**
 * This type defines the configuration for the oAuth authentication
 * @typedef {Object} OAuthConfiguration extends AuthenticationConfiguration
 * @property {string} clientId
 * @property {string} redirectUri
 * @property {string[]} scopes
 * @property {string} host
 * @property {OAuthEndpoints} endpoints
 */

/**
 * This type defines the configuration for the oAuth endpoints
 * @typedef {Object} OAuthEndpoints
 * @property {string} refresh
 * @property {string} logout
 * 
 */

/**
 * This type defines the configuration for the storage
 * @typedef {Object} StorageConfiguration
 * @property {string} mode
 * 
 */

/**
 * This type defines the configuration for the authorization
 * @typedef {Object} AuthorizationConfiguration
 * @property {string} mode - The authorization mode
 * @property {string} tokenClaimName - The name of the claim to use for authorization. Used for id_token_claim and access_token_claim authorization modes
 * @property {string} aclEndpoint - The endpoints to use for acl authorization
 * 
 */

/**
 * This function validates the oAuth configuration, throwing an error if it is invalid
 * @param {OAuthConfiguration} oAuth The oAuth configuration to validate
 * @throws Error
 */
const validateOAuthConfiguration = (oAuth) => {
  // The oAuth configuration must be an object
  if (typeof oAuth !== 'object') {
    throw new Error('The oAuth configuration must be an object');
  }

  // The clientId must be a string
  if (typeof oAuth.clientId !== 'string') {
    throw new Error('The oAuth clientId must be a string');
  }

  // The redirectUri must be a string
  if (typeof oAuth.redirectUri !== 'string') {
    throw new Error('The oAuth redirectUri must be a string');
  }

  // The scopes must be an array
  if (!Array.isArray(oAuth.scopes)) {
    throw new Error('The oAuth scopes must be an array');
  }

  // The host must be a string
  if (typeof oAuth.host !== 'string') {
    throw new Error('The oAuth host must be a string');
  }

  // The endpoints must be an object
  if (typeof oAuth.endpoints !== 'object') {
    throw new Error('The oAuth endpoints must be an object');
  }

  // The refresh endpoint must be a string
  if (typeof oAuth.endpoints.refresh !== 'string') {
    throw new Error('The oAuth refresh endpoint must be a string');
  }

  // The logout endpoint must be a string
  if (typeof oAuth.endpoints.logout !== 'string') {
    throw new Error('The oAuth logout endpoint must be a string');
  }
}

/**
 * This function validates the storage configuration, throwing an error if it is invalid
 * @param {StorageConfiguration} storage The storage configuration to validate
 * @throws Error
 */
const validateConfigurationStorage = (storage) => {

  // The storage mode must be a string
  if (typeof storage.mode !== 'string') {
    throw new Error('The storage mode must be a string');
  }

  // The storage mode must be one of the storage modes
  if (!Object.values(STORAGE_MODES).includes(storage.mode)) {
    throw new Error(`The storage mode must be one of the following: ${Object.values(STORAGE_MODES).join(', ')}`);
  }

  // If the startup source key is set, it must be a string
  if (storage.startupSourceKey && typeof storage.startupSourceKey !== 'string') {
    throw new Error('The storage startup source key must be a string');
  }
}

/**
 * This function validates the authorization configuration, throwing an error if it is invalid
 * @param {AuthorizationConfiguration} authorization  The authorization configuration to validate
 * @throws Error
 */
const validateConfigurationAuthorization = (authorization) => {
  // The authorization mode must be a string
  if (typeof authorization.mode !== 'string') {
    throw new Error('The authorization mode must be a string');
  }

  // The authorization mode must be one of the authorization modes
  if (!Object.values(AUTHORIZATION_MODES).includes(authorization.mode)) {
    throw new Error(`The authorization mode must be one of the following: ${Object.values(AUTHORIZATION_MODES).join(', ')}`);
  }
}

/**
 * This function validates the configuration, throwing an error if it is invalid
 * @param {Configuration} configuration The configuration to validate
 * @throws Error
 */
const validateConfiguration = (configuration) => {
  // Configurations must be an object
  if (typeof configuration !== 'object') {
    throw new Error('The configuration must be an object');
  }

  // The authentication configuration must be an object
  if (typeof configuration.authentication !== 'object') {
    throw new Error('The authentication configuration must be an object');
  }

  if (configuration.authentication.oAuth) {
    validateOAuthConfiguration(configuration.authentication.oAuth);
  }

  // The storage configuration must be an object
  if (typeof configuration.storage !== 'object') {
    throw new Error('The storage configuration must be an object');
  }

  validateConfigurationStorage(configuration.storage);

  // The authorization configuration must be an object
  if (typeof configuration.authorization !== 'object') {
    throw new Error('The authorization configuration must be an object');
  }

  validateConfigurationAuthorization(configuration.authorization);
}

/**
 * This function returns an empty configuration
 * @returns {Configuration}
 */
const getEmptyConfiguration = () => {
  return {
    authentication: {
      oAuth: {},
    },
    storage: {
      mode: STORAGE_MODES.NONE,
    },
    authorization: {
      mode: AUTHORIZATION_MODES.NONE,
    },
  }
}

/**
 * This type defines the configuration builder
 * @typedef {Object} ConfigurationBuilder
 * 
 * @property {function} withAuthentication
 * 
 * @property {function} withOAuth
 * @property {function} withOAuthClientId
 * @property {function} withOAuthRedirectUri
 * @property {function} withOAuthScopes
 * @property {function} withOAuthHost
 * @property {function} withOAuthRefreshEndpoint
 * @property {function} withOAuthLogoutEndpoint
 * 
 * @property {function} withStorage
 * @property {function} withSessionStorage
 * @property {function} withLocalStorage
 * @property {function} withCookieStorage
 * @property {function} withStartupSourceKey
 * 
 * 
 * @property {function} withAuthorization
 * @property {function} withAuthorizationMode
 * @property {function} withNoAuthorization
 * @property {function} withAccessControlListAuthorization
 * @property {function} withIdTokenClaimAuthorization
 * @property {function} withAccessTokenClaimAuthorization
 * 
 * @property {function} withRawConfiguration
 * @property {function} withDefaultPermissions
 * @property {function} withAppAuthorization
 * @property {function} build
 * 
 */


/**
 * This function creates a builder function for the configuration
 * It will have methods for each configuration option
 * @returns {ConfigurationBuilder}
 */
export const getConfigBuilder = () => {
  // A config builder has various methods for building the configuration
  // Lastly it has a build method that returns the configuration as an object
  let configuration = getEmptyConfiguration();

  const builder = () => {
    return {

      /**
       * 
       * @param {AuthenticationConfiguration} authenticationConfiguration 
       * @returns {ConfigurationBuilder}
       */
      withAuthentication: (authenticationConfiguration) => {
        configuration.authentication = authenticationConfiguration;
        return builder();
      },

      /**
       * 
       * @param {OAuthConfiguration} oAuthConfiguration 
       * @returns {ConfigurationBuilder}
       */
      withOAuth: (oAuthConfiguration) => {
        oAuthConfiguration = oAuthConfiguration || {
          endpoints: {},
        };
        configuration.authentication.oAuth = oAuthConfiguration;
        return builder();
      },

      /**
       * @param {string} clientId 
       * @returns {ConfigurationBuilder}
       */
      withOAuthClientId: (clientId) => {
        configuration.authentication.oAuth.clientId = clientId;
        return builder();
      },

      /**
       * @param {string} redirectUri
       * @returns {ConfigurationBuilder}
       */
      withOAuthRedirectUri: (redirectUri) => {
        configuration.authentication.oAuth.redirectUri = redirectUri;
        return builder();
      },

      /**
       * @param {string[]} scopes
       * @returns {ConfigurationBuilder}
       */
      withOAuthScopes: (scopes) => {
        configuration.authentication.oAuth.scopes = scopes;
        return builder();
      },

      /**
       * @param {string} host
       * @returns {ConfigurationBuilder}
       */
      withOAuthHost: (host) => {
        configuration.authentication.oAuth.host = host;
        return builder();
      },

      /**
       * @param {string} refreshEndpoint
       * @returns {ConfigurationBuilder}
       */
      withOAuthRefreshEndpoint: (refreshEndpoint) => {
        if(!configuration.authentication.oAuth.endpoints) configuration.authentication.oAuth.endpoints = {};
        configuration.authentication.oAuth.endpoints.refresh = refreshEndpoint;
        return builder();
      },

      /**
       * @param {string} logoutEndpoint
       * @returns {ConfigurationBuilder}
       */
      withOAuthLogoutEndpoint: (logoutEndpoint) => {
        if(!configuration.authentication.oAuth.endpoints) configuration.authentication.oAuth.endpoints = {};
        configuration.authentication.oAuth.endpoints.logout = logoutEndpoint;
        return builder();
      },

      /**
       * @param {StorageConfiguration} storageConfiguration
       * @returns {ConfigurationBuilder}
       */
      withStorage: (storageConfiguration) => {
        configuration.storage = storageConfiguration;
        return builder();
      },

      /**
       * @returns {ConfigurationBuilder}
       */
      withSessionStorage: () => {
        configuration.storage = {
          mode: STORAGE_MODES.SESSION,
        }
        return builder();
      },

      /**
       * @returns {ConfigurationBuilder}
       */
      withLocalStorage: () => {
        configuration.storage = {
          mode: STORAGE_MODES.LOCAL,
        }
        return builder();
      },

      /**
       * @returns {ConfigurationBuilder}
       */
      withCookieStorage: () => {
        configuration.storage = {
          mode: STORAGE_MODES.COOKIE,
        }
        return builder();
      },

      /**
       * @param {string} startupSourceKey
       * @returns {ConfigurationBuilder}
       */
      withStartupSourceKey: (startupSourceKey) => {
        configuration.storage.startupSourceKey = startupSourceKey;
        return builder();
      },

      /**
       * @param {AuthorizationConfiguration} authorizationConfiguration
       * @returns {ConfigurationBuilder}
       * @deprecated Use withNoAuthorization, withAccessControlListAuthorization, withIdTokenClaimAuthorization, or withAccessTokenClaimAuthorization
       */
      withAuthorization: (authorizationConfiguration) => {
        configuration.authorization = authorizationConfiguration || {
          endpoints: {},
        };
        return builder();
      },

      /**
       * @param {string} authorizationMode
       * @returns {ConfigurationBuilder}
       * @deprecated Use withNoAuthorization, withAccessControlListAuthorization, withIdTokenClaimAuthorization, or withAccessTokenClaimAuthorization
       */
      withAuthorizationMode: (authorizationMode) => {
        configuration.authorization.mode = authorizationMode;
        return builder();
      },

      withNoAuthorization: () => {
        configuration.authorization.mode = AUTHORIZATION_MODES.NONE;
        return builder();
      },

      /**
       * Authorize using an access control list
       * @param {string} endpoint The endpoint to use for the acl (optional)
       * @returns {ConfigurationBuilder}
       */
      withAccessControlListAuthorization: (endpoint) => {
        configuration.authorization.mode = AUTHORIZATION_MODES.ACCESS_CONTROL_LIST;
        configuration.authorization.aclEndpoint = endpoint;
        return builder();
      },

      /**
       * Authorize using an id token claim
       * @param {string} tokenClaimName The name of the claim to use for authorization
       * @returns {ConfigurationBuilder}
       */
      withIdTokenClaimAuthorization: (tokenClaimName) => {
        configuration.authorization.mode = AUTHORIZATION_MODES.ID_TOKEN_CLAIM;
        configuration.authorization.tokenClaimName = tokenClaimName;
        return builder();
      },

      /**
       * Authorize using an access token claim
       * @param {string} tokenClaimName The name of the claim to use for authorization
       * @returns {ConfigurationBuilder}
       */
      withAccessTokenClaimAuthorization: (tokenClaimName) => {
        configuration.authorization.mode = AUTHORIZATION_MODES.ACCESS_TOKEN_CLAIM;
        configuration.authorization.tokenClaimName = tokenClaimName;        
        return builder();
      },

      /**
       * @param {Configuration} rawConfiguration
       * @returns {ConfigurationBuilder}
       */
      withRawConfiguration: (rawConfiguration) => {
        configuration = rawConfiguration;
        return builder();
      },

      /**
       * Alias for withRawConfiguration
       */
      fromConfiguration: (rawConfiguration) => {
        return withRawConfiguration(rawConfiguration);
      },

      /**
       * @param {string[]} defaultPermissions
       * @returns {ConfigurationBuilder}
       */
      withDefaultPermissions: (defaultPermissions) => {
        configuration.authorization.defaultPermissions = defaultPermissions;
        return builder();
      },

      /**
       * @param {string} application application name for dealing with authorization. Primarily used for storage
       * @returns {ConfigurationBuiler}
       */
      withAppAuthorization: (application) => {
        console.log("Using expirimintal feature: withAppAuthorization", application)
        configuration.authorization.application = application;
        return builder();
      },
      
      /**
       * @returns {Configuration}
       * @throws Error
       */
      build: () => {
        validateConfiguration(configuration);
        return configuration;
      }
    }
  }

  return builder();

}


