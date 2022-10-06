import React from 'react';
import PropTypes from 'prop-types';

import MUIAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

/**
 * if a titleRenderr is passed in, it will be used to render the title
 * otherwise, the title will be rendered as an h3
 * if neither then no header will be rendered
 * @param {*} param0
 * @returns
 */
const SubHeader = ({ title, titleRender, rightRender }) => {
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
    <MUIAppBar position="sticky" color="accent">
      <Toolbar sx={{ fontWeight: '700' }} variant="dense">
        {renderTitle()}
        {renderRight()}
      </Toolbar>
    </MUIAppBar>
  );
};

SubHeader.propTypes = {
  title: PropTypes.string,
  titleRender: PropTypes.func,
  rightRender: PropTypes.func,
};

export default SubHeader;
