import { DATE_MSG, FIELD_TYPES as FIELDS, VALIDATIONS } from '../constants';
import { sortOn } from './helpers';
import {
  string, array, date, number, object
} from 'yup';

export function yupString(label, isRequired = true) {
  const schema = string().label(label || 'This field');
  return isRequired ? schema.required() : schema;
}

export function yupDate(label, isRequired = false, msg = DATE_MSG) {
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
  return isRequired ? schema.required() : schema;
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

export function yupTypeAhead(label, isRequired = true) {
  return yupString(label, isRequired).nullable();
}

export function yupTrimString(label, isRequired = true, msg) {
  // use .strict(false) if submit logic / api will not trim values
  return yupString(label, isRequired).trim(msg || 'Remove leading and/or trailing spaces');
}

export function yupInt(label, isRequired = true, maxLength, msg) {
  let schema = number().integer().nullable().label(label)
    .transform((curr, orig) => (orig === '' ? null : curr))
    .typeError(msg);

  // Add another test if maxLength is passed in
  if (maxLength) {
    schema = schema.test('maxLength', `${label} cannot be more than ${maxLength} characters`, (value, context) => (
      !context || !context.originalValue ? true : context.originalValue.toString().length <= maxLength
    ));
  }

  return isRequired ? schema.required() : schema;
}
export function yupFloat(label, isRequired = true, int = 5, frac = 2, maxLength, msg, maxValue) {
  let schema = number().nullable().label(label)
    .transform((curr, orig) => (orig === '' ? null : curr))
    .typeError(msg)
    .test('formatted', msg, (value, context) => (
      !context || !context.originalValue ? true : validDoubleFormat(context.originalValue, int, frac)
    ));

  // Add another test if maxLength is passed in
  if (maxLength) {
    schema = schema.test('maxLength', `${label} cannot be more than ${maxLength} characters`, (value, context) => (
      !context || !context.originalValue ? true : context.originalValue.toString().length <= maxLength
    ));
  }

  if (maxValue !== null && maxValue !== undefined) {
    schema = schema.test('maxValue', `${label} cannot be greater than 1`, (value, context) => (
      !context || !context.originalValue ? true : parseFloat(context.originalValue.toString()) <= 1
    ));
  }

  return isRequired ? schema.required() : schema;
}

export function yupCurrency(label, isRequired = true, maxLength, msg) {
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

  return isRequired ? schema.required() : schema;
}

export function yupTrimStringMax(label, isRequired = true, maxLength, msg) {
  // use .strict(false) if submit logic / api will not trim values
  const schema = yupTrimString(label, isRequired, msg);
  return maxLength ? schema.max(maxLength) : schema;
}

export function yupMultiselect(label, isRequired = true) {
  const message = `Please select at least one ${label || 'item'}`;
  const schema = array().label(label || 'This field');
  return isRequired ? schema.required(message).min(1, message) : schema;
}

export function getSelectValue(multiple, inData) {
  if (multiple) {
    return sortOn((inData)).map((con) => con?.id.toString());
  }

  return (inData)?.id?.toString() || '';
}

export function yupObject(label, isRequired = false) {
  // Need nullable to avoid type error on 'object' even if required
  const schema = object().label(label).nullable();
  return isRequired ? schema.required() : schema;
}

export function validCurrencyFormat(value) {
  return new RegExp(/^-?\d+\.?\d{0,2}$/).test(value);
}

export function validDoubleFormat(value, int = 4, frac = 4) {
  return new RegExp(`^\\d{0,${int}}(\\.\\d{0,${frac}})?$`).test(value);
}

export const createFieldValidation = (type, label, validationMap) => {
  let validation = null;
  const required = validationMap.get(VALIDATIONS.REQUIRED);
  const maxLength = validationMap.get(VALIDATIONS.MAX_LENGTH);

  switch (type) {
    case FIELDS.LONG_TEXT:
      validation = yupTrimStringMax(label, required, maxLength);
      break;
    case FIELDS.TEXT:

      validation = yupTrimStringMax(label, required, maxLength);
      break;
    case FIELDS.INT:
      validation = yupInt(
        label,
        required,
        maxLength,
        'Please enter an integer'
      );
      break;
    case FIELDS.FLOAT: {
      const intD = validationMap.get(VALIDATIONS.INTEGER_DIGITS);
      const fracD = validationMap.get(VALIDATIONS.FRACTIONAL_DIGITS);
      validation = yupFloat(
        label,
        required,
        intD,
        validationMap.get(VALIDATIONS.FRACTIONAL_DIGITS),
        maxLength,
        intD
          ? `Please enter a number, with up to ${intD} digits and an optional decimal of up to ${fracD} digits`
          : `Please enter a decimal of up to ${fracD} digits`,
        validationMap.get(VALIDATIONS.MAX_VALUE),
      );
      break;
    }
    case FIELDS.CURRENCY:
      validation = yupCurrency(
        label,
        required,
        maxLength,
        'Please enter a valid dollar amount, with an optional decimal of up to two digits for cents; e.g., 1234.56'
      );
      break;

    case FIELDS.DATE:
      validation = yupDate(label, required);
      break;

    case FIELDS.CHOICE:
    case FIELDS.OBJECT: {
      // validation = (model.multiple ? yupMultiselect : yupTypeAhead)(label, required);
      validation = yupTypeAhead(label, required);
      break;
    }

    case FIELDS.CHECKBOX: {
      validation = yupMultiselect(label, required).nullable();
      break;
    }

    // case FIELDS.FLAG: {
    //   dynField.render.is = 'CheckBox';
    //   break;
    // }

    case FIELDS.LINK: {
      validation = yupTrimStringMax(label, required, maxLength);
      break;
    }

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
