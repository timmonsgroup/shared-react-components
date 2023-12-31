/** @module ActionLinksRow */
import React from 'react';
import PropTypes from 'prop-types';

import { Link, Divider, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

/**
 * @function ActionLinksRow
 * @param {object} props - props object
 * @param {object} props.links - array of link objects
 * @param {string} props.links.label - label for the link
 * @param {string} props.links.url - url for the link
 * @param {string} props.links.target - target for the link
 * @param {boolean} props.includeDivider - whether to include a divider above the links
 * @param {object} props.themeGroup - theme object
 * @param {object} props.themeGroup.actionLinkRow - theme object for the action link row
 * @returns {React.ReactElement} - React component
 */
const ActionLinksRow = ({ links, includeDivider = true, themeGroup }) => {
  const theme = useTheme();

  // eslint-disable-next-line react/prop-types
  if (!links || links.length === 0) {
    return null;
  }

  const {actionLinkRow} = theme;

  const alr = themeGroup?.actionLinkRow || actionLinkRow;

  const renderLinksRow = () => {
    const lCount = links.length;
    return links.map((link, index) => {
      const { label, url, target } = link;
      if (index === lCount - 1) {
        return (
          <Link sx={alr} marginLeft="3px" key={index} href={url} target={target} rel="noopener noreferrer">
            {label}
          </Link>
        );
      }
      return (
        <>
          <Link sx={alr} key={index} href={url} target="_blank" rel="noopener noreferrer">
            {label}
          </Link>
          <span> | </span>
        </>
      );
    });
  };

  const renderDivider = (includeDivider) => {
    if (includeDivider) {
      return <Divider />;
    }
    return null;
  };

  return (
    <React.Fragment>
      {renderDivider(includeDivider)}
      <Box sx={alr}>
        {renderLinksRow()}
      </Box>
    </React.Fragment>
  );
};

ActionLinksRow.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    url: PropTypes.string,
    target: PropTypes.oneOf(['_blank', '_self', '_parent', '_top'])
  })),
  includeDivider: PropTypes.bool,
  themeGroup: PropTypes.object
};

export  default ActionLinksRow;