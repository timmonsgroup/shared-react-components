# Shared Component Library Playgrounds #
The playgrounds are used to test the shared component libraries in a real world scenario. This is where you can test your changes to the libraries before pushing them to the repository or publishing.

## How to use the playground ##
1. Look at `How to build` section in the [timmons-group README](../timmons-group/README.md).
1. Use an existing playground (like [src-sample](./src-sample/README.md)) or create a new one in this directory.
1. In the project's package.json add any of the following to the devDependencies:
    ```json
    "devDependencies": {
      "@timmons-group/config-form": "file:../../timmons-group/build/config-form",
      "@timmons-group/shared-react-components": "file:../../timmons-group/build/shared-react-components",
      "@timmons-group/shared-react-permission-filter": "file:../../timmons-group/build/shared-react-permission-filter",
      "@timmons-group/shared-react-auth": "file:../../timmons-group/build/shared-react-auth",
      "@timmons-group/shared-react-app-bar": "file:../../timmons-group/build/shared-react-app-bar",
      "@timmons-group/shared-auth-config": "file:../../timmons-group/build/shared-auth-config"
    }
    ```
1. This will point the playground to the build directory of the library you want to test.
1. Run `npm install` in the playground directory.
1. Run your application.
1. If you are using vite it should pick up most changes you make to the libraries (after running the build command in the  `timmons-group` directory) without needing to stop and restart.