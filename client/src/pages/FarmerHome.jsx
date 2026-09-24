import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useQueue } from '../context/QueueContext';
import LiveQueueRadar from '../components/LiveQueueRadar';
import SmartTokenCard from '../components/SmartTokenCard';
import SmartSlotBookingModal from '../components/SmartSlotBookingModal';
import ProcurementTimeline from '../components/ProcurementTimeline';
import PaymentTrackerCard from '../components/PaymentTrackerCard';
import { Bell, MapPin, Sparkles, AlertCircle, PhoneCall, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function FarmerHome() {
  const { t } = useLanguage();
  const { heroToken, notifications } = useQueue();
  const { user } = useAuth();
  const [hasBooked, setHasBooked] = useState(sessionStorage.getItem('demo_slot_booked') === 'true');
  const isCompleted = ['COMPLETED', 'PROCURED', 'PAYMENT_COMPLETED'].includes(heroToken?.status);
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
              {t('helloFarmer')}, {user?.name || 'Ramesh Patil'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">{user?.village || 'Khed Shivapur'}, {user?.district || 'Pune'} District, {user?.state || 'Maharashtra'}</p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Notification Bell */}
            <button
              onClick={() => setShowNotifDrawer(!showNotifDrawer)}
              className="relative p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-white animate-bounce">
                  {Array.from(new Map(notifications.map(n => [n.title + n.body, n])).values()).length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-8">
        {isCompleted ? (
          <section>
            <div className="bg-emerald-50 rounded-3xl border border-emerald-200/90 shadow-sm p-6 sm:p-7 text-emerald-900">
              <div className="flex items-center justify-between pb-4 border-b border-emerald-200/60">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-xl tracking-tight">PROCUREMENT COMPLETED</h2>
                    <p className="text-xs text-emerald-700/80 font-medium">Digital Receipt & Summary</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">{t('token')}</div>
                  <div className="text-xl sm:text-2xl font-black tracking-tight">{heroToken?.tokenNumber || 'N/A'}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/60 p-4 rounded-2xl border border-emerald-100">
                  <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Crop</span>
                  <p className="text-lg font-bold mt-1">{heroToken?.cropType || 'N/A'}</p>
                </div>
                <div className="bg-white/60 p-4 rounded-2xl border border-emerald-100">
                  <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Net Weight</span>
                  <p className="text-lg font-bold mt-1">{heroToken?.qualityDetails?.netWeightKg || 'N/A'} kg</p>
                </div>
                <div className="bg-white/60 p-4 rounded-2xl border border-emerald-100">
                  <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Quality Grade</span>
                  <p className="text-lg font-bold mt-1 flex items-center gap-2">
                    {heroToken?.qualityDetails?.grade || 'N/A'}
                    {heroToken?.qualityDetails?.moisturePercent && (
                      <span className="text-xs font-medium px-2 py-0.5 bg-emerald-100 rounded-lg">{heroToken.qualityDetails.moisturePercent}% Moisture</span>
                    )}
                  </p>
                </div>
                <div className="bg-white/60 p-4 rounded-2xl border border-emerald-100">
                  <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Procurement Rate</span>
                  <p className="text-lg font-bold mt-1">&#8377;{heroToken?.paymentDetails?.ratePerQuintal || 'N/A'}/q</p>
                </div>
              </div>

              <div className="mt-4 bg-white/60 p-4 rounded-2xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Estimated Amount</span>
                  <p className="text-2xl font-black mt-1 text-emerald-600">
                    &#8377;{heroToken?.paymentDetails?.estimatedAmountInr ? heroToken.paymentDetails.estimatedAmountInr.toLocaleString('en-IN') : 'N/A'}
                  </p>
                </div>
                <div className="text-right flex flex-col items-end justify-center">
                  <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Completion Time</span>
                  <p className="text-sm font-bold mt-1 text-emerald-700">
                    {heroToken?.completedAt ? new Date(heroToken.completedAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* 1. Visually Dominant LIVE QUEUE RADAR (The core of AgriFlow) */}
            <section>
              <LiveQueueRadar />
            </section>

            {/* 2. Farmer Smart Pass */}
            <section>
              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-800 mb-3 ml-2 uppercase tracking-wide">Book a Smart Slot</h3>
                <button
                  onClick={() => setIsSlotModalOpen(true)}
                  className="w-full bg-agri-700 hover:bg-agri-800 text-white font-bold text-sm py-4 px-6 rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>{t('smartSlotBooking')}</span>
                </button>
              </div>
              <SmartTokenCard />
            </section>
          </>
        )}

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
          <div className="bg-white w-full max-w-md h-full p-6 shadow-2xl overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center">
                Mandi Notifications
                {notifications.length > 0 && (
                  <span className="ml-2 bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {Array.from(new Map(notifications.map(n => [n.title + n.body, n])).values()).length} New
                  </span>
                )}
              </h3>
              <button onClick={() => setShowNotifDrawer(false)} className="text-sm font-bold text-slate-400 hover:text-slate-700">
                Close
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {Array.from(new Map(notifications.map(n => [n.title + n.body, n])).values()).reverse().map((n) => (
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

