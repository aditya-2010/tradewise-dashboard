import { Box, FormControlLabel, FormGroup, Modal, TextField, Button, Typography, Checkbox } from '@mui/material';
import { PropTypes } from 'prop-types';

FormModal.propTypes = {
  modalOpen: PropTypes.bool,
  handleCloseModal: PropTypes.func,
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

const currencies = [
  {
    value: 'CAT1',
    label: 'Category 1',
  },
  {
    value: 'CAT2',
    label: 'Category 2',
  },
  {
    value: 'CAT3',
    label: 'Category 3',
  },
  {
    value: 'CAT4',
    label: 'Category 4',
  },
];

export default function FormModal({ modalOpen, handleCloseModal }) {
  return (
    <Modal
      open={modalOpen}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Add New Product
        </Typography>
        {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
      Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
    </Typography> */}
        <FormGroup>
          <Button sx={{ mt: '20px' }} variant="outlined" component="label">
            Upload Product Image*
            <input required type="file" hidden />
          </Button>
          <TextField
            required
            id="standard-required"
            label="Product Name"
            variant="standard"
            margin="dense"
            // fullWidth
          />
          <TextField
            id="standard-multiline-flexible"
            label="Description"
            variant="standard"
            margin="dense"
            // fullWidth
            multiline
            maxRows={4}
          />
          <TextField
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
          </TextField>
          <TextField
            required
            // fullWidth
            type="number"
            id="standard-required"
            label="Product Price"
            variant="standard"
            margin="dense"
          />
          <TextField
            required
            // fullWidth
            type="number"
            id="standard-required"
            label="Stock Quantity"
            variant="standard"
            margin="dense"
          />
          <FormControlLabel control={<Checkbox />} label="Mark this as Archived" />
          <div style={{ marginTop: '20px ', textAlign: 'right' }}>
            <Button onClick={handleCloseModal}>cancel</Button>
            <Button variant="contained">submit</Button>
          </div>
        </FormGroup>
      </Box>
    </Modal>
  );
}
