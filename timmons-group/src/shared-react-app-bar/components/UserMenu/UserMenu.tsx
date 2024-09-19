/** @module UserMenu */
import { type FC, useState } from 'react';
import { Button, Menu, MenuItem, Link, useMediaQuery, Typography, Box } from '@mui/material';
import PropTypes from 'prop-types';
import { ArrowDropDown, ArrowDropUp, AccountCircle } from '@mui/icons-material';

import { useAuth } from '@timmons-group/shared-react-auth';

/**
 * Renders and arrow to the right of the menu to indicate if it is open or closed
 * @function MenuArrow
 * @param {object} props
 * @param {boolean} props.open - boolean to indicate if the menu is open
 * @returns {React.ReactElement} - the menu arrow

 */
type MenuArrowProps = {
  open?: boolean;
};

export const MenuArrow: FC<MenuArrowProps> = ({ open }) => {
  if (open) {
    let ret = <ArrowDropDown />;
    return ret
  }
  let rets = <ArrowDropUp />;
  return rets
};

MenuArrow.propTypes = {
  open: PropTypes.bool,
};

/**
 * A user menu component that displays the user name and a menu of links if provided
 * @function UserMenu
 * @param {object} props
 * @param {function} [props.onLogin] - the onLogin handler
 * @param {function} [props.onLogout] - the onLogout handler
 * @param {object[]} [props.userLinks] - an array of links to display in the menu
 * @param {string} [props.userLinks[].title] - the title of the link
 * @param {string} [props.userLinks[].href] - the href of the link
 * @returns {React.ReactElement} - the user menu
 */
export type UserMenuLinks = { title: string, href: string }[];

export type UserMenuProps = {
  /** function to call for Sign In click */
  onLogin?: () => void;
  /** label to display for the login button */
  loginLabel?: string;
  /** label to display for the logout button */
  logoutLabel?: string;
  /** function to call for Sign Out click */
  onLogout?: () => void;
  /** an array of links to display in the menu */
  userLinks?: UserMenuLinks;
  /** width that the mobile user menu logic kicks in */
  mobileUserWidth?: number;
  /** custom render method for the mobile view */
  renderUserMobileMenuIcon?: (open?: boolean) => JSX.Element;
};

export const UserMenu: FC<UserMenuProps> = ({ onLogin, onLogout, userLinks, mobileUserWidth = 1000, loginLabel = 'Sign In', logoutLabel = 'Sign Out', renderUserMobileMenuIcon }) => {
  const { authState } = useAuth() ?? {};
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = useMediaQuery(`(max-width:${mobileUserWidth}px)`);

  const open = Boolean(anchorEl);
  const user = authState?.user;

  const displayName = user?.name || user?.email || 'User';

  const renderMenuIcon = () => {
    if (isMobile) {
      return renderUserMobileMenuIcon ? renderUserMobileMenuIcon(open) : <AccountCircle />
    }

    return <>
      {displayName}
      <MenuArrow open={open} />
    </>
  }

  if (!user) {
    return null;
  }

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (user?.isSignedIn) {
    return (
      <>
        <Button
          id="basic-button"
          sx={{ textTransform: 'none' }}
          disableElevation={true}
          variant="contained"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          {renderMenuIcon()}
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {isMobile &&
            <MobileMenuTop displayName={displayName} email={user?.email} />
          }
          {userLinks?.map((link) => {
            const key = `usermenu_${link.title}_${link.href}`;
            return (
              <MenuItem key={key}>
                <Link
                  target="_blank"
                  href={link.href}
                  rel="noreferrer"
                  onClick={handleClose}
                >
                  {link.title}
                </Link>
              </MenuItem>
            );
          })}
          {onLogout &&
            <MenuItem onClick={onLogout}>{logoutLabel}</MenuItem>
          }
        </Menu>
      </>
    );
  } else if (onLogin) {
    return (
      <Button onClick={onLogin} disableElevation={true}>{loginLabel}</Button>
    );
  }
};

interface MobileMenuTopProps {
  /** The user name to display */
  displayName: string;
  /** The user object */
  email?: string;
}
const MobileMenuTop: FC<MobileMenuTopProps> = ({displayName, email}) => {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="mobileUserName">
        {displayName}
      </Typography>
      {email && displayName !== email &&
        <>
          <br />
          <Typography variant="mobileUserEmail">
            {email}
          </Typography>
        </>
      }
    </Box>
  );
};

export default UserMenu;
