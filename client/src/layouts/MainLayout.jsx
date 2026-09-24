import React from 'react';
import Navbar from '../components/Navbar';
import DemoControllerBar from '../components/DemoControllerBar';
import { useLocation } from 'react-router-dom';

export default function MainLayout({ children }) {
  const location = useLocation();
  const isHeroDemoPage = location.pathname === '/hero-demo';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <div className="flex-1">
        {children}
      </div>

      {/* Floating SIH Demo Bar (Shown on all pages except full hero pitch) */}
      

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-slate-900">AgriFlow</span>
            <span>• SIH 2026 Problem Statement PS 26032</span>
          </div>
          <p>Department of Consumer Affairs (DoCA) • Ministry of Consumer Affairs, Food & Public Distribution</p>
          <div className="text-slate-400">Privacy by Design • Zero Biometrics Stored</div>
        </div>
      </footer>
    </div>
  );
}
