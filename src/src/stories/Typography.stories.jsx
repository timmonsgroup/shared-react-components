import { Typography, Card, CardContent } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Typography/Examples',
  component: Typography,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
    variant: {
      control: {
        type: 'select',
        options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subHeader', 'inspector', 'body1', 'body2', 'caption', 'button', 'overline', 'srOnly', 'inherit'],
      }
    }
  },
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <Card><CardContent><Typography {...args}>THings</Typography></CardContent></Card>;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  color: 'primary',
  label: 'Primary',
};

Primary.propTypes = {
  color: PropTypes.string,
  label: PropTypes.string,
  variant: PropTypes.string,
};

export const Secondary = Template.bind({});
Secondary.args = {
  label: 'Seconded',
  color: 'secondary',
};

export const Large = Template.bind({});
Large.args = {
  size: 'large',
  label: 'Big Thing',
};

export const Small = Template.bind({});
Small.args = {
  size: 'small',
  label: 'Button',
};
