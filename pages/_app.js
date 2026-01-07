import '../styles/globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import InstallPrompt from '../components/InstallPrompt';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <InstallPrompt />
    </AuthProvider>
  );
}
