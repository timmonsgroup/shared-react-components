import type { Meta, StoryObj } from '@storybook/react';
import ContainerWithCard from '../components/ContainerWithCard';
import ConfigBuilder from '../helpers/configBuilder';
import { FIELD_TYPES } from '../constants';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'WIP/ConfigBuilder',
  component: ContainerWithCard,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
} satisfies Meta<typeof ContainerWithCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const ContainerWithHooks = () => {
  const builder = new ConfigBuilder();
  let final = builder.form('Mine')
    .field('name', FIELD_TYPES.TEXT)
    .field('age', FIELD_TYPES.INT)
    .field('email', FIELD_TYPES.TEXT)
    .field('name', FIELD_TYPES.TEXT)


  console.log(final, 'final')
  console.log(builder, 'builder')

  return <ContainerWithCard></ContainerWithCard>;
}

export const Default: Story = {
  render: () => <ContainerWithHooks />,
} satisfies Story;
