import React from 'react';
import SubHeader from './SubHeader';
import Button from './Button';

export default {
  title: 'Components/Sub Header',
  component: SubHeader,
  // argTypes: {
  //   backgroundColor: { control: 'color' },
  // },
};

const Template = (args) => <SubHeader {...args} />;
export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  title: 'Sub Header',
  color: 'primary',
  rightRenderProps: { testText: 'test' },
  rightRender: ({ testText }) => <Button label={testText} color="secondary" />,
};