import React from 'react';
import PropTypes from 'prop-types';

import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import Divider from '@mui/material/Divider';

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
  }

  const renderLegend = (legendColor, legendLabel) => {
    if (!legendLabel || legendLabel === '') {
      return null;
    }
    const color = legendColor || theme.palette.primary;
    return (
      <Typography sx={cardHeader} color={color} gutterBottom>{legendLabel}</Typography>
    );
  }

  const renderDivider = (includeDivider) => {
    if (includeDivider) {
      return <Divider />;
    }
    return null;
  }

  // you must have a heading to have a header section!
  if (!heading || heading.length === 0) {
    return null;
  }

  return (
    <>
      <Box sx={singleFlexRow}>
        <Box sx={cardHeader}>
          {renderToolTip(toolTip)}
          <Typography display="contents" gutterBottom>{heading}</Typography>
        </Box>
        <div>
          {renderLegend(legendColor, legendLabel)}
        </div>
      </Box>
      {renderDivider(showDivider)}
    </>
  );
}

//heading, toolTip, legendLabel, legendColor
HeadingFlexRow.propTypes = {
  heading: PropTypes.string,
  toolTip: PropTypes.string,
  legendLabel: PropTypes.string,
  legendColor: PropTypes.string,
  includeDivider: PropTypes.bool
};

export  default HeadingFlexRow;