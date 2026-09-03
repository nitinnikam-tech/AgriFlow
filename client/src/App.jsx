import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import FarmerHome from './pages/FarmerHome';
import OfficerDashboard from './pages/OfficerDashboard';
import CentreAdmin from './pages/CentreAdmin';
import DistrictAnalytics from './pages/DistrictAnalytics';
import HeroDemoScenario from './pages/HeroDemoScenario';
import LoginPage from './pages/LoginPage';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token } = useAuth();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // If authenticated but wrong role, redirect to appropriate home
    switch(user?.role) {
      case 'OFFICER': return <Navigate to="/officer" replace />;
      case 'CENTRE_ADMIN': return <Navigate to="/admin" replace />;
      case 'DISTRICT_ADMIN': return <Navigate to="/analytics" replace />;
      case 'FARMER': default: return <Navigate to="/" replace />;
    }
  }
  
  return children;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={
        <ProtectedRoute allowedRoles={['FARMER']}>
          <MainLayout><FarmerHome /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/officer" element={
        <ProtectedRoute allowedRoles={['OFFICER', 'CENTRE_ADMIN']}>
          <MainLayout><OfficerDashboard /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['CENTRE_ADMIN', 'DISTRICT_ADMIN']}>
          <MainLayout><CentreAdmin /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute allowedRoles={['DISTRICT_ADMIN']}>
          <MainLayout><DistrictAnalytics /></MainLayout>
        </ProtectedRoute>
      } />
      {/* Demo remains public for SIH pitch */}
      <Route path="/hero-demo" element={<MainLayout><HeroDemoScenario /></MainLayout>} />
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
