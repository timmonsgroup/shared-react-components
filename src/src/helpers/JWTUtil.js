
/*
  This is a collection of utility functions for working with JWT tokens
*/

const decodeBase64Token = (tokenBase64String) => {
  try {
    const token = JSON.parse(atob(tokenBase64String));
    return token;
  } catch (err) {
    return null;
  }
}

const decodeTokenToJWT = (token) => {
  const jwt = JSON.parse(atob(token.split('.')[1]));
  return jwt;
}

const parseTokens = (tokensB64) => {
  const token = decodeBase64Token(tokensB64) || {};
  const {id_token, access_token} = token;
  const idToken = decodeTokenToJWT(id_token || access_token);
  const accessToken = decodeTokenToJWT(access_token);

  let name = 'User';
  if (idToken.given_name) {
    name = idToken.given_name;
    if (idToken.family_name) {
      name += ' ' + idToken.family_name;
    }
  }
  else if (idToken.name) {
    name = idToken.name;
  }
  else if (idToken.email) {
    name = idToken.email;
  }

  return {
    token,
    accessToken: accessToken,
    isExpired: () => { console.log(accessToken.exp); return accessToken.exp < (Date.now() / 1000)},
    timeToExpired: () => { return accessToken.exp - (Date.now() / 1000)}, // This should return the time in seconds until the token expires, we can use this to refresh the token
    idToken: idToken,
    user: {
      authenticated: true,
      name,
      email: idToken.email,
      given_name: idToken.given_name,
      family_name: idToken.family_name,
      id: idToken.sub,
      raw: idToken // So we can use other claims if we want
    },
    refresh_token: tokenDecoded.refresh_token
  };
}


module.exports = {
  decodeBase64Token,
  decodeTokenToJWT,
  parseTokens
};