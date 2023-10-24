import React from 'react';
import Button from './Button';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Button',
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

export const Primary = {
  args: {
    color: 'primary',
    label: 'Primary',
  },
};

export const Secondary = {
  args: {
    label: 'Seconded',
    color: 'secondary',
  },
};

export const Large = {
  args: {
    size: 'large',
    label: 'Big Thing',
  },
};

export const Small = {
  args: {
    size: 'small',
    label: 'Button',
  },
};
