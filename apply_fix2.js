const fs = require('fs');

// 1. Update SmartTokenCard.jsx
let cardContent = fs.readFileSync('client/src/components/SmartTokenCard.jsx', 'utf8');

// Remove the slot booking button
cardContent = cardContent.replace(
  /<button[\s\S]*?onClick=\{onOpenSlotBooking\}[\s\S]*?<\/button>/,
  ''
);

// We need to improve the visual prominence of Smart Pass:
const oldDiv = 'className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 flex flex-col justify-between hover:shadow-md transition-shadow"';
const newDiv = 'className="bg-white rounded-3xl border-2 border-emerald-500/20 shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-6 sm:p-7 flex flex-col justify-between hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] transition-shadow relative overflow-hidden"';

cardContent = cardContent.replace(oldDiv, newDiv);

// Add decorative accent to the card
const decor = '{/* Top Details & Pass Header */}\n      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 to-agri-600"></div>';
cardContent = cardContent.replace('{/* Top Details & Pass Header */}', decor);

// Remove onOpenSlotBooking prop
cardContent = cardContent.replace('export default function SmartTokenCard({ onOpenSlotBooking }) {', 'export default function SmartTokenCard() {');

// Clean up empty action buttons div if it just contains one button now (or let the previous regex which just removed the slot booking button work, but wait it left an empty space. Actually let's just replace the whole action buttons block).
const actionButtonsStr = `<div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
        

        <button
          onClick={() => setShowQrModal(true)}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 px-3 rounded-xl transition-colors flex items-center space-x-1"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Pass</span>
        </button>
      </div>`;
const newActionButtonsStr = `<div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => setShowQrModal(true)}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center space-x-1"
        >
          <QrCode className="w-4 h-4" />
          <span>View Detailed Pass</span>
        </button>
      </div>`;

cardContent = cardContent.replace(/<div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">[\s\S]*?<\/div>/, newActionButtonsStr);

fs.writeFileSync('client/src/components/SmartTokenCard.jsx', cardContent);
console.log('Fixed SmartTokenCard.jsx');

// 2. Update FarmerHome.jsx
let homeContent = fs.readFileSync('client/src/pages/FarmerHome.jsx', 'utf8');

// The indentation is roughly 14 spaces for the <SmartTokenCard />
const searchHomeStr = '<SmartTokenCard onOpenSlotBooking={() => setIsSlotModalOpen(true)} />';
const replaceHomeStr = `<div className="mb-6">
                <h3 className="text-sm font-bold text-slate-800 mb-3 ml-2 uppercase tracking-wide">Book a Smart Slot</h3>
                <button
                  onClick={() => setIsSlotModalOpen(true)}
                  className="w-full bg-agri-700 hover:bg-agri-800 text-white font-bold text-sm py-4 px-6 rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Book a Smart Slot</span>
                </button>
              </div>
              
              <SmartTokenCard />`;

homeContent = homeContent.replace(searchHomeStr, replaceHomeStr);
fs.writeFileSync('client/src/pages/FarmerHome.jsx', homeContent);
console.log('Fixed FarmerHome.jsx');
