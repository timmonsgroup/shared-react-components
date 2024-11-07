/**
 * This hook is used to convert a layout into a different structure for use by ConfigForm.
 * We are building a new internal structure
 */

import { FIELD_TYPES } from "../constants";
import { Conditional } from "../models/formFields.model";
import { LegacyParsedSection } from "../models/formLegacy.model";
import { type AnySchema } from "yup";

//create a union type for the different types of fields using the keyof the FIELD_TYPES object
export type FieldTypes = keyof typeof FIELD_TYPES;
export type ConfigFormFieldTypes = Lowercase<FieldTypes>;

export interface ConfigFormField {
  id: string;
  type: ConfigFormFieldTypes;
  render: ConfigFormFieldRender;
  validationOptions: ConfigFormValidationOptions;
  conditions: Conditional[];
  yupValidation?: AnySchema;
  watchers?: Map<string, boolean>;
}

export interface RegexpValidation {
  pattern: RegExp | string;
  flags?: string;
  errorMessage?: string;
}

export type ConfigFormFieldRender = BaseFieldRender | DateFieldRender | SelectFieldRender | TextFieldRender;
export interface ConfigFormValidationOptions {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  regexpValidation?: RegexpValidation;
  requiredErrorText?: string;
  minLengthErrorText?: string;
  maxLengthErrorText?: string;
  [key: string]: any;
}

export interface BaseFieldRender {
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  helperText?: string;
  [key: string]: any;
}

export interface DateFieldRender extends BaseFieldRender {
  disableFuture?: boolean;
  disableFutureErrorText?: string;
}

export interface SelectFieldRender extends BaseFieldRender  {
  multiple?: boolean;
  checkbox?: boolean;
  radio?: boolean;
  choices?: Array<Record<string, any>>;
  url?: string;
}

export interface ConfigFormLayout {
  sections?: LegacyParsedSection[];
  fields: Map<string, ConfigFormField>;
}

export interface TextFieldRender extends BaseFieldRender {
  emptyMessage?: string;
  iconHelperText?: string;
  altHelperText?: string;
  linkFormat?: string;
}

// export function generateConfigFormLayout(layout: Layout): ConfigFormLayout {
//   const sections: ConfigFormSection[] = layout.sections.map((section: Section) => {
//     return {
//       id: section.id,
//       name: section.name,
//       order: section.order,
//       fields: section.layout.map((field: SectionLayout) => {
//         return {
//           id: field.id,
//           name: field.name,
//           type: field.type,
//           render: field.render,
//           validations: field.validations,
//           conditions: field.conditions,
//         };
//       }),
//     };
//   });

//   return {
//     id: layout.id,
//     name: layout.name,
//     sections,
//   };
// }