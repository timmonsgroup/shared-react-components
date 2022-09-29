import React from 'react';

import LoadingSpinner from './LoadingSpinner';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'CCP/Spinning Loader',
  component: LoadingSpinner,
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <LoadingSpinner {...args} />;

export const Default = Template.bind({});
Default.args = {
  variant: 'accent',
  isActive: true,
};
