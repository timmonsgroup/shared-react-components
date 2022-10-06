import './AppBar.css';

import React from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import MUIAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import Button from './Button';
import UserMenu from './UserMenu';

import PermissionFilter, { ACLS } from './PermissionFilter';

const AppBar = ({ user, onLogin, onLogout, navLinks, logoUrl, ...props }) => {
  // Helper render method to simplify the final render returned
  const renderMenu = () => {
    if (user) {
      return (
        <Stack spacing={10} direction="row">
          <Stack spacing={2} direction="row">
            {navLinks.map(renderButton)}
          </Stack>
          {renderUserArea()}
        </Stack>
      );
    }
    return renderUserArea();
  };

  // On the off chance a button is defined that does not need special permission render it with the PermissionFilter.
  const renderButton = (item, index) => {
    const theButton = (
      <Button
        sx={{
          color: (theme) => theme.palette['secondary'].text,
          borderRadius: '0px',
          background: 'none',
          '&.active': {
            borderBottom: '2px solid',
            borderColor: (theme) => theme.palette['secondary'].main,
          },
        }}
        disableElevation={true}
        key={index}
        href={item.href}
        label={item.title}
      ></Button>
    );

    if (item.permission) {
      return (
        <PermissionFilter key={index} permission={item.permission}>
          {theButton}
        </PermissionFilter>
      );
    }

    return theButton;
  };

  // Render the user area if the user is allowed to sign in.
  const renderUserArea = () => {
    return (
      <PermissionFilter permission={ACLS.SIGN_IN} debug="UserMenu">
        <UserMenu
          user={user}
          onLogin={onLogin}
          onLogout={onLogout}
          sx={{ position: 'absolute', left: '0px' }}
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
                style={{ maxHeight: '44px', top: '3px', position: 'relative' }}
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
};

AppBar.defaultProps = {
  navLinks: [
    { title: 'Home', href: '/' },
    {
      title: 'Communities',
      href: '/communities',
      permission: ACLS.VIEW_COMMUNITIES,
    },
    { title: 'Plans', href: '/pam/plans', permission: ACLS.VIEW_PLANS },
    {
      title: 'Explorer',
      href: '/explorer/hvra',
      permission: ACLS.VIEW_EXPLORER,
    },
  ],
  user: null,
  logoUrl:
    'https://wilcity.com/wp-content/uploads/2018/12/sample-logo-design-png-3-2.png', //This is a lorum ipusum logo
};

export default AppBar;