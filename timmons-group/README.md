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

### Building for publishing ###
In this directory `timmons-group` run the following command
 ```json
 node build-cli
 ```
 A prompt will appear asking what part of the version you'd like to increment.
 If you want to create a pre-release version (alpha, beta, gamma, etc.) type `4` "Tag" and then type the pre-release version you'd like to create.
 Example:
 ```json
 4. Tag\t\t - Select this if the build includes a tag
 4
 > alpha
 ```

#### Example of going from a pre-release version to a full release ####
 ```json
 PS C:\Users\somePerson\coding\shared-react-components\timmons-group> node build-cli
Current version is 2.0.0-beta.9
Current version is
Version is 2.0.0-beta.9
        Major 2
        Minor 0
        Patch 0
        Tag beta
        Subversion 9
Which part of the version would you like to increment?
    1. Major             - Select this if the build includes breaking changes
    2. Minor             - Select this if the build includes new features
    3. Patch             - Select this if the build includes bug fixes
    4. Tag               - Select this if the build includes a tag
    5. Subversion        - Select this if the build includes a subversion
    6. Done
    4
Enter the new tag:
// In the above prompt we didn't type anything. This removes the pre-release tag and creates a full release
// It is not necessary to change the subversion number as it will be reset to 0 (see below)
Version is 2.0.0
        Major 2
        Minor 0
        Patch 0
        Tag
        Subversion 9
Which part of the version would you like to increment?
    1. Major             - Select this if the build includes breaking changes
    2. Minor             - Select this if the build includes new features
    3. Patch             - Select this if the build includes bug fixes
    4. Tag               - Select this if the build includes a tag
    5. Subversion        - Select this if the build includes a subversion
    6. Done
    6
// We are done incrementing the version. Since there is no tag the subversion number is reset to 0
New version is
Version is 2.0.0
        Major 2
        Minor 0
        Patch 0
        Tag
        Subversion 9
Are you sure you want to build version 2.0.0? (y/n)y
v2.0.0
```

The cli will then build all the libraries in the `timmons-group` directory using rollup and create a build folder with all the libraries in it.
Then the tsx script will run to generate the typescript `*.d.ts` files for each library and place them in each library's folder in the build directory.

```json
> timmons-group@2.0.0 build-new
> node build-monorepo.js
```

After the build is complete the cli will ask if you want to publish the libraries to npm. If you choose to publish the libraries the cli will publish each library to npm.

```json
Would you like to apply the tag to the repo? (y/n)y
Total 0 (delta 0), reused 0 (delta 0), pack-reused 0 (from 0)
To https://github.com/timmonsgroup/shared-react-components.git
 * [new tag]         2.0.0 -> 2.0.0
How would you like to publish?
    1. Publish alpha
    2. Publish beta
    3. Publish gamma
    4. Publish latest
    5. Skip publishing
```

Make sure you pick the correct option for the type of release you are doing. If you are doing a pre-release version make sure you select the correct pre-release option. It is recommended to skip the publish and run the publish script manually to ensure the correct version is published.

```json
    5. Skip publishing
    5
Invalid option
Skipping publishing
PS C:\Users\somePerson\coding\shared-react-components\timmons-group> .\publish.sh
```