# Change Log #

## Release 0.7.0 - 2/??/23 ##

### Fixes ###
* Snackbar provider was not correctly setup and was causing some stories to fail.
    * Preview has been update to fix this issue.
* Anyfield
    * Default renderer failsafe was actually causing runtime errors. Ruh-roh.
        * Fixed.

### New Components ###
* AnyFieldLabel - A component that renders a label, required asterisk, and optionally an Icon for a field.
    * This component is used by the AnyField component to render a label for a field.
    * This component is also exported for use in other components that need to render a label for a field.
* TooltipIcon - A component that renders an info icon with an optional tooltip.
    * This component is used by the AnyFieldLabel component to render an info icon for a field.
    * This component is also exported for use in other components that need to render an info icon.
    * A custom component can be provided to the component via the `iconComponent` property.

---
### New Functionality ###
Documentation via JSDocs is now available in a rough form. This will be updated as the project progresses.<br>
[Shared React Components Documentation](https://storybook.national.wildfiresuite.dev.timmons-dev.com/docs/)

#### Hooks ####
* useStaleData
    * The previous `isDev` argument used for "debug" functionality has been renamed `useDefault` to better articulate the changes to useLayout below.
    * `useDefault` timeout is now 100 milliseconds instead of 1500.
* useLayout
    * Accepts a new `existingLayout`
        * If this is provided, the hook will use the existing layout to build the form instead of attempting to fetch a new layout from an API using `type`, `key`, and `url`.
        * There is still a "loading" period as the hook uses a short timeout
* useFormLayout
    * Now accepts a new argument `loadedLayout`
        * This layout is used in conjunction with the change to useLayout to bypass loading from an API.
    * By default the entire object is spread into the mapped options for a field populated via url.
        * Previously only the `id` and `label` properties were spread into the mapped options.
        * This change was made to allow for more flexibility in the layout object.
        *`choiceFormatter` can still be used to override and extend this functionality.
    * Will now warn if a field type that does not support asyncronous hydration (i.e. a field that is not a choice field or an object field) is attempting to hydrate via url.
    * Correct Support for currency fields via updates to formHelpers.
    * Currency, float, and integer fields now support a `minValue` and `maxValue` validations.
    * Correctly maps the `placeholder` property to the correct place for all field types.
    * Explicitly define more validations. This was needed to correctly handle conditional logic.
        * `minLength`
        * `maxLength`
        * `minValue`
        * `maxValue`
    * Base validations OTHER than `required` are now inherited when a field is triggered conditionally. If the field redefines the validation property it its `then` object, the base validations will be overwritten.
    * `defaultValue` is now supported.
    * Date fields now support a magic `defaultValue` string of `today`.
        * When `defaultValue: 'today'` is set, the field will be populated with the current date.
        * Valid `new Date(myDateValueHere)` values will also work.
* useDynamicForm
    * Now sets a `visible` property on sections.
        * This property is used to determine if a section should be rendered.
        * False if all fields in the section are hidden.
    * By default the entire object is spread into the mapped options for a field populated via url.
    * New conditional logic to hydrate a readOnly field based on the the result of a triggerField's value (assuming object)
        * Example:
            ```JSON
                id: 'myReadOnlyField',
                'conditions': [
                {
                  'then': {
                    'renderPropertyId': 'fireDepartmentType.name',
                    'hidden': false
                  },
                  'when': 'fireDepartment',
                  'isValid': true
                }
              ]
            ```
        * Assuming the `fireDepartment` field's value is an object, this will cause the `fireDepartmentType.name` value to * be rendered into a readOnly `myReadOnlyField` field if the `fireDepartment` field is not null.

#### Components ####
* Anyfield
    * Hidden fields are now a thing. If the layout object for a field has the property `hidden` set to true, the field will not be rendered.
    * In conjuction with this the React Hook Form (RHF) Controller on Anyfield now has the `shouldUnregister` property set to true. This will prevent RHF from registering the field and will prevent the field from being included in the form data if it is hidden / unmounted.
    * ReadOnly functionality has been added for Textfields.
    * Now renders currency fields.
    * Now passes placeholder values to the correct places
    * Now uses AnyFieldLabel to render labels for fields.
        * Additionally checks for iconHelperText on a layout and sets defaults if not provided.
    * Now accepts new parameter `options` which is used to pass additional fieldOptions (namely specific icon options) to the field.
* LoadingSpinner
    * A new property `zIndex` has been added to the loading spinner.
    * Additionally, the loading spinner now has a default zIndex of MUI tooltip zIndex + 1 (1501). The previous default was 1201 (MUI drawer).
* PamLayoutGrid
    * Now automatically supports "types" of actions.
        * These are defaults are exposed in the constants as `GRID_ACTION_TYPE`.
    * These allow easier customization of the action buttons without need to write a completely custom action renderer.
    * New property `useTypeVariant` has been added to the action renderer.
        * If set to true the `type` property of the action will also be appended as a css name.
        * If set to true but the action does not have a type or the type is not found, the default variant will be used (`text`).
        * This will cause the action renderer to attempt to use the type variant of the action button (These are MUI button variants).
        * The are custome variants that can be defined in your muiTheme.
        * There is boilerplate provided in our muiTheme.
    * Actions can add the property `actionProps` to the action object.
        * This will be spread into the action button as props.
        * This allows for more flexibility in the action button.
        ```javascript
        actionList: [
        {
          label: 'Delete',
          type: GRID_ACTION_TYPE.DELETE,
          order: 0,
          clickHandler: (row) => {
            console.log('Delete', row);
          },
          actionProps: {
            variant: 'contained',
            color: 'tertiary',
            'data-testid': 'delete-button'
          }
        }]
        ```
* GenericForm
    * Adds the new properties to control button colors.
        * `cancelColor`, `submitColor`, and `editColor`
    * New property `hideEmptySections` has been added.
        * If set to true, sections that consist entirely of hidden fields will not be rendered.
    * Updates to pass iconOptions to the AnyField component.
    * `alternatingCols` property has been added.
        * This property will cause the form to render with alternating columns.
        * The default rendering is 1 2 3 in the left column and 4 5 6 in the right.
        * If alternatingCols is set to true, the columns will be rendered as 1 3 5 in the left column and 2 3 6 in the right.

#### Storybook ####
* Generic Form Story
    * There is an interactive story that allows you to modify the layout object and see the form update.
    * There is also a DOCs tab with more information and the option of getting the raw source code.
* Dynamic Form Stories
    * dynamicFormStoryHelpers
        * This provides a set of helper functions to help create stories that demonstrate the use of the useDynamicForm hook.
        * Provides a standard, modifiable default export for useDynamicForm stories.
        * Provides a standard template for useDynamicForm stories.
        * Provides functions to generate a base section and base field layout to build on top of to create dynamic form configurations.
    * dynamicFormTestDataGenerator
        * This provides a function that can take a collection of objects representing requested fields to be included in the test form and generates a layout object that can be used to configure a dynamic form.
        * The collection of objects it takes in have the shape of:
        {
          type: why type of field should be created,
          quantity: how many fields of the requested type should be created,
          options: some options the caller can set to affect how the fields are setup. Options can have the following properties:
          {
            checkbox: if this and options.multiple are set and the field is a choice field or an object field, the field will be rendered as a checkbox selection field,
            multiple: if this and options.checkbox are set and the field is a choice field or an object field, the field will be rendered as a checkbox selection field,
            url: if the field is an object field or a choice field, it will populate its options with data from this provided url,
            possibleChoices: if the field is an object field or a choice field and options.url isn't set, this will set the options for the field,
            conditions: this is an array of condition objects that will set up interactions between this field and other fields,
            required: if this is set to true, the field will be required,
            disabled: if this is set to true, the field will be disabled,
            idField: if this is set and the form is using the default choice formatter, then the choice formatter will look for a property with a key that matches the value set for idField on the data its using to setup it options. It will set the id property on the options to match property it finds,
            readOnly: if this is set to true, the field will be read only
          }
        }
      * dynamicForm.stories
          * Story that demonstrates a large dynamic form built that has one of each possible anyField type in it.
      * dynamicFormConditional.stories
          * A story that demonstrates how a field be disabled based on the value of another field.
          * A story that demonstrates how a selection field can change the source data for its options based on the value of another field.
      * generateDynamicFormConditionalTestData
          * A function to prepare the collection of objects used to generate the test data used for the dynamicFormConditional stories.

* Documentation
    * How to configure a layout object
        * Documentation that explains how to create a layout object that's used to build a dynamic form. Explains what properties you can set on it and what the properties do.
    * How to use `useDynamicForm`
        * Documentation on how to use the `useDynamicForm` hook to build a dynamic form.
        * This documentation is currently incomplete

## Release 0.6.1 - 2/03/23 ##
---

### New Functionality ###
#### Hooks ####
* useAuth
    * ProvideAuth - (context provider component)
        * This component can now accept a new property `whiteList` which is an array of strings.
        * If the whiteList is provided it will parse out those properties from the `maybeUser` (user object injected via an application's middleware NOT the parsed token) and return only those property values in a new `meta` object on the `authState.user` object.
        * NOTE: This does not affect any of the data in the user token that is parsed and `maybeUser.permissions` is AWLAYS passed.
        * This is useful for applications that need to pass additional user meta data but do not want to expose all of the user data to the `authState` context.
        * Code Example:
            ```javascript
            <ProvideAuth config={config}  whiteList={['organization']}>
              <App />
            </ProvideAuth>
            ```

            Would result in the following `authState.user` object:
            ```javascript
            {
              meta: {
                organization: 'Timmons Group',
              },
            }
            ```

            Given the `maybeUser` object:
            ```javascript
            {
              someProperty: 1,
              youDontNeedThis: 'John Doe',
              organization: 'Timmons Group',
            }
            ```

* useFormLayout
    * Can now accept a new property `asyncOptions` which is an object
    * Currently only supports `choiceFormatter` as a key
    * `choiceFormatter` is a function that can be used to format the data fetched from an async call
        * The function should accept
          * fieldId - string of the field that is being formatted
          * response - the response from the async call
          * options - various other options that may be needed to format the data
            * triggerFieldId - the field that triggered the async call (if any) only available if the async call was triggered by a field in useDynamicForm
            * mappedId - id property to use for mapping the id (if any set in the layout)
            * mappedLabel - label property to use for mapping the label (if any set in the layout)
        * The function should return an array of objects with the following properties by default:
            * label - string
            * id - string
            * Code Example:
                ```javascript
                const asyncOptions = {
                  const choiceFormatter = (fieldId, res, otherOptions) => {
                    const { mappedId } = otherOptions || {};
                    return res?.data?.map((opt) => {
                      const id = mappedId && opt[mappedId] ? opt[mappedId] : opt.id || opt.streamID;
                      return { id, label: opt.name || opt.label }
                    })
                  }
                };

                useFormLayout(type, key, url, urlDomain, asyncOptions);
                ```
        * Now has support for `mappedLabel` property on a field's layout when not overriding the async choice formatter

* useDynamicForm
    * Can now accept a new property `asyncOptions` as well. See above for more details.
        * Code Example:
        ```javascript
        const { sections, layoutLoading, control, reset, handleSubmit } = useDynamicForm(layoutOptions, defaultValues, domainUrl, setModifying, asyncOptions);
        ```
    * Now has support for `mappedLabel` property on a field's layout when not overriding the async choice formatter

#### Components ####
* GenericForm
    * Can now accept a new property `asyncOptions` as well. See above for more details.
        * Code Example:
        ```HTML
        <GenericForm
          layoutOptions={layoutOptions}
          defaultValues={defaultValues}
          domainUrl={domainUrl}
          asyncOptions={asyncOptions}
        />
        ```

#### Storybook ####
* anyFieldStoryHelpers
    * AnyFieldStoryTemplate now adds a StoryInfoBlock component to the bottom of the template it generates for anyField stories.
        * This component allows developers to inject documentation directly into the story that can sit beside the story's component demonstration and provide information specific to how the demonstration works.
        * The StoryInfoBlock can be configured for the story by setting an `infoBlock` arg that provides the name of the infoblock the developer wants added to the template. The developer can also set an `infoBlockOptions` arg to pass data needed to setup the info block.
    * standardAnyFieldArgTypeConfiguration has been modified to hide controls for the following args on all anyField stories:
        * `infoBlock`
        * `infoBlockOptions`
    * standardAnyFieldSelectionArgTypeConfiguration has been modified to hide controls for the following on args on selection anyFields:
        * `url`
        * `disablePossibleChoices`
        * `possibleChoices` WHEN disablePossibleChoices is set to TRUE
    * urlSelectionAnyFieldsArgs object was created to provide the common args for all selection anyField stories where the data to supply the selection options is pulled from an external source.
    * Stopped setting default value for the possibleChoices property on the testSectionLayout object genereated by `loadArgsAndGetField` to supply the parseFormLayout function and generate the field object used to setup the test anyFields. Pulling data from an external source by setting the url property doesn't work if the possibleChoices property has a value. This makes it possible to null out the possibleChoices property and enable the data retrieval.
    * Created choice formatter to be supplied to the `parseFormLayout` call in `loadArgsAndGetField` so that retrieved data can be formatted properly for the url selection anyField stories.

* AnyFieldUrlSelectionStoryInfoBlock
    * Created info block to explain some of the data the new url selection anyField stories rely on for their demonstrations. This includes:
        * The url called to retrieve the external data from
        * The custom formatter used to properly handle the received data
        * An example of the data the url used responds with that is being processed by the custom formatter.
    * Info block also explains what the developer's options are for configuring the url selection anyField to handle the data it receives. It provides an example of what the custom formatter's function signature needs to be and explains each of the parameters it receives.

* StoryInfoBlock
    * Component that is used in the AnyFieldStoryTemplate provided by `anyfieldStoryHelpers`. This component allows developers to inject documentation into a story's component demonstration that can provide information about how the specific demonstration works.
    * This component is primarily a manager. It has an object that represents all of the info blocks it supports called `infoBlocks.` Developers can provide the name of the info block they want added to their story as a prop called `infoBlockName` to the component and StoryInfoBlock will provide the info block tied to the key in `infoBlocks` that matches `infoBlockName`. It will also pass whatever is set in the options prop down to whatever info block component is requested.
    * This component allows the AnyFieldStoryTemplate to stay generic and used across anyField stories. Stories can configure what info block they want, or whether they want an info block at all, by setting an arg rather than having a unique template for each story that specifies explicitly what info block component should be added.

* anyFieldCheckboxStories
    * Added stories that demonstrate the use of the checkbox components when supplying the data for their options from an external source.
    * These stories are configured using the new `urlSelectionAnyFieldArgs` objects set up in `anyFieldStoryHelpers`
    * Refactored some of what's set in `standardCheckboxAnyFieldArgs` to be covered in `standardSelectionAnyFieldArgs`

* anyFieldTypeAheadStories
    * Added stories that demonstrate the use of the type ahead dropdown components when supplying the data for their options from an external source.
    * These stories are configured using the new `urlSelectionAnyFieldArgs` objects set up in `anyFieldStoryHelpers`
    * Refactored some of what's set in `standardTypeAheadAnyFieldArgs` to be covered in `standardSelectionAnyFieldArgs`


## Release 0.6.0 - 1/26/23 ##
---

* Setup Storybook stories for various configurations of the anyField component for testing and to provide a reference for developers. AnyField stories are currently organized into 4 configuration families:
    * General Stories
    * Checkbox Stories
    * Type Ahead Dropdown Stories
    * Text Renderer Stories.

* Supported configurations include:
    * Date Field
    * Checkbox Choice Field
    * Checkbox Object Field
    * Type Ahead Choice Field
    * Type Ahead Object Field
    * Text Field
    * Long Text Field
    * Int Field
    * Float Field
    * Link Field

* Created a reference default layout object that can be fed into the `parseFormLayout` function to generate a field object that can supply an anyField component with the necessary values.
* Created a reference example args object that has every possible tweakable parameter set that can be used to create stories for anyField components.
* Created minimum character length verification in formHelpers. AnyField text renderer components now support minimum character length verification.
* Fix default value for anyField link components
* Fixed esLint
* Setup LocalizationProvider wrapper to support MUI Date Picker component. Configured it with AdapterDateFns
* Configured string validator to validate for leading or trailing whitespace.
* Fixed max value validation. Developers can now set a max value property to validate that a given float input is not greater than the value set.
* Refactored max length validation.
* Refactored integer digit length and float (decimal) digit length validation. Removed default validation values.
* Minor code cleanup in `formHelpers.js`
* Added onBlur check to anyField text fields to ensure validation works properly