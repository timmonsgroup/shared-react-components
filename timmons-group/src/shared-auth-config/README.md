# Shared Auth Config

This is the shared configuration for authentication and authorization

## Installation

`npm i -S @timmons-dev/shared-auth-config`

## Usage Samples

The package provides a builder for generating auth config.

### Cognito groups RBAC

The following configuration example will use the cognito groups as the source of authorization.

```javascript
import { getConfigBuilder } from '@timmons-dev/shared-auth-config'

...

let authConfig = 
        getConfigBuilder()
        .withOAuth({
            "clientId": "Client ID Goes Here",
            "redirectUri": "/oAuthHelper.html",
            "scopes": [ "openid", "email" ],
            "host": "YourApp.com"
        })
        .withOAuthRefreshEndpoint('/api/oauth/refresh')
        .withOAuthLogoutEndpoint('/api/oauth/logout')
        .withLocalStorage()
        .withAuthorization()
        .withIdTokenClaimAuthorization("cognito:groups")
        .build();
```

### Access Control List

Sometimes we need more fine tune control of permissions than what can be represented with a cognito group claim. The system allows to reach out to a rest endpoint in order to get an access control list.

For additional context please see the implementation of this configuration method in [@timmons-dev/shared-react-auth](https://www.npmjs.com/package/@timmons-group/shared-react-auth)

```javascript
import { getConfigBuilder } from '@timmons-dev/shared-auth-config'

...

let authConfig = 
        getConfigBuilder()
        .withOAuth({
            "clientId": "Client ID Goes Here",
            "redirectUri": "/oAuthHelper.html",
            "scopes": [ "openid", "email" ],
            "host": "YourApp.com"
        })
        .withOAuthRefreshEndpoint('/api/oauth/refresh')
        .withOAuthLogoutEndpoint('/api/oauth/logout')
        .withLocalStorage()
        .withAuthorization()
        .withAccessControlListAuthorization("/api/permissions")
        .build();
```

# API

## getConfigBuilder()

This function returns a configuration builder with an empty configuration.

## Configuration Builder

| Section | Method | Parameters | Description |
| --- | --- | --- | --- |
| general | build | | This method validates and returns the configuration object. If there are configuration issues an error is thrown. |
| general | fromConfiguration | configuration {Configuration} | Uses the provided configuration |
| authentication | withAuthentication | config | Sets the raw authentication configuration |
| authentication | withOAuth | config {Object} (Optional) | Sets the authentication mode to oAuth and uses configuration if provided. If a configuration is not provided please use the oAuth config methods below |
| oAuth configuration | withOAuthClientId | clientID {String} | Sets the client id in the configuration |
| oAuth configuration | withOAuthRedirectUri | uri {String} | Sets the redirect uri used in the authentication workflow. Normally the oAuth server will redirect to this location after a sucessful authentication. | 
| oAuth configuration | withOAuthScopes | scopes {String[]} | Sets the requested scopes for the authentication workflow |
| oAuth configuration | withOAuthHost | host {String} | Sets the oAuth host in the configuration |
| oAuth configuration | withOAuthRefreshEndpoint | endpoint {String} | Sets the refresh endpoint for the oAuth configuration |
| oAuth configuration | withOAuthLogoutEndpoint | endpoint {String} | Sets the logout endpoint in the oAuth configuration |
| storage | withStorage | configuration {StorageConfiguration} | Sets the storage configuration |
| storage | withSessionStorage | | Sets the storage configuration mode to session storage |
| storage | withLocalStorage | | Sets the storage configuration mode to local storage |
| storage | withCookieStorage | | Sets the storage configuration mode to cookie storage |
| storage | withStartupSourceKey | startupSourceKey {String} | Sets the key to be sued for startup |
| authorization | withAuthorization |  configuration {AuthorizationConfiguration} | Sets the authorization configuration |
| authorization | withNoAuthorization | | Sets the authorization mode to none |
| authorization | withIdTokenClaimAuthorization | claimNname {String} | Sets the authorization mdoe to id token claim and the token claim name to the provided value |
| authorization | withAccessTokenClaimAuthorization | claimName {String} | Sets the authorization mdoe to access token claim and the claim name to the provided value |
| authorization | withAccessControlListAuthorization | endpoint {String} | Sets the authorization mdoe to access control list and the endpoint to the provided value |
| authorization | withDefaultPermissions | defaultPermissions {String[]} | Sets the default permissions for use with authorization |
| authorization | withAppAuthorization | application {String} | Sets the application key in the authorization configuration |

# Models

## Configuration

| field | type | description |
| --- | --- | --- |
| authentication | AuthenticationConfiguration | The configuration for authentication |
| storage | StorageConfiguration | The configuration for the storage |
| authorization | AuthorizationConfiguration | The configuratiopn for authorization |

## OAuthConfiguration

| field | type | description |
| --- | --- | --- |
| clientId | String | The client id for use with the oAuth workflow |
| redirectUri | String | The redirect uri to be used with the authentication request |
| scopes | String[] | The scopes to request from the oAuth server |
| host | String | The oAuth host |
| endpoints | OAuthEndpoints | The endpoint configuration |

## OAuthEndpoints 

| field | type | description |
| --- | --- | --- |
| refresh | String | The url that is called to perform a refresh workflow |
| logout | String | The url the user is redirected to in order to complete the logout workflow |

## StorageConfiguration

| field | type | description |
| --- | --- | --- |
| mode | StorageMode | The mode used for storage.

## StorageMode

Enum describing the mode used for storage

| Value | Description |
| --- | --- |
| SESSION | Session storage i.e. window.sessionStorage | 
| LOCAL | Local storage i.e. window.localStorage |
| COOKIE | Cookie storage i.e. document.cookie |
| NONE | No storage |

## AuthorizationConfiguration

| field | type | description |
| --- | --- | --- |
| mode | AuthorizationMode | The mode used for authorization |
| tokenClaim | String | The claim name used for id token claim and access token claim authorization workflows |
| aclEndpoint | String | The url to call to get the permissions in an acl authorization wokflow |

# Old info

This will be removed in the near future

### build()

This method validates and returns the configuration object. If there are configuration issues an error is thrown.

### withOAuth(config)

This method adds OAuth configuration to the builder.  It accepts a configuration object with the following properties:

* clientId - The OAuth Client ID
* redirectUri - The URI to redirect to after OAuth authentication is complete
* scopes - An array of OAuth scopes to request
* host - The host for the OAuth provider

### withOAuthRefreshEndpoint(endpoint)

This method adds a refresh endpoint to the builder.  It accepts a string that is the refresh endpoint.

### withOAuthLogoutEndpoint(endpoint)

This method adds a logout endpoint to the builder.  It accepts a string that is the logout endpoint.

## Storage Methods

### withLocalStorage()

This method adds local storage to the builder.  This is required for the OAuth flow to work.  This method does not accept any parameters.

### withCookieStorage()

This method adds cookie storage to the builder.  This is required for the OAuth flow to work.  This method does not accept any parameters.

## Authorization Methods

### withAuthorization()

This method adds authorization to the builder.

### withAuthorizationMode(mode)

This method adds authorization mode to the builder. 

#### AUTHORIZATION_MODES values:

* NONE - No authorization mode
* COGNITO_GROUPS - Authorization mode using Cognito groups
* ACCESS_CONTROL_LIST - Authorization mode using an ACL

## Additional Methods


