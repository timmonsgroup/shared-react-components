import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import PropTypes from 'prop-types';

const LineLoader = ({ width, message, messageAlign, ...props }) => {
  return (
    <Box sx={{ width }}>
      { message &&
          <Box component="p" sx={{ textAlign: messageAlign }}>{message}</Box>
      }
      <LinearProgress {...props} />
    </Box>
  );
}

LineLoader.propTypes = {
  messageAlign: PropTypes.oneOf(['left', 'right', 'center']),
  message: PropTypes.string,
  width: PropTypes.string,
}

LineLoader.defaultProps = {
  messageAlign: 'center',
  message: null,
  width: '100%',
}

export default LineLoader;