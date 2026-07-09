import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on init
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('betania-admin-user');
      const storedToken = localStorage.getItem('betania-admin-token');
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (e) {
      console.error("Klarte ikke gjenopprette admin økt:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Autentisering feilet');
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('betania-admin-user', JSON.stringify(data.user));
      localStorage.setItem('betania-admin-token', data.token);
      return { success: true };
    } catch (err) {
      console.error("Login feil:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('betania-admin-user');
    localStorage.removeItem('betania-admin-token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
