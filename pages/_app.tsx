// pages/_app.tsx
import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
// import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import '../styles/globals.css';
import { useRouter } from 'next/router';

// Pages that don't require authentication
const publicPages = ['/login', '/register'];

function MyApp({ 
  Component, 
  pageProps: { session, ...pageProps } 
}: AppProps) {
  const router = useRouter();
  return (
    <SessionProvider session={session}>
      <AuthProvider>
          {publicPages.includes(router.pathname) ? (
            <Component {...pageProps} />
          ) : (
            <ProtectedRoute>
              <Component {...pageProps} />
            </ProtectedRoute>
          )}
        </AuthProvider>
    </SessionProvider>
  );
}

export default MyApp;