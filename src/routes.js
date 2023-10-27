import { Navigate, useRoutes } from 'react-router-dom';
import { useEffect, useState } from 'react';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
// pages
import BlogPage from './pages/BlogPage';
import CustomersPage from './pages/CustomersPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
// components
import { ProductsProvider } from './context/ProductsContext';
import Login from './pages/SupabaseLogin';
import { supabase } from './supabase';
import { CustomerProvider } from './context/CustomerContext';

// ----------------------------------------------------------------------

export default function Router() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const routes = useRoutes([
    {
      path: '/dashboard',
      element: session ? <DashboardLayout /> : <Login />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        {
          path: 'customers',
          element: (
            <CustomerProvider>
              <CustomersPage />
            </CustomerProvider>
          ),
        },
        {
          path: 'products',
          element: (
            <ProductsProvider>
              <ProductsPage />
            </ProductsProvider>
          ),
        },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: 'login',
      element: <Login />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
