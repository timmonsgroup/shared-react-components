import { LegacyFieldRender } from "./formLegacy.model";

export interface CoreProps {
  id: string | number;
  name?: string;
  description?: string;
}

// create an interface for a layout
export interface Layout extends CoreProps {
  layoutKey: string;
  type: string | number;
  sections: Section[];
}

// create an interface for a section
export interface Section extends CoreProps {
  order?: number;
  layout: Array<SectionLayout>;
}

// create an interface for a section layout
export interface SectionLayout {
}

export interface CoreFieldProps {
  id: string | number;
  name?: string;
  type: string;
  render: FieldRender;
  validations: Validations;
  condtions: Array<Conditional>;
}

export interface FieldRender {
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  helperText?: string;
}

export interface Validations {
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
export interface When {
  fieldId: string;
  operation: Operation;
  value: string | number | boolean | RegExp;
  and?: Whens;
  or?: Whens;
}

export type Whens = When | Array<When>;

export interface Then {
  render?: FieldRender | LegacyFieldRender;
  validations?: Validations;
}

export type Operation = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'notContains' | 'startsWith' | 'endsWith' | 'in' | 'notIn' | 'regex' | 'notRegex' | 'isNull' | 'isNotNull';