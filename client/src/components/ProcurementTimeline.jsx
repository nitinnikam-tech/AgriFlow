import React from 'react';
import { useQueue } from '../context/QueueContext';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle2, Clock, Circle, ArrowRight } from 'lucide-react';

export default function ProcurementTimeline() {
  const { heroToken } = useQueue();
  const { t } = useLanguage();

  const isProcessingOrLater = ['PROCESSING', 'PROCURED', 'COMPLETED', 'PAYMENT_COMPLETED'].includes(heroToken?.status);
  const isProcuredOrLater = ['PROCURED', 'COMPLETED', 'PAYMENT_COMPLETED'].includes(heroToken?.status);
  const isCompletedOrLater = ['COMPLETED', 'PAYMENT_COMPLETED'].includes(heroToken?.status);

  const stages = [
    { key: 'ARRIVAL', label: 'Gate Arrival', time: '10:15 AM', isDone: true },
    { key: 'QC', label: 'Quality Check (QC)', time: 'Pending', isDone: isProcessingOrLater },
    { key: 'WEIGHING', label: 'Weighing', time: 'Pending', isDone: isProcessingOrLater },
    { key: 'STORAGE', label: 'Storage & Bagging', time: 'Pending', isDone: isProcuredOrLater },
    { key: 'INVOICE', label: 'Invoice Generated', time: 'Pending', isDone: isCompletedOrLater },
    { key: 'DBT_PAYMENT', label: 'DBT Payment', time: 'Pending', isDone: heroToken?.paymentDetails?.status === 'COMPLETED' },
    { key: 'COMPLETED', label: 'Completed', time: 'Pending', isDone: heroToken?.paymentDetails?.status === 'COMPLETED' }
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-slate-900 text-base">{t('procurementStatus')}</h3>
          <p className="text-xs text-slate-500">End-to-End Transparent Lifecycle Timeline</p>
        </div>
        <span className="text-xs font-bold text-agri-700 bg-agri-50 border border-agri-200 px-3 py-1 rounded-full">
          Token A-127
        </span>
      </div>

      <div className="mt-6 relative">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {stages.map((stage, idx) => (
            <div
              key={stage.key}
              className={`p-3 rounded-2xl border flex flex-col justify-between transition-all ${
                stage.isDone
                  ? 'border-agri-300 bg-agri-50/60 text-agri-950'
                  : 'border-slate-200 bg-slate-50/50 text-slate-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400">0{idx + 1}</span>
                  {stage.isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-agri-600" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300" />
                  )}
                </div>
                <h4 className="text-xs font-bold leading-tight mb-1 text-slate-800">{stage.label}</h4>
              </div>
              <span className="text-[10px] font-medium text-slate-500 mt-2">{stage.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
