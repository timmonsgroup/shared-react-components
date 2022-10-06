import React from 'react';
import AppBar from './AppBar';
import {
  BrowserRouter as Router
} from 'react-router-dom';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'CCP/AppBar',
  component: AppBar,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    navLinks: {
      name: 'Nav Items',
      control: {
        type: 'array',
      }
    },
  },
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => {
  // The router wrapper is needed because the AppBar uses routing bits
  return (
    <Router>
      <AppBar {...args} />
    </Router>
  );
};

const navLinks = [{ title: 'Home', href: '#' }, { title: 'About', href: '#/about' }];
const user = {
  name: 'Jane Doe',
  isSignedIn: true,
};

export const LoggedOut = Template.bind({});
LoggedOut.args = {};

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  navLinks,
  user,
  onLogin: () => {},
  onLogout: () => {},
};

export const CustomLogo = Template.bind({});
CustomLogo.args = {
  navLinks,
  user,
  logoUrl: 'https://www.logomaker.com/wpstatic/uploads/2015/06/Logo-Samples2-73-min.jpg'
};