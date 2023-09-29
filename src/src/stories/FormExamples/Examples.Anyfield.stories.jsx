import React from 'react';
import AnyField from '../AnyField';
import { useForm } from 'react-hook-form';
import { FIELD_TYPES } from '../../constants';


const meta = {
  component: AnyField,
  decorators: [
    (Story) => {
      const {control} = useForm();
      return (
        <Story control={control} />
      );
    },
  ],
};

const render = (args, context) => {
  console.log(args);
  return <AnyField {...args} control={context?.control}/>
};

export default meta;

export const TextField = {
  render,
  args: {
    layout: {
      type: FIELD_TYPES.TEXT,
      label: 'Text Field',
      name: 'text',
    },
  }
};