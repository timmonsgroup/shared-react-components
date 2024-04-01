/** @module RequiredIndicator */
import React from 'react';
import PropTypes from 'prop-types';
import { Box, useTheme } from '@mui/material';

/**
 * Simple component to render an asterisk if the prop is true
 * @param {boolean} [isRequired] boolean to indicate if the field is required
 * @param {object} [sx] style object
 * @returns {React.ReactElement}
 */
const RequiredIndicator = ({ isRequired, sx }) => {
  const theme = useTheme();
  const requiredIndicator = theme.requiredIndicator || { color: 'red' };
  const finalSx = { ...requiredIndicator, ...sx };

  if (isRequired) {
    return <Box component="span" sx={finalSx}>*</Box>;
  }
  return null;
};

RequiredIndicator.propTypes = {
  isRequired: PropTypes.bool,
  sx: PropTypes.object,
};

RequiredIndicator.defaultProps = {
  isRequired: true,
  sx: {},
};
export default RequiredIndicator;