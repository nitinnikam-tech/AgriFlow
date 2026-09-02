import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import FarmerHome from './pages/FarmerHome';
import OfficerDashboard from './pages/OfficerDashboard';
import CentreAdmin from './pages/CentreAdmin';
import DistrictAnalytics from './pages/DistrictAnalytics';
import HeroDemoScenario from './pages/HeroDemoScenario';

export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<FarmerHome />} />
        <Route path="/officer" element={<OfficerDashboard />} />
        <Route path="/admin" element={<CentreAdmin />} />
        <Route path="/analytics" element={<DistrictAnalytics />} />
        <Route path="/hero-demo" element={<HeroDemoScenario />} />
      </Routes>
    </MainLayout>
  );
}
