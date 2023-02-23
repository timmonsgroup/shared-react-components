import React from 'react';
import PropTypes from 'prop-types';

import { AppBar, Box, Toolbar, Typography } from '@mui/material';

/**
 * if a titleRenderr is passed in, it will be used to render the title
 * otherwise, the title will be rendered as an h3
 * if neither then no header will be rendered
 * @param {object} props
 * @returns {React.ReactElement}
 */
const SubHeader = ({ title, titleRender, rightRender, color = 'accent' }) => {
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

  const renderRight = () => {
    if (rightRender) {
      return (
        <Box sx={{ flexGrow: 1, textAlign: 'right' }}>{rightRender()}</Box>
      );
    }
    return null;
  };

  return (
    <AppBar position="sticky" color={color}>
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
