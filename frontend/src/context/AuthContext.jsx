import { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, adminLoginUser, registerUser, getCurrentUser, updateProfile } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('agriworld_token');
      const cachedUser = localStorage.getItem('agriworld_user');
      if (token && cachedUser) {
        setUser(JSON.parse(cachedUser));
        try {
          const { user: freshUser } = await getCurrentUser();
          setUser(freshUser);
          localStorage.setItem('agriworld_user', JSON.stringify(freshUser));
        } catch {
          localStorage.removeItem('agriworld_token');
          localStorage.removeItem('agriworld_user');
          setUser(null);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const persistSession = (token, userData) => {
    localStorage.setItem('agriworld_token', token);
    localStorage.setItem('agriworld_user', JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (credentials) => {
    const { token, user: userData } = await loginUser(credentials);
    persistSession(token, userData);
    return userData;
  };

  const adminLogin = async (credentials) => {
    const { token, user: userData } = await adminLoginUser(credentials);
    persistSession(token, userData);
    return userData;
  };

  const register = async (formData) => {
    const { token, user: userData } = await registerUser(formData);
    persistSession(token, userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('agriworld_token');
    localStorage.removeItem('agriworld_user');
    setUser(null);
  };

  const refreshProfile = async (formData) => {
    const { user: userData } = await updateProfile(formData);
    setUser(userData);
    localStorage.setItem('agriworld_user', JSON.stringify(userData));
    return userData;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, adminLogin, register, logout, refreshProfile, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
