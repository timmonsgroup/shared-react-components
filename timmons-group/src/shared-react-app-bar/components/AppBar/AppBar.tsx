/** @module AppBar */

import { useState, type FC, type MouseEvent, type ComponentProps } from 'react';
import {
  Button, Box, Stack, AppBar as MUIAppBar,
  Toolbar, useTheme, IconButton, Menu,
  type AppBarProps,
  useMediaQuery,
  ButtonProps,
} from '@mui/material';
import {Menu as MenuIcon} from '@mui/icons-material';
import PermissionFilter from '@timmons-group/shared-react-permission-filter';

import UserMenu, { UserMenuProps } from '../UserMenu/UserMenu.tsx';

//We are making the bold and, hopefully, correct assumption that your application will always use 'Can Sign In' as the permission string
import { ACLS } from '../../constants.js';

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

export type AppBarNavLink = {
  title: string;
  href: string;
  permission?: string;
};

export interface UserAreaProps extends UserMenuProps {
  /** A boolean to indicate if the app should show the logging in message */
  showLoggingIn?: boolean;
  /** custom rendering method for the user menu  */
  renderUserMenu?: (props?:UserAreaProps) => JSX.Element;
}

/** A function to overwrite the default renderer for the logo section - Optional */
export type AppBarLogoRender = (logoUrl?: string, logoText?: string) => JSX.Element;

interface TheLogoProps {
  /** The url for the logo */
  logoUrl: string;
  /** The text to place next to the logo on the app bar */
  logoText?: string;
  /** A theme group to use instead of the default */
  themeGroup?: object;
  /** A function to overwrite the default renderer for the logo section - Optional */
  renderLogo?: AppBarLogoRender;
};

type Props = TheLogoProps & UserAreaProps & AppBarProps & {
  /** The id for the app bar */
  id?: string;
  /** The array of objects to render as nav links */
  navLinks?: AppBarNavLink[];
  /** The MUI variant name for the buttons creating by navLinks */
  buttonVariant?: string;
  /** The MUI variant name for mobile buttons */
  mobileButtonVariant?: string;
  /** width that the mobile logic kicks */
  mobileWidth?: number;
  /** css class name for the buttons */
  buttonClass?: string;
  /** css class name for the mobile buttons */
  buttonClassMobile?: string;
};

/**
 * App Bar Component for the application
 * @description This component is used to render the application's app bar. It is important to note if you are using the PermissionFilter component, you must have this component as a child of the useAuthProvider.
 * @function AppBar
 */
const AppBar: FC<Props> = ({
  id = 'main-app-bar',
  navLinks = [{ title: 'Home', href: '/' }],
  logoUrl = 'https://wilcity.com/wp-content/uploads/2018/12/sample-logo-design-png-3-2.png',
  mobileWidth = 950,
  buttonClass = 'appbarButton', buttonClassMobile = 'appbarButtonMobile',
  buttonVariant = 'appbar', mobileButtonVariant = 'appbarMobile',
  renderLogo, themeGroup, logoText,
  renderUserMobileMenuIcon, renderUserMenu, onLogin, onLogout, userLinks, showLoggingIn, mobileUserWidth = 1000,
  loginLabel = 'Sign In', logoutLabel = 'Sign Out',
  ...props
}) => {
  const isMobile = useMediaQuery(`(max-width:${mobileWidth}px)`);
  const renderLogoArea = () => {
    return (
      <Box sx={{ flexGrow: 1 }
      }>
        <TheLogo logoUrl={logoUrl} logoText={logoText} renderLogo={renderLogo} themeGroup={themeGroup} />
      </Box>
    );
  }

  const areaProps: UserAreaProps = {
    mobileUserWidth,
    onLogin,
    onLogout,
    userLinks,
    showLoggingIn,
    loginLabel,
    logoutLabel,
    renderUserMobileMenuIcon,
    renderUserMenu
  };

  // Helper render method to simplify the final render returned
  const renderMenu = () => {
    if (isMobile) {
      return <>
        <MobileMenu items={navLinks} buttonVariant={mobileButtonVariant} buttonClass={buttonClassMobile} />
        {renderLogoArea()}
        <UserArea {...areaProps} />
      </>
    }

    return (
      <>
        {renderLogoArea()}
        <Stack spacing={10} direction="row">
          <Stack spacing={2} direction="row">
            {
              navLinks.map((link, index) => {
                return <AppNavLink key={index} item={link} buttonVariant={buttonVariant} showLoggingIn={showLoggingIn} className={buttonClass} />;
              })
            }
          </Stack>
          <UserArea {...areaProps} />
        </Stack>
      </>
    );
  };

  return (
    <MUIAppBar
      id={id}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        height: '64px',
      }}
      position="sticky"
      {...props}
    >
      <Toolbar>
        {renderMenu()}
      </Toolbar>
    </MUIAppBar>
  );
};

// Render the user area if the user is allowed to sign in.
const UserArea: FC<UserAreaProps> = ({renderUserMenu, ...props}) => {
  if (renderUserMenu) {
    return renderUserMenu(props);
  }

  const { showLoggingIn, ...rest } = props;

  return (
    <PermissionFilter permission={ACLS.SIGN_IN} showLoggingIn={showLoggingIn || false} >
      <UserMenu {...rest} />
    </PermissionFilter>
  );
};

const TheLogo: FC<TheLogoProps> = ({ logoUrl, logoText, renderLogo, themeGroup }) => {
  // yes we do HAVE to declare the hook here....cause React
  const theme = useTheme();

  if (renderLogo) {
    return renderLogo(logoUrl, logoText);
  }

  if (!logoUrl && !logoText) {
    return null;
  }

  const appBar = theme?.appBar || theTheme.appBar;

  // If a theme group was passed in, use that instead of the default
  const theming = (themeGroup ?? appBar) as typeof theTheme.appBar;
  const logoStyle = (theming?.logo ?? theTheme.appBar.logo) as React.CSSProperties;
  const logoTextStyle = (theming?.logoText ?? theTheme.appBar.logoText) as React.CSSProperties;

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
        <Box sx={logoTextStyle}>
          {logoText}
        </Box>
      ) : ''}
    </Stack>
  );
}

interface AppNavLinkProps extends ButtonProps, ComponentProps<typeof Button> {
  /** The nav link object to render */
  item: AppBarNavLink;
  /** The MUI variant name for the buttons creating by navLinks */
  buttonVariant?: string;
  /** A boolean to indicate if the app should show the logging in message */
  showLoggingIn?: boolean;
}

// On the off chance a button is defined that does not need special permission render it without the PermissionFilter.
const AppNavLink: FC<AppNavLinkProps> = ({ item, buttonVariant, showLoggingIn, ...props }) => {
  const theButton = (
    <Button
      end={true}
      /*
    // @ts-ignore */
      variant={buttonVariant}
      disableElevation={true}
      href={item.href}
      {...props}
    >{item.title}</Button>
  );

  if (item.permission) {
    return (
      <PermissionFilter permission={item.permission} showLoggingIn={showLoggingIn || false}>
        {theButton}
      </PermissionFilter>
    );
  }

  return theButton;
}

interface MobileMenuProps {
  /** The array of objects to render as nav links */
  items: AppBarNavLink[];
  /** The MUI variant name for the buttons creating by navLinks */
  buttonVariant?: string;
  /** css class name for the buttons */
  buttonClass?: string;
}

const MobileMenu: FC<MobileMenuProps> = ({ items, buttonClass='appbarButtonMobile', buttonVariant = 'appbarMobile' }) => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleOpenNavMenu}
        color="inherit"
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorElNav}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={Boolean(anchorElNav)}
        onClose={handleCloseNavMenu}
      >
        {items.map(
          (page) => {
            const key = `appbarmobile_${page.title}_${page.href}`;
            return (
              <Box key={key} sx={{ display: 'block', paddingLeft: '8px', paddingRight: '8px' }}>
                <AppNavLink
                  item={page}
                  buttonVariant={buttonVariant}
                  sx={{ width: '100%' }}
                  onClick={handleCloseNavMenu}
                  className={buttonClass}
                />
              </Box>
            )
          }
        )}
      </Menu>
    </Box>
  );
}

export default AppBar;
