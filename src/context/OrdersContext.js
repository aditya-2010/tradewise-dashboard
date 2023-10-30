import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const OrdersContext = createContext();

const OrdersProvider = (children) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getOrders();
  }, []);

  async function getOrders() {
    setIsLoading(true);
    const { data, error } = await supabase.from('orders').select('*');
    if (data) setOrders(data);
    if (error) throw new Error('Could not fetch orders data!');
    setIsLoading(false);
  }

  async function createOrders(order) {
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
    <OrdersContext.Provider value={{ orders, isLoading, deleteOrder, createOrders }}>{children}</OrdersContext.Provider>
  );
};

const useOrders = () => {
  const context = useContext(OrdersContext);
  if (context === undefined) throw new Error('OrdersContext accessed outside of OrdersProvider');
  return context;
};

export { OrdersProvider, useOrders };
