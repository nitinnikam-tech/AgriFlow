import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, Camera, Keyboard } from 'lucide-react';

export default function QrScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [manualToken, setManualToken] = useState('');
  const [mode, setMode] = useState('camera'); // 'camera' or 'manual'

  useEffect(() => {
    if (!isOpen || mode !== 'camera') return;
    
    // Slight delay to ensure DOM element is ready
    const timer = setTimeout(() => {
      const scanner = new Html5QrcodeScanner("reader", {
        qrbox: { width: 250, height: 250 },
        fps: 5,
      }, false);

      scanner.render((decodedText) => {
        scanner.clear();
        onScanSuccess(decodedText);
      }, (error) => {
        // Ignore continuous scan errors
      });

      return () => {
        scanner.clear().catch(() => {});
      };
    }, 100);
    return () => clearTimeout(timer);
  }, [isOpen, mode, onScanSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center">
            {mode === 'camera' ? <Camera className="w-5 h-5 mr-2 text-emerald-600" /> : <Keyboard className="w-5 h-5 mr-2 text-emerald-600" />}
            {mode === 'camera' ? 'Scan Farmer QR' : 'Manual / Demo Check-In'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 bg-white rounded-full border border-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex mb-4 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setMode('camera')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${mode === 'camera' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
            >
              Camera Scanner
            </button>
            <button
              onClick={() => setMode('manual')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${mode === 'manual' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
            >
              Manual Entry
            </button>
          </div>

          {mode === 'camera' ? (
            <div className="bg-slate-50 rounded-2xl p-2 border border-slate-200">
              <div id="reader" className="w-full"></div>
              <p className="text-xs text-center text-slate-500 mt-3">
                Point camera at the farmer's Smart Token QR code.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Enter Token Number (e.g. A-127)</label>
                <input
                  type="text"
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 font-mono text-slate-700 focus:border-emerald-500 focus:outline-none"
                  placeholder="A-127"
                />
              </div>
              <button
                onClick={() => onScanSuccess(JSON.stringify({ token: manualToken }))}
                disabled={!manualToken}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Confirm Check-In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
