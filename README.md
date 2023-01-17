# Timmons Group Shared React Components

## Overview 📚

This repo contains the source code for the [Timmons Group Shared React Components npm library](https://www.npmjs.com/package/@timmons-group/shared-react-components).

## Core Files/Folders 📂

`src/helpers` - Helper/utility functions.

`src/hooks` - Reusable hooks for generic routines such as auth and data fetching.

`src/stories` - Storybook stories and reusable components.

## Install Dependencies 🧩

1. Install the `LTS` version of [Node JS](https://nodejs.org/en/download/)
1. `npm i`

## How to Run Storybook Locally 📖

Storybook will let you develop locally without the need to integrate  this lib with an application (see the section below on Running Locally with a Target Project 🏃‍♂️).  This sort of development is best suited for isolated `component` development.

1. `cd src`
1. `npm start`

## How to Run Locally and Link to a Target Project 🏃‍♂️

We can run this library within a local project/application by using `npm link`.  This sort of development is best suited for situations where you need to work on the `hooks`/`helpers` or want to do some manual integration testing of the `components` within your target project.

1. Delete the `@timmons-group` folder in the `node_modules` folder of the target project.
   1. IMPORTANT: This deletion needs to be done while the target project's react-scripts / webpack is not running.  If you are running the target project, you will need to stop it first.
1. Boot up the target project's dev web server and let `webpack` fail (due to the goodies we just deleted).
1. Stop your dev web server.
1. In this repo run `npm run build:package`
1. In this repo run `npm link`
1. In the target repo run `npm link @timmons-group/shared-react-components`
1. Restart the target repo's web server and you should be all set
1. Make changes to this shared component repo and then run `npm run build:package-localdev`
   * You may indiviudally build any of the file types if you are not working on all of them:
     * `npm run build:components` - This will build the components and stories
     * `npm run build:helpers` - This will build the helpers
     * `npm run build:hooks` - This will build the hooks
     * `npm run build:index` - This will build the index (components that are exported for use) and constants
       * This must be run if you are adding a new component to the index file for the first time

### Ok fine, but how do I get back to the published version? 🤷‍♂️ ###
To remove the `npm link`
1. Delete the `@timmons-group` folder in the `node_modules` folder of the target project.
1. Run `npm i` in the target project.

## How to Build 🔨

1. `npm run build:package`

## How to Publish to NPM 📦

TODO: add some goodies here about tagging

https://docs.npmjs.com/cli/v9/commands/npm-publish

## How to Publish a beta version to NPM
Note about beta versions of the package
 * They will NOT install via `npm i @timmons-group/shared-react-components@latest`
 * Will not appear on `npm outdated` OR install via `npm update`.

### Steps to publish a beta version of the package to beta. ###
1. Modify version in package.json to the following format (match with existing version numbers etc)
   * `"version": "0.1.120-beta.x" where beta.x is the number of those betas`
1. Build the package
   * `npm run build:package`
1. Publish to npm
   * `npm publish --tag beta`

There are two options for installation / testing in a project:
1. Always install beta
   * `npm install @timmons-group/shared-react-components@beta`
1. Install specific version with
   * `npm install @timmons-group/shared-react-components@0.1.120-beta.1`

### How to fix latest if you publish a beta without --tag beta ###
How to fix latest if you publish a beta without --tag beta (it will default to latest)
run: `npm dist-tags add @timmons-group/shared-react-components@1.0.3 latest --otp=123456` where 1.0.3 is the version that should be latest `--otp=` is required

## Who do I Talk to? 🙋‍♀️

- Bryant Overgard
- Nathan Grant
- Travis Walters
- Chaz Mateer

##  Create React App (CRA) Boilerplate Below 🍽

---

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
