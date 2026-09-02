import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    id: 'FMR-1002',
    name: 'Ramesh Patil',
    phone: '9876543210',
    role: 'FARMER',
    village: 'Khed Shivapur',
    district: 'Pune',
    state: 'Maharashtra'
  });

  const [activeRole, setActiveRole] = useState('FARMER');

  const switchRole = (newRole) => {
    setActiveRole(newRole);
    if (newRole === 'FARMER') {
      setUser({
        id: 'FMR-1002',
        name: 'Ramesh Patil',
        phone: '9876543210',
        role: 'FARMER',
        village: 'Khed Shivapur',
        district: 'Pune'
      });
    } else if (newRole === 'OFFICER') {
      setUser({
        id: 'USR-OFF-01',
        name: 'Sanjay Deshmukh',
        email: 'officer@agriflow.gov.in',
        role: 'OFFICER',
        counterNumber: 1,
        centreId: 'PC-PUNE-01'
      });
    } else if (newRole === 'ADMIN') {
      setUser({
        id: 'USR-ADM-01',
        name: 'Dr. Vivek Sharma',
        role: 'CENTRE_ADMIN',
        centreId: 'PC-PUNE-01'
      });
    } else if (newRole === 'DISTRICT') {
      setUser({
        id: 'USR-DST-01',
        name: 'Priyanka Patil (IAS)',
        role: 'DISTRICT_ADMIN',
        district: 'Pune'
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, activeRole, switchRole, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
