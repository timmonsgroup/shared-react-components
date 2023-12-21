import React from 'react';
import SubHeader from './SubHeader';
import Button from '@mui/material/Button';

export default {
  title: 'Components/Sub Header',
  component: SubHeader,
  // argTypes: {
  //   backgroundColor: { control: 'color' },
  // },
};

export const Default = {
  args: {
    title: 'Sub Header',
    color: 'primary',
    rightRenderProps: { testText: 'test' },
    rightRender: ({ testText }) => <Button label={testText} color="secondary" />,
  },
};
