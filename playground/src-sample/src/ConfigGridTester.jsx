import { ConfigGrid } from "@timmons-group/shared-react-components";
import { HashRouter as Router } from 'react-router-dom';
import {
  GridLayout, DEFAULT_GRID,
  LAND_GRID,
  LANDS_GRID_LAYOUT } from "./helpers/GridHelpers";

export const CustomActions = ({
  muiGridColumn,
  actions,
  params,
  themeGroup,
  useTypeVariant,
}) => {
  return (
    <div
      aria-label="action button group"
      className="grid-actions"
      size="small"
      style={{
        width:"500px",
        margin: 'auto',
      }}
    >
      {actions.map((action, index) => {
        return (
          <button key={index} size="small">
            {action.label}
          </button>
        );
      })}
    </div>
  );
};

const ConfigGridTester = () => {
  const actions = [{
    order: 0,
    flex: 5,
    // width: 400,
    actionList: [
      {
        label: 'Verify',
        order: 0,
        clickHandler: (row) => {
          console.log('Verify', row);
        },
      },
      {
        label: 'Reset',
        order: 0,
        clickHandler: (row) => {
          console.log('Reset', row);
        }
      },
      {
        label: 'Delete',
        order: 3,
        clickHandler: (row) => {
          console.log('Delete', row);
        }
      }
    ]
  }];

  const extraGridProps = {
    // components: { Toolbar: MUIGridToolbar },
    // Four buttons appear on the MUI grid by default, we want to hide them
    disableColumnSelector: false,
    // componentsProps: {
    //   toolbar: {
    //     // Quick filter is a search box that appears in the toolbar
    //     showQuickFilter: true,
    //     quickFilterProps: { debounceMs: 500 },
    //     //Disable csv and print to completely remove the "Export" button
    //     csvOptions: { disableToolbarButton: false },
    //     printOptions: { disableToolbarButton: true },
    //   },
    // },
  }
  return (
    <Router>
    <ConfigGrid
      layout={LANDS_GRID_LAYOUT}
      data={LAND_GRID}
      actions={actions}
      // actionsComponent={CustomActions}
      // themeGroup={themeGroup}
      // initialSortColumn="name"
      initialSortDirection="desc"
      // onFilterModelChange={args.onFilterModelChange}
      // onSortModelChange={args.onSortModelChange}
      rowsPerPageOptions={[10, 50, 100]}
      initialRowCount={50}
      showToolbar={true}
      extraGridProps={extraGridProps}
      // actionsComponent={args.actionsComponent}
      // actions={args.actions}
    />
    </Router>

    // <ConfigGrid
    //   layout={gridLayout}
    //   data={grants}
    //   autoHeight={true}
    //   useTypeVariant={true}
    //   disableSelectionOnClick
    //   density="compact"
    //   actions={actions}
    //   localeText={{
    //     noRowsLabel: 'No Grants found.',
    //   }}
    //   rowsPerPageOptions={[20, 50, 100]}
    //   showToolbar={true}
    // />
  );
}

export default ConfigGridTester;