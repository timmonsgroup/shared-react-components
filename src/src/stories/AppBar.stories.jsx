import React from 'react';
import AppBar from './AppBar';
import { BrowserRouter as Router } from 'react-router-dom';
import { authContext } from '../hooks/useAuth';
import { authMock } from '../mocks/authMock';
import { AUTH_STATES } from '../constants';

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
      },
    },
    showLoggingIn: {
      name: 'Show Logging In',
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
  },
};

const navLinks = [
  { title: 'Home', href: '/home' },
  { title: 'About', href: '/about' },
  { title: 'Has Foo', href: '/foo', permission: 'Foo' },
  { title: 'Has Secret', href: '/secret', permission: 'Can Has Secret' },
];

const baseUser = {
  name: 'Jane Doe',
  isSignedIn: false,
};

const Wrapped = (props) => {
  return (
    <authContext.Provider value={authMock}>
      <Router>
        <AppBar {...props} />
      </Router>
    </authContext.Provider>
  );
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => {
  // The router and authContext wrappers are needed because the AppBar and PermissionFilter use routing and useAuth
  return <Wrapped {...args} />;
};

Template.args = {
  user: { isSignedIn: false },
  navLinks,
  logoUrl: '',
  showLoggingIn: false,
  onLogin: () => { },
  onLogout: () => { },
};


export const LoggedOut = Template.bind({});
LoggedOut.args = {
  user: baseUser,
  onLogin: () => {
    authMock.setAuthState({
      user: {
        ...baseUser,
        isSignedIn: true,
      },
      state: AUTH_STATES.LOGGED_IN,
    });
  },
  onLogout: () => { },
};

export const LoggedIn = (args) => {
  const user = {
    ...baseUser,
    isSignedIn: true,
    acl: ['Can Sign In', 'Foo'],
  };

  authMock.setAuthState({
    user,
    state: AUTH_STATES.LOGGED_IN,
  });
  return <Wrapped {...args} user={user} />;
};
LoggedIn.args = {
  navLinks,
  onLogin: () => { },
  onLogout: () => { },
};

export const CustomLogo = (args) => {
  const user = {
    ...baseUser,
    isSignedIn: false
  };

  authMock.setAuthState({
    user,
    state: AUTH_STATES.LOGGED_OUT,
  });
  return <Wrapped {...args} user={user} />;
};
CustomLogo.args = {
  navLinks,
  user: baseUser,
  logoUrl: 'https://www.logomaker.com/wpstatic/uploads/2015/06/Logo-Samples2-73-min.jpg',
  logoText: 'Arkansas CWD Application'
};


export const LoggingIn = (args) => {
  const user = {
    ...baseUser,
    isSignedIn: false,
  };
  authMock.setAuthState({
    user,
    state: AUTH_STATES.LOGGING_IN,
  });
  return <Wrapped {...args} user={user} />;
};

LoggingIn.args = {
  navLinks,
  showLoggingIn: true,
  onLogin: () => { },
  onLogout: () => { },
};
