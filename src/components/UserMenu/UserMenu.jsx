/** @module UserMenu */
import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import PropTypes from 'prop-types';
import Link from '@mui/material/Link';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUp from '@mui/icons-material/ArrowDropUp';

/**
 * Renders and arrow to the right of the menu to indicate if it is open or closed
 * @function MenuArrow
 * @param {object} props
 * @param {boolean} props.open - boolean to indicate if the menu is open
 * @returns {React.ReactElement} - the menu arrow
 */
const MenuArrow = ({ open }) => {
  if (open) {
    return <ArrowDropUp />;
  }
  return <ArrowDropDownIcon />;
};

MenuArrow.propTypes = {
  open: PropTypes.bool,
};

/**
 * A user menu component that displays the user name and a menu of links if provided
 * @function UserMenu
 * @param {object} props
 * @param {object} [props.user] - the user object
 * @param {string} [props.user.name] - the name of the user
 * @param {boolean} [props.user.isSignedIn] - boolean to indicate if the user is signed in
 * @param {function} [props.onLogin] - the onLogin handler
 * @param {function} [props.onLogout] - the onLogout handler
 * @param {object[]} [props.links] - an array of links to display in the menu
 * @param {string} [props.links[].title] - the title of the link
 * @param {string} [props.links[].href] - the href of the link
 * @param {boolean} [props.hideArrow] - boolean to indicate if the arrow should be hidden
 * @returns {React.ReactElement} - the user menu
 */
const UserMenu = ({ user, onLogin, onLogout, links, hideArrow }) => {
  const [anchorEl, setAnchorEl] = useState(false);
  const open = Boolean(anchorEl);

  if (!user) {
    return null;
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
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
          <>
            {user.name}
            {!hideArrow && <MenuArrow open={open} />}
          </>
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {links?.map((link, index) => {
            return (
              <MenuItem key={`usermenu_${index}`}>
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
            <MenuItem onClick={onLogout}>Sign Out</MenuItem>
          }
        </Menu>
      </>
    );
  } else if(onLogin) {
    return (
      <>
        <Button onClick={onLogin} disableElevation={true}>Sign In</Button>
      </>
    );
  }
};

UserMenu.propTypes = {
  user: PropTypes.shape({ name: PropTypes.string, isSignedIn: PropTypes.bool }),
  onLogin: PropTypes.func,
  onLogout: PropTypes.func,
  links: PropTypes.arrayOf(
    PropTypes.shape({ title: PropTypes.string, href: PropTypes.string })
  ),
  hideArrow: PropTypes.bool,
};

UserMenu.defaultProps = {
  user: null,
  hideArrow: false,
};

export default UserMenu;
