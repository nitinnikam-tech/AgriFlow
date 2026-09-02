import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useQueue } from '../context/QueueContext';
import { Calendar, CheckCircle2, Clock, Zap, X, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function SmartSlotBookingModal({ isOpen, onClose }) {
  const { t } = useLanguage();
  const { setHeroToken } = useQueue();
  const [selectedSlot, setSelectedSlot] = useState('SLOT-1030');
  const [selectedCrop, setSelectedCrop] = useState('WHEAT');
  const [quantity, setQuantity] = useState(520);
  const [isBooked, setIsBooked] = useState(false);

  if (!isOpen) return null;

  const slots = [
    { id: 'SLOT-0900', time: '09:00 AM – 09:30 AM', congestion: 'HIGH', color: 'border-rose-300 bg-rose-50/50 text-rose-900', badge: 'bg-rose-100 text-rose-800' },
    { id: 'SLOT-0930', time: '09:30 AM – 10:00 AM', congestion: 'HIGH', color: 'border-rose-300 bg-rose-50/50 text-rose-900', badge: 'bg-rose-100 text-rose-800' },
    { id: 'SLOT-1000', time: '10:00 AM – 10:30 AM', congestion: 'MEDIUM', color: 'border-amber-300 bg-amber-50/50 text-amber-900', badge: 'bg-amber-100 text-amber-800' },
    { id: 'SLOT-1030', time: '10:30 AM – 11:00 AM', congestion: 'LOW', isRecommended: true, color: 'border-emerald-500 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-500', badge: 'bg-emerald-200 text-emerald-900 font-extrabold' },
    { id: 'SLOT-1100', time: '11:00 AM – 11:30 AM', congestion: 'LOW', isRecommended: true, color: 'border-emerald-400 bg-emerald-50/50 text-emerald-950', badge: 'bg-emerald-100 text-emerald-800 font-bold' },
    { id: 'SLOT-1130', time: '11:30 AM – 12:00 PM', congestion: 'LOW', color: 'border-emerald-300 bg-emerald-50/40 text-emerald-950', badge: 'bg-emerald-100 text-emerald-800' },
    { id: 'SLOT-1200', time: '12:00 PM – 12:30 PM', congestion: 'MEDIUM', color: 'border-amber-300 bg-amber-50/50 text-amber-900', badge: 'bg-amber-100 text-amber-800' }
  ];

  const handleConfirmBooking = () => {
    setIsBooked(true);
    setTimeout(() => {
      setIsBooked(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-agri-100 text-agri-700 flex items-center justify-center font-bold text-lg">
              🌱
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">{t('smartSlotBooking')}</h3>
              <p className="text-xs text-slate-500">AI-Optimized Mandi Arrival Scheduling</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Crop Selection */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t('crop')} Type</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
            >
              <option value="WHEAT">Wheat (गेहूं / गहू) • MSP ₹2,275/q</option>
              <option value="SOYBEAN">Soybean (सोयाबीन) • MSP ₹4,600/q</option>
              <option value="CHANA">Gram / Chana (चना) • MSP ₹5,440/q</option>
              <option value="PADDY">Paddy (धान / भात) • MSP ₹2,183/q</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t('quantity')} (kg)</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
              placeholder="e.g. 520"
            />
          </div>
        </div>

        {/* AI Recommended Slot Banner */}
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-agri-950 text-white shadow-md border border-emerald-500/40">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-500/30 px-2 py-0.5 rounded-full border border-emerald-400/40">
              ⚡ {t('recommendedSlot')}
            </span>
            <span className="text-xs text-emerald-300 font-bold">10:30 AM – 11:00 AM</span>
          </div>
          <div className="mt-2 text-xs text-emerald-100/90 space-y-1">
            <p className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-1.5 shrink-0" /> Low predicted congestion (only 16 bookings)</p>
            <p className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-1.5 shrink-0" /> 4 active counters with short wait times</p>
            <p className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-1.5 shrink-0" /> Shorter expected queue turnaround (~18 mins)</p>
          </div>
        </div>

        {/* Slot Selection List */}
        <div className="mt-5">
          <h4 className="text-xs font-bold text-slate-700 mb-2.5 uppercase tracking-wider">{t('alternativeSlots')}</h4>
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {slots.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedSlot(s.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedSlot === s.id ? s.color : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <div>
                    <span className="text-xs font-bold text-slate-900">{s.time}</span>
                    {s.isRecommended && (
                      <span className="ml-2 text-[10px] font-bold text-emerald-700">★ Best Turnaround</span>
                    )}
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${s.badge}`}>
                  {s.congestion} CONGESTION
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmBooking}
            disabled={isBooked}
            className="px-6 py-2.5 bg-agri-700 hover:bg-agri-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center space-x-1.5"
          >
            {isBooked ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300 animate-spin" />
                <span>Confirming Smart Slot...</span>
              </>
            ) : (
              <>
                <span>Confirm Token A-127</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
