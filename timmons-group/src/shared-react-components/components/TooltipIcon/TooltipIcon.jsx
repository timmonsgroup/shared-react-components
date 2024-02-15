/** @module TooltipIcon */
import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {
  ClickAwayListener, Tooltip
} from '@mui/material';
import IIcon from '@mui/icons-material/InfoOutlined';

/**
 * TooltipIcon is a wrapper around the MUI InfoOutlined icon (default) that displays a tooltip when clicked
 * @param {object} props - any additional props are passed directly to the icon component
 * @param {React.ElementType} [props.iconComponent] - the component to use for the icon instead of the default InfoOutlined
 * @param {string} [props.infoText] - the text to display in the tooltip
 * @returns {React.ReactElement} an icon that displays a tooltip when clicked
 */
const TooltipIcon = ({ iconComponent, infoText, ...props }) => {
  const [open, setOpen] = useState(false);
  const [clickOpen, setClickOpen] = useState(false);

  const onClickClose = () => {
    setClickOpen(false);
    setOpen(false);
  };

  const onClickOpen = () => {
    setClickOpen(true);
    setOpen(true);
  };

  const setIfNotClickOpen = (value) => {
    if (!clickOpen) {
      setOpen(value);
    }
  };

  const TheIcon = iconComponent || IIcon;

  return (
    <ClickAwayListener onClickAway={onClickClose}>
      <div onMouseOver={() => setIfNotClickOpen(true)}
        onMouseLeave={() => setIfNotClickOpen(false)}>
        <Tooltip
          placement="top"
          PopperProps={{
            disablePortal: true,
          }}
          onClose={onClickClose}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title={infoText}
        >
          <TheIcon onClick={onClickOpen} sx={{alignItems: 'center', justifyContent: 'center'}} {...props}></TheIcon>
        </Tooltip>
      </div>
    </ClickAwayListener>
  );
};

TooltipIcon.propTypes = {
  iconComponent: PropTypes.elementType,
  infoText: PropTypes.string
};

export default TooltipIcon;