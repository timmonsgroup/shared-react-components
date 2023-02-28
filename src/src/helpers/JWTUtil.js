
/*
  This is a collection of utility functions for working with JWT tokens
*/

export const decodeBase64Token = (tokenBase64String) => {
  try {
    const token = JSON.parse(atob(tokenBase64String));
    return token;
  } catch (err) {
    return null;
  }
};

export const decodeTokenToJWT = (token) => {
  const jwt = JSON.parse(atob(token.split('.')[1]));
  return jwt;
};

export const parseTokens = (tokensB64) => {
  const token = decodeBase64Token(tokensB64) || {};
  const {id_token, access_token} = token;
  const idToken = decodeTokenToJWT(id_token || access_token) || {};
  const accessToken = decodeTokenToJWT(access_token) || {};

  let userName = 'User';
  const {given_name, family_name, email, name} = idToken;
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
    isExpired: () => { console.log(accessToken.exp); return accessToken.exp < (Date.now() / 1000)},
    timeToExpired: () => { return accessToken.exp - (Date.now() / 1000)}, // This should return the time in seconds until the token expires, we can use this to refresh the token
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