import React from 'react';
import AppBar from './AppBar';
import {
  BrowserRouter as Router
} from 'react-router-dom';
import { authContext } from '../hooks/useAuth';
import { authMock } from '../mocks/authMock';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/AppBar',
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

  // const auth = {
  //   authState: {
  //     user: {
  //       acl: null
  //     }
  //   }
  // };
  // The router and authContext wrappers are needed because the AppBar and PermissionFilter use routing and useAuth
  return (
    <authContext.Provider value={authMock}>
      <Router>
        <AppBar {...args} />
      </Router>
    </authContext.Provider>
  );
};

const navLinks = [
  { title: 'Home', href: '#' },
  { title: 'About', href: '#/about' },
  { title: 'Logged In Link', permission: 'Foo' },
  { title: 'Secret', href: '#/secret', permission: 'Can Has Secret' }
];

const user = {
  name: 'Jane Doe',
  isSignedIn: true,
  permissions: ['Can Sign In', 'Foo'],
};


export const LoggedOut = Template.bind({});
LoggedOut.args = {};

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  navLinks,
  user,
  onLogin: () => { },
  onLogout: () => { },
};

export const CustomLogo = Template.bind({});
CustomLogo.args = {
  navLinks,
  user,
  logoUrl: 'https://www.logomaker.com/wpstatic/uploads/2015/06/Logo-Samples2-73-min.jpg'
};

export const LoggingIn = Template.bind({});
LoggingIn.args = {
  navLinks,
  showLoggingIn: true,
  onLogin: () => { },
  onLogout: () => { },
};