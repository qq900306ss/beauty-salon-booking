import { createContext, useContext } from 'react';
import { useSession, signOut } from 'next-auth/react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const user = session?.user || null;

  const login = (userData) => {
    // NextAuth handles login, this is kept for backward compatibility
    console.log('Login handled by NextAuth');
  };

  const logout = () => {
    signOut({ callbackUrl: '/' });
  };

  const isAuthenticated = () => {
    return !!session;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
