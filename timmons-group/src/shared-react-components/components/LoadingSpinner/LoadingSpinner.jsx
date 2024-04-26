/** @module LoadingSpinner */
import React from 'react';
import PropTypes from 'prop-types';
import { Backdrop, Box, CircularProgress, Stack } from '@mui/material';

/**
 * LoadingSpinner is a component that displays a spinner with an optional message
 * @function
 * @param {object} props - The props for the component
 * @param {boolean} [props.isActive] - Whether the spinner is active
 * @param {string} [props.variant] - The variant of the spinner
 * @param {string} [props.message] - The message to display
 * @param {number} [props.zIndex] - Custom zIndex of the spinner - by default it is set to theme.zIndex.tooltip (1500) + 1
 * @returns {React.ReactElement} - React component
 * @example
 * <LoadingSpinner isActive={true} />
 */
const LoadingSpinner = ({ isActive = false, variant = 'accent', message = null, zIndex, ...props }) => {
  /**
   * MUI base theme default zIndex values
    appBar:1100
    drawer:1200
    fab:1050
    mobileStepper:1000
    modal:1300
    snackbar:1400
    speedDial:1050
    tooltip:1500
   */
  return (
    <div {...props}>
      <Backdrop
        sx={{ zIndex: (theme) => {
          return isNaN(zIndex) ? theme.zIndex.tooltip + 1 : zIndex;
        } }}
        open={isActive}
      >
        <Stack alignItems="center">
          <CircularProgress sx={{ justifySelf: 'center' }} color={variant} />
          {message &&
            <Box component="p" sx={{ color: (theme) => theme.palette[variant].text }}>{message}</Box>
          }
        </Stack>
      </Backdrop>
    </div>
  );
};

LoadingSpinner.propTypes = {
  message: PropTypes.string,
  isActive: PropTypes.bool,
  variant: PropTypes.oneOf(['background', 'primary', 'accent', 'secondary', 'error', 'tertiary', 'success']),
  zIndex: PropTypes.number,
};

export default LoadingSpinner;