/** @module LineLoader */
import React, { ReactElement } from 'react';
import { Box, LinearProgress, LinearProgressProps } from '@mui/material';
import PropTypes from 'prop-types';

interface LineLoaderProps {
  message?: string;
  messageAlign?: 'left' | 'right' | 'center';
  width?: string;
}

/**
 * @function
 * @param {object} props - props object
 * @param {string} [props.message] - message to display
 * @param {string} [props.messageAlign] - left, right, or center
 * @param {string} [props.width] - width of the loader
 * @returns {React.ReactElement} - React component
 * @example
 * <LineLoader message="Loading..." />
 */
const LineLoader: React.FC<LineLoaderProps & LinearProgressProps> = ({
  width,
  message,
  messageAlign = 'center',
  ...props
}): ReactElement => {
  return (
    <Box sx={{ width }}>
      {message && <Box component="p" sx={{ textAlign: messageAlign }}>{message}</Box>}
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
  message: undefined,
  width: '100%',
};

export default LineLoader;
