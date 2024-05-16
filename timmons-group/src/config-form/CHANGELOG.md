Breaking Changes from shared-react-components

We've updated the peer dependencies for the `@hookform/resolvers` package to version 3.1.1. This is a breaking change, so you'll need to update your `package.json` file to include this version. If you were on 1.0.0 of this library you are fine. Otherwise you will also need to update yup to at least version 1 as version 3.0.0 of `@hookform/resolvers` requires yup version ^1.x.
```json
"@hookform/resolvers": "^3.1.1",