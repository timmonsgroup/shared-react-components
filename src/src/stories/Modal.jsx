import * as React from 'react';
import Button from './Button';
import PropTypes from 'prop-types';
import { Dialog, DialogActions, DialogContent, IconButton, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';

/**
 * Wrapper of the Mui Dialog component
 * Prevent closing by clicking outside of the dialog by NOT passing in a handleClose prop
 * @returns {object}
 */
const Modal = ({ okLabel, cancelLabel, title, onOk, onCancel, handleClose, open, showX, children, hideActions, hideCancel, hideOk, ...props }) => {
  const titleRender = () => {
    if (showX) {
      return (
        <>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
          {title}
        </>
      );
    }

    return <>{title}</>;
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      {...props}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Typography id="alert-dialog-title" variant="modalTitle">{titleRender()}</Typography>
      <DialogContent>{children}</DialogContent>
      {hideActions ? null : (
        <DialogActions>
          <ShowHidden hide={hideCancel} onClick={onCancel} label={cancelLabel || 'Cancel'} color={'regressive'}></ShowHidden>
          <ShowHidden hide={hideOk} onClick={onOk} autoFocus label={okLabel || 'Ok'} />
        </DialogActions>
      )
      }
    </Dialog>
  );
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  showX: PropTypes.bool,
  okLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  handleClose: PropTypes.func,
  hideActions: PropTypes.bool,
  hideCancel: PropTypes.bool,
  hideOk: PropTypes.bool,
  // Mui Dialog props (...props)
  // by defining them here, they will be consumed by Storybook for use in the controls area
  fullWidth: PropTypes.bool,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
};

const ShowHidden = ({ hide, ...props }) => {
  return hide ? null :
    (
      <Button {...props} />
    )
}
ShowHidden.propTypes = {
  hide: PropTypes.bool
}

export default Modal;
