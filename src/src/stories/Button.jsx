import React from 'react';
import PropTypes from 'prop-types';
import { Button as MUIButton} from '@mui/material';

/**
 * Primary UI component for user interaction
 */
export const Button = ({ primary, backgroundColor, variant, color, size, label, children, ...props }) => {
  return (
    <MUIButton
      variant={variant}
      size={size}
      color={color}
      style={backgroundColor && { backgroundColor}}
      {...props}
    >
      {label || children}
    </MUIButton>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  backgroundColor: PropTypes.string,
  variant: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func,

};

Button.defaultProps = {
  backgroundColor: null,
  size: 'medium',
  onClick: undefined,
  color: 'primary',
};

export default Button;