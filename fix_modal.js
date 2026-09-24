const fs = require('fs');
let content = fs.readFileSync('client/src/components/SmartSlotBookingModal.jsx', 'utf8');

// Add onBookingSuccess prop
content = content.replace(
  /export default function SmartSlotBookingModal\(\{ isOpen, onClose \}\) \{/,
  'export default function SmartSlotBookingModal({ isOpen, onClose, onBookingSuccess }) {'
);

// Quantity state (defaults to 5.2 Quintal)
content = content.replace(
  /const \[quantity, setQuantity\] = useState\(520\);/,
  `const [quantity, setQuantity] = useState(5.2);
  const [selectedCentre, setSelectedCentre] = useState('PC-PUNE-01');`
);

// Confirm handler
const confirmHandler = `  const handleConfirmBooking = () => {
    setIsBooked(true);
    setTimeout(() => {
      setIsBooked(false);
      onClose();
      if (onBookingSuccess) onBookingSuccess({ crop: selectedCrop, quantity, centre: selectedCentre, slot: selectedSlot });
    }, 1200);
  };`;
content = content.replace(
  /  const handleConfirmBooking = \(\) => \{[\s\S]*?  \};/,
  confirmHandler
);

// Add Centre Selection and Quintal
const cropQuantityHtml = `        {/* Centre Selection */}
        <div className="mt-5">
          <label className="block text-xs font-semibold text-slate-700 mb-1">Choose a Centre</label>
          <select
            value={selectedCentre}
            onChange={(e) => setSelectedCentre(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
          >
            <option value="PC-PUNE-01">Pune District APMC Procurement Mandi</option>
            <option value="PC-NASHIK-02">Nashik Onion & Grain APMC</option>
          </select>
        </div>

        {/* Crop Selection */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t('crop')} Type</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
            >
              <option value="WHEAT">Wheat (गेहूँ / गहू) • MSP ₹2,275/q</option>
              <option value="SOYBEAN">Soybean (सोयाबीन) • MSP ₹4,600/q</option>
              <option value="CHANA">Gram / Chana (चना) • MSP ₹5,440/q</option>
              <option value="PADDY">Paddy (धान / भात) • MSP ₹2,183/q</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t('quantity')} (Quintal)</label>
            <input
              type="number"
              step="0.1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
              placeholder="e.g. 5.2"
            />
          </div>
        </div>`;
        
content = content.replace(
  /        \{\/\* Crop Selection \*\/\}[\s\S]*?        <\/div>/,
  cropQuantityHtml
);

fs.writeFileSync('client/src/components/SmartSlotBookingModal.jsx', content);
console.log('Fixed SmartSlotBookingModal.jsx');
