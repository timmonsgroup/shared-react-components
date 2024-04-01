import React from 'react';
import SubHeader from './SubHeader';
import {Button} from '@mui/material';

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
    rightRender: ({ testText }) => <Button color="secondary">{testText}</Button>,
  },
};
