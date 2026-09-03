import React, { useEffect, useState } from 'react';
import { BrainCircuit, Check, X, AlertTriangle, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import { api } from '../../services/api';
import { getSocket } from '../../services/socket';
import { useQueue } from '../../context/QueueContext';

export default function AICommandPanel() {
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [approvedRec, setApprovedRec] = useState(null);
  
  const { queueState, farmerETA } = useQueue();

  const peopleWaiting = queueState?.waitingCount || 37;
  const eta = farmerETA?.estimatedWaitMin || 64;
  const activeCounters = queueState?.activeCounters?.filter(c => c.status === 'PROCESSING').length || 4;
  const totalCounters = queueState?.activeCounters?.length || 6;
  
  const isCongested = eta > 45;

  useEffect(() => {
    fetchRecommendations();

    const socket = getSocket();
    if (socket) {
      socket.on('ai:recommendation', (rec) => {
        if (rec && rec.status === 'PENDING') {
          setRecommendation(rec);
          setApprovedRec(null);
        }
      });
    }

    return () => {
      if (socket) socket.off('ai:recommendation');
    };
  }, []);

  const fetchRecommendations = async () => {
    try {
      const res = await api.getAIRecommendations();
      if (res && res.data) {
        const pending = res.data.find(r => r.status === 'PENDING');
        setRecommendation(pending || null);
      }
    } catch (e) {
      console.error('Failed to fetch recommendations', e);
    }
  };

  const handleApprove = async () => {
    if (!recommendation) return;
    setLoading(true);
    try {
      await api.approveAIRecommendation(recommendation.id);
      setApprovedRec(recommendation);
      setRecommendation(null);
      
      // Clear the approval success message after a few seconds
      setTimeout(() => setApprovedRec(null), 5000);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleDismiss = async () => {
    if (!recommendation) return;
    setLoading(true);
    try {
      await api.dismissAIRecommendation(recommendation.id);
      setRecommendation(null);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-700/50 mb-8">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="flex items-center space-x-3 border-b border-slate-700/60 pb-4 mb-6">
        <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
          <BrainCircuit className="w-5 h-5" />
        </div>
        <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">AI QUEUE INTELLIGENCE</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        
        {/* Left Column: Live Queue Status */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            {isCongested ? (
              <div className="flex items-center gap-2 bg-rose-500/20 text-rose-400 px-3 py-1.5 rounded-full border border-rose-500/30 text-sm font-bold animate-pulse">
                <AlertTriangle className="w-4 h-4" />
                CONGESTION DETECTED
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/30 text-sm font-bold">
                <Check className="w-4 h-4" />
                QUEUE FLOW NORMAL
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/50">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Queue</p>
              <p className="text-2xl font-black text-white">{peopleWaiting} <span className="text-sm font-normal text-slate-500">waiting</span></p>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/50">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Est. Wait</p>
              <p className={`text-2xl font-black ${isCongested ? 'text-rose-400' : 'text-emerald-400'}`}>{eta} <span className="text-sm font-normal text-slate-500">min</span></p>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/50">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Counters</p>
              <p className="text-2xl font-black text-blue-400">{activeCounters} <span className="text-sm font-normal text-slate-500">/ {totalCounters}</span></p>
            </div>
          </div>
        </div>

        {/* Right Column: AI Recommendation */}
        <div className="bg-slate-800/50 rounded-2xl border border-indigo-500/30 p-5 relative">
          {!recommendation && !approvedRec ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-60">
              <ShieldCheck className="w-8 h-8 text-indigo-400" />
              <p className="text-sm text-indigo-200">No active operational recommendations.<br/>System is continuously monitoring.</p>
            </div>
          ) : approvedRec ? (
            <div className="h-full flex flex-col justify-center space-y-4 animate-fade-in">
              <div className="flex items-center gap-3 text-emerald-400">
                <div className="bg-emerald-500/20 p-2 rounded-full">
                  <Check className="w-5 h-5" />
                </div>
                <p className="font-bold text-lg">Action Approved</p>
              </div>
              <p className="text-slate-300 font-medium">{approvedRec.recommendedAction}</p>
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex items-center justify-between">
                <span className="text-xs text-emerald-400 font-semibold animate-pulse">Recalculating queue...</span>
                <span className="text-sm font-bold text-emerald-300">{approvedRec.projectedImpact}</span>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in flex flex-col h-full justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/30">
                    AI RECOMMENDATION
                  </span>
                </div>
                <p className="text-lg font-black text-amber-400 leading-tight mb-4">
                  {recommendation.recommendedAction}
                </p>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Why?</p>
                    <p className="text-sm text-slate-300">{recommendation.reason}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Projected Impact (Simulation)</p>
                    <p className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                      <ArrowRight className="w-4 h-4" />
                      {recommendation.projectedImpact}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleApprove}
                  disabled={loading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition-colors shadow-lg shadow-emerald-900/20"
                >
                  APPROVE
                </button>
                <button
                  onClick={handleDismiss}
                  disabled={loading}
                  className="px-4 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 font-semibold transition-colors"
                >
                  DISMISS
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
