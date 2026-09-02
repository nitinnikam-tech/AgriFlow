import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useQueue } from '../context/QueueContext';
import LiveQueueRadar from '../components/LiveQueueRadar';
import SmartTokenCard from '../components/SmartTokenCard';
import AIExplainabilityCard from '../components/AIExplainabilityCard';
import SmartSlotBookingModal from '../components/SmartSlotBookingModal';
import ProcurementTimeline from '../components/ProcurementTimeline';
import PaymentTrackerCard from '../components/PaymentTrackerCard';
import { Bell, MapPin, Sparkles, AlertCircle, PhoneCall, HelpCircle } from 'lucide-react';

export default function FarmerHome() {
  const { t } = useLanguage();
  const { notifications } = useQueue();
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);

  return (
    <div className="min-h-screen pb-32">
      {/* Top Banner Greeting */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-agri-700 uppercase tracking-wider">DoCA Smart Mandi Portal</span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              {t('helloFarmer')}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Ramesh Patil • Haveli, Pune District</p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Notification Bell */}
            <button
              onClick={() => setShowNotifDrawer(!showNotifDrawer)}
              className="relative p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-8">
        {/* 1. Visually Dominant LIVE QUEUE RADAR (The core of AgriFlow) */}
        <section>
          <LiveQueueRadar />
        </section>

        {/* 2. Farmer Smart Pass & AI Wait-Time Factor Explainability */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SmartTokenCard onOpenSlotBooking={() => setIsSlotModalOpen(true)} />
          <AIExplainabilityCard />
        </section>

        {/* 3. Procurement Lifecycle Timeline */}
        <section>
          <ProcurementTimeline />
        </section>

        {/* 4. Payment Payout & Direct Benefit Transfer Tracker */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PaymentTrackerCard />

          {/* Help & Mandi Support Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Mandi Assistance & Helpdesk</h3>
                  <p className="text-xs text-slate-500">DoCA Farmer Toll-Free Helpline</p>
                </div>
              </div>

              <div className="my-5 space-y-3 text-xs text-slate-600 leading-relaxed">
                <p>
                  <strong>Toll-Free Support:</strong> 1800-180-1551 (Kisan Call Centre 24x7)
                </p>
                <p>
                  <strong>Pune Centre In-charge:</strong> Sanjay Deshmukh (+91 94230 00001)
                </p>
                <p>
                  <strong>Fair Average Quality (FAQ) Norms:</strong> Ensure grain moisture is below 12% for immediate clearance without deductions.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs text-slate-500 flex items-center justify-between">
              <span>Mandi Timings: 08:00 AM – 06:00 PM</span>
              <span className="font-bold text-agri-700">Counter 1-4 Active</span>
            </div>
          </div>
        </section>
      </main>

      {/* Smart Slot Booking Modal */}
      <SmartSlotBookingModal
        isOpen={isSlotModalOpen}
        onClose={() => setIsSlotModalOpen(false)}
      />

      {/* Notifications Drawer */}
      {showNotifDrawer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full p-6 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="font-extrabold text-slate-900 text-lg">Mandi Notifications</h3>
              <button onClick={() => setShowNotifDrawer(false)} className="text-sm font-bold text-slate-400 hover:text-slate-700">
                Close
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {notifications.map((n) => (
                <div key={n.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{n.title}</span>
                    <span className="text-[10px] text-slate-400">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
