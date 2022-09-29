import React from 'react';
import PropTypes from 'prop-types';
import { Button as MUIButton} from '@mui/material';

/**
 * Primary UI component for user interaction
 */
// eslint-disable-next-line
const Button = ({ primary, backgroundColor, variant, color, size, label, ...props }) => {
  // const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
  // const textTransform = 'none';
  return (
    <MUIButton
      variant={variant}
      size={size}
      color={color}
      style={backgroundColor && { backgroundColor}}
      {...props}
    >
      {label}
    </MUIButton>
  );
};

//{className={['storybook-button', `storybook-button--${size}`, mode].join(' ')}}

Button.propTypes = {
  /**
   * What background color to use
   */
  backgroundColor: PropTypes.string,
  variant: PropTypes.string,
  /**
   * How large should the button be?
   */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.string,
  /**
   * Button contents
   */
  label: PropTypes.string.isRequired,
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
};

Button.defaultProps = {
  backgroundColor: null,
  size: 'medium',
  onClick: undefined,
  color: 'primary',
};

export default Button;