import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { disconnectSocket, reconnectSocket } from '../services/socket';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(sessionStorage.getItem('agriflow_jwt') || null);
  const [loading, setLoading] = useState(true);
  const [activeRole, setActiveRole] = useState(null); 

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const data = await api.getProfile();
          if (data && data.user) {
            setUser(data.user);
            setActiveRole(data.user.role);
          } else {
            logout();
          }
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = (userData, jwtToken) => {
    sessionStorage.setItem('agriflow_jwt', jwtToken);
    setToken(jwtToken);
    setUser(userData);
    setActiveRole(userData.role);
    reconnectSocket(jwtToken);
  };

  const logout = () => {
    sessionStorage.removeItem('agriflow_jwt');
    setToken(null);
    setUser(null);
    setActiveRole(null);
    disconnectSocket();
  };

  // Demo switcher for SIH presentation: performs real auth under the hood
  const switchRole = async (newRole) => {
    try {
      if (newRole === 'FARMER') {
        const res = await api.verifyOtp('9876543210', '123456');
        if (res.success) login(res.user, res.token);
      } else if (newRole === 'OFFICER') {
        const res = await api.officialLogin('officer@agriflow.gov.in', '123456', 'OFFICER');
        if (res.success) login(res.user, res.token);
      } else if (newRole === 'ADMIN') {
        const res = await api.officialLogin('admin@agriflow.gov.in', '123456', 'CENTRE_ADMIN');
        if (res.success) login(res.user, res.token);
      } else if (newRole === 'DISTRICT') {
        const res = await api.officialLogin('district@agriflow.gov.in', '123456', 'DISTRICT_ADMIN');
        if (res.success) login(res.user, res.token);
      }
    } catch (e) {
      console.error('Fast role switch failed', e);
      logout(); // Fallback to login screen
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, activeRole, loading, login, logout, switchRole, setUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);


