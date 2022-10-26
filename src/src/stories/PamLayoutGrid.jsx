import React from 'react';
import PropTypes from 'prop-types';

import { ButtonGroup } from '@mui/material';
import { DataGrid as MUIGrid, GridToolbar as MUIGridToolbar } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';

import Button from './Button';

import { dateFormatter, processLayout } from '../helpers';

/**
 * This is the base config for a column that is used by the MUIGrid component
 * It takes a column from the layout and converts it into a config that can be used by the MUIGrid component
 * @param {Object} column - The column from the layout
 * return {Object} - The column config for the MUIGrid component
 * @see https://mui.com/components/data-grid/columns/
 */
const baseColumnConfig = (layoutColumn) => {
  let retCol = {
    field: layoutColumn.render.name,
    headerName: layoutColumn.render.label,
    headerClassName: 'cpp-grid-header'
  };

  // If the layout column has flex set then set the flex property
  if(layoutColumn.flex != undefined && layoutColumn.flex != null) {
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

  return retCol;

}

/**
 * This function provides a date value or a default value if the date is null or undefined
 * It is used to render the cell as 'N/A' if the date is null or undefined
 * @param {Date|String} value
 * @param {String} defaultValue
 * @returns
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
  muiGridColumn.valueFormatter = ({ value }) => getDateOrDefaultFormatted(value, 'N/A');
}

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
  muiGridColumn.valueGetter = ({ value }) => getValueNameOrDefault(value, 'N/A');

}

// This takes a mui column and adds formatting to it to handle action button fields
const addActionButtonFormatting = (muiGridColumn, actionData) => {
  // Get actions
  const actions = actionData?.actionList || [];
  actions.sort((a, b) => a.order - b.order);

  // Create a button group with buttons for each action
  muiGridColumn.renderCell = (params) => {
    return (
      <ButtonGroup
        aria-label="action button group"
        size="small"
        sx={{
          margin: 'auto',
        }}
        variant="text"
      >
        {actions.map((action, index) => {
          return (
            <Button
              key={index}
              // Pass in the row data to the action - up to the caller to unpack
              onClick={() => { action.clickHandler(params.row) }}
              size="small"
              sx={{
                color: '#231100', // TODO figure out where to pull from theme - got this hex from invis
                paddingX: '0.75rem',
              }}
              variant="text"
            >
              {action.label}
            </Button>
          )
        })}
      </ButtonGroup>
    );
  }
}

/**
 * Returns a base action object
 * @param {Object} action - the action
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
  }
}

/**
 * This takes a mui column and adds formatting to it to handle object reference fields
 * It generates a link to the object reference
 * @param {Object} muiGridColumn - The column used by the MUIGrid component
 * @param {Object} linkFormat - The column from the layout - TODO: This isnt true as we destructured the linkFormat from the layout column
 */
const addObjectReferenceFormatting = (muiGridColumn, { linkFormat }) => {
  // Object Link
  if (linkFormat) {
    muiGridColumn.renderCell = (params) => {
      let value = params.row[params.field]
      if (params && value) {
        let link = linkFormat
        link = link.replace('{id}', value.id)
          .replace('${streamID}', value.streamID)
          .replace('${name}', value.name);

        return (
          <Link to={`${link}`}>
            {params.value.name || 'No Name'}
          </Link>
        )
      }
      return 'N/A';
    }
  }

  muiGridColumn.valueFormatter = ({ value }) => getValueNameOrDefault(value, 'N/A');

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

    return compareValue
  }

}

/**
 * This takes a mui column and adds formatting to it to handle external link fields
 * It generates a link to the external link
 * @param {Object} muiGridColumn - The column used by the MUIGrid component
 * @see https://mui.com/components/data-grid/rendering/#cell-renderers
 */
const addExternalLinkFormatting = (muiGridColumn) => { // Link
  muiGridColumn.renderCell = (params) => {
    if(typeof params.value === 'string') {
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
    return 'N/A';
  }
}

/**
 * This function takes a layout column and returns a mui column
 * It will determine the type of column and add formatting to the mui column
 * @param {LayoutColumn} column
 * @returns {MuiGridColumn}
 */
const convertLayoutColumnToMuiColumn = (column) => {
  let ret = baseColumnConfig(column);

  switch (column.type) {
    case 0: // Short Text
    case 1: // Long Text // These two fields dont need any special formatting
      break;
    case 5: addDateFormatting(ret); break; // Date
    case 7: addSingleSelectFormatting(ret, column); break; // Single Select
    case 10: addObjectReferenceFormatting(ret, column.render); break; // Object Link
    case 99: addActionButtonFormatting(ret, column.render); break; // Action Buttons
    case 100: addExternalLinkFormatting(ret); break; // Link
    default: console.log('Unknown column type', column.type); break;
  }

  return ret;
}


/**
 * Primary UI component for user interaction
 * @param {Object} props - The props for the component
 * @param {Object} props.data - The data for the grid
 * @param {Object} props.layout - The layout for the grid
 * @param {Object} props.initialSortColumn - The initial sort column for the grid
 * @param {Object} props.initialSortDirection - The initial sort direction for the grid
 * @param {Object} props.showToolbar - Whether to show the toolbar
 */
// eslint-disable-next-line
const PamLayoutGrid = ({ data, layout, initialSortColumn, initialSortDirection, showToolbar, actions, ...props }) => {

  const processedLayout = processLayout(layout);
  const layoutColumns = processedLayout && processedLayout.length ? processedLayout[0].fields : [];

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
  let renderColumns = (layoutColumns || []).map(convertLayoutColumnToMuiColumn).filter(Boolean); // Remove any columns that are not defined

  // If we have showToolbar set to true, then we add the toolbar component
  const components = {
    Toolbar: showToolbar ? MUIGridToolbar : null,
  }

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


  const styleOverrides = {
    width: '100%',
    height: '100%',
    minHeight: '500px',
    minWidth: '700px',
    flexGrow: 1,
    '& .cpp-grid-header': { // This is the header to the grid. We set the background color to match the theme from invision
      backgroundColor: 'rgba(43,92,146,1)',
      color: 'white'
    },
    '& .MuiDataGrid-iconButtonContainer > .MuiButtonBase-root': { // Since the header is dark the icons need to be light
      color: 'white'
    },
    '& .MuiDataGrid-menuIcon > .MuiButtonBase-root': { // Since the header is dark the icons need to be light
      color: 'white'
    },
    '& .row-odd': { // Odd rows are slightly darker
      backgroundColor: 'rgba(230,236,242,1)',
    }
  };

  return (
    <>
      <MUIGrid
        rows={data}
        columns={renderColumns}
        sx={styleOverrides}
        initialState={initialState}
        {...props}
        components={components}
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
  actions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    order: PropTypes.number.isRequired,
    width: PropTypes.number,
    actionList: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      order: PropTypes.number.isRequired,
      clickHandler: PropTypes.func.isRequired,
    })).isRequired,
  })),
};

PamLayoutGrid.defaultProps = {
  showToolbar: false,
};

export default PamLayoutGrid;