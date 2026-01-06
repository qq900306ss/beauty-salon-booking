import { createContext, useContext, useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://f82cb2me3v.ap-northeast-1.awsapprunner.com';
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 從後端取得當前用戶資訊（使用 cookie 中的 token）
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/profile`, {
        credentials: 'include', // 重要：發送 cookies
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    // OAuth login handled by backend redirect
    fetchCurrentUser();
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint to clear HTTP-only cookies
      await fetch(`${API_URL}/api/v1/auth/logout`, {
        method: 'POST',
        credentials: 'include', // 重要：發送 cookies
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      // Clear user state and redirect regardless of API result
      setUser(null);
      window.location.href = '/';
    }
  };

  const isAuthenticated = () => {
    return !!user;
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
