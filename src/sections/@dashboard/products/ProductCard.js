import PropTypes from 'prop-types';
// @mui
import { Box, Card, Link, Typography, Stack, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useProducts } from '../../../context/ProductsContext';
import Iconify from '../../../components/iconify/Iconify';
// utils
import { fCurrency } from '../../../utils/formatNumber';
// components
import Label from '../../../components/label';
// import { ColorPreview } from '../../../components/color-utils';

// ----------------------------------------------------------------------

const StyledProductImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
  userId: PropTypes.string,
};

export default function ShopProductCard({ product, userId }) {
  const { productName, cover, price, archiveStatus, stockQuantity } = product;
  const { deleteProduct } = useProducts();

  return (
    <Card>
      <IconButton
        sx={{ position: 'absolute', right: 4, top: 4, zIndex: '100', background: 'white' }}
        onClick={() => deleteProduct(product)}
      >
        <Iconify icon="eva:trash-2-fill" />
      </IconButton>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {archiveStatus && (
          <Label
            variant="filled"
            color={(archiveStatus === 'sale' && 'error') || 'info'}
            sx={{
              zIndex: 9,
              top: 16,
              left: 16,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            {archiveStatus ? 'Archived' : ''}
          </Label>
        )}
        <StyledProductImg
          src={`https://zgemwnjlvtzarvnyerlv.supabase.co/storage/v1/object/public/tradewise-storage/${userId}/${cover}`}
          alt={productName}
        />
      </Box>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover">
          <Typography variant="subtitle2" noWrap>
            {productName}
          </Typography>
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography component="span" variant="body1">
            {stockQuantity}
          </Typography>
          <Typography variant="subtitle1">
            &nbsp;
            {fCurrency(price)}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
