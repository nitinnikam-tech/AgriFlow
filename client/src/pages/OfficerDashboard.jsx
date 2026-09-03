import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { Shield, Play, CheckCircle2, Pause, Plus, QrCode, Sparkles, AlertCircle, RefreshCw, UserCheck, Scale, FileText } from 'lucide-react';
import QrScannerModal from '../components/officer/QrScannerModal';
import AICommandPanel from '../components/officer/AICommandPanel';
import AIExplainabilityCard from '../components/AIExplainabilityCard';

export default function OfficerDashboard() {
  const { queueState, callNext, completeToken, toggleCounter, addCounter, resetDemoState } = useQueue();
  const { t } = useLanguage();
  const [selectedCounter, setSelectedCounter] = useState('CNT-PUN-01');
  const [isQualityModalOpen, setIsQualityModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [tokenToInspect, setTokenToInspect] = useState('A-109');
  const [moisture, setMoisture] = useState(11.8);
  const [weight, setWeight] = useState(520);
  const [grade, setGrade] = useState('A');
  const [remarks, setRemarks] = useState('Complies with Fair Average Quality (FAQ) standards.');

  const counters = queueState?.activeCounters || [
    { id: 'CNT-PUN-01', counterNumber: 1, officerName: 'Sanjay Deshmukh', status: 'PROCESSING', currentToken: 'A-109', currentCrop: 'WHEAT', tokensProcessedToday: 54, avgProcessingTimeMin: 5.4, utilizationPercent: 92 },
    { id: 'CNT-PUN-02', counterNumber: 2, officerName: 'Vandana Kulkarni', status: 'PROCESSING', currentToken: 'A-110', currentCrop: 'SOYBEAN', tokensProcessedToday: 48, avgProcessingTimeMin: 6.1, utilizationPercent: 84 },
    { id: 'CNT-PUN-03', counterNumber: 3, officerName: 'Rajesh Shinde', status: 'PROCESSING', currentToken: 'A-111', currentCrop: 'WHEAT', tokensProcessedToday: 51, avgProcessingTimeMin: 5.2, utilizationPercent: 78 },
    { id: 'CNT-PUN-04', counterNumber: 4, officerName: 'Pooja Gaikwad', status: 'PROCESSING', currentToken: 'A-112', currentCrop: 'CHANA', tokensProcessedToday: 45, avgProcessingTimeMin: 5.9, utilizationPercent: 81 },
    { id: 'CNT-PUN-05', counterNumber: 5, officerName: 'Anil Jadhav', status: 'STANDBY', currentToken: null, currentCrop: null, tokensProcessedToday: 0, avgProcessingTimeMin: 5.5, utilizationPercent: 0 }
  ];

  const handleOpenQualityModal = (tok) => {
    setTokenToInspect(tok || 'A-109');
    setIsQualityModalOpen(true);
  };

  const handleSaveQualityAndComplete = async () => {
    try {
      await api.submitQualityInspection({
        tokenNumber: tokenToInspect,
        netWeightKg: Number(weight),
        moisturePercent: Number(moisture),
        grade,
        remarks
      });
      completeToken(selectedCounter, tokenToInspect);
      setIsQualityModalOpen(false);
    } catch (e) {
      console.error(e);
      completeToken(selectedCounter, tokenToInspect);
      setIsQualityModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Officer Header */}
      <div className="bg-slate-900 text-white py-5 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400 font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Operational Command Desk</span>
                <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-400/30">
                  Counter In-Charge
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Pune Mandi Procurement Desk
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-colors flex items-center space-x-1.5"
            >
              <QrCode className="w-4 h-4" />
              <span>Scan QR</span>
            </button>
            <button
              onClick={addCounter}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-colors flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addCounter')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Command Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AICommandPanel />
          </div>
          <div className="lg:col-span-1">
            <AIExplainabilityCard />
          </div>
        </div>

        {/* Counter Action Desk */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-extrabold text-slate-900 text-lg">Active Counter Workstations</h2>
              <p className="text-xs text-slate-500">Live Counter Assignment & Queue Action Controls</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {queueState?.waitingCount || 43} farmers waiting in queue
            </span>
          </div>

          {/* Counters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {counters.map((c) => {
              const isProcessing = c.status === 'PROCESSING';
              const isStandby = c.status === 'STANDBY' || c.status === 'INACTIVE';
              const isPaused = c.status === 'PAUSED';

              return (
                <div
                  key={c.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isProcessing
                      ? 'border-blue-300 bg-blue-50/40 text-slate-900'
                      : isStandby
                      ? 'border-slate-200 bg-slate-50/60 text-slate-500'
                      : 'border-amber-300 bg-amber-50/50 text-amber-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black uppercase tracking-wider bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        Counter 0{c.counterNumber}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                        isProcessing ? 'bg-emerald-100 text-emerald-800' : isStandby ? 'bg-slate-200 text-slate-700' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {c.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900">{c.officerName}</h3>
                    <p className="text-xs text-slate-500">{c.officerRole || 'Procurement Officer'}</p>

                    {/* Current Token Badge */}
                    <div className="my-4 p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Current Token</span>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-2xl font-black text-blue-700">{c.currentToken || '—'}</span>
                        {c.currentCrop && (
                          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            {c.currentCrop}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                      <div>Processed Today: <strong className="text-slate-800">{c.tokensProcessedToday || 0}</strong></div>
                      <div>Avg Time: <strong className="text-slate-800">{c.avgProcessingTimeMin || 5.8}m</strong></div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 pt-3 border-t border-slate-200/80 flex items-center gap-2">
                    {isProcessing ? (
                      <>
                        <button
                          onClick={() => handleOpenQualityModal(c.currentToken)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition-colors flex items-center justify-center space-x-1"
                        >
                          <Scale className="w-3.5 h-3.5 mr-1" />
                          <span>Complete</span>
                        </button>
                        <button
                          onClick={() => toggleCounter(c.id)}
                          className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition-colors"
                          title="Pause Counter"
                        >
                          <Pause className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => callNext(c.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition-colors flex items-center justify-center space-x-1"
                      >
                        <Play className="w-3.5 h-3.5 mr-1" />
                        <span>Call Next Token</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Live Queue Inspection Table */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-extrabold text-slate-900 text-lg">Next Waiting Farmers in Line</h2>
              <p className="text-xs text-slate-500">Live Telemetry Queue Line (Auto-Updates via WebSockets)</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Live Queue Velocity: {queueState?.queueVelocityPerMin || 0.69} tokens/min
            </span>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Pos</th>
                  <th className="p-3">Token</th>
                  <th className="p-3">Farmer Name</th>
                  <th className="p-3">Crop</th>
                  <th className="p-3">Est. Qty</th>
                  <th className="p-3">Slot Time</th>
                  <th className="p-3">Est. Wait</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(queueState?.waitingTokens || []).map((t, idx) => (
                  <tr key={t.id || idx} className={`hover:bg-slate-50/80 transition-colors ${t.tokenNumber === 'A-127' ? 'bg-amber-50/80 font-semibold text-amber-950' : ''}`}>
                    <td className="p-3 font-bold text-slate-500">#{idx + 1}</td>
                    <td className="p-3 font-extrabold text-slate-900">
                      {t.tokenNumber} {t.tokenNumber === 'A-127' && <span className="ml-1 text-[10px] text-amber-700 font-bold bg-amber-200 px-1.5 py-0.5 rounded">HERO</span>}
                    </td>
                    <td className="p-3">{t.farmerName || 'Farmer'}</td>
                    <td className="p-3 font-semibold">{t.cropType}</td>
                    <td className="p-3">{t.quantityKg || 500} kg</td>
                    <td className="p-3 text-slate-600">{t.slotTimeWindow || '10:30 AM'}</td>
                    <td className="p-3 font-bold text-agri-700">{t.estimatedWaitMin || 18}m</td>
                    <td className="p-3">
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Quality Inspection & Weighing Modal */}
      {isQualityModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Quality Inspection & Weighing</h3>
                <p className="text-xs text-slate-500">Token: <strong className="text-blue-700">{tokenToInspect}</strong> • Farmer Wheat Batch</p>
              </div>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Net Weight (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Moisture (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={moisture}
                    onChange={(e) => setMoisture(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                  />
                  <span className="text-[10px] text-slate-400">DoCA FAQ Limit: 12.0%</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quality Grade</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                >
                  <option value="A">Grade A (Premium Fair Average Quality)</option>
                  <option value="B">Grade B (Standard Mandi Quality)</option>
                  <option value="C">Grade C (Conditional Approval)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Inspection Remarks</label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900">
                <span className="font-bold">Calculated Payout: ₹{Math.round(weight * 24).toLocaleString('en-IN')}</span>
                <p className="text-[11px] text-emerald-700 mt-0.5">Automated DBT transfer trigger to linked SBI A/C ending in 7712.</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
              <button
                onClick={() => setIsQualityModalOpen(false)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveQualityAndComplete}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Approve & Complete Procurement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />
    </div>
  );
}
