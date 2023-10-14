import { useState } from 'react';
import styled from '@emotion/styled';
import { Box, FormControlLabel, Modal, TextField, Button, Typography, Checkbox, FormControl } from '@mui/material';
import { PropTypes } from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductsContext';

FormModal.propTypes = {
  modalOpen: PropTypes.bool,
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
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

export default function FormModal({ modalOpen }) {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [archiveStatus, setArchiveStatus] = useState(false);

  const navigate = useNavigate();
  const { createProduct, isLoading } = useProducts();

  function handleClose() {
    navigate(-1);
  }

  function handleSubmit() {
    const product = {
      productName,
      price,
      stockQuantity,
      archiveStatus,
    };

    createProduct(product);
    // console.log(product);
    if (!isLoading) navigate(-1);
  }

  return (
    <Modal
      open={modalOpen}
      onClose={() => handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Add New Product
        </Typography>
        <CloseButton onClick={() => handleClose()}>&#10006;</CloseButton>
        {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
      Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
    </Typography> */}
        <FormControl>
          <Button sx={{ mt: '20px' }} variant="outlined" component="label">
            Upload Product Image*
            <input required type="file" hidden />
          </Button>
          <TextField
            required
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            id="standard-required"
            label="Product Name"
            variant="standard"
            margin="dense"
            // fullWidth
          />
          {/* <TextField
            id="standard-multiline-flexible"
            label="Description"
            variant="standard"
            margin="dense"
            multiline
            maxRows={4}
          /> */}
          {/* <TextField
            required
            fullWidth
            id="standard-select-currency-native"
            margin="normal"
            select
            label="Category"
            defaultValue="EUR"
            SelectProps={{
              native: true,
            }}
            helperText="Please select Category"
            variant="standard"
          >
            {currencies.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField> */}
          <TextField
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            id="standard-required"
            label="Product Price"
            variant="standard"
            margin="dense"
          />
          <TextField
            required
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            type="number"
            id="standard-required"
            label="Stock Quantity"
            variant="standard"
            margin="dense"
          />
          <FormControlLabel
            value={archiveStatus}
            onChange={() => setArchiveStatus((archiveStatus) => !archiveStatus)}
            control={<Checkbox />}
            label="Mark this as Archived"
          />
          <div style={{ marginTop: '20px ', textAlign: 'right' }}>
            <Button onClick={() => handleClose()}>cancel</Button>
            <Button disabled={isLoading} variant="contained" onClick={() => handleSubmit()}>
              submit
            </Button>
          </div>
        </FormControl>
      </Box>
    </Modal>
  );
}
