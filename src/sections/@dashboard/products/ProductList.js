// @mui
import { Grid } from '@mui/material';
import { useProducts } from '../../../context/ProductsContext';
import ShopProductCard from './ProductCard';
import Spinner from '../../../components/spinner/Spinner';

// ----------------------------------------------------------------------

export default function ProductList({ ...other }) {
  const { products, isLoading } = useProducts();

  return (
    <Grid sx={{ display: 'flex', justifyContent: 'center' }} container spacing={3} {...other}>
      {isLoading ? (
        <Spinner />
      ) : (
        products.map((product) => (
          <Grid key={product.id} item xs={12} sm={6} md={3}>
            <ShopProductCard product={product} />
          </Grid>
        ))
      )}
    </Grid>
  );
}
