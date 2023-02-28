import React from 'react';
import PropTypes from 'prop-types';
import { Button as MUIButton} from '@mui/material';

/**
 * A button component that extends the base material-ui button
 * All props are passed to the base button
 * @param {object} props
 * @param {string} props.backgroundColor - the background color of the button
 * @param {string} props.variant - the variant of the button
 * @param {string} props.size - the size of the button
 * @param {string} props.color - the color of the button
 * @param {string} props.label - the label of the button
 * @param {string} props.children - the children of the button
 * @param {function} props.onClick - the onClick handler of the button
 * @returns {React.ReactElement}
 */
const Button = ({ backgroundColor, variant, color, size, label, children, ...props }) => {
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