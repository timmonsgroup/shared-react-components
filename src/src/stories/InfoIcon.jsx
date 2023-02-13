import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {
  ClickAwayListener, Tooltip
} from '@mui/material';
import IIcon from '@mui/icons-material/InfoOutlined';

const InfoIcon = ({ iconComponent, infoText, ...props }) => {
  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <div>
        <Tooltip
          PopperProps={{
            disablePortal: true,
          }}
          onClose={handleTooltipClose}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title={infoText}
        >
          <IIcon onClick={handleTooltipOpen} color="primary" sx={{ marginLeft: '5px', paddingTop: '1px' }}></IIcon>
        </Tooltip>
      </div>
    </ClickAwayListener>
  );
}

InfoIcon.propTypes = {
  iconComponent: PropTypes.element,
  infoText: PropTypes.string,
};

export default InfoIcon;