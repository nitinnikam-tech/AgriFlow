import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Activity, TrendingUp, Users, Clock, AlertTriangle, CheckCircle2, Shield, Download, Check, BrainCircuit } from 'lucide-react';

export default function DistrictAnalytics() {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [modelHealth, setModelHealth] = useState(null);

  useEffect(() => {
    api.getAnalytics('PC-PUNE-01').then(res => {
      if (res.success) setData(res);
    }).catch(console.error);

    api.getModelHealth().then(res => {
      if (res && res.data) setModelHealth(res.data);
    }).catch(e => console.error(e));
  }, []);

  const hourlyArrivals = data?.hourlyArrivals || [
    { hour: '08:00', arrivals: 22, processed: 18, avgWaitMin: 12 },
    { hour: '09:00', arrivals: 48, processed: 38, avgWaitMin: 28 },
    { hour: '10:00', arrivals: 56, processed: 42, avgWaitMin: 34 },
    { hour: '11:00', arrivals: 30, processed: 36, avgWaitMin: 22 },
    { hour: '12:00', arrivals: 24, processed: 28, avgWaitMin: 16 },
    { hour: '13:00', arrivals: 32, processed: 30, avgWaitMin: 20 },
    { hour: '14:00', arrivals: 44, processed: 38, avgWaitMin: 26 },
    { hour: '15:00', arrivals: 28, processed: 32, avgWaitMin: 18 },
    { hour: '16:00', arrivals: 15, processed: 20, avgWaitMin: 10 }
  ];

  const cropDistribution = data?.cropDistribution || [
    { name: 'Wheat (गेहूं)', value: 45, color: '#F59E0B' },
    { name: 'Soybean (सोयाबीन)', value: 28, color: '#10B981' },
    { name: 'Gram/Chana (चना)', value: 18, color: '#3B82F6' },
    { name: 'Maize (मक्का)', value: 9, color: '#8B5CF6' }
  ];

  const counterEfficiency = data?.counterEfficiency || [
    { counter: 'Counter 1', tokens: 54, avgMinutes: 5.4, utilization: 92 },
    { counter: 'Counter 2', tokens: 48, avgMinutes: 6.1, utilization: 84 },
    { counter: 'Counter 3', tokens: 51, avgMinutes: 5.2, utilization: 78 },
    { counter: 'Counter 4', tokens: 45, avgMinutes: 5.9, utilization: 81 }
  ];

  const anomalies = data?.anomalies || [
    {
      id: 'ANOM-01',
      title: 'Counter 2 Slowdown Detected',
      description: 'Processing time 6.1m (+17% above baseline due to Soybean manual grading).',
      severity: 'MEDIUM'
    }
  ];

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="bg-amber-950 text-white py-5 px-4 sm:px-6 lg:px-8 shadow-md border-b border-amber-800/60">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/30 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">District / State Authority Command</span>
                <span className="bg-amber-500/20 text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                  DoCA Intelligence
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Pune District Mandi Intelligence & Anomaly Hub
              </h1>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-8">
        
        {/* Model Health Dashboard */}
        {modelHealth && (
          <section className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl border border-indigo-100 shadow-sm p-6 sm:p-7">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-indigo-200/50 pb-4">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-sm">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-extrabold text-indigo-900 text-lg">AI Model Health & Transparency</h2>
                  <p className="text-xs text-indigo-600 font-medium tracking-wide">Live Status: {modelHealth.status}</p>
                </div>
              </div>
              <div className="bg-white/80 border border-indigo-100 px-3 py-1.5 rounded-lg">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Model Checksum / Validation</p>
                <p className="text-xs font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                  <Check className="w-3 h-3 text-emerald-600" />
                  {modelHealth.disclaimer}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
              <div className="bg-white rounded-2xl p-4 border border-indigo-50 shadow-sm">
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Architecture</p>
                <p className="text-lg font-black text-indigo-900">{modelHealth.model}</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-indigo-50 shadow-sm">
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Mean Absolute Error (MAE)</p>
                <p className="text-lg font-black text-emerald-700">{modelHealth.mae}</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-indigo-50 shadow-sm">
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">R² Score</p>
                <p className="text-lg font-black text-emerald-700">{modelHealth.r2}</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-indigo-50 shadow-sm">
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Training Records</p>
                <p className="text-lg font-black text-indigo-900">{modelHealth.trainingRecords.toLocaleString()}</p>
              </div>
            </div>
          </section>
        )}

        {/* KPI Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Farmers Processed Today</span>
            <div className="text-3xl font-black text-slate-900 mt-1">247</div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-2">↑ 14% vs yesterday</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Waiting Time</span>
            <div className="text-3xl font-black text-agri-700 mt-1">21 min</div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-2">↓ Reduced from 85m baseline</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Quantity Procured</span>
            <div className="text-3xl font-black text-blue-700 mt-1">102.9 MT</div>
            <p className="text-[11px] text-slate-500 font-medium mt-2">Wheat, Soybean & Chana</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">DBT Disbursed</span>
            <div className="text-3xl font-black text-emerald-700 mt-1">₹24.7 Lakh</div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-2">100% PFMS direct credit</p>
          </div>
        </section>

        {/* Hourly Arrivals vs Queue Velocity Chart */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-extrabold text-slate-900 text-lg">Hourly Arrival Rate vs Processing Speed</h2>
              <p className="text-xs text-slate-500">Mandi Inflow vs Counter Clearance Curve</p>
            </div>
          </div>

          <div className="h-72 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyArrivals}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="arrivals" name="Arrivals (Farmers)" stroke="#EF4444" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="processed" name="Cleared (Farmers)" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Anomaly Detection & Crop Share */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Anomaly Feed */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-base">Operational Anomaly Detections</h3>
                <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  Live Engine
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {anomalies.map((a) => (
                  <div key={a.id} className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950">
                    <div className="flex items-center justify-between mb-1">
                      <strong className="font-bold text-amber-900 flex items-center">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mr-1.5" />
                        {a.title}
                      </strong>
                      <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                        {a.severity}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed mt-1">{a.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl text-xs text-slate-500 mt-4 border border-slate-200/70">
              Autonomous alerting prevents queue pile-ups before physical bottlenecks manifest.
            </div>
          </div>

          {/* Crop Share Chart */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">Procured Crop Distribution</h3>
              <span className="text-xs text-slate-400">Current Season</span>
            </div>

            <div className="h-60 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={cropDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                    {cropDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
