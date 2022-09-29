import React from 'react';
import SubHeader from './SubHeader';
import Button from './Button';

export default {
  title: 'CCP/Sub Header',
  component: SubHeader,
  // argTypes: {
  //   backgroundColor: { control: 'color' },
  // },
};

const Template = (args) => <SubHeader {...args} />;
export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  titleRender: () => <h3> Welcome to the Collaborative Planning Portal</h3>,
  rightRender: () => <Button label="Add Community" color="secondary" />,
};