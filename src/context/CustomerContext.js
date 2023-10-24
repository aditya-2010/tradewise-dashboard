import { createContext, useContext, useEffect, useState } from 'react';
import { PropTypes, func } from 'prop-types';
import { supabase } from '../supabase';

const CustomerContext = createContext();

CustomerProvider.propTypes = {
  children: PropTypes.any,
};

function CustomerProvider({ children }) {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getCustomers();
  }, []);

  async function getCustomers() {
    setIsLoading(true);
    const { data, error } = await supabase.from('customers').select('*');

    if (data) setCustomers(data);
    if (error) throw new Error('Could not fetch customers data!');

    setIsLoading(false);
  }

  // async function createCustomer() {}

  async function deleteCustomer(name) {
    const { error } = await supabase.from('customers').delete().eq('name', name);
    if (!error) setCustomers((customers) => customers.filter((customer) => customer.name !== name));
  }

  return (
    <CustomerContext.Provider value={{ customers, isLoading, deleteCustomer }}>{children}</CustomerContext.Provider>
  );
}

function useCustomers() {
  const context = useContext(CustomerContext);
  if (context === undefined) throw new Error('Products context was used outside the ProductsProvider');
  return context;
}

export { CustomerProvider, useCustomers };
