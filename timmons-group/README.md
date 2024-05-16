# Timmons Group Shared Component Libraries #

## Libraries / Modules ##
- [config-form](./src/config-form/README.md)
- [shared-auth-config](./src/shared-auth-config/README.md)
- [shared-react-app-bar](./src/shared-react-app-bar/README.md)
- [shared-react-auth](./src/shared-react-auth/README.md)
- [shared-react-components](./src/shared-react-components/README.md)
- [shared-react-permission-filter](./src/shared-react-permission-filter/README.md)

## Prerequisites ##
- [Node.js / NPM](https://nodejs.org/en/)
- [Gitbash (optional, but recommended)](https://git-scm.com/downloads)

## Installation ##
1. Clone the repository
1. Run `npm install` in this directory `timmons-group`
    1. This will install all the peerDependencies found in each `package.json` of the libraries

## How to build ##
### Local development / testing ###
In this directory `timmons-group` run the following command
 ```json
 node .\build-monorepo.js
 ```
 This will build all the libraries in the `timmons-group` directory using rollup and create a build folder with all the libraries in it.
 Next run the command
 ```json
  npm run tsx
  ```
  This will generate the typescript `*.d.ts` files for each library and place them in each library's folder in the build directory.

  To test your changes we recommend creating or using an existing project in the [playground](../playground/) directory and linking the library to it. This will allow you to test your library changes in a real world scenario.
