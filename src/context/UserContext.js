import { createContext, useContext, useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { supabase } from '../supabase';

const UserContext = createContext();

function UserProvider({ children }) {
  const [userId, setUserId] = useState('');
  // const [session, setSession] = useState(null);

  // useEffect(() => {
  //   // getUser();

  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     setSession(session);
  //   });
  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((_event, session) => {
  //     setSession(session);
  //   });
  //   console.log(session);
  //   return () => subscription.unsubscribe();
  // }, []);

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) setUserId(user.id);
    else setUserId('');
  }

  return <UserContext.Provider value={{ getUser }}>{children}</UserContext.Provider>;
}

function useUser() {
  const context = useContext(UserProvider);
  if (context === undefined) throw new Error('User context was used outside the UserProvider');
  return context;
}

UserProvider.propTypes = {
  children: PropTypes.any,
};

export { UserProvider, useUser };
