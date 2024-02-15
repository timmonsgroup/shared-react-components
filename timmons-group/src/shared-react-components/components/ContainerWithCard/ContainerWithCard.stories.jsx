import React from 'react';
import ContainerWithCard from './ContainerWithCard';

const meta = {
  component: ContainerWithCard,
};

const render = (args) => {
  console.log('args', args)
  return <ContainerWithCard {...args}>
    <h1>This is content rendered inside MUI Container &gt; Card &gt; CardContent components</h1>
  </ContainerWithCard>;
};

export default meta;

export const BasicView = {
  render,
  args: {
  },
};