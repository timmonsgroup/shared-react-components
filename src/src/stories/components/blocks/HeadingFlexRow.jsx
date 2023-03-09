import React from 'react';
import PropTypes from 'prop-types';

import { useTheme } from '@mui/material/styles';
import { Typography, Box, Tooltip, Divider } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { modifyColorOpacity } from '../../../helpers';


const HeadingFlexRow = ({ heading, toolTip, legendColor, legendLabel, includeDivider }) => {
  const theme = useTheme();
  const {inspector, singleFlexRow} = theme;
  const {cardHeader} = inspector || {};
  const showDivider = includeDivider === undefined ? true : includeDivider;

  const renderToolTip = (toolTip) => {
    if (toolTip && toolTip.length > 0) {
      return (
        <Tooltip title={toolTip} placement="top">
          <InfoIcon sx={inspector.icon}></InfoIcon>
        </Tooltip>
      );
    }
    return (null);
  };

  const renderLegend = (legendColor, legendLabel) => {
    if (!legendLabel || legendLabel === '') {
      return null;
    }
    const color = legendColor ? modifyColorOpacity(legendColor,1) : theme.palette.primary;
    return (
      <Typography sx={cardHeader} color={color} gutterBottom>{legendLabel}</Typography>
    );
  };

  const renderDivider = (includeDivider) => {
    if (includeDivider) {
      return <Divider />;
    }
    return null;
  };

  // you must have a heading to have a header section!
  if (!heading || heading.length === 0) {
    return null;
  }

  return (
    <>
      <Box sx={singleFlexRow}>
        <Box sx={cardHeader}>
          {renderToolTip(toolTip)}
          <Typography sx={cardHeader} display="contents" gutterBottom>{heading}</Typography>
        </Box>
        <div>
          {renderLegend(legendColor, legendLabel)}
        </div>
      </Box>
      {renderDivider(showDivider)}
    </>
  );
};

HeadingFlexRow.propTypes = {
  heading: PropTypes.string,
  toolTip: PropTypes.string,
  legendLabel: PropTypes.string,
  legendColor: PropTypes.string,
  includeDivider: PropTypes.bool
};

export  default HeadingFlexRow;