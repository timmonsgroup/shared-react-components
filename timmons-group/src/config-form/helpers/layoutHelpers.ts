import { VALIDATIONS, CONDITIONAL_RENDER, FIELD_TYPES } from '../constants';
import { FieldIntTypes, LegacyLayoutField } from '../models';
import { Conditional } from '../models/formFields.model';
import { checkConditional } from './formHelpers';

type ValidationKeys = keyof typeof VALIDATIONS;
type ValidationValues = typeof VALIDATIONS[ValidationKeys];

type RenderKeys = keyof typeof CONDITIONAL_RENDER;
type RenderValues = typeof CONDITIONAL_RENDER[RenderKeys];

type FormFieldPropertyValues = ValidationValues | RenderValues;

type FormFieldLayoutPropertyMap = {
  [key in FormFieldPropertyValues]?: any;
};

export type AdditionalLayoutFieldOptions = Partial<LegacyLayoutField | FormFieldLayoutPropertyMap>

export const createTextModel = (
  name: string,
  label: string,
  required = false,
  otherThings: AdditionalLayoutFieldOptions = {},
  dataThings = {}
): LegacyLayoutField => ({
  label,
  path: name,
  type: 0,
  model: {
    name,
    type: 0,
    data: dataThings,
  },
  required,
  ...otherThings,
});

export const createLongTextModel = (name: string,
  label: string,
  required = false,
  otherThings: AdditionalLayoutFieldOptions = {},
  dataThings = {}
): LegacyLayoutField => ({
  label,
  path: name,
  type: FIELD_TYPES.LONG_TEXT,
  model: {
    name,
    type: FIELD_TYPES.LONG_TEXT,
    data: dataThings,
  },
  required,
  ...otherThings,
});

export const createCurrencyModel = (name: string, label: string, required = false, otherThings: AdditionalLayoutFieldOptions = {}): LegacyLayoutField => {
  const nonNeg: AdditionalLayoutFieldOptions = { ...otherThings, minValue: 0 };
  return createAnyModel(FIELD_TYPES.CURRENCY, name, label, required, nonNeg)
};

export const createPositiveCountModel = (name: string, label: string, required = false, otherThings: AdditionalLayoutFieldOptions = {}): LegacyLayoutField => (
  createAnyModel(FIELD_TYPES.INT, name, label, required, { ...otherThings, minValue: 0 })
);

export const createAcresModel = (name: string, label: string, required = false, otherThings: AdditionalLayoutFieldOptions = {}): LegacyLayoutField => (
  createAnyModel(FIELD_TYPES.FLOAT, name, label, required, { ...otherThings, minValue: 0, fractionalDigits: 1 })
);

export const createAnyModel = (fieldType: FieldIntTypes, name: string, label: string, required = false, otherThings: AdditionalLayoutFieldOptions = {}): LegacyLayoutField => {
  const type = fieldType ?? FIELD_TYPES.TEXT;
  return {
    label,
    path: name,
    type,
    model: {
      name,
      id: 5,
      type,
    },
    required,
    ...otherThings,
  }
};

export const passesConditionals = (conditions: Array<Conditional> | Conditional, data: Record<string, any> = {}, nested = ''): boolean => {
  const indent = nested;
  console.log(`${indent}`, 'conditions', conditions)
  let result = true;
  const toProcess = Array.isArray(conditions) ? conditions : [conditions];

  for (const element of toProcess) {
    const condition = element;
    const { and, or } = condition;
    // check if the condition is true
    if (!checkConditional(condition, data)) {
      result = false;
      if (and || !or) {
        console.log(`${indent}`, '\tFailed test. Has ands or no ors')
        break;
      }

      if (or) {
        console.log(`${indent}`, '\tMaybe Failed test. HAS ors, checking those conditions')
        result = passesConditionals(or, data, nested + '\t');
      }
    } else {
      console.log(`${indent}`, '\tPassed this condition. Checking for ands')
    }

    if (and) {
      console.log(`${indent}`, '\tHas ands')
      result = passesConditionals(and, data, nested + '\t');
    }
  }
  console.log(`${indent}`, 'result of', result, 'for', conditions)
  return result;
}