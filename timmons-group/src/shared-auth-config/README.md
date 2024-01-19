# Shared Auth Config

This is the shared configuration for authentication and authorization

## Installation

`npm i -S @timmons-dev/shared-auth-config`

## Usage

The package provides a builder for generating auth config.

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
        .withAuthorizationMode(authConfig.AUTHORIZATION_MODES.COGNITO_GROUPS)
        .build();
```

# API

## Authentication Methods

### getConfigBuilder()

This function returns a configuration builder with an empty configuration.

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

### build()

This method validates and returns the configuration object. If there are configuration issues an error is thrown.

