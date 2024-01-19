# Shared React Auth

This module provides authentication and authorization within an application

## Installation

`npm i -S @timmons-dev/shared-react-auth @timmons-dev/shared-auth-config`

## Usage

In your App

```javascript
import { ProvideAuth } from '@timmons-dev/shared-react-auth'
...
<ProvideAuth config={authConfig}>
```

And other places

```javascript
import { useAuth } from '@timmons-dev/shared-react-auth'

...

const { authState } = useAuth();

const { user } = authState;

```