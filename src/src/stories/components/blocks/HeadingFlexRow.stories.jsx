import React from 'react';
import HeadingFlexRow from './HeadingFlexRow';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Common/components/blocks/Heading Flex Row',
  component: HeadingFlexRow,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
  },
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <HeadingFlexRow {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  heading: 'Sample',
  toolTip: 'The sample tooltip text.',
  legendLabel: 'Legend',
  legendColor: 'red',
};

export const DefaultLegendColor = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
DefaultLegendColor.args = {
  heading: 'Sample',
  toolTip: 'The sample tooltip text.',
  legendLabel: 'Legend',
  legendColor: null
};

export const WithoutLegendNull = Template.bind({});
WithoutLegendNull.args = {
  heading: 'Sample',
  toolTip: 'The sample tooltip text.',
  legendLabel: null,
  legendColor: 'red',
};

export const WithoutLegendEmpty = Template.bind({});
WithoutLegendEmpty.args = {
  heading: 'Sample',
  toolTip: 'The sample tooltip text.',
  legendLabel: '',
  legendColor: 'red',
};

export const WithoutToolTip = Template.bind({});
WithoutToolTip.args = {
  heading: 'Sample',
  toolTip: '',
  legendLabel: 'Legend',
  legendColor: 'red',
};

export const WithoutLegendAndToolTip = Template.bind({});
WithoutLegendAndToolTip.args = {
  heading: 'Sample',
  toolTip: null,
  legendLabel: null,
  legendColor: null,
};

export const WithoutDivider = Template.bind({});
WithoutDivider.args = {
  heading: 'Sample',
  toolTip: null,
  legendLabel: null,
  legendColor: null,
  includeDivider: false,
};

export const WithoutHeader = Template.bind({});
WithoutHeader.args = {
  heading: null,
  toolTip: null,
  legendLabel: null,
  legendColor: null,
};

