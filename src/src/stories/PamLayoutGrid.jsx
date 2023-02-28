import React from 'react';
import PropTypes from 'prop-types';

import { ButtonGroup } from '@mui/material';
import { DataGrid as MUIGrid, GridToolbar as MUIGridToolbar, GridFilterInputValue } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

import Button from './Button';

import { dateFormatter, processLayout, processGenericLayout } from '../helpers/helpers.js';

// Default options for a somewhat sane initial render of the grid
const defaultSX = {
  width: '100%',
  height: '100%',
  minHeight: '500px',
  minWidth: '700px',
  flexGrow: 1
};

/**
 * This is the base config for a column that is used by the MUIGrid component
 * It takes a column from the layout and converts it into a config that can be used by the MUIGrid component
 * @param {Object} column - The column from the layout
 * @returns {Object} - The column config for the MUIGrid component
 * @see https://mui.com/components/data-grid/columns/
 */
const baseColumnConfig = (layoutColumn, nullValue) => {

  let retCol = {
    field: layoutColumn.path || layoutColumn.render.name,
    fieldID: layoutColumn?.model?.field?.id,
    headerName: layoutColumn.render.label,
    headerClassName: 'pam-grid-header'
  };

  if (layoutColumn.path && layoutColumn.path.includes('.') || layoutColumn.type == 10) {

    //We are a subfield, so we need to use the valueGetter to get the value
    retCol.valueGetter = (params) => {
      let path = layoutColumn.path.split('.');
      //Only return the top level value
      return params.row[path[0]];
    }

    // If the path includes a . then we need to dig down into the value so we will need to define a custom filterOperator
    // The input component will need to be a text field
    let filterOperator = {
      label: 'Contains',
      value: 'contains',
      getApplyFilterFn: (filterItem) => {
        return (params) => {
          if (!filterItem.value) return true;
          let path = layoutColumn.path.split('.');
          let val_ = params?.row;
          for (const element of path) {
            val_ = val_ != null ? val_[element] : null;
          }

          // if the value is an array we need map the names to a string
          if (Array.isArray(val_)) {
            val_ = val_.map(v => v.name).join(' ');
          }

          // If the value is an object then we need to get the name
          if (typeof val_ === 'object') {
            val_ = val_?.name;
          }

          return val_ != null ? val_.toString().toLowerCase().includes(filterItem.value.toLowerCase()) : false;
        };
      },
      InputComponent: GridFilterInputValue
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
 * @param {Date|String} value
 * @param {String} defaultValue
 * @returns {object}
 */
const getDateOrDefault = (value, defaultValue) => {

  if (!value)
    return defaultValue;

  const val = new Date(value);

  // If the date is invalid, return null
  if (isNaN(val.getTime())) {
    return defaultValue;
  }

  return val;
}

/**
 * This function provides a date value or a default value if the date is null or undefined.
 * The returned date is formatted as a string according to the common dateFormatter for the entire app.
 * @param {Date|String} value
 * @param {String} defaultValue
 * @returns {String}
 * @see dateFormatter
 * @see getDateOrDefault
 */
const getDateOrDefaultFormatted = (value, defaultValue) => {
  const val = getDateOrDefault(value, null);
  if (val) return dateFormatter(val);
  return defaultValue;
}

/**
 * This takes a mui column and adds formatting to it to handle date fields
 * @param {Object} muiGridColumn - The column from the layout
 * @see https://mui.com/components/data-grid/filtering/#value-getter
 * @see https://mui.com/components/data-grid/filtering/#value-options
 */
const addDateFormatting = (muiGridColumn) => {
  muiGridColumn.type = 'date';
  muiGridColumn.valueGetter = ({ value }) => getDateOrDefault(value, null); // Value GETTER needs to return null for the date to be displayed as N/A and for the filter to work
  muiGridColumn.valueFormatter = ({ value }) => getDateOrDefaultFormatted(value, muiGridColumn.nullValue);
};

/**
 * This provides a name value or a default value if the name is null or undefined
 * It is used to render the cell as 'N/A' if the object or name is null or undefined
 * @param {Object} value - The object that contains the name
 * @param {String} defaultValue - The default value to return if the name is null or undefined
 * @returns {String}
 */
const getValueNameOrDefault = (value, defaultValue) => {
  if (!value) {
    return defaultValue;
  }

  // If its a list of objects get all their names and join them
  if (Array.isArray(value)) {
    return value.map(v => v.name).join(', ');
  }

  return value.name || defaultValue;
}

/**
 * This takes a mui column and adds formatting to it to handle single select fields.
 * It extracts the possible values from the layout column and adds them to the column config as choices
 * The filter uses these choices to filter the data
 * @param {Object} muiGridColumn - The column used by the MUIGrid component
 * @param {Object} layoutColumn - The column from the layout
 * @see https://mui.com/components/data-grid/filtering/#value-getter
 * @see https://mui.com/components/data-grid/filtering/#value-options
 */
const addSingleSelectFormatting = (muiGridColumn, layoutColumn) => {
  // single select
  muiGridColumn.type = 'singleSelect';
  muiGridColumn.valueOptions = layoutColumn.render.choices.map(c => { return { value: c.label || c.name, label: c.label || c.name } });
  muiGridColumn.valueGetter = ({ value }) => getValueNameOrDefault(value, muiGridColumn.nullValue);
};

//jsdoc for action type


/**
 * This is our default renderer function for grid actions
 * @param {Object} props
 * @param {ActionItem[]} props.actions - The actions to render
 * @param {Object} props.params - The params from the grid
 * @param {Object} props.themeGroup - The theme group to use for the grid actions
 * @param {Boolean} props.useTypeVariant - If true then use the type to determine the variant
 * @returns {React.ReactElement}
 */
const GridActions = ({ actions, params, themeGroup, useTypeVariant }) => {
  const theme = useTheme();

  const { gridActionItem } = theme;
  const gAI = themeGroup?.gridActionItem || gridActionItem || { color: '#231100', paddingX: '0.75rem' };

  return (
    <ButtonGroup
      aria-label="action button group"
      className="grid-actions"
      size="small"
      sx={{
        margin: 'auto',
      }}
      variant="text"
    >
      {actions.map((action, index) => {
        let variant = 'text';
        let cssClass = 'grid-action-item';
        if (action.cssClass) {
          cssClass = `${cssClass} ${action.cssClass}`;
        }
        // If the useTypeVariant is true then check the types preferring themeGroup over gridActionItem
        // If themeGroup is not set then use the gridActionItem
        // If NO variant is set then use the default 'text'
        if (useTypeVariant) {
          const type = action.type || null;
          const rootGAIType = gridActionItem?.types?.[type];
          let tempVariant = null;
          if (gAI.types) {
            const gAIType = gAI.types[type];
            if (gAIType.variant) {
              tempVariant = gAIType.variant;
            }
          }
          if (!tempVariant && rootGAIType) {
            tempVariant = rootGAIType.variant;
          }

          variant = tempVariant || 'text';
          cssClass = `${cssClass} action-${type}`;
        }

        const extraProps = action.actionProps || {};

        return (
          <Button
            key={index}
            className={cssClass}
            // Pass in the row data to the action - up to the caller to unpack
            onClick={() => { action.clickHandler(params.row) }}
            size="small"
            sx={gAI}
            variant={variant}
            {...extraProps}
          >
            {action.label}
          </Button>
        )
      })}
    </ButtonGroup>
  );
}

GridActions.propTypes = {
  actions: PropTypes.array.isRequired,
  params: PropTypes.object.isRequired,
  themeGroup: PropTypes.object,
  useTypeVariant: PropTypes.bool,
};


/**
 * @typedef {Object} ActionItem
 * @property {string} label - The label for the action
 * @property {string} type - The type of action
 * @property {string} cssClass - The css class to add to the action
 * @property {number} order - The order to display the action
 * @property {function} clickHandler - The click handler for the action
 * @property {object} actionProps - Any extra props to pass to the action component
 */

/**
 * @typedef {Object} ActionData
 * @property {ActionItem[]} actionList - The list of actions
 */


/**
 * This takes a mui column and adds formatting to it to handle action button fields
 * @param {object} muiGridColumn - The column used by the MUIGrid component
 * @param {ActionData} actionData - The action data from the layout
 * @param {object} themeGroup - The theme group to use for the actions. This will override the default theme
 * @param {JSX} actionsComponent - If you want to use a custom component for the actions, pass it in here
 */
const addActionButtonFormatting = (muiGridColumn, actionData, themeGroup, actionsComponent, useTypeVariant) => {
  // Get actions
  const actions = actionData?.actionList || [];
  actions.sort((a, b) => a.order - b.order);

  // Default to the GridActions component if no custom component is passed in
  const Actions = actionsComponent || GridActions;

  // Create a button group with buttons for each action
  muiGridColumn.renderCell = (params) => {
    return (
      <Actions actions={actions} params={params} themeGroup={themeGroup} useTypeVariant={useTypeVariant} />
    );
  };
};

/**
 * Returns a base action object
 * @function
 * @param {Object} action - the action
 * @param {string} action.label - the label for the action
 * @param {ActionItem[]} action.actionList - the list of actions
 * @returns {Object} - the base action object
 */
const getBaseAction = (action) => {
  return {
    sortable: false, // TODO Mui grid aint respecting this
    render: {
      // Empty space if no label, else MUIGirdheader gets squanched
      label: action?.label || String.fromCharCode(160), // Non-breakable space is char 160
      name: action?.label?.toLowerCase() || 'action',
      actionList: action?.actionList || [],
    },
    type: 99, // TODO need to check with BO/NG if there is a better way to manage these type IDs
    width: action?.width || 200,
    actionProps: action?.actionProps || {},
  };
};

/**
 * This takes a mui column and adds formatting to it to handle object reference fields
 * It generates a link to the object reference
 * @param {Object} muiGridColumn - The column used by the MUIGrid component
 * @param {Object} linkFormat - The column from the layout - TODO: This isnt true as we destructured the linkFormat from the layout column
 */
const addObjectReferenceFormatting = (muiGridColumn, { render, path }) => {
  let { linkFormat } = render;
  // Object Link
  if (linkFormat) {
    muiGridColumn.renderCell = (params) => {
      let path_parts = path.split('.');

      let value = params.row;

      for (const element of path_parts) {
        value = value != null ? value[element] : null;
      }

      if (params && value) {
        let link = linkFormat;
        link = link.replace('{id}', value.id)
          .replace('${streamID}', value.streamID)
          .replace('${name}', value.name);

        return (
          <Link to={`${link}`}>
            {params.value.name || 'No Name'}
          </Link>
        );
      }
      return muiGridColumn.nullValue;
    };
  }

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
    }
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
 * @param {Object} muiGridColumn - The column used by the MUIGrid component
 * @see https://mui.com/components/data-grid/rendering/#cell-renderers
 */
const addExternalLinkFormatting = (muiGridColumn) => { // Link
  muiGridColumn.renderCell = (params) => {
    if (typeof params.value === 'string') {
      if (params && params.value) {
        return (<a href={params.value} target="_blank" rel="noreferrer" >
          {params.value}
        </a>);
      }
    } else if (params.value && params.value.url) {
      return (<a href={params.value.url} target="_blank" rel="noreferrer" >
        {params.value?.label || params.value.url}
      </a>);
    }
    return muiGridColumn.nullValue;
  };
};

/**
 * This function takes a layout column and returns a mui column
 * It will determine the type of column and add formatting to the mui column
 * @param {LayoutColumn} column
 * @returns {MuiGridColumn}
 */
const convertLayoutColumnToMuiColumn = (column, themeGroup, actionsComponent, nullValue, useTypeVariant) => {
  let ret = baseColumnConfig(column, nullValue);

  switch (column.type) {
    case 0: // Short Text
    case 1: // Long Text // These two fields dont need any special formatting
    case 2: // Integer
    case 3: // Float
    case 4: // Currency
      break;
    case 5: addDateFormatting(ret); break; // Date
    case 6: // Flag
      break;
    case 7: addSingleSelectFormatting(ret, column); break; // Single Select
    case 10: addObjectReferenceFormatting(ret, column); break; // Object Link
    case 99: addActionButtonFormatting(ret, column.render, themeGroup, actionsComponent, useTypeVariant); break; // Action Buttons
    case 100: addExternalLinkFormatting(ret, themeGroup); break; // Link
    default: console.error('Unknown column type', column.type); break;
  }

  return ret;
};


/**
 * Primary UI component for user interaction
 * @param {Object} props - The props for the component
 * @param {Object} props.data - The data for the grid
 * @param {Object} props.layout - The layout for the grid
 * @param {String} props.initialSortColumn - The initial sort column for the grid
 * @param {String} props.initialSortDirection - The initial sort direction for the grid
 * @param {Boolean} props.showToolbar - Whether to show the toolbar
 * @param {Array} props.actions - The actions column for the grid
 * @param {Object} props.themeGroup - The theme group for the grid use this to override the default theme group found in "pamGrid" of muiTheme.js
 * @param {Object} props.actionsComponent - The component to use for the actions column
 * @param {Boolean} props.useTypeVariant - Whether to use the type variant for the grid
 */
// eslint-disable-next-line
const PamLayoutGrid = ({ data, layout, initialSortColumn, initialSortDirection, showToolbar, actions, themeGroup, actionsComponent, useTypeVariant, ...props }) => {

  const theme = useTheme();
  // Extract the 'pamGrid' theme group from the theme
  const { pamGrid } = theme;

  // If a theme group was passed in, use that instead of the default
  const theming = themeGroup || pamGrid;
  // We add several safeguard values to the theme group, they will be overriden if they are defined in the theme group
  // Not setting these values will cause the grid to render in less than ideal ways
  const sxProps = {
    ...defaultSX,
    ...theming,
  };

  let processedLayout = layout;
  const hasType = Object.prototype.hasOwnProperty.call(layout, 'type');

  //If the layout has a type property and that property is a number then we are using the new generic layout and should process it as such
  if (hasType && typeof layout.type === 'number') {
    processedLayout = processGenericLayout(layout);
  } else if (hasType && typeof layout.type === 'string') { // If the layout has a type property and that property is a string then we are using an already processed new layout and should use it as is
    processedLayout = layout;
  } else { //Otherwise use our own layout processing
    processedLayout = { name: 'Unknown', sections: processLayout(layout) };
  }

  const nullValue = processedLayout?.data?.source?.nullValue || 'N/A';
  const layoutColumns = processedLayout?.sections && processedLayout?.sections?.length ? processedLayout.sections[0].fields : [];

  // Check for optional actions
  if (actions?.length) {
    actions.sort((a, b) => a.order - b.order);
    const actionsColumns = actions.map(action => {
      return getBaseAction(action);
    });

    // Append the actions to the end of the columns
    layoutColumns.push(...actionsColumns);
  }


  // This converts the layout field into a list of columns that can be used by the MUIGrid component
  let renderColumns = (layoutColumns || []).map((item) => convertLayoutColumnToMuiColumn(item, themeGroup, actionsComponent, nullValue, useTypeVariant)).filter(Boolean); // Remove any columns that are not defined

  // If we have showToolbar set to true add the Toolbar component to the grid and set other props
  const compThings = showToolbar ? {
    components: { Toolbar: MUIGridToolbar },
    // Four buttons appear on the MUI grid by default, we want to hide them
    disableColumnSelector: true,
    disableDensitySelector: true,
    disableExportSelector: true,
    componentsProps: {
      toolbar: {
        // Quick filter is a search box that appears in the toolbar
        showQuickFilter: true,
        quickFilterProps: { debounceMs: 500 },
        //Disable csv and print to completely remove the "Export" button
        csvOptions: { disableToolbarButton: false },
        printOptions: { disableToolbarButton: true },
      },
    },
  } : {};

  const initialState = {
    pagination: {
      pageSize: 10
    }
  };

  // If we have an initial sort column, then we set it in the initial state
  if (initialSortColumn) {
    initialState.sorting = {
      sortModel: [{ field: initialSortColumn, sort: initialSortDirection === 'desc' ? 'desc' : 'asc' }],
    };
  }


  // This is the start of our new generic layout processing
  if (processedLayout.data) {
    //Check if we have an idField and set the id column of the grid to that
    if (processedLayout.data.source?.idField) {
      props.getRowId = (row) => row[processedLayout.data.source.idField];
    }

    if (processedLayout.data.gridConfig) {
      if (processedLayout.data.gridConfig.sort) {
        // The sort property should have a field property and an order property
        // The field property should be the name of the column to sort by
        // The order property should be either 'asc' or 'desc'
        initialState.sorting = {
          sortModel: [{
            field: processedLayout.data.gridConfig.sort.field,
            sort: processedLayout.data.gridConfig.sort.order === 'desc' ? 'desc' : 'asc'
          }]
        };
      }
    }
  }

  return (
    <>
      <MUIGrid
        rows={data}
        columns={renderColumns}
        sx={sxProps}
        initialState={initialState}
        {...props}
        {...compThings}
        rowsPerPageOptions={props.rowsPerPageOptions || [10, 25, 50, 100]}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'row-even' : 'row-odd'
        }
      />
    </>
  );
};

PamLayoutGrid.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  layout: PropTypes.object.isRequired,
  initialSortColumn: PropTypes.string,
  initialSortDirection: PropTypes.oneOf(['asc', 'desc']),
  showToolbar: PropTypes.bool,
  useTypeVariant: PropTypes.bool,
  actionsComponent: PropTypes.elementType,
  actions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    order: PropTypes.number.isRequired,
    width: PropTypes.number,
    actionList: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      order: PropTypes.number.isRequired,
      type: PropTypes.string,
      clickHandler: PropTypes.func.isRequired,
    })).isRequired,
  })),
};

PamLayoutGrid.defaultProps = {
  showToolbar: false,
};

export {
  PamLayoutGrid as default,
};