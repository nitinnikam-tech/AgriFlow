import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Zap, PlusCircle, AlertTriangle, RefreshCcw, CheckCircle2, ChevronUp, ChevronDown, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DemoControllerBar() {
  const {
    demoStep,
    setDemoStep,
    completeToken,
    triggerCongestionSpike,
    applySlotOptimization,
    addCounter,
    resetDemoState,
    toastMessage
  } = useQueue();
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(true);

  const scenarioSteps = [
    { step: 1, label: '1. Baseline', desc: 'Hero Token Booked (Arrival Window Open)' },
    { step: 2, label: '2. QR Check-In', desc: 'Farmer arrives. Officer scans A-127 QR -> Joins Live Queue' },
    { step: 3, label: '3. Token Completed', desc: 'Officer completes A-109 -> Real-time sync (17 ahead, ETA 29m)' },
    { step: 4, label: '4. Congestion Spike', desc: 'Sudden arrivals. AI detects HIGH congestion & Generates Recommendation' },
    { step: 5, label: '5. AI Command Approval', desc: 'Officer reviews AI Command Panel and clicks [Approve]' },
    { step: 6, label: '6. ETA Recalculation', desc: 'Counter 5 Activates -> Live Queue Velocity increases -> ETA drops' }
  ];

  const handleStepClick = async (s) => {
    setDemoStep(s);
    if (s === 1) resetDemoState();
    else if (s === 2) {
      try {
        const { api } = await import('../services/api');
        await api.verifyQrCheckIn({ token: 'A-127', centre: 'PC-PUNE-01', farmer: 'FMR-1002', date: '2026-09-02', securityHash: 'AGF-SEC-99214' });
      } catch (err) {
        console.error('Check-in failed in demo', err);
      }
    }
    else if (s === 3) completeToken('CNT-PUN-01', 'A-109');
    else if (s === 4) triggerCongestionSpike();
    else if (s === 5) {
      // In the actual demo, the officer would click the AI Panel. We simulate that API call here just in case.
      try {
        const { api } = await import('../services/api');
        const res = await api.getAIRecommendations();
        if (res?.data && res.data.length > 0) {
           await api.approveAIRecommendation(res.data[0].id);
        } else {
           addCounter(); // Fallback
        }
      } catch (err) {
        console.error(err);
      }
    }
    else if (s === 6) applySlotOptimization();
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 max-w-5xl w-[94%] bg-slate-900/95 backdrop-blur-md border border-amber-500/40 rounded-2xl shadow-2xl text-white p-3 sm:p-4 transition-all">
      {/* Toast Alert Notice */}
      {toastMessage && (
        <div className="mb-2 p-2 bg-amber-500/20 border border-amber-400/50 rounded-xl text-amber-200 text-xs font-semibold flex items-center justify-between animate-bounce-subtle">
          <span>⚡ Live Real-Time Event: {toastMessage}</span>
          <span className="text-[10px] bg-amber-500 text-slate-900 px-1.5 py-0.5 rounded-full font-bold">UPDATED</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
          </span>
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-xs sm:text-sm text-amber-400 tracking-wide flex items-center">
              <Award className="w-4 h-4 mr-1 text-amber-400" /> SIH 2026 HERO DEMO CONTROLLER
            </span>
            <span className="text-[10px] text-slate-400 hidden sm:inline">• 1-Click Interactive Live Simulation</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => { setDemoStep(1); resetDemoState(); }}
            className="flex items-center px-2 py-1 text-[11px] font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded border border-slate-700 transition-colors mr-2"
          >
            <RefreshCcw className="w-3 h-3 mr-1" />
            Reset Demo
          </button>
          <Link
            to="/hero-demo"
            className="text-[11px] font-bold text-amber-300 hover:text-amber-200 underline hidden sm:inline mr-2"
          >
            Launch Fullscreen Pitch Screen ↗
          </Link>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-400 hover:text-white rounded-lg"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Quick Action Buttons */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {scenarioSteps.map((s) => (
            <button
              key={s.step}
              onClick={() => handleStepClick(s.step)}
              className={`p-2 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                demoStep === s.step
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700 font-medium'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{s.label}</span>
                {demoStep === s.step && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />}
              </div>
              <span className={`text-[10px] mt-1 leading-tight ${demoStep === s.step ? 'text-slate-900' : 'text-slate-400'}`}>
                {s.desc}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
