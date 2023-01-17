import React from 'react';
import FormErrorMessage from './FormErrorMessage';

export default {
  title: 'Form/Form Error Message',
  component: FormErrorMessage,
};

const Template = (args) => <FormErrorMessage {...args} />;
export const Required = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Required.args = {
  error: {
    type: 'required',
    message: 'This field is required'
  },
};