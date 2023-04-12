import React from 'react';
import PropTypes from 'prop-types';

import { Box, Stack, Typography, Grid, Container, Card, CardContent, Divider } from '@mui/material';

import { processLayout, processGenericLayout } from '../helpers';

import PamLayoutGrid from './PamLayoutGrid';
import PamLayoutForm from './PamLayoutForm';


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
 */
// eslint-disable-next-line
const GenericLayout = ({ data, layout, actions, themeGroup, ...props }) => {
  const processedLayout = processGenericLayout(layout);

  const getElement = (processedLayout) => {
    switch (processedLayout.type) {
      case 'Grid':
        return <PamLayoutGrid data={data} layout={processedLayout} actions={actions} themeGroup={themeGroup} {...props} />;
      case 'Form':
        return <>TODO</>;
      default:
        return <div>Unknown layout type: {processLayout.type}</div>;
    }

  };
  return <Stack
    spacing={2}
    direction="column"
    sx={{ minWidth: '100%', alignItems: 'center', placeSelf: 'flex-start'  }}>
    <Stack
      spacing={2}
      direction="row"
      sx={{ minWidth: '100%', alignItems: 'center'}}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="sectionHeader">Join Organization Requests</Typography>
      </Box>
    </Stack>
    <Box sx={{ marginLeft: 'auto', minWidth: '100%', flexGrow: 1 }}>
      {getElement(processedLayout)}
    </Box>
  </Stack>;
};


GenericLayout.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  layout: PropTypes.object.isRequired,
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

GenericLayout.defaultProps = {
  showToolbar: false,
};

export default GenericLayout;