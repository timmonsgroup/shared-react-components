import React from 'react';
import PropTypes from 'prop-types';

import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

import LineItem from './LineItem';
import HeadingFlexRow from './HeadingFlexRow';
import ActionLinksRow from './ActionLinksRow';

const FlexCard = ({ item, themeGroup, children, }) => {
  const { lines, heading, toolTip, legendLabel, legendColor, footerLinks } = item || {};
  const theme = useTheme();
  const tg = themeGroup || theme;

  const renderLines = () => {
    // eslint-disable-next-line react/prop-types
    if (!lines || !lines.length === 0) {
      return null;
    }

    return (
      <>
        {
          // eslint-disable-next-line react/prop-types
          lines.map((line, index) => {
            const { label, value, units } = line;
            if (!label) {
              return null;
            }
            const safeValue = value || 0;
            return (
              <LineItem variant="inspector" sx={tg.cardContent} key={index} label={label} value={safeValue} units={units} />
            );
          })
        }
      </>
    );
  };

  return (
    <Box sx={tg?.flexCard}>
      <HeadingFlexRow heading={heading} toolTip={toolTip} legendColor={legendColor} legendLabel={legendLabel} />
      {renderLines()}
      <ActionLinksRow links={footerLinks} themeGroup={tg} />
      {children}
    </Box>
  );
};

FlexCard.propTypes = {
  item: PropTypes.objectOf(PropTypes.shape({
    heading: PropTypes.string,
    toolTip: PropTypes.string,
    legendLabel: PropTypes.string,
    legendColor: PropTypes.string,
    lines: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.any,
      link: PropTypes.string
    })),
    footerLinks: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      url: PropTypes.string
    }))
  })),
  themeGroup: PropTypes.object,
  children: PropTypes.node,
};

export  default FlexCard;