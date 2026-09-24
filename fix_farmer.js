const fs = require('fs');

let content = fs.readFileSync('client/src/pages/FarmerHome.jsx', 'utf8');

const searchStr = '<SmartTokenCard onOpenSlotBooking={() => setIsSlotModalOpen(true)} />';
const replacementStr = `<div className="mb-6">
                <h3 className="text-sm font-bold text-slate-800 mb-3 ml-2 uppercase tracking-wide">Book a Smart Slot</h3>
                <button
                  onClick={() => setIsSlotModalOpen(true)}
                  className="w-full bg-agri-700 hover:bg-agri-800 text-white font-bold text-sm py-4 px-6 rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>{t('smartSlotBooking')}</span>
                </button>
              </div>
              <SmartTokenCard />`;

if (content.includes(searchStr)) {
  content = content.replace(searchStr, replacementStr);
  fs.writeFileSync('client/src/pages/FarmerHome.jsx', content);
  console.log('Fixed FarmerHome.jsx');
} else {
  console.log('Could not find search string');
}
