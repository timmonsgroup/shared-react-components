import '../models/auth';
/*
  This is a collection of utility functions for working with JWT tokens
*/

export const decodeBase64Token = (tokenBase64String) => {
  try {
    const token =
      JSON.parse(
        atob(
          tokenBase64String.replace(/-/g, '+').replace(/_/g, '/') // The replace is needed because the token is base64url encoded and not base64 encoded
        )
      );
    return token;
  } catch (err) {
    return null;
  }
};

export const decodeTokenToJWT = (token) => {
  const spilt = token.includes('.') ? token.split('.')[1] : token;
  const jwt = JSON.parse(
    atob(
      spilt.replace(/-/g, '+').replace(/_/g, '/') // The replace is needed because the token is base64url encoded and not base64 encoded 
    )
  );
  return jwt;
};

/**
 * @function parseTokens
 * @param {string} tokensB64
 * @returns {ParsedUserToken}
 */
export const parseTokens = (tokensB64) => {
  const token = decodeBase64Token(tokensB64) || {};
  const { id_token, access_token } = token;
  const idToken = decodeTokenToJWT(id_token || access_token) || {};
  const accessToken = decodeTokenToJWT(access_token) || {};

  let userName = 'User';
  const { given_name, family_name, email, name } = idToken;
  if (given_name) {
    userName = given_name;
    if (family_name) {
      userName += ' ' + family_name;
    }
  }
  else if (name) {
    userName = name;
  }
  else if (email) {
    userName = email;
  }

  return {
    token,
    accessToken,
    isExpired: () => { return accessToken.exp < (Date.now() / 1000); },
    timeToExpired: () => { return accessToken.exp - (Date.now() / 1000); }, // This should return the time in seconds until the token expires, we can use this to refresh the token
    idToken: idToken,
    user: {
      authenticated: true,
      name: userName,
      email,
      given_name,
      family_name,
      id: idToken.sub,
      sub: idToken.sub,
      raw: idToken // So we can use other claims if we want
    },
    refresh_token: token.refresh_token
  };
};

export const parseCombinedToken = (base64Value) => {
  // The oAuth endpoints sometimes provide the tokens as a single string with the access_token and id_token and sometimes refresh_tokens combined.
  // We need to parse them out.

  const strinValue = atob(base64Value.replace(/-/g, '+').replace(/_/g, '/')); // The replace is needed because the token is base64url encoded and not base64 encoded

  // Try to parse the string as a JSON object
  const parsed = JSON.parse(strinValue);

  // now we should validate that the access_token and id_token are valid JWT tokens
  const { id_token, access_token, refresh_token } = parsed;
  const idToken = decodeTokenToJWT(id_token) || {};
  const accessToken = decodeTokenToJWT(access_token) || {};

  // Now validate that they are not expired
  const isExpired = () => { return accessToken.exp < (Date.now() / 1000); };

  // If it is expired return that it is invalid

  return { id_token: idToken, access_token: accessToken, bearer_token: access_token, refresh_token, valid: !isExpired() };

}
