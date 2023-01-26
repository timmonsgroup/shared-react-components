import { DATE_MSG, FIELD_TYPES as FIELDS, VALIDATIONS } from '../constants.js';
import { sortOn } from './helpers.js';
import {
  string, array, date, number, object
} from 'yup';

export function yupString(label, isRequired = true, reqMessage) {
  const schema = string().label(label || 'This field');
  return isRequired ? schema.required(reqMessage) : schema;
}

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

export function validDateFormat(value) {
  return new RegExp(/^\d{2}\/\d{2}\/\d{4}$/).test(value);
}

/**
 * Covert multiselect form input into an api ready array
 * @param selections
 * @returns array of {id: number} objects
 */
export function multiToPayload(selections) {
  return Array.isArray(selections) ? selections.map((id) => ({ id: parseInt(id, 10) })) : [];
}

export function yupTypeAhead(label, isRequired = true, reqMessage) {
  return yupString(label, isRequired, reqMessage).nullable();
}

export function yupTrimString(label, isRequired = true, trimMsg, reqMessage) {
  return yupString(label, isRequired, reqMessage).trim(trimMsg || 'Remove leading and/or trailing spaces').strict(true);
}

export function yupInt(label, isRequired = true, maxLength, msg, reqMessage) {
  let schema = number().integer().nullable().label(label)
    .transform((curr, orig) => (orig === '' ? null : curr))
    .typeError(msg);

  // Add another test if maxLength is passed in
  if (maxLength) {
    schema = schema.test('maxLength', `${label} cannot be more than ${maxLength} characters`, (value, context) => (
      !context || !context.originalValue ? true : context.originalValue.toString().length <= maxLength
    ));
  }

  return isRequired ? schema.required(reqMessage) : schema;
}
export function yupFloat(label, isRequired = true, int = null, frac = null, maxLength, msg, maxValue, reqMessage) {
  let formatMessage = isNaN(parseInt(int)) && isNaN(parseInt(frac)) ? 'Invalid number format' : msg;
  let schema = number().nullable().label(label)
    .transform((curr, orig) => (orig === '' ? null : curr))
    .typeError(formatMessage)
    .test('formatted', formatMessage, (value, context) => (
      !context || !context.originalValue ? true : validDoubleFormat(context.originalValue, int, frac)
    ));

  // Add another test if maxLength is passed in
  if (maxLength) {
    schema = schema.test('maxLength', `${label} cannot be more than ${maxLength} characters`, (value, context) => (
      !context || !context.originalValue ? true : context.originalValue.toString().length <= maxLength
    ));
  }

  // Check if maxValue is a number
  const parsedMax = parseFloat(maxValue);
  const isNaNMax = isNaN(parsedMax);

  if (!isNaNMax) {
    schema = schema.test('maxValue', `${label} cannot be greater than ${parsedMax}`, (value, context) => (
      !context || !context.originalValue ? true : parseFloat(context.originalValue.toString()) <= parsedMax
    ));
  }

  return isRequired ? schema.required(reqMessage) : schema;
}

export function yupCurrency(label, isRequired = true, maxLength, msg, reqMessage) {
  let schema = number().nullable().label(label)
    .transform((curr, orig) => (orig === '' ? null : curr))
    .typeError(msg)
    .test('formatted', msg, (value, context) => (
      !context || !context.originalValue ? true : validCurrencyFormat(context.originalValue)
    ));

  // Add another test if maxLength is passed in
  if (maxLength) {
    schema = schema.test('maxLength', `${label} cannot be more than ${maxLength} characters`, (value, context) => (
      !context || !context.originalValue ? true : context.originalValue.toString().length <= maxLength
    ));
  }

  return isRequired ? schema.required(reqMessage) : schema;
}

export function yupTrimStringMax(label, isRequired = true, maxLength, msg, reqMessage) {
  const schema = yupTrimString(label, isRequired, msg, reqMessage);
  return maxLength ? schema.max(maxLength) : schema;
}

export function yupMultiselect(label, isRequired = true, reqMessage) {
  const message = reqMessage || 'Please select at least one item';
  const schema = array().label(label || 'This field');
  return isRequired ? schema.required(message).min(1, message) : schema;
}

export function getSelectValue(multiple, inData) {
  if (multiple) {
    return sortOn((inData)).map((con) => con?.id.toString());
  }

  return (inData)?.id?.toString() || '';
}

export function yupObject(label, isRequired = false, reqMessage) {
  // Need nullable to avoid type error on 'object' even if required
  const schema = object().label(label).nullable();
  return isRequired ? schema.required(reqMessage) : schema;
}

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
 * @returns boolean
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

export const createFieldValidation = (type, label, validationMap, field) => {
  let validation = null;
  const required = validationMap.get(VALIDATIONS.REQUIRED);
  const maxLength = validationMap.get(VALIDATIONS.MAX_LENGTH);
  const reqMessage = field?.render?.requiredErrorText;

  switch (type) {
    case FIELDS.LONG_TEXT:
    case FIELDS.TEXT:
    case FIELDS.LINK:
      validation = yupTrimStringMax(label, required, maxLength, null, reqMessage);
      break;
    case FIELDS.INT:
      validation = yupInt(
        label,
        required,
        maxLength,
        'Please enter an integer',
        reqMessage
      );
      break;
    case FIELDS.FLOAT: {
      const intD = validationMap.get(VALIDATIONS.INTEGER_DIGITS);
      const fracD = validationMap.get(VALIDATIONS.FRACTIONAL_DIGITS);
      const maxValue = validationMap.get(VALIDATIONS.MAX_VALUE);

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
        reqMessage
      );
      break;
    }
    case FIELDS.CURRENCY:
      validation = yupCurrency(
        label,
        required,
        maxLength,
        'Please enter a valid dollar amount, with an optional decimal of up to two digits for cents; e.g., 1234.56',
        reqMessage
      );
      break;

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