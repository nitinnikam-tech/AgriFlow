import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useQueue } from '../context/QueueContext';
import { Radio, Volume2, VolumeX, Sparkles, Shield, User, Activity, Layers } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { activeRole, switchRole, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const { isConnected, audioEnabled, setAudioEnabled } = useQueue();
  const location = useLocation();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Government Ribbon */}
      <div className="bg-gradient-to-r from-doca-saffron via-white to-doca-green h-1 w-full" />
      <div className="bg-slate-900 text-slate-300 text-xs py-1 px-4 text-center font-medium hidden md:block">
        🇮🇳 {t('ministryHeader')}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-agri-700 to-agri-500 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              🌾
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">Agri<span className="text-agri-600">Flow</span></span>
                <span className="bg-agri-100 text-agri-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">SIH 2026</span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Smart Procurement Queue & Status Tracking</p>
            </div>
          </Link>

          {/* Navigation Links / Role Switcher */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <Link
              to="/"
              onClick={() => switchRole('FARMER')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                activeRole === 'FARMER' && location.pathname === '/'
                  ? 'bg-agri-700 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{t('roles.farmer')}</span>
            </Link>

            <Link
              to="/officer"
              onClick={() => switchRole('OFFICER')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                activeRole === 'OFFICER' || location.pathname === '/officer'
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{t('roles.officer')}</span>
            </Link>

            <Link
              to="/admin"
              onClick={() => switchRole('ADMIN')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                activeRole === 'ADMIN' || location.pathname === '/admin'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t('roles.admin')}</span>
            </Link>

            <Link
              to="/analytics"
              onClick={() => switchRole('DISTRICT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                activeRole === 'DISTRICT' || location.pathname === '/analytics'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{t('roles.district')}</span>
            </Link>

            <Link
              to="/hero-demo"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all border ${
                location.pathname === '/hero-demo'
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                  : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Hero Pitch</span>
            </Link>
          </nav>

          {/* Right Tools: Language, Audio, Live Pulse */}
          <div className="flex items-center space-x-2">
            {/* Audio Voice Toggle */}
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              title={audioEnabled ? 'Voice announcements active' : 'Voice announcements muted'}
              className={`p-2 rounded-lg text-xs border transition-colors ${
                audioEnabled ? 'bg-agri-50 text-agri-800 border-agri-200' : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Language Selector */}
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="text-xs font-medium bg-slate-100 border border-slate-300 rounded-lg px-2 py-1.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-agri-500"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
            </select>
            
            {/* WebSocket Live Status */}
            <div
              className={`flex items-center space-x-1 text-[11px] font-semibold px-2 py-1 rounded-full border ${
                isConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
              title={isConnected ? 'Real-Time WebSocket Active' : 'Connecting to Real-Time Server...'}
            >
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`} />
              <span className="hidden sm:inline">{isConnected ? 'LIVE' : 'OFFLINE'}</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="px-2 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
