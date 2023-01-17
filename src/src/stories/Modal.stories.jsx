import React from 'react';
import Modal from './Modal';

export default {
  title: 'Components/Modal',
  component: Modal,
};

const Template = (args) => {
  return (
    <Modal {...args}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dignissim metus ac euismod fermentum.
    </Modal>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  open: true,
  showX: true,
};
