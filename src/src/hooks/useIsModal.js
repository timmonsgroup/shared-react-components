import { useEffect, useRef, useState } from 'react';

/**
 * Hook to use help with modal functionality.
 * Exposes open state and setter along with functions set the state.
 * @param {*} modalClosed function to call when the modal is closed
 * @param {*} debugId string to use for debugging. If not provided the debug method will log
 * @returns {object}
 */
const useIsModal = (modalClosed, debugId) => {
  const [open, setOpen] = useState(true);
  const previousOpen = useRef(true);

  const debug = (message) => {
    if (debugId) {
      console.log(`${debugId} ${message}`);
    }
  };

  const onClose = () => {
    debug('onClose');
    setOpen(false);
  };

  const onOk = () => {
    debug('onOk');
    setOpen(false);
  };

  const onCancel = () => {
    debug('onCancel');
    setOpen(false);
  };

  // Monitors the open state and calls the modalClosed function when the modal is closed
  useEffect(() => {
    if (previousOpen.current && !open) {
      debug('useEffect previously opened now closed');
      //dispatch a close action
      modalClosed();
    }
    previousOpen.current = open;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return { open, setOpen, onClose, onOk, onCancel, previousOpen };
};

export default useIsModal;
