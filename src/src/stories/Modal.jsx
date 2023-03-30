/** @module Modal */
import React from 'react';
import Button from './Button';
import PropTypes from 'prop-types';
import { Dialog, DialogActions, DialogContent, IconButton, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';

/**
 * Wrapper of the Mui Dialog component
 * Prevent closing by clicking outside of the dialog by NOT passing in a handleClose prop
 * @function
 * @param {object} props
 * @param {string} props.title - the title of the dialog
 * @param {string} props.okLabel - the label for the OK button
 * @param {string} props.cancelLabel - the label for the Cancel button
 * @param {boolean} props.open - whether the dialog is open or not
 * @param {boolean} props.showX - whether to show the X in the top right corner
 * @param {boolean} props.hideActions - whether to hide the actions (OK and Cancel buttons)
 * @param {boolean} props.hideCancel - whether to hide the Cancel button
 * @param {boolean} props.hideOk - whether to hide the OK button
 * @param {function} props.onOk - the function to call when the OK button is clicked
 * @param {function} props.onCancel - the function to call when the Cancel button is clicked
 * @param {function} props.handleClose - the function to call when the dialog is closed
 * @param {string} props.okColor - the color of the OK button
 * @param {string} props.cancelColor - the color of the Cancel button
 * @returns {React.ReactElement} - React component
 */
const Modal = ({ okLabel, cancelLabel, title, onOk, onCancel, handleClose, open, showX, children, hideActions, hideCancel, hideOk, okColor = 'primary', cancelColor = 'regressive', ...props }) => {
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
  };

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
          <ShowHidden hide={hideCancel} onClick={onCancel} label={cancelLabel || 'Cancel'} color={cancelColor}></ShowHidden>
          <ShowHidden hide={hideOk} onClick={onOk} autoFocus label={okLabel || 'Ok'} color={okColor} />
        </DialogActions>
      )
      }
    </Dialog>
  );
};

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
  okColor: PropTypes.string,
  cancelColor: PropTypes.string,
  // Mui Dialog props (...props)
  // by defining them here, they will be consumed by Storybook for use in the controls area
  fullWidth: PropTypes.bool,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
};

/**
 * @function
 * @param {object} props - props object
 * @param {boolean} props.hide - whether to hide the button or not
 * @param {object} props.props - props for the Button component
 * @returns {React.ReactElement | null} - React component
 */
const ShowHidden = ({ hide, ...props }) => {
  return hide ? null :
    (
      <Button {...props} />
    );
};
ShowHidden.propTypes = {
  hide: PropTypes.bool
};

export default Modal;
