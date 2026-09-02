import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useQueue } from '../context/QueueContext';
import { useLanguage } from '../context/LanguageContext';
import DigitalTwinMap from '../components/DigitalTwinMap';
import { Layers, Sliders, Zap, CheckCircle2, AlertTriangle, Shield, TrendingUp, Users, ArrowRight } from 'lucide-react';

export default function CentreAdmin() {
  const { queueState, applySlotOptimization } = useQueue();
  const { t } = useLanguage();
  const [proposal, setProposal] = useState(null);
  const [balancing, setBalancing] = useState(null);
  const [isOptimized, setIsOptimized] = useState(false);

  useEffect(() => {
    api.getOptimizationProposal('PC-PUNE-01').then(res => {
      if (res.success) setProposal(res.proposal);
    });
    api.getWorkloadBalancing('PC-PUNE-01').then(res => {
      if (res.success) setBalancing(res);
    });
  }, []);

  const handleApplyOptimization = () => {
    applySlotOptimization();
    setIsOptimized(true);
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Admin Header */}
      <div className="bg-purple-950 text-white py-5 px-4 sm:px-6 lg:px-8 shadow-md border-b border-purple-800/60">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300 font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Mandi Administration & Optimization</span>
                <span className="bg-purple-500/20 text-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-400/30">
                  DoCA Cyber-Twin
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Pune Mandi Operational Digital Twin
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleApplyOptimization}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center space-x-1.5"
            >
              <Zap className="w-4 h-4" />
              <span>{t('optimizeQueue')}</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-8">
        {/* 1. Interactive Mandi Yard Digital Twin */}
        <section>
          <DigitalTwinMap centreId="PC-PUNE-01" />
        </section>

        {/* 2. Dynamic Slot Optimization (Before vs After Load Rebalance) */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-extrabold text-slate-900 text-lg">Dynamic Slot Load Balancing Engine</h2>
              <p className="text-xs text-slate-500">Autonomous Congestion Flattening & Peak Load Redistribution</p>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full">
              SIH Core Novelty
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Left: Load Reduction Summary */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Peak Hour Congestion Load</span>
                <div className="mt-4 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Current 10:30 AM Peak Load</span>
                      <span className="font-bold text-rose-400">86% Overload</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full w-[86%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>After AgriFlow Slot Optimization</span>
                      <span className="font-bold text-emerald-400">61% Balanced</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full w-[61%]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span>Net Waiting Time Saved:</span>
                  <strong className="text-emerald-400 font-bold">13 minutes / farmer</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Congestion Curve Status:</span>
                  <strong className="text-amber-400 font-bold">Flattened</strong>
                </div>
              </div>
            </div>

            {/* Right: Slot Capacity Visualizer */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Mandi Slot Capacity Distribution</h4>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {(proposal?.slotDistribution || []).map((slot) => (
                  <div key={slot.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{slot.timeWindow}</span>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Booked: <strong>{slot.currentBooked}</strong> / {slot.maxCapacity} farmers
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <span className="font-extrabold text-slate-800">{isOptimized ? slot.optimizedLoadPercent : slot.currentLoadPercent}% Load</span>
                        <div className="w-24 bg-slate-200 rounded-full h-2 mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              (isOptimized ? slot.optimizedLoadPercent : slot.currentLoadPercent) > 75
                                ? 'bg-rose-500'
                                : (isOptimized ? slot.optimizedLoadPercent : slot.currentLoadPercent) > 50
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${isOptimized ? slot.optimizedLoadPercent : slot.currentLoadPercent}%` }}
                          />
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        slot.congestion === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {slot.congestion}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. Counter Workload Balancing Intelligence */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-extrabold text-slate-900 text-lg">AI Counter Workload Balancer</h2>
              <p className="text-xs text-slate-500">Autonomous Counter Overload Routing & Reserve Terminal Recommendations</p>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-amber-50 border border-amber-200/90 text-xs text-amber-950 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-900 font-bold">Counter 1 & 2 Utilization Alert:</strong>
              <p className="mt-0.5 leading-relaxed">
                Counter 1 is operating at 92% capacity with a 14-token queue backlog. Recommended action: Auto-route incoming Wheat farmers to Counter 3 or activate standby Counter 5.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
