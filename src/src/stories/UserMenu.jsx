import React from 'react';
import Button from './Button';
import { Menu, MenuItem } from '@mui/material';
import PropTypes from 'prop-types';

const UserMenu = ({ user, onLogin, onLogout }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  if (user?.isSignedIn) {
    return (<>
      <Button
        id="basic-button"
        sx={{ textTransform: 'none' }}
        disableElevation={true}
        variant="contained"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        label={user.name}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={onLogout}>Sign Out</MenuItem>
      </Menu>
    </>);
  }
  else {
    return (<>
      <Button onClick={onLogin} disableElevation={true} label="Sign in" />
    </>);
  }
};

UserMenu.propTypes = {
  user: PropTypes.shape({ name: PropTypes.string, isSignedIn: PropTypes.bool }),
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
}

UserMenu.defaultProps = {
  user: null,
};

export default UserMenu;