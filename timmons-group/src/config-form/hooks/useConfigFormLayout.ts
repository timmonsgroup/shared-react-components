/**
 * This hook is used to convert a layout into a different structure for use by ConfigForm.
 * We are building a new internal structure
 */

import { FIELD_TYPES } from "../constants";
import { Conditional } from "../models/formFields.model";
import { LegacyParsedSection } from "../models/formLegacy.model";
import { type AnySchema, string } from "yup";

//create a union type for the different types of fields using the keyof the FIELD_TYPES object
export type FieldTypes = keyof typeof FIELD_TYPES;
export type ConfigFormFieldTypes = Lowercase<FieldTypes>;

export type ConfigFormField = {
  id: string;
  type: ConfigFormFieldTypes;
  render: ConfigFormFieldRender;
  validationOptions: ConfigFormValidationOptions;
  conditions: Conditional[];
  yupValidation?: AnySchema;
  watchers?: Map<string, boolean>;
}

export type RegexpValidation = {
  pattern: RegExp | string;
  flags?: string;
  errorMessage?: string;
}

export type ConfigFormFieldRender = BaseFieldRender | DateFieldRender | SelectFieldRender | TextFieldRender;
export type ConfigFormValidationOptions = {
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

export type BaseFieldRender = {
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  helperText?: string;
  [key: string]: any;
}

export type DateFieldRender = BaseFieldRender & {
  disableFuture?: boolean;
  disableFutureErrorText?: string;
}

export type SelectFieldRender = BaseFieldRender & {
  multiple?: boolean;
  checkbox?: boolean;
  choices?: Array<Record<string, any>>;
  url?: string;
}

export type ConfigFormLayout = {
  sections?: LegacyParsedSection[];
  fields: Map<string, ConfigFormField>;
}

export type TextFieldRender = BaseFieldRender & {
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