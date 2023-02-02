# Change Log #


## Release 0.6.1 - 2/--/23 ##
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