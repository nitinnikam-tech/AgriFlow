const fs = require('fs');
let content = fs.readFileSync('client/src/pages/FarmerHome.jsx', 'utf8');

// 1. Add AuthContext import
content = content.replace(
  /import \{ useLanguage \} from '\.\.\/context\/LanguageContext';/,
  `import { useLanguage } from '../context/LanguageContext';\nimport { useAuth } from '../context/AuthContext';`
);

// 2. Add useAuth and hasBooked state
content = content.replace(
  /  const \{ heroToken, notifications \} = useQueue\(\);/,
  `  const { heroToken, notifications } = useQueue();
  const { user } = useAuth();
  const [hasBooked, setHasBooked] = useState(sessionStorage.getItem('demo_slot_booked') === 'true');`
);

// 3. Update Greeting
const greetingHtml = `<h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              {t('helloFarmer')}, {user?.name || 'Ramesh Patil'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">{user?.village || 'Khed Shivapur'}, {user?.district || 'Pune'} District, {user?.state || 'Maharashtra'}</p>`;
content = content.replace(
  /<h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">[\s\S]*?<\/p>/,
  greetingHtml
);

// 4. Update the isCompleted / !hasBooked rendering logic and reorder Live Queue / Smart Pass
const mainContentRender = `{isCompleted ? (
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
        ) : !hasBooked ? (
          <section>
             <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-12 text-center flex flex-col items-center justify-center">
               <h2 className="text-3xl font-black text-slate-900 mb-3">Book a Smart Slot</h2>
               <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto">
                 Book a smart slot to sell your crop at the mandi. The AI will recommend the best time to avoid long queues and minimize waiting.
               </p>
               <button onClick={() => setIsSlotModalOpen(true)} className="bg-agri-700 hover:bg-agri-800 text-white font-bold py-4 px-10 rounded-2xl shadow-lg transition-transform hover:scale-105">
                 Book a Smart Slot Now
               </button>
             </div>
          </section>
        ) : (
          <>
            {/* 2. Farmer Smart Pass Generated */}
            <section>
              <SmartTokenCard onOpenSlotBooking={() => setIsSlotModalOpen(true)} />
            </section>

            {/* 3. Visually Dominant LIVE QUEUE RADAR */}
            <section>
              <LiveQueueRadar />
            </section>
          </>
        )}`;

content = content.replace(
  /\{isCompleted \? \([\s\S]*?<\/section>\n          <\/>\n        \)\}/,
  mainContentRender
);

// 5. Pass onBookingSuccess
content = content.replace(
  /<SmartSlotBookingModal\n        isOpen=\{isSlotModalOpen\}\n        onClose=\{\(\) => setIsSlotModalOpen\(false\)\}\n      \/>/,
  `<SmartSlotBookingModal
        isOpen={isSlotModalOpen}
        onClose={() => setIsSlotModalOpen(false)}
        onBookingSuccess={() => {
          setHasBooked(true);
          sessionStorage.setItem('demo_slot_booked', 'true');
        }}
      />`
);

fs.writeFileSync('client/src/pages/FarmerHome.jsx', content);
console.log('Fixed FarmerHome.jsx');
