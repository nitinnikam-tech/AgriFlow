import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { useLanguage } from '../context/LanguageContext';
import LiveQueueRadar from '../components/LiveQueueRadar';
import SmartTokenCard from '../components/SmartTokenCard';
import { Award, Zap, Sparkles, CheckCircle2, ArrowRight, Play, RefreshCw, Plus, AlertTriangle, ShieldCheck, Scale } from 'lucide-react';

export default function HeroDemoScenario() {
  const {
    demoStep,
    setDemoStep,
    completeToken,
    triggerCongestionSpike,
    applySlotOptimization,
    addCounter,
    resetDemoState,
    queueState,
    heroToken,
    farmerETA
  } = useQueue();
  const { t } = useLanguage();

  const steps = [
    {
      id: 1,
      title: 'Step 1: The Initial Baseline',
      subtitle: '247 farmers today • 43 waiting • 4 active counters • Hero Token A-127 (18 ahead, ETA 32m)',
      explanation: 'Judges see the farmer waiting comfortably at home. The app tells them exactly how many people are ahead and recommends arriving at 10:42 AM instead of standing in the hot sun.',
      action: () => { setDemoStep(1); resetDemoState(); },
      btnText: '1. Load Baseline State',
      btnColor: 'bg-slate-800'
    },
    {
      id: 2,
      title: 'Step 2: Real-Time WebSocket Clearance',
      subtitle: 'Officer Sanjay completes Token A-109 -> Farmer A-127 instantly updates (17 ahead, ETA 29m)',
      explanation: 'Without refreshing the page, WebSockets (Socket.IO) broadcast the completion. The farmer’s queue position drops from 18 to 17, and ETA drops from 32m to 29m.',
      action: () => { setDemoStep(2); completeToken('CNT-PUN-01', 'A-109'); },
      btnText: '2. Complete Token A-109',
      btnColor: 'bg-blue-600'
    },
    {
      id: 3,
      title: 'Step 3: Sudden Mandi Congestion Spike',
      subtitle: 'Surge of 30+ arrivals -> AI predicts HIGH congestion -> ETA surges to 48 mins',
      explanation: 'Simulates a sudden rush at the Mandi gates. The AI detects the queue velocity drop and flags HIGH congestion, alerting both the farmer and mandi officials.',
      action: () => { setDemoStep(3); triggerCongestionSpike(); },
      btnText: '3. Simulate Crowd Spike ⚠️',
      btnColor: 'bg-rose-600'
    },
    {
      id: 4,
      title: 'Step 4: Dynamic Slot Optimization',
      subtitle: 'System automatically rebalances slot capacities (86% peak load flattened to 61%)',
      explanation: 'AgriFlow does not just warn about crowds—it autonomously proposes moving 8 upcoming farmers to later underutilized slots, flattening the congestion curve.',
      action: () => { setDemoStep(4); applySlotOptimization(); },
      btnText: '4. Apply Slot Optimization ✨',
      btnColor: 'bg-amber-600'
    },
    {
      id: 5,
      title: 'Step 5: Counter 5 Activated (The Main Wow Moment)',
      subtitle: 'Official enables Counter 5 -> AI recalculates ETA to 19m -> Farmer receives arrival alert (10:38 AM)',
      explanation: 'Official opens reserve Counter 5. The AI immediately recalculates queue velocity. The farmer’s wait drops to 19 mins and their recommended arrival becomes 10:38 AM with an audio chime!',
      action: () => { setDemoStep(5); addCounter(); },
      btnText: '5. Activate Counter 5 (+1)',
      btnColor: 'bg-emerald-600'
    }
  ];

  const currentStepInfo = steps.find(s => s.id === demoStep) || steps[0];

  return (
    <div className="min-h-screen pb-32 bg-slate-950 text-slate-100">
      {/* Top Hero Ribbon */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 py-4 px-4 sm:px-6 lg:px-8 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <Award className="w-7 h-7 font-black" />
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                SIH 2026 HERO DEMONSTRATION WALKTHROUGH
              </h1>
              <p className="text-xs font-bold text-slate-900">
                Department of Consumer Affairs (DoCA) • Problem Statement PS 26032
              </p>
            </div>
          </div>

          <button
            onClick={() => { setDemoStep(1); resetDemoState(); }}
            className="bg-slate-950 text-white font-extrabold text-xs py-2 px-4 rounded-xl hover:bg-slate-900 transition-colors flex items-center space-x-1.5 shadow-md"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-8">
        {/* Step Progression Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {steps.map((s) => (
            <button
              key={s.id}
              onClick={s.action}
              className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                demoStep === s.id
                  ? 'bg-amber-500 text-slate-950 border-amber-300 font-extrabold shadow-lg scale-[1.02]'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800 font-medium'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span>Step {s.id}</span>
                {demoStep === s.id && <CheckCircle2 className="w-4 h-4 text-slate-950" />}
              </div>
              <span className="text-xs leading-snug">{s.title.replace(`Step ${s.id}: `, '')}</span>
            </button>
          ))}
        </div>

        {/* Current Active Scenario Explanation Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl relative overflow-hidden">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 shrink-0">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                ACTIVE PRESENTATION STAGE
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">{currentStepInfo.title}</h2>
              <p className="text-sm text-amber-200 font-semibold">{currentStepInfo.subtitle}</p>
              <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
                <strong className="text-white">What to tell judges:</strong> {currentStepInfo.explanation}
              </p>
            </div>
          </div>
        </div>

        {/* Live Synchronized Screens (Farmer View + Telemetry) */}
        <div className="space-y-6">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 flex items-center">
            <Zap className="w-4 h-4 text-amber-400 mr-2" /> Live Synchronized Telemetry Display
          </h3>

          <LiveQueueRadar />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SmartTokenCard onOpenSlotBooking={() => {}} />

            {/* Officer Terminal Quick Actions */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <h3 className="font-extrabold text-white text-base">Officer Command Triggers</h3>
                  <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-400/30">
                    Counter 1 Active
                  </span>
                </div>

                <p className="text-xs text-slate-400 my-4 leading-relaxed">
                  Trigger actions below to see the Farmer Radar and Queue metrics update simultaneously without reloading.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => completeToken('CNT-PUN-01', 'A-109')}
                    className="p-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete Token A-109</span>
                  </button>

                  <button
                    onClick={addCounter}
                    className="p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Activate Counter 5</span>
                  </button>

                  <button
                    onClick={triggerCongestionSpike}
                    className="p-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Simulate Rush Spike</span>
                  </button>

                  <button
                    onClick={applySlotOptimization}
                    className="p-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Rebalance Slots</span>
                  </button>
                </div>
              </div>

              <div className="mt-5 p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-400 flex items-center justify-between">
                <span>Socket.IO Latency: <strong className="text-emerald-400 font-bold">&lt; 15ms</strong></span>
                <span className="text-amber-400 font-bold">100% Real-Time</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
