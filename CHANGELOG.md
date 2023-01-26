# Change Log #


## Release 0.6.0 - 1/26/23 ##
---

* Setup Storybook stories for various configurations of the anyField component for testing and to provide developer reference. AnyField stories are currently organized into 4 configuration families:
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

* Created a default layout object that can be fed into the `parseFormLayout` function to generate a field object that can supply an anyField component with the necessary values for reference.
* Created an example args object that has every possible tweakable parameter set that can be used to create stories for anyField components for reference.
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