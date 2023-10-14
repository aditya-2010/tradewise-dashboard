import { Outlet, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { Button, Container, Stack, Typography } from '@mui/material';
// components
import FormModal from '../components/form-modal/FormModal';
import { ProductSort, ProductList, ProductFilterSidebar } from '../sections/@dashboard/products';
// mock
// import PRODUCTS from '../_mock/products';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  const [openFilter, setOpenFilter] = useState(false);
  // const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleOpenModal = () => {
    // setModalOpen(true);
    navigate('form/new');
  };

  return (
    <>
      <Helmet>
        <title> TradeWise Dashboard </title>
      </Helmet>

      <Outlet />

      <FormModal modalOpen={false} />

      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Products
        </Typography>

        <Stack
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          direction="row"
          flexWrap="wrap-reverse"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ mb: 5 }}
        >
          <Button onClick={handleOpenModal} variant="contained">
            add new product
          </Button>

          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              openFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort />
          </Stack>
        </Stack>

        <ProductList />
        {/* <ProductCartWidget /> */}
      </Container>
    </>
  );
}
