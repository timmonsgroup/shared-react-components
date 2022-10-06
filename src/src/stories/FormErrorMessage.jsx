import React from 'react';
import PropTypes from 'prop-types';
import FormHelperText from '@mui/material/FormHelperText';

const FormErrorMessage = ({ error, ...props }) => {
  if (error) {
    let text = error.message;
    if (!text) {
      if (error.type === 'required') {
        text = 'This field is required';
      }
    }
    return <FormHelperText error {...props}>{text}</FormHelperText>
  }
  return null;
}

FormErrorMessage.propTypes = {
  error: PropTypes.object,
}

export default FormErrorMessage;