import { Typography, Card, CardContent } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Typography/Examples',
  component: Typography,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    color: {
      control: 'select',
      options: ['text', 'primary', 'secondary', 'error', 'warning.main', 'tertiary.main', 'accent', 'success.main'],
      defaultValue: 'text',
    },
    text: {
      control: 'text',
      defaultValue: 'This is a test'
    },
    variant: {
      options: [
        // Our variants
        'sectionHeader', 'sectionDescription', 'subHeader', 'inspector', 'clusterEmptyText', 'panelHeader', 'navLink',
        'modalTitle',
        // MUI variants
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body1', 'body2', 'caption', 'p',
      ],
      defaultValue: 'p',
      control: {
        type: 'select',
      }
    }
  },
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = ({ text, ...args }) => <Card><CardContent><Typography {...args}>{text}</Typography></CardContent></Card>;

export const Examples = Template.bind({});

Template.propTypes = {
  color: PropTypes.string,
  variant: PropTypes.string,
  text: PropTypes.string,
};
