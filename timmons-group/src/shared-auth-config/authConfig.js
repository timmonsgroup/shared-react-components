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
 * ConfigurationBuilder class for building configuration objects.
 */
export class ConfigurationBuilder {
  constructor() {
    this.configuration = getEmptyConfiguration();
  }

  /**
   * Sets the authentication configuration for the object.
   * @param {AuthenticationConfiguration} authenticationConfiguration - The authentication configuration object.
   * @returns {ConfigurationBuilder} - The ConfigurationBuilder object.
   */
  withAuthentication(authenticationConfiguration) {
    this.configuration.authentication = authenticationConfiguration;
    return this;
  }

  /**
   * Sets the authentication configuration for the object to use JWT authentication.
   * The JWT for authentication must be provided when calling the login method.
   * @returns {ConfigurationBuilder}
   */
  withJWTAuthentication() {
    this.configuration.authentication = {
      mode: 'jwt',
    }
    return this;
  }

  /**
   * 
   * @param {OAuthConfiguration} oAuthConfiguration 
   * @returns {ConfigurationBuilder}
   */
  withOAuth(oAuthConfiguration) {
    oAuthConfiguration = oAuthConfiguration || {
      endpoints: {},
    };
    this.configuration.authentication.mode = 'oauth';
    this.configuration.authentication.oAuth = oAuthConfiguration;
    return this;
  }

  /**
   * @param {string} clientId 
   * @returns {ConfigurationBuilder}
   */
  withOAuthClientId(clientId) {
    this.configuration.authentication.oAuth.clientId = clientId;
    return this;
  }

  /**
   * @param {string} redirectUri
   * @returns {ConfigurationBuilder}
   */
  withOAuthRedirectUri(redirectUri) {
    this.configuration.authentication.oAuth.redirectUri = redirectUri;
    return this;
  }

  /**
   * Set the authorize endpoint for the OAuth configuration
   * @param {string} authorizeEndpoint
   * @returns {ConfigurationBuilder}
   */
  withOAuthAuthorizeEndpoint(authorizeEndpoint) {
    if (!this.configuration.authentication.oAuth.endpoints) this.configuration.authentication.oAuth.endpoints = {};
    this.configuration.authentication.oAuth.endpoints.authorize = authorizeEndpoint;
    return this;
  }

  /**
   * @param {string[]} scopes
   * @returns {ConfigurationBuilder}
   */
  withOAuthScopes(scopes) {
    this.configuration.authentication.oAuth.scopes = scopes;
    return this;
  }

  /**
   * @param {string} host
   * @returns {ConfigurationBuilder}
   */
  withOAuthHost(host) {
    this.configuration.authentication.oAuth.host = host;
    return this;
  }

  /**
   * @param {string} refreshEndpoint
   * @returns {ConfigurationBuilder}
   */
  withOAuthRefreshEndpoint(refreshEndpoint) {
    if (!this.configuration.authentication.oAuth.endpoints) this.configuration.authentication.oAuth.endpoints = {};
    this.configuration.authentication.oAuth.endpoints.refresh = refreshEndpoint;
    return this;
  }

  /**
   * @param {string} logoutEndpoint
   * @returns {ConfigurationBuilder}
   */
  withOAuthLogoutEndpoint(logoutEndpoint) {
    if (!this.configuration.authentication.oAuth.endpoints) this.configuration.authentication.oAuth.endpoints = {};
    this.configuration.authentication.oAuth.endpoints.logout = logoutEndpoint;
    return this;
  }

  /**
   * You must use this if you are authenticating cross origin
   * @param {string[]} messageSources the allowed message sources, e.g. ['https://example.com']
   * @returns {ConfigurationBuilder}
   */
  withAuthenticateInNewTab(messageSources) {
    this.configuration.authentication.authenticateInNewTab = true;
    this.configuration.authentication.messageSources = messageSources;
    return this;
  }

  /**
   * @param {StorageConfiguration} storageConfiguration
   * @returns {ConfigurationBuilder}
   */
  withStorage(storageConfiguration) {
    this.configuration.storage = storageConfiguration;
    return this;
  }
  /**
   * @returns {ConfigurationBuilder}
   */
  withSessionStorage() {
    this.configuration.storage = {
      mode: STORAGE_MODES.SESSION,
    }
    return this;
  }
  /**
   * @returns {ConfigurationBuilder}
   */
  withLocalStorage() {
    this.configuration.storage = {
      mode: STORAGE_MODES.LOCAL,
    }
    return this;
  }
  /**
   * @returns {ConfigurationBuilder}
   */
  withCookieStorage() {
    this.configuration.storage = {
      mode: STORAGE_MODES.COOKIE,
    }
    return this;
  }
  /**
   * @param {string} startupSourceKey
   * @returns {ConfigurationBuilder}
   */
  withStartupSourceKey(startupSourceKey) {
    this.configuration.storage.startupSourceKey = startupSourceKey;
    return this;
  }

  /**
   * @param {AuthorizationConfiguration} authorizationConfiguration
   * @returns {ConfigurationBuilder}
   * @deprecated Use withNoAuthorization, withAccessControlListAuthorization, withIdTokenClaimAuthorization, or withAccessTokenClaimAuthorization
   */
  withAuthorization(authorizationConfiguration) {
    this.configuration.authorization = authorizationConfiguration || {
      endpoints: {},
    };
    return this;
  }

  /**
   * @param {string} authorizationMode
   * @returns {ConfigurationBuilder}
   * @deprecated Use withNoAuthorization, withAccessControlListAuthorization, withIdTokenClaimAuthorization, or withAccessTokenClaimAuthorization
   */
  withAuthorizationMode(authorizationMode) {
    this.configuration.authorization.mode = authorizationMode;
    return this;
  }

  withNoAuthorization() {
    this.configuration.authorization.mode = AUTHORIZATION_MODES.NONE;
  }

  /**
   * Authorize using an access control list
   * @param {string} endpoint The endpoint to use for the acl (optional)
   * @returns {ConfigurationBuilder}
   */
  withAccessControlListAuthorization = (endpoint) => {
    this.configuration.authorization.mode = AUTHORIZATION_MODES.ACCESS_CONTROL_LIST;
    this.configuration.authorization.aclEndpoint = endpoint;
    return this;
  }

  /**
   * Authorize using an id token claim
   * @param {string} tokenClaimName The name of the claim to use for authorization
   * @returns {ConfigurationBuilder}
   */
  withIdTokenClaimAuthorization = (tokenClaimName) => {
    this.configuration.authorization.mode = AUTHORIZATION_MODES.ID_TOKEN_CLAIM;
    this.configuration.authorization.tokenClaimName = tokenClaimName;
    return this;
  }

  /**
   * Authorize using an access token claim
   * @param {string} tokenClaimName The name of the claim to use for authorization
   * @returns {ConfigurationBuilder}
   */
  withAccessTokenClaimAuthorization = (tokenClaimName) => {
    this.configuration.authorization.mode = AUTHORIZATION_MODES.ACCESS_TOKEN_CLAIM;
    this.configuration.authorization.tokenClaimName = tokenClaimName;
    return this;
  }

  /**
   * @param {Configuration} rawConfiguration
   * @returns {ConfigurationBuilder}
   */
  withRawConfiguration = (rawConfiguration) => {
    this.configuration = rawConfiguration;
    return this;
  }

  /**
   * Alias for withRawConfiguration
   */
  fromConfiguration = (rawConfiguration) => {
    return withRawConfiguration(rawConfiguration);
  }

  /**
   * @param {string[]} defaultPermissions
   * @returns {ConfigurationBuilder}
   */
  withDefaultPermissions = (defaultPermissions) => {
    this.configuration.authorization.defaultPermissions = defaultPermissions;
    return this;
  }

  /**
   * @param {string} application application name for dealing with authorization. Primarily used for storage
   * @returns {ConfigurationBuilder}
   */
  withAppAuthorization = (application) => {
    this.configuration.authorization.application = application;
    return this;
  }

  /**
   * @returns {Configuration}
   * @throws Error
   */
  build = () => {
    validateConfiguration(this.configuration);
    return this.configuration;
  }
}

/**
 * This function creates a builder function for the configuration
 * It will have methods for each configuration option
 * @returns {ConfigurationBuilder}
 */
export const getConfigBuilder = () => new ConfigurationBuilder();