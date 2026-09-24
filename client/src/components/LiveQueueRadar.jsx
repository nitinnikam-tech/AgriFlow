import React, { useEffect, useState, useRef } from 'react';
import { useQueue } from '../context/QueueContext';
import { useLanguage } from '../context/LanguageContext';
import { Clock, Users, Zap, ShieldCheck, AlertCircle, Compass, ArrowDown, ArrowUp } from 'lucide-react';

export default function LiveQueueRadar() {
  const { queueState, heroToken, farmerETA } = useQueue();
  const { t } = useLanguage();

  const peopleAhead = farmerETA?.peopleAhead !== undefined ? farmerETA.peopleAhead : (heroToken?.peopleAhead || 18);
  const activeCounters = farmerETA?.activeCounters || heroToken?.activeCounters || 4;
  const estimatedWaitMin = farmerETA?.estimatedWaitMin !== undefined ? farmerETA.estimatedWaitMin : (heroToken?.estimatedWaitMin || 32);
  const recommendedArrival = farmerETA?.recommendedArrivalTime || heroToken?.recommendedArrivalTime || '10:42 AM';
  const congestion = farmerETA?.predictedCongestion || heroToken?.predictedCongestion || 'LOW';
  
  // ETA Change tracking
  const [etaChange, setEtaChange] = useState(0); // negative means improved/dropped, positive means increased
  const prevEtaRef = useRef(estimatedWaitMin);

  useEffect(() => {
    if (estimatedWaitMin !== prevEtaRef.current) {
      setEtaChange(estimatedWaitMin - prevEtaRef.current);
      prevEtaRef.current = estimatedWaitMin;
      
      // clear the change indicator after a few seconds
      const timeout = setTimeout(() => setEtaChange(0), 4000);
      return () => clearTimeout(timeout);
    }
  }, [estimatedWaitMin]);

  const getCongestionBadge = (level) => {
    switch (level) {
      case 'HIGH':
      case 'CRITICAL':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-300',
          dot: 'bg-rose-500',
          text: 'Very Busy' // Human language
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          dot: 'bg-amber-500',
          text: 'Moderately Busy'
        };
      default:
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500',
          text: 'Normal Flow'
        };
    }
  };

  const badge = getCongestionBadge(congestion);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-agri-950 rounded-3xl text-white p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-slate-700/50">
      {/* Decorative background glow circles */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-agri-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 relative z-10 border-b border-slate-700/60 pb-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-agri-500/20 border border-agri-400/40 flex items-center justify-center text-agri-400">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold tracking-wider text-agri-400 uppercase">
                {t('liveQueueDominant')}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-ping" />
                LIVE
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              Pune District APMC Procurement Mandi
            </h2>
          </div>
        </div>

        {/* Token Badge */}
        <div className="bg-slate-800/90 border border-slate-600/60 rounded-2xl px-4 py-2 flex items-center space-x-3 shadow-inner">
          <div className="text-right">
            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Currently Processing</div>
            <div className="text-xl sm:text-2xl font-black text-amber-400 tracking-tight">
              {queueState?.processingTokens?.[0]?.tokenNumber || 'None'}
            </div>
          </div>
        </div>
      </div>

      {/* Main 4 Telemetry Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6 relative z-10">
        {/* Metric 1: People Ahead */}
        <div className="bg-slate-800/60 border border-slate-700/70 hover:border-agri-500/50 transition-all rounded-2xl p-4 sm:p-5 flex flex-col justify-between backdrop-blur-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">{t('peopleAhead')}</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{peopleAhead}</span>
            <span className="text-xs text-slate-400">farmers</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center space-x-1 border-t border-slate-700/50 pt-2">
            {congestion === 'HIGH' || congestion === 'CRITICAL' ? (
              <span className="text-rose-300 leading-tight">More farmers arriving right now.</span>
            ) : (
              <span className="text-emerald-300 leading-tight">Queue is moving steadily.</span>
            )}
          </div>
        </div>

        {/* Metric 2: Active Counters */}
        <div className="bg-slate-800/60 border border-slate-700/70 hover:border-agri-500/50 transition-all rounded-2xl p-4 sm:p-5 flex flex-col justify-between backdrop-blur-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">{t('activeCounters')}</span>
            <Compass className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{activeCounters}</span>
            <span className="text-xs text-slate-400">/ 6 active</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center space-x-1 border-t border-slate-700/50 pt-2">
            <span className="leading-tight">Counters processing actively.</span>
          </div>
        </div>

        {/* Metric 3: Estimated Waiting Time */}
        <div className="bg-gradient-to-br from-agri-950/80 to-slate-800/80 border border-agri-500/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-lg glow-green backdrop-blur-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-agri-300 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{t('estimatedWait')}</span>
            <Clock className="w-4 h-4 text-agri-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-agri-300 tracking-tight">
              {estimatedWaitMin}
            </span>
            <span className="text-xs text-agri-400 font-semibold">{t('minutes')}</span>
            
            {/* Visual ETA Change Indicator */}
            {etaChange !== 0 && (
              <div className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded animate-bounce ${etaChange < 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                {etaChange < 0 ? <ArrowDown className="w-3 h-3 mr-0.5"/> : <ArrowUp className="w-3 h-3 mr-0.5"/>}
                {Math.abs(etaChange)}m
              </div>
            )}
          </div>
          <div className="mt-3 text-[11px] text-agri-300/80 flex items-center space-x-1 border-t border-agri-700/40 pt-2 font-medium">
            <span>Powered by AI Analysis</span>
          </div>
        </div>

        {/* Metric 4: Recommended Arrival & Congestion */}
        <div className="bg-slate-800/60 border border-slate-700/70 hover:border-agri-500/50 transition-all rounded-2xl p-4 sm:p-5 flex flex-col justify-between backdrop-blur-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">{t('recommendedArrival')}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight">
            {recommendedArrival}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-700/50 pt-2">
            <span className="text-[11px] text-slate-400">Queue Status:</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1 ${badge.dot}`} />
              {badge.text}
            </span>
          </div>
        </div>
      </div>

      {/* Smart Intelligence Callout Bar */}
      <div className="mt-6 bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-start sm:items-center space-x-3">
          <div className="p-2 rounded-xl bg-agri-500/20 text-agri-400 mt-0.5 sm:mt-0">
            <AlertCircle className="w-4 h-4" />
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            <strong className="text-white font-semibold">Smart Recommendation:</strong> Avoid waiting in the sun. Based on {peopleAhead} farmers ahead of you and {activeCounters} active counters, plan your arrival for <span className="text-amber-400 font-bold">{recommendedArrival}</span>.
          </p>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs text-agri-400 font-medium hidden md:inline">"The Queue Comes To You"</span>
        </div>
      </div>
    </div>
  );
}
