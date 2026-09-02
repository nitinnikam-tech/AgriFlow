import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useQueue } from '../context/QueueContext';
import { useLanguage } from '../context/LanguageContext';
import { QrCode, MapPin, CheckCircle2, Shield, Download, Smartphone, Share2 } from 'lucide-react';

export default function SmartTokenCard({ onOpenSlotBooking }) {
  const { heroToken } = useQueue();
  const { t } = useLanguage();
  const [showQrModal, setShowQrModal] = useState(false);

  const qrData = heroToken?.qrCodeData || JSON.stringify({ token: 'A-127', centre: 'PC-PUNE-01', farmer: 'FMR-1002' });

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 flex flex-col justify-between hover:shadow-md transition-shadow">
      {/* Top Details & Pass Header */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-agri-100 text-agri-700 flex items-center justify-center font-bold text-sm">
              🎫
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Farmer Smart Pass</h3>
              <p className="text-xs text-slate-500">DoCA Procurement Token</p>
            </div>
          </div>
          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
            {heroToken?.status || 'WAITING'}
          </span>
        </div>

        {/* Big Token Number Display */}
        <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('token')} ID</span>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {heroToken?.tokenNumber || 'A-127'}
            </div>
            <p className="text-xs text-slate-600 mt-0.5">{heroToken?.farmerName || 'Ramesh Patil'} • {heroToken?.farmerPhone || '9876543210'}</p>
          </div>

          {/* QR Thumbnail */}
          <div
            onClick={() => setShowQrModal(true)}
            className="cursor-pointer bg-white p-2 rounded-xl border border-slate-200 shadow-xs hover:scale-105 transition-transform flex flex-col items-center group"
          >
            <QRCodeSVG value={qrData} size={64} level="M" />
            <span className="text-[9px] font-bold text-agri-700 mt-1 flex items-center space-x-0.5">
              <QrCode className="w-2.5 h-2.5 mr-0.5" /> Tap QR
            </span>
          </div>
        </div>

        {/* Key Metadata Fields */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-medium">{t('crop')} & Quantity</span>
            <p className="font-bold text-slate-800 mt-0.5">Wheat (गेहूं) • 520 kg</p>
            <span className="text-[10px] text-slate-500">~11 standard bags</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-medium">{t('slotWindow')}</span>
            <p className="font-bold text-slate-800 mt-0.5">10:30 AM – 11:00 AM</p>
            <span className="text-[10px] text-emerald-600 font-semibold">✓ Smart Recommended</span>
          </div>
        </div>

        {/* Geofence Radar Status */}
        <div className="mt-4 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-emerald-900">{t('verifiedGeofence')}</span>
              <p className="text-[11px] text-emerald-700">Distance: 420m from Pune APMC Mandi yard</p>
            </div>
          </div>
          <span className="bg-emerald-200 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
            ELIGIBLE
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={onOpenSlotBooking}
          className="flex-1 bg-agri-700 hover:bg-agri-800 text-white font-semibold text-xs py-2.5 px-3 rounded-xl transition-colors shadow-xs flex items-center justify-center space-x-1.5"
        >
          <span>{t('smartSlotBooking')}</span>
        </button>

        <button
          onClick={() => setShowQrModal(true)}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 px-3 rounded-xl transition-colors flex items-center space-x-1"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Pass</span>
        </button>
      </div>

      {/* Large QR Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-agri-100 text-agri-700 flex items-center justify-center mx-auto mb-3 text-xl">
              🌾
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Mandi Gate QR Check-In</h3>
            <p className="text-xs text-slate-500 mt-1">Show this QR code at the Pune APMC Gate Scanner</p>

            <div className="my-6 p-6 bg-slate-50 rounded-2xl border border-slate-200 inline-block shadow-inner">
              <QRCodeSVG value={qrData} size={180} level="H" includeMargin />
              <div className="mt-3 text-sm font-black text-slate-900 tracking-wider">
                TOKEN: {heroToken?.tokenNumber || 'A-127'}
              </div>
            </div>

            <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl text-xs font-semibold mb-4 border border-emerald-200">
              ✓ Geofence Verified: 420m inside perimeter
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
