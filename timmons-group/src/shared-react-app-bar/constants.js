export const AUTH_STATES = Object.freeze({
  INITIALIZING: 'INITIALIZING',
  LOGGED_OUT: 'LOGGED_OUT',
  LOGGING_IN: 'LOGGING_IN',
  LOGGED_IN: 'LOGGED_IN',
  TOKEN_STALE: 'TOKEN_STALE',
  REFRESHING_TOKEN: 'REFRESHING_TOKEN',
  ERROR: 'ERROR'
});

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

export const GRID_ACTION_TYPE = Object.freeze({
  ADD: 'add',
  EDIT: 'edit',
  DELETE: 'delete',
  VIEW: 'view',
  CUSTOM: 'custom'
});

export const STATIC_TYPES = Object.freeze({
  HEADER: 'header',
  TEXT: 'text',
  DIVIDER: 'divider',
  COMPONENT: 'component',
  IMAGE: 'image',
});

export const REQUIRED = 'required';
export const PLACEHOLDER = 'placeholder';
export const DISABLED = 'disabled';
export const ID_FIELD = 'idField';
export const LABEL_FIELD = 'labelField';
export const DEFAULT_VALUE = 'defaultValue';
export const TODAY_DEFAULT = 'today';
export const MAX_VALUE = 'maxValue';
export const MIN_VALUE = 'minValue';
export const MAX_LENGTH = 'maxLength';
export const MIN_LENGTH = 'minLength';
export const EMAIL = 'email';
export const ZIP = 'zip';
export const PHONE = 'phone';
export const DISABLE_FUTURE = 'disableFuture';
export const DISABLE_FUTURE_ERROR_TEXT = 'disableFutureErrorText';

export const ANY_VALUE = 'anyValue';

export const CONDITIONAL_RENDER = Object.freeze({
  REQUIRED,
  LABEL_FIELD,
  ID_FIELD,
  PLACEHOLDER,
  DISABLED,
  DISABLE_FUTURE,
  DISABLE_FUTURE_ERROR_TEXT,
  READ_ONLY: 'readOnly',
  URL: 'url',
  RENDER_PROPERTY_ID: 'renderPropertyId',
  HIDDEN: 'hidden',
  HELPER: 'helperText',
  ICON_HELPER: 'iconHelperText',
  ALT_HELPER: 'altHelperText',
  REQ_TEXT: 'requiredErrorText'
});

export const SPECIAL_ATTRS = Object.freeze({
  ID_FIELD,
  LABEL_FIELD
});

export const VALIDATIONS = Object.freeze({
  REQUIRED,
  INTEGER_DIGITS: 'integerDigits',
  FRACTIONAL_DIGITS: 'fractionalDigits',
  MAX_VALUE,
  MIN_VALUE,
  MAX_LENGTH,
  MIN_LENGTH,
  EMAIL,
  PHONE,
  ZIP,
  DISABLE_FUTURE,
  REGEXP_VALIDATION: 'regexpValidation',
});
