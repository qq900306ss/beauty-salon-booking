import '../styles/globals.css';
import { SessionProvider, useSession } from 'next-auth/react';
import { AuthProvider } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { setSessionTokenGetter } from '../lib/api';

function AppContent({ Component, pageProps }) {
  const { data: session } = useSession();

  useEffect(() => {
    // 設定 API token getter
    setSessionTokenGetter(async () => {
      return session?.backendAccessToken || null;
    });
  }, [session]);

  return <Component {...pageProps} />;
}

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <AuthProvider>
        <AppContent Component={Component} pageProps={pageProps} />
      </AuthProvider>
    </SessionProvider>
  );
}
