import { DATE_MSG, FIELD_TYPES as FIELDS, VALIDATIONS } from '../constants.js';
import { sortOn } from './helpers.js';
import {
  string, array, date, number, object
} from 'yup';

/**
 * Create a yup schema for a string field
 * @param {string} label
 * @param {boolean} isRequired
 * @param {string} reqMessage
 * @returns {YupSchema} - yup schema for the field
 */
export function yupString(label, isRequired = true, reqMessage) {
  const schema = string().label(label || 'This field');
  return isRequired ? schema.required(reqMessage) : schema;
}
/**
 * Create a yup schema for a date field
 * @param {*} label
 * @param {*} isRequired
 * @param {*} msg
 * @param {*} reqMessage
 * @returns {YupSchema} - yup schema for a date field
 */
export function yupDate(label, isRequired = false, msg = DATE_MSG, reqMessage) {
  // If you can't figure out why date validation is not working remove the "typeError(msg)" this will spit out more detail
  const schema = date()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .default(undefined)
    .typeError(msg)
    // value is the user's input as a date object
    // .test('formatted', msg, (value, context) => (
    //   !context || !context.originalValue ? true : validDateFormat(context.originalValue)
    // ))
    .nullable().label(label);
  return isRequired ? schema.required(reqMessage) : schema;
}

/**
 * Test the value to see if it is a valid date
 * @param {string} value
 * @returns {boolean} - true if the value is a valid date
 */
export function validDateFormat(value) {
  return new RegExp(/^\d{2}\/\d{2}\/\d{4}$/).test(value);
}

/**
 * Covert multiselect form input into an api ready array
 * @param {Array<object>} selections - array of selected items
 * @returns {Array<{id: number}>} - array of selected items with id
 */
export function multiToPayload(selections) {
  return Array.isArray(selections) ? selections.map((id) => ({ id: parseInt(id, 10) })) : [];
}

/**
 * Create a yup schema for a typeahead field
 * @param {string} label - label for the field
 * @param {boolean} isRequired - is the field required
 * @param {string} reqMessage - message to display if the field is required
 * @returns {YupSchema} - yup schema for the field
 */
export function yupTypeAhead(label, isRequired = true, reqMessage) {
  return yupString(label, isRequired, reqMessage).nullable();
}

/**
 * Create a yup schema for a string field that ensures the value is trimmed
 * @param {string} label - label for the field
 * @param {boolean} isRequired - is the field required
 * @param {string} trimMsg - message to display if the field is not trimmed
 * @param {string} reqMessage - message to display if the field is required
 * @returns {YupSchema} - yup schema for the field
 */
export function yupTrimString(label, isRequired = true, trimMsg, reqMessage) {
  return yupString(label, isRequired, reqMessage).trim(trimMsg || 'Remove leading and/or trailing spaces').strict(true);
}

/**
 * Create a yup schema for an integer field that checks max/min length
 * @param {string} label - label for the field
 * @param {boolean} isRequired - is the field required
 * @param {number} maxLength - max length of the field
 * @param {string} msg - message to display if the field is not an integer
 * @param {string} reqMessage - message to display if the field is required
 * @param {number} minLength - min length of the field
 * @returns {YupSchema}
 */
export function yupInt(label, isRequired = true, maxLength, msg, reqMessage, minLength) {
  let schema = number().integer().nullable().label(label)
    .transform((curr, orig) => (orig === '' ? null : curr))
    .typeError(msg);

  // Check for and add tests max/min Length if needed
  schema = addMaxLength(schema, label, maxLength);
  schema = addMinLength(schema, label, minLength);

  return isRequired ? schema.required(reqMessage) : schema;
}

/**
 * Create a yup schema for a float field that checks max/min length
 * @param {string} label - label for the field
 * @param {boolean} isRequired - is the field required
 * @param {number} int - max number of integers
 * @param {number} frac - max number of decimals
 * @param {number} maxLength - max length of the field
 * @param {string} msg - message to display if the field is not in the correct format
 * @param {string} maxValue - max value of the field
 * @param {string} reqMessage - message to display if the field is required
 * @param {number} minLength - min length of the field
 * @param {number} minValue - min value of the field
 * @returns {YupSchema}
 */
export function yupFloat(label, isRequired = true, int = null, frac = null, maxLength, msg, maxValue, reqMessage, minLength, minValue) {
  let formatMessage = isNaN(parseInt(int)) && isNaN(parseInt(frac)) ? 'Invalid number format' : msg;
  let schema = number().nullable().label(label)
    .transform((curr, orig) => (orig === '' ? null : curr))
    .typeError(formatMessage)
    .test('formatted', formatMessage, (value, context) => (
      !context || !context.originalValue ? true : validDoubleFormat(context.originalValue, int, frac)
    ));

  // Check for and add tests max/min Length if needed
  schema = addMaxLength(schema, label, maxLength);
  schema = addMinLength(schema, label, minLength);
  schema = addMaxValue(schema, label, maxValue);
  schema = addMinValue(schema, label, minValue);

  return isRequired ? schema.required(reqMessage) : schema;
}

const addMaxValue = (schema, label, maxValue) => {
  // Check if maxValue is a number
  const parsedMax = parseFloat(maxValue);
  const isNaNMax = isNaN(parsedMax);

  // maxValue seems to functionally be a boolean that flags that the value must be less than 1. Maybe we should rename this value? I thought it was a number we set saying the value can't be greater than it at first - Eric Schmiel 1/19/23
  if (!isNaNMax) {
    schema = schema.test('maxValue', `${label} cannot be greater than ${parsedMax}`, (value, context) => ( // Before my minor tweak, if any maxValue existed at all, this codeblock would fire
      !context || !context.originalValue ? true : parseFloat(context.originalValue.toString()) <= parsedMax
    ));
  }

  return schema;
};

const addMinValue = (schema, label, minValue) => {
  // Check if minValue is a number
  const parsedMin = parseFloat(minValue);
  const isNaNMin = isNaN(parsedMin);

  if (!isNaNMin) {
    schema = schema.test('minValue', `${label} cannot be less than ${parsedMin}`, (value, context) => ( // Before my minor tweak, if any maxValue existed at all, this codeblock would fire
      !context || !context.originalValue ? true : parseFloat(context.originalValue.toString()) >= parsedMin
    ));
  }

  return schema;
};

/**
 * Create a yup schema for a currency field that checks max/min length
 * @param {string} label - label for the field
 * @param {boolean} isRequired - is the field required
 * @param {number} maxLength - max length of the field
 * @param {string} msg - message to display if the field is not formatted correctly
 * @param {string} reqMessage - message to display if the field is required
 * @param {number} minLength - min length of the field
 * @returns {YupSchema} - yup schema for a currency field
 */
export function yupCurrency(label, isRequired = true, maxLength, msg, reqMessage, minLength, maxValue, minValue) {
  let schema = number().nullable().label(label)
    .transform((curr, orig) => (orig === '' ? null : curr))
    .typeError(msg)
    .test('formatted', msg, (value, context) => (
      !context || !context.originalValue ? true : validCurrencyFormat(context.originalValue)
    ));

  // Check for and add tests max/min Length if needed
  schema = addMaxLength(schema, label, maxLength);
  schema = addMinLength(schema, label, minLength);
  schema = addMaxValue(schema, label, maxValue);
  schema = addMinValue(schema, label, minValue);

  return isRequired ? schema.required(reqMessage) : schema;
}


/**
 * Add a min length test to a yup schema
 * @param {YupSchema} schema
 * @param {string} label
 * @param {number} minLength
 * @returns {YupSchema} - yup schema with a min length test
 */
function addMinLength(schema, label, minLength) {
  const pMin = parseInt(minLength);
  if (!isNaN(pMin)) {
    return schema.test('minLength', `${label} cannot be less than ${pMin} characters`, (value, context) => (
      !context || !context.originalValue ? true : context.originalValue.toString().length >= pMin
    ));
  }
  return schema;
}

/**
 * Add a max length test to a yup schema
 * @param {YupSchema} schema
 * @param {string} label
 * @param {number} maxLength
 * @returns {YupSchema} - yup schema with a max length test
 */
function addMaxLength(schema, label, maxLength) {
  const pMax = parseInt(maxLength);
  if (!isNaN(pMax)) {
    return schema.test('maxLength', `${label} cannot be more than ${pMax} characters`, (value, context) => (
      !context || !context.originalValue ? true : context.originalValue.toString().length <= pMax
    ));
  }
  return schema;
}

/**
 * Trim a string and check max/min and remove any leading or trailing spaces
 * @param {string} label - label for the field
 * @param {boolean} isRequired - is the field required
 * @param {number} maxLength - max length of the field
 * @param {string} msg - message to display if the field is not formatted correctly
 * @param {string} reqMessage - message to display if the field is required
 * @param {number} minLength - min length of the field
 * @returns {YupSchema} - yup schema for a string field
 */
export function yupTrimStringMax(label, isRequired = true, maxLength, msg, reqMessage, minLength) {
  let schema = yupTrimString(label, isRequired, msg, reqMessage);
  // Check for and add tests max/min Length if needed
  schema = addMaxLength(schema, label, maxLength);
  schema = addMinLength(schema, label, minLength);
  return schema;
}

/**
 * Create a yup schema for a multiselect field
 * @param {string} label - label for the field
 * @param {boolean} isRequired - is the field required
 * @param {string} reqMessage - message to display if the field is required
 * @returns {YupSchema} - yup schema for a string field
 */
export function yupMultiselect(label, isRequired = true, reqMessage) {
  const message = reqMessage || 'Please select at least one item';
  const schema = array().label(label || 'This field');
  return isRequired ? schema.required(message).min(1, message) : schema;
}

/**
 * Extract the id of the selected item from the data
 * @param {boolean} multiple - is the field a multiselect
 * @param {object} inData - data to be extracted and formatted
 * @returns {string} - string of the id of the selected item or array of ids of selected items
 */
export function getSelectValue(multiple, inData) {
  if (multiple) {
    return sortOn((inData)).map((con) => con?.id.toString());
  }

  return (inData)?.id?.toString() || '';
}

/**
 * Create a yup schema for a generic or custom object field
 * @param {string} label - label for the field
 * @param {boolean} isRequired - is the field required
 * @param {string} reqMessage - message to display if the field is required
 * @returns {YupSchema} - yup schema for an object field
 */
export function yupObject(label, isRequired = false, reqMessage) {
  // Need nullable to avoid type error on 'object' even if required
  const schema = object().label(label).nullable();
  return isRequired ? schema.required(reqMessage) : schema;
}

/**
 * Return whether or not the value is a valid currency format
 * @param {string} value
 * @returns {boolean} - true if the value is a valid currency format
 */
export function validCurrencyFormat(value) {
  return new RegExp(/^-?\d+\.?\d{0,2}$/).test(value);
}

/**
 * Format validation for a double value
 * if i and f are not passed in, the default is 4 digits before and 4 digits after the decimal
 * if i or f are passed in and are not numbers, the default is 999999999 digits before and after the decimal
 * @param {number} value
 * @param {number} i - number of digits before decimal
 * @param {number} f - number of digits after decimal
 * @returns {boolean} - true if the value is a valid double format
 */
export function validDoubleFormat(value, i = 4, f = 4) {
  const pInt = parseInt(i);
  const pFrac = parseInt(f);

  // If one or both of the values are not numbers, set them to an arbitrary digit value
  const int = isNaN(pInt) ? 999999999 : pInt;
  const frac = isNaN(pFrac) ? 999999999 : pFrac;

  const re = new RegExp(`^\\d{0,${int}}(\\.\\d{0,${frac}})?$`).test(value);
  return re;
}

/**
 * Create a yup schema for a given field type
 * @param {number} type
 * @param {string} label
 * @param {Map} validationMap
 * @param {object} field
 * @returns {YupSchema} - yup schema for a field
 */
export function createFieldValidation (type, label, validationMap, field) {
  let validation = null;
  const required = validationMap.get(VALIDATIONS.REQUIRED);
  const maxLength = validationMap.get(VALIDATIONS.MAX_LENGTH);
  const minLength = validationMap.get(VALIDATIONS.MIN_LENGTH);
  const reqMessage = field?.render?.requiredErrorText;

  switch (type) {
    case FIELDS.LONG_TEXT:
    case FIELDS.TEXT:
    case FIELDS.LINK:
      validation = yupTrimStringMax(label, required, maxLength, null, reqMessage, minLength);
      break;
    case FIELDS.INT:
      validation = yupInt(
        label,
        required,
        maxLength,
        'Please enter an integer',
        reqMessage,
        minLength
      );
      break;
    case FIELDS.FLOAT: {
      const intD = validationMap.get(VALIDATIONS.INTEGER_DIGITS);
      const fracD = validationMap.get(VALIDATIONS.FRACTIONAL_DIGITS);
      const maxValue = validationMap.get(VALIDATIONS.MAX_VALUE);
      const minValue = validationMap.get(VALIDATIONS.MIN_VALUE);

      validation = yupFloat(
        label,
        required,
        intD,
        fracD,
        maxLength,
        intD
          ? `Please enter a number, with up to ${intD} digits and an optional decimal of up to ${fracD} digits`
          : `Please enter a decimal of up to ${fracD} digits`,
        maxValue,
        reqMessage,
        minLength,
        minValue
      );
      break;
    }
    case FIELDS.CURRENCY: {
      const maxValue = validationMap.get(VALIDATIONS.MAX_VALUE);
      const minValue = validationMap.get(VALIDATIONS.MIN_VALUE);

      validation = yupCurrency(
        label,
        required,
        maxLength,
        'Please enter a valid dollar amount, with an optional decimal of up to two digits for cents; e.g., 1234.56',
        reqMessage,
        minLength,
        maxValue,
        minValue
      );
      break;
    }
    case FIELDS.DATE:
      validation = yupDate(label, required, null, reqMessage);
      break;

    // NOTE that Checkboxes are multi-selects, so we use the same validation
    case FIELDS.CHOICE:
    case FIELDS.OBJECT: {
      validation = (field?.render?.multiple ? yupMultiselect : yupTypeAhead)(label, required, reqMessage).nullable();
      break;
    }

    // case FIELDS.FLAG: {
    //   dynField.render.is = 'CheckBox';
    //   break;
    // }

    // TODO: Yes clusterfield I know you are here, but I don't know what to do with you yet
    // case FIELDS.CLUSTER: {
    //   dynField.render.is = 'ClusterField';
    //   // Loop through and process fields tied to the cluster.
    //   const subFieldValidations = {};
    //   const subFields = field.layout?.map((subF) => {
    //     const { field: subField, validation: subValid } = getStructure(subF);
    //     if (subF.model) {
    //       const subName = subF.model?.name || 'unknownSub';
    //       if (subValid) {
    //         subFieldValidations[subName] = subValid;
    //       }
    //     }
    //     return subField;
    //   });
    //   dynField.render.fields = subFields;
    //   validation = array().of(object().shape(subFieldValidations).strict());
    //   break;
    // }

    default:
      break;
  }

  return validation;
}