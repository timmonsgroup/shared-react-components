import React from 'react';
import RadioOptions from './RadioOptions';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Form/RadioOptions',
  component: RadioOptions,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    items: {
      name: 'Options',
      control: {
        type: 'array',
      },
    },
  },
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => {
  // The router wrapper is needed because the AppBar uses routing bits
  return <RadioOptions {...args} />;
};

export const Primary = {
  render: Template,

  args: {
    id: 'demo',
    label: 'Which Doe doe',
    items: [
      {
        id: 1,
        label: 'Jane Doe',
      },
      {
        id: 2,
        label: 'John Doe',
      },
      {
        id: 3,
        label: 'Bob Doe',
      },
    ],
  },
};
