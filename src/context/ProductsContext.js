import { createContext, useState, useEffect, useContext } from 'react';
import { PropTypes } from 'prop-types';
import { supabase } from '../supabase';

const ProductsContext = createContext();

// const BASE_URL = 'http://localhost:8000';

function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        // const res = await fetch(`${BASE_URL}/products`);
        // const data = await products.json();

        const { data, error } = await supabase.from('products').select('*');

        if (data) setProducts(data);
        if (error) throw new Error(error);
        console.log(data);
      } catch {
        alert('Error in fetching products data');
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  async function createProduct(product) {
    setIsLoading(true);
    const { data, error } = await supabase.from('products').insert(product).select();
    if (data) setProducts((products) => [...products, data[0]]);
    if (error) throw new Error(error);
    setIsLoading(false);
  }

  return <ProductsContext.Provider value={{ products, isLoading, createProduct }}>{children}</ProductsContext.Provider>;
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
