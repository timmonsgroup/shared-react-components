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

export const DATE_MSG = 'Must be a valid date';

export const REQUIRED = 'required';
export const PLACEHOLDER = 'placeholder';
export const DISABLED = 'disabled';
export const ID_FIELD = 'idField';
export const LABEL_FIELD = 'labelField';
export const DEFAULT_VALUE = 'defaultValue';
export const TODAY_DEFAULT = 'today';
export const MAX_VALUE = 'maxValue';
export const MIN_VALUE = 'minValue';
export const MIN_VALUE_ERROR_TEXT = 'minValueErrorText';
export const MAX_LENGTH = 'maxLength';
export const MAX_VALUE_ERROR_TEXT = 'maxValueErrorText';
export const MIN_LENGTH = 'minLength';
export const TRIM_STRICT = 'enforceTrim';
export const NO_TRIM = 'noTrim';
export const EMAIL = 'email';
export const ZIP = 'zip';
export const PHONE = 'phone';
export const DISABLE_FUTURE = 'disableFuture';
export const DISABLE_FUTURE_ERROR_TEXT = 'disableFutureErrorText';

export const ANY_VALUE = 'anyValue';

export const CONDITIONAL_RENDER = Object.freeze({
  NO_TRIM,
  TRIM_STRICT,
  REQUIRED,
  LABEL_FIELD,
  ID_FIELD,
  PLACEHOLDER,
  DISABLED,
  DISABLE_FUTURE,
  MIN_VALUE,
  MAX_VALUE,
  DISABLE_FUTURE_ERROR_TEXT,
  MAX_VALUE_ERROR_TEXT,
  MIN_VALUE_ERROR_TEXT,
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
  NO_TRIM,
  TRIM_STRICT,
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
