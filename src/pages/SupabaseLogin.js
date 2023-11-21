import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../supabase';

export default function Login() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ width: '400px' }}>
        <p>adityanakadi3@gmail.com - vq@V9ge4ux2gF7V</p>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          redirectTo="http://localhost:3000"
          providers={[]}
        />
      </div>
    </div>
  );
}
