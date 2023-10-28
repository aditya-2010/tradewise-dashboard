import { useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment } from '@mui/material';
// component
import { Icon } from '@iconify/react';
import Iconify from '../../../components/iconify';
import { useCustomers } from '../../../context/CustomerContext';
import FormModal from '../../../components/form-modal/AddCustomerForm';

// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 320,
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

// ----------------------------------------------------------------------

UserListToolbar.propTypes = {
  selected: PropTypes.array,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  setSelected: PropTypes.func,
};

export default function UserListToolbar({ selected, setSelected, filterName, onFilterName }) {
  const [modalOpen, setModalOpen] = useState(false);

  const numSelected = selected.length;
  const { deleteCustomer } = useCustomers();

  const handleDelete = () => {
    selected.forEach((item) => deleteCustomer(item));
    setSelected([]);
  };

  return (
    <StyledRoot
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <StyledSearch
          value={filterName}
          onChange={onFilterName}
          placeholder="Search customer..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          }
        />
      )}

      <FormModal modalOpen={modalOpen} setModalOpen={setModalOpen} selected={selected[0]} />

      {numSelected > 0 ? (
        <div>
          {numSelected === 1 && (
            <Tooltip title="Edit">
              <IconButton onClick={() => setModalOpen(true)}>
                <Icon icon="iconamoon:edit" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDelete()}>
              <Iconify icon="eva:trash-2-fill" />
            </IconButton>
          </Tooltip>
        </div>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Tooltip>
      )}
    </StyledRoot>
  );
}
