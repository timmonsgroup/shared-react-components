/** @module SubHeader */
import React from 'react';
import PropTypes from 'prop-types';

import { AppBar, Box, Toolbar, Typography } from '@mui/material';

/**
 * if a titleRenderr is passed in, it will be used to render the title
 * otherwise, the title will be rendered as an h3
 * if neither then no header will be rendered
 * @function SubHeader
 * @param {object} props
 * @param {string} props.title - title to display
 * @param {function} props.titleRender - function to render the title
 * @param {function} props.rightRender - function to render the right side of the header
 * @param {string} props.color - color of the header
 * @param {object} props.props - props for AppBar
 * @returns {React.ReactElement}
 */
const SubHeader = ({ title, titleRender, rightRender, color = 'accent', ...props }) => {
  /**
   * if a titleRenderr is passed in, it will be used to render the title
   * otherwise, the title will be rendered as a Typography "subHeader" variant
   * @function renderTitle
   * @returns {React.ReactElement | null}
   */
  const renderTitle = () => {
    if (titleRender || title) {
      return (
        <Box sx={{ flexGrow: 1 }}>
          {titleRender ? (
            titleRender()
          ) : (
            <Typography variant="subHeader">{title}</Typography>
          )}
        </Box>
      );
    }

    return null;
  };

  /**
   * if a rightRender is passed in, it will be used to render the right side of the header
   * otherwise, nothing will be rendered
   * @function renderRight
   * @returns {React.ReactElement}
   */
  const renderRight = () => {
    if (rightRender) {
      return (
        <Box sx={{ flexGrow: 1, textAlign: 'right' }}>{rightRender()}</Box>
      );
    }
    return null;
  };

  return (
    <AppBar position="sticky" color={color} {...props}>
      <Toolbar sx={{ fontWeight: '700' }} variant="dense">
        {renderTitle()}
        {renderRight()}
      </Toolbar>
    </AppBar>
  );
};

SubHeader.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
  titleRender: PropTypes.func,
  rightRender: PropTypes.func,
};

export default SubHeader;
