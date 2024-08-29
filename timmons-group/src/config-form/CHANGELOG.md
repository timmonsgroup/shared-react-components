# Change Log #
## Release 2.0.0 but actually first release ##
### Breaking Changes from shared-react-components ##
First release as a standalone package.  This package was previously part of the shared-react-components package.  This is a breaking change as the package is now a standalone package.
```json
"@timmons-group/config-form": "^2.0.0"
```
We've updated the peer dependencies for the `@hookform/resolvers` package to version 3.1.1. You'll need to update your `package.json` file to include this version. If you were on 1.0.0 of this library you are fine. Otherwise you will also need to update yup to at least version 1 as version 3.0.0 of `@hookform/resolvers` requires yup version ^1.x.
```json
"@hookform/resolvers": "^3.1.1"
```

### Fixes ###
- useFormLayout
  - Fixed zero not being correctly hydrated by getFieldValue
    - [Issue](https://github.com/timmonsgroup/shared-react-components/issues/12)

### New Functionality ###
- useConfigForm
  - Accepts a new argument `formOptions`. This can be used to change the `mode` option in the `useForm` hook
- ConfigForm
  - New prop `formOptions`. Used to pass options to the new argument in useConfigForm mentioned above
  - Example:
  ```jsx
  const options = {mode: 'onChange'};
  return (
  <ConfigForm formLayout={layout} data={formData} formOptions={options}>
      <GenericConfigForm
        headerTitle="Bacon Bits"
        onSubmit={onSubmit}
      />
    </ConfigForm>
  )
  ```