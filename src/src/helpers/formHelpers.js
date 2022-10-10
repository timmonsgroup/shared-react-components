import { DATE_MSG } from '../constants';
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

/*
const schema = object().shape({
      projectName: yupTrimString('Project Name').max(50)
        .test('unique-name', 'Project Name already exists', () => checker.isValid()),
      type().when('isCreating', {
        is: () => editMode !== true,
        then: yupString('Project Type')
      }),
      region: yupMultiselect('Region'),
      subtype().when('hasSubs', {
        is: () => hasSubList.value === true,
        then: yupString('Project Subtype')
      }),
      checklistType().when('isCreating', {
        is: () => editMode !== true,
        then: yupString('Checklist Type')
      }),
      wsfr().required('You must select "Yes" or "No"').label('WSFR Status'),
      wsfrGrant().when('wsfr', {
        is: (value) => value === true,
        then: yupTrimString('WSFR Grant Number').nullable()
      }),
      projectLead: yupTypeAhead('Project Lead'),
      regionContacts: yupMultiselect('Region Contact'),
      property: array().when('isCreating', {
        is: () => editMode !== true,
        then: yupMultiselect('Property')
      }),
      // property().when('isCreating', {
      //   is: () => editMode !== true,
      //   then: yupTypeAhead('Property')
      // }),
      client: yupTypeAhead('Client'),
      contactName: yupTrimString('Contact Name'),
      clientAddress: yupTrimString('Mailing Address'),
      clientBillingAddress: yupTrimString('Billing Address', false),
      clientEmail: yupTrimString('Email Address'),
      clientPhone: yupTrimString('Phone Number'),
      projectDescription: yupTrimString('Project Description').max(500)
    });
*/