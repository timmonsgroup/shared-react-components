/**@module LineLoader */
import React from 'react';
import { Box, LinearProgress } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * @function
 * @param {object} props - props object
 * @param {string} props.message - message to display
 * @param {string} props.messageAlign - left, right, or center
 * @param {string} props.width - width of the loader
 * @param {object} props.props - props for LinearProgress
 * @returns {React.ReactElement} - React component
 * @example
 * <LineLoader message="Loading..." />
 */
const LineLoader = ({ width, message, messageAlign, ...props }) => {
  return (
    <Box sx={{ width }}>
      { message &&
          <Box component="p" sx={{ textAlign: messageAlign }}>{message}</Box>
      }
      <LinearProgress {...props} />
    </Box>
  );
};

LineLoader.propTypes = {
  messageAlign: PropTypes.oneOf(['left', 'right', 'center']),
  message: PropTypes.string,
  width: PropTypes.string,
};

LineLoader.defaultProps = {
  messageAlign: 'center',
  message: null,
  width: '100%',
};

export default LineLoader;