import {
  CONDITIONAL_RENDER,
  EMAIL, PHONE, ZIP,
  FIELD_TYPES as FIELDS,
  STATIC_TYPES
} from '../constants.js';
import { currencyFormatter, dateFormatter, isEmpty, sortOn, isObject, formatPhoneNumber } from './helpers.js';

/**
 * Create an error section
 * @function
 * @param {string} title - title
 * @param {string} label - label
 * @param {string} message - message
 * @returns {object[]} - error section
 */
export const createErrorSection = (title, label, message) => {
  return [{
    name: title || 'Error',
    areas: [
      [
        { label: label || 'Issue', type: 'text', value: message || 'There is a problem with the layout of this view. Please contact your administrator.' }
      ]
    ]
  }];
};

/**
 * Parse a view field
 * @function
 * @param {object} layout - layout object
 * @param {object[]} layout.sections - sections array
 * @param {object} data - data object
 * @param {string} key - key
 * @returns {object[]} - parsed sections
 */
export const parseViewLayout = (layout, data, key) => {
  if (!layout || !layout.sections) {
    return createErrorSection();
  }

  if (!data) {
    return createErrorSection(
      'No Data',
      'Issue',
      'There is no data to display for this view. This may be a bad link or the data may not exist.'
    );
  }
  const sections = layout.sections.map((section) => parseSection(section, data, key)).filter((section) => section);
  return sections;
};

/**
 * Parse a section
 * @function
 * @param {object} section - section object
 * @param {object} data - data object
 * @param {string} key - key
 * @returns {object} - parsed section
 */
export const parseSection = (section, data, key) => {
  const { layout, allowStaticOnlySection } = section;
  const areas = [];

  layout.forEach((area, index) => {
    // check if the element is an array
    const areaFields = [];
    if (Array.isArray(area)) {
      // if it is, then we need to parse it as a row
      area.forEach(element => {
        // if it is, then we need to parse it as a row
        const field = parseViewField(element, data, key);
        if (field) {
          areaFields.push(field);
        }
      });
    } else {
      // if it is not, then we need to parse it as a field
      const field = parseViewField(area, data, key);
      if (field) {
        areaFields.push(field);
      }
    }
    if (areaFields.length) {
      areas.push(areaFields);
    }
  });

  if (allowStaticOnlySection) {
    return areas.length ? { name: section.name, areas, columns: !!section.columns } : null;
  }

  const hasNonStaticFields = areas.some((area) => {
    if (Array.isArray(area)) {
      return area.some((field) => !valueExists(field.type, STATIC_TYPES));
    }
    return !valueExists(area.type, STATIC_TYPES);
  });

  return hasNonStaticFields ? { name: section.name, areas, columns: !!section.columns } : null;
}

/**
 * Check if a value is in the object
 * @function
 * @param {string | number} value - value to check
 * @returns {boolean} true if value is in the object
 */
export const valueExists = (value, obj) => Object.values(obj).includes(value);

/**
 * Parse a field
 * @function
 * @param {object} field - field object
 * @param {Map<string, string>} asyncFieldsMap - map of async fields
 * @returns {ParsedField} parsed field
 */
export function parseViewField(field, data, key, nested = false) {
  if (!field) {
    return null;
  }

  if (field.hideIf) {
    if (Array.isArray(field.hideIf)) {
      if (field.hideIf.includes(key)) {
        return null;
      }
    } else if (field.hideIf === key) {
      return null;
    }
  }

  const hidden = !!field[CONDITIONAL_RENDER.HIDDEN];
  if (hidden && !field.conditions) {
    return null;
  }

  const conditionalProps = getConditionalLoadout(field, data);
  // Check if the field's hidden has been changed by the conditional loadout
  if (conditionalProps?.hidden || (hidden && conditionalProps?.hidden !== false)) {
    return null;
  }

  delete conditionalProps.hidden;

  const { label, type, model, linkFormat, defaultValue } = field;
  const fieldId = model?.name || field.path;
  let name = fieldId || `unknown${model?.id || ''}`;
  let inData = data?.[name];

  // Check if the field is static and generate a unique id / name
  const isStatic = valueExists(type, STATIC_TYPES);
  if (isStatic || !fieldId) {
    inData = null;
    name = `${type}-${Date.now()}`;
  }

  const empty = defaultValue || 'N/A';

  let parsedField = {
    id: name,
    label,
    type,
    empty,
    className: field.className,
    ...conditionalProps,
  };

  if (valueExists(field.type, STATIC_TYPES)) {
    parsedField = { ...parsedField, ...getStaticProps(field, data) };
  } else if (!valueExists(field.type, FIELDS)) {
    console.warn(`Field type ${type} is not supported by the view layout`);
    return parsedField;
  }

  if (field.singleColumnSize) {
    parsedField.singleColumnSize = parseInt(field.singleColumnSize);
  }

  if (type === FIELDS.TEXT) {
    parsedField[EMAIL] = !!field[EMAIL];
    parsedField[PHONE] = !!field[PHONE];
    parsedField[ZIP] = !!field[ZIP];
  }

  if (nested) {
    return parsedField;
  }

  if (type === FIELDS.OBJECT && field.linkFormat) {
    parsedField.renderAsLinks = true;
    parsedField.linkFormat = linkFormat;
  }

  parsedField.value = getViewValue(field, inData, empty, key);
  parsedField.rawValue = inData;

  if (parsedField.value === empty && parsedField.renderAsLinks) {
    parsedField.renderAsLinks = false;
  }

  return parsedField;
}
/**
 * Get the value of the view view model
 * @function
 * @param {object} field - field object
 * @param {any} inData - data to parse
 * @param {string} empty - empty value
 * @param {string} key - key of the field
 * @returns {any} value of the view
 */
export const getViewValue = (field, inData, empty, key) => {
  const { type } = field;

  const extractName = (item) => item?.name || item?.label;
  let value = inData;
  if (isEmpty(inData)) {
    value = empty;
  } else {
    if (type === FIELDS.CHOICE || type === FIELDS.OBJECT) {
      // If data is an array get the label of each item
      if (!inData) {
        value = empty;
      } else if (Array.isArray(inData)) {
        if (type === FIELDS.OBJECT && field?.linkFormat) {
          value = inData;
        } else {
          value = inData.map(extractName).join(', ');
        }
      } else if (typeof inData === 'object') {
        if (type === FIELDS.OBJECT && field?.linkFormat) {
          value = inData;
        } else {
          value = extractName(inData);
        }
      }
    }

    if (type === FIELDS.INT) {
      value = parseInt(value);
    }

    if (type === FIELDS.FLOAT) {
      value = parseFloat(value);
    }

    if (type === FIELDS.CURRENCY) {
      value = currencyFormatter(value);
    }

    if (type === FIELDS.DATE) {
      value = dateFormatter(value);
    }

    if (type === FIELDS.TEXT || type === FIELDS.LONG_TEXT) {
      if (field[PHONE]) {
        value = formatPhoneNumber(value);
      }
    }

    // Special case for cluster fields
    if (type === FIELDS.CLUSTER) {
      const headers = [];
      const subFields = field.layout?.map((subF) => {
        const parsedField = parseViewField(subF, null, key, true);
        headers.push(parsedField.label);
        return parsedField;
      });
      // const subFields = field.layout?.map((subF) => {
      //   const { label, type, model, defaultValue: empty } = subF;
      //   const name = model?.name || `unknown${model?.id || ''}`;
      //   headers.push({label, id: name});
      //   return {id: name, label, type, empty};
      // });

      const rows = [];
      if (Array.isArray(inData)) {
        inData.forEach((item) => {
          const row = subFields.map((subF) => getViewValue(subF, item[subF.id], subF.empty, true));
          rows.push(row);
        });
      }

      value = { headers, rows };
      // Loop through the sub fields and parse them
      // This will also populate the validations property for each sub field
      // const subFields = field.layout?.map((subF) => parseViewField(subF, inData, key, true));
      // parsedField.subFields = subFields;
    }
  }

  return value;
}

/**
 * Parse and set various properties for supported static fields
 * @function getStaticProps
 * @param {object} field - field object
 * @returns {object} parsed field
 */
export function getStaticProps(field) {
  const { type } = field;

  const staticProps = {
    static: true
  };

  if (type === STATIC_TYPES.COMPONENT) {
    staticProps.component = field.component;
    staticProps.componentProps = field.componentProps || {};
  }

  if (type === STATIC_TYPES.IMAGE) {
    staticProps.src = field.src;
    staticProps.alt = field.alt;
  }

  if (type === STATIC_TYPES.TEXT || type === STATIC_TYPES.HEADER) {
    staticProps.text = field.text;
    staticProps.variant = field.variant;
  }

  return staticProps;
}

/**
 * Get the conditional loadout for a field
 * @function getViewFieldValue
 * @param {object} inData - data object
 * @returns {string | object[]} field value
 */
export function getViewFieldValue(inData) {
  if (Array.isArray(inData)) {
    return sortOn((inData)).map((con) => {
      if (isObject(con)) {
        return con?.id;
      }
      return con;
    });
  }

  if (isObject(inData)) {
    return inData?.id?.toString() || '';
  }

  return inData?.toString() || '';
}

/**
 * Check if a field is visible based on the conditions and data
 * @function getConditionalLoadout
 * @param {object} field - parsed field
 * @param {object} data - data object
 * @returns {object} returns the conditional loadout for the field
 */
export const getConditionalLoadout = (field, data) => {
  const { conditions } = field || {};
  let props = {};
  if (conditions?.length) {
    conditions.forEach((condition) => {
      const { when: triggerId, is: value, isValid, then: loadOut } = condition;
      let triggerData = data[triggerId];

      if (!isEmpty(triggerData)) {
        triggerData = getViewFieldValue(triggerData);
      }

      if (isValid || triggerData?.toString() === value?.toString()) {
        props = { ...props, ...loadOut };
      }
    });
  }
  return props;
};
