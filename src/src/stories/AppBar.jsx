/** @module AppBar */
import React from 'react';
import PropTypes from 'prop-types';

import { Box, Stack, AppBar as MUIAppBar, Toolbar } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import Button from './Button';
import UserMenu from './UserMenu';

import PermissionFilter from './PermissionFilter';
//We are making the bold and, hopefully, correct assumption that your application will always use 'Can Sign In' as the permission string
import { ACLS } from '../constants';

/**
 * The default theme for the app bar
 * @type {object}
 */
const theTheme = {
  appBar: {
    logo: {
      height: '100%',
      width: 'auto',
      maxHeight: '44px',
      top: '3px',
      position: 'relative'
    },
  }
};

/**
 * App Bar Component for the application
 * @description This component is used to render the application's app bar. It is important to note if you are using the PermissionFilter component, you must have this component as a child of the useAuthProvider.
 * @function AppBar
 * @param {object} props
 * @param {object} props.user - The user object from the authState
 * @param {function} props.onLogout - A logout function to call when the user clicks the logout button
 * @param {function} props.onLogin - The login function to call when the user clicks the login button
 * @param {array} props.navLinks - An array of objects to render as nav links
 * @param {string} props.navLinks[].title - The label for the nav link
 * @param {string} props.navLinks[].href - The path for the nav link
 * @param {string} props.logoUrl - The url for the logo
 * @param {string} props.buttonVariant - The MUI variant name for the buttons creating by navLinks
 */
const AppBar = ({ user, onLogin, onLogout, navLinks, logoUrl, buttonVariant = 'appbar', themeGroup, userLinks, showLoggingIn, ...props }) => {
  const theme = useTheme();
  const appBar = theme?.appBar || theTheme.appBar;

  // If a theme group was passed in, use that instead of the default
  const theming = themeGroup || appBar;
  const logoStyle = theming?.logo || theTheme.appBar.logo;

  // Helper render method to simplify the final render returned
  const renderMenu = () => {
    return (
      <Stack spacing={10} direction="row">
        <Stack spacing={2} direction="row">
          {navLinks.map(renderButton)}
        </Stack>
        {renderUserArea()}
      </Stack>
    );
  };

  // On the off chance a button is defined that does not need special permission render it with the PermissionFilter.
  const renderButton = (item, index) => {
    const theButton = (
      <Button
        end={true}
        variant={buttonVariant}
        disableElevation={true}
        key={index}
        href={item.href}
        label={item.title}
      ></Button>
    );

    if (item.permission) {
      return (
        <PermissionFilter key={index} permission={item.permission} showLoggingIn={ showLoggingIn || false }>
          {theButton}
        </PermissionFilter>
      );
    }

    return theButton;
  };

  // Render the user area if the user is allowed to sign in.
  const renderUserArea = () => {
    return (
      <PermissionFilter permission={ACLS.SIGN_IN} debug="UserMenu" showLoggingIn={ showLoggingIn || false } >
        <UserMenu
          user={user}
          onLogin={onLogin}
          onLogout={onLogout}
          sx={{ position: 'absolute', left: '0px' }}
          links={userLinks}
        />
      </PermissionFilter>
    );
  };

  return (
    <Box sx={{ flexGrow: 1, height: '64px' }}>
      <MUIAppBar
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        position="relative"
        {...props}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            {logoUrl ? (
              <img
                alt="Logo"
                src={logoUrl}
                style={logoStyle}
                className="appbar-logo"
              />
            ) : (
              <p>Logo</p>
            )}
          </Box>
          {renderMenu()}
        </Toolbar>
      </MUIAppBar>
    </Box>
  );
};

AppBar.propTypes = {
  user: PropTypes.shape({}),
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  navLinks: PropTypes.array,
  logoUrl: PropTypes.string,
  userLinks: PropTypes.array,
  buttonVariant: PropTypes.string,
  themeGroup: PropTypes.shape({}),
  showLoggingIn: PropTypes.bool,
};

AppBar.defaultProps = {
  navLinks: [
    { title: 'Home', href: '/' }
  ],
  user: null,
  logoUrl:
    'https://wilcity.com/wp-content/uploads/2018/12/sample-logo-design-png-3-2.png', //This is a lorum ipusum logo
};

export default AppBar;
