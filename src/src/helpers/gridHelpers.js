
/** @module GridHelpers */
import { dateFormatter, currencyFormatter } from './helpers.js';
/**
* This is the base config for a column that is used by the MUIGrid component
* It takes a column from the layout and converts it into a config that can be used by the MUIGrid component
* @function
* @param {LayoutColumn} column - The column from the layout
* @returns {Object} - The column config for the MUIGrid component
* @see https://mui.com/components/data-grid/columns/
*/
export const baseColumnConfig = (layoutColumn, nullValue) => {

  let retCol = {
    field: layoutColumn.path || layoutColumn.render.name,
    fieldID: layoutColumn?.model?.field?.id,
    headerName: layoutColumn.render.label,
    headerClassName: 'pam-grid-header',
    source: layoutColumn,
  };

  if (layoutColumn.path && layoutColumn.path.includes('.') || layoutColumn.type == 10) {

    //We are a subfield, so we need to use the valueGetter to get the value
    retCol.valueGetter = (params) => {
      let path = layoutColumn.path.split('.');
      //Only return the top level value
      return params.row[path[0]];
    };

    // If the path includes a . then we need to dig down into the value so we will need to define a custom filterOperator
    // The input component will need to be a text field
    let filterOperator = {
      label: 'Contains',
      value: 'contains',
      getApplyFilterFn: (filterItem) => {
        return (params) => {
          if (!filterItem.value && filterItem.value !== 0) return true;
          let path = layoutColumn.path.split('.');
          let val_ = params?.row;
          for (const element of path) {
            val_ = val_ != null ? val_[element] : null;
          }

          // if the value is an array we need map the names to a string
          if (Array.isArray(val_)) {
            val_ = val_.filter(v => v !== null && v!== undefined).map(v => v?.name).join(' ');
          }

          // If the value is an object then we need to get the name
          if (typeof val_ === 'object') {
            val_ = val_?.name;
          }

          return val_ != null ? val_.toString().toLowerCase().includes(filterItem.value.toLowerCase()) : false;
        };
      },
    };
    retCol.filterOperators = [filterOperator];
  }

  // If the layout column has flex set then set the flex property
  if (layoutColumn.flex != undefined && layoutColumn.flex != null) {
    retCol.flex = layoutColumn.flex;

    // Additionally if the width is set then set the minWidth property
    if (layoutColumn.width != undefined && layoutColumn.width != null) {
      retCol.minWidth = layoutColumn.width;
    }
  } else {
    // Otherwise if the width is set then set the width property
    if (layoutColumn.width != undefined && layoutColumn.width != null) {
      retCol.width = layoutColumn.width;
    }
  }

  // If the layout column has a hidden property set to true then set the hide property
  if (layoutColumn.hidden) {
    retCol.hide = true;
  }

  retCol.nullValue = layoutColumn.nullValue || nullValue;

  return retCol;
};

/**
   * This function provides a date value or a default value if the date is null or undefined
   * It is used to render the cell as 'N/A' if the date is null or undefined
   * @function
   * @param {Date|String} value
   * @param {String} defaultValue
   * @returns {object}
   */
export const getDateOrDefault = (value, defaultValue) => {

  if (!value)
    return defaultValue;

  const val = new Date(value);

  // If the date is invalid, return null
  if (isNaN(val.getTime())) {
    return defaultValue;
  }

  return val;
};

/**
 * This function provides a date value or a default value if the date is null or undefined.
 * The returned date is formatted as a string according to the common dateFormatter for the entire app.
 * @function
 * @param {Date|String} value
 * @param {String} defaultValue
 * @returns {String}
 * @see dateFormatter
 * @see getDateOrDefault
 */
export const getDateOrDefaultFormatted = (value, defaultValue) => {
  const val = getDateOrDefault(value, null);
  if (val) return dateFormatter(val);
  return defaultValue;
};

/**
 * This provides a name value or a default value if the name is null or undefined
 * It is used to render the cell as 'N/A' if the object or name is null or undefined
 * @function
 * @param {Object} value - The object that contains the name
 * @param {String} defaultValue - The default value to return if the name is null or undefined
 * @returns {String}
 */
export const getValueNameOrDefault = (value, defaultValue) => {
  if (!value) {
    return defaultValue;
  }

  // If its a list of objects get all their names and join them
  if (Array.isArray(value)) {
    return value.map(v => v?.name).join(', ');
  }

  return value.name || defaultValue;
};


/**
 * This function provides the basic formatting. We do not need to provide a getter or formatter for basic fields
 * If the editable flag is set to true then we will set the editable property to true and provide a valueSetter
 * @function
 * @param {Object} muiGridColumn
 */
export const addBasicFormatting = (muiGridColumn, editable) => {
  if (editable) {
    muiGridColumn.editable = true;
    muiGridColumn.valueSetter = ({ value, row }) => {
      // This does not work on the 'id' column BTW
      row[muiGridColumn.field] = value;
      return row;
    };
  }
}

/**
   * This takes a mui column and adds formatting to it to handle date fields
   * @function
   * @param {Object} muiGridColumn - The column from the layout
   * @see https://mui.com/components/data-grid/filtering/#value-getter
   * @see https://mui.com/components/data-grid/filtering/#value-options
   */
export const addDateFormatting = (muiGridColumn, editable) => {
  muiGridColumn.type = 'date';
  muiGridColumn.valueGetter = ({ value }) => getDateOrDefault(value, null); // Value GETTER needs to return null for the date to be displayed as N/A and for the filter to work
  muiGridColumn.valueFormatter = ({ value }) => getDateOrDefaultFormatted(value, muiGridColumn.nullValue);

  if (editable) {
    muiGridColumn.editable = true;
    muiGridColumn.valueSetter = ({ value, row }) => {
      // Update the row
      // This does not work on the 'id' column BTW
      row[muiGridColumn.field] = value;
      return row;
    };
  }
};

/**
 * @function addCurrencyFormatting
 * @param {object} muiGridColumn - The muiGridColumn to add the formatting to
 */
export const addCurrencyFormatting = (muiGridColumn) => {
  muiGridColumn.type = 'number';
  muiGridColumn.valueFormatter = ({ value }) => {
    if (value == null) return muiGridColumn.nullValue;
    return currencyFormatter(value);
  };
};


/**
   * This takes a mui column and adds formatting to it to handle single select fields.
   * It extracts the possible values from the layout column and adds them to the column config as choices
   * The filter uses these choices to filter the data
   * @function
   * @param {Object} muiGridColumn - The column used by the MUIGrid component
   * @param {Object} layoutColumn - The column from the layout
   * @see https://mui.com/components/data-grid/filtering/#value-getter
   * @see https://mui.com/components/data-grid/filtering/#value-options
   */
export const addSingleSelectFormatting = (muiGridColumn, layoutColumn, editable) => {
  // single select
  muiGridColumn.type = 'singleSelect';
  muiGridColumn.valueOptions = layoutColumn.render.choices.map(c => {
    if (!c) return { value: null, label: null };
    return { value: c.label || c.name, label: c.label || c.name };
  });
  muiGridColumn.valueGetter = ({ value }) => getValueNameOrDefault(value, muiGridColumn.nullValue);

  if (editable) {
    muiGridColumn.editable = true;
    muiGridColumn.valueSetter = ({ value, row }) => {
      // Update the row
      // Re-map the value to the object
      const mapped = layoutColumn.render.choices.find(c => c?.label === value);
      if (mapped) {
        row[muiGridColumn.field] = mapped.source;
      }
      return row;
    };
  }
};

/**
 * This takes a mui column and adds formatting to it to handle object reference fields
 * It generates a link to the object reference
 * @function
 * @param {Object} muiGridColumn - The column used by the MUIGrid component
 * @param {Object} linkFormat - The column from the layout - TODO: This isnt true as we destructured the linkFormat from the layout column
 */
const addObjectReferenceFormatting = (muiGridColumn, { path }) => {
  if (path) {
    muiGridColumn.valueFormatter = ({ value }) => {

      let path_parts = path.split('.');

      //Remove the first element from the array
      path_parts.shift();

      for (const element of path_parts) {
        value = value != null ? value[element] : null;
      }

      // If the result is an object use the getNameOrDefault function to get the name or N/A
      if (value && typeof value === 'object') {
        return getValueNameOrDefault(value, muiGridColumn.nullValue);
      }

      // If the result is a string use the string or N/A
      if (value && typeof value === 'string') {
        return value;
      }
    };
  } else {
    muiGridColumn.valueFormatter = ({ value }) => getValueNameOrDefault(value, muiGridColumn.nullValue);
  }

  muiGridColumn.sortComparator = (A, B) => {
    let compareValue = 0;
    // If both values are not null, compare the names using the localeCompare function
    if ((A !== null && A !== undefined) && (B !== null && B !== undefined)) {
      compareValue = (A.name + '').localeCompare(B.name + '');
    } else if (A === null || A === undefined) { // Otherwise if A is null, return -1 so it goes above when sorted
      compareValue = -1;
    } else { // Otherwise if B is null, return 1 so it goes to below when sorted
      compareValue = 1;
    }

    return compareValue;
  };
};

/**
 * This takes a mui column and adds formatting to it to handle external link fields
 * It generates a link to the external link
 * @function addExternalLinkFormatting
 * @param {Object} muiGridColumn - The column used by the MUIGrid component
 * @see https://mui.com/components/data-grid/rendering/#cell-renderers
 */
export const addExternalLinkFormatting = (muiGridColumn) => {

};

/**
 * This takes a mui column and adds formatting to it to handle action button fields
 * @function
 * @param {object} muiGridColumn - The column used by the MUIGrid component
 * @param {ActionData} actionData - The action data from the layout
 */
const addActionButtonFormatting = (muiGridColumn, actionData) => {
  // Get actions
  const actions = actionData?.actionList || [];
  actions.sort((a, b) => a.order - b.order);

};

/**
 * @typedef {Object} LayoutColumn
 * @property {string} path - The path to the data for the column
 * @property {number} type - The type of the column
 * @property {string} width - The width of the column
 * @property {string} [minWidth] - The value to display if the column is null
 * @property {number} [flex]  - The flex value for the column
 * @property {string} [nullValue] - The value to display if the column is null
 * @property {function} [columnOverride] - A function that takes a layout column and returns a mui column
 */

/**
 * This function takes a layout column and returns a mui column
 * It will determine the type of column and add formatting to the mui column
 * @function convertLayoutColumnToMuiColumn
 * @param {LayoutColumn} column
 * @returns {MuiGridColumn}
 */
export const convertLayoutColumnToMuiColumn = (column, nullValue, editable) => {
  let ret = baseColumnConfig(column, nullValue);

  if (column.columnOverride && typeof column.columnOverride === 'function') {
    return column.columnOverride(column, ret);
  }

  switch (column.type) {
    case 0: // Short Text
    case 1: // Long Text // These two fields dont need any special formatting
    case 2: // Integer
    case 3: // Float
      addBasicFormatting(ret, editable);
      break;
    case 4: // Currency
      addCurrencyFormatting(ret, editable); break;
    case 5: addDateFormatting(ret, editable); break; // Date
    case 6: // Flag
      break;
    case 7: addSingleSelectFormatting(ret, column, editable); break; // Single Select
    case 10: addObjectReferenceFormatting(ret, column, editable); break; // Object Link
    case 99: addActionButtonFormatting(ret, column.render); break; // Action Buttons
    case 100: addExternalLinkFormatting(ret); break; // Link
    default: console.error('Unknown column type', column.type); break;
  }

  return ret;
};