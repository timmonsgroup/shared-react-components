/**
 * @typedef {Object} ParsedFormLayout
 * @property {Array<ParsedSection>} sections - array of parsed sections
 * @property {Map<String, Object>} fields - map of fieldId to field object
 * @property {Map<String, Object>} triggerFields - map of fieldId to field object
 */

/**
 * @typedef {Object} ParsedSection
 * @property {string} name - section name (title and name are both used for backwards compatibility)
 * @property {string} title - section title
 * @property {Array<ParsedField>} fields - array of field objects
 * @property {boolean} editable - if the section is editable
 * @property {Array} enabled - if the section is enabled
 * @property {number} order - order of the section
 */

/**
 * @typedef {object} ParsedField
 * @property {string} id - field id
 * @property {string} label - field label
 * @property {string} type - field type
 * @property {boolean} hidden - if the field is hidden
 * @property {Array} conditions - if the field is hidden
 * @property {object} specialProps - special props for the field
 * @property {object} [defaultValue] - default value for the field
 * @property {object} [modelData] - model data for the field (found on the model.data)
 * @property {Array<ParsedField>} [subFields] - subFields for the field if its type is FIELD_TYPES.CLUSTER (i.e. 100)
 * @property {FieldRenderProps} render - render props for the field
 */

/**
 * @typedef {object} FieldRenderProps
 * @property {string} type - field type
 * @property {string} label - field label
 * @property {string} name - field name
 * @property {boolean} hidden - if the field is hidden
 * @property {boolean} [required] - if the field is required
 * @property {boolean} disabled - if the field is disabled
 * @property {string} iconHelperText - icon helper text
 * @property {string} helperText - helper text
 * @property {string} requiredErrorText - required error text
 * @property {boolean} readOnly - if the field is read only
 * @property {boolean} [multiple] - if the field is multiple
 * @property {string} [placeholder] - placeholder text
 * @property {object} linkFormat - link format
 * @property {Array<object>} [choices] - choices for the field
 * @property {YupSchema} validations - validations for the field
 */

/**
 * @typedef {object} SubmitOptions
 * @property {function} enqueueSnackbar - function to enqueue a snackbar
 * @property {function} nav - function to navigate to a url
 * @property {function} onSuccess - function to call on successful submit (if provided will NOT call setModifying OR nav)
 * @property {function} formatSubmitError - function to format the error message
 * @property {function} checkSuccess - function to check if the submit was successful
 * @property {function} onError - function to call on error (if provided will NOT call setModifying)
 * @property {string} unitLabel - label for the unit being submitted
 * @property {string} successUrl - url to navigate to on success
 * @property {string} submitUrl - url to submit to
 * @property {function} setModifying - function to set the modifying state
 * @property {function} formatSubmitMessage - function to format the success message
 * @property {boolean} suppressSuccessToast - true to suppress the success toast
 * @property {boolean} suppressErrorToast - true to suppress the error toast *
 */

/**
 * @typedef {object} FormSubmitOptions
 * @property {function} enqueueSnackbar - function to enqueue a snackbar
 * @property {function} nav - function to navigate to a url
 * @property {boolean} modifying - true if the form is currently being modified
 * @property {function} setModifying - function to set the modifying state
 */

/**
 * @typedef {object} RowFields
 * @property {ParsedField[]} fields - array of fields in the row
 * @property {number} size - column size of the row (12 is full width, 6 is half width, etc)
 * @property {number} maxColumns - maximum number of columns in the row
 * @property {boolean} solitary - true if the row is a solitary field
 * @property {boolean} isInline - true if the row is an inline field
 */