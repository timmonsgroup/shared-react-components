/** @module FormErrorMessage */
import React from 'react';
import PropTypes from 'prop-types';
import {FormHelperText} from '@mui/material';

/**
 * A helper component to render a FormHelperText component if an error is present
 * @function FormErrorMessage
 * @param {object} props - props object
 * @param {object} props.error - error object
 * @param {string} props.error.message - error message
 * @param {string} [props.error.type] - error type fallback for required fields
 * @returns {React.ReactElement} - React component
 * @example
 * <FormErrorMessage error={errors[field.name]} />
 */
const FormErrorMessage = ({ error, ...props }) => {
  if (error) {
    let text = error.message;
    if (!text) {
      if (error.type === 'required') {
        text = 'This field is required';
      }
    }
    return <FormHelperText error {...props}>{text}</FormHelperText>;
  }
  return null;
};

FormErrorMessage.propTypes = {
  error: PropTypes.object,
};

export default FormErrorMessage;