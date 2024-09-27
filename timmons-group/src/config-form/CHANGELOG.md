# Change Log #
## Release 2.0.0 but actually first release ##
### Breaking Changes from shared-react-components ###
First release as a standalone package.  This package was previously part of the shared-react-components package.  This is a breaking change as the package is now a standalone package.
```json
"@timmons-group/config-form": "^2.0.0"
```
We've updated the peer dependencies for the `@hookform/resolvers` package to version 3.1.1. You'll need to update your `package.json` file to include this version. If you were on 1.0.0 of this library you are fine. Otherwise you will also need to update yup to at least version 1 as version 3.0.0 of `@hookform/resolvers` requires yup version ^1.x.
```json
"@hookform/resolvers": "^3.1.1"
```
MUI X Datepickers library has been upgraded to ^6.20.0
 This should not have any breaking changes if you have updated to the latest version of the library

Our yup string helper has [trim](https://github.com/jquense/yup?tab=readme-ov-file#stringtrimmessage-string--function-schema) on it. Trim means yup will trim (removing leading or trailing spaces) the string value before attempting to validate In previous versions of the ConfigForm this threw a validation error if your string had trailing or leading spaces. This is no longer our default case.

```javascript
// No trim
value = " 1 2 3 " // would be validated 7 characters

// Trim (not strict)
value = " 1 2 3 " // would be validated as 5 characters

// Trim (strict)
value = " 1 2 3 " // would be validated as 5 characters AND throw an error because of leading AND trailing spaces
```

It is recommended you run myFormStringValue.trim() on your data before saving.

If you would like to keep v1 functionality you can add "enforceTrim" to your field's layout object
```javascript
const layout = {
  sections [
    {
      //section props
      layout: : [
        {
          label: 'Some Field',
          path: 'someField',
          //... more things
          enforceTrim: true, // This will throw and error if the string has leading or trailing spaces
        },
        // other fields...
      ],
    }
  ]
};
```

If you want to remove trim completely from the validation you can add "noTrim" to your field's layout object
```javascript
const layout = {
  sections [
    {
      //section props
      layout: : [
        {
          label: 'Some Field',
          path: 'someField',
          //... more things
          noTrim: true, // no trimming will be done on this field. " 1 2 3 " would be considered 7 characters
        },
        // other fields...
      ],
    }
  ]
};
```

### Deprecations ###
`ConfigGrid` - We have stopped development on this. The components will remain in 2.x releases, but be removed in the next major release.

The primary reason for this deprecation is [Material React Table(MRT)](https://www.material-react-table.com/). This library came out after our first few iterations of ConfigGrid (formerly known as PAMLayoutGrid) and accomplishes everything we originally wanted ConfigGrid to be and more. It also removes the limitiation of MUI-X Data grid and "premium" features. MRT uses MUI components with the headless [TanStack Table](https://tanstack.com/table/latest) library.

We recommend re-creating your ConfigGrid implementations in MRT.

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