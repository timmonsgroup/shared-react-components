import React from 'react';

import LineLoader from './LineLoader';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'CCP/Line Loader',
  component: LineLoader,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <LineLoader {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
// Primary.args = {
//   primary: true,
//   label: 'Primary',
// };

// export const Secondary = Template.bind({});
// Secondary.args = {
//   label: 'Seconded',
// };

// export const Large = Template.bind({});
// Large.args = {
//   size: 'large',
//   label: 'Big Thing',
// };

// export const Small = Template.bind({});
// Small.args = {
//   size: 'small',
//   label: 'Button',
// };
