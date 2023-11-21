/** @module PamLayoutGrid **/
import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { ButtonGroup } from '@mui/material';
import {
  DataGrid as MUIGrid,
  GridToolbar as MUIGridToolbar,
} from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

import Button from './Button';

import { processLayout, processGenericLayout, convertToLinkFormat } from '../helpers/helpers.js';

import { convertLayoutColumnToMuiColumn } from '../helpers/gridHelpers.js';
import RenderExpandableCell from './RenderExpandableCell';

const gridContext = React.createContext();

// Default options for a somewhat sane initial render of the grid
const defaultSX = {
  width: '100%',
  height: '100%',
  minHeight: '500px',
  minWidth: '700px',
  flexGrow: 1,
};

/**
 * This is our default renderer function for external links
 * @function
 * @param {Object} muiGridColumn - The column to render
 *
 * @returns {React.ReactElement}
 */
const addExternalLinkRendering = (muiGridColumn, columnConfig) => {
  muiGridColumn.renderCell = (params) => {
    return <LinkCellWrapper muiGridColumn={muiGridColumn} params={params} />;
  };
};

//jsdoc for action type
/**
 * This is our default renderer function for grid actions
 * @function
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
  const gAI = themeGroup?.gridActionItem ||
    gridActionItem || { color: '#231100', paddingX: '0.75rem' };

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
        if (action.clickHandler) {
          // Pass in the row data to the action - up to the caller to unpack
          extraProps.onClick = () => {
            action.clickHandler(params.row);
          };
        }

        return (
          <Button
            key={index}
            className={cssClass}
            size="small"
            sx={gAI}
            variant={variant}
            {...extraProps}
          >
            {action.label}
          </Button>
        );
      })}
    </ButtonGroup>
  );
};

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
 * @function
 * @param {object} muiGridColumn - The column used by the MUIGrid component
 * @param {ActionData} actionData - The action data from the layout
 */
const addActionButtonRendering = (muiGridColumn, actionData) => {
  // Get actions
  const actions = actionData?.actionList || [];
  actions.sort((a, b) => a.order - b.order);

  // Disable export
  muiGridColumn.disableExport = true;

  // Return the action wrapper component
  // This allows us to use hooks inside the component
  muiGridColumn.renderCell = (params) => {
    return (
      <ActionWrapper
        muiGridColumn={muiGridColumn}
        actions={actions}
        params={params}
      />
    );
  };
};

/**
 * Wraps the value in a component which determines if a tooltip should be displayed
 * @function
 * @param {object} muiGridColumn - The column used by the MUIGrid component
 */
const addExpandableRendering = (muiGridColumn) => {
  muiGridColumn.renderCell = (params) => {
    return <RenderExpandableCell muiGridColumn={muiGridColumn} {...params} />;
  };
};

const addNonObjectLinkRendering = (muiGridColumn) => {
  const { render } = muiGridColumn.source || {};
  const { linkFormat } = render || {};

  if (linkFormat) {
    muiGridColumn.renderCell = (params) => {
      const { value, row } = params || {};
      if (value) {
        const link = convertToLinkFormat(linkFormat, row);
        try {
          return <Link to={`${link}`}>{value || 'No Name'}</Link>;
        } catch (err) {
          return params?.value || 'N/A';
        }
      }
      return params?.value || 'N/A';
    };
  }
};

const addObjectReferenceLinkRendering = (muiGridColumn) => {
  const { render, path } = muiGridColumn.source || {};
  const { linkFormat } = render || {};

  if (linkFormat) {
    muiGridColumn.renderCell = (params) => {
      let path_parts = path.split('.');

      let value = params.row;

      for (const element of path_parts) {
        value = value != null ? value[element] : null;
      }

      if (params && value) {
        let link = linkFormat;
        if (typeof value !== 'object') {
          console.warn(`${muiGridColumn.field} addObjectReferenceLinkRendering: is not an object`, value)
          value = {
            id: value,
            name: value,
            streamID: value
          };
        }
        link = link
          .replace('{id}', value.id)
          .replace('${streamID}', value.streamID)
          .replace('${name}', value.name);

        return <Link to={`${link}`}>{params.value.name || 'No Name'}</Link>;
      }
      return 'N/A';
    };
  }
};

const addRendering = (column) => {
  const { source } = column || {};
  switch (source.type) {
    case 0:
    case 1: {
      //Check for linkFormat
      if (source.render?.linkFormat) {
        addNonObjectLinkRendering(column);
      } else {
        addExpandableRendering(column);
      }
      break;
    }
    case 10: {
      //Check for linkFormat
      if (source.render?.linkFormat) {
        addObjectReferenceLinkRendering(column);
      } else {
        addExpandableRendering(column);
      }
      break;
    }
    case 99:
      addActionButtonRendering(column, source.render);
      break; // Action Buttons
    case 100:
      addExternalLinkRendering(column);
      break; // Link
    default:
      addExpandableRendering(column);
      break; // Expandable
  }

  return column;
};

/**
 * This is a wrapper call inside the renderCell function for the action column
 * @function ActionWrapper
 * @param {object} props
 * @param {ActionItem[]} props.actions - The actions to render
 * @param {object} props.params - The params from the grid
 * @param {object} props.muiGridColumn - The column used by the MUIGrid component
 * @returns {React.ReactElement}
 */
const ActionWrapper = (props) => {
  const { actionsComponent, themeGroup, useTypeVariant } = useContext(gridContext);
  // Default to the GridActions component if no custom component is passed in
  const Actions = actionsComponent || GridActions;
  return (
    <Actions
      {...props}
      themeGroup={themeGroup}
      useTypeVariant={useTypeVariant}
    />
  );
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
 * This takes a mui column and adds formatting to it to handle external link fields
 * @function LinkCellWrapper
 * @param {object} props - The props
 * @param {object} props.params - The params from the grid
 * @param {object} props.muiGridColumn - The column used by the MUIGrid component
 * @returns {React.ReactElement} - The link cell wrapper
 */
const LinkCellWrapper = ({ params, muiGridColumn }) => {
  const { themeGroup, linkComponent } = useContext(gridContext);
  // Default to the Grid component if no custom component is passed in
  const Link = linkComponent || GridLink;
  return (
    <Link
      params={params}
      themeGroup={themeGroup}
      muiGridColumn={muiGridColumn}
    />
  );
};
LinkCellWrapper.propTypes = {
  params: PropTypes.object,
  muiGridColumn: PropTypes.object,
};

/**
 * @typedef GridLinkParams
 * @property {string | object} value - the value of the cell
 * @property {string} value.url - the url of the cell
 * @property {string} value.label - the label of the cell
 */

/**
 * @function GridLink
 * @param {object} props - The props
 * @param {GridLinkParams} props.params - The params from the grid
 * @param {object} props.muiGridColumn - The column used by the MUIGrid component
 * @returns {React.ReactElement} - The link cell wrapper
 */
const GridLink = ({ params, muiGridColumn }) => {
  if (typeof params.value === 'string') {
    if (params && params.value) {
      return (
        <a href={params.value} target="_blank" rel="noreferrer">
          {params.value}
        </a>
      );
    }
  } else if (params.value && params.value.url) {
    return (
      <a href={params.value.url} target="_blank" rel="noreferrer">
        {params.value?.label || params.value.url}
      </a>
    );
  }
  return muiGridColumn.nullValue;
};

GridLink.propTypes = {
  params: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  muiGridColumn: PropTypes.object,
};

/**
 * Primary UI component for user interaction
 * @param {Object} props - The props for the component
 * @param {Object} props.data - The data for the grid
 * @param {Object} props.layout - The layout for the grid
 * @param {String} [props.initialSortColumn] - The initial sort column for the grid
 * @param {String} [props.initialSortDirection] - The initial sort direction for the grid
 * @param {Boolean} [props.showToolbar] - Whether to show the toolbar
 * @param {Object} [props.extraGridProps] - Any extra props to pass to the grid. Ideal for tinkering with toolbar options
 * @param {Array} [props.actions] - The actions column for the grid
 * @param {Object} [props.themeGroup] - The theme group for the grid use this to override the default theme group found in "pamGrid" of muiTheme.js
 * @param {Object} [props.actionsComponent] - The component to use for the actions column
 * @param {Object} [props.linkComponent] - The component to use for the link column
 * @param {Boolean} [props.useTypeVariant] - Whether to use the type variant for the grid
 * @param {Number} [props.initialRowCount] - The initial row count for the grid
 * @param {Array} [props.rowsPerPageOptions] - The rows per page options for the grid
 */
// eslint-disable-next-line
const PamLayoutGrid = ({
  data,
  layout,
  initialSortColumn,
  initialSortDirection,
  showToolbar,
  extraGridProps,
  actions,
  themeGroup,
  linkComponent,
  actionsComponent,
  useTypeVariant,
  rowsPerPageOptions,
  initialRowCount,
  ...props
}) => {
  // memo of shared values
  const sharedValues = React.useMemo(() => {
    return { themeGroup, actionsComponent, useTypeVariant, linkComponent };
  }, [themeGroup, actionsComponent, useTypeVariant, linkComponent]);


  const theme = useTheme();
  // Extract the 'pamGrid' theme group from the theme
  const { pamGrid } = theme;

  // If a theme group was passed in, use that instead of the default
  // const theming = themeGroup || pamGrid;
  let theming = themeGroup ? {...pamGrid, ...themeGroup} : {...pamGrid};

  // We add several safeguard values to the theme group, they will be overriden if they are defined in the theme group
  // Not setting these values will cause the grid to render in less than ideal ways
  const sxProps = {
    ...defaultSX,
    ...theming,
  };

  // TODO need to rework this so these are not re-run on every render but still accessible in other functions.
  let processedLayout = layout;
  const hasType = Object.prototype.hasOwnProperty.call(layout, 'type');

  //If the layout has a type property and that property is a number then we are using the new generic layout and should process it as such
  if (hasType && typeof layout.type === 'number') {
    processedLayout = processGenericLayout(layout);
  } else if (hasType && typeof layout.type === 'string') {
    // If the layout has a type property and that property is a string then we are using an already processed new layout and should use it as is
    processedLayout = layout;
  } else {
    //Otherwise use our own layout processing
    processedLayout = { name: 'Unknown', sections: processLayout(layout) };
  }

  const layoutColumns =
    processedLayout?.sections && processedLayout?.sections?.length
      ? processedLayout.sections[0].fields
      : [];

  // This converts the layout field into a list of columns that can be used by the MUIGrid component
  // This needs to be memoized so that it is not re-run every time the component renders other wise column state is lost between renders
  const renderColumns = React.useMemo(() => {
    const nullValue = processedLayout?.data?.source?.nullValue || 'N/A';
    const editable = processedLayout.editable || false;

    // Check for optional actions
    if (actions?.length) {
      actions.sort((a, b) => a.order - b.order);
      const actionsColumns = actions.map((action) => {
        return getBaseAction(action);
      });

      // Append the actions to the end of the columns
      layoutColumns.push(...actionsColumns);
    }
    let theCols = (layoutColumns || [])
      .map((item) => convertLayoutColumnToMuiColumn(item, nullValue, editable))
      .filter(Boolean); // Remove any columns that are not defined
    return theCols.map((column) => addRendering(column));
  }, [layout]);

  // let renderColumns = (layoutColumns || [])
  //   .map((item) => convertLayoutColumnToMuiColumn(item, nullValue, editable))
  //   .filter(Boolean); // Remove any columns that are not defined
  // renderColumns = renderColumns.map((column) => addRendering(column));

  // If we have showToolbar set to true add the Toolbar component to the grid and set other props
  const compThings = showToolbar
    ? {
      components: { Toolbar: MUIGridToolbar },
      // Four buttons appear on the MUI grid by default, we want to hide them
      disableColumnSelector: true,
      disableDensitySelector: true,
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
    }
    : {};

  const rPPOpts = rowsPerPageOptions || [10, 25, 50, 100];
  const initialState = {
    pagination: {
      pageSize: initialRowCount || rPPOpts[0] || 10,
    },
  };

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
          sortModel: [
            {
              field: processedLayout.data.gridConfig.sort.field,
              sort:
                processedLayout.data.gridConfig.sort.order === 'desc'
                  ? 'desc'
                  : 'asc',
            },
          ],
        };
      }
    }
  }

  // Changed on 9.1.2023 to prefer the initialSortColumn and initialSortDirection props instead of the layout if they are set
  // If we have an initial sort column, then we set it in the initial state
  if (initialSortColumn) {
    initialState.sorting = {
      sortModel: [
        {
          field: initialSortColumn,
          sort: initialSortDirection === 'desc' ? 'desc' : 'asc',
        },
      ],
    };
  }

  // This is the handler for the filter model change event
  // It will bubble up the event to the parent component but after we have transformed the filter model into a format that is easier to work with
  const handlerFilterModelChange = (model) => {
    // If we have an onFilterModelChange prop then we call it with the mapped model
    if (props.onFilterModelChange) {
      // We need to map the items in the filter model to link back to the original layout field
      const mappedModel = model.items.map((item) => {
        const layoutField = layoutColumns.find(
          (field) => field.path === item.columnField
        );
        let ret = {
          ...item,
          field: layoutField.source,
        };

        return ret;
      });
      props.onFilterModelChange(mappedModel);
    }
  };

  const handleSortModelChange = (model) => {
    if (props.onSortModelChange) {
      // We need to map the items in the sort model to link back to the original layout field
      const mappedModel = model.map((item) => {
        const layoutField = layoutColumns.find(
          (field) => field.path === item.field
        );
        let ret = {
          ...item,
          field: layoutField.source,
        };

        return ret;
      });

      props.onSortModelChange(mappedModel);
    }
  };

  return (
    <gridContext.Provider value={sharedValues}>
      <MUIGrid
        {...props}
        {...compThings}
        rows={data}
        onFilterModelChange={handlerFilterModelChange}
        onSortModelChange={handleSortModelChange}
        columns={renderColumns}
        sx={sxProps}
        initialState={initialState}
        rowsPerPageOptions={rPPOpts}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'row-even' : 'row-odd'
        }
        editMode="row"
        {...extraGridProps}
      />
    </gridContext.Provider>
  );
};

PamLayoutGrid.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  initialRowCount: PropTypes.number,
  layout: PropTypes.object.isRequired,
  initialSortColumn: PropTypes.string,
  initialSortDirection: PropTypes.oneOf(['asc', 'desc']),
  showToolbar: PropTypes.bool,
  extraGridProps: PropTypes.object,
  useTypeVariant: PropTypes.bool,
  themeGroup: PropTypes.object,
  linkComponent: PropTypes.elementType,
  actionsComponent: PropTypes.elementType,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      order: PropTypes.number.isRequired,
      width: PropTypes.number,
      actionList: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          order: PropTypes.number.isRequired,
          type: PropTypes.string,
          clickHandler: PropTypes.func.isRequired,
        })
      ).isRequired,
    })
  ),
  onFilterModelChange: PropTypes.func,
  onSortModelChange: PropTypes.func,
};

PamLayoutGrid.defaultProps = {
  showToolbar: false,
};

export { PamLayoutGrid as default };
