import React from 'react';
import HeadingFlexRow from './HeadingFlexRow';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Common/components/blocks/Heading Flex Row',
  component: HeadingFlexRow,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
};

export const Primary = {
  args: {
    heading: 'Sample',
    toolTip: 'The sample tooltip text.',
    legendLabel: 'Legend',
    legendColor: 'red',
  },
};

export const DefaultLegendColor = {
  args: {
    heading: 'Sample',
    toolTip: 'The sample tooltip text.',
    legendLabel: 'Legend',
    legendColor: null,
  },
};

export const WithoutLegendNull = {
  args: {
    heading: 'Sample',
    toolTip: 'The sample tooltip text.',
    legendLabel: null,
    legendColor: 'red',
  },
};

export const WithoutLegendEmpty = {
  args: {
    heading: 'Sample',
    toolTip: 'The sample tooltip text.',
    legendLabel: '',
    legendColor: 'red',
  },
};

export const WithoutToolTip = {
  args: {
    heading: 'Sample',
    toolTip: '',
    legendLabel: 'Legend',
    legendColor: 'red',
  },
};

export const WithoutLegendAndToolTip = {
  args: {
    heading: 'Sample',
    toolTip: null,
    legendLabel: null,
    legendColor: null,
  },
};

export const WithoutDivider = {
  args: {
    heading: 'Sample',
    toolTip: null,
    legendLabel: null,
    legendColor: null,
    includeDivider: false,
  },
};

export const WithoutHeader = {
  args: {
    heading: null,
    toolTip: null,
    legendLabel: null,
    legendColor: null,
  },
};
