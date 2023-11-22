import React from 'react';

import LoadingSpinner from './LoadingSpinner';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Spinning Loader',
  component: LoadingSpinner,
};

export const Default = {
  args: {
    variant: 'accent',
    isActive: true,
  },
};
