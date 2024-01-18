import { getConfigBuilder, AUTHORIZATION_MODES, ACCESS_CONTROL_LIST_SOURCE } from '../../shared-auth-config/authConfig.mjs';

// Test the configuration builder
const configuration = getConfigBuilder()
  .withOAuth()
  .withOAuthClientId('my-client-id')
  .withOAuthRedirectUri('https://my-app.com/oauth/callback')
  .withOAuthScopes(['openid', 'profile', 'email', 'offline_access'])
  .withOAuthHost('my-auth-server.com')
  .withOAuthRefreshEndpoint('/api/oauth/refresh')
  .withOAuthLogoutEndpoint('/api/oauth/logout')
  .withLocalStorage()
  .withAuthorization()
  .withAuthorizationMode(AUTHORIZATION_MODES.ACCESS_CONTROL_LIST)
  .withAuthorizationSource(ACCESS_CONTROL_LIST_SOURCE.API)
  .withAuthorizationAclEndpoint('/api/user/permissions')
  .build();

  console.log(configuration);

  console.log("Success!")