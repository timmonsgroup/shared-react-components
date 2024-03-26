// Third party libraries
import { FC, useEffect, useState } from 'react';

// MUI imports
import {Button, Typography} from '@mui/material';
import {ContainerWithCard, Modal} from '@timmons-group/shared-react-components';

const Home: FC = () => {
  // Set the page title on mount
  const [open, setOpen] = useState(false);
  const [openTwo, setOpenTwo] = useState(false);
  useEffect(() => {
    document.title = 'SRC Playground';
  }, []);

  const closeModal = () => {
    setOpen(false);
  }

  return (
    <>
      <ContainerWithCard>
        <Typography variant="sectionHeader" fontSize={'32px'}>SRC Playground</Typography>
        <Typography>Go play.</Typography>
        <Button variant="contained" color="primary" onClick={() => {setOpen(true)}}>Open A Modal</Button>
      </ContainerWithCard>

      <Modal
        open={open}
        onOk={closeModal}
        onCancel={closeModal}
        handleClose={() => setOpenTwo(true)}
        title="Modal Title"
      >
        I am the modal content! You can't click outside of me to close me!
      </Modal>
      <Modal
        open={openTwo}
        onOk={() => setOpenTwo(false)}
        hideCancel={true}
        title="BAD MODAL!"
      >
        I don't want you click outside to close that other modal! OK or CANCEL only!
      </Modal>
    </>
  );
}

export default Home;