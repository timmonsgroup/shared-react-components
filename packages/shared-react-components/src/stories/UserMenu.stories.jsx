import React from 'react';
import UserMenu from './UserMenu';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'CCP/UserMenu',
  component: UserMenu,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes

};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => {
  return (
    <UserMenu {...args} />
  );
};

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  user: {
    name: 'Jane Doe',
  },
};

export const LoggedOut = Template.bind({});
LoggedOut.args = {};