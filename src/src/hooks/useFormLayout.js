import { useLayout } from './useData.js';
import {
  FIELD_TYPES as FIELDS, VALIDATIONS, CONDITIONAL_RENDER,
  SPECIAL_ATTRS, ID_FIELD, LABEL_FIELD, DEFAULT_VALUE,
  TODAY_DEFAULT,
  REQUIRED
} from '../constants.js';
import { useEffect, useState } from 'react';

import { createFieldValidation, getSelectValue, multiToPayload } from '../helpers/formHelpers.js';
import axios from 'axios';

const validationTypes = Object.values(VALIDATIONS);
const conditionalRenderProps = Object.values(CONDITIONAL_RENDER);
const specialProps = Object.values(SPECIAL_ATTRS);

/**
 * Layout fetching hook that extends the useLayout hook to parse the layout data into a more usable format
 * The loading flag is tied to parsing being complete instead of the layout loading being complete
 * @param {string} type - object type for standard PAM get layout endpoint
 * @param {string} key - layout key for standard PAM get layout endpoint
 * @param {string} url - optional if you are not using the standard pam endpoint
 * @returns {array} - first element is the parsedLayout object second is loading boolean
 */
export function useFormLayout(type, key, url = null, urlDomain = null, asyncOptions, loadedLayout = null) {
  // Passing loadedLayout will skip the fetch and use the passed in layout
  const [data, isLoading] = useLayout(type, key, url, loadedLayout);
  const [parsedLayout, setParsedLayout] = useState(null);
  const [isParsing, setIsParsing] = useState(true);

  useEffect(() => {
    if (!isLoading && data) {
      const waitForParse = async () => {
        const parsed = await parseFormLayout(data, urlDomain, asyncOptions);
        setParsedLayout(parsed);
        setIsParsing(false);
      }
      waitForParse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading]);

  return [parsedLayout, isParsing];
}

/**
 * @typedef {Object} ParsedFormLayout
 * @property {Array<ParsedSection>} sections - array of parsed sections
 * @property {Map<String, Object>} fields - map of fieldId to field object
 * @property {Map<String, Object>} triggerFields - map of fieldId to field object
 */

/**
 * @typedef {Object} ParsedSection
 * @property {string} name - section name (title and name are both used for backwards compatibility)
 * @property {string} title - section title
 * @property {Array<ParsedField>} fields - array of field objects
 * @property {boolean} editable - if the section is editable
 * @property {Array} enabled - if the section is enabled
 */

/**
 * Will parse the layout data into React Hook Form friendly format
 * @param {object} layout assumed to be in the standard PAM layout format
 * @returns {ParsedFormLayout} - parsed layout
 */
export const parseFormLayout = async (layout, urlDomain, options) => {
  if (!layout) {
    return {};
  }

  const sections = [];
  const triggerFields = new Map();
  const fields = new Map();
  const asyncFields = new Map();

  if (layout.sections?.length) {
    layout.sections.forEach((section) => {
      sections.push(parseSection(section, fields, triggerFields, asyncFields));
    });
  }

  // Create validations for each field that has conditional validations
  triggerFields.forEach((trigField) => {
    trigField.fieldValues.forEach((fieldValues) => {
      fieldValues.forEach((triggeredValidations, aFI) => {
        const layout = new Map();
        const validationProps = new Map();
        triggeredValidations.forEach((validation) => {
          // loop through validation object
          Object.keys(validation).forEach((key) => {
            // Setting any dynamic rendering layout like "required" or "disabled" that must be visually represented
            if (conditionalRenderProps.includes(key)) {
              layout.set(key, validation[key]);
            }

            // Setting the actual validation props
            if (validationTypes.includes(key)) {
              validationProps.set(key, validation[key]);
            }
          });
        });

        const field = fields.get(aFI);

        const { type, label } = field;
        const mergedField = { ...field };
        // Convert the layout map to an object
        const dynRender = Object.fromEntries(layout);
        // We'll pass the merged field to the createFieldValidation function so that it can use the dynamic render props (like requiredErrorText)
        mergedField.render = { ...field.render, ...dynRender };
        // Create a yup validation for the field that is triggered by the triggerField
        fieldValues.set(aFI, { layout, validation: createFieldValidation(type, label, validationProps, mergedField) });
      });
    });
  });

  const fetchData = async (fieldId, url) => {
    const fetchUrl = urlDomain ? `${urlDomain}${url}` : url;
    const specialFieldProps = fields.get(fieldId).specialProps;
    const mappedId = specialFieldProps?.[ID_FIELD];
    const mappedLabel = specialFieldProps?.[LABEL_FIELD];
    const things = await axios.get(fetchUrl).then(res => {
      const { data } = res || {};
      if (options?.choiceFormatter && typeof options.choiceFormatter === 'function') {
        const parsedOptions = options.choiceFormatter(fieldId, res, { mappedId, mappedLabel });
        return parsedOptions;
      } else if (data?.length) {
        return data.map((d) => ({ ...d, id: d[mappedId] || d.id, label: d[mappedLabel] || d.name }));
      }
    }
    ).catch(error => {
      if (error.name !== 'CanceledError') {
        console.error('\t', fieldId, 'Error fetching data', error);
      }
    });
    return things;
  }

  if (asyncFields.size > 0) {
    const asyncLoaders = {};
    asyncFields.forEach((choiceUrl, fieldId) => {
      asyncLoaders[fieldId] = () => fetchData(fieldId, choiceUrl);
    });
    const optTypes = Object.keys(asyncLoaders).map((fieldPath) => (
      // return Promise that stores the loadedChoices into the correct model
      asyncLoaders[fieldPath]().then((loaded) => {
        const existingField = fields.get(fieldPath);
        existingField.render.choices = loaded;
        fields.set(fieldPath, existingField);
      })
    ));

    if (optTypes.length) {
      await Promise.all(optTypes);
    }
  }

  return { sections, fields, triggerFields };
}


/**
 * Parse a section
 * @param {object} section
 * @param {Map<string, ParsedField>} fieldMap - map of fieldId to field object
 * @param {Map<string, object>} triggerFieldMap - map of triggerFieldId to field object
 * @param {Map<string, string>} asyncFieldsMap
 * @returns {ParsedSection} - parsed section
 */
export function parseSection(section, fieldMap, triggerFieldMap, asyncFieldsMap) {
  if (!section) {
    return {};
  }
  const { layout, editable, enabled } = section;

  const parsedSection = {
    name: section.name,
    title: section.title,
    editable,
    enabled,
    fields: [],
  };

  if (layout?.length) {
    layout.forEach((field) => {
      const parsedField = parseField(field, asyncFieldsMap);
      if (parsedField) {
        fieldMap.set(field.path, parsedField);
        parsedSection.fields.push(field.path);
        const { conditions } = parsedField;
        if (conditions.length) {
          parseConditions(field.path, triggerFieldMap, conditions);
        }
      }
    });
  }

  return parsedSection;
};

/**
 * @typedef {object} ParsedField
 * @property {string} id - field id
 * @property {string} label - field label
 * @property {string} type - field type
 * @property {boolean} hidden - if the field is hidden
 * @property {Array} conditions - if the field is hidden
 * @property {object} specialProps - special props for the field
 * @property {object} [defaultValue] - default value for the field
 * @property {FieldRenderProps} render - render props for the field
 */

/**
 * @typedef {object} FieldRenderProps
 * @property {string} type - field type
 * @property {string} label - field label
 * @property {string} name - field name
 * @property {boolean} hidden - if the field is hidden
 * @property {boolean} [required] - if the field is required
 * @property {boolean} disabled - if the field is disabled
 * @property {string} iconHelperText - icon helper text
 * @property {string} helperText - helper text
 * @property {string} requiredErrorText - required error text
 * @property {boolean} readOnly - if the field is read only
 * @property {boolean} [multiple] - if the field is multiple
 * @property {string} [placeholder] - placeholder text
 * @property {object} linkFormat - link format
 * @property {Array<object>} [choices] - choices for the field
 * @property {YupSchema} validations - validations for the field
 */

// TODO: Create a more unified model to play nice with PamLayoutGrid
/**
 * Parse a field
 * @param {object} field - field object
 * @param {Map<string, string>} asyncFieldsMap - map of async fields
 * @returns {ParsedField} parsed field
 */
export function parseField(field, asyncFieldsMap) {
  if (!field) {
    return {};
  }

  const { label, type, model, hidden = false, conditions = [], linkFormat } = field;
  const name = model.name || `unknown${model.id}`;
  const readOnly = !!field.readOnly;
  const disabled = !!field.disabled;

  const parsedField = {
    id: name,
    conditions,
    label,
    type,
    hidden,
    specialProps: {},
    [DEFAULT_VALUE]: field[DEFAULT_VALUE],
    render: {
      type: type,
      label,
      name,
      hidden,
      [REQUIRED]: !!field[REQUIRED],
      disabled,
      placeholder: field.placeholder,
      iconHelperText: field.iconHelperText,
      helperText: field.helperText,
      requiredErrorText: field.requiredErrorText,
      readOnly,
      linkFormat,
    }
  };

  const { data = {} } = model || {};

  const types = Object.keys(FIELDS);
  const typeIndex = Object.values(FIELDS).indexOf(type);

  if (!types[typeIndex]) {
    console.warn(`Field type ${type} is not supported by the form builder`);
    return parsedField;
  }

  // We need this for useDynamicForm reset logic for conditionally loaded fields to function.
  if (type === FIELDS.CHOICE || type === FIELDS.OBJECT) {
    parsedField.render.choices = [];
    parsedField.render.multiple = !!field.multiple;
    parsedField.render.checkbox = !!field.checkbox;
  }

  // map special props to the field

  specialProps.forEach((prop) => {
    if (data[prop]) {
      parsedField.specialProps[prop] = data[prop];
    }
  });

  if (type === FIELDS.LONG_TEXT) {
    parsedField.render.isMultiLine = true;
  }

  if (field.possibleChoices) {
    const choices = field?.possibleChoices ? field?.possibleChoices.map(item => ({
      ...item,
      label: item.name,
      id: item.id,
    })) : [];

    parsedField.render.choices = choices;
  } else if (field.url) {
    if (type !== FIELDS.CHOICE && type !== FIELDS.OBJECT) {
      console.warn(`Field type ${type} does not support async choices`);
    }

    asyncFieldsMap.set(field.path, field.url);
  }

  const validations = new Map();
  parseValidation(validations, field);
  parseValidation(validations, data);

  if (validations.size) {
    parsedField.validations = createFieldValidation(type, label, validations, parsedField);
  }

  return parsedField;
}

/**
 * Parse validation
 * @param {Map<string, YupSchema>} validationMap
 * @param {object} data
 */
function parseValidation(validationMap, data) {
  Object.keys(data).forEach((key) => {
    if (validationTypes.includes(key)) {
      validationMap.set(key, data[key]);
    }
  });
}

/**
 * @typedef {object} TriggerCondition
 * @property {string} when - trigger field id
 * @property {string} is - value to trigger on
 * @property {object} then - conditions
 * @property {boolean} isValid - if the field is valid
 */

/**
 * @typedef {object} TriggerField
 * @property {string} id - field id
 * @property {Map<string, string>} fieldValues - map of field values
 * @property {Map<string, string>} touches - map of fields that trigger field could influence
 */

/**
 * Parse conditions and add them to the triggerFieldMap
 * @param {string} fieldId - field id
 * @param {Map<string, TriggerField>} triggerFields - map of trigger fields
 * @param {Array<TriggerCondition>} conditions - conditions
 */
const parseConditions = (fieldId, triggerFields, conditions) => {
  if (conditions?.length) {
    conditions.forEach((condition) => {
      const { when: triggerId, then: validations, isValid } = condition;
      let value = condition?.is;

      // touches is a map of every field that triggerfield could influence.
      // For any value a triggerField fires we need to roll back any fields that COULD have been affected by previous values
      const trigField = triggerFields.get(triggerId) || { id: triggerId, fieldValues: new Map(), touches: new Map() };

      if (isValid) {
        value = 'anyValue';
        trigField.hasOnChange = true;
      }

      const fieldValues = trigField.fieldValues.get(value) || new Map();
      const affectedFields = fieldValues.get(fieldId) || [];
      const touched = trigField.touches.get(fieldId) || new Map();

      touched.set(value, true);
      trigField.touches.set(fieldId, touched);
      affectedFields.push(validations);
      fieldValues.set(fieldId, affectedFields);
      trigField.fieldValues.set(value, fieldValues);

      triggerFields.set(triggerId, trigField);
    });
  }
}

/**
 * This is a helper method to convert the data from the database into the format that the form expects.
 * If the data is null or missing will set as need to avoid "uncontrolled" vs "controlled" MUI errors.
 * @param {*} field - the field object should be in the syntax of the form builder (parseField)
 * @param {*} formData - the data from the database. This should be ALL the form values.
 * @param {*} isNested - not yet implemented, but will be used to parse nested (cluster) fields.
 * @returns {object}
 */
// eslint-disable-next-line no-unused-vars
export function getFieldValue(field, formData, isNested = false) {
  const { render } = field || {};
  const name = render.name || `unknown${render.id}`;
  // const inData = isNested && data ? data[name] : getObject(data || {}, field.path);
  let inData = formData[name];

  // If the config specifies a default value, use that value ONLY if the data is undefined.
  if (inData === undefined && field[DEFAULT_VALUE]) {
    inData = field[DEFAULT_VALUE];
  }

  let value = null;

  switch (field.type) {
    case FIELDS.LONG_TEXT:
    case FIELDS.TEXT:
    case FIELDS.INT:
    case FIELDS.CURRENCY:
    case FIELDS.LINK:
    case FIELDS.FLOAT: {
      value = inData || '';
      break;
    }

    case FIELDS.FLAG: {
      value = !!inData;
      break;
    }

    case FIELDS.DATE: {
      if (inData) {
        const theDate = inData === TODAY_DEFAULT ? new Date() : new Date(inData);
        inData = theDate.toDateString();
      }
      value = inData || null;
      break;
    }
    case FIELDS.CHOICE:
    case FIELDS.OBJECT: {
      const dataType = typeof inData;
      if (dataType === 'object') {
        // Special parsing for checkboxes
        if (render.multiple && render.checkbox) {
          if (Array.isArray(inData)) {
            value = getSelectValue(true, inData) || '';
          } else {
            value = [];
          }
        } else {
          value = getSelectValue(render.multiple || false, inData) || '';
        }
      } else {
        value = inData || render.multiple ? [] : '';
      }
      break;
    }

    case FIELDS.CLUSTER: {
      const clusterData = [];
      if (Array.isArray(inData) && inData.length) {
        inData.forEach((nug) => {
          const lineData = {};
          if (Array.isArray(field.layout) && field.layout.length) {
            field.layout.forEach((subF) => {
              const { name: fName, value: fValue } = getFieldValue(subF, nug, true);
              lineData[fName] = fValue;
            });
          }
          clusterData.push(lineData);
        });
      }
      value = clusterData;

      break;
    }

    default:
      break;
  }
  return { value, name };
}


/**
 * This is a helper method to convert the data from the form into the format that the API expects.
 * @param {object} field
 * @param {Object|string|array|number} value
 * @returns {Object|string|array|number}
 */
export function processFieldValue(field, value) {
  let apiValue = value;
  switch (field.type) {
    case FIELDS.LINK:
      break;

    case FIELDS.DATE:
      break;

    case FIELDS.FLAG:
      apiValue = !!apiValue;
      break;

    case FIELDS.CURRENCY:
    case FIELDS.FLOAT:
      apiValue = parseFloat(apiValue);
      break;

    case FIELDS.INT:
      apiValue = parseInt(apiValue, 10);
      break;

    case FIELDS.CHOICE:
    case FIELDS.OBJECT:
      if (field.isArrayData) {
        apiValue = multiToPayload(apiValue);
      } else if (!field.isStringId) {
        apiValue = parseInt(apiValue, 10);
      }
      break;
    case FIELDS.CLUSTER: {
      const clusterData = [];
      if (Array.isArray(value) && value.length) {
        value.forEach((nug) => {
          const lineData = {};
          const subFields = field.render.fields;
          if (Array.isArray(subFields) && subFields.length) {
            subFields.forEach((subF) => {
              const subName = subF.render.name;
              lineData[subName] = processFieldValue(subF, nug[subName]);
            });
          }
          clusterData.push(lineData);
        });
      }
      apiValue = clusterData;
      break;
    }
    default:
      if (apiValue !== null && apiValue !== undefined) {
        apiValue = (apiValue).toString().trim();
      }
      break;
  }

  return apiValue;
}