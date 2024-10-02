import { FIELD_TYPES } from "@timmons-group/shared-react-components";

export const createCurrencyModel = (name, label, required = false, otherThings = {}) => {
  const nonNeg = { ...otherThings, minValue: 0 };
  return createAnyModel(FIELD_TYPES.CURRENCY, name, label, required, nonNeg)
};

export const createPositiveCountModel = (name, label, required = false, otherThings = {}) => (
  createAnyModel(FIELD_TYPES.INT, name, label, required, { ...otherThings, minValue: 0 })
);

export const createAcresModel = (name, label, required = false, otherThings = {}) => (
  createAnyModel(FIELD_TYPES.FLOAT, name, label, required, { ...otherThings, minValue: 0, fractionalDigits: 1 })
);

export const createDateModel = (name, label, required = false, otherThings = {}) => (
  createAnyModel(FIELD_TYPES.DATE, name, label, required, otherThings)
);

export const createAnyModel = (fieldType, name, label, required = false, otherThings = {}) => {
  const type = fieldType ?? FIELD_TYPES.TEXT;
  return {
    label,
    path: name,
    type,
    model: {
      name,
      id: 5,
      modelid: 10,
      type,
    },
    required,
    ...otherThings,
  }
};

export const createLayoutModel = (name, sections=[], layoutKey=null, editable = true) => {
  return {
    name,
    sections,
    id: 2,
    modelId: 10,
    enabled: true,
    editable: true,
    layoutKey: 'new_fd',
    type: 1,
  }
}

export const createSectionModel = (name, layout = [], editable = true, enabled = true, order = 0) => {
  return {
    name,
    layout,
    editable,
    enabled,
    order,
  }
}