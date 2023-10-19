import { createContext, useState, useEffect, useContext } from 'react';
import { PropTypes } from 'prop-types';
import { supabase } from '../supabase';

const ProductsContext = createContext();

// const BASE_URL = 'http://localhost:8000';

function ProductsProvider({ children }) {
  const [userId, setUserId] = useState('');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
    getUser();
  }, []);

  async function fetchProducts() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.from('products').select('*');

      if (data) setProducts(data);
      if (error) throw new Error(error);
    } catch {
      alert('Error in fetching products data');
    } finally {
      setIsLoading(false);
    }
  }

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) setUserId(user.id);
    else setUserId('');
  }

  async function createProduct(product) {
    try {
      setIsLoading(true);
      const { data } = await supabase.from('products').insert(product).select();
      if (data) setProducts((products) => [...products, data[0]]);
    } catch (err) {
      throw new Error('Failed to create new product');
    } finally {
      setIsLoading(false);
    }
  }

  async function uploadImage(file, filename) {
    try {
      setIsLoading(true);
      if (!userId) {
        alert('Login before uploading image');
        return;
      }
      await supabase.storage.from('tradewise-storage').upload(`${userId}/${filename}`, file);
    } catch (err) {
      throw new Error('Image upload failed', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteProduct({ productName, id, cover }) {
    try {
      setIsLoading(true);
      // const confirmation = ;
      if (window.confirm(`Do you really want to delete this item?\n${productName}`)) {
        // delete row
        await supabase.from('products').delete().eq('id', id);
        // delete image from bucket
        await supabase.storage.from('tradewise-storage').remove(`${userId}/${cover}`);
        // update products
        setProducts((products) => products.filter((product) => product.id !== id));
      } else return;
    } catch (err) {
      throw new Error('Product delete failed', err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ProductsContext.Provider value={{ products, isLoading, createProduct, deleteProduct, uploadImage, userId }}>
      {children}
    </ProductsContext.Provider>
  );
}

function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) throw new Error('Products context was used outside the ProductsProvider');
  return context;
}

ProductsProvider.propTypes = {
  children: PropTypes.any,
};

export { ProductsProvider, useProducts };
