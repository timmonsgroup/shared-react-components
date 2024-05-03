/** @module useFormLayout */
import { useLayout } from './useData.js';
import {
  FIELD_TYPES as FIELDS, VALIDATIONS, CONDITIONAL_RENDER,
  SPECIAL_ATTRS, ID_FIELD, LABEL_FIELD, DEFAULT_VALUE,
  TODAY_DEFAULT, MAX_VALUE, MIN_VALUE, MAX_LENGTH, MIN_LENGTH,
  REQUIRED, DISABLED,
  PLACEHOLDER, ANY_VALUE
} from '../constants.js';
import { useEffect, useState } from 'react';

import { createFieldValidation, getSelectValue, multiToPayload } from '../helpers/formHelpers.js';
import axios from 'axios';
import { dateStringNormalizer } from '../helpers/helpers.js';
import { LegacyParsedFormField, LegacyLayoutField, LegacyDropdownRenderProps, LegacyDateRenderProps, LegacyLongTextRenderProps, LegacyTextRenderProps, LegacyClusterRenderProps, LegacyParsedSection } from '../models/formLegacy.model';
import { Conditional } from '../models/formFields.model';

const validationTypes = Object.values(VALIDATIONS);
const conditionalRenderProps = Object.values(CONDITIONAL_RENDER);
const specialProps = Object.values(SPECIAL_ATTRS);

/**
 * Layout fetching hook that extends the useLayout hook to parse the layout data into a more usable format
 * The loading flag is tied to parsing being complete instead of the layout loading being complete
 * @function
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
        const parsed = await parseFormLayout(data, urlDomain, asyncOptions) as any;
        setParsedLayout(parsed);
        setIsParsing(false);
      };
      waitForParse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading]);

  return [parsedLayout, isParsing];
}

/**
 * Will parse the layout data into React Hook Form friendly format
 * @function parseFormLayout
 * @param {object} layout assumed to be in the standard PAM layout format
 * @returns {ParsedFormLayout} - parsed layout
 */
export const parseFormLayout = async (layout, urlDomain, options) => {
  if (!layout) {
    return {};
  }

  const sections: LegacyParsedSection[] = [];
  const triggerFields = new Map();
  const fields = new Map();
  const asyncFields = new Map();

  if (layout.sections?.length) {
    layout.sections.forEach((section) => {
      const parsedSection: LegacyParsedSection = parseSection(section, fields, triggerFields, asyncFields) as LegacyParsedSection;
      if (parsedSection) {
        sections.push(parsedSection);
      }
    });
  }

  // Create validations for each field that has conditional validations
  triggerFields.forEach((trigField) => {
    console.log('triggerFields', trigField)
    trigField.fieldValues.forEach((fieldValues) => {
      fieldValues.forEach((triggeredUpdates, aFI) => {
        console.log('triggeredUpdates', triggeredUpdates, 'aFI: ', aFI)
        const layout = new Map();
        const validationProps = new Map();
        const field = fields.get(aFI);
        console.log('field', field)
        // Parse the validation props from the base field first
        parseValidation(validationProps, field.modelData);
        parseValidation(validationProps, field.render);

        triggeredUpdates.forEach((property) => {
          // loop through validation object
          Object.keys(property).forEach((key) => {
            // Setting any dynamic rendering layout like "required" or "disabled" that must be visually represented
            if ((conditionalRenderProps as any).includes(key)) {
              layout.set(key, property[key]);
            }

            // Setting the actual validation props
            if ((validationTypes as any).includes(key)) {
              // Any validation props in here will override the base field validation props
              validationProps.set(key, property[key]);
            }
          });
        });

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

  /**
   * Fetch any async data for the fields
   * @function
   * @param {string} fieldId - id of the field
   * @param {string} url - url to fetch data from
   * @returns {Array<object>}
   */
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
  };

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
};

/**
 * Parse a section
 * @function
 * @param {object} section
 * @param {Map<string, ParsedField>} fieldMap - map of fieldId to field object
 * @param {Map<string, object>} triggerFieldMap - map of triggerFieldId to field object
 * @param {Map<string, string>} asyncFieldsMap
 * @returns {ParsedSection} - parsed section
 */
export function parseSection(section, fieldMap, triggerFieldMap, asyncFieldsMap) {
  console.log('parseSection', section)
  if (!section) {
    return {};
  }
  const { editable, enabled } = section;
  const layout = (section.layout || []) as LegacyLayoutField[];
  const parsedSection: LegacyParsedSection = {
    name: section.name,
    title: section.title,
    order: section.order,
    description: section.description,
    editable,
    enabled,
    fields: [],
  };

  if (layout?.length) {
    layout.forEach((field: LegacyLayoutField) => {
      const parsedField = parseField(field, asyncFieldsMap);
      if (parsedField) {
        fieldMap.set(field.path, parsedField);
        parsedSection.fields.push(field.path); // Fix: Update the type of parsedSection.fields array to allow string values
        const { conditions, conditionals } = parsedField;
        if (conditionals?.length) {
          parseConditionals(field.path, triggerFieldMap, conditionals);
        } else if (conditions?.length) {
          parseConditions(field.path, triggerFieldMap, conditions);
        }
      }
    });
  }

  return parsedSection;
}

// TODO: Create a more unified model to play nice with PamLayoutGrid
/**
 * Parse a field
 * @function
 * @param {object} field - field object
 * @param {Map<string, string>} asyncFieldsMap - map of async fields
 * @returns {ParsedField} parsed field
 */
export function parseField(field: LegacyLayoutField, asyncFieldsMap): LegacyParsedFormField {
  if (!field) {
    return {} as LegacyParsedFormField;
  }

  const { label, type, model, conditions = [], linkFormat, conditionals = [] } = field;
  const name = model?.name || `unknown${model?.id || ''}`;

  const hidden = !!field[CONDITIONAL_RENDER.HIDDEN];

  const parsedField: LegacyParsedFormField = {
    path: field.path,
    id: name,
    conditions,
    conditionals,
    label,
    type,
    hidden,
    specialProps: {},
    [DEFAULT_VALUE]: field[DEFAULT_VALUE],
    modelData: model?.data || {},
    // Note any validation that are needed for a trigger field should be added here
    // The triggerfield logic will parse the base field first then the trigger field (which allows for overrides via "then")
    render: {
      type: type,
      label,
      name,
      // Boolean properties
      hidden,
      [REQUIRED]: !!field[REQUIRED],
      [DISABLED]: !!field[DISABLED],
      [CONDITIONAL_RENDER.READ_ONLY]: !!field[CONDITIONAL_RENDER.READ_ONLY],
      inline: !!field.inline,
      emptyMessage: field.emptyMessage,
      //Number properties
      [MAX_VALUE]: field[MAX_VALUE],
      [MIN_VALUE]: field[MIN_VALUE],
      [MAX_LENGTH]: field[MAX_LENGTH],
      [MIN_LENGTH]: field[MIN_LENGTH],
      //String properties
      [CONDITIONAL_RENDER.ALT_HELPER]: field[CONDITIONAL_RENDER.ALT_HELPER],
      [CONDITIONAL_RENDER.ICON_HELPER]: field[CONDITIONAL_RENDER.ICON_HELPER],
      [CONDITIONAL_RENDER.HELPER]: field[CONDITIONAL_RENDER.HELPER],
      [CONDITIONAL_RENDER.REQ_TEXT]: field[CONDITIONAL_RENDER.REQ_TEXT],
      [PLACEHOLDER]: field[PLACEHOLDER],
      solitary: field.solitary,
      singleColumnSize: field.singleColumnSize,
      linkFormat,
    }
  };

  const { data = {} } = model || {};
  // it is possible for data to be null if the data object in the model is null
  if (data && parsedField.specialProps) {
    // map special props to the field
    specialProps.forEach((prop: any) => {
      if (data[prop] && parsedField.specialProps) {
        parsedField.specialProps[prop] = data[prop];
      }
    });
  }

  const types = Object.keys(FIELDS);
  const typeIndex = Object.values(FIELDS).indexOf(type);

  if (!types[typeIndex]) {
    console.warn(`Field type ${type} is not supported by the form builder`);
    return parsedField;
  }

  // We need this for useDynamicForm reset logic for conditionally loaded fields to function.
  if (type === FIELDS.CHOICE || type === FIELDS.OBJECT) {
    const updatedRender: LegacyDropdownRenderProps = {
      ...parsedField.render,
      choices: [],
      multiple: !!field.multiple,
      checkbox: !!field.checkbox,
      type
    };

    parsedField.render = updatedRender;
  }

  // add date specific props
  if (type === FIELDS.DATE) {
    const updatedRender: LegacyDateRenderProps = {
      ...parsedField.render,
      disableFuture: !!field.disableFuture,
      disableFutureErrorText: field.disableFutureErrorText,
    };

    parsedField.render = updatedRender;
  }

  if (type === FIELDS.LONG_TEXT) {
    const updatedRender: LegacyLongTextRenderProps = {
      ...parsedField.render,
      isMultiline: true,
    };
    parsedField.render = updatedRender;
  }

  if (type === FIELDS.TEXT) {
    const updatedRender: LegacyTextRenderProps = {
      ...parsedField.render,
      zip: !!field.zip,
      phone: !!field.phone,
      email: !!field.email,
    };
    parsedField.render = updatedRender;
  }

  // I think we don't check type because it is possible for a field to change type conditionally...maybe? CPP might have done this
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

  // Special case for cluster fields
  if (type === FIELDS.CLUSTER) {
    // Loop through the sub fields and parse them
    // This will also populate the validations property for each sub field
    const subFields = field.layout?.map((subF) => parseField(subF, asyncFieldsMap)) || [];

    const updatedRender: LegacyClusterRenderProps = {
      ...parsedField.render,
      subFields,
      // Allow for custom labels
      addLabel: field.addLabel,
      removeLabel: field.removeLabel,
      clusterColumnCount: field.clusterColumnCount,
      type,
    };
    parsedField.render = updatedRender;
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
 * @function
 * @param {Map<string, YupSchema>} validationMap
 * @param {object} data
 */
function parseValidation(validationMap, data, debug = false) {
  if (!data) {
    return;
  }

  Object.keys(data).forEach((key) => {
    if (debug) {
      console.debug('~parseValidation~', key, data[key]);
    }
    if ((validationTypes as any).includes(key) && data[key] !== undefined) {
      validationMap.set(key, data[key]);
    }
  });
}

/**
 * Parse conditions and add them to the triggerFieldMap
 * @function
 * @param {string} fieldId - field id
 * @param {Map<string, TriggerField>} triggerFields - map of trigger fields
 * @param {Array<TriggerCondition>} conditions - conditions
 */
const parseConditions = (fieldId, triggerFields, conditions) => {
  if (conditions?.length) {
    conditions.forEach((condition) => {
      const { when: triggerId, then: validations, isValid } = condition;
      let value = condition?.is?.toString();

      // touches is a map of every field that triggerfield could influence.
      // For any value a triggerField fires we need to roll back any fields that COULD have been affected by previous values
      const trigField = triggerFields.get(triggerId) || { id: triggerId, fieldValues: new Map(), touches: new Map() };

      if (isValid) {
        value = ANY_VALUE;
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
};

const parseConditionals = (fieldId, triggerFields, conditionals: Conditional | Array<Conditional>) => {
  const toProcess = Array.isArray(conditionals) ? conditionals : [conditionals];
  if (toProcess?.length) {
    toProcess.forEach((conditional: Conditional) => {
      const { fieldId: triggerId, operation, value, and, or } = conditional;
      const trigField = triggerFields.get(triggerId) || { id: triggerId, fieldValues: new Map(), touches: new Map() };
      const fieldValues = trigField.fieldValues.get(value) || new Map();
      const affectedFields = fieldValues.get(fieldId) || [];
      const touched = trigField.touches.get(fieldId) || new Map();

      touched.set(value, true);
      trigField.touches.set(fieldId, touched);
      affectedFields.push({ operation, value, and, or });
      fieldValues.set(fieldId, affectedFields);
      trigField.fieldValues.set(value, fieldValues);

      triggerFields.set(triggerId, trigField);
      if (and) {
        parseConditionals(fieldId, triggerFields, and);
      }
      if (or) {
        parseConditionals(fieldId, triggerFields, or);
      }
    });
  }
}

/**
 * This is a helper method to convert the data from the database into the format that the form expects.
 * If the data is null or missing will set as need to avoid "uncontrolled" vs "controlled" MUI errors.
 * @param {ParsedField} field - the field object should be in the syntax of the form builder (parseField)
 * @param {object} formData - the data from the database. This should be ALL the form values.
 * @returns {object}
 */
// eslint-disable-next-line no-unused-vars
export function getFieldValue(field, formData) {
  // if the type is missing check the render object
  let { type } = field || field?.render || {};

  const { render } = field || {};
  const name = render.name || `unknown${render.id}`;
  // const inData = isNested && data ? data[name] : getObject(data || {}, field.path);
  let inData = formData?.[name];

  // If the config specifies a default value, use that value ONLY if the data is undefined.
  if ((inData === undefined || inData === null) && field[DEFAULT_VALUE]) {
    inData = field[DEFAULT_VALUE];
  }

  let value: any = null;

  switch (type) {
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
        const theDate = inData === TODAY_DEFAULT ? new Date() : new Date(dateStringNormalizer(inData));
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
            value = getSelectValue(true, inData) || [];
          } else {
            value = [];
          }
        } else {
          value = getSelectValue(render.multiple || false, inData) || '';
        }
      } else {
        if (!inData && render.multiple) {
          value = [];
        } else {
          value = inData || '';
        }
      }
      break;
    }
    case FIELDS.CLUSTER: {
      const clusterData: any[] = [];
      if (Array.isArray(inData) && inData.length) {
        inData.forEach((nug) => {
          const lineData: Record<string, any> = {};
          const { subFields } = field || [];
          if (Array.isArray(subFields) && subFields.length) {
            subFields.forEach((subF) => {
              const { name: fName, value: fValue } = getFieldValue(subF, nug);
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
      const clusterData: any[] = [];
      if (Array.isArray(value) && value.length) {
        value.forEach((nug) => {
          const lineData: Record<string, any> = {};
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