# Shared React Auth

This module provides authentication and authorization within an application. It expects that you are using a configuration compatible with Using [@timmons-dev/shared-auth-config](https://www.npmjs.com/package/@timmons-group/shared-auth-config)

## Installation

`npm i -S @timmons-dev/shared-react-auth @timmons-dev/shared-auth-config`

## Usage

In your App

```javascript
import { ProvideAuth } from '@timmons-dev/shared-react-auth'

...

return <ProvideAuth config={authConfig}>

```

And other places

```javascript
import { useAuth } from '@timmons-dev/shared-react-auth'

...

const { authState } = useAuth();

const { user } = authState;

```


### Cognito groups RBAC

For additional context see [@timmons-dev/shared-auth-config](https://www.npmjs.com/package/@timmons-group/shared-auth-config)

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

As an example, if you had the following groups in cognito:

1. System Administrators
1. Report Viewers

Combining the PermissionFilter from https://www.npmjs.com/package/@timmons-group/shared-react-permission-filter

Presume there is a control where users in the report viewers group or system administrators group.

```javascript
<PermissionFilter any={['Report Viewers', 'System Administrators']}>
    <Buton>Generate Report</Button>
</PermissionFitler>
```

And with the following users
1. Bob - Groups: 'System Administrators'
1. Jane - Groups: 'Report Viewers'
1. Tim - Groups: None

The above button would render for Bob and Jane but not Tim

### Access Control List

Sometimes we need more fine tune control of permissions than what can be represented with a cognito group claim. The system allows to reach out to a rest endpoint in order to get an access control list.


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

After authentication the application will make a request to /api/permissions with the access token used as a bearer token. The response should be a json array of permissions that should be used with the applciation.

# API

## ProvideAuth

Provides the AuthContext to the application

### props

| Name | Type | Description |
| ---- | ---- | ----------- |
| config | AuthConfig | The configuration for the auth system |

### usage

```javascript
import { ProvideAuth } from '@timmons-dev/shared-react-auth'
...
<ProvideAuth config={authConfig}>
```

## useAuth

A hook that provides the auth context to the application

### usage

```javascript
import { useAuth } from '@timmons-dev/shared-react-auth'

...

const { authState } = useAuth();

const { user } = authState;
```

Using the login and logout function

```javascript

const { login, logout, authState } = useAuth();


...

const renderAuthButton = () => {
if(authState?.state === AUTH_STATES.LOGGED_OUT) {
    return <Button onClick={login} >Login!</Button>
} else if (authState?.state === AUTH_STATES.LOGGED_IN)
    return <Button onClick={logout} >Log Out</Button>
} else {
    return <Spinner />
}


```


