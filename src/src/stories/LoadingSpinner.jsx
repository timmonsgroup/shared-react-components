import React from 'react';
import PropTypes from 'prop-types';
import { Backdrop, Box, CircularProgress, Stack } from '@mui/material/Box';

const LoadingSpinner = ({ isActive, variant, message }) => {
  return (
    <div>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
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
}

LoadingSpinner.propTypes = {
  messageAlign: PropTypes.oneOf(['left', 'right', 'center']),
  message: PropTypes.string,
  isActive: PropTypes.bool,
  variant: PropTypes.oneOf(['background', 'primary', 'accent', 'secondary', 'error', 'tertiary', 'success']),
}

LoadingSpinner.defaultProps = {
  messageAlign: 'center',
  message: null,
  isActive: false,
  variant: 'accent',
}

export default LoadingSpinner;