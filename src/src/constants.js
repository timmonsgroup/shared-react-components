export const AUTH_STATES = Object.freeze({
  INITIALIZING: 'INITIALIZING',
  LOGGED_OUT: 'LOGGED_OUT',
  LOGGING_IN: 'LOGGING_IN',
  LOGGED_IN: 'LOGGED_IN',
  TOKEN_STALE: 'TOKEN_STALE',
  REFRESHING_TOKEN: 'REFRESHING_TOKEN',
  ERROR: 'ERROR'
});
export const DATE_MSG = 'Must be a valid date';

export const DATA_STATES = Object.freeze({
  IDLE: 0,
  LOADING: 1,
  LOADED: 2,
  ERROR: 3
});

export const ACLS = Object.freeze({
  SIGN_IN: 'Can Sign In',
  HELP: 'Can See Help',
  DEVELOPER: 'DEVELOPER'
});

export const FIELD_TYPES = Object.freeze({
  TEXT: 0,
  LONG_TEXT: 1,
  INT: 2,
  FLOAT: 3,
  CURRENCY: 4,
  DATE: 5,
  FLAG: 6,
  CHOICE: 7,
  OBJECT: 10,
  // BYNAMEOBJECTREFERENCE: 11,
  SPATIAL: 20,
  LINK: 100,
  CLUSTER: 120,
  NONE: 999
});

export const REQUIRED = 'required';
export const IDFIELD = 'idField';
export const LABELFIELD = 'labelField';

export const CONDITIONAL_RENDER = Object.freeze({
  REQUIRED,
  IDFIELD,
  URL: 'url',
  DISABLED: 'disabled',
  HIDDEN: 'hidden',
  HELPER: 'helperText',
  REQTEXT: 'requiredErrorText',
});

export const SPECIAL_ATTRS = Object.freeze({
  IDFIELD,
  LABELFIELD
});

export const VALIDATIONS = Object.freeze({
  REQUIRED,
  INTEGER_DIGITS: 'integerDigits',
  FRACTIONAL_DIGITS: 'fractionalDigits',
  MAX_VALUE: 'maxValue',
  MAX_LENGTH: 'maxLength',
  MIN_LENGTH: 'minLength'
});
