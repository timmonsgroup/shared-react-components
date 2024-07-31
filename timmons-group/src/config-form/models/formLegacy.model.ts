/**
 * @fileoverview Legacy form model types
 * @typedef {object} LegacyLayoutField
 * @property {string} path - field path
 */
import { FIELD_TYPES, MAX_VALUE_ERROR_TEXT, MIN_VALUE_ERROR_TEXT } from '../constants';
import { Conditional, When } from './formFields.model';
export type FieldIntTypes = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 10 | 100 | 120 | 999;

export type LegacyParsedSection = {
  name?: string;
  title?: string;
  fields: string[];
  editable?: boolean;
  enabled?: boolean;
  order?: number;
  description?: string;
}

export type LegacyLayoutField = {
  path: string;
  type: FieldIntTypes;
  label: string;
  model: {
    id?: string | number;
    name: string;
    type: FieldIntTypes;
    data?: Record<string, any>;
  };
  solitary?: boolean;
  singleColumnSize?: string | number;
  inline?: boolean;
  emptyMessage?: string;
  required?: boolean;
  requiredErrorText?: string;
  disableFuture?: boolean;
  disableFutureErrorText?: string;
  minValue?: number;
  conditions?: Array<LegacyCondition | Condition>;
  conditionals?: Array<Conditional>;
  hidden?: boolean;
  multiple?: boolean;
  checkbox?: boolean;
  linkFormat?: string;
  zip?: boolean;
  email?: boolean;
  phone?: boolean;
  url?: string;
  possibleChoices?: Array<Record<string, any>>;
  //Clusterfield crap
  addLabel?: string;
  removeLabel?: string;
  clusterColumnCount?: number;
  layout?: Array<LegacyLayoutField>;
}

export type LegacyParsedFormField = {
  id: string;
  path: string;
  label: string;
  type: FieldIntTypes;
  hidden: boolean;
  conditions?: Array<LegacyCondition | Condition>;
  conditionals?: Conditional[];
  specialProps?: Record<string, any>;
  defaultValue?: Record<string, any>;
  modelData?: Record<string, any>;
  render: LegacyFieldRender;
  subFields?: LegacyParsedFormField[];
  validations?: Record<string, any>;
}

export type LegacyFieldRender =
  LegacyBaseFieldRenderProps | LegacyDropdownRenderProps | LegacyDateRenderProps | LegacyLongTextRenderProps
  | LegacyTextRenderProps | LegacyClusterRenderProps;

export type LegacyBaseFieldRenderProps = {
  type: FieldIntTypes;
  label: string;
  name: string;
  placeholder?: string;
  idField?: string;
  hidden?: boolean;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  // GemericConfigForm specific props
  inline?: boolean; // used for rendering fields in GemericConfigForm
  solitary?: boolean; // used to set a field as the only field in a row in GenericConfigForm
  singleColumnSize?: string | number; // if field is solitary use this grid size (grid 12)

  // I think it is possible for a field to change its type conditionally thus the need for this
  // TODO: Be less dumb in v2 or whatever
  choices?: Array<Record<string, any>>;
  url?: string;

  minValue?: number;
  [MIN_VALUE_ERROR_TEXT]?: string;
  maxValue?: number;
  [MAX_VALUE_ERROR_TEXT]?: string;
  minLength?: number;
  maxLength?: number;

  emptyMessage?: string;
  iconHelperText?: string;
  altHelperText?: string;
  helperText?: string;
  requiredErrorText?: string;
  linkFormat?: string;
}

export type LegacyDropdownRenderProps = LegacyBaseFieldRenderProps & {
  type: typeof FIELD_TYPES['CHOICE'] | typeof FIELD_TYPES['OBJECT'];
  multiple?: boolean;
  checkbox?: boolean;
}

export type LegacyDateRenderProps = LegacyBaseFieldRenderProps & {
  disableFuture?: boolean;
  disableFutureErrorText?: string;
}

export type LegacyLongTextRenderProps = LegacyBaseFieldRenderProps & {
  isMultiline?: boolean;
}

export type LegacyTextRenderProps = LegacyBaseFieldRenderProps & {
  email?: boolean;
  phone?: boolean;
  zip?: boolean;
}

export type LegacyClusterRenderProps = LegacyBaseFieldRenderProps & {
  type: typeof FIELD_TYPES['CLUSTER'];
  addLabel?: string;
  removeLabel?: string;
  clusterColumnCount?: number;
}

export type LegacyCondition = {
  when: string;
  is: string | number;
  isValid?: boolean;
  then: Record<string, any>;
}

export interface Condition {
  when: When;
  then: Record<string, any>;
}

/**
 * This is the format of a parsed condition created in useFormLayout and used in useConfigForm
 */
export interface ParsedCondition extends Condition {
  conditionId: string;
}
