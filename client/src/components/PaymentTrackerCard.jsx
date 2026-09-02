import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { IndianRupee, Landmark, CheckCircle, Clock, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function PaymentTrackerCard() {
  const { heroToken } = useQueue();
  const { t } = useLanguage();
  const [isCredited, setIsCredited] = useState(false);
  const [loading, setLoading] = useState(false);

  const amount = heroToken?.paymentDetails?.estimatedAmountInr || 12480;
  const isPaid = isCredited || heroToken?.paymentDetails?.status === 'COMPLETED';

  const handleSimulateCredit = async () => {
    setLoading(true);
    try {
      await api.simulatePaymentCredit('A-127');
      setIsCredited(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
              <IndianRupee className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{t('paymentTracker')}</h3>
              <p className="text-xs text-slate-500">DoCA Direct Benefit Transfer (DBT)</p>
            </div>
          </div>
          <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
            isPaid ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200'
          }`}>
            {isPaid ? 'CREDITED' : 'PROCESSING'}
          </span>
        </div>

        {/* Payout Display Box */}
        <div className="my-5 p-4 rounded-2xl bg-gradient-to-br from-emerald-900 to-slate-900 text-white shadow-md">
          <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">Approved Procurement Payout</span>
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1 flex items-baseline">
            <span>₹{amount.toLocaleString('en-IN')}</span>
            <span className="text-xs text-emerald-300 font-normal ml-2">(520 kg @ MSP ₹2,400/q)</span>
          </div>
          <div className="mt-3 text-xs text-slate-300 flex items-center justify-between border-t border-slate-700/60 pt-2">
            <span>Ref: AGF-PFMS-982147</span>
            <span className="text-emerald-400 font-semibold flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> PFMS Ready
            </span>
          </div>
        </div>

        {/* Bank Details */}
        <div className="space-y-2 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Landmark className="w-4 h-4 text-slate-500" />
              <div>
                <span className="font-bold text-slate-800">State Bank of India</span>
                <p className="text-[10px] text-slate-400">A/C: •••••••••••7712 • IFSC: SBIN0001234</p>
              </div>
            </div>
            <span className="text-emerald-700 font-bold">Aadhaar Linked</span>
          </div>
        </div>
      </div>

      {/* Action to simulate credit */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <button
          onClick={handleSimulateCredit}
          disabled={isPaid || loading}
          className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-1.5 ${
            isPaid
              ? 'bg-emerald-100 text-emerald-800 cursor-default'
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
        >
          {isPaid ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-600 mr-1" />
              <span>₹12,480 Credited to Farmer Account</span>
            </>
          ) : (
            <>
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span>Simulate DBT Payout Credit</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
