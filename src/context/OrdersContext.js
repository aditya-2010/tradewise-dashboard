import { createContext, useContext, useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { supabase } from '../supabase';

const OrdersContext = createContext();

OrdersProvider.propTypes = {
  children: PropTypes.any,
};

function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getOrders() {
      setIsLoading(true);
      const { data, error } = await supabase.from('orders').select(`*, customers(name, phone)`);
      if (data) setOrders(data);
      if (error) throw new Error('Could not fetch orders data!');
      setIsLoading(false);
    }

    getOrders();
  }, []);

  async function createOrder(order) {
    setIsLoading(true);

    const { data, error } = await supabase.from('orders').insert(order).select();
    if (data) setOrders((orders) => [...orders, data[0]]);
    if (error) console.log(error);

    setIsLoading(false);
  }

  async function deleteOrder(id) {
    setIsLoading(true);
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (!error) setOrders((ords) => ords.filter((ord) => ord.id !== id));
    setIsLoading(false);
  }

  return (
    <OrdersContext.Provider value={{ orders, isLoading, deleteOrder, createOrder }}>{children}</OrdersContext.Provider>
  );
}

const useOrders = () => {
  const context = useContext(OrdersContext);
  if (context === undefined) throw new Error('OrdersContext accessed outside of OrdersProvider');
  return context;
};

export { OrdersProvider, useOrders };
