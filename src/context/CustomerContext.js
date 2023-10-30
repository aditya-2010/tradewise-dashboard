import { createContext, useContext, useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
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

  async function createCustomer(customer) {
    setIsLoading(true);

    const { data, error } = await supabase.from('customers').insert(customer).select();
    if (data) setCustomers((customers) => [...customers, data[0]]);
    if (error) console.log(error);

    setIsLoading(false);
  }

  async function updateCustomer(selected, customer) {
    setIsLoading(true);

    const { data, error } = await supabase.from('customers').update(customer).eq('name', selected).select();
    if (data) {
      console.log(data);
      const updatedCustomers = [...customers];
      const idx = updatedCustomers.findIndex((cust) => cust.name === selected);
      updatedCustomers[idx] = data[0];
      setCustomers(updatedCustomers);
    }

    if (error) console.log(error);

    setIsLoading(false);
  }

  async function deleteCustomer(name) {
    setIsLoading(true);
    const { error } = await supabase.from('customers').delete().eq('name', name);
    if (!error) setCustomers((customers) => customers.filter((customer) => customer.name !== name));
    setIsLoading(false);
  }

  return (
    <CustomerContext.Provider value={{ customers, isLoading, deleteCustomer, createCustomer, updateCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
}

function useCustomers() {
  const context = useContext(CustomerContext);
  if (context === undefined) throw new Error('Customers context was used outside the CustomersProvider');
  return context;
}

export { CustomerProvider, useCustomers };
