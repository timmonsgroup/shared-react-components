# Moving from 1.x to 2.x #

## Breaking Changes ##
### Libraries Updated ###
 - "@mui/x-date-pickers"
   - Upgraded from v5.x to ^6.20.0
   - V7 is out, but we intend to stay on v6 so teams can use this library AND [material-react-table](https://www.material-react-table.com/docs/getting-started/install)
 - "@hookform/resolvers"
   - Upgraded from v2.x to ^3.1.1
     - No internal changes. Yup 1.x was a required to go to v3.x. We've been on Yup since the 1.x release of this library.

### ConfigForm ###
ConfigForm has been moved to its own library `@timmons-group/config-form`. This was done to separate the form components from the shared components library. This will allow for better separation of concerns and allow for easier maintenance of the form components.


## Migration Steps ##
1. Update the `package.json` of the project to add OR use the new versions of the libraries
   - Example:
   ```json
      "dependencies": {
        "@timmons-group/config-form": "^2.0.0",
        "@timmons-group/shared-react-components": "^2.0.0",
        "@timmons-group/shared-auth-config": "^2.0.0",
        "@timmons-group/shared-react-app-bar": "^2.0.0",
        "@timmons-group/shared-react-auth": "^2.0.0",
        "@timmons-group/shared-react-components": "^2.0.0",
        "@timmons-group/shared-react-permission-filter": "^2.0.0",
        "@hookform/resolvers": "^3.4.0",
        "@mui/x-date-pickers": "^6.20.0"
      }
     ```
2. Update imports for ConfigForm
    - All Form components are now in the `@timmons-group/config-form` library
     - Components in the `@timmons-group/config-form` library are:
       - AnyField
       - AnyFieldLabel
       - ClusterField
       - ConfigForm
       - DynamicField
       - FormErrorMessage
       - GenericConfigForm
       - GenericInlineForm
       - RadioOptions
       - RequiredIndicator
       - Typeahead
     - Constants
      - All constants used by configForm are currently duplicated in the `@timmons-group/config-form` library and the `@timmons-group/shared-react-components` library. Moving forward the constants used in the `@timmons-group/config-form` library are the source of truth and should be used.
      - Example:
      ```tsx
      // Before
      - import { FIELD_TYPES } from '@timmons-group/shared-react-components';
      // Preferred After
      + import { FIELD_TYPES } from '@timmons-group/config-form';
      ```
    - Hooks
      - useFormLayout.ts
       - Exports
         - getFieldValue
         - processFieldValue
         - useFormLayout
         - parseFormLayout
         - parseSection
         - parseField
      - useConfigForm.js
       - Exports
         - fetchChoices
         - processDynamicFormLayout
         - useConfigForm
    - Helpers
      - formHelpers.js
        - Exports
          - getFormLayout
          - VALID_PATTERNS
          - yupCurrency
          - yupDate
          - yupFloat
          - yupMultiselect
          - yupInt
          - yupObject
          - yupString
          - yupTrimString
          - yupTrimStringMax
          - yupTypeAhead
          - validDateFormat
          - multiToPayload
          - getSelectValue
          - validCurrencyFormat
          - validDoubleFormat
          - createFieldValidation
          - attemptFormSubmit
          - useFormSubmit
          - createRowFields
          - checkConditional
          - defaultChoiceFormatter
          - defaultChoiceMapper
    - Example:
    ```tsx
    // Before
    - import { ContainerWithCard, ConfigForm, GenericConfigForm, LineLoader, LoadingSpinner, Modal, useFormLayout } from '@timmons-group/shared-react-components';
    // After
    + import { ConfigForm, GenericConfigForm, useFormLayout } from '@timmons-group/config-form';
    + import { ContainerWithCardLineLoader, LoadingSpinner, Modal } from '@timmons-group/shared-react-components';
    ```
