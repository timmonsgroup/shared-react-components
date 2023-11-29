/**
  * @module AuthTypes
  * @see {@link https://stackoverflow.com/questions/49836644/how-to-import-a-typedef-from-one-file-to-another-in-jsdoc-using-node-js/73232942#73232942|stackoverflow}
  */
import { AUTH_STATES } from "../constants";

/**
 * @typedef { typeof AUTH_STATES.INITIALIZING | typeof AUTH_STATES.LOGGED_OUT | typeof AUTH_STATES.LOGGING_IN | typeof AUTH_STATES.LOGGED_IN | typeof AUTH_STATES.TOKEN_STALE | typeof AUTH_STATES.REFRESHING_TOKEN | typeof AUTH_STATES.ERROR } AuthStateType - The auth state type
 */

/**
 * @typedef {object} DecodedIDToken
 * @property {string} at_hash - The access token hash
 * @property {string} aud - The audience
 * @property {Array<string>} cognito:groups - The cognito groups
 * @property {string} cognito:username - The cognito username
 * @property {string} email - The email
 * @property {boolean} email_verified - If the email is verified
 * @property {string} auth_time - The auth time
 * @property {string} event_id - The event id
 * @property {number} exp - The expiration
 * @property {string} iat - The issued at
 * @property {string} iss - The issuer
 * @property {string} jti - The jwt id
 * @property {string} origin_jti - The origin jwt id
 * @property {string} sub - The subject
 * @property {string} token_use - The token use *
 */

/**
 * @typedef {object} DecodedAccessToken
 * @property {string} client_id - The client id
 * @property {string} scope - The scope
 * @property {string} username - The username
 * @property {number} version - The version
 * @property {string} auth_time - The auth time
 * @property {string} event_id - The event id
 * @property {number} exp - The expiration
 * @property {string} iat - The issued at
 * @property {string} iss - The issuer
 * @property {string} jti - The jwt id
 * @property {string} origin_jti - The origin jwt id
 * @property {string} sub - The subject
 * @property {string} token_use - The token use *
 */

/**
 * @typedef {Object} DecodedToken
 * @property {string} access_token - The access token
 * @property {string} token_type - The token type
 * @property {number} expires_in - The token expiration
 * @property {string} refresh_token - The refresh token
 * @property {string} id_token - The id token
 */

/**
 * @typedef {Object} ParsedUser
 * @property {boolean} authenticated - if the user is authenticated
 * @property {string} name - The user name
 * @property {string} email - The user email
 * @property {string} given_name - The user's first name
 * @property {string} family_name - The user's last name
 * @property {string} id - The user id
 * @property {string} sub - The user sub
 * @property {DecodedIDToken} raw - The raw user object
 */

/**
 * @typedef {Object} ParsedUserToken
 * @property {DecodedToken} token - The user token
 * @property {ParsedUser} user - The user name
 * @property {DecodedIDToken} idToken - The decoded token
 * @property {DecodedAccessToken} accessToken - The decoded access token
 * @property {function} isExpired - If the token is expired
 * @property {function} timeToExpired - The time until the token expires
 * @property {string} refreshToken - Refresh the token
 */

/**
 * @typedef {object} RawUser
 * @property {string} name - The name of the user
 * @property {string} id - The id of the user
 * @property {object} permissions - The permissions of the user
 * @property {string} [email] - The email of the user
 * @property {string} [phone] - The phone number of the user
 * @property {string} [username] - The username of the user
 * @property {string} [firstName] - The first name of the user
 * @property {string} [lastName] - The last name of the user
 * @property {string} [fullName] - The full name of the user
 * @property {string} [preferredName] - The preferred name of the user
 * @property {string} [preferredFirstName] - The preferred first name of the user
 * @property {string} [preferredLastName] - The preferred last name of the user
 * @property {string} [preferredFullName] - The preferred full name of the user
 *
 */

/**
 * @typedef {object} User
 * @property {string} name - The name of the user (or email if no name)
 * @property {Array<string>} acl - Access control list
 * @property {boolean} isSignedIn - Whether or not the user is signed in
 * @property {string} id - The id of the user
 * @property {object} meta - any meta data about the user passed in via API middleware
 * @property {boolean} authenticated - if the user is authenticated
 * @property {string} name - The user name
 * @property {string} email - The user email
 * @property {string} given_name - The user's first name
 * @property {string} family_name - The user's last name
 * @property {string} id - The user id
 * @property {string} sub - The user sub
 * @property {DecodedIDToken} raw - The raw user object
 */

/**
 * @typedef {object} AuthState
 * @property {AuthStateType} state - The current state of the auth state
 * @property {string} refreshToken - The refresh token
 * @property {string} bearerToken - The bearer token
 * @property {User} user - The user object
 * @property {object} loggedOutuser - The logged out / anonymous user object
 * @property {object} config - The auth config
 * @property {string} staleCheckState - The state of the stale check
 * @property {number} lastRequestTime - The last time a request was made
 * @property {boolean} refreshing - Whether or not the auth state is refreshing
 */

/**
 * @typedef {Object} AuthContext
 * @property {AuthState} authState - The auth state
 * @property {function} login - Login the user
 * @property {function} logout - Logout the user
 * @property {function} refresh - Refresh the user token
 * @property {function} getPermissions - Get the user permissions
 * @property {function} getBearerToken - Get the bearer token
 */
