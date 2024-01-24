/** @module AppBar */
import React from 'react';
import PropTypes from 'prop-types';

import { Button, Box, Stack, AppBar as MUIAppBar, Toolbar } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import UserMenu from '../../components/UserMenu';
import PermissionFilter from '@timmons-group/shared-react-permission-filter';
import { useAuth } from '@timmons-group/shared-react-auth';

//We are making the bold and, hopefully, correct assumption that your application will always use 'Can Sign In' as the permission string
import { ACLS } from '../../constants';
import { functionOrDefault } from '../../helpers';

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
    logoText: {
      height: '100%',
      width: 'auto',
      maxHeight: '44px',
      top: '3px',
      position: 'relative',
      maxWidth: '150px'
    },
  }
};

/**
 * App Bar Component for the application
 * @description This component is used to render the application's app bar. It is important to note if you are using the PermissionFilter component, you must have this component as a child of the useAuthProvider.
 * @function AppBar
 * @param {object} props
 * @param {function} [props.onLogout] - A logout function to call when the user clicks the logout button
 * @param {function} [props.onLogin] - The login function to call when the user clicks the login button
 * @param {object[]} [props.navLinks] - An array of objects to render as nav links
 * @param {string} [props.navLinks[].title] - The label for the nav link
 * @param {string} [props.navLinks[].href] - The path for the nav link
 * @param {string} [props.logoUrl] - The url for the logo
 * @param {string} [props.buttonVariant] - The MUI variant name for the buttons creating by navLinks
 * @param {string} [props.logoText] - The text to place next to the logo on the app bar
 * @param {object} [props.themeGroup] - A theme group to use instead of the default
 * @param {object[]} [props.userLinks] - An array of objects to render as user links
 * @param {string} [props.userLinks[].title] - The label for the user link
 * @param {string} [props.userLinks[].href] - The path for the user link
 * @param {boolean} [props.showLoggingIn] - A boolean to indicate if the app should show the logging in message
 * @param {function} [props.renderLogo] - A function to overwrite the default renderer for the logo section - Optional
 */
const AppBar = ({ onLogin, onLogout, navLinks, logoUrl, buttonVariant = 'appbar', themeGroup, userLinks, showLoggingIn, logoText, renderLogo, ...props }) => {
  const { authState } = useAuth();
  const { user } = authState;
  
  const theme = useTheme();
  const appBar = theme?.appBar || theTheme.appBar;

  // If a theme group was passed in, use that instead of the default
  const theming = themeGroup || appBar;
  const logoStyle = theming?.logo || theTheme.appBar.logo;
  const logoTextStyle = theming?.logoText || theTheme.appBar.logoText;

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
      >{item.title}</Button>
    );

    if (item.permission) {
      return (
        <PermissionFilter key={index} permission={item.permission} showLoggingIn={showLoggingIn || false}>
          {theButton}
        </PermissionFilter>
      );
    }

    return theButton;
  };

  // Render the user area if the user is allowed to sign in.
  const renderUserArea = () => {
    return (
      <PermissionFilter permission={ACLS.SIGN_IN} debug="UserMenu" showLoggingIn={showLoggingIn || false} >
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

  const defaultLogoRenderer = (logoUrl, logoText) => {
    return (
      <Stack spacing={3} direction="row" >
        {logoUrl && (
          <img
            alt="Logo"
            src={logoUrl}
            style={logoStyle}
            className="appbar-logo"
          />
        )}
        {logoText ? (
          <Box sx={logoTextStyle} alt="Logo text">
            {logoText}
          </Box>
        ) : ''}
      </Stack>
    );
  };

  const theLogo = logoUrl || logoText || renderLogo ? functionOrDefault(renderLogo, defaultLogoRenderer) : null;

  return (
    <Box sx={{ flexGrow: 1, height: '64px' }}>
      <MUIAppBar
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        position="relative"
        {...props}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            {theLogo && theLogo(logoUrl, logoText)}
          </Box>

          {renderMenu()}
        </Toolbar>
      </MUIAppBar>
    </Box>
  );
};

AppBar.propTypes = {
  onLogin: PropTypes.func,
  onLogout: PropTypes.func,
  logoText: PropTypes.string,
  renderLogo: PropTypes.func,
  user: PropTypes.shape({}),
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
