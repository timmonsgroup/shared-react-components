/**
 * Deeply clone an object.
 * @param {*} target
 * @param {*} source
 * @returns
 */
export const mergeDeep = (target, source) => {
  if (typeof target !== 'object') {
    target = {};
  }

  if (Array.isArray(target) && !Array.isArray(source)) {
    target = {};
  }

  Object.keys(source).forEach(key => {
    if (source[key] === null) {
      target[key] = null;
    } else if (Array.isArray(source[key])) {
      target[key] = source[key].slice();
    } else if (typeof source[key] === 'object') {
      target[key] = mergeDeep(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  });
  return target;
};

/**
 * Cases, we don't need no stinking cases.
 * @param {*} valueA
 * @param {*} valueB
 * @returns
 */
export function caseless(valueA, valueB) {
  if (valueA === valueB) {
    return 0;
  }

  // These two conditionals will put empty string, null, or undefined as the last items in a sort.
  if (valueA === null || valueA === undefined || valueA === '') {
    return 1;
  }

  if (valueB === null || valueB === undefined || valueB === '') {
    return -1;
  }

  return (valueA).toLowerCase().localeCompare((valueB).toLowerCase());
}

/**
 * Used to correctly handle sorting floats
 * @param valueA
 * @param valueB
 * @returns
 */
export function floatCompare(valueA, valueB) {
  const nA = parseFloat(valueA);
  const nB = parseFloat(valueB);
  if (valueA === valueB) {
    return 0;
  }

  // These two conditionals will put empty string, null, or undefined as the first items in a sort.
  if (Number.isNaN(nA)) {
    return -1;
  }

  if (Number.isNaN(nB)) {
    return 1;
  }
  return (nA > nB) ? 1 : -1;
}

/**
 * Sorts array of objects by a given prop and returns a copy
 * @param items
 * @param prop
 * @returns array
 */
export function sortOn(items, prop = 'label', isNumber = false) {
  if (!items || items.length < 2) {
    return items && items.length ? [...items] : [];
  }

  if (!Array.isArray(items)) {
    return [items];
  }

  if (isNumber) {
    return [...items].sort((a, b) => floatCompare(a[prop], b[prop]));
  }

  return [...items].sort((a, b) => caseless(a[prop], b[prop]));
}

export const createZoomOption = (label, value, extent) => ({ label, value, extent });
export const zoomableOption = (item, labelProp = 'label', valueProp = 'id') => {
  return createZoomOption(item[labelProp], item[valueProp], item.fields?.extent);
};

export function zoomablesOptions(zoomables, labelProp = 'label', valueProp = 'id') {
  return sortOn(zoomables, 'label').map((item) => zoomableOption(item, labelProp, valueProp));
}

export const getSectionChoices = (layout, sectionName, modelName) => {
  if (!layout || !layout.sections) {
    return [];
  }

  const section = layout.sections.find(s => s.name === sectionName);
  if (!section?.layout) {
    return [];
  }

  const type = section.layout.find(l => l.model.name === modelName);
  const choices = type?.possibleChoices ? type?.possibleChoices.map(item => ({
    label: item.name,
    id: item.id,
  })) : [];

  return choices;
}

export const processLayout = (layout) => {
  if (!layout || !layout.sections) {
    return layout;
  }

  const sections = layout.sections.map((section) => {
    const fields = section.layout.map(getStructure);
    return { name: section.name, fields: fields };
  });

  return sections;
}

export const processGenericLayout = (layout) => {
  if (!layout || !layout.sections || layout.isGeneric) {
    return layout;
  }

  const sections = layout.sections.map((section) => {
    const fields = section.layout.map(getStructure);
    return { name: section.name, fields: fields };
  });

  const layoutTypes = {
    1: 'Form',
    2: 'Grid',
  }

  const data = {};
  
  if(layout.data) {
    data.source = layout.data;
  }

  if(layout.grid) {
    data.gridConfig = layout.grid;
  }

  let newLayout = {
    sections: sections,
    title: layout.name,
    id: layout.id,
    type: layoutTypes[layout.type] || "Unknown Layout Type: " + layout.type,
    editable: layout.editable,
    data,
    isGeneric: true,
  }

  return newLayout;
}

function getStructure(field) {
  const model = field.model || {};
  const name = model.name || `unknown${model.id}`;
  const { label,linkFormat } = field;
  const required = !!field.required;
  const readOnly = !!field.readOnly;
  const disabled = false;
  const hidden = !!field.hidden;

  const dynField = {
    hidden,
    required,
    disabled,
    type: field.type,
    path: field.path,
    isArrayData: !!model.multiple,
    isStringId: !!model.isStringId,
    render: {
      type: field.type,
      label,
      name,
      hidden,
      required,
      disabled,
      readOnly,
      linkFormat,
    }
  };

  if (field.possibleChoices) {
    const choices = field?.possibleChoices ? field?.possibleChoices.map(item => ({
      label: item.name,
      id: item.id,
    })) : [];

    dynField.render.choices = choices;
  }

  if(field.width) {
    dynField.width = field.width
  }

  if(field.flex) {
    dynField.flex = field.flex
  }

  return dynField;
}

export const hasPermission = (permission, acl) => {
  return acl?.includes(permission) || false;
}

export const hasAllPermissions = (permissions, acl) => {
  for (let perm of permissions) {
    if (!acl?.includes(perm)) {
      return false;
    }
  }

  return true;
}

export const hasAnyPermissions = (permissions, acl) => {
  for (let perm of permissions)
    if (acl.includes(perm))
      return true;

  return false;
}

export function zeroPad(num, size = 3) {
  return num.toString().padStart(size, '0');
}

/**
 * Return a date string from either an ag grid cell object or string
 * @param inc : string | ag grid cell params
 * @returns string
 */
export function dateFormatter(inc) {
  if(inc instanceof Date) {
    return dateToString(inc);
  }

  if ((!inc || (typeof inc === 'object' && !inc.value))) {
    return '';
  }

  const date = new Date(typeof inc === 'object' ? inc.value : inc);
  return dateToString(date);
}

export function dateToString(date) {
  if (!date) {
    return '';
  }

  return `${zeroPad(date.getMonth() + 1, 2)}/${zeroPad(date.getDate(), 2)}/${date.getFullYear()}`;
}

export const headerColor = (theme) => {
  return theme.palette.text.header;
}

export const specialColor = (theme) => {
  return theme.palette.text.special;
}
