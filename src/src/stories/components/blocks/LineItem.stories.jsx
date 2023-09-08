import React from 'react';
import LineItem from './LineItem';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Common/components/blocks/Line Item',
  component: LineItem,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
};

export const Primary = {
  args: {
    label: 'Length of Roads',
    value: '1,000',
    units: 'Miles',
  },
};

export const NoUnits = {
  args: {
    label: 'Length of Roads',
    value: '1,000',
    units: null,
  },
};
