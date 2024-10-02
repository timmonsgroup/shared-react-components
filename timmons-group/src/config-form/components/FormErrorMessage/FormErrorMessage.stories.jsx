import React from 'react';
import FormErrorMessage from './FormErrorMessage';

export default {
  title: 'Form/Form Error Message',
  component: FormErrorMessage,
};

export const Required = {
  args: {
    error: {
      type: 'required',
      message: 'This field is required',
    },
  },
};
