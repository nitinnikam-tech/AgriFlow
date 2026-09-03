import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, Camera, Keyboard, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export default function QrScannerModal({ isOpen, onClose }) {
  const [manualToken, setManualToken] = useState('');
  const [mode, setMode] = useState('camera'); // 'camera' or 'manual'
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [resultData, setResultData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setResultData(null);
      setErrorMessage('');
      setManualToken('');
    }
  }, [isOpen]);

  const handleScan = async (decodedText) => {
    setStatus('loading');
    try {
      // In manual mode, we might just pass a string or JSON. Let's ensure it's a string.
      const payload = typeof decodedText === 'string' ? decodedText : JSON.stringify(decodedText);
      const res = await api.verifyQrCheckIn(payload);
      
      if (res && res.valid) {
        setResultData(res);
        setStatus('success');
        
        // Auto-close after 3 seconds on success
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        setErrorMessage(res?.error || 'Check-in failed. Please verify token.');
        setStatus('error');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Unable to verify QR token at this time.');
      setStatus('error');
    }
  };

  useEffect(() => {
    if (!isOpen || mode !== 'camera' || status !== 'idle') return;
    
    // Slight delay to ensure DOM element is ready
    const timer = setTimeout(() => {
      const scanner = new Html5QrcodeScanner("reader", {
        qrbox: { width: 250, height: 250 },
        fps: 5,
      }, false);

      scanner.render((decodedText) => {
        scanner.clear();
        handleScan(decodedText);
      }, (error) => {
        // Ignore continuous scan errors
      });

      return () => {
        scanner.clear().catch(() => {});
      };
    }, 100);
    return () => clearTimeout(timer);
  }, [isOpen, mode, status]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center">
            {mode === 'camera' ? <Camera className="w-5 h-5 mr-2 text-emerald-600" /> : <Keyboard className="w-5 h-5 mr-2 text-emerald-600" />}
            {status === 'success' ? 'Check-In Complete' : 'Farmer Check-In'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 bg-white rounded-full border border-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {status === 'idle' && (
            <>
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
                    onClick={() => handleScan(JSON.stringify({ token: manualToken }))}
                    disabled={!manualToken}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl transition-colors"
                  >
                    Confirm Check-In
                  </button>
                </div>
              )}
            </>
          )}

          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
              <p className="text-sm font-semibold text-slate-600">Verifying Farmer Token...</p>
            </div>
          )}

          {status === 'success' && resultData && (
            <div className="flex flex-col items-center justify-center py-6 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-1">Farmer Checked In</h3>
              <p className="text-sm text-slate-500 mb-6">Successfully added to the live queue.</p>
              
              <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Token</span>
                  <span className="text-lg font-black text-slate-900">{resultData.token || manualToken}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200 pt-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Queue Position</span>
                  <span className="text-base font-bold text-blue-600">{resultData.queuePosition || 'Calculating...'}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200 pt-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Estimated Wait</span>
                  <span className="text-base font-bold text-amber-600">{resultData.estimatedWaitMin || '--'} min</span>
                </div>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center justify-center py-6 animate-fade-in">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-10 h-10 text-rose-600" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">Check-in Failed</h3>
              
              {/* Do not expose raw backend messages if they are too technical. Just clean error message. */}
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm p-3 rounded-xl w-full text-center font-medium mb-6">
                {errorMessage.includes('not found') ? 'Token not found or invalid.' : 
                 errorMessage.includes('Already') ? 'This token is already checked in.' : 
                 errorMessage.includes('window') ? 'Farmer arrived outside their arrival window.' :
                 errorMessage}
              </div>

              <button
                onClick={() => setStatus('idle')}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
