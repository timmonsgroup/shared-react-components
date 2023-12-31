/** @module RequiredIndicator */
import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

/**
 * Simple component to render an asterisk if the prop is true
 * @param {boolean} isRequired boolean to indicate if the field is required
 * @returns {React.ReactElement}
 */
const RequiredIndicator = ({ isRequired }) => {
  if (isRequired) {
    return <Box component="span" sx={{color: 'red'}}>*</Box>;
  }
  return null;
};

RequiredIndicator.propTypes = {
  isRequired: PropTypes.bool,
};

RequiredIndicator.defaultProps = {
  isRequired: true,
};
export default RequiredIndicator;