# Change Log #


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