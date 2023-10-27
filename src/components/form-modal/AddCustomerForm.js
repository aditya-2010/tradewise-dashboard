import { useState } from 'react';
import styled from '@emotion/styled';
import { Box, Modal, TextField, Button, Typography, FormControl } from '@mui/material';
import { PropTypes } from 'prop-types';
import { useCustomers } from '../../context/CustomerContext';

FormModal.propTypes = {
  modalOpen: PropTypes.bool,
  setModalOpen: PropTypes.func,
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // width: 'fit-content',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const CloseButton = styled(Button)({
  color: 'red',
  fontSize: '24px',
  position: 'absolute',
  top: '0',
  right: '0',
});

export default function FormModal({ modalOpen, setModalOpen }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const { createCustomer, isLoading } = useCustomers();

  function handleSubmit() {
    if (!name || !phone) {
      alert('Please fill the required fields!');
      return;
    }

    // const filename = coverImage.name.slice(0, -4) + uuid();

    const customer = {
      name: name.trim(),
      phone,
      email: email.trim(),
      address: address.trim(),
    };

    createCustomer(customer);
    if (!isLoading) setModalOpen(false);
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
  }

  return (
    <Modal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Add New Customer
        </Typography>
        <CloseButton onClick={() => setModalOpen(false)}>&#10006;</CloseButton>
        <FormControl sx={{ width: '500px' }}>
          <TextField
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="standard-required"
            label="Customer Name"
            variant="standard"
            margin="dense"
          />
          <TextField
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="number"
            id="standard-required"
            label="Phone No."
            variant="standard"
            margin="dense"
          />
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="standard"
            label="Email ID"
            variant="standard"
            margin="dense"
          />
          <TextField
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            id="standard"
            label="Address"
            variant="standard"
            margin="dense"
          />
          <div style={{ marginTop: '20px ', textAlign: 'right' }}>
            <Button onClick={() => setModalOpen(false)}>cancel</Button>
            <Button disabled={isLoading} variant="contained" onClick={() => handleSubmit()}>
              submit
            </Button>
          </div>
        </FormControl>
      </Box>
    </Modal>
  );
}
