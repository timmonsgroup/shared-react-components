/** @module formHelpers */
import '../models/form';
import {
  dateStringNormalizer, functionOrDefault, isEmpty, isObject
} from '@timmons-group/shared-react-components';
import { CONDITIONAL_RENDER, FIELD_TYPES as FIELDS, DATE_MSG, VALIDATIONS } from '../constants';

import {
  string, array, date, number, object
} from 'yup';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * @constant {Object} VALID_PATTERNS - regex patterns for validating fields
 * @property {RegExp} PHONE - regex pattern for validating phone numbers
 * @property {RegExp} EMAIL - regex pattern for validating email addresses
 * @property {RegExp} ZIP - regex pattern for validating zip codes
 */
export const VALID_PATTERNS = Object.freeze({
  PHONE: /^$|^\d{3}-\d{3}-\d{4}$/,
  EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  ZIP: /^$|^\d{5}(-\d{4})?$/,
});

/**
 * Create a yup schema for a string field
 * @param {string} label
 * @param {boolean} [isRequired]
 * @param {string} [reqMessage]
 * @returns {YupSchema} - yup schema for the field
 */
export function yupString(label, isRequired, reqMessage) {
  const schema = string().label(label || 'This field');
  return isRequired ? schema.required(reqMessage) : schema.nullable();
}
/**
 * Create a yup schema for a date field
 * @param {string} label - label for the field
 * @param {boolean} [isRequired] - is the field required
 * @param {string} [msg] - message to display if the field is not a valid date
 * @param {string} [reqMessage] - message to display if the field is required
 * @returns {YupSchema} - yup schema for a date field
 */
export function yupDate(label, isRequired, msg = DATE_MSG, reqMessage) {
  // If you can't figure out why date validation is not working remove the "typeError(msg)" this will spit out more detail
  const schema = date()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .default(undefined)
    .typeError(msg)
    // value is the user's input as a date object
    // .test('formatted', msg, (value, context) => (
    //   !context || !context.originalValue ? true : validDateFormat(context.originalValue)
    // ))
    .label(label);
  return isRequired ? schema.required(reqMessage) : schema.nullable();
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
 * @param {Array<object>} [selections] - array of selected items
 * @returns {Array<{id: number}>} - array of selected items with id
 */
export function multiToPayload(selections) {
  return Array.isArray(selections) ? selections.map((id) => ({ id: parseInt(id, 10) })) : [];
}

/**
 * Create a yup schema for a typeahead field
 * @param {string} label - label for the field
 * @param {boolean} [isRequired] - is the field required
 * @param {string} [reqMessage] - message to display if the field is required
 * @returns {YupSchema} - yup schema for the field
 */
export function yupTypeAhead(label, isRequired, reqMessage) {
  return yupString(label, isRequired, reqMessage);
}

/**
 * Create a yup schema for a string field that ensures the value is trimmed
 * @param {string} label - label for the field
 * @param {boolean} [isRequired] - is the field required
 * @param {string} [trimMsg] - message to display if the field is not trimmed
 * @param {string} [reqMessage] - message to display if the field is required
 * @returns {YupSchema} - yup schema for the field
 */
export function yupTrimString(label, isRequired, trimMsg, reqMessage, moreThings) {
  // Add .strict(true); to the end of the function chain to error if leading and trailing spaces
  let schema = yupString(label, isRequired, reqMessage);
  if (!!moreThings?.[CONDITIONAL_RENDER.NO_TRIM]) {
    return schema;
  }

  schema = schema.trim(trimMsg || 'Remove leading and/or trailing spaces')
  if (!!moreThings?.[CONDITIONAL_RENDER.TRIM_STRICT]) {
    schema = schema.strict(true);
  }

  return schema;
}

/**
 * Create a yup schema for an integer field that checks max/min length
 * @param {string} label - label for the field
 * @param {boolean} [isRequired] - is the field required
 * @param {number} [maxLength] - max length of the field
 * @param {string} [msg] - message to display if the field is not an integer
 * @param {string} [reqMessage] - message to display if the field is required
 * @param {number} [minLength] - min length of the field
 * @param {number} [minValue] - min value of the field
 * @param {number} [maxValue] - max value of the field
 * @param {object} [options] - additional options for the field
 * @returns {YupSchema}
 */
export function yupInt(label, isRequired, maxLength, msg, reqMessage, minLength, minValue, maxValue, options = {}) {
  let schema = number().integer().label(label)
    .transform((curr, orig) => (orig === '' ? null : curr))
    .typeError(msg);

  // Check for and add tests max/min Length if needed
  schema = addMaxLength(schema, label, maxLength);
  schema = addMinLength(schema, label, minLength);
  // Make sure we pass in true for the isInt flag
  schema = addMaxValue(schema, label, maxValue, true, options?.maxValueErrorText);
  schema = addMinValue(schema, label, minValue, true, options?.minValueErrorText);

  return isRequired ? schema.required(reqMessage) : schema.nullable();
}

/**
 * Create a yup schema for a float field that checks max/min length
 * @param {string} label - label for the field
 * @param {boolean} [isRequired] - is the field required
 * @param {number} [int] - max number of integers
 * @param {number} [frac] - max number of decimals
 * @param {number} [maxLength] - max length of the field
 * @param {string} [msg] - message to display if the field is not in the correct format
 * @param {string} [maxValue] - max value of the field
 * @param {string} [reqMessage] - message to display if the field is required
 * @param {number} [minLength] - min length of the field
 * @param {number} [minValue] - min value of the field
 * @param {object} [options] - additional options for the field
 * @returns {YupSchema}
 */
export function yupFloat(label, isRequired, int = null, frac = null, maxLength, msg, maxValue, reqMessage, minLength, minValue, options = {}) {
  let formatMessage = isNaN(parseInt(int)) && isNaN(parseInt(frac)) ? 'Invalid number format' : msg;
  let schema = number().label(label)
    .transform((curr, orig) => (orig === '' ? null : curr))
    .typeError(formatMessage)
    .test('formatted', formatMessage, (value, context) => (
      !context?.originalValue ? true : validDoubleFormat(context.originalValue, int, frac)
    ));

  // Check for and add tests max/min Length if needed
  schema = addMaxLength(schema, label, maxLength);
  schema = addMinLength(schema, label, minLength);
  schema = addMaxValue(schema, label, maxValue, false, options?.maxValueErrorText);
  schema = addMinValue(schema, label, minValue, false, options?.minValueErrorText);

  return isRequired ? schema.required(reqMessage) : schema.nullable();
}

/**
 * Add a test to a yup schema to check the max value of a field
 * @param {YupSchema} schema - the schema to add the test to
 * @param {string} label - label for the field
 * @param {string|number}[maxValue - the max value the field can be
 * @param {boolean} [isInt] - should the test be for an integer or a float
 * @param {string} [errorMessage] - message to display if the field is greater than the max value
 * @function
 * @returns {YupSchema}
 */
const addMaxValue = (schema, label, maxValue, isInt, errorMessage) => {
  // Check if maxValue is a number
  const parsedMax = isInt ? parseInt(maxValue) : parseFloat(maxValue);
  const isNaNMax = isNaN(parsedMax);

  let message = errorMessage || `${label} cannot be greater than ${parsedMax}`;

  // maxValue seems to functionally be a boolean that flags that the value must be less than 1. Maybe we should rename this value? I thought it was a number we set saying the value can't be greater than it at first - Eric Schmiel 1/19/23
  if (!isNaNMax) {
    schema = schema.test('maxValue', message, (value, context) => {
      if (!context || !context.originalValue) {
        return true;
      }

      const ogValue = context.originalValue.toString();
      const currentValue = isInt ? parseInt(ogValue) : parseFloat(ogValue);
      return currentValue <= parsedMax;
    });
  }

  return schema;
};

/**
 * Add a test to a yup schema to check the min value of a field
 * @param {YupSchema} schema - the schema to add the test to
 * @param {string} label - label for the field
 * @param {string|number} minValue - the max value the field can be
 * @param {boolean} [isInt] - should the test be for an integer or a float
 * @param {string} [errorMessage] - custom error message to display
 * @function
 * @returns {YupSchema}
 */
const addMinValue = (schema, label, minValue, isInt, errorMessage) => {
  // Check if minValue is a number
  const parsedMin = isInt ? parseInt(minValue) : parseFloat(minValue);
  const isNaNMin = isNaN(parsedMin);
  const message = errorMessage || `${label} cannot be less than ${parsedMin}`;

  if (!isNaNMin) {
    schema = schema.test('minValue', message, (value, context) => {
      if (!context || !context.originalValue) {
        return true;
      }

      const ogValue = context.originalValue.toString();
      const currentValue = isInt ? parseInt(ogValue) : parseFloat(ogValue);

      return currentValue >= parsedMin;
    });
  }

  return schema;
};

/**
 * Create a yup schema for a currency field that checks max/min length
 * @param {string} label - label for the field
 * @param {boolean} [isRequired] - is the field required
 * @param {number} [maxLength] - max length of the field
 * @param {string} [msg] - message to display if the field is not formatted correctly
 * @param {string} [reqMessage] - message to display if the field is required
 * @param {number} [minLength] - min length of the field
 * @returns {YupSchema} - yup schema for a currency field
 */
export function yupCurrency(label, isRequired, maxLength, msg, reqMessage, minLength, maxValue, minValue) {
  // yup.number will coerce a string to a number so ".25" will become 0.25.
  // if it cannot coerce the typeError will be thrown (e.g. "1.2.3" or "abc" will throw a typeError)
  // We transform the value to null if it is an empty string so that we can use nullable
  let schema = number().label(label)
    .transform((curr, orig) => (orig === '' ? null : curr))
    .typeError(msg)
    .test('formatted', msg, (value, context) => (
      // If the originalValue is empty or null return true required or nullable will handle the rest
      // otherwise pass the transformed value to the validCurrencyFormat function
      !context || !context.originalValue ? true : validCurrencyFormat(value)
    ));

  // Check for and add tests max/min Length if needed
  schema = addMaxLength(schema, label, maxLength);
  schema = addMinLength(schema, label, minLength);
  schema = addMaxValue(schema, label, maxValue);
  schema = addMinValue(schema, label, minValue);

  return isRequired ? schema.required(reqMessage) : schema.nullable();
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
 * @param {object} moreThings - additional options for the field
 * @returns {YupSchema} - yup schema for a string field
 */
export function yupTrimStringMax(label, isRequired, maxLength, msg, reqMessage, minLength, moreThings) {
  let schema = yupTrimString(label, isRequired, msg, reqMessage, moreThings);
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
export function yupMultiselect(label, isRequired, reqMessage) {
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
    if (!Array.isArray(inData)) {
      return [];
    }

    return inData.map((con) => {
      if (isObject(con)) {
        return con?.id;
      }
      return con;
    });
  }

  if (isObject(inData)) {
    return inData?.id?.toString() || '';
  }

  return inData?.toString() || '';
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
  const schema = object().label(label);
  return isRequired ? schema.required(reqMessage) : schema.nullable();
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
  const absValue = Math.abs(value).toString();

  const re = new RegExp(`^\\d{0,${int}}(\\.\\d{0,${frac}})?$`).test(absValue);
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
export function createFieldValidation(type, label, validationMap, field) {
  let validation = null;
  const required = validationMap.get(VALIDATIONS.REQUIRED);
  const maxLength = validationMap.get(VALIDATIONS.MAX_LENGTH);
  const minLength = validationMap.get(VALIDATIONS.MIN_LENGTH);
  const maxValue = validationMap.get(VALIDATIONS.MAX_VALUE);
  const minValue = validationMap.get(VALIDATIONS.MIN_VALUE);
  const reqMessage = field?.render?.[CONDITIONAL_RENDER.REQ_TEXT];
  const disableFutureErrorText = field?.render?.[CONDITIONAL_RENDER.DISABLE_FUTURE_ERROR_TEXT];
  const maxValueErrorText = field?.render?.[CONDITIONAL_RENDER.MAX_VALUE_ERROR_TEXT];
  const minValueErrorText = field?.render?.[CONDITIONAL_RENDER.MIN_VALUE_ERROR_TEXT];
  const enforceTrim = validationMap.get(VALIDATIONS.TRIM_STRICT);
  switch (type) {
    case FIELDS.LONG_TEXT:
    case FIELDS.TEXT: {
      const moreThings = {
        [CONDITIONAL_RENDER.NO_TRIM]: validationMap.get(VALIDATIONS.NO_TRIM),
        [CONDITIONAL_RENDER.TRIM_STRICT]: enforceTrim
      };
      validation = yupTrimStringMax(label, required, maxLength, null, reqMessage, minLength, moreThings);

      const regexProps = validationMap.get(VALIDATIONS.REGEXP_VALIDATION);
      if (regexProps) {
        const { pattern, flags, errorMessage } = regexProps;

        if (pattern) {
          const regexp = new RegExp(pattern, flags);
          const matchOptions = {
            message: errorMessage || `Please enter a value that matches the regular expression: ${regexp}`,
            excludeEmptyString: true
          };
          validation = validation.matches(regexp, matchOptions);
        }
      }
      const isEmail = !!validationMap.get(VALIDATIONS.EMAIL);
      if (isEmail) {
        validation = validation.email('Please enter a valid email address');
      }
      // TODO: Rework to allow for custom regex via a field property
      // like field.render.validationRegex and field.render.validationMessage
      const isZip = !!validationMap.get(VALIDATIONS.ZIP);
      if (isZip) {
        validation = validation.matches(VALID_PATTERNS.ZIP, 'Please enter a valid zip code in the format of xxxxx or xxxxx-xxxx');
      }
      const isPhone = !!validationMap.get(VALIDATIONS.PHONE);
      if (isPhone) {
        validation = validation.matches(VALID_PATTERNS.PHONE, 'Please enter a valid phone number in the format of xxx-xxx-xxxx');
      }
      break;
    }
    case FIELDS.LINK: {
      validation = yupTrimStringMax(label, required, maxLength, null, reqMessage, minLength, { [CONDITIONAL_RENDER.TRIM_STRICT]: true });
      break;
    }
    case FIELDS.INT:
      validation = yupInt(
        label,
        required,
        maxLength,
        'Please enter an integer',
        reqMessage,
        minLength,
        minValue,
        maxValue,
        { maxValueErrorText, minValueErrorText }
      );
      break;
    case FIELDS.FLOAT: {
      const intD = validationMap.get(VALIDATIONS.INTEGER_DIGITS);
      const fracD = validationMap.get(VALIDATIONS.FRACTIONAL_DIGITS);

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
        minValue,
        { maxValueErrorText, minValueErrorText }
      );
      break;
    }
    case FIELDS.CURRENCY: {
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
    case FIELDS.DATE: {
      validation = yupDate(label, required, null, reqMessage);

      const disableFutureDates = !!validationMap.get(VALIDATIONS.DISABLE_FUTURE);
      if (disableFutureDates) {
        const today = new Date();
        validation = validation.max(today.toISOString(), disableFutureErrorText);
      } else if(!isEmpty(maxValue)) {
        const maxValueDate = new Date(dateStringNormalizer(maxValue));
        validation = validation.max(maxValueDate.toISOString(), maxValueErrorText ?? `Date cannot be after ${maxValueDate.toDateString()}`);
      }

      if (!isEmpty(minValue)) {
        const minValueDate = new Date(dateStringNormalizer(minValue));
        validation = validation.min(maxValueDate.toISOString(), minValueErrorText ?? `Date cannot be before ${minValueDate.toDateString()}`);
      }

      break;
    }

    // NOTE that Checkboxes are multi-selects, so we use the same validation
    case FIELDS.CHOICE:
    case FIELDS.OBJECT: {
      validation = (field?.render?.multiple ? yupMultiselect : yupTypeAhead)(label, required, reqMessage);
      break;
    }

    // case FIELDS.FLAG: {
    //   dynField.render.is = 'CheckBox';
    //   break;
    // }

    // TODO: Yes clusterfield I know you are here, but I don't know what to do with you yet
    case FIELDS.CLUSTER: {
      const subFieldValidations = {};
      // Loop through and extract the validations for each subfield
      field.subFields?.forEach((subF) => {
        subFieldValidations[subF.render?.name] = subF.validations;
      });
      // Create the validation for the cluster field which is an array of objects
      validation = array().label(label).of(object().shape(subFieldValidations).strict());
      if (required) {
        const minMessage = reqMessage ? reqMessage : `${label} must have at least one item`;
        validation = validation.min(1, minMessage);
      }
      break;
    }

    default:
      break;
  }

  return validation;
}


/**
 * Method to reduce the amount of boilerplate code needed to submit a form
 * @function
 * @async
 * @param {object} formData - data to submit
 * @param {boolean} isEdit - true if editing, false if creating
 * @param {SubmitOptions} options - options object
 * @returns {Promise<void>} - promise that resolves when the submit is complete
 */
export const attemptFormSubmit = async (formData, isEdit, {
  enqueueSnackbar, nav, onSuccess, onError, formatSubmitError, checkSuccess,
  unitLabel = 'Item', successUrl, submitUrl, setModifying,
  formatSubmitMessage, suppressSuccessToast, suppressErrorToast
}) => {
  if (!submitUrl) {
    console.warn('No submit url provided. Data to submit:', formData);
    return;
  }

  const successCheck = functionOrDefault(checkSuccess, (result) => result?.data?.streamID);
  const modifier = functionOrDefault(setModifying, null);
  const queueSnack = functionOrDefault(enqueueSnackbar, null);
  const successCall = functionOrDefault(onSuccess, null);
  const errorCall = functionOrDefault(onError, null);
  let errorSnackMessage = null;
  let successSnackMessage = null;
  if (queueSnack) {
    errorSnackMessage = functionOrDefault(formatSubmitError,
      (result, { isEdit, unitLabel, serverError }) => {
        let serverErrorMessage = result?.response?.data?.error;
        //check if the error message is an object
        // this is a failsafe in case the error message is an object.
        // The toast will break if it attempts to render an object (which is not a valid react child)
        if (isObject(serverErrorMessage)) {
          serverErrorMessage = Object.values(serverErrorMessage).join(', ');
        }
        return serverError && serverErrorMessage ? serverErrorMessage : `Error ${isEdit ? 'updating' : 'creating'} ${unitLabel}`;
      }
    );
    successSnackMessage = functionOrDefault(formatSubmitMessage, (result, { isEdit, unitLabel }) => `${unitLabel} successfully ${isEdit ? 'updated' : 'created'}`);
  }

  if (modifier) {
    modifier(true);
  }

  try {
    const result = await axios.post(submitUrl, formData);
    if (successCheck(result)) {
      if (!suppressSuccessToast && queueSnack) {
        queueSnack(successSnackMessage(result, { isEdit, unitLabel }), { variant: 'success' });
      }
      // If we have an onSuccess callback, call it otherwise navigate to the successUrl
      if (successCall) {
        successCall(result);
      } else {
        nav(successUrl);
        if (modifier) {
          modifier(false);
        }
        nav(successUrl);
      }
    } else {
      if (errorCall) {
        errorCall(result);
      } else if (modifier) {
        modifier(false);
      }

      if (!suppressErrorToast && queueSnack) {
        queueSnack(errorSnackMessage(result, { isEdit, unitLabel }), { variant: 'error' });
      }
    }
  } catch (error) {
    if (!suppressErrorToast && queueSnack) {
      // Sending a true flag to formatSubmitError indicates that the error came from the server
      const errorMsg = errorSnackMessage(error, { isEdit, unitLabel, serverError: true });

      queueSnack(errorMsg, { variant: 'error' });
    }

    if (errorCall) {
      errorCall(error);
    } else if (modifier) {
      modifier(false);
    }
  }
};


/**
 * Helper to create hook bits for form submit
 * @function
 * @returns {FormSubmitOptions}
 * @example
 * const { modifying, setModifying, nav, enqueueSnackbar } = useFormSubmit();
 */
export const useFormSubmit = () => {
  const { enqueueSnackbar } = useSnackbar();
  const nav = useNavigate();
  const [modifying, setModifying] = useState(false);

  return { modifying, setModifying, nav, enqueueSnackbar };
};

/**
 * Give an array of fields, create an array of rows with the fields give a column count
 * @param {ParsedField[]} fields
 * @param {number} columnCount
 * @returns {RowFields[]}
 */
export const createRowFields = (fields, columnCount, isInline) => {
  const rows = [];
  const cols = isInline ? 12 : columnCount || 1;
  let col = 1;
  let row = 1;
  //Create the rows
  fields.forEach((field) => {
    if (field.render.solitary && !isInline) {
      const rowObject = {
        fields: [field],
        solitary: true,
        size: field.render.singleColumnSize || 12,
        maxColumns: cols,
        isInline
      };
      rows.push(rowObject);
      row = rows.length;
      col = 1;
      return;
    }

    if (rows[row] === undefined) {
      rows[row] = { fields: [], maxColumns: cols };
    }
    rows[row].fields.push(field);
    col++;

    if (col > cols) {
      col = 1;
      row++;
    }
  });

  return rows;
};

export const checkConditional = (condition, fieldValue/* , indent = '' */) => {
  // console.log(indent, 'check condition', condition)
  const { value, operation/* , fieldId */ } = condition;
  // const fieldValue = data[fieldId];
  switch (operation) {
    case 'eq':
      return fieldValue === value;
    case 'neq':
      return fieldValue !== value;
    case 'gt':
      return parseFloat(fieldValue) > parseFloat(value);
    case 'gte':
      return parseFloat(fieldValue) >= parseFloat(value);
    case 'lt':
      return parseFloat(fieldValue) < parseFloat(value);
    case 'lte':
      return parseFloat(fieldValue) <= parseFloat(value);
    case 'contains':
      return fieldValue?.includes(value);
    case 'notContains':
      return !fieldValue?.includes(value);
    case 'startsWith':
      return fieldValue?.startsWith(value);
    case 'endsWith':
      return fieldValue?.endsWith(value);
    case 'regex':
      return new RegExp(value).test(fieldValue);
    case 'notRegex':
      return !new RegExp(value).test(fieldValue);
    case 'isNull':
      return fieldValue === null;
    case 'isNotNull':
      return fieldValue !== null;
  }
}

/**
 * The default choice formatter
 * @param {object} item
 * @param {object} [options] - options for the choice mapper
 * @param {string} [options.mappedId] - property to use when mapping the id
 * @param {string} [options.mappedLabel] - property to use when mapping the label
 * @returns {Array<object>}
 */
export function defaultChoiceFormatter(item, options) {
  const opt = item || {};
  const { mappedId, mappedLabel } = options || {};
  const id = mappedId && opt[mappedId] ? opt[mappedId] : opt.id || opt.streamID;
  const label = mappedLabel && opt[mappedLabel] ? opt[mappedLabel] : opt.name || opt.label;
  return { ...item, id, label };
}

/**
 * The default parser for fetching choices. Assumes data is an array of objects and a property on response
 * @param {object} res - response from the fetch
 * @param {object} [options] - options for the choice mapper
 * @param {string} [options.mappedId] - property to use when mapping the id
 * @param {string} [options.mappedLabel] - property to use when mapping the label
 * @returns {Array<object>}
 */
export function defaultChoiceMapper(res, options) {
  const { data } = res || {};
  return data?.map((opt) => {
    return defaultChoiceFormatter(opt, options);
  });
}
