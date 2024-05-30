import { LegacyFieldRender } from "./formLegacy.model";

export type CoreProps = {
  id: string | number;
  name?: string;
  description?: string;
}


// create a type for a layout
export type Layout = CoreProps & {
  layoutKey: string;
  type: string | number;
  sections: Section[];
}

// create a type for a section
export type Section = CoreProps & {
  order?: number;
  layout: Array<SectionLayout>;
}

// create a type for a section layout
export type SectionLayout = {
}

export type CoreFieldProps = {
  id: string | number;
  name?: string;
  type: string;
  render: FieldRender;
  validations: Validations;
  condtions: Array<Conditional>;
}

export type FieldRender = {
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  helperText?: string;
}

export type Validations = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  pattern?: string;
}

export type Conditional = When & Then;

/**
 * @description
 * A "when" is a single condition that is evaluated against a field.
 * @example
 * {
 *  fieldId: 'firstName',
 *  operation:'eq'
 *  value: 'John'
 * }
 *
 */
export type When = {
  fieldId: string;
  operation: Operation;
  value: string | number | boolean | RegExp;
  and?: Whens;
  or?: Whens;
}

export type Whens = When | Array<When>;

export type Then = {
  render?: FieldRender | LegacyFieldRender;
  validations?: Validations;
}

export type Operation = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'notContains' | 'startsWith' | 'endsWith' | 'in' | 'notIn' | 'regex' | 'notRegex' | 'isNull' | 'isNotNull';