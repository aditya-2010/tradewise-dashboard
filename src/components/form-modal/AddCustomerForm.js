import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Box, Modal, TextField, Button, Typography, FormControl } from '@mui/material';
import { PropTypes } from 'prop-types';
import { supabase } from '../../supabase';
import { useCustomers } from '../../context/CustomerContext';

AddCustomerForm.propTypes = {
  modalOpen: PropTypes.bool,
  setModalOpen: PropTypes.func,
  selected: PropTypes.string,
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
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

export default function AddCustomerForm({ selected = '', modalOpen, setModalOpen }) {
  const [currentCustomer, setCurrentCustomer] = useState({ name: '', phone: '', email: '', address: '' });
  const { name, phone, email, address } = currentCustomer;
  const { createCustomer, updateCustomer, isLoading } = useCustomers();

  useEffect(() => {
    if (selected) getCustomer(selected);
  }, [selected]);

  async function getCustomer(name) {
    const { data: customer, error } = await supabase.from('customers').select('*').eq('name', name);

    if (customer) setCurrentCustomer(customer[0]);
    if (error) alert('Could not fetch customer details');
  }

  function handleSubmit() {
    if (!name || !phone) {
      alert('Please fill the required fields!');
      return;
    }

    const customer = {
      name: name.trim(),
      phone,
      email: email.trim(),
      address: address.trim(),
    };

    if (selected === '') createCustomer(customer);
    else updateCustomer(selected, customer);
    if (!isLoading) setModalOpen(false);
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
        {/* TODO: Form validation and error highlighting */}
        <FormControl sx={{ width: '500px' }}>
          <TextField
            required
            value={name}
            onChange={(e) => setCurrentCustomer((cc) => ({ ...cc, name: e.target.value }))}
            id="standard-required"
            label="Customer Name"
            variant="standard"
            margin="dense"
          />
          <TextField
            required
            value={phone}
            onChange={(e) => setCurrentCustomer((cc) => ({ ...cc, phone: e.target.value }))}
            type="number"
            id="standard-required"
            label="Phone No."
            variant="standard"
            margin="dense"
          />
          <TextField
            value={email}
            onChange={(e) => setCurrentCustomer((cc) => ({ ...cc, email: e.target.value }))}
            type="email"
            id="standard"
            label="Email ID"
            variant="standard"
            margin="dense"
          />
          <TextField
            value={address}
            onChange={(e) => setCurrentCustomer((cc) => ({ ...cc, address: e.target.value }))}
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
